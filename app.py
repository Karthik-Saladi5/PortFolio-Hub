from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sqlite3
import json
from verifier import verify_portfolio
from mailer import send_success_email, send_failure_email

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return render_template('index.html')

DB_NAME = "portfolio.db"

# Initialize DB
def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            phone TEXT,
            email TEXT,
            photo TEXT,
            portfolio TEXT,
            skills TEXT,
            role TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

@app.route("/verify-and-add", methods=["POST"])
def verify_and_add():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    photo = data.get("photo")
    portfolio = data.get("portfolio")
    skills = data.get("skills")
    role = data.get("role")

    # NLP Verification
    if verify_portfolio(portfolio, skills):
        # Add to DB
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO profiles (name, phone, email, photo, portfolio, skills, role)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (name, phone, email, photo, portfolio, json.dumps(skills), role))
        conn.commit()
        conn.close()

        send_success_email(email, name)
        return jsonify({"message": "Profile verified and added"}), 200
    else:
        send_failure_email(email, name, portfolio)
        return jsonify({"message": "Portfolio verification failed", "reason": "Missing expected sections or mismatch"}), 400

@app.route("/profiles", methods=["GET"])
def get_profiles():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT name, phone, email, photo, portfolio, skills, role FROM profiles")
    rows = cursor.fetchall()
    conn.close()

    profiles = []
    for row in rows:
        profiles.append({
            "name": row[0],
            "phone": row[1],
            "email": row[2],
            "photo": row[3],
            "portfolio": row[4],
            "skills": json.loads(row[5]),
            "role": row[6]
        })

    return jsonify({"profiles": profiles})

if __name__ == "__main__":
    app.run(debug=True)
