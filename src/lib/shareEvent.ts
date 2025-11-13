/**
 * Utility functions for sharing events
 */

import { Event } from './mockData'
import { format, parseISO } from 'date-fns'

/**
 * Generate a shareable URL for an event
 * In production, this would be a full URL like: https://hoagiecalendar.princeton.edu/event/123
 */
export function getEventShareUrl(eventId: string): string {
  // For now, use relative URL with hash
  // In production, use: `${window.location.origin}/event/${eventId}`
  return `${window.location.origin}/calendar#event-${eventId}`
}

/**
 * Copy event link to clipboard
 */
export async function copyEventLink(event: Event): Promise<boolean> {
  try {
    const url = getEventShareUrl(event.id)
    await navigator.clipboard.writeText(url)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Share event via Web Share API (mobile-friendly)
 */
export async function shareEventNative(event: Event): Promise<boolean> {
  if (!navigator.share) {
    return false // Web Share API not supported
  }

  try {
    const eventDate = format(parseISO(event.date), 'EEEE, MMMM d, yyyy')
    const url = getEventShareUrl(event.id)

    await navigator.share({
      title: event.title,
      text: `${event.title} - ${eventDate} at ${event.startTime}\n${event.location}\n\n${event.description}`,
      url: url,
    })
    return true
  } catch (error) {
    // User cancelled share or error occurred
    console.error('Share failed:', error)
    return false
  }
}

/**
 * Share event via email (opens default email client)
 */
export function shareEventEmail(event: Event): void {
  const eventDate = format(parseISO(event.date), 'EEEE, MMMM d, yyyy')
  const url = getEventShareUrl(event.id)

  const subject = encodeURIComponent(`Check out: ${event.title}`)
  const body = encodeURIComponent(
    `I thought you might be interested in this event:\n\n` +
    `${event.title}\n` +
    `${eventDate} at ${event.startTime}\n` +
    `${event.location}\n\n` +
    `${event.description}\n\n` +
    `View event: ${url}\n\n` +
    `From: ${event.senderName} (${event.senderEmail})`
  )

  window.location.href = `mailto:?subject=${subject}&body=${body}`
}

/**
 * Generate social media share URLs
 */
export function getTwitterShareUrl(event: Event): string {
  const eventDate = format(parseISO(event.date), 'MMM d')
  const url = getEventShareUrl(event.id)
  const text = encodeURIComponent(
    `${event.title} - ${eventDate} at ${event.startTime} @ ${event.location}`
  )
  return `https://twitter.com/intent/tweet?text=${text}&url=${url}`
}

export function getFacebookShareUrl(event: Event): string {
  const url = getEventShareUrl(event.id)
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
}

/**
 * Check if Web Share API is supported
 */
export function isNativeShareSupported(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share
}
