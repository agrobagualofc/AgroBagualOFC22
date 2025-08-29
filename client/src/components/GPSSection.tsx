import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Route, 
  Play, 
  History, 
  Calculator,
  Navigation,
  Square,
  Tractor
} from "lucide-react";
import CalculatorModal from "@/components/modals/CalculatorModal";
import { GpsRoute } from "@shared/schema";

export default function GPSSection() {
  const [showCalculator, setShowCalculator] = useState(false);

  const { data: routes = [], isLoading } = useQuery<GpsRoute[]>({
    queryKey: ["/api/gps/routes"],
  });

  return (
    <>
      <div className="space-y-6" data-testid="gps-section">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center" data-testid="gps-title">
              <Navigation className="w-5 h-5 mr-2 text-primary" />
              GPS Agrícola
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {/* Map Placeholder */}
            <div className="bg-green-50 border-2 border-dashed border-green-300 rounded-lg h-64 flex items-center justify-center mb-6 relative" data-testid="gps-map">
              <div className="text-center">
                <Tractor className="w-12 h-12 text-green-400 mx-auto mb-2" />
                <p className="text-green-700 font-medium" data-testid="text-map-title">Mapa da Propriedade</p>
                <p className="text-green-600 text-sm" data-testid="text-total-area">Área total: 120 hectares</p>
                
                {/* Simulated field lines */}
                <div className="absolute inset-4 opacity-30">
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i}
                      className="border-b border-green-400"
                      style={{ 
                        position: 'absolute',
                        top: `${10 + i * 10}%`,
                        left: '10%',
                        right: '10%',
                        height: '1px'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* GPS Controls */}
            <div className="grid grid-cols-2 gap-3 mb-6" data-testid="gps-controls">
              <Button 
                className="bg-primary text-primary-foreground p-4 h-auto flex flex-col items-center space-y-1"
                data-testid="button-create-route"
              >
                <Route className="w-5 h-5" />
                <span className="text-sm font-medium">Criar Rota</span>
              </Button>
              
              <Button 
                className="bg-secondary text-secondary-foreground p-4 h-auto flex flex-col items-center space-y-1"
                data-testid="button-start-route"
              >
                <Play className="w-5 h-5" />
                <span className="text-sm font-medium">Iniciar Rota</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="p-4 h-auto flex flex-col items-center space-y-1"
                data-testid="button-history"
              >
                <History className="w-5 h-5" />
                <span className="text-sm font-medium">Histórico</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="p-4 h-auto flex flex-col items-center space-y-1"
                data-testid="button-mark-area"
              >
                <Square className="w-5 h-5" />
                <span className="text-sm font-medium">Marcar Área</span>
              </Button>
            </div>
            
            {/* Recent Routes */}
            <div data-testid="recent-routes">
              <h3 className="font-semibold text-card-foreground mb-3">Rotas Recentes</h3>
              <div className="space-y-2">
                {isLoading ? (
                  <div className="animate-pulse bg-muted rounded-lg h-16" />
                ) : routes.length > 0 ? (
                  routes.slice(0, 3).map((route) => (
                    <div 
                      key={route.id} 
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      data-testid={`route-item-${route.id}`}
                    >
                      <div>
                        <p className="font-medium text-card-foreground" data-testid={`text-route-name-${route.id}`}>
                          {route.name}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs" data-testid={`badge-activity-${route.id}`}>
                            {route.activity}
                          </Badge>
                          {route.area && (
                            <span className="text-xs text-muted-foreground" data-testid={`text-route-area-${route.id}`}>
                              {route.area} ha
                            </span>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" data-testid={`button-view-route-${route.id}`}>
                        Ver
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground" data-testid="no-routes">
                    <Route className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma rota criada</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Calculator Button */}
      <Button
        onClick={() => setShowCalculator(true)}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg bg-accent text-accent-foreground hover:scale-105 transition-transform"
        data-testid="button-calculator-float"
      >
        <Calculator className="w-6 h-6" />
      </Button>

      <CalculatorModal 
        open={showCalculator} 
        onOpenChange={setShowCalculator}
      />
    </>
  );
}
