import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [role, setRole] = useState('');

  useEffect(() => {
    // Get the user role from the JWT or localStorage
    const token = localStorage.getItem('token');
    const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
    setRole(decodedToken ? decodedToken.role : '');

    // Fetch reviews based on the role
    if (decodedToken && decodedToken.role === 'buyer') {
      fetchReviewsForBuyer();
    } else if (decodedToken && decodedToken.role === 'seller') {
      fetchReviewsForSeller();
    }
  }, []);

  const fetchReviewsForBuyer = async () => {
    try {
      const response = await axios.get('/api/reviews'); // Adjust the endpoint based on your API
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchReviewsForSeller = async () => {
    try {
      const response = await axios.get('/api/reviews/manage'); // Adjust the endpoint for sellers
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">{role === 'seller' ? 'Manage Reviews' : 'View Reviews'}</h2>
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="p-4 border border-gray-300 rounded-md">
              <h3 className="font-semibold">{review.reviewer_name}</h3>
              <p className="text-gray-600">{review.review_text}</p>
              <div className="flex items-center mt-2">
                <span className="text-yellow-400">{'★'.repeat(review.rating)}</span>
              </div>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default Reviews;
