// src/components/Logout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token
        navigate('/login'); // Redirect to login page
    };

    return (
        <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded">
            Logout
        </button>
    );
};

export default Logout;
