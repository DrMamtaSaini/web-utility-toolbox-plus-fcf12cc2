
import { Link } from "react-router-dom";
import { ChevronRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tool } from "@/data/tools";
import { useState } from "react";

interface ToolHeaderProps {
  tool: Tool;
}

export const ToolHeader = ({ tool }: ToolHeaderProps) => {
  const [copied, setCopied] = useState(false);
  const categoryId = tool.category.toLowerCase().replace(/\s+/g, "-");
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
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
  );
};
