/**
 * Main Calendar Page
 * Shows Month/Week/Day views with navigation controls
 */

'use client';

import { useState } from 'react';
import { Pane } from 'evergreen-ui';
import Nav from '@/lib/hoagie-ui/Nav';
import { MonthView } from '@/components/calendar/MonthView';
import { WeekView } from '@/components/calendar/WeekView';
import { DayView } from '@/components/calendar/DayView';
import { CalendarControls } from '@/components/calendar/CalendarControls';
import { Sidebar } from '@/components/Sidebar';
import { EventDetailModal } from '@/components/modals/EventDetailModal';
import { Event } from '@/lib/mockData';
import styles from './calendar.module.css';

type View = 'month' | 'week' | 'day';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>('month');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
    setIsModalOpen(true);
  };

  const handleCategoryToggle = (category: string) => {
    setEnabledCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
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
          { title: 'Saved Events', href: '/saved' },
          { title: 'Archives', href: '/archives' },
        ]}
      />

      {/* Main content */}
      <div className={styles.container}>
        {/* Sidebar with category filters */}
        <aside className={styles.sidebar}>
          <Sidebar
            enabledCategories={enabledCategories}
            onCategoryToggle={handleCategoryToggle}
          />
        </aside>

        {/* Calendar main area */}
        <main className={styles.calendarMain}>
          <CalendarControls
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            view={view}
            onViewChange={setView}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <div className={styles.calendarView}>
            {view === 'month' && (
              <MonthView
                date={currentDate}
                onEventClick={handleEventClick}
                enabledCategories={enabledCategories}
                searchQuery={searchQuery}
              />
            )}
            {view === 'week' && (
              <WeekView
                date={currentDate}
                onEventClick={handleEventClick}
                enabledCategories={enabledCategories}
                searchQuery={searchQuery}
              />
            )}
            {view === 'day' && (
              <DayView
                date={currentDate}
                onEventClick={handleEventClick}
                enabledCategories={enabledCategories}
                searchQuery={searchQuery}
              />
            )}
          </div>
        </main>
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Pane>
  );
}
