import './style.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import LoanCalculator from './components/LoanCalculator'; // Corrected spelling
import UserProfile from './components/UserProfile';
import SellerDashboard from './components/SellerDashboard'; // Import the new component
import CarListingForm from './components/CarListingForm'; // Import the CarListingForm
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home />} />
                <Route path="/loancalculator" element={<LoanCalculator />} />
                
                {/* Protecting the Seller Dashboard route */}
                <Route 
                    path="/dashboard" 
                    element={
                        <PrivateRoute>
                            <SellerDashboard />
                        </PrivateRoute>
                    } 
                />
                
                {/* Protecting the UserProfile route */}
                <Route 
                    path="/profile" 
                    element={
                        <PrivateRoute>
                            <UserProfile />
                        </PrivateRoute>
                    } 
                />
                
                {/* Route for Car Listing Form */}
                <Route 
                    path="/list-car" 
                    element={
                        <PrivateRoute>
                            <CarListingForm />
                        </PrivateRoute>
                    } 
                />

                <Route path="/" element={<Login />} /> {/* Redirect to login as default */}
            </Routes>
        </Router>
    );
}

export default App;
