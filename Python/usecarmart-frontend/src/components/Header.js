import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSeller, setIsSeller] = useState(false);  // Track if the user is a seller

  useEffect(() => {
    // Check if a token exists in localStorage to determine if the user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // Optionally, decode the token and check user role to see if it's a seller
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setIsSeller(decodedToken.role === 'seller');  // Check if the user is a seller
    } else {
      setIsLoggedIn(false);
      setIsSeller(false);
    }
  }, []);

  const handleLogout = () => {
    // Remove token from localStorage and set the login status to false
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsSeller(false);
    navigate('/login');  // Redirect to login page
  };

  return (
    <header className="bg-blue-600 p-4">
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-white">Home</Link>
          </li>
          {isLoggedIn ? (
            <>
              {isSeller && (
                <li>
                  <Link to="/list-car" className="text-white">List a Car</Link>
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="text-white">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="text-white">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-white">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
