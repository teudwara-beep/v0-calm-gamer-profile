import { MusicPlayer } from "@/components/music-player";
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Fredoka } from 'next/font/google'
import { CursorEffect } from "@/components/cursor-effect";
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const fredoka = Fredoka({ 
  variable: '--font-fredoka', 
  subsets: ['latin'],
  weight: ['600', '700'],
})

export const metadata: Metadata = {
  title: 'Theekz',
  description: 'A chill, lofi-inspired gamer profile portfolio',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${fredoka.variable}`}>
      <body className="font-sans antialiased">
       <CursorEffect />
        <MusicPlayer
  songName="Criminal"
  artist="Britney Spears"
  version="slowed + reverb"
  src="/bg-music.mp3"
/>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
