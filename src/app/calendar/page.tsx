/**
 * Main Calendar Page
 * Uses hoagie-ui Nav for consistent branding
 */

'use client';

import { Pane, Heading, Text } from 'evergreen-ui';
import Nav from '@/lib/hoagie-ui/Nav';

export default function CalendarPage() {
  // Mock user data (will be replaced with real auth)
  const mockUser = {
    name: 'Chloe Lau',
    email: 'chloelau@princeton.edu',
    picture: '',
  };

  return (
    <Pane>
      {/* Navigation bar using hoagie-ui */}
      <Nav
        name="calendar"
        user={mockUser}
        beta={true}
        tabs={[
          { title: 'Calendar', href: '/calendar' },
          { title: 'Archives', href: '/archives' },
        ]}
      />

      {/* Main content */}
      <Pane
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        height="60vh"
        padding={40}
      >
        <Heading size={900} marginBottom={16}>
          🗓️ HoagieCalendar
        </Heading>
        <Heading size={600} color="muted" marginBottom={32}>
          Your UX/UI vision is coming to life!
        </Heading>
        <Pane maxWidth={600} textAlign="center">
          <Text size={500}>
            ✅ Next.js 14 + TypeScript initialized<br />
            ✅ hoagie-ui components copied from HoagieMail<br />
            ✅ Poppins + Inter fonts loaded<br />
            ✅ Nav component working with Hoagie branding<br />
            ✅ Layout component providing structure<br />
            <br />
            <strong>Next steps:</strong> Build your calendar grid, sidebar filters, and event cards!
          </Text>
        </Pane>
      </Pane>
    </Pane>
  );
}
