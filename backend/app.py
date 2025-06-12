from flask import Flask, request, jsonify
from verifier import verify_portfolio

app = Flask(__name__)

@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    skills = [s.strip() for s in data['skills']]

    is_verified = verify_portfolio(data['portfolio'], skills)
    if is_verified:
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'status': 'failed'}), 400

if __name__ == '__main__':
    app.run(debug=True)
