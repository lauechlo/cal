/**
 * Root layout for HoagieCalendar
 * Uses hoagie-ui Layout component for consistent branding
 */

import { ReactNode } from 'react';
import Layout from '@/lib/hoagie-ui/Layout';
import '@/lib/hoagie-ui/theme.css';

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
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
