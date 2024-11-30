'use client';

import { Card } from '@/components/ui/card';
import { AlertCircle, Chrome, Settings, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Steps, Step } from '@/components/ui/steps';

export default function SetupPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">The Guide of Chrome AI</h1>
        <p className="text-muted-foreground">
          Follow these steps to set up Chrome AI Playground and access all features.
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Prerequisites</AlertTitle>
        <AlertDescription>
          Chrome AI features require Chrome version 131+ or later and specific Chrome flags to be enabled.
        </AlertDescription>
      </Alert>

      <Card className="p-6">
        <Steps>
          <Step icon={Chrome} title="Install Chrome Canary">
            <p className="text-muted-foreground mb-4">
              Chrome AI features are currently available in Chrome Canary (version 131+).
            </p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Visit <a href="https://www.google.com/chrome/canary/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Chrome Canary download page</a></li>
              <li>Download and install Chrome Canary for your operating system</li>
              <li>Launch Chrome Canary after installation</li>
            </ol>
          </Step>

          <Step icon={Settings} title="Enable Chrome Flags">
            <p className="text-muted-foreground mb-4">
              Enable required Chrome flags to access AI features.
            </p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Open Chrome Canary and navigate to <code className="bg-muted px-1 py-0.5 rounded">chrome://flags</code></li>
              <li>Search for and enable the following flags:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li><code className="bg-muted px-1 py-0.5 rounded border">#optimization-guide-on-device-model</code></li>
                  <li><code className="bg-muted px-1 py-0.5 rounded">#prompt-api-for-gemini-nano</code></li>
                  <li><code className="bg-muted px-1 py-0.5 rounded">#translation-api</code></li>
                  <li><code className="bg-muted px-1 py-0.5 rounded">#language-detection-api</code></li>
                  <li><code className="bg-muted px-1 py-0.5 rounded">#summarization-api-for-gemini-nano</code></li>
                  <li><code className="bg-muted px-1 py-0.5 rounded">#writer-api-for-gemini-nano</code></li>
                  <li><code className="bg-muted px-1 py-0.5 rounded">#rewriter-api-for-gemini-nano</code></li>

                </ul>
              </li>
              <li>Click the "Restart" button at the bottom of the page</li>
            </ol>
          </Step>

          <Step icon={CheckCircle2} title="Verify Setup">
            <p className="text-muted-foreground mb-4">
              Verify that Chrome AI features are working correctly.
            </p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Return to the Chrome AI Playground</li>
              <li>Try each feature to ensure they're working:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>Language Detection</li>
                  <li>Text Generation</li>
                  <li>Text Summarization</li>
                  <li>Translation</li>
                </ul>
              </li>
              <li>If any feature shows as "Not Available", double-check that all flags are enabled and Chrome Canary is up to date</li>
            </ol>
          </Step>
        </Steps>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>
          Chrome AI features are experimental and may change or be unavailable in future versions. Make sure to keep Chrome Canary updated to access the latest features.
        </AlertDescription>
      </Alert>
    </div>
  );
}
