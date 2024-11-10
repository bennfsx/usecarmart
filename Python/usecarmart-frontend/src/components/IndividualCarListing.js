import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode

const IndividualCarListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
  });

  useEffect(() => {
    if (id && !car) { // Check if id exists and car is not yet fetched
      const fetchCarListing = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/car-listings/${id}`);
          const listing = response.data;
  
          console.log('Fetched car listing:', listing);
          setCar(listing);
          setFormData({
            title: listing.title,
            description: listing.description,
            price: listing.price,
            image_url: listing.image_url,
          });
  
          // Decode the JWT token to get the logged-in user's ID
          const token = localStorage.getItem('token');
          if (token) {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id; // Assuming the token contains the 'id' field
            setIsOwner(listing.seller_id === userId); // Compare seller_id with logged-in user's ID
            console.log('Logged-in user ID:', userId);
          }
        } catch (error) {
          console.error('Error fetching car listing:', error);
        }
      };
  
      fetchCarListing();
    }
  }, [id]);  // Only depend on `id`, not `car`
  

  const handleEditToggle = () => setEditable(!editable);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token); // Decode the token to get the user ID
      const sellerId = decodedToken.id; // Get the seller ID from the token
  
      const response = await axios.put(
        `http://localhost:5000/car-listings/${id}`,
        { ...formData, seller_id: sellerId }, // Send the seller_id along with the form data
        {
          headers: {
            Authorization: `Bearer ${token}`, // Keep this in case you want to check token elsewhere, or you can remove it
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
            {isOwner && (
              <button
                onClick={handleEditToggle}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
              >
                Edit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IndividualCarListing;
