import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import UserForm from './UserForm';
import Dashboard from './Dashboard'; // Import Dashboard

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/user-form" element={<UserForm />} />
                <Route path="/dashboard" element={<Dashboard />} /> {/* Add this route */}
            </Routes>
        </Router>
    );
};

export default App;
