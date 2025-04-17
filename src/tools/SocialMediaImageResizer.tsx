
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Upload, ArrowRight } from 'lucide-react';
import { toast } from "sonner";

type PlatformPreset = {
  name: string;
  width: number;
  height: number;
  description: string;
};

const SocialMediaImageResizer = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resized, setResized] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>('instagram-post');
  const [isResizing, setIsResizing] = useState(false);
  const [customWidth, setCustomWidth] = useState(1080);
  const [customHeight, setCustomHeight] = useState(1080);
  
  // Platform presets
  const platformPresets: Record<string, PlatformPreset> = {
    'instagram-post': {
      name: 'Instagram Post',
      width: 1080,
      height: 1080,
      description: 'Square post for Instagram feed (1:1)'
    },
    'instagram-story': {
      name: 'Instagram Story',
      width: 1080,
      height: 1920,
      description: 'Vertical format for Instagram stories (9:16)'
    },
    'facebook-post': {
      name: 'Facebook Post',
      width: 1200,
      height: 630,
      description: 'Rectangular post for Facebook timeline'
    },
    'twitter-post': {
      name: 'Twitter Post',
      width: 1200,
      height: 675,
      description: 'Optimal image size for Twitter feed (16:9)'
    },
    'linkedin-post': {
      name: 'LinkedIn Post',
      width: 1200,
      height: 627,
      description: 'Standard size for LinkedIn feed posts'
    },
    'pinterest-pin': {
      name: 'Pinterest Pin',
      width: 1000,
      height: 1500,
      description: 'Vertical format for Pinterest pins (2:3)'
    },
    'youtube-thumbnail': {
      name: 'YouTube Thumbnail',
      width: 1280,
      height: 720,
      description: 'Standard thumbnail for YouTube videos (16:9)'
    },
    'tiktok-video': {
      name: 'TikTok Video',
      width: 1080,
      height: 1920,
      description: 'Vertical format for TikTok videos (9:16)'
    },
    'custom': {
      name: 'Custom Size',
      width: 1080,
      height: 1080,
      description: 'Define your own dimensions'
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImage(file);
    setResized(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setPreview(reader.result as string);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handlePresetChange = (value: string) => {
    setSelectedPreset(value);
    if (value !== 'custom') {
      setCustomWidth(platformPresets[value].width);
      setCustomHeight(platformPresets[value].height);
    }
  };

  const resizeImage = () => {
    if (!image || !preview) return;
    
    setIsResizing(true);
    
    const width = customWidth;
    const height = customHeight;
    
    // Create an image object
    const img = new Image();
    img.onload = () => {
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      // Draw image on canvas with the new dimensions
      // Center and crop the image to fit the dimensions while maintaining aspect ratio
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Background color (white)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        
        // Calculate scaling and positioning to maintain aspect ratio and center the image
        const imgRatio = img.width / img.height;
        const targetRatio = width / height;
        
        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
        
        if (imgRatio > targetRatio) {
          // Image is wider than target, scale by height
          drawHeight = height;
          drawWidth = img.width * (height / img.height);
          offsetX = (width - drawWidth) / 2;
        } else {
          // Image is taller than target, scale by width
          drawWidth = width;
          drawHeight = img.height * (width / img.width);
          offsetY = (height - drawHeight) / 2;
        }
        
        // Draw the image centered on the canvas
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        
        // Get the resized image URL
        const resizedURL = canvas.toDataURL(image.type || 'image/png');
        setResized(resizedURL);
        setIsResizing(false);
        toast.success("Image resized for social media");
      }
    };
    img.src = preview;
  };

  const downloadImage = () => {
    if (!resized) return;
    
    const preset = platformPresets[selectedPreset];
    const link = document.createElement('a');
    link.href = resized;
    link.download = `${image?.name.split('.')[0] || 'resized'}_${preset.name.toLowerCase().replace(' ', '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Image for ${preset.name} downloaded successfully`);
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
                    Upload an image to resize for social media platforms
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

      {preview && (
        <div className="space-y-6">
          <div>
            <Label htmlFor="platform-select">Select Platform & Format</Label>
            <Select value={selectedPreset} onValueChange={handlePresetChange}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(platformPresets).map(([key, preset]) => (
                  <SelectItem key={key} value={key}>
                    {preset.name} ({preset.width} x {preset.height})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              {platformPresets[selectedPreset].description}
            </p>
          </div>
          
          {selectedPreset === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width (px)</Label>
                <Input
                  id="width"
                  type="number"
                  min="1"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (px)</Label>
                <Input
                  id="height"
                  type="number"
                  min="1"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
          )}
          
          <Button 
            onClick={resizeImage}
            disabled={isResizing}
            className="w-full"
          >
            {isResizing ? 'Resizing...' : 'Resize for Social Media'}
          </Button>
          
          {resized && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Original Image</p>
                  <div className="rounded-md overflow-hidden border">
                    <img 
                      src={preview} 
                      alt="Original" 
                      className="w-full h-auto"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Optimized for {platformPresets[selectedPreset].name}</p>
                    <div className="text-xs text-muted-foreground">
                      {customWidth} x {customHeight}
                    </div>
                  </div>
                  <div className="rounded-md overflow-hidden border relative">
                    <img 
                      src={resized} 
                      alt="Resized" 
                      className="w-full h-auto"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/30 transition-opacity">
                      <Button 
                        variant="secondary"
                        size="sm"
                        onClick={downloadImage}
                        className="flex items-center gap-2"
                      >
                        <Download size={14} />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
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

export default SocialMediaImageResizer;
