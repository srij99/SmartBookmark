import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import { Toaster } from "sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Smart Bookmark — Organize and Access Your Links Effortlessly",
  description:
    "A secure, real-time bookmark manager that helps you save, organize, and access your favorite links from anywhere."
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background 
  bg-[radial-gradient(ellipse_at_top,oklch(0.28_0.05_250/0.25),transparent_60%)]`}
      >
        <Navbar />

        {children}

        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
