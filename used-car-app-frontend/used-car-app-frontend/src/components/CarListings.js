import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CarListings = () => {
    const [cars, setCars] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await axios.get('http://localhost:8080/listings');
                setCars(response.data);
            } catch (error) {
                console.error('Error fetching listings:', error);
            }
        };

        fetchListings();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const saveFavorite = async (carId) => {
        const userId = localStorage.getItem('id'); // Get logged-in user ID
        if (!userId) {
            alert('Please log in to save favorites.');
            return;
        }

        try {
            await axios.post('http://localhost:8080/listings/favorites', {
                userId: userId,
                listingId: carId
            });
            alert('Car saved to favorites!');
        } catch (error) {
            console.error('Error saving favorite:', error);
        }
    };

    const filteredCars = cars.filter(car => car.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <input
                type="text"
                placeholder="Search cars..."
                value={searchTerm}
                onChange={handleSearch}
                className="border rounded p-2"
            />
            <div className="car-grid">
                {filteredCars.map(car => (
                    <div key={car.id} className="car-item">
                        <img src={car.imageUrl} alt={car.title} />
                        <h3>{car.title}</h3>
                        <p>{car.price}</p>
                        <button onClick={() => saveFavorite(car.id)}>Add to Favorites</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CarListings;
