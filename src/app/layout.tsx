import { Inter } from 'next/font/google'
import { Providers } from '@/components/Providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

import { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Cockpit</title>
        <link rel="icon" href="./favicon.ico" />
      </head>
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Providers>{children}</Providers>
          </div>
        </main>
      </body>
    </html>
  )
}
