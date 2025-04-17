
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Hash, Copy, Upload } from "lucide-react";

const Base64EncoderDecoder = () => {
  const { toast } = useToast();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  // Encode function
  const encodeToBase64 = () => {
    try {
      if (!inputText.trim()) {
        toast({
          title: "Error",
          description: "Please enter text to encode",
          variant: "destructive",
        });
        return;
      }
      
      const encoded = btoa(unescape(encodeURIComponent(inputText)));
      setOutputText(encoded);
      
      toast({
        title: "Success",
        description: "Text encoded to Base64",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to encode text to Base64",
        variant: "destructive",
      });
    }
  };

  // Decode function
  const decodeFromBase64 = () => {
    try {
      if (!inputText.trim()) {
        toast({
          title: "Error",
          description: "Please enter Base64 to decode",
          variant: "destructive",
        });
        return;
      }
      
      const decoded = decodeURIComponent(escape(atob(inputText)));
      setOutputText(decoded);
      
      toast({
        title: "Success",
        description: "Base64 decoded to text",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decode Base64. Invalid Base64 string.",
        variant: "destructive",
      });
    }
  };

  // Process the input based on current mode
  const processInput = () => {
    if (mode === "encode") {
      encodeToBase64();
    } else {
      decodeFromBase64();
    }
  };

  // Copy output to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    });
  };

  // Handle file upload for encoding or decoding
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    if (mode === "encode") {
      // Read file as text for encoding
      reader.onload = (event) => {
        if (event.target?.result) {
          setInputText(event.target.result as string);
        }
      };
      reader.readAsText(file);
    } else {
      // Read Base64 file for decoding
      reader.onload = (event) => {
        if (event.target?.result) {
          setInputText(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  // Handle mode change
  const handleModeChange = (value: string) => {
    setMode(value as "encode" | "decode");
    setInputText("");
    setOutputText("");
  };

  return (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encode">Encode</TabsTrigger>
          <TabsTrigger value="decode">Decode</TabsTrigger>
        </TabsList>
        
        <TabsContent value="encode" className="space-y-4 mt-4">
          <div>
            <Label htmlFor="encode-input">Text to Encode</Label>
            <Textarea
              id="encode-input"
              placeholder="Enter text to encode to Base64..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[150px] font-mono"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={processInput} className="flex-1">
              <Hash className="mr-2 h-4 w-4" /> Encode to Base64
            </Button>
            
            <Button variant="outline" className="flex-1" asChild>
              <label className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" /> Upload Text File
                <input 
                  type="file" 
                  accept=".txt,.json,.html,.js,.css"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="decode" className="space-y-4 mt-4">
          <div>
            <Label htmlFor="decode-input">Base64 to Decode</Label>
            <Textarea
              id="decode-input"
              placeholder="Enter Base64 to decode..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[150px] font-mono"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={processInput} className="flex-1">
              <Hash className="mr-2 h-4 w-4" /> Decode from Base64
            </Button>
            
            <Button variant="outline" className="flex-1" asChild>
              <label className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" /> Upload Base64 File
                <input 
                  type="file" 
                  accept=".txt,.b64"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="output">Result</Label>
          {outputText && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={copyToClipboard}
              className="h-8"
            >
              <Copy className="h-3.5 w-3.5 mr-1" /> Copy
            </Button>
          )}
        </div>
        <Textarea
          id="output"
          placeholder={mode === "encode" ? "Encoded Base64 will appear here..." : "Decoded text will appear here..."}
          value={outputText}
          readOnly
          className={`min-h-[150px] font-mono ${!outputText ? 'text-muted-foreground' : ''}`}
        />
      </div>
    </div>
  );
};

export default Base64EncoderDecoder;
