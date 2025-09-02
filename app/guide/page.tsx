'use client';

import { Card } from '@/components/ui/card';
import { AlertCircle, Chrome, Settings, CheckCircle2, Globe2, FileText, Languages, PenTool, RefreshCw, MessageSquare, BookOpen, Cpu, HardDrive, Monitor, Wifi } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const apiStatus = [
  {
    name: 'Translator API',
    status: 'stable',
    version: 'Chrome 138+',
    icon: Globe2,
    description: 'Translate text between languages with automatic language detection',
    useCases: [
      'Multilingual chat applications',
      'Social media translation',
      'Document translation'
    ]
  },
  {
    name: 'Language Detector API',
    status: 'stable',
    version: 'Chrome 138+',
    icon: Languages,
    description: 'Automatically detect the language of input text',
    useCases: [
      'Auto-select source language for translation',
      'Content tagging and categorization',
      'Accessibility improvements'
    ]
  },
  {
    name: 'Summarizer API',
    status: 'stable',
    version: 'Chrome 138+',
    icon: FileText,
    description: 'Generate concise summaries from long texts',
    useCases: [
      'Meeting transcripts',
      'Article summaries',
      'Review aggregation',
      'Content previews'
    ]
  },
  {
    name: 'Prompt API',
    status: 'stable',
    version: 'Chrome 138+',
    icon: MessageSquare,
    description: 'Natural language interaction with Gemini Nano',
    useCases: [
      'AI chat interfaces',
      'Content generation',
      'Question answering'
    ]
  },
  {
    name: 'Writer API',
    status: 'origin-trial',
    version: 'Origin Trial',
    icon: PenTool,
    description: 'Generate new content based on prompts and context',
    useCases: [
      'Email composition',
      'Content creation',
      'Creative writing'
    ]
  },
  {
    name: 'Rewriter API',
    status: 'origin-trial',
    version: 'Origin Trial',
    icon: RefreshCw,
    description: 'Rephrase and improve existing text',
    useCases: [
      'Text optimization',
      'Tone adjustment',
      'Content refinement'
    ]
  },
  {
    name: 'Proofreader API',
    status: 'epp',
    version: 'EPP Only',
    icon: BookOpen,
    description: 'Interactive proofreading and grammar correction',
    useCases: [
      'Document editing',
      'Chat message correction',
      'Blog post proofreading'
    ]
  }
];

