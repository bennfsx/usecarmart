// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth'; // Make sure this function checks if the user is logged in

const PrivateRoute = ({ children }) => {
    return isLoggedIn() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
