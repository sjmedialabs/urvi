import React from "react"
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Urvi Constructions | A Higher Quality of Living',
  description: 'Urvi Constructions - Leading architectural and construction company offering premium apartments, villas, townhouses, and commercial properties. Discover a place you\'ll love to live.',
  keywords: ['construction', 'real estate', 'apartments', 'villas', 'commercial', 'property', 'Urvi Constructions'],
  openGraph: {
    title: 'Urvi Constructions | A Higher Quality of Living',
    description: 'Leading architectural and construction company offering premium apartments, villas, townhouses, and commercial properties.',
    type: 'website',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1e3a5f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
