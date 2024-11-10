from flask import Blueprint, request, jsonify
from controller.controller import handle_register, handle_login  # Corrected import

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
