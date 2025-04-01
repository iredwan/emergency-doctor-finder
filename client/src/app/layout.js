"use client";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from 'react-hot-toast';
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head suppressHydrationWarning={true}>
        <title>WebDr. - Emergency Doctor Finder</title>
        <meta name="description" content="Find emergency doctors near you" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Toaster position="bottom-right" />
        <Navbar />
          {children}
        <Footer />
      </body>
    </html>
  );
}

