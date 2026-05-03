from playwright.sync_api import sync_playwright


def search_internships(query):
    internship_results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Using DuckDuckGo to avoid Google captcha issues
        search_url = f"https://duckduckgo.com/?q={query}"

        page.goto(search_url)
        page.wait_for_timeout(5000)

        titles = page.locator("h2").all_inner_texts()

        for i, title in enumerate(titles[:10], start=1):
            internship_results.append({
                "rank": i,
                "title": title,
                "source": "DuckDuckGo Search"
            })

        browser.close()

    return internship_results