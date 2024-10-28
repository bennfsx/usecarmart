// src/components/SellerMetrics.js
import React from 'react';

// Mock data; replace with API data later
const mockData = {
    views: 150,
    shortlists: 20,
};

const SellerMetrics = () => {
    return (
        <section className="seller-metrics">
            <h2>Your Car Interest Metrics</h2>
            <div className="metrics">
                <div className="metric">
                    <h3>Views</h3>
                    <p>{mockData.views}</p>
                </div>
                <div className="metric">
                    <h3>Shortlisted</h3>
                    <p>{mockData.shortlists}</p>
                </div>
            </div>
            <p>Track how many potential buyers are interested in your cars!</p>
        </section>
    );
};

export default SellerMetrics;
