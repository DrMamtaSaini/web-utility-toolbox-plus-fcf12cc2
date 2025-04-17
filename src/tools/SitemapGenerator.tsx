
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";
import { Copy, Download } from 'lucide-react';

const SitemapGenerator = () => {
  const [url, setUrl] = useState('');
  const [pages, setPages] = useState('');
  const [includeImages, setIncludeImages] = useState(false);
  const [includePriority, setIncludePriority] = useState(false);
  const [sitemapXml, setSitemapXml] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const validateUrl = (inputUrl: string) => {
    try {
      // Add protocol if missing
      let processedUrl = inputUrl;
      if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
        processedUrl = 'https://' + inputUrl;
      }
      
      const url = new URL(processedUrl);
      return url.origin;
    } catch (error) {
      return null;
    }
  };

  const generateSitemap = () => {
    if (!url.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    const baseUrl = validateUrl(url);
    if (!baseUrl) {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsGenerating(true);

    try {
      // Start XML
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
      
      if (includeImages) {
        xml += '\n    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';
      }
      
      xml += '>\n';

      // Add homepage
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/</loc>\n`;
      if (includePriority) {
        xml += '    <priority>1.0</priority>\n';
        xml += '    <changefreq>weekly</changefreq>\n';
      }
      xml += '  </url>\n';

      // Process additional pages
      if (pages.trim()) {
        const pageList = pages.split('\n').filter(page => page.trim() !== '');
        
        pageList.forEach((page, index) => {
          let pagePath = page.trim();
          
          // Remove leading slash if present
          if (pagePath.startsWith('/')) {
            pagePath = pagePath.substring(1);
          }
          
          xml += '  <url>\n';
          xml += `    <loc>${baseUrl}/${pagePath}</loc>\n`;
          
          if (includePriority) {
            // Decrease priority for deeper pages
            const priority = Math.max(0.5, 0.9 - (index * 0.1)).toFixed(1);
            xml += `    <priority>${priority}</priority>\n`;
            xml += '    <changefreq>monthly</changefreq>\n';
          }
          
          if (includeImages) {
            xml += '    <image:image>\n';
            xml += `      <image:loc>${baseUrl}/image-${index + 1}.jpg</image:loc>\n`;
            xml += '    </image:image>\n';
          }
          
          xml += '  </url>\n';
        });
      }

      // End XML
      xml += '</urlset>';

      setSitemapXml(xml);
      toast.success("Sitemap generated successfully");
    } catch (error) {
      toast.error("Error generating sitemap");
      console.error("Error generating sitemap:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!sitemapXml) return;
    
    navigator.clipboard.writeText(sitemapXml)
      .then(() => toast.success("Sitemap copied to clipboard"))
      .catch(() => toast.error("Failed to copy to clipboard"));
  };

  const downloadSitemap = () => {
    if (!sitemapXml) return;
    
    const blob = new Blob([sitemapXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Sitemap downloaded");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url">Website URL</Label>
          <Input
            id="url"
            placeholder="e.g., example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Enter your website URL without http:// or https://
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pages">Pages (one per line)</Label>
          <Textarea
            id="pages"
            placeholder="about\ncontact\nblog/post-1"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            rows={5}
          />
          <p className="text-sm text-muted-foreground">
            Enter each page URL path relative to the main domain, one per line
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="include-images" 
              checked={includeImages} 
              onCheckedChange={(checked) => setIncludeImages(!!checked)} 
            />
            <Label htmlFor="include-images">Include image tags</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="include-priority" 
              checked={includePriority} 
              onCheckedChange={(checked) => setIncludePriority(!!checked)} 
            />
            <Label htmlFor="include-priority">Include priority and change frequency</Label>
          </div>
        </div>

        <Button 
          onClick={generateSitemap} 
          className="w-full"
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Sitemap'}
        </Button>
      </div>

      {sitemapXml && (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Label htmlFor="result">Generated Sitemap</Label>
              <div className="mt-2 p-4 bg-muted rounded-md overflow-auto max-h-96">
                <pre className="text-xs whitespace-pre-wrap">{sitemapXml}</pre>
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
            <Button 
              onClick={downloadSitemap} 
              className="w-1/2"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Sitemap
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SitemapGenerator;
