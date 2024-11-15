from flask import Blueprint, request, jsonify
from controller.controller import (
    create_car, 
    get_car_by_id, 
    update_car_interests, 
    get_car_listings, 
    update_single_car_listing, 
    increment_views, 
    delete_car_listing
)

# Create a Blueprint instance for car-related routes
car_blueprint = Blueprint('car', __name__)

# Route to list a car (POST request)
@car_blueprint.route('/list-car', methods=['POST'])
def list_car():
    # Gather form data
    description = request.json.get('description')
    price = request.json.get('price')
    title = request.json.get('title')
    image_url = request.json.get('image_url')
    seller_id = request.json.get('seller_id')
    agent_id = request.json.get('agent_id')

    # Call the create_car function and handle its return value
    result, status_code = create_car(description, price, title, image_url, seller_id, agent_id)

    # Check if the result is None, and handle appropriately
    if result is None:
        return {"message": "Error creating car listing"}, 400  # Bad Request error or you can use another code

    # If the car is created successfully
    return result, status_code
# Route to get car details by ID (GET request)
@car_blueprint.route('/car/<int:car_id>', methods=['GET'])
def get_car_listing(car_id):
    result = get_car_by_id(car_id)
    if result:
        return jsonify(result), 200
    else:
        return jsonify({"message": "Car listing not found"}), 404

# Route to update car interests (views or shortlist count) (POST request)
@car_blueprint.route('/car/<int:car_id>/update-interests', methods=['POST'])
def update_car_interests_route(car_id):
    data = request.get_json()
    action = data.get('action')

    result = update_car_interests(car_id, action)
    if result:
        return jsonify({"message": f"Car listing {action} updated successfully!"}), 200
    else:
        return jsonify({"message": "Failed to update car interests"}), 400

# Route to get a paginated list of car listings (GET request)
@car_blueprint.route('/car-listings', methods=['GET'])
def get_paginated_car_listings():
    try:
        # Get pagination parameters from query string, default to page 1 and limit 8
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 8))

        result, total_pages = get_car_listings(page, limit)

        if result:
            return jsonify({
                'listings': result,
                'totalPages': total_pages
            }), 200
        else:
            return jsonify({"message": "No car listings found"}), 404
    except Exception as e:
        print(f"Error fetching car listings: {e}")
        return jsonify({"message": "Error fetching car listings"}), 500

@car_blueprint.route('/car-listings/<int:car_id>', methods=['GET', 'PUT', 'DELETE'])
def car_listing(car_id):
    if request.method == 'GET':
        # Increment the views count every time the car listing is viewed
        increment_views(car_id)

        # Fetch the car listing by ID
        car_listing = get_car_by_id(car_id)
        if car_listing:
            return jsonify(car_listing), 200
        return jsonify({"message": "Car listing not found"}), 404

    elif request.method == 'PUT':
        # Get the car listing by ID
        car_listing = get_car_by_id(car_id)
        if not car_listing:
            return jsonify({"message": "Car listing not found"}), 404

        # Get the data from the request body
        data = request.get_json()

        # Extract seller_id from the data sent in the request
        seller_id = data.get('seller_id')

        # Ensure the logged-in seller can only edit their own listing
        if car_listing['seller_id'] != seller_id:
            return jsonify({"message": "Unauthorized to edit this listing"}), 403

        # Call the function to update the listing
        updated_listing = update_single_car_listing(car_id, data, seller_id)

        if updated_listing:
            return jsonify({"message": "Listing updated successfully", "car": updated_listing}), 200
        return jsonify({"message": "Failed to update listing"}), 500

    elif request.method == 'DELETE':
        # Get the car listing by ID
        car_listing = get_car_by_id(car_id)
        if not car_listing:
            return jsonify({"message": "Car listing not found"}), 404

        # Extract the seller_id from the request body (must match the logged-in seller)
        seller_id = request.get_json().get('seller_id')

        # Ensure that the logged-in seller can only delete their own listing
        if car_listing['seller_id'] != seller_id:
            return jsonify({"message": "Unauthorized to delete this listing"}), 403

        # Call the delete function with both car_id and seller_id
        delete_success = delete_car_listing(car_id, seller_id)

        if delete_success:
            return jsonify({"message": "Listing deleted successfully"}), 200
        return jsonify({"message": "Failed to delete listing"}), 500
