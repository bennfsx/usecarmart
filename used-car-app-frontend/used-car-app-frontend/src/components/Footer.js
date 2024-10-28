// src/components/Footer.js
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-8">
            <div className="container mx-auto text-center">
                <p className="text-sm md:text-base mb-4">&copy; 2024 Used Car Market. All rights reserved.</p>
                <ul className="flex justify-center space-x-6 text-sm md:text-base">
                    <li>
                        <a href="/about" className="hover:text-white transition-colors duration-300">About Us</a>
                    </li>
                    <li>
                        <a href="/privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
                    </li>
                    <li>
                        <a href="/terms" className="hover:text-white transition-colors duration-300">Terms of Service</a>
                    </li>
                    <li>
                        <a href="/contact" className="hover:text-white transition-colors duration-300">Contact Us</a>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
