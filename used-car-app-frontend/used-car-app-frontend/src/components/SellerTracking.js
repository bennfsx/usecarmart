import React from 'react';

const SellerTracking = () => {
    return (
        <section className="seller-tracking">
            <h2>Track Your Sales</h2>
            <p>Sellers can manage their listings and view interested buyers.</p>
            <button onClick={() => window.location.href='/seller-dashboard'}>View My Listings</button>
        </section>
    );
};

export default SellerTracking;
