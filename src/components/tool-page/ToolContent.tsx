import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Tool } from "@/data/tools";

// Tool imports
import WordCounter from "@/tools/WordCounter";
import ImageToPng from "@/tools/ImageToPng";
import ImageToJpg from "@/tools/ImageToJpg";
import ImageResizer from "@/tools/ImageResizer";
import ImageCompressor from "@/tools/ImageCompressor";
import JsonFormatter from "@/tools/JsonFormatter";
import PasswordGenerator from "@/tools/PasswordGenerator";
import MetaTagGenerator from "@/tools/MetaTagGenerator";
import KeywordDensityChecker from "@/tools/KeywordDensityChecker";
import CaseConverter from "@/tools/CaseConverter";
import PercentageCalculator from "@/tools/PercentageCalculator";
import BmiCalculator from "@/tools/BmiCalculator";
import LengthConverter from "@/tools/LengthConverter";
import TemperatureConverter from "@/tools/TemperatureConverter";
import Base64EncoderDecoder from "@/tools/Base64EncoderDecoder";
import RandomNumberGenerator from "@/tools/RandomNumberGenerator";
import QrCodeGenerator from "@/tools/QrCodeGenerator";
import OcrTool from "@/tools/OcrTool";
import BackgroundRemover from "@/tools/BackgroundRemover";
import ImageUpscaler from "@/tools/ImageUpscaler";
import MemeGenerator from "@/tools/MemeGenerator";
import TextTranslator from "@/tools/TextTranslator";
import AudioCutter from "@/tools/AudioCutter";
import PomodoroTimer from "@/tools/PomodoroTimer";
import ImageCropper from "@/tools/ImageCropper";
import ImageToBase64 from "@/tools/ImageToBase64";
import WebpToPng from "@/tools/WebpToPng";
import GifMaker from "@/tools/GifMaker";
import ScreenshotToPdf from "@/tools/ScreenshotToPdf";
import SitemapGenerator from "@/tools/SitemapGenerator";
import RobotsTxtGenerator from "@/tools/RobotsTxtGenerator";
import GoogleIndexChecker from "@/tools/GoogleIndexChecker";
import BacklinkChecker from "@/tools/BacklinkChecker";
import DomainAuthorityChecker from "@/tools/DomainAuthorityChecker";
import Md5HashGenerator from "@/tools/Md5HashGenerator";
import HashtagGenerator from "@/tools/HashtagGenerator";
import SocialMediaImageResizer from "@/tools/SocialMediaImageResizer";
import InstagramPostDesigner from "@/tools/InstagramPostDesigner";
import YoutubeThumbnailDownloader from "@/tools/YoutubeThumbnailDownloader";
import TextToSpeech from "@/tools/TextToSpeech";
import YoutubeVideoDownloader from "@/tools/YoutubeVideoDownloader";

interface ToolContentProps {
  toolId: string;
  tool: Tool;
}

export const ToolContent = ({ toolId, tool }: ToolContentProps) => {
  const renderToolComponent = () => {
    switch(toolId) {
      case 'word-counter':
        return <WordCounter />;
      case 'image-to-png':
        return <ImageToPng />;
      case 'image-to-jpg':
        return <ImageToJpg />;
      case 'image-resizer':
        return <ImageResizer />;
      case 'image-compressor':
        return <ImageCompressor />;
      case 'image-to-base64':
        return <ImageToBase64 />;
      case 'webp-to-png':
        return <WebpToPng />;
      case 'gif-maker':
        return <GifMaker />;
      case 'screenshot-to-pdf':
        return <ScreenshotToPdf />;
      case 'json-formatter':
        return <JsonFormatter />;
      case 'password-generator':
        return <PasswordGenerator />;
      case 'meta-tag-generator':
        return <MetaTagGenerator />;
      case 'sitemap-generator':
        return <SitemapGenerator />;
      case 'robots-txt-generator':
        return <RobotsTxtGenerator />;
      case 'google-index-checker':
        return <GoogleIndexChecker />;
      case 'backlink-checker':
        return <BacklinkChecker />;
      case 'domain-authority-checker':
        return <DomainAuthorityChecker />;
      case 'keyword-density-checker':
        return <KeywordDensityChecker />;
      case 'case-converter':
        return <CaseConverter />;
      case 'percentage-calculator':
        return <PercentageCalculator />;
      case 'bmi-calculator':
        return <BmiCalculator />;
      case 'length-converter':
        return <LengthConverter />;
      case 'temperature-converter':
        return <TemperatureConverter />;
      case 'base64-encoder-decoder':
        return <Base64EncoderDecoder />;
      case 'random-number-generator':
        return <RandomNumberGenerator />;
      case 'qr-code-generator':
        return <QrCodeGenerator />;
      case 'ocr-tool':
        return <OcrTool />;
      case 'background-remover':
        return <BackgroundRemover />;
      case 'image-upscaler':
        return <ImageUpscaler />;
      case 'meme-generator':
        return <MemeGenerator />;
      case 'text-translator':
        return <TextTranslator />;
      case 'audio-cutter':
        return <AudioCutter />;
      case 'pomodoro-timer':
        return <PomodoroTimer />;
      case 'image-cropper':
        return <ImageCropper />;
      case 'md5-hash-generator':
        return <Md5HashGenerator />;
      case 'hashtag-generator':
        return <HashtagGenerator />;
      case 'social-media-image-resizer':
        return <SocialMediaImageResizer />;
      case 'instagram-post-designer':
        return <InstagramPostDesigner />;
      case 'youtube-thumbnail-downloader':
        return <YoutubeThumbnailDownloader />;
      case 'youtube-video-download':
        return <YoutubeVideoDownloader />;
      default:
        return (
          <div className="text-center py-10">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This tool is under development. Check back soon!
              </AlertDescription>
            </Alert>
            <div className="mt-6">
              <p className="text-muted-foreground">
                We're working hard to implement this tool. In the meantime, check out our other available tools.
              </p>
            </div>
          </div>
        );
    }
  };
  
  return (
    <Tabs defaultValue="tool" className="w-full">
      <TabsList className="mb-8">
        <TabsTrigger value="tool">Use Tool</TabsTrigger>
        <TabsTrigger value="howto">How to Use</TabsTrigger>
        <TabsTrigger value="faq">FAQ</TabsTrigger>
      </TabsList>
      
      <TabsContent value="tool">
        <Card className="p-6">
          {renderToolComponent()}
        </Card>
      </TabsContent>
      
      <TabsContent value="howto">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">How to Use {tool.title}</h2>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Start by entering your data or uploading your file in the tool area.</li>
            <li>Adjust any settings or parameters according to your needs.</li>
            <li>Click the process button to run the tool.</li>
            <li>View the results and download or copy as needed.</li>
          </ol>
          <p>This tool is completely free and works directly in your browser. No data is sent to our servers.</p>
        </Card>
      </TabsContent>
      
      <TabsContent value="faq">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-1">Is this tool free to use?</h3>
              <p className="text-muted-foreground">Yes, this tool is completely free to use without any limitations.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Is my data safe?</h3>
              <p className="text-muted-foreground">All processing happens in your browser. We don't upload or store your files or data on our servers.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Can I use this tool on mobile devices?</h3>
              <p className="text-muted-foreground">Yes, all our tools are fully responsive and work on desktop, tablets, and mobile phones.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">How accurate is this tool?</h3>
              <p className="text-muted-foreground">We strive to provide the most accurate results possible, using industry-standard algorithms and methods.</p>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
