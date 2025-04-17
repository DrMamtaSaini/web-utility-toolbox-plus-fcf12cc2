
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Copy, Image, Scan, Loader2 } from "lucide-react";
import { toast } from "sonner";

const OcrTool = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState("eng");
  const [recognizeHandwriting, setRecognizeHandwriting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Clean up previous image preview if it exists
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    
    const url = URL.createObjectURL(file);
    setSelectedImage(file);
    setImagePreview(url);
    setExtractedText("");
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files?.length > 0 && files[0].type.startsWith('image/')) {
      // Clean up previous image preview if it exists
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      
      const file = files[0];
      const url = URL.createObjectURL(file);
      setSelectedImage(file);
      setImagePreview(url);
      setExtractedText("");
    } else {
      toast.error('Please drop an image file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleResetImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview(null);
    setExtractedText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText).then(
      () => {
        toast.success("Text copied to clipboard!");
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast.error("Failed to copy to clipboard");
      }
    );
  };
  
  const extractText = () => {
    if (!selectedImage) {
      toast.error("Please upload an image first");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate OCR processing with a timeout
    setTimeout(() => {
      // This is just a demo - in a real app, you'd call an OCR API
      setExtractedText(
        recognizeHandwriting ? 
          "This is simulated handwritten text recognition.\n\nIn a real implementation, this would connect to an OCR service like Tesseract.js, Google Cloud Vision, or Microsoft's Azure Computer Vision API to process the image and extract text." :
          "This is simulated text extraction from the uploaded image.\n\nIn a production environment, this tool would use an OCR engine to extract actual text from your image. The recognized language would be " + 
          (language === "eng" ? "English" : language === "fra" ? "French" : language === "spa" ? "Spanish" : language)
      );
      
      setIsProcessing(false);
      toast.success("Text extraction complete!");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="upload" className="flex-1">Upload Image</TabsTrigger>
          <TabsTrigger value="results" className="flex-1">Extracted Text</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
          {/* Image Upload Section */}
          <div 
            className={`border-2 border-dashed rounded-lg p-6 transition-colors ${imagePreview ? 'border-primary/50' : 'border-gray-300'}`}
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
          >
            {!imagePreview ? (
              <div className="text-center">
                <Scan className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
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
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium">Image Preview</h3>
                  <Button variant="outline" size="sm" onClick={handleResetImage}>
                    Choose Different Image
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
          
          {/* OCR Options */}
          {imagePreview && (
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">OCR Settings</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language-select">Recognition Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language-select">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eng">English</SelectItem>
                        <SelectItem value="fra">French</SelectItem>
                        <SelectItem value="spa">Spanish</SelectItem>
                        <SelectItem value="deu">German</SelectItem>
                        <SelectItem value="ita">Italian</SelectItem>
                        <SelectItem value="rus">Russian</SelectItem>
                        <SelectItem value="jpn">Japanese</SelectItem>
                        <SelectItem value="chi_sim">Chinese (Simplified)</SelectItem>
                        <SelectItem value="kor">Korean</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox 
                      id="handwriting" 
                      checked={recognizeHandwriting}
                      onCheckedChange={(checked) => 
                        setRecognizeHandwriting(checked === true)
                      }
                    />
                    <Label htmlFor="handwriting">Recognize Handwriting</Label>
                  </div>
                </div>
                
                <Button 
                  onClick={extractText} 
                  disabled={isProcessing || !selectedImage}
                  className="w-full sm:w-auto"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Extract Text"
                  )}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="results" className="space-y-6">
          {/* Results Section */}
          <div className="bg-muted/30 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Extracted Text</h3>
              {extractedText && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyToClipboard}
                >
                  <Copy size={16} className="mr-2" />
                  Copy Text
                </Button>
              )}
            </div>
            
            <div className="min-h-[300px]">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center h-[300px] bg-muted/20 rounded-md">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p>Processing image...</p>
                </div>
              ) : extractedText ? (
                <Textarea 
                  value={extractedText} 
                  className="min-h-[300px]"
                  readOnly
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] bg-muted/20 rounded-md">
                  <Image className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No text extracted yet. Upload an image and click "Extract Text".
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="bg-muted/30 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-2">About Text Recognition</h3>
        <p className="text-sm text-muted-foreground">
          This tool uses OCR (Optical Character Recognition) technology to extract text from images. It can recognize printed text in various languages and has limited support for handwritten text. For best results, use clear images with good lighting and contrast.
        </p>
      </div>
    </div>
  );
};

export default OcrTool;
