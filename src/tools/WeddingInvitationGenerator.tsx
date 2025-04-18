
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  Heart, 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  Printer, 
  Download, 
  Save 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const templates = [
  {
    id: "elegant",
    name: "Elegant",
    bgColor: "bg-[#FDFAF1]",
    textColor: "text-[#333333]",
    accentColor: "border-[#D1AF78]",
  },
  {
    id: "modern",
    name: "Modern",
    bgColor: "bg-[#FFFFFF]",
    textColor: "text-[#222222]",
    accentColor: "border-[#6B7280]",
  },
  {
    id: "romantic",
    name: "Romantic",
    bgColor: "bg-[#FFF5F5]",
    textColor: "text-[#4A3030]",
    accentColor: "border-[#F56565]",
  },
  {
    id: "rustic",
    name: "Rustic",
    bgColor: "bg-[#F8F4E3]",
    textColor: "text-[#5F4B32]",
    accentColor: "border-[#A78347]",
  },
];

interface WeddingDetails {
  brideFirst: string;
  brideLast: string;
  groomFirst: string;
  groomLast: string;
  date: Date | undefined;
  time: string;
  venue: string;
  address: string;
  message: string;
  rsvpEmail: string;
  rsvpDeadline: Date | undefined;
  template: string;
}

const WeddingInvitationGenerator = () => {
  const { toast } = useToast();
  const [details, setDetails] = useState<WeddingDetails>({
    brideFirst: "",
    brideLast: "",
    groomFirst: "",
    groomLast: "",
    date: undefined,
    time: "",
    venue: "",
    address: "",
    message: "",
    rsvpEmail: "",
    rsvpDeadline: undefined,
    template: "elegant",
  });

  const selectedTemplate = templates.find(t => t.id === details.template) || templates[0];

  const handlePrint = () => {
    if (!details.brideFirst || !details.groomFirst || !details.date || !details.venue) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields before printing.",
      });
      return;
    }

    const invitationSection = document.getElementById('invitation-preview');
    if (invitationSection) {
      const content = invitationSection.innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = content;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };
  
  const handleSave = () => {
    if (!details.brideFirst || !details.groomFirst || !details.date || !details.venue) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields before saving.",
      });
      return;
    }
    
    toast({
      title: "Invitation Saved",
      description: "Your wedding invitation has been saved successfully.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Heart className="h-10 w-10 text-pink-500" />
          <h1 className="text-2xl font-bold">Wedding Invitation Generator</h1>
        </div>
        <div className="space-x-2 print:hidden">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6 print:hidden">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Couple Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brideFirst">Bride's First Name</Label>
                <Input
                  id="brideFirst"
                  value={details.brideFirst}
                  onChange={(e) => setDetails({ ...details, brideFirst: e.target.value })}
                  placeholder="Sarah"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brideLast">Bride's Last Name</Label>
                <Input
                  id="brideLast"
                  value={details.brideLast}
                  onChange={(e) => setDetails({ ...details, brideLast: e.target.value })}
                  placeholder="Johnson"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groomFirst">Groom's First Name</Label>
                <Input
                  id="groomFirst"
                  value={details.groomFirst}
                  onChange={(e) => setDetails({ ...details, groomFirst: e.target.value })}
                  placeholder="Michael"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groomLast">Groom's Last Name</Label>
                <Input
                  id="groomLast"
                  value={details.groomLast}
                  onChange={(e) => setDetails({ ...details, groomLast: e.target.value })}
                  placeholder="Smith"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Event Details</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Wedding Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !details.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {details.date ? format(details.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={details.date}
                      onSelect={(date) => setDetails({ ...details, date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Wedding Time</Label>
                <Input
                  id="time"
                  value={details.time}
                  onChange={(e) => setDetails({ ...details, time: e.target.value })}
                  placeholder="3:00 PM"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue">Venue Name</Label>
                <Input
                  id="venue"
                  value={details.venue}
                  onChange={(e) => setDetails({ ...details, venue: e.target.value })}
                  placeholder="Grand Hotel Ballroom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Venue Address</Label>
                <Textarea
                  id="address"
                  value={details.address}
                  onChange={(e) => setDetails({ ...details, address: e.target.value })}
                  placeholder="123 Wedding Lane, City, State, ZIP"
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">RSVP Information</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rsvpEmail">RSVP Email</Label>
                <Input
                  id="rsvpEmail"
                  type="email"
                  value={details.rsvpEmail}
                  onChange={(e) => setDetails({ ...details, rsvpEmail: e.target.value })}
                  placeholder="rsvp@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>RSVP Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !details.rsvpDeadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {details.rsvpDeadline ? format(details.rsvpDeadline, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={details.rsvpDeadline}
                      onSelect={(date) => setDetails({ ...details, rsvpDeadline: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Additional Details</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Personal Message</Label>
                <Textarea
                  id="message"
                  value={details.message}
                  onChange={(e) => setDetails({ ...details, message: e.target.value })}
                  placeholder="We invite you to share in our joy and celebrate our love..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Template Style</Label>
                <Select
                  value={details.template}
                  onValueChange={(value) => setDetails({ ...details, template: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div id="invitation-preview" className={`p-8 ${selectedTemplate.bgColor} ${selectedTemplate.textColor} border-8 ${selectedTemplate.accentColor} rounded-lg`}>
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="space-y-2">
              <h3 className="text-lg font-serif">You are cordially invited to celebrate the wedding of</h3>
              <h2 className="text-3xl font-serif font-bold">
                {details.brideFirst} {details.brideLast}
              </h2>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-8 h-0.5 bg-current"></div>
                <Heart className="h-5 w-5 text-pink-500" />
                <div className="w-8 h-0.5 bg-current"></div>
              </div>
              <h2 className="text-3xl font-serif font-bold">
                {details.groomFirst} {details.groomLast}
              </h2>
            </div>

            <div className="space-y-6 max-w-md">
              {details.date && (
                <div className="flex flex-col items-center space-y-1">
                  <CalendarIcon className="h-5 w-5" />
                  <p className="font-serif">{format(details.date, "PPPP")}</p>
                  {details.time && <p className="font-serif">{details.time}</p>}
                </div>
              )}

              {details.venue && (
                <div className="flex flex-col items-center space-y-1">
                  <MapPin className="h-5 w-5" />
                  <p className="font-bold font-serif">{details.venue}</p>
                  <p className="font-serif">{details.address}</p>
                </div>
              )}

              {details.message && (
                <div className="text-center mt-4">
                  <p className="italic font-serif">{details.message}</p>
                </div>
              )}
            </div>

            {(details.rsvpEmail || details.rsvpDeadline) && (
              <div className="border-t border-current pt-4 mt-4 w-full">
                <h4 className="font-serif font-bold text-lg mb-2">RSVP</h4>
                {details.rsvpEmail && <p className="font-serif">{details.rsvpEmail}</p>}
                {details.rsvpDeadline && (
                  <p className="font-serif">
                    Please respond by {format(details.rsvpDeadline, "MMMM do, yyyy")}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeddingInvitationGenerator;
