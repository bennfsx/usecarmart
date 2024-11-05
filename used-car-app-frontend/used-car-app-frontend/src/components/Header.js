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
        <header className="flex items-center justify-between p-4 bg-white shadow-md">
            <div className="logo text-2xl font-bold text-indigo-600">Used Car Market</div>
            <nav>
                <ul className="flex space-x-6">
                    <li><a href="/home" className="text-gray-800 hover:text-indigo-600 transition">Home</a></li>
                    <li><a href="/list-car" className="text-gray-800 hover:text-indigo-600 transition font-semibold">Sell Cars</a></li>
                    <li><a href="/profile" className="text-gray-800 hover:text-indigo-600 transition">My Account</a></li>
                    <li><a href="/about" className="text-gray-800 hover:text-indigo-600 transition">About Us</a></li>
                    <li><a href="/contact" className="text-gray-800 hover:text-indigo-600 transition">Contact</a></li>
                    <li><a href="/loancalculator" className="text-gray-800 hover:text-indigo-600 transition">Loan Calculator</a></li>
                    {isLoggedIn ? (
                        <li>
                            <button 
                                onClick={handleLogout} 
                                className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
                            >
                                Logout
                            </button>
                        </li>
                    ) : (
                        <li>
                            <a 
                                href="/login" 
                                className="text-indigo-600 hover:underline transition"
                            >
                                Login
                            </a>
                        </li>
                    )}
                </ul>
            </nav>
            <input 
                type="text" 
                placeholder="Search for cars..." 
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
        </header>
    );
};

export default Header;
