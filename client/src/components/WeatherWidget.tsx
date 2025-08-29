import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Wind, Droplets, MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import LocationModal from "@/components/modals/LocationModal";

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

export default function WeatherWidget() {
  const [currentLocation, setCurrentLocation] = useState("Erechim");
  const [showLocationModal, setShowLocationModal] = useState(false);
  
  const { data: weather, isLoading, error } = useQuery<WeatherData>({
    queryKey: ["/api/weather", currentLocation],
  });

  if (isLoading) {
    return (
      <Card data-testid="weather-widget-loading">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card data-testid="weather-widget-error">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Não foi possível carregar a previsão do tempo</p>
        </CardContent>
      </Card>
    );
  }

  const getWeatherIcon = (iconClass: string) => {
    // Convert FontAwesome class to Lucide icon
    if (iconClass.includes('sun')) return "☀️";
    if (iconClass.includes('cloud-rain')) return "🌧️";
    if (iconClass.includes('cloud-sun')) return "⛅";
    if (iconClass.includes('cloud')) return "☁️";
    return "☀️";
  };

  return (
    <>
    <Card className="weather-card border-0 text-white" data-testid="weather-widget">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold" data-testid="weather-title">
            Previsão do Tempo
          </CardTitle>
          <Button 
            onClick={() => setShowLocationModal(true)}
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white hover:bg-opacity-20"
            data-testid="button-change-location"
          >
            <MapPin className="w-4 h-4 mr-1" />
            Mudar local
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        {weather && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div data-testid="current-weather">
                <p className="text-3xl font-bold" data-testid="text-temperature">
                  {weather.current.temperature}°C
                </p>
                <p className="text-sm opacity-90" data-testid="text-location">
                  {weather.location}
                </p>
                <div className="flex items-center space-x-3 text-sm opacity-80 mt-1">
                  <span className="flex items-center" data-testid="text-condition">
                    {weather.current.condition}
                  </span>
                  <span className="flex items-center" data-testid="text-wind">
                    <Wind className="w-3 h-3 mr-1" />
                    {weather.current.windSpeed} km/h
                  </span>
                  <span className="flex items-center" data-testid="text-precipitation">
                    <Droplets className="w-3 h-3 mr-1" />
                    {weather.current.precipitation}mm
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl mb-2" data-testid="weather-icon">
                  {getWeatherIcon(weather.current.icon)}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white hover:bg-opacity-20"
                  data-testid="button-see-more"
                >
                  <MoreHorizontal className="w-4 h-4 mr-1" />
                  Ver mais
                </Button>
              </div>
            </div>
            
            {/* 3-day forecast */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white border-opacity-20" data-testid="forecast-section">
              {weather.forecast.map((day, index) => (
                <div key={index} className="text-center" data-testid={`forecast-day-${index}`}>
                  <p className="text-xs opacity-75" data-testid={`text-day-name-${index}`}>
                    {day.day}
                  </p>
                  <div className="text-xl my-1" data-testid={`forecast-icon-${index}`}>
                    {getWeatherIcon(day.icon)}
                  </div>
                  <p className="text-sm font-medium" data-testid={`text-day-temperature-${index}`}>
                    {day.temperature}°C
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
    
    <LocationModal
      open={showLocationModal}
      onOpenChange={setShowLocationModal}
      currentLocation={currentLocation}
      onLocationChange={setCurrentLocation}
    />
  </>
  );
}
