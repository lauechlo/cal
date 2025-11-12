/**
 * MonthView - Calendar grid showing events for a month
 * Uses date-fns for date calculations
 */

'use client';

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  isSameDay,
  parseISO,
} from 'date-fns';
import { Event, getEventsForDate } from '@/lib/mockData';
import { searchEvents } from '@/lib/searchEvents';
import styles from './MonthView.module.css';

interface MonthViewProps {
  date: Date;
  onEventClick?: (event: Event) => void;
  enabledCategories?: Set<string>;
  searchQuery?: string;
}

export function MonthView({ date, onEventClick, enabledCategories, searchQuery = '' }: MonthViewProps) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div className={styles.monthView}>
      <div className={styles.monthGrid}>
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className={styles.dayHeader}>
            {day}
          </div>
        ))}

        {/* Day cells */}
        {days.map(day => (
          <DayCell
            key={day.toString()}
            date={day}
            isCurrentMonth={isSameMonth(day, date)}
            isToday={isToday(day)}
            onEventClick={onEventClick}
            enabledCategories={enabledCategories}
            searchQuery={searchQuery}
          />
        ))}
      </div>
    </div>
  );
}

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  onEventClick?: (event: Event) => void;
  enabledCategories?: Set<string>;
  searchQuery?: string;
}

function DayCell({ date, isCurrentMonth, isToday, onEventClick, enabledCategories, searchQuery = '' }: DayCellProps) {
  const dateStr = format(date, 'yyyy-MM-dd');
  const events = getEventsForDate(dateStr);

  // Filter events by enabled categories and search query
  let filteredEvents = events.filter(event =>
    !enabledCategories || enabledCategories.has(event.category)
  );

  // Apply search filter if query exists
  if (searchQuery) {
    filteredEvents = searchEvents(filteredEvents, searchQuery);
  }

  const className = [
    styles.dayCell,
    !isCurrentMonth && styles.otherMonth,
    isToday && styles.today,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className}>
      <div className={isToday ? styles.todayNumber : styles.dayNumber}>
        {format(date, 'd')}
      </div>
      <div className={styles.eventsContainer}>
        {filteredEvents.slice(0, 3).map(event => (
          <div
            key={event.id}
            className={`${styles.eventPill} ${styles[`cat-${event.category}`]}`}
            onClick={() => onEventClick?.(event)}
            title={event.title}
          >
            {event.title}
          </div>
        ))}
        {filteredEvents.length > 3 && (
          <div className={styles.moreEvents}>
            +{filteredEvents.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
}
