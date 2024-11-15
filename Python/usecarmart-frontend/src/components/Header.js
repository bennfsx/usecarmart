import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState(null); // Store user ID for dynamic links

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserRole(decodedToken.role);
      setUserId(decodedToken.id); // Set the user ID for review links
      setIsSeller(decodedToken.role === 'seller');
    } else {
      setIsLoggedIn(false);
      setUserRole('');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserRole('');
    setIsSeller(false);
    setUserId(null);
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 p-4 shadow-lg fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">
          <Link to="/">UsedCarMart</Link>
        </div>
        
        {/* Navigation Links */}
        <nav>
          <ul className="flex items-center space-x-8 text-white">
            <li>
              <Link to="/" className="hover:text-gray-300 transition">Home</Link>
            </li>
            <li>
              <Link to="/loan-calculator" className="hover:text-gray-300 transition">Loan Calculator</Link>
            </li>
            <li>
              <Link to="/agents" className="hover:text-gray-300 transition">Agent List</Link> {/* Added Agent List link */}
            </li>
            {isLoggedIn ? (
              <>
                {isSeller && (
                  <li>
                    <Link to="/list-car" className="hover:text-gray-300 transition">List a Car</Link>
                  </li>
                )}
                <li>
                  <Link to="/favorites" className="hover:text-gray-300 transition">Favorites</Link>
                </li>
                <li>
                  <Link to="/profile" className="hover:text-gray-300 transition">Profile</Link>
                </li>
                {/* Review Links */}
                {userRole === 'admin' && (
                  <li>
                    <Link to="/register" className="hover:text-gray-300 transition">Register</Link>
                  </li>
                )}
                {userRole === 'seller' && (
                  <li>
                  <Link to={`/reviews/agent/${userId}/buyer`} className="hover:text-gray-300 transition">Review Agent</Link>
                </li>
                )}
                {userRole === 'buyer' && (
                  <>
                    <li>
                      <Link to={`/reviews/agent/${userId}/buyer`} className="hover:text-gray-300 transition">Review Agent</Link>
                    </li>
                  </>
                )}
                <li>
                  <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-400 transition">Logout</button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-400 transition">Login</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
