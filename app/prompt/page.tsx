'use client';

import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ModelCapabilities {
  available: 'readily' | 'after-download' | 'no';
  defaultTopK?: number;
  maxTopK?: number;
  defaultTemperature?: number;
}

export default function PromptPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capabilities, setCapabilities] = useState<ModelCapabilities | null>(null);
  const [temperature, setTemperature] = useState(0.7);
  const [topK, setTopK] = useState<number>(40);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [tokenCount, setTokenCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const modelRef = useRef<any>(null);

  useEffect(() => {
    checkAvailability();
    return () => {
      if (modelRef.current) {
        modelRef.current.destroy();
      }
    };
  }, []);

  const checkAvailability = async () => {
    try {
      // @ts-ignore
      if (!ai?.languageModel) {
        setIsAvailable(false);
        return;
      }

      // @ts-ignore
      const caps = await ai.languageModel.capabilities();
      setCapabilities(caps);
      console.log('Language Model capabilities:', caps);
      
      if (caps.available === 'readily' || caps.available === 'after-download') {
        setIsAvailable(true);
        // @ts-ignore
        const model = await ai.languageModel.create();
        modelRef.current = model;
        setTemperature(caps.defaultTemperature ?? 0.7);
        setTopK(caps.defaultTopK ?? 40);
      } else {
        setIsAvailable(false);
      }
    } catch (error) {
      console.error('Failed to check availability:', error);
      setIsAvailable(false);
    }
  };

  const countTokens = async () => {
    if (!prompt.trim() || !modelRef.current) return;
    try {
      const count = await modelRef.current.countPromptTokens(prompt);
      setTokenCount(count);
    } catch (error) {
      console.error('Failed to count tokens:', error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      countTokens();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [prompt]);

  const handleSubmit = async () => {
    if (!prompt.trim() || !modelRef.current) return;
    setIsLoading(true);
    setResponse('');

    try {
      const options = {
        temperature,
        topK,
        systemPrompt: systemPrompt || undefined
      };

      if (isStreaming) {
        const stream = modelRef.current.promptStreaming(prompt, options);
        const reader = stream.getReader();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated = value;
          setResponse(accumulated);
        }
      } else {
        const result = await modelRef.current.prompt(prompt, options);
        setResponse(result);
      }
    } catch (error) {
      setResponse('Error: Failed to generate response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAvailable === false) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Prompt API Playground</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Chrome AI API Not Available</AlertTitle>
          <AlertDescription>
            To enable the Prompt API, please follow these steps:
            <ol className="list-decimal list-inside mt-2">
              <li>Open a new tab in Chrome</li>
              <li>Go to <code>chrome://flags/#optimization-guide-on-device-model</code></li>
              <li>Select <strong>Enabled BypassPerfRequirement</strong></li>
              <li>This bypass performance checks which might get in the way of having Gemini Nano downloaded on your device.</li>
              <li>Go to <code>chrome://flags/#prompt-api-for-gemini-nano</code></li>
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
        <h1 className="text-3xl font-bold">Prompt API Playground</h1>
        <p className="text-muted-foreground">
          Experiment with Chrome's language model capabilities through natural language prompts.
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* System Prompt */}
          <div className="space-y-2">
            <Label>System Prompt (Optional)</Label>
            <Textarea
              placeholder="Enter system prompt to set context..."
              className="min-h-[80px]"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            />
          </div>

          {/* Main Prompt */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Prompt</Label>
              {tokenCount !== null && (
                <span className="text-sm text-muted-foreground">
                  Tokens: {tokenCount}
                </span>
              )}
            </div>
            <Textarea
              placeholder="Enter your prompt here..."
              className="min-h-[100px]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Temperature: {temperature}</Label>
              <Slider
                value={[temperature]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={([value]) => setTemperature(value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Top-K: {topK}</Label>
              <Slider
                value={[topK]}
                min={1}
                max={capabilities?.maxTopK ?? 100}
                step={1}
                onValueChange={([value]) => setTopK(value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={isStreaming}
              onCheckedChange={setIsStreaming}
            />
            <Label>Stream Response</Label>
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={!prompt.trim() || isLoading}
          >
            {isLoading ? "Generating..." : "Send Prompt"}
          </Button>
        </div>
      </Card>

      {response && (
        <Card className="p-6">
          <h2 className="font-semibold mb-2">Response:</h2>
          <div className="whitespace-pre-wrap">{response}</div>
        </Card>
      )}
    </div>
  );
}