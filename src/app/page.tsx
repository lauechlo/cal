/**
 * Home page - redirects to calendar
 */

import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Home() {
  redirect('/calendar');
}
