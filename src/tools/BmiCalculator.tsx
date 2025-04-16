
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface BMICategory {
  name: string;
  range: string;
  color: string;
  description: string;
}

const BMI_CATEGORIES: BMICategory[] = [
  { 
    name: 'Underweight', 
    range: 'Less than 18.5', 
    color: 'bg-blue-500',
    description: 'You may need to gain some weight. Consult with a healthcare professional.'
  },
  { 
    name: 'Normal weight', 
    range: '18.5 to 24.9', 
    color: 'bg-green-500',
    description: 'You have a healthy weight. Maintain a balanced diet and regular exercise.'
  },
  { 
    name: 'Overweight', 
    range: '25 to 29.9', 
    color: 'bg-yellow-500',
    description: 'Consider losing some weight for health benefits. Focus on healthy eating and exercise.'
  },
  { 
    name: 'Obesity', 
    range: '30 or higher', 
    color: 'bg-red-500',
    description: 'Talk to your healthcare provider about ways to reduce health risks.'
  }
];

const BmiCalculator = () => {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<BMICategory | null>(null);
  const [progressValue, setProgressValue] = useState<number>(0);

  const calculateBMI = () => {
    if (!height || !weight) {
      toast.error("Please enter both height and weight");
      return;
    }
    
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    
    if (isNaN(weightNum) || isNaN(heightNum)) {
      toast.error("Please enter valid numbers");
      return;
    }
    
    if (weightNum <= 0 || heightNum <= 0) {
      toast.error("Height and weight must be greater than zero");
      return;
    }
    
    let bmiValue: number;
    
    if (unit === 'metric') {
      // Metric: weight (kg) / height² (m)
      bmiValue = weightNum / Math.pow(heightNum / 100, 2);
    } else {
      // Imperial: (weight (lbs) * 703) / height² (inches)
      bmiValue = (weightNum * 703) / Math.pow(heightNum, 2);
    }
    
    // Round to one decimal place
    bmiValue = parseFloat(bmiValue.toFixed(1));
    
    // Calculate progress value (0-100) for the progress bar
    // Map BMI from 10-40 to 0-100
    const progressVal = Math.min(Math.max(((bmiValue - 10) * 100) / 30, 0), 100);
    setProgressValue(progressVal);
    
    // Determine BMI category
    let bmiCategory: BMICategory | null = null;
    
    if (bmiValue < 18.5) {
      bmiCategory = BMI_CATEGORIES[0]; // Underweight
    } else if (bmiValue < 25) {
      bmiCategory = BMI_CATEGORIES[1]; // Normal weight
    } else if (bmiValue < 30) {
      bmiCategory = BMI_CATEGORIES[2]; // Overweight
    } else {
      bmiCategory = BMI_CATEGORIES[3]; // Obesity
    }
    
    setBmi(bmiValue);
    setCategory(bmiCategory);
    toast.success("BMI calculated successfully");
  };

  const handleClear = () => {
    setHeight('');
    setWeight('');
    setBmi(null);
    setCategory(null);
    setProgressValue(0);
    toast.info("All fields cleared");
  };

  const getHeightPlaceholder = () => {
    return unit === 'metric' ? 'Height (cm)' : 'Height (inches)';
  };

  const getWeightPlaceholder = () => {
    return unit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)';
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="about">About BMI</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="unit-system">Unit System</Label>
                  <RadioGroup
                    id="unit-system"
                    value={unit}
                    onValueChange={(value) => setUnit(value as 'metric' | 'imperial')}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="metric" id="metric" />
                      <Label htmlFor="metric">Metric (cm/kg)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="imperial" id="imperial" />
                      <Label htmlFor="imperial">Imperial (in/lbs)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Input 
                      id="height"
                      type="number"
                      placeholder={getHeightPlaceholder()}
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Input 
                      id="weight"
                      type="number"
                      placeholder={getWeightPlaceholder()}
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button onClick={calculateBMI}>
                    Calculate BMI
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    Clear All
                  </Button>
                </div>
                
                {bmi !== null && category && (
                  <div className="mt-6 space-y-4">
                    <div className="text-center">
                      <h3 className="text-xl font-medium mb-1">Your BMI: <strong>{bmi}</strong></h3>
                      <p className="text-muted-foreground">Category: <span className="font-medium">{category.name}</span></p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>10</span>
                        <span>20</span>
                        <span>30</span>
                        <span>40+</span>
                      </div>
                      <Progress value={progressValue} className="h-2" />
                      <div className="flex justify-between text-xs">
                        <span className="text-blue-500">Underweight</span>
                        <span className="text-green-500">Normal</span>
                        <span className="text-yellow-500">Overweight</span>
                        <span className="text-red-500">Obese</span>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-md border border-muted">
                      <h4 className="font-medium mb-1">{category.name} (BMI: {category.range})</h4>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">What is BMI?</h3>
                  <p className="text-muted-foreground">
                    Body Mass Index (BMI) is a measure of body fat based on height and weight that applies to adult men and women. It is a simple calculation using a person's height and weight. The formula is BMI = kg/m² where kg is a person's weight in kilograms and m² is their height in meters squared.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">BMI Categories</h3>
                  <ul className="space-y-3">
                    {BMI_CATEGORIES.map((cat, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${cat.color}`}></div>
                        <div>
                          <strong>{cat.name}</strong>: {cat.range}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Limitations of BMI</h3>
                  <p className="text-muted-foreground">
                    BMI is an estimate of body fat and a good gauge of your risk for diseases that can occur with more body fat. However, BMI doesn't directly measure body fat, and it doesn't account for factors like:
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-muted-foreground">
                    <li>Muscle mass</li>
                    <li>Bone density</li>
                    <li>Age and gender</li>
                    <li>Racial and ethnic differences</li>
                  </ul>
                  <p className="mt-2 text-muted-foreground">
                    Athletes might have a high BMI because of increased muscle mass rather than body fat. It's important to discuss your BMI and your overall health status with your healthcare provider.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BmiCalculator;
