import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nodo",
  description: "Tu hub de links personales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es" className="light">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F7F7F7] text-black min-h-screen`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
