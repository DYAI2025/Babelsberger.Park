/**
 * Weather Widget for Park Babelsberg
 * Fetches 3-day weather forecast for Potsdam
 */

(function() {
  'use strict';

  // Weather API Configuration
  const WEATHER_CONFIG = {
    // Using Open-Meteo API (free, no API key required)
    apiUrl: 'https://api.open-meteo.com/v1/forecast',
    latitude: 52.4,
    longitude: 13.085,
    timezone: 'Europe/Berlin',
    days: 3
  };

  // Weather icon mapping
  const WEATHER_ICONS = {
    0: '☀️',   // Clear sky
    1: '🌤️',   // Mainly clear
    2: '⛅',   // Partly cloudy
    3: '☁️',   // Overcast
    45: '🌫️',  // Fog
    48: '🌫️',  // Depositing rime fog
    51: '🌦️',  // Light drizzle
    53: '🌦️',  // Moderate drizzle
    55: '🌧️',  // Dense drizzle
    61: '🌧️',  // Slight rain
    63: '🌧️',  // Moderate rain
    65: '🌧️',  // Heavy rain
    71: '🌨️',  // Slight snow
    73: '🌨️',  // Moderate snow
    75: '🌨️',  // Heavy snow
    77: '❄️',   // Snow grains
    80: '🌦️',  // Slight rain showers
    81: '🌧️',  // Moderate rain showers
    82: '⛈️',  // Violent rain showers
    85: '🌨️',  // Slight snow showers
    86: '🌨️',  // Heavy snow showers
    95: '⛈️',  // Thunderstorm
    96: '⛈️',  // Thunderstorm with slight hail
    99: '⛈️'   // Thunderstorm with heavy hail
  };

  // German day names
  const DAY_NAMES = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  /**
   * Fetch weather data from API
   */
  async function fetchWeatherData() {
    const params = new URLSearchParams({
      latitude: WEATHER_CONFIG.latitude,
      longitude: WEATHER_CONFIG.longitude,
      daily: 'weathercode,temperature_2m_max,temperature_2m_min',
      timezone: WEATHER_CONFIG.timezone,
      forecast_days: WEATHER_CONFIG.days
    });

    const url = `${WEATHER_CONFIG.apiUrl}?${params}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  /**
   * Get weather icon for weather code
   */
  function getWeatherIcon(weatherCode) {
    return WEATHER_ICONS[weatherCode] || '🌤️';
  }

  /**
   * Get day name from date string
   */
  function getDayName(dateString, index) {
    if (index === 0) return 'Heute';
    if (index === 1) return 'Morgen';
    
    const date = new Date(dateString);
    return DAY_NAMES[date.getDay()];
  }

  /**
   * Format temperature
   */
  function formatTemp(temp) {
    return Math.round(temp);
  }

  /**
   * Render weather data
   */
  function renderWeather(data) {
    const container = document.getElementById('weather-content');
    if (!container) return;

    const { daily } = data;
    
    let html = '';
    for (let i = 0; i < WEATHER_CONFIG.days; i++) {
      const dayName = getDayName(daily.time[i], i);
      const icon = getWeatherIcon(daily.weathercode[i]);
      const tempHigh = formatTemp(daily.temperature_2m_max[i]);
      const tempLow = formatTemp(daily.temperature_2m_min[i]);

      html += `
        <div class="weather-day">
          <div class="weather-day-name">${dayName}</div>
          <div class="weather-day-icon">${icon}</div>
          <div class="weather-day-temp">
            <span class="weather-temp-high">${tempHigh}°</span>
            <span class="weather-temp-low">${tempLow}°</span>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
  }

  /**
   * Show error message
   */
  function showError() {
    const container = document.getElementById('weather-content');
    if (!container) return;

    container.innerHTML = `
      <div class="weather-error">
        Wetterdaten konnten nicht geladen werden
      </div>
    `;
  }

  /**
   * Initialize weather widget
   */
  async function initWeather() {
    try {
      const data = await fetchWeatherData();
      renderWeather(data);
    } catch (error) {
      showError();
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWeather);
  } else {
    initWeather();
  }

  // Refresh weather data every 30 minutes
  setInterval(initWeather, 30 * 60 * 1000);

})();