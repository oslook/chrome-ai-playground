'use client';

import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect, useCallback } from 'react';
import { Label } from '@/components/ui/label';

const languages = [
  // Major World Languages
  { code: 'en', name: 'English' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'es', name: 'Spanish' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'de', name: 'German' },
  { code: 'fr', name: 'French' },
  { code: 'it', name: 'Italian' },
  { code: 'ko', name: 'Korean' },
  { code: 'tr', name: 'Turkish' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'th', name: 'Thai' },
  { code: 'nl', name: 'Dutch' },

  // European Languages
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'pl', name: 'Polish' },
  { code: 'cs', name: 'Czech' },
  { code: 'sk', name: 'Slovak' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'ro', name: 'Romanian' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'hr', name: 'Croatian' },
  { code: 'sr', name: 'Serbian' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'et', name: 'Estonian' },
  { code: 'lv', name: 'Latvian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'el', name: 'Greek' },
  { code: 'he', name: 'Hebrew' },
  { code: 'uk', name: 'Ukrainian' },

  // Asian Languages
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'mr', name: 'Marathi' },
  { code: 'ur', name: 'Urdu' },
  { code: 'fa', name: 'Persian' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ms', name: 'Malay' },
  { code: 'fil', name: 'Filipino' },
  { code: 'my', name: 'Burmese' },
  { code: 'km', name: 'Khmer' },
  { code: 'lo', name: 'Lao' },

  // Other Languages
  { code: 'sw', name: 'Swahili' },
  { code: 'am', name: 'Amharic' },
  { code: 'ha', name: 'Hausa' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'ig', name: 'Igbo' },
  { code: 'zu', name: 'Zulu' },
];

