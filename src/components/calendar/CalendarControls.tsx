/**
 * CalendarControls - Navigation controls for the calendar
 * Prev/Next month, Today button, View toggle
 */

'use client';

import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import styles from './CalendarControls.module.css';

type View = 'month' | 'week' | 'day';

interface CalendarControlsProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  view: View;
  onViewChange: (view: View) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function CalendarControls({
  currentDate,
  onDateChange,
  view,
  onViewChange,
  searchQuery = '',
  onSearchChange,
}: CalendarControlsProps) {
  // Navigate based on current view
  const handlePrevious = () => {
    if (view === 'month') {
      onDateChange(subMonths(currentDate, 1));
    } else if (view === 'week') {
      onDateChange(subWeeks(currentDate, 1));
    } else if (view === 'day') {
      onDateChange(subDays(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      onDateChange(addMonths(currentDate, 1));
    } else if (view === 'week') {
      onDateChange(addWeeks(currentDate, 1));
    } else if (view === 'day') {
      onDateChange(addDays(currentDate, 1));
    }
  };

  const getPreviousTitle = () => {
    if (view === 'month') return 'Previous month';
    if (view === 'week') return 'Previous week';
    return 'Previous day';
  };

  const getNextTitle = () => {
    if (view === 'month') return 'Next month';
    if (view === 'week') return 'Next week';
    return 'Next day';
  };

  return (
    <div className={styles.controls}>
      <div className={styles.controlsLeft}>
        <h2 className={styles.monthTitle}>
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className={styles.navButtons}>
          <button
            className={styles.navBtn}
            onClick={handlePrevious}
            title={getPreviousTitle()}
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
            onClick={handleNext}
            title={getNextTitle()}
          >
            →
          </button>
        </div>
      </div>

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
