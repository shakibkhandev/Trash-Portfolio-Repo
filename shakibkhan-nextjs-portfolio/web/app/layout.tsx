
import FloatingBottomNavBar from "@/components/FloatingBottomNavBar";
import { GlobalContextProvider } from "@/context/GlobalContextProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} `}>
        <MantineProvider defaultColorScheme="dark">
          <GlobalContextProvider>
            {children}
            <FloatingBottomNavBar />
            <Toaster richColors position="top-center" />
        </GlobalContextProvider>
          </MantineProvider>
      </body>
    </html>
  );
}
