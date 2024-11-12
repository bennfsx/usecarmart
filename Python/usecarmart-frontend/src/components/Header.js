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
      // Decode the token and check user role to see if it's a seller
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
    <header className="bg-blue-600 p-4 shadow-lg">
      <nav>
        <ul className="flex items-center space-x-6">
          <li>
            <Link to="/" className="text-white text-lg font-semibold hover:text-gray-300">Home</Link>
          </li>
          {/* Add Loan Calculator link */}
          <li>
            <Link to="/loan-calculator" className="text-white text-lg font-semibold hover:text-gray-300">Loan Calculator</Link>
          </li>
          {isLoggedIn && (
            <>
              {isSeller && (
                <li>
                  <Link to="/list-car" className="text-white text-lg font-semibold hover:text-gray-300">List a Car</Link>
                </li>
              )}
              <li>
                <Link to="/favorites" className="text-white text-lg font-semibold hover:text-gray-300">Favorites</Link>
              </li>
              <li>
                <Link to="/profile" className="text-white text-lg font-semibold hover:text-gray-300">Profile</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="text-white text-lg font-semibold hover:text-gray-300">Logout</button>
              </li>
            </>
          )}
          {!isLoggedIn && (
            <>
              <li>
                <Link to="/login" className="bg-yellow-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-yellow-400 transition">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-white text-lg font-semibold hover:text-gray-300">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
