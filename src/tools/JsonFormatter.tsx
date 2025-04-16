
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Copy, Loader2 } from 'lucide-react';

const JsonFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    if (!input.trim()) {
      setError('Please enter JSON data');
      return;
    }

    setProcessing(true);
    setError(null);

    setTimeout(() => {
      try {
        const parsed = JSON.parse(input);
        const formatted = JSON.stringify(parsed, null, 2);
        setOutput(formatted);
        setError(null);
      } catch (err) {
        setError('Invalid JSON. Please check your input.');
        setOutput('');
      } finally {
        setProcessing(false);
      }
    }, 300);
  };

  const minifyJson = () => {
    if (!input.trim()) {
      setError('Please enter JSON data');
      return;
    }

    setProcessing(true);
    setError(null);

    setTimeout(() => {
      try {
        const parsed = JSON.parse(input);
        const minified = JSON.stringify(parsed);
        setOutput(minified);
        setError(null);
      } catch (err) {
        setError('Invalid JSON. Please check your input.');
        setOutput('');
      } finally {
        setProcessing(false);
      }
    }, 300);
  };

  const copyToClipboard = () => {
    if (!output) return;
    
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const handleLoadSample = () => {
    setInput(`{
  "name": "John Doe",
  "age": 30,
  "email": "john.doe@example.com",
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "zipCode": "12345"
  },
  "phoneNumbers": [
    {
      "type": "home",
      "number": "555-1234"
    },
    {
      "type": "work",
      "number": "555-5678"
    }
  ]
}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="json-input" className="block text-sm font-medium">
              Enter JSON:
            </label>
            <div className="space-x-2">
              <Button 
                onClick={handleLoadSample} 
                variant="outline" 
                size="sm"
              >
                Load Sample
              </Button>
              <Button 
                onClick={handleClear} 
                variant="outline" 
                size="sm"
              >
                Clear
              </Button>
            </div>
          </div>
          <Textarea
            id="json-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="font-mono text-sm h-[400px]"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="json-output" className="block text-sm font-medium">
              Result:
            </label>
            {output && (
              <Button 
                onClick={copyToClipboard} 
                variant="outline" 
                size="sm"
                className="flex gap-1"
              >
                <Copy size={14} />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            )}
          </div>
          <Textarea
            id="json-output"
            value={output}
            readOnly
            placeholder="Formatted JSON will appear here..."
            className="font-mono text-sm h-[400px] bg-muted"
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4">
        <Button 
          onClick={formatJson}
          disabled={processing}
          className="flex-1"
        >
          {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Format JSON
        </Button>
        
        <Button 
          onClick={minifyJson}
          disabled={processing}
          variant="outline"
          className="flex-1"
        >
          {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Minify JSON
        </Button>
      </div>
    </div>
  );
};

export default JsonFormatter;
