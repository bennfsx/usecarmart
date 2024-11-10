import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import 'react-toastify/dist/ReactToastify.css';

const CarListingForm = () => {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (event) => {
    event.preventDefault();

    const carData = {
      description: description,
      price: price,
      title: title,
      image_url: imageUrl,
    };

    try {
      const response = await axios.post('http://localhost:5000/list-car', carData);

      if (response.status === 201) {
        toast.success('Car listed successfully!', {
          className: 'bg-green-500 text-white font-semibold p-4 rounded-lg shadow-md',
          position: 'top-center',
          autoClose: 3000,
        });
        // Redirect to the homepage after success
        setTimeout(() => navigate('/'), 3000); // Delay to allow toast to show before redirect
      } else {
        toast.error('Error listing car', {
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
      <h2 className="text-2xl font-bold mb-4">List a Car</h2>
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
            List Car
          </button>
        </div>
      </form>

      {/* ToastContainer to render toast messages */}
      <ToastContainer />
    </div>
  );
};

export default CarListingForm;
