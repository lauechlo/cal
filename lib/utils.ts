import { CalendarEvent, FilterOptions, CATEGORIES } from '@/types'
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns'

export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export function getCategoryColor(category: string) {
  const cat = CATEGORIES.find(c => c.id === category)
  return cat || CATEGORIES[CATEGORIES.length - 1] // default to 'other'
}

export function filterEvents(events: CalendarEvent[], filters: FilterOptions): CalendarEvent[] {
  return events.filter(event => {
    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(event.category)) {
      return false
    }

    // Date range filter
    const eventDate = parseISO(event.date)
    if (filters.dateRange.start && eventDate < filters.dateRange.start) {
      return false
    }
    if (filters.dateRange.end && eventDate > filters.dateRange.end) {
      return false
    }

    // Search filter (title, description, location)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesSearch =
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower)
      if (!matchesSearch) return false
    }

    // Location filter
    if (filters.location && !event.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false
    }

    // Free food filter
    if (filters.onlyFreeFood && !event.tags.some(tag => tag.toLowerCase().includes('free food'))) {
      return false
    }

    // Saved events filter
    if (filters.onlySavedEvents && !event.isSaved) {
      return false
    }

    // Time of day filter
    if (filters.timeOfDay !== 'all') {
      const startHour = parseInt(event.startTime.split(':')[0])
      if (filters.timeOfDay === 'morning' && (startHour < 6 || startHour >= 12)) return false
      if (filters.timeOfDay === 'afternoon' && (startHour < 12 || startHour >= 17)) return false
      if (filters.timeOfDay === 'evening' && (startHour < 17 || startHour >= 24)) return false
    }

    return true
  })
}

export function getEventsForDate(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events.filter(event => {
    const eventDate = parseISO(event.date)
    return isSameDay(eventDate, date)
  })
}

export function getEventsForMonth(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events.filter(event => {
    const eventDate = parseISO(event.date)
    return isSameMonth(eventDate, date)
  })
}

export function getCalendarDays(currentDate: Date) {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
}

export function formatEventTime(startTime: string, endTime: string): string {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return `${formatTime(startTime)} - ${formatTime(endTime)}`
}

export function getTimeSlotPosition(startTime: string, endTime: string): { top: number, height: number } {
  const parseTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours + minutes / 60
  }

  const startHour = parseTime(startTime)
  const endHour = parseTime(endTime)
  const duration = endHour - startHour

  // Assuming day starts at 6 AM and slot height is 60px per hour
  const dayStartHour = 6
  const pixelsPerHour = 60

  return {
    top: (startHour - dayStartHour) * pixelsPerHour,
    height: duration * pixelsPerHour,
  }
}

export function generateICS(events: CalendarEvent[]): string {
  const escapeString = (str: string) => str.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n')

  let ics = 'BEGIN:VCALENDAR\r\n'
  ics += 'VERSION:2.0\r\n'
  ics += 'PRODID:-//HoagieCalendar//EN\r\n'
  ics += 'CALSCALE:GREGORIAN\r\n'
  ics += 'METHOD:PUBLISH\r\n'

  events.forEach(event => {
    const eventDate = event.date.replace(/-/g, '')
    const startTime = event.startTime.replace(':', '') + '00'
    const endTime = event.endTime.replace(':', '') + '00'

    ics += 'BEGIN:VEVENT\r\n'
    ics += `UID:${event.id}@hoagiecalendar.com\r\n`
    ics += `DTSTAMP:${eventDate}T${startTime}Z\r\n`
    ics += `DTSTART:${eventDate}T${startTime}Z\r\n`
    ics += `DTEND:${eventDate}T${endTime}Z\r\n`
    ics += `SUMMARY:${escapeString(event.title)}\r\n`
    ics += `DESCRIPTION:${escapeString(event.description)}\r\n`
    ics += `LOCATION:${escapeString(event.location)}\r\n`
    ics += 'END:VEVENT\r\n'
  })

  ics += 'END:VCALENDAR\r\n'
  return ics
}
