import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const IndividualCarListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [editable, setEditable] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false); 
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
  });
  const [showAgentPopup, setShowAgentPopup] = useState(false); // for showing the agent popup
  const [agentDetails, setAgentDetails] = useState(null); // for storing agent details

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
          checkIfFavorited(userId, id); 
        }

        // Set the agent details if available
        if (listing.agent_details) {
          setAgentDetails(listing.agent_details);
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
      const isFavorited = response.data.some(favorite => String(favorite.listing_id) === String(carId));
      setIsFavorited(isFavorited);
    } catch (error) {
      console.error('Error checking favorites:', error);
      setIsFavorited(false);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      if (isFavorited) {
        await axios.delete('http://localhost:8000/favorites', {
          headers: { Authorization: `Bearer ${token}` },
          data: { buyer_id: userId, listing_id: id },
        });
      } else {
        await axios.post(
          `http://localhost:8000/favorites`,
          { buyer_id: userId, listing_id: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCar({ ...car, ...formData });
      setEditable(false);
      alert('Listing updated successfully!');
    } catch (error) {
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
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        data: { seller_id: sellerId },
      });

      if (response.status === 200) {
        alert('Listing deleted successfully!');
        navigate('/');
      }
    } catch (error) {
      alert('Failed to delete the listing.');
    }
  };

  const navigateToAgentProfile = () => {
    if (agentDetails && agentDetails.id) {
      navigate(`/agents/${agentDetails.id}`);
      setShowAgentPopup(false); // Close the popup after navigating
    } else {
      alert('Agent details are not available.');
    }
  };

  if (!car) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Popup for agent details */}
        {showAgentPopup && agentDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold">Agent Details</h2>
              <p><strong>Name:</strong> {agentDetails.name}</p>
              <p><strong>Email:</strong> {agentDetails.email}</p>
              <p><strong>Phone:</strong> {agentDetails.phone_number}</p>
              <div className="mt-4">
                <button
                  onClick={navigateToAgentProfile}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
                >
                  View Agent Profile
                </button>
                <button
                  onClick={() => setShowAgentPopup(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mt-2 ml-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

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
            {agentDetails && (
              <button
                onClick={() => setShowAgentPopup(true)}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all"
              >
                View Agent Details
              </button>
            )}

            {isOwner && (
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={handleEditToggle}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
                >
                  Edit Listing
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all"
                >
                  Delete Listing
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center p-6">
          <button
            onClick={handleFavoriteToggle}
            className={`text-xl font-semibold py-2 px-4 rounded-md ${
              isFavorited ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndividualCarListing;
