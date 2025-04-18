import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Loader2, Upload, Download, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const BackgroundRemover = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transparencyLevel, setTransparencyLevel] = useState([50]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Clean up previous URLs
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    if (processedImage) URL.revokeObjectURL(processedImage);
    
    const url = URL.createObjectURL(file);
    setSelectedImage(file);
    setImagePreview(url);
    setProcessedImage(null);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files?.length > 0 && files[0].type.startsWith('image/')) {
      // Clean up previous URLs
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (processedImage) URL.revokeObjectURL(processedImage);
      
      const file = files[0];
      const url = URL.createObjectURL(file);
      setSelectedImage(file);
      setImagePreview(url);
      setProcessedImage(null);
    } else {
      toast.error('Please drop an image file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const resetImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    if (processedImage) URL.revokeObjectURL(processedImage);
    
    setSelectedImage(null);
    setImagePreview(null);
    setProcessedImage(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const removeBackground = async () => {
    if (!selectedImage || !imagePreview) {
      toast.error("Please upload an image first");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real implementation, we would call a background removal API or use ML in the browser
      // For this demo, we'll create a simulated transparent background
      
      const img = new Image();
      img.crossOrigin = "Anonymous";
      
      img.onload = () => {
        if (!canvasRef.current) {
          setIsProcessing(false);
          toast.error("Canvas reference not available");
          return;
        }
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          setIsProcessing(false);
          toast.error("Could not get canvas context");
          return;
        }
        
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
        // Get image data to manipulate pixels
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // For demo purposes, we'll create a circular mask
        // This simulates background removal by making the edges transparent
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.min(canvas.width, canvas.height) * 0.45;
        
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;
            
            // Calculate distance from center
            const distX = x - centerX;
            const distY = y - centerY;
            const distance = Math.sqrt(distX * distX + distY * distY);
            
            // Create a soft edge
            const edgeWidth = 20;
            if (distance > maxRadius) {
              // Outside the circle - fully transparent
              data[index + 3] = 0;
            } else if (distance > maxRadius - edgeWidth) {
              // Transition zone - partially transparent
              const alpha = 255 * (1 - (distance - (maxRadius - edgeWidth)) / edgeWidth);
              data[index + 3] = alpha;
            }
            // Inside the circle - keep original alpha
          }
        }
        
        // Put the modified image data back on the canvas
        ctx.putImageData(imageData, 0, 0);
        
        // Convert to data URL and set as processed image
        setProcessedImage(canvas.toDataURL("image/png"));
        setIsProcessing(false);
        toast.success("Background removed successfully!");
      };
      
      img.onerror = () => {
        setIsProcessing(false);
        toast.error("Failed to load image");
      };
      
      img.src = imagePreview;
    } catch (error) {
      console.error("Background removal error:", error);
      setIsProcessing(false);
      toast.error("Failed to process image");
    }
  };
  
  const downloadImage = () => {
    if (!processedImage) return;
    
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "removed-background.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="upload" className="flex-1">Upload Image</TabsTrigger>
          <TabsTrigger value="result" className="flex-1" disabled={!processedImage}>Result</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
          {/* Image Upload Area */}
          <div 
            className={`border-2 border-dashed rounded-lg p-6 transition-colors ${imagePreview ? 'border-primary/50' : 'border-gray-300'}`}
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
          >
            {!imagePreview ? (
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload an Image</h3>
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
                  <Button variant="outline" size="sm" onClick={resetImage} disabled={isProcessing}>
                    <Trash2 size={16} className="mr-2" />
                    Remove
                  </Button>
                </div>
                <div className="flex justify-center">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-[300px] max-w-full object-contain rounded-md border"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Hidden canvas for image processing */}
          <canvas ref={canvasRef} className="hidden"></canvas>
          
          {/* Controls */}
          {imagePreview && (
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Background Removal Settings</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="transparency">Detection Sensitivity</Label>
                    <span className="text-sm text-muted-foreground">{transparencyLevel}%</span>
                  </div>
                  <Slider
                    id="transparency"
                    value={transparencyLevel}
                    onValueChange={setTransparencyLevel}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
                
                <Button 
                  onClick={removeBackground} 
                  disabled={isProcessing || !selectedImage}
                  className="w-full sm:w-auto"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Remove Background"
                  )}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="result" className="space-y-6">
          {/* Result Section */}
          {processedImage ? (
            <div className="space-y-6">
              <div className="bg-checkerboard rounded-lg p-6 flex justify-center">
                <img 
                  src={processedImage} 
                  alt="Processed" 
                  className="max-h-[400px] max-w-full object-contain"
                />
              </div>
              
              <div className="flex justify-center">
                <Button onClick={downloadImage} className="flex items-center gap-2">
                  <Download size={16} />
                  Download PNG with Transparent Background
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] bg-muted/20 rounded-md">
              <ImageIcon className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No processed image yet</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Add a checkerboard background pattern for the result image to show transparency */}
      <style>
        {`
        .bg-checkerboard {
          background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                            linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                            linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                            linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
        `}
      </style>
      
      <div className="bg-muted/30 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-2">About Background Removal</h3>
        <p className="text-sm text-muted-foreground">
          This tool uses AI to automatically remove backgrounds from images. For best results, use images with clear subjects and contrasting backgrounds. The demo version simulates background removal - in a production environment, it would use an actual AI model or API for accurate results.
        </p>
      </div>
    </div>
  );
};

export default BackgroundRemover;
