import re
from urllib.parse import urlparse
from datetime import datetime
import os

def get_sitename(url: str) -> str:
    """Extracts the site name from the URL."""
    try:
        parsed = urlparse(url)
        domain = parsed.netloc
        # Remove www. and .com/.in etc to get the main name
        if domain.startswith("www."):
            domain = domain[4:]
        return domain.split('.')[0]
    except:
        return "unknown_site"

def is_valid_product_url(url: str, base_domain: str) -> bool:
    """
    Checks if a URL is likely a product page based on common patterns.
    Strictly filters out store pages, search results, and other non-product links.
    """
    if not url:
        return False
    
    # Must be from the same domain
    if base_domain not in url:
        return False

    # Exclude common non-product patterns
    exclude_patterns = [
        r'/stores/', r'/page/', r'/search', r'/account/', r'/cart', r'/checkout',
        r'/login', r'/signin', r'/register', r'/wishlist', r'/contact', r'/about',
        r'/help', r'/terms', r'/privacy', r'/prime', r'/music', r'/video',
        r'/gp/aw/so', r'/gp/browse', r'/b/', r'/s\?', r'ref=', r'redirect'
    ]
    
    for pattern in exclude_patterns:
        if re.search(pattern, url, re.IGNORECASE):
            # Special case: 'ref=' is common in product URLs too, so be careful.
            # Actually, ref= is usually a query param, so checking if it's in the path might be better.
            # But for now, let's rely on positive matching for product patterns.
            if pattern == r'ref=':
                continue 
            return False
            
    # Explicit positive patterns for product pages
    product_patterns = [
        r'/dp/[A-Z0-9]{10}',          # Amazon standard
        r'/gp/product/[A-Z0-9]{10}',  # Amazon legacy
        r'/p/[A-Za-z0-9-]+',          # Flipkart, Meesho
        r'/product/[A-Za-z0-9-]+',    # Generic
        r'/item/[A-Za-z0-9-]+',       # Generic
        r'/pd/[A-Za-z0-9-]+',         # Generic
    ]
    
    for pattern in product_patterns:
        if re.search(pattern, url):
            return True
            
    # If no specific pattern matches, we reject it. 
    # The previous fallback was too loose and let in store pages.
    return False

def normalize_url(url: str) -> str:
    """
    Removes query parameters and tracking segments to avoid duplicates.
    """
    try:
        parsed = urlparse(url)
        path = parsed.path
        
        # Remove 'ref=' segment if present in the path (common in Amazon)
        if 'ref=' in path:
            parts = path.split('/')
            parts = [p for p in parts if not p.startswith('ref=')]
            path = '/'.join(parts)
            
        # Reconstruct url without query and fragment
        return f"{parsed.scheme}://{parsed.netloc}{path}"
    except:
        return url

import json
import os

class HistoryManager:
    def __init__(self, history_file="history.json"):
        self.history_file = history_file
        self.seen_urls = self.load_history()

    def load_history(self) -> set:
        if os.path.exists(self.history_file):
            try:
                with open(self.history_file, "r", encoding="utf-8") as f:
                    return set(json.load(f))
            except Exception:
                return set()
        return set()

    def save_history(self):
        try:
            temp_file = self.history_file + ".tmp"
            with open(temp_file, "w", encoding="utf-8") as f:
                json.dump(list(self.seen_urls), f)
            
            # Atomic replace
            if os.path.exists(self.history_file):
                os.remove(self.history_file)
            os.rename(temp_file, self.history_file)
        except Exception as e:
            print(f"Error saving history: {e}")

import re
from urllib.parse import urlparse
from datetime import datetime
import os

def get_sitename(url: str) -> str:
    """Extracts the site name from the URL."""
    try:
        parsed = urlparse(url)
        domain = parsed.netloc
        # Remove www. and .com/.in etc to get the main name
        if domain.startswith("www."):
            domain = domain[4:]
        return domain.split('.')[0]
    except:
        return "unknown_site"

def is_valid_product_url(url: str, base_domain: str) -> bool:
    """
    Checks if a URL is likely a product page based on common patterns.
    Strictly filters out store pages, search results, and other non-product links.
    """
    if not url:
        return False
    
    # Must be from the same domain
    if base_domain not in url:
        return False

    # Exclude common non-product patterns
    exclude_patterns = [
        r'/stores/', r'/page/', r'/search', r'/account/', r'/cart', r'/checkout',
        r'/login', r'/signin', r'/register', r'/wishlist', r'/contact', r'/about',
        r'/help', r'/terms', r'/privacy', r'/prime', r'/music', r'/video',
        r'/gp/aw/so', r'/gp/browse', r'/b/', r'/s\?', r'ref=', r'redirect'
    ]
    
    for pattern in exclude_patterns:
        if re.search(pattern, url, re.IGNORECASE):
            # Special case: 'ref=' is common in product URLs too, so be careful.
            # Actually, ref= is usually a query param, so checking if it's in the path might be better.
            # But for now, let's rely on positive matching for product patterns.
            if pattern == r'ref=':
                continue 
            return False
            
    # Explicit positive patterns for product pages
    product_patterns = [
        r'/dp/[A-Z0-9]{10}',          # Amazon standard
        r'/gp/product/[A-Z0-9]{10}',  # Amazon legacy
        r'/p/[A-Za-z0-9-]+',          # Flipkart, JioMart, Meesho
        r'/itm[a-z0-9]+',             # Flipkart (short)
        r'myntra\.com/.+/\d+/buy',    # Myntra standard
        r'/product/[A-Za-z0-9-]+',    # Generic
        r'/item/[A-Za-z0-9-]+',       # Generic
        r'/pd/[A-Za-z0-9-]+',         # Generic
    ]
    
    # Special strict check for Myntra to avoid listing pages
    if "myntra.com" in url:
        if "/buy" not in url and "/products/" not in url:
            return False

    for pattern in product_patterns:
        if re.search(pattern, url):
            return True
            
    # If no specific pattern matches, we reject it. 
    # The previous fallback was too loose and let in store pages.
    return False

