// App.js
import './style.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import LoanCalculator from './components/LoanCalculator';
import UserProfile from './components/UserProfile';
import SellerDashboard from './components/SellerDashboard';
import CarListingForm from './components/CarListingForm';
import PrivateRoute from './components/PrivateRoute';
import FeaturedListings from './components/FeaturedListings'; // Import FeaturedListings
import Favorites from './components/FavoriteListings'; // Import Favorites component

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home />} />
                <Route path="/loancalculator" element={<LoanCalculator />} />
                <Route path="/featured" element={<FeaturedListings />} />
                
                <Route 
                    path="/favorites" 
                    element={
                        <PrivateRoute>
                            <Favorites />
                        </PrivateRoute>
                    } 
                />

                <Route 
                    path="/dashboard" 
                    element={
                        <PrivateRoute>
                            <SellerDashboard />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/profile" 
                    element={
                        <PrivateRoute>
                            <UserProfile />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/list-car" 
                    element={
                        <PrivateRoute>
                            <CarListingForm />
                        </PrivateRoute>
                    } 
                />
                <Route path="/" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
