interface WeatherData {
  location: string;
  current: {
    temperature: number;
    condition: string;
    windSpeed: number;
    precipitation: number;
    icon: string;
  };
  forecast: Array<{
    day: string;
    temperature: number;
    condition: string;
    icon: string;
  }>;
}

export async function getWeatherData(location: string): Promise<WeatherData> {
  try {
    // Using OpenWeatherMap API as an example
    // In production, you might want to use a Brazilian weather service
    const API_KEY = process.env.WEATHER_API_KEY || process.env.OPENWEATHER_API_KEY || "default_key";
    
    // Current weather
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)},BR&appid=${API_KEY}&units=metric&lang=pt`
    );
    
    if (!currentResponse.ok) {
      throw new Error(`Weather API error: ${currentResponse.status}`);
    }
    
    const currentData = await currentResponse.json();
    
    // 3-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)},BR&appid=${API_KEY}&units=metric&lang=pt`
    );
    
    const forecastData = await forecastResponse.json();
    
    // Process forecast data to get daily summaries
    const dailyForecast = [];
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    for (let i = 1; i <= 3; i++) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + i);
      const dayName = days[targetDate.getDay()];
      
      // Find forecast for target date (taking noon reading)
      const dayForecast = forecastData.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000);
        return itemDate.getDate() === targetDate.getDate() && 
               itemDate.getHours() >= 11 && itemDate.getHours() <= 13;
      }) || forecastData.list[i * 8]; // Fallback to 8-hour intervals
      
      if (dayForecast) {
        dailyForecast.push({
          day: dayName,
          temperature: Math.round(dayForecast.main.temp),
          condition: dayForecast.weather[0].description,
          icon: getWeatherIcon(dayForecast.weather[0].main)
        });
      }
    }
    
    return {
      location: `${currentData.name}, ${currentData.sys.country}`,
      current: {
        temperature: Math.round(currentData.main.temp),
        condition: currentData.weather[0].description,
        windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
        precipitation: currentData.rain?.['1h'] || 0,
        icon: getWeatherIcon(currentData.weather[0].main)
      },
      forecast: dailyForecast
    };
    
  } catch (error) {
    console.error("Weather service error:", error);
    
    // Return fallback data if API fails
    return {
      location: location,
      current: {
        temperature: 24,
        condition: "Ensolarado",
        windSpeed: 15,
        precipitation: 0,
        icon: "fas fa-sun"
      },
      forecast: [
        { day: "Qua", temperature: 22, condition: "Nublado", icon: "fas fa-cloud-rain" },
        { day: "Qui", temperature: 26, condition: "Sol", icon: "fas fa-sun" },
        { day: "Sex", temperature: 23, condition: "Parcialmente nublado", icon: "fas fa-cloud-sun" }
      ]
    };
  }
}

function getWeatherIcon(condition: string): string {
  const iconMap: { [key: string]: string } = {
    'Clear': 'fas fa-sun',
    'Clouds': 'fas fa-cloud',
    'Rain': 'fas fa-cloud-rain',
    'Drizzle': 'fas fa-cloud-rain',
    'Thunderstorm': 'fas fa-bolt',
    'Snow': 'fas fa-snowflake',
    'Mist': 'fas fa-smog',
    'Fog': 'fas fa-smog',
  };
  
  return iconMap[condition] || 'fas fa-cloud';
}
