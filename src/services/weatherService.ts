// ============================================
// Weather Service - OpenWeatherMap API
// ============================================
// Fetches live weather data for the university location.
// Falls back to demo data if API is unavailable.
// To use: Set VITE_OPENWEATHER_API_KEY in your .env file

import type { WeatherData, HourlyForecast, DailyForecast } from '../providers/types';

// OpenWeatherMap API key (optional - falls back to Open-Meteo which is free)
// const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
// const BASE_URL = 'https://api.openweathermap.org/data/3.0';

// Weather condition code mapping to human-readable + icon
function getWeatherCondition(code: number): { condition: string; icon: string } {
  // WMO Weather interpretation codes
  const conditions: Record<number, { condition: string; icon: string }> = {
    0: { condition: 'Clear sky', icon: 'sun' },
    1: { condition: 'Mainly clear', icon: 'sun-dim' },
    2: { condition: 'Partly cloudy', icon: 'cloud-sun' },
    3: { condition: 'Overcast', icon: 'cloud' },
    45: { condition: 'Foggy', icon: 'cloud-fog' },
    48: { condition: 'Depositing rime fog', icon: 'cloud-fog' },
    51: { condition: 'Light drizzle', icon: 'cloud-drizzle' },
    53: { condition: 'Moderate drizzle', icon: 'cloud-drizzle' },
    55: { condition: 'Dense drizzle', icon: 'cloud-drizzle' },
    61: { condition: 'Slight rain', icon: 'cloud-rain' },
    63: { condition: 'Moderate rain', icon: 'cloud-rain' },
    65: { condition: 'Heavy rain', icon: 'cloud-rain' },
    71: { condition: 'Slight snow', icon: 'snowflake' },
    73: { condition: 'Moderate snow', icon: 'snowflake' },
    75: { condition: 'Heavy snow', icon: 'snowflake' },
    77: { condition: 'Snow grains', icon: 'snowflake' },
    80: { condition: 'Slight rain showers', icon: 'cloud-rain' },
    81: { condition: 'Moderate rain showers', icon: 'cloud-rain' },
    82: { condition: 'Violent rain showers', icon: 'cloud-rain' },
    85: { condition: 'Slight snow showers', icon: 'snowflake' },
    86: { condition: 'Heavy snow showers', icon: 'snowflake' },
    95: { condition: 'Thunderstorm', icon: 'cloud-lightning' },
    96: { condition: 'Thunderstorm with hail', icon: 'cloud-lightning' },
    99: { condition: 'Thunderstorm with heavy hail', icon: 'cloud-lightning' },
  };
  return conditions[code] || { condition: 'Unknown', icon: 'cloud' };
}

// Fetch weather using Open-Meteo API (free, no key required)
// This is a reliable free weather API that doesn't require an API key
export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,visibility&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=America/Chicago&forecast_days=8&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather API error');

    const data = await response.json();

    // Parse current weather
    const currentCode = data.current.weather_code;
    const currentCondition = getWeatherCondition(currentCode);

    // Parse hourly forecast (next 24 hours)
    const hourly: HourlyForecast[] = [];
    const now = new Date();
    const currentHour = now.getHours();

    for (let i = 0; i < 24; i++) {
      const hourIndex = currentHour + i;
      if (hourIndex >= data.hourly.time.length) break;

      const time = new Date(data.hourly.time[hourIndex]);
      const hourCode = data.hourly.weather_code[hourIndex];
      const hourCondition = getWeatherCondition(hourCode);

      hourly.push({
        time: time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temp: Math.round(data.hourly.temperature_2m[hourIndex]),
        feelsLike: Math.round(data.hourly.apparent_temperature[hourIndex]),
        condition: hourCondition.condition,
        icon: hourCondition.icon,
        precipitation: data.hourly.precipitation_probability[hourIndex] || 0,
        windSpeed: Math.round(data.hourly.wind_speed_10m[hourIndex]),
      });
    }

    // Parse daily forecast (7 days)
    const daily: DailyForecast[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < Math.min(7, data.daily.time.length); i++) {
      const date = new Date(data.daily.time[i]);
      const dayCode = data.daily.weather_code[i];
      const dayCondition = getWeatherCondition(dayCode);

      daily.push({
        date: data.daily.time[i],
        dayName: i === 0 ? 'Today' : dayNames[date.getDay()],
        high: Math.round(data.daily.temperature_2m_max[i]),
        low: Math.round(data.daily.temperature_2m_min[i]),
        condition: dayCondition.condition,
        icon: dayCondition.icon,
        precipitation: data.daily.precipitation_probability_max[i] || 0,
        humidity: Math.round(data.hourly.relative_humidity_2m[i * 24] || 0),
        uvIndex: Math.round(data.daily.uv_index_max[i] || 0),
        sunrise: data.daily.sunrise[i]?.split('T')[1] || '6:30 AM',
        sunset: data.daily.sunset[i]?.split('T')[1] || '8:30 PM',
      });
    }

    return {
      current: {
        temp: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        condition: currentCondition.condition,
        icon: currentCondition.icon,
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        windDirection: data.current.wind_direction_10m,
        uvIndex: daily[0]?.uvIndex || 0,
        visibility: Math.round((data.current.visibility || 10000) / 1000),
        pressure: Math.round(data.current.surface_pressure),
      },
      hourly,
      daily,
      location: 'Lubbock, TX',
      dataSource: 'live',
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.warn('Weather API failed, using demo data:', error);
    return getDemoWeather();
  }
}

// Demo weather data as fallback
function getDemoWeather(): WeatherData {
  const now = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const hourly: HourlyForecast[] = [];
  for (let i = 0; i < 24; i++) {
    const hour = (now.getHours() + i) % 24;
    const isDay = hour >= 6 && hour < 20;
    const temp = isDay ? 85 + Math.sin((hour - 6) * Math.PI / 14) * 15 : 65 + Math.sin(hour * Math.PI / 12) * 5;
    hourly.push({
      time: `${hour % 12 || 12} ${hour >= 12 ? 'PM' : 'AM'}`,
      temp: Math.round(temp),
      feelsLike: Math.round(temp + 5),
      condition: isDay ? 'Sunny' : 'Clear',
      icon: isDay ? 'sun' : 'moon',
      precipitation: 0,
      windSpeed: 12,
    });
  }

  const conditions = ['Sunny', 'Partly Cloudy', 'Sunny', 'Sunny', 'Windy', 'Sunny', 'Clear'];
  const daily: DailyForecast[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    daily.push({
      date: date.toISOString().split('T')[0],
      dayName: i === 0 ? 'Today' : dayNames[date.getDay()],
      high: 92 - i * 2,
      low: 68 - i,
      condition: conditions[i],
      icon: i === 1 ? 'cloud-sun' : 'sun',
      precipitation: i === 4 ? 20 : 0,
      humidity: 35,
      uvIndex: i < 3 ? 9 : 7,
      sunrise: '6:45 AM',
      sunset: '8:55 PM',
    });
  }

  return {
    current: {
      temp: 88,
      feelsLike: 93,
      condition: 'Sunny',
      icon: 'sun',
      humidity: 32,
      windSpeed: 15,
      windDirection: 210,
      uvIndex: 9,
      visibility: 16,
      pressure: 1015,
    },
    hourly,
    daily,
    location: 'Lubbock, TX (Demo)',
    dataSource: 'demo',
    lastUpdated: now.toISOString(),
  };
}
