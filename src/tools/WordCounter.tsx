
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

const WordCounter = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: '0 min'
  });

  useEffect(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    
    // Count words
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    
    // Count sentences
    const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(Boolean).length;
    
    // Count paragraphs
    const paragraphs = text.trim() === '' ? 0 : text.split(/\n+/).filter(s => s.trim().length > 0).length;
    
    // Calculate reading time (average 225 words per minute)
    const minutes = words / 225;
    let readingTime;
    
    if (minutes < 1) {
      readingTime = 'Less than 1 min';
    } else {
      readingTime = `${Math.ceil(minutes)} min`;
    }

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime
    });
  }, [text]);

  const handleClear = () => {
    setText('');
  };

  const handleSampleText = () => {
    setText('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae. Sed dui lorem, adipiscing in adipiscing et, interdum nec metus.\n\nMorbi lacinia molestie dui. Praesent blandit hendrerit nibh. Fusce nonummy mi a dolor fringilla tempor.');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="text-input" className="block text-sm font-medium">
          Enter or paste your text below:
        </label>
        <Textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="min-h-[200px]"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSampleText} variant="outline">
          Load Sample Text
        </Button>
        <Button onClick={handleClear} variant="outline">
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">{stats.characters}</div>
              <div className="text-sm text-muted-foreground">Characters</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">{stats.charactersNoSpaces}</div>
              <div className="text-sm text-muted-foreground">Characters (no spaces)</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">{stats.words}</div>
              <div className="text-sm text-muted-foreground">Words</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">{stats.sentences}</div>
              <div className="text-sm text-muted-foreground">Sentences</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">{stats.paragraphs}</div>
              <div className="text-sm text-muted-foreground">Paragraphs</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">{stats.readingTime}</div>
              <div className="text-sm text-muted-foreground">Reading Time</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WordCounter;
