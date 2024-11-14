import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ListCar from './components/CarListingForm';
import Header from './components/Header';
import IndividualCarListing from './components/IndividualCarListing';
import LoanCalculator from './components/LoanCalculator';
import UserProfile from './components/UserProfile';
import Favorites from './components/Favorites';
import Reviews from './components/Reviews'; // Component for managing/reviewing car listings
import AgentReviewPage from './components/AgentReviewPage'; // Agent Review Page
import AgentList from './components/AgentList'; // Agent List page
import AgentProfile from './components/AgentProfile'; // Import the AgentProfile component

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Header is globally available across all routes */}
        <Header />
        
        {/* Added padding-top to create space after the header */}
        <div className="container mx-auto p-4 pt-16">
          <Routes>
            {/* Define routes for various pages */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/list-car" element={<ListCar />} />
            <Route path="/car-listing/:id" element={<IndividualCarListing />} />
            <Route path="/loan-calculator" element={<LoanCalculator />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/favorites" element={<Favorites />} />
            
            {/* Reviews related routes */}
            <Route path="/reviews" element={<Reviews />} /> {/* For managing/reviewing car listings */}
            <Route path="/reviews/agent/:agentId/:reviewerId" element={<AgentReviewPage />} /> {/* Agent review form */}
            
            {/* Agent routes */}
            <Route path="/agents" element={<AgentList />} /> {/* Agent list route */}
            <Route path="/agents/:id" element={<AgentProfile />} /> {/* Individual agent profile route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
