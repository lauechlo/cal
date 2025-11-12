import { useState } from 'react'
import { format, parseISO, startOfMonth, isSameMonth } from 'date-fns'
import { Event, Category, categories } from '@/lib/mockData'
import { isEventSaved } from '@/lib/savedEvents'
import { isEventInterested } from '@/lib/interestedEvents'
import styles from './ArchiveTimeline.module.css'

interface ArchiveTimelineProps {
  events: Event[]
  onEventClick: (event: Event) => void
}

interface GroupedEvents {
  monthKey: string
  monthLabel: string
  events: Event[]
}

export default function ArchiveTimeline({ events, onEventClick }: ArchiveTimelineProps) {
  const [expandedEmails, setExpandedEmails] = useState<Set<string>>(new Set())

  // Group events by month
  const groupedEvents: GroupedEvents[] = events.reduce((acc, event) => {
    const eventDate = parseISO(event.date)
    const monthKey = format(eventDate, 'yyyy-MM')
    const monthLabel = format(eventDate, 'MMMM yyyy')

    let group = acc.find(g => g.monthKey === monthKey)
    if (!group) {
      group = { monthKey, monthLabel, events: [] }
      acc.push(group)
    }
    group.events.push(event)

    return acc
  }, [] as GroupedEvents[])

  const toggleEmailExpansion = (eventId: string) => {
    const newExpanded = new Set(expandedEmails)
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId)
    } else {
      newExpanded.add(eventId)
    }
    setExpandedEmails(newExpanded)
  }

  const getCategoryInfo = (categoryId: string) => {
    return categories.find((c: { id: Category; name: string; color: string }) => c.id === categoryId)
  }

  if (events.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📭</div>
        <h3 className={styles.emptyTitle}>No events found</h3>
        <p className={styles.emptyDescription}>
          Try adjusting your filters or date range to see more events
        </p>
      </div>
    )
  }

  return (
    <div className={styles.timeline}>
      {groupedEvents.map(group => (
        <div key={group.monthKey} className={styles.monthGroup}>
          <div className={styles.monthHeader}>
            <h2 className={styles.monthTitle}>{group.monthLabel}</h2>
            <span className={styles.monthCount}>{group.events.length} events</span>
          </div>

          <div className={styles.eventsList}>
            {group.events.map(event => {
              const categoryInfo = getCategoryInfo(event.category)
              const isExpanded = expandedEmails.has(event.id)
              const isSaved = isEventSaved(event.id)
              const isInterested = isEventInterested(event.id)

              return (
                <div key={event.id} className={styles.eventCard}>
                  <div className={styles.eventHeader}>
                    <div className={styles.eventDate}>
                      <div className={styles.eventDay}>
                        {format(parseISO(event.date), 'd')}
                      </div>
                      <div className={styles.eventDayName}>
                        {format(parseISO(event.date), 'EEE')}
                      </div>
                    </div>

                    <div className={styles.eventMain}>
                      <div className={styles.eventTop}>
                        <div className={styles.eventTitleRow}>
                          <h3
                            className={styles.eventTitle}
                            onClick={() => onEventClick(event)}
                          >
                            {event.title}
                          </h3>
                          {isSaved && (
                            <span className={styles.savedBadge} title="Saved event">
                              ⭐
                            </span>
                          )}
                          {isInterested && (
                            <span className={styles.interestedBadge} title="You're going!">
                              👍
                            </span>
                          )}
                        </div>

                        {categoryInfo && (
                          <span
                            className={styles.categoryBadge}
                            style={{ backgroundColor: categoryInfo.color }}
                          >
                            {categoryInfo.name}
                          </span>
                        )}
                      </div>

                      <div className={styles.eventDetails}>
                        <div className={styles.eventTime}>
                          🕐 {event.startTime}
                          {event.endTime && ` - ${event.endTime}`}
                        </div>
                        <div className={styles.eventLocation}>
                          📍 {event.location}
                        </div>
                        <div className={styles.eventInterested}>
                          👥 {event.interestedCount} interested
                        </div>
                      </div>

                      {event.description && (
                        <p className={styles.eventDescription}>{event.description}</p>
                      )}

                      {/* Email Preview Section */}
                      <div className={styles.emailSection}>
                        <button
                          className={styles.emailToggle}
                          onClick={() => toggleEmailExpansion(event.id)}
                        >
                          <span className={styles.emailIcon}>✉️</span>
                          <span className={styles.emailLabel}>
                            Original HoagieMail from {event.senderName}
                          </span>
                          <span className={styles.expandIcon}>
                            {isExpanded ? '▼' : '▶'}
                          </span>
                        </button>

                        {isExpanded && (
                          <div className={styles.emailContent}>
                            <div className={styles.emailHeader}>
                              <div className={styles.emailFrom}>
                                <strong>From:</strong> {event.senderName}
                              </div>
                              <div className={styles.emailAddress}>
                                <strong>Email:</strong> {event.senderEmail}
                              </div>
                            </div>

                            {event.emailContent && (
                              <div className={styles.emailBody}>
                                <strong>Message:</strong>
                                <p>{event.emailContent}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className={styles.eventActions}>
                        <button
                          className={styles.actionButton}
                          onClick={() => onEventClick(event)}
                        >
                          View Full Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
