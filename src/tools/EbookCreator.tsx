import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Plus,
  Trash2,
  FileText,
  Image as ImageIcon,
  Download,
  Save,
  Edit,
  MoveUp,
  MoveDown,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Chapter {
  id: string;
  title: string;
  content: string;
}

interface EbookDetails {
  title: string;
  author: string;
  coverImage: string | null;
  description: string;
  chapters: Chapter[];
  fontFamily: string;
  fontSize: string;
  theme: string;
}

const themes = [
  { id: "light", name: "Light", bg: "bg-white", text: "text-gray-900" },
  { id: "dark", name: "Dark", bg: "bg-gray-900", text: "text-gray-50" },
  { id: "sepia", name: "Sepia", bg: "bg-amber-50", text: "text-amber-900" },
  { id: "blue", name: "Blue", bg: "bg-sky-100", text: "text-sky-900" },
];

const fontFamilies = [
  "serif",
  "sans-serif",
  "monospace",
  "Georgia",
  "Times New Roman",
  "Arial",
  "Verdana",
];

const fontSizes = ["small", "medium", "large", "x-large"];

const EbookCreator = () => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("edit");
  const [details, setDetails] = useState<EbookDetails>({
    title: "",
    author: "",
    coverImage: null,
    description: "",
    chapters: [
      {
        id: crypto.randomUUID(),
        title: "Chapter 1",
        content: "",
      },
    ],
    fontFamily: "serif",
    fontSize: "medium",
    theme: "light",
  });

  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const addChapter = () => {
    const newChapters = [...details.chapters];
    newChapters.push({
      id: crypto.randomUUID(),
      title: `Chapter ${newChapters.length + 1}`,
      content: "",
    });
    setDetails({ ...details, chapters: newChapters });
    setSelectedChapterIndex(newChapters.length - 1);
  };

  const removeChapter = (index: number) => {
    if (details.chapters.length === 1) {
      toast("Your e-book must have at least one chapter.");
      return;
    }

    const newChapters = [...details.chapters];
    newChapters.splice(index, 1);
    setDetails({ ...details, chapters: newChapters });
    
    if (selectedChapterIndex >= newChapters.length) {
      setSelectedChapterIndex(newChapters.length - 1);
    }
  };

  const moveChapter = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === details.chapters.length - 1)
    ) {
      return;
    }

    const newChapters = [...details.chapters];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const chapter = newChapters[index];
    newChapters[index] = newChapters[newIndex];
    newChapters[newIndex] = chapter;
    
    setDetails({ ...details, chapters: newChapters });
    setSelectedChapterIndex(newIndex);
  };

  const updateChapter = (index: number, field: keyof Chapter, value: string) => {
    const newChapters = [...details.chapters];
    newChapters[index] = {
      ...newChapters[index],
      [field]: value,
    };
    setDetails({ ...details, chapters: newChapters });
  };

  const handleSave = () => {
    if (!details.title) {
      toast("Please provide at least a title for your e-book.");
      return;
    }
    
    // Save to local storage
    localStorage.setItem('ebook-draft', JSON.stringify(details));
    
    toast("Your e-book has been saved successfully.");
  };

  const generatePDF = async () => {
    if (!details.title) {
      toast("Please provide at least a title for your e-book.");
      return;
    }
    
    if (!previewRef.current) {
      toast("Preview not available. Please try again.");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Switch to preview tab first to ensure content is rendered
      setActiveTab("preview");
      
      // Small delay to ensure tab content is rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10; // margin in mm
      
      // Capture and add the title page
      const titlePagePromise = html2canvas(previewRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      
      const titleCanvas = await titlePagePromise;
      const titleImgData = titleCanvas.toDataURL('image/png');
      
      // Calculate appropriate scale to fit content within PDF page with margins
      const canvasWidth = titleCanvas.width;
      const canvasHeight = titleCanvas.height;
      const scale = Math.min(
        (pdfWidth - 2 * margin) / canvasWidth,
        (pdfHeight - 2 * margin) / canvasHeight
      );
      
      const scaledWidth = canvasWidth * scale;
      const scaledHeight = canvasHeight * scale;
      const x = (pdfWidth - scaledWidth) / 2;
      
      pdf.addImage(titleImgData, 'PNG', x, margin, scaledWidth, scaledHeight);
      
      // Save the PDF
      pdf.save(`${details.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
      
      toast("Your e-book has been downloaded successfully!");
    } catch (error) {
      console.error('PDF generation error:', error);
      toast("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    generatePDF();
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setDetails({ ...details, coverImage: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const selectedTheme = themes.find(t => t.id === details.theme) || themes[0];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="h-10 w-10 text-primary" />
          <h1 className="text-2xl font-bold">E-book Creator</h1>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setActiveTab(activeTab === "preview" ? "edit" : "preview")}>
            {activeTab === "preview" ? (
              <Edit className="mr-2 h-4 w-4" />
            ) : (
              <BookOpen className="mr-2 h-4 w-4" />
            )}
            {activeTab === "preview" ? "Edit" : "Preview"}
          </Button>
          <Button variant="outline" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button 
            onClick={handleDownload}
            disabled={isGenerating}
          >
            <Download className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Download"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="space-y-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4 md:col-span-1">
              <h2 className="text-xl font-semibold">Book Information</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Book Title</Label>
                  <Input
                    id="title"
                    value={details.title}
                    onChange={(e) => setDetails({ ...details, title: e.target.value })}
                    placeholder="My Amazing E-book"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={details.author}
                    onChange={(e) => setDetails({ ...details, author: e.target.value })}
                    placeholder="Your Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={details.description}
                    onChange={(e) => setDetails({ ...details, description: e.target.value })}
                    placeholder="A brief description of your e-book..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coverImage">Cover Image</Label>
                  <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-md">
                    {details.coverImage ? (
                      <div className="space-y-2">
                        <img
                          src={details.coverImage}
                          alt="Cover Preview"
                          className="max-h-32 object-contain mx-auto"
                        />
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setDetails({ ...details, coverImage: null })}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-10 w-10 text-gray-400" />
                        <div className="mt-2">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-foreground"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleCoverImageUpload}
                            />
                          </label>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 md:col-span-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Chapters</h2>
                <Button onClick={addChapter}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Chapter
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  {details.chapters.map((chapter, index) => (
                    <div
                      key={chapter.id}
                      className={`flex justify-between items-center p-2 rounded ${
                        selectedChapterIndex === index ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedChapterIndex(index)}
                    >
                      <div className="truncate cursor-pointer">
                        <FileText className="inline-block mr-2 h-4 w-4" />
                        {chapter.title}
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className={selectedChapterIndex === index ? "hover:bg-primary/90" : ""}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveChapter(index, "up");
                          }}
                          disabled={index === 0}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className={selectedChapterIndex === index ? "hover:bg-primary/90" : ""}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveChapter(index, "down");
                          }}
                          disabled={index === details.chapters.length - 1}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className={selectedChapterIndex === index ? "hover:bg-primary/90" : ""}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeChapter(index);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 md:col-span-2">
                  {selectedChapterIndex !== null && details.chapters[selectedChapterIndex] && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="chapterTitle">Chapter Title</Label>
                        <Input
                          id="chapterTitle"
                          value={details.chapters[selectedChapterIndex].title}
                          onChange={(e) =>
                            updateChapter(selectedChapterIndex, "title", e.target.value)
                          }
                          placeholder="Chapter Title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="chapterContent">Chapter Content</Label>
                        <Textarea
                          id="chapterContent"
                          value={details.chapters[selectedChapterIndex].content}
                          onChange={(e) =>
                            updateChapter(selectedChapterIndex, "content", e.target.value)
                          }
                          placeholder="Write your chapter content here..."
                          className="min-h-[300px]"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <div
            ref={previewRef}
            className={`mx-auto max-w-2xl p-6 rounded-lg ${selectedTheme.bg} ${selectedTheme.text}`}
            style={{
              fontFamily: details.fontFamily,
              fontSize: 
                details.fontSize === "small" ? "0.875rem" :
                details.fontSize === "medium" ? "1rem" :
                details.fontSize === "large" ? "1.125rem" : "1.25rem"
            }}
          >
            <div className="text-center mb-10 space-y-4">
              {details.coverImage && (
                <img
                  src={details.coverImage}
                  alt="Book Cover"
                  className="mx-auto max-h-64 object-contain"
                  crossOrigin="anonymous"
                />
              )}
              <h1 className="text-3xl font-bold">{details.title || "Untitled E-book"}</h1>
              {details.author && <p className="text-lg">by {details.author}</p>}
            </div>

            {details.description && (
              <div className="mb-8 italic text-center px-8">
                {details.description}
              </div>
            )}

            <div className="space-y-8">
              {details.chapters.map((chapter) => (
                <div key={chapter.id} className="space-y-4">
                  <h2 className="text-2xl font-bold border-b pb-2">{chapter.title}</h2>
                  <div className="whitespace-pre-wrap">{chapter.content}</div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Appearance</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={details.theme}
                    onValueChange={(value) => setDetails({ ...details, theme: value })}
                  >
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme.id} value={theme.id}>{theme.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Select
                    value={details.fontFamily}
                    onValueChange={(value) => setDetails({ ...details, fontFamily: value })}
                  >
                    <SelectTrigger id="fontFamily">
                      <SelectValue placeholder="Select a font family" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem 
                          key={font} 
                          value={font} 
                          style={{ fontFamily: font }}
                        >
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Select
                    value={details.fontSize}
                    onValueChange={(value) => setDetails({ ...details, fontSize: value })}
                  >
                    <SelectTrigger id="fontSize">
                      <SelectValue placeholder="Select a font size" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontSizes.map((size) => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Export Settings</h2>
              <div className="p-6 bg-muted rounded-lg">
                <p className="text-muted-foreground">
                  You can download your e-book in multiple formats. In the current version, we support PDF export.
                  Future updates will include EPUB, MOBI, and HTML exports.
                </p>
                <div className="mt-4">
                  <Button 
                    onClick={handleDownload} 
                    className="w-full"
                    disabled={isGenerating}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isGenerating ? "Generating PDF..." : "Download as PDF"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EbookCreator;
