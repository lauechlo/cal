/**
 * ReportEventModal - Form for reporting inappropriate events
 */

'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Event } from '@/lib/mockData';
import styles from './ReportEventModal.module.css';

interface ReportEventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_REASONS = [
  { value: 'inappropriate', label: 'Inappropriate Content' },
  { value: 'spam', label: 'Spam or Misleading' },
  { value: 'wrong-info', label: 'Incorrect Information' },
  { value: 'duplicate', label: 'Duplicate Event' },
  { value: 'cancelled', label: 'Event Cancelled' },
  { value: 'other', label: 'Other' },
];

export function ReportEventModal({ event, isOpen, onClose }: ReportEventModalProps) {
  const [reason, setReason] = useState('inappropriate');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!event || !isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    setReason('inappropriate');
    setDetails('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // In real app, this would send to backend
    console.log('Report submitted:', {
      eventId: event.id,
      eventTitle: event.title,
      reason,
      details,
      timestamp: new Date().toISOString(),
    });

    toast.success('Report submitted. Thank you for helping keep our community safe!');
    setIsSubmitting(false);
    handleClose();
  };

  return (
    <div className={styles.modal} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>🚩 Report Event</h2>
            <p className={styles.modalDescription}>
              Report "{event.title}" for review
            </p>
          </div>
          <button className={styles.closeButton} onClick={handleClose} type="button">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Reason */}
          <div className={styles.formGroup}>
            <label htmlFor="reason" className={styles.label}>
              Reason for Report *
            </label>
            <select
              id="reason"
              className={styles.select}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              {REPORT_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Details */}
          <div className={styles.formGroup}>
            <label htmlFor="details" className={styles.label}>
              Additional Details (Optional)
            </label>
            <textarea
              id="details"
              className={styles.textarea}
              placeholder="Please provide any additional context that would help us review this event..."
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              maxLength={500}
            />
            <div className={styles.charCount}>
              {details.length} / 500 characters
            </div>
          </div>

          {/* Info Box */}
          <div className={styles.infoBox}>
            <span className={styles.infoIcon}>ℹ️</span>
            <div className={styles.infoText}>
              Your report will be reviewed by our moderation team. False reports may result in restrictions on your account.
            </div>
          </div>

          {/* Form Actions */}
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
