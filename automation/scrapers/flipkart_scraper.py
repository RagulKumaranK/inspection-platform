from .base_scraper import BaseScraper
from rich.console import Console

console = Console()

class FlipkartScraper(BaseScraper):
    async def extract_links(self):
        """
        Flipkart specific link extraction.
        """
        # Wait for product container to ensure page load
        try:
            await self.page.wait_for_selector("div._1YokD2", timeout=5000) # Common container
        except:
            pass

        # Added more selectors for different layouts (grid, list, etc.)
        links = await self.page.evaluate("""
            () => {
                const selectors = [
                    'a._1fQZEK',       // Standard row
                    'a._2rpwqI',       // Grid item
                    'a.IRpwTa',        // Grid item title
                    'a._2UzuFa',       // Another grid variant
                    'a.s1Q9rs',        // Small grid item
                    'a.WKTcLC',        // Another variant
                    'div._4ddWXP a',   // Product card anchor
                    'div._1xHGtK a',   // New grid layout
                    'a[href*="/p/"]',  // Generic product pattern
                    'a[href*="/itm"]'  // Generic item pattern
                ];
                
                // Collect all matching elements
                const elements = document.querySelectorAll(selectors.join(','));
                
                // Map to href and filter for valid Flipkart product URLs
                return Array.from(elements)
                    .map(a => a.href)
                    .filter(href => href.includes('/p/') || href.includes('/itm'));
            }
        """)
        console.print(f"[dim]Found {len(links)} raw links on page.[/dim]")
        
        if len(links) == 0:
            # Debug: Check if we are blocked
            content = await self.page.content()
            if "Login" in content or "Enter the characters" in content:
                console.print("[bold red]Warning: Possible CAPTCHA or Login wall detected![/bold red]")
                
        return links

    async def extract_subcategories(self):
        """
        Extracts sub-category URLs from Flipkart.
        """
        console.print("[cyan]Looking for sub-categories...[/cyan]")
        subcats = await self.page.evaluate("""
            () => {
                const selectors = [
                    'a._2I9KP_',       // Breadcrumbs/Category links
                    'div._3sR8Gw a',   // Sidebar links
                    'a._1jFQhD',       // Pills
                    'a._3QN6WI',       // "View All" type links
                    'a[href*="/pr?"]'  // Generic product listing links
                ];
                return Array.from(document.querySelectorAll(selectors.join(',')))
                    .map(a => a.href)
                    .filter(href => href.includes('flipkart.com'));
            }
        """)
        return list(set(subcats))
        
        # 1. Try Standard "NEXT" buttons
        next_selectors = [
            "a._1LKTO3 span:has-text('Next')",
            "a._1LKTO3:has-text('Next')",
            "span:has-text('Next')",
            "text=Next",
            "text=NEXT",
            "a[class*='_1LKTO3']" # Generic class match
        ]
        
        for selector in next_selectors:
            try:
                if await self.page.is_visible(selector):
                    # Check if it's "Previous"
                    text = await self.page.inner_text(selector)
                    if "Previous" in text:
                        continue
                        
                    console.print(f"[dim]Found 'Next' button with selector: {selector}[/dim]")
                    await self.page.locator(selector).first.scroll_into_view_if_needed()
                    await self.page.click(selector, timeout=2000)
                    await self.page.wait_for_load_state("domcontentloaded", timeout=10000)
                    return True
            except Exception as e:
                # console.print(f"[dim]Failed click on {selector}: {e}[/dim]")
                continue

        # 2. Try Numbered Pagination
        try:
            active_page_selector = ".yFHi8N a.ge-49M._2KFBh8, ._2MImiq span" 
            # ._2MImiq span often contains "Page 1 of 10"
            
            # Try to find current page number from the active button
            current_page = None
            if await self.page.is_visible(".ge-49M._2KFBh8"):
                current_page = int(await self.page.inner_text(".ge-49M._2KFBh8"))
            
            if current_page:
                next_page = current_page + 1
                console.print(f"[dim]Current page is {current_page}. Looking for page {next_page}...[/dim]")
                
                next_page_selector = f"a.ge-49M:text-is('{next_page}')"
                
                if await self.page.is_visible(next_page_selector):
                    console.print(f"[cyan]Clicking page number {next_page}...[/cyan]")
                    await self.page.locator(next_page_selector).first.scroll_into_view_if_needed()
                    await self.page.click(next_page_selector, timeout=2000)
                    await self.page.wait_for_load_state("domcontentloaded", timeout=10000)
                    return True
        except Exception as e:
            console.print(f"[dim]Numbered pagination failed: {e}[/dim]")
            
        console.print("[red]Pagination failed. No 'Next' button or next page number found.[/red]")
        return False
