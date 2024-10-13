import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from 'next/font/google'
import ClientLayout from "./components/ClientLayout";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Image from "next/image";
import PrivyProviders from "./PrivyProvider";

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
      <PrivyProviders>
        <body
          className={`${akira.variable} ${inter.variable} antialiased`}
        >
          <Navbar />
          <ClientLayout>
            {children}
          </ClientLayout>
          <Footer />
        </body>
      </PrivyProviders>
    </html>
  );
}
