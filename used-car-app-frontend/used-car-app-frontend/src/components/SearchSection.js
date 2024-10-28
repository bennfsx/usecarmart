import React from 'react';

const SearchSection = () => {
    return (
        <section className="search">
            <h2>Search for Your Ideal Car</h2>
            <form>
                <input type="text" placeholder="Make" />
                <input type="text" placeholder="Model" />
                <input type="text" placeholder="Year" />
                <input type="text" placeholder="Price Range" />
                <button type="submit">Search</button>
            </form>
        </section>
    );
};

export default SearchSection;
