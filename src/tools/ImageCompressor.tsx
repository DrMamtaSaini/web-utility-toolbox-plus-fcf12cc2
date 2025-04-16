
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Upload } from 'lucide-react';
import { toast } from "sonner";

const ImageCompressor = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [compressed, setCompressed] = useState<string | null>(null);
  const [quality, setQuality] = useState([60]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImage(file);
    setCompressed(null);
    setOriginalSize(file.size);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = () => {
    if (!image || !preview) return;
    
    setIsCompressing(true);
    
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
        
        // Get image format from the original file
        const mimeType = image.type || 'image/jpeg';
        
        // Compress image by reducing quality
        const compressedURL = canvas.toDataURL(mimeType, quality[0] / 100);
        setCompressed(compressedURL);
        
        // Calculate compressed size
        const base64 = compressedURL.split(',')[1];
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        setCompressedSize(bytes.length);
        
        setIsCompressing(false);
        toast.success("Image compressed successfully");
      }
    };
    img.src = preview;
  };

  const downloadImage = () => {
    if (!compressed) return;
    
    const fileExtension = image?.type.split('/')[1] || 'jpg';
    const link = document.createElement('a');
    link.href = compressed;
    link.download = `${image?.name.split('.')[0] || 'compressed'}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Compressed image downloaded successfully");
  };

  // Format file size in KB or MB
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Calculate compression percentage
  const compressionPercentage = originalSize && compressedSize 
    ? Math.round((1 - compressedSize / originalSize) * 100) 
    : 0;

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
                    Upload any image to compress
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
                Original size: {formatFileSize(originalSize)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {preview && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="compression-slider">Compression quality: {quality}%</Label>
            <Slider
              id="compression-slider"
              min={10}
              max={100}
              step={1}
              defaultValue={[60]}
              value={quality}
              onValueChange={setQuality}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Lower quality = smaller file size but may reduce image quality
            </p>
          </div>
          
          <Button 
            onClick={compressImage}
            disabled={isCompressing}
            className="w-full"
          >
            {isCompressing ? 'Compressing...' : 'Compress Image'}
          </Button>
          
          {compressed && (
            <div className="space-y-6">
              <div className="rounded-md overflow-hidden border">
                <img 
                  src={compressed} 
                  alt="Compressed Image" 
                  className="w-full h-auto"
                />
              </div>
              
              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="font-medium">Compression results</p>
                <div className="flex justify-between text-sm mt-2">
                  <span>Original: {formatFileSize(originalSize)}</span>
                  <span>Compressed: {formatFileSize(compressedSize)}</span>
                </div>
                <div className="mt-2 font-medium text-green-600">
                  {compressionPercentage}% smaller
                </div>
              </div>
              
              <Button 
                onClick={downloadImage}
                className="w-full flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Download Compressed Image
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageCompressor;
