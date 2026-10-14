import type { Metadata } from "next";
import localFont from "next/font/local";

import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// A serif for names and headings, a plain sans for data. The pairing reads as
// deliberate and keeps the tool warm without making the tables harder to scan.
// Self-hosted from npm so the build needs no network and pages make no
// requests to Google.
const display = localFont({
  src: "../../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2",
  variable: "--font-display",
});
const body = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "TDC Matchmaker",
  description: "Internal dashboard for The Date Crew matchmakers",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
