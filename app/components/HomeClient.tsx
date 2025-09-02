'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Globe2, MessageSquare, RefreshCw, PenTool, Cpu, Shield, Zap, Wifi, Server, Layers, ArrowRight, GitFork, Star, Sparkles, Brain, Users, CheckCircle, ExternalLink, Play, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const features = [
  {
    title: 'Smart Translation',
    description: 'Translate text between languages with automatic language detection and real-time processing.',
    icon: Globe2,
    href: '/translate',
    status: 'stable',
    highlight: 'Auto-detect language'
  },
  {
    title: 'AI Summarization',
    description: 'Transform long texts into concise summaries with multiple styles and formats.',
    icon: FileText,
    href: '/summarize',
    status: 'stable',
    highlight: '4 summary types'
  },
  {
    title: 'Prompt Playground',
    description: 'Interact with Gemini Nano through natural language prompts and conversations.',
    icon: MessageSquare,
    href: '/prompt',
    status: 'stable',
    highlight: 'Natural language'
  },
  {
    title: 'Content Writer',
    description: 'Generate creative and professional content with AI assistance and context awareness.',
    icon: PenTool,
    href: '/writer',
    status: 'origin-trial',
    highlight: 'Context-aware'
  },
  {
    title: 'Text Rewriter',
    description: 'Rephrase and improve existing text while maintaining meaning and tone.',
    icon: RefreshCw,
    href: '/rewriter',
    status: 'origin-trial',
    highlight: 'Tone adjustment'
  },
];

const keyFeatures = [
  {
    title: 'Built-in AI Models',
    description: 'Access Chrome\'s built-in AI models including Gemini Nano without deployment hassles.',
    icon: Cpu,
    color: 'bg-blue-500'
  },
  {
    title: 'Enhanced Privacy',
    description: 'Process sensitive data locally with client-side AI for improved privacy protection.',
    icon: Shield,
    color: 'bg-green-500'
  },
  {
    title: 'Instant Results',
    description: 'Experience near-instant AI features without server round trips or API delays.',
    icon: Zap,
    color: 'bg-yellow-500'
  },
  {
    title: 'Offline Support',
    description: 'Access AI features even without internet connection once models are downloaded.',
    icon: Wifi,
    color: 'bg-purple-500'
  },
  {
    title: 'Hardware Optimized',
    description: 'Automatically utilizes available GPU, NPU, or CPU for optimal performance.',
    icon: Layers,
    color: 'bg-indigo-500'
  },
  {
    title: 'Hybrid Capabilities',
    description: 'Combine client-side and server-side AI for comprehensive solutions.',
    icon: Server,
    color: 'bg-pink-500'
  },
];

const testimonials = [
  {
    quote: "Chrome's built-in AI makes it incredibly easy to add powerful AI features to web applications without complex server setups.",
    author: "Web Developer",
    role: "Frontend Engineer"
  },
  {
    quote: "The privacy-focused approach of client-side AI is exactly what we've been looking for in our content processing pipeline.",
    author: "Product Manager",
    role: "AI Product Lead"
  },
  {
    quote: "Being able to run AI models directly in the browser opens up amazing possibilities for offline-capable applications.",
    author: "UX Designer",
    role: "Design Technologist"
  }
];

const stats = [
  { label: 'AI APIs Available', value: '7+', icon: Brain },
  { label: 'Languages Supported', value: '100+', icon: Globe2 },
  { label: 'Processing Speed', value: '< 1s', icon: Zap },
  { label: 'Privacy Level', value: '100%', icon: Shield }
];

const faqs = [
  {
    question: 'What makes Chrome Built-in AI special?',
    answer: 'Chrome Built-in AI integrates powerful AI models like Gemini Nano directly into the browser, enabling client-side processing without server dependencies. This ensures better privacy, faster response times, and offline capabilities.',
  },
  {
    question: 'Do I need special hardware to use these features?',
    answer: 'While optimal performance requires a GPU with at least 4GB VRAM, many features work on standard hardware. The AI models automatically adapt to your available computing resources.',
  },
  {
    question: 'Are my data and conversations private?',
    answer: 'Yes! All processing happens locally on your device. Your text and conversations never leave your browser, ensuring complete privacy and data security.',
  },
  {
    question: 'Which Chrome version do I need?',
    answer: 'Most features are available in Chrome 138+. Some advanced features may require Chrome Canary or participation in Origin Trials for early access.',
  },
  {
    question: 'Can I use these APIs in production?',
    answer: 'Stable APIs (marked as "Stable" in our guide) are production-ready. Experimental features should be used cautiously and may change over time.',
  },
];

export default function HomeClient() {
  const [githubStats, setGithubStats] = useState({ stars: 0, forks: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGitHubStats() {
      try {
        const response = await fetch('https://api.github.com/repos/oslook/chrome-ai-playground');
        const data = await response.json();
        setGithubStats({
          stars: data.stargazers_count || 0,
          forks: data.forks_count || 0
        });
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        // Set default values if fetch fails
        setGithubStats({ stars: 0, forks: 0 });
      } finally {
        setIsLoading(false);
      }
    }

    fetchGitHubStats();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powered by Gemini Nano</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent mb-6 leading-tight">
              Chrome AI
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Playground
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Explore the future of web AI with Chrome's built-in capabilities.
              Experience translation, summarization, and intelligent content generation
              running entirely in your browser.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/translate">
                <Button size="lg" className="px-8 py-3 text-base font-medium">
                  <Play className="w-5 h-5 mr-2" />
                  Try Live Demo
                </Button>
              </Link>
              <Link href="/guide">
                <Button variant="outline" size="lg" className="px-8 py-3 text-base font-medium">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Setup Guide
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GitHub Stats */}
        {!isLoading && (githubStats.stars > 0 || githubStats.forks > 0) && (
          <div className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-center gap-6">
                <a
                  href="https://github.com/oslook/chrome-ai-playground"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">{githubStats.stars.toLocaleString()} Stars</span>
                </a>
                <a
                  href="https://github.com/oslook/chrome-ai-playground/fork"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <GitFork className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">{githubStats.forks.toLocaleString()} Forks</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Chrome Built-in AI?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the advantages of client-side AI processing with industry-leading privacy and performance.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {keyFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore AI Capabilities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover powerful AI features that run entirely in your browser, from translation to content generation.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Link key={index} href={feature.href}>
                <Card className="group h-full hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 hover:bg-card">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          feature.status === 'stable'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        }`}>
                          {feature.status === 'stable' ? 'Stable' : 'Origin Trial'}
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed mb-3">
                      {feature.description}
                    </CardDescription>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-primary">{feature.highlight}</span>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Developers Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of developers exploring the future of web AI.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground italic mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <div className="font-medium text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get answers to common questions about Chrome Built-in AI.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg text-left">{faq.question}</CardTitle>
                  <CardDescription className="text-base leading-relaxed text-left">
                    {faq.answer}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build with Chrome AI?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Start exploring Chrome's built-in AI capabilities today.
            Join the future of web AI development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/translate">
              <Button size="lg" variant="secondary" className="px-8 py-3 text-base font-medium">
                <Play className="w-5 h-5 mr-2" />
                Start Exploring
              </Button>
            </Link>
            <Link href="/guide">
              <Button size="lg" variant="outline" className="px-8 py-3 text-base font-medium border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <BookOpen className="w-5 h-5 mr-2" />
                Read Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}