import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const UserForm: React.FC = () => {
    const navigate = useNavigate();

    const [countries, setCountries] = useState<string[]>([]);
    const [states, setStates] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCountry, setSelectedCountry] = useState('India'); // Default to India
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [area, setArea] = useState<number | ''>(''); // Area of land
    const [authToken, setAuthToken] = useState('');

    const handleBackClick = () => {
        navigate('/');
    };

    // Fetch Access Token
    useEffect(() => {
        const fetchAccessToken = async () => {
            const response = await fetch('https://www.universal-tutorial.com/api/getaccesstoken', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'api-token': 'bnMxgjRIveTl3xB4FqDTveJsA1ebgJ6ZCo_VBgchrOfkMzhgmgZIszMqlYeahExqQjc', // Replace with your actual API token
                    'user-email': 'kb7634@srmist.edu.in' // Replace with your actual email
                }
            });
            const data = await response.json();
            setAuthToken(data.auth_token); // Store the auth token
        };

        fetchAccessToken();
    }, []);

    // Fetch Countries
    useEffect(() => {
        const fetchCountries = async () => {
            if (!authToken) return; // Ensure auth token is present
            const response = await fetch('https://www.universal-tutorial.com/api/countries', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            setCountries(data.map((country: { country_name: string }) => country.country_name)); // Set countries
        };

        fetchCountries();
    }, [authToken]);

    // Fetch States
    useEffect(() => {
        const fetchStates = async () => {
            if (!authToken || !selectedCountry) return; // Ensure auth token and selected country are present
            const response = await fetch(`https://www.universal-tutorial.com/api/states/${selectedCountry}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            setStates(data.map((state: { state_name: string }) => state.state_name)); // Set states
        };

        fetchStates();
    }, [authToken, selectedCountry]);

    const handleStateChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const state = event.target.value;
        setSelectedState(state);
        setSelectedCity(''); // Reset city when state changes

        if (state) {
            const response = await fetch(`https://www.universal-tutorial.com/api/cities/${state}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            setCities(data.map((city: { city_name: string }) => city.city_name)); // Set cities
        } else {
            setCities([]); // Clear cities if no state selected
        }
    };

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission

        const requestData = {
            city: selectedCity,
            month: new Date().toLocaleString('default', { month: 'long' }),
            area: area,
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/predict-crop', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result); // Handle the result here (e.g., display in the UI)
                navigate('/dashboard', { state: { result } }); // Navigate to Dashboard with result
            } else {
                console.error('Error in response:', response.statusText);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h2 className="text-center mb-4">User Information</h2>
                <form onSubmit={handleSubmit}> {/* Add onSubmit handler */}
                    <div className="mb-3">
                        <label htmlFor="country" className="form-label">Select Country</label>
                        <select className="form-select" id="country" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                            {countries.map((country, index) => (
                                <option key={index} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="state" className="form-label">Select State</label>
                        <select className="form-select" id="state" required onChange={handleStateChange}>
                            <option value="">Choose...</option>
                            {states.map((state, index) => (
                                <option key={index} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="city" className="form-label">Select City</label>
                        <select className="form-select" id="city" required value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedState}>
                            <option value="">Choose...</option>
                            {selectedState && cities.map((city, index) => (
                                <option key={index} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="area" className="form-label">Area of Land (in hectares)</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            id="area" 
                            placeholder="Enter area in hectares" 
                            value={area} 
                            onChange={(e) => setArea(Number(e.target.value))} 
                            required 
                        />
                    </div>
                    <button type="button" className="btn btn-secondary" onClick={handleBackClick}>Back</button>
                    <button type="submit" className="btn btn-primary ms-2">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
