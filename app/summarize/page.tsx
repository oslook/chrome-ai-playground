'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SummarizePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    try {
      // @ts-ignore
      if (!ai?.summarizer) {
        setIsAvailable(false);
        return;
      }
      // @ts-ignore
      const result = await ai.summarizer.create();
      console.log('Summarizer result:', result);
      if (result) {
        setIsAvailable(true);
      } else {
        setIsAvailable(false);
      }
    } catch (error) {
      setIsAvailable(false);
    }
  };

  const handleSummarize = async () => {
    if (!input.trim()) {
      setError("Please enter some text to summarize.");
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      // @ts-ignore
      const summarizer = await ai.summarizer.create();
      const result = await summarizer.summarize(input);
      setOutput(result);
    } catch (error) {
      setError("An error occurred while summarizing the text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAvailable === false) {
    return (
      <div className="container max-w-4xl py-6 space-y-6">
        <h1 className="text-3xl font-bold">Text Summarization</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Chrome AI API Not Available</AlertTitle>
          <AlertDescription>
            To enable the Summarization API, please follow these steps:
            <ol className="list-decimal list-inside mt-2">
              <li>Open a new tab in Chrome</li>
              <li>Go to <code>chrome://flags/#summarization-api-for-gemini-nano</code></li>
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
      <div className="flex items-center space-x-2">
        <FileText className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Text Summarization</h1>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Input Text</label>
            <Textarea
              placeholder="Enter the text you want to summarize..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[200px]"
            />
          </div>

          <Button
            onClick={handleSummarize}
            disabled={isLoading || !input.trim()}
            className="w-full"
          >
            {isLoading ? "Summarizing..." : "Summarize"}
          </Button>

          {output && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Summary</label>
              <Card className="p-4 bg-muted">
                <p className="whitespace-pre-wrap">{output}</p>
              </Card>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}