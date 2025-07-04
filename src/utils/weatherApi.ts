// This utility fetches real-time weather data for a given location
// We're using OpenWeatherMap API

export interface WeatherData {
  temperature: number;
  condition: string; // Clear, Cloudy, Rain, etc.
  humidity: number;
  feelsLike: number;
  icon: string;
  description: string;
  hvacTip: string; // HVAC tip based on current weather
}

// Create HVAC tips based on weather conditions
function generateHvacTip(temp: number, condition: string, humidity: number): string {
  // Temperature in Fahrenheit
  if (temp > 85) {
    if (humidity > 60) {
      return "With today's high heat and humidity, ensure your AC isn't overworking by setting your thermostat to 78°F and using ceiling fans.";
    }
    return "In today's hot weather, reduce strain on your AC by closing blinds on sun-facing windows and ensuring air filters are clean.";
  } else if (temp < 32) {
    return "With freezing temperatures, protect pipes near exterior walls and ensure your heating system's air intake is clear of snow and ice.";
  } else if (temp < 45) {
    return "In today's cold weather, your furnace will be working hard. Make sure vents are unobstructed for efficient heating.";
  } else if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('shower')) {
    return "Rainy weather can increase humidity. If your home feels sticky, check that your AC system is properly dehumidifying.";
  } else if (humidity > 60) {
    return "Higher humidity today means your AC system needs to work harder to keep your home comfortable. Consider a dehumidifier for improved efficiency.";
  } else if (humidity < 30) {
    return "Today's dry air can cause static electricity and respiratory discomfort. A whole-home humidifier would improve your indoor air quality.";
  }
  
  return "Today's moderate weather is perfect for an HVAC system check-up to ensure optimal performance year-round.";
}

// Function to get real-time weather data from OpenWeatherMap API
export async function getWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
  // Use the provided coordinates directly for weather lookup
  const lat = latitude;
  const lng = longitude;
  
  console.log(`Getting real weather data for coordinates (${lat}, ${lng})`);
  
  // Try to fetch real weather data if API key is available
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  if (apiKey) {
    try {
      console.log(`Attempting to fetch weather with API key: ${apiKey ? 'Available (hidden)' : 'Missing'}`);
      
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=imperial`;
      console.log(`Fetching weather from: ${apiUrl.replace(apiKey, 'API_KEY_HIDDEN')}`);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Weather API returned ${response.status}: ${await response.text()}`);
      }
      
      const data = await response.json();
      console.log('Weather API response:', JSON.stringify(data, null, 2));
      
      // Convert API response to our WeatherData format
      return {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        feelsLike: Math.round(data.main.feels_like),
        icon: getWeatherIcon(data.weather[0].main),
        description: data.weather[0].description,
        hvacTip: generateHvacTip(data.main.temp, data.weather[0].main, data.main.humidity)
      };
    } catch (error) {
      console.error('Weather API error, using mock data instead:', error);
      // Fall back to mock data if API fails
    }
  } else {
    console.error('OpenWeatherMap API key is missing. Please add NEXT_PUBLIC_WEATHER_API_KEY to your environment variables.');
  }
  
  // Generate mock data for development or if API call fails
  console.log('Using mock weather data');
  const now = new Date();
  const month = now.getMonth(); // 0-11
  
  // Winter (Dec-Feb)
  if (month === 11 || month === 0 || month === 1) {
    const isColder = Math.random() > 0.3;
    const temp = isColder ? Math.floor(Math.random() * 20) + 10 : Math.floor(Math.random() * 15) + 25;
    const conditions = ['Snow', 'Cloudy', 'Partly Cloudy', 'Clear'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const humidity = Math.floor(Math.random() * 20) + 50;
    
    return {
      temperature: temp,
      condition,
      humidity,
      feelsLike: temp - Math.floor(Math.random() * 5),
      icon: condition === 'Snow' ? '❄️' : condition === 'Cloudy' ? '☁️' : condition === 'Partly Cloudy' ? '⛅' : '☀️',
      description: `${condition} with a temperature of ${temp}°F`,
      hvacTip: generateHvacTip(temp, condition, humidity)
    };
  }
  
  // Summer (Jun-Aug)
  else if (month >= 5 && month <= 7) {
    const isHotter = Math.random() > 0.3;
    const temp = isHotter ? Math.floor(Math.random() * 10) + 85 : Math.floor(Math.random() * 15) + 70;
    const conditions = ['Sunny', 'Partly Cloudy', 'Scattered Thunderstorms', 'Rain'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const humidity = Math.floor(Math.random() * 30) + 50;
    
    return {
      temperature: temp,
      condition,
      humidity,
      feelsLike: temp + Math.floor(Math.random() * 8),
      icon: condition === 'Sunny' ? 'sunny' : condition === 'Partly Cloudy' ? 'partly-cloudy' : condition === 'Scattered Thunderstorms' ? 'thunderstorm' : 'rain',
      description: `${condition} with a temperature of ${temp}°F`,
      hvacTip: generateHvacTip(temp, condition, humidity)
    };
  }
  
  // Spring/Fall
  else {
    const temp = Math.floor(Math.random() * 30) + 45;
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rain'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const humidity = Math.floor(Math.random() * 20) + 40;
    
    return {
      temperature: temp,
      condition,
      humidity,
      feelsLike: temp,
      icon: condition === 'Sunny' ? 'sunny' : condition === 'Partly Cloudy' ? 'partly-cloudy' : condition === 'Cloudy' ? 'cloudy' : 'rain',
      description: `${condition} with a temperature of ${temp}°F`,
      hvacTip: generateHvacTip(temp, condition, humidity)
    };
  }
}

// Function to map weather conditions to SVG filenames for icons
function getWeatherIcon(condition: string): string {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('snow') || conditionLower.includes('sleet')) return 'snow';
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return 'rain';
  if (conditionLower.includes('thunderstorm')) return 'thunderstorm';
  if (conditionLower.includes('clear')) return 'sunny';
  if (conditionLower.includes('cloud')) {
    if (conditionLower.includes('few') || conditionLower.includes('scattered')) return 'partly-cloudy';
    return 'cloudy';
  }
  if (conditionLower.includes('mist') || conditionLower.includes('fog')) return 'fog';
  
  return 'temperature'; // Default icon
}

