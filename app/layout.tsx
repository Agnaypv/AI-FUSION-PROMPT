import React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Orbitron } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/nexus/auth-context"
import { AuthGateway } from "@/components/nexus/auth-gateway"

import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "NEXUS - Your Campus, One Intelligence",
  description:
    "An AI-first campus super-app that anticipates your needs, reduces cognitive overload, and connects your student life into one intelligence.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#0a0c14",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AuthGateway>
              {children}
            </AuthGateway>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
