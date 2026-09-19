from .base_scraper import BaseScraper
from rich.console import Console
import asyncio
import random

console = Console()

class JioMartScraper(BaseScraper):
    async def extract_links(self):
        """
        JioMart specific link extraction.
        """
    async def prepare_session(self, url: str):
        """
        Handles JioMart location/pincode setup interactively.
        """
        console.print("[cyan]Checking for JioMart pincode popup...[/cyan]")
        
        # Wait for page to be interactive
        try:
            await self.page.wait_for_load_state("domcontentloaded", timeout=10000)
        except: pass

        # Check if we need to set pincode
        # Try to find the pincode button/input
        pincode = "400001"
        
        try:
            # Check if location is already set (optional optimization)
            # But user requested to ensure it's set, so we'll look for the trigger
            
            # Selectors for the delivery location button/icon in header
            trigger_selectors = [
                "#nav_link_delivery_location",
                ".delivery-location",
                "button.delivery-code",
                "div.delivery-text"
            ]
            
            trigger_found = False
            for selector in trigger_selectors:
                if await self.page.is_visible(selector):
                    console.print(f"[dim]Found delivery trigger: {selector}[/dim]")
                    await self.page.click(selector)
                    trigger_found = True
                    await asyncio.sleep(1) # Wait for popup
                    break
            
            # Now look for the input field in the popup
            input_selectors = [
                "input#rel_pincode",
                "input[placeholder*='Enter Pincode']",
                "input[type='tel']",
                "input.pincode-input"
            ]
            
            input_el = None
            for selector in input_selectors:
                if await self.page.is_visible(selector):
                    input_el = selector
                    break
            
            if input_el:
                console.print(f"[cyan]Entering pincode {pincode} into {input_el}...[/cyan]")
                await self.page.fill(input_el, pincode)
                await asyncio.sleep(0.5)
                
                # Click Apply
                apply_selectors = [
                    "button.btn-apply",
                    "button:has-text('Apply')",
                    "div.apply-btn",
                    "text=Apply"
                ]
                
                for btn in apply_selectors:
                    if await self.page.is_visible(btn):
                        await self.page.click(btn)
                        console.print("[green]Clicked Apply button.[/green]")
                        await self.page.wait_for_load_state("networkidle", timeout=5000)
                        break
            else:
                console.print("[yellow]Pincode input not found. Location might already be set or popup failed.[/yellow]")

        except Exception as e:
            console.print(f"[red]Error setting pincode: {e}[/red]")
            
        # Fallback: Inject cookies just in case UI interaction failed but we can still force it
        # This ensures robustness as requested
        domain = ".jiomart.com"
        cookies = [
            {"name": "x-pincode", "value": pincode, "domain": domain, "path": "/"},
            {"name": "nms_mgo_pincode", "value": pincode, "domain": domain, "path": "/"}
        ]
        await self.page.context.add_cookies(cookies)


    async def extract_links(self):
        """
        JioMart specific link extraction.
        """
        # Wait a bit for grid to load
        try:
            await self.page.wait_for_selector("div.plp-card-details-container, div.ais-InfiniteHits, ul.card-list", timeout=10000)
        except:
            pass

        # Scroll down to ensure lazy-loaded items appear
        await self.page.evaluate("window.scrollBy(0, 500)")
        await asyncio.sleep(1)

        # DEBUG: Print title
        title = await self.page.title()
        console.print(f"[dim]Page Title: {title}[/dim]")

        # Broad extraction: Get ALL links and filter in Python
        all_hrefs = await self.page.evaluate("""
            () => {
                return Array.from(document.querySelectorAll('a')).map(a => a.href);
            }
        """)
        
        links = [href for href in all_hrefs if '/p/' in href and 'jiomart.com' in href]
        
        # Retry logic: If 0 links, try reloading once
        if len(links) == 0:
            console.print("[yellow]0 links found. Reloading page once...[/yellow]")
            await self.page.reload()
            await asyncio.sleep(5)
            
            # Re-run broad extraction
            all_hrefs = await self.page.evaluate("""
                () => {
                    return Array.from(document.querySelectorAll('a')).map(a => a.href);
                }
            """)
            links = [href for href in all_hrefs if '/p/' in href and 'jiomart.com' in href]

        if len(links) == 0:
            console.print("[red]Still 0 links. Saving debug HTML...[/red]")
            try:
                content = await self.page.content()
                with open("jiomart_debug.html", "w", encoding="utf-8") as f:
                    f.write(content)
                console.print("[red]Saved 'jiomart_debug.html'. Please check it.[/red]")
            except: pass

        console.print(f"[dim]Found {len(links)} product links (filtered from {len(all_hrefs)} total links).[/dim]")
        return links
        await self.page.evaluate("window.scrollBy(0, 500)")
        await asyncio.sleep(1)

        # DEBUG: Print title
        title = await self.page.title()
        console.print(f"[dim]Page Title: {title}[/dim]")

        # Broad extraction: Get ALL links and filter in Python
        # This avoids issues with specific container classes changing
        all_hrefs = await self.page.evaluate("""
            () => {
                return Array.from(document.querySelectorAll('a')).map(a => a.href);
            }
        """)
        
        links = [href for href in all_hrefs if '/p/' in href and 'jiomart.com' in href]
        
        # Retry logic: If 0 links, try reloading once
        if len(links) == 0:
            console.print("[yellow]0 links found. Reloading page once...[/yellow]")
            await self.page.reload()
            await asyncio.sleep(5)
            
            # Try to close popup again after reload
            try:
                await self.page.keyboard.press("Escape")
            except: pass

            # Re-run broad extraction
            all_hrefs = await self.page.evaluate("""
                () => {
                    return Array.from(document.querySelectorAll('a')).map(a => a.href);
                }
            """)
            links = [href for href in all_hrefs if '/p/' in href and 'jiomart.com' in href]

        if len(links) == 0:
            console.print("[red]Still 0 links. Saving debug HTML...[/red]")
            try:
                content = await self.page.content()
                with open("jiomart_debug.html", "w", encoding="utf-8") as f:
                    f.write(content)
                console.print("[red]Saved 'jiomart_debug.html'. Please check it.[/red]")
            except: pass

        console.print(f"[dim]Found {len(links)} product links (filtered from {len(all_hrefs)} total links).[/dim]")
        return links

    async def try_pagination(self):
        """
        JioMart specific pagination (Infinite Scroll).
        """
        console.print("[cyan]Checking for infinite scroll...[/cyan]")
        
        try:
            # Get current height
            previous_height = await self.page.evaluate("document.body.scrollHeight")
            
            # Scroll to bottom
            await self.page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            
            # Wait for potential load
            console.print("[dim]Waiting for content to load...[/dim]")
            await asyncio.sleep(4)
            
            # Check new height
            new_height = await self.page.evaluate("document.body.scrollHeight")
            
            if new_height > previous_height:
                console.print(f"[green]Infinite scroll successful (Height: {previous_height} -> {new_height}).[/green]")
                return True
            
            # If height didn't change, try one more aggressive scroll/wait
            console.print("[yellow]No height change. Retrying scroll...[/yellow]")
            await self.page.evaluate("window.scrollTo(0, document.body.scrollHeight - 100)")
            await asyncio.sleep(1)
            await self.page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await asyncio.sleep(4)
            
            new_height_2 = await self.page.evaluate("document.body.scrollHeight")
            if new_height_2 > previous_height:
                console.print(f"[green]Infinite scroll successful on retry (Height: {previous_height} -> {new_height_2}).[/green]")
                return True
                
            console.print("[red]Infinite scroll exhausted. No new content loaded.[/red]")
            return False
            
        except Exception as e:
            console.print(f"[red]Error during infinite scroll: {e}[/red]")
            return False

    async def extract_subcategories(self):
        """
        Extracts sub-category URLs from JioMart.
        """
        console.print("[cyan]Looking for sub-categories...[/cyan]")
        subcats = await self.page.evaluate("""
            () => {
                const selectors = [
                    'div.filter-list a',       // Sidebar filters
                    'ul.breadcrumb-list a',    // Breadcrumbs
                    'div.category-list a',     // Category pills
                    'a[href*="/c/"]',          // Generic category links
                    'div.all-category-list a',  // All Category page links
                    'li.header-nav-item a'     // Header nav
                ];
                return Array.from(document.querySelectorAll(selectors.join(',')))
                    .map(a => a.href)
                    .filter(href => href.includes('jiomart.com') && href.includes('/c/'));
            }
        """)
        return list(set(subcats))
