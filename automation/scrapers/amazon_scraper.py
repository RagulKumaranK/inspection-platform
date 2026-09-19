from .base_scraper import BaseScraper
from rich.console import Console

console = Console()

class AmazonScraper(BaseScraper):
    async def extract_links(self):
        """
        Amazon specific link extraction.
        """
        links = await self.page.evaluate("""
            () => {
                const selectors = [
                    'a.a-link-normal.s-no-outline',
                    'a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal',
                    'h2 a.a-link-normal',
                    'div[data-component-type="s-search-result"] h2 a',
                    'span[data-component-type="s-product-image"] a',
                    'a.a-link-normal.a-text-normal'
                ];
                return Array.from(document.querySelectorAll(selectors.join(','))).map(a => a.href);
            }
        """)
        console.print(f"[dim]Found {len(links)} raw links on page.[/dim]")
        return links

    async def extract_subcategories(self):
        """
        Extracts sub-category URLs from Amazon.
        """
        console.print("[cyan]Looking for sub-categories...[/cyan]")
        subcats = await self.page.evaluate("""
            () => {
                const selectors = [
                    '#departments a',          // Sidebar departments
                    '#wayfinding-breadcrumbs_container a', // Breadcrumbs
                    'a.a-link-normal[href*="/b/"]', // Generic category links
                    'a.a-link-normal[href*="/s?"]'  // Search result links
                ];
                return Array.from(document.querySelectorAll(selectors.join(',')))
                    .map(a => a.href)
                    .filter(href => href.includes('amazon'));
            }
        """)
        return list(set(subcats))

    async def try_pagination(self):
        """
        Amazon specific pagination.
        """
        console.print("[cyan]Checking for Amazon pagination...[/cyan]")
        
        next_selectors = [
            "a.s-pagination-next",
            "a.s-pagination-item.s-pagination-next",
            "li.a-last a",
            "a[title='Next Page']",
            "a:has-text('Next')",
            "span.s-pagination-strip a:last-child"
        ]
        
        for selector in next_selectors:
            try:
                if await self.page.is_visible(selector):
                    # Check if it is disabled
                    is_disabled = await self.page.evaluate(f"""
                        (selector) => {{
                            const el = document.querySelector(selector);
                            return el.classList.contains('s-pagination-disabled') || el.getAttribute('aria-disabled') === 'true';
                        }}
                    """, selector)
                    
                    if is_disabled:
                        console.print(f"[dim]Found disabled next button: {selector}[/dim]")
                        continue

                    console.print(f"[dim]Found next button: {selector}[/dim]")
                    await self.page.locator(selector).first.scroll_into_view_if_needed()
                    await self.page.click(selector, timeout=2000)
                    await self.page.wait_for_load_state("domcontentloaded", timeout=10000)
                    return True
            except Exception as e:
                # console.print(f"[dim]Failed click on {selector}: {e}[/dim]")
                continue
        
        console.print("[red]Amazon pagination failed. No active 'Next' button found.[/red]")
        return False
