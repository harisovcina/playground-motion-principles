import type { Metadata } from "next"
import "./globals.css"
import { Oswald, Roboto_Mono } from 'next/font/google'

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: "GSAP MOTION SYSTEM",
  description: "Industrial animation pattern reference and testing facility",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${oswald.variable} ${robotoMono.variable} antialiased`}>{children}</body>
    </html>
  )
}
