# PYTHONPATH=Python/usedcarmart-backend pytest -v -s Python/tests/test_car.py

import pytest
from unittest.mock import patch, MagicMock
import sys
import os

# Append the 'usedcarmart-backend' path to sys.path to import modules correctly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../usedcarmart-backend')))

# Import the functions to be tested
from entity.car import create_car, get_car_by_id, update_car_interests, get_car_listings, delete_car_listing_from_db


# Test for creating a car listing successfully
@patch('entity.car.supabase')  # Mocking the 'supabase' object in 'entity.car'
def test_create_car_success(mock_supabase):
    # Mock the response from supabase for a successful car creation
    mock_response = MagicMock()
    mock_response.data = [{
        'id': 1,
        'description': 'A used Toyota Corolla, 2015 model.',
        'price': 12000,
        'title': '2015 Toyota Corolla',
        'image_url': 'https://example.com/image.jpg',
        'seller_id': 51,
        'views': 0,
        'shortlist_count': 0
    }]
    # Mock the behavior of the 'insert' operation in supabase, which returns the mock_response
    mock_supabase.table.return_value.insert.return_value.execute.return_value = mock_response
    
    # Call the function 'create_car' and pass necessary parameters to test car creation
    response, status_code = create_car(
        'A used Toyota Corolla, 2015 model.',
        12000,
        '2015 Toyota Corolla',
        'https://example.com/image.jpg',
        51
    )
    
    # Print the response for debugging purposes
    print(f"Create car response: {response}")
    
    # Assertions to check if the car was created successfully
    assert status_code == 201  # Check if status code is 201 (created)
    assert response['message'] == "Car listing created successfully!"  # Verify the success message
    assert response['car']['id'] == 1  # Verify that the car ID returned is correct


# Test for creating a car listing failure
@patch('entity.car.supabase')
def test_create_car_failure(mock_supabase):
    # Mock the response for a failed car creation
    mock_response = MagicMock()
    mock_response.data = None  # No data returned
    mock_response.error = "Insertion failed"  # Error message
    mock_supabase.table.return_value.insert.return_value.execute.return_value = mock_response

    # Call the function 'create_car' with parameters to simulate a failure
    response, status_code = create_car(
        'A used Toyota Corolla, 2015 model.',
        12000,
        '2015 Toyota Corolla',
        'https://example.com/image.jpg',
        51
    )

    # Print the failure response for debugging
    print(f"Create car failure response: {response}")

    # Assertions to check if the failure response is handled correctly
    assert status_code == 500  # Status code should be 500 (server error) for failure
    assert response['message'] == "Failed to create car listing"  # Verify the error message
    assert response['details'] == "Insertion failed"  # Verify the error details


# Test for fetching a car by ID successfully
@patch('entity.car.supabase')
def test_get_car_by_id_success(mock_supabase):
    # Mock the response for fetching a car by ID
    mock_response = MagicMock()
    mock_response.data = {
        'id': 1,
        'description': 'A used Toyota Corolla, 2015 model.',
        'price': 12000,
        'title': '2015 Toyota Corolla',
        'image_url': 'https://example.com/image.jpg',
        'seller_id': 51,
        'views': 0,
        'shortlist_count': 0
    }
    # Mock the chained calls for fetching a car by ID from supabase
    mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = mock_response

    # Call the function 'get_car_by_id' to fetch the car with ID 1
    car = get_car_by_id(1)

    # Print the response for debugging
    print(f"Get car by ID response: {car}")

    # Assertions to check if the car was fetched correctly
    assert car is not None  # Ensure car is not None (car should exist)
    assert car['id'] == 1  # Check that the car ID matches