// Function to generate HVAC advice based on weather forecast
export function getHvacAdviceForWeather(weatherData: WeatherData, serviceType: string): string {
  const { temperature, humidity, condition } = weatherData;
  
  // Different advice based on service type
  if (serviceType === 'air-conditioning') {
    if (temperature > 80) {
      return `With temperatures reaching ${temperature}°F today, your AC system will be working harder than usual. Ensure your filters are clean and consider programming your thermostat to run less while you're away to reduce strain on your system.`;
    } else if (humidity > 60) {
      return `Today's humidity level of ${humidity}% means your AC needs to work harder to remove moisture from your home. If you're noticing excessive humidity indoors, your system may need maintenance to optimize its dehumidification capabilities.`;
    } else {
      return `Today's moderate weather with temperatures around ${temperature}°F provides an ideal opportunity to schedule routine maintenance for your air conditioning system before extreme temperatures arrive.`;
    }
  } 
  else if (serviceType === 'heating-systems') {
    if (temperature < 30) {
      return `With today's frigid ${temperature}°F temperature, your heating system is under maximum stress. Ensure your thermostat is set to a consistent temperature to prevent your system from overworking.`;
    } else if (temperature < 45) {
      return `Today's ${temperature}°F temperature means your heating system is actively working. Consider scheduling a maintenance check to ensure it's operating at peak efficiency during the heating season.`;
    } else {
      return `With moderate ${temperature}°F temperatures today, it's an ideal time to schedule preventative maintenance for your heating system before colder weather arrives.`;
    }
  }
  else if (serviceType === 'indoor-air-quality') {
    if (humidity > 60) {
      return `Today's high humidity (${humidity}%) can lead to excess moisture indoors, potentially causing mold growth. Consider using dehumidifiers or ensuring your HVAC system is properly maintaining indoor humidity levels.`;
    } else if (humidity < 30) {
      return `Today's dry conditions (${humidity}% humidity) can cause respiratory discomfort and static electricity. A whole-home humidifier can help maintain optimal indoor humidity levels between 30-50%.`;
    } else if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('snow')) {
      return `During ${condition.toLowerCase()} weather, allergens and pollutants can be drawn into your home. Ensure your air filtration system is working properly to maintain healthy indoor air quality.`;
    } else {
      return `Even with today's pleasant weather, indoor air can contain more pollutants than outdoor air. Regular maintenance of your air filtration systems ensures your family breathes clean, healthy air year-round.`;
    }
  }
  
  // Generic advice for other service types
  return `Current weather conditions (${temperature}°F, ${condition}) are a good reminder to ensure your HVAC system is properly maintained to handle seasonal changes efficiently and effectively.`;
}
