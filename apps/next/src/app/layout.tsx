import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { Toaster } from '@/components/ui/sonner'
import { SettingsProvider } from '@/hooks/useSettings'

const sans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const mono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Realtime Playground',
  description: 'Explore Supabase Realtime features interactively',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${sans.variable} ${mono.variable} h-screen w-screen antialiased`}>
        <SettingsProvider>
          <div className="flex h-full flex-col overflow-hidden p-4 font-mono text-sm">
            <Navbar />

            <div className="h-[calc(100%-4rem)] min-h-0 overflow-hidden">{children}</div>
          </div>
          <Toaster position="bottom-left" theme="dark" closeButton />
        </SettingsProvider>
      </body>
    </html>
  )
}
