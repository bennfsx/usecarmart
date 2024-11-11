from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(url, key)

def create_user(user_data):
    response = supabase.table("users").insert(user_data).execute()
    if response.status_code == 201:
        return response.data[0]
    return None

def verify_user(email, password):
    response = supabase.table("users").select("*").eq("email", email).eq("password", password).execute()
    if response.status_code == 200 and response.data:
        return response.data[0]
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