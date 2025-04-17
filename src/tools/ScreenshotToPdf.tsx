
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Upload, Download, X, Move, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

const ScreenshotToPdf = () => {
  const [images, setImages] = useState<{file: File, preview: string}[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const clearAll = () => {
    // Clean up all the URL.createObjectURL resources
    images.forEach(img => URL.revokeObjectURL(img.preview));
    
    setImages([]);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  const generatePdf = async () => {
    if (images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Load the jspdf and html2canvas libraries dynamically
      const jsPdfScript = document.createElement('script');
      jsPdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      jsPdfScript.async = true;
      
      const html2canvasScript = document.createElement('script');
      html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      html2canvasScript.async = true;
      
      // Function to check if both libraries have loaded
      const checkLibrariesLoaded = () => {
        if (window.jspdf && window.html2canvas) {
          createPdf();
        }
      };
      
      jsPdfScript.onload = checkLibrariesLoaded;
      html2canvasScript.onload = checkLibrariesLoaded;
      
      jsPdfScript.onerror = () => {
        toast.error('Failed to load PDF generation library');
        setIsGenerating(false);
      };
      
      html2canvasScript.onerror = () => {
        toast.error('Failed to load HTML canvas library');
        setIsGenerating(false);
      };
      
      document.body.appendChild(jsPdfScript);
      document.body.appendChild(html2canvasScript);
      
      // Function to create the PDF
      const createPdf = async () => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10; // margin in mm
        
        // Function to load image and return its dimensions
        const loadImage = (src: string): Promise<HTMLImageElement> => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
          });
        };
        
        // Process each image
        for (let i = 0; i < images.length; i++) {
          if (i > 0) {
            // Add new page for each image after the first
            pdf.addPage();
          }
          
          try {
            // Load the image
            const img = await loadImage(images[i].preview);
            
            // Calculate dimensions to fit in the page with margins
            const imgWidth = pageWidth - (margin * 2);
            const imgHeight = (img.height * imgWidth) / img.width;
            
            // If image is too tall, scale it down
            const maxHeight = pageHeight - (margin * 2);
            const finalWidth = imgHeight > maxHeight ? (imgWidth * maxHeight) / imgHeight : imgWidth;
            const finalHeight = imgHeight > maxHeight ? maxHeight : imgHeight;
            
            // Add image to PDF
            pdf.addImage(
              images[i].preview,
              'JPEG',
              margin,
              margin,
              finalWidth,
              finalHeight
            );
          } catch (error) {
            console.error('Error processing image:', error);
            toast.error(`Error processing image ${i + 1}`);
          }
        }
        
        // Generate PDF blob
        const pdfBlob = pdf.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        
        // Update state
        setPdfUrl(url);
        setActiveTab('result');
        setIsGenerating(false);
        toast.success('PDF generated successfully!');
      };
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
      setIsGenerating(false);
    }
  };

  const downloadPdf = () => {
    if (!pdfUrl) return;
    
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'screenshots.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('PDF downloaded successfully');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const files = e.dataTransfer.files;
    if (files?.length > 0) {
      // Filter for image files
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      
      if (imageFiles.length === 0) {
        toast.error('Please drop image files only');
        return;
      }
      
      // Process each image
      const newImages = imageFiles.map(file => {
        return {
          file,
          preview: URL.createObjectURL(file)
        };
      });
      
      setImages(prev => [...prev, ...newImages]);
      toast.success(`${imageFiles.length} image(s) added`);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="upload" className="flex-1">Upload</TabsTrigger>
          <TabsTrigger value="result" className="flex-1" disabled={!pdfUrl}>Result</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
          <div 
            className="border-2 border-dashed rounded-lg p-6 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Add Screenshots/Images</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Drag & drop images or click to browse
              </p>
              <div className="flex justify-center gap-2">
                <Label
                  htmlFor="image-upload"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90"
                >
                  <Upload size={16} />
                  Browse
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
                <Button
                  variant="outline"
                  onClick={() => {
                    if (fileInputRef.current) fileInputRef.current.click();
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add More
                </Button>
              </div>
            </div>
          </div>

          {images.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Images for PDF ({images.length})</h3>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  Clear All
                </Button>
              </div>
              
              <div className="space-y-4">
                {images.map((img, index) => (
                  <Card key={index} className="flex items-center p-3">
                    <div className="h-20 w-20 flex-shrink-0 mr-4 overflow-hidden rounded-md">
                      <img 
                        src={img.preview} 
                        alt={`Image ${index + 1}`} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">
                        Page {index + 1}: {img.file.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(img.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8" 
                        onClick={() => moveImage(index, 'up')}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
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
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={generatePdf}
                  disabled={isGenerating || images.length === 0}
                  className="w-full max-w-xs"
                >
                  {isGenerating ? 'Generating PDF...' : 'Generate PDF'}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="result" className="space-y-6">
          {pdfUrl && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">PDF Preview</h3>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('upload')}>
                  Back to Images
                </Button>
              </div>
              
              <div className="flex justify-center border rounded-lg p-4 bg-muted/30">
                <div className="w-full max-w-lg">
                  <iframe 
                    src={pdfUrl} 
                    className="w-full h-[60vh] border"
                    title="PDF Preview"
                  />
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={downloadPdf} 
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="bg-muted/30 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-2">About Screenshot to PDF</h3>
        <p className="text-sm text-muted-foreground">
          This tool converts your screenshots or images into a professional PDF document. 
          You can rearrange the images to set the page order. 
          Perfect for creating documentation, reports, or saving multiple screenshots in a single file.
          All processing happens in your browser - your images are never uploaded to any server.
        </p>
      </div>
    </div>
  );
};

export default ScreenshotToPdf;

// Add this type definition for the PDF libraries
declare global {
  interface Window {
    jspdf: {
      jsPDF: any;
    };
    html2canvas: any;
  }
}
