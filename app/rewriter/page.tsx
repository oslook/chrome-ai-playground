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

export default function RewriterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tone, setTone] = useState<'as-is' | 'more-formal' | 'more-casual'>('as-is');
  const [format, setFormat] = useState<'as-is' | 'plain-text' | 'markdown'>('as-is');
  const [length, setLength] = useState<'as-is' | 'shorter' | 'longer'>('as-is');
  const [sharedContext, setSharedContext] = useState('');
  const [context, setContext] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    try {
    } catch (error) {
      setIsAvailable(false);
      console.error('Error checking rewriter availability:', error);
    }
  };

  const handleRewrite = async () => {
    if (!input.trim()) {
      setError('Please enter some text to rewrite.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setOutput('');

    try {
      const rewriter = await ai.rewriter.create({
        tone,
        format,
        length,
        sharedContext: "I'm a long-standing customer."
      });
      console.log('ReWriter instance created successfully', rewriter);


      const stream = rewriter.rewriteStreaming(input);
      
      console.log('Stream reader and decoder initialized');

      for await (const chunk of stream) {
        setOutput(chunk.trim());
      }

      console.log('Cleaning up rewriter instance');
      rewriter.destroy();
    } catch (error) {
      setError('Failed to rewrite text. Please try again.');
      console.error('Rewrite error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAvailable === false) {
    return (
      <div className="container max-w-4xl py-6 space-y-6">
        <h1 className="text-3xl font-bold">Rewriter</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Rewriter API Not Available</AlertTitle>
          <AlertDescription>
            To enable the Rewriter API, please follow these steps:
            <ol className="list-decimal list-inside mt-2">
              <li>Open a new tab in Chrome</li>
              <li>Go to <code>chrome://flags/#text-rewriter-api</code></li>
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
        <h1 className="text-3xl font-bold">Rewriter</h1>
        <p className="text-muted-foreground">
          Rephrase and improve text while maintaining its meaning using AI assistance.
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
              <SelectItem value="as-is">Keep Original</SelectItem>
              <SelectItem value="more-formal">More Formal</SelectItem>
              <SelectItem value="more-casual">More Casual</SelectItem>
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
              <SelectItem value="as-is">Keep Original</SelectItem>
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
              <SelectItem value="as-is">Keep Original</SelectItem>
              <SelectItem value="shorter">Shorter</SelectItem>
              <SelectItem value="longer">Longer</SelectItem>
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
            <Label>Original Text *</Label>
            <Textarea
              placeholder="Enter text to rewrite..."
              className="min-h-[300px]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <Label>Rewritten Text</Label>
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
            <Textarea
              placeholder="Rewritten text will appear here..."
              className="min-h-[300px]"
              value={output}
              readOnly
            />
          </div>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button 
        onClick={handleRewrite} 
        className="w-full"
        disabled={isLoading || !input.trim()}
      >
        {isLoading ? "Rewriting..." : "Rewrite"}
      </Button>
    </div>
  );
}