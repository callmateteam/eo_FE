import type { Metadata } from "next";

import Script from "next/script";
import { AppProviders } from "@/components/providers/AppProviders";

import "./globals.css";

export const metadata: Metadata = {
  title: "Eastaid Video",
  description: "입문자부터 전문가까지 쉽게 영상을 제작하세요",
  icons: {
    icon: [
      { url: "/favicon-32.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/favicon-24.svg", sizes: "24x24", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/@react-grab/codex/dist/client.global.js"
            strategy="lazyOnload"
          />
        )}
      </head>
      <body className="antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
