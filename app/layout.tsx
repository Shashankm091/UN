import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/config";

// Fonts are loaded at runtime via the <link> tag below (see head) rather than
// next/font/google, so the build never depends on network access to Google's
// font CDN. Swap in next/font/google freely if you prefer build-time bundling —
// just make sure your machine has internet access when you run `next build`.

export const metadata: Metadata = {
  title: `A Birthday Surprise for ${siteConfig.girlName}`,
  description: "A little corner of the internet made just for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&family=Quicksand:wght@400;500;600;700&family=Caveat:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
