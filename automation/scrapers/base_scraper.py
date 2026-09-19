import asyncio
import random
from datetime import datetime
from playwright.async_api import async_playwright
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn
from fake_useragent import UserAgent
from utils import get_sitename, normalize_url, is_valid_product_url, load_master_list, save_product, optimize_url_for_newest, score_url

console = Console()

class BaseScraper:
    def __init__(self):
        self.browser = None
        self.page = None
        self.playwright = None
        self.seen_urls = set()
        self.collected_links = set()

    async def start_browser(self):
        """Starts the Playwright browser instance."""
        if self.browser:
            return

        self.playwright = await async_playwright().start()
        # Headless mode enabled as per user request
        self.browser = await self.playwright.chromium.launch(
            headless=False,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-infobars",
                "--window-position=-10000,-10000",
                "--ignore-certificate-errors",
                "--ignore-ssl-errors",
                "--disable-accelerated-2d-canvas",
                "--disable-gpu",
            ]
        )
        
        context = await self.browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            viewport={"width": 1920, "height": 1080},
            locale="en-US",
            timezone_id="Asia/Kolkata"
        )
        
        # Stealth scripts
        await context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        await context.add_init_script("window.navigator.chrome = { runtime: {} };")
        await context.add_init_script("Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });")
        await context.add_init_script("Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });")
        
        self.page = await context.new_page()

    async def stop_browser(self):
        """Stops the browser instance."""
        if self.browser:
            await self.browser.close()
            self.browser = None
        if self.playwright:
            await self.playwright.stop()
            self.playwright = None

    async def prepare_session(self, url: str):
        """
        Hook to set up session (cookies, storage) before navigation.
        Override in subclasses.
        """
        pass

    async def scrape_category(self, start_url: str, target_count: int = 50, progress_callback=None, save_mode: str = "scrape") -> list:
        """
        Scrapes product URLs from a specific category page.
        Uses a BFS queue to crawl sub-categories if needed.
        """
        # Ensure browser is open
        if not self.browser or not self.page:
            await self.start_browser()

        # Load Master List for Resume Capability
        sitename = get_sitename(start_url)
        self.seen_urls = load_master_list(sitename)
        self.collected_links = set() 
        
        console.print(f"[cyan]Loaded {len(self.seen_urls)} existing products. Resuming...[/cyan]")

        # Optimize URL for "Newest"
        start_url = optimize_url_for_newest(start_url)

        url_queue = [start_url]
        visited_urls = set()

        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            transient=True,
        ) as progress:
            task = progress.add_task(f"Collecting links... ({len(self.collected_links)}/{target_count if target_count > 0 else 'Infinite'})", total=target_count if target_count > 0 else None)
            
            while url_queue:
                # Check if we reached the target
                if target_count > 0 and len(self.collected_links) >= target_count:
                    break

                current_url = url_queue.pop(0)
                if current_url in visited_urls:
                    continue
                visited_urls.add(current_url)

                console.print(f"[green]Scraping category: {current_url}[/green]")
                
                try:
                    # Prepare session (inject cookies etc.)
                    await self.prepare_session(current_url)
                    
                    await self.page.goto(current_url, timeout=60000, wait_until="domcontentloaded")
                except Exception as e:
                    console.print(f"[red]Error loading page {current_url}: {e}[/red]")
                    continue

                consecutive_empty_pages = 0
                
                # Inner Loop: Pagination for current category
                while True:
                    if target_count > 0 and len(self.collected_links) >= target_count:
                        break

                    links = await self.extract_links()
                    
                    # Sort links by FMCG score (Packaged items first)
                    links = sorted(links, key=score_url, reverse=True)
                    
                    valid_links_on_page = 0
                    duplicates_on_page = 0

                    for link in links:
                        if is_valid_product_url(link, sitename):
                            valid_links_on_page += 1
                            normalized_link = normalize_url(link)
                            
                            if normalized_link not in self.seen_urls:
                                self.seen_urls.add(normalized_link)
                                self.collected_links.add(normalized_link)
                                save_product(normalized_link, sitename, mode=save_mode)
                                
                                # Call progress callback if provided
                                if progress_callback:
                                    try:
                                        await progress_callback({
                                            "type": "progress",
                                            "new_link": normalized_link,
                                            "session_count": len(self.collected_links),
                                            "target_count": target_count
                                        })
                                    except Exception as e:
                                        console.print(f"[red]Callback error: {e}[/red]")
                                
                                # Check if we reached the target immediately after adding
                                if target_count > 0 and len(self.collected_links) >= target_count:
                                    break
                            else:
                                duplicates_on_page += 1
                    
                    if target_count > 0 and len(self.collected_links) >= target_count:
                        break

                    progress.update(task, description=f"Collecting links... ({len(self.collected_links)}/{target_count if target_count > 0 else 'Infinite'})")

                    # Intelligent Skip & Pagination Logic
                    should_paginate = True
                    
                    # If NO products found, it might be a category list page.
                    # Skip pagination and look for sub-categories immediately.
                    if valid_links_on_page == 0:
                        console.print("[yellow]No products found on this page. Checking for sub-categories...[/yellow]")
                        subcats = await self.extract_subcategories()
                        new_subcats = [s for s in subcats if s not in visited_urls and s not in url_queue]
                        
                        if new_subcats:
                            console.print(f"[bold green]Found {len(new_subcats)} sub-categories. Adding to queue.[/bold green]")
                            url_queue.extend(new_subcats)
                        else:
                            console.print("[dim]No sub-categories found either.[/dim]")
                        
                        # Break inner loop to move to next URL in queue (which might be one of the subcats we just found)
                        break

                    if valid_links_on_page > 5:
                        if duplicates_on_page == valid_links_on_page:
                            console.print(f"[yellow]Page fully scraped ({valid_links_on_page} duplicates). Skipping...[/yellow]")
                            consecutive_empty_pages += 1
                        else:
                            consecutive_empty_pages = 0
                    
                    if consecutive_empty_pages >= 3:
                        console.print("[bold red]Category exhausted (3 empty pages).[/bold red]")
                        should_paginate = False

                    if should_paginate:
                        # Scroll first
                        try:
                            await self.page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                            await asyncio.sleep(random.uniform(1.5, 3.5))
                        except: pass

                        if await self.try_pagination():
                            console.print("[green]Next page...[/green]")
                            await asyncio.sleep(2)
                            continue
                        else:
                            console.print("[yellow]No next page.[/yellow]")
                            should_paginate = False
                    
                    # If we stopped pagination (and didn't break earlier due to 0 links), check for subcategories
                    if not should_paginate:
                        if target_count > 0 and len(self.collected_links) < target_count:
                            console.print("[cyan]Target not reached. Looking for sub-categories...[/cyan]")
                            subcats = await self.extract_subcategories()
                            new_subcats = [s for s in subcats if s not in visited_urls and s not in url_queue]
                            if new_subcats:
                                console.print(f"[bold green]Found {len(new_subcats)} new sub-categories. Adding to queue.[/bold green]")
                                url_queue.extend(new_subcats)
                            else:
                                console.print("[dim]No new sub-categories found.[/dim]")
                        break # Break inner loop to go to next URL in queue

        return list(self.collected_links)

    async def extract_subcategories(self):
        """
        Extracts sub-category URLs from the current page.
        Override in subclasses.
        """
        return []

    async def monitor(self, url: str, target_count: int = 0, duration_minutes: int = 0):
        """
        Monitors a SPECIFIC URL for new products in real-time.
        Strictly adheres to the provided URL and does NOT crawl sub-categories.
        Stops if target_count (new items) is reached OR if duration_minutes is exceeded.
        """
        if not self.browser:
            await self.start_browser()

        sitename = get_sitename(url)
        console.print(f"[bold green]Starting monitor on {sitename}... Press Ctrl+C to stop.[/bold green]")
        console.print(f"[yellow]Monitoring specific URL: {url}[/yellow]")
        
        stop_conditions = []
        if target_count > 0:
            stop_conditions.append(f"Target: {target_count} new items")
        if duration_minutes > 0:
            stop_conditions.append(f"Duration: {duration_minutes} minutes")
            
        if stop_conditions:
            console.print(f"[yellow]Stop Conditions: {', '.join(stop_conditions)}[/yellow]")
        
        # Load Master List (scrapedProducts.txt)
        self.seen_urls = load_master_list(sitename)
        console.print(f"[cyan]Loaded {len(self.seen_urls)} existing products from Master File.[/cyan]")
        
        total_new_items_session = 0
        start_time = datetime.now()

        try:
            while True:
                # Check Duration Limit
                if duration_minutes > 0:
                    elapsed = (datetime.now() - start_time).total_seconds() / 60
                    if elapsed >= duration_minutes:
                        console.print(f"[bold green]Duration of {duration_minutes} minutes reached. Stopping monitor.[/bold green]")
                        break

                # Check limit at start of loop
                if target_count > 0 and total_new_items_session >= target_count:
                    console.print(f"[bold green]Target of {target_count} new items reached. Stopping monitor.[/bold green]")
                    break

                console.print(f"[cyan]Checking for new products at {datetime.now().strftime('%H:%M:%S')}...[/cyan]")
                
                try:
                    await self.page.goto(url, timeout=60000, wait_until="domcontentloaded")
                    # Scroll a bit to trigger lazy loading
                    for _ in range(3):
                        await self.page.evaluate("window.scrollBy(0, 1000)")
                        await asyncio.sleep(1)
                except Exception as e:
                    console.print(f"[red]Error refreshing page: {e}[/red]")
                    await asyncio.sleep(10)
                    continue

                links = await self.extract_links()
                
                # Sort links by FMCG score (Packaged items first)
                links = sorted(links, key=score_url, reverse=True)

                new_items_found = 0
                
                for link in links:
                    if is_valid_product_url(link, sitename):
                        normalized_link = normalize_url(link)
                        
                        if normalized_link not in self.seen_urls:
                            console.print(f"[bold green]New item detected: {normalized_link}[/bold green]")
                            self.seen_urls.add(normalized_link)
                            
                            # Save to BOTH Master and Monitor files
                            save_product(normalized_link, sitename, mode="monitor")
                            
                            new_items_found += 1
                            total_new_items_session += 1
                            
                            if target_count > 0 and total_new_items_session >= target_count:
                                break
                
                if new_items_found == 0:
                    console.print("[dim]No new items found.[/dim]")
                else:
                    console.print(f"[bold green]Found {new_items_found} new items! (Total Session: {total_new_items_session})[/bold green]")
                
                if target_count > 0 and total_new_items_session >= target_count:
                    console.print(f"[bold green]Target of {target_count} new items reached. Stopping monitor.[/bold green]")
                    break

                # Check Duration Limit again before sleep
                if duration_minutes > 0:
                    elapsed = (datetime.now() - start_time).total_seconds() / 60
                    if elapsed >= duration_minutes:
                        console.print(f"[bold green]Duration of {duration_minutes} minutes reached. Stopping monitor.[/bold green]")
                        break

                delay = random.uniform(30, 60)
                console.print(f"[dim]Waiting {int(delay)}s before next check...[/dim]")
                await asyncio.sleep(delay)
                
        except asyncio.CancelledError:
            console.print("[yellow]Monitoring stopped.[/yellow]")

    async def extract_links(self):
        """
        Extracts links from the current page.
        Override this in subclasses for site-specific logic.
        """
        return await self.page.evaluate("""
            () => {
                return Array.from(document.querySelectorAll('a')).map(a => a.href);
            }
        """)

    async def try_pagination(self):
        """
        Attempts to find and click a 'Next' button.
        Override this in subclasses for site-specific logic.
        """
        # Default generic implementation
        next_selectors = [
            "a[aria-label='Next']",
            "a[aria-label='Next Page']",
            "text=Next",
            "text=Next Page",
            ".next-page",
            ".pagination-next",
            "button[aria-label='Next']",
        ]

        for selector in next_selectors:
            try:
                if await self.page.is_visible(selector):
                    await self.page.click(selector, timeout=2000)
                    await self.page.wait_for_load_state("domcontentloaded", timeout=10000)
                    return True
            except:
                continue
        return False
