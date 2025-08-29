import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, HelpCircle, Globe, ChevronDown } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getCurrentDate = () => {
    const now = new Date();
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 
                   'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    return `${dayName}, ${day} de ${month} de ${year}`;
  };

  const getUserName = () => {
    if (user && 'firstName' in user && 'lastName' in user && user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user && 'firstName' in user && user.firstName) {
      return user.firstName;
    }
    if (user && 'email' in user && user.email) {
      return user.email.split('@')[0];
    }
    return "Usuário";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-bg p-4 shadow-sm" data-testid="header">
        <div className="flex items-center justify-between">
          <div className="flex-1" data-testid="user-greeting">
            <h1 className="text-lg font-semibold text-white" data-testid="text-user-name">
              Olá, {getUserName()}
            </h1>
            <p className="text-sm text-white opacity-90" data-testid="text-current-date">
              {getCurrentDate()}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-10 h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30"
                  data-testid="button-profile-menu"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={(user && 'profileImageUrl' in user && user.profileImageUrl) ? user.profileImageUrl : ""} />
                    <AvatarFallback className="bg-white text-primary">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48" data-testid="profile-dropdown">
                <DropdownMenuItem data-testid="menu-account">
                  <User className="w-4 h-4 mr-2" />
                  Conta
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-logout">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair da conta
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Settings Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-10 h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30"
                  data-testid="button-settings-menu"
                >
                  <Settings className="w-5 h-5 text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48" data-testid="settings-dropdown">
                <DropdownMenuItem data-testid="menu-settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-language">
                  <Globe className="w-4 h-4 mr-2" />
                  Linguagem
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-support">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Suporte
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-help">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Ajuda
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => window.location.href = "/api/logout"}
                  data-testid="menu-logout-settings"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair da conta
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
