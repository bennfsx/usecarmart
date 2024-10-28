// src/components/SellerDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SellerDashboard = () => {
    const [listings, setListings] = useState([]);
    const [newListing, setNewListing] = useState({
        title: '',
        description: '',
        price: '',
        sellerId: 1 // Change this based on the logged-in seller's ID
    });

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const sellerId = 1; // Replace with the actual seller ID from the auth context or state
            const response = await axios.get(`http://localhost:8080/car-listings/seller/${sellerId}`);
            setListings(response.data);
        } catch (error) {
            console.error('Error fetching listings:', error);
        }
    };

    const handleCreateListing = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/car-listings', newListing);
            fetchListings(); // Refresh listings after creating a new one
            setNewListing({ title: '', description: '', price: '', sellerId: 1 });
        } catch (error) {
            console.error('Error creating listing:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Your Listings</h2>
            <ul className="mb-6">
                {listings.map((listing) => (
                    <li key={listing.id} className="border border-gray-300 p-4 rounded-lg mb-2">
                        <h3 className="text-xl font-semibold">{listing.title}</h3>
                        <p className="text-gray-700">{listing.description}</p>
                        <p className="font-bold">Price: ${listing.price}</p>
                        <p className="text-gray-600">Views: {listing.views}</p>
                    </li>
                ))}
            </ul>

            <h2 className="text-2xl font-bold mb-4">Create New Listing</h2>
            <form onSubmit={handleCreateListing} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={newListing.title}
                        onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                        required
                        className="border border-gray-300 p-2 w-full rounded-lg"
                    />
                </div>
                <div className="mb-4">
                    <textarea
                        placeholder="Description"
                        value={newListing.description}
                        onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                        required
                        className="border border-gray-300 p-2 w-full rounded-lg"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="number"
                        placeholder="Price"
                        value={newListing.price}
                        onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                        required
                        className="border border-gray-300 p-2 w-full rounded-lg"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition">
                    Create Listing
                </button>
            </form>
        </div>
    );
};

export default SellerDashboard;
