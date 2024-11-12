from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load environment variables for Supabase
load_dotenv()
url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(url, key)

class FavoriteEntity:

    @staticmethod
    def add_favorite(buyer_id, listing_id):
        data = {"buyer_id": buyer_id, "listing_id": listing_id}
        response = supabase.table("favorites").insert(data).execute()
        return {"status": "success", "data": response.data}

    @staticmethod
    def get_favorites(buyer_id):
        response = supabase.table("favorites").select("*").eq("buyer_id", buyer_id).execute()
        return response.data if response.data else {"message": "No favorites found"}

    @staticmethod
    def search_favorites(buyer_id, query):
        # Step 1: Query 'favorites' to get the listing_ids for the given buyer_id
        favorites_response = supabase.table("favorites") \
            .select("listing_id") \
            .eq("buyer_id", buyer_id) \
            .execute()
        
        if not favorites_response.data:
            return {"message": "No favorites found"}

        # Step 2: Get the listings that match the query
        listing_ids = [favorite["listing_id"] for favorite in favorites_response.data]
        
        # Query 'car_listings' to get the titles, price, description, views, and image_url of the matching listings
        car_listings_response = supabase.table("car_listings") \
            .select("id, title, price, description, views, image_url") \
            .in_("id", listing_ids) \
            .ilike("title", f"%{query}%") \
            .execute()
        
        if not car_listings_response.data:
            return {"message": "No matches found"}
        
        # Step 3: Combine the results
        favorite_listings = []
        for favorite in favorites_response.data:
            for listing in car_listings_response.data:
                if favorite["listing_id"] == listing["id"]:
                    favorite_listings.append({
                        **favorite,
                        "title": listing["title"],
                        "price": listing["price"],
                        "description": listing["description"],
                        "views": listing["views"],
                        "image_url": listing["image_url"]
                    })

        return favorite_listings if favorite_listings else {"message": "No matches found"}
    
    @staticmethod
    def delete_favorite(buyer_id, listing_id):
        # Delete the favorite from the database
        response = supabase.table("favorites") \
            .delete() \
            .eq("buyer_id", buyer_id) \
            .eq("listing_id", listing_id) \
            .execute()

        # Check if the deletion was successful by looking for data
        if response.data:
            return {"status": "success", "message": "Favorite deleted successfully."}
        else:
            # If no data was deleted, the favorite was not found
            return {"status": "error", "message": "Favorite not found."}
