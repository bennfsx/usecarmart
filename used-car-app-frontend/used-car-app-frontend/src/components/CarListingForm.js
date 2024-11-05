import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const CarListingForm = () => {
    const [carDetails, setCarDetails] = useState({
        title: '',
        description: '',
        price: '',
        imageUrl: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCarDetails({ ...carDetails, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Please log in to list a car.');
            return;
        }

        // Decode the token to extract the user ID
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id; // Assumes 'id' is in the payload

        const listingData = { ...carDetails, sellerId: userId };

        try {
            const response = await axios.post('http://localhost:8080/listings/create', listingData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                alert('Car listed successfully!');
                navigate('/home'); // Redirect to home page after successful listing
            }
        } catch (error) {
            console.error('Error listing car:', error);
            setError('Failed to list the car. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6">List Your Car for Sale</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        name="title"
                        type="text"
                        placeholder="Car Title"
                        value={carDetails.title}
                        onChange={handleInputChange}
                        required
                    />
                    <InputField
                        name="description"
                        type="textarea"
                        placeholder="Car Description"
                        value={carDetails.description}
                        onChange={handleInputChange}
                        required
                    />
                    <InputField
                        name="price"
                        type="number"
                        placeholder="Price"
                        value={carDetails.price}
                        onChange={handleInputChange}
                        required
                    />
                    <InputField
                        name="imageUrl"
                        type="text"
                        placeholder="Image URL (e.g., Google Image link)"
                        value={carDetails.imageUrl}
                        onChange={handleInputChange}
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

// InputField Component for better reusability
const InputField = ({ name, type, placeholder, value, onChange, required }) => {
    if (type === 'textarea') {
        return (
            <textarea
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
        );
    }
    return (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
        />
    );
};

export default CarListingForm;
