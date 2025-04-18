import { Geist, Geist_Mono } from "next/font/google";
import { FrameInit } from "@/components/FrameInit";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Founder Archetype",
  description: "Find out your founder archetype",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <FrameInit />
      </body>
    </html>
  );
}
