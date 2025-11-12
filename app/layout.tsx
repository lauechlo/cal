import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HoagieCalendar - Princeton Events',
  description: 'A unified event discovery platform for Princeton University students',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
