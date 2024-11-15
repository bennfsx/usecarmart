from entity.user import (
    create_user, verify_user, get_user_profile, update_user_profile, update_user_password, check_user_exists, get_user_profile_from_db, get_reviews_for_agent_from_db, get_all_agents
)
from utils.jwt_utils import generate_token
from entity.car import (
    create_car, get_car_by_id, update_car_interests, get_car_listings, update_car,
    increment_views, delete_car_listing_from_db
)
from entity.favorite import FavoriteEntity
import jwt
from datetime import datetime, timedelta
from werkzeug.security import check_password_hash, generate_password_hash

from entity.review import ReviewEntity

# --- User Registration and Login Logic ---
def handle_register(data):
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    # Check if the user already exists
    if check_user_exists(email):
        return {"message": "Email is already registered."}, 400 

    # Hash the password for storage
    hashed_password = generate_password_hash(password)

    # Insert the new user
    if create_user(email, hashed_password, role):
        return {"message": "User registered successfully!"}, 201  
    else:
        return {"message": "Failed to register user"}, 500  

def handle_login(login_data):
    email = login_data.get('email')
    password = login_data.get('password')

    # Call the entity layer to verify the user
    user = verify_user(email=email)  # Only pass email here

    if user and check_password_hash(user['password'], password):
        # Create JWT token upon successful login
        payload = {
            'id': user['id'],
            'role': user['role'],
            'exp': datetime.utcnow() + timedelta(hours=1)
        }
        token = jwt.encode(payload, "JWT_SECRET_KEY", algorithm='HS256')
        return {"message": "Login successful", "token": token}, 200
    else:
        return {"message": "Invalid credentials"}, 401

# --- Car Listing Logic ---
def handle_list_car(car_data):
    description = car_data.get('description')
    price = car_data.get('price')
    title = car_data.get('title')
    image_url = car_data.get('image_url')
    seller_id = car_data.get('seller_id')
    agent_id = car_data.get('agent_id')  # New agent field

    if not description or not price or not title or not agent_id:
        return {"message": "Missing required fields"}, 400

    car = create_car(description, price, title, image_url, seller_id, agent_id)
    if car:
        return {"message": "Car listed successfully", "car": car}
    return {"message": "Error listing car"}, 500


def get_car_listing(car_id):
    increment_views(car_id)
    car = get_car_by_id(car_id)
    if car:
        return {"car": car}
    return {"message": "Car not found"}, 404

def handle_update_car_interests(car_id, action):
    if action not in ['view', 'shortlist']:
        return {"message": "Invalid action"}, 400

    car = update_car_interests(car_id, action)
    if car:
        return {"message": f"Car {action} count updated successfully", "car": car}
    return {"message": "Error updating interests"}, 500

def handle_get_car_listings(page, limit, search_query, min_price, max_price, sort_by, sort_order):
    listings, total_pages = get_car_listings(page, limit, search_query, min_price, max_price, sort_by, sort_order)
    return {"listings": listings, "total_pages": total_pages}

def fetch_single_car_listing(car_id):
    increment_views(car_id)
    car_listing = get_car_by_id(car_id)
    if car_listing:
        return car_listing
    return {"message": "Car listing not found"}, 404

def update_single_car_listing(car_id, data, seller_id):
    car_listing = get_car_by_id(car_id)
    if not car_listing:
        return {"message": "Car listing not found"}, 404

    if car_listing['seller_id'] != seller_id:
        return {"message": "Unauthorized: Only the owner can update this listing"}, 403

    updated_listing = update_car(car_id, data)
    if updated_listing:
        return {"message": "Listing updated successfully", "car": updated_listing}, 200
    return {"message": "Failed to update listing"}, 500

def delete_car_listing(car_id, seller_id):
    success = delete_car_listing_from_db(car_id, seller_id)
    return success

def calculate_monthly_payment(price, down_payment, interest_rate, loan_term_years):
    loan_amount = price - down_payment
    monthly_rate = (interest_rate / 100) / 12
    total_payments = loan_term_years * 12

    if monthly_rate == 0:
        return loan_amount / total_payments

    monthly_payment = loan_amount * (monthly_rate * (1 + monthly_rate) ** total_payments) / ((1 + monthly_rate) ** total_payments - 1)
    return monthly_payment

# --- User Profile Logic ---
def get_user_profile_controller(user_id):
    return get_user_profile(user_id)

def update_user_profile_controller(user_id, profile_data):
    return update_user_profile(user_id, profile_data)

def handle_change_password(user_id, current_password, new_password):
    user = get_user_profile(user_id)
    if not user:
        return {"message": "User not found"}, 404

    if not check_password_hash(user['password'], current_password):
        return {"message": "Current password is incorrect"}, 400

    new_hashed_password = generate_password_hash(new_password)
    result = update_user_password(user_id, new_hashed_password)
    if result:
        return {"message": "Password changed successfully"}
    return {"message": "Failed to change password"}, 500

# --- Favorites Profile Logic ---
def add_to_favorites(buyer_id, listing_id):
    return FavoriteEntity.add_favorite(buyer_id, listing_id)

def get_favorites(buyer_id):
    return FavoriteEntity.get_favorites(buyer_id)

def search_favorites(buyer_id, search_query):
    return FavoriteEntity.search_favorites(buyer_id, search_query)

def delete_favorite(buyer_id, listing_id):
    print(f"Deleting favorite for buyer_id: {buyer_id}, listing_id: {listing_id}")
    return FavoriteEntity.delete_favorite(buyer_id, listing_id)

# --- Reviews function Logic ---
def create_review(agent_id, reviewer_id, role, rating, review_text):
    # Call the entity to create a review and return the result
    review = ReviewEntity.create_review(agent_id, reviewer_id, role, rating, review_text)
    return review

# Function to get reviews for a specific agent
def get_reviews_for_agent(agent_id):
    # Call the entity to get all reviews for the specified agent
    reviews = ReviewEntity.get_reviews_for_agent(agent_id)
    return reviews

# Function to get reviews by a specific reviewer
def get_reviews_by_reviewer(reviewer_id):
    # Call the entity to get all reviews written by the specified reviewer
    reviews = ReviewEntity.get_reviews_by_reviewer(reviewer_id)
    return reviews

def get_all_reviews():
    try:
        # Call the entity method to get all reviews
        return ReviewEntity.get_all_reviews()
    except Exception as e:
        return {"error": str(e)}

# --- Get Agent Logic  ---
def get_agent_details(agent_id):
    # Fetch the agent's profile using the entity layer
    agent_profile = get_user_profile_from_db(agent_id)
    if not agent_profile:
        return {"message": "Agent not found"}, 404
    
    # Fetch the agent's reviews using the entity layer
    agent_reviews = get_reviews_for_agent_from_db(agent_id)
    
    # Return the agent's profile along with the reviews
    return {
        "agent_profile": agent_profile,
        "reviews": agent_reviews
    }, 200
    
# Controller function to get all agents
def get_all_agents_details():
    try:
        agents_data = get_all_agents()  # Call the entity function to get agents
        if agents_data:
            return agents_data, 200  # Return the agents data with a success status code
        else:
            return {"message": "No agents found"}, 404  # If no agents are found
    except Exception as e:
        return {"message": str(e)}, 500  # Handle unexpected errors