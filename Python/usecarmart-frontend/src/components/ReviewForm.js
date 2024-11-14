import React, { useState } from 'react';

// ReviewForm Component
const ReviewForm = ({ onAddReview }) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState('');

  const agents = [
    { id: 1, name: 'Agent Smith' },
    { id: 2, name: 'Agent Johnson' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAgent || !rating || !reviewText) {
      alert('Please complete all fields.');
      return;
    }

    const newReview = {
      agentName: agents.find(agent => agent.id === parseInt(selectedAgent)).name,
      rating,
      reviewText,
    };

    onAddReview(newReview);

    // Reset form fields
    setReviewText('');
    setRating(0);
    setHoverRating(0);
    setSelectedAgent('');
  };

  // Render stars for rating selection
  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(0)}
        onClick={() => setRating(star)}
        className={`cursor-pointer text-2xl ${
          star <= (hoverRating || rating) ? 'text-yellow-500' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Review an Agent</h2>
      
      {/* Agent selection dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Select Agent:</label>
        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-300"
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
        <label className="block text-gray-700 text-sm font-semibold mb-2">Rating:</label>
        <div className="flex">{renderStars()}</div>
      </div>

      {/* Review text input */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Review:</label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="block w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-300"
          placeholder="Write your review here..."
          required
        />
      </div>

      <button
        type="submit"
        onClick={handleSubmit}
        className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-500 transition duration-200"
      >
        Submit Review
      </button>
    </div>
  );
};

// ReviewList Component
const ReviewList = ({ reviews }) => {
  return (
    <div className="max-w-md mx-auto mt-8 bg-gray-50 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Submitted Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className="mb-4 border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-700">{review.agentName}</h3>
            <div className="flex mb-1">
              {[...Array(review.rating)].map((_, i) => (
                <span key={i} className="text-yellow-500">★</span>
              ))}
              {[...Array(5 - review.rating)].map((_, i) => (
                <span key={i} className="text-gray-300">★</span>
              ))}
            </div>
            <p className="text-gray-600">{review.reviewText}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-600 text-center">No reviews submitted yet.</p>
      )}
    </div>
  );
};

// Main App Component
const App = () => {
  const [reviews, setReviews] = useState([]);

  const addReview = (newReview) => {
    setReviews([...reviews, newReview]);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <ReviewForm onAddReview={addReview} />
      <ReviewList reviews={reviews} />
    </div>
  );
};

export default App;
