import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// ReviewForm Component
const ReviewForm = () => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [agents, setAgents] = useState([]);
  const [userId, setUserId] = useState(null); // Assuming the logged-in user's ID will be fetched or passed
  const [userRole, setUserRole] = useState(''); // To store the user role
  const [reviews, setReviews] = useState([]); // Reviews state to hold fetched reviews

  // Fetch agents list and user info when component mounts
  useEffect(() => {
    // Fetch the list of agents
    axios
      .get('http://localhost:8000/agents') // Fetch the agents list
      .then((response) => {
        setAgents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching agents:', error);
      });

    // Get logged-in user details from JWT token
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id);
      setUserRole(decodedToken.role); // Fetch the role from the decoded JWT token
    }

    // Fetch reviews for the current user
    if (userId) {
      axios
        .get(`http://localhost:8000/reviews?user_id=${userId}`)
        .then((response) => {
          const reviews = response.data.reviews; // Extract the reviews array from the response
          if (Array.isArray(reviews)) {
            // Filter reviews to only show those by the current user (based on reviewer_id)
            const userReviews = reviews.filter(review => review.reviewer_id === userId);
            setReviews(userReviews); // Set only the user's own reviews
          } else {
            console.error('Response data is not an array:', reviews);
          }
        })
        .catch((error) => {
          console.error('Error fetching reviews:', error);
        });
    }
  }, [userId]); // Re-run effect when userId changes

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAgent || !rating || !reviewText || !userId) {
      alert('Please complete all fields.');
      return;
    }

    // Check if the user is allowed to review (only sellers or buyers can review)
    if (userRole !== 'seller' && userRole !== 'buyer') {
      alert('Only sellers or buyers can submit reviews.');
      return;
    }

    const newReview = {
      agent_id: selectedAgent,
      reviewer_id: userId, // Use the logged-in user's ID
      role: userRole, // Use the logged-in user's role
      rating,
      review_text: reviewText,
    };

    // Send review to backend via POST request
    axios
      .post('http://localhost:8000/reviews', newReview)
      .then((response) => {
        alert('Review submitted successfully!');
        // Reload the page to reflect the new review
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error submitting review:', error);
        alert('Failed to submit review');
      });
  };

  // Render stars for rating selection
  const renderStars = () => {
    const validRating = typeof rating === 'number' && rating >= 1 && rating <= 5 ? rating : 0;

    const stars = [1, 2, 3, 4, 5]; // Array to map over for the 5 stars

    return stars.map((star) => (
      <span
        key={star}
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(0)}
        onClick={() => setRating(star)}
        className={`cursor-pointer text-2xl ${star <= (hoverRating || validRating) ? 'text-yellow-500' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 p-8 rounded-lg shadow-lg mt-8">
      <h2 className="text-4xl font-semibold mb-8 text-gray-800 text-center">Review an Agent</h2>

      <div className="bg-white rounded-lg p-6 shadow-md space-y-6">
        <form onSubmit={handleSubmit}>
          {/* Agent selection dropdown */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Select Agent:</label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-300 focus:outline-none"
              required
            >
              <option value="" disabled>Select an agent</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>

          {/* Rating stars */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Rating:</label>
            <div className="flex justify-start">{renderStars()}</div>
          </div>

          {/* Review text input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Review:</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-300 focus:outline-none"
              placeholder="Write your review here..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-500 transition duration-200"
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Display the reviews */}
      <div className="mt-10 space-y-8">
        <h3 className="text-3xl font-semibold text-gray-800">Your Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-semibold text-gray-800 text-xl mb-2">{review.agentName}</h4>
              <div className="flex mb-2">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={index < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-700 text-lg">{review.review_text}</p>
              <p className="text-sm text-gray-500 mt-2">Updated on: {new Date(review.updated_at).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">You have not submitted any reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewForm;
