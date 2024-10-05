import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from 'next/font/google'

import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const akira = localFont({
  src: "./fonts/Akira Expanded Demo.otf", // Replace with your font file path
  variable: "--font-akira",       // Replace with your desired CSS variable name
  weight: "400 800",            // Adjust weights as needed
});

export const metadata: Metadata = {
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
        {children}
      </body>
    </html>
  );
}