# Test for fetching car listings with pagination and total pages
@patch('entity.car.supabase')
def test_get_car_listings(mock_supabase):
    # Mock the response for fetching car listings
    mock_response = MagicMock()
    mock_response.data = [{
        'id': 2,
        'description': 'A used Toyota Corolla, 2015 model.',
        'price': 12000,
        'title': '2015 Toyota Corolla',
        'image_url': 'https://example.com/image.jpg',
        'seller_id': 51,
        'views': 0,
        'shortlist_count': 0
    }, {
        'id': 8,
        'description': 'asd',
        'price': 123123,
        'title': '12312',
        'image_url': 'https://example.com/image.jpg',
        'seller_id': 51,
        'views': 0,
        'shortlist_count': 0
    }, {
        'id': 9,
        'description': 'asd',
        'price': 123123,
        'title': '12312',
        'image_url': 'https://example.com/image.jpg',
        'seller_id': 51,
        'views': 0,
        'shortlist_count': 0
    }, {
        'id': 10,
        'description': 'sdfsdf',
        'price': 123123,
        'title': '12312',
        'image_url': 'https://example.com/image.jpg',
        'seller_id': 51,
        'views': 0,
        'shortlist_count': 0
    }]
    
    # Mock the pagination for the car listings (limit and offset)
    mock_supabase.table.return_value.select.return_value.range.return_value.execute.return_value = mock_response
    mock_supabase.table.return_value.select.return_value.execute.return_value.data = mock_response.data

    # Call the function 'get_car_listings' with page 1 and page size 10
    listings, total_pages = get_car_listings(1, 10)

    # Print the response for debugging
    print(f"Get car listings response: {listings}, Total pages: {total_pages}")

    # Assert that total pages is correctly calculated and that listings were fetched
    expected_total_pages = (8 // 10) + (1 if 8 % 10 > 0 else 0)  # Calculate expected total pages
    assert total_pages == expected_total_pages  # Check if total pages are correct
    assert len(listings) == 4  # Verify the number of listings returned matches mock data


# Test for deleting a car listing successfully
@patch('entity.car.supabase')  # Mock supabase directly here
@patch('entity.car.get_car_by_id')  # Mock the 'get_car_by_id' function separately
def test_delete_car_listing_from_db_success(mock_get_car_by_id, mock_supabase):
    # Mock the car object to simulate fetching the car by ID
    mock_car = {
        'id': 1,
        'description': 'A used Toyota Corolla, 2015 model.',
        'price': 12000,
        'title': '2015 Toyota Corolla',
        'image_url': 'https://example.com/image.jpg',
        'seller_id': 51,
        'views': 0,
        'shortlist_count': 0
    }

    # Mock the 'get_car_by_id' function to return the mocked car
    mock_get_car_by_id.return_value = mock_car

    # Simulate successful deletion by returning the deleted car
    mock_supabase.table.return_value.delete.return_value.execute.return_value = MagicMock(data=[mock_car])

    # Call the function to delete the car listing and check assertions
    result = delete_car_listing_from_db(1, 51)

    # Print the result for debugging
    print(f"Delete car listing response: {result}")
    
    # Assert that the deletion was successful and the function returns True
    assert result is True  # Ensure the function returns True when successful


# Test for deleting a car listing failure
@patch('entity.car.supabase')
def test_delete_car_listing_from_db_failure(mock_supabase):
    # Mock the car object to simulate deletion failure
    mock_car = {
        'id': 1,
        'description': 'A used Toyota Corolla, 2015 model.',
        'price': 12000,
        'title': '2015 Toyota Corolla',
        'image_url': 'https://example.com/image.jpg',
        'seller_id': 51,
        'views': 0,
        'shortlist_count': 0
    }

    # Simulate failure by returning None (indicating no car was deleted)
    mock_supabase.table.return_value.delete.return_value.execute.return_value = MagicMock(data=None)
    
    # Call the function to delete the car listing and check assertions
    result = delete_car_listing_from_db(1, 51)

    # Print the failure result for debugging
    print(f"Delete car listing failure response: {result}")

    # Assert that the deletion failed and the function returns False
    assert result is False  # Ensure the function returns False when deletion fails