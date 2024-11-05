import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FeaturedListings = () => {
    const [cars, setCars] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await axios.get('http://localhost:8080/listings'); // Use the new endpoint
                setCars(response.data);
            } catch (error) {
                console.error('Error fetching listings:', error);
                setError('Failed to fetch listings. Please try again later.');
            }
        };

        fetchListings();
    }, []);

    return (
        <section className="featured-listings">
            <h2>Featured Cars for Sale</h2>
            {error && <p className="text-red-500">{error}</p>}
            <div className="car-grid">
                {cars.map(car => (
                    <div key={car.id} className="car-item">
                        <img src={car.imageUrl} alt={car.title} /> {/* Adjust to use the correct image field */}
                        <h3>{car.title}</h3>
                        <p>{car.price}</p>
                        <button>Add to Favorites</button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedListings;
