
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Download, Youtube } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const YoutubeVideoDownloader = () => {
  const [url, setUrl] = useState("");
  const { toast } = useToast();
  
  const handleDownload = async () => {
    if (!url) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a YouTube URL",
      });
      return;
    }

    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL",
      });
      return;
    }

    toast({
      title: "Important Notice",
      description: "Due to YouTube's terms of service, we cannot provide direct video downloads. Please use YouTube's official services or platforms.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Youtube className="h-12 w-12 text-red-500" />
      </div>

      <div className="space-y-4">
        <Input
          type="url"
          placeholder="Paste YouTube URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full"
        />

        <Button 
          onClick={handleDownload}
          className="w-full"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Video
        </Button>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This tool is for educational purposes only. Please respect YouTube's terms of service and copyright laws.
          Consider using YouTube Premium or official download features where available.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default YoutubeVideoDownloader;
