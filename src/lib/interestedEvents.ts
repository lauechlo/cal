/**
 * Utility functions for tracking user interest in events
 * Uses localStorage to persist user's interested events
 */

const STORAGE_KEY = 'hoagiecalendar_interested_events'

interface InterestedEvent {
  eventId: string
  interestedAt: string // ISO timestamp
}

/**
 * Get all interested events from localStorage
 */
function getInterestedEvents(): InterestedEvent[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch (error) {
    console.error('Failed to parse interested events from localStorage:', error)
    return []
  }
}

/**
 * Save interested events to localStorage
 */
function saveInterestedEvents(events: InterestedEvent[]): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  } catch (error) {
    console.error('Failed to save interested events to localStorage:', error)
  }
}

/**
 * Check if user has marked interest in an event
 */
export function isEventInterested(eventId: string): boolean {
  const interestedEvents = getInterestedEvents()
  return interestedEvents.some(e => e.eventId === eventId)
}

/**
 * Mark interest in an event
 */
export function markInterested(eventId: string): void {
  const interestedEvents = getInterestedEvents()

  // Don't add if already interested
  if (interestedEvents.some(e => e.eventId === eventId)) {
    return
  }

  interestedEvents.push({
    eventId,
    interestedAt: new Date().toISOString()
  })

  saveInterestedEvents(interestedEvents)
}

/**
 * Remove interest from an event
 */
export function unmarkInterested(eventId: string): void {
  const interestedEvents = getInterestedEvents()
  const filtered = interestedEvents.filter(e => e.eventId !== eventId)
  saveInterestedEvents(filtered)
}

/**
 * Toggle interest in an event
 */
export function toggleEventInterested(eventId: string): boolean {
  const wasInterested = isEventInterested(eventId)

  if (wasInterested) {
    unmarkInterested(eventId)
  } else {
    markInterested(eventId)
  }

  return !wasInterested // Return new state
}

/**
 * Get all interested event IDs
 */
export function getInterestedEventIds(): string[] {
  const interestedEvents = getInterestedEvents()
  return interestedEvents.map(e => e.eventId)
}

/**
 * Get count of interested events
 */
export function getInterestedEventCount(): number {
  return getInterestedEvents().length
}

/**
 * Clear all interested events (useful for testing)
 */
export function clearInterestedEvents(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
