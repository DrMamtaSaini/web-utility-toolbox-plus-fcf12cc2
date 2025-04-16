
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Upload } from 'lucide-react';

const ImageToPng = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [converted, setConverted] = useState<string | null>(null);
  const [quality, setQuality] = useState([80]);
  const [isConverting, setIsConverting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImage(file);
    setConverted(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const convertToPng = () => {
    if (!image || !preview) return;
    
    setIsConverting(true);
    
    // Create an image object
    const img = new Image();
    img.onload = () => {
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image on canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        
        // Convert to PNG
        const pngURL = canvas.toDataURL('image/png', quality[0] / 100);
        setConverted(pngURL);
        setIsConverting(false);
      }
    };
    img.src = preview;
  };

  const downloadImage = () => {
    if (!converted) return;
    
    const link = document.createElement('a');
    link.href = converted;
    link.download = `${image?.name.split('.')[0] || 'converted'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                    JPG, JPEG, WebP, GIF, or BMP
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
                Selected file: {image.name} ({Math.round(image.size / 1024)} KB)
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {preview && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="quality-slider">Quality: {quality}%</Label>
            <Slider
              id="quality-slider"
              min={10}
              max={100}
              step={1}
              defaultValue={[80]}
              value={quality}
              onValueChange={setQuality}
              className="w-full"
            />
          </div>
          
          <Button 
            onClick={convertToPng}
            disabled={isConverting}
            className="w-full"
          >
            {isConverting ? 'Converting...' : 'Convert to PNG'}
          </Button>
          
          {converted && (
            <div className="space-y-6">
              <div className="rounded-md overflow-hidden border">
                <img 
                  src={converted} 
                  alt="Converted PNG" 
                  className="w-full h-auto"
                />
              </div>
              
              <Button 
                onClick={downloadImage}
                className="w-full flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Download PNG
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageToPng;
