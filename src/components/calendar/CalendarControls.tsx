/**
 * CalendarControls - Navigation controls for the calendar
 * Prev/Next month, Today button, View toggle
 */

'use client';

import { format, addMonths, subMonths } from 'date-fns';
import styles from './CalendarControls.module.css';

type View = 'month' | 'week' | 'day';

interface CalendarControlsProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  view: View;
  onViewChange: (view: View) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onCreateEvent?: () => void;
}

export function CalendarControls({
  currentDate,
  onDateChange,
  view,
  onViewChange,
  searchQuery = '',
  onSearchChange,
  onCreateEvent,
}: CalendarControlsProps) {
  return (
    <div className={styles.controls}>
      <div className={styles.controlsLeft}>
        <h2 className={styles.monthTitle}>
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className={styles.navButtons}>
          <button
            className={styles.navBtn}
            onClick={() => onDateChange(subMonths(currentDate, 1))}
            title="Previous month"
          >
            ←
          </button>
          <button
            className={styles.todayBtn}
            onClick={() => onDateChange(new Date())}
          >
            Today
          </button>
          <button
            className={styles.navBtn}
            onClick={() => onDateChange(addMonths(currentDate, 1))}
            title="Next month"
          >
            →
          </button>
        </div>
      </div>

      <div className={styles.controlsCenter}>
        {onSearchChange && (
          <div className={styles.searchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>
        )}

        {onCreateEvent && (
          <button
            className={styles.createBtn}
            onClick={onCreateEvent}
            title="Create new event"
          >
            ✨ Create Event
          </button>
        )}
      </div>

      <div className={styles.viewToggle}>
        <button
          className={`${styles.viewBtn} ${view === 'month' ? styles.active : ''}`}
          onClick={() => onViewChange('month')}
        >
          Month
        </button>
        <button
          className={`${styles.viewBtn} ${view === 'week' ? styles.active : ''}`}
          onClick={() => onViewChange('week')}
        >
          Week
        </button>
        <button
          className={`${styles.viewBtn} ${view === 'day' ? styles.active : ''}`}
          onClick={() => onViewChange('day')}
        >
          Day
        </button>
      </div>
    </div>
  );
}
