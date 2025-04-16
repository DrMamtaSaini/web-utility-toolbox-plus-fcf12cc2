
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

const PercentageCalculator = () => {
  // Basic percentage calculation
  const [value, setValue] = useState<string>('');
  const [percentage, setPercentage] = useState<string>('');
  const [percentageResult, setPercentageResult] = useState<string>('');
  
  // Percentage increase/decrease
  const [originalValue, setOriginalValue] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');
  const [changeResult, setChangeResult] = useState<string>('');
  const [changeType, setChangeType] = useState<string>('');
  
  // Percentage of total
  const [part, setPart] = useState<string>('');
  const [total, setTotal] = useState<string>('');
  const [partResult, setPartResult] = useState<string>('');

  const calculatePercentage = () => {
    if (!value || !percentage) {
      toast.error("Please enter both value and percentage");
      return;
    }
    
    const valueNum = parseFloat(value);
    const percentageNum = parseFloat(percentage);
    
    if (isNaN(valueNum) || isNaN(percentageNum)) {
      toast.error("Please enter valid numbers");
      return;
    }
    
    const result = (valueNum * percentageNum) / 100;
    setPercentageResult(result.toFixed(2));
    toast.success("Percentage calculated");
  };

  const calculateChange = () => {
    if (!originalValue || !newValue) {
      toast.error("Please enter both original and new values");
      return;
    }
    
    const originalNum = parseFloat(originalValue);
    const newNum = parseFloat(newValue);
    
    if (isNaN(originalNum) || isNaN(newNum)) {
      toast.error("Please enter valid numbers");
      return;
    }
    
    const difference = newNum - originalNum;
    const changePercentage = (difference / originalNum) * 100;
    
    setChangeResult(Math.abs(changePercentage).toFixed(2));
    setChangeType(changePercentage >= 0 ? 'increase' : 'decrease');
    toast.success("Percentage change calculated");
  };

  const calculatePartOfTotal = () => {
    if (!part || !total) {
      toast.error("Please enter both part and total values");
      return;
    }
    
    const partNum = parseFloat(part);
    const totalNum = parseFloat(total);
    
    if (isNaN(partNum) || isNaN(totalNum)) {
      toast.error("Please enter valid numbers");
      return;
    }
    
    if (totalNum === 0) {
      toast.error("Total cannot be zero");
      return;
    }
    
    const result = (partNum / totalNum) * 100;
    setPartResult(result.toFixed(2));
    toast.success("Percentage of total calculated");
  };

  const handleClear = () => {
    setValue('');
    setPercentage('');
    setPercentageResult('');
    setOriginalValue('');
    setNewValue('');
    setChangeResult('');
    setChangeType('');
    setPart('');
    setTotal('');
    setPartResult('');
    toast.info("All fields cleared");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList>
          <TabsTrigger value="basic">Basic Percentage</TabsTrigger>
          <TabsTrigger value="change">Increase/Decrease</TabsTrigger>
          <TabsTrigger value="total">Percentage of Total</TabsTrigger>
          <TabsTrigger value="tips">Tips & Formulas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="value">Value</Label>
                    <Input 
                      id="value"
                      type="number"
                      placeholder="Enter value"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="percentage">Percentage (%)</Label>
                    <Input 
                      id="percentage"
                      type="number"
                      placeholder="Enter percentage"
                      value={percentage}
                      onChange={(e) => setPercentage(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button onClick={calculatePercentage}>
                    Calculate
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    Clear All
                  </Button>
                </div>
                
                {percentageResult && (
                  <div className="mt-4 p-4 bg-muted rounded-md">
                    <h3 className="text-lg font-medium mb-2">Result:</h3>
                    <p><strong>{percentage}%</strong> of <strong>{value}</strong> is <strong className="text-primary">{percentageResult}</strong></p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="change" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="originalValue">Original Value</Label>
                    <Input 
                      id="originalValue"
                      type="number"
                      placeholder="Enter original value"
                      value={originalValue}
                      onChange={(e) => setOriginalValue(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newValue">New Value</Label>
                    <Input 
                      id="newValue"
                      type="number"
                      placeholder="Enter new value"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button onClick={calculateChange}>
                    Calculate Change
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    Clear All
                  </Button>
                </div>
                
                {changeResult && (
                  <div className="mt-4 p-4 bg-muted rounded-md">
                    <h3 className="text-lg font-medium mb-2">Result:</h3>
                    <p>
                      The change from <strong>{originalValue}</strong> to <strong>{newValue}</strong> is a <strong className={changeType === 'increase' ? 'text-green-600' : 'text-red-600'}>
                        {changeType} of {changeResult}%
                      </strong>
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="total" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="part">Part</Label>
                    <Input 
                      id="part"
                      type="number"
                      placeholder="Enter part value"
                      value={part}
                      onChange={(e) => setPart(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total">Total</Label>
                    <Input 
                      id="total"
                      type="number"
                      placeholder="Enter total value"
                      value={total}
                      onChange={(e) => setTotal(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button onClick={calculatePartOfTotal}>
                    Calculate Percentage
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    Clear All
                  </Button>
                </div>
                
                {partResult && (
                  <div className="mt-4 p-4 bg-muted rounded-md">
                    <h3 className="text-lg font-medium mb-2">Result:</h3>
                    <p><strong>{part}</strong> is <strong className="text-primary">{partResult}%</strong> of <strong>{total}</strong></p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tips" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Common Percentage Formulas</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Calculation</TableHead>
                        <TableHead>Formula</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Basic Percentage</TableCell>
                        <TableCell>(Value × Percentage) ÷ 100</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Percentage Increase</TableCell>
                        <TableCell>[(New Value - Original Value) ÷ Original Value] × 100</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Percentage of Total</TableCell>
                        <TableCell>(Part ÷ Total) × 100</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Tips for Percentage Calculations</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>To find X% of Y, multiply Y by X and divide by 100</li>
                    <li>To increase a number by X%, multiply it by (1 + X/100)</li>
                    <li>To decrease a number by X%, multiply it by (1 - X/100)</li>
                    <li>To find what percentage X is of Y, divide X by Y and multiply by 100</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PercentageCalculator;
