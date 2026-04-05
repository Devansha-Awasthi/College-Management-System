import json
import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enables Cross-Origin requests for your frontend

# Path to your JSON data
DATA_DIR = "data"
STUDENT_FILE = os.path.join(DATA_DIR, "students.json")

# Helper to ensure data directory exists
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

def load_data(file_path):
    try:
        if os.path.exists(file_path):
            with open(file_path, "r") as f:
                return json.load(f)
        return []
    except Exception:
        return []

def save_data(file_path, data):
    with open(file_path, "w") as f:
        json.dump(data, f, indent=4)

# --- FRONTEND ROUTES ---
@app.route('/')
def index():
    # Explicitly serve the main page
    return send_from_directory('frontend', 'index.html')

@app.route('/frontend/<path:path>')
def static_files(path):
    # Explicitly serve files from the frontend folder
    return send_from_directory('frontend', path)

# This is a safer "Catch-all" if your JS/CSS is in the root of /frontend
@app.route('/<path:filename>')
def fallback(filename):
    if '.' in filename: # If it's a file like script.js
        return send_from_directory('frontend', filename)
    return send_from_directory('frontend', 'index.html')

# --- API ROUTES ---
@app.route('/api/students', methods=['GET'])
def get_students():
    return jsonify(load_data(STUDENT_FILE))

@app.route('/api/students', methods=['POST'])
def add_student():
    student_data = request.json
    students = load_data(STUDENT_FILE)
    
    new_student = {
        "ID": student_data.get("id"),
        "Name": student_data.get("name"),
        "Course": student_data.get("course")
    }
    
    students.append(new_student)
    save_data(STUDENT_FILE, students)
    return jsonify({"message": "Student added successfully"}), 201

# Add similar routes for Faculty, Courses, etc. as needed

if __name__ == "__main__":
    # Internal port 3000 to match your Dockerfile and K8s Service
    app.run(host='0.0.0.0', port=3000, debug=False)