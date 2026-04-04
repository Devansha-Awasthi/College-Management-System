from flask import Flask, jsonify
import json

app = Flask(__name__)

FILE = "data/students.json"

def load_data():
    try:
        with open(FILE, "r") as f:
            return json.load(f)
    except:
        return []

@app.route("/")
def home():
    return "College Management System Running"

@app.route("/students")
def get_students():
    return jsonify(load_data())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000)