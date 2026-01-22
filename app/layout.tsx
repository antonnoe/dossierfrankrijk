import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mijn Dossier | InfoFrankrijk',
  description: 'Je persoonlijke dossier voor het leven in Frankrijk',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}
