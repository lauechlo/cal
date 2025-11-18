/**
 * EventDetailModal - Shows full event details including original HoagieMail
 */

'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Event, Category } from '@/lib/mockData';
import { isEventSaved, toggleEventSaved } from '@/lib/savedEvents';
import styles from './EventDetailModal.module.css';

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
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

export function EventDetailModal({ event, isOpen, onClose }: EventDetailModalProps) {
  const [isSaved, setIsSaved] = useState(false);

  // Update saved state when event changes
  useEffect(() => {
    if (event) {
      setIsSaved(isEventSaved(event.id));
    }
  }, [event]);

  if (!event || !isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSaveToggle = () => {
    const newSavedState = toggleEventSaved(event.id);
    setIsSaved(newSavedState);

    if (newSavedState) {
      toast.success('⭐ Event saved!');
    } else {
      toast.success('Event unsaved');
    }
  };

  return (
    <div className={styles.modal} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <span className={`${styles.categoryTag} ${styles[`cat-${event.category}`]}`}>
              {CATEGORY_LABELS[event.category]}
            </span>
            <h2 className={styles.eventTitle}>{event.title}</h2>
            <div className={styles.eventTime}>
              {event.startTime}
              {event.endTime && ` - ${event.endTime}`}
            </div>
            <div className={styles.eventLocation}>
              📍 {event.location}
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        {/* Description */}
        <div className={styles.eventDescription}>
          {event.description}
        </div>

        {/* Interested Count */}
        <div className={styles.interestedSection}>
          <span className={styles.interestedIcon}>👥</span>
          <span className={styles.interestedCount}>
            {event.interestedCount} people interested
          </span>
        </div>

        {/* Original HoagieMail */}
        <div className={styles.emailSection}>
          <div className={styles.emailHeader}>
            <h3 className={styles.emailTitle}>📧 ORIGINAL HOAGIEMAIL</h3>
          </div>
          <div className={styles.senderInfo}>
            <div className={styles.senderRow}>
              <span className={styles.senderLabel}>From:</span>
              <span className={styles.senderValue}>{event.senderName}</span>
            </div>
            <div className={styles.senderRow}>
              <span className={styles.senderLabel}>Email:</span>
              <span className={styles.senderEmail}>{event.senderEmail}</span>
            </div>
          </div>
          {event.emailContent && (
            <div className={styles.emailContent}>
              {event.emailContent}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button
            className={isSaved ? styles.btnSaved : styles.btnPrimary}
            onClick={handleSaveToggle}
          >
            {isSaved ? '⭐ Saved!' : '⭐ Save Event'}
          </button>
          <button className={styles.btnSecondary}>
            📅 Add to Calendar
          </button>
        </div>

        {/* Report Link */}
        <div className={styles.reportSection}>
          <a href="#" className={styles.reportLink} onClick={(e) => {
            e.preventDefault();
            toast('Report functionality coming soon!', {
              icon: '🚩',
            });
          }}>
            🚩 Report this event
          </a>
        </div>
      </div>
    </div>
  );
}
