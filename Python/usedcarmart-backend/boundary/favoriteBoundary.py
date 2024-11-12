from flask import Blueprint, request, jsonify
from controller.controller import add_to_favorites, get_favorites, search_favorites, delete_favorite

favorite_blueprint = Blueprint('favorite', __name__)

@favorite_blueprint.route('/favorites', methods=['GET'])
def view_favorites():
    buyer_id = request.args.get('buyer_id')
    favorites = get_favorites(buyer_id)
    return jsonify(favorites), 200

@favorite_blueprint.route('/favorites', methods=['POST'])
def add_favorite():
    data = request.get_json()
    buyer_id = data.get('buyer_id')
    listing_id = data.get('listing_id')

    if not buyer_id or not listing_id:
        return jsonify({"error": "buyer_id and listing_id are required"}), 400
    
    result = add_to_favorites(buyer_id, listing_id)
    return jsonify(result), 201


@favorite_blueprint.route('/favorites', methods=['DELETE'])
def delete_favorite_route():
    data = request.get_json()
    buyer_id = data.get('buyer_id')
    listing_id = data.get('listing_id')

    if not buyer_id or not listing_id:
        return jsonify({"error": "buyer_id and listing_id are required"}), 400

    result = delete_favorite(buyer_id, listing_id)
    return jsonify(result), 200


@favorite_blueprint.route('/favorites/test', methods=['DELETE'])
def test_delete():
    return jsonify({"message": "DELETE route works!"}), 200


@favorite_blueprint.route('/favorites/search', methods=['GET'])
def search_favorites_route():
    buyer_id = request.args.get('buyer_id')
    search_query = request.args.get('query')
    results = search_favorites(buyer_id, search_query)
    return jsonify(results), 200