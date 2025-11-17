/**
 * SavedEventsModal - Shows all saved events with unsave functionality
 */

'use client';

import { useState, useEffect } from 'react';
import { Event, Category, mockEvents } from '@/lib/mockData';
import { getSavedEvents, unsaveEvent } from '@/lib/savedEvents';
import styles from './SavedEventsModal.module.css';

interface SavedEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventClick: (event: Event) => void;
}

const CATEGORY_LABELS: Record<Category, string> = {
  social: 'Social Events',
  academic: 'Academic',
  food: 'Food & Dining',
  arts: 'Arts & Culture',
  sports: 'Sports & Fitness',
  career: 'Career',
  housing: 'Housing & Sales',
  other: 'Other',
};

export function SavedEventsModal({ isOpen, onClose, onEventClick }: SavedEventsModalProps) {
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);

  // Load saved events whenever modal opens
  useEffect(() => {
    if (isOpen) {
      loadSavedEvents();
    }
  }, [isOpen]);

  const loadSavedEvents = () => {
    const savedEventData = getSavedEvents();
    const savedEventIds = new Set(savedEventData.map(se => se.eventId));

    // Match saved event IDs with actual events from mockData
    const events = mockEvents.filter(event => savedEventIds.has(event.id));

    // Sort by saved date (most recent first)
    const sortedEvents = events.sort((a, b) => {
      const aData = savedEventData.find(se => se.eventId === a.id);
      const bData = savedEventData.find(se => se.eventId === b.id);
      if (!aData || !bData) return 0;
      return new Date(bData.savedAt).getTime() - new Date(aData.savedAt).getTime();
    });

    setSavedEvents(sortedEvents);
  };

  const handleUnsave = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    unsaveEvent(eventId);
    loadSavedEvents(); // Refresh the list
  };

  const handleEventClick = (event: Event) => {
    onEventClick(event);
    onClose(); // Close the saved events modal
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modal} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>⭐ Saved Events</h2>
            <p className={styles.modalDescription}>
              {savedEvents.length === 0
                ? 'No saved events yet'
                : `${savedEvents.length} saved event${savedEvents.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {savedEvents.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>📅</div>
            <p className={styles.emptyStateText}>
              You haven't saved any events yet.
            </p>
            <p className={styles.emptyStateSubtext}>
              Click the ⭐ Save Event button on any event to see it here!
            </p>
          </div>
        ) : (
          <div className={styles.eventList}>
            {savedEvents.map((event) => (
              <SavedEventCard
                key={event.id}
                event={event}
                onUnsave={handleUnsave}
                onClick={() => handleEventClick(event)}
              />
            ))}
          </div>
        )}

        <div className={styles.modalFooter}>
          <button className={styles.closeBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface SavedEventCardProps {
  event: Event;
  onUnsave: (eventId: string, e: React.MouseEvent) => void;
  onClick: () => void;
}

function SavedEventCard({ event, onUnsave, onClick }: SavedEventCardProps) {
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.eventCard} onClick={onClick}>
      <div className={styles.eventCardContent}>
        <div className={styles.eventCardHeader}>
          <span className={`${styles.categoryTag} ${styles[`cat-${event.category}`]}`}>
            {CATEGORY_LABELS[event.category]}
          </span>
          <button
            className={styles.unsaveButton}
            onClick={(e) => onUnsave(event.id, e)}
            title="Unsave event"
          >
            ✕
          </button>
        </div>

        <h3 className={styles.eventTitle}>{event.title}</h3>

        <div className={styles.eventMeta}>
          <div className={styles.eventMetaItem}>
            🗓️ {formatDate(event.date)}
          </div>
          <div className={styles.eventMetaItem}>
            🕐 {event.startTime}
          </div>
          <div className={styles.eventMetaItem}>
            📍 {event.location}
          </div>
        </div>

        <p className={styles.eventDescription}>
          {event.description.length > 100
            ? `${event.description.substring(0, 100)}...`
            : event.description
          }
        </p>
      </div>
    </div>
  );
}
