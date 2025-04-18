
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { toast } from "sonner";

const PlagiarismChecker = () => {
  const [text, setText] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const calculateSimilarity = (str1: string, str2: string): number => {
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    const intersection = new Set([...set1].filter(word => set2.has(word)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  };

  const checkPlagiarism = async () => {
    if (!text.trim()) {
      toast("Please enter some text to check");
      return;
    }

    setIsChecking(true);
    
    try {
      // This is a basic implementation. In a real application, you would:
      // 1. Call an API to check against a database of content
      // 2. Use more sophisticated algorithms for text comparison
      // 3. Check against multiple sources
      
      // For demo purposes, we'll just compare against some sample texts
      const sampleTexts = [
        "This is a sample text that we'll use to demonstrate plagiarism checking.",
        "Another example text that might have some similarities with user input.",
        "A completely different text with unique content and words."
      ];

      const similarities = sampleTexts.map(sample => ({
        text: sample,
        similarity: calculateSimilarity(text, sample)
      }));

      const maxSimilarity = Math.max(...similarities.map(s => s.similarity));
      
      if (maxSimilarity > 0.5) {
        toast("High similarity detected! The text might be plagiarized.");
      } else if (maxSimilarity > 0.3) {
        toast("Moderate similarity detected. Some phrases might be common.");
      } else {
        toast("Low similarity detected. The text appears to be original.");
      }
      
    } catch (error) {
      console.error('Error checking plagiarism:', error);
      toast("Error checking plagiarism. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Plagiarism Checker</h1>
        <p className="text-muted-foreground">
          Check your text for potential plagiarism. Please note that this is a basic demonstration
          and should not be used as a definitive plagiarism checker.
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the text you want to check for plagiarism..."
            className="min-h-[200px]"
          />

          <Button 
            onClick={checkPlagiarism} 
            disabled={isChecking || !text.trim()}
            className="w-full"
          >
            <Search className="mr-2 h-4 w-4" />
            {isChecking ? "Checking..." : "Check for Plagiarism"}
          </Button>
        </div>
      </Card>

      <div className="bg-muted/30 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-2">About This Tool</h3>
        <p className="text-muted-foreground">
          This is a basic demonstration of plagiarism detection using text similarity comparison.
          For accurate plagiarism checking, consider using professional services that:
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2 text-muted-foreground">
          <li>Check against vast databases of content</li>
          <li>Use advanced algorithms for text analysis</li>
          <li>Provide detailed similarity reports</li>
          <li>Check against academic papers and publications</li>
        </ul>
      </div>
    </div>
  );
};

export default PlagiarismChecker;
