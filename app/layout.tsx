import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Multi-Agent Content System",
  description: "Researcher, Writer, and Editor AI agents collaborating on high-quality content."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8">
          <header className="mb-8 border-b border-slate-800 pb-4">
            <h1 className="text-2xl font-semibold tracking-tight">
              Multi-Agent Content Creation System
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              A Researcher, Writer, and Editor collaborating to produce polished content.
            </p>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}


