import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-2.5-flash")

def generate_summary(task, search_results):
    prompt = f"""
    You are an AI research assistant.

    Task:
    {task}

    web search results:
    {search_results}

    Give a short professional response.
    """

    response = model.generate_content(prompt)
    return response.text