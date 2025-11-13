'use client'

import { useState, useMemo, useEffect } from 'react'
import { parseISO, format } from 'date-fns'
import Nav from '@/lib/hoagie-ui/Nav'
import { mockEvents, Event, Category } from '@/lib/mockData'
import { getSavedEvents, clearAllSavedEvents } from '@/lib/savedEvents'
import { isEventInterested } from '@/lib/interestedEvents'
import { exportEvents } from '@/lib/icsExport'
import { EventDetailModal } from '@/components/modals/EventDetailModal'
import styles from './saved.module.css'

type SortOption = 'date-asc' | 'date-desc' | 'recently-saved' | 'category'

export default function SavedEventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('recently-saved')
  const [savedEventIds, setSavedEventIds] = useState<Set<string>>(new Set())

  // Load saved events on mount and refresh periodically
  useEffect(() => {
    const loadSavedEvents = () => {
      const saved = getSavedEvents()
      setSavedEventIds(new Set(saved.map(e => e.eventId)))
    }

    loadSavedEvents()

    // Refresh every second to pick up changes from modals
    const interval = setInterval(loadSavedEvents, 1000)
    return () => clearInterval(interval)
  }, [])

  // Get saved events with full event data
  const savedEvents = useMemo(() => {
    return mockEvents.filter(event => savedEventIds.has(event.id))
  }, [savedEventIds])

  // Sort events
  const sortedEvents = useMemo(() => {
    const events = [...savedEvents]

    switch (sortBy) {
      case 'date-asc':
        return events.sort((a, b) => {
          const dateA = parseISO(a.date)
          const dateB = parseISO(b.date)
          return dateA.getTime() - dateB.getTime()
        })

      case 'date-desc':
        return events.sort((a, b) => {
          const dateA = parseISO(a.date)
          const dateB = parseISO(b.date)
          return dateB.getTime() - dateA.getTime()
        })

      case 'recently-saved': {
        const savedData = getSavedEvents()
        const savedMap = new Map(savedData.map(s => [s.eventId, s.savedAt]))
        return events.sort((a, b) => {
          const timeA = new Date(savedMap.get(a.id) || 0).getTime()
          const timeB = new Date(savedMap.get(b.id) || 0).getTime()
          return timeB - timeA // Most recent first
        })
      }

      case 'category':
        return events.sort((a, b) => a.category.localeCompare(b.category))

      default:
        return events
    }
  }, [savedEvents, sortBy])

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  const handleExportAll = () => {
    if (savedEvents.length === 0) {
      alert('No saved events to export!')
      return
    }
    exportEvents(savedEvents, 'My_Saved_Events')
  }

  const handleClearAll = () => {
    if (savedEvents.length === 0) return

    const confirmed = window.confirm(
      `Are you sure you want to remove all ${savedEvents.length} saved events? This cannot be undone.`
    )

    if (confirmed) {
      clearAllSavedEvents()
      setSavedEventIds(new Set())
    }
  }

  const mockUser = {
    name: 'Tiger Student',
    email: 'tiger@princeton.edu',
    picture: 'https://via.placeholder.com/40'
  }

  return (
    <div className={styles.page}>
      <Nav name="calendar" user={mockUser} tabs={[
        { name: 'Calendar', href: '/calendar' },
        { name: 'Saved Events', href: '/saved' },
        { name: 'Archives', href: '/archives' }
      ]} />

      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Saved Events</h1>
            <p className={styles.subtitle}>
              {savedEvents.length} event{savedEvents.length !== 1 ? 's' : ''} bookmarked
            </p>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.actionButton}
              onClick={handleExportAll}
              disabled={savedEvents.length === 0}
            >
              📤 Export All
            </button>
            <button
              className={styles.actionButtonDanger}
              onClick={handleClearAll}
              disabled={savedEvents.length === 0}
            >
              🗑️ Clear All
            </button>
          </div>
        </div>

        {savedEvents.length > 0 && (
          <div className={styles.controls}>
            <label className={styles.sortLabel}>
              Sort by:
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className={styles.sortSelect}
              >
                <option value="recently-saved">Recently Saved</option>
                <option value="date-asc">Date (Earliest First)</option>
                <option value="date-desc">Date (Latest First)</option>
                <option value="category">Category</option>
              </select>
            </label>
          </div>
        )}

        {savedEvents.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>⭐</div>
            <h3 className={styles.emptyTitle}>No saved events yet</h3>
            <p className={styles.emptyDescription}>
              Start saving events you're interested in by clicking the "⭐ Save Event" button when viewing event details.
            </p>
            <a href="/calendar" className={styles.emptyButton}>
              Browse Events
            </a>
          </div>
        ) : (
          <div className={styles.eventsList}>
            {sortedEvents.map((event) => {
              const isInterested = isEventInterested(event.id)
              const eventDate = parseISO(event.date)

              return (
                <div key={event.id} className={styles.eventCard}>
                  <div className={styles.eventDate}>
                    <div className={styles.eventMonth}>
                      {format(eventDate, 'MMM')}
                    </div>
                    <div className={styles.eventDay}>
                      {format(eventDate, 'd')}
                    </div>
                  </div>

                  <div className={styles.eventContent}>
                    <div className={styles.eventHeader}>
                      <h3
                        className={styles.eventTitle}
                        onClick={() => handleEventClick(event)}
                      >
                        {event.title}
                        {isInterested && (
                          <span className={styles.interestedBadge} title="You're going!">
                            👍
                          </span>
                        )}
                      </h3>
                      <span className={styles.categoryBadge} data-category={event.category}>
                        {event.category}
                      </span>
                    </div>

                    <div className={styles.eventDetails}>
                      <span className={styles.eventTime}>
                        🕐 {event.startTime}
                        {event.endTime && ` - ${event.endTime}`}
                      </span>
                      <span className={styles.eventLocation}>
                        📍 {event.location}
                      </span>
                    </div>

                    {event.description && (
                      <p className={styles.eventDescription}>{event.description}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {isModalOpen && selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}
