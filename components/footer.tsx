import Link from 'next/link';
import { Github, Star, GitFork, Heart, ExternalLink, BookOpen, MessageSquare, Cpu, Globe } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Translation', href: '/translate', icon: Globe },
      { name: 'Summarization', href: '/summarize', icon: BookOpen },
      { name: 'Prompt', href: '/prompt', icon: MessageSquare },
      { name: 'Setup Guide', href: '/guide', icon: Cpu },
    ],
    community: [
      { name: 'GitHub', href: 'https://github.com/oslook/chrome-ai-playground', icon: Github, external: true },
      { name: 'Issues', href: 'https://github.com/oslook/chrome-ai-playground/issues', icon: ExternalLink, external: true },
      { name: 'Discussions', href: 'https://github.com/oslook/chrome-ai-playground/discussions', icon: MessageSquare, external: true },
    ],
    resources: [
      { name: 'Chrome AI Docs', href: 'https://developer.chrome.com/docs/ai/', icon: BookOpen, external: true },
      { name: 'Gemini Nano', href: 'https://ai.google.dev/', icon: Cpu, external: true },
      { name: 'Chrome Origin Trials', href: 'https://developer.chrome.com/origintrials', icon: ExternalLink, external: true },
    ]
  };

  return (
    <footer className="border-t bg-background/95 backdrop-blur-sm mt-auto">
      <div className="container px-4 py-8 md:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">AI</span>
              </div>
              <span className="font-bold text-lg">Chrome AI Playground</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Explore the future of web AI with Chrome's built-in capabilities powered by Gemini Nano.
              Experience client-side AI processing with enhanced privacy and lightning-fast performance.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Made with love for the web AI community</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Features</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Community</h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    {link.name}
                    {link.external && <ExternalLink className="w-3 h-3 opacity-50" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    {link.name}
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
              <p>
                © {currentYear} Chrome AI Playground. Made with ❤️ by{' '}
                <Link
                  href="https://github.com/oslook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors font-medium"
                >
                  oslook
                </Link>
              </p>
              <span className="hidden md:block">•</span>
              <p>Open source project for exploring Chrome AI capabilities</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/oslook/chrome-ai-playground"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <Github className="w-4 h-4" />
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  <span className="text-xs font-medium">Star</span>
                </div>
              </Link>
              <Link
                href="https://github.com/oslook/chrome-ai-playground/fork"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <GitFork className="w-4 h-4" />
                <span className="text-xs font-medium">Fork</span>
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-4 border-t border-border/50">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Built with Next.js & TypeScript</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Powered by Gemini Nano</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Chrome 138+ Required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
