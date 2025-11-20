/**
 * Saved Events Modal
 * Displays all saved events with ability to view details and unsave
 */

'use client';

import { useState, useEffect } from 'react';
import { Dialog, Pane, Button, Text } from 'evergreen-ui';
import { Event, mockEvents } from '@/lib/mockData';
import { getSavedEventIds, toggleEventSaved } from '@/lib/savedEvents';
import { format, parseISO } from 'date-fns';
import styles from './SavedEventsModal.module.css';

interface SavedEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventClick: (event: Event) => void;
}

export function SavedEventsModal({ isOpen, onClose, onEventClick }: SavedEventsModalProps) {
  const [savedEventIds, setSavedEventIds] = useState<Set<string>>(new Set());
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadSavedEvents();
    }
  }, [isOpen]);

  const loadSavedEvents = () => {
    const ids = getSavedEventIds();
    setSavedEventIds(ids);

    // Get actual event objects
    const events = mockEvents.filter(event => ids.has(event.id));
    // Sort by date
    events.sort((a, b) => a.date.localeCompare(b.date));
    setSavedEvents(events);
  };

  const handleUnsave = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleEventSaved(eventId);
    loadSavedEvents(); // Refresh list
  };

  const handleEventClick = (event: Event) => {
    onEventClick(event);
    onClose();
  };

  return (
    <Dialog
      isShown={isOpen}
      title="⭐ Saved Events"
      onCloseComplete={onClose}
      hasFooter={false}
      width="800px"
    >
      <Pane>
        {savedEvents.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>⭐</div>
            <Text size={500} marginBottom={8}>No saved events yet</Text>
            <Text color="muted">
              Save events from the calendar to see them here!
            </Text>
          </div>
        ) : (
          <div className={styles.eventsList}>
            {savedEvents.map(event => (
              <div
                key={event.id}
                className={`${styles.eventCard} ${styles[`cat-${event.category}`]}`}
                onClick={() => handleEventClick(event)}
              >
                <div className={styles.eventHeader}>
                  <div className={styles.eventDate}>
                    {format(parseISO(event.date), 'EEE, MMM d')}
                  </div>
                  <button
                    className={styles.unsaveBtn}
                    onClick={(e) => handleUnsave(event.id, e)}
                    title="Remove from saved"
                  >
                    ✕
                  </button>
                </div>

                <div className={styles.eventTitle}>{event.title}</div>

                <div className={styles.eventMeta}>
                  <span className={styles.eventTime}>
                    🕐 {event.startTime}
                    {event.endTime && ` - ${event.endTime}`}
                  </span>
                  <span className={styles.eventLocation}>
                    📍 {event.location}
                  </span>
                </div>

                <div className={styles.eventDescription}>
                  {event.description}
                </div>

                <div className={styles.eventFooter}>
                  <span className={styles.categoryBadge}>
                    {getCategoryLabel(event.category)}
                  </span>
                  <span className={styles.interestedBadge}>
                    👥 {event.interestedCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Pane>
    </Dialog>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    social: 'Social',
    academic: 'Academic',
    food: 'Food',
    arts: 'Arts',
    sports: 'Sports',
    career: 'Career',
    housing: 'Housing',
    other: 'Other',
  };
  return labels[category] || category;
}
