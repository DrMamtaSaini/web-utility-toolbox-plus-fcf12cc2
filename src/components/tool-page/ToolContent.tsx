
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Tool } from "@/data/tools";

// Tool imports
import WordCounter from "@/tools/WordCounter";
import ImageToPng from "@/tools/ImageToPng";
import ImageToJpg from "@/tools/ImageToJpg";
import ImageResizer from "@/tools/ImageResizer";
import ImageCompressor from "@/tools/ImageCompressor";
import JsonFormatter from "@/tools/JsonFormatter";
import PasswordGenerator from "@/tools/PasswordGenerator";
import MetaTagGenerator from "@/tools/MetaTagGenerator";

interface ToolContentProps {
  toolId: string;
  tool: Tool;
}

export const ToolContent = ({ toolId, tool }: ToolContentProps) => {
  const renderToolComponent = () => {
    switch(toolId) {
      case 'word-counter':
        return <WordCounter />;
      case 'image-to-png':
        return <ImageToPng />;
      case 'image-to-jpg':
        return <ImageToJpg />;
      case 'image-resizer':
        return <ImageResizer />;
      case 'image-compressor':
        return <ImageCompressor />;
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
  
  return (
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
  );
};
