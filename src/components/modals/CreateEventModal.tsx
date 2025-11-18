/**
 * CreateEventModal - Form for creating new events
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Category } from '@/lib/mockData';
import styles from './CreateEventModal.module.css';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: () => void;
}

// Validation schema
const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description too long'),
  category: z.enum(['social', 'academic', 'food', 'arts', 'sports', 'career', 'housing', 'other']),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().optional(),
  location: z.string().min(3, 'Location must be at least 3 characters').max(100, 'Location too long'),
  senderName: z.string().min(2, 'Sender name must be at least 2 characters').max(50, 'Name too long'),
  senderEmail: z.string().email('Invalid email address'),
  emailContent: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

const CATEGORIES: Array<{ id: Category; label: string }> = [
  { id: 'social', label: 'Social Events' },
  { id: 'academic', label: 'Academic' },
  { id: 'food', label: 'Food & Dining' },
  { id: 'arts', label: 'Arts & Culture' },
  { id: 'sports', label: 'Sports & Fitness' },
  { id: 'career', label: 'Career' },
  { id: 'housing', label: 'Housing & Sales' },
  { id: 'other', label: 'Other' },
];

export function CreateEventModal({ isOpen, onClose, onEventCreated }: CreateEventModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      category: 'social',
    },
  });

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: EventFormData) => {
    try {
      // Add to mock data (in real app, this would be an API call)
      const { mockEvents } = await import('@/lib/mockData');

      const newEvent = {
        id: String(mockEvents.length + 1),
        title: data.title,
        description: data.description,
        category: data.category,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime || undefined,
        location: data.location,
        senderName: data.senderName,
        senderEmail: data.senderEmail,
        emailContent: data.emailContent || undefined,
        interestedCount: 0,
      };

      mockEvents.push(newEvent);

      toast.success('✨ Event created successfully!');
      reset();
      onEventCreated();
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event. Please try again.');
    }
  };

  return (
    <div className={styles.modal} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>✨ Create New Event</h2>
            <p className={styles.modalDescription}>
              Fill out the details to add a new event to the calendar
            </p>
          </div>
          <button className={styles.closeButton} onClick={handleClose} type="button">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* Event Title */}
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Event Title *
            </label>
            <input
              id="title"
              type="text"
              className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
              placeholder="e.g., Free Pizza Night"
              {...register('title')}
            />
            {errors.title && (
              <span className={styles.error}>{errors.title.message}</span>
            )}
          </div>

          {/* Category */}
          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>
              Category *
            </label>
            <select
              id="category"
              className={`${styles.select} ${errors.category ? styles.inputError : ''}`}
              {...register('category')}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className={styles.error}>{errors.category.message}</span>
            )}
          </div>

          {/* Date and Time Row */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="date" className={styles.label}>
                Date *
              </label>
              <input
                id="date"
                type="date"
                className={`${styles.input} ${errors.date ? styles.inputError : ''}`}
                {...register('date')}
              />
              {errors.date && (
                <span className={styles.error}>{errors.date.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="startTime" className={styles.label}>
                Start Time *
              </label>
              <input
                id="startTime"
                type="time"
                className={`${styles.input} ${errors.startTime ? styles.inputError : ''}`}
                {...register('startTime')}
              />
              {errors.startTime && (
                <span className={styles.error}>{errors.startTime.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="endTime" className={styles.label}>
                End Time
              </label>
              <input
                id="endTime"
                type="time"
                className={`${styles.input} ${errors.endTime ? styles.inputError : ''}`}
                {...register('endTime')}
              />
              {errors.endTime && (
                <span className={styles.error}>{errors.endTime.message}</span>
              )}
            </div>
          </div>

          {/* Location */}
          <div className={styles.formGroup}>
            <label htmlFor="location" className={styles.label}>
              Location *
            </label>
            <input
              id="location"
              type="text"
              className={`${styles.input} ${errors.location ? styles.inputError : ''}`}
              placeholder="e.g., Frist Campus Center"
              {...register('location')}
            />
            {errors.location && (
              <span className={styles.error}>{errors.location.message}</span>
            )}
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description *
            </label>
            <textarea
              id="description"
              className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
              placeholder="Describe your event..."
              rows={3}
              {...register('description')}
            />
            {errors.description && (
              <span className={styles.error}>{errors.description.message}</span>
            )}
          </div>

          {/* Organizer Info */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="senderName" className={styles.label}>
                Organizer Name *
              </label>
              <input
                id="senderName"
                type="text"
                className={`${styles.input} ${errors.senderName ? styles.inputError : ''}`}
                placeholder="e.g., Student Activities"
                {...register('senderName')}
              />
              {errors.senderName && (
                <span className={styles.error}>{errors.senderName.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="senderEmail" className={styles.label}>
                Organizer Email *
              </label>
              <input
                id="senderEmail"
                type="email"
                className={`${styles.input} ${errors.senderEmail ? styles.inputError : ''}`}
                placeholder="e.g., events@princeton.edu"
                {...register('senderEmail')}
              />
              {errors.senderEmail && (
                <span className={styles.error}>{errors.senderEmail.message}</span>
              )}
            </div>
          </div>

          {/* Email Content (Optional) */}
          <div className={styles.formGroup}>
            <label htmlFor="emailContent" className={styles.label}>
              Additional Details (Optional)
            </label>
            <textarea
              id="emailContent"
              className={styles.textarea}
              placeholder="Any additional information or email content..."
              rows={2}
              {...register('emailContent')}
            />
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
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
