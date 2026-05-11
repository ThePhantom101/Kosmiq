import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        try:
            print("Connecting to http://localhost:9222...")
            # Connecting to the remote Windows browser via CDP
            browser = await p.chromium.connect_over_cdp("http://localhost:9222")
            print("Successfully connected!")
            
            # Use existing context if possible, or create new
            if browser.contexts:
                context = browser.contexts[0]
            else:
                context = await browser.new_context()
            
            page = await context.new_page()
            print("Navigating to https://google.com...")
            await page.goto("https://google.com", wait_until="domcontentloaded", timeout=30000)
            
            title = await page.title()
            print(f"Page title: {title}")
            
            screenshot_path = "google_bridge_success.png"
            await page.screenshot(path=screenshot_path)
            print(f"Screenshot saved as {screenshot_path}")
            
            await browser.close()
            print("Connection closed.")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(run())
