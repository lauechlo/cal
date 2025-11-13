/**
 * Utility functions for advanced event filtering
 */

import { Event } from './mockData'
import { parseISO, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'

export type DateRangeFilter = 'all' | 'today' | 'this-week' | 'this-month' | 'custom'
export type TimeOfDayFilter = 'all' | 'morning' | 'afternoon' | 'evening'

export interface AdvancedFilters {
  dateRange: DateRangeFilter
  customStartDate: Date | null
  customEndDate: Date | null
  location: string
  timeOfDay: TimeOfDayFilter
  minInterested: number
}

export const DEFAULT_ADVANCED_FILTERS: AdvancedFilters = {
  dateRange: 'all',
  customStartDate: null,
  customEndDate: null,
  location: '',
  timeOfDay: 'all',
  minInterested: 0
}

/**
 * Get time of day from event start time
 */
export function getTimeOfDay(startTime: string): TimeOfDayFilter {
  const hour = parseInt(startTime.split(':')[0])

  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 || hour < 5) return 'evening'

  return 'all'
}

/**
 * Filter events by date range
 */
export function filterByDateRange(
  events: Event[],
  dateRange: DateRangeFilter,
  customStartDate: Date | null,
  customEndDate: Date | null
): Event[] {
  if (dateRange === 'all') return events

  const now = new Date()
  let start: Date
  let end: Date

  switch (dateRange) {
    case 'today':
      start = startOfDay(now)
      end = endOfDay(now)
      break

    case 'this-week':
      start = startOfWeek(now)
      end = endOfWeek(now)
      break

    case 'this-month':
      start = startOfMonth(now)
      end = endOfMonth(now)
      break

    case 'custom':
      if (!customStartDate || !customEndDate) return events
      start = startOfDay(customStartDate)
      end = endOfDay(customEndDate)
      break

    default:
      return events
  }

  return events.filter(event => {
    const eventDate = parseISO(event.date)
    return isWithinInterval(eventDate, { start, end })
  })
}

/**
 * Filter events by location
 */
export function filterByLocation(events: Event[], locationQuery: string): Event[] {
  if (!locationQuery.trim()) return events

  const query = locationQuery.toLowerCase()
  return events.filter(event =>
    event.location.toLowerCase().includes(query)
  )
}

/**
 * Filter events by time of day
 */
export function filterByTimeOfDay(events: Event[], timeFilter: TimeOfDayFilter): Event[] {
  if (timeFilter === 'all') return events

  return events.filter(event => getTimeOfDay(event.startTime) === timeFilter)
}

/**
 * Filter events by minimum interested count
 */
export function filterByMinInterested(events: Event[], minInterested: number): Event[] {
  if (minInterested === 0) return events

  return events.filter(event => event.interestedCount >= minInterested)
}

/**
 * Apply all advanced filters to events
 */
export function applyAdvancedFilters(events: Event[], filters: AdvancedFilters): Event[] {
  let filtered = events

  // Apply date range filter
  filtered = filterByDateRange(
    filtered,
    filters.dateRange,
    filters.customStartDate,
    filters.customEndDate
  )

  // Apply location filter
  filtered = filterByLocation(filtered, filters.location)

  // Apply time of day filter
  filtered = filterByTimeOfDay(filtered, filters.timeOfDay)

  // Apply minimum interested filter
  filtered = filterByMinInterested(filtered, filters.minInterested)

  return filtered
}

/**
 * Check if any advanced filters are active
 */
export function hasActiveFilters(filters: AdvancedFilters): boolean {
  return (
    filters.dateRange !== 'all' ||
    filters.location.trim() !== '' ||
    filters.timeOfDay !== 'all' ||
    filters.minInterested > 0
  )
}

/**
 * Get active filter count
 */
export function getActiveFilterCount(filters: AdvancedFilters): number {
  let count = 0

  if (filters.dateRange !== 'all') count++
  if (filters.location.trim() !== '') count++
  if (filters.timeOfDay !== 'all') count++
  if (filters.minInterested > 0) count++

  return count
}
