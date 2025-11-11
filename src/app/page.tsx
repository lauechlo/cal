/**
 * Home page - redirects to calendar
 */

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/calendar');
}
