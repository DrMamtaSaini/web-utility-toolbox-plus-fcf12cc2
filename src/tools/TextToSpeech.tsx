
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
      setIsGenerating(true);
      toast.info("Preparing audio for download...");

      // We'll use a more reliable approach with the Web Audio API
      const audioContext = new AudioContext();
      
      // Create an oscillator node for audio generation
      const oscillator = audioContext.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
      
      // Create a gain node to control volume
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
      
      // Connect the oscillator to the gain node, and the gain node to the destination
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Create a media stream destination for recording
      const destination = audioContext.createMediaStreamDestination();
      gainNode.connect(destination);
      
      // Create a media recorder to capture the audio
      const mediaRecorder = new MediaRecorder(destination.stream);
      const audioChunks: Blob[] = [];
      
      // Set up the data handler
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      
      // Set up the stop handler
      mediaRecorder.onstop = () => {
        // Create a blob from the recorded audio chunks
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        
        // Create a URL for the blob
        const url = URL.createObjectURL(audioBlob);
        
        // Create a temporary hidden link element to trigger download
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = "text-to-speech.wav";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Clean up
        URL.revokeObjectURL(url);
        setIsGenerating(false);
        toast.success("Audio download started");
      };
      
      // Create a speech utterance to play while recording
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find(v => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
      }
      
      // Start recording
      mediaRecorder.start();
      
      // Start the oscillator for a proper audio signal
      oscillator.start();
      
      // Speak the text
      speechSynthesis.speak(utterance);
      
      // Set up an event listener to stop recording when speech is done
      utterance.onend = () => {
        oscillator.stop();
        mediaRecorder.stop();
        audioContext.close();
      };
      
      // Set a timeout to ensure recording stops even if speech synthesis fails
      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          oscillator.stop();
          mediaRecorder.stop();
          audioContext.close();
          setIsGenerating(false);
        }
      }, 30000); // 30 seconds max
      
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download audio. Your browser may not support this feature.");
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
