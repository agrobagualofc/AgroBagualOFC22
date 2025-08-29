import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Route, Play } from "lucide-react";
import { InsertGpsRoute } from "@shared/schema";

interface CreateRouteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateRouteModal({ open, onOpenChange }: CreateRouteModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [activity, setActivity] = useState("");
  const [area, setArea] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number}[]>([]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createRouteMutation = useMutation({
    mutationFn: async (routeData: Omit<InsertGpsRoute, "userId">) => {
      const response = await apiRequest("POST", "/api/gps/routes", routeData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gps/routes"] });
      toast({
        title: "Rota criada",
        description: "Sua rota GPS foi salva com sucesso!",
      });
      resetForm();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível criar a rota",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setName("");
    setDescription("");
    setActivity("");
    setArea("");
    setCoordinates([]);
    setIsRecording(false);
  };

  const startRecording = () => {
    setIsRecording(true);
    // Simulamos coordenadas GPS (em produção seria GPS real)
    const simulatedCoords = [
      { lat: -27.6333, lng: -52.4167 }, // Erechim aproximado
      { lat: -27.6340, lng: -52.4170 },
      { lat: -27.6350, lng: -52.4180 },
      { lat: -27.6360, lng: -52.4190 },
    ];
    setCoordinates(simulatedCoords);
    
    toast({
      title: "Gravação iniciada",
      description: "Coordenadas GPS sendo registradas...",
    });
    
    // Para simulação, para automaticamente após 3 segundos
    setTimeout(() => {
      setIsRecording(false);
      toast({
        title: "Gravação finalizada",
        description: "Rota GPS registrada com sucesso!",
      });
    }, 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !activity) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome e a atividade da rota",
        variant: "destructive",
      });
      return;
    }

    createRouteMutation.mutate({
      name,
      description,
      activity,
      area: area ? area : undefined,
      routeData: { coordinates, recorded: new Date().toISOString() },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md" data-testid="create-route-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center" data-testid="modal-title">
            <Route className="w-5 h-5 mr-2" />
            Nova Rota GPS
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4" data-testid="route-form">
          <div>
            <Label htmlFor="name">Nome da rota *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Pulverização Talhão 3"
              className="premium-input"
              data-testid="input-route-name"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes da atividade..."
              rows={3}
              className="premium-input"
              data-testid="textarea-route-description"
            />
          </div>
          
          <div>
            <Label htmlFor="activity">Atividade *</Label>
            <Select value={activity} onValueChange={setActivity}>
              <SelectTrigger className="premium-input" data-testid="select-route-activity">
                <SelectValue placeholder="Selecione a atividade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pulverizar">Pulverização</SelectItem>
                <SelectItem value="plantar">Plantio</SelectItem>
                <SelectItem value="colher">Colheita</SelectItem>
                <SelectItem value="arar">Aração</SelectItem>
                <SelectItem value="gradear">Gradeação</SelectItem>
                <SelectItem value="adubacao">Adubação</SelectItem>
                <SelectItem value="irrigacao">Irrigação</SelectItem>
                <SelectItem value="roçar">Roçada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="area">Área estimada (hectares)</Label>
            <Input
              id="area"
              type="number"
              step="0.01"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="15.5"
              className="premium-input"
              data-testid="input-route-area"
            />
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <Label className="text-sm font-medium mb-2 block">Coordenadas GPS</Label>
            {coordinates.length > 0 ? (
              <div className="text-sm text-muted-foreground mb-2">
                <p>{coordinates.length} pontos registrados</p>
                <p className="text-xs">Área aproximada: {((coordinates.length - 1) * 0.5).toFixed(2)} ha</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-2">
                Nenhuma coordenada registrada
              </p>
            )}
            
            <Button
              type="button"
              variant={isRecording ? "destructive" : "secondary"}
              onClick={startRecording}
              disabled={isRecording}
              className="w-full"
              data-testid="button-record-gps"
            >
              {isRecording ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-pulse bg-red-500 rounded-full" />
                  Gravando...
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 mr-2" />
                  Iniciar Gravação GPS
                </>
              )}
            </Button>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              data-testid="button-cancel-route"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createRouteMutation.isPending}
              className="flex-1"
              data-testid="button-save-route"
            >
              {createRouteMutation.isPending ? "Salvando..." : "Salvar Rota"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}