import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { InsertNote } from "@shared/schema";

interface CreateNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateNoteModal({ open, onOpenChange }: CreateNoteModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [noteDate, setNoteDate] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createNoteMutation = useMutation({
    mutationFn: async (noteData: Omit<InsertNote, "userId">) => {
      const response = await apiRequest("POST", "/api/notes", noteData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({
        title: "Anotação criada",
        description: "Sua anotação foi salva com sucesso!",
      });
      resetForm();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível criar a anotação",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setIsUrgent(false);
    setNoteDate("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast({
        title: "Campo obrigatório",
        description: "O título da anotação é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const finalNoteDate = noteDate || new Date().toISOString();

    createNoteMutation.mutate({
      title,
      description,
      category,
      isUrgent,
      noteDate: new Date(finalNoteDate),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md" data-testid="create-note-modal">
        <DialogHeader>
          <DialogTitle data-testid="modal-title">Nova Anotação</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4" data-testid="note-form">
          <div>
            <Label htmlFor="title">Título da anotação *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Ordenha vaca 201"
              className="premium-input"
              data-testid="input-note-title"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Descrição detalhada</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes da anotação..."
              rows={4}
              className="premium-input"
              data-testid="textarea-note-description"
            />
          </div>
          
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="premium-input" data-testid="select-note-category">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ordenha">Ordenha</SelectItem>
                <SelectItem value="alimentação">Alimentação</SelectItem>
                <SelectItem value="tratamento">Tratamento</SelectItem>
                <SelectItem value="manutenção">Manutenção</SelectItem>
                <SelectItem value="plantio">Plantio</SelectItem>
                <SelectItem value="colheita">Colheita</SelectItem>
                <SelectItem value="irrigação">Irrigação</SelectItem>
                <SelectItem value="fertilização">Fertilização</SelectItem>
                <SelectItem value="observações">Observações</SelectItem>
                <SelectItem value="clima">Clima</SelectItem>
                <SelectItem value="equipamentos">Equipamentos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="urgent">Marcar como urgente</Label>
            <Switch
              id="urgent"
              checked={isUrgent}
              onCheckedChange={setIsUrgent}
              data-testid="switch-note-urgent"
            />
          </div>
          
          <div>
            <Label htmlFor="datetime">Data e hora (opcional)</Label>
            <Input
              id="datetime"
              type="datetime-local"
              value={noteDate}
              onChange={(e) => setNoteDate(e.target.value)}
              className="premium-input"
              data-testid="input-note-datetime"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Se não informado, será usada a data/hora atual
            </p>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
              data-testid="button-cancel-note"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createNoteMutation.isPending}
              className="flex-1 premium-button"
              data-testid="button-save-note"
            >
              {createNoteMutation.isPending ? "Salvando..." : "Salvar Anotação"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
