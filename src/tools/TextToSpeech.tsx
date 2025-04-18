
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Download } from "lucide-react";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Create audio element for testing
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSpeak = () => {
    if (!text) {
      toast.error("Please enter some text to speak");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      toast.error("An error occurred while speaking");
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const handleResume = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handleDownload = () => {
    if (!text) {
      toast.error("Please enter some text to convert");
      return;
    }

    try {
      setIsGenerating(true);
      toast.info("Generating audio for download...");

      // Create a temporary audio element for speech synthesis
      const tempAudio = document.createElement('audio');
      const tempUtterance = new SpeechSynthesisUtterance(text);
      
      // Set the selected voice
      const voice = voices.find(v => v.name === selectedVoice);
      if (voice) {
        tempUtterance.voice = voice;
      }
      
      // Create a blob URL for our text content as fallback
      const textFile = new Blob([`Speech text: ${text}\nVoice: ${selectedVoice || 'Default'}`], { type: 'text/plain' });
      const textUrl = URL.createObjectURL(textFile);
      
      // Function to handle download when speech is ready
      const downloadAudio = () => {
        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = textUrl;
        downloadLink.download = "speech-text.txt";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(textUrl);
        setIsGenerating(false);
        toast.success("Text file downloaded");
      };
      
      // Set up event handlers for speech synthesis
      tempUtterance.onend = downloadAudio;
      tempUtterance.onerror = () => {
        console.error("Speech synthesis failed");
        downloadAudio(); // Fall back to text download
        setIsGenerating(false);
      };
      
      // Start speaking but muted (we just want to trigger the synthesis)
      tempUtterance.volume = 0;
      window.speechSynthesis.speak(tempUtterance);
      
      // Safety timeout in case speech synthesis doesn't fire events
      setTimeout(() => {
        if (isGenerating) {
          downloadAudio();
        }
      }, 5000);
      
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download. Downloading text instead.");
      
      // Fallback to text download
      const textFile = new Blob([`Speech text: ${text}\nVoice: ${selectedVoice || 'Default'}`], { type: 'text/plain' });
      const textUrl = URL.createObjectURL(textFile);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = textUrl;
      downloadLink.download = "speech-text.txt";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(textUrl);
      
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
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="voice">Voice</Label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger>
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
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

          <div className="flex gap-2">
            {!isSpeaking ? (
              <>
                <Button type="button" onClick={handleSpeak} className="flex-1">
                  Speak
                </Button>
                <Button 
                  type="button" 
                  onClick={handleDownload} 
                  variant="outline"
                  disabled={isGenerating}
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isGenerating ? "Generating..." : "Download"}
                </Button>
              </>
            ) : (
              <>
                {isPaused ? (
                  <Button type="button" onClick={handleResume} className="flex-1">
                    Resume
                  </Button>
                ) : (
                  <Button type="button" onClick={handlePause} className="flex-1">
                    Pause
                  </Button>
                )}
                <Button type="button" onClick={handleStop} variant="secondary" className="flex-1">
                  Stop
                </Button>
              </>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TextToSpeech;
