'use client';

import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState, useEffect, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface DetectionResult {
  detectedLanguage?: string;
  confidence: number;
}

export default function DetectLanguagePage() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<DetectionResult[]>([]);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [detector, setDetector] = useState<any>(null);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    try {
      // @ts-ignore
      if (!translation) {
        setIsAvailable(false);
        return;
      }
      // @ts-ignore
      const availability = await translation?.canDetect();
      if (availability !== 'no') {
        // Initialize detector once when available
        // @ts-ignore
        const newDetector = await translation?.createDetector();
        newDetector.ondownloadprogress = (event: any) => {
          if (event.loaded && event.total) {
            setDownloadProgress((event.loaded / event.total) * 100);
          }
        };
        await newDetector.ready;
        setDetector(newDetector);
        setIsAvailable(true);
      } else {
        setIsAvailable(false);
      }
    } catch (error) {
      setIsAvailable(false);
    }
  };

  // Debounced detect function
  const detectLanguage = useCallback(async (text: string) => {
    if (!text.trim() || !detector) {
      setResults([]);
      return;
    }

    try {
      setIsLoading(true);
      const detectionResults = await detector.detect(text);
      setResults(detectionResults);
      setError(null);
    } catch (error) {
      setError('Failed to detect language. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [detector]);

  // Use effect for handling input changes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      detectLanguage(input);
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [input, detectLanguage]);

  if (isAvailable === false) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Language Detection</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Language Detection Not Available</AlertTitle>
          <AlertDescription>
            To enable the Language Detection API, please follow these steps:
            <ol className="list-decimal list-inside mt-2">
              <li>Open a new tab in Chrome</li>
              <li>Go to <code>chrome://flags/#optimization-guide-on-device-model</code></li>
              <li>Select <strong>Enabled BypassPerfRequirement</strong></li>
              <li>This bypass performance checks which might get in the way of having Gemini Nano downloaded on your device.</li>
              <li>Go to <code>chrome://flags/#language-detection-api-for-gemini-nano</code></li>
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
        <h1 className="text-3xl font-bold">Language Detection</h1>
        <p className="text-muted-foreground">
          Type or paste text to automatically detect its language using Chrome's Language Detection API.
        </p>
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
            <Label>Text to Detect</Label>
            <Textarea
              placeholder="Start typing or paste text to detect its language..."
              className="min-h-[100px]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {downloadProgress > 0 && downloadProgress < 100 && (
            <div className="space-y-2">
              <Label>Downloading language model...</Label>
              <Progress value={downloadProgress} />
            </div>
          )}
        </div>
      </Card>

      {results.length > 0 && (
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Detection Results:</h2>
          <div className="space-y-2">
            {results
              .filter((result) => result.confidence > 0.01)
              .map((result, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="font-medium">
                    {result.detectedLanguage || 'Unknown'}
                  </span>
                  <span className="text-muted-foreground">
                    {(result.confidence * 100).toFixed(2)}% confidence
                  </span>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Supported Languages Section */}
      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-bold">Supported Languages</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold">European</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>English (en)</li>
              <li>French (fr)</li>
              <li>German (de)</li>
              <li>Spanish (es)</li>
              <li>Italian (it)</li>
              <li>Dutch (nl)</li>
              <li>Portuguese (pt)</li>
              <li>Swedish (sv)</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Asian</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Chinese (zh, zh-Latn)</li>
              <li>Japanese (ja, ja-Latn)</li>
              <li>Korean (ko)</li>
              <li>Vietnamese (vi)</li>
              <li>Thai (th)</li>
              <li>Hindi (hi, hi-Latn)</li>
              <li>Bengali (bn)</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Cyrillic</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Russian (ru, ru-Latn)</li>
              <li>Ukrainian (uk)</li>
              <li>Bulgarian (bg, bg-Latn)</li>
              <li>Serbian (sr)</li>
              <li>Belarusian (be)</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Middle Eastern</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Arabic (ar, ar-Latn)</li>
              <li>Hebrew (iw)</li>
              <li>Persian (fa)</li>
              <li>Turkish (tr)</li>
              <li>Kurdish (ku)</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">African</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Swahili (sw)</li>
              <li>Zulu (zu)</li>
              <li>Afrikaans (af)</li>
              <li>Yoruba (yo)</li>
              <li>Hausa (ha)</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Other</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Esperanto (eo)</li>
              <li>Latin (la)</li>
              <li>Maori (mi)</li>
              <li>Hawaiian (haw)</li>
              <li>Luxembourgish (lb)</li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Note: Some languages support both native script and Latin script variants (indicated by -Latn suffix).
          The language codes shown in parentheses are the official codes used by the API.
        </p>
      </div>
    </div>
  );
}