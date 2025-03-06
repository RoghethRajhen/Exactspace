from flask import Flask, jsonify
import json

app = Flask(__name__)

@app.route('/')
def serve_scraped():
    try:
        with open('scraped_data.json', 'r') as file:
            data = json.load(file)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": "No scraped data available."}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
