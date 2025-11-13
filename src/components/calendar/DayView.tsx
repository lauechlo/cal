import { format, isToday } from 'date-fns';
import { Event, getEventsForDate } from '@/lib/mockData';
import { searchEvents } from '@/lib/searchEvents';
import { AdvancedFilters, applyAdvancedFilters } from '@/lib/advancedFilters';
import styles from './DayView.module.css';

interface DayViewProps {
  date: Date;
  onEventClick: (event: Event) => void;
  enabledCategories: Set<string>;
  searchQuery?: string;
  advancedFilters?: AdvancedFilters;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i); // 0-23
const TIME_SLOT_HEIGHT = 80; // pixels per hour (larger for day view)

export function DayView({ date, onEventClick, enabledCategories, searchQuery = '', advancedFilters }: DayViewProps) {
  let dayEvents = getEventsForDate(format(date, 'yyyy-MM-dd'))
    .filter(event => enabledCategories.has(event.category));

  // Apply search filter if query exists
  if (searchQuery) {
    dayEvents = searchEvents(dayEvents, searchQuery);
  }

  // Apply advanced filters if provided
  if (advancedFilters) {
    dayEvents = applyAdvancedFilters(dayEvents, advancedFilters);
  }

  // Sort by time
  dayEvents = dayEvents.sort((a, b) => a.startTime.localeCompare(b.startTime));

  const formattedDate = format(date, 'EEEE, MMMM d, yyyy');
  const isTodayDate = isToday(date);

  return (
    <div className={styles.dayView}>
      {/* Day header */}
      <div className={`${styles.dayViewHeader} ${isTodayDate ? styles.todayHeader : ''}`}>
        <h2 className={styles.dateTitle}>{formattedDate}</h2>
        {isTodayDate && <span className={styles.todayBadge}>Today</span>}
        <div className={styles.eventCount}>
          {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
        </div>
      </div>

      <div className={styles.dayContent}>
        {/* Time column */}
        <div className={styles.timeColumn}>
          {HOURS.map(hour => (
            <div key={hour} className={styles.timeSlot} style={{ height: `${TIME_SLOT_HEIGHT}px` }}>
              <span className={styles.timeLabel}>
                {hour === 0 ? '12:00 AM' : hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`}
              </span>
            </div>
          ))}
        </div>

        {/* Events column */}
        <div className={styles.eventsColumn}>
          <div className={styles.eventsContainer}>
            {/* Hour grid lines */}
            {HOURS.map(hour => (
              <div
                key={hour}
                className={styles.hourSlot}
                style={{ height: `${TIME_SLOT_HEIGHT}px` }}
              >
                <div className={styles.halfHourLine}></div>
              </div>
            ))}

            {/* Events positioned absolutely */}
            {dayEvents.map(event => {
              const eventPosition = getEventPosition(event);
              return (
                <div
                  key={event.id}
                  className={`${styles.dayEvent} ${styles[`cat-${event.category}`]}`}
                  style={{
                    top: `${eventPosition.top}px`,
                    height: `${eventPosition.height}px`,
                  }}
                  onClick={() => onEventClick(event)}
                >
                  <div className={styles.eventHeader}>
                    <div className={styles.eventTime}>
                      {event.startTime}
                      {event.endTime && ` - ${event.endTime}`}
                    </div>
                    <div className={styles.eventDuration}>
                      {calculateDuration(event.startTime, event.endTime)}
                    </div>
                  </div>
                  <div className={styles.eventTitle}>{event.title}</div>
                  <div className={styles.eventLocation}>📍 {event.location}</div>
                  <div className={styles.eventDescription}>{event.description}</div>
                  <div className={styles.eventFooter}>
                    <span className={styles.categoryBadge}>{getCategoryLabel(event.category)}</span>
                    <span className={styles.interestedBadge}>👥 {event.interestedCount}</span>
                  </div>
                </div>
              );
            })}

            {/* Empty state */}
            {dayEvents.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📅</div>
                <div className={styles.emptyText}>No events scheduled for this day</div>
                <div className={styles.emptySubtext}>
                  Try selecting a different day or adjusting your filters
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getEventPosition(event: Event): { top: number; height: number } {
  // Parse start time (HH:MM format)
  const [startHour, startMinute] = event.startTime.split(':').map(Number);
  const startDecimal = startHour + startMinute / 60;

  // Calculate top position
  const top = startDecimal * TIME_SLOT_HEIGHT;

  // Calculate height (default 1 hour if no end time)
  let height = TIME_SLOT_HEIGHT; // 1 hour default

  if (event.endTime) {
    const [endHour, endMinute] = event.endTime.split(':').map(Number);
    const endDecimal = endHour + endMinute / 60;
    const duration = endDecimal - startDecimal;
    height = duration * TIME_SLOT_HEIGHT;
  }

  return { top, height: Math.max(height, 60) }; // Minimum 60px height
}

function calculateDuration(startTime: string, endTime?: string): string {
  if (!endTime) return '1 hr';

  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  const durationMinutes = endMinutes - startMinutes;

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    social: 'Social Events',
    academic: 'Academic',
    food: 'Food',
    arts: 'Arts & Culture',
    sports: 'Sports',
    career: 'Career',
    housing: 'Housing',
    other: 'Other',
  };
  return labels[category] || category;
}
