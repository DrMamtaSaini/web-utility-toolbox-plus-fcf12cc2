
import { useState, useEffect } from "react";
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
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

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

    return () => {
      window.speechSynthesis.cancel();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
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

  const handleDownload = async () => {
    if (!text) {
      toast.error("Please enter some text to convert");
      return;
    }

    try {
      // Create a MediaRecorder to capture the audio
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const mediaStreamDestination = audioContext.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream);
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        
        // Create a temporary link and trigger download
        const a = document.createElement("a");
        a.href = url;
        a.download = "text-to-speech.wav";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Clean up
        URL.revokeObjectURL(url);
      };

      // Start recording
      mediaRecorder.start();

      // Speak the text
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find(v => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        mediaRecorder.stop();
      };

      window.speechSynthesis.speak(utterance);

    } catch (error) {
      toast.error("Failed to download audio file");
      console.error("Download error:", error);
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
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
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
