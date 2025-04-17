
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Search, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

interface CheckResult {
  url: string;
  isIndexed: boolean;
  checkedAt: Date;
}

const GoogleIndexChecker = () => {
  const [url, setUrl] = useState('');
  const [urls, setUrls] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<CheckResult[]>([]);
  const [activeTab, setActiveTab] = useState("single");

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

  const checkSingleUrl = () => {
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
    
    // In a real implementation, this would call an API or use a headless browser
    // For demo purposes, we'll simulate the check with setTimeout
    setTimeout(() => {
      // Random result for demo purposes (70% chance of being indexed)
      const isIndexed = Math.random() > 0.3;
      
      const newResult: CheckResult = {
        url: validUrl,
        isIndexed,
        checkedAt: new Date()
      };
      
      setResults([newResult, ...results.slice(0, 9)]);
      setIsChecking(false);
      
      if (isIndexed) {
        toast.success("URL is indexed by Google");
      } else {
        toast.error("URL is not indexed by Google");
      }
    }, 1500);
  };

  const checkMultipleUrls = () => {
    if (!urls.length) {
      toast.error("Please add at least one URL");
      return;
    }
    
    const validUrls = urls.map(u => validateUrl(u)).filter(Boolean) as string[];
    
    if (!validUrls.length) {
      toast.error("No valid URLs found");
      return;
    }
    
    setIsChecking(true);
    
    // Simulate checking multiple URLs
    setTimeout(() => {
      const newResults: CheckResult[] = validUrls.map(url => ({
        url,
        isIndexed: Math.random() > 0.3, // Random result for demo
        checkedAt: new Date()
      }));
      
      setResults([...newResults, ...results.slice(0, 10 - newResults.length)]);
      setIsChecking(false);
      
      const indexedCount = newResults.filter(r => r.isIndexed).length;
      toast.success(`Checked ${newResults.length} URLs: ${indexedCount} indexed, ${newResults.length - indexedCount} not indexed`);
    }, 2000);
  };

  const handleAddUrl = () => {
    if (!url.trim()) return;
    
    const validUrl = validateUrl(url);
    if (!validUrl) {
      toast.error("Please enter a valid URL");
      return;
    }
    
    if (urls.includes(validUrl)) {
      toast.error("This URL is already in the list");
      return;
    }
    
    setUrls([...urls, validUrl]);
    setUrl('');
  };

  const removeUrl = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="single" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="single">Single URL</TabsTrigger>
          <TabsTrigger value="multiple">Multiple URLs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="single" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="single-url">URL to Check</Label>
                <div className="flex space-x-2">
                  <Input
                    id="single-url"
                    placeholder="e.g., https://example.com/page"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={checkSingleUrl}
                    disabled={isChecking}
                    className="min-w-fit"
                  >
                    {isChecking ? 'Checking...' : 'Check Index Status'}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the full URL you want to check if Google has indexed
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="multiple" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="multiple-url">Add URLs to Check</Label>
                <div className="flex space-x-2">
                  <Input
                    id="multiple-url"
                    placeholder="e.g., https://example.com/page"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAddUrl}
                    className="min-w-fit"
                    type="button"
                  >
                    Add URL
                  </Button>
                </div>
              </div>
              
              {urls.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">URLs to check ({urls.length})</div>
                  <div className="bg-muted/50 rounded-md p-2 max-h-40 overflow-y-auto">
                    <ul className="space-y-2">
                      {urls.map((url, index) => (
                        <li key={index} className="flex justify-between items-center text-sm">
                          <span className="truncate mr-2">{url}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeUrl(index)}
                            className="h-6 text-muted-foreground hover:text-destructive"
                          >
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    onClick={checkMultipleUrls}
                    disabled={isChecking || urls.length === 0}
                    className="w-full"
                  >
                    {isChecking ? 'Checking...' : `Check ${urls.length} URLs`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isChecking && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-pulse flex flex-col items-center">
            <Search className="h-8 w-8 text-primary mb-2" />
            <p className="text-muted-foreground">Checking Google index status...</p>
          </div>
        </div>
      )}

      {!isChecking && results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Index Check Results</h3>
          
          <div className="space-y-2">
            {results.map((result, index) => (
              <Card key={index}>
                <CardContent className="py-4 px-4 flex items-center justify-between">
                  <div className="flex items-center">
                    {result.isIndexed ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    )}
                    <div>
                      <div className="max-w-md truncate font-medium">{result.url}</div>
                      <div className="text-xs text-muted-foreground">
                        Checked: {formatDate(result.checkedAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    {result.isIndexed ? (
                      <span className="text-green-600 font-medium">Indexed</span>
                    ) : (
                      <span className="text-red-600 font-medium">Not Indexed</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Demo Data</p>
              <p className="text-sm">This is simulated data for demonstration purposes. In a real application, this would require API access or web scraping to check Google's index.</p>
            </div>
          </div>
        </div>
      )}

      {!isChecking && results.length === 0 && (
        <div className="bg-muted/50 border rounded-lg p-8 text-center">
          <Search className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
          <p className="text-muted-foreground">
            {activeTab === "single" 
              ? "Enter a URL and click 'Check Index Status' to see if Google has indexed it."
              : "Add URLs and click 'Check URLs' to check if Google has indexed them."}
          </p>
        </div>
      )}
    </div>
  );
};

export default GoogleIndexChecker;
