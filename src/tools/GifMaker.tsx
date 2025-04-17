
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Film, Upload, X, Play, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

const GifMaker = () => {
  const [images, setImages] = useState<{file: File, preview: string}[]>([]);
  const [gif, setGif] = useState<string | null>(null);
  const [delay, setDelay] = useState([100]); // milliseconds between frames
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string>('upload');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    
    // Convert FileList to Array and filter for images
    const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (fileArray.length === 0) {
      toast.error('Please select image files only');
      return;
    }
    
    // Process each file
    const newImages = fileArray.map(file => {
      return {
        file,
        preview: URL.createObjectURL(file)
      };
    });
    
    setImages(prev => [...prev, ...newImages]);
    
    // Clear the input to allow selecting the same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast.success(`${fileArray.length} image(s) added`);
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      // Clean up the URL.createObjectURL
      URL.revokeObjectURL(prev[index].preview);
      
      // Remove the image at the index
      return prev.filter((_, i) => i !== index);
    });
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === images.length - 1)) {
      return;
    }
    
    setImages(prev => {
      const newImages = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      // Swap positions
      [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
      
      return newImages;
    });
  };

  const generateGif = async () => {
    if (images.length < 2) {
      toast.error('Please add at least 2 images');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Load the gifshot library dynamically
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/gifshot@0.4.5/build/gifshot.min.js';
      script.async = true;
      
      script.onload = () => {
        // Check if gifshot is loaded
        if (window.gifshot) {
          window.gifshot.createGIF({
            images: images.map(img => img.preview),
            gifWidth: 600,
            gifHeight: 400,
            numWorkers: 2,
            frameDuration: delay[0] / 10, // Convert ms to 1/100th of a second
            sampleInterval: 10,
            progressCallback: (progress: number) => {
              // You could use this to update a progress bar
              console.log(`Progress: ${Math.round(progress * 100)}%`);
            }
          }, (obj: { error: string, image: string, savedRenders: any[] }) => {
            if (!obj.error) {
              setGif(obj.image);
              setActiveTab('result');
              toast.success('GIF created successfully!');
            } else {
              toast.error(`Error creating GIF: ${obj.error}`);
            }
            setIsGenerating(false);
          });
        } else {
          toast.error('Failed to load GIF generation library');
          setIsGenerating(false);
        }
      };
      
      script.onerror = () => {
        toast.error('Failed to load GIF generation library');
        setIsGenerating(false);
      };
      
      document.body.appendChild(script);
      
    } catch (error) {
      toast.error('Failed to generate GIF');
      console.error(error);
      setIsGenerating(false);
    }
  };

  const downloadGif = () => {
    if (!gif) return;
    
    const link = document.createElement('a');
    link.href = gif;
    link.download = 'custom-animation.gif';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('GIF downloaded successfully');
  };

  const clearAll = () => {
    // Clean up all the URL.createObjectURL resources
    images.forEach(img => URL.revokeObjectURL(img.preview));
    
    setImages([]);
    setGif(null);
  };

  const previewGif = () => {
    if (images.length < 2) {
      toast.error('Please add at least 2 images');
      return;
    }
    
    if (previewContainerRef.current) {
      const container = previewContainerRef.current;
      let currentIndex = 0;
      
      // Clear any existing content and add the first image
      container.innerHTML = '';
      const img = document.createElement('img');
      img.src = images[0].preview;
      img.className = 'max-h-[300px] max-w-full object-contain mx-auto';
      container.appendChild(img);
      
      // Start animation loop
      const interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        img.src = images[currentIndex].preview;
      }, delay[0]);
      
      // Stop after 3 seconds
      setTimeout(() => {
        clearInterval(interval);
      }, 3000);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="upload" className="flex-1">Upload Images</TabsTrigger>
          <TabsTrigger value="result" className="flex-1" disabled={!gif}>Result</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
          <div className="border-2 border-dashed rounded-lg p-6">
            <div className="text-center">
              <Film className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Add Images for Your GIF</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Select multiple images to create an animated GIF
              </p>
              <div className="flex justify-center">
                <Label
                  htmlFor="image-upload"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90"
                >
                  <Upload size={16} />
                  Add Images
                </Label>
                <Input
                  id="image-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          {images.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Images for GIF ({images.length})</h3>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  Clear All
                </Button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <Card key={index} className="relative overflow-hidden group">
                    <img 
                      src={img.preview} 
                      alt={`Frame ${index + 1}`} 
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="text-white font-medium">Frame {index + 1}</div>
                        <div className="flex space-x-1">
                          <Button 
                            size="icon" 
                            variant="secondary" 
                            className="h-8 w-8" 
                            onClick={() => moveImage(index, 'up')}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button 
                            size="icon" 
                            variant="secondary" 
                            className="h-8 w-8" 
                            onClick={() => moveImage(index, 'down')}
                            disabled={index === images.length - 1}
                          >
                            ↓
                          </Button>
                          <Button 
                            size="icon" 
                            variant="destructive" 
                            className="h-8 w-8" 
                            onClick={() => removeImage(index)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="delay-slider">Frame Delay: {delay}ms</Label>
                  <Slider
                    id="delay-slider"
                    min={50}
                    max={1000}
                    step={50}
                    value={delay}
                    onValueChange={setDelay}
                  />
                  <p className="text-sm text-muted-foreground">
                    Adjust how long each frame appears (in milliseconds)
                  </p>
                </div>
                
                <div className="space-x-2 flex">
                  <Button 
                    variant="outline" 
                    onClick={previewGif} 
                    className="flex items-center gap-2"
                    disabled={images.length < 2}
                  >
                    <Play size={16} />
                    Preview Animation
                  </Button>
                  <Button 
                    onClick={generateGif} 
                    disabled={isGenerating || images.length < 2}
                    className="flex items-center gap-2"
                  >
                    {isGenerating ? 'Generating...' : 'Create GIF'}
                  </Button>
                </div>
                
                <div 
                  ref={previewContainerRef} 
                  className="h-60 border rounded-lg flex items-center justify-center bg-background/50"
                >
                  <p className="text-muted-foreground">Preview animation will appear here</p>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="result" className="space-y-6">
          {gif && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Your GIF</h3>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('upload')}>
                  Back to Editor
                </Button>
              </div>
              
              <div className="flex justify-center border rounded-lg p-4">
                <img 
                  src={gif} 
                  alt="Generated GIF" 
                  className="max-h-[400px] max-w-full object-contain" 
                />
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={downloadGif} 
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  Download GIF
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="bg-muted/30 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-2">About GIF Maker</h3>
        <p className="text-sm text-muted-foreground">
          Create animated GIFs by combining multiple images. Adjust the frame delay to control animation speed.
          This tool processes everything in your browser, so your images are not uploaded to any server. The maximum quality
          and size of your GIF may be limited by your browser's memory.
        </p>
      </div>
    </div>
  );
};

export default GifMaker;

// Add this type definition for GifShot library
declare global {
  interface Window {
    gifshot: {
      createGIF: (options: any, callback: (result: any) => void) => void;
    }
  }
}
