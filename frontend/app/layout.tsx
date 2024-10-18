"use client";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from 'next/font/google';
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import PrivyProviders from "./PrivyProvider";
import { SearchProvider } from "./contexts/SearchContext";
import toast, { Toaster } from 'react-hot-toast';
import React from 'react';

import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const akira = localFont({
  src: "./fonts/Akira Expanded Demo.otf",
  variable: "--font-akira",
  weight: "400 800",
});

const metadata: Metadata = {
  title: "MiniBase",
  description: "One place for all Web3 games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${akira.variable} ${inter.variable} antialiased`}
      >
        <PrivyProviders>
          <SearchProvider>
            <Navbar />
            <Toaster position="top-center" />
            {children}
            <Footer />
          </SearchProvider>
        </PrivyProviders>
      </body>
    </html>
  );
}
