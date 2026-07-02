import type { Metadata } from 'next'
import { Bebas_Neue, Space_Grotesk, Space_Mono, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import Providers from './providers'

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk-var',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono-var',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-var',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ContractIQ — AI-Powered Legal Document Analysis',
  description:
    'Upload contracts. Get instant risk analysis. Ask questions. Get cited answers. ContractIQ is the AI-powered legal intelligence platform for modern teams.',
  keywords: ['contract analysis', 'AI legal tech', 'risk detection', 'document intelligence'],
  openGraph: {
    title: 'ContractIQ — AI-Powered Legal Document Analysis',
    description: 'Upload contracts. Get instant risk analysis. Ask questions.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${spaceGrotesk.variable} ${spaceMono.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}