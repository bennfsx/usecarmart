from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify
from supabase import create_client, Client
import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS  # Import CORS
from boundary.carBoundary import car_blueprint
from boundary.loanBoundary import loan_blueprint
from boundary.userBoundary import user_blueprint
from boundary.favoriteBoundary import favorite_blueprint
# Load environment variables
load_dotenv()

# Access the environment variables
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes, allowing requests from localhost:3000
CORS(app, resources={r"/*": {"origins": "*"}})

# Logout Route (Optional)
@app.route('/logout', methods=['POST'])
def logout():
    # This is just a placeholder, as the client will manage token removal.
    return jsonify({"message": "Logout successful"}), 200

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
