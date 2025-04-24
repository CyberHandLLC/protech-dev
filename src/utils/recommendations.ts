// Utility for generating contextual HVAC service recommendations based on weather conditions

interface Recommendation {
  message: string;
  tip: string;
}

// Get service recommendations based on current weather conditions and service type
export function getServiceRecommendation(
  weatherData: any,
  system: string,
  serviceType: string
): Recommendation {
  const { temperature, condition, humidity } = weatherData;
  
  // Default recommendations
  const defaultRecommendation: Recommendation = {
    message: `With current temperatures at ${temperature}°F and ${condition.toLowerCase()} conditions, this is a good time for ${system} ${serviceType}.`,
    tip: "Regular maintenance helps your system run efficiently and extends its lifespan.",
  };
  
  // Cooling system recommendations
  if (system === 'cooling') {
    if (serviceType === 'maintenance') {
      if (temperature > 80) {
        return {
          message: `At ${temperature}°F, your cooling system is likely running constantly. A maintenance check now can help prevent breakdowns during this hot weather.`,
          tip: "Set your thermostat a few degrees higher during peak heat to reduce strain on your system.",
        };
      } else if (temperature < 60) {
        return {
          message: `With cooler ${temperature}°F temperatures, this is an ideal time for AC maintenance to prepare for upcoming warmer weather.`,
          tip: "Off-season maintenance often means shorter wait times and can identify issues before hot weather arrives.",
        };
      }
    } else if (serviceType === 'repairs') {
      if (temperature > 85) {
        return {
          message: `During this ${temperature}°F heat wave, prompt repair of your cooling system is critical to restore comfort quickly.`,
          tip: "While waiting for repairs, use fans and close blinds to help keep your home cooler.",
        };
      }
    } else if (serviceType === 'installations') {
      if (temperature < 70) {
        return {
          message: `Current ${temperature}°F temperatures make this a perfect time to install a new cooling system before hot weather arrives.`,
          tip: "Ask about high-efficiency models that can save you money during the upcoming cooling season.",
        };
      }
    }
  }
  
  // Heating system recommendations
  if (system === 'heating') {
    if (serviceType === 'maintenance') {
      if (temperature < 40) {
        return {
          message: `At ${temperature}°F, your heating system is working hard. A maintenance check now can ensure it continues to operate reliably.`,
          tip: "Consider a programmable thermostat to reduce energy usage while you're away or sleeping.",
        };
      } else if (temperature > 60) {
        return {
          message: `With milder ${temperature}°F temperatures, this is the perfect time for heating system maintenance to prepare for the next cold season.`,
          tip: "Off-season maintenance can identify issues while they're less likely to leave you without heat.",
        };
      }
    } else if (serviceType === 'repairs') {
      if (temperature < 32) {
        return {
          message: `With freezing ${temperature}°F temperatures, prompt repair of your heating system is essential for your comfort and safety.`,
          tip: "While waiting for repairs, use space heaters safely and consider staying with family or friends if needed.",
        };
      }
    } else if (serviceType === 'installations') {
      if (temperature > 50) {
        return {
          message: `Current ${temperature}°F temperatures make this a good time to install a new heating system before cold weather arrives.`,
          tip: "Ask about high-efficiency models that can save you money during the upcoming heating season.",
        };
      }
    }
  }
  
  // Indoor air quality recommendations
  if (system === 'indoor-air') {
    if (humidity > 60) {
      return {
        message: `With ${humidity}% humidity, improving your indoor air quality can make your home feel more comfortable and prevent moisture-related issues.`,
        tip: "Consider a whole-home dehumidifier to work with your HVAC system for better comfort.",
      };
    } else if (humidity < 30) {
      return {
        message: `With low ${humidity}% humidity, improving indoor air moisture can help with dry skin, static electricity, and respiratory comfort.`,
        tip: "A whole-home humidifier can maintain optimal humidity levels throughout your house.",
      };
    } else if (condition.toLowerCase().includes('pollen') || condition.toLowerCase().includes('allergen')) {
      return {
        message: `During high pollen and allergen seasons, improving your indoor air quality can provide relief from outdoor irritants.`,
        tip: "High-MERV filters and air purification systems can significantly reduce indoor allergens.",
      };
    }
  }
  
  return defaultRecommendation;
}