# Import necessary modules
import sys
import os
import json  # Import json module to handle JSON data
import pytest
import time  # Import time to generate unique email addresses for tests

# Add the path to 'usedcarmart-backend' to the system path so the test can access the app module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../usedcarmart-backend')))

# Import the Flask app from the app.py file
from app import app

# Define a fixture to set up a test client for Flask
@pytest.fixture
def client():
    from app import app  # Import the Flask app
    app.config['TESTING'] = True  # Enable testing mode in Flask config
    with app.test_client() as client:  # Create a test client to simulate requests
        yield client  # Yield the test client to the test function

# Test the registration route
def test_register(client):
    # Use a unique email by appending the current timestamp to avoid duplication
    email = f"testuser_{int(time.time())}@example.com"
    
    # Prepare the data for registration
    data = {
        "email": email,
        "password": "password123",
        "role": "buyer"  # Assign role as 'buyer'
    }

    # Send a POST request to the '/register' route with the user data
    response = client.post('/register', data=json.dumps(data), content_type='application/json')

    # Print the response data for debugging purposes
    print(response.data)

    # Assert that the response status code is 201 (Created), indicating successful registration
    assert response.status_code == 201

# Test the login route
def test_login(client):
    # Register a user first to use for login testing, with a unique email
    email = f"testuser_{int(time.time())}@example.com"  # Create a unique email for registration
    data = {
        "email": email,
        "password": "password123",
        "role": "buyer"  # Assign role as 'buyer'
    }

    # Register the user and assert that the registration is successful (status code 201)
    register_response = client.post('/register', data=json.dumps(data), content_type='application/json')
    assert register_response.status_code == 201
    
    # Now, test the login functionality with the registered email and password
    login_data = {
        "email": email,
        "password": "password123"
    }
    response = client.post('/login', data=json.dumps(login_data), content_type='application/json')

    # Print the response data for debugging purposes
    print(response.data)

    # Assert that the response status code is 200 (OK), indicating successful login
    assert response.status_code == 200

# Test the database connection route
def test_db_connection(client):
    # Send a GET request to the '/test-db' route to test if the database is connected successfully
    response = client.get('/test-db')

    # Print the response data for debugging purposes
    print(response.data)

    # Assert that the response status code is 200 (OK), indicating a successful connection to the database
    assert response.status_code == 200