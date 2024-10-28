import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from local storage
        navigate('/login'); // Redirect to login page
    };

    const isLoggedIn = !!localStorage.getItem('token'); // Check if the user is logged in

    return (
        <header className="flex items-center justify-between p-4 bg-white shadow">
            <div className="logo text-xl font-bold">Used Car Market</div>
            <nav>
                <ul className="flex space-x-4">
                    <li><a href="/home" className="hover:text-indigo-600">Home</a></li>
                    <li><a href="/buy" className="hover:text-indigo-600">Buy Cars</a></li>
                    <li><a href="/sell" className="hover:text-indigo-600">Sell Cars</a></li>
                    <li><a href="/profile" className="hover:text-indigo-600">My Account</a></li>
                    <li><a href="/about" className="hover:text-indigo-600">About Us</a></li>
                    <li><a href="/contact" className="hover:text-indigo-600">Contact</a></li>
                    {isLoggedIn ? (
                        <li>
                            <button 
                                onClick={handleLogout} 
                                className="text-indigo-600 hover:underline"
                            >
                                Logout
                            </button>
                        </li>
                    ) : (
                        <li>
                            <a 
                                href="/login" 
                                className="text-indigo-600 hover:underline"
                            >
                                Login
                            </a>
                        </li>
                    )}
                </ul>
            </nav>
            <input type="text" placeholder="Search for cars..." className="border rounded p-2" />
        </header>
    );
};

export default Header;
