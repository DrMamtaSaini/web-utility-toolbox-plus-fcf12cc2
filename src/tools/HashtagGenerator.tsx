
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Hash, Copy, CheckCircle, Loader2, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HashtagGenerator = () => {
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("generator");
  
  // Predefined popular hashtags by category
  const popularHashtags: Record<string, string[]> = {
    photography: ["#photography", "#photooftheday", "#photographer", "#naturephotography", "#travelphotography", "#portraitphotography", "#landscapephotography", "#photoshoot", "#photo", "#canon", "#streetphotography", "#picoftheday"],
    travel: ["#travel", "#travelgram", "#travelphotography", "#instatravel", "#traveling", "#travelblogger", "#wanderlust", "#traveltheworld", "#adventure", "#exploremore", "#travelholic", "#traveladdict"],
    fashion: ["#fashion", "#style", "#fashionblogger", "#ootd", "#fashionista", "#fashionstyle", "#streetstyle", "#outfitoftheday", "#instafashion", "#fashionable", "#lookoftheday", "#styleblogger"],
    food: ["#food", "#foodporn", "#foodie", "#instafood", "#foodphotography", "#foodstagram", "#foodblogger", "#foodlover", "#delicious", "#homemade", "#yummy", "#healthyfood"],
    fitness: ["#fitness", "#workout", "#gym", "#fitnessmotivation", "#fit", "#training", "#health", "#motivation", "#bodybuilding", "#lifestyle", "#exercise", "#healthylifestyle"],
    beauty: ["#beauty", "#makeup", "#skincare", "#beautiful", "#makeupartist", "#mua", "#cosmetics", "#instamakeup", "#beautyblogger", "#lashes", "#lipstick", "#glam"],
    business: ["#business", "#entrepreneur", "#entrepreneurship", "#smallbusiness", "#marketing", "#success", "#motivation", "#startup", "#entrepreneurlife", "#businessowner", "#leadership", "#hustle"],
    technology: ["#technology", "#tech", "#innovation", "#programming", "#coding", "#developer", "#computer", "#engineering", "#software", "#data", "#ai", "#machinelearning"],
    art: ["#art", "#artist", "#artwork", "#illustration", "#painting", "#drawing", "#design", "#creative", "#digitalart", "#artistsoninstagram", "#contemporaryart", "#sketch"],
    music: ["#music", "#musician", "#singer", "#songwriter", "#guitar", "#band", "#hiphop", "#rap", "#producer", "#dj", "#livemusic", "#musicproducer"]
  };

  // Generate hashtags based on topic and keywords
  const generateHashtags = () => {
    if (!topic && !keywords) {
      toast({
        title: "Error",
        description: "Please enter a topic or keywords to generate hashtags",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      try {
        // Basic algorithm to generate hashtags based on input
        // In a real app, this would be an API call to a more sophisticated service
        const topicWords = topic.toLowerCase().split(/\s+/).filter(Boolean);
        const keywordList = keywords.toLowerCase().split(/,|\s+/).filter(Boolean);
        
        // Combine and deduplicate
        const allWords = [...new Set([...topicWords, ...keywordList])];
        
        // Generate basic hashtags from input words
        const basicHashtags = allWords.map(word => `#${word.replace(/[^\w]/g, '')}`);
        
        // Add some variations
        const variations = allWords.map(word => {
          const w = word.replace(/[^\w]/g, '');
          return [
            `#${w}s`,
            `#${w}ing`, 
            `#${w}life`,
            `#${w}lover`,
            `#${w}daily`,
          ];
        }).flat();
        
        // Find related popular hashtags
        let relatedPopularHashtags: string[] = [];
        
        // Check if the topic matches any category
        Object.entries(popularHashtags).forEach(([category, hashtags]) => {
          if (
            allWords.some(word => 
              category.includes(word) || 
              word.includes(category)
            )
          ) {
            relatedPopularHashtags = [...relatedPopularHashtags, ...hashtags];
          }
        });
        
        // Combine, deduplicate and take a reasonable number of hashtags
        const combined = [...new Set([...basicHashtags, ...variations, ...relatedPopularHashtags])];
        const filtered = combined
          .filter(tag => tag.length > 2) // Remove very short hashtags
          .slice(0, 25); // Limit to 25 hashtags
        
        setGeneratedHashtags(filtered);
      } catch (error) {
        console.error("Error generating hashtags:", error);
        toast({
          title: "Error",
          description: "Failed to generate hashtags. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    }, 1200); // Simulated delay
  };

  // Copy hashtags to clipboard
  const copyToClipboard = () => {
    if (generatedHashtags.length > 0) {
      navigator.clipboard.writeText(generatedHashtags.join(" "));
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Hashtags copied to clipboard",
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full space-y-6"
    >
      <TabsList className="mb-4">
        <TabsTrigger value="generator">Generator</TabsTrigger>
        <TabsTrigger value="popular">Popular Hashtags</TabsTrigger>
        <TabsTrigger value="tips">Tips & Best Practices</TabsTrigger>
      </TabsList>
      
      <TabsContent value="generator" className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="Enter the main topic (e.g., travel, food, fashion)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="keywords">Keywords (optional)</Label>
            <Input
              id="keywords"
              placeholder="Enter related keywords, separated by commas"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>
        </div>
        
        <Button
          onClick={generateHashtags}
          disabled={isGenerating || (!topic && !keywords)}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Hashtags...
            </>
          ) : (
            <>
              <Hash className="mr-2 h-4 w-4" />
              Generate Hashtags
            </>
          )}
        </Button>
        
        {generatedHashtags.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Generated Hashtags</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy All
                  </>
                )}
              </Button>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex flex-wrap gap-2">
                {generatedHashtags.map((hashtag, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {hashtag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{generatedHashtags.length} hashtags generated</span>
              <span>Recommended: 15-30 hashtags per post</span>
            </div>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="popular" className="space-y-4">
        <p className="text-muted-foreground mb-4">
          Browse popular hashtags by category to improve your social media reach.
        </p>
        
        <div className="space-y-6">
          {Object.entries(popularHashtags).map(([category, hashtags]) => (
            <Card key={category} className="p-4">
              <h3 className="font-semibold text-lg capitalize mb-3 flex items-center">
                <Zap className="h-4 w-4 mr-2 text-primary" />
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {hashtags.map((hashtag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(hashtag);
                      toast({
                        title: "Copied!",
                        description: `${hashtag} copied to clipboard`,
                      });
                    }}
                  >
                    {hashtag}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="tips" className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Hashtag Best Practices</h3>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-medium">Mix Popular and Niche Hashtags</h4>
              <p className="text-muted-foreground text-sm">Use a combination of popular hashtags (high volume) and niche hashtags (lower competition) for best results.</p>
            </div>
            
            <div>
              <h4 className="font-medium">Platform-Specific Recommendations</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Instagram: 5-15 relevant hashtags</li>
                <li>Twitter: 1-2 hashtags</li>
                <li>LinkedIn: 3-5 professional hashtags</li>
                <li>Facebook: 1-3 hashtags</li>
                <li>TikTok: 3-5 trending hashtags</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium">Avoid Banned or Overused Hashtags</h4>
              <p className="text-muted-foreground text-sm">Some hashtags might be shadowbanned or overused. Research and rotate your hashtags regularly.</p>
            </div>
            
            <div>
              <h4 className="font-medium">Create a Branded Hashtag</h4>
              <p className="text-muted-foreground text-sm">Develop a unique branded hashtag for your business to increase brand recognition and track user-generated content.</p>
            </div>
            
            <div>
              <h4 className="font-medium">Research Competitors</h4>
              <p className="text-muted-foreground text-sm">Look at what hashtags your competitors and industry influencers are using successfully.</p>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default HashtagGenerator;
