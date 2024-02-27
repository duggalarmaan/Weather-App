import React, { useState, useEffect } from 'react'; // import necessary hooks from react
import axios from 'axios'; // import axios library for making HTTP requests

const Weather = () => {
  // declare state variables and their initial values using the useState hook
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState('');
  const [unit, setUnit] = useState('C');

  // event handler function for input change
  const handleInputChange = (event) => {
    setLocation(event.target.value);
  };

  // event handler function for unit change
  const handleUnitChange = (event) => {
    setUnit(event.target.value);
  };

  const fetchWeatherData = (latitude, longitude) => {
    const apiKey = '13d7e17f639f403092c45238231704'; // API key for Weather API
    let currentApiUrl;
    let forecastApiUrl;

    if (latitude && longitude) {
        // if geolocation is available, use it to get weather data
        currentApiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`;
        forecastApiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=5`;
    } else {
        // otherwise, use the location entered by the user
        currentApiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;
        forecastApiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=5`;
    }

  // make parallel HTTP GET requests to the API using axios library
  axios
    .all([
      axios.get(currentApiUrl), // fetch current weather data from the API
      axios.get(forecastApiUrl) // fetch forecast weather data from the API
    ])
    .then(axios.spread((currentResponse, forecastResponse) => {
      setWeather({
        location: currentResponse.data.location,
        current: currentResponse.data.current,
        forecast: forecastResponse.data.forecast
      }); // update weather state with the API response data
    }))
    .catch(error => {
      console.error(error); // log any errors to the console
      setWeather(null); // reset weather state if API call fails
    });
}; 

useEffect(() => {
    if (location) {
      fetchWeatherData(); // fetch weather data using the specified location
    } else {
      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          fetchWeatherData(latitude, longitude); // fetch weather data using the device's geolocation
        },
        error => {
          console.error(error); // log any errors to the console
          fetchWeatherData(); // fallback to fetching weather data using default location
        }
      );
    }
  }, [location]);
  

/*   // useEffect hook to fetch weather data on initial page load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        fetchWeatherData(latitude, longitude);
      },
      error => {
        console.error(error); // log any errors to the console
        fetchWeatherData(); // fallback to fetching weather data using default location
      }
    );
  }, []); // empty dependency array to ensure this effect only runs once on initial page load

  useEffect(() => {
    fetchWeatherData();
  }, [location]);

  console.log(weather);
 */
  return (
    <div className="container">
      <h1 className="display-4 text-center my-5">Weather App</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter location"
          value={location}
          onChange={handleInputChange}
        />
        <button className="btn btn-primary ms-3" onClick={() => fetchWeatherData()}>
          Get Weather
        </button>
      </div>
  
      {/* Unit selector */}
      <div className="form-check form-check-inline mb-3">
        <input
          className="form-check-input"
          type="radio"
          name="unit"
          value="C"
          checked={unit === 'C'}
          onChange={handleUnitChange}
        />
        <label className="form-check-label">Celsius</label>
        <input
          className="ms-3"
          type="radio"
          name="unit"
          value="F"
          checked={unit === 'F'}
          onChange={handleUnitChange}
        />
        <label className="form-check-label">Fahrenheit</label>
      </div>
  
      {/* Weather information */}
      {weather ? (
        <div>            
          <h2 className="mt-5 mb-3">Location: {weather.location ? weather.location.name : 'Unknown'}</h2>
          <div className="mb-3">
            <p className="lead">Temperature: {unit === 'C' ? weather.current.temp_c : weather.current.temp_f}°{unit}</p>
            <p className="lead">Condition: {weather.current.condition.text}</p>
            <img src={weather.current.condition.icon} alt="Weather Icon" className="mb-3" />
          </div>
          <div className="mb-3">
            <p className="lead">Wind Speed: {weather.current.wind_kph} km/h</p>
            <p className="lead">Wind Direction: {weather.current.wind_dir}</p>
            <p className="lead">Humidity: {weather.current.humidity}%</p>
            <p className="lead">Pressure: {weather.current.pressure_mb} mb</p>
          </div>
  
          <h2 className="mt-5 mb-3">5-Day Forecast</h2>
          <div className="row">
            {weather.forecast.forecastday.map((day) => (
              <div key={day.date} className="col-lg-2 col-md-3 col-sm-4 col-6">
                <div className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">{day.date}</h5>
                    <img src={day.day.condition.icon} alt="Weather Icon" className="mb-3" />
                    <p className="card-text">Max Temp: {unit === 'C' ? day.day.maxtemp_c : day.day.maxtemp_f}°{unit}</p>
                    <p className="card-text">Min Temp: {unit === 'C' ? day.day.mintemp_c : day.day.mintemp_f}°{unit}</p>
                    <p className="card-text">Condition: {day.day.condition.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
};  
export default Weather;
