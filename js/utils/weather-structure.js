/**
 * Weather Widget Structure Generator
 * Dynamically creates the weather widget DOM structure
 */

/**
 * Weather metric configuration
 */
const WEATHER_METRICS = {
    precipitation: [
        { id: 'precipitationProbability', elementId: 'weatherprecipitationProbability', label: 'Hourly Precipitation Probability', icon: 'precipitation.png' },
        { id: 'rain', elementId: 'weatherRainfall', label: 'Hourly Rainfall', icon: 'rain.png' },
        { id: 'snowfall', elementId: 'weatherSnowfall', label: 'Hourly Snowfall', icon: 'snow.png' }
    ],
    wind: [
        { id: 'clouds', label: 'Cloud Coverage %', icon: 'clouds.png' },
        { id: 'windSpeed', label: 'Wind Speed', icon: 'wind.png' },
        { id: 'uvIndex', label: 'Hourly UV Index', icon: 'uvindex.png' }
    ]
};

/**
 * Creates the weather widget structure
 * @returns {HTMLElement} Weather container with structure
 */
export function createWeatherStructure() {
    const container = document.createElement('div');
    container.className = 'widget';
    container.id = 'weatherContainer';
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Weather information');

    // Location display
    const locationDiv = document.createElement('div');
    locationDiv.id = 'weatherLocation';
    locationDiv.setAttribute('aria-live', 'polite');

    // Weather code/description
    const weatherCode = document.createElement('div');
    weatherCode.id = 'weatherCode';
    weatherCode.setAttribute('title', 'Current Weather');
    weatherCode.setAttribute('role', 'status');
    weatherCode.setAttribute('aria-live', 'polite');

    // Temperature section
    const tempSection = document.createElement('div');
    tempSection.className = 'weatherTemperatures';

    const tempIcon = document.createElement('img');
    tempIcon.src = 'images/thermometer.png';
    tempIcon.alt = 'Temperature icon';
    tempIcon.id = 'tempIcon';
    tempIcon.loading = 'lazy';

    const mainTemp = document.createElement('div');
    mainTemp.id = 'weatherTemp';
    mainTemp.setAttribute('title', 'Current Temperature');
    mainTemp.setAttribute('role', 'status');
    mainTemp.setAttribute('aria-live', 'polite');
    mainTemp.appendChild(tempIcon);

    const feelsLikeDiv = document.createElement('div');
    feelsLikeDiv.id = 'weatherFeelsLike';
    feelsLikeDiv.setAttribute('title', "Current 'Feels Like' Temperature");
    feelsLikeDiv.setAttribute('aria-label', 'Feels like temperature');
    feelsLikeDiv.textContent = '~';

    const humidityIcon = document.createElement('img');
    humidityIcon.src = 'images/humidity.png';
    humidityIcon.alt = 'Humidity icon';
    humidityIcon.id = 'SmallStatsIcon';
    humidityIcon.loading = 'lazy';

    const humidityDiv = document.createElement('div');
    humidityDiv.id = 'weatherHumidity';
    humidityDiv.setAttribute('title', 'Current Humidity');
    humidityDiv.setAttribute('aria-label', 'Humidity percentage');
    humidityDiv.appendChild(humidityIcon);

    const smallStats = document.createElement('div');
    smallStats.className = 'weatherSmallStats';
    smallStats.appendChild(feelsLikeDiv);
    smallStats.appendChild(humidityDiv);

    tempSection.appendChild(mainTemp);
    tempSection.appendChild(smallStats);

    // Weather stats section
    const statsSection = document.createElement('div');
    statsSection.className = 'weatherStats';

    // Precipitation group
    const precipGroup = document.createElement('div');
    precipGroup.id = 'weatherPrecipitations';
    precipGroup.setAttribute('role', 'group');
    precipGroup.setAttribute('aria-label', 'Precipitation information');

    WEATHER_METRICS.precipitation.forEach(metric => {
        const icon = document.createElement('img');
        icon.src = `images/${metric.icon}`;
        icon.alt = metric.label;
        icon.id = 'icon';
        icon.loading = 'lazy';

        const metricDiv = document.createElement('div');
        metricDiv.id = metric.elementId;
        metricDiv.className = `weatherData ${metric.id}`;
        metricDiv.setAttribute('title', metric.label);
        metricDiv.setAttribute('aria-label', metric.label);
        metricDiv.appendChild(icon);
        precipGroup.appendChild(metricDiv);
    });

    // Wind/Clouds group
    const windGroup = document.createElement('div');
    windGroup.id = 'weatherWinds';
    windGroup.setAttribute('role', 'group');
    windGroup.setAttribute('aria-label', 'Wind and atmospheric information');

    WEATHER_METRICS.wind.forEach(metric => {
        // Handle special casing for uvIndex -> UVIndex
        const id = metric.id === 'uvIndex' 
            ? 'weatherUVIndex' 
            : `weather${metric.id.charAt(0).toUpperCase() + metric.id.slice(1)}`;
        
        const icon = document.createElement('img');
        icon.src = `images/${metric.icon}`;
        icon.alt = metric.label;
        icon.id = 'icon';
        icon.loading = 'lazy';

        const metricDiv = document.createElement('div');
        metricDiv.id = id;
        metricDiv.className = `weatherData ${metric.id}`;
        metricDiv.setAttribute('title', metric.label);
        metricDiv.setAttribute('aria-label', metric.label);
        metricDiv.appendChild(icon);
        windGroup.appendChild(metricDiv);
    });

    statsSection.appendChild(precipGroup);
    statsSection.appendChild(windGroup);

    // Assemble container
    container.appendChild(locationDiv);
    container.appendChild(weatherCode);
    container.appendChild(tempSection);
    container.appendChild(statsSection);

    return container;
}
