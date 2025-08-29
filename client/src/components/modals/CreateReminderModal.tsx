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
import { InsertReminder } from "@shared/schema";

interface CreateReminderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateReminderModal({ open, onOpenChange }: CreateReminderModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [reminderDate, setReminderDate] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createReminderMutation = useMutation({
    mutationFn: async (reminderData: Omit<InsertReminder, "userId">) => {
      const response = await apiRequest("POST", "/api/reminders", reminderData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reminders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reminders/today"] });
      toast({
        title: "Lembrete criado",
        description: "Seu lembrete foi salvo com sucesso!",
      });
      resetForm();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível criar o lembrete",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setIsUrgent(false);
    setReminderDate("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !category || !reminderDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha título, categoria e data/hora do lembrete",
        variant: "destructive",
      });
      return;
    }

    createReminderMutation.mutate({
      title,
      description,
      category,
      isUrgent,
      reminderDate: new Date(reminderDate),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md" data-testid="create-reminder-modal">
        <DialogHeader>
          <DialogTitle data-testid="modal-title">Criar Lembrete</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4" data-testid="reminder-form">
          <div>
            <Label htmlFor="title">Título do lembrete *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Vacinação do gado"
              className="premium-input"
              data-testid="input-reminder-title"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes do lembrete..."
              rows={3}
              className="premium-input"
              data-testid="textarea-reminder-description"
            />
          </div>
          
          <div>
            <Label htmlFor="category">Categoria *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="premium-input" data-testid="select-reminder-category">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plantio">Plantio</SelectItem>
                <SelectItem value="serviço">Serviço</SelectItem>
                <SelectItem value="colheita">Colheita</SelectItem>
                <SelectItem value="pecuária">Pecuária</SelectItem>
                <SelectItem value="manutenção">Manutenção</SelectItem>
                <SelectItem value="irrigação">Irrigação</SelectItem>
                <SelectItem value="fertilização">Fertilização</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="urgent">Marcar como urgente</Label>
            <Switch
              id="urgent"
              checked={isUrgent}
              onCheckedChange={setIsUrgent}
              data-testid="switch-urgent"
            />
          </div>
          
          <div>
            <Label htmlFor="datetime">Data e hora do lembrete *</Label>
            <Input
              id="datetime"
              type="datetime-local"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="premium-input"
              data-testid="input-reminder-datetime"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
              data-testid="button-cancel-reminder"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createReminderMutation.isPending}
              className="flex-1 premium-button"
              data-testid="button-save-reminder"
            >
              {createReminderMutation.isPending ? "Salvando..." : "Salvar Lembrete"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
