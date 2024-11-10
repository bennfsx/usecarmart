import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ListCar from './components/CarListingForm';
import Header from './components/Header';
import IndividualCarListing from './components/IndividualCarListing'; // Import IndividualCarListing

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/list-car" element={<ListCar />} />
            <Route path="/car-listing/:id" element={<IndividualCarListing />} /> {/* Individual listing route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
