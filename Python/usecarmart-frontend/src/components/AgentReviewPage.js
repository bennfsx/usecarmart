import React from "react";
import ReviewForm from "./ReviewForm";


const AgentReviewPage = ({ agentId, reviewerId }) => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Agent Reviews</h1>
        
        {/* Review Form */}
        <ReviewForm agentId={agentId} reviewerId={reviewerId} />

       
      </div>
    </div>
  );
};

export default AgentReviewPage;
