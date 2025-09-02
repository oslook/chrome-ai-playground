# Chrome AI Playground 🚀

**The most comprehensive and user-friendly platform for exploring Chrome's built-in AI capabilities powered by Gemini Nano.**

Experience the future of web AI with client-side processing, enhanced privacy, and lightning-fast performance. Our playground features modern UI design, comprehensive API coverage, and detailed setup guides.

![Chrome AI Playground](/public/og-image.png)

## ✨ Key Highlights

- 🎯 **Complete API Coverage** - All Chrome AI APIs including stable and experimental features
- 🔒 **Privacy-First** - Client-side processing ensures your data never leaves your device
- ⚡ **Lightning Fast** - Near-instant AI responses with hardware acceleration
- 🎨 **Modern UI** - Beautiful, responsive design with dark/light theme support
- 📚 **Comprehensive Guides** - Step-by-step setup instructions for all API levels
- 🌐 **SEO Optimized** - Structured data and meta tags for better discoverability

## 🚀 Features

### Core AI Capabilities
- **🌐 Smart Translation** - Real-time translation with automatic language detection
- **📝 AI Summarization** - Transform long texts into concise summaries (4 types available)
- **💬 Prompt Playground** - Natural language interaction with Gemini Nano
- **✍️ Content Writer** - AI-powered content generation with context awareness
- **🔄 Text Rewriter** - Intelligent text refinement and tone adjustment

### Advanced Features
- **🧠 Language Detection** - Automatic language identification (integrated in translation)
- **🎯 Multiple Summary Types** - Key-points, TL;DR, Teaser, and Headline summaries
- **📊 Real-time Processing** - Live streaming for longer content
- **⚙️ Customizable Options** - Length, format, and context controls
- **📱 Responsive Design** - Perfect experience on all devices

### Developer Tools
- **📖 Complete Documentation** - Detailed API guides and examples
- **🔧 Setup Assistant** - Hardware requirements and configuration help
- **🎛️ API Status Dashboard** - Real-time availability monitoring
- **🐛 Troubleshooting** - Common issues and solutions

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI + Shadcn/UI
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel (optimized for static export)

## 🚀 Quick Start

