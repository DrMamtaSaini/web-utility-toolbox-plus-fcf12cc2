
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileImage, Upload, Download } from 'lucide-react';
import { toast } from 'sonner';

const WebpToPng = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [converted, setConverted] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('upload');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is WebP or at least an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Allow WebP, but also allow other image formats for convenience
    if (!file.type.includes('webp')) {
      toast.info('This is not a WebP image, but we\'ll still convert it to PNG');
    }
    
    setImage(file);
    setConverted(null);
    
    // Create a preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const convertToWebP = () => {
    if (!image || !preview) return;
    
    setConverting(true);
    
    // Create an image element from the source
    const img = new Image();
    img.onload = () => {
      // Create canvas to draw the image
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the image on the canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        
        // Convert to PNG
        const pngUrl = canvas.toDataURL('image/png');
        setConverted(pngUrl);
        setConverting(false);
        setActiveTab('result');
        
        toast.success('Image converted to PNG successfully');
      }
    };
    
    img.onerror = () => {
      toast.error('Failed to process the image');
      setConverting(false);
    };
    
    img.src = preview;
  };

  const downloadImage = () => {
    if (!converted) return;
    
    // Generate a filename - replace webp with png if possible
    const fileName = image?.name 
      ? image.name.replace(/\.webp$|\.jpg$|\.jpeg$|\.gif$|\.bmp$/i, '.png')
      : 'converted.png';
      
    const link = document.createElement('a');
    link.href = converted;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('PNG image downloaded successfully');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const files = e.dataTransfer.files;
    if (files?.length > 0) {
      const file = files[0];
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please drop an image file');
        return;
      }
      
      const input = document.getElementById('image-upload') as HTMLInputElement;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        
        // Trigger change event manually
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="upload" className="flex-1">Upload</TabsTrigger>
          <TabsTrigger value="result" className="flex-1" disabled={!converted}>Result</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
          <div 
            className="border-2 border-dashed rounded-lg p-6 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <FileImage className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload a WebP Image</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Drag & drop a WebP image or any other image to convert to PNG
              </p>
              <div className="flex justify-center">
                <Label
                  htmlFor="image-upload"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90"
                >
                  <Upload size={16} />
                  Choose File
                </Label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          {preview && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Preview</h3>
              </div>
              <div className="flex justify-center border rounded-lg p-4">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-h-[300px] max-w-full object-contain" 
                />
              </div>
              <div className="mt-4 flex justify-center">
                <Button 
                  onClick={convertToWebP}
                  disabled={converting}
                  className="w-full max-w-xs"
                >
                  {converting ? 'Converting...' : 'Convert to PNG'}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="result" className="space-y-6">
          {converted && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">PNG Result</h3>
              </div>
              <div className="flex justify-center border rounded-lg p-4">
                <img 
                  src={converted} 
                  alt="Converted PNG" 
                  className="max-h-[300px] max-w-full object-contain" 
                />
              </div>
              <div className="mt-4 flex justify-center">
                <Button 
                  onClick={downloadImage}
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  Download PNG
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="bg-muted/30 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-2">About WebP to PNG Converter</h3>
        <p className="text-sm text-muted-foreground">
          This tool converts WebP images to PNG format for better compatibility with applications and browsers that don't support WebP. 
          PNG preserves transparency and maintains high image quality. All conversion happens in your browser - your images are never uploaded to any server.
        </p>
      </div>
    </div>
  );
};

export default WebpToPng;
