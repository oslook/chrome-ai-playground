'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Copy, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function WriterPage() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tone, setTone] = useState<'formal' | 'neutral' | 'casual'>('neutral');
  const [format, setFormat] = useState<'plain-text' | 'markdown'>('markdown');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [sharedContext, setSharedContext] = useState('');
  const [context, setContext] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    try {
      console.log('Checking writer API availability...');
      // @ts-ignore
      if (!ai?.writer) {
        console.log('Writer API not found in ai object');
        setIsAvailable(false);
        return;
      }
      console.log('Creating writer instance for availability check...');
      const writer = await ai.writer.create();
      if (writer) {
        console.log('Writer instance created successfully');
        setIsAvailable(true);
        writer.destroy();
      } else {
        console.log('Failed to create writer instance');
        setIsAvailable(false);
      }
    } catch (error) {
      console.error('Error checking writer availability:', error);
      setIsAvailable(false);
    }
  };

  const handleWrite = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setOutput('');
    setDownloadProgress(null);

    try {
      console.log('Creating writer instance with shared context:', { sharedContext });
      const writer = await ai.writer.create({
        tone,
        format,
        length,
        sharedContext
      });
      console.log('Writer instance created successfully', writer);

      console.log('Starting streaming with prompt and context:', { prompt, context });
      const stream = writer.writeStreaming(prompt);
      console.log('Stream created successfully');

      console.log('Stream reader and decoder initialized');

      for await (const chunk of stream) {
        setOutput(chunk.trim());
      }

      console.log('Cleaning up writer instance');
      writer.destroy();
    } catch (error) {
      console.error('Write error details:', {
        error,
        prompt,
        context,
        sharedContext
      });
      setError('Failed to generate text. Please try again.');
    } finally {
      setIsLoading(false);
      setDownloadProgress(null);
    }
  };

  if (isAvailable === false) {
    return (
      <div className="container max-w-4xl py-6 space-y-6">
        <h1 className="text-3xl font-bold">Writer</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Writer API Not Available</AlertTitle>
          <AlertDescription>
            To enable the Writer API, please follow these steps:
            <ol className="list-decimal list-inside mt-2">
              <li>Open a new tab in Chrome</li>
              <li>Go to <code>chrome://flags/#text-writer-api</code></li>
              <li>Select <strong>Enabled</strong></li>
              <li>Click <strong>Relaunch Chrome</strong></li>
            </ol>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Writer</h1>
        <p className="text-muted-foreground">
          Generate creative and professional content with AI assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Tone</Label>
          <Select value={tone} onValueChange={(value: typeof tone) => setTone(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Format</Label>
          <Select value={format} onValueChange={(value: typeof format) => setFormat(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="plain-text">Plain Text</SelectItem>
              <SelectItem value="markdown">Markdown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Length</Label>
          <Select value={length} onValueChange={(value: typeof length) => setLength(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="long">Long</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6">
          <div className="space-y-2">
            <Label>Shared Context *</Label>
            <Textarea
              placeholder="Enter context that applies to all writing tasks..."
              className="min-h-[100px]"
              value={sharedContext}
              onChange={(e) => setSharedContext(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Context that applies to all writing tasks.
            </p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <Label>Per-Task Context</Label>
            <Textarea
              placeholder="Enter context for this specific writing task..."
              className="min-h-[100px]"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Context specific to this writing task only.
            </p>
          </div>
        </Card>

    
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="space-y-2">
            <Label>Prompt *</Label>
            <Textarea
              placeholder="Describe what you want to write..."
              className="min-h-[300px]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Generated Content</Label>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(output).then(() => {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  });
                }}
                disabled={!output}
              >
                {isCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Textarea
              placeholder="Generated content will appear here..."
              className="min-h-[300px]"
              value={output}
              readOnly
            />
          </div>
        </Card>
      </div>

      {downloadProgress !== null && (
        <div className="w-full bg-secondary rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${downloadProgress}%` }}
          />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleWrite}
        className="w-full"
        disabled={isLoading || !prompt.trim()}
      >
        {isLoading ? "Generating..." : "Generate Content"}
      </Button>
    </div>
  );
}
