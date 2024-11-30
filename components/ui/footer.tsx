import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container flex items-center justify-center h-24">
        <p className="text-sm leading-loose text-muted-foreground text-center">
          Built by{" "}
          <Link
            href="https://github.com/oslook"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            oslook
          </Link>
          . The source code is available on{" "}
          <Link
            href="https://github.com/oslook/chrome-ai-playground"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
