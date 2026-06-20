import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Suspense } from "react";
import { CSPostHogProvider } from "@/components/providers/PosthogProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "promptgenerator",
  description:
    "Create precise, effective AI   prompts with intelligent assistance",
  openGraph: {
    title: "promptgenerator",
    description:
      "Create precise, effective AI   prompts with intelligent assistance",
    url: "https://promptgenerator.pro",
    siteName: "promptgenerator",
    images: [
      {
        url: "https://promptgenerator.pro/og.png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  metadataBase: new URL("https://promptgenerator.pro"),
  creator: "Rohit Arabale",
  applicationName: "promptgenerator",
  keywords: [
    // Core functionality keywords
    "promptgenerator",
    "Rohit Arabale",
    "Rohit Arabale promptgenerator",
    "AI   prompt creator",
    "custom   prompt builder",
    "ChatGPT   message generator",
    "LLM   prompt maker",

    // Use cases and applications
    "AI personality customization",
    "ChatGPT behavior control",
    "AI assistant configuration",
    "custom AI instructions generator",
    "AI role definition tool",

    // Technical and specific terms
    "prompt engineering tool",
    "GPT   message template",
    "AI behavior prompting",
    "LLM instruction generator",
    "AI context setting",

    // Related concepts
    "AI personality designer",
    "ChatGPT instruction maker",
    "AI assistant customization",
    "GPT behavior modifier",
    "custom AI personality",

    // Platform specific
    "ChatGPT   prompts",
    "GPT-4   messages",
    "Claude   prompts",
    "LLaMA instruction format",
    "OpenAI   messages",

    // Generic but relevant
    "prompt engineering",
    "AI customization",
    "LLM configuration",
    "AI instruction design",
    "  prompts",
  ],
  authors: [
    {
      name: "Rohit Arabale",
      url: "https://github.com/rohit-arabale",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense>
          <CSPostHogProvider>
            {children}
            <Toaster />
            <Analytics />
          </CSPostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}
