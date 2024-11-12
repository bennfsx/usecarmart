import { useEffect, useState } from 'react';
import axios from 'axios';

const CarListings = () => {
  const [cars, setCars] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [buyerId, setBuyerId] = useState(null); 

  useEffect(() => {
    axios
      .get('/api/car/car-listings', {
        params: { page, limit, search, min_price: minPrice, max_price: maxPrice },
      })
      .then((response) => {
        setCars(response.data.listings);
      })
      .catch((error) => console.error('Error fetching car listings:', error));
  }, [page, limit, search, minPrice, maxPrice]);

  const handleSaveCar = (carId, action) => {
    axios
      .post(`/api/car/${carId}/save`, { action, buyer_id: buyerId })
      .then((response) => {
        alert(`Car listing added to ${action} successfully!`);
      })
      .catch((error) => {
        console.error('Error saving car:', error);
        alert('Failed to save car listing.');
      });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          className="p-2 border rounded"
          placeholder="Search for cars..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex space-x-2">
          <input
            type="number"
            className="p-2 border rounded"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            className="p-2 border rounded"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cars.map((car) => (
          <div key={car.id} className="bg-white p-4 rounded shadow-md">
            <img src={car.image_url} alt={car.title} className="w-full h-48 object-cover rounded" />
            <h3 className="text-xl font-semibold mt-2">{car.title}</h3>
            <p className="text-gray-600">{car.description}</p>
            <p className="font-bold text-xl mt-2">${car.price}</p>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => handleSaveCar(car.id, 'shortlist')}
                className="px-4 py-2 bg-yellow-500 text-white rounded"
              >
                Shortlist
              </button>
              <button
                onClick={() => handleSaveCar(car.id, 'favorite')}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Favorite
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="mx-2">{page}</span>
        <button
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CarListings;
