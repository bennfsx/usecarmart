// src/components/CarListingForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CarListingForm = () => {
    const [carDetails, setCarDetails] = useState({
        title: '',
        description: '',
        price: '',
        imageUrl: ''
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCarDetails({ ...carDetails, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Retrieve token
        if (!token) {
            alert('Please log in to list a car.');
            return;
        }

        try {
            await axios.post('http://localhost:8080/cars/list', carDetails, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Car listed successfully!');
            navigate('/my-listings'); // Redirect to seller's listings page
        } catch (error) {
            console.error('Error listing car:', error);
            alert('Failed to list the car. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6">List Your Car for Sale</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        placeholder="Car Title"
                        value={carDetails.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                    <textarea
                        name="description"
                        placeholder="Car Description"
                        value={carDetails.description}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={carDetails.price}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                    <input
                        type="text"
                        name="imageUrl"
                        placeholder="Image URL (e.g., Google Image link)"
                        value={carDetails.imageUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                    <button
                        type="submit"
                        className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-300"
                    >
                        List Car
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CarListingForm;
