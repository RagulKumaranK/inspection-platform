from .base_scraper import BaseScraper
from rich.console import Console

console = Console()

class MyntraScraper(BaseScraper):
    async def extract_links(self):
        """
        Myntra specific link extraction.
        """
        # Wait for product container
        try:
            await self.page.wait_for_selector("ul.results-base", timeout=5000)
        except:
            pass

        links = await self.page.evaluate("""
            () => {
                const selectors = [
                    'li.product-base a',  // Standard product card
                    'a[href*="/buy"]'     // Generic buy link
                ];
                
                const elements = document.querySelectorAll(selectors.join(','));
                
                return Array.from(elements)
                    .map(a => a.href)
                    .filter(href => href.includes('/buy'));
            }
        """)
        console.print(f"[dim]Found {len(links)} raw links on page.[/dim]")
        return links

    async def try_pagination(self):
        """
        Myntra specific pagination.
        """
        console.print("[cyan]Checking for Myntra pagination...[/cyan]")
        
        next_selectors = [
            "li.pagination-next a",
            "a[rel='next']",
            "text=Next",
            "text=Next >",
            "a:has-text('Next')",
            ".pagination-next a",
            "li.pagination-next" # Sometimes clicking the LI works if A is hidden/wrapped weirdly
        ]
        
        for selector in next_selectors:
            try:
                if await self.page.is_visible(selector):
                    # Check if disabled
                    is_disabled = await self.page.evaluate(f"""
                        (selector) => {{
                            const el = document.querySelector(selector);
                            if (!el) return false;
                            return el.classList.contains('disabled') || el.hasAttribute('disabled');
                        }}
                    """, selector)
                    
                    if is_disabled:
                        continue

                    console.print(f"[dim]Found next button: {selector}[/dim]")
                    await self.page.locator(selector).first.scroll_into_view_if_needed()
                    # Force click can help with some overlays
                    await self.page.click(selector, timeout=3000, force=True)
                    await self.page.wait_for_load_state("domcontentloaded", timeout=10000)
                    return True
            except:
                continue
                
        console.print("[red]Myntra pagination failed. No active 'Next' button found.[/red]")
        return False

    async def extract_subcategories(self):
        """
        Extracts sub-category URLs from Myntra.
        """
        console.print("[cyan]Looking for sub-categories...[/cyan]")
        subcats = await self.page.evaluate("""
            () => {
                const selectors = [
                    'div.filter-summary-filter a', // Filter links
                    'ul.categories-list a',        // Category list
                    'a.breadcrumbs-link'           // Breadcrumbs
                ];
                return Array.from(document.querySelectorAll(selectors.join(',')))
                    .map(a => a.href)
                    .filter(href => href.includes('myntra.com'));
            }
        """)
        return list(set(subcats))