### Prerequisites
- **Browser**: Chrome 138+ (recommended) or Chrome Canary
- **Node.js**: 18.0 or later
- **Hardware**: GPU with 4GB+ VRAM (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/oslook/chrome-ai-playground.git
cd chrome-ai-playground

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore the playground!

### ⚙️ Chrome Setup

For the best experience, enable Chrome AI features:

1. Open Chrome and navigate to `chrome://flags`
2. Enable: `#optimization-guide-on-device-model`
3. Enable: `#translation-api` and `#summarization-api-for-gemini-nano`
4. Restart Chrome

📖 **Detailed Setup Guide**: Visit our [Setup Guide](/guide) for complete instructions.

## 🌐 API Status & Browser Support

### Current API Availability

| API | Status | Chrome Version | Access Level |
|-----|--------|----------------|--------------|
| **Translator API** | ✅ Stable | 138+ | Public |
| **Language Detector API** | ✅ Stable | 138+ | Public |
| **Summarizer API** | ✅ Stable | 138+ | Public |
| **Prompt API** | ✅ Stable | 138+ | Public |
| **Writer API** | 🔶 Origin Trial | 138+ | Registration Required |
| **Rewriter API** | 🔶 Origin Trial | 138+ | Registration Required |
| **Proofreader API** | 🟣 EPP Only | 139+ (Canary) | Early Preview Program |

### Browser Compatibility

- ✅ **Chrome 138+** (Recommended) - Full stable API support
- ✅ **Chrome Canary** - Latest experimental features
- ❌ **Edge, Firefox, Safari** - Not supported (Chrome-only APIs)

### Hardware Requirements

- **OS**: Windows 10/11, macOS 13+, Linux, ChromeOS
- **Storage**: 22GB+ free space
- **GPU**: 4GB+ VRAM (recommended)
- **Network**: Unmetered connection for model downloads

## 📁 Project Structure

```
chrome-ai-playground/
├── app/                          # Next.js App Router
│   ├── components/              # Client components
│   │   └── HomeClient.tsx      # Homepage client component
│   ├── globals.css             # Global styles & CSS variables
│   ├── guide/                  # Setup guide page
│   ├── layout.tsx              # Root layout with SEO
│   ├── page.tsx                # Homepage with metadata
│   ├── prompt/                 # Prompt playground
│   ├── summarize/              # AI summarization
│   ├── translate/              # Translation with detection
│   └── writer/                 # Content writing
├── components/                  # Reusable components
│   ├── navigation.tsx          # Main navigation
│   ├── theme-provider.tsx      # Theme management
│   └── ui/                     # UI component library
├── hooks/                      # Custom React hooks
├── lib/                        # Utilities & helpers
└── public/                     # Static assets & images
```

## 🤝 Contributing

We welcome contributions to make Chrome AI Playground even better! Here's how you can help:

### Ways to Contribute

- 🐛 **Bug Reports** - Found an issue? [Open an issue](https://github.com/oslook/chrome-ai-playground/issues)
- 💡 **Feature Requests** - Have an idea? [Start a discussion](https://github.com/oslook/chrome-ai-playground/discussions)
- 🔧 **Code Contributions** - Help improve the codebase
- 📚 **Documentation** - Improve guides and documentation
- 🎨 **UI/UX** - Enhance the user experience

### Development Workflow

1. **Fork & Clone**
   ```bash
   git clone https://github.com/your-username/chrome-ai-playground.git
   cd chrome-ai-playground
   ```

2. **Setup Development Environment**
   ```bash
   npm install
   npm run dev
   ```

3. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Changes & Test**
   - Follow our coding standards
   - Test on Chrome 138+
   - Ensure responsive design works

5. **Submit Pull Request**
   - Write clear commit messages
   - Update documentation if needed
   - Reference related issues

### Development Guidelines

- 🎯 **Code Quality**: Follow TypeScript best practices
- 🎨 **UI Consistency**: Use our design system and CSS variables
- 📱 **Responsive**: Ensure mobile-first approach
- ♿ **Accessibility**: Follow WCAG guidelines
- 🚀 **Performance**: Optimize for fast loading and smooth interactions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### Core Technologies
- **Chrome AI Team** - For pioneering built-in AI APIs
- **Gemini Nano** - Advanced AI models powering the experience
- **Google AI** - For making AI accessible to web developers

### Open Source Ecosystem
- **Next.js** - The React framework for production
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Shadcn/UI** - Beautiful component library
- **Lucide** - Beautiful icon library

### Community
- **Early Adopters** - For testing and feedback
- **Contributors** - For code improvements and features
- **Chrome Developer Community** - For inspiration and support

## 📋 Changelog

### [v2.0.0] - 2025-09-02

#### 🚀 Major Features
- **Complete UI/UX Redesign**: Modern glassmorphism design with gradient backgrounds and smooth animations
- **SEO Optimization**: Comprehensive meta tags, structured data (JSON-LD), and improved accessibility
- **API Updates**: Full upgrade to latest Chrome AI APIs (Chrome 138+)
- **Streaming Support**: Real-time content generation across all AI features
- **Session Management**: Persistent conversations with context awareness

#### 🎨 UI/UX Improvements
- **Modern Design System**: Glassmorphism effects, backdrop blur, and gradient overlays
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Complete theme support with system preference detection
- **Interactive Elements**: Hover effects, loading states, and smooth transitions
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

#### 🔧 API Enhancements
- **Translator API**: Integrated language detection, streaming translation, and model download progress
- **LanguageModel API**: Conversational AI with customizable temperature/top-k parameters
- **Writer API**: Content generation with tone, format, and length controls
- **Rewriter API**: Text refinement with shared context and streaming output
- **Summarizer API**: Multiple summary types with real-time processing

#### 📚 Documentation
- **Comprehensive README**: Detailed setup guides, API status, and browser compatibility
- **Setup Assistant**: Step-by-step Chrome configuration instructions
- **API Documentation**: Complete API reference with examples and best practices
- **Troubleshooting Guide**: Common issues and solutions

#### 🛠️ Technical Improvements
- **Next.js 14**: Latest App Router with improved performance
- **TypeScript**: Enhanced type safety and developer experience
- **Component Architecture**: Modular, reusable components with consistent design
- **Performance**: Optimized loading, reduced bundle size, and efficient rendering
- **Error Handling**: Comprehensive error boundaries and user-friendly messages

#### 🎯 Feature Highlights
- **Smart Translation**: Automatic language detection with manual override
- **AI Prompt Playground**: Interactive conversation with Gemini Nano
- **Content Writer**: Customizable content generation with context awareness
- **Text Rewriter**: Intelligent text refinement and tone adjustment
- **Real-time Processing**: Live streaming for all AI operations
- **Progress Tracking**: Download progress and generation status
- **Copy/Share**: One-click copy and export functionality

#### 📊 API Status Dashboard
- **Real-time Monitoring**: Live API availability status
- **Browser Compatibility**: Chrome version requirements and support matrix
- **Hardware Requirements**: GPU, storage, and system specifications
- **Origin Trial Tracking**: Experimental API registration status

#### 🔒 Privacy & Security
- **Client-side Processing**: All AI operations performed locally
- **No Data Transmission**: User content never leaves the device
- **Secure Implementation**: Proper error handling and resource cleanup
- **Origin Trial Compliance**: Registered for experimental APIs

#### 📱 Mobile Experience
- **Touch Optimized**: Mobile-first responsive design
- **Gesture Support**: Swipe gestures and touch interactions
- **Performance**: Optimized for mobile devices and slower connections
- **Offline Support**: Core functionality works without internet

---

<div align="center">

**Built with ❤️ for the future of web AI**

[🌐 Live Demo](https://chrome-ai-playground.vercel.app) • [📖 Documentation](/guide) • [🐛 Report Issues](https://github.com/oslook/chrome-ai-playground/issues)

</div>
