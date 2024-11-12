import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct import

const IndividualCarListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [editable, setEditable] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false); // New state for favorite status
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
  });

  useEffect(() => {
    const fetchCarListing = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/car-listings/${id}`);
        const listing = response.data;
  
        setCar(listing);
        setFormData({
          title: listing.title,
          description: listing.description,
          price: listing.price,
          image_url: listing.image_url,
        });
  
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;
          setIsOwner(listing.seller_id === userId);
          checkIfFavorited(userId, id); // Pass carId (id) here
        }
      } catch (error) {
        console.error('Error fetching car listing:', error);
      }
    };
  
    if (id) fetchCarListing();
  }, [id]);

  const checkIfFavorited = async (userId, carId) => {
    try {
      const response = await axios.get(`http://localhost:8000/favorites?buyer_id=${userId}`);
      console.log('Favorites API Response:', response.data);
  
      if (Array.isArray(response.data)) {
        response.data.forEach(favorite => {
          console.log('Favorite Listing:', favorite);
        });
  
        // Convert both favorite.listing_id and carId to string for comparison
        const isFavorited = response.data.some(favorite => {
          console.log('Comparing:', favorite.listing_id, 'with', carId);
          return String(favorite.listing_id) === String(carId); // Cast both to strings
        });
  
        console.log('Is this car favorited?', isFavorited);
        setIsFavorited(isFavorited);
      } else {
        console.error('Unexpected response format:', response.data);
        setIsFavorited(false);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
      setIsFavorited(false);
    }
  };
  
  

  const handleFavoriteToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
  
      console.log('Current favorite status:', isFavorited); // Log current favorite status before toggle
  
      // Toggle favorite status based on the current state
      if (isFavorited) {
        // Remove from favorites
        console.log('Removing from favorites');
        await axios.delete('http://localhost:8000/favorites', {
          headers: { Authorization: `Bearer ${token}` },
          data: { buyer_id: userId, listing_id: id }, // Send data in the body for DELETE
        });
      } else {
        // Add to favorites
        console.log('Adding to favorites');
        await axios.post(
          `http://localhost:8000/favorites`,
          { buyer_id: userId, listing_id: id },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
  
      // Toggle the favorite status in your state
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error while toggling favorite:', error);
    }
  };
  

  const handleEditToggle = () => setEditable(!editable);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const sellerId = decodedToken.id;

      await axios.put(
        `http://localhost:8000/car-listings/${id}`,
        { ...formData, seller_id: sellerId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCar({ ...car, ...formData });
      setEditable(false);
      alert('Listing updated successfully!');
    } catch (error) {
      console.error('Error updating car listing:', error);
      alert('Failed to update the listing.');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const sellerId = decodedToken.id;

      if (car.seller_id !== sellerId) {
        alert('You are not authorized to delete this listing');
        return;
      }

      const response = await axios.delete(`http://localhost:8000/car-listings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: { seller_id: sellerId },
      });

      if (response.status === 200) {
        alert('Listing deleted successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error('Error deleting car listing:', error);
      alert('Failed to delete the listing.');
    }
  };

  if (!car) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {editable ? (
          <div className="p-6 space-y-4">
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="text-2xl font-semibold w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="5"
              placeholder="Description"
            />
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              className="text-xl font-semibold w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Price"
            />
            <input
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Image URL"
            />
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="p-6">
            <h2 className="text-3xl font-semibold mb-2">{car.title}</h2>
            <p className="text-gray-700 mt-2">{car.description}</p>
            <p className="text-xl font-bold text-blue-500 mt-4">${car.price}</p>
            {car.image_url && (
              <img
                src={car.image_url}
                alt={car.title}
                className="w-full h-64 object-cover mt-4 rounded-lg"
              />
            )}
            <p className="text-sm text-gray-600 mt-2">Views: {car.views}</p>
            {!isOwner && (
              <button
                onClick={handleFavoriteToggle}
                className={`mt-4 px-4 py-2 rounded-md transition-all ${
                  isFavorited ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            )}
            {isOwner && (
              <div>
                <button
                  onClick={handleEditToggle}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="mt-4 ml-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IndividualCarListing;
