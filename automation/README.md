# E-commerce Product URL Scraper & Automation Control Center

A powerful, multi-mode tool to extract product URLs from major e-commerce platforms (Amazon, Flipkart, JioMart, Myntra). It now features a **Web-based Control Center** to manage everything from your browser.

## Features

-   **Web Control Center**: Start, stop, and monitor scraping jobs from a modern UI.
-   **Real-time Dashboard**: Live charts and stats showing platform breakdown and category distribution.
-   **Multi-Platform Support**: Amazon, Flipkart, JioMart, Myntra.
-   **Dual Operation Modes**:
    -   **Web UI**: Recommended for ease of use.
    -   **CLI**: For advanced users or headless servers.
-   **Smart Anti-Bot**: Uses "Fake Headless" mode and randomized delays.
-   **Resumable**: Remembers previously scraped URLs.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
Make sure you have Python 3.8+ installed.
```bash
pip install -r requirements.txt
playwright install chromium
```

### 2. Run the Control Center
Start the dashboard service. This will launch the web server.
```bash
python dashboard_service.py
```

### 3. Open in Browser
Go to: **[http://localhost:8000](http://localhost:8000)**

---

## 🎮 Using the Control Center

### Configuration Panel (Left)
1.  **Select Mode**:
    -   **Existing**: Scrape a specific category.
    -   **New**: Monitor for *newly added* products.
    -   **Batch**: Auto-scan "New Arrivals" across all sites.
2.  **Select Site & Category**: Choose your target (e.g., Amazon -> Grocery).
3.  **Target Count**: Set how many products you want to collect.
4.  **Start/Stop**: Click **START** to begin. The logs will appear on the right.

### Dashboard (Right)
-   **Live Terminal**: Watch the scraper in action.
-   **Global Overview**: Total products scanned vs. new items found.
-   **Category Distribution**: Doughnut chart showing product types.
-   **Platform Breakdown**: Progress bars showing scans per site.

---

## 💻 CLI Usage (Legacy)

If you prefer the terminal, you can still run the scraper directly:

```bash
# Standard Scrape
python main.py existing

# Monitor Mode
python main.py new

# Batch Mode (Default 100 items)
python main.py batch

# Batch Mode (Custom limit)
python main.py batch 50
```

---

## Configuration (`categories.json`)

This file defines the sites, categories, and batch URLs.
```json
{
    "amazon": { "groc": "...", "beauty": "..." },
    "batch_urls": { "amz_new": "..." }
}
```

## Output Files

-   `scrapedProducts.txt`: Master list of all unique URLs found.
-   `newProducts.txt`: Session-specific list of new items found.
