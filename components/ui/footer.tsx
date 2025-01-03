import Link from 'next/link';
import { Github, Star, GitFork } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t mt-auto bg-background">
      <div className="container py-6">
        {/* Copyright and Attribution */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Chrome AI Playground. Made with ❤️ by{" "}
            <Link
              href="https://github.com/oslook"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors"
            >
              oslook.com
            </Link>
          </p>
          <p className="text-xs text-muted-foreground">
            Open source project for exploring Chrome AI capabilities
          </p>
        </div>
      </div>
    </footer>
  );
}
