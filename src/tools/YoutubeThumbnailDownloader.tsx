
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { FileImage, ExternalLink } from "lucide-react";

const YoutubeThumbnailDownloader = () => {
  const [url, setUrl] = useState("");
  const [thumbnails, setThumbnails] = useState<{
    default: string;
    medium: string;
    high: string;
    standard: string;
    maxres: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractVideoId = (url: string): string | null => {
    // Regular expression to extract YouTube video ID
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setThumbnails(null);
    
    const id = extractVideoId(url);
    if (!id) {
      setError("Invalid YouTube URL. Please enter a valid YouTube video URL.");
      return;
    }

    setLoading(true);
    setVideoId(id);

    // Create thumbnail URLs
    const thumbnailUrls = {
      default: `https://img.youtube.com/vi/${id}/default.jpg`,
      medium: `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
      high: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      standard: `https://img.youtube.com/vi/${id}/sddefault.jpg`,
      maxres: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
    };

    setThumbnails(thumbnailUrls);
    setLoading(false);
  };

  const downloadThumbnail = async (url: string, quality: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `youtube-thumbnail-${videoId}-${quality}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${quality} thumbnail downloaded successfully`);
    } catch (error) {
      toast.error("Failed to download thumbnail");
      console.error("Download error:", error);
    }
  };

  const handleTestImage = (url: string) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const checkThumbnailExists = async (thumbnail: string) => {
    const exists = await handleTestImage(thumbnail);
    return exists;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">YouTube Thumbnail Downloader</h1>
        <p className="text-muted-foreground">
          Extract and download thumbnails from any YouTube video in various resolutions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="youtube-url">YouTube Video URL</Label>
          <div className="flex gap-2">
            <Input
              id="youtube-url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Get Thumbnails"}
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </form>

      {thumbnails && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(thumbnails).map(([quality, url]) => (
              <Card key={quality} className="p-4 space-y-3">
                <div className="font-medium capitalize flex justify-between items-center">
                  <span>{quality} Quality</span>
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center text-sm"
                  >
                    <ExternalLink size={14} className="mr-1" /> View
                  </a>
                </div>
                <div className="aspect-video relative bg-muted/30 rounded-md overflow-hidden">
                  <img
                    src={url}
                    alt={`${quality} thumbnail`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.innerHTML += 
                        '<div class="absolute inset-0 flex items-center justify-center text-muted-foreground"><FileImage size={24} /><p class="ml-2">Not available</p></div>';
                    }}
                  />
                </div>
                <Button
                  onClick={() => downloadThumbnail(url, quality)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Download {quality} Thumbnail
                </Button>
              </Card>
            ))}
          </div>

          {videoId && (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">
                Video ID: <span className="font-mono bg-muted px-1 rounded">{videoId}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default YoutubeThumbnailDownloader;
