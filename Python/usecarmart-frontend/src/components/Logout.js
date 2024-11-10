// src/components/Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the JWT token from localStorage (or sessionStorage, wherever you saved it)
    localStorage.removeItem('token');

    // Optionally clear other session data
    // localStorage.removeItem('userDetails'); // If you stored other user details

    // Redirect to login page after logout
    navigate('/login');
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
