import asyncio
from playwright.async_api import async_playwright
import sys

async def search(query):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        try:
            # Using Google search now
            await page.goto(f"https://www.google.com/search?q={query}", timeout=60000)
            
            # Wait for the page to be mostly loaded
            await page.wait_for_load_state('networkidle', timeout=60000)
            
            # Selectors for Google search results
            results = await page.query_selector_all('div.g')
            
            if not results:
                print("No results found on Google. Saving a screenshot for debugging.")
                await page.screenshot(path='google_debug_screenshot.png')
                return

            print(f"Found {len(results)} results for '{query}' on Google:\n")
            for result in results:
                title_elem = await result.query_selector('h3')
                link_elem = await result.query_selector('a')
                
                if title_elem and link_elem:
                    title = await title_elem.inner_text()
                    link = await link_elem.get_attribute('href')
                    
                    # Snippet selector is less consistent, we'll try to find a common one
                    snippet_elem = await result.query_selector('div.VwiC3b')
                    snippet = await snippet_elem.inner_text() if snippet_elem else 'No snippet found.'
                    
                    print(f"Title: {title}")
                    print(f"Link: {link}")
                    print(f"Snippet: {snippet}")
                    print("-" * 20)
        
        except Exception as e:
            print(f"An error occurred: {e}")
            await page.screenshot(path='google_error_screenshot.png')
            print("Saved an error screenshot to 'google_error_screenshot.png'")

        finally:
            await browser.close()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        search_query = ' '.join(sys.argv[1:])
        asyncio.run(search(search_query))
    else:
        print("Please provide a search query.")
