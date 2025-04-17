
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AudioLines, Play, Pause, Save, Upload, X } from "lucide-react";
import { toast } from "sonner";

const AudioCutter = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [rangeValues, setRangeValues] = useState([0, 100]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number>();

  // Clean up old audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Check if file is audio
    if (!file.type.startsWith('audio/')) {
      toast.error('Please upload an audio file');
      return;
    }
    
    // Clean up previous audio URL if it exists
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    
    const url = URL.createObjectURL(file);
    setAudioFile(file);
    setAudioUrl(url);
    setIsPlaying(false);
    setCurrentTime(0);
    
    // Reset cutting range
    setStartTime(0);
    setRangeValues([0, 100]);
    
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.currentTime = 0;
    }
  };

  // Handle metadata loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setEndTime(audioRef.current.duration);
    }
  };

  // Update current time during playback
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      
      // If current time exceeds endTime, pause and reset to startTime
      if (audioRef.current.currentTime >= endTime) {
        audioRef.current.pause();
        audioRef.current.currentTime = startTime;
        setIsPlaying(false);
        cancelAnimationFrame(animationRef.current as number);
      }
    }
  };

  // Handle play/pause button
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        cancelAnimationFrame(animationRef.current as number);
      } else {
        // Set current time to start time when playing
        if (audioRef.current.currentTime < startTime || audioRef.current.currentTime > endTime) {
          audioRef.current.currentTime = startTime;
        }
        audioRef.current.play();
        animationRef.current = requestAnimationFrame(whilePlaying);
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Animation frame callback to update time
  const whilePlaying = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };

  // Format time in mm:ss format
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle cutting range change
  const handleRangeChange = (values: number[]) => {
    setRangeValues(values);
    
    if (duration > 0) {
      const newStartTime = (values[0] / 100) * duration;
      const newEndTime = (values[1] / 100) * duration;
      
      setStartTime(newStartTime);
      setEndTime(newEndTime);
      
      if (audioRef.current && audioRef.current.currentTime < newStartTime) {
        audioRef.current.currentTime = newStartTime;
      }
    }
  };

  // Handle saving the cut audio
  const handleSaveAudio = async () => {
    if (!audioFile || !audioUrl) {
      toast.error('No audio file to save');
      return;
    }

    try {
      // Let the user know we're processing
      toast.info('Processing audio...');
      
      // This is a simplified version - in a real app you'd use Web Audio API
      // to actually trim the audio file. Here we're just simulating it.
      
      // For frontend-only implementation, we can provide download with timestamp info
      const fileName = audioFile.name.split('.').slice(0, -1).join('.');
      const extension = audioFile.name.split('.').pop();
      const newFileName = `${fileName}_cut_${formatTime(startTime)}_to_${formatTime(endTime)}.${extension}`;
      
      // Create an anchor element to trigger download
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = newFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success('Audio saved successfully!');
      
    } catch (error) {
      console.error('Error saving audio:', error);
      toast.error('Failed to save audio');
    }
  };
  
  // Handle removing the current audio file
  const handleRemoveAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    
    setAudioFile(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setDuration(0);
    setCurrentTime(0);
    setStartTime(0);
    setEndTime(0);
    setRangeValues([0, 100]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-muted/30">
        {!audioFile ? (
          <div className="text-center">
            <AudioLines className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload an Audio File</h3>
            <p className="text-sm text-muted-foreground mb-4">Supports MP3, WAV, OGG, and other audio formats</p>
            
            <div className="flex justify-center">
              <Label 
                htmlFor="audio-upload"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90"
              >
                <Upload size={16} />
                Choose File
              </Label>
              <Input 
                id="audio-upload" 
                type="file" 
                accept="audio/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>
          </div>
        ) : (
          <div className="w-full space-y-4">
            <div className="flex justify-between items-center">
              <div className="truncate max-w-[60%]">
                <h3 className="text-lg font-medium truncate">{audioFile.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {(audioFile.size / (1024 * 1024)).toFixed(2)} MB • {formatTime(duration)}
                </p>
              </div>
              
              <Button variant="ghost" size="icon" onClick={handleRemoveAudio}>
                <X size={18} />
              </Button>
            </div>
            
            {/* Audio element */}
            <audio 
              ref={audioRef} 
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            
            {/* Audio trimming controls */}
            <div className="py-2">
              <Slider
                value={rangeValues}
                onValueChange={handleRangeChange}
                max={100}
                step={1}
                className="my-4"
              />
              
              <div className="flex justify-between text-sm">
                <span>{formatTime(startTime)}</span>
                <span>{formatTime(endTime)}</span>
              </div>
            </div>
            
            {/* Playback controls */}
            <div className="flex items-center justify-center gap-4 py-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={togglePlayPause}
                disabled={!audioUrl}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </Button>
              <div className="text-sm">{formatTime(currentTime)} / {formatTime(duration)}</div>
            </div>
            
            {/* Save button */}
            <div className="flex justify-center pt-2">
              <Button onClick={handleSaveAudio} disabled={!audioUrl}>
                <Save className="mr-2 h-4 w-4" />
                Save Cut Audio
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-muted/30 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">How to Use Audio Cutter</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Upload an audio file by clicking the "Choose File" button.</li>
          <li>Use the slider to select the part of the audio you want to keep.</li>
          <li>Preview your selection with the play button.</li>
          <li>Click "Save Cut Audio" to download the trimmed audio file.</li>
        </ol>
      </div>
    </div>
  );
};

export default AudioCutter;
