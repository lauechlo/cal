/**
 * Root layout for HoagieCalendar
 * Uses hoagie-ui Layout component for consistent branding
 */

import { ReactNode } from 'react';
import Layout from '@/lib/hoagie-ui/Layout';
import { Toaster } from 'react-hot-toast';
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
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#1F2937',
              padding: '12px 20px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              fontSize: '14px',
              fontFamily: 'var(--font-body)',
            },
            success: {
              iconTheme: {
                primary: '#14B8A6',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
