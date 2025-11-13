/**
 * EventDetailModal - Shows full event details including original HoagieMail
 */

'use client';

import { useState, useEffect } from 'react';
import { Event, Category } from '@/lib/mockData';
import { isEventSaved, toggleEventSaved } from '@/lib/savedEvents';
import { isEventInterested, toggleEventInterested } from '@/lib/interestedEvents';
import { exportEvent } from '@/lib/icsExport';
import { copyEventLink, shareEventEmail, shareEventNative, isNativeShareSupported } from '@/lib/shareEvent';
import { getReminderSettings, toggleReminders, areNotificationsEnabled, scheduleReminders } from '@/lib/eventReminders';
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
  const [isInterested, setIsInterested] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(false);

  // Update saved and interested state when event changes
  useEffect(() => {
    if (event) {
      setIsSaved(isEventSaved(event.id));
      setIsInterested(isEventInterested(event.id));
    }
  }, [event]);

  // Check if reminders are enabled
  useEffect(() => {
    const settings = getReminderSettings();
    setRemindersEnabled(settings.enableNotifications && areNotificationsEnabled());
  }, []);

  if (!event || !isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSaveToggle = () => {
    const newSavedState = toggleEventSaved(event.id);
    setIsSaved(newSavedState);
  };

  const handleInterestedToggle = () => {
    const newInterestedState = toggleEventInterested(event.id);
    setIsInterested(newInterestedState);

    // Schedule reminders if enabled and event was marked as interested
    if (newInterestedState && remindersEnabled) {
      scheduleReminders();
    }
  };

  const handleToggleReminders = async () => {
    const newState = await toggleReminders();
    setRemindersEnabled(newState);

    if (newState) {
      scheduleReminders();
    }
  };

  const handleAddToCalendar = () => {
    exportEvent(event);
  };

  const handleCopyLink = async () => {
    const success = await copyEventLink(event);
    if (success) {
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    }
  };

  const handleShareEmail = () => {
    shareEventEmail(event);
  };

  const handleShareNative = async () => {
    await shareEventNative(event);
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

        {/* Reminder Preferences */}
        {isInterested && (
          <div className={styles.reminderSection}>
            <label className={styles.reminderToggle}>
              <input
                type="checkbox"
                checked={remindersEnabled}
                onChange={handleToggleReminders}
                className={styles.reminderCheckbox}
              />
              <span className={styles.reminderLabel}>
                🔔 Remind me about this event (1 day before & 1 hour before)
              </span>
            </label>
            {!areNotificationsEnabled() && remindersEnabled && (
              <div className={styles.reminderHint}>
                Please allow notifications in your browser to receive reminders
              </div>
            )}
          </div>
        )}

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
          <button
            className={isInterested ? styles.btnInterested : styles.btnSecondary}
            onClick={handleInterestedToggle}
          >
            {isInterested ? '👍 I\'m Going!' : '👍 Mark Interested'}
          </button>
          <button className={styles.btnSecondary} onClick={handleAddToCalendar}>
            📅 Add to Calendar
          </button>
        </div>

        {/* Share Section */}
        <div className={styles.shareSection}>
          <div className={styles.shareSectionTitle}>Share this event</div>
          <div className={styles.shareButtons}>
            <button className={styles.shareBtn} onClick={handleCopyLink}>
              {showCopiedMessage ? '✓ Copied!' : '🔗 Copy Link'}
            </button>
            <button className={styles.shareBtn} onClick={handleShareEmail}>
              ✉️ Email
            </button>
            {isNativeShareSupported() && (
              <button className={styles.shareBtn} onClick={handleShareNative}>
                📤 Share
              </button>
            )}
          </div>
        </div>

        {/* Report Link */}
        <div className={styles.reportSection}>
          <a href="#" className={styles.reportLink} onClick={(e) => {
            e.preventDefault();
            alert('Report functionality coming soon!');
          }}>
            🚩 Report this event
          </a>
        </div>
      </div>
    </div>
  );
}
