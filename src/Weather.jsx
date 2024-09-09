import { useState } from "react";
import axios from 'axios';
import sunIcon from './cloudy.png';

function Weather() 
{
    
    const [city, setCity] = useState("");
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const apikey = "85525e383fdb491886d171556241607";

    const getWeather = async () => {
        try {
            const response = await axios.get(`https://api.weatherapi.com/v1/current.json`, {
                params: {
                    q: city,
                    key: apikey,
                    units: 'metric'
                }
            });

            setData({
                city: response.data.location.name,
                time: response.data.location.localtime,
                temperature: response.data.current.temp_c,
                condition: response.data.current.condition.text,
                humidity: response.data.current.humidity,
                icon: response.data.current.condition.icon,
                latitude: response.data.location.lat,
                longitude: response.data.location.lon
            });

            setError('');
        } catch (err) {
            setError('City not found. Please enter a valid city name.');
            setData(null);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        getWeather();
    };

    const handleInputChange = async (event) => {
        const value = event.target.value;
        setCity(value);
        
        try {
            const response = await axios.get(`https://api.weatherapi.com/v1/search.json`, {
                params: {
                    q: value,
                    key: apikey
                }
            });
            setSuggestions(response.data.slice(0, 5));
        } catch (err) {
            console.error('Error fetching suggestions:', err);
            setSuggestions([]);
        }
    };

    const handleSelectCity = (cityName) => {
        setCity(cityName);
        setSuggestions([]);
    };

    return (
        <div className="weather-container">
            <div className="weather-box">
                <div className="weather-header">
                    <img src={sunIcon} alt="Sun Icon" className="weather-icon" />
                    <h1 className="weather-title">Weather App</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="autocomplete">
                        <input
                            type="text"
                            value={city}
                            onChange={handleInputChange}
                            placeholder="Enter City name"
                            className="weather-input"
                        />
                        {suggestions.length > 0 && (
                            <ul className="suggestions-list">
                                {suggestions.map((item) => (
                                    <li
                                        key={item.id}
                                        onClick={() => handleSelectCity(item.name)}
                                    >
                                        {item.name}, {item.region}, {item.country}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <input type="submit" value="Display Forecast" className="weather-btn" />
                </form>
                {error && <p className="weather-error">{error}</p>}
                {data && (
                    <div className="row d-flex justify-content-center py-5">
                        <div className="col-md-8 col-lg-6 col-xl-5">
                            <div className="card text-body" style={{ borderRadius: '35px', backgroundColor: '#f0f0f0', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h3 className="card-title">{data.city}</h3>
                                        <h5>{data.time}</h5>
                                    </div>
                                    <h1 className="display-4 mb-0 font-weight-bold">{data.temperature}°C</h1>
                                    <p className="small" style={{ color: '#868B94' }}>{data.condition}</p>
                                    <div className="d-flex justify-content-between mt-4">
                                        <div>
                                            <i className="fas fa-tint fa-fw" style={{ color: '#868B94' }}></i>
                                            <span className="ms-1">Humidity : {data.humidity}%</span>
                                        </div>
                                        <div>
                                            <span className="ms-1">Latitude : {data.latitude}, 
                                                Longitude : {data.longitude}</span>
                                        </div>
                                    </div>
                                    <div className="text-center mt-4">
                                        <img src={data.icon} width="100px" alt="Weather Icon" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Weather;
