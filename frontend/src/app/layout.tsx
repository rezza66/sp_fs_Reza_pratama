import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Project Manager',
  description: 'Kelola proyek dan tugas dengan mudah',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
