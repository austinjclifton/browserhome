/**
 * Weather Widget Module
 * Fetches and displays weather data
 */

import { createWeatherStructure } from './utils/weather-structure.js';

const defaultCoords = { latitude: 43.085556, longitude: -77.656912 }; // RIT campus coordinates

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
 * Updates a weather metric element (matches original createAndAppendDiv pattern)
 * Creates a child div with weatherData class and appends it
 */
function updateMetric(id, value, prefix = '', suffix = '', className = '') {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Element with id "${id}" not found`);
    }
    const text = `${prefix}${value}${suffix}`;
    
    // Remove any existing .weatherData divs (to avoid duplicates on updates)
    const existingDivs = element.querySelectorAll('.weatherData');
    existingDivs.forEach(div => div.remove());
    
    // Create and append content div (matches original createAndAppendDiv pattern)
    const contentDiv = document.createElement('div');
    contentDiv.className = className || 'weatherData';
    contentDiv.textContent = text;
    element.appendChild(contentDiv);
}

/**
 * Builds API URLs for weather data
 */
function buildHourlyApiUrl(latitude, longitude) {
    return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=weather_code&daily=uv_index_max,precipitation_probability_max&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York&forecast_days=1`;
}

function buildCurrentApiUrl(latitude, longitude) {
    return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,snowfall,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weathercode&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timeformat=unixtime&timezone=America%2FNew_York&forecast_days=1`;
}

/**
 * Gets location name from coordinates using OpenStreetMap Nominatim API
 */
async function getLocationName(latitude, longitude) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'BrowserHome Weather Widget'
                }
            }
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();
        if (data.address) {
            const address = data.address;
            // Format: "City, State" or "City, Country" if no state
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
 * Fetches and displays weather data
 */
async function fetchWeather(latitude, longitude) {
    try {
        // Fetch hourly and current data in parallel
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

        // Update weather description (no className needed, just text)
        const weatherCode = currentWeather.weathercode;
        const weatherDescription = weatherCodeMap[weatherCode] || 'Unknown weather code';
        const codeElement = document.getElementById('weatherCode');
        codeElement.textContent = weatherDescription;

        // Update temperature metrics (matching original class names)
        updateMetric('weatherTemp', currentWeather.temperature_2m, '', '˚F', 'weatherData temperature');
        updateMetric('weatherFeelsLike', currentWeather.apparent_temperature, '~', '˚', 'weatherData apparentTemperature');
        updateMetric('weatherHumidity', currentWeather.relative_humidity_2m, '', '%', 'weatherData humidity');

        // Update precipitation metrics (matching original class names)
        updateMetric('weatherprecipitationProbability', hourlyWeather.precipitation_probability_max[0], '', '%', 'weatherData precipitationProbability');
        updateMetric('weatherRainfall', currentWeather.rain, '', ' in', 'weatherData rain');
        updateMetric('weatherSnowfall', currentWeather.snowfall, '', ' in', 'weatherData snowfall');

        // Update wind/atmospheric metrics (matching original class names)
        updateMetric('weatherClouds', currentWeather.cloud_cover, '', '%', 'weatherData clouds');
        const windDirection = degreesToDirection(currentWeather.wind_direction_10m);
        updateMetric('weatherWindSpeed', `${currentWeather.wind_speed_10m} ${windDirection}`, '', '', 'weatherData windSpeed');
        updateMetric('weatherUVIndex', hourlyWeather.uv_index_max[0], '', '', 'weatherData UVIndex');

        // Update location name (no className needed, just text)
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
 * Initializes weather widget
 */
export async function initWeather() {
    // Create weather structure
    const mainContainer = document.querySelector('main.container');
    const weatherContainer = createWeatherStructure();
    
    mainContainer.appendChild(weatherContainer);

    // Get location and fetch weather
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeather(position.coords.latitude, position.coords.longitude);
            },
            () => {
                fetchWeather(defaultCoords.latitude, defaultCoords.longitude);
            }
        );
    } else {
        fetchWeather(defaultCoords.latitude, defaultCoords.longitude);
    }
}
