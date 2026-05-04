import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Quiz Claude Code',
  description: 'Teste seus conhecimentos sobre Claude Code',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-bg text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
