
import { useState } from "react";
import { QrCode, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const QrCodeGenerator = () => {
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [size, setSize] = useState(200);
  const [format, setFormat] = useState("png");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [errorLevel, setErrorLevel] = useState("L");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const generateQrCode = () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter text or URL to generate QR code",
        variant: "destructive",
      });
      return;
    }
    
    // Reset previous errors
    setError(null);
    setIsLoading(true);
    
    try {
      // Use QR Server API which is more reliable than Google Charts
      const qrServerUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=${size}x${size}&color=${color.substring(1)}&bgcolor=${bgColor.substring(1)}&qzone=1&format=${format.toLowerCase()}&ecc=${errorLevel.toLowerCase()}`;
      
      console.log("Generating QR code with URL:", qrServerUrl);
      
      // Create a new image to test if the URL is valid
      const img = new Image();
      
      img.onload = () => {
        setQrCode(qrServerUrl);
        setIsLoading(false);
        console.log("QR code generated successfully");
      };
      
      img.onerror = () => {
        console.error("Failed to load QR code image");
        setError("Failed to generate QR code. Please try again.");
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to generate QR code. Please try again.",
          variant: "destructive",
        });
      };
      
      img.src = qrServerUrl;
    } catch (error) {
      console.error("Error generating QR code:", error);
      setError("Failed to generate QR code. Please try again.");
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const downloadQrCode = () => {
    if (!qrCode) return;
    
    // Create an anchor element and trigger download
    const link = document.createElement("a");
    link.download = `qrcode.${format.toLowerCase()}`;
    link.href = qrCode;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Success",
      description: "QR code downloaded successfully",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="qr-text">Text or URL</Label>
            <Input 
              id="qr-text" 
              placeholder="Enter URL or text for QR code" 
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          
          <div>
            <Label>Size: {size}x{size}</Label>
            <Slider
              defaultValue={[size]}
              min={100}
              max={500}
              step={10}
              onValueChange={(value) => setSize(value[0])}
              className="my-2"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="qr-color">QR Color</Label>
              <Input 
                id="qr-color"
                type="color" 
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 p-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="qr-bg-color">Background</Label>
              <Input 
                id="qr-bg-color"
                type="color" 
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-10 p-1" 
              />
            </div>
          </div>
          
          <div>
            <Label>Error Correction Level</Label>
            <RadioGroup 
              defaultValue={errorLevel} 
              className="grid grid-cols-4 gap-4 mt-2"
              onValueChange={setErrorLevel}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="L" id="L" />
                <Label htmlFor="L">L (7%)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="M" id="M" />
                <Label htmlFor="M">M (15%)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Q" id="Q" />
                <Label htmlFor="Q">Q (25%)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="H" id="H" />
                <Label htmlFor="H">H (30%)</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="qr-format">Download Format</Label>
            <Select defaultValue={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpeg">JPEG</SelectItem>
                <SelectItem value="svg">SVG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button onClick={generateQrCode} disabled={isLoading} className="flex-1">
              {isLoading ? "Generating..." : "Generate QR Code"}
            </Button>
            <Button 
              onClick={downloadQrCode} 
              variant="outline" 
              disabled={!qrCode || isLoading}
              className="flex-1"
            >
              Download
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center border rounded-md p-6">
          {qrCode ? (
            <div className="flex flex-col items-center space-y-4">
              <div style={{ backgroundColor: bgColor }} className="p-4 rounded-md shadow">
                <img 
                  src={qrCode} 
                  alt="QR Code"
                  className="max-w-full h-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    setError("Failed to load QR code image.");
                    toast({
                      title: "Error",
                      description: "Failed to load QR code image.",
                      variant: "destructive",
                    });
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Scan with your mobile device
              </p>
            </div>
          ) : isLoading ? (
            <div className="w-full text-center space-y-4">
              <div className="relative pt-4">
                <Progress value={75} className="h-2 w-3/4 mx-auto" />
              </div>
              <p className="text-sm text-muted-foreground">
                Generating QR code...
              </p>
            </div>
          ) : error ? (
            <div className="text-center p-4 w-full">
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your parameters or using a different URL/text
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center text-muted-foreground space-y-2">
              <QrCode className="h-16 w-16 mb-2" strokeWidth={1} />
              <p className="text-lg font-medium">QR Code Preview</p>
              <p className="text-sm">Enter text or URL and click Generate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QrCodeGenerator;
