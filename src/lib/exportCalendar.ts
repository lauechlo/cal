/**
 * Export Calendar to .ics file
 * Handles conversion of events to iCalendar format
 */

import { createEvents, EventAttributes } from 'ics';
import { Event } from './mockData';

/**
 * Convert event date and time to ics date array format
 * @param dateStr - Date in YYYY-MM-DD format
 * @param timeStr - Time in HH:MM format
 * @returns Array [year, month, day, hour, minute]
 */
function parseDateTime(dateStr: string, timeStr: string): [number, number, number, number, number] {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);

  return [year, month, day, hour, minute];
}

/**
 * Convert app Event to ics EventAttributes
 */
function convertToIcsEvent(event: Event): EventAttributes {
  const start = parseDateTime(event.date, event.startTime);

  // Calculate end time (use endTime if available, otherwise add 1 hour)
  let end: [number, number, number, number, number];
  if (event.endTime) {
    end = parseDateTime(event.date, event.endTime);
  } else {
    // Add 1 hour to start time as default duration
    const [year, month, day, hour, minute] = start;
    end = [year, month, day, hour + 1, minute];
  }

  // Build description with event details
  let description = event.description;
  if (event.emailContent) {
    description += `\n\n--- Original HoagieMail ---\n${event.emailContent}`;
  }
  description += `\n\nCategory: ${event.category}`;
  description += `\n${event.interestedCount} people interested`;

  return {
    start,
    end,
    title: event.title,
    description,
    location: event.location,
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
    organizer: {
      name: event.senderName,
      email: event.senderEmail,
    },
    categories: [event.category],
    uid: `hoagiecalendar-${event.id}@princeton.edu`,
  };
}

/**
 * Export events to .ics file
 * @param events - Array of events to export
 * @param filename - Name of the file to download (default: 'hoagiecalendar.ics')
 * @returns Success status
 */
export function exportEventsToIcs(
  events: Event[],
  filename: string = 'hoagiecalendar.ics'
): boolean {
  if (events.length === 0) {
    alert('No events to export. Try adjusting your filters or saving some events!');
    return false;
  }

  try {
    // Convert events to ics format
    const icsEvents = events.map(convertToIcsEvent);

    // Generate .ics file content
    const { error, value } = createEvents(icsEvents);

    if (error) {
      console.error('Error generating .ics file:', error);
      alert('Failed to generate calendar file. Please try again.');
      return false;
    }

    if (!value) {
      console.error('No .ics content generated');
      alert('Failed to generate calendar file. Please try again.');
      return false;
    }

    // Create blob and download
    const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error exporting calendar:', error);
    alert('Failed to export calendar. Please try again.');
    return false;
  }
}

/**
 * Get filename based on current filters/context
 */
export function generateFilename(
  filterType?: 'saved' | 'filtered',
  dateContext?: Date
): string {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  if (filterType === 'saved') {
    return `hoagiecalendar-saved-${timestamp}.ics`;
  }

  if (dateContext) {
    const monthYear = dateContext.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    }).toLowerCase().replace(' ', '-');
    return `hoagiecalendar-${monthYear}-${timestamp}.ics`;
  }

  return `hoagiecalendar-${timestamp}.ics`;
}
