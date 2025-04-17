
import { useState } from "react";
import { Hash, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CryptoJS from "crypto-js";

const Md5HashGenerator = () => {
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [hash, setHash] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate MD5 hash from string
  const generateMd5FromText = () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to generate MD5 hash",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      // Use CryptoJS instead of SubtleCrypto
      const hashHex = CryptoJS.MD5(text).toString();
      setHash(hashHex);
      setIsProcessing(false);
    } catch (error) {
      console.error("Error generating MD5 hash:", error);
      setError("Failed to generate MD5 hash. Please try again.");
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "Failed to generate MD5 hash",
        variant: "destructive",
      });
    }
  };

  // Generate MD5 hash from file
  const generateMd5FromFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setFileName(file.name);
    
    try {
      // Read file as array buffer
      const fileReader = new FileReader();
      
      fileReader.onload = (event) => {
        if (event.target && event.target.result) {
          // Use CryptoJS to generate hash from file content
          const wordArray = CryptoJS.lib.WordArray.create(event.target.result as ArrayBuffer);
          const hashHex = CryptoJS.MD5(wordArray).toString();
          
          setHash(hashHex);
          setIsProcessing(false);
          
          // Also get file content for display (if it's a text file)
          if (file.type.includes('text') && file.size < 1000000) { // Only for text files less than 1MB
            const textReader = new FileReader();
            textReader.onload = (e) => {
              if (e.target?.result) {
                setFileContent(e.target.result as string);
              }
            };
            textReader.readAsText(file);
          } else {
            setFileContent(null);
          }
        }
      };
      
      fileReader.onerror = () => {
        setError("Failed to read the file. Please try again.");
        setIsProcessing(false);
        toast({
          title: "Error",
          description: "Failed to read the file",
          variant: "destructive",
        });
      };
      
      fileReader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error generating MD5 hash from file:", error);
      setError("Failed to generate MD5 hash from file. Please try again.");
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "Failed to generate MD5 hash from file",
        variant: "destructive",
      });
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      generateMd5FromFile(file);
    }
  };

  // Copy hash to clipboard
  const copyToClipboard = () => {
    if (hash) {
      navigator.clipboard.writeText(hash);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "MD5 hash copied to clipboard",
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="file">File</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="space-y-4">
          <div>
            <Label htmlFor="input-text">Text to hash</Label>
            <Textarea
              id="input-text"
              placeholder="Enter text to generate MD5 hash"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <Button 
            onClick={generateMd5FromText} 
            disabled={isProcessing || !text.trim()}
            className="w-full"
          >
            {isProcessing ? "Processing..." : "Generate MD5 Hash"}
          </Button>
        </TabsContent>
        
        <TabsContent value="file" className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="file">Upload file</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground">
              The file will be processed locally and not uploaded to any server
            </p>
          </div>
          
          {fileName && (
            <Alert>
              <AlertDescription>
                File: {fileName}
              </AlertDescription>
            </Alert>
          )}
          
          {fileContent && (
            <div className="mt-4">
              <Label>File Preview (first 1000 characters)</Label>
              <div className="p-4 rounded-md bg-muted overflow-auto max-h-[200px] text-sm font-mono">
                {fileContent.substring(0, 1000)}
                {fileContent.length > 1000 && '...'}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {hash && (
        <div className="mt-6 space-y-4">
          <div>
            <Label>MD5 Hash Result</Label>
            <div className="flex mt-1">
              <div className="flex-1 bg-muted p-3 font-mono text-sm rounded-l-md overflow-x-auto">
                {hash}
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-l-none"
                onClick={copyToClipboard}
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2 flex items-center">
              <Hash className="h-4 w-4 mr-2" />
              About MD5 Hashes
            </h3>
            <p className="text-sm text-muted-foreground">
              MD5 (Message Digest Algorithm 5) is a widely used cryptographic hash function producing a 128-bit (16-byte) hash value. 
              While MD5 is no longer considered secure for cryptographic purposes, 
              it is still commonly used for file integrity verification and non-security applications.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Md5HashGenerator;
