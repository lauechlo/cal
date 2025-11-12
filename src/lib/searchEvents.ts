/**
 * Event Search Utility
 * Filters events based on keyword search
 */

import { Event } from './mockData';

/**
 * Search events by keyword
 * Searches in title, description, location, sender name, and email content
 */
export function searchEvents(events: Event[], query: string): Event[] {
  if (!query || query.trim() === '') {
    return events;
  }

  const normalizedQuery = query.toLowerCase().trim();

  return events.filter(event => {
    // Search in title
    if (event.title.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // Search in description
    if (event.description.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // Search in location
    if (event.location.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // Search in sender name
    if (event.senderName.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // Search in email content
    if (event.emailContent && event.emailContent.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // Search in category
    if (event.category.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    return false;
  });
}
