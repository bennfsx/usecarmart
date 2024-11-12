from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from boundary.carBoundary import car_blueprint
from boundary.loanBoundary import loan_blueprint
from boundary.userBoundary import user_blueprint
from boundary.favoriteBoundary import favorite_blueprint
# Load environment variables
load_dotenv()


# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes, allowing requests from localhost:3000
CORS(app, resources={r"/*": {"origins": "*"}})

app.register_blueprint(car_blueprint)
app.register_blueprint(loan_blueprint, url_prefix='/')
app.register_blueprint(user_blueprint, url_prefix='/')
app.register_blueprint(favorite_blueprint, url_prefix='/')

@app.before_request
def handle_preflight():
    if request.method == 'OPTIONS':
        response = jsonify({"message": "OK"})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        return response


if __name__ == '__main__':
    app.run(debug=True, port=8000)
