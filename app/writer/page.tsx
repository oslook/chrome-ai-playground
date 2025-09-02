'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Copy, Check, PenTool, Sparkles, Settings, FileText, Clock, Zap } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

export default function WriterPage() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tone, setTone] = useState<'formal' | 'neutral' | 'casual'>('neutral');
  const [format, setFormat] = useState<'plain-text' | 'markdown'>('markdown');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [sharedContext, setSharedContext] = useState('');
  const [context, setContext] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isStreaming, setIsStreaming] = useState(true);
  const [writer, setWriter] = useState<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    try {
      console.log('Writer: Checking API availability...');
      // @ts-ignore
      if (!('Writer' in self)) {
        console.log('Writer API not supported');
        setIsAvailable(false);
        return;
      }

      // @ts-ignore
      const availability = await Writer.availability();
      console.log('Writer availability:', availability);

      if (availability === 'available') {
        setIsAvailable(true);
      } else if (availability === 'downloadable') {
        setIsAvailable(true); // Will download when needed
      } else {
        setIsAvailable(false);
      }
    } catch (error) {
      console.error('Error checking Writer availability:', error);
      setIsAvailable(false);
    }
  };

  const createWriter = async () => {
    const options: any = {
      tone,
      format,
      length,
    };

    if (sharedContext.trim()) {
      options.sharedContext = sharedContext;
    }

    console.log('Writer: Creating writer with options:', options);

    // @ts-ignore
    const newWriter = await Writer.create({
      ...options,
      monitor(m) {
        // @ts-ignore
        m.addEventListener('downloadprogress', (e) => {
          // @ts-ignore
          const progress = e.loaded * 100;
          setDownloadProgress(progress);
          console.log(`Writer: Downloaded ${progress}%`);
        });
      },
    });

    return newWriter;
  };

  const handleWrite = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setOutput('');
    setDownloadProgress(0);

    try {
      const writerInstance = await createWriter();
      setWriter(writerInstance);

      abortControllerRef.current = new AbortController();

      if (isStreaming) {
        console.log('Writer: Starting streaming write...');
        const stream = writerInstance.writeStreaming(prompt, {
          context: context.trim() || undefined,
          signal: abortControllerRef.current.signal,
        });

        let fullText = '';
        for await (const chunk of stream) {
          fullText += chunk;
          setOutput(fullText);
        }
      } else {
        console.log('Writer: Starting non-streaming write...');
        const result = await writerInstance.write(prompt, {
          context: context.trim() || undefined,
          signal: abortControllerRef.current.signal,
        });
        setOutput(result);
      }

      console.log('Writer: Write completed successfully');
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Writer: Write was aborted');
      } else {
        console.error('Writer error:', error);
        setError('Failed to generate content. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setDownloadProgress(0);
      if (writer) {
        writer.destroy();
        setWriter(null);
      }
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setDownloadProgress(0);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  if (isAvailable === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PenTool className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              AI Content Writer
            </h1>
            <p className="text-lg text-muted-foreground">
              Generate creative and professional content with AI assistance
            </p>
          </div>

          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Writer API Not Available</AlertTitle>
            <AlertDescription>
              <p className="mb-3">The Writer API requires Chrome Origin Trial registration. Here's how to enable it:</p>
              <div className="space-y-3">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-medium mb-2">Step 1: Join Origin Trial</h4>
                  <p className="text-sm">Visit <a href="https://developer.chrome.com/origintrials" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Chrome Origin Trials</a> and register for the Writer API.</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-medium mb-2">Step 2: Get Trial Token</h4>
                  <p className="text-sm">Receive your trial token and add it to your website headers.</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-medium mb-2">Step 3: Enable Chrome Flags</h4>
                  <p className="text-sm">Go to <code className="bg-background px-1 py-0.5 rounded">chrome://flags/#writer-api-for-gemini-nano</code> and enable it.</p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border border-border mb-4">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-muted-foreground">
              Chrome AI Writer
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-4">
            AI Content Writer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate creative and professional content with customizable tone, format, and length.
            Powered by Gemini Nano for client-side AI processing.
          </p>
        </div>

        {/* API Status */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800 dark:text-green-200">Writer API Available</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">Content Generation</h3>
                </div>

                <div className="space-y-4">
                  {/* Writing Options */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-card-foreground">Tone</Label>
                      <Select value={tone} onValueChange={(value: typeof tone) => setTone(value)}>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="formal">🎩 Formal</SelectItem>
                          <SelectItem value="neutral">⚖️ Neutral</SelectItem>
                          <SelectItem value="casual">😊 Casual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-card-foreground">Format</Label>
                      <Select value={format} onValueChange={(value: typeof format) => setFormat(value)}>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="markdown">📝 Markdown</SelectItem>
                          <SelectItem value="plain-text">📄 Plain Text</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-card-foreground">Length</Label>
                      <Select value={length} onValueChange={(value: typeof length) => setLength(value)}>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">📏 Short</SelectItem>
                          <SelectItem value="medium">📐 Medium</SelectItem>
                          <SelectItem value="long">📏 Long</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Streaming Toggle */}
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-primary" />
                      <div>
                        <Label className="text-sm font-medium text-card-foreground">Streaming Mode</Label>
                        <p className="text-xs text-muted-foreground">Real-time content generation</p>
                      </div>
                    </div>
                    <Switch
                      checked={isStreaming}
                      onCheckedChange={setIsStreaming}
                    />
                  </div>

                  {/* Shared Context */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-card-foreground flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Shared Context
                    </Label>
                    <Textarea
                      placeholder="Context that applies to all writing tasks (e.g., 'This is for a professional blog about technology')"
                      className="min-h-[80px] bg-background border-border resize-none"
                      value={sharedContext}
                      onChange={(e) => setSharedContext(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional: Context shared across multiple writing tasks
                    </p>
                  </div>

                  {/* Per-Task Context */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-card-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Task Context
                    </Label>
                    <Textarea
                      placeholder="Context specific to this writing task (e.g., 'Write for a technical audience')"
                      className="min-h-[80px] bg-background border-border resize-none"
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional: Context specific to this particular task
                    </p>
                  </div>

                  {/* Prompt */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-card-foreground">Writing Prompt *</Label>
                    <Textarea
                      placeholder="Describe what you want to write (e.g., 'Write a blog post about the benefits of AI in education')"
                      className="min-h-[120px] bg-background border-border resize-none"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">Generated Content</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    disabled={!output}
                    className="flex items-center gap-2"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-xs">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-xs">Copy</span>
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-4">
                  <Textarea
                    placeholder="Your generated content will appear here..."
                    className="min-h-[400px] bg-background border-border resize-none"
                    value={output}
                    readOnly
                  />

                  {output && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{output.length} characters</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Action Section */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isLoading && downloadProgress > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-card-foreground">
                      Downloading AI model...
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(downloadProgress)}%
                    </span>
                  </div>
                  <Progress value={downloadProgress} className="w-full h-2" />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {isLoading && (
                <Button
                  onClick={handleStop}
                  variant="outline"
                  className="px-6"
                >
                  Stop Generation
                </Button>
              )}
              <Button
                onClick={handleWrite}
                size="lg"
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {downloadProgress > 0 ? "Downloading..." : "Generating..."}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Content</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Features Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-card-foreground">Real-time Streaming</h4>
                <p className="text-sm text-muted-foreground">Watch content generate in real-time</p>
              </div>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-medium text-card-foreground">Flexible Context</h4>
                <p className="text-sm text-muted-foreground">Shared and per-task context support</p>
              </div>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <PenTool className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-medium text-card-foreground">Multiple Formats</h4>
                <p className="text-sm text-muted-foreground">Markdown and plain text output</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
