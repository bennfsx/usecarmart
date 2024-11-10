import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const IndividualCarListing = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', price: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarListing = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/car-listing/${id}`);
        setCar(response.data);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          price: response.data.price,
        });
        
        const userId = localStorage.getItem('userId');
        setIsOwner(response.data.seller_id === userId);
      } catch (error) {
        console.error("Error fetching car listing:", error);
      }
    };
    fetchCarListing();
  }, [id]);

  const handleEditToggle = () => setEditable(!editable);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/car-listing/${id}`, formData);
      setCar({ ...car, ...formData });
      setEditable(false);
    } catch (error) {
      console.error("Error updating car listing:", error);
    }
  };

  if (!car) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      {editable ? (
        <div>
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="text-3xl font-semibold mb-4"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="text-gray-500 mb-4"
          />
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            className="text-xl text-blue-500 mb-4"
          />
          <button onClick={handleSave} className="btn-primary">Save</button>
        </div>
      ) : (
        <div>
          <h2 className="text-3xl font-semibold">{car.title}</h2>
          <p className="text-gray-500 mt-2">{car.description}</p>
          <p className="text-xl font-bold text-blue-500">${car.price}</p>
          {isOwner && (
            <button onClick={handleEditToggle} className="btn-primary mt-4">
              Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default IndividualCarListing;
