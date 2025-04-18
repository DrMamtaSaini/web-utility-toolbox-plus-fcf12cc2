
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Copy, Save } from "lucide-react";
import { toast } from "sonner";

// Add TypeScript declarations for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  error: any;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

// Define types for webkit prefix and global SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

const SpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      return;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          finalTranscript = event.results[i][0].transcript;
        }
        setTranscript((prev) => prev + ' ' + finalTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast("Error occurred during speech recognition. Please try again.");
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast("Started listening...");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      toast("Text copied to clipboard!");
    } catch (err) {
      toast("Failed to copy text to clipboard");
    }
  };

  const saveToFile = () => {
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'speech-transcript.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast("Transcript saved to file!");
  };

  if (!isSupported) {
    return (
      <div className="space-y-4">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Speech Recognition Not Supported</h2>
          <p className="text-muted-foreground">
            Unfortunately, your browser doesn't support speech recognition. 
            Please try using a modern browser like Chrome, Edge, or Safari.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Speech to Text Converter</h1>
        <p className="text-muted-foreground">
          Convert your speech into text in real-time. Click the microphone button to start/stop recording.
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <Button
              onClick={toggleListening}
              variant={isListening ? "destructive" : "default"}
              className="w-16 h-16 rounded-full"
            >
              {isListening ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
          </div>

          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your speech will appear here..."
            className="min-h-[200px]"
          />

          <div className="flex space-x-2">
            <Button
              onClick={copyToClipboard}
              variant="outline"
              disabled={!transcript}
              className="flex-1"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Text
            </Button>
            <Button
              onClick={saveToFile}
              variant="outline"
              disabled={!transcript}
              className="flex-1"
            >
              <Save className="mr-2 h-4 w-4" />
              Save to File
            </Button>
          </div>
        </div>
      </Card>

      <div className="bg-muted/30 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-2">Tips for Best Results</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Speak clearly and at a normal pace</li>
          <li>Use a good quality microphone</li>
          <li>Minimize background noise</li>
          <li>Keep the microphone at a consistent distance</li>
        </ul>
      </div>
    </div>
  );
};

export default SpeechToText;
