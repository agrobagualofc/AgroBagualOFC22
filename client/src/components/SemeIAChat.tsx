import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sprout, Send, Camera, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export default function SemeIAChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content: "Olá! Sou a SemeIA, sua assistente do campo. Qual sua dúvida de hoje?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/semeia/chat", { message });
      return await response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString() + "_ai",
        type: "ai",
        content: data.response,
        timestamp: new Date()
      }]);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível processar sua mensagem",
        variant: "destructive",
      });
    }
  });

  const imageAnalysisMutation = useMutation({
    mutationFn: async (image: File) => {
      const formData = new FormData();
      formData.append('image', image);
      
      const response = await fetch("/api/semeia/analyze-image", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString() + "_ai",
        type: "ai",
        content: data.analysis,
        timestamp: new Date()
      }]);
      setSelectedImage(null);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível analisar a imagem",
        variant: "destructive",
      });
      setSelectedImage(null);
    }
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(inputMessage);
    setInputMessage("");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "user",
        content: `[Imagem enviada: ${file.name}]`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      imageAnalysisMutation.mutate(file);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[calc(100vh-140px)] flex flex-col" data-testid="semeia-chat">
      {/* Chat Header */}
      <CardHeader className="gradient-bg text-white rounded-t-xl" data-testid="chat-header">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold" data-testid="text-semeia-title">SemeIA</h2>
            <p className="text-sm opacity-90" data-testid="text-semeia-subtitle">Assistente do Campo</p>
          </div>
        </div>
      </CardHeader>
      
      {/* Chat Messages */}
      <CardContent className="flex-1 p-4 overflow-y-auto custom-scrollbar" data-testid="chat-messages">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.type === 'user' ? 'justify-end' : 'items-start'}`}
              data-testid={`message-${message.id}`}
            >
              {message.type === 'ai' && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Sprout className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div 
                className={`rounded-lg p-3 max-w-xs lg:max-w-md ${
                  message.type === 'user' 
                    ? 'user-message' 
                    : 'ai-message'
                }`}
                data-testid={`message-content-${message.id}`}
              >
                <p className="text-sm whitespace-pre-wrap">
                  {message.content}
                </p>
                <p className={`text-xs mt-1 opacity-70 ${
                  message.type === 'user' ? 'text-white' : 'text-muted-foreground'
                }`}>
                  {message.timestamp.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {(chatMutation.isPending || imageAnalysisMutation.isPending) && (
            <div className="flex items-start" data-testid="typing-indicator">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                <Sprout className="w-4 h-4 text-white" />
              </div>
              <div className="ai-message">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">SemeIA está pensando...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      {/* Chat Input */}
      <div className="p-4 border-t border-border" data-testid="chat-input-section">
        {selectedImage && (
          <div className="mb-3 p-2 bg-muted rounded-lg flex items-center justify-between" data-testid="selected-image-preview">
            <span className="text-sm text-card-foreground">Imagem: {selectedImage.name}</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedImage(null)}
              data-testid="button-remove-image"
            >
              ✕
            </Button>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            data-testid="input-file-hidden"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={imageAnalysisMutation.isPending}
            data-testid="button-camera"
          >
            <Camera className="w-4 h-4" />
          </Button>
          
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua pergunta..."
            className="flex-1 premium-input"
            disabled={chatMutation.isPending || imageAnalysisMutation.isPending}
            data-testid="input-chat-message"
          />
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || chatMutation.isPending || imageAnalysisMutation.isPending}
            size="icon"
            className="bg-primary text-primary-foreground"
            data-testid="button-send-message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
