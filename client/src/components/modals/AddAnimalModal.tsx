import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { InsertAnimal } from "@shared/schema";

interface AddAnimalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddAnimalModal({ open, onOpenChange }: AddAnimalModalProps) {
  const [formData, setFormData] = useState({
    type: "",
    breed: "",
    name: "",
    description: "",
    weight: "",
    dailyMilkProduction: "",
    monthlyMilkProduction: "",
    category: "",
    birthDate: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createAnimalMutation = useMutation({
    mutationFn: async (animalData: Omit<InsertAnimal, "userId">) => {
      const response = await apiRequest("POST", "/api/animals", animalData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animals"] });
      toast({
        title: "Animal adicionado",
        description: "O animal foi cadastrado com sucesso!",
      });
      resetForm();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o animal",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      type: "",
      breed: "",
      name: "",
      description: "",
      weight: "",
      dailyMilkProduction: "",
      monthlyMilkProduction: "",
      category: "",
      birthDate: "",
    });
    setPhotoFile(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.name) {
      toast({
        title: "Campos obrigatórios",
        description: "Tipo e nome/identificação são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const animalData: Omit<InsertAnimal, "userId"> = {
      type: formData.type,
      breed: formData.breed || null,
      name: formData.name,
      description: formData.description || null,
      weight: formData.weight ? formData.weight : null,
      dailyMilkProduction: formData.dailyMilkProduction ? formData.dailyMilkProduction : null,
      monthlyMilkProduction: formData.monthlyMilkProduction ? formData.monthlyMilkProduction : null,
      category: formData.category || null,
      photoUrl: null, // TODO: Implement file upload
      birthDate: formData.birthDate || null,
    };

    createAnimalMutation.mutate(animalData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md max-h-[80vh] overflow-y-auto" data-testid="add-animal-modal">
        <DialogHeader>
          <DialogTitle data-testid="modal-title">Adicionar Animal</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4" data-testid="animal-form">
          <div>
            <Label htmlFor="type">Tipo do animal *</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
              <SelectTrigger className="premium-input" data-testid="select-animal-type">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vaca">Vaca</SelectItem>
                <SelectItem value="touro">Touro</SelectItem>
                <SelectItem value="terneiro">Terneiro</SelectItem>
                <SelectItem value="novilha">Novilha</SelectItem>
                <SelectItem value="ovelha">Ovelha</SelectItem>
                <SelectItem value="carneiro">Carneiro</SelectItem>
                <SelectItem value="porco">Porco</SelectItem>
                <SelectItem value="porca">Porca</SelectItem>
                <SelectItem value="galinha">Galinha</SelectItem>
                <SelectItem value="galo">Galo</SelectItem>
                <SelectItem value="cavalo">Cavalo</SelectItem>
                <SelectItem value="égua">Égua</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="breed">Raça</Label>
            <Input
              id="breed"
              value={formData.breed}
              onChange={(e) => handleInputChange("breed", e.target.value)}
              placeholder="Ex: Holandesa, Angus, Nelore"
              className="premium-input"
              data-testid="input-animal-breed"
            />
          </div>
          
          <div>
            <Label htmlFor="name">Nome/Identificação *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Ex: Vaca 201, Touro Principal"
              className="premium-input"
              data-testid="input-animal-name"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Observações sobre o animal..."
              rows={2}
              className="premium-input"
              data-testid="textarea-animal-description"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                placeholder="580"
                className="premium-input"
                data-testid="input-animal-weight"
              />
            </div>
            <div>
              <Label htmlFor="dailyMilk">Produção L/dia</Label>
              <Input
                id="dailyMilk"
                type="number"
                value={formData.dailyMilkProduction}
                onChange={(e) => handleInputChange("dailyMilkProduction", e.target.value)}
                placeholder="25"
                className="premium-input"
                data-testid="input-daily-milk"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger className="premium-input" data-testid="select-animal-category">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="produtor">Produtor</SelectItem>
                <SelectItem value="corte">Corte</SelectItem>
                <SelectItem value="reprodutor">Reprodutor</SelectItem>
                <SelectItem value="inseminação">Inseminação</SelectItem>
                <SelectItem value="cria">Cria</SelectItem>
                <SelectItem value="recria">Recria</SelectItem>
                <SelectItem value="engorda">Engorda</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="birthDate">Data de nascimento</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
              className="premium-input"
              data-testid="input-birth-date"
            />
          </div>
          
          {/* Photo Upload */}
          <div>
            <Label>Foto do animal</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center" data-testid="photo-upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="photo-upload"
                data-testid="input-photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {photoFile ? photoFile.name : "Adicionar foto do animal"}
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                  data-testid="button-upload-photo"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {photoFile ? "Trocar foto" : "Escolher arquivo"}
                </Button>
              </label>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
              data-testid="button-cancel-animal"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createAnimalMutation.isPending}
              className="flex-1 premium-button"
              data-testid="button-save-animal"
            >
              {createAnimalMutation.isPending ? "Salvando..." : "Salvar Animal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
