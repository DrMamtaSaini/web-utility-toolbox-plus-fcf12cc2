
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface KeywordResult {
  keyword: string;
  count: number;
  density: number;
}

const KeywordDensityChecker = () => {
  const [content, setContent] = useState('');
  const [minKeywordLength, setMinKeywordLength] = useState(3);
  const [minOccurrences, setMinOccurrences] = useState(2);
  const [excludedWords, setExcludedWords] = useState('the,and,for,with,this,that,are,was,not,you,have,from,they,will,would,could,should,there,their,been,when,who,what,where,why,how');
  const [keywordResults, setKeywordResults] = useState<KeywordResult[]>([]);
  const [totalWords, setTotalWords] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  const analyzeContent = () => {
    if (!content.trim()) {
      toast.error("Please enter some content to analyze");
      return;
    }

    setIsAnalyzing(true);

    // Count total words
    const wordCount = content.trim().split(/\s+/).length;
    setTotalWords(wordCount);

    // Create excluded words array
    const excludedWordsArray = excludedWords
      .toLowerCase()
      .split(',')
      .map(word => word.trim());

    // Create word frequency map
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/) // Split by whitespace
      .filter(word => 
        word.length >= minKeywordLength && 
        !excludedWordsArray.includes(word)
      );

    const wordMap = new Map<string, number>();
    
    words.forEach(word => {
      wordMap.set(word, (wordMap.get(word) || 0) + 1);
    });

    // Create results
    const results: KeywordResult[] = [];
    
    wordMap.forEach((count, keyword) => {
      if (count >= minOccurrences) {
        const density = (count / wordCount) * 100;
        results.push({
          keyword,
          count,
          density: parseFloat(density.toFixed(2))
        });
      }
    });

    // Sort by frequency
    results.sort((a, b) => b.count - a.count);
    
    setKeywordResults(results);
    setIsAnalyzing(false);
    
    if (results.length > 0) {
      toast.success("Content analyzed successfully");
    } else {
      toast.info("No keywords matching your criteria were found");
    }
  };

  const handleClear = () => {
    setContent('');
    setKeywordResults([]);
    setTotalWords(0);
    toast.info("All fields cleared");
  };

  const handleSampleContent = () => {
    const sampleText = "Search engine optimization (SEO) is the process of improving the quality and quantity of website traffic to a website or a web page from search engines. SEO targets unpaid traffic rather than direct traffic or paid traffic. The practice of SEO can involve techniques such as keyword research, content creation, link building, and technical website optimization. Understanding keyword density is crucial for content optimization. Keywords should be distributed naturally throughout your content. Overusing keywords can lead to keyword stuffing, which search engines may penalize. Focus on creating valuable content that naturally incorporates keywords.";
    setContent(sampleText);
    toast.info("Sample content loaded");
  };

  const copyToClipboard = () => {
    // Create a formatted text representation of the results
    let resultText = `Keyword Density Analysis\n`;
    resultText += `Total Words: ${totalWords}\n\n`;
    resultText += `Keyword | Count | Density (%)\n`;
    resultText += `---------------------------\n`;
    
    keywordResults.forEach(result => {
      resultText += `${result.keyword} | ${result.count} | ${result.density}%\n`;
    });
    
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Results copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="input" className="w-full">
        <TabsList>
          <TabsTrigger value="input">Input</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="results" disabled={keywordResults.length === 0}>Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="input" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Enter your content</Label>
                  <Textarea 
                    id="content"
                    placeholder="Paste your content here to analyze keyword density..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[300px]"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={analyzeContent}
                    disabled={isAnalyzing || !content.trim()}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
                  </Button>
                  
                  <Button variant="outline" onClick={handleSampleContent}>
                    <RefreshCw size={16} className="mr-2" />
                    Load Sample
                  </Button>
                  
                  <Button variant="outline" onClick={handleClear}>
                    Clear Content
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="min-length">Minimum Keyword Length</Label>
                  <Input 
                    id="min-length"
                    type="number"
                    min={1}
                    max={20}
                    value={minKeywordLength}
                    onChange={(e) => setMinKeywordLength(Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="min-occurrences">Minimum Occurrences</Label>
                  <Input 
                    id="min-occurrences"
                    type="number"
                    min={1}
                    max={100}
                    value={minOccurrences}
                    onChange={(e) => setMinOccurrences(Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="excluded-words">Excluded Words (comma separated)</Label>
                  <Textarea 
                    id="excluded-words"
                    value={excludedWords}
                    onChange={(e) => setExcludedWords(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {keywordResults.length > 0 ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Words: <strong>{totalWords}</strong></span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
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
                            Copy Results
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Keyword</TableHead>
                          <TableHead className="text-right">Count</TableHead>
                          <TableHead className="text-right">Density (%)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {keywordResults.map((result, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{result.keyword}</TableCell>
                            <TableCell className="text-right">{result.count}</TableCell>
                            <TableCell className="text-right">{result.density}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    No analysis results yet. Analyze your content first.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KeywordDensityChecker;
