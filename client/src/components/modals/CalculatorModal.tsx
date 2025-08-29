import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, RotateCcw, Divide } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CalculatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CalculatorModal({ open, onOpenChange }: CalculatorModalProps) {
  const [display, setDisplay] = useState("0");
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  
  // Conversion states
  const [hectares, setHectares] = useState("");
  const [alqueires, setAlqueires] = useState("");
  const [productivity, setProductivity] = useState("");
  const [area, setArea] = useState("");
  const [fuelConsumption, setFuelConsumption] = useState("");
  const [workingHours, setWorkingHours] = useState("");

  const appendToDisplay = (value: string) => {
    if (shouldResetDisplay || display === "0") {
      setDisplay(value);
      setShouldResetDisplay(false);
    } else {
      setDisplay(prev => prev + value);
    }
  };

  const clearDisplay = () => {
    setDisplay("0");
    setShouldResetDisplay(false);
  };

  const deleteLastChar = () => {
    if (display.length > 1) {
      setDisplay(prev => prev.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const calculate = () => {
    try {
      const expression = display.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
      const result = eval(expression);
      setDisplay(result.toString());
      setShouldResetDisplay(true);
    } catch (error) {
      setDisplay("Erro");
      setShouldResetDisplay(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    const key = e.key;
    if (/[0-9]/.test(key)) {
      appendToDisplay(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
      appendToDisplay(key === '*' ? '×' : key === '/' ? '÷' : key === '-' ? '−' : key);
    } else if (key === 'Enter' || key === '=') {
      calculate();
    } else if (key === 'Escape') {
      clearDisplay();
    } else if (key === 'Backspace') {
      deleteLastChar();
    }
  };

  // Conversion functions
  const convertHectaresToAlqueires = () => {
    const ha = parseFloat(hectares);
    if (!isNaN(ha)) {
      setAlqueires((ha * 0.4132).toFixed(4));
    }
  };

  const convertAlqueiresToHectares = () => {
    const alq = parseFloat(alqueires);
    if (!isNaN(alq)) {
      setHectares((alq / 0.4132).toFixed(4));
    }
  };

  const calculateProductivity = () => {
    const prod = parseFloat(productivity);
    const areaVal = parseFloat(area);
    if (!isNaN(prod) && !isNaN(areaVal)) {
      const total = prod * areaVal;
      return `Produção total: ${total.toFixed(2)} sacas`;
    }
    return "";
  };

  const calculateFuelConsumption = () => {
    const consumption = parseFloat(fuelConsumption);
    const hours = parseFloat(workingHours);
    if (!isNaN(consumption) && !isNaN(hours)) {
      const total = consumption * hours;
      return `Consumo total: ${total.toFixed(2)} litros`;
    }
    return "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-sm" data-testid="calculator-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center" data-testid="calculator-title">
            <Calculator className="w-5 h-5 mr-2" />
            Calculadora Agrícola
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full" data-testid="calculator-tabs">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic" data-testid="tab-basic-calc">Básica</TabsTrigger>
            <TabsTrigger value="agro" data-testid="tab-agro-calc">Agrícola</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" data-testid="basic-calculator">
            {/* Calculator Display */}
            <div className="bg-muted p-4 rounded-lg mb-4">
              <Input
                value={display}
                readOnly
                className="text-right text-2xl font-mono bg-transparent border-none text-card-foreground"
                onKeyDown={handleKeyPress}
                autoFocus
                data-testid="calculator-display"
              />
            </div>
            
            {/* Calculator Buttons */}
            <div className="grid grid-cols-4 gap-2" data-testid="calculator-buttons">
              <Button 
                onClick={clearDisplay} 
                variant="destructive" 
                className="font-medium"
                data-testid="button-clear"
              >
                C
              </Button>
              <Button 
                onClick={() => appendToDisplay('÷')} 
                variant="outline"
                data-testid="button-divide"
              >
                ÷
              </Button>
              <Button 
                onClick={() => appendToDisplay('×')} 
                variant="outline"
                data-testid="button-multiply"
              >
                ×
              </Button>
              <Button 
                onClick={deleteLastChar} 
                variant="outline"
                data-testid="button-backspace"
              >
                ⌫
              </Button>
              
              {/* Number buttons */}
              {[7, 8, 9].map((num) => (
                <Button 
                  key={num}
                  onClick={() => appendToDisplay(num.toString())} 
                  variant="secondary"
                  data-testid={`button-${num}`}
                >
                  {num}
                </Button>
              ))}
              <Button 
                onClick={() => appendToDisplay('−')} 
                variant="outline"
                data-testid="button-subtract"
              >
                −
              </Button>
              
              {[4, 5, 6].map((num) => (
                <Button 
                  key={num}
                  onClick={() => appendToDisplay(num.toString())} 
                  variant="secondary"
                  data-testid={`button-${num}`}
                >
                  {num}
                </Button>
              ))}
              <Button 
                onClick={() => appendToDisplay('+')} 
                variant="outline"
                data-testid="button-add"
              >
                +
              </Button>
              
              {[1, 2, 3].map((num) => (
                <Button 
                  key={num}
                  onClick={() => appendToDisplay(num.toString())} 
                  variant="secondary"
                  data-testid={`button-${num}`}
                >
                  {num}
                </Button>
              ))}
              <Button 
                onClick={calculate} 
                className="row-span-2 bg-primary text-primary-foreground"
                data-testid="button-equals"
              >
                =
              </Button>
              
              <Button 
                onClick={() => appendToDisplay('0')} 
                variant="secondary" 
                className="col-span-2"
                data-testid="button-0"
              >
                0
              </Button>
              <Button 
                onClick={() => appendToDisplay('.')} 
                variant="secondary"
                data-testid="button-decimal"
              >
                .
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="agro" className="space-y-4" data-testid="agro-calculator">
            {/* Hectare/Alqueire Conversion */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-3" data-testid="conversion-title">
                  Conversão: Hectares ↔ Alqueires
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Hectares</Label>
                    <Input
                      value={hectares}
                      onChange={(e) => setHectares(e.target.value)}
                      onBlur={convertHectaresToAlqueires}
                      placeholder="120"
                      className="text-sm"
                      data-testid="input-hectares"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Alqueires</Label>
                    <Input
                      value={alqueires}
                      onChange={(e) => setAlqueires(e.target.value)}
                      onBlur={convertAlqueiresToHectares}
                      placeholder="49.58"
                      className="text-sm"
                      data-testid="input-alqueires"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  1 alqueire = 2.42 hectares
                </p>
              </CardContent>
            </Card>
            
            {/* Productivity Calculator */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-3" data-testid="productivity-title">
                  Produtividade por Hectare
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Sacas/ha</Label>
                    <Input
                      value={productivity}
                      onChange={(e) => setProductivity(e.target.value)}
                      placeholder="65"
                      className="text-sm"
                      data-testid="input-productivity"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Área (ha)</Label>
                    <Input
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="120"
                      className="text-sm"
                      data-testid="input-area"
                    />
                  </div>
                </div>
                <p className="text-xs text-primary mt-2 font-medium" data-testid="productivity-result">
                  {calculateProductivity()}
                </p>
              </CardContent>
            </Card>
            
            {/* Fuel Consumption */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-3" data-testid="fuel-title">
                  Consumo de Combustível
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">L/hora</Label>
                    <Input
                      value={fuelConsumption}
                      onChange={(e) => setFuelConsumption(e.target.value)}
                      placeholder="12"
                      className="text-sm"
                      data-testid="input-fuel-consumption"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Horas</Label>
                    <Input
                      value={workingHours}
                      onChange={(e) => setWorkingHours(e.target.value)}
                      placeholder="8"
                      className="text-sm"
                      data-testid="input-working-hours"
                    />
                  </div>
                </div>
                <p className="text-xs text-primary mt-2 font-medium" data-testid="fuel-result">
                  {calculateFuelConsumption()}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
