
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Copy, RefreshCw } from 'lucide-react';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState([12]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    calculateStrength();
  }, [password]);

  const generatePassword = () => {
    let charset = '';
    let newPassword = '';

    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_-+={}[]|:;"<>,.?/~`';

    if (!charset) {
      setPassword('Select at least one option');
      return;
    }

    for (let i = 0; i < length[0]; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }

    setPassword(newPassword);
  };

  const calculateStrength = () => {
    if (!password || password === 'Select at least one option') {
      setStrength(0);
      return;
    }

    let score = 0;
    
    // Length
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Complexity
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    // Normalize to 0-100
    setStrength(Math.min(Math.floor(score / 7 * 100), 100));
  };

  const getStrengthLabel = () => {
    if (strength < 25) return { label: 'Very Weak', color: 'bg-red-500' };
    if (strength < 50) return { label: 'Weak', color: 'bg-orange-500' };
    if (strength < 75) return { label: 'Good', color: 'bg-yellow-500' };
    return { label: 'Strong', color: 'bg-green-500' };
  };

  const copyToClipboard = () => {
    if (!password || password === 'Select at least one option') return;
    
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strengthInfo = getStrengthLabel();

  return (
    <div className="space-y-6">
      <div className="relative">
        <Input
          type="text"
          value={password}
          readOnly
          className="font-mono text-lg py-6"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={generatePassword} 
            title="Generate new password"
          >
            <RefreshCw size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={copyToClipboard} 
            title="Copy to clipboard"
            disabled={!password || password === 'Select at least one option'}
          >
            <Copy size={16} />
          </Button>
        </div>
      </div>

      {copied && (
        <div className="bg-primary-foreground text-primary text-sm py-1 px-3 rounded text-center">
          Password copied to clipboard!
        </div>
      )}

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Password Strength: {strengthInfo.label}</span>
          <span>{strength}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full ${strengthInfo.color} transition-all`}
            style={{ width: `${strength}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="length-slider">Length: {length[0]}</Label>
          </div>
          <Slider
            id="length-slider"
            min={4}
            max={32}
            step={1}
            value={length}
            onValueChange={(value) => {
              setLength(value);
              generatePassword();
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Include:</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="uppercase" className="cursor-pointer">Uppercase Letters (A-Z)</Label>
            <Switch 
              id="uppercase" 
              checked={includeUppercase} 
              onCheckedChange={(checked) => {
                setIncludeUppercase(checked);
                setTimeout(generatePassword, 0);
              }} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="lowercase" className="cursor-pointer">Lowercase Letters (a-z)</Label>
            <Switch 
              id="lowercase" 
              checked={includeLowercase} 
              onCheckedChange={(checked) => {
                setIncludeLowercase(checked);
                setTimeout(generatePassword, 0);
              }} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="numbers" className="cursor-pointer">Numbers (0-9)</Label>
            <Switch 
              id="numbers" 
              checked={includeNumbers} 
              onCheckedChange={(checked) => {
                setIncludeNumbers(checked);
                setTimeout(generatePassword, 0);
              }} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="symbols" className="cursor-pointer">Symbols (!@#$%...)</Label>
            <Switch 
              id="symbols" 
              checked={includeSymbols} 
              onCheckedChange={(checked) => {
                setIncludeSymbols(checked);
                setTimeout(generatePassword, 0);
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
