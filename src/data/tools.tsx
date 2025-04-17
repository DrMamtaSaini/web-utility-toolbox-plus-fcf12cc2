import { BarChart, Image, LineChart, Search, Text, Calculator, ArrowLeftRight, Lock, Hash, Share2, Lightbulb, AudioLines, Scissors, AlarmClock, Crop } from 'lucide-react';

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
