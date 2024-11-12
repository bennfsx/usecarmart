import sys
import os
import json
import pytest
import time  # Import time to generate unique email addresses for tests

# Add the path to 'usedcarmart-backend' to the system path so the test can access the app module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../usedcarmart-backend')))

# Import the Flask app from the app.py file
from app import app

# Define a fixture to set up a test client for Flask
@pytest.fixture
def client():
    """
    Fixture that sets up a test client for Flask. This client allows simulating HTTP requests
    to the app for testing purposes. The test client will be yielded to the test functions.
    """
    from app import app  # Import the Flask app
    app.config['TESTING'] = True  # Enable testing mode in Flask config
    with app.test_client() as client:  # Create a test client to simulate requests
        yield client  # Yield the test client to the test function

# Test the database connection route
def test_db_connection(client):
    """
    Test function that sends a GET request to the '/test-db' route to check if the database
    is connected successfully. It checks that the response status is 200 (OK).
    """
    # Send a GET request to the '/test-db' route to test if the database is connected successfully
    response = client.get('/test-db')

    # Print the response data and status code for debugging purposes
    print(f"DB Connection Response Data: {response.data}")
    print(f"DB Connection Status Code: {response.status_code}")

    # Assert that the response status code is 200 (OK), indicating a successful connection to the database
    assert response.status_code == 200

# Define a fixture to handle user registration
@pytest.fixture
def registered_user(client):
    """
    Fixture that registers a new user and returns their email address and the response
    for use in other tests. The email is generated using a timestamp to ensure uniqueness.
    """
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

    # Print the registration response data for debugging purposes
    print(f"Registration Response Data: {response.data}")
    print(f"Registration Status Code: {response.status_code}")

    # Assert that the response status code is 201 (Created), indicating successful registration
    assert response.status_code == 201

    # Return the registration data (email, etc.) for use in other tests
    return email, response

# Test the login route
def test_login(client, registered_user):
    """
    Test function to verify that a registered user can successfully log in with their
    email and password. It checks that the response status is 200 (OK) upon successful login.
    """
    email, _ = registered_user  # Unpack the registered user data

    # Now, test the login functionality with the registered email and password
    login_data = {
        "email": email,
        "password": "password123"
    }
    response = client.post('/login', data=json.dumps(login_data), content_type='application/json')

    # Print the login response data and status code
    print(f"Login Response Data: {response.data}")
    print(f"Login Status Code: {response.status_code}")

    # Assert that the response status code is 200 (OK), indicating successful login
    assert response.status_code == 200