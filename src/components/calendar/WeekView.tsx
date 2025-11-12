import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, isToday, addDays } from 'date-fns';
import { Event, getEventsForDate } from '@/lib/mockData';
import styles from './WeekView.module.css';

interface WeekViewProps {
  date: Date;
  onEventClick: (event: Event) => void;
  enabledCategories: Set<string>;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i); // 0-23
const TIME_SLOT_HEIGHT = 60; // pixels per hour

export function WeekView({ date, onEventClick, enabledCategories }: WeekViewProps) {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 }); // Sunday
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className={styles.weekView}>
      <div className={styles.weekGrid}>
        {/* Time column */}
        <div className={styles.timeColumn}>
          <div className={styles.timeColumnHeader}></div>
          {HOURS.map(hour => (
            <div key={hour} className={styles.timeSlot}>
              <span className={styles.timeLabel}>
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </span>
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map(day => {
          const dayEvents = getEventsForDate(format(day, 'yyyy-MM-dd'))
            .filter(event => enabledCategories.has(event.category));

          return (
            <div key={day.toString()} className={styles.dayColumn}>
              <div className={`${styles.dayHeader} ${isToday(day) ? styles.todayHeader : ''}`}>
                <div className={styles.dayName}>{format(day, 'EEE')}</div>
                <div className={`${styles.dayNumber} ${isToday(day) ? styles.todayNumber : ''}`}>
                  {format(day, 'd')}
                </div>
              </div>

              <div className={styles.daySchedule}>
                {/* Hour grid lines */}
                {HOURS.map(hour => (
                  <div
                    key={hour}
                    className={styles.hourSlot}
                    style={{ height: `${TIME_SLOT_HEIGHT}px` }}
                  ></div>
                ))}

                {/* Events positioned absolutely */}
                {dayEvents.map(event => {
                  const eventPosition = getEventPosition(event);
                  return (
                    <div
                      key={event.id}
                      className={`${styles.weekEvent} ${styles[`cat-${event.category}`]}`}
                      style={{
                        top: `${eventPosition.top}px`,
                        height: `${eventPosition.height}px`,
                      }}
                      onClick={() => onEventClick(event)}
                    >
                      <div className={styles.eventTime}>
                        {event.startTime}
                        {event.endTime && ` - ${event.endTime}`}
                      </div>
                      <div className={styles.eventTitle}>{event.title}</div>
                      <div className={styles.eventLocation}>📍 {event.location}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
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

  return { top, height: Math.max(height, 40) }; // Minimum 40px height
}
