
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Default voices from ElevenLabs
const voices = [
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah" },
  { id: "N2lVS1w4EtoT3dr4eOWO", name: "Callum" },
  { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam" },
  { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte" },
  { id: "Xb7hH8MSUJpSbSDYk0k2", name: "Alice" },
];

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState(voices[0].id);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey) {
      toast.error("Please enter your ElevenLabs API key");
      return;
    }

    if (!text) {
      toast.error("Please enter some text to convert");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + voice, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to convert text to speech");
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      toast.success("Text converted to speech successfully!");
    } catch (error) {
      toast.error("Failed to convert text to speech. Please check your API key and try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Text to Speech Converter</h1>
        <p className="text-muted-foreground">
          Convert your text into natural-sounding speech using ElevenLabs AI technology.
        </p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You need an ElevenLabs API key to use this tool. Get one at{" "}
          <a
            href="https://elevenlabs.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            elevenlabs.io
          </a>
        </AlertDescription>
      </Alert>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">ElevenLabs API Key</Label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your API key"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="voice">Voice</Label>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger>
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name}
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

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Converting..." : "Convert to Speech"}
          </Button>
        </form>
      </Card>

      {audioUrl && (
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Generated Audio</h2>
            <audio controls className="w-full" src={audioUrl}>
              Your browser does not support the audio element.
            </audio>
            <Button
              variant="outline"
              onClick={() => {
                const a = document.createElement("a");
                a.href = audioUrl;
                a.download = "speech.mp3";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
            >
              Download Audio
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TextToSpeech;
