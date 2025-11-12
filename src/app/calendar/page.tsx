/**
 * Main Calendar Page
 * Shows Month/Week/Day views with navigation controls
 */

'use client';

import { useState } from 'react';
import { Pane } from 'evergreen-ui';
import Nav from '@/lib/hoagie-ui/Nav';
import { MonthView } from '@/components/calendar/MonthView';
import { CalendarControls } from '@/components/calendar/CalendarControls';
import { Event } from '@/lib/mockData';
import styles from './calendar.module.css';

type View = 'month' | 'week' | 'day';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>('month');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(
    new Set(['social', 'academic', 'food', 'arts', 'sports', 'career', 'housing', 'other'])
  );

  // Mock user data (will be replaced with real auth)
  const mockUser = {
    name: 'Chloe Lau',
    email: 'chloelau@princeton.edu',
    picture: '',
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    // Will open modal in next step
    console.log('Clicked event:', event);
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
      <div className={styles.container}>
        {/* Sidebar - will build next */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarPlaceholder}>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>
              ⚙️ Sidebar with category filters coming next!
            </p>
          </div>
        </aside>

        {/* Calendar main area */}
        <main className={styles.calendarMain}>
          <CalendarControls
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            view={view}
            onViewChange={setView}
          />

          <div className={styles.calendarView}>
            {view === 'month' && (
              <MonthView
                date={currentDate}
                onEventClick={handleEventClick}
                enabledCategories={enabledCategories}
              />
            )}
            {view === 'week' && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                📅 Week view coming soon!
              </div>
            )}
            {view === 'day' && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                📋 Day view coming soon!
              </div>
            )}
          </div>
        </main>
      </div>
    </Pane>
  );
}
