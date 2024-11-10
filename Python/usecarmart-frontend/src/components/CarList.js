import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CarListings = () => {
  const [carListings, setCarListings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    const fetchCarListings = async () => {
      try {
        const response = await axios.get('http://localhost:8000/car-listings', {
            params: {
              page: pagination.page,
              limit: 5,
            },
          });
          
        setCarListings(response.data.listings);
        setPagination({
          page: pagination.page,
          totalPages: response.data.totalPages,
        });
      } catch (error) {
        setError('Failed to fetch car listings');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarListings();
  }, [pagination.page]);

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Car Listings</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {carListings.map((car) => (
          <div key={car.id} className="bg-white p-4 rounded-lg shadow-md">
            <img src={car.image_url} alt={car.title} className="w-full h-48 object-cover rounded-md mb-4" />
            <h3 className="text-xl font-bold">{car.title}</h3>
            <p className="text-gray-600">{car.description}</p>
            <p className="text-lg font-semibold mt-2">Price: ${car.price}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button
          disabled={pagination.page === 1}
          onClick={() => handlePageChange(pagination.page - 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Previous
        </button>
        <button
          disabled={pagination.page === pagination.totalPages}
          onClick={() => handlePageChange(pagination.page + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CarListings;
