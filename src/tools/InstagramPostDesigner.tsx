
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { 
  Bold, Italic, AlignLeft, AlignCenter, AlignRight, 
  Download, Image as ImageIcon, Type, Palette, 
  ZoomIn, ZoomOut, RotateCcw, Trash
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const InstagramPostDesigner = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1080, height: 1080 });
  const [text, setText] = useState("Your Caption Here");
  const [fontSize, setFontSize] = useState(48);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textColor, setTextColor] = useState("#ffffff");
  const [textAlign, setTextAlign] = useState<CanvasTextAlign>("center");
  const [textY, setTextY] = useState(540);
  const [textBold, setTextBold] = useState(false);
  const [textItalic, setTextItalic] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#3b5998");
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedTemplate, setSelectedTemplate] = useState("blank");
  
  const templates = [
    { id: "blank", name: "Blank Canvas", color: "#ffffff" },
    { id: "gradient-blue", name: "Blue Gradient", color: "linear-gradient(to bottom right, #3b5998, #8b9dc3)" },
    { id: "gradient-pink", name: "Pink Gradient", color: "linear-gradient(to bottom right, #d53369, #daae51)" },
    { id: "dark", name: "Dark Theme", color: "#121212" },
    { id: "light", name: "Light Theme", color: "#f5f5f5" },
  ];

  useEffect(() => {
    drawCanvas();
  }, [text, fontSize, fontFamily, textColor, textAlign, textY, textBold, textItalic, backgroundColor, backgroundImage, zoom, imagePosition, selectedTemplate]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background color
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background image if available
    if (backgroundImage) {
      const imgWidth = backgroundImage.width * zoom;
      const imgHeight = backgroundImage.height * zoom;
      
      ctx.drawImage(
        backgroundImage,
        imagePosition.x - imgWidth / 2 + canvas.width / 2,
        imagePosition.y - imgHeight / 2 + canvas.height / 2,
        imgWidth,
        imgHeight
      );
    }

    // Draw text
    ctx.fillStyle = textColor;
    let fontStyle = "";
    if (textBold) fontStyle += "bold ";
    if (textItalic) fontStyle += "italic ";
    ctx.font = `${fontStyle}${fontSize}px ${fontFamily}`;
    ctx.textAlign = textAlign;
    
    // Text positioning based on alignment
    let x = canvas.width / 2;
    if (textAlign === "left") {
      x = 50;
    } else if (textAlign === "right") {
      x = canvas.width - 50;
    }
    
    // Wrap text
    const words = text.split(" ");
    let line = "";
    const lines = [];
    const maxWidth = canvas.width - 100;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        lines.push(line);
        line = words[i] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);
    
    // Draw each line
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    let yPos = textY - totalHeight / 2 + fontSize / 2;
    
    for (const line of lines) {
      ctx.fillText(line, x, yPos);
      yPos += lineHeight;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setBackgroundImage(img);
        setZoom(Math.min(canvasSize.width / img.width, canvasSize.height / img.height));
        setImagePosition({ x: 0, y: 0 });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!backgroundImage) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDragging(true);
    setDragStart({ 
      x: x - imagePosition.x, 
      y: y - imagePosition.y 
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging || !backgroundImage) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setImagePosition({
      x: x - dragStart.x,
      y: y - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const selectTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setBackgroundColor(template.color);
      
      if (templateId === "gradient-blue" || templateId === "gradient-pink") {
        // Handle gradients in a simplified way
        setBackgroundColor(templateId === "gradient-blue" ? "#3b5998" : "#d53369");
      } else if (templateId === "dark") {
        setTextColor("#ffffff");
      } else if (templateId === "light") {
        setTextColor("#000000");
      }
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "instagram-post.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Instagram post downloaded successfully");
  };

  // Fixed function: proper implementation of Image constructor
  const loadImageElement = () => {
    return new Image(0, 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Instagram Post Designer</h1>
        <p className="text-muted-foreground">
          Create stunning Instagram posts with custom text, backgrounds, and images.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className="max-w-full border shadow-sm"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ maxHeight: "600px", width: "auto" }}
            />
          </div>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="text">
            <TabsList className="w-full">
              <TabsTrigger value="templates" className="flex-1">
                <Palette className="h-4 w-4 mr-1" /> Templates
              </TabsTrigger>
              <TabsTrigger value="text" className="flex-1">
                <Type className="h-4 w-4 mr-1" /> Text
              </TabsTrigger>
              <TabsTrigger value="background" className="flex-1">
                <ImageIcon className="h-4 w-4 mr-1" /> Background
              </TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {templates.map(template => (
                  <Button 
                    key={template.id}
                    variant={selectedTemplate === template.id ? "default" : "outline"}
                    className="h-20 w-full"
                    style={{ backgroundColor: selectedTemplate === template.id ? undefined : template.color }}
                    onClick={() => selectTemplate(template.id)}
                  >
                    <span className={selectedTemplate === template.id ? "text-white" : "text-black"}>
                      {template.name}
                    </span>
                  </Button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text">Caption Text</Label>
                <Input
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-family">Font Family</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Verdana">Verdana</SelectItem>
                    <SelectItem value="Helvetica">Helvetica</SelectItem>
                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Courier New">Courier New</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Font Size: {fontSize}px</Label>
                <Slider
                  min={12}
                  max={120}
                  step={1}
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="text-color">Text Color</Label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 border rounded"
                    style={{ backgroundColor: textColor }}
                  />
                  <Input
                    type="color"
                    id="text-color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Text Alignment</Label>
                <div className="flex gap-2">
                  <Button 
                    variant={textAlign === "left" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setTextAlign("left")}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={textAlign === "center" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setTextAlign("center")}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={textAlign === "right" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setTextAlign("right")}
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Text Style</Label>
                <div className="flex gap-2">
                  <Button 
                    variant={textBold ? "default" : "outline"}
                    size="icon"
                    onClick={() => setTextBold(!textBold)}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={textItalic ? "default" : "outline"}
                    size="icon"
                    onClick={() => setTextItalic(!textItalic)}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Text Position: {textY}px</Label>
                <Slider
                  min={100}
                  max={canvasSize.height - 100}
                  step={1}
                  value={[textY]}
                  onValueChange={(value) => setTextY(value[0])}
                />
              </div>
            </TabsContent>

            <TabsContent value="background" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bg-color">Background Color</Label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 border rounded"
                    style={{ backgroundColor: backgroundColor }}
                  />
                  <Input
                    type="color"
                    id="bg-color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-full h-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Background Image</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" /> Upload Image
                  </Button>
                  {backgroundImage && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setBackgroundImage(null)}
                      className="w-full mt-2"
                    >
                      <Trash className="mr-2 h-4 w-4" /> Remove Image
                    </Button>
                  )}
                </div>
              </div>

              {backgroundImage && (
                <>
                  <div className="space-y-2">
                    <Label>Image Zoom: {Math.round(zoom * 100)}%</Label>
                    <div className="flex items-center gap-2">
                      <ZoomOut className="h-4 w-4 text-muted-foreground" />
                      <Slider
                        min={0.1}
                        max={2}
                        step={0.01}
                        value={[zoom]}
                        onValueChange={(value) => setZoom(value[0])}
                      />
                      <ZoomIn className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tip: Click and drag to position the image
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setImagePosition({ x: 0, y: 0 })}
                    className="w-full"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset Position
                  </Button>
                </>
              )}
            </TabsContent>
          </Tabs>

          <Button onClick={handleDownload} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Download Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstagramPostDesigner;