export default function TranslatePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('zh');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Language detection states
  const [detectorAvailable, setDetectorAvailable] = useState<boolean | null>(null);
  const [detectedLanguages, setDetectedLanguages] = useState<any[]>([]);
  const [detector, setDetector] = useState<any>(null);
  const [detectionLoading, setDetectionLoading] = useState(false);

  useEffect(() => {
    checkAvailability();
    initializeDetector();
  }, []);

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
      console.log('Translator checkAvailability');

      // @ts-ignore
      if (!('Translator' in self)) {
        setIsAvailable(false);
        return;
      }
      console.log('Translator availability check');

      // Check availability for the selected language pair
      // @ts-ignore
      const availability = await Translator.availability({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      });

      console.log('Translator availability result:', availability, sourceLang, targetLang);
      if (availability === 'no') {
        setIsAvailable(false);
        setError(`Translation is not available from ${languages.find(l => l.code === sourceLang)?.name} to ${languages.find(l => l.code === targetLang)?.name}`);
        return;
      }

      setError(null);
      setIsAvailable(availability === 'available' || availability === 'downloadable');
    } catch (error) {
      console.error('Error checking availability:', error);
      setIsAvailable(false);
    }
  };

  const initializeDetector = async () => {
    try {
      // @ts-ignore
      if (!('LanguageDetector' in self)) {
        setDetectorAvailable(false);
        return;
      }

      // @ts-ignore
      const detector = await LanguageDetector.create({
        // @ts-ignore
        monitor(m) {
          // @ts-ignore
          m.addEventListener('downloadprogress', (e) => {
            // @ts-ignore
            console.log(`Language detector downloaded: ${e.loaded * 100}%`);
          });
        },
      });
      setDetector(detector);
      setDetectorAvailable(true);
    } catch (error) {
      console.error('Error initializing language detector:', error);
      setDetectorAvailable(false);
    }
  };

  const detectLanguage = useCallback(async (text: string) => {
    if (!text.trim() || !detector) {
      setDetectedLanguages([]);
      return;
    }

    try {
      setDetectionLoading(true);
      // @ts-ignore
      const results = await detector.detect(text);
      setDetectedLanguages(results);

      // Auto-select the most confident detected language if it's in our supported list
      if (results.length > 0 && results[0].confidence > 0.5) {
        const detectedLang = results[0].detectedLanguage;
        const supportedLang = languages.find(lang => lang.code === detectedLang);
        if (supportedLang && detectedLang !== sourceLang) {
          setSourceLang(detectedLang);
        }
      }
    } catch (error) {
      console.error('Language detection error:', error);
      setDetectedLanguages([]);
    } finally {
      setDetectionLoading(false);
    }
  }, [detector, sourceLang]);

  // Auto-detect language when input changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      detectLanguage(input);
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [input, detectLanguage]);

  const handleTranslate = async () => {
    console.log('Translator handleTranslate');
    if (!input.trim()) {
      setError('Please enter some text to translate.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      setDownloadProgress(0);
      // @ts-ignore
      const translator = await Translator.create({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        // @ts-ignore
        monitor(m) {
          // @ts-ignore
          m.addEventListener('downloadprogress', (e) => {
            // @ts-ignore
            const progress = e.loaded * 100;
            setDownloadProgress(progress);
            console.log(`Downloaded ${progress}%`);
          });
        },
      });

      const result = await translator.translate(input);
      console.log('translation result:', result);
      setOutput(result);
    } catch (error) {
      console.error('Translation error:', error);
      setError('Failed to translate text. Please try again.');
    } finally {
      setIsLoading(false);
      setDownloadProgress(0);
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
            <p className="mb-2">The Translation API requires Chrome 138 or later. Please ensure you're using:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Chrome version 138 or higher</li>
              <li>Chrome stable channel (not beta or canary)</li>
            </ul>
            <p className="mt-2">To enable the Translation API, follow these steps:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Open a new tab in Chrome</li>
              <li>Go to <code>chrome://flags/#optimization-guide-on-device-model</code></li>
              <li>Select <strong>Enabled BypassPerfRequirement</strong></li>
              <li>This bypasses performance checks for Gemini Nano download</li>
              <li>Go to <code>chrome://flags/#translation-api</code></li>
              <li>Select <strong>Enabled</strong></li>
              <li>Click <strong>Relaunch Chrome</strong></li>
              <li>Go to <code>chrome://on-device-translation-internals/</code> and install language packs</li>
            </ol>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border border-border mb-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-muted-foreground">
              Chrome AI Translation
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-4">
            Smart Translation
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Translate text between languages with automatic language detection powered by Chrome's built-in AI
          </p>
        </div>

        {/* API Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-card/70 backdrop-blur-sm rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-primary' : 'bg-destructive'}`}></div>
                <div>
                  <p className="font-medium text-card-foreground">Translation API</p>
                  <p className="text-sm text-muted-foreground">
                    {isAvailable ? 'Ready to translate' : 'Not available'}
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
                <div className={`w-3 h-3 rounded-full ${detectorAvailable ? 'bg-primary' : 'bg-destructive'}`}></div>
                <div>
                  <p className="font-medium text-card-foreground">Language Detection</p>
                  <p className="text-sm text-muted-foreground">
                    {detectorAvailable ? 'Auto-detecting' : 'Manual selection'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Chrome 138+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Translation Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Source Section */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary font-semibold">A</span>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">Source Text</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-card-foreground mb-2 block">
                  Language
                </Label>
                <Select
                  value={sourceLang}
                  onValueChange={(value) => {
                    setSourceLang(value);
                    setDetectedLanguages([]);
                  }}
                >
                  <SelectTrigger className="w-full bg-background border-input">
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

              <div>
                <Label className="text-sm font-medium text-card-foreground mb-2 block">
                  Text to Translate
                </Label>
                <Textarea
                  placeholder="Type or paste your text here..."
                  className="min-h-[200px] bg-background border-input resize-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>

              {/* Language Detection Results */}
              {detectorAvailable && (
                <div className="space-y-3">
                  {detectedLanguages.length > 0 ? (
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground text-xs">✓</span>
                        </div>
                        <p className="text-sm font-medium text-primary">
                          Detected Languages
                        </p>
                      </div>
                      <div className="space-y-2">
                        {detectedLanguages
                          .filter((result) => result.confidence > 0.01)
                          .slice(0, 3)
                          .map((result, index) => {
                            const langInfo = languages.find(lang => lang.code === result.detectedLanguage);
                            const isSelected = result.detectedLanguage === sourceLang;
                            return (
                              <div
                                key={index}
                                className={`flex justify-between items-center p-2 rounded-md transition-colors ${
                                  isSelected
                                    ? 'bg-primary/10 border border-primary/30'
                                    : 'bg-background border border-border'
                                }`}
                              >
                                <span className="font-medium text-sm text-card-foreground">
                                  {langInfo ? langInfo.name : (result.detectedLanguage || 'Unknown')}
                                </span>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-muted rounded-full h-2">
                                    <div
                                      className="bg-primary h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${result.confidence * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-muted-foreground min-w-[35px]">
                                    {(result.confidence * 100).toFixed(0)}%
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ) : input.trim() && !detectionLoading ? (
                    <div className="bg-destructive/5 rounded-lg p-4 border border-destructive/20">
                      <p className="text-sm text-destructive">
                        No language detected. Try entering more text or select manually.
                      </p>
                    </div>
                  ) : null}
                  {detectionLoading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      Detecting language...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Target Section */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                <span className="text-secondary-foreground font-semibold">B</span>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">Translation</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-card-foreground mb-2 block">
                  Target Language
                </Label>
                <Select value={targetLang} onValueChange={setTargetLang}>
                  <SelectTrigger className="w-full bg-background border-input">
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

              <div>
                <Label className="text-sm font-medium text-card-foreground mb-2 block">
                  Translated Text
                </Label>
                <Textarea
                  placeholder="Translation will appear here..."
                  className="min-h-[200px] bg-background border-input resize-none"
                  value={output}
                  readOnly
                />
              </div>
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
                      Downloading translation model...
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
              onClick={handleTranslate}
              size="lg"
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !input.trim() || error !== null}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  {downloadProgress > 0 ? "Downloading..." : "Translating..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Translate</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Language Detector Warning */}
        {detectorAvailable === false && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-destructive mt-0.5" />
              <div>
                <h4 className="font-medium text-destructive mb-2">
                  Language Detection Unavailable
                </h4>
                <p className="text-sm text-destructive/80 mb-3">
                  Automatic language detection requires Chrome 138 or later. The translation feature will still work,
                  but you'll need to manually select the source language.
                </p>
                <div className="flex items-center gap-4 text-xs text-destructive/70">
                  <span>✅ Chrome 138+</span>
                  <span>❌ Edge, Firefox, Safari</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Supported Languages Section */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-semibold">🌐</span>
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">Supported Languages ({languages.length})</h3>
          </div>

          <div className="space-y-6">
            {/* Major World Languages */}
            <div className="space-y-3">
              <h4 className="font-semibold text-card-foreground flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Major World Languages
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {languages.slice(0, 18).map((lang) => (
                  <div key={lang.code} className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors">
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-xs text-muted-foreground/70 ml-1">({lang.code})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* European Languages */}
            <div className="space-y-3">
              <h4 className="font-semibold text-card-foreground flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                European Languages
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {languages.slice(18, 38).map((lang) => (
                  <div key={lang.code} className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors">
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-xs text-muted-foreground/70 ml-1">({lang.code})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Asian Languages */}
            <div className="space-y-3">
              <h4 className="font-semibold text-card-foreground flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Asian Languages
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {languages.slice(38, 49).map((lang) => (
                  <div key={lang.code} className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors">
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-xs text-muted-foreground/70 ml-1">({lang.code})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Languages */}
            <div className="space-y-3">
              <h4 className="font-semibold text-card-foreground flex items-center gap-2">
                <span className="w-2 h-2 bg-destructive rounded-full"></span>
                Other Languages
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {languages.slice(49).map((lang) => (
                  <div key={lang.code} className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors">
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-xs text-muted-foreground/70 ml-1">({lang.code})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-primary text-xs">ℹ️</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Language Support:</strong> The Translation API supports {languages.length}+ languages with automatic detection.
                </p>
                <p className="text-sm text-muted-foreground">
                  Some languages support both native script and Latin script variants (indicated by -Latn suffix).
                  The API automatically detects the best language for your input text.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}