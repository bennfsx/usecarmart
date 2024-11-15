import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    axios
      .get('http://localhost:8000/agents') 
      .then((response) => {
        setAgents(response.data); 
        setLoading(false); 
      })
      .catch((err) => {
        setError("Failed to load agents. Please try again."); 
        setLoading(false);
      });
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Loading agents...</div>
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

  // Display the agents
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Meet Our Agents</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="relative">
              <img
                src="https://via.placeholder.com/150" // Placeholder for agent profile image (replace with real data)
                alt={`${agent.name || 'Agent'}'s profile`}
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h3 className="text-xl font-semibold text-white">{agent.name || 'Unnamed Agent'}</h3>
                <p className="text-sm text-white">{agent.role}</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">{agent.email}</p>
              <p className="text-sm text-gray-600 mb-4">{agent.phone_number || 'Phone not provided'}</p>
              <p className="text-sm text-gray-600 mb-4">{agent.address || 'Address not provided'}</p>
              <button
                onClick={() => navigate(`/agents/${agent.id}`)} // Navigate to the agent profile page
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentList;
