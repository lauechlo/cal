/**
 * Root layout for HoagieCalendar
 * Server component that provides base HTML structure
 * IMPORTANT: This must remain a server component for Next.js App Router to work
 */

import { ReactNode } from 'react';
import Footer from '@/lib/hoagie-ui/Footer';
import '@/lib/hoagie-ui/theme.css';
import '@/styles/globals.css';
import '@/styles/variables.css';

export const metadata = {
  title: 'HoagieCalendar - Princeton Event Discovery',
  description: 'Never miss a campus event. Browse, filter, and save events from HoagieMail.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f0f7ff'
      }}>
        <div style={{ flex: 1 }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
