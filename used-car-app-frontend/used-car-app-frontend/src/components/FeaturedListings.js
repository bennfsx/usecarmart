import React from 'react';

const FeaturedListings = () => {
    // Dummy data; replace with API data later
    const cars = [
        { id: 1, name: '2019 Toyota Camry', price: '$25,000', img: 'car1.jpg' },
        { id: 2, name: '2020 Honda Accord', price: '$27,000', img: 'car2.jpg' },
        // Add more car listings here
    ];

    return (
        <section className="featured-listings">
            <h2>Featured Cars for Sale</h2>
            <div className="car-grid">
                {cars.map(car => (
                    <div key={car.id} className="car-item">
                        <img src={car.img} alt={car.name} />
                        <h3>{car.name}</h3>
                        <p>{car.price}</p>
                        <button>Add to Favorites</button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedListings;
