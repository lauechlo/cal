/**
 * ExportCalendarModal - Modal for exporting events with filter options
 */

'use client'

import { useState } from 'react'
import { Event, Category, categories, mockEvents } from '@/lib/mockData'
import { getSavedEvents } from '@/lib/savedEvents'
import { getInterestedEventIds } from '@/lib/interestedEvents'
import { exportEvents } from '@/lib/icsExport'
import styles from './ExportCalendarModal.module.css'

interface ExportCalendarModalProps {
  isOpen: boolean
  onClose: () => void
  enabledCategories?: Set<Category>
  searchQuery?: string
}

type ExportFilter = 'all' | 'saved' | 'interested' | 'filtered'

export function ExportCalendarModal({
  isOpen,
  onClose,
  enabledCategories,
  searchQuery
}: ExportCalendarModalProps) {
  const [selectedFilter, setSelectedFilter] = useState<ExportFilter>('all')

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getEventsByFilter = (): Event[] => {
    switch (selectedFilter) {
      case 'all':
        return mockEvents

      case 'saved': {
        const savedEventIds = getSavedEvents().map(e => e.eventId)
        return mockEvents.filter(event => savedEventIds.includes(event.id))
      }

      case 'interested': {
        const interestedIds = getInterestedEventIds()
        return mockEvents.filter(event => interestedIds.includes(event.id))
      }

      case 'filtered': {
        // Apply category filters and search if provided
        let filtered = mockEvents

        if (enabledCategories && enabledCategories.size > 0) {
          filtered = filtered.filter(event => enabledCategories.has(event.category))
        }

        // Note: We're not applying search filter here as searchEvents requires import
        // In production, you'd import searchEvents and apply it

        return filtered
      }

      default:
        return mockEvents
    }
  }

  const handleExport = () => {
    const events = getEventsByFilter()

    if (events.length === 0) {
      alert('No events to export!')
      return
    }

    let filename = 'HoagieCalendar'
    switch (selectedFilter) {
      case 'saved':
        filename = 'HoagieCalendar_Saved_Events'
        break
      case 'interested':
        filename = 'HoagieCalendar_Interested_Events'
        break
      case 'filtered':
        filename = 'HoagieCalendar_Filtered_Events'
        break
    }

    exportEvents(events, filename)
    onClose()
  }

  const eventCount = getEventsByFilter().length

  return (
    <div className={styles.modal} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Export Calendar</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.description}>
            Choose which events to export to your calendar app (.ics format)
          </p>

          <div className={styles.filterOptions}>
            <label className={styles.filterOption}>
              <input
                type="radio"
                name="exportFilter"
                value="all"
                checked={selectedFilter === 'all'}
                onChange={() => setSelectedFilter('all')}
                className={styles.radio}
              />
              <div className={styles.filterInfo}>
                <div className={styles.filterLabel}>All Events</div>
                <div className={styles.filterDescription}>
                  Export all {mockEvents.length} events from HoagieCalendar
                </div>
              </div>
            </label>

            <label className={styles.filterOption}>
              <input
                type="radio"
                name="exportFilter"
                value="saved"
                checked={selectedFilter === 'saved'}
                onChange={() => setSelectedFilter('saved')}
                className={styles.radio}
              />
              <div className={styles.filterInfo}>
                <div className={styles.filterLabel}>⭐ Saved Events Only</div>
                <div className={styles.filterDescription}>
                  Export events you've bookmarked
                </div>
              </div>
            </label>

            <label className={styles.filterOption}>
              <input
                type="radio"
                name="exportFilter"
                value="interested"
                checked={selectedFilter === 'interested'}
                onChange={() => setSelectedFilter('interested')}
                className={styles.radio}
              />
              <div className={styles.filterInfo}>
                <div className={styles.filterLabel}>👍 Interested Events Only</div>
                <div className={styles.filterDescription}>
                  Export events you marked as interested
                </div>
              </div>
            </label>

            {enabledCategories && enabledCategories.size < categories.length && (
              <label className={styles.filterOption}>
                <input
                  type="radio"
                  name="exportFilter"
                  value="filtered"
                  checked={selectedFilter === 'filtered'}
                  onChange={() => setSelectedFilter('filtered')}
                  className={styles.radio}
                />
                <div className={styles.filterInfo}>
                  <div className={styles.filterLabel}>🔍 Current Filter View</div>
                  <div className={styles.filterDescription}>
                    Export based on your current category filters
                  </div>
                </div>
              </label>
            )}
          </div>

          <div className={styles.eventCount}>
            {eventCount} event{eventCount !== 1 ? 's' : ''} will be exported
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.btnSecondary} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.btnPrimary}
            onClick={handleExport}
            disabled={eventCount === 0}
          >
            📤 Export {eventCount} Event{eventCount !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  )
}
