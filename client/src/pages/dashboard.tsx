import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import WeatherWidget from "@/components/WeatherWidget";
import ReminderSection from "@/components/ReminderSection";
import NotesSection from "@/components/NotesSection";
import NewsSection from "@/components/NewsSection";
import LivestockSection from "@/components/LivestockSection";
import SemeIAChat from "@/components/SemeIAChat";
import GPSSection from "@/components/GPSSection";
import MarketSection from "@/components/MarketSection";
import BottomNavigation from "@/components/BottomNavigation";

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("home");

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-6" data-testid="home-tab">
            <WeatherWidget />
            <ReminderSection />
            <NotesSection />
            <NewsSection />
          </div>
        );
      case "livestock":
        return <LivestockSection />;
      case "semeia":
        return <SemeIAChat />;
      case "gps":
        return <GPSSection />;
      case "market":
        return <MarketSection />;
      default:
        return <div>Página não encontrada</div>;
    }
  };

  return (
    <Layout>
      <main className="pb-20 min-h-screen" data-testid="dashboard-main">
        <div className="fade-in">
          {renderTabContent()}
        </div>
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </main>
    </Layout>
  );
}
