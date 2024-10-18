"use client";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from 'next/font/google'
import ClientLayout from "./components/ClientLayout";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Image from "next/image";
import PrivyProviders from "./PrivyProvider";
import { SearchProvider } from "./contexts/SearchContext";
import toast, { Toaster } from 'react-hot-toast';
import { useState } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  return (
    <html lang="en">
      <PrivyProviders>
        <SearchProvider>
          <body
            className={`${akira.variable} ${inter.variable} antialiased`}
          >
            <Navbar />
            <Toaster position="top-center" />
            {children}
            <Footer />
          </body>
        </SearchProvider>
      </PrivyProviders>
    </html>
  );
}
