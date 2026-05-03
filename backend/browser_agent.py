from playwright.sync_api import sync_playwright

def search_web(query):
    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        search_url = f"https://duckduckgo.com/?q={query}"
        page.goto(search_url)

        page.wait_for_timeout(3000)

        titles = page.locator("h3").all_inner_texts()

        for title in titles[:5]:
            results.append(title)

        browser.close()

    return results
