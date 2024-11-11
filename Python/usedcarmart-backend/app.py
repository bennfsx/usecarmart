from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify
from supabase import create_client, Client
import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS  # Import CORS
from boundary.carBoundary import car_blueprint  # Import the car blueprint
from boundary.loanBoundary import loan_blueprint
from boundary.userBoundary import user_blueprint

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


# Connect to Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Register Route
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')  # Role could be 'admin', 'seller', 'buyer', or 'agent'

    # Check if the email already exists
    existing_user_response = supabase.table('users').select('*').eq('email', email).execute()

    if existing_user_response.data:
        return jsonify({"message": "Email is already registered."}), 400  # Email already exists

    # Hash the password for storage
    hashed_password = generate_password_hash(password)

    # Insert the new user into Supabase
    response = supabase.table('users').insert({
        'email': email,
        'password': hashed_password,
        'role': role
    }).execute()

    # Check if the user was created successfully
    if response.data:
        return jsonify({"message": "User registered successfully!"}), 201
    else:
        return jsonify({"message": "Failed to register user", "details": response.data}), 500

# Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Fetch user details from Supabase by email
    response = supabase.table('users').select('*').eq('email', email).single().execute()

    # Check if user exists
    if not response.data:
        return jsonify({"message": "Email not registered"}), 404  # Email does not exist

    user_data = response.data

    # Verify password
    if check_password_hash(user_data['password'], password):
        # Create JWT token
        payload = {
            'id': user_data['id'],
            'role': user_data['role'],
            'exp': datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
        }
        token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')

        return jsonify({"message": "Login successful", "token": token}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401  # Invalid password

# Test DB Connection Route
@app.route('/test-db', methods=['GET'])
def test_db_connection():
    try:
        # Attempt to select all rows from the 'users' table
        response = supabase.table('users').select('*').limit(1).execute()

        # Check if data is retrieved successfully
        if response.get('data') is not None:
            return jsonify({"status": "success", "data": response['data']})
        else:
            return jsonify({"status": "error", "message": "No data found or connection issue"}), 500
    except Exception as e:
        # Handle exceptions such as connection errors
        return jsonify({"status": "error", "message": str(e)}), 500

# Logout Route (Optional)
@app.route('/logout', methods=['POST'])
def logout():
    # This is just a placeholder, as the client will manage token removal.
    return jsonify({"message": "Logout successful"}), 200


app.register_blueprint(car_blueprint)
app.register_blueprint(loan_blueprint, url_prefix='/')
app.register_blueprint(user_blueprint, url_prefix='/')

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
