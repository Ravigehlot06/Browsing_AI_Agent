import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-2.5-flash")


def ask_gemini(prompt):
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception:
        return "AI summary generation took too long. Showing top ranked internships only."