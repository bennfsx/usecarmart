import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch favorites on component mount or when page changes
  useEffect(() => {
    fetchFavorites();
  }, [page]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); 
      const decodedToken = jwtDecode(token); 
      const buyerId = decodedToken.id; 

      const response = await axios.get(`http://localhost:8000/favorites?buyer_id=${buyerId}&page=${page}`);

      // Check if the response data is an array before setting favorites
      const favoriteListings = await Promise.all(response.data.map(async (favorite) => {
        // Fetch car listing based on listing_id from the favorite
        const listingResponse = await axios.get(`http://localhost:8000/car-listings/${favorite.listing_id}`);
        return { ...favorite, listing: listingResponse.data }; 
      }));

      setFavorites(favoriteListings);
      setTotalPages(response.data.totalPages || 1); 
    } catch (error) {
      setError('Failed to load favorites.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const buyerId = decodedToken.id;
      

      const response = await axios.get(
        `http://localhost:8000/favorites/search?buyer_id=${buyerId}&query=${searchQuery}`
      );
      

      const favoriteListings = await Promise.all(response.data.map(async (favorite) => {
        const listingResponse = await axios.get(`http://localhost:8000/car-listings/${favorite.listing_id}`);
        return { ...favorite, listing: listingResponse.data };
      }));

      setFavorites(favoriteListings);
    } catch (error) {
      setError('No matches found.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (listingId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const buyerId = decodedToken.id;
      await axios.delete('http://localhost:8000/favorites', {
        headers: { Authorization: `Bearer ${token}` },
        data: { buyer_id: buyerId, listing_id: listingId },
      });
      alert('Listing removed from favorites!');
      fetchFavorites(); 
    } catch (error) {
      setError('Failed to remove listing from favorites.');
      console.error('Error removing favorite:', error); 
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Your Favorite Listings</h1>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <div className="flex justify-center items-center mb-6">
        <input
          type="text"
          placeholder="Search your favorites..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md p-2 border rounded-l-md focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.length > 0 ? (
            favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="p-4 border rounded-md shadow-md hover:shadow-lg transition duration-200"
              >
                <img
                  src={favorite.listing.image_url}
                  alt={favorite.listing.title}
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />
                <h2 className="text-xl font-semibold">{favorite.listing.title}</h2>
                <p className="text-gray-600">Listing ID: {favorite.listing.id}</p>
                <p className="text-gray-500 mt-2">Price: ${favorite.listing.price}</p>
                <p className="text-gray-500">Location: {favorite.listing.location}</p>
                <p className="text-gray-700 mt-2">{favorite.listing.description}</p> {/* Added description */}
                <button
                  onClick={() => handleRemoveFavorite(favorite.listing.id)}
                  className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Remove from Favorites
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-3">No favorites found. Try adding some!</p>
          )}
        </div>
      )}

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="bg-gray-500 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="bg-gray-500 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Favorites;
