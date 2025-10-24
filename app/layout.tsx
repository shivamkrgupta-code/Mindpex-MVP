import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mindpex - Talent Intelligence Platform',
  description: 'Talent Intelligence Platform for employee analytics and performance tracking',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-[#0a0b0f] text-gray-900 dark:text-white transition-colors`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
