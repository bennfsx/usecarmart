# PYTHONPATH=Python/usedcarmart-backend pytest -v -s Python/tests/test_user.py

import pytest
from unittest.mock import patch, MagicMock
from entity.user import check_user_exists, create_user, verify_user, get_user_profile, update_user_profile, update_user_password
from werkzeug.security import generate_password_hash
import sys
import os

# Append the usedcarmart-backend path to sys.path to import modules correctly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../usedcarmart-backend')))

# Test data: Define some test data that will be used in the test cases
test_email = "testuser@example.com"  # Email of the test user
test_password = "securepassword"  # Password for the test user
test_password_hash = generate_password_hash(test_password)  # Hash the password using Werkzeug
test_role = "user"  # Role of the user
test_user_id = 1  # ID of the test user
profile_data = {"role": "admin"}  # New profile data to update the user profile

# Fixture to mock the supabase object used for database interaction
@pytest.fixture
def supabase_mock():
    with patch("entity.user.supabase") as mock_supabase:  # Mocking the 'supabase' object
        yield mock_supabase  # Return the mocked object to the test function

# Test case for the function 'check_user_exists' which checks if a user exists by email
def test_check_user_exists(supabase_mock):
    # Mock the response for an existing user
    supabase_mock.table().select().eq().execute.return_value.data = [{"email": test_email}]
    result = check_user_exists(test_email)
    print(f"Check user exists (existing user): Expected True, Got {result}")  # Print expected and actual result
    assert result is True, f"Expected True, but got {result}"  # Show message on failure

    # Mock the response for a non-existing user
    supabase_mock.table().select().eq().execute.return_value.data = []
    result = check_user_exists("nonexistent@example.com")
    print(f"Check user exists (non-existing user): Expected False, Got {result}")
    assert result is False, f"Expected False, but got {result}"

# Test case for the function 'create_user' which creates a new user in the database
def test_create_user(supabase_mock):
    # Mock the response for a successful user creation
    supabase_mock.table().insert().execute.return_value.data = [{"id": test_user_id}]
    result = create_user(test_email, test_password_hash, test_role)
    print(f"Create user (successful): Expected True, Got {result}")
    assert result is True, f"Expected True, but got {result}"

    # Mock the response for a failed user creation
    supabase_mock.table().insert().execute.return_value.data = None
    result = create_user("newuser@example.com", test_password_hash, test_role)
    print(f"Create user (failure): Expected False, Got {result}")
    assert result is False, f"Expected False, but got {result}"

# Test case for the function 'verify_user' which checks if a user exists by email and retrieves user data
def test_verify_user(supabase_mock):
    # Mock the response for an existing user
    supabase_mock.table().select().eq().single().execute.return_value.data = {"email": test_email}
    result = verify_user(test_email)
    print(f"Verify user (existing user): Expected {{'email': '{test_email}'}}, Got {result}")
    assert result == {"email": test_email}, f"Expected {{'email': '{test_email}}}, but got {result}"

    # Mock the response for a non-existing user
    supabase_mock.table().select().eq().single().execute.return_value.data = None
    result = verify_user("unknown@example.com")
    print(f"Verify user (non-existing user): Expected None, Got {result}")
    assert result is None, f"Expected None, but got {result}"

# Test case for the function 'get_user_profile' which fetches a user's profile by ID
def test_get_user_profile(supabase_mock):
    # Mock the response for an existing user ID
    supabase_mock.table().select().eq().execute.return_value.data = [{"id": test_user_id, "email": test_email}]
    result = get_user_profile(test_user_id)
    print(f"Get user profile (existing ID): Expected {{'id': {test_user_id}, 'email': '{test_email}'}}, Got {result}")
    assert result == {"id": test_user_id, "email": test_email}, f"Expected {{'id': {test_user_id}, 'email': '{test_email}}}, but got {result}"

    # Mock the response for a non-existing user ID
    supabase_mock.table().select().eq().execute.return_value.data = []
    result = get_user_profile(9999)
    print(f"Get user profile (non-existing ID): Expected None, Got {result}")
    assert result is None, f"Expected None, but got {result}"

# Test case for the function 'update_user_profile' which updates the user's profile data
def test_update_user_profile(supabase_mock):
    # Mock the response for a successful profile update
    supabase_mock.table().update().eq().execute.return_value.data = [{"id": test_user_id, **profile_data}]
    result = update_user_profile(test_user_id, profile_data)
    print(f"Update user profile (successful): Expected {{'id': {test_user_id}, **profile_data}}, Got {result}")
    assert result == {"id": test_user_id, **profile_data}, f"Expected {{'id': {test_user_id}, **profile_data}}, but got {result}"

    # Mock the response for a failed profile update
    supabase_mock.table().update().eq().execute.return_value.data = None
    result = update_user_profile(test_user_id, profile_data)
    print(f"Update user profile (failure): Expected None, Got {result}")
    assert result is None, f"Expected None, but got {result}"

# Test case for the function 'update_user_password' which updates the user's password
def test_update_user_password(supabase_mock):
    # Mock the response for a successful password update
    supabase_mock.table().update().eq().execute.return_value.status_code = 200
    supabase_mock.table().update().eq().execute.return_value.data = [{"id": test_user_id}]
    result = update_user_password(test_user_id, test_password_hash)
    print(f"Update user password (successful): Expected True, Got {result}")
    assert result is True, f"Expected True, but got {result}"

    # Mock the response for a failed password update
    supabase_mock.table().update().eq().execute.return_value.status_code = 400
    result = update_user_password(test_user_id, test_password_hash)
    print(f"Update user password (failure): Expected False, Got {result}")
    assert result is False, f"Expected False, but got {result}"
