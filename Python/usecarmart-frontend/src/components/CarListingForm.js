import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'react-toastify/dist/ReactToastify.css';

const CarListingForm = () => {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const navigate = useNavigate();
  const { carId } = useParams();
  const token = localStorage.getItem('token');

  // Decode the JWT token to get the userId
  let sellerId = null;
  if (token) {
    const decodedToken = jwtDecode(token);
    sellerId = decodedToken.id;
  }

  // Fetch agents for the agent selection dropdown
  useEffect(() => {
    axios
      .get('http://localhost:8000/agents')  // Adjust the URL for fetching agents
      .then((response) => {
        if (response.status === 200) {
          setAgents(response.data); // Assuming response data is an array of agent objects
        }
      })
      .catch((error) => {
        console.error('Error fetching agents:', error);
        toast.error('Failed to load agents.');
      });
  }, []);

  // Fetch car data if editing an existing listing
  useEffect(() => {
    if (carId) {
      setIsEdit(true);
      axios
        .get(`http://localhost:8000/car-listings/${carId}`)
        .then((response) => {
          if (response.status === 200) {
            const { description, price, title, image_url, seller_id, agent_id } = response.data;
            if (seller_id !== sellerId) {
              toast.error('You are not authorized to edit this listing.');
              navigate('/');
              return;
            }
            setDescription(description);
            setPrice(price);
            setTitle(title);
            setImageUrl(image_url);
            setSelectedAgent(agent_id || ''); // Set selected agent if available
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
      seller_id: sellerId,
      agent_id: selectedAgent,  // Include the selected agent ID
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
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{isEdit ? 'Edit Car Listing' : 'List a Car'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col space-y-2">
          <label className="text-lg font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-lg font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
            rows="4"
            required
          ></textarea>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-lg font-medium">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-lg font-medium">Image URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
            required
          />
        </div>

        {/* Agent Selection */}
        <div className="flex flex-col space-y-2">
          <label className="text-lg font-medium">Select Agent</label>
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
            required
          >
            <option value="">Select an agent</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700"
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
