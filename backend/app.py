from flask import Flask, request, jsonify
from flask_cors import CORS

from agents.internship_agent import run_internship_agent

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "Internship Research Agent Backend Running"


@app.route("/api/internship-agent", methods=["POST"])
def internship_agent():
    try:
        user_data = request.json

        result = run_internship_agent(user_data)

        return jsonify({
            "success": True,
            "data": result
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)