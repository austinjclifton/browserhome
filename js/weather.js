/**
 * Weather Widget Module
 * Fetches and displays weather data
 */

import { createWeatherStructure } from './utils/weather-structure.js';

// Default coordinates (RIT campus) - used as fallback when geolocation is unavailable or denied
const defaultCoords = { latitude: 43.085556, longitude: -77.656912 };

/**
 * Maps Open-Meteo weather codes to human-readable descriptions
 * Reference: https://open-meteo.com/en/docs
 */
const weatherCodeMap = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Rime fog',
    51: 'Drizzle light', 53: 'Drizzle moderate', 55: 'Drizzle dense',
    56: 'Freezing drizzle light', 57: 'Freezing drizzle dense',
    61: 'Rain slight', 63: 'Rain moderate', 65: 'Rain heavy',
    66: 'Freezing rain light', 67: 'Freezing rain heavy',
    71: 'Snow fall light', 73: 'Snow fall moderate', 75: 'Snow fall heavy',
    77: 'Snow grains',
    80: 'Showers slight', 81: 'Showers moderate', 82: 'Showers heavy',
    85: 'Snow showers slight', 86: 'Snow showers heavy',
    95: 'Thunderstorm slight', 96: 'Thunderstorm moderate', 99: 'Thunderstorm heavy'
};

/**
 * Converts wind direction degrees to compass direction
 */
function degreesToDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                       'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
}

/**
 * Updates a weather metric element with new data
 * Removes existing data divs to prevent duplicates, then creates and appends new content
 * 
 * @param {string} id - The ID of the parent element to update
 * @param {number|string} value - The value to display
 * @param {string} prefix - Optional prefix text (e.g., "~" for feels like)
 * @param {string} suffix - Optional suffix text (e.g., "°F", "%")
 * @param {string} className - Optional CSS class name (defaults to 'weatherData')
 */
function updateMetric(id, value, prefix = '', suffix = '', className = '') {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Element with id "${id}" not found`);
    }
    const text = `${prefix}${value}${suffix}`;
    
    // Remove existing data divs to prevent duplicates when updating
    const existingDivs = element.querySelectorAll('.weatherData');
    existingDivs.forEach(div => div.remove());
    
    // Create and append new content div
    const contentDiv = document.createElement('div');
    contentDiv.className = className || 'weatherData';
    contentDiv.textContent = text;
    element.appendChild(contentDiv);
}

/**
 * Builds API URL for hourly weather forecast data
 * Uses Open-Meteo API (free, no API key required)
 * 
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {string} API URL for hourly forecast
 */
function buildHourlyApiUrl(latitude, longitude) {
    return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=weather_code&daily=uv_index_max,precipitation_probability_max&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York&forecast_days=1`;
}

/**
 * Builds API URL for current weather conditions
 * Uses Open-Meteo API (free, no API key required)
 * 
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {string} API URL for current conditions
 */
function buildCurrentApiUrl(latitude, longitude) {
    return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,snowfall,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weathercode&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timeformat=unixtime&timezone=America%2FNew_York&forecast_days=1`;
}

/**
 * Gets human-readable location name from coordinates using reverse geocoding
 * Uses OpenStreetMap Nominatim API (free, no API key required, supports CORS)
 * 
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<string>} Formatted location string (e.g., "Rochester, New York")
 */
async function getLocationName(latitude, longitude) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            {
                headers: {
                    // User-Agent required by Nominatim usage policy
                    'User-Agent': 'BrowserHome Weather Widget'
                }
            }
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();
        if (data.address) {
            const address = data.address;
            // Format: "City, State" or "City, Country" if no state available
            if (address.city || address.town || address.village) {
                const city = address.city || address.town || address.village;
                if (address.state) {
                    return `${city}, ${address.state}`;
                } else if (address.country) {
                    return `${city}, ${address.country}`;
                }
                return city;
            } else if (address.state) {
                return address.state;
            } else if (address.country) {
                return address.country;
            }
        }
        return 'Location not found';
    } catch (error) {
        console.error('Error fetching location data:', error);
        return 'Location unavailable';
    }
}

/**
 * Fetches weather data from Open-Meteo API and updates the DOM
 * Makes parallel requests for hourly and current data for better performance
 * 
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 */
async function fetchWeather(latitude, longitude) {
    try {
        // Fetch hourly and current data in parallel for better performance
        const [hourlyResponse, currentResponse] = await Promise.all([
            fetch(buildHourlyApiUrl(latitude, longitude)),
            fetch(buildCurrentApiUrl(latitude, longitude))
        ]);

        if (!hourlyResponse.ok || !currentResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const [hourlyData, currentData] = await Promise.all([
            hourlyResponse.json(),
            currentResponse.json()
        ]);

        const hourlyWeather = hourlyData.daily;
        const currentWeather = currentData.current;

        // Update weather description from weather code
        const weatherCode = currentWeather.weathercode;
        const weatherDescription = weatherCodeMap[weatherCode] || 'Unknown weather code';
        const codeElement = document.getElementById('weatherCode');
        codeElement.textContent = weatherDescription;

        // Update temperature-related metrics
        updateMetric('weatherTemp', currentWeather.temperature_2m, '', '˚F', 'weatherData temperature');
        updateMetric('weatherFeelsLike', currentWeather.apparent_temperature, '~', '˚', 'weatherData apparentTemperature');
        updateMetric('weatherHumidity', currentWeather.relative_humidity_2m, '', '%', 'weatherData humidity');

        // Update precipitation metrics (using daily max from hourly data)
        updateMetric('weatherprecipitationProbability', hourlyWeather.precipitation_probability_max[0], '', '%', 'weatherData precipitationProbability');
        updateMetric('weatherRainfall', currentWeather.rain, '', ' in', 'weatherData rain');
        updateMetric('weatherSnowfall', currentWeather.snowfall, '', ' in', 'weatherData snowfall');

        // Update wind and atmospheric metrics
        updateMetric('weatherClouds', currentWeather.cloud_cover, '', '%', 'weatherData clouds');
        const windDirection = degreesToDirection(currentWeather.wind_direction_10m);
        updateMetric('weatherWindSpeed', `${currentWeather.wind_speed_10m} ${windDirection}`, '', '', 'weatherData windSpeed');
        updateMetric('weatherUVIndex', hourlyWeather.uv_index_max[0], '', '', 'weatherData UVIndex');

        // Update location name (truncate if too long to fit display)
        const locationName = await getLocationName(latitude, longitude);
        const displayName = locationName.length > 15 
            ? locationName.slice(0, 14) + '...' 
            : locationName;
        const locationElement = document.getElementById('weatherLocation');
        locationElement.textContent = displayName;

    } catch (error) {
        console.error('Error fetching weather data:', error);
        const codeElement = document.getElementById('weatherCode');
        codeElement.textContent = 'Unable to load weather data';
    }
}

/**
 * Initializes the weather widget
 * Creates the DOM structure, requests user location, and fetches weather data
 * Falls back to default coordinates if geolocation is unavailable or denied
 */
export async function initWeather() {
    // Create and append weather widget structure to main container
    const mainContainer = document.querySelector('main.container');
    const weatherContainer = createWeatherStructure();
    mainContainer.appendChild(weatherContainer);

    // Request user's location, fallback to default coordinates on error or denial
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Success: use user's actual location
                fetchWeather(position.coords.latitude, position.coords.longitude);
            },
            () => {
                // Error or denied: use default coordinates (RIT campus)
                fetchWeather(defaultCoords.latitude, defaultCoords.longitude);
            }
        );
    } else {
        // Geolocation not supported: use default coordinates
        fetchWeather(defaultCoords.latitude, defaultCoords.longitude);
    }
}
