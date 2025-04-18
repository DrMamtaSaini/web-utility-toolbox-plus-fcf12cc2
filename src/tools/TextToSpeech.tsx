
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Download, Play, Pause, StopCircle } from "lucide-react";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        // Set default voice (preferring English)
        const englishVoice = availableVoices.find(voice => voice.lang.includes('en'));
        setSelectedVoice(englishVoice?.name || availableVoices[0].name);
      }
    };

    // Load voices initially
    loadVoices();
    
    // Voice list might be loaded asynchronously
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    // Clean up on unmount
    return () => {
      if (synth.speaking) {
        synth.cancel();
      }
    };
  }, []);

  const handleSpeak = () => {
    if (!text) {
      toast.error("Please enter some text to speak");
      return;
    }

    const synth = window.speechSynthesis;
    
    // Cancel any ongoing speech
    if (synth.speaking) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    // Set selected voice
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }

    // Set event handlers
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      toast.error("An error occurred while speaking");
      setIsSpeaking(false);
      setIsPaused(false);
    };

    // Start speaking
    synth.speak(utterance);
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    const synth = window.speechSynthesis;
    if (synth.paused) {
      synth.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const handleDownload = () => {
    if (!text) {
      toast.error("Please enter some text to convert");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Create a text file for download (since browser API can't save audio)
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement("a");
      a.href = url;
      a.download = "speech-text.txt";
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Text file downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Text to Speech Converter</h1>
        <p className="text-muted-foreground">
          Convert your text into speech using your browser's built-in text-to-speech engine.
        </p>
      </div>

      <Card className="p-6">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <Label htmlFor="voice">Voice</Label>
            <Select 
              value={selectedVoice} 
              onValueChange={setSelectedVoice}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {voices.map((voice) => (
                  <SelectItem key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="text">Text to Convert</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text you want to convert to speech..."
              className="min-h-[200px]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {!isSpeaking ? (
              <>
                <Button 
                  type="button" 
                  onClick={handleSpeak} 
                  className="flex-1"
                  disabled={!text.trim()}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Speak
                </Button>
                <Button 
                  type="button" 
                  onClick={handleDownload} 
                  variant="outline"
                  disabled={isGenerating || !text.trim()}
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isGenerating ? "Generating..." : "Download Text"}
                </Button>
              </>
            ) : (
              <>
                {isPaused ? (
                  <Button type="button" onClick={handleResume} className="flex-1">
                    <Play className="mr-2 h-4 w-4" />
                    Resume
                  </Button>
                ) : (
                  <Button type="button" onClick={handlePause} className="flex-1">
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                )}
                <Button type="button" onClick={handleStop} variant="secondary" className="flex-1">
                  <StopCircle className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              </>
            )}
          </div>
        </form>
      </Card>
      
      <div className="bg-muted/30 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-2">About Text to Speech</h3>
        <p className="text-muted-foreground">
          This tool uses your browser's built-in speech synthesis capabilities. Different browsers and devices may offer different voices and quality levels. For best results, try using Chrome or Edge browsers which typically have more voice options.
        </p>
      </div>
    </div>
  );
};

export default TextToSpeech;
