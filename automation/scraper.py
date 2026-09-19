import asyncio
import random
from datetime import datetime
from playwright.async_api import async_playwright
from fake_useragent import UserAgent
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn
from utils import is_valid_product_url, get_sitename, normalize_url, HistoryManager, optimize_url_for_newest

console = Console()

class ECommerceScraper:
    def __init__(self):
        self.ua = UserAgent()
        self.browser = None
        self.context = None
        self.page = None
        self.collected_links = set()
        self.history = HistoryManager()

    async def start_browser(self):
        """Starts the Playwright browser with a random user agent."""
        p = await async_playwright().start()
        # Launch headless=True for stability in this environment
        # Disable HTTP/2 to avoid protocol errors on some sites (like Myntra)
        self.browser = await p.chromium.launch(
            headless=True,
            args=["--disable-http2"]
        )
        
        user_agent = self.ua.random
        self.context = await self.browser.new_context(user_agent=user_agent)
        self.page = await self.context.new_page()
        
        # Anti-detection: Disable webdriver flags
        await self.page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
        """)

    async def stop_browser(self):
        """Stops the browser."""
        if self.browser:
            await self.browser.close()
            # Small delay to allow subprocess cleanup on Windows
            await asyncio.sleep(1)

    async def scrape(self, url: str, target_count: int):
        """
        Main entry point. Determines if URL is a homepage or category page.
        """
        if not self.browser:
            await self.start_browser()

        sitename = get_sitename(url)
        
        # Simple heuristic: if path is just "/" or empty, it's likely a homepage
        # Or if it doesn't look like a search/category page
        is_homepage = url.rstrip('/').endswith(('.in', '.com', '.org', '.net')) or len(url.split('/')) < 4
        
        if is_homepage:
            console.print(f"[bold blue]Homepage detected: {url}. Looking for categories...[/bold blue]")
            return await self.crawl_categories(url, target_count)
        else:
            return await self.scrape_category(url, target_count)

    async def crawl_categories(self, url: str, target_count: int):
        """
        Finds category links from homepage and scrapes them.
        """
        try:
            await self.page.goto(url, timeout=60000, wait_until="domcontentloaded")
            await self.page.wait_for_load_state("domcontentloaded")
        except Exception as e:
            console.print(f"[red]Error loading homepage: {e}[/red]")
            return []

        # Extract potential category links
        # Heuristic: Links containing '/b/', '/s?', or inside nav menus
        category_links = await self.page.evaluate("""
            () => {
                const links = Array.from(document.querySelectorAll('a'));
                return links
                    .map(a => a.href)
                    .filter(href => href.includes('/b/') || href.includes('/s?') || href.includes('category') || href.includes('collection'))
                    .filter(href => !href.includes('customer-preferences') && !href.includes('login') && !href.includes('cart'));
            }
        """)
        
        # Deduplicate and limit
        category_links = list(set(category_links))[:10] # Try top 10 categories
        console.print(f"[green]Found {len(category_links)} potential categories.[/green]")
        
        all_links = []
        for cat_url in category_links:
            if len(self.collected_links) >= target_count:
                break
                
            console.print(f"[cyan]Navigating to category: {cat_url}[/cyan]")
            # Reuse scrape_category logic
            # We don't close browser between categories
            await self.scrape_category(cat_url, target_count)
            
        return list(self.collected_links)

    async def scrape_category(self, url: str, target_count: int):
        """
        Scrapes product URLs from a specific category page.
        """
        # Ensure browser is open
        if not self.browser or not self.page:
            await self.start_browser()

        sitename = get_sitename(url)
        console.print(f"[green]Starting scrape on {sitename}...[/green]")
        
        # Load Master List for Resume Capability
        from utils import load_master_list, save_product
        self.seen_urls = load_master_list(sitename)
        self.collected_links = set() # Keep track of what we found in THIS run for reporting
        
        console.print(f"[cyan]Loaded {len(self.seen_urls)} existing products. Resuming...[/cyan]")
        
        try:
            if not self.page: # Double check
                await self.start_browser()
                
            await self.page.goto(url, timeout=60000, wait_until="domcontentloaded")
            # Use domcontentloaded as networkidle can be flaky on heavy sites
            # await self.page.wait_for_load_state("domcontentloaded")
        except Exception as e:
            console.print(f"[red]Error loading page: {e}[/red]")
            # Try to restart browser and retry once
            try:
                await self.stop_browser()
                await self.start_browser()
                await self.page.goto(url, timeout=60000, wait_until="domcontentloaded")
            except Exception as e2:
                 console.print(f"[red]Retry failed: {e2}[/red]")
                 return list(self.collected_links)

        base_domain = sitename # Simple domain check
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            transient=True,
        ) as progress:
            task = progress.add_task(f"Collecting links... ({len(self.collected_links)}/{target_count if target_count > 0 else 'Infinite'})", total=target_count)
            
            no_new_links_count = 0
            consecutive_empty_pages = 0
            max_retries = 5

            while True:
                # Infinite loop if target_count is 0 or very high
                if target_count > 0 and len(self.collected_links) >= target_count:
                    break

                # Extract links from current view
                # Myntra specific selector for better accuracy
                if "myntra.com" in sitename:
                    selector_script = """
                        () => {
                            return Array.from(document.querySelectorAll('li.product-base a')).map(a => a.href);
                        }
                    """
                else:
                    selector_script = """
                        () => {
                            return Array.from(document.querySelectorAll('a')).map(a => a.href);
                        }
                    """

                try:
                    links = await self.page.evaluate(selector_script)
                except Exception as e:
                    console.print(f"[red]Error extracting links: {e}[/red]")
                    links = []
                
                new_links_found_on_page = 0
                valid_links_on_page = 0
                duplicates_on_page = 0

                for link in links:
                    if is_valid_product_url(link, sitename):
                        valid_links_on_page += 1
                        normalized_link = normalize_url(link)
                        
                        # Check against Master List (Resume Logic)
                        if normalized_link not in self.seen_urls:
                            self.seen_urls.add(normalized_link)
                            self.collected_links.add(normalized_link)
                            
                            # Save immediately to Master File
                            save_product(normalized_link, sitename, mode="scrape")
                            
                            new_links_found_on_page += 1
                        else:
                            duplicates_on_page += 1
                
                # Intelligent Skip: If page is 100% duplicates, skip immediately
                if valid_links_on_page > 5: # Threshold to ensure we have enough data
                    if duplicates_on_page == valid_links_on_page:
                        console.print(f"[yellow]Page fully scraped ({valid_links_on_page} duplicates). Skipping to next...[/yellow]")
                        if await self.try_pagination():
                            console.print("[green]Skipped to next page.[/green]")
                            consecutive_empty_pages += 1
                            
                            # Graceful Exit if too many empty pages
                            if consecutive_empty_pages >= 3:
                                console.print("[bold red]All available products already scraped (3 consecutive empty pages). Stopping.[/bold red]")
                                break
                                
                            await asyncio.sleep(2)
                            continue
                        else:
                            console.print("[yellow]Cannot skip page (no next button).[/yellow]")
                            # If we can't skip and it's full of duplicates, we might be done
                            if consecutive_empty_pages >= 1:
                                console.print("[bold red]Reached end of available products.[/bold red]")
                                break
                    else:
                        consecutive_empty_pages = 0 # Reset if we found something new or mixed
                
                progress.update(task, description=f"Collecting links... ({len(self.collected_links)}/{target_count if target_count > 0 else 'Infinite'})")
                
                if target_count > 0 and len(self.collected_links) >= target_count:
                    break

                # Scroll down logic
                try:
                    previous_height = await self.page.evaluate("document.body.scrollHeight")
                    await self.page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                    
                    # Random delay
                    delay = random.uniform(1.5, 3.5)
                    await asyncio.sleep(delay)
                    
                    new_height = await self.page.evaluate("document.body.scrollHeight")
                    
                    if new_height == previous_height:
                        no_new_links_count += 1
                        
                        # If scrolling didn't help, try pagination
                        if no_new_links_count >= 2:
                            console.print("[yellow]Scrolling stopped. Checking for 'Next' button...[/yellow]")
                            if await self.try_pagination():
                                console.print("[green]Clicked 'Next' page.[/green]")
                                no_new_links_count = 0
                                # Wait for new content
                                await asyncio.sleep(3)
                            else:
                                if no_new_links_count >= max_retries:
                                    if target_count > 0 and len(self.collected_links) < target_count:
                                        console.print(f"[bold red]Reached end of category. Only {len(self.collected_links)} of {target_count} products available.[/bold red]")
                                    else:
                                        console.print("[yellow]Reached end of page or cannot scroll further.[/yellow]")
                                    break
                    else:
                        no_new_links_count = 0
                except Exception as e:
                     console.print(f"[red]Error during scrolling: {e}[/red]")
                     break
        
        return list(self.collected_links)

    async def try_pagination(self):
        """
        Attempts to find and click a 'Next' button for pagination.
        """
        # Common selectors for "Next" buttons on major e-commerce sites
        next_selectors = [
            "a._1LKTO3",                     # Flipkart (common class)
            "a._1LKTO3 span",                # Flipkart inside span
            "text=NEXT",                     # Flipkart uppercase
            "a:has-text('NEXT')",            # Flipkart uppercase anchor
            "a.s-pagination-next",           # Amazon
            ".s-pagination-next",            # Amazon alternative
            "a[aria-label='Next']",          # Generic
            "a[aria-label='Next Page']",     # Generic
            "text=Next",                     # Generic text match
            "text=Next Page",                # Generic text match
            ".next-page",                    # Generic class
            ".pagination-next",              # Generic class
            "li.pagination-next a",          # Myntra (sometimes)
            "button[aria-label='Next']",     # JioMart/Generic
            "a:has-text('Next')",            # Generic anchor with text
        ]

        for selector in next_selectors:
            try:
                # Check if visible and enabled
                if await self.page.is_visible(selector):
                    # Ensure it's not disabled (common in some UIs)
                    is_disabled = await self.page.evaluate(f"""
                        (selector) => {{
                            const el = document.querySelector(selector);
                            return el.hasAttribute('disabled') || el.classList.contains('disabled');
                        }}
                    """, selector)
                    
                    if not is_disabled:
                        # Scroll into view to ensure clickability
                        await self.page.locator(selector).first.scroll_into_view_if_needed()
                        await self.page.click(selector, timeout=2000)
                        await self.page.wait_for_load_state("domcontentloaded", timeout=10000)
                        return True
            except:
                continue
        
        return False

    async def monitor(self, url: str):
        """
        Monitors a URL for new products in real-time.
        """
        if not self.browser:
            await self.start_browser()

        # Optimize URL for new releases
        url = optimize_url_for_newest(url)
        sitename = get_sitename(url)
        console.print(f"[bold green]Starting monitor on {sitename}... Press Ctrl+C to stop.[/bold green]")
        console.print(f"[dim]Optimized URL: {url}[/dim]")
        
        # Load Master List
        from utils import load_master_list, save_product
        self.seen_urls = load_master_list(sitename)
        console.print(f"[cyan]Loaded {len(self.seen_urls)} existing products.[/cyan]")
        
        try:
            while True:
                console.print(f"[cyan]Checking for new products at {datetime.now().strftime('%H:%M:%S')}...[/cyan]")
                
                try:
                    await self.page.goto(url, timeout=60000, wait_until="domcontentloaded")
                    # await self.page.wait_for_load_state("domcontentloaded")
                    
                    # Scroll a bit to load lazy content
                    for _ in range(3):
                        await self.page.evaluate("window.scrollBy(0, 1000)")
                        await asyncio.sleep(1)
                        
                except Exception as e:
                    console.print(f"[red]Error refreshing page: {e}[/red]")
                    await asyncio.sleep(10)
                    continue

                # Extract links
                links = await self.page.evaluate("""
                    () => {
                        return Array.from(document.querySelectorAll('a')).map(a => a.href);
                    }
                """)
                
                new_items_found = 0
                
                for link in links:
                    if is_valid_product_url(link, sitename):
                        normalized_link = normalize_url(link)
                        
                        # Check against Master List
                        if normalized_link not in self.seen_urls:
                            console.print(f"[bold green]New item detected: {normalized_link}[/bold green]")
                            self.seen_urls.add(normalized_link)
                            
                            # Save immediately to Master AND New Products file
                            save_product(normalized_link, sitename, mode="monitor")
                            new_items_found += 1
                
                if new_items_found == 0:
                    console.print("[dim]No new items found.[/dim]")
                
                # Wait before next check
                delay = random.uniform(30, 60) # Random delay between 30-60s
                console.print(f"[dim]Waiting {int(delay)}s before next check...[/dim]")
                await asyncio.sleep(delay)
                
        except asyncio.CancelledError:
            console.print("[yellow]Monitoring stopped.[/yellow]")
