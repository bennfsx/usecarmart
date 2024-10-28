// src/components/Home.js
import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import CarAgents from './CarAgents';
import FeaturedListings from './FeaturedListings';
import SearchSection from './SearchSection';
import SellerMetrics from './SellerMetrics';
import Testimonials from './Testimonials';
import Footer from './Footer';

const Home = () => {
    return (
        <div className="bg-gray-50 text-gray-900 min-h-screen">
            <Header />
            <main className="flex flex-col items-center space-y-10">
                <HeroSection />
                <SearchSection />
                <FeaturedListings />
                <CarAgents />
                <SellerMetrics />
                <Testimonials />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
