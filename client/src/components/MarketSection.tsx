import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Phone,
  Plus,
  Eye
} from "lucide-react";
import { MarketListing } from "@shared/schema";

interface MarketProduct {
  id: string;
  name: string;
  price: string;
  change: number;
  location: string;
  imageUrl: string;
}

export default function MarketSection() {
  const [activeTab, setActiveTab] = useState("products");

  const { data: listings = [], isLoading } = useQuery<MarketListing[]>({
    queryKey: ["/api/market/listings"],
  });

  // Static market data for commodity prices
  const commodityPrices: MarketProduct[] = [
    {
      id: "soja",
      name: "Soja",
      price: "R$ 165,40",
      change: 2.3,
      location: "Chapecó",
      imageUrl: "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150"
    },
    {
      id: "milho",
      name: "Milho",
      price: "R$ 72,80",
      change: -1.5,
      location: "Porto Alegre",
      imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150"
    },
    {
      id: "gado",
      name: "Gado",
      price: "R$ 280,00",
      change: 8.2,
      location: "Erechim",
      imageUrl: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150"
    },
    {
      id: "leite",
      name: "Leite",
      price: "R$ 2,85",
      change: 1.8,
      location: "São Paulo",
      imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150"
    },
    {
      id: "canela",
      name: "Canela",
      price: "R$ 45,60",
      change: 3.1,
      location: "Porto",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150"
    },
    {
      id: "aveia",
      name: "Aveia",
      price: "R$ 38,90",
      change: -0.8,
      location: "Passo Fundo",
      imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150"
    }
  ];

  // Sample equipment listings
  const equipmentListings = [
    {
      id: "tractor1",
      title: "John Deere 6120M",
      description: "Trator em ótimo estado com 2.500 horas. Apenas pneus carecas e hidráulico com pequeno vazamento.",
      price: "R$ 280.000",
      location: "Erechim, RS",
      contact: "(54) 99999-1234",
      imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      condition: "Usado"
    },
    {
      id: "colheitadeira1",
      title: "Case IH 2388",
      description: "Colheitadeira revisada com 4.300 horas. Motor novo e sistema de debulha em perfeito estado.",
      price: "R$ 450.000",
      location: "Passo Fundo, RS",
      contact: "(54) 98888-5678",
      imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      condition: "Usado"
    },
    {
      id: "plantadeira1",
      title: "Semeato SHM 11/13",
      description: "Plantadeira para milho e soja, 11 linhas, sistema de distribuição pneumático.",
      price: "R$ 85.000",
      location: "Santa Rosa, RS",
      contact: "(55) 97777-9012",
      imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      condition: "Seminovo"
    }
  ];

  return (
    <div className="space-y-6" data-testid="market-section">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center" data-testid="market-title">
            <ShoppingCart className="w-5 h-5 mr-2 text-primary" />
            Mercado
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} data-testid="market-tabs">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products" data-testid="tab-products">Produtos</TabsTrigger>
              <TabsTrigger value="buysell" data-testid="tab-buysell">Compra e Venda</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products" className="mt-6" data-testid="products-tab">
              <div className="grid grid-cols-2 gap-4" data-testid="commodity-prices">
                {commodityPrices.map((product) => (
                  <div 
                    key={product.id} 
                    className="market-card bg-muted rounded-lg p-4 text-center cursor-pointer"
                    data-testid={`product-${product.id}`}
                  >
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-16 object-cover rounded-lg mb-2"
                      data-testid={`img-product-${product.id}`}
                    />
                    <p className="font-medium text-card-foreground text-sm" data-testid={`text-product-name-${product.id}`}>
                      {product.name}
                    </p>
                    <p className="text-primary text-lg font-bold" data-testid={`text-product-price-${product.id}`}>
                      {product.price}
                    </p>
                    <div className="flex items-center justify-center space-x-1">
                      {product.change > 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-600" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-600" />
                      )}
                      <p className={`text-xs ${product.change > 0 ? 'text-green-600' : 'text-red-600'}`} data-testid={`text-product-change-${product.id}`}>
                        {product.change > 0 ? '+' : ''}{product.change}%
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center justify-center mt-1" data-testid={`text-product-location-${product.id}`}>
                      <MapPin className="w-3 h-3 mr-1" />
                      {product.location}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="buysell" className="mt-6" data-testid="buysell-tab">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-card-foreground" data-testid="equipment-title">Equipamentos e Insumos</h3>
                  <Button 
                    size="sm"
                    className="bg-primary text-primary-foreground"
                    data-testid="button-create-listing"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Anunciar
                  </Button>
                </div>
                
                <div className="space-y-3" data-testid="equipment-listings">
                  {equipmentListings.map((equipment) => (
                    <div 
                      key={equipment.id} 
                      className="market-card border border-border rounded-lg p-4"
                      data-testid={`equipment-${equipment.id}`}
                    >
                      <div className="flex space-x-4">
                        <img 
                          src={equipment.imageUrl} 
                          alt={equipment.title}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                          data-testid={`img-equipment-${equipment.id}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className="font-semibold text-card-foreground text-sm" data-testid={`text-equipment-title-${equipment.id}`}>
                              {equipment.title}
                            </h4>
                            <Badge 
                              variant={equipment.condition === "Novo" ? "default" : "secondary"} 
                              className="text-xs ml-2"
                              data-testid={`badge-condition-${equipment.id}`}
                            >
                              {equipment.condition}
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2" data-testid={`text-equipment-description-${equipment.id}`}>
                            {equipment.description}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <p className="font-bold text-primary" data-testid={`text-equipment-price-${equipment.id}`}>
                              {equipment.price}
                            </p>
                            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                              <span className="flex items-center" data-testid={`text-equipment-location-${equipment.id}`}>
                                <MapPin className="w-3 h-3 mr-1" />
                                {equipment.location}
                              </span>
                              <span className="flex items-center" data-testid={`text-equipment-contact-${equipment.id}`}>
                                <Phone className="w-3 h-3 mr-1" />
                                {equipment.contact}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 mt-3">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 text-xs"
                              data-testid={`button-view-details-${equipment.id}`}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Ver detalhes
                            </Button>
                            <Button 
                              size="sm" 
                              className="flex-1 text-xs bg-primary text-primary-foreground"
                              data-testid={`button-contact-seller-${equipment.id}`}
                            >
                              <Phone className="w-3 h-3 mr-1" />
                              Contatar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Seeds and Inputs Section */}
                <div className="mt-6">
                  <h3 className="font-semibold text-card-foreground mb-3" data-testid="seeds-title">Sementes e Insumos</h3>
                  <div className="space-y-2" data-testid="seeds-listings">
                    {[
                      { name: "Milho Brevant 2020", type: "Semente", quantity: "60kg", price: "R$ 850,00" },
                      { name: "Soja Dekalb 1620", type: "Semente", quantity: "40kg", price: "R$ 420,00" },
                      { name: "Ureia 45%", type: "Fertilizante", quantity: "50 sacos", price: "R$ 2.500,00" },
                      { name: "Adubo NPK", type: "Fertilizante", quantity: "100 sacos", price: "R$ 4.200,00" }
                    ].map((item, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        data-testid={`seed-item-${index}`}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary bg-opacity-20 rounded flex items-center justify-center mr-3">
                            <ShoppingCart className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-card-foreground text-sm" data-testid={`text-seed-name-${index}`}>
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground" data-testid={`text-seed-details-${index}`}>
                              {item.type} • {item.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary text-sm" data-testid={`text-seed-price-${index}`}>
                            {item.price}
                          </p>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs mt-1"
                            data-testid={`button-buy-seed-${index}`}
                          >
                            Comprar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
