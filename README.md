# Chrome AI Playground 🚀

The playground for all API supported by Chrome AI and Gemini Nano, making it the most comprehensive and user-friendly platform available.

![Screenshot preview](https://raw.githubusercontent.com/oslook/chrome-ai-playground/main/public/translate.webp)


## Features 🎯

- **Prompt** - Interactive chat interface for testing prompts
- **Summarize** - Text summarization capabilities
- **Translate** - Language translation functionality
- **Detect Language** - Automatic language detection
- **Writer** - AI-powered writing assistance
- **ReWriter** - Content rewriting and refinement

## Tech Stack 💻

- Next.js 13+ with App Router
- React 18
- TypeScript
- Tailwind CSS
- Radix UI Components
- Shadcn/UI
- Lucide Icons

## Getting Started 🌟

### Prerequisites

- Node.js 16.8 or later
- npm or yarn or pnpm

### Installation

1. Clone the repository
```bash
git clone https://github.com/oslook/chrome-ai-playground.git
cd chrome-ai-playground
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure 📁

```
chrome-ai-playground/
├── app/                    # Next.js app directory
│   ├── detect-language/    # Language detection feature
│   ├── prompt/            # Prompt testing interface
│   ├── rewriter/          # Content rewriting
│   ├── summarize/         # Text summarization
│   ├── translate/         # Translation feature
│   └── writer/            # Writing assistance
├── components/            # Reusable React components
│   └── ui/               # UI components
├── lib/                  # Utility functions and helpers
└── public/              # Static assets
```

## Contributing 🤝

We welcome contributions to Chrome AI Playground! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Update documentation as needed
- Add tests for new features when possible
- Ensure all tests pass before submitting PR

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- Chrome AI team for providing the [APIs](https://docs.google.com/document/d/18otm-D9xhn_XyObbQrc1v7SI-7lBX3ynZkjEpiS1V04/edit?tab=t.0)
- Gemini Nano for advanced AI capabilities
- All contributors who help improve this playground
