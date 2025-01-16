'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Globe2, Languages, MessageSquare, Edit, RefreshCw, PenTool, Cpu, Shield, Zap, WifiOff, Server, Layers, ArrowRight, GitFork, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const features = [
  {
    title: 'Prompt',
    description: 'Interact with Chrome\'s advanced language models through natural language prompts.',
    icon: MessageSquare,
    href: '/prompt',
  },
  {
    title: 'Summarize',
    description: 'Generate concise summaries from long texts using AI-powered summarization.',
    icon: FileText,
    href: '/summarize',
  },
  {
    title: 'Translate',
    description: 'Experience real-time translation capabilities across multiple languages.',
    icon: Globe2,
    href: '/translate',
  },
  {
    title: 'Detect Language',
    description: 'Automatically identify the language of any text with high accuracy.',
    icon: Languages,
    href: '/detect-language',
  },
  {
    title: 'Writer',
    description: 'Generate creative and professional content with AI assistance.',
    icon: PenTool,
    href: '/writer',
  },
  {
    title: 'Rewriter',
    description: 'Rephrase and improve existing text while maintaining its meaning.',
    icon: RefreshCw,
    href: '/rewriter',
  },
];

const keyFeatures = [
  {
    title: 'Built-in AI Models',
    description: 'Access Chrome\'s built-in AI models including Gemini Nano without deployment hassles.',
    icon: Cpu,
  },
  {
    title: 'Enhanced Privacy',
    description: 'Process sensitive data locally with client-side AI for improved privacy.',
    icon: Shield,
  },
  {
    title: 'Instant Results',
    description: 'Experience near-instant AI features without server round trips.',
    icon: Zap,
  },
  {
    title: 'Offline Support',
    description: 'Access AI features even without internet connection.',
    icon: WifiOff,
  },
  {
    title: 'Hybrid Capabilities',
    description: 'Combine client-side and server-side AI for optimal performance.',
    icon: Server,
  },
  {
    title: 'Hardware Optimized',
    description: 'Automatically utilizes available GPU, NPU, or CPU for best performance.',
    icon: Layers,
  },
];

const faqs = [
  {
    question: 'What is Chrome Built-in AI?',
    answer: 'Chrome Built-in AI integrates AI models, including Gemini Nano, directly into the browser, allowing websites to perform AI tasks without deploying their own models.',
  },
  {
    question: 'What are the advantages of client-side AI?',
    answer: 'Client-side AI offers enhanced privacy through local processing, faster response times, offline capabilities, and can help manage inference costs.',
  },
  {
    question: 'When should I use server-side AI instead?',
    answer: 'Server-side AI is better for complex use cases, larger models, and when you need to support a wider range of platforms and devices.',
  },
  {
    question: 'What types of tasks can I perform?',
    answer: 'You can perform various tasks including content summarization, translation, writing assistance, proofreading, and text analysis.',
  },
];

async function getGitHubStats() {
  try {
    const res = await fetch('https://api.github.com/repos/oslook/chrome-ai-playground', {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return {
      stars: data.stargazers_count,
      forks: data.forks_count
    };
  } catch (error) {
    console.error('Failed to fetch GitHub stats:', error);
    return null;
  }
}

export default async function Home() {
  const [stats, setStats] = useState({ stars: 0 });

  useEffect(() => {
    getGitHubStats();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center space-y-12 pt-8 pb-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Chrome AI Playground
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Explore Chrome's built-in AI capabilities with our interactive demos
          </p>
          {stats !== null && (
            <div className="flex items-center justify-center space-x-4">
              <a
                href="https://github.com/oslook/chrome-ai-playground"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-full 
                  bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 
                  transition-colors duration-200"
              >
                <Star className="h-6 w-6 text-yellow-500" />
                <span className="text-xl font-semibold">{stats.stars} Stars</span>
              </a>
              
              <a
                href="https://github.com/oslook/chrome-ai-playground/fork"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-full 
                  bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 
                  transition-colors duration-200"
              >
                <GitFork className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-semibold">{stats.forks} Forks</span>
              </a>
            </div>
          )}
        </div>

        <div className="w-full max-w-5xl space-y-8">
          <h2 className="text-3xl font-bold text-center">Key Benefits</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {keyFeatures.map((feature) => (
              <Card key={feature.title} className="h-full bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/15 transition-colors">
                <CardHeader>
                  <feature.icon className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle className="text-primary">{feature.title}</CardTitle>
                  <CardDescription className="text-primary/80">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div className="w-full max-w-5xl space-y-8">
          <h2 className="text-3xl font-bold text-center">Demo Features</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href}>
                <Card className="group h-full border hover:border-primary hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <feature.icon className="h-10 w-10 mb-2" />
                      <ArrowRight className="h-5 w-5 text-primary opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="w-full max-w-4xl space-y-8">
          <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
          <div className="grid gap-4">
            {faqs.map((faq) => (
              <Card key={faq.question}>
                <CardHeader>
                  <CardTitle className="text-xl">{faq.question}</CardTitle>
                  <CardDescription className="text-base">{faq.answer}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
