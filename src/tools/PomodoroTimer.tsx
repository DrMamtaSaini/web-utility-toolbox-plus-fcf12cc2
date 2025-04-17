
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { AlarmClock, Play, Pause, SkipForward, RefreshCw, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

// Timer types
type TimerType = "work" | "shortBreak" | "longBreak";
type TimerSettings = Record<TimerType, number>;

// Default timer settings (in minutes)
const DEFAULT_SETTINGS: TimerSettings = {
  work: 25,
  shortBreak: 5,
  longBreak: 15
};

const PomodoroTimer = () => {
  const [settings, setSettings] = useState<TimerSettings>({ ...DEFAULT_SETTINGS });
  const [currentTimer, setCurrentTimer] = useState<TimerType>("work");
  const [timeLeft, setTimeLeft] = useState(settings.work * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomoCount, setPomoCount] = useState(0);
  const [enableNotifications, setEnableNotifications] = useState(false);
  const [enableSounds, setEnableSounds] = useState(false);
  const [notificationsPermission, setNotificationsPermission] = useState<NotificationPermission | null>(null);
  const [editingSettings, setEditingSettings] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize timer and check notification permission
  useEffect(() => {
    // Check if notifications are supported
    if ("Notification" in window) {
      setNotificationsPermission(Notification.permission);
    }
    
    // Initialize audio element
    audioRef.current = new Audio("/notification-sound.mp3");  // You'll need to add this sound file
    
    return () => {
      // Cleanup timer on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Reload timer when settings or current timer type changes
  useEffect(() => {
    setTimeLeft(settings[currentTimer] * 60);
  }, [settings, currentTimer]);
  
  // Timer countdown logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning]);

  // Handle timer completion
  const handleTimerComplete = () => {
    // Play sound if enabled
    if (enableSounds && audioRef.current) {
      audioRef.current.play().catch(err => console.error("Error playing sound:", err));
    }
    
    // Show notification if enabled and permission granted
    if (enableNotifications && notificationsPermission === "granted") {
      const title = currentTimer === "work" ? "Break Time!" : "Time to Focus!";
      const message = currentTimer === "work" ? "Great job! Take a break." : "Break's over. Back to work!";
      
      new Notification(title, {
        body: message,
        icon: "/favicon.ico"
      });
    } else {
      // Show toast notification instead
      toast.success(
        currentTimer === "work" ? "Work session complete! Time for a break." : "Break's over! Time to focus.",
        { duration: 5000 }
      );
    }
    
    // Stop the timer
    setIsRunning(false);
    
    // Move to next timer phase
    if (currentTimer === "work") {
      // Increment pomodoro count after work session
      const newCount = pomoCount + 1;
      setPomoCount(newCount);
      
      // Every 4 pomodoros, take a long break
      if (newCount % 4 === 0) {
        setCurrentTimer("longBreak");
        setTimeLeft(settings.longBreak * 60);
      } else {
        setCurrentTimer("shortBreak");
        setTimeLeft(settings.shortBreak * 60);
      }
    } else {
      // After any break, go back to work
      setCurrentTimer("work");
      setTimeLeft(settings.work * 60);
    }
  };
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Toggle play/pause
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };
  
  // Skip to next timer
  const skipTimer = () => {
    if (isRunning) {
      setIsRunning(false);
    }
    
    // Logic to determine the next timer
    if (currentTimer === "work") {
      if ((pomoCount + 1) % 4 === 0) {
        setCurrentTimer("longBreak");
        setTimeLeft(settings.longBreak * 60);
      } else {
        setCurrentTimer("shortBreak");
        setTimeLeft(settings.shortBreak * 60);
      }
      setPomoCount(pomoCount + 1);
    } else {
      setCurrentTimer("work");
      setTimeLeft(settings.work * 60);
    }
    
    toast.info("Skipped to next timer");
  };
  
  // Reset timer
  const resetTimer = () => {
    if (isRunning) {
      setIsRunning(false);
    }
    setTimeLeft(settings[currentTimer] * 60);
    toast.info("Timer reset");
  };
  
  // Reset all progress
  const resetAll = () => {
    if (isRunning) {
      setIsRunning(false);
    }
    setCurrentTimer("work");
    setTimeLeft(settings.work * 60);
    setPomoCount(0);
    toast.info("All progress reset");
  };
  
  // Request notification permission
  const requestNotificationPermission = () => {
    if (!("Notification" in window)) {
      toast.error("This browser does not support desktop notifications");
      return;
    }
    
    Notification.requestPermission().then(permission => {
      setNotificationsPermission(permission);
      
      if (permission === "granted") {
        setEnableNotifications(true);
        toast.success("Notifications enabled!");
      } else {
        toast.error("Notification permission denied");
        setEnableNotifications(false);
      }
    });
  };
  
  // Handle notifications toggle
  const handleNotificationsToggle = (checked: boolean) => {
    if (checked && notificationsPermission !== "granted") {
      requestNotificationPermission();
    } else {
      setEnableNotifications(checked);
    }
  };
  
  // Save new settings
  const saveSettings = () => {
    setEditingSettings(false);
    toast.success("Settings saved");
  };
  
  // Update a setting value
  const updateSetting = (type: TimerType, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setSettings(prev => ({
        ...prev,
        [type]: numValue
      }));
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="timer">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="timer" className="flex-1">Timer</TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timer" className="space-y-6">
          {/* Timer Display */}
          <div className="bg-muted/30 p-6 rounded-lg text-center">
            <div className="mb-4">
              <div className="flex justify-center space-x-2 mb-6">
                <Button 
                  variant={currentTimer === "work" ? "default" : "outline"}
                  onClick={() => {
                    setCurrentTimer("work");
                    setTimeLeft(settings.work * 60);
                    setIsRunning(false);
                  }}
                >
                  Focus
                </Button>
                <Button 
                  variant={currentTimer === "shortBreak" ? "default" : "outline"}
                  onClick={() => {
                    setCurrentTimer("shortBreak");
                    setTimeLeft(settings.shortBreak * 60);
                    setIsRunning(false);
                  }}
                >
                  Short Break
                </Button>
                <Button 
                  variant={currentTimer === "longBreak" ? "default" : "outline"}
                  onClick={() => {
                    setCurrentTimer("longBreak");
                    setTimeLeft(settings.longBreak * 60);
                    setIsRunning(false);
                  }}
                >
                  Long Break
                </Button>
              </div>
            
              <h2 className="text-6xl font-bold mb-6">{formatTime(timeLeft)}</h2>
              
              <div className="flex justify-center space-x-2 mb-4">
                <Button onClick={toggleTimer} size="lg">
                  {isRunning ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                  {isRunning ? "Pause" : "Start"}
                </Button>
                
                <Button variant="outline" onClick={skipTimer} title="Skip to next timer">
                  <SkipForward size={18} />
                </Button>
                
                <Button variant="outline" onClick={resetTimer} title="Reset current timer">
                  <RefreshCw size={18} />
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {currentTimer === "work" ? "Focus time! Concentrate on your task." : "Break time! Take a rest."}
            </div>
          </div>
          
          {/* Progress Tracking */}
          <div className="bg-muted/30 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Today's Progress</h3>
              <Button variant="outline" size="sm" onClick={resetAll}>
                Reset Progress
              </Button>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <div className="text-2xl font-semibold">{pomoCount}</div>
                <div className="text-sm text-muted-foreground">Pomodoros Completed</div>
              </div>
              
              <div className="flex-1 text-center">
                <div className="text-2xl font-semibold">{Math.round(pomoCount * settings.work / 60 * 10) / 10}</div>
                <div className="text-sm text-muted-foreground">Hours Focused</div>
              </div>
              
              <div className="flex-1 text-right">
                {pomoCount >= 1 && <CheckCircle2 className="inline-block text-green-500 mb-1" />}
                <div className="text-sm text-muted-foreground">Daily Goal</div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          {/* Timer Duration Settings */}
          <div className="bg-muted/30 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Timer Durations (Minutes)</h3>
              {editingSettings ? (
                <Button size="sm" onClick={saveSettings}>Save Changes</Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setEditingSettings(true)}>
                  Edit
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="work-duration">Focus Time</Label>
                <Input 
                  id="work-duration"
                  type="number"
                  min="1"
                  value={settings.work}
                  onChange={(e) => updateSetting("work", e.target.value)}
                  disabled={!editingSettings}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="short-break">Short Break</Label>
                <Input 
                  id="short-break"
                  type="number"
                  min="1"
                  value={settings.shortBreak}
                  onChange={(e) => updateSetting("shortBreak", e.target.value)}
                  disabled={!editingSettings}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="long-break">Long Break</Label>
                <Input 
                  id="long-break"
                  type="number"
                  min="1"
                  value={settings.longBreak}
                  onChange={(e) => updateSetting("longBreak", e.target.value)}
                  disabled={!editingSettings}
                />
              </div>
            </div>
            
            <div className="mt-6 text-sm text-muted-foreground">
              <p>The classic Pomodoro Technique uses 25-minute work periods separated by 5-minute breaks, with a longer 15-minute break after 4 work periods.</p>
            </div>
          </div>
          
          {/* Notification Settings */}
          <div className="bg-muted/30 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Notifications</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="desktop-notifications" className="text-base">Desktop Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications when timer completes
                  </p>
                </div>
                <Switch 
                  id="desktop-notifications" 
                  checked={enableNotifications}
                  onCheckedChange={handleNotificationsToggle}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sound-notifications" className="text-base">Sound Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sound when timer completes
                  </p>
                </div>
                <Switch 
                  id="sound-notifications" 
                  checked={enableSounds}
                  onCheckedChange={setEnableSounds}
                />
              </div>
            </div>
          </div>
          
          {/* Reset to Default */}
          <div className="text-center">
            <Button 
              variant="outline"
              onClick={() => {
                setSettings({...DEFAULT_SETTINGS});
                toast.success("Settings reset to default");
              }}
            >
              Reset to Default Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="bg-muted/30 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-2">About the Pomodoro Technique</h3>
        <p className="text-sm text-muted-foreground">
          The Pomodoro Technique is a time management method that uses timed intervals (traditionally 25 minutes) of focused work followed by short breaks. After completing four work intervals, take a longer break. This approach helps improve productivity and maintain mental freshness.
        </p>
      </div>
    </div>
  );
};

export default PomodoroTimer;
