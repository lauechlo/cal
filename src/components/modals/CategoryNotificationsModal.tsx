/**
 * CategoryNotificationsModal - Manage notification preferences by category
 */

'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/lib/mockData';
import styles from './CategoryNotificationsModal.module.css';

interface CategoryNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (enabledCategories: Set<string>) => void;
  initialCategories: Set<string>;
}

const CATEGORIES: Array<{ id: Category; label: string; color: string }> = [
  { id: 'social', label: 'Social Events', color: '#EF4444' },
  { id: 'academic', label: 'Academic', color: '#3B82F6' },
  { id: 'food', label: 'Food & Dining', color: '#F59E0B' },
  { id: 'arts', label: 'Arts & Culture', color: '#A855F7' },
  { id: 'sports', label: 'Sports & Fitness', color: '#10B981' },
  { id: 'career', label: 'Career', color: '#8B5CF6' },
  { id: 'housing', label: 'Housing & Sales', color: '#F43F5E' },
  { id: 'other', label: 'Other', color: '#6B7280' },
];

export function CategoryNotificationsModal({
  isOpen,
  onClose,
  onSave,
  initialCategories,
}: CategoryNotificationsModalProps) {
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(
    new Set(initialCategories)
  );

  // Reset to initial state when modal opens
  useEffect(() => {
    if (isOpen) {
      setEnabledCategories(new Set(initialCategories));
    }
  }, [isOpen, initialCategories]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleToggle = (categoryId: string) => {
    const newEnabled = new Set(enabledCategories);
    if (newEnabled.has(categoryId)) {
      newEnabled.delete(categoryId);
    } else {
      newEnabled.add(categoryId);
    }
    setEnabledCategories(newEnabled);
  };

  const handleSave = () => {
    onSave(enabledCategories);
    onClose();
  };

  return (
    <div className={styles.modal} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>🔔 Category Notifications</h2>
            <p className={styles.modalDescription}>
              Choose which event categories you want to receive notifications for
            </p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.categoryList}>
          {CATEGORIES.map((category) => (
            <CategoryToggle
              key={category.id}
              category={category}
              enabled={enabledCategories.has(category.id)}
              onToggle={() => handleToggle(category.id)}
            />
          ))}
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

interface CategoryToggleProps {
  category: { id: string; label: string; color: string };
  enabled: boolean;
  onToggle: () => void;
}

function CategoryToggle({ category, enabled, onToggle }: CategoryToggleProps) {
  return (
    <div className={styles.categoryToggle} onClick={onToggle}>
      <div className={styles.categoryInfo}>
        <div
          className={styles.categoryDot}
          style={{ backgroundColor: category.color }}
        />
        <span className={styles.categoryLabel}>{category.label}</span>
      </div>
      <button
        className={`${styles.toggleSwitch} ${enabled ? styles.toggleSwitchOn : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        <span className={styles.toggleSlider} />
      </button>
    </div>
  );
}
