import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewList = ({ agentId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/reviews/${agentId}`);
        setReviews(response.data.reviews);
        setLoading(false);
      } catch (error) {
        setError("You have not leave any reviews yet"); //Update reviews
        setLoading(false);
      }
    };
    fetchReviews();
  }, [agentId]);

  return (
    <div className="max-w-2xl mx-auto mt-6 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Reviews</h2>
      {loading ? (
        <div className="text-center text-gray-500">Loading reviews...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : reviews.length === 0 ? (
        <div className="text-center text-gray-500">No reviews yet.</div>
      ) : (
        <div>
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 py-4">
              <div className="flex justify-between">
                <div className="font-semibold text-gray-800">{review.reviewer_id}</div>
                <div className="text-yellow-500">{`${review.rating} Stars`}</div>
              </div>
              <p className="mt-2 text-gray-600">{review.review_text}</p>
              <div className="mt-2 text-sm text-gray-500">{review.created_at}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
