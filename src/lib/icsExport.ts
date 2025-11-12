/**
 * Utility functions for exporting events to .ics (iCalendar) format
 * Compatible with Google Calendar, Apple Calendar, Outlook, etc.
 */

import { Event } from './mockData'
import { parseISO, format } from 'date-fns'

/**
 * Convert a Date object to iCalendar format (YYYYMMDDTHHMMSS)
 */
function formatICalDate(date: Date): string {
  return format(date, "yyyyMMdd'T'HHmmss")
}

/**
 * Escape special characters in iCalendar text fields
 */
function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

/**
 * Generate a unique UID for an event
 */
function generateUID(event: Event): string {
  return `${event.id}@hoagiecalendar.princeton.edu`
}

/**
 * Parse time string (HH:MM) and combine with date to create a Date object
 */
function parseDateTime(dateString: string, timeString: string): Date {
  const date = parseISO(dateString)
  const [hours, minutes] = timeString.split(':').map(Number)
  date.setHours(hours, minutes, 0, 0)
  return date
}

/**
 * Generate .ics content for a single event
 */
export function generateICS(event: Event): string {
  const startDateTime = parseDateTime(event.date, event.startTime)
  const endDateTime = event.endTime
    ? parseDateTime(event.date, event.endTime)
    : new Date(startDateTime.getTime() + 60 * 60 * 1000) // Default 1 hour duration

  const now = new Date()

  // Build description with event details and original email
  let description = escapeICalText(event.description)

  if (event.emailContent) {
    description += `\\n\\n--- Original HoagieMail ---\\n`
    description += `From: ${escapeICalText(event.senderName)} (${escapeICalText(event.senderEmail)})\\n\\n`
    description += escapeICalText(event.emailContent)
  }

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HoagieCalendar//Princeton University//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:HoagieCalendar',
    'X-WR-TIMEZONE:America/New_York',
    'BEGIN:VEVENT',
    `UID:${generateUID(event)}`,
    `DTSTAMP:${formatICalDate(now)}`,
    `DTSTART:${formatICalDate(startDateTime)}`,
    `DTEND:${formatICalDate(endDateTime)}`,
    `SUMMARY:${escapeICalText(event.title)}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${escapeICalText(event.location)}`,
    `ORGANIZER;CN=${escapeICalText(event.senderName)}:mailto:${event.senderEmail}`,
    `CATEGORIES:${event.category.toUpperCase()}`,
    `STATUS:CONFIRMED`,
    `SEQUENCE:0`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')

  return icsContent
}

/**
 * Generate .ics content for multiple events
 */
export function generateMultipleICS(events: Event[], calendarName: string = 'HoagieCalendar'): string {
  const now = new Date()

  const eventsICS = events.map(event => {
    const startDateTime = parseDateTime(event.date, event.startTime)
    const endDateTime = event.endTime
      ? parseDateTime(event.date, event.endTime)
      : new Date(startDateTime.getTime() + 60 * 60 * 1000)

    let description = escapeICalText(event.description)

    if (event.emailContent) {
      description += `\\n\\n--- Original HoagieMail ---\\n`
      description += `From: ${escapeICalText(event.senderName)} (${escapeICalText(event.senderEmail)})\\n\\n`
      description += escapeICalText(event.emailContent)
    }

    return [
      'BEGIN:VEVENT',
      `UID:${generateUID(event)}`,
      `DTSTAMP:${formatICalDate(now)}`,
      `DTSTART:${formatICalDate(startDateTime)}`,
      `DTEND:${formatICalDate(endDateTime)}`,
      `SUMMARY:${escapeICalText(event.title)}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${escapeICalText(event.location)}`,
      `ORGANIZER;CN=${escapeICalText(event.senderName)}:mailto:${event.senderEmail}`,
      `CATEGORIES:${event.category.toUpperCase()}`,
      `STATUS:CONFIRMED`,
      `SEQUENCE:0`,
      'END:VEVENT'
    ].join('\r\n')
  }).join('\r\n')

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HoagieCalendar//Princeton University//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeICalText(calendarName)}`,
    'X-WR-TIMEZONE:America/New_York',
    eventsICS,
    'END:VCALENDAR'
  ].join('\r\n')

  return icsContent
}

/**
 * Download an .ics file with the given content
 */
export function downloadICS(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

/**
 * Export a single event as .ics file
 */
export function exportEvent(event: Event): void {
  const icsContent = generateICS(event)
  const filename = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`
  downloadICS(icsContent, filename)
}

/**
 * Export multiple events as .ics file
 */
export function exportEvents(events: Event[], calendarName: string = 'HoagieCalendar'): void {
  const icsContent = generateMultipleICS(events, calendarName)
  const filename = `${calendarName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`
  downloadICS(icsContent, filename)
}
