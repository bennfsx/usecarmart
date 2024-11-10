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
