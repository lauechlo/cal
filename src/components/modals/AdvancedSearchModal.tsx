/**
 * AdvancedSearchModal - Modal for advanced event filtering
 */

'use client'

import { useState, useEffect } from 'react'
import { AdvancedFilters, DEFAULT_ADVANCED_FILTERS, DateRangeFilter, TimeOfDayFilter, getActiveFilterCount } from '@/lib/advancedFilters'
import styles from './AdvancedSearchModal.module.css'

interface AdvancedSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: AdvancedFilters) => void
  currentFilters: AdvancedFilters
}

export function AdvancedSearchModal({
  isOpen,
  onClose,
  onApply,
  currentFilters
}: AdvancedSearchModalProps) {
  const [filters, setFilters] = useState<AdvancedFilters>(currentFilters)

  // Update local state when currentFilters changes
  useEffect(() => {
    setFilters(currentFilters)
  }, [currentFilters])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleClear = () => {
    setFilters(DEFAULT_ADVANCED_FILTERS)
    onApply(DEFAULT_ADVANCED_FILTERS)
    onClose()
  }

  const formatDateForInput = (date: Date | null) => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  const handleCustomStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFilters({
      ...filters,
      customStartDate: value ? new Date(value) : null
    })
  }

  const handleCustomEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFilters({
      ...filters,
      customEndDate: value ? new Date(value) : null
    })
  }

  const activeCount = getActiveFilterCount(filters)

  return (
    <div className={styles.modal} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Advanced Search</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          {/* Date Range Filter */}
          <div className={styles.filterSection}>
            <label className={styles.filterLabel}>Date Range</label>
            <div className={styles.dateRangeOptions}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="dateRange"
                  value="all"
                  checked={filters.dateRange === 'all'}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as DateRangeFilter })}
                  className={styles.radio}
                />
                <span>All Dates</span>
              </label>

              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="dateRange"
                  value="today"
                  checked={filters.dateRange === 'today'}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as DateRangeFilter })}
                  className={styles.radio}
                />
                <span>Today</span>
              </label>

              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="dateRange"
                  value="this-week"
                  checked={filters.dateRange === 'this-week'}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as DateRangeFilter })}
                  className={styles.radio}
                />
                <span>This Week</span>
              </label>

              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="dateRange"
                  value="this-month"
                  checked={filters.dateRange === 'this-month'}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as DateRangeFilter })}
                  className={styles.radio}
                />
                <span>This Month</span>
              </label>

              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="dateRange"
                  value="custom"
                  checked={filters.dateRange === 'custom'}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as DateRangeFilter })}
                  className={styles.radio}
                />
                <span>Custom Range</span>
              </label>
            </div>

            {filters.dateRange === 'custom' && (
              <div className={styles.customDateInputs}>
                <div className={styles.dateInput}>
                  <label>From:</label>
                  <input
                    type="date"
                    value={formatDateForInput(filters.customStartDate)}
                    onChange={handleCustomStartDateChange}
                  />
                </div>
                <div className={styles.dateInput}>
                  <label>To:</label>
                  <input
                    type="date"
                    value={formatDateForInput(filters.customEndDate)}
                    onChange={handleCustomEndDateChange}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Location Filter */}
          <div className={styles.filterSection}>
            <label className={styles.filterLabel} htmlFor="location">
              Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="e.g., Frist, McCosh, Friend Center..."
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className={styles.textInput}
            />
            <div className={styles.filterHint}>
              Filter events by location keywords
            </div>
          </div>

          {/* Time of Day Filter */}
          <div className={styles.filterSection}>
            <label className={styles.filterLabel}>Time of Day</label>
            <div className={styles.timeOptions}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="timeOfDay"
                  value="all"
                  checked={filters.timeOfDay === 'all'}
                  onChange={(e) => setFilters({ ...filters, timeOfDay: e.target.value as TimeOfDayFilter })}
                  className={styles.radio}
                />
                <span>Any Time</span>
              </label>

              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="timeOfDay"
                  value="morning"
                  checked={filters.timeOfDay === 'morning'}
                  onChange={(e) => setFilters({ ...filters, timeOfDay: e.target.value as TimeOfDayFilter })}
                  className={styles.radio}
                />
                <span>🌅 Morning (5am-12pm)</span>
              </label>

              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="timeOfDay"
                  value="afternoon"
                  checked={filters.timeOfDay === 'afternoon'}
                  onChange={(e) => setFilters({ ...filters, timeOfDay: e.target.value as TimeOfDayFilter })}
                  className={styles.radio}
                />
                <span>☀️ Afternoon (12pm-5pm)</span>
              </label>

              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="timeOfDay"
                  value="evening"
                  checked={filters.timeOfDay === 'evening'}
                  onChange={(e) => setFilters({ ...filters, timeOfDay: e.target.value as TimeOfDayFilter })}
                  className={styles.radio}
                />
                <span>🌙 Evening (5pm-5am)</span>
              </label>
            </div>
          </div>

          {/* Minimum Interested Filter */}
          <div className={styles.filterSection}>
            <label className={styles.filterLabel} htmlFor="minInterested">
              Minimum People Interested
            </label>
            <div className={styles.sliderContainer}>
              <input
                id="minInterested"
                type="range"
                min="0"
                max="300"
                step="10"
                value={filters.minInterested}
                onChange={(e) => setFilters({ ...filters, minInterested: parseInt(e.target.value) })}
                className={styles.slider}
              />
              <div className={styles.sliderValue}>
                {filters.minInterested === 0 ? 'Any' : `${filters.minInterested}+`} people
              </div>
            </div>
            <div className={styles.filterHint}>
              Show only popular events with many interested attendees
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.btnSecondary} onClick={handleClear}>
            Clear All Filters
          </button>
          <button className={styles.btnPrimary} onClick={handleApply}>
            Apply {activeCount > 0 && `(${activeCount})`}
          </button>
        </div>
      </div>
    </div>
  )
}
