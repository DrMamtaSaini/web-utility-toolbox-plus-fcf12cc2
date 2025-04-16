
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const MetaTagGenerator = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [includeOpenGraph, setIncludeOpenGraph] = useState(true);
  const [includeTwitter, setIncludeTwitter] = useState(true);
  
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const generateMetaTags = () => {
    let metaTags = '';
    
    // Basic meta tags
    if (title) {
      metaTags += `<title>${title}</title>\n`;
      metaTags += `<meta name="title" content="${title}" />\n`;
    }
    
    if (description) {
      metaTags += `<meta name="description" content="${description}" />\n`;
    }
    
    if (keywords) {
      metaTags += `<meta name="keywords" content="${keywords}" />\n`;
    }
    
    if (author) {
      metaTags += `<meta name="author" content="${author}" />\n`;
    }
    
    // Open Graph meta tags
    if (includeOpenGraph) {
      metaTags += '\n<!-- Open Graph / Facebook -->\n';
      metaTags += `<meta property="og:type" content="website" />\n`;
      
      if (url) {
        metaTags += `<meta property="og:url" content="${url}" />\n`;
      }
      
      if (title) {
        metaTags += `<meta property="og:title" content="${title}" />\n`;
      }
      
      if (description) {
        metaTags += `<meta property="og:description" content="${description}" />\n`;
      }
      
      if (imageUrl) {
        metaTags += `<meta property="og:image" content="${imageUrl}" />\n`;
      }
    }
    
    // Twitter meta tags
    if (includeTwitter) {
      metaTags += '\n<!-- Twitter -->\n';
      metaTags += `<meta property="twitter:card" content="summary_large_image" />\n`;
      
      if (url) {
        metaTags += `<meta property="twitter:url" content="${url}" />\n`;
      }
      
      if (title) {
        metaTags += `<meta property="twitter:title" content="${title}" />\n`;
      }
      
      if (description) {
        metaTags += `<meta property="twitter:description" content="${description}" />\n`;
      }
      
      if (imageUrl) {
        metaTags += `<meta property="twitter:image" content="${imageUrl}" />\n`;
      }
    }
    
    setGeneratedCode(metaTags);
    toast.success("Meta tags generated successfully!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Meta tags copied to clipboard");
  };

  const handleClear = () => {
    setTitle('');
    setDescription('');
    setKeywords('');
    setAuthor('');
    setUrl('');
    setImageUrl('');
    setGeneratedCode('');
    toast.info("All fields cleared");
  };

  const handleFillSample = () => {
    setTitle('My Awesome Website');
    setDescription('A comprehensive description of my website with relevant keywords for better SEO.');
    setKeywords('website, web development, SEO, meta tags, HTML');
    setAuthor('John Doe');
    setUrl('https://www.example.com');
    setImageUrl('https://www.example.com/image.jpg');
    toast.info("Sample data loaded");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generator" className="w-full">
        <TabsList>
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Page Title</Label>
                    <Input 
                      id="title"
                      placeholder="Enter page title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      placeholder="Enter page description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords (comma separated)</Label>
                    <Input 
                      id="keywords"
                      placeholder="keyword1, keyword2, keyword3"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input 
                      id="author"
                      placeholder="Page author"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="url">Page URL</Label>
                    <Input 
                      id="url"
                      placeholder="https://www.example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input 
                      id="image"
                      placeholder="https://www.example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="open-graph" 
                        checked={includeOpenGraph}
                        onCheckedChange={(checked) => setIncludeOpenGraph(!!checked)}
                      />
                      <Label htmlFor="open-graph">Include Open Graph Meta Tags (Facebook)</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="twitter" 
                        checked={includeTwitter}
                        onCheckedChange={(checked) => setIncludeTwitter(!!checked)}
                      />
                      <Label htmlFor="twitter">Include Twitter Card Meta Tags</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={generateMetaTags} className="bg-blue-500 hover:bg-blue-600">
              Generate Meta Tags
            </Button>
            <Button variant="outline" onClick={handleFillSample} className="flex items-center">
              <RefreshCw size={16} className="mr-2" />
              Load Sample Data
            </Button>
            <Button variant="outline" onClick={handleClear}>Clear Fields</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-end mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  disabled={!generatedCode}
                  className="flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check size={14} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>
              
              <Textarea
                readOnly
                value={generatedCode || "Generate meta tags to see the code here..."}
                className="font-mono text-sm min-h-[400px]"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MetaTagGenerator;
