import { Button } from "@/components/ui/button";
import { 
  Home, 
  Dog, 
  Sprout, 
  MapPin, 
  ShoppingCart 
} from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "home", label: "Início", icon: Home, testId: "tab-home" },
    { id: "livestock", label: "Rebanho", icon: Dog, testId: "tab-livestock" },
    { id: "semeia", label: "SemeIA", icon: Sprout, testId: "tab-semeia" },
    { id: "gps", label: "GPS", icon: MapPin, testId: "tab-gps" },
    { id: "market", label: "Mercado", icon: ShoppingCart, testId: "tab-market" },
  ];

  return (
    <nav className="tab-bar-fixed bg-card border-t border-border px-4 py-2" data-testid="bottom-navigation">
      <div className="grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isSemeIA = tab.id === "semeia";
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 h-auto space-y-1 ${
                isActive 
                  ? isSemeIA 
                    ? "text-primary" 
                    : "text-primary" 
                  : "text-muted-foreground"
              } hover:text-primary transition-colors`}
              data-testid={tab.testId}
            >
              <Icon 
                className={`w-5 h-5 ${
                  isActive && isSemeIA ? "text-primary" : ""
                }`} 
              />
              <span 
                className={`text-xs ${
                  isActive && isSemeIA ? "font-semibold gradient-text" : ""
                }`}
              >
                {tab.label}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
