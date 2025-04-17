
import { useState, useEffect } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LengthConverter = () => {
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>("meters");
  const [toUnit, setToUnit] = useState<string>("feet");
  const [result, setResult] = useState<number>(0);
  
  const lengthUnits = [
    { name: "Nanometers", value: "nanometers", conversionToM: 1e-9 },
    { name: "Microns", value: "microns", conversionToM: 1e-6 },
    { name: "Millimeters", value: "millimeters", conversionToM: 1e-3 },
    { name: "Centimeters", value: "centimeters", conversionToM: 1e-2 },
    { name: "Inches", value: "inches", conversionToM: 0.0254 },
    { name: "Feet", value: "feet", conversionToM: 0.3048 },
    { name: "Yards", value: "yards", conversionToM: 0.9144 },
    { name: "Meters", value: "meters", conversionToM: 1 },
    { name: "Kilometers", value: "kilometers", conversionToM: 1000 },
    { name: "Miles", value: "miles", conversionToM: 1609.34 },
    { name: "Nautical miles", value: "nautical-miles", conversionToM: 1852 },
  ];

  // Find a unit by its value
  const findUnit = (value: string) => {
    return lengthUnits.find(unit => unit.value === value);
  };

  // Convert between units
  const convert = () => {
    const fromUnitData = findUnit(fromUnit);
    const toUnitData = findUnit(toUnit);

    if (fromUnitData && toUnitData) {
      // Convert to meters first, then to target unit
      const valueInMeters = inputValue * fromUnitData.conversionToM;
      const convertedValue = valueInMeters / toUnitData.conversionToM;
      setResult(convertedValue);
    }
  };

  // Swap units
  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  // Run conversion when any inputs change
  useEffect(() => {
    convert();
  }, [inputValue, fromUnit, toUnit]);

  return (
    <div className="space-y-6">
      <div>
        <div className="grid gap-6 sm:grid-cols-[1fr,auto,1fr]">
          {/* From unit */}
          <div className="space-y-2">
            <Label htmlFor="from-value">From</Label>
            <Input
              id="from-value"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
              min="0"
              step="any"
              className="mb-2"
            />
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {lengthUnits.map((unit) => (
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
            <Label htmlFor="to-value">To</Label>
            <Input
              id="to-value"
              type="number"
              value={result.toLocaleString('en-US', { 
                maximumFractionDigits: 10,
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
                {lengthUnits.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Common Conversions</h3>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
          <div className="p-3 border rounded-md">
            <div className="font-medium">1 meter =</div>
            <div className="text-muted-foreground">3.28084 feet</div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="font-medium">1 kilometer =</div>
            <div className="text-muted-foreground">0.621371 miles</div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="font-medium">1 inch =</div>
            <div className="text-muted-foreground">2.54 centimeters</div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="font-medium">1 yard =</div>
            <div className="text-muted-foreground">0.9144 meters</div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="font-medium">1 mile =</div>
            <div className="text-muted-foreground">1.60934 kilometers</div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="font-medium">1 foot =</div>
            <div className="text-muted-foreground">30.48 centimeters</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LengthConverter;
