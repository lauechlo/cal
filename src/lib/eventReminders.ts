/**
 * Event Reminders System
 * Uses browser notifications to remind users about events they're interested in
 */

import { Event, mockEvents } from './mockData'
import { getInterestedEventIds } from './interestedEvents'
import { parseISO, differenceInMinutes, format, subHours, subDays } from 'date-fns'

const STORAGE_KEY = 'hoagiecalendar_reminder_preferences'

export interface ReminderPreference {
  eventId: string
  reminders: ReminderTime[]
}

export type ReminderTime = '1hour' | '1day' | 'none'

export interface ReminderSettings {
  enableNotifications: boolean
  defaultReminders: ReminderTime[]
}

/**
 * Request notification permission from the browser
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

/**
 * Check if notifications are supported and permitted
 */
export function areNotificationsEnabled(): boolean {
  return (
    'Notification' in window &&
    Notification.permission === 'granted'
  )
}

/**
 * Get reminder settings from localStorage
 */
export function getReminderSettings(): ReminderSettings {
  if (typeof window === 'undefined') {
    return { enableNotifications: false, defaultReminders: ['1day', '1hour'] }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return { enableNotifications: false, defaultReminders: ['1day', '1hour'] }
    }
    return JSON.parse(stored)
  } catch (error) {
    console.error('Failed to parse reminder settings:', error)
    return { enableNotifications: false, defaultReminders: ['1day', '1hour'] }
  }
}

/**
 * Save reminder settings to localStorage
 */
export function saveReminderSettings(settings: ReminderSettings): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Failed to save reminder settings:', error)
  }
}

/**
 * Show a browser notification
 */
export function showNotification(event: Event, reminderType: ReminderTime): void {
  if (!areNotificationsEnabled()) return

  const timeText = reminderType === '1hour' ? 'in 1 hour' : 'tomorrow'
  const eventTime = format(parseISO(`${event.date}T${event.startTime}`), 'h:mm a')

  const notification = new Notification('HoagieCalendar Reminder', {
    body: `${event.title} ${timeText} at ${eventTime}\\n${event.location}`,
    icon: '/favicon.ico', // You can add a custom icon
    tag: `event-${event.id}-${reminderType}`,
    requireInteraction: false,
    silent: false,
  })

  notification.onclick = () => {
    window.focus()
    // Navigate to calendar page with event highlighted
    window.location.href = `/calendar#event-${event.id}`
    notification.close()
  }
}

/**
 * Calculate when to show a reminder
 */
export function calculateReminderTime(event: Event, reminderType: ReminderTime): Date | null {
  if (reminderType === 'none') return null

  const eventDateTime = parseISO(`${event.date}T${event.startTime}`)

  switch (reminderType) {
    case '1hour':
      return subHours(eventDateTime, 1)
    case '1day':
      return subDays(eventDateTime, 1)
    default:
      return null
  }
}

/**
 * Check and schedule reminders for interested events
 * This should be called when the page loads
 */
export function scheduleReminders(): void {
  if (!areNotificationsEnabled()) return

  const settings = getReminderSettings()
  if (!settings.enableNotifications) return

  const interestedIds = getInterestedEventIds()
  const now = new Date()

  interestedIds.forEach(eventId => {
    const event = mockEvents.find(e => e.id === eventId)
    if (!event) return

    const eventDateTime = parseISO(`${event.date}T${event.startTime}`)

    // Skip past events
    if (eventDateTime <= now) return

    settings.defaultReminders.forEach(reminderType => {
      const reminderTime = calculateReminderTime(event, reminderType)
      if (!reminderTime) return

      const minutesUntilReminder = differenceInMinutes(reminderTime, now)

      // Only schedule if reminder time is in the future
      if (minutesUntilReminder > 0) {
        // For demo purposes, we'll show notifications if reminder time is within the next 24 hours
        // In production, you'd use a service worker or background process
        if (minutesUntilReminder <= 1440) { // 24 hours
          const timeoutMs = minutesUntilReminder * 60 * 1000

          // Schedule the notification
          setTimeout(() => {
            showNotification(event, reminderType)
          }, timeoutMs)
        }
      }
    })
  })
}

/**
 * Get upcoming reminders for display
 */
export function getUpcomingReminders(): Array<{
  event: Event
  reminderTime: Date
  reminderType: ReminderTime
}> {
  const settings = getReminderSettings()
  if (!settings.enableNotifications) return []

  const interestedIds = getInterestedEventIds()
  const now = new Date()
  const upcomingReminders: Array<{
    event: Event
    reminderTime: Date
    reminderType: ReminderTime
  }> = []

  interestedIds.forEach(eventId => {
    const event = mockEvents.find(e => e.id === eventId)
    if (!event) return

    const eventDateTime = parseISO(`${event.date}T${event.startTime}`)

    // Skip past events
    if (eventDateTime <= now) return

    settings.defaultReminders.forEach(reminderType => {
      const reminderTime = calculateReminderTime(event, reminderType)
      if (!reminderTime || reminderTime <= now) return

      upcomingReminders.push({
        event,
        reminderTime,
        reminderType
      })
    })
  })

  // Sort by reminder time
  return upcomingReminders.sort((a, b) =>
    a.reminderTime.getTime() - b.reminderTime.getTime()
  )
}

/**
 * Enable reminders (request permission and save settings)
 */
export async function enableReminders(): Promise<boolean> {
  const hasPermission = await requestNotificationPermission()

  if (hasPermission) {
    const settings = getReminderSettings()
    settings.enableNotifications = true
    saveReminderSettings(settings)
    scheduleReminders()
  }

  return hasPermission
}

/**
 * Disable reminders
 */
export function disableReminders(): void {
  const settings = getReminderSettings()
  settings.enableNotifications = false
  saveReminderSettings(settings)
}

/**
 * Toggle reminder notifications
 */
export async function toggleReminders(): Promise<boolean> {
  const settings = getReminderSettings()

  if (settings.enableNotifications) {
    disableReminders()
    return false
  } else {
    return await enableReminders()
  }
}
