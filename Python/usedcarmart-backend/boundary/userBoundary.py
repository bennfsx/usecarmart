# user_boundary.py

from flask import Blueprint, request, jsonify
from controller.controller import handle_register, handle_login, get_user_profile_controller, update_user_profile_controller, handle_change_password

user_blueprint = Blueprint('user', __name__)

# Register route
@user_blueprint.route('/register', methods=['POST'])
def register():
    user_data = request.get_json()
    result = handle_register(user_data)
    return jsonify(result)

# Login route
@user_blueprint.route('/login', methods=['POST'])
def login():
    login_data = request.get_json()
    result = handle_login(login_data)
    return jsonify(result)

# Route to get user profile by ID (GET request)
@user_blueprint.route('/profile/<int:user_id>', methods=['GET'])
def get_user_profile(user_id):
    user_data = get_user_profile_controller(user_id)
    if user_data:
        return jsonify(user_data), 200
    return jsonify({"message": "User not found"}), 404

# Route to edit user profile by ID (PUT request)
@user_blueprint.route('/profile/<int:user_id>', methods=['PUT'])
def edit_user_profile(user_id):
    data = request.get_json()  # Get data from the request body
    updated_user = update_user_profile_controller(user_id, data)  # Call the controller method
    if updated_user:
        return jsonify({"message": "Profile updated successfully", "user": updated_user}), 200
    return jsonify({"message": "Failed to update profile"}), 500

# Route to change password (PUT request)
@user_blueprint.route('/profile/<int:user_id>/password', methods=['PUT'])
def change_password(user_id):
    data = request.get_json()  # Get data from the request body
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if not current_password or not new_password:
        return jsonify({"error": "Current and new passwords are required"}), 400

    result = handle_change_password(user_id, current_password, new_password)
    return jsonify(result)
