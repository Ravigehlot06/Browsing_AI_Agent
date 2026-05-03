def build_search_query(user_data):
    branch = user_data.get("branch", "")
    domains = user_data.get("domains", [])
    locations = user_data.get("locations", [])
    work_mode = user_data.get("work_mode", "")
    stipend = user_data.get("minimum_stipend", "")
    duration = user_data.get("duration", "")
    priorities = user_data.get("priorities", [])

    # Convert list to readable text
    domain_text = ", ".join(domains)
    location_text = ", ".join(locations)
    priority_text = ", ".join(priorities)

    query = f"""
    Find internship opportunities for {branch} students in {domain_text}
    located in {location_text},
    work mode: {work_mode},
    minimum stipend: {stipend},
    duration: {duration},
    priorities: {priority_text}
    """

    return query.strip()