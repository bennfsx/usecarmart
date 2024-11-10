from flask import Blueprint, request, jsonify
from controller.controller import create_car, get_car_by_id, update_car_interests, get_car_listings, fetch_single_car_listing, update_single_car_listing, increment_views


# Create a Blueprint instance for car-related routes
car_blueprint = Blueprint('car', __name__)

# Route to list a car (POST request)
@car_blueprint.route('/list-car', methods=['POST'])
def list_car():
    car_data = request.get_json()  # Get JSON data from the request
    description = car_data.get('description')
    price = car_data.get('price')
    title = car_data.get('title')
    image_url = car_data.get('image_url')
    seller_id = car_data.get('seller_id')

    # Call the create_car function from controller
    result, status_code = create_car(description, price, title, image_url, seller_id)

    return jsonify(result), status_code  # Return the response with result and status code

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
        # Get pagination parameters from query string, default to page 1 and limit 5
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 8))

        # Call the get_car_listings function from controller
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


@car_blueprint.route('/car-listings/<int:car_id>', methods=['GET', 'PUT'])
def car_listing(car_id):
    if request.method == 'GET':
        # Increment the views count every time the car listing is viewed
        increment_views(car_id)

        # Fetch the updated car listing by ID
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

        # Extract the seller_id from the data
        seller_id = data.get('seller_id')  # Ensure seller_id is passed in the request body

        # Ensure that the logged-in seller can only edit their own listing
        if car_listing['seller_id'] != seller_id:
            return jsonify({"message": "Unauthorized to edit this listing"}), 403

        # Now call the update function with car_id, seller_id, and data
        updated_listing = update_single_car_listing(car_id, seller_id, data)

        if updated_listing:
            return jsonify({"message": "Listing updated successfully", "car": updated_listing}), 200
        return jsonify({"message": "Failed to update listing"}), 500
