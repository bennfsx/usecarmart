import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {
    const [listings, setListings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token'); // Retrieve token
        if (!token) {
            alert('Please log in to access the dashboard.');
            navigate('/login');
        } else {
            fetchSellerListings(token); // Pass the token to the fetch function
        }
    }, [navigate]);

    const fetchSellerListings = async (token) => {
        const sellerId = localStorage.getItem('sellerId'); // Assuming sellerId is stored in local storage
        try {
            const response = await axios.get(`http://localhost:8080/listings/seller/${sellerId}`, {
                headers: { Authorization: `Bearer ${token}` }, // Use the token in headers
            });
            setListings(response.data);
        } catch (error) {
            console.error('Error fetching seller listings:', error);
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-listing/${id}`); // Redirect to edit listing page (create this route/component)
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
            <h2 className="text-2xl font-bold mb-4">Your Listings</h2>
            <button 
                onClick={() => navigate('/list-car')} 
                className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300">
                List a New Car
            </button>
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4">
                {listings.length > 0 ? (
                    <ul>
                        {listings.map((listing) => (
                            <li key={listing.id} className="flex justify-between items-center border-b py-2">
                                <div>
                                    <h3 className="font-semibold">{listing.title}</h3>
                                    <p>{listing.description}</p>
                                    <p className="text-green-600">${listing.price}</p>
                                </div>
                                <button 
                                    onClick={() => handleEdit(listing.id)} 
                                    className="text-blue-500 hover:underline">
                                    Edit
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No listings found. Start by listing a car!</p>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;
