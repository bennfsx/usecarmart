from entity.user import create_user, verify_user
from utils.jwt_utils import generate_token
from entity.car import create_car, get_car_by_id, update_car_interests, get_car_listings, update_car, get_car_by_id, increment_views


# --- User Registration and Login Logic ---
def handle_register(user_data):
    """
    Handles user registration logic.
    """
    user = create_user(user_data)
    if user:
        return {"message": "User created successfully", "user": user}
    return {"message": "Error creating user"}, 400

def handle_login(login_data):
    """
    Handles user login logic and returns JWT token if successful.
    """
    email = login_data.get("email")
    password = login_data.get("password")
    
    user = verify_user(email, password)
    if user:
        token = generate_token(user)
        return {"message": "Login successful", "token": token}
    return {"message": "Invalid credentials"}, 401

# --- Car Listing Logic ---
def handle_list_car(car_data):
    """
    Handles car listing creation logic.
    """
    description = car_data.get('description')
    price = car_data.get('price')
    title = car_data.get('title')
    image_url = car_data.get('image_url')
    seller_id = car_data.get('seller_id')  # Should be the logged-in user's ID

    if not description or not price or not title:
        return {"message": "Missing required fields"}, 400

    # Create car listing in the database
    car = create_car(description, price, title, image_url, seller_id)
    if car:
        return {"message": "Car listed successfully", "car": car}
    return {"message": "Error listing car"}, 500

def get_car_listing(car_id):
    """
    Handles fetching car listing details by ID.
    This function increments the views count before fetching the car details.
    """
    # Increment the views count before fetching car details
    increment_views(car_id)

    car = get_car_by_id(car_id)
    if car:
        return {"car": car}
    return {"message": "Car not found"}, 404

def handle_update_car_interests(car_id, action):
    """
    Handles updating car interests (views or shortlist).
    """
    if action not in ['view', 'shortlist']:
        return {"message": "Invalid action"}, 400

    car = update_car_interests(car_id, action)
    if car:
        return {"message": f"Car {action} count updated successfully", "car": car}
    return {"message": "Error updating interests"}, 500

def handle_get_car_listings(page, limit, search_query, min_price, max_price, sort_by, sort_order):
    """
    Handles fetching car listings with pagination, filters, and sorting.
    """
    listings, total_pages = get_car_listings(page, limit, search_query, min_price, max_price, sort_by, sort_order)
    return {
        "listings": listings,
        "total_pages": total_pages
    }

def fetch_single_car_listing(car_id):
    """
    Retrieves a car listing by ID.
    """
    # Increment the views count before returning the car listing
    increment_views(car_id)

    car_listing = get_car_by_id(car_id)
    if car_listing:
        return car_listing
    return {"message": "Car listing not found"}, 404

def update_single_car_listing(car_id, data, seller_id):
    """
    Updates a car listing if the requester is the owner.
    """
    car_listing = get_car_by_id(car_id)
    if not car_listing:
        return {"message": "Car listing not found"}, 404

    # Check if the requester is the owner
    if car_listing['seller_id'] != seller_id:
        return {"message": "Unauthorized: Only the owner can update this listing"}, 403

    # Perform the update
    updated_listing = update_car(car_id, data)
    if updated_listing:
        return {"message": "Listing updated successfully", "car": updated_listing}, 200
    return {"message": "Failed to update listing"}, 500