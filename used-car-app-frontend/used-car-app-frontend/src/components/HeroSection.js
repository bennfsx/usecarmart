// src/components/HeroSection.js
import React from 'react';

const HeroSection = () => {
    return (
        <section className="hero bg-gray-800 text-white py-20 px-6 flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Find Your Perfect Used Car Today!
            </h1>
            <div className="space-x-4">
                <button 
                    onClick={() => window.location.href='/listings'} 
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md shadow-lg transition duration-300 ease-in-out"
                >
                    View Listings
                </button>
                <button 
                    onClick={() => window.location.href='/sell'} 
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md shadow-lg transition duration-300 ease-in-out"
                >
                    List Your Car
                </button>
            </div>
        </section>
    );
};

export default HeroSection;
