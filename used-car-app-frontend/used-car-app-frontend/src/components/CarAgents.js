import React from 'react';

const CarAgents = () => {
    return (
        <section className="car-agents">
            <h2>Manage Your Listings</h2>
            <p>Agents can create, edit, and manage their car listings easily.</p>
            <button onClick={() => window.location.href='/agent-dashboard'}>Manage Listings</button>
        </section>
    );
};

export default CarAgents;
