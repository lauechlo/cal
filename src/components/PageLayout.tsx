/**
 * Simple page layout wrapper (server component compatible)
 * Provides basic styling without client-side hooks
 */

import { ReactNode } from 'react';
import Footer from '@/lib/hoagie-ui/Footer';
import styles from './PageLayout.module.css';

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.layout}>
      <div className={styles.content}>{children}</div>
      <Footer />
    </div>
  );
}
