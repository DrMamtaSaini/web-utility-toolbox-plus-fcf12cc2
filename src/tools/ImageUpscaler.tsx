
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, Download, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ImageUpscaler = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [upscaleFactor, setUpscaleFactor] = useState("2");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Check file size (limit to 5MB for demo)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size too large. Please select an image under 5MB.');
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
      const file = files[0];
      
      // Check file size
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size too large. Please select an image under 5MB.');
        return;
      }
      
      // Clean up previous URLs
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (processedImage) URL.revokeObjectURL(processedImage);
      
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
  
  const upscaleImage = () => {
    if (!selectedImage || !imagePreview) {
      toast.error("Please upload an image first");
      return;
    }
    
    setIsProcessing(true);
    
    // In a real implementation, we would call an AI upscaling API here
    // For this demo, we'll simulate processing with a timeout
    setTimeout(() => {
      // For demo purposes, we're just using the same image
      // In a real app, this would be an upscaled version from an API
      setProcessedImage(imagePreview);
      setIsProcessing(false);
      toast.success(`Image upscaled by ${upscaleFactor}x successfully!`);
    }, 2000);
  };
  
  const downloadImage = () => {
    if (!processedImage) return;
    
    const link = document.createElement("a");
    link.href = processedImage;
    const fileName = selectedImage?.name || "image";
    const fileNameWithoutExt = fileName.split('.').slice(0, -1).join('.');
    const extension = fileName.split('.').pop() || "png";
    link.download = `${fileNameWithoutExt}-upscaled-${upscaleFactor}x.${extension}`;
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
                <h3 className="text-lg font-medium mb-2">Upload an Image to Upscale</h3>
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
          
          {/* Upscaling Controls */}
          {imagePreview && (
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Upscaling Settings</h3>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Upscale Factor</Label>
                  <RadioGroup 
                    value={upscaleFactor} 
                    onValueChange={setUpscaleFactor} 
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="r1" />
                      <Label htmlFor="r1">2x</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4" id="r2" />
                      <Label htmlFor="r2">4x</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="8" id="r3" />
                      <Label htmlFor="r3">8x</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button 
                  onClick={upscaleImage} 
                  disabled={isProcessing || !selectedImage}
                  className="w-full sm:w-auto"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Upscale Image by ${upscaleFactor}x`
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
              <div className="bg-muted/30 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Upscaled Image ({upscaleFactor}x)</h3>
                  <Button onClick={downloadImage} variant="outline" size="sm">
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                </div>
                <div className="flex justify-center">
                  <img 
                    src={processedImage} 
                    alt="Upscaled" 
                    className="max-h-[400px] max-w-full object-contain rounded-md border"
                  />
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> This is a demo version showing a simulated result. In a production environment, 
                  the image would be processed by an AI upscaling algorithm resulting in higher resolution and enhanced details.
                </p>
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
      
      <div className="bg-muted/30 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-2">About Image Upscaling</h3>
        <p className="text-sm text-muted-foreground">
          This tool uses AI to enhance and upscale low-resolution images. Traditional resizing methods stretch pixels, causing blurry results. Our AI upscaler analyzes the image content and intelligently adds details to create a sharper, higher-resolution version without quality loss.
        </p>
      </div>
    </div>
  );
};

export default ImageUpscaler;
