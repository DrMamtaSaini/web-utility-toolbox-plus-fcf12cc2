
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Upload, Download, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

// Predefined meme templates
const memeTemplates = [
  { id: "drake", name: "Drake Hotline Bling" },
  { id: "distracted", name: "Distracted Boyfriend" },
  { id: "button", name: "Two Buttons" },
  { id: "change", name: "Change My Mind" },
  { id: "custom", name: "Custom Upload" },
];

// Demo image URLs - in a real app, these would be hosted images
const templateImages: Record<string, string> = {
  drake: "https://imgflip.com/s/meme/Drake-Hotline-Bling.jpg",
  distracted: "https://imgflip.com/s/meme/Distracted-Boyfriend.jpg",
  button: "https://imgflip.com/s/meme/Two-Buttons.jpg",
  change: "https://imgflip.com/s/meme/Change-My-Mind.jpg",
};

const MemeGenerator = () => {
  // State for template selection
  const [selectedTemplate, setSelectedTemplate] = useState("drake");
  const [customImage, setCustomImage] = useState<string | null>(null);
  
  // State for text inputs
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState([32]);
  const [textStrokeWidth, setTextStrokeWidth] = useState([2]);
  
  // State for generated meme
  const [generatedMeme, setGeneratedMeme] = useState<string | null>(null);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Set default active tab
  const [activeTab, setActiveTab] = useState("create");
  
  // Effect to switch to result tab when meme is generated
  useEffect(() => {
    if (generatedMeme) {
      setActiveTab("result");
    }
  }, [generatedMeme]);
  
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    // Clear custom image if a predefined template is selected
    if (templateId !== "custom") {
      setCustomImage(null);
    }
    
    // Clear generated meme when changing templates
    setGeneratedMeme(null);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    
    // Clean up previous URL
    if (customImage) URL.revokeObjectURL(customImage);
    
    const url = URL.createObjectURL(file);
    setCustomImage(url);
    setSelectedTemplate("custom");
    setGeneratedMeme(null);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files?.length > 0 && files[0].type.startsWith("image/")) {
      if (fileInputRef.current) {
        fileInputRef.current.files = files;
        handleFileChange({ target: { files } } as any);
      }
    } else {
      toast.error("Please drop an image file");
    }
  };
  
  const generateMeme = () => {
    if (!canvasRef.current) {
      toast.error("Canvas not available");
      return;
    }
    
    // Create a new image element to load the template
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Enable CORS for the image
    
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        toast.error("Canvas context not available");
        return;
      }
      
      // Set canvas dimensions to match image dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the base image on the canvas
      ctx.drawImage(img, 0, 0);
      
      // Configure text styling
      ctx.textAlign = "center";
      ctx.fillStyle = textColor;
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = textStrokeWidth[0];
      ctx.font = `bold ${fontSize[0]}px Impact, sans-serif`;
      
      // Draw top text
      if (topText) {
        // Position top text near the top of the image
        const topY = canvas.height * 0.15;
        drawTextWithStroke(ctx, topText, canvas.width / 2, topY);
      }
      
      // Draw bottom text
      if (bottomText) {
        // Position bottom text near the bottom of the image
        const bottomY = canvas.height * 0.85;
        drawTextWithStroke(ctx, bottomText, canvas.width / 2, bottomY);
      }
      
      // Convert canvas to image URL
      const memeUrl = canvas.toDataURL("image/png");
      setGeneratedMeme(memeUrl);
      toast.success("Meme generated successfully!");
    };
    
    img.onerror = () => {
      toast.error("Failed to load image");
    };
    
    // Set the image source
    img.src = selectedTemplate === "custom" && customImage 
      ? customImage 
      : templateImages[selectedTemplate];
  };
  
  // Function to draw text with stroke (outline)
  const drawTextWithStroke = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number
  ) => {
    // Split long text into multiple lines
    const maxLineWidth = ctx.canvas.width * 0.8;
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxLineWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    
    if (currentLine !== '') {
      lines.push(currentLine);
    }
    
    // Draw each line
    lines.forEach((line, i) => {
      const lineY = y + (i * fontSize[0]);
      
      // Draw text stroke (outline)
      ctx.strokeText(line, x, lineY);
      
      // Draw text fill
      ctx.fillText(line, x, lineY);
    });
  };
  
  const downloadMeme = () => {
    if (!generatedMeme) {
      toast.error("No meme has been generated");
      return;
    }
    
    try {
      const link = document.createElement("a");
      link.href = generatedMeme;
      link.download = `meme-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Meme downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download meme");
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="create" className="flex-1">Create Meme</TabsTrigger>
          <TabsTrigger value="result" className="flex-1" disabled={!generatedMeme}>Result</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="space-y-6">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="template">Select Template</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a meme template" />
                  </SelectTrigger>
                  <SelectContent>
                    {memeTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedTemplate === "custom" && (
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 transition-colors ${customImage ? 'border-primary/50' : 'border-gray-300'}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {!customImage ? (
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Upload Custom Image</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Drag & drop an image or click to browse
                      </p>
                      <div className="flex justify-center">
                        <Label
                          htmlFor="custom-upload"
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90"
                        >
                          <Upload size={16} />
                          Choose File
                        </Label>
                        <Input
                          id="custom-upload"
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <img 
                        ref={imageRef}
                        src={customImage} 
                        alt="Custom template" 
                        className="max-h-[300px] max-w-full object-contain"
                      />
                    </div>
                  )}
                </div>
              )}
              
              {selectedTemplate !== "custom" && (
                <div className="flex justify-center">
                  <img 
                    ref={imageRef}
                    src={templateImages[selectedTemplate]} 
                    alt="Meme template" 
                    className="max-h-[300px] max-w-full object-contain"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="topText">Top Text</Label>
                <Input
                  id="topText"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="Add top text"
                  className="uppercase"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bottomText">Bottom Text</Label>
                <Input
                  id="bottomText"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="Add bottom text"
                  className="uppercase"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="textColor"
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <span className="flex items-center text-sm text-muted-foreground">
                    {textColor}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <span className="text-sm text-muted-foreground">{fontSize[0]}px</span>
                </div>
                <Slider
                  id="fontSize"
                  value={fontSize}
                  onValueChange={setFontSize}
                  min={16}
                  max={80}
                  step={1}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="textStrokeWidth">Text Outline Width</Label>
                  <span className="text-sm text-muted-foreground">{textStrokeWidth[0]}px</span>
                </div>
                <Slider
                  id="textStrokeWidth"
                  value={textStrokeWidth}
                  onValueChange={setTextStrokeWidth}
                  min={0}
                  max={5}
                  step={0.5}
                />
              </div>
              
              <Button 
                onClick={generateMeme} 
                className="w-full"
                disabled={
                  (selectedTemplate === "custom" && !customImage) || 
                  (!topText && !bottomText)
                }
              >
                Generate Meme
              </Button>
            </div>
          </Card>
          
          {/* Hidden canvas for meme generation */}
          <canvas ref={canvasRef} className="hidden"></canvas>
        </TabsContent>
        
        <TabsContent value="result" className="space-y-6">
          {generatedMeme ? (
            <div className="space-y-6">
              <div className="flex justify-center border rounded-lg p-6">
                <img 
                  src={generatedMeme} 
                  alt="Generated Meme" 
                  className="max-h-[400px] max-w-full object-contain"
                />
              </div>
              
              <div className="flex justify-center">
                <Button onClick={downloadMeme} className="flex items-center gap-2">
                  <Download size={16} />
                  Download Meme
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p>No meme has been generated yet. Go to 'Create Meme' to make one.</p>
              <Button 
                className="mt-4" 
                variant="outline" 
                onClick={() => setActiveTab("create")}
              >
                Create a Meme
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="bg-muted/30 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-2">About Meme Generator</h3>
        <p className="text-sm text-muted-foreground">
          Create custom memes using our templates or upload your own image. Add text with customizable size, color, and outline. All processing happens directly in your browser - we don't store any of your images or memes on our servers.
        </p>
      </div>
    </div>
  );
};

export default MemeGenerator;
