
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Upload, Lock, Unlock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from "sonner";

const ImageResizer = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resized, setResized] = useState<string | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [isResizing, setIsResizing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImage(file);
    setResized(null);
    
    // Create preview and get original dimensions
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = reader.result as string;
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value);
    setWidth(newWidth);
    
    if (lockAspectRatio && originalDimensions.width > 0) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value);
    setHeight(newHeight);
    
    if (lockAspectRatio && originalDimensions.height > 0) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const resizeImage = () => {
    if (!image || !preview) return;
    
    setIsResizing(true);
    
    // Create an image object
    const img = new Image();
    img.onload = () => {
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      // Draw image on canvas with the new dimensions
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get the resized image URL
        const resizedURL = canvas.toDataURL(image.type || 'image/png');
        setResized(resizedURL);
        setIsResizing(false);
        toast.success("Image resized successfully");
      }
    };
    img.src = preview;
  };

  const downloadImage = () => {
    if (!resized) return;
    
    const fileExtension = image?.name.split('.').pop() || 'png';
    const link = document.createElement('a');
    link.href = resized;
    link.download = `${image?.name.split('.')[0] || 'resized'}_${width}x${height}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Resized image downloaded successfully");
  };

  return (
    <div className="space-y-6">
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
                  <p className="font-medium">Upload your image</p>
                  <p className="text-sm text-muted-foreground">
                    Upload any image to resize
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
            
            {image && (
              <div className="text-sm text-muted-foreground">
                Original size: {originalDimensions.width} x {originalDimensions.height} pixels
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {preview && (
        <div className="space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="aspect-ratio">Lock aspect ratio</Label>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="aspect-ratio" 
                  checked={lockAspectRatio} 
                  onCheckedChange={setLockAspectRatio} 
                />
                {lockAspectRatio ? <Lock size={16} /> : <Unlock size={16} />}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width (px)</Label>
                <Input
                  id="width"
                  type="number"
                  min="1"
                  value={width}
                  onChange={handleWidthChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (px)</Label>
                <Input
                  id="height"
                  type="number"
                  min="1"
                  value={height}
                  onChange={handleHeightChange}
                />
              </div>
            </div>
          </div>
          
          <Button 
            onClick={resizeImage}
            disabled={isResizing}
            className="w-full"
          >
            {isResizing ? 'Resizing...' : 'Resize Image'}
          </Button>
          
          {resized && (
            <div className="space-y-6">
              <div className="rounded-md overflow-hidden border">
                <img 
                  src={resized} 
                  alt="Resized Image" 
                  className="w-full h-auto"
                />
              </div>
              
              <Button 
                onClick={downloadImage}
                className="w-full flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Download Resized Image
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageResizer;