def normalize_url(url: str) -> str:
    """
    Removes query parameters and tracking segments to avoid duplicates.
    """
    try:
        parsed = urlparse(url)
        path = parsed.path
        
        # Remove 'ref=' segment if present in the path (common in Amazon)
        if 'ref=' in path:
            parts = path.split('/')
            parts = [p for p in parts if not p.startswith('ref=')]
            path = '/'.join(parts)
            
        # Reconstruct url without query and fragment
        return f"{parsed.scheme}://{parsed.netloc}{path}"
    except:
        return url

def optimize_url_for_newest(url: str) -> str:
    """
    Modifies the URL to sort by 'Newest Arrivals' for better monitoring.
    """
    try:
        separator = "&" if "?" in url else "?"
        
        if "amazon" in url:
            if "s=date-desc-rank" not in url:
                return f"{url}{separator}s=date-desc-rank"
        elif "flipkart" in url:
            if "sort=recency_desc" not in url:
                return f"{url}{separator}sort=recency_desc"
        elif "myntra" in url:
            if "sort=new" not in url:
                return f"{url}{separator}sort=new"
        elif "jiomart" in url:
            if "sort=rel" not in url: 
                 pass
    except:
        pass
    return url

def is_fmcg_link(url: str) -> bool:
    """
    Checks if the URL contains keywords typical of FMCG/packaged products.
    """
    keywords = [
        "pack", "ml", "kg", "gm", "gram", "pcs", "bundle", "combo", "ltr", "liter",
        "bottle", "box", "jar", "tube", "sachet", "pouch", "bag", "set-of",
        "quantity", "unit", "oz", "pound", "gallon"
    ]
    
    url_lower = url.lower()
    for kw in keywords:
        if kw in url_lower:
            return True
    return False

def score_url(url: str) -> int:
    """
    Scores a URL based on its relevance to FMCG/packaged products.
    Higher score = higher priority.
    """
    if not url:
        return 0
        
    score = 1 # Base score for being a valid link
    
    if is_fmcg_link(url):
        score += 2
        
    # Penalize common non-FMCG categories if they appear in URL
    negative_keywords = ["fashion", "clothing", "shoes", "furniture", "electronics", "mobile", "laptop"]
    for kw in negative_keywords:
        if kw in url.lower():
            score -= 1
            
    return score

def load_master_list(sitename: str) -> set:
    """
    Loads all previously seen product URLs from the master file (scrapedProducts.txt).
    """
    site_dir = sitename.replace(" ", "_").lower()
    
    file_path = os.path.join(site_dir, "scrapedProducts.txt")
    
    seen_urls = set()
    if os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                for line in f:
                    url = line.strip()
                    if url:
                        seen_urls.add(url)
        except Exception as e:
            print(f"Error loading master list: {e}")
            
    return seen_urls

def save_product(link: str, sitename: str, mode: str = "scrape"):
    """
    Saves a single product link.
    - Always appends to 'scrapedProducts.txt' (Master File).
    - If mode is 'monitor', ALSO appends to 'newProducts.txt' (Monitor File).
    """
    site_dir = sitename.replace(" ", "_").lower()
    if not os.path.exists(site_dir):
        os.makedirs(site_dir)
        
    # 1. Append to Master File (scrapedProducts.txt)
    master_file = os.path.join(site_dir, "scrapedProducts.txt")
    try:
        with open(master_file, "a", encoding="utf-8") as f:
            f.write(link + "\n")
    except Exception as e:
        print(f"Error saving to master file: {e}")

    # 2. If Monitor Mode, Append to Monitor File (newProducts.txt)
    if mode == "monitor":
        monitor_file = os.path.join(site_dir, "newProducts.txt")
        try:
            with open(monitor_file, "a", encoding="utf-8") as f:
                f.write(link + "\n")
        except Exception as e:
            print(f"Error saving to monitor file: {e}")
    return False

def get_global_stats():
    """
    Calculates total products scraped globally and per site.
    Returns a tuple (global_count, site_counts_dict).
    """
    global_count = 0
    site_counts = {}
    
    # Assuming directories are in the current working directory
    for item in os.listdir('.'):
        if os.path.isdir(item):
            product_file = os.path.join(item, "scrapedProducts.txt")
            if os.path.exists(product_file):
                try:
                    with open(product_file, "r", encoding="utf-8") as f:
                        count = sum(1 for line in f if line.strip())
                        site_counts[item] = count
                        global_count += count
                except:
                    pass
                    
    return global_count, site_counts
