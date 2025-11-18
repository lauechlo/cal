/**
 * Root layout for HoagieCalendar
 * Server component that provides base HTML structure
 * IMPORTANT: This must remain a server component for Next.js App Router to work
 */

import { ReactNode } from 'react';
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
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
