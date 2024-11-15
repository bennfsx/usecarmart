from supabase import create_client, Client
import os
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables for Supabase
load_dotenv()
url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(url, key)

class ReviewEntity:

    @staticmethod
    def create_review(agent_id, reviewer_id, role, rating, review_text):
        try:
            # Prepare the review data
            review_data = {
                "agent_id": agent_id,
                "reviewer_id": reviewer_id,
                "role": role,
                "rating": rating,
                "review_text": review_text,
                "created_at": datetime.utcnow().isoformat(),  # Use UTC time
                "updated_at": datetime.utcnow().isoformat()   # Set updated_at as well
            }

            # Insert the review data into the 'reviews' table
            response = supabase.table("reviews").insert(review_data).execute()
            
            # Check for response success
            if response.data:
                return response.data
            else:
                return {"error": "Failed to create review", "details": response.error}
        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    def get_reviews_for_agent(agent_id):
        try:
            # Retrieve reviews for a specific agent
            response = supabase.table("reviews").select("*").eq("agent_id", agent_id).execute()
            
            # Check for response success
            if response.data:
                return response.data
            else:
                return {"message": "No reviews found for this agent"}
        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    def get_reviews_by_reviewer(reviewer_id):
        try:
            # Retrieve reviews written by a specific reviewer
            response = supabase.table("reviews").select("*").eq("reviewer_id", reviewer_id).execute()

            # Check for response success
            if response.data:
                return response.data
            else:
                return {"message": "No reviews found for this reviewer"}
        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    def get_all_reviews():
        try:
            # Retrieve all reviews from the 'reviews' table
            response = supabase.table("reviews").select("*").execute()
            
            # Check for response success
            if response.data:
                return response.data
            else:
                return {"message": "No reviews available"}
        except Exception as e:
            return {"error": str(e)}