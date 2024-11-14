from flask import Blueprint, request, jsonify
from controller.controller import create_review, get_reviews_for_agent, get_reviews_by_reviewer

review_blueprint = Blueprint('review_blueprint', __name__)

# Endpoint to create a review
@review_blueprint.route('/reviews', methods=['POST'])
def create_review_endpoint():
    try:
        data = request.get_json()
        # Extract the required data
        agent_id = data.get('agent_id')
        reviewer_id = data.get('reviewer_id')
        role = data.get('role')
        rating = data.get('rating')
        review_text = data.get('review_text')

        # Call the controller to create the review
        response = create_review(agent_id, reviewer_id, role, rating, review_text)
        
        if response:
            return jsonify({"message": "Review created successfully", "data": response}), 201
        else:
            return jsonify({"message": "Failed to create review"}), 400
    
    except Exception as e:
        return jsonify({"message": str(e)}), 500


# Endpoint to get reviews for a specific agent
@review_blueprint.route('/reviews/<int:agent_id>', methods=['GET'])
def get_reviews_for_agent_endpoint(agent_id):
    try:
        # Call the controller to get reviews for the agent
        reviews = get_reviews_for_agent(agent_id)
        
        if reviews:
            return jsonify({"reviews": reviews}), 200
        else:
            return jsonify({"message": "No reviews found for this agent"}), 404
    
    except Exception as e:
        return jsonify({"message": str(e)}), 500


# Endpoint to get reviews by a specific reviewer
@review_blueprint.route('/reviews/reviewer/<int:reviewer_id>', methods=['GET'])
def get_reviews_by_reviewer_endpoint(reviewer_id):
    try:
        # Call the controller to get reviews by the reviewer
        reviews = get_reviews_by_reviewer(reviewer_id)
        
        if reviews:
            return jsonify({"reviews": reviews}), 200
        else:
            return jsonify({"message": "No reviews found for this reviewer"}), 404
    
    except Exception as e:
        return jsonify({"message": str(e)}), 500
