
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { toast } from "sonner";
import { ExternalLink, Search, AlertTriangle } from 'lucide-react';

interface Backlink {
  sourceDomain: string;
  targetUrl: string;
  anchorText: string;
  pageAuthority: number;
}

const BacklinkChecker = () => {
  const [url, setUrl] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [backlinks, setBacklinks] = useState<Backlink[]>([]);

  const validateUrl = (inputUrl: string) => {
    try {
      // Add protocol if missing
      let processedUrl = inputUrl;
      if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
        processedUrl = 'https://' + inputUrl;
      }
      
      const url = new URL(processedUrl);
      return url.toString();
    } catch (error) {
      return null;
    }
  };

  const checkBacklinks = () => {
    if (!url.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    const validUrl = validateUrl(url);
    if (!validUrl) {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsChecking(true);
    
    // In a real implementation, this would call an API
    // For demo purposes, we'll simulate some backlinks with setTimeout
    setTimeout(() => {
      const mockBacklinks: Backlink[] = [
        {
          sourceDomain: "example.com",
          targetUrl: validUrl,
          anchorText: "Great Resource",
          pageAuthority: 45
        },
        {
          sourceDomain: "blog.website.com",
          targetUrl: validUrl + "#section1",
          anchorText: "Click Here",
          pageAuthority: 38
        },
        {
          sourceDomain: "news.site.org",
          targetUrl: validUrl,
          anchorText: "Latest Information",
          pageAuthority: 52
        },
        {
          sourceDomain: "reference.edu",
          targetUrl: validUrl + "/page",
          anchorText: "Research Source",
          pageAuthority: 67
        },
        {
          sourceDomain: "tutorial.dev",
          targetUrl: validUrl,
          anchorText: "Learn More",
          pageAuthority: 41
        }
      ];
      
      setBacklinks(mockBacklinks);
      setIsChecking(false);
      toast.success(`Found ${mockBacklinks.length} backlinks for this domain`);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="url"
                  placeholder="e.g., example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={checkBacklinks}
                  disabled={isChecking}
                  className="min-w-fit"
                >
                  {isChecking ? 'Checking...' : 'Check Backlinks'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter your website URL to check backlinks pointing to it
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {isChecking && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-pulse flex flex-col items-center">
            <Search className="h-8 w-8 text-primary mb-2" />
            <p className="text-muted-foreground">Searching for backlinks...</p>
          </div>
        </div>
      )}

      {!isChecking && backlinks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Backlink Analysis</h3>
          
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source Domain</TableHead>
                      <TableHead>Anchor Text</TableHead>
                      <TableHead className="text-right">Authority</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backlinks.map((backlink, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {backlink.sourceDomain}
                            <ExternalLink className="ml-2 h-3 w-3 text-muted-foreground" />
                          </div>
                        </TableCell>
                        <TableCell>{backlink.anchorText}</TableCell>
                        <TableCell className="text-right">
                          <span className={`font-medium ${
                            backlink.pageAuthority > 50 ? 'text-green-600' : 
                            backlink.pageAuthority > 30 ? 'text-amber-600' : 'text-red-600'
                          }`}>
                            {backlink.pageAuthority}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Demo Data</p>
              <p className="text-sm">This is simulated data for demonstration purposes. In a real application, this would require API access to backlink databases.</p>
            </div>
          </div>
        </div>
      )}

      {!isChecking && backlinks.length === 0 && url && (
        <div className="bg-muted/50 border rounded-lg p-8 text-center">
          <Search className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Results</h3>
          <p className="text-muted-foreground">
            Enter a URL and click "Check Backlinks" to analyze backlinks pointing to your website.
          </p>
        </div>
      )}
    </div>
  );
};

export default BacklinkChecker;
