from flask import Blueprint, request, jsonify
from controller.controller import handle_register, handle_login, get_user_profile_controller, update_user_profile_controller, handle_change_password

user_blueprint = Blueprint('user', __name__)

# Register route in boundary layer
@user_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    result = handle_register(data)  # Pass the data to controller and get result and status
    return jsonify(result)  # Return the result and the status code directly

# Login route in boundary layer
@user_blueprint.route('/login', methods=['POST'])
def login():
    login_data = request.get_json()
    # Pass the login data to the controller to handle the logic
    message, status_code = handle_login(login_data)
    return jsonify(message), status_code


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

# Logout Route (Optional)
@user_blueprint.route('/logout', methods=['POST'])
def logout():
    # This is just a placeholder, as the client will manage token removal.
    return jsonify({"message": "Logout successful"}), 200