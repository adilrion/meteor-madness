'use client';

import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import dynamic from "next/dynamic";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Dynamically import AI Chatbot to appear on all pages
const AIChatbot = dynamic(() => import("@/components/common/ai-chatbot"), {
  ssr: false,
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script id="cesium-base-url" strategy="beforeInteractive">
          {`window.CESIUM_BASE_URL = '/cesium/';`}
        </Script>
        <Navbar />
        {children}

        <Footer />

        {/* AI Chatbot - Available on all pages */}
        <AIChatbot />
      </body>
    </html>
  );
}
