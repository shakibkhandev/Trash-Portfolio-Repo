import type { Metadata } from "next";

import "./globals.css";

import FloatingBottomBar from "@/components/FloatingBottomBar";

export const metadata: Metadata = {
  title: "Shakib Khan - Portfolio",
  description: "A showcase of my work and skills",
  icons: {
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`antialiased`}>
        {children}
        <FloatingBottomBar />
      </body>
    </html>
  );
}