const hardwareRequirements = [
  {
    icon: Cpu,
    title: 'Operating System',
    requirements: [
      'Windows 10 or 11',
      'macOS 13+ (Ventura or later)',
      'Linux',
      'ChromeOS (from platform 16389.0.0)'
    ]
  },
  {
    icon: HardDrive,
    title: 'Storage Space',
    requirements: [
      'At least 22GB free space',
      'Includes Chrome profile directory',
      'Model size varies (typically 2-6GB)'
    ]
  },
  {
    icon: Monitor,
    title: 'GPU Requirements',
    requirements: [
      'GPU with more than 4GB VRAM',
      'Required for Gemini Nano models',
      'Integrated graphics may not suffice'
    ]
  },
  {
    icon: Wifi,
    title: 'Network',
    requirements: [
      'Unmetered internet connection',
      'Required for initial model download',
      'Metered connections may incur costs'
    ]
  }
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border border-border mb-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-muted-foreground">
              Chrome AI Guide
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-4">
            Chrome Built-in AI Guide
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Complete guide to setting up and using Chrome's built-in AI APIs.
            Different APIs have different availability levels - some are stable, others require special access.
          </p>
        </div>

        {/* API Status Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">API Availability Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apiStatus.map((api) => {
              const Icon = api.icon;
              const getStatusColor = (status: string) => {
                switch (status) {
                  case 'stable': return 'bg-green-500';
                  case 'origin-trial': return 'bg-blue-500';
                  case 'epp': return 'bg-purple-500';
                  default: return 'bg-gray-500';
                }
              };

              const getStatusBadge = (status: string) => {
                switch (status) {
                  case 'stable': return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">Stable</span>;
                  case 'origin-trial': return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">Origin Trial</span>;
                  case 'epp': return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500 text-white">EPP Only</span>;
                  default: return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">Unknown</span>;
                }
              };

              return (
                <div key={api.name} className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border shadow-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 ${getStatusColor(api.status)} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-card-foreground">{api.name}</h3>
                        {getStatusBadge(api.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{api.version}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{api.description}</p>
                  <div>
                    <p className="text-xs font-medium text-card-foreground mb-2">Use Cases:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {api.useCases.map((useCase, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-primary rounded-full"></div>
                          {useCase}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hardware Requirements */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Cpu className="text-accent-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">Hardware Requirements</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hardwareRequirements.map((req, index) => {
              const Icon = req.icon;
              return (
                <div key={index} className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <h4 className="font-medium text-card-foreground">{req.title}</h4>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {req.requirements.map((requirement, reqIndex) => (
                      <li key={reqIndex} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">Important Notes</h4>
                <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                  <li>• If free storage drops below 10GB, models will be automatically removed</li>
                  <li>• Models will be re-downloaded when requirements are met again</li>
                  <li>• GPU requirements are strict - integrated graphics may not work</li>
                  <li>• Initial model download requires significant bandwidth</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-card-foreground">Setup Instructions</h2>

          {/* Stable APIs Setup */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">Stable APIs (Chrome 138+)</h3>
                <p className="text-sm text-muted-foreground">Translator, Language Detector, Summarizer, Prompt APIs</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium text-card-foreground mb-2">Step 1: Update Chrome</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Ensure you're using Chrome version 138 or later. You can check your version at <code className="bg-background px-1 py-0.5 rounded">chrome://version</code>
                </p>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Stable Chrome release is sufficient</span>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium text-card-foreground mb-2">Step 2: Enable Required Flags</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Open Chrome and navigate to <code className="bg-background px-1 py-0.5 rounded">chrome://flags</code>, then enable these flags:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <code className="bg-background px-2 py-1 rounded text-xs">#optimization-guide-on-device-model</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <code className="bg-background px-2 py-1 rounded text-xs">#translation-api</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <code className="bg-background px-2 py-1 rounded text-xs">#language-detection-api</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <code className="bg-background px-2 py-1 rounded text-xs">#summarization-api-for-gemini-nano</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <code className="bg-background px-2 py-1 rounded text-xs">#prompt-api-for-gemini-nano</code>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium text-card-foreground mb-2">Step 3: Restart Chrome</h4>
                <p className="text-sm text-muted-foreground">
                  Click the "Relaunch" button at the bottom of the flags page to restart Chrome with the new settings.
                </p>
              </div>
            </div>
          </div>

          {/* Origin Trial APIs Setup */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Settings className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">Origin Trial APIs</h3>
                <p className="text-sm text-muted-foreground">Writer and Rewriter APIs</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium text-card-foreground mb-2">Step 1: Join Origin Trial</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Register for the Chrome Origin Trials to access experimental APIs:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Visit <a href="https://developer.chrome.com/origintrials" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Chrome Origin Trials</a></li>
                  <li>• Search for "Writer API" and "Rewriter API"</li>
                  <li>• Register your domain and get the trial token</li>
                </ul>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium text-card-foreground mb-2">Step 2: Add Trial Token</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Add the origin trial token to your website's HTTP headers:
                </p>
                <div className="bg-background p-3 rounded text-sm font-mono text-xs">
                  Origin-Trial: YOUR_TRIAL_TOKEN_HERE
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium text-card-foreground mb-2">Step 3: Enable Flags</h4>
                <p className="text-sm text-muted-foreground">
                  Enable these additional flags in <code className="bg-background px-1 py-0.5 rounded">chrome://flags</code>:
                </p>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <code className="bg-background px-2 py-1 rounded text-xs">#writer-api-for-gemini-nano</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <code className="bg-background px-2 py-1 rounded text-xs">#rewriter-api-for-gemini-nano</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* EPP Setup */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Chrome className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">Early Preview Program (EPP)</h3>
                <p className="text-sm text-muted-foreground">Proofreader API</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium text-card-foreground mb-2">Step 1: Join EPP</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Apply to join Chrome's Early Preview Program:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Visit the <a href="https://developer.chrome.com/docs/web-platform/chrome-release-channels" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Chrome Release Channels</a> page</li>
                  <li>• Find the Early Preview Program section</li>
                  <li>• Submit your application with use case details</li>
                </ul>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium text-card-foreground mb-2">Step 2: Use Chrome Canary</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Download and use Chrome Canary for EPP features:
                </p>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Chrome className="w-4 h-4" />
                  <a href="https://www.google.com/chrome/canary/" className="hover:underline" target="_blank" rel="noopener noreferrer">
                    Download Chrome Canary
                  </a>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">EPP Requirements</h4>
                    <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                      <li>• Approval required from Chrome team</li>
                      <li>• Must demonstrate legitimate use case</li>
                      <li>• Limited to approved participants only</li>
                      <li>• Features may be unstable or change frequently</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">Verification</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium text-card-foreground mb-2">Test Each API</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Visit each page in the playground to verify the APIs are working:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-background p-3 rounded-lg text-center">
                  <Languages className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs font-medium">Translate</p>
                </div>
                <div className="bg-background p-3 rounded-lg text-center">
                  <FileText className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs font-medium">Summarize</p>
                </div>
                <div className="bg-background p-3 rounded-lg text-center">
                  <MessageSquare className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs font-medium">Prompt</p>
                </div>
                <div className="bg-background p-3 rounded-lg text-center">
                  <PenTool className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs font-medium">Writer</p>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium text-card-foreground mb-2">Troubleshooting</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• If APIs show "Not Available", check that all flags are enabled</li>
                <li>• Ensure Chrome is updated to the latest version</li>
                <li>• Check hardware requirements are met</li>
                <li>• Verify you have sufficient storage space</li>
                <li>• Try restarting Chrome after enabling flags</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-muted/30 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-medium text-card-foreground mb-2">Important Notes</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Chrome AI features are experimental and may change</li>
                <li>• APIs may become unavailable in future Chrome versions</li>
                <li>• Keep Chrome updated to access the latest features</li>
                <li>• Origin Trial tokens expire and need renewal</li>
                <li>• EPP access is limited and requires approval</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
