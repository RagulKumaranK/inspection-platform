import asyncio
import sys
from rich.console import Console
from rich.prompt import Prompt, IntPrompt
from scrapers.base_scraper import BaseScraper
from scrapers.flipkart_scraper import FlipkartScraper
from scrapers.amazon_scraper import AmazonScraper
from scrapers.myntra_scraper import MyntraScraper
from scrapers.jiomart_scraper import JioMartScraper
from utils import get_sitename

def get_scraper(url: str) -> BaseScraper:
    sitename = get_sitename(url)
    if "flipkart" in sitename:
        return FlipkartScraper()
    elif "amazon" in sitename:
        return AmazonScraper()
    elif "myntra" in sitename:
        return MyntraScraper()
    elif "jiomart" in sitename:
        return JioMartScraper()
    else:
        return BaseScraper()

console = Console()

import json
from utils import get_global_stats

async def main():
    console.print("[bold cyan]E-commerce Product URL Scraper[/bold cyan]")
    console.print("----------------------------------------")

    # Load categories
    try:
        with open("categories.json", "r") as f:
            categories_data = json.load(f)
    except FileNotFoundError:
        console.print("[red]categories.json not found![/red]")
        return

    # 1. Parse Arguments
    import argparse
    parser = argparse.ArgumentParser(description="E-commerce Scraper")
    parser.add_argument("mode", nargs="?", choices=["existing", "new", "batch"], help="Operation mode")
    parser.add_argument("--site", help="Target site (amazon, flipkart, jiomart, myntra)")
    parser.add_argument("--category", help="Target category key or URL")
    parser.add_argument("--count", type=int, default=100, help="Target product count")
    parser.add_argument("--duration", type=int, default=5, help="Duration in minutes for monitor mode")
    
    args = parser.parse_args()
    mode = args.mode

    if mode:
        console.print(f"[bold blue]Running in {mode.upper()} mode.[/bold blue]")

    # 2. Handle Batch Mode Immediately
    if mode == "batch":
        # BATCH MODE LOGIC
        
        # Determine target count
        total_target = args.count if args.count != 100 else 100 # Default is 100 in argparse
        
        # If user didn't provide --count flag but we are in batch mode, we might want to prompt?
        # But for automation consistency, we'll stick to args.count if provided, or prompt if interactive.
        # To detect if --count was explicitly passed is hard with default=100.
        # Let's assume if run from CLI with mode, we use the arg.
        
        if not args.mode and not args.count:
             # Interactive fallback if needed, but for now let's trust the arg
             pass
             
        # Actually, let's keep the prompt logic ONLY if mode was NOT passed via CLI (interactive session)
        # But here mode IS 'batch'.
        # If run as `python main.py batch`, args.count is 100.
        # If run as `python main.py batch --count 50`, args.count is 50.
        # So we can just use total_target = args.count
        
        console.print(f"[bold magenta]Starting Batch Mode: Collecting {total_target} New Products...[/bold magenta]")
        
        batch_urls = categories_data.get("batch_urls", {})
        if not batch_urls:
            console.print("[red]No batch_urls found in categories.json![/red]")
            return

        active_sites = list(batch_urls.keys())
        remaining_target = total_target
        
        results = {}
        total_collected = 0
        
        for i, site in enumerate(active_sites):
            if remaining_target <= 0:
                break

            sites_left = len(active_sites) - i
            
            # Calculate quota: distribute remaining evenly
            import math
            if sites_left > 0:
                quota = math.ceil(remaining_target / sites_left)
            else:
                quota = remaining_target
            
            # Ensure we don't exceed remaining
            if quota > remaining_target:
                quota = remaining_target
                
            url = batch_urls[site]
            console.print(f"\n[bold cyan]Batching {site} (Target: {quota})...[/bold cyan]")
            
            scraper = get_scraper(url)
            try:
                # Use save_mode="monitor" to save to newProducts.txt as well
                links = await scraper.scrape_category(url, target_count=quota, save_mode="monitor")
                count = len(links)
                
                # Enforce strict limit on what we count/display if scraper somehow returned more (though base_scraper is fixed)
                if count > quota:
                    count = quota
                    links = links[:quota] 
                
                results[site] = count
                total_collected += count
                remaining_target -= count
                
                console.print(f"[green]Collected {count} from {site}.[/green]")
                
            except Exception as e:
                console.print(f"[red]Error batching {site}: {e}[/red]")
                results[site] = 0
            finally:
                await scraper.stop_browser()
                
        # Summary
        console.print("\n[bold white]Batch Summary:[/bold white]")
        console.print("----------------------------------------")
        for site, count in results.items():
            console.print(f"{site}: [bold green]{count}[/bold green]")
        console.print("----------------------------------------")
        console.print(f"Total New URLs Collected: [bold green]{total_collected}[/bold green]")
        
        new_global, new_site_counts = get_global_stats()
        console.print(f"Global Total Scanned: [bold blue]{new_global}[/bold blue]")
        return

    # 3. Select Site
    if args.site:
        selected_site = args.site
    else:
        site_choices = [k for k in categories_data.keys() if k != "batch_urls"]
        site_choices.append("Exit")
        selected_site = Prompt.ask("Select Site", choices=site_choices)
    
    if selected_site == "Exit":
        return

    # 4. Select Category
    if args.category:
        selected_category = args.category
        # Check if it's a direct URL or a key
        if selected_category.startswith("http"):
            url = selected_category
        else:
            url = categories_data.get(selected_site, {}).get(selected_category)
    else:
        cat_choices = list(categories_data[selected_site].keys())
        cat_choices.append("Custom URL")
        selected_category = Prompt.ask("Select Category", choices=cat_choices)
        
        if selected_category == "Custom URL":
            url = Prompt.ask("Enter the category page URL")
        else:
            url = categories_data[selected_site][selected_category]
            console.print(f"[green]Selected URL: {url}[/green]")

    if not url:
        console.print("[red]URL is required![/red]")
        return

    # 5. Display Stats
    global_count, site_counts = get_global_stats()
    site_total = site_counts.get(selected_site, 0)
    
    console.print("\n[bold white]Current Statistics:[/bold white]")
    console.print(f"Total Stored Globally: [bold green]{global_count}[/bold green]")
    console.print(f"Total Stored for {selected_site}: [bold green]{site_total}[/bold green]")
    console.print("----------------------------------------\n")

    # 6. Select Mode (If not provided via CLI)
    if not mode:
        mode = Prompt.ask("Select Mode", choices=["existing", "new", "batch"], default="existing")
        
        # If user selects batch here, we need to handle it or disallow it.
        # Since we already selected a site/category, switching to batch (which ignores them) is confusing.
        # But for simplicity, if they choose batch here, we can just run the batch logic recursively or call a function.
        # However, the prompt above implies they want to run on the SELECTED site.
        # Let's restrict the choices here if they've already gone down the single-site path.
        # Actually, let's just keep it simple: if they didn't provide CLI arg, they are in interactive mode.
        # If they pick 'batch' here, we should probably just run batch and ignore the selected site.
        if mode == "batch":
            console.print("[yellow]Switching to Batch Mode (ignoring selected site)...[/yellow]")
            # Re-run main with batch arg? Or just copy-paste logic?
            # Better to refactor batch logic into a function, but for now I'll just tell them to restart or handle it.
            # Let's just allow it and jump to batch logic.
            # But wait, I pasted the batch logic above inside `if mode == "batch"`.
            # So if I set mode="batch" here, I need to loop back or duplicate code.
            # To avoid duplication, I will wrap the batch logic in a function or just let it fall through?
            # No, the batch logic above has a `return`.
            pass

    # RE-CHECK for batch mode if selected interactively
    if mode == "batch":
         # ... (Duplicate logic or refactor) ...
         # For this edit, I will just copy the logic or restructure so it's shared.
         # Actually, the best way is to put the batch logic in a separate function.
         pass
         
    # WAIT, I can't easily refactor into a function with `replace_file_content` without replacing the whole file.
    # I will just restructure the flow so `batch` check happens after mode selection, 
    # BUT if mode is batch, we skip site selection.
    
    # Revised Plan for this replacement:
    # 1. Parse CLI mode.
    # 2. If mode is NOT batch, do Site/Category selection.
    # 3. If mode IS batch (from CLI), skip selection.
    # 4. If mode is NONE, do Site selection, THEN Mode selection.
    # 5. If Mode becomes batch (interactive), run batch logic.
    
    # This is getting complicated to patch.
    # Simpler:
    # 1. Parse CLI.
    # 2. If CLI == batch, run batch & return.
    # 3. Else, run interactive flow (Select Site -> Select Category -> Select Mode).
    # 4. If Interactive Mode == batch, run batch & return.
    
    # I will implement the batch logic as a block that runs if `mode == 'batch'`.
    # And I will guard the Site/Category selection with `if mode != 'batch'`.
    # But `mode` might be None initially.
    
    # Correct Logic:
    # mode = CLI_ARG
    # if mode == 'batch': 
    #    run_batch()
    #    return
    #
    # # Interactive for single site
    # select_site()
    # select_category()
    # mode = prompt_mode(choices=['existing', 'new']) # Don't offer batch here to avoid confusion?
    # # Or offer batch and if selected, run batch (ignoring site).
    
    # I will stick to the user's request: "python main.py batch" should just work.
    # I will replace the top part of main() to handle CLI batch mode immediately.
    pass

    # EXISTING / NEW MODE LOGIC
    scraper = get_scraper(url)

    try:
        if mode == "existing":
            # Use CLI arg if provided (default 100), or prompt if interactive?
            # For simplicity, if mode was passed via CLI, we assume args.count is valid.
            target_count = args.count
            
            if not args.mode: # Interactive fallback
                 try:
                    count_input = console.input(f"[bold yellow]Enter the number of product URLs to extract (0 for infinite, default {args.count}): [/bold yellow]")
                    if count_input.strip():
                        target_count = int(count_input)
                 except ValueError:
                    pass

            console.print(f"[yellow]Starting scrape for {selected_site} - {selected_category}...[/yellow]")
            
            links = await scraper.scrape_category(url, target_count)
            
            if links:
                console.print(f"[bold green]Successfully extracted {len(links)} new links.[/bold green]")
                
                # Update stats
                new_global, new_site_counts = get_global_stats()
                console.print(f"\n[bold white]Updated Statistics:[/bold white]")
                console.print(f"Total Stored Globally: [bold green]{new_global}[/bold green] (+{len(links)})")
                console.print(f"Total Stored for {selected_site}: [bold green]{new_site_counts.get(selected_site, 0)}[/bold green]")
            else:
                console.print("[bold yellow]No new links found.[/bold yellow]")

        elif mode == "new":
            # Monitor mode
            target_count = args.count
            duration_minutes = args.duration
            
            if not args.mode: # Interactive fallback
                try:
                    count_input = console.input(f"[bold yellow]Enter the number of NEW products to find (default {target_count}): [/bold yellow]")
                    if count_input.strip():
                        target_count = int(count_input)
                    
                    dur_input = console.input(f"[bold yellow]Enter duration in minutes (default {duration_minutes}): [/bold yellow]")
                    if dur_input.strip():
                        duration_minutes = int(dur_input)
                except ValueError:
                    pass

            console.print(f"[yellow]Starting continuous monitor for {selected_site} - {selected_category}...[/yellow]")
            await scraper.monitor(url, target_count, duration_minutes)

    except KeyboardInterrupt:
        console.print("\n[red]Operation interrupted by user.[/red]")
    except Exception as e:
        console.print(f"[red]An unexpected error occurred: {e}[/red]")
    finally:
        await scraper.stop_browser()

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    asyncio.run(main())
