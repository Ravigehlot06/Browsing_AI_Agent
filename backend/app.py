from flask import Flask, request, jsonify
from flask_cors import CORS
from browser_service import search_web
from gemini_service import generate_summary

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Devta hu mai"

@app.route("/api/task", methods=["POST"])
def handle_task():
    data = request.json
    task = data.get("task")

    # Step 1: Search web using Playwright
    search_results = search_web(task)

    # Step 2: Generate AI summary using Gemini
    ai_summary = generate_summary(task, search_results)

    response = {
        "status": "success",
        "steps": [
            "Searching the web",
            "Collecting useful information",
            "Generating AI summary"
        ],
        "search_results": search_results,
        "final_summary": ai_summary
    }

    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)