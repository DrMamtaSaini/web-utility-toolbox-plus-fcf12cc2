
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

// Define meme templates
const memeTemplates = [
  { id: "custom", name: "Upload Your Own" },
  { id: "drake", name: "Drake Hotline Bling" },
  { id: "distracted", name: "Distracted Boyfriend" },
  { id: "buttons", name: "Two Buttons" },
  { id: "change-my-mind", name: "Change My Mind" },
  { id: "doge", name: "Doge" },
  { id: "expanding-brain", name: "Expanding Brain" },
  { id: "surprised-pikachu", name: "Surprised Pikachu" },
];

const MemeGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("custom");
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState([36]);
  const [fontColor, setFontColor] = useState("#ffffff");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState([2]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Generate meme when inputs change
  useEffect(() => {
    if (imagePreview) {
      generateMeme();
    }
  }, [imagePreview, topText, bottomText, fontSize, fontColor, strokeColor, strokeWidth]);
  
  // Load template or custom image
  useEffect(() => {
    if (selectedTemplate === "custom") {
      // If switching to custom but no image uploaded yet, reset preview
      if (!customImage) {
        setImagePreview(null);
      }
    } else {
      // Load template image
      const templateImage = `/meme-templates/${selectedTemplate}.jpg`;
      setImagePreview(templateImage);
    }
  }, [selectedTemplate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Clean up previous URL if exists
    if (imagePreview && selectedTemplate === "custom") {
      URL.revokeObjectURL(imagePreview);
    }
    
    const url = URL.createObjectURL(file);
    setCustomImage(file);
    setImagePreview(url);
    setSelectedTemplate("custom");
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files?.length > 0 && files[0].type.startsWith('image/')) {
      // Clean up previous URL if exists
      if (imagePreview && selectedTemplate === "custom") {
        URL.revokeObjectURL(imagePreview);
      }
      
      const file = files[0];
      const url = URL.createObjectURL(file);
      setCustomImage(file);
      setImagePreview(url);
      setSelectedTemplate("custom");
    } else {
      toast.error('Please drop an image file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const resetImage = () => {
    if (imagePreview && selectedTemplate === "custom") {
      URL.revokeObjectURL(imagePreview);
    }
    
    setCustomImage(null);
    setImagePreview(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const generateMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imagePreview) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.crossOrigin = "anonymous";  // Handle CORS for external images
    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image
      ctx.drawImage(img, 0, 0);
      
      // Configure text style
      ctx.textAlign = 'center';
      ctx.font = `bold ${fontSize[0]}px Impact, sans-serif`;
      
      // Draw text with stroke
      if (topText) {
        drawTextWithStroke(ctx, topText, canvas.width / 2, fontSize[0] * 1.2, fontColor, strokeColor, strokeWidth[0]);
      }
      
      if (bottomText) {
        drawTextWithStroke(ctx, bottomText, canvas.width / 2, canvas.height - fontSize[0] * 0.8, fontColor, strokeColor, strokeWidth[0]);
      }
    };
    
    img.src = imagePreview;
  };
  
  // Helper function to draw text with stroke
  const drawTextWithStroke = (
    ctx: CanvasRenderingContext2D, 
    text: string, 
    x: number, 
    y: number, 
    fillColor: string, 
    strokeColor: string, 
    strokeWidth: number
  ) => {
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineJoin = 'round';
    
    // Draw stroke
    ctx.strokeText(text, x, y);
    
    // Draw fill
    ctx.fillText(text, x, y);
  };
  
  const downloadMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Convert canvas to data URL
    const dataURL = canvas.toDataURL('image/png');
    
    // Create download link
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Meme downloaded successfully!');
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="create">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="create" className="flex-1">Create Meme</TabsTrigger>
          <TabsTrigger value="preview" className="flex-1" disabled={!imagePreview}>Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="space-y-6">
          {/* Template Selection */}
          <div className="bg-muted/30 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Choose a Template</h3>
            
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
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
          
          {/* Custom Image Upload (shown only when "Upload Your Own" is selected) */}
          {selectedTemplate === "custom" && (
            <div 
              className={`border-2 border-dashed rounded-lg p-6 transition-colors ${customImage ? 'border-primary/50' : 'border-gray-300'}`}
              onDrop={handleFileDrop}
              onDragOver={handleDragOver}
            >
              {!customImage ? (
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload Your Own Image</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Drag & drop an image or click to browse
                  </p>
                  <div className="flex justify-center">
                    <Label
                      htmlFor="image-upload"
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90"
                    >
                      <Upload size={16} />
                      Choose File
                    </Label>
                    <Input
                      id="image-upload"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Image Preview</h3>
                    <Button variant="outline" size="sm" onClick={resetImage}>
                      <Trash2 size={16} className="mr-2" />
                      Remove
                    </Button>
                  </div>
                  <div className="flex justify-center">
                    <img 
                      src={imagePreview!} 
                      alt="Preview" 
                      className="max-h-[300px] max-w-full object-contain rounded-md border"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Meme Text */}
          {(imagePreview || selectedTemplate !== "custom") && (
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Add Text</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="top-text">Top Text</Label>
                  <Input
                    id="top-text"
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                    placeholder="TOP TEXT"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bottom-text">Bottom Text</Label>
                  <Input
                    id="bottom-text"
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value)}
                    placeholder="BOTTOM TEXT"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Text Style Options */}
          {(imagePreview || selectedTemplate !== "custom") && (
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Text Style</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Font Size</Label>
                    <span className="text-sm text-muted-foreground">{fontSize}px</span>
                  </div>
                  <Slider
                    value={fontSize}
                    onValueChange={setFontSize}
                    min={16}
                    max={72}
                    step={1}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="font-color">Text Color</Label>
                    <div className="flex">
                      <Input
                        id="font-color"
                        type="color"
                        value={fontColor}
                        onChange={(e) => setFontColor(e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input 
                        type="text"
                        value={fontColor}
                        onChange={(e) => setFontColor(e.target.value)}
                        className="ml-2 flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stroke-color">Stroke Color</Label>
                    <div className="flex">
                      <Input
                        id="stroke-color"
                        type="color"
                        value={strokeColor}
                        onChange={(e) => setStrokeColor(e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input 
                        type="text"
                        value={strokeColor}
                        onChange={(e) => setStrokeColor(e.target.value)}
                        className="ml-2 flex-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Stroke Width</Label>
                    <span className="text-sm text-muted-foreground">{strokeWidth}px</span>
                  </div>
                  <Slider
                    value={strokeWidth}
                    onValueChange={setStrokeWidth}
                    min={0}
                    max={10}
                    step={0.5}
                  />
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-6">
          {/* Meme Preview */}
          {imagePreview ? (
            <div className="bg-muted/30 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Meme Preview</h3>
                <Button onClick={downloadMeme} variant="outline" size="sm">
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="flex justify-center">
                <div className="relative inline-block">
                  <canvas 
                    ref={canvasRef} 
                    className="max-w-full rounded-md border"
                    style={{ maxHeight: "500px" }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] bg-muted/20 rounded-md">
              <ImageIcon className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Select a template or upload an image first</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="bg-muted/30 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-2">About Meme Generator</h3>
        <p className="text-sm text-muted-foreground">
          Create custom memes by selecting from popular templates or uploading your own images. Add top and bottom text with customizable font styles, then download your creation to share with friends.
        </p>
      </div>
    </div>
  );
};

export default MemeGenerator;
