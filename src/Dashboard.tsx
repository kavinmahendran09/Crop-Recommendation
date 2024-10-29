import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const Dashboard: React.FC = () => {
    const location = useLocation();
    const result = location.state?.result;

    if (!result) {
        return <div>No data to display</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h2>Prediction Results</h2>
                <p><strong>Best Crop to Grow:</strong> {result.best_crop}</p>
                <p><strong>Estimated Yield:</strong> {result.best_yield} quintals per hectare</p>
                <p><strong>Price per Quintal:</strong> Rs. {result.price_per_quintal}</p>
                <p><strong>Total Revenue:</strong> Rs. {result.total_revenue}</p>
            </div>
        </div>
    );
};

export default Dashboard;
