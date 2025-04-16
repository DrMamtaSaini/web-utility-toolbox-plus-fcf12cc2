
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdBanner from '@/components/ads/AdBanner';
import { tools } from '@/data/tools';
import { ChevronRight, ChevronLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

// Example tool implementations
import WordCounter from '@/tools/WordCounter';
import ImageToPng from '@/tools/ImageToPng';
import JsonFormatter from '@/tools/JsonFormatter';
import PasswordGenerator from '@/tools/PasswordGenerator';
import MetaTagGenerator from '@/tools/MetaTagGenerator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = tools.find(t => t.id === toolId);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [toolId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderToolComponent = () => {
    switch(toolId) {
      case 'word-counter':
        return <WordCounter />;
      case 'image-to-png':
        return <ImageToPng />;
      case 'json-formatter':
        return <JsonFormatter />;
      case 'password-generator':
        return <PasswordGenerator />;
      case 'meta-tag-generator':
        return <MetaTagGenerator />;
      default:
        return (
          <div className="text-center py-10">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This tool is under development. Check back soon!
              </AlertDescription>
            </Alert>
            <div className="mt-6">
              <p className="text-muted-foreground">
                We're working hard to implement this tool. In the meantime, check out our other available tools.
              </p>
            </div>
          </div>
        );
    }
  };

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Tool Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The tool you are looking for does not exist or has been moved.
            </p>
            <Button asChild>
              <Link to="/">
                <ChevronLeft size={16} className="mr-1" /> Back to Home
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryId = tool.category.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-muted py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center mb-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
              <ChevronRight size={14} className="mx-2 text-muted-foreground" />
              <Link to={`/category/${categoryId}`} className="text-muted-foreground hover:text-foreground">{tool.category}</Link>
              <ChevronRight size={14} className="mx-2 text-muted-foreground" />
              <span className="text-foreground font-medium">{tool.title}</span>
            </div>
            
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{tool.title}</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                  {tool.description}
                </p>
              </div>
              
              <Button variant="outline" className="flex items-center" onClick={copyToClipboard}>
                <Share2 size={16} className="mr-2" />
                {copied ? 'Link Copied!' : 'Share Tool'}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 mt-8">
          <AdBanner />
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="tool" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="tool">Use Tool</TabsTrigger>
              <TabsTrigger value="howto">How to Use</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tool">
              <Card className="p-6">
                {renderToolComponent()}
              </Card>
            </TabsContent>
            
            <TabsContent value="howto">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">How to Use {tool.title}</h2>
                <ol className="list-decimal list-inside space-y-2 mb-4">
                  <li>Start by entering your data or uploading your file in the tool area.</li>
                  <li>Adjust any settings or parameters according to your needs.</li>
                  <li>Click the process button to run the tool.</li>
                  <li>View the results and download or copy as needed.</li>
                </ol>
                <p>This tool is completely free and works directly in your browser. No data is sent to our servers.</p>
              </Card>
            </TabsContent>
            
            <TabsContent value="faq">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-1">Is this tool free to use?</h3>
                    <p className="text-muted-foreground">Yes, this tool is completely free to use without any limitations.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Is my data safe?</h3>
                    <p className="text-muted-foreground">All processing happens in your browser. We don't upload or store your files or data on our servers.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Can I use this tool on mobile devices?</h3>
                    <p className="text-muted-foreground">Yes, all our tools are fully responsive and work on desktop, tablets, and mobile phones.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">How accurate is this tool?</h3>
                    <p className="text-muted-foreground">We strive to provide the most accurate results possible, using industry-standard algorithms and methods.</p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="container mx-auto px-4 my-8">
          <AdBanner />
        </div>

        {/* Related Tools */}
        <section className="container mx-auto px-4 my-12">
          <h2 className="text-2xl font-bold mb-6">Related Tools</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tools
              .filter(t => t.category === tool.category && t.id !== tool.id)
              .slice(0, 4)
              .map(relatedTool => (
                <Link 
                  key={relatedTool.id}
                  to={`/tools/${relatedTool.id}`}
                  className="block p-6 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mr-3">
                      {relatedTool.icon}
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{relatedTool.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedTool.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ToolPage;
