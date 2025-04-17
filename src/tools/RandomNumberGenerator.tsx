
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Lightbulb } from "lucide-react";

const RandomNumberGenerator = () => {
  const { toast } = useToast();
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [count, setCount] = useState<number>(1);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(true);
  const [includeDecimals, setIncludeDecimals] = useState<boolean>(false);
  const [numbers, setNumbers] = useState<number[]>([]);
  
  const generateNumbers = () => {
    if (min > max) {
      toast({
        title: "Error",
        description: "Minimum value cannot be greater than maximum value",
        variant: "destructive",
      });
      return;
    }
    
    if (count < 1) {
      toast({
        title: "Error",
        description: "Count must be at least 1",
        variant: "destructive",
      });
      return;
    }

    // For non-duplicates, check if the range is large enough
    const possibleNumbers = includeDecimals 
      ? Infinity 
      : Math.floor(max) - Math.ceil(min) + 1;
    
    if (!allowDuplicates && count > possibleNumbers) {
      toast({
        title: "Error",
        description: `Cannot generate ${count} unique numbers in the range ${min} to ${max}`,
        variant: "destructive",
      });
      return;
    }
    
    const result: number[] = [];
    const usedNumbers = new Set();
    
    for (let i = 0; i < count; i++) {
      let randomNumber: number;
      
      do {
        if (includeDecimals) {
          randomNumber = min + Math.random() * (max - min);
        } else {
          randomNumber = Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
        }
      } while (!allowDuplicates && usedNumbers.has(randomNumber));
      
      if (!allowDuplicates) {
        usedNumbers.add(randomNumber);
      }
      
      result.push(randomNumber);
    }
    
    setNumbers(result);
  };
  
  const copyToClipboard = () => {
    const text = numbers.join(', ');
    navigator.clipboard.writeText(text);
    
    toast({
      title: "Copied!",
      description: "Numbers copied to clipboard",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min-number">Minimum</Label>
              <Input
                id="min-number"
                type="number"
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="max-number">Maximum</Label>
              <Input
                id="max-number"
                type="number"
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="count-number">How many numbers?</Label>
            <Input
              id="count-number"
              type="number"
              min="1"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="allow-duplicates" 
                checked={allowDuplicates}
                onCheckedChange={(checked) => setAllowDuplicates(checked === true)}
              />
              <Label htmlFor="allow-duplicates">Allow duplicate numbers</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-decimals" 
                checked={includeDecimals}
                onCheckedChange={(checked) => setIncludeDecimals(checked === true)}
              />
              <Label htmlFor="include-decimals">Include decimal numbers</Label>
            </div>
          </div>
          
          <Button onClick={generateNumbers} className="w-full">
            Generate Random Numbers
          </Button>
        </div>
        
        <div>
          <Label>Results</Label>
          <div className="border min-h-[200px] rounded-md p-4 mt-2 relative">
            {numbers.length > 0 ? (
              <div className="space-y-4">
                <div className="max-h-[200px] overflow-y-auto">
                  <p className="whitespace-pre-wrap">
                    {numbers.map((num, index) => (
                      includeDecimals ? 
                        `${num.toFixed(2)}${index < numbers.length - 1 ? ', ' : ''}` :
                        `${num}${index < numbers.length - 1 ? ', ' : ''}`
                    ))}
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={copyToClipboard}
                  className="w-full"
                >
                  Copy to Clipboard
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Lightbulb className="h-16 w-16 mb-2" strokeWidth={1} />
                <p>Generate random numbers to see results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomNumberGenerator;
