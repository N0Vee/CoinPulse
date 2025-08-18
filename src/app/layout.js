import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PerformanceMonitor from '../components/PerformanceMonitor';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Coin Pulse - Real-time Crypto Monitor",
  description: "Monitor real-time cryptocurrency prices including Bitcoin, Ethereum, and more. Track price changes, volume, and market trends.",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Coin Pulse'
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#111827',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#111827" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Coin Pulse" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        
      </body>
    </html>
  );
}
