
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileType2, Upload, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

const ImageToBase64 = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [base64String, setBase64String] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [format, setFormat] = useState<string>('data-url');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    setImage(file);
    
    // Create a preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Convert to base64
    const base64Reader = new FileReader();
    base64Reader.onload = () => {
      const result = base64Reader.result as string;
      if (format === 'data-url') {
        setBase64String(result);
      } else {
        // Extract just the base64 part without the data URL prefix
        const base64 = result.split(',')[1];
        setBase64String(base64);
      }
    };
    base64Reader.readAsDataURL(file);
  };

  const handleFormatChange = (newFormat: string) => {
    setFormat(newFormat);
    
    if (!preview) return;
    
    if (newFormat === 'data-url') {
      // If we have the raw base64, convert it back to data URL
      if (!base64String.startsWith('data:')) {
        const mime = image?.type || 'image/png';
        setBase64String(`data:${mime};base64,${base64String}`);
      }
    } else {
      // Extract just the base64 part
      if (base64String.startsWith('data:')) {
        const base64 = base64String.split(',')[1];
        setBase64String(base64);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(base64String)
      .then(() => toast.success('Copied to clipboard!'))
      .catch(() => toast.error('Failed to copy. Please try again.'));
  };

  const downloadAsText = () => {
    const element = document.createElement('a');
    const file = new Blob([base64String], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${image?.name || 'image'}-base64.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Base64 string downloaded successfully');
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
          <TabsTrigger value="result" className="flex-1" disabled={!base64String}>Result</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
          <div 
            className="border-2 border-dashed rounded-lg p-6 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <FileType2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setActiveTab('result')}
                >
                  View Result
                </Button>
              </div>
              <div className="flex justify-center border rounded-lg p-4">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-h-[300px] max-w-full object-contain" 
                />
              </div>
              <div className="flex justify-center">
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFormatChange('data-url')}
                    className={format === 'data-url' ? 'bg-primary/10' : ''}
                  >
                    Data URL
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFormatChange('base64')}
                    className={format === 'base64' ? 'bg-primary/10' : ''}
                  >
                    Base64 Only
                  </Button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="result" className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Base64 Output</h3>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy size={16} className="mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadAsText}>
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
              </div>
            </div>
            
            <Textarea
              value={base64String}
              readOnly
              rows={12}
              className="font-mono text-xs"
            />
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('upload')}
              >
                Back to Upload
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-muted/30 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-2">About Image to Base64</h3>
        <p className="text-sm text-muted-foreground">
          This tool converts your images to Base64 encoded strings, which can be used directly in HTML img tags, CSS backgrounds, or JSON data. 
          Choose between a complete data URL format or Base64-only output. All conversion happens in your browser - no data is sent to any server.
        </p>
      </div>
    </div>
  );
};

export default ImageToBase64;
