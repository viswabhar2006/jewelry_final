import React from 'react';
import './HomePage.css'; // Import your CSS file for styling

const HomePage = () => {

    return (
        <div className="home-container">
            {/* Background video */}
            <video autoPlay muted loop className="background-video">
                <source src="/1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Main content */}
            <div className="container">
                <header>
                    <h1>Jewelry Design</h1>
                </header>
                <p>Welcome to the future of jewelry design. Discover patterns, create your own, and explore new trends.</p>
                <button onClick={() => window.location.href = '/Login'}>Get Started</button>
            </div>
        </div>
    );
};

export default HomePage;
