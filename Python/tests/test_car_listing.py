import pytest
from unittest.mock import patch
from controller.controller import handle_list_car, get_car_listing, handle_update_car_interests

# --- Mock Fixtures ---
@pytest.fixture
def mock_get_car_by_id():
    with patch('controller.controller.get_car_by_id') as mock:
        yield mock

@pytest.fixture
def mock_increment_views():
    with patch('controller.controller.increment_views') as mock:
        yield mock

@pytest.fixture
def mock_update_car_interests():
    with patch('controller.controller.update_car_interests') as mock:
        yield mock

# --- Car Listing Tests ---

def test_list_car_missing_field():
    """
    Test listing a car with missing required fields.
    """
    car_data = {'description': '', 'price': 10000, 'title': 'Car for Sale', 'image_url': '', 'seller_id': 1}
    response, status_code = handle_list_car(car_data)  # Correct tuple unpacking
    
    print(f"Response: {response}, Status Code: {status_code}")
    
    # Assert that the correct error message is returned
    assert response['message'] == 'Missing required fields'
    assert status_code == 400  # Assuming 400 for missing fields


def test_get_car_listing(mock_get_car_by_id, mock_increment_views):
    """
    Test getting a car listing by ID when the car exists.
    """
    mock_increment_views.return_value = None
    mock_get_car_by_id.return_value = {'id': 1, 'description': 'Test Car', 'price': 10000, 'title': 'Car for Sale'}
    
    car_id = 1
    response = get_car_listing(car_id)  # Only capture the response, not the status_code

    print(f"Response: {response}")
    
    # Assert that the car data is in the response
    assert 'car' in response
    assert 'id' in response['car']  # Check the car details


def test_get_car_listing_not_found(mock_get_car_by_id):
    """
    Test getting a car listing by ID when the car is not found.
    """
    mock_get_car_by_id.return_value = None
    
    car_id = 999
    response, status_code = get_car_listing(car_id)  # Correct tuple unpacking
    
    print(f"Response: {response}, Status Code: {status_code}")
    
    # Assert that the car not found message is returned
    assert response['message'] == 'Car not found'
    assert status_code == 404  # Assuming 404 for not found


def test_update_car_interests_view(mock_update_car_interests):
    """
    Test updating the car interests (view count) when the action is 'view'.
    """
    mock_update_car_interests.return_value = {'id': 1, 'view_count': 1}
    
    car_id = 1
    action = 'view'
    response = handle_update_car_interests(car_id, action)  # Only capture the response, not status_code
    
    print(f"Response: {response}")
    
    # Assert that the message in the response is correct
    assert response['message'] == 'Car view count updated successfully'
    
    # Optionally, check the car data as well
    assert response['car']['id'] == car_id
    assert response['car']['view_count'] == 1


def test_update_car_interests_invalid_action():
    """
    Test updating car interests with an invalid action.
    """
    car_id = 1
    action = 'invalid'
    response, status_code = handle_update_car_interests(car_id, action)  # Correct tuple unpacking

    print(f"Response: {response}, Status Code: {status_code}")
    
    # Assert that the invalid action message is returned
    assert response['message'] == 'Invalid action'
    assert status_code == 400  # Assuming 400 for invalid action
