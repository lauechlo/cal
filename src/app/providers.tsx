'use client';

import { ReactNode } from 'react';
import Theme from '@/lib/hoagie-ui/Theme';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Theme palette="purple">
      {children}
    </Theme>
  );
}
