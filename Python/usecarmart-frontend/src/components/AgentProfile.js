import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AgentProfile = () => {
  const { id } = useParams();
  const [agentProfile, setAgentProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the specific agent profile and reviews
    axios
      .get(`http://localhost:8000/agents/${id}`)
      .then((response) => {
        setAgentProfile(response.data.agent_profile);
        setReviews(response.data.reviews);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load agent profile.");
        setLoading(false);
      });
  }, [id]);

  // Helper function to render star rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 !== 0 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-500">&#9733;</span>
        ))}
        {halfStars === 1 && <span className="text-yellow-500">&#9733;</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">&#9733;</span>
        ))}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Loading agent profile...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      {agentProfile && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-10">
          <div className="flex items-center mb-6">
            <img
              src="https://via.placeholder.com/150" // Replace with actual profile image if available
              alt={`${agentProfile.name || 'Agent'}'s profile`}
              className="w-24 h-24 rounded-full shadow-lg object-cover mr-6"
            />
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{agentProfile.name || "Unnamed Agent"}</h2>
              <p className="text-gray-500">{agentProfile.email}</p>
              <p className="text-gray-500">{agentProfile.phone_number || "Phone not provided"}</p>
              <p className="text-gray-500">{agentProfile.address || "Address not provided"}</p>
            </div>
          </div>
          <div className="text-gray-600 mb-4">
            <h4 className="font-semibold">About Agent:</h4>
            <p className="text-sm">Experienced real estate agent with a proven track record of helping clients find their perfect home. Specialized in residential properties and known for excellent customer service.</p>
          </div>
          <div className="text-gray-600 mb-4">
            <h4 className="font-semibold">Role:</h4>
            <p className="text-sm">{agentProfile.role}</p>
          </div>
          <div className="text-gray-600">
            <h4 className="font-semibold">Joined on:</h4>
            <p className="text-sm">{new Date(agentProfile.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      )}

      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Client Reviews</h3>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-semibold text-gray-800">Reviewed by {review.role}</h4>
              {renderStars(review.rating)}
            </div>
            <p className="text-gray-700 mb-2">{review.review_text}</p>
            <p className="text-gray-500 text-sm">
              <em>Reviewed on: {new Date(review.created_at).toLocaleDateString()}</em>
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No reviews available.</p>
      )}
    </div>
  );
};

export default AgentProfile;
