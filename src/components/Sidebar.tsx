/**
 * Sidebar - Category filters and quick actions
 */

'use client';

import { useState, useEffect } from 'react';
import { Category, getEventCountByCategory, mockEvents } from '@/lib/mockData';
import { getSavedEventCount } from '@/lib/savedEvents';
import { CategoryNotificationsModal } from './modals/CategoryNotificationsModal';
import { ExportCalendarModal } from './modals/ExportCalendarModal';
import { exportEvents } from '@/lib/icsExport';
import styles from './Sidebar.module.css';

interface SidebarProps {
  enabledCategories: Set<string>;
  onCategoryToggle: (category: string) => void;
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

export function Sidebar({ enabledCategories, onCategoryToggle }: SidebarProps) {
  const [eventCounts, setEventCounts] = useState<Record<Category, number>>(
    getEventCountByCategory()
  );
  const [savedCount, setSavedCount] = useState(0);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [notificationCategories, setNotificationCategories] = useState<Set<string>>(new Set());

  // Load notification preferences from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('categoryNotifications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotificationCategories(new Set(parsed));
      } catch (e) {
        console.error('Failed to parse notification preferences:', e);
      }
    }
  }, []);

  // Update saved count on mount and set up interval to refresh
  useEffect(() => {
    const updateSavedCount = () => {
      setSavedCount(getSavedEventCount());
    };

    updateSavedCount(); // Initial load

    // Refresh every second to pick up changes from modal
    const interval = setInterval(updateSavedCount, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSaveNotifications = (enabledCategories: Set<string>) => {
    setNotificationCategories(enabledCategories);
    // Save to localStorage
    localStorage.setItem('categoryNotifications', JSON.stringify(Array.from(enabledCategories)));
  };

  return (
    <div className={styles.sidebar}>
      {/* Categories section */}
      <div className={styles.section}>
        <h3 className={styles.sectionHeading}>Categories</h3>
        <div className={styles.categoryFilters}>
          {CATEGORIES.map(category => (
            <CategoryFilter
              key={category.id}
              category={category}
              enabled={enabledCategories.has(category.id)}
              count={eventCounts[category.id]}
              onToggle={() => onCategoryToggle(category.id)}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions section */}
      <div className={styles.section}>
        <h3 className={styles.sectionHeading}>Quick Actions</h3>
        <button className={styles.quickActionBtn}>
          ⭐ Saved Events ({savedCount})
        </button>
        <button
          className={styles.quickActionBtn}
          onClick={() => setIsNotificationsModalOpen(true)}
        >
          🔔 Category Notifications ({notificationCategories.size})
        </button>
        <button className={styles.quickActionBtn} onClick={() => setIsExportModalOpen(true)}>
          📤 Export Calendar
        </button>
      </div>

      {/* Modals */}
      <CategoryNotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        onSave={handleSaveNotifications}
        initialCategories={notificationCategories}
      />

      <ExportCalendarModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        enabledCategories={enabledCategories as Set<Category>}
      />
    </div>
  );
}

interface CategoryFilterProps {
  category: { id: string; label: string; color: string };
  enabled: boolean;
  count: number;
  onToggle: () => void;
}

function CategoryFilter({ category, enabled, count, onToggle }: CategoryFilterProps) {
  return (
    <div
      className={`${styles.filterItem} ${!enabled ? styles.inactive : ''}`}
      onClick={onToggle}
    >
      <input
        type="checkbox"
        checked={enabled}
        onChange={onToggle}
        onClick={(e) => e.stopPropagation()}
        className={styles.coloredCheckbox}
        style={{
          background: enabled ? category.color : 'transparent',
          borderColor: category.color,
        }}
      />
      <span className={styles.filterLabel}>{category.label}</span>
      <span className={styles.filterCount} style={{ color: category.color }}>({count})</span>
    </div>
  );
}
