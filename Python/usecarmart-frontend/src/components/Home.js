import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link from react-router-dom
import axios from 'axios';

const Home = () => {
  const [carListings, setCarListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchCarListings = async (page) => {
    try {
      const response = await axios.get(`http://localhost:8000/car-listings?page=${page}&limit=8`);
      setCarListings(response.data.listings);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching car listings:", error);
    }
  };

  useEffect(() => {
    fetchCarListings(currentPage);
  }, [currentPage]);

  const handleListingClick = (carId) => {
    navigate(`/car-listing/${carId}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white text-center py-16 px-4 rounded-lg shadow-md mb-8">
        <h1 className="text-4xl font-bold">Find Your Dream Car</h1>
        <p className="mt-4 text-xl">Explore a wide range of quality used cars at affordable prices.</p>
      </section>

      {/* Car Listings Section */}
      <h2 className="text-3xl font-semibold text-center mb-6">Explore Our Car Listings</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.isArray(carListings) && carListings.length > 0 ? (
          carListings.map((car) => (
            <div
              key={car.id}
              className="border border-gray-300 rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all hover:shadow-2xl hover:transform hover:scale-105"
              onClick={() => handleListingClick(car.id)}
            >
              <img
                src={car.image_url}
                alt={car.title}
                className="w-full h-48 object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800">{car.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{car.description}</p>
                <p className="text-xl font-bold mt-4 text-blue-500">${car.price}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No car listings available.</p>
        )}
      </div>

      {/* Pagination Section */}
      <div className="flex justify-center items-center mt-8 space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md disabled:bg-gray-300 hover:bg-blue-600 transition"
        >
          Previous
        </button>
        <span className="text-lg font-medium text-gray-700">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md disabled:bg-gray-300 hover:bg-blue-600 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
