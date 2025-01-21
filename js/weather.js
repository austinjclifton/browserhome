/**
 * Austin Clifton
 * 
 * JavaScript for the Weather Container
 * Uses fetch() to retrieve API info
 * courtesy of open-meteo.com (free)
 * last updated in v1.1
 */

const container = document.getElementById('weatherContainer');
const defaultCoords = { latitude: 43.085556, longitude: -77.656912 }; //coordinates of rit campus
const apiKey = 'ecc342730e0d4e348b39e95d1a879fa6'; //openCage API key
const weatherCodeMap = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Rime fog',
    51: 'Drizzle light',
    53: 'Drizzle moderate',
    55: 'Drizzle dense',
    56: 'Freezing drizzle light',
    57: 'Freezing drizzle dense',
    61: 'Rain slight',
    63: 'Rain moderate',
    65: 'Rain heavy',
    66: 'Freezing rain light',
    67: 'Freezing rain heavy',
    71: 'Snow fall light',
    73: 'Snow fall moderate',
    75: 'Snow fall heavy',
    77: 'Snow grains',
    80: 'Showers slight',
    81: 'Showers moderate',
    82: 'Showers heavy',
    85: 'Snow showers slight',
    86: 'Snow showers heavy',
    95: 'Thunderstorm slight',
    96: 'Thunderstorm moderate',
    99: 'Thunderstorm heavy'
};

/**
 * utility function used to convert wind direction degrees into compass direction
 * @param {number} degrees - wind direction in degrees
 * @returns {string} - compass direction (e.g., N, NE)
 */
function degreesToDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

/**
 * utility function used to create and append a new div with class and content
 * @param {string} className - class to be added to the div
 * @param {string} content - content of the div
 * @param {string} containerId - ID of the container to append to
 */
function createAndAppendDiv(className, content, containerId) {
    const container = document.getElementById(containerId);

    const div = document.createElement('div');
    div.className = className;
    div.textContent = content;

    container.appendChild(div);
}

/**
 * function to get user location and fetch weather data
 */
function checkWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                fetchWeather(latitude, longitude);
            },
            () => {
                // if there's an error getting the location, use default coordinates
                fetchWeather(defaultCoords.latitude, defaultCoords.longitude);
            }
        );
    } else {
        // if geolocation is not supported, use default coordinates
        fetchWeather(defaultCoords.latitude, defaultCoords.longitude);
    }
}

/**
 * function to build the hourly API URL with given coordinates
 */
function buildHourlyApiUrl(latitude, longitude) {
    return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=weather_code&daily=uv_index_max,precipitation_probability_max&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York&forecast_days=1`;
}

/**
 * function to build the daily API URL with given coordinates
 */
function buildCurrentApiUrl(latitude, longitude) {
    return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,snowfall,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weathercode&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timeformat=unixtime&timezone=America%2FNew_York&forecast_days=1`;
}

/**
 * Retrieves the human-readable name of a location based on provided latitude and longitude.
 * @param {number} latitude - latitude of location
 * @param {number} longitude - longitude of location
 */
async function getLocationName(latitude, longitude) {
    try {
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            return data.results[0].formatted.split(',')[1].trim(); //city name
        } else {
            return 'Location not found';
        }
    } catch (error) {
        console.error('Error fetching location data:', error);
        return 'Error fetching location';
    }
}

/**
 * function to fetch and display weather data from the Open-Meteo API
 * @param {number} latitude - latitude of location
 * @param {number} longitude - longitude of location
 */
async function fetchWeather(latitude, longitude) {
    try {
        //get hourly data
        const hourlyURL = buildHourlyApiUrl(latitude, longitude);
        const hourlyResponse = await fetch(hourlyURL);
        if (!hourlyResponse.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const hourlyData = await hourlyResponse.json();
        const hourlyWeather = hourlyData.daily;
        
        //get current data
        const currentURL = buildCurrentApiUrl(latitude, longitude);
        const currentResponse = await fetch(currentURL);
        if (!currentResponse.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const currentData = await currentResponse.json();
        const currentWeather = currentData.current;
        
        let locName
        
        //get weather code
        const weatherCode = currentWeather.weathercode;
        const weatherDescription = weatherCodeMap[weatherCode] || 'Unknown weather code';

        //get temperature
        const temperature = currentWeather.temperature_2m;
        const apparentTemperature = currentWeather.apparent_temperature;
        const humidity = currentWeather.relative_humidity_2m;

        //get precipitation
        const precipitationProbability = hourlyWeather.precipitation_probability_max[0];
        const rain = currentWeather.rain;
        const snowfall = currentWeather.snowfall;

        //get wind & clouds
        const clouds = currentWeather.cloud_cover;
        const windSpeed = currentWeather.wind_speed_10m;
        const windDirection = degreesToDirection(currentWeather.wind_direction_10m);
        
        //get UV index
        const UVIndex = hourlyWeather.uv_index_max[0];

        //create and append new div elements
        createAndAppendDiv('code', `${weatherDescription}`, 'weatherCode');
        
        createAndAppendDiv('weatherData temperature', `${temperature}˚F`, 'weatherTemp');
        createAndAppendDiv('weatherData apparentTemperature', `${apparentTemperature}˚`, 'weatherFeelsLike');
        createAndAppendDiv('weatherData humidity', `${humidity}%`, 'weatherHumidity');

        createAndAppendDiv('weatherData precipitationProbability', `${precipitationProbability}%`, 'weatherprecipitationProbability');
        createAndAppendDiv('weatherData rain', `${rain} in`, 'weatherRainfall');
        createAndAppendDiv('weatherData snowfall', `${snowfall} in`, 'weatherSnowfall');

        createAndAppendDiv('weatherData clouds', `${clouds}%`, 'weatherClouds');
        createAndAppendDiv('weatherData windSpeed', `${windSpeed} ${windDirection}`, 'weatherWindSpeed');
        createAndAppendDiv('weatherData UVIndex', `${UVIndex}`, 'weatherUVIndex');
        
        //get location name
        getLocationName(latitude, longitude).then(locationName => {
            if (locationName.length > 15) {
                locName = locationName.slice(0, 14) + '...';
            } else {
                locName = locationName;
            }
            
            createAndAppendDiv('locationName', `${locName}`, 'weatherLocation');
            
            console.log(`Weather data obtained for ${locName}, courtesy of open-meteo.com.`)
        });
        
        console.group(`Temperature is ${temperature}ºF but it feels like ${apparentTemperature}. There is a ${precipitationProbability}% change for precipitation, and the wind is blowing at ${windSpeed}mph ${windDirection}.`)
        
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

window.onload = checkWeather();