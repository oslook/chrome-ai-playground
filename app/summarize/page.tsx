'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, FileText, Zap, Target, Lightbulb, Hash, BookOpen, Settings } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';

type SummaryType = 'key-points' | 'tldr' | 'teaser' | 'headline';
type SummaryFormat = 'markdown' | 'plain-text';
type SummaryLength = 'short' | 'medium' | 'long';

interface SummaryOptions {
  type: SummaryType;
  format: SummaryFormat;
  length: SummaryLength;
  sharedContext?: string;
  context?: string;
}

const summaryTypes = [
  {
    value: 'key-points' as SummaryType,
    label: 'Key Points',
    description: 'Extract main points as bullet list',
    icon: Target,
    color: 'bg-primary'
  },
  {
    value: 'tldr' as SummaryType,
    label: 'TL;DR',
    description: 'Quick overview for busy readers',
    icon: Zap,
    color: 'bg-secondary'
  },
  {
    value: 'teaser' as SummaryType,
    label: 'Teaser',
    description: 'Highlight interesting parts',
    icon: Lightbulb,
    color: 'bg-accent'
  },
  {
    value: 'headline' as SummaryType,
    label: 'Headline',
    description: 'One-sentence title summary',
    icon: Hash,
    color: 'bg-destructive'
  }
];

const lengthOptions = [
  { value: 'short' as SummaryLength, label: 'Short', description: 'Concise summary' },
  { value: 'medium' as SummaryLength, label: 'Medium', description: 'Balanced length' },
  { value: 'long' as SummaryLength, label: 'Long', description: 'Detailed summary' }
];

const formatOptions = [
  { value: 'markdown' as SummaryFormat, label: 'Markdown', description: 'Formatted text' },
  { value: 'plain-text' as SummaryFormat, label: 'Plain Text', description: 'Simple text' }
];

