import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, AlertTriangle } from "lucide-react";
import CreateReminderModal from "@/components/modals/CreateReminderModal";
import { Reminder } from "@shared/schema";

export default function ReminderSection() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: todayReminders = [], isLoading } = useQuery<Reminder[]>({
    queryKey: ["/api/reminders/today"],
  });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      plantio: "bg-green-500",
      serviço: "bg-blue-500",
      colheita: "bg-yellow-500",
      pecuária: "bg-orange-500",
      manutenção: "bg-purple-500",
    };
    return colors[category] || "bg-gray-500";
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      <Card data-testid="reminders-section">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold" data-testid="reminders-title">
              Lembretes de Hoje
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowCreateModal(true)}
              className="text-primary font-medium"
              data-testid="button-create-reminder"
            >
              <Plus className="w-4 h-4 mr-1" />
              Criar
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3" data-testid="reminders-list">
            {isLoading ? (
              <div className="space-y-2">
                <div className="animate-pulse bg-muted rounded-lg h-16" />
                <div className="animate-pulse bg-muted rounded-lg h-16" />
              </div>
            ) : todayReminders.length > 0 ? (
              todayReminders.map((reminder) => (
                <div 
                  key={reminder.id} 
                  className="flex items-center p-3 bg-muted rounded-lg hover:bg-opacity-80 transition-colors"
                  data-testid={`reminder-item-${reminder.id}`}
                >
                  <div 
                    className={`w-3 h-3 rounded-full mr-3 ${getCategoryColor(reminder.category)}`}
                    data-testid={`reminder-priority-${reminder.id}`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-card-foreground" data-testid={`text-reminder-title-${reminder.id}`}>
                        {reminder.title}
                      </p>
                      {reminder.isUrgent && (
                        <AlertTriangle className="w-4 h-4 text-red-500" data-testid={`icon-urgent-${reminder.id}`} />
                      )}
                    </div>
                    <div className="flex items-center space-x-3 mt-1">
                      <Badge variant="outline" className="text-xs" data-testid={`badge-category-${reminder.id}`}>
                        {reminder.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center" data-testid={`text-reminder-time-${reminder.id}`}>
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(reminder.reminderDate)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground" data-testid="no-reminders">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Nenhum lembrete para hoje</p>
              </div>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full text-primary font-medium mt-4"
            data-testid="button-view-all-reminders"
          >
            Ver todos os lembretes
          </Button>
        </CardContent>
      </Card>

      <CreateReminderModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal}
      />
    </>
  );
}
