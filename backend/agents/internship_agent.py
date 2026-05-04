from utils.query_builder import build_search_query
from services.browser_service import search_internships
from services.ranking_service import rank_internships
from services.gemini_service import ask_gemini


def run_internship_agent(user_data):
    # Step 1: Build search query
    search_query = build_search_query(user_data)

    # Step 2: Search internships
    raw_results = search_internships(search_query)

    # Step 3: Rank internships
    ranked_results = rank_internships(raw_results, user_data)

    # Step 4: Get top 5 only
    top_results = ranked_results[:5]

    # Step 5: Create summary prompt for Gemini
    summary_prompt = f"""Top internship titles:

        {[item['title'] for item in top_results]}

        Write a short 4-line professional recommendation summary
        for the student.
        Keep it concise and fast.
    """

    ai_summary = ask_gemini(summary_prompt)

    return {
        "top_recommendations": top_results,
        "all_results": ranked_results,
        "ai_summary": ai_summary
    }