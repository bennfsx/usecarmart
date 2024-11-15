from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(url, key)

def create_car(description, price, title, image_url, seller_id, agent_id):
    # Example car data structure with added agent_id field
    car_data = {
        "description": description,
        "price": price,
        "title": title,
        "image_url": image_url,
        "seller_id": seller_id,
        "agent_id": agent_id,  # Include agent_id in the car listing
        "views": 0,
        "created_at": "now()"
    }

    try:
        # Insert car data into the "car_listings" table in Supabase
        response = supabase.table("car_listings").insert(car_data).execute()

        # Debug: print the whole response to understand its structure
        print(f"Response: {response}")

        # Check if the response has an error (this might not be a simple `.error` attribute)
        if hasattr(response, 'error') and response.error:
            print(f"Error creating car listing: {response.error}")
            return {"message": "Failed to create car listing", "error": response.error}, 400  # Bad Request if there's an error

        # Assuming the successful response contains `data`
        if hasattr(response, 'data') and response.data:
            # Return the created car's data (first item in response.data) and a 201 status code (Created)
            return {"message": "Car listed successfully", "car_id": response.data[0]['id']}, 201
        
        # If there is no data, handle unexpected cases
        return {"message": "Unexpected response structure from Supabase"}, 500  # Internal Server Error
    
    except Exception as e:
        # Log the error for debugging
        print(f"Error creating car listing: {e}")
        return {"message": "An error occurred while creating car listing"}, 500  # Internal Server Error


# def get_car_by_id(car_id):
#     """
#     Fetches a car listing by its ID from the database.
#     """
#     try:
#         response = supabase.table('car_listings').select('*').eq('id', car_id).single().execute()
#         return response.data if response.data else None
#     except Exception as e:
#         print(f"Error fetching car by ID: {e}")
#         return None

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
    Fetches a car listing by its ID and includes agent details by querying the users table.
    """
    try:
        # Step 1: Fetch the car listing
        car_response = supabase.table('car_listings').select('*').eq('id', car_id).single().execute()
        car_data = car_response.data

        if not car_data:
            return None  # Return None if no car listing is found

        # Step 2: Fetch the agent details using agent_id from the car listing
        agent_id = car_data.get('agent_id')
        if agent_id:
            agent_response = supabase.table('users').select('id, name, email, phone_number').eq('id', agent_id).single().execute()
            agent_data = agent_response.data
            if agent_data:
                car_data['agent_details'] = agent_data  # Add agent details to the car data

        return car_data

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
    
def increment_views(car_id):
    """
    Increments the view count for the given car listing.
    """
    try:
        # Get the current views count first
        car_listing = supabase.table('car_listings').select('views').eq('id', car_id).execute()

        if car_listing.data:
            # Get current views value
            current_views = car_listing.data[0]['views']
            
            # Update views by incrementing
            response = supabase.table('car_listings').update({'views': current_views + 1}).eq('id', car_id).execute()

            # Check the response
            if response.data:
                print(f"Successfully updated views for car listing {car_id}")
            else:
                print(f"Failed to update views for car listing {car_id}")
        else:
            print(f"Car listing with ID {car_id} not found.")
        
    except Exception as e:
        print(f"Error updating views for car listing {car_id}: {e}")

def delete_car_listing_from_db(car_id, seller_id):
    """
    Deletes the car listing from the database if the seller is the owner.
    """
    try:
        # Fetch the car listing by ID
        car_listing = get_car_by_id(car_id)
        if not car_listing:
            return False  

        if car_listing['seller_id'] != seller_id:
            return False  

        # Perform the deletion of the car listing from the database
        response = supabase.table('car_listings').delete().eq('id', car_id).execute()

        # Check if the deletion was successful
        if response.data:
            return True
        return False
    except Exception as e:
        print(f"Error deleting car listing: {e}")
        return False
