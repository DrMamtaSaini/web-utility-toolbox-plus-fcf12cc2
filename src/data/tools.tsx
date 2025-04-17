import { BarChart, Image, LineChart, Search, Text, Calculator, ArrowLeftRight, Lock, Hash, Share2, Lightbulb, AudioLines, Scissors, AlarmClock, Crop, Camera, FileImage, Film, FileType2, Map, Bot, Globe, ExternalLink, Award, Instagram, Facebook, Twitter, AtSign, MessageCircle, Share, PenTool, Scissors as ScissorsIcon, ThumbsUp, MessageSquare, Rss, BookOpen, Megaphone, Youtube, FileVideo } from 'lucide-react';

export interface Tool {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  isNew?: boolean;
  isPopular?: boolean;
}

export const tools: Tool[] = [
  // Image Tools
  {
    id: 'image-to-png',
    title: 'Image to PNG Converter',
    description: 'Convert your images to PNG format while preserving transparency and quality.',
    category: 'Image Tools',
    icon: <Image />,
    isPopular: true
  },
  {
    id: 'image-to-jpg',
    title: 'Image to JPG Converter',
    description: 'Convert various image formats to JPG with custom compression settings.',
    category: 'Image Tools',
    icon: <Image />
  },
  {
    id: 'image-resizer',
    title: 'Image Resizer',
    description: 'Resize images to specific dimensions while maintaining aspect ratio.',
    category: 'Image Tools',
    icon: <Image />,
    isPopular: true
  },
  {
    id: 'image-compressor',
    title: 'Image Compressor',
    description: 'Reduce image file size without visibly affecting quality.',
    category: 'Image Tools',
    icon: <Image />
  },
  {
    id: 'image-to-base64',
    title: 'Image to Base64',
    description: 'Convert images to Base64 strings for embedding directly in CSS, HTML, or JSON.',
    category: 'Image Tools',
    icon: <FileType2 />,
    isNew: true
  },
  {
    id: 'webp-to-png',
    title: 'WebP to PNG Converter',
    description: 'Convert WebP images to PNG format for better compatibility across platforms.',
    category: 'Image Tools',
    icon: <FileImage />,
    isNew: true
  },
  {
    id: 'gif-maker',
    title: 'GIF Maker',
    description: 'Create animated GIFs from a series of images or video clips.',
    category: 'Image Tools',
    icon: <Film />,
    isNew: true
  },
  {
    id: 'screenshot-to-pdf',
    title: 'Screenshot to PDF',
    description: 'Convert screenshots or images to PDF documents quickly and easily.',
    category: 'Image Tools',
    icon: <Camera />,
    isNew: true
  },
  {
    id: 'ocr-tool',
    title: 'Text from Image (OCR)',
    description: 'Extract text from images, including handwritten text in multiple languages.',
    category: 'Image Tools',
    icon: <Image />,
    isNew: true
  },
  {
    id: 'background-remover',
    title: 'Background Remover',
    description: 'Remove backgrounds from images automatically with AI technology.',
    category: 'Image Tools',
    icon: <Scissors />,
    isNew: true
  },
  {
    id: 'image-upscaler',
    title: 'Image Upscaler',
    description: 'Enhance and upscale low-resolution images using AI technology.',
    category: 'Image Tools',
    icon: <Image />,
    isNew: true
  },
  {
    id: 'meme-generator',
    title: 'Meme Generator',
    description: 'Create custom memes with text overlays and popular templates.',
    category: 'Image Tools',
    icon: <Image />,
    isNew: true
  },
  {
    id: 'image-cropper',
    title: 'Image Cropper',
    description: 'Crop and edit images with precision using an interactive tool.',
    category: 'Image Tools',
    icon: <Crop />,
    isNew: true
  },

  // SEO Tools
  {
    id: 'meta-tag-generator',
    title: 'Meta Tag Generator',
    description: 'Generate optimized meta tags for better search engine visibility.',
    category: 'SEO Tools',
    icon: <Search />
  },
  {
    id: 'keyword-density-checker',
    title: 'Keyword Density Checker',
    description: 'Analyze keyword usage and density in your content for SEO optimization.',
    category: 'SEO Tools',
    icon: <Search />,
    isPopular: true
  },
  {
    id: 'sitemap-generator',
    title: 'Sitemap Generator',
    description: 'Create XML sitemaps to help search engines crawl your website more efficiently.',
    category: 'SEO Tools',
    icon: <Map />,
    isNew: true
  },
  {
    id: 'robots-txt-generator',
    title: 'Robots.txt Generator',
    description: 'Generate robots.txt files to control how search engines crawl your site.',
    category: 'SEO Tools',
    icon: <Bot />,
    isNew: true
  },
  {
    id: 'google-index-checker',
    title: 'Google Index Checker',
    description: 'Check if your pages are indexed by Google and monitor indexing status.',
    category: 'SEO Tools',
    icon: <Globe />,
    isNew: true
  },
  {
    id: 'backlink-checker',
    title: 'Backlink Checker',
    description: 'Analyze the backlinks pointing to your website to improve SEO strategy.',
    category: 'SEO Tools',
    icon: <ExternalLink />,
    isNew: true
  },
  {
    id: 'domain-authority-checker',
    title: 'Domain Authority Checker',
    description: 'Check the domain authority and page authority of any website.',
    category: 'SEO Tools',
    icon: <Award />,
    isNew: true
  },

  // Text Tools
  {
    id: 'word-counter',
    title: 'Word Counter',
    description: 'Count words, characters, sentences and paragraphs in your text.',
    category: 'Text Tools',
    icon: <Text />,
    isPopular: true
  },
  {
    id: 'case-converter',
    title: 'Case Converter',
    description: 'Convert text between different case formats: lowercase, UPPERCASE, Title Case, and more.',
    category: 'Text Tools',
    icon: <Text />
  },
  {
    id: 'text-translator',
    title: 'Text Translator',
    description: 'Translate text between multiple languages quickly and easily.',
    category: 'Text Tools',
    icon: <Text />,
    isNew: true
  },

  // Developer Tools
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Format and validate JSON data with syntax highlighting and error detection.',
    category: 'Developer Tools',
    icon: <BarChart />,
    isNew: true
  },
  {
    id: 'base64-encoder-decoder',
    title: 'Base64 Encoder/Decoder',
    description: 'Encode text to Base64 or decode Base64 to text with this simple tool.',
    category: 'Developer Tools',
    icon: <Hash />
  },

  // Calculators
  {
    id: 'percentage-calculator',
    title: 'Percentage Calculator',
    description: 'Calculate percentages, increases, decreases, and percentage of totals.',
    category: 'Calculators',
    icon: <Calculator />
  },
  {
    id: 'bmi-calculator',
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index (BMI) based on your weight and height.',
    category: 'Calculators',
    icon: <Calculator />,
    isPopular: true
  },

  // Unit Converters
  {
    id: 'length-converter',
    title: 'Length Converter',
    description: 'Convert between different units of length: meters, feet, inches, etc.',
    category: 'Unit Converters',
    icon: <ArrowLeftRight />
  },
  {
    id: 'temperature-converter',
    title: 'Temperature Converter',
    description: 'Convert temperatures between Celsius, Fahrenheit, and Kelvin.',
    category: 'Unit Converters',
    icon: <ArrowLeftRight />
  },

  // Security Tools
  {
    id: 'password-generator',
    title: 'Password Generator',
    description: 'Generate strong, secure passwords with customizable options.',
    category: 'Security Tools',
    icon: <Lock />,
    isNew: true
  },
  {
    id: 'md5-hash-generator',
    title: 'MD5 Hash Generator',
    description: 'Generate MD5 hash from text or files for verification purposes.',
    category: 'Security Tools',
    icon: <Hash />
  },

  // Social Media Tools
  {
    id: 'instagram-post-designer',
    title: 'Instagram Post Designer',
    description: 'Create stunning Instagram post templates with custom fonts, backgrounds, and filters.',
    category: 'Social Media Tools',
    icon: <Instagram />,
    isNew: true,
    isPopular: true
  },
  {
    id: 'social-media-image-resizer',
    title: 'Social Media Image Resizer',
    description: 'Resize images to optimal dimensions for different social media platforms.',
    category: 'Social Media Tools',
    icon: <Image />,
    isNew: true
  },
  {
    id: 'youtube-thumbnail-downloader',
    title: 'YouTube Thumbnail Downloader',
    description: 'Extract and download thumbnails from YouTube videos in various resolutions.',
    category: 'Social Media Tools',
    icon: <Youtube />,
    isNew: true
  },
  {
    id: 'youtube-video-download',
    title: 'YouTube Video Downloader',
    description: 'Download videos from YouTube in different quality formats.',
    category: 'Social Media Tools',
    icon: <Youtube />,
    isNew: true
  },
  {
    id: 'facebook-video-download',
    title: 'Facebook Video Downloader',
    description: 'Download videos from Facebook with ease.',
    category: 'Social Media Tools',
    icon: <Facebook />,
    isNew: true
  },
  {
    id: 'youtube-tags-extractor',
    title: 'YouTube Tags Extractor',
    description: 'Extract tags from YouTube videos for SEO analysis and optimization.',
    category: 'Social Media Tools',
    icon: <Youtube />,
    isNew: true
  },
  {
    id: 'social-media-post-generator',
    title: 'Social Media Post Generator',
    description: 'Generate engaging social media posts with AI assistance.',
    category: 'Social Media Tools',
    icon: <FileImage />,
    isNew: true
  },
  {
    id: 'twitter-post-scheduler',
    title: 'Twitter Post Scheduler',
    description: 'Plan and schedule your Twitter posts for maximum engagement.',
    category: 'Social Media Tools',
    icon: <Twitter />,
    isNew: true
  },
  {
    id: 'hashtag-generator',
    title: 'Hashtag Generator',
    description: 'Generate relevant and trending hashtags for your social media posts.',
    category: 'Social Media Tools',
    icon: <Hash />,
    isNew: true,
    isPopular: true
  },
  {
    id: 'bio-link-creator',
    title: 'Bio Link Creator',
    description: 'Create a simple landing page with multiple links for your social media bio.',
    category: 'Social Media Tools',
    icon: <AtSign />,
    isNew: true
  },
  {
    id: 'caption-generator',
    title: 'Caption Generator',
    description: 'Generate engaging captions for your social media posts with AI assistance.',
    category: 'Social Media Tools',
    icon: <MessageCircle />,
    isNew: true
  },
  {
    id: 'social-post-formatter',
    title: 'Social Post Formatter',
    description: 'Format your text for optimal readability and engagement on social media.',
    category: 'Social Media Tools',
    icon: <PenTool />,
    isNew: true
  },
  {
    id: 'content-repurposer',
    title: 'Content Repurposer',
    description: 'Repurpose your content across different social media platforms easily.',
    category: 'Social Media Tools',
    icon: <ScissorsIcon />,
    isNew: true
  },
  {
    id: 'engagement-calculator',
    title: 'Engagement Calculator',
    description: 'Calculate engagement rates for your social media posts and accounts.',
    category: 'Social Media Tools',
    icon: <ThumbsUp />,
    isNew: true
  },
  {
    id: 'social-comment-template',
    title: 'Social Comment Template',
    description: 'Create templates for responding to common social media comments and messages.',
    category: 'Social Media Tools',
    icon: <MessageSquare />,
    isNew: true
  },
  {
    id: 'rss-to-social',
    title: 'RSS to Social',
    description: 'Convert RSS feeds to social media posts automatically with customizable templates.',
    category: 'Social Media Tools',
    icon: <Rss />,
    isNew: true
  },
  {
    id: 'social-media-planner',
    title: 'Social Media Planner',
    description: 'Plan your social media content calendar with a visual timeline and scheduling.',
    category: 'Social Media Tools',
    icon: <BookOpen />,
    isNew: true
  },

  // Document Tools
  {
    id: 'resume-builder',
    title: 'Resume Builder',
    description: 'Create professional resumes with customizable templates and sections.',
    category: 'Document Tools',
    icon: <FileImage />,
    isNew: true
  },
  {
    id: 'invoice-generator',
    title: 'Invoice Generator',
    description: 'Generate professional invoices with custom branding and payment details.',
    category: 'Document Tools',
    icon: <FileImage />,
    isNew: true
  },
  {
    id: 'wedding-invitation-generator',
    title: 'Wedding Invitation Generator',
    description: 'Create beautiful wedding invitations with customizable templates.',
    category: 'Document Tools',
    icon: <FileImage />,
    isNew: true
  },
  {
    id: 'ebook-creator',
    title: 'E-book Creator',
    description: 'Design and format e-books with chapters, images, and custom styling.',
    category: 'Document Tools',
    icon: <FileImage />,
    isNew: true
  },
  {
    id: 'privacy-policy-generator',
    title: 'Privacy Policy Generator',
    description: 'Create a compliant privacy policy for your website or application.',
    category: 'Document Tools',
    icon: <FileImage />,
    isNew: true
  },

  // Utility Tools
  {
    id: 'url-shortener',
    title: 'URL Shortener',
    description: 'Shorten long URLs for easier sharing and tracking.',
    category: 'Utility Tools',
    icon: <Link />,
    isNew: true
  },
  {
    id: 'currency-converter',
    title: 'Currency Converter',
    description: 'Convert between different currencies with up-to-date exchange rates.',
    category: 'Utility Tools',
    icon: <Calculator />,
    isNew: true
  },
  {
    id: 'loan-emi-calculator',
    title: 'Loan EMI Calculator',
    description: 'Calculate Equated Monthly Installments (EMI) for your loans.',
    category: 'Utility Tools',
    icon: <Calculator />,
    isNew: true
  },

  // Text & Speech Tools
  {
    id: 'fancy-text-generator',
    title: 'Fancy Text Generator',
    description: 'Convert plain text into stylish and decorative text formats.',
    category: 'Text & Speech Tools',
    icon: <Text />,
    isNew: true
  },
  {
    id: 'text-to-speech',
    title: 'Text-to-Speech',
    description: 'Convert text to natural-sounding speech in multiple languages.',
    category: 'Text & Speech Tools',
    icon: <AudioLines />,
    isNew: true
  },
  {
    id: 'speech-to-text',
    title: 'Speech-To-Text',
    description: 'Transcribe spoken words from audio recordings to text.',
    category: 'Text & Speech Tools',
    icon: <AudioLines />,
    isNew: true
  },
  {
    id: 'plagiarism-checker',
    title: 'Plagiarism Checker',
    description: 'Check your content for plagiarism and duplicate content.',
    category: 'Text & Speech Tools',
    icon: <Search />,
    isNew: true
  },

  // Miscellaneous
  {
    id: 'random-number-generator',
    title: 'Random Number Generator',
    description: 'Generate random numbers within a specified range with various options.',
    category: 'Miscellaneous',
    icon: <Lightbulb />
  },
  {
    id: 'qr-code-generator',
    title: 'QR Code Generator',
    description: 'Create QR codes for URLs, text, contact information, and more.',
    category: 'Miscellaneous',
    icon: <Share2 />,
    isPopular: true
  },
  {
    id: 'audio-cutter',
    title: 'Audio Cutter',
    description: 'Trim audio files to specific durations and save the result.',
    category: 'Audio Tools',
    icon: <AudioLines />,
    isNew: true
  },
  {
    id: 'pomodoro-timer',
    title: 'Pomodoro Timer',
    description: 'Boost productivity with timed work intervals and breaks.',
    category: 'Productivity Tools',
    icon: <AlarmClock />,
    isNew: true
  }
];

export const toolsByCategory = tools.reduce((acc, tool) => {
  if (!acc[tool.category]) {
    acc[tool.category] = [];
  }
  acc[tool.category].push(tool);
  return acc;
}, {} as Record<string, Tool[]>);

export const categories = Object.keys(toolsByCategory);
