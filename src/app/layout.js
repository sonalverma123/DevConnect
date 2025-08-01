import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeProvider from '@/components/ThemeProvider';
import SessionWrapper from "./SessionWrapper";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'DevConnect',
  description: 'Connect with devs and showcase your work',
};

export default function RootLayout({ children }) {

  return (

    <html lang="en">
      <head>
        <Script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionWrapper>
          <ThemeProvider>

            {children}
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
