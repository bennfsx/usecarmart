# Focus on testing the controllers' logic and interactions with the service layer.

# controller/controller.py
import pytest
from unittest.mock import patch
from entity.user import check_user_exists, create_user, verify_user
from werkzeug.security import check_password_hash
from utils.jwt_utils import generate_token
from datetime import datetime, timedelta, timezone
import sys
import os

# --- Controller Functions ---
def handle_register(data):
    """
    Handles user registration by checking if the user already exists,
    and if not, creates a new user.

    Args:
    data (dict): The registration data (email, password, role).

    Returns:
    tuple: Response message and status code (e.g., 201 for success, 400 for existing email).
    """
    print("Entering handle_register")
    
    # Check if user exists
    if not check_user_exists(data['email']):
        print("User doesn't exist, creating new user")
        
        # Try to create the user in the database
        if create_user(data):
            return {'message': 'User registered successfully!'}, 201
        else:
            return {'message': 'Failed to register user.'}, 500
    else:
        print("User already exists")
        return {'message': 'Email is already registered.'}, 400

def handle_login(data):
    """
    Handles user login by verifying the user's credentials and generating a token.

    Args:
    data (dict): The login data (email, password).

    Returns:
    tuple: Response message, token (if login is successful), and status code (200 for success, 401 for failure).
    """
    print("Entering handle_login")
    
    # Verify the user exists and check password
    user = verify_user(data['email'])
    if user and check_password_hash(user['password'], data['password']):
        print(f"Login successful for user: {user['email']}")
        
        # Create the payload for JWT token (including expiration time)
        payload = {'id': user['id'], 'role': user['role'], 'exp': datetime.now(timezone.utc) + timedelta(hours=1)}
        token = generate_token(payload)  # Generate the token
        
        print(f"Generated token: {token}")
        return {'message': 'Login successful', 'token': token}, 200
    else:
        print("Invalid credentials")
        return {'message': 'Invalid credentials'}, 401

# Fix the path to the Python directory
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../Python')))

# Import the controller functions after fixing the path
from controller.controller import handle_register, handle_login

# --- Mock Fixtures for Unit Testing ---
@pytest.fixture
def mock_create_user():
    """Mock the create_user function from the entity.user module."""
    with patch('entity.user.create_user') as mock:
        yield mock

@pytest.fixture
def mock_check_user_exists():
    """Mock the check_user_exists function from the entity.user module."""
    with patch('entity.user.check_user_exists') as mock:
        yield mock

@pytest.fixture
def mock_verify_user():
    """Mock the verify_user function from the entity.user module."""
    with patch('entity.user.verify_user') as mock:
        yield mock

@pytest.fixture
def mock_generate_token():
    """Mock the generate_token function from the utils.jwt_utils module."""
    with patch('utils.jwt_utils.generate_token') as mock:
        # Mock the generate_token to return a fixed token value
        mock.return_value = 'mocked_token'
        yield mock

@pytest.fixture
def mock_check_password_hash():
    """Mock the check_password_hash function from werkzeug.security."""
    with patch('werkzeug.security.check_password_hash') as mock:
        yield mock

# --- User Registration Tests ---
def test_register_user(mock_create_user, mock_check_user_exists):
    """
    Test the user registration functionality when the user doesn't already exist.

    Asserts that the user is successfully created and a 201 status code is returned.
    """
    # Mock that the user does not exist in the system
    mock_check_user_exists.return_value = False
    # Mock that the user creation process is successful
    mock_create_user.return_value = True
    
    # Test data for user registration
    data = {'email': 'test@example.com', 'password': 'password123', 'role': 'buyer'}
    response, status_code = handle_register(data)
    
    # Ensure that create_user was called exactly once
    mock_create_user.assert_called_once()

    # Assert that the response status code is 201 (success)
    # and the correct success message is returned
    assert status_code == 201
    assert response['message'] == 'User registered successfully!'

def test_register_user_already_exists(mock_check_user_exists):
    """
    Test the user registration functionality when the user already exists.

    Asserts that a 400 status code is returned with the message "Email is already registered".
    """
    # Mock that the user already exists in the system
    mock_check_user_exists.return_value = True

    data = {'email': 'test@example.com', 'password': 'password123', 'role': 'buyer'}
    response, status_code = handle_register(data)
    
    # Assert that the status code is 400 (bad request)
    # and the error message for already existing email is returned
    assert status_code == 400
    assert response['message'] == 'Email is already registered.'

# --- User Login Tests ---
def test_login_success(mock_verify_user, mock_check_password_hash, mock_generate_token):
    """
    Test the user login functionality when the credentials are valid.

    Asserts that the login is successful and a token is generated.
    """
    user = {'id': 1, 'email': 'test@example.com', 'password': 'hashed_password', 'role': 'buyer'}
    
    # Define the payload for the token (including expiration time)
    payload = {
        'id': user['id'],
        'role': user['role'],
        'exp': datetime.now(timezone.utc) + timedelta(hours=1)
    }
    
    # Mock that the user exists and password matches
    mock_verify_user.return_value = user
    mock_check_password_hash.return_value = True
    mock_generate_token.return_value = 'mocked_token'

    login_data = {'email': 'test@example.com', 'password': 'password123'}
    
    # Add debug print to see the data being passed
    print(f"Calling handle_login with data: {login_data}")
    response, status_code = handle_login(login_data)

    # Ensure that generate_token was called once with the correct payload
    mock_generate_token.assert_called_once_with(payload)
    print(f"generate_token called with: {mock_generate_token.call_args}")

    # Assert that the response status code is 200 (success) and token is returned
    assert status_code == 200
    assert response['message'] == 'Login successful'
    assert response['token'] == 'mocked_token'

def test_login_invalid_credentials(mock_verify_user, mock_check_password_hash):
    """
    Test the user login functionality when the credentials are invalid.

    Asserts that the login fails and a 401 status code is returned.
    """
    # Mock that the user does not exist or the password is incorrect
    mock_verify_user.return_value = None
    mock_check_password_hash.return_value = False

    login_data = {'email': 'test@example.com', 'password': 'wrong_password'}
    response, status_code = handle_login(login_data)

    # Assert that the response status code is 401 (unauthorized)
    # and the correct error message is returned
    assert status_code == 401
    assert response['message'] == 'Invalid credentials'
