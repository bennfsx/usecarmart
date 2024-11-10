from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(url, key)

def create_car(description, price, title, image_url, seller_id):
    """
    Creates a new car listing in the database.
    """
    try:
        response = supabase.table('car_listings').insert({
            'description': description,
            'price': price,
            'title': title,
            'image_url': image_url,
            'seller_id': seller_id,
            'views': 0,  # Initial views count
            'shortlist_count': 0  # Initial shortlist count
        }).execute()

        # Check if the response contains the data
        if response.data:
            return {
                "message": "Car listing created successfully!",
                "car": response.data[0]
            }, 201  # Returning success message with the created car data
        else:
            return {
                "message": "Failed to create car listing",
                "details": response.error
            }, 500  # Returning failure message with error details

    except Exception as e:
        print(f"Error creating car: {e}")
        return {
            "message": "Error occurred while creating car listing",
            "error": str(e)
        }, 500  # Handling general errors and returning failure message

def get_car_by_id(car_id):
    """
    Fetches a car listing by its ID from the database.
    """
    try:
        response = supabase.table('car_listings').select('*').eq('id', car_id).single().execute()
        return response.data if response.data else None
    except Exception as e:
        print(f"Error fetching car by ID: {e}")
        return None

def update_car_interests(car_id, action):
    """
    Updates the interests (views or shortlist count) for a car listing.
    """
    try:
        if action == 'view':
            response = supabase.table('car_listings').update({
                'views': supabase.raw('views + 1')
            }).eq('id', car_id).execute()
        elif action == 'shortlist':
            response = supabase.table('car_listings').update({
                'shortlist_count': supabase.raw('shortlist_count + 1')
            }).eq('id', car_id).execute()
        else:
            return None
        return response.data[0] if response.data else None
    except Exception as e:
        print(f"Error updating car interests: {e}")
        return None
    
def get_car_listings(page, limit):
    try:
        # Calculate the offset based on page and limit
        offset = (page - 1) * limit

        # Fetch car listings from Supabase with limit and offset
        response = supabase.table('car_listings') \
            .select('*') \
            .range(offset, offset + limit - 1) \
            .execute()

        # Fetch the total number of car listings for pagination
        total_count_response = supabase.table('car_listings') \
            .select('id') \
            .execute()

        total_count = len(total_count_response.data)
        total_pages = (total_count // limit) + (1 if total_count % limit != 0 else 0)

        # Return listings and total pages
        return response.data, total_pages
    except Exception as e:
        print(f"Error fetching car listings: {e}")
        return None, 0
    

def get_car_by_id(car_id):
    """
    Fetches a car listing by its ID.
    """
    try:
        response = supabase.table('car_listings').select('*').eq('id', car_id).single().execute()
        return response.data if response.data else None
    except Exception as e:
        print(f"Error fetching car by ID: {e}")
        return None

def update_car(car_id, data):
    """
    Updates an existing car listing if it exists.
    """
    try:
        response = supabase.table('car_listings').update(data).eq('id', car_id).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        print(f"Error updating car listing: {e}")
        return None
    

    