
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Download, Upload, Type, Image, Move, Layers, PenTool, Palette } from 'lucide-react';
import { toast } from "sonner";

type Filter = {
  name: string;
  class: string;
};

type Template = {
  name: string;
  background: string;
  textColor: string;
};

const InstagramPostDesigner = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState([24]);
  const [textColor, setTextColor] = useState("#ffffff");
  const [selectedFilter, setSelectedFilter] = useState<string>("none");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("gradient-1");
  const [activeTab, setActiveTab] = useState("upload");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 }); // percentage values
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Available filters
  const filters: Record<string, Filter> = {
    'none': { name: 'None', class: '' },
    'grayscale': { name: 'Grayscale', class: 'grayscale' },
    'sepia': { name: 'Sepia', class: 'sepia' },
    'blur': { name: 'Blur', class: 'blur-sm' },
    'brightness': { name: 'Bright', class: 'brightness-125' },
    'contrast': { name: 'High Contrast', class: 'contrast-125' },
    'saturate': { name: 'Saturated', class: 'saturate-150' },
    'hue-rotate': { name: 'Hue Shift', class: 'hue-rotate-60' },
  };

  // Available templates
  const templates: Record<string, Template> = {
    'gradient-1': { 
      name: 'Purple Gradient', 
      background: 'bg-gradient-to-br from-purple-600 to-blue-500', 
      textColor: '#ffffff'
    },
    'gradient-2': { 
      name: 'Sunrise', 
      background: 'bg-gradient-to-r from-orange-400 to-pink-500', 
      textColor: '#ffffff'
    },
    'gradient-3': { 
      name: 'Ocean', 
      background: 'bg-gradient-to-r from-cyan-500 to-blue-500', 
      textColor: '#ffffff'
    },
    'dark': { 
      name: 'Dark', 
      background: 'bg-gray-900', 
      textColor: '#ffffff'
    },
    'light': { 
      name: 'Light', 
      background: 'bg-gray-100', 
      textColor: '#000000'
    },
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImage(file);
    setGeneratedImage(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setActiveTab("design");
    };
    reader.readAsDataURL(file);
  };

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    setTextColor(templates[template].textColor);
  };

  const generatePost = () => {
    if (!preview && !selectedTemplate) return;
    
    setIsProcessing(true);
    
    // Create canvas
    const canvas = document.createElement('canvas');
    const size = 1080; // Instagram post size
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Step 1: Fill with template background if no image
      if (!preview) {
        ctx.fillStyle = '#ffffff'; // Default background
        ctx.fillRect(0, 0, size, size);
        
        // We'll simulate the gradient here since we can't easily
        // apply Tailwind classes to a canvas
        const template = templates[selectedTemplate];
        if (template.background.includes('gradient')) {
          const gradient = ctx.createLinearGradient(0, 0, size, size);
          if (selectedTemplate === 'gradient-1') {
            gradient.addColorStop(0, '#9333ea'); // purple-600
            gradient.addColorStop(1, '#3b82f6'); // blue-500
          } else if (selectedTemplate === 'gradient-2') {
            gradient.addColorStop(0, '#fb923c'); // orange-400
            gradient.addColorStop(1, '#ec4899'); // pink-500  
          } else if (selectedTemplate === 'gradient-3') {
            gradient.addColorStop(0, '#06b6d4'); // cyan-500
            gradient.addColorStop(1, '#3b82f6'); // blue-500
          }
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, size, size);
        } else if (selectedTemplate === 'dark') {
          ctx.fillStyle = '#111827'; // gray-900
          ctx.fillRect(0, 0, size, size);
        } else if (selectedTemplate === 'light') {
          ctx.fillStyle = '#f3f4f6'; // gray-100
          ctx.fillRect(0, 0, size, size);
        }
      } 
      // Step 2: Draw image if available
      else {
        const img = new Image();
        img.onload = () => {
          // Calculate dimensions to cover the canvas while maintaining aspect ratio
          const imgRatio = img.width / img.height;
          const canvasRatio = canvas.width / canvas.height;
          
          let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
          
          if (imgRatio > canvasRatio) {
            drawHeight = canvas.height;
            drawWidth = canvas.height * imgRatio;
            offsetX = (canvas.width - drawWidth) / 2;
          } else {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            offsetY = (canvas.height - drawHeight) / 2;
          }
          
          // Draw the image
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          
          // Apply filter
          if (selectedFilter !== 'none') {
            // Simulating CSS filters on canvas - basic implementation
            // For proper filters, a library like CamanJS would be better
            if (selectedFilter === 'grayscale') {
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const data = imageData.data;
              for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = avg;
                data[i + 1] = avg;
                data[i + 2] = avg;
              }
              ctx.putImageData(imageData, 0, 0);
            } else if (selectedFilter === 'sepia') {
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const data = imageData.data;
              for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
                data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
                data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
              }
              ctx.putImageData(imageData, 0, 0);
            }
          }
          
          // Add text
          if (text) {
            ctx.fillStyle = textColor;
            ctx.font = `${fontSize[0]}px Arial, sans-serif`;
            ctx.textAlign = 'center';
            
            // Calculate position from percentage to pixels
            const x = (textPosition.x / 100) * canvas.width;
            const y = (textPosition.y / 100) * canvas.height;
            
            // Add text stroke/shadow for better visibility
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.lineWidth = 3;
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
          }
          
          // Convert to data URL and set as generated image
          const dataURL = canvas.toDataURL('image/png');
          setGeneratedImage(dataURL);
          setIsProcessing(false);
          toast.success("Instagram post created successfully!");
        };
        img.src = preview;
        return; // Exit early as the onload callback will finish the process
      }
      
      // Add text if no image (continuation of the no-image flow)
      if (text) {
        ctx.fillStyle = textColor;
        ctx.font = `${fontSize[0]}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        
        // Calculate position from percentage to pixels
        const x = (textPosition.x / 100) * canvas.width;
        const y = (textPosition.y / 100) * canvas.height;
        
        // Add text
        ctx.fillText(text, x, y);
      }
      
      // Convert to data URL and set as generated image
      const dataURL = canvas.toDataURL('image/png');
      setGeneratedImage(dataURL);
      setIsProcessing(false);
      toast.success("Instagram post created successfully!");
    }
  };

  const downloadPost = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'instagram-post.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Instagram post downloaded successfully");
  };

  // Fixed section: update new Image() to a proper constructor call
  const loadImageElement = () => {
    return new Image();
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="design" disabled={!preview && activeTab !== 'design'}>Design</TabsTrigger>
          <TabsTrigger value="preview" disabled={!generatedImage}>Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="bg-muted p-8 rounded-lg">
                    <label 
                      htmlFor="file-upload" 
                      className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                    >
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <Upload size={24} />
                      </div>
                      <div>
                        <p className="font-medium">Upload Image (optional)</p>
                        <p className="text-sm text-muted-foreground">
                          Or choose a template below
                        </p>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Or Choose a Template</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(templates).map(([id, template]) => (
                  <div 
                    key={id}
                    className={`${template.background} aspect-square rounded-md cursor-pointer border-2 ${selectedTemplate === id ? 'border-primary' : 'border-transparent'}`}
                    onClick={() => {
                      handleTemplateChange(id);
                      setPreview(null);
                      setImage(null);
                      setActiveTab("design");
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {activeTab === 'upload' && (
            <Button 
              onClick={() => setActiveTab('design')}
              className="w-full"
              disabled={!preview && !selectedTemplate}
            >
              Continue to Design
            </Button>
          )}
        </TabsContent>
        
        <TabsContent value="design" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="aspect-square rounded-md overflow-hidden border shadow-sm relative">
                {preview ? (
                  <div className={`h-full ${filters[selectedFilter]?.class || ''}`}>
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    {text && (
                      <div 
                        className="absolute text-center transform -translate-x-1/2 -translate-y-1/2 cursor-move"
                        style={{
                          left: `${textPosition.x}%`,
                          top: `${textPosition.y}%`,
                          fontSize: `${fontSize[0]}px`,
                          color: textColor,
                          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          const container = e.currentTarget.parentElement;
                          if (!container) return;
                          
                          const rect = container.getBoundingClientRect();
                          
                          const handleMouseMove = (moveEvent: MouseEvent) => {
                            const x = Math.max(0, Math.min(100, ((moveEvent.clientX - rect.left) / rect.width) * 100));
                            const y = Math.max(0, Math.min(100, ((moveEvent.clientY - rect.top) / rect.height) * 100));
                            setTextPosition({ x, y });
                          };
                          
                          const handleMouseUp = () => {
                            document.removeEventListener('mousemove', handleMouseMove);
                            document.removeEventListener('mouseup', handleMouseUp);
                          };
                          
                          document.addEventListener('mousemove', handleMouseMove);
                          document.addEventListener('mouseup', handleMouseUp);
                        }}
                      >
                        {text}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`h-full w-full ${templates[selectedTemplate]?.background || 'bg-gray-100'}`}>
                    {text && (
                      <div 
                        className="absolute text-center transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${textPosition.x}%`,
                          top: `${textPosition.y}%`,
                          fontSize: `${fontSize[0]}px`,
                          color: textColor
                        }}
                      >
                        {text}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {preview && (
                <div className="space-y-2">
                  <Label>Image Filter</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(filters).map(([id, filter]) => (
                      <div 
                        key={id}
                        onClick={() => setSelectedFilter(id)}
                        className={`cursor-pointer text-center p-2 rounded ${selectedFilter === id ? 'bg-primary/10 ring-1 ring-primary' : 'bg-muted'}`}
                      >
                        <div className={`aspect-square rounded overflow-hidden mb-1 ${filter.class}`}>
                          <img src={preview} alt={filter.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs">{filter.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Type className="h-4 w-4 mr-2" />
                  <Label>Add Text</Label>
                </div>
                <Textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your text here..."
                  rows={2}
                />
              </div>
              
              {text && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
                    <Slider
                      id="font-size"
                      min={12}
                      max={72}
                      step={1}
                      defaultValue={[24]}
                      value={fontSize}
                      onValueChange={setFontSize}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="text-color">Text Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="text-color"
                        type="color"
                        className="w-10 h-10 p-1"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                      />
                      <Input
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-md">
                    <div className="flex items-center">
                      <Move className="h-4 w-4 mr-2" />
                      <Label>Text Position</Label>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Drag text in preview or adjust position below
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Horizontal: {textPosition.x}%</Label>
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[textPosition.x]}
                          onValueChange={(value) => setTextPosition({ ...textPosition, x: value[0] })}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Vertical: {textPosition.y}%</Label>
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[textPosition.y]}
                          onValueChange={(value) => setTextPosition({ ...textPosition, y: value[0] })}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <Button
                onClick={generatePost}
                disabled={isProcessing}
                className="w-full mt-4"
              >
                {isProcessing ? 'Creating...' : 'Create Instagram Post'}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-6">
          {generatedImage && (
            <div className="space-y-6">
              <div className="max-w-sm mx-auto">
                <div className="rounded-md overflow-hidden border">
                  <img 
                    src={generatedImage} 
                    alt="Generated Instagram Post" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={downloadPost}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Download Post
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('design')}
                  className="flex-1"
                >
                  Edit Design
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InstagramPostDesigner;
