'use client'

import { useState, useMemo } from 'react'
import { startOfMonth, endOfMonth, subMonths, isAfter, isBefore, parseISO } from 'date-fns'
import Nav from '@/lib/hoagie-ui/Nav'
import { mockEvents, Event, Category } from '@/lib/mockData'
import { searchEvents } from '@/lib/searchEvents'
import { isEventSaved } from '@/lib/savedEvents'
import { EventDetailModal } from '@/components/modals/EventDetailModal'
import ArchiveTimeline from '@/components/archives/ArchiveTimeline'
import ArchiveFilters from '@/components/archives/ArchiveFilters'
import styles from './archives.module.css'

export type DateRangePreset = 'week' | 'month' | '3months' | '6months' | 'year' | 'all' | 'custom'

export default function ArchivesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [enabledCategories, setEnabledCategories] = useState<Set<Category>>(
    new Set(['social', 'academic', 'food', 'arts', 'sports', 'career', 'housing', 'other'])
  )
  const [dateRangePreset, setDateRangePreset] = useState<DateRangePreset>('3months')
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null)
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null)
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Calculate date range based on preset
  const { startDate, endDate } = useMemo(() => {
    const now = new Date()

    if (dateRangePreset === 'custom') {
      return {
        startDate: customStartDate || subMonths(now, 3),
        endDate: customEndDate || now
      }
    }

    switch (dateRangePreset) {
      case 'week':
        return { startDate: subMonths(now, 0.25), endDate: now }
      case 'month':
        return { startDate: startOfMonth(subMonths(now, 1)), endDate: endOfMonth(now) }
      case '3months':
        return { startDate: subMonths(now, 3), endDate: now }
      case '6months':
        return { startDate: subMonths(now, 6), endDate: now }
      case 'year':
        return { startDate: subMonths(now, 12), endDate: now }
      case 'all':
        return { startDate: new Date(2000, 0, 1), endDate: now }
      default:
        return { startDate: subMonths(now, 3), endDate: now }
    }
  }, [dateRangePreset, customStartDate, customEndDate])

  // Filter events
  const filteredEvents = useMemo(() => {
    let events = mockEvents

    // Apply search
    if (searchQuery.trim()) {
      events = searchEvents(events, searchQuery)
    }

    // Apply category filter
    events = events.filter(event => enabledCategories.has(event.category))

    // Apply date range filter
    events = events.filter(event => {
      const eventDate = parseISO(event.date)
      return !isBefore(eventDate, startDate) && !isAfter(eventDate, endDate)
    })

    // Apply saved filter
    if (showSavedOnly) {
      events = events.filter(event => isEventSaved(event.id))
    }

    // Sort by date descending (most recent first)
    events.sort((a, b) => {
      const dateA = parseISO(a.date)
      const dateB = parseISO(b.date)
      return dateB.getTime() - dateA.getTime()
    })

    return events
  }, [searchQuery, enabledCategories, startDate, endDate, showSavedOnly])

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
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
            <h1 className={styles.title}>Event Archives</h1>
            <p className={styles.subtitle}>
              Browse and search through past HoagieMail events
            </p>
          </div>

          <div className={styles.stats}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{filteredEvents.length}</div>
              <div className={styles.statLabel}>Events Found</div>
            </div>
          </div>
        </div>

        <ArchiveFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          enabledCategories={enabledCategories}
          onCategoriesChange={setEnabledCategories}
          dateRangePreset={dateRangePreset}
          onDateRangePresetChange={setDateRangePreset}
          customStartDate={customStartDate}
          customEndDate={customEndDate}
          onCustomStartDateChange={setCustomStartDate}
          onCustomEndDateChange={setCustomEndDate}
          showSavedOnly={showSavedOnly}
          onShowSavedOnlyChange={setShowSavedOnly}
        />

        <ArchiveTimeline
          events={filteredEvents}
          onEventClick={handleEventClick}
        />
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
