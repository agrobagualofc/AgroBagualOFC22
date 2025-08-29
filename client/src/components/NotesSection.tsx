import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Clock } from "lucide-react";
import CreateNoteModal from "@/components/modals/CreateNoteModal";
import { Note } from "@shared/schema";

export default function NotesSection() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: recentNotes = [], isLoading } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });

  const formatDateTime = (date: Date | string) => {
    const noteDate = new Date(date);
    const today = new Date();
    const isToday = noteDate.toDateString() === today.toDateString();
    
    if (isToday) {
      return `Hoje, ${noteDate.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    }
    
    return noteDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Card data-testid="notes-section">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold" data-testid="notes-title">
              Caderneta de Anotação
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowCreateModal(true)}
              className="text-primary font-medium"
              data-testid="button-create-note"
            >
              <Plus className="w-4 h-4 mr-1" />
              Nova
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3" data-testid="notes-list">
            {isLoading ? (
              <div className="space-y-2">
                <div className="animate-pulse bg-muted rounded-lg h-20" />
                <div className="animate-pulse bg-muted rounded-lg h-20" />
              </div>
            ) : recentNotes.length > 0 ? (
              recentNotes.slice(0, 3).map((note) => (
                <div 
                  key={note.id} 
                  className="p-3 bg-muted rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer"
                  data-testid={`note-item-${note.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-card-foreground" data-testid={`text-note-title-${note.id}`}>
                        {note.title}
                      </p>
                      {note.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2" data-testid={`text-note-description-${note.id}`}>
                          {note.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        {note.category && (
                          <Badge variant="outline" className="text-xs" data-testid={`badge-note-category-${note.id}`}>
                            {note.category}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground flex items-center" data-testid={`text-note-time-${note.id}`}>
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDateTime(note.noteDate)}
                        </span>
                      </div>
                    </div>
                    {note.isUrgent && (
                      <div className="ml-2">
                        <Badge variant="destructive" className="text-xs" data-testid={`badge-urgent-${note.id}`}>
                          Urgente
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground" data-testid="no-notes">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Nenhuma anotação ainda</p>
              </div>
            )}
          </div>
          
          {recentNotes.length > 0 && (
            <Button 
              variant="ghost" 
              className="w-full text-primary font-medium mt-4"
              data-testid="button-view-all-notes"
            >
              Ver todas as anotações
            </Button>
          )}
        </CardContent>
      </Card>

      <CreateNoteModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal}
      />
    </>
  );
}
