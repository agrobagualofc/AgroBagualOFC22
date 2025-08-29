import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationChange: (location: string) => void;
  currentLocation: string;
}

const popularCities = [
  "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Porto Alegre", 
  "Curitiba", "Brasília", "Goiânia", "Campo Grande", "Erechim",
  "Passo Fundo", "Caxias do Sul", "Santa Maria", "Pelotas"
];

export default function LocationModal({ 
  open, 
  onOpenChange, 
  onLocationChange, 
  currentLocation 
}: LocationModalProps) {
  const [searchLocation, setSearchLocation] = useState("");
  const { toast } = useToast();

  const handleLocationSelect = (location: string) => {
    onLocationChange(location);
    toast({
      title: "Localização alterada",
      description: `Previsão do tempo atualizada para ${location}`,
    });
    onOpenChange(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchLocation.trim()) {
      handleLocationSelect(searchLocation.trim());
    }
  };

  const filteredCities = popularCities.filter(city =>
    city.toLowerCase().includes(searchLocation.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md" data-testid="location-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center" data-testid="modal-title">
            <MapPin className="w-5 h-5 mr-2" />
            Alterar Localização
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="current-location">Localização atual</Label>
            <div className="p-3 bg-muted rounded-lg text-sm">
              {currentLocation}
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-3">
            <div>
              <Label htmlFor="search">Buscar nova localização</Label>
              <div className="flex space-x-2">
                <Input
                  id="search"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Digite o nome da cidade..."
                  className="flex-1"
                  data-testid="input-location-search"
                />
                <Button type="submit" size="sm" data-testid="button-search">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </form>

          <div>
            <Label className="text-sm font-medium mb-2 block">Cidades populares</Label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {(searchLocation ? filteredCities : popularCities).map((city) => (
                <Button
                  key={city}
                  variant="outline"
                  size="sm"
                  onClick={() => handleLocationSelect(city)}
                  className={`justify-start text-sm ${
                    city === currentLocation 
                      ? "bg-primary text-primary-foreground" 
                      : ""
                  }`}
                  data-testid={`button-city-${city.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <MapPin className="w-3 h-3 mr-2" />
                  {city}
                </Button>
              ))}
            </div>
            
            {searchLocation && filteredCities.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">Nenhuma cidade encontrada</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLocationSelect(searchLocation)}
                  className="mt-2"
                  data-testid="button-use-custom-location"
                >
                  Usar "{searchLocation}"
                </Button>
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              data-testid="button-cancel-location"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}