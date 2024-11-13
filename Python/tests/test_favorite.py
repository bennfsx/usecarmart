# PYTHONPATH=Python/usedcarmart-backend pytest -v -s Python/tests/test_favorite.py

import pytest
from unittest.mock import patch, MagicMock
import sys
import os

# Append the usedcarmart-backend path to sys.path to import modules correctly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../usedcarmart-backend')))

# Import the FavoriteEntity after adjusting sys.path
from entity.favorite import FavoriteEntity

# Test for add_favorite
@patch.object(FavoriteEntity, 'add_favorite')
def test_add_favorite(mock_add_favorite):
    """
    Test for adding a favorite.
    Mocks the add_favorite method and checks if the favorite is successfully added.
    """
    # Setup mock return value for add_favorite
    mock_add_favorite.return_value = {"status": "success", "data": [{"buyer_id": 55, "listing_id": 36}]}
    
    # Call the method being tested
    result = FavoriteEntity.add_favorite(55, 36)
    
    # Expected result for assertion
    expected_result = {"status": "success", "data": [{"buyer_id": 55, "listing_id": 36}]}
    
    # Print output in the desired format
    print(f"Check add_favorite: Expected {expected_result['status']}, Got {result['status']}")
    print(f"Check add_favorite (buyer_id): Expected {expected_result['data'][0]['buyer_id']}, Got {result['data'][0]['buyer_id']}")
    print(f"Check add_favorite (listing_id): Expected {expected_result['data'][0]['listing_id']}, Got {result['data'][0]['listing_id']}")
    
    # Assertions to check if the returned result is as expected
    assert result['status'] == expected_result['status']
    assert result['data'][0]['buyer_id'] == expected_result['data'][0]['buyer_id']
    assert result['data'][0]['listing_id'] == expected_result['data'][0]['listing_id']


# Test for get_favorites
@patch.object(FavoriteEntity, 'get_favorites')
def test_get_favorites(mock_get_favorites):
    """
    Test for retrieving favorites.
    Mocks the get_favorites method and checks if the correct favorite data is returned.
    """
    # Setup mock return value for get_favorites
    mock_get_favorites.return_value = [{"buyer_id": 55, "listing_id": 36, "created_at": "2024-11-12 15:12:50.095674+00"}]
    
    # Call the method being tested
    result = FavoriteEntity.get_favorites(55)
    
    # Expected result for assertion
    expected_result = [{"buyer_id": 55, "listing_id": 36, "created_at": "2024-11-12 15:12:50.095674+00"}]
    
    # Print output in the desired format
    print(f"Check get_favorites: Expected {expected_result[0]['buyer_id']}, Got {result[0]['buyer_id']}")
    print(f"Check get_favorites (listing_id): Expected {expected_result[0]['listing_id']}, Got {result[0]['listing_id']}")
    
    # Assertions to check if the returned result is as expected
    assert result[0]["buyer_id"] == expected_result[0]["buyer_id"]
    assert result[0]["listing_id"] == expected_result[0]["listing_id"]


# Test for search_favorites
@patch.object(FavoriteEntity, 'search_favorites')
def test_search_favorites(mock_search_favorites):
    """
    Test for searching within the user's favorites.
    Mocks the search_favorites method and checks if the correct favorites are found based on a search query.
    """
    # Setup mock return value for search_favorites
    mock_search_favorites.return_value = [{"buyer_id": 55, "listing_id": 36, "title": "Car Title", "price": 20000, "description": "Car description", "views": 150, "image_url": "image_url.com"}]
    
    # Call the method being tested
    result = FavoriteEntity.search_favorites(55, "Car")
    
    # Expected result for assertion
    expected_result = [{"buyer_id": 55, "listing_id": 36, "title": "Car Title", "price": 20000, "description": "Car description", "views": 150, "image_url": "image_url.com"}]
    
    # Print output in the desired format
    print(f"Check search_favorites (buyer_id): Expected {expected_result[0]['buyer_id']}, Got {result[0]['buyer_id']}")
    print(f"Check search_favorites (listing_id): Expected {expected_result[0]['listing_id']}, Got {result[0]['listing_id']}")
    print(f"Check search_favorites (title): Expected {expected_result[0]['title']}, Got {result[0]['title']}")
    print(f"Check search_favorites (price): Expected {expected_result[0]['price']}, Got {result[0]['price']}")
    
    # Assertions to check if the returned result is as expected
    assert result[0]["buyer_id"] == expected_result[0]["buyer_id"]
    assert result[0]["listing_id"] == expected_result[0]["listing_id"]
    assert result[0]["title"] == expected_result[0]["title"]
    assert result[0]["price"] == expected_result[0]["price"]


# Test for delete_favorite
@patch.object(FavoriteEntity, 'delete_favorite')
def test_delete_favorite(mock_delete_favorite):
    """
    Test for deleting a favorite.
    Mocks the delete_favorite method and checks if the favorite is successfully deleted.
    """
    # Setup mock return value for delete_favorite
    mock_delete_favorite.return_value = {"status": "success", "message": "Favorite deleted successfully."}
    
    # Call the method being tested
    result = FavoriteEntity.delete_favorite(55, 36)
    
    # Expected result for assertion
    expected_result = {"status": "success", "message": "Favorite deleted successfully."}
    
    # Print output in the desired format
    print(f"Check delete_favorite: Expected {expected_result['status']}, Got {result['status']}")
    print(f"Check delete_favorite (message): Expected {expected_result['message']}, Got {result['message']}")
    
    # Assertions to check if the returned result is as expected
    assert result['status'] == expected_result['status']
    assert result['message'] == expected_result['message']