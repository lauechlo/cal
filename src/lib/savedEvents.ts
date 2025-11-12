/**
 * Saved Events Management
 * Handles saving/unsaving events with localStorage persistence
 */

export interface SavedEvent {
  eventId: string;
  savedAt: string; // ISO timestamp
}

const STORAGE_KEY = 'hoagiecalendar_saved_events';

/**
 * Get all saved event IDs
 */
export function getSavedEventIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Set();

    const savedEvents: SavedEvent[] = JSON.parse(stored);
    return new Set(savedEvents.map(e => e.eventId));
  } catch (error) {
    console.error('Error loading saved events:', error);
    return new Set();
  }
}

/**
 * Get all saved events with metadata
 */
export function getSavedEvents(): SavedEvent[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const savedEvents: SavedEvent[] = JSON.parse(stored);
    // Sort by most recently saved
    return savedEvents.sort((a, b) =>
      new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    );
  } catch (error) {
    console.error('Error loading saved events:', error);
    return [];
  }
}

/**
 * Check if an event is saved
 */
export function isEventSaved(eventId: string): boolean {
  return getSavedEventIds().has(eventId);
}

/**
 * Save an event
 */
export function saveEvent(eventId: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const savedEvents = getSavedEvents();

    // Check if already saved
    if (savedEvents.some(e => e.eventId === eventId)) {
      return true; // Already saved
    }

    // Add new saved event
    savedEvents.push({
      eventId,
      savedAt: new Date().toISOString(),
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedEvents));
    return true;
  } catch (error) {
    console.error('Error saving event:', error);
    return false;
  }
}

/**
 * Unsave an event
 */
export function unsaveEvent(eventId: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const savedEvents = getSavedEvents();
    const filtered = savedEvents.filter(e => e.eventId !== eventId);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error unsaving event:', error);
    return false;
  }
}

/**
 * Toggle saved status
 */
export function toggleEventSaved(eventId: string): boolean {
  if (isEventSaved(eventId)) {
    unsaveEvent(eventId);
    return false; // Now unsaved
  } else {
    saveEvent(eventId);
    return true; // Now saved
  }
}

/**
 * Get count of saved events
 */
export function getSavedEventCount(): number {
  return getSavedEvents().length;
}

/**
 * Clear all saved events
 */
export function clearAllSavedEvents(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing saved events:', error);
  }
}