export default function SummarizePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Summary options
  const [summaryType, setSummaryType] = useState<SummaryType>('key-points');
  const [summaryLength, setSummaryLength] = useState<SummaryLength>('medium');
  const [summaryFormat, setSummaryFormat] = useState<SummaryFormat>('markdown');
  const [sharedContext, setSharedContext] = useState('');
  const [context, setContext] = useState('');
  const [useStreaming, setUseStreaming] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    try {
      // @ts-ignore
      if (!('Summarizer' in self)) {
        setIsAvailable(false);
        return;
      }

      // @ts-ignore
      const availability = await Summarizer.availability();
      console.log('Summarizer availability:', availability);

      if (availability === 'available' || availability === 'downloadable') {
        setIsAvailable(true);
      } else {
        setIsAvailable(false);
      }
    } catch (error) {
      console.error('Error checking summarizer availability:', error);
      setIsAvailable(false);
    }
  };

  const createSummarizer = useCallback(async () => {
    const options: any = {
      type: summaryType,
      format: summaryFormat,
      length: summaryLength,
      monitor(m: any) {
        // @ts-ignore
        m.addEventListener('downloadprogress', (e) => {
          // @ts-ignore
          const progress = e.loaded * 100;
          setDownloadProgress(progress);
          console.log(`Summarizer downloaded: ${progress}%`);
        });
      }
    };

    if (sharedContext.trim()) {
      options.sharedContext = sharedContext.trim();
    }

    // @ts-ignore
    return await Summarizer.create(options);
  }, [summaryType, summaryFormat, summaryLength, sharedContext]);

  const handleSummarize = async () => {
    if (!input.trim()) {
      setError("Please enter some text to summarize.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setDownloadProgress(0);

    try {
      const summarizer = await createSummarizer();

      if (useStreaming) {
        // Streaming summarization
        const stream = summarizer.summarizeStreaming(input, {
          context: context.trim() || undefined
        });

        let fullResult = '';
        for await (const chunk of stream) {
          fullResult = chunk;
          setOutput(fullResult);
        }
      } else {
        // Batch summarization
        const result = await summarizer.summarize(input, {
          context: context.trim() || undefined
        });
        setOutput(result);
      }
    } catch (error) {
      console.error('Summarization error:', error);
      setError("An error occurred while summarizing the text. Please try again.");
    } finally {
      setIsLoading(false);
      setDownloadProgress(0);
    }
  };

  const getCurrentTypeInfo = () => {
    return summaryTypes.find(type => type.value === summaryType);
  };

  if (isAvailable === false) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border border-border mb-4">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-muted-foreground">
                Chrome AI Summarization
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-4">
              Smart Summarization
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform long texts into concise, meaningful summaries using Chrome's built-in AI
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-destructive mt-0.5" />
                <div>
                  <h4 className="font-medium text-destructive mb-2">
                    Summarizer API Not Available
                  </h4>
                  <p className="text-sm text-destructive/80 mb-4">
                    The Summarizer API requires Chrome 138 or later with specific hardware requirements.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-destructive mb-2">System Requirements:</h5>
                      <ul className="text-sm text-destructive/70 space-y-1">
                        <li>• Windows 10/11, macOS 13+, Linux, or ChromeOS</li>
                        <li>• At least 22GB free storage space</li>
                        <li>• GPU with more than 4GB VRAM</li>
                        <li>• Unlimited or unmetered internet connection</li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-destructive mb-2">Setup Steps:</h5>
                      <ol className="text-sm text-destructive/70 space-y-1 list-decimal list-inside">
                        <li>Open Chrome and go to <code>chrome://flags/#optimization-guide-on-device-model</code></li>
                        <li>Select <strong>Enabled BypassPerfRequirement</strong></li>
                        <li>Go to <code>chrome://flags/#summarization-api-for-gemini-nano</code></li>
                        <li>Select <strong>Enabled</strong></li>
                        <li>Click <strong>Relaunch Chrome</strong></li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentType = getCurrentTypeInfo();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border border-border mb-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-muted-foreground">
              Chrome AI Summarization
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-4">
            Smart Summarization
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform long texts into concise, meaningful summaries using Chrome's built-in AI
          </p>
        </div>

        {/* API Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-card/70 backdrop-blur-sm rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-primary' : 'bg-destructive'}`}></div>
                <div>
                  <p className="font-medium text-card-foreground">Summarizer API</p>
                  <p className="text-sm text-muted-foreground">
                    {isAvailable ? 'Ready to summarize' : 'Not available'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Chrome 138+</p>
              </div>
            </div>
          </div>

          <div className="bg-card/70 backdrop-blur-sm rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${useStreaming ? 'bg-secondary' : 'bg-muted'}`}></div>
                <div>
                  <p className="font-medium text-card-foreground">Processing Mode</p>
                  <p className="text-sm text-muted-foreground">
                    {useStreaming ? 'Real-time streaming' : 'Batch processing'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  {useStreaming ? 'Live' : 'Complete'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">Source Text</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-card-foreground mb-2 block">
                  Text to Summarize
                </Label>
                <Textarea
                  placeholder="Paste your article, document, or any long text here..."
                  className="min-h-[200px] bg-background border-input resize-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {input.length} characters
                </p>
              </div>

              {/* Summary Type Selection */}
              <div>
                <Label className="text-sm font-medium text-card-foreground mb-3 block">
                  Summary Type
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {summaryTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = summaryType === type.value;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setSummaryType(type.value)}
                        className={`p-3 rounded-lg border transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border bg-background hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-card-foreground'}`}>
                            {type.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground text-left">
                          {type.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Advanced Options Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-card-foreground">Advanced Options</span>
                </div>
                <Switch
                  checked={showAdvanced}
                  onCheckedChange={setShowAdvanced}
                />
              </div>

              {/* Advanced Options */}
              {showAdvanced && (
                <div className="space-y-4 pt-2 border-t border-border">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-card-foreground mb-2 block">
                        Length
                      </Label>
                      <Select value={summaryLength} onValueChange={(value: SummaryLength) => setSummaryLength(value)}>
                        <SelectTrigger className="bg-background border-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {lengthOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-card-foreground mb-2 block">
                        Format
                      </Label>
                      <Select value={summaryFormat} onValueChange={(value: SummaryFormat) => setSummaryFormat(value)}>
                        <SelectTrigger className="bg-background border-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {formatOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-card-foreground mb-2 block">
                      Shared Context (Optional)
                    </Label>
                    <Textarea
                      placeholder="Provide context about the content type (e.g., 'This is a scientific article', 'This is a news article')..."
                      className="min-h-[60px] bg-background border-input resize-none"
                      value={sharedContext}
                      onChange={(e) => setSharedContext(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-card-foreground mb-2 block">
                      Specific Context (Optional)
                    </Label>
                    <Textarea
                      placeholder="Additional context for this specific summary (e.g., 'This article is intended for junior developers')..."
                      className="min-h-[60px] bg-background border-input resize-none"
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={useStreaming}
                      onCheckedChange={setUseStreaming}
                    />
                    <div>
                      <Label className="text-sm font-medium text-card-foreground">
                        Enable Streaming
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Show results in real-time as they are generated
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                <FileText className="text-secondary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">Summary</h3>
            </div>

            <div className="space-y-4">
              {output ? (
                <div className="min-h-[200px] bg-background border border-input rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {currentType && (
                      <>
                        <currentType.icon className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">
                          {currentType.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          • {summaryLength} • {summaryFormat}
                        </span>
                      </>
                    )}
                  </div>
                  <div className={`prose prose-sm max-w-none ${
                    summaryFormat === 'markdown' ? 'prose-headings:text-card-foreground prose-p:text-card-foreground prose-li:text-card-foreground' : ''
                  }`}>
                    {summaryFormat === 'markdown' ? (
                      <div dangerouslySetInnerHTML={{
                        __html: output.replace(/\n/g, '<br>')
                      }} />
                    ) : (
                      <p className="whitespace-pre-wrap text-card-foreground">{output}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="min-h-[200px] bg-muted/30 border-2 border-dashed border-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      {isLoading ? 'Generating summary...' : 'Your summary will appear here'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1">
              {error && (
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                </div>
              )}

              {isLoading && downloadProgress > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-card-foreground">
                      Downloading summarization model...
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(downloadProgress)}%
                    </span>
                  </div>
                  <Progress value={downloadProgress} className="w-full h-2" />
                </div>
              )}
            </div>

            <Button
              onClick={handleSummarize}
              size="lg"
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  {downloadProgress > 0 ? "Downloading..." : "Summarizing..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Generate Summary</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Summary Types Guide */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Lightbulb className="text-accent-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">Summary Types Guide</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {summaryTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.value} className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 ${type.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-card-foreground">{type.label}</h4>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {type.value === 'key-points' && 'Perfect for extracting main ideas from articles or documents'}
                    {type.value === 'tldr' && 'Ideal for busy readers who want quick overviews'}
                    {type.value === 'teaser' && 'Great for highlighting interesting content to attract readers'}
                    {type.value === 'headline' && 'Best for creating concise titles or subject lines'}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>💡 Tip:</strong> Different summary types work best for different content types.
              Try "Key Points" for technical articles, "TL;DR" for news, "Teaser" for blog posts, and "Headline" for any content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}