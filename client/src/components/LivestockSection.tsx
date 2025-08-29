import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Dog, Rabbit, Bird, PiggyBank, Syringe, ChevronRight } from "lucide-react";
import AddAnimalModal from "@/components/modals/AddAnimalModal";
import { Animal } from "@shared/schema";

export default function LivestockSection() {
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: animals = [], isLoading } = useQuery<Animal[]>({
    queryKey: ["/api/animals"],
  });

  const getAnimalIcon = (type: string) => {
    const icons: { [key: string]: any } = {
      vaca: Dog,
      touro: Dog,
      terneiro: Dog,
      cavalo: Rabbit,
      galinha: Bird,
      porco: PiggyBank,
    };
    return icons[type.toLowerCase()] || Dog;
  };

  const getAnimalStats = () => {
    const stats = animals.reduce((acc, animal) => {
      const type = animal.type.toLowerCase();
      if (type.includes('vaca') || type.includes('touro') || type.includes('terneiro')) {
        acc.bovinos = (acc.bovinos || 0) + 1;
      } else if (type.includes('cavalo')) {
        acc.equinos = (acc.equinos || 0) + 1;
      } else if (type.includes('galinha') || type.includes('frango')) {
        acc.aves = (acc.aves || 0) + 1;
      } else if (type.includes('porco')) {
        acc.suinos = (acc.suinos || 0) + 1;
      }
      return acc;
    }, {} as { [key: string]: number });
    
    return [
      { name: "Bovinos", count: stats.bovinos || 0, icon: Dog },
      { name: "Equinos", count: stats.equinos || 0, icon: Rabbit },
      { name: "Aves", count: stats.aves || 0, icon: Bird },
      { name: "Suínos", count: stats.suinos || 0, icon: PiggyBank },
    ];
  };

  const animalStats = getAnimalStats();

  return (
    <>
      <div className="space-y-6" data-testid="livestock-section">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold" data-testid="livestock-title">
                Meu Rebanho
              </CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-primary border-primary"
                  data-testid="button-vaccination"
                >
                  <Syringe className="w-4 h-4 mr-1" />
                  Vacinação
                </Button>
                <Button 
                  size="sm"
                  onClick={() => setShowAddModal(true)}
                  className="bg-primary text-primary-foreground"
                  data-testid="button-add-animal"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Animal Categories */}
            <div className="grid grid-cols-2 gap-4 mb-6" data-testid="animal-categories">
              {animalStats.map((category) => {
                const Icon = category.icon;
                return (
                  <div 
                    key={category.name}
                    className="bg-muted rounded-lg p-4 text-center hover:bg-opacity-80 transition-colors cursor-pointer"
                    data-testid={`category-${category.name.toLowerCase()}`}
                  >
                    <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="font-medium text-card-foreground" data-testid={`text-category-name-${category.name.toLowerCase()}`}>
                      {category.name}
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid={`text-category-count-${category.name.toLowerCase()}`}>
                      {category.count} animais
                    </p>
                  </div>
                );
              })}
            </div>
            
            {/* Recent Animals */}
            <div>
              <h3 className="font-semibold text-card-foreground mb-3" data-testid="recent-animals-title">
                Animais Recentes
              </h3>
              <div className="space-y-3" data-testid="recent-animals-list">
                {isLoading ? (
                  <div className="space-y-2">
                    <div className="animate-pulse bg-muted rounded-lg h-16" />
                    <div className="animate-pulse bg-muted rounded-lg h-16" />
                  </div>
                ) : animals.length > 0 ? (
                  animals.slice(0, 3).map((animal) => {
                    const Icon = getAnimalIcon(animal.type);
                    return (
                      <div 
                        key={animal.id} 
                        className="flex items-center p-3 bg-muted rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer"
                        data-testid={`animal-item-${animal.id}`}
                      >
                        {animal.photoUrl ? (
                          <img 
                            src={animal.photoUrl} 
                            alt={animal.name}
                            className="w-12 h-12 rounded-full object-cover mr-3"
                            data-testid={`img-animal-${animal.id}`}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-card-foreground" data-testid={`text-animal-name-${animal.id}`}>
                            {animal.name} {animal.breed && `- ${animal.breed}`}
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            {animal.dailyMilkProduction && (
                              <span data-testid={`text-daily-production-${animal.id}`}>
                                {animal.dailyMilkProduction}L/dia
                              </span>
                            )}
                            {animal.monthlyMilkProduction && (
                              <span data-testid={`text-monthly-production-${animal.id}`}>
                                • {animal.monthlyMilkProduction}L/mês
                              </span>
                            )}
                            {animal.weight && (
                              <span data-testid={`text-weight-${animal.id}`}>
                                • {animal.weight}kg
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" data-testid={`icon-chevron-${animal.id}`} />
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-muted-foreground" data-testid="no-animals">
                    <Dog className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhum animal cadastrado</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddAnimalModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
      />
    </>
  );
}
