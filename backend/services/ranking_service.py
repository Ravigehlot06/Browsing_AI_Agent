def rank_internships(results, user_data):
    priorities = user_data.get("priorities", [])
    domains = user_data.get("domains", [])

    ranked_results = []

    for item in results:
        score = 50  # base score

        title = item["title"].lower()

        # Domain matching score
        for domain in domains:
            if domain.lower().split()[0] in title:
                score += 20

        # Priority-based scoring
        for priority in priorities:
            if "learning" in priority.lower():
                if "internship" in title:
                    score += 10

            if "brand" in priority.lower():
                if "google" in title or "microsoft" in title or "amazon" in title:
                    score += 15

            if "startup" in priority.lower():
                if "startup" in title:
                    score += 10

        item["match_score"] = min(score, 100)

        ranked_results.append(item)

    # Sort by highest score first
    ranked_results.sort(
        key=lambda x: x["match_score"],
        reverse=True
    )

    return ranked_results