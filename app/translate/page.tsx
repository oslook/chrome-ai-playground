'use client';

import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
];

export default function TranslatePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('zh');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAvailability();
  }, [sourceLang, targetLang]);

  // Change target language if it's the same as source language
  useEffect(() => {
    if (sourceLang === targetLang) {
      // Find the first available language that's not the source language
      const nextLang = languages.find(lang => lang.code !== sourceLang)?.code || 'en';
      setTargetLang(nextLang);
    }
  }, [sourceLang]);

  const checkAvailability = async () => {
    try {
      console.log('translation checkAvailability');

      // @ts-ignore
      if (!translation) {
        setIsAvailable(false);
        return;
      }
      console.log('translation canTranslate');

      // Check if translation is available for English to Spanish first
      // @ts-ignore
      const baseCheck = await translation?.canTranslate({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      });

      console.log('translation check result:', baseCheck, sourceLang, targetLang);
      if (baseCheck === 'no') {
        setIsAvailable(false);
        return;
      }

      // Then check for the selected language pair
      // @ts-ignore
      const availability = await translation?.canTranslate({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang
      });

      if (availability === 'no') {
        setError(`Translation is not available from ${languages.find(l => l.code === sourceLang)?.name} to ${languages.find(l => l.code === targetLang)?.name}`);
      } else {
        setError(null);
      }

      setIsAvailable(baseCheck !== 'no');
    } catch (error) {
      setIsAvailable(false);
    }
  };

  const handleTranslate = async () => {
    console.log('translation handleTranslate');
    if (!input.trim()) {
      setError('Please enter some text to translate.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // @ts-ignore
      const translator = await translation?.createTranslator({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang
      });

      const result = await translator.translate(input);
      console.log('translation result:', result);
      setOutput(result);
    } catch (error) {
      setError('Failed to translate text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAvailable === false) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Translation</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Translation API Not Available</AlertTitle>
          <AlertDescription>
            To enable the Translation API, please follow these steps:
            <ol className="list-decimal list-inside mt-2">
              <li>Open a new tab in Chrome</li>
              <li>Go to <code>chrome://flags/#optimization-guide-on-device-model</code></li>
              <li>Select <strong>Enabled BypassPerfRequirement</strong></li>
              <li>This bypass performance checks which might get in the way of having Gemini Nano downloaded on your device.</li>
          
              <li>Go to <code>chrome://flags/#translation-api</code></li>
              <li>Select <strong>Enabled</strong></li>
              <li>Click <strong>Relaunch Chrome</strong></li>
              <li>Go to <code>chrome://on-device-translation-internals/</code> and Install the language pack</li>
            </ol>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Translation</h1>
        <p className="text-muted-foreground">
          Translate text between languages using Chrome's Translation API.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Source Language</Label>
              <Select value={sourceLang} onValueChange={setSourceLang}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Text to Translate</Label>
              <Textarea
                placeholder="Enter text to translate..."
                className="min-h-[200px]"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Target Language</Label>
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages
                    .filter(lang => lang.code !== sourceLang)
                    .map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Translation</Label>
              <Textarea
                placeholder="Translation will appear here..."
                className="min-h-[200px]"
                value={output}
                readOnly
              />
            </div>
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
        onClick={handleTranslate} 
        className="w-full"
        disabled={isLoading || !input.trim() || error !== null}
      >
        {isLoading ? "Translating..." : "Translate"}
      </Button>
    </div>
  );
}