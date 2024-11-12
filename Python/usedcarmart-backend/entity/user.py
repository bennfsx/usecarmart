from supabase import create_client, Client
import os
from dotenv import load_dotenv
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
# Load environment variables
load_dotenv()

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(url, key)

def check_user_exists(email):
    # Query Supabase to check if the email already exists
    response = supabase.table("users").select("*").eq("email", email).execute()
    
    # Check if any user with this email exists
    return len(response.data) > 0

def create_user(email, password, role):
    # Insert new user data into Supabase
    response = supabase.table("users").insert({
        'email': email,
        'password': password,
        'role': role
    }).execute()

    # Return True if the user was created successfully, False otherwise
    return bool(response.data)

def verify_user(email):
    # Query Supabase for the user by email
    response = supabase.table("users").select("*").eq("email", email).single().execute()
    if response.data:
        return response.data
    elif response.error:
        print(f"Error during user verification: {response.error}")
    return None


# Fetch user profile by ID
def get_user_profile(user_id):
    response = supabase.table("users").select("*").eq("id", user_id).execute()
    if response.data:
        return response.data[0]  # If the response contains data, return it
    elif response.error:
        print(f"Error fetching user profile: {response.error}")
    return None  # Return None if no data or an error occurs

# Update user profile by ID
def update_user_profile(user_id, profile_data):
    # Perform the update operation
    response = supabase.table("users").update(profile_data).eq("id", user_id).execute()
    
    # Check if the response contains an error
    if response.data is None:
        print(f"Error updating user profile: {response.error}")
        return None  # Return None if there was an error
    
    # If no error, return the updated data
    return response.data[0] if response.data else None

# Update user's password
def update_user_password(user_id, new_password_hash):
    response = supabase.table("users").update({"password": new_password_hash}).eq("id", user_id).execute()
    if response.status_code == 200 and response.data:
        return True
    return False