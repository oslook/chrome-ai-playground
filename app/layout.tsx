import './globals.css';
import './index.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navigation } from '@/components/header';
import { Footer } from '@/components/footer';
// import { Analytics } from "@vercel/analytics/react";
import Script from 'next/script';
import { ThemeProvider } from '@/components/theme-provider';

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Chrome AI Playground",
  "description": "Explore Chrome's built-in AI capabilities including translation, summarization, language detection, and more powered by Gemini Nano",
  "url": "https://chromeai.oslook.com",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Chrome",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "AI-powered translation with automatic language detection",
    "Intelligent text summarization with multiple formats",
    "Natural language processing with Gemini Nano",
    "Client-side AI processing for privacy",
    "Real-time AI capabilities in the browser"
  ],
  "author": {
    "@type": "Organization",
    "name": "Chrome AI Playground Team"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Chrome AI Playground"
  }
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen bg-background flex flex-col">
            <Navigation />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        {/* <Analytics /> */}
      </body>
    </html>
  );
}