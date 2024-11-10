import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ListCar from './components/CarListingForm';
import Header from './components/Header';  // Import Header component

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Include Header here */}
        <Header />

        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/list-car" element={<ListCar />} /> {/* Route for listing a car */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
