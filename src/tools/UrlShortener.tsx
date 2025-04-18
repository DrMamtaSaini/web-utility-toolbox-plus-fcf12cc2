
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'lucide-react';

const UrlShortener = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleShorten = async () => {
    if (!longUrl) {
      toast({
        title: "Error",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Using tinyurl's API for demonstration
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
      const data = await response.text();
      setShortUrl(data);
      toast({
        title: "Success",
        description: "URL shortened successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to shorten URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    toast({
      title: "Copied!",
      description: "Short URL copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="longUrl">Enter your long URL</Label>
        <div className="flex gap-2">
          <Input
            id="longUrl"
            placeholder="https://example.com/very-long-url..."
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
          />
          <Button onClick={handleShorten} disabled={isLoading}>
            <Link className="mr-2 h-4 w-4" />
            Shorten
          </Button>
        </div>
      </div>

      {shortUrl && (
        <div className="space-y-2">
          <Label htmlFor="shortUrl">Your shortened URL</Label>
          <div className="flex gap-2">
            <Input
              id="shortUrl"
              value={shortUrl}
              readOnly
            />
            <Button onClick={handleCopy} variant="outline">
              Copy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlShortener;
