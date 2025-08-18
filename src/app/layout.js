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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        
      </body>
    </html>
  );
}
