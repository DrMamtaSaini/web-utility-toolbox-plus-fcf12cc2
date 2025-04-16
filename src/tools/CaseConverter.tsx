
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { toast } from 'sonner';

type CaseType = 'lowercase' | 'uppercase' | 'titlecase' | 'sentencecase' | 'alternatingcase' | 'camelcase' | 'pascalcase' | 'snakecase' | 'kebabcase';

const CaseConverter = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedCase, setSelectedCase] = useState<CaseType>('titlecase');
  const [copied, setCopied] = useState(false);

  const convertCase = () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to convert");
      return;
    }

    let result = '';
    
    switch (selectedCase) {
      case 'lowercase':
        result = inputText.toLowerCase();
        break;
      case 'uppercase':
        result = inputText.toUpperCase();
        break;
      case 'titlecase':
        result = inputText
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        break;
      case 'sentencecase':
        result = inputText.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        break;
      case 'alternatingcase':
        result = inputText
          .split('')
          .map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase())
          .join('');
        break;
      case 'camelcase':
        result = inputText
          .toLowerCase()
          .trim()
          .split(/\s+/)
          .map((word, i) => i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
          .join('');
        break;
      case 'pascalcase':
        result = inputText
          .toLowerCase()
          .trim()
          .split(/\s+/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join('');
        break;
      case 'snakecase':
        result = inputText
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '_');
        break;
      case 'kebabcase':
        result = inputText
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-');
        break;
      default:
        result = inputText;
    }
    
    setOutputText(result);
    toast.success(`Text converted to ${selectedCase}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Text copied to clipboard");
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    toast.info("All fields cleared");
  };

  const handleSampleText = () => {
    setInputText("The Quick Brown Fox Jumps Over The Lazy Dog. this is a sample text to demonstrate case conversion functionality.");
    toast.info("Sample text loaded");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input-text">Enter your text</Label>
              <Textarea 
                id="input-text"
                placeholder="Type or paste your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Select Case Type</Label>
              <div className="space-y-2">
                <ToggleGroup type="single" value={selectedCase} onValueChange={(value) => value && setSelectedCase(value as CaseType)} className="flex flex-wrap justify-start gap-2">
                  <ToggleGroupItem value="lowercase" className="flex-grow md:flex-grow-0">lowercase</ToggleGroupItem>
                  <ToggleGroupItem value="uppercase" className="flex-grow md:flex-grow-0">UPPERCASE</ToggleGroupItem>
                  <ToggleGroupItem value="titlecase" className="flex-grow md:flex-grow-0">Title Case</ToggleGroupItem>
                  <ToggleGroupItem value="sentencecase" className="flex-grow md:flex-grow-0">Sentence case</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div className="space-y-2">
                <ToggleGroup type="single" value={selectedCase} onValueChange={(value) => value && setSelectedCase(value as CaseType)} className="flex flex-wrap justify-start gap-2">
                  <ToggleGroupItem value="camelcase" className="flex-grow md:flex-grow-0">camelCase</ToggleGroupItem>
                  <ToggleGroupItem value="pascalcase" className="flex-grow md:flex-grow-0">PascalCase</ToggleGroupItem>
                  <ToggleGroupItem value="snakecase" className="flex-grow md:flex-grow-0">snake_case</ToggleGroupItem>
                  <ToggleGroupItem value="kebabcase" className="flex-grow md:flex-grow-0">kebab-case</ToggleGroupItem>
                  <ToggleGroupItem value="alternatingcase" className="flex-grow md:flex-grow-0">aLtErNaTiNg</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={convertCase}
                disabled={!inputText.trim()}
              >
                Convert Text
              </Button>
              
              <Button variant="outline" onClick={handleSampleText}>
                <RefreshCw size={16} className="mr-2" />
                Load Sample
              </Button>
              
              <Button variant="outline" onClick={handleClear}>
                Clear All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {outputText && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="output-text">Converted Text</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check size={14} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy Text
                    </>
                  )}
                </Button>
              </div>
              
              <Textarea 
                id="output-text"
                readOnly
                value={outputText}
                className="min-h-[150px]"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CaseConverter;
