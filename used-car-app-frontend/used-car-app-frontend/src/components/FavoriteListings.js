import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FavoriteListings = () => {
    const [favorites, setFavorites] = useState([]);
    const userId = localStorage.getItem('id'); // Get user ID from local storage
    const token = localStorage.getItem('token'); // Get token for authentication

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/favorites/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFavorites(response.data);
            } catch (error) {
                console.error('Error fetching favorite listings:', error);
            }
        };
        fetchFavorites();
    }, [userId, token]);

    return (
        <section className="favorite-listings">
            <h2>Your Favorite Listings</h2>
            <div className="car-grid">
                {favorites.length === 0 ? (
                    <p>You have no favorite listings.</p>
                ) : (
                    favorites.map(car => (
                        <div key={car.id} className="car-item">
                            <img src={car.imageUrl} alt={car.title} />
                            <h3>{car.title}</h3>
                            <p>{car.price}</p>
                            {/* You can add a button here to remove from favorites if needed */}
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default FavoriteListings;
