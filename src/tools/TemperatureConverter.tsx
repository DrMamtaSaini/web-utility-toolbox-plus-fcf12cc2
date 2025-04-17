
import { useState, useEffect } from "react";
import { ThermometerSnowflake, ThermometerSun, ArrowLeftRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TemperatureConverter = () => {
  const [inputValue, setInputValue] = useState<number>(0);
  const [fromUnit, setFromUnit] = useState<string>("celsius");
  const [toUnit, setToUnit] = useState<string>("fahrenheit");
  const [result, setResult] = useState<number>(32);
  
  const temperatureUnits = [
    { name: "Celsius (°C)", value: "celsius" },
    { name: "Fahrenheit (°F)", value: "fahrenheit" },
    { name: "Kelvin (K)", value: "kelvin" },
  ];

  // Temperature conversion calculations
  const convert = () => {
    if (fromUnit === toUnit) {
      setResult(inputValue);
      return;
    }
    
    let convertedValue: number;
    
    // First convert to Celsius as base unit
    let tempInCelsius: number;
    switch (fromUnit) {
      case "celsius":
        tempInCelsius = inputValue;
        break;
      case "fahrenheit":
        tempInCelsius = (inputValue - 32) * (5/9);
        break;
      case "kelvin":
        tempInCelsius = inputValue - 273.15;
        break;
      default:
        tempInCelsius = inputValue;
    }
    
    // Then convert from Celsius to target unit
    switch (toUnit) {
      case "celsius":
        convertedValue = tempInCelsius;
        break;
      case "fahrenheit":
        convertedValue = (tempInCelsius * (9/5)) + 32;
        break;
      case "kelvin":
        convertedValue = tempInCelsius + 273.15;
        break;
      default:
        convertedValue = tempInCelsius;
    }
    
    setResult(convertedValue);
  };

  // Get temperature icon based on value
  const getTemperatureIcon = (value: number, unit: string) => {
    let isCold: boolean;
    
    switch (unit) {
      case "celsius":
        isCold = value < 15;
        break;
      case "fahrenheit":
        isCold = value < 59;
        break;
      case "kelvin":
        isCold = value < 288.15;
        break;
      default:
        isCold = false;
    }
    
    return isCold ? 
      <ThermometerSnowflake className="h-5 w-5 text-blue-500" /> : 
      <ThermometerSun className="h-5 w-5 text-red-500" />;
  };

  // Swap units
  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  // Run conversion when inputs change
  useEffect(() => {
    convert();
  }, [inputValue, fromUnit, toUnit]);

  return (
    <div className="space-y-6">
      <div>
        <div className="grid gap-6 sm:grid-cols-[1fr,auto,1fr]">
          {/* From unit */}
          <div className="space-y-2">
            <Label htmlFor="from-temp" className="flex items-center gap-2">
              {getTemperatureIcon(inputValue, fromUnit)} From
            </Label>
            <Input
              id="from-temp"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
              step="any"
              className="mb-2"
            />
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {temperatureUnits.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Swap button */}
          <div className="flex items-center justify-center">
            <button 
              onClick={swapUnits}
              className="rounded-full p-2 hover:bg-muted transition-colors"
              aria-label="Swap units"
            >
              <ArrowLeftRight />
            </button>
          </div>
          
          {/* To unit */}
          <div className="space-y-2">
            <Label htmlFor="to-temp" className="flex items-center gap-2">
              {getTemperatureIcon(result, toUnit)} To
            </Label>
            <Input
              id="to-temp"
              type="number"
              value={result.toLocaleString('en-US', { 
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
                useGrouping: false 
              })}
              readOnly
              className="mb-2"
            />
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {temperatureUnits.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-2">Temperature Comparisons</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <div className="p-3 border rounded-md">
            <div className="font-medium">Water Freezing Point</div>
            <div className="text-muted-foreground">0°C = 32°F = 273.15K</div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="font-medium">Room Temperature</div>
            <div className="text-muted-foreground">20°C = 68°F = 293.15K</div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="font-medium">Water Boiling Point</div>
            <div className="text-muted-foreground">100°C = 212°F = 373.15K</div>
          </div>
        </div>
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Temperature Conversion Formulas</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Celsius to Fahrenheit: (°C × 9/5) + 32 = °F</li>
          <li>Fahrenheit to Celsius: (°F − 32) × 5/9 = °C</li>
          <li>Celsius to Kelvin: °C + 273.15 = K</li>
          <li>Kelvin to Celsius: K − 273.15 = °C</li>
        </ul>
      </div>
    </div>
  );
};

export default TemperatureConverter;
