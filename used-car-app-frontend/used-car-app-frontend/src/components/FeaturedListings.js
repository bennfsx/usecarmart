import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const FeaturedListings = () => {
    const [cars, setCars] = useState([]);
    

    useEffect(() => {
       
        const fetchCars = async () => {
            const response = await axios.get('http://localhost:8080/listings');
            setCars(response.data);
        };
        fetchCars();
    }, []);

    const handleFavorite = async (carId) => {
        const token = localStorage.getItem('token');
        
     const decodedToken = jwtDecode(token);
     const userId = decodedToken.id; // Assumes 'id' is in the payload
     console.log("IDDDDDDD:DD", userId)

        try {
            await axios.post(`http://localhost:8080/favorites/${userId}/add/${carId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Car added to favorites!');
        } catch (error) {
            console.error('Error adding favorite:', error);
        }
    };

    return (
        <section className="featured-listings">
            <h2>Featured Cars for Sale</h2>
            <div className="car-grid">
                {cars.map(car => (
                    <div key={car.id} className="car-item">
                        <img src={car.imageUrl} alt={car.title} />
                        <h3>{car.title}</h3>
                        <p>{car.price}</p>
                        <button onClick={() => handleFavorite(car.id)}>Add to Favorites</button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedListings;
