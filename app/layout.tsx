import type React from "react";
import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "Beki- Graphic & Video Editor",
  description:
    "Professional graphic design and video editing services. Creative portfolio showcasing modern design and cinematic video work.",
  generator: "Chaos-19 Kalkidan getachew",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <style>{`
html {
  font-family: ${inter.style.fontFamily};
  --font-sans: ${inter.variable};
  --font-mono: ${orbitron.variable};
}
        `}</style>
      </head>
      <body
        className={`${inter.variable} ${orbitron.variable} antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
