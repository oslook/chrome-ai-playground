'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Copy, Check, MessageSquare, Sparkles, Settings, Brain, Zap, Clock, RotateCcw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ModelParams {
  defaultTopK: number;
  maxTopK: number;
  defaultTemperature: number;
  maxTemperature: number;
}

export default function PromptPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isStreaming, setIsStreaming] = useState(true);
  const [modelParams, setModelParams] = useState<ModelParams | null>(null);
  const [temperature, setTemperature] = useState(1.0);
  const [topK, setTopK] = useState(3);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [conversation, setConversation] = useState<Array<{role: string, content: string}>>([]);
  const [session, setSession] = useState<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    checkAvailability();
    return () => {
      if (session) {
        session.destroy();
      }
    };
  }, []);

  const checkAvailability = async () => {
    try {
      console.log('Prompt: Checking API availability...');
      // @ts-ignore
      if (!('LanguageModel' in self)) {
        console.log('LanguageModel API not supported');
        setIsAvailable(false);
        return;
      }

      // @ts-ignore
      const availability = await LanguageModel.availability();
      console.log('LanguageModel availability:', availability);

      if (availability === 'available') {
        setIsAvailable(true);
        // @ts-ignore
        const params = await LanguageModel.params();
        setModelParams(params);
        setTemperature(params.defaultTemperature);
        setTopK(params.defaultTopK);
      } else if (availability === 'downloadable') {
        setIsAvailable(true);
        // @ts-ignore
        const params = await LanguageModel.params();
        setModelParams(params);
        setTemperature(params.defaultTemperature);
        setTopK(params.defaultTopK);
      } else {
        setIsAvailable(false);
      }
    } catch (error) {
      console.error('Error checking LanguageModel availability:', error);
      setIsAvailable(false);
    }
  };

  const createSession = async () => {
    const options: any = {
      temperature,
      topK,
    };

    if (systemPrompt.trim()) {
      options.initialPrompts = [
        { role: 'system', content: systemPrompt }
      ];
    }

    console.log('Prompt: Creating session with options:', options);

    // @ts-ignore
    const newSession = await LanguageModel.create({
      ...options,
      // @ts-ignore
      monitor(m) {
        // @ts-ignore
        m.addEventListener('downloadprogress', (e) => {
          // @ts-ignore
          const progress = e.loaded * 100;
          setDownloadProgress(progress);
          console.log(`Prompt: Downloaded ${progress}%`);
        });
      },
    });

    return newSession;
  };

  const handlePrompt = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setDownloadProgress(0);

    try {
      const currentSession = session || await createSession();
      if (!session) {
        setSession(currentSession);
      }

      abortControllerRef.current = new AbortController();

      // Add user message to conversation
      const newConversation = [...conversation, { role: 'user', content: prompt }];
      setConversation(newConversation);

      if (isStreaming) {
        console.log('Prompt: Starting streaming prompt...');
        const stream = currentSession.promptStreaming(prompt, {
          signal: abortControllerRef.current.signal,
        });

        let fullText = '';
        for await (const chunk of stream) {
          fullText += chunk;
          setResponse(fullText);
        }

        // Add assistant response to conversation
        setConversation([...newConversation, { role: 'assistant', content: fullText }]);
      } else {
        console.log('Prompt: Starting non-streaming prompt...');
        const result = await currentSession.prompt(prompt, {
          signal: abortControllerRef.current.signal,
        });
        setResponse(result);

        // Add assistant response to conversation
        setConversation([...newConversation, { role: 'assistant', content: result }]);
      }

      console.log('Prompt: Response completed successfully');
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Prompt: Request was aborted');
      } else {
        console.error('Prompt error:', error);
        setError('Failed to generate response. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setDownloadProgress(0);
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
      await navigator.clipboard.writeText(response);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const clearConversation = () => {
    setConversation([]);
    setResponse('');
    setPrompt('');
    if (session) {
      session.destroy();
      setSession(null);
    }
  };

  const [error, setError] = useState<string | null>(null);

  if (isAvailable === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              AI Prompt Playground
            </h1>
            <p className="text-lg text-muted-foreground">
              Interact with Gemini Nano through natural language prompts
            </p>
          </div>

          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Language Model API Not Available</AlertTitle>
            <AlertDescription>
              <p className="mb-3">The Prompt API requires Chrome Origin Trial registration. Here's how to enable it:</p>
              <div className="space-y-3">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-medium mb-2">Step 1: Join Origin Trial</h4>
                  <p className="text-sm">Visit <a href="https://developer.chrome.com/origintrials" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Chrome Origin Trials</a> and register for the Prompt API.</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-medium mb-2">Step 2: Get Trial Token</h4>
                  <p className="text-sm">Receive your trial token and add it to your website headers.</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-medium mb-2">Step 3: Enable Chrome Flags</h4>
                  <p className="text-sm">Go to <code className="bg-background px-1 py-0.5 rounded">chrome://flags/#prompt-api-for-gemini-nano</code> and enable it.</p>
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
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-muted-foreground">
              Chrome AI Prompt
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent mb-4">
            AI Prompt Playground
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Interact with Gemini Nano through natural language prompts.
            Experience conversational AI with customizable parameters.
          </p>
        </div>

        {/* API Status */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800 dark:text-green-200">Language Model API Available</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">Prompt Input</h3>
                </div>

                <div className="space-y-4">
                  {/* System Prompt */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-card-foreground flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      System Prompt
                    </Label>
                    <Textarea
                      placeholder="You are a helpful and friendly assistant..."
                      className="min-h-[80px] bg-background border-border resize-none"
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional: Set the AI's behavior and personality
                    </p>
                  </div>

                  {/* Model Parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-card-foreground">Temperature</Label>
                        <Badge variant="secondary" className="text-xs">
                          {temperature.toFixed(1)}
                        </Badge>
                      </div>
                      <Slider
                        value={[temperature]}
                        min={0}
                        max={modelParams?.maxTemperature ?? 2}
                        step={0.1}
                        onValueChange={([value]) => setTemperature(value)}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Controls randomness (0-2)
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-card-foreground">Top-K</Label>
                        <Badge variant="secondary" className="text-xs">
                          {topK}
                        </Badge>
                      </div>
                      <Slider
                        value={[topK]}
                        min={1}
                        max={modelParams?.maxTopK ?? 128}
                        step={1}
                        onValueChange={([value]) => setTopK(value)}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Token selection range (1-128)
                      </p>
                    </div>
                  </div>

                  {/* Streaming Toggle */}
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-primary" />
                      <div>
                        <Label className="text-sm font-medium text-card-foreground">Streaming Mode</Label>
                        <p className="text-xs text-muted-foreground">Real-time response generation</p>
                      </div>
                    </div>
                    <Switch
                      checked={isStreaming}
                      onCheckedChange={setIsStreaming}
                    />
                  </div>

                  {/* User Prompt */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-card-foreground">Your Prompt *</Label>
                    <Textarea
                      placeholder="Ask me anything..."
                      className="min-h-[120px] bg-background border-border resize-none"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{prompt.length} characters</span>
                      {prompt.trim() && (
                        <Badge variant="secondary" className="text-xs">
                          Ready to send
                        </Badge>
                      )}
                    </div>
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
                      <Brain className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">AI Response</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyToClipboard}
                      disabled={!response}
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearConversation}
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span className="text-xs">Clear</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Textarea
                    placeholder="AI response will appear here..."
                    className="min-h-[300px] bg-background border-border resize-none"
                    value={response}
                    readOnly
                  />

                  {response && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{response.length} characters</span>
                      <Badge variant="outline" className="text-xs">
                        {isStreaming ? 'Streaming' : 'Complete'}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Conversation History */}
            {conversation.length > 0 && (
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
                <div className="p-6">
                  <h4 className="font-medium text-card-foreground mb-4 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Conversation History
                  </h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {conversation.map((msg, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-blue-50 dark:bg-blue-900/20 ml-8'
                            : 'bg-green-50 dark:bg-green-900/20 mr-8'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={msg.role === 'user' ? 'default' : 'secondary'} className="text-xs">
                            {msg.role === 'user' ? 'You' : 'AI'}
                          </Badge>
                        </div>
                        <p className="text-sm text-card-foreground">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
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
                onClick={handlePrompt}
                size="lg"
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
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
                    <span>Send Prompt</span>
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
                <p className="text-sm text-muted-foreground">Watch responses generate in real-time</p>
              </div>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-medium text-card-foreground">Customizable Parameters</h4>
                <p className="text-sm text-muted-foreground">Fine-tune temperature and top-k settings</p>
              </div>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h4 className="font-medium text-card-foreground">Conversational AI</h4>
                <p className="text-sm text-muted-foreground">Maintain context across multiple interactions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}