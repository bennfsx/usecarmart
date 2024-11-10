import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct named import
import 'react-toastify/dist/ReactToastify.css';

const CarListingForm = () => {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isEdit, setIsEdit] = useState(false); // New state for tracking edit mode
  const navigate = useNavigate(); // Initialize useNavigate
  const { carId } = useParams(); // Retrieve carId from URL params for editing a listing

  // Retrieve the JWT token from localStorage
  const token = localStorage.getItem('token'); // Replace 'token' with your actual token key

  // Decode the JWT token to get the userId
  let sellerId = null;
  if (token) {
    const decodedToken = jwtDecode(token); // Decode token to get the seller's ID
    sellerId = decodedToken.id; // Adjust this based on the structure of your token
  }

  console.log("Retrieved sellerId:", sellerId); // Log the decoded sellerId

  // Fetch car data if editing an existing listing
  useEffect(() => {
    if (carId) {
      setIsEdit(true); // Set to edit mode if carId is provided in the URL
      axios
        .get(`http://localhost:8000/car-listings/${carId}`)
        .then((response) => {
          if (response.status === 200) {
            const { description, price, title, image_url, seller_id } = response.data;
            if (seller_id !== sellerId) {
              toast.error('You are not authorized to edit this listing.');
              navigate('/');
              return;
            }
            setDescription(description);
            setPrice(price);
            setTitle(title);
            setImageUrl(image_url);
          }
        })
        .catch((error) => {
          console.error('Error fetching car listing:', error);
          toast.error('Failed to load car listing.');
        });
    }
  }, [carId, sellerId, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!sellerId) {
      toast.error('User is not logged in', {
        className: 'bg-red-500 text-white font-semibold p-4 rounded-lg shadow-md',
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    const carData = {
      description,
      price,
      title,
      image_url: imageUrl,
      seller_id: sellerId, // Add seller_id from decoded token
    };

    try {
      let response;
      if (isEdit) {
        // Update existing car listing
        response = await axios.put(`http://localhost:8000/car-listings/${carId}`, carData);
      } else {
        // Create new car listing
        response = await axios.post('http://localhost:8000/list-car', carData);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(isEdit ? 'Car listing updated successfully!' : 'Car listed successfully!', {
          className: 'bg-green-500 text-white font-semibold p-4 rounded-lg shadow-md',
          position: 'top-center',
          autoClose: 3000,
        });
        // Redirect to the homepage after success
        setTimeout(() => navigate('/'), 3000); // Delay to allow toast to show before redirect
      } else {
        toast.error('Error processing request', {
          className: 'bg-red-500 text-white font-semibold p-4 rounded-lg shadow-md',
          position: 'top-center',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred', {
        className: 'bg-red-500 text-white font-semibold p-4 rounded-lg shadow-md',
        position: 'top-center',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Car Listing' : 'List a Car'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="4"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md"
          >
            {isEdit ? 'Update Car Listing' : 'List Car'}
          </button>
        </div>
      </form>

      {/* ToastContainer to render toast messages */}
      <ToastContainer />
    </div>
  );
};

export default CarListingForm;
