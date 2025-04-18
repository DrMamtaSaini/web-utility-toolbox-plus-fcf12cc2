
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { ArrowDown, ArrowUp, ArrowLeft, ArrowRight, Maximize, Minimize, Upload, Download, Crop as CropIcon } from "lucide-react";
import { toast } from "sonner";

const ImageCropper = () => {
  const [image, setImage] = useState<string | null>(null);
  const [cropping, setCropping] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [cropBox, setCropBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [activeTab, setActiveTab] = useState("upload");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const cropBoxRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropPreviewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-switch to the crop tab when starting to crop
    if (cropping && activeTab !== "crop") {
      setActiveTab("crop");
    }
    
    // Auto-switch to the result tab when a cropped image is ready
    if (croppedImage && activeTab !== "result") {
      setActiveTab("result");
    }
  }, [cropping, croppedImage, activeTab]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Clean up previous URLs
    if (image) URL.revokeObjectURL(image);
    if (croppedImage) URL.revokeObjectURL(croppedImage);
    
    const url = URL.createObjectURL(file);
    setImage(url);
    setCroppedImage(null);
    setCropping(false);
    
    // Load image to get dimensions
    const img = new Image();
    img.onload = () => {
      // Calculate dimensions to fit in the container while maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      
      // Limit maximum dimensions
      const maxDim = 500;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = (height * maxDim) / width;
          width = maxDim;
        } else {
          width = (width * maxDim) / height;
          height = maxDim;
        }
      }
      
      setImageDimensions({ width, height });
      
      // Set default crop box to 80% of image dimensions
      setCropBox({
        x: width * 0.1,
        y: height * 0.1,
        width: width * 0.8,
        height: height * 0.8
      });
    };
    img.src = url;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files?.length > 0 && files[0].type.startsWith('image/')) {
      if (fileInputRef.current) {
        fileInputRef.current.files = files;
        handleFileChange({ target: { files } } as any);
      }
    } else {
      toast.error('Please drop an image file');
    }
  };
  
  const handleStartCropping = () => {
    if (!image) {
      toast.error("Please upload an image first");
      return;
    }
    setCropping(true);
    setActiveTab("crop");
  };
  
  const adjustCropBox = (direction: string, value: number) => {
    setCropBox(prev => {
      const newBox = { ...prev };
      
      switch (direction) {
        case 'left':
          newBox.x = Math.max(0, Math.min(newBox.x + value, newBox.x + newBox.width - 50));
          newBox.width -= value;
          break;
        case 'right':
          newBox.width = Math.max(50, Math.min(newBox.width + value, imageDimensions.width - newBox.x));
          break;
        case 'top':
          newBox.y = Math.max(0, Math.min(newBox.y + value, newBox.y + newBox.height - 50));
          newBox.height -= value;
          break;
        case 'bottom':
          newBox.height = Math.max(50, Math.min(newBox.height + value, imageDimensions.height - newBox.y));
          break;
      }
      
      return newBox;
    });
  };
  
  const handleCrop = () => {
    if (!image || !canvasRef.current || !imageRef.current) {
      toast.error("Missing image or canvas reference");
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      toast.error("Could not get canvas context");
      return;
    }
    
    try {
      // Get the true image dimensions and crop coordinates
      const img = imageRef.current;
      const scaleX = img.naturalWidth / imageDimensions.width;
      const scaleY = img.naturalHeight / imageDimensions.height;
      
      // Set canvas dimensions to cropped size
      canvas.width = cropBox.width * scaleX;
      canvas.height = cropBox.height * scaleY;
      
      // Draw the cropped portion
      ctx.drawImage(
        img,
        cropBox.x * scaleX,
        cropBox.y * scaleY,
        cropBox.width * scaleX,
        cropBox.height * scaleY,
        0,
        0,
        cropBox.width * scaleX,
        cropBox.height * scaleY
      );
      
      // Convert canvas to data URL
      const croppedUrl = canvas.toDataURL('image/png');
      setCroppedImage(croppedUrl);
      setCropping(false);
      setActiveTab("result");
      
      toast.success("Image cropped successfully");
    } catch (error) {
      console.error("Error during cropping:", error);
      toast.error("Failed to crop image");
    }
  };
  
  const resetImage = () => {
    if (image) URL.revokeObjectURL(image);
    if (croppedImage) URL.revokeObjectURL(croppedImage);
    
    setImage(null);
    setCroppedImage(null);
    setCropping(false);
    setImageDimensions({ width: 0, height: 0 });
    setActiveTab("upload");
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const downloadImage = () => {
    if (!croppedImage) {
      toast.error("No cropped image to download");
      return;
    }
    
    try {
      const link = document.createElement('a');
      link.href = croppedImage;
      link.download = 'cropped-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download image");
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="upload" className="flex-1">Upload</TabsTrigger>
          <TabsTrigger value="crop" className="flex-1" disabled={!image || !!croppedImage}>Crop</TabsTrigger>
          <TabsTrigger value="result" className="flex-1" disabled={!croppedImage}>Result</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
          <div 
            className={`border-2 border-dashed rounded-lg p-6 transition-colors ${image ? 'border-primary/50' : 'border-gray-300'}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {!image ? (
              <div className="text-center">
                <CropIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
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
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={resetImage}>
                      Reset
                    </Button>
                    <Button size="sm" onClick={handleStartCropping}>
                      Crop This Image
                    </Button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <img 
                    ref={imageRef}
                    src={image} 
                    alt="Preview" 
                    className="max-h-[300px] max-w-full object-contain rounded-md"
                    style={{ maxWidth: '100%' }}
                  />
                </div>
              </div>
            )}
          </div>
          
          <canvas ref={canvasRef} className="hidden"></canvas>
          
          {image && (
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Image Cropper</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Click "Crop This Image" to start cropping. You can adjust the crop area precisely in the next step.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="crop" className="space-y-6">
          {cropping && image && (
            <>
              <div 
                ref={cropPreviewContainerRef}
                className="relative border rounded-lg overflow-hidden mx-auto"
                style={{ width: imageDimensions.width, height: imageDimensions.height, maxWidth: '100%' }}
              >
                <img 
                  ref={imageRef}
                  src={image} 
                  alt="Cropping" 
                  className="absolute top-0 left-0"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
                
                <div 
                  ref={cropBoxRef}
                  className="absolute border-2 border-primary bg-black bg-opacity-20"
                  style={{
                    left: cropBox.x,
                    top: cropBox.y,
                    width: cropBox.width,
                    height: cropBox.height,
                  }}
                ></div>
              </div>
              
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Adjust Crop Area</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Left Edge</Label>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="icon" onClick={() => adjustCropBox('left', -5)}>
                        <ArrowLeft size={16} />
                      </Button>
                      <Slider
                        value={[cropBox.x]}
                        min={0}
                        max={imageDimensions.width - 50}
                        step={1}
                        onValueChange={(value) => {
                          setCropBox(prev => ({
                            ...prev, 
                            x: value[0], 
                            width: prev.width + (prev.x - value[0])
                          }));
                        }}
                        className="flex-1"
                      />
                      <Button variant="outline" size="icon" onClick={() => adjustCropBox('left', 5)}>
                        <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Top Edge</Label>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="icon" onClick={() => adjustCropBox('top', -5)}>
                        <ArrowUp size={16} />
                      </Button>
                      <Slider
                        value={[cropBox.y]}
                        min={0}
                        max={imageDimensions.height - 50}
                        step={1}
                        onValueChange={(value) => {
                          setCropBox(prev => ({
                            ...prev, 
                            y: value[0], 
                            height: prev.height + (prev.y - value[0])
                          }));
                        }}
                        className="flex-1"
                      />
                      <Button variant="outline" size="icon" onClick={() => adjustCropBox('top', 5)}>
                        <ArrowDown size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Width</Label>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="icon" onClick={() => adjustCropBox('right', -5)}>
                        <Minimize size={16} />
                      </Button>
                      <Slider
                        value={[cropBox.width]}
                        min={50}
                        max={imageDimensions.width - cropBox.x}
                        step={1}
                        onValueChange={(value) => {
                          setCropBox(prev => ({ ...prev, width: value[0] }));
                        }}
                        className="flex-1"
                      />
                      <Button variant="outline" size="icon" onClick={() => adjustCropBox('right', 5)}>
                        <Maximize size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Height</Label>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="icon" onClick={() => adjustCropBox('bottom', -5)}>
                        <Minimize size={16} />
                      </Button>
                      <Slider
                        value={[cropBox.height]}
                        min={50}
                        max={imageDimensions.height - cropBox.y}
                        step={1}
                        onValueChange={(value) => {
                          setCropBox(prev => ({ ...prev, height: value[0] }));
                        }}
                        className="flex-1"
                      />
                      <Button variant="outline" size="icon" onClick={() => adjustCropBox('bottom', 5)}>
                        <Maximize size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <Button onClick={handleCrop} className="mr-2">
                      Crop Image
                    </Button>
                    <Button variant="outline" onClick={() => setCropping(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="result" className="space-y-6">
          {croppedImage ? (
            <div className="space-y-6">
              <div className="flex justify-center border rounded-lg p-6">
                <img 
                  src={croppedImage} 
                  alt="Cropped" 
                  className="max-h-[400px] max-w-full object-contain"
                />
              </div>
              
              <div className="flex justify-center">
                <Button onClick={downloadImage} className="flex items-center gap-2">
                  <Download size={16} />
                  Download Cropped Image
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p>No cropped image available. Please upload and crop an image first.</p>
              <Button 
                className="mt-4" 
                variant="outline" 
                onClick={() => setActiveTab("upload")}
              >
                Back to Upload
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="bg-muted/30 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-2">About Image Cropper</h3>
        <p className="text-sm text-muted-foreground">
          This tool allows you to crop your images with precision. Upload an image, adjust the crop area with the sliders or arrow buttons, and download your cropped result. This process happens entirely in your browser - we never upload your images to any server.
        </p>
      </div>
    </div>
  );
};

export default ImageCropper;
