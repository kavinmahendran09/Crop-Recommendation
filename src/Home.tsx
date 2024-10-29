import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';
import { FaSeedling, FaMoneyBillWave, FaCloudSun } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    const handleGetStartedClick = () => {
        navigate('/user-form'); // Navigate to UserForm page
    };

    return (
        <div>
            <Navbar />
            {/* Hero Section */}
            <header className="hero bg-primary text-white text-center py-5">
                <div className="container">
                    <h1 className="display-4">Welcome to CropWise</h1>
                    <p className="lead">Your ultimate guide to sustainable farming practices.</p>
                    <button className="btn btn-light btn-lg" onClick={handleGetStartedClick}>Get Started</button>
                </div>
            </header>
            {/* Features Section */}
            <section id="features" className="py-5">
                <div className="container">
                    <h2 className="text-center mb-4">Our Features</h2>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="card mb-4 shadow-sm">
                                <div className="card-body text-center">
                                    <FaSeedling className="text-primary" style={{ fontSize: '4rem' }} />
                                    <h5 className="card-title fs-4 mt-3">Crop Recommendations</h5>
                                    <p className="card-text">
                                        Based on soil health, weather conditions, and market demand, our system provides tailored crop suggestions to optimize your yield and profit.
                                    </p>
                                    <p className="card-text">
                                        Make informed decisions to increase your agricultural success.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card mb-4 shadow-sm">
                                <div className="card-body text-center">
                                    <FaMoneyBillWave className="text-primary" style={{ fontSize: '4rem' }} />
                                    <h5 className="card-title fs-4 mt-3">Market Prices</h5>
                                    <p className="card-text">
                                        Stay updated with real-time market prices for various crops, allowing you to make informed selling decisions. Access historical pricing trends to better strategize your sales.
                                    </p>
                                    <p className="card-text">
                                        All price data taken from <a href="https://www.data.gov.in" target="_blank" rel="noopener noreferrer">data.gov.in</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card mb-4 shadow-sm">
                                <div className="card-body text-center">
                                    <FaCloudSun className="text-primary" style={{ fontSize: '4rem' }} />
                                    <h5 className="card-title fs-4 mt-3">Weather Insights</h5>
                                    <p className="card-text">
                                        Access real-time weather data, including humidity, temperature, and precipitation forecasts. Make proactive decisions for irrigation and planting based on accurate predictions.
                                    </p>
                                    <p className="card-text">
                                        Achieve real-time crop recommendations.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Jumbotron Section */}
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <div className="jumbotron bg-dark text-white p-4" style={{ backgroundColor: '#6c757d' }}>
                            <h1 className="display-4">Ready to Grow?</h1>
                            <p className="lead">Join us in transforming the agricultural landscape with smart farming practices.</p>
                            <a className="btn btn-primary btn-lg" onClick={handleGetStartedClick}>Get Started</a>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h2>Why Choose CropWise?</h2>
                        <p>
                            CropWise is designed to empower farmers by providing data-driven insights and recommendations. Our platform leverages the latest technology to analyze soil health, weather patterns, and market trends, helping you make informed decisions that lead to better yields and profits.
                        </p>
                        <p>
                            With our easy-to-use interface, you can access valuable information at your fingertips. Whether you're a small-scale farmer or managing large agricultural operations, CropWise is here to support you every step of the way.
                        </p>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <footer className="bg-light text-center py-4">
                <p>© 2024 CropWise. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
