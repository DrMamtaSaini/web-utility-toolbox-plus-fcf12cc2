
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from "sonner";
import { Copy, Download, Plus, X } from 'lucide-react';

const RobotsTxtGenerator = () => {
  const [userAgent, setUserAgent] = useState('*');
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [disallowPaths, setDisallowPaths] = useState(['']);
  const [allowPaths, setAllowPaths] = useState<string[]>([]);
  const [crawlDelay, setCrawlDelay] = useState('');
  const [additionalLines, setAdditionalLines] = useState('');
  const [robotsTxt, setRobotsTxt] = useState<string | null>(null);
  const [specificUserAgent, setSpecificUserAgent] = useState('');
  const [includeHostLine, setIncludeHostLine] = useState(false);
  const [hostUrl, setHostUrl] = useState('');

  const handleAddDisallowPath = () => {
    setDisallowPaths([...disallowPaths, '']);
  };

  const handleRemoveDisallowPath = (index: number) => {
    const newPaths = [...disallowPaths];
    newPaths.splice(index, 1);
    setDisallowPaths(newPaths);
  };

  const handleDisallowPathChange = (index: number, value: string) => {
    const newPaths = [...disallowPaths];
    newPaths[index] = value;
    setDisallowPaths(newPaths);
  };

  const handleAddAllowPath = () => {
    setAllowPaths([...allowPaths, '']);
  };

  const handleRemoveAllowPath = (index: number) => {
    const newPaths = [...allowPaths];
    newPaths.splice(index, 1);
    setAllowPaths(newPaths);
  };

  const handleAllowPathChange = (index: number, value: string) => {
    const newPaths = [...allowPaths];
    newPaths[index] = value;
    setAllowPaths(newPaths);
  };

  const generateRobotsTxt = () => {
    try {
      let content = '';
      
      // Set User-agent
      if (userAgent === 'specific' && specificUserAgent) {
        content += `User-agent: ${specificUserAgent}\n`;
      } else {
        content += `User-agent: ${userAgent}\n`;
      }
      
      // Add Disallow paths
      disallowPaths.forEach(path => {
        if (path.trim()) {
          content += `Disallow: ${path.startsWith('/') ? path : '/' + path}\n`;
        }
      });
      
      // Add Allow paths
      allowPaths.forEach(path => {
        if (path.trim()) {
          content += `Allow: ${path.startsWith('/') ? path : '/' + path}\n`;
        }
      });
      
      // Add Crawl-delay if provided
      if (crawlDelay.trim()) {
        content += `Crawl-delay: ${crawlDelay}\n`;
      }
      
      content += '\n'; // Add separator
      
      // Add Host directive if checked
      if (includeHostLine && hostUrl.trim()) {
        content += `Host: ${hostUrl.trim()}\n\n`;
      }
      
      // Add Sitemap if provided
      if (sitemapUrl.trim()) {
        content += `Sitemap: ${sitemapUrl}\n`;
      }
      
      // Add additional custom lines
      if (additionalLines.trim()) {
        content += '\n' + additionalLines + '\n';
      }
      
      setRobotsTxt(content);
      toast.success("robots.txt generated successfully");
    } catch (error) {
      toast.error("Error generating robots.txt");
    }
  };

  const copyToClipboard = () => {
    if (!robotsTxt) return;
    
    navigator.clipboard.writeText(robotsTxt)
      .then(() => toast.success("robots.txt copied to clipboard"))
      .catch(() => toast.error("Failed to copy to clipboard"));
  };

  const downloadRobotsTxt = () => {
    if (!robotsTxt) return;
    
    const blob = new Blob([robotsTxt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = 'robots.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("robots.txt downloaded");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="user-agent">User Agent</Label>
          <Select 
            value={userAgent} 
            onValueChange={(value) => setUserAgent(value)}
          >
            <SelectTrigger id="user-agent">
              <SelectValue placeholder="Select User Agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="*">All robots (*)</SelectItem>
              <SelectItem value="Googlebot">Google (Googlebot)</SelectItem>
              <SelectItem value="Bingbot">Bing (Bingbot)</SelectItem>
              <SelectItem value="Slurp">Yahoo (Slurp)</SelectItem>
              <SelectItem value="DuckDuckBot">DuckDuckGo (DuckDuckBot)</SelectItem>
              <SelectItem value="Baiduspider">Baidu (Baiduspider)</SelectItem>
              <SelectItem value="YandexBot">Yandex (YandexBot)</SelectItem>
              <SelectItem value="specific">Custom User Agent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {userAgent === 'specific' && (
          <div className="space-y-2">
            <Label htmlFor="specific-user-agent">Custom User Agent</Label>
            <Input
              id="specific-user-agent"
              placeholder="e.g., MyCustomBot"
              value={specificUserAgent}
              onChange={(e) => setSpecificUserAgent(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Disallow Paths</Label>
          <div className="space-y-2">
            {disallowPaths.map((path, index) => (
              <div key={`disallow-${index}`} className="flex gap-2">
                <Input
                  placeholder="e.g., /admin"
                  value={path}
                  onChange={(e) => handleDisallowPathChange(index, e.target.value)}
                />
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => handleRemoveDisallowPath(index)}
                  disabled={disallowPaths.length === 1 && index === 0}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAddDisallowPath}
              className="w-full"
            >
              <Plus size={16} className="mr-2" />
              Add Disallow Path
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Add paths you want search engines to avoid (e.g., /admin, /private)
          </p>
        </div>

        <div className="space-y-2">
          <Label>Allow Paths (Optional)</Label>
          <div className="space-y-2">
            {allowPaths.map((path, index) => (
              <div key={`allow-${index}`} className="flex gap-2">
                <Input
                  placeholder="e.g., /public"
                  value={path}
                  onChange={(e) => handleAllowPathChange(index, e.target.value)}
                />
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => handleRemoveAllowPath(index)}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAddAllowPath}
              className="w-full"
            >
              <Plus size={16} className="mr-2" />
              Add Allow Path
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Explicitly allow specific paths (useful for subdirectories of disallowed paths)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="crawl-delay">Crawl Delay (Optional)</Label>
          <Input
            id="crawl-delay"
            type="number"
            min="1"
            step="1"
            placeholder="e.g., 10"
            value={crawlDelay}
            onChange={(e) => setCrawlDelay(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Seconds between requests (used by some search engines)
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="include-host" 
              checked={includeHostLine} 
              onCheckedChange={(checked) => setIncludeHostLine(!!checked)} 
            />
            <Label htmlFor="include-host">Include Host directive</Label>
          </div>
          {includeHostLine && (
            <Input
              id="host-url"
              placeholder="e.g., example.com"
              value={hostUrl}
              onChange={(e) => setHostUrl(e.target.value)}
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sitemap-url">Sitemap URL (Optional)</Label>
          <Input
            id="sitemap-url"
            placeholder="e.g., https://example.com/sitemap.xml"
            value={sitemapUrl}
            onChange={(e) => setSitemapUrl(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additional-lines">Additional Custom Content (Optional)</Label>
          <Textarea
            id="additional-lines"
            placeholder="Enter any additional directives here"
            value={additionalLines}
            onChange={(e) => setAdditionalLines(e.target.value)}
            rows={3}
          />
        </div>

        <Button onClick={generateRobotsTxt} className="w-full">
          Generate robots.txt
        </Button>
      </div>

      {robotsTxt && (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Label htmlFor="result">Generated robots.txt</Label>
              <div className="mt-2 p-4 bg-muted rounded-md overflow-auto max-h-96">
                <pre className="text-xs whitespace-pre-wrap">{robotsTxt}</pre>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              onClick={copyToClipboard} 
              variant="outline" 
              className="w-1/2"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </Button>
            <Button onClick={downloadRobotsTxt} className="w-1/2">
              <Download className="mr-2 h-4 w-4" />
              Download robots.txt
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RobotsTxtGenerator;
