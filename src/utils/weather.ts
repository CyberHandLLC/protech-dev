// Utility for weather data and recommendations

// Mock weather data for demonstration purposes
// In a production environment, this would connect to a real weather API
export async function getWeatherData(location: string) {
  // This is a mock implementation - in production, you would call a real weather API
  // using the location parameter
  
  console.log(`Getting weather data for ${location}`);
  
  // Random temperature between 15 and 95°F to simulate different conditions
  const temperature = Math.floor(Math.random() * 80) + 15;
  
  // Weather conditions based on temperature ranges
  let condition = 'Clear';
  let icon = 'sun';
  
  if (temperature < 32) {
    condition = 'Snow';
    icon = 'snow';
  } else if (temperature < 45) {
    condition = 'Cloudy';
    icon = 'cloud';
  } else if (temperature < 60) {
    condition = 'Partly Cloudy';
    icon = 'cloud-sun';
  } else if (temperature < 75) {
    condition = 'Clear';
    icon = 'sun';
  } else if (temperature < 85) {
    condition = 'Hot';
    icon = 'hot';
  } else {
    condition = 'Extreme Heat';
    icon = 'fire';
  }
  
  // Random humidity between 20% and 90%
  const humidity = Math.floor(Math.random() * 70) + 20;
  
  // Generate an HVAC tip based on weather conditions
  const hvacTip = generateHvacTip(temperature, condition, humidity);
  
  // Mock weather data object
  return {
    temperature,
    condition,
    humidity,
    feelsLike: temperature + (humidity > 60 ? 5 : -2), // Adjust feels-like based on humidity
    icon,
    description: `${condition} with ${humidity}% humidity`,
    hvacTip
  };
}

// Generate an HVAC tip based on weather conditions
function generateHvacTip(temperature: number, condition: string, humidity: number): string {
  if (temperature > 85) {
    if (humidity > 60) {
      return "During today's high heat and humidity, ensure your AC isn't overworking by setting your thermostat to 78°F and using ceiling fans.";
    }
    return "In today's hot weather, reduce strain on your AC by closing blinds on sun-facing windows and ensuring air filters are clean.";
  } else if (temperature < 32) {
    return "With freezing temperatures, protect pipes near exterior walls and ensure your heating system's air intake is clear of snow and ice.";
  } else if (temperature < 45) {
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