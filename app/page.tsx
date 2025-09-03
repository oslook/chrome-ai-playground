import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamic import to avoid hydration issues with client-side features
const HomeClient = dynamic(() => import('../components/HomeClient'), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>
});

export const metadata: Metadata = {
  title: 'Chrome AI Playground - Explore Built-in AI Capabilities',
  description: 'Discover and experiment with Chrome\'s built-in AI APIs including translation, summarization, language detection, and more. Powered by Gemini Nano for client-side AI processing.',
  keywords: [
    'Chrome AI',
    'Built-in AI',
    'Gemini Nano',
    'AI Playground',
    'Translation API',
    'Summarization API',
    'Language Detection',
    'Client-side AI',
    'Web AI',
    'Machine Learning'
  ],
  authors: [{ name: 'Chrome AI Playground Team' }],
  creator: 'Chrome AI Playground',
  publisher: 'Chrome AI Playground',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://chrome-ai-playground.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Chrome AI Playground - Explore Built-in AI Capabilities',
    description: 'Discover and experiment with Chrome\'s built-in AI APIs including translation, summarization, language detection, and more.',
    url: 'https://chrome-ai-playground.vercel.app',
    siteName: 'Chrome AI Playground',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Chrome AI Playground',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chrome AI Playground - Explore Built-in AI Capabilities',
    description: 'Discover and experiment with Chrome\'s built-in AI APIs including translation, summarization, language detection, and more.',
    images: ['/og-image.png'],
    creator: '@chromeai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
};

export default function Home() {
  return <HomeClient />;
}
