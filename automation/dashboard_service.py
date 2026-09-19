from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
import re
import asyncio
import subprocess
from collections import defaultdict, deque

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Process Management ---
class ScraperProcess:
    def __init__(self):
        self.process = None
        self.logs = deque(maxlen=100) # Keep last 100 lines
        self.is_running = False

    async def start(self, command):
        if self.is_running:
            return False, "Process already running"
        
        try:
            # Use asyncio subprocess to capture output non-blocking
            self.process = await asyncio.create_subprocess_shell(
                command,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            self.is_running = True
            self.logs.clear()
            
            # Start reading logs in background
            asyncio.create_task(self.read_stream(self.process.stdout))
            asyncio.create_task(self.read_stream(self.process.stderr))
            asyncio.create_task(self.wait_for_exit())
            
            return True, "Started"
        except Exception as e:
            self.is_running = False
            return False, str(e)

    async def stop(self):
        if self.process and self.is_running:
            try:
                self.process.terminate()
                # Give it a moment, then kill if needed
                try:
                    await asyncio.wait_for(self.process.wait(), timeout=5.0)
                except asyncio.TimeoutError:
                    self.process.kill()
                
                self.is_running = False
                return True
            except Exception as e:
                return False
        return False

    async def read_stream(self, stream):
        while True:
            line = await stream.readline()
            if not line:
                break
            decoded = line.decode('utf-8', errors='replace').strip()
            if decoded:
                self.logs.append(decoded)

    async def wait_for_exit(self):
        if self.process:
            await self.process.wait()
            self.is_running = False
            self.logs.append("[System] Process exited.")

scraper_manager = ScraperProcess()

class StartRequest(BaseModel):
    mode: str
    site: str = None
    category: str = None
    count: int = 100

@app.post("/api/control/start")
async def start_scraper(req: StartRequest):
    # Construct command with CLI arguments
    cmd = f"python main.py {req.mode}"
    
    if req.mode == 'batch':
        cmd += f" --count {req.count}"
    else:
        # Existing or New mode
        if req.site:
            cmd += f" --site {req.site}"
        if req.category:
            cmd += f" --category {req.category}"
        if req.count:
            cmd += f" --count {req.count}"
            
        if req.mode == 'new':
            # Default duration 5 if not specified (though UI doesn't send it yet, we can add later)
            cmd += " --duration 5"

    # Remove temp file logic, just run the command
    success, msg = await scraper_manager.start(cmd)
    return {"status": "started" if success else "error", "message": msg}

@app.post("/api/control/stop")
async def stop_scraper():
    success = await scraper_manager.stop()
    return {"status": "stopped" if success else "error"}

@app.get("/api/control/logs")
async def get_logs():
    return {
        "status": "running" if scraper_manager.is_running else "idle",
        "logs": list(scraper_manager.logs)
    }

# --- Existing Dashboard Logic ---
def get_category_from_url(url: str) -> str:
    """
    Heuristic to determine category from URL.
    """
    url_lower = url.lower()
    
    categories = {
        "Grocery": ["grocery", "food", "eat", "pantry", "staples"],
        "Beauty": ["beauty", "makeup", "cosmetics", "face", "skin"],
        "Dairy": ["dairy", "milk", "cheese", "butter", "curd"],
        "Electronics": ["electronics", "mobile", "laptop", "audio", "headphone"],
        "Fashion": ["fashion", "clothing", "wear", "dress", "shirt", "shoe"],
        "Fragrance": ["fragrance", "perfume", "scent", "deo"],
        "Gourmet": ["gourmet", "chocolate", "snack", "sweet"],
        "Haircare": ["hair", "shampoo", "conditioner", "oil"],
        "Home & Kitchen": ["home", "kitchen", "furnishing", "decor"],
        "Personal Care": ["personal-care", "soap", "body", "wash", "hygiene"],
        "Skincare": ["skincare", "cream", "lotion", "moisturizer"]
    }
    
    for cat, keywords in categories.items():
        for kw in keywords:
            if kw in url_lower:
                return cat
                
    return "Other"

@app.get("/api/dashboard/summary")
def get_dashboard_summary():
    total_products_scanned = 0
    platform_wise_scans = defaultdict(int)
    new_products_scanned = 0
    category_counts = defaultdict(int)
    
    # Define site directories
    sites = ["amazon", "flipkart", "jiomart", "myntra"]
    
    for site in sites:
        site_dir = os.path.join(os.getcwd(), site)
        if not os.path.exists(site_dir):
            continue
            
        # 1. Count Scraped Products (Master List)
        scraped_file = os.path.join(site_dir, "scrapedProducts.txt")
        if os.path.exists(scraped_file):
            try:
                with open(scraped_file, "r", encoding="utf-8") as f:
                    lines = [line.strip() for line in f if line.strip()]
                    count = len(lines)
                    platform_wise_scans[site] += count
                    total_products_scanned += count
                    
                    # Calculate Category Percentages based on these URLs
                    for url in lines:
                        cat = get_category_from_url(url)
                        category_counts[cat] += 1
            except Exception as e:
                print(f"Error reading {scraped_file}: {e}")

        # 2. Count New Products (Monitor List)
        new_file = os.path.join(site_dir, "newProducts.txt")
        if os.path.exists(new_file):
            try:
                with open(new_file, "r", encoding="utf-8") as f:
                    count = sum(1 for line in f if line.strip())
                    new_products_scanned += count
            except Exception as e:
                print(f"Error reading {new_file}: {e}")

    # Calculate Percentages
    category_percentages = {}
    total_categorized = sum(category_counts.values())
    
    # Ensure all requested categories are present even if 0
    all_categories = [
        "Beauty", "Dairy", "Electronics", "Fashion", "Fragrance", "Gourmet", 
        "Grocery", "Haircare", "Home & Kitchen", "Makeup", "Personal Care", "Skincare"
    ]
    
    for cat in all_categories:
        if total_categorized > 0:
            count = category_counts.get(cat, 0)
            percentage = round((count / total_categorized) * 100, 2)
        else:
            percentage = 0
        category_percentages[cat] = percentage

    return {
        "totalProductsScanned": total_products_scanned,
        "platformWiseScans": dict(platform_wise_scans),
        "newProductsScanned": new_products_scanned,
        "categoryPercentages": category_percentages
    }

# Mount Static Files (UI)
app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
