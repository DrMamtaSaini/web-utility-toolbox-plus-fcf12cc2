
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftRight, Copy } from "lucide-react";
import { toast } from "sonner";

interface Language {
  code: string;
  name: string;
}

const languages: Language[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" }
];

// Simple mock translation function for demo purposes
const mockTranslate = (text: string, from: string, to: string): string => {
  if (!text.trim()) return "";
  
  // Simple word replacements for demo
  const translations: Record<string, Record<string, string>> = {
    en: {
      es: {
        hello: "hola",
        goodbye: "adiós",
        good: "bueno",
        morning: "mañana",
        evening: "tarde",
        thank: "gracias",
        you: "tú",
        please: "por favor",
        yes: "sí",
        no: "no"
      },
      fr: {
        hello: "bonjour",
        goodbye: "au revoir",
        good: "bon",
        morning: "matin",
        evening: "soir",
        thank: "merci",
        you: "vous",
        please: "s'il vous plaît",
        yes: "oui",
        no: "non"
      }
    }
  };
  
  if (translations[from] && translations[from][to]) {
    let translatedText = text.toLowerCase();
    const wordMap = translations[from][to];
    
    Object.entries(wordMap).forEach(([eng, translated]) => {
      translatedText = translatedText.replace(
        new RegExp(`\\b${eng}\\b`, 'gi'),
        translated
      );
    });
    
    return translatedText;
  }
  
  // For unsupported language pairs, just add a note
  return text + " [Translated to " + languages.find(l => l.code === to)?.name + "]";
};

const TextTranslator = () => {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast.error("Please enter text to translate");
      return;
    }
    
    setIsTranslating(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Use our mock translation function
      const result = mockTranslate(sourceText, sourceLanguage, targetLanguage);
      setTranslatedText(result);
      toast.success("Text translated!");
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Failed to translate text");
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Copied to clipboard!");
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast.error("Failed to copy to clipboard");
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Language */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Source Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => copyToClipboard(sourceText)}
              disabled={!sourceText}
              title="Copy source text"
            >
              <Copy size={16} />
            </Button>
          </div>
          
          <Textarea
            placeholder="Enter text to translate"
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            className="min-h-[200px]"
          />
        </div>
        
        {/* Language Swap Button */}
        <div className="flex items-center justify-center h-8 md:h-auto md:justify-between">
          <Button 
            onClick={swapLanguages} 
            variant="ghost" 
            size="icon"
            className="rounded-full"
            disabled={isTranslating}
          >
            <ArrowLeftRight size={18} />
          </Button>
          
          <div className="hidden md:block">
            <Button 
              onClick={handleTranslate} 
              disabled={isTranslating || !sourceText.trim()}
            >
              {isTranslating ? "Translating..." : "Translate"}
            </Button>
          </div>
        </div>
        
        {/* Target Language */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Target Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => copyToClipboard(translatedText)}
              disabled={!translatedText}
              title="Copy translated text"
            >
              <Copy size={16} />
            </Button>
          </div>
          
          <Textarea
            placeholder="Translation will appear here"
            value={translatedText}
            readOnly
            className="min-h-[200px] bg-muted/30"
          />
        </div>
        
        {/* Mobile Translate Button */}
        <div className="md:hidden">
          <Button 
            onClick={handleTranslate} 
            disabled={isTranslating || !sourceText.trim()}
            className="w-full"
          >
            {isTranslating ? "Translating..." : "Translate"}
          </Button>
        </div>
      </div>
      
      <div className="bg-muted/30 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-2">Translation Tool Information</h3>
        <p className="mb-4 text-muted-foreground">
          This is a demo translation tool. In a production environment, it would connect to a translation API like Google Translate, DeepL, or Microsoft Translator.
        </p>
        <p className="text-sm text-muted-foreground">
          Note: Currently this tool provides simulated translations for demonstration purposes. For accurate translations in all languages, an API integration would be needed.
        </p>
      </div>
    </div>
  );
};

export default TextTranslator;
