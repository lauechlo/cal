import { Category, categories } from '@/lib/mockData'
import { DateRangePreset } from '@/app/archives/page'
import styles from './ArchiveFilters.module.css'

interface ArchiveFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  enabledCategories: Set<Category>
  onCategoriesChange: (categories: Set<Category>) => void
  dateRangePreset: DateRangePreset
  onDateRangePresetChange: (preset: DateRangePreset) => void
  customStartDate: Date | null
  customEndDate: Date | null
  onCustomStartDateChange: (date: Date | null) => void
  onCustomEndDateChange: (date: Date | null) => void
  showSavedOnly: boolean
  onShowSavedOnlyChange: (show: boolean) => void
}

export default function ArchiveFilters({
  searchQuery,
  onSearchChange,
  enabledCategories,
  onCategoriesChange,
  dateRangePreset,
  onDateRangePresetChange,
  customStartDate,
  customEndDate,
  onCustomStartDateChange,
  onCustomEndDateChange,
  showSavedOnly,
  onShowSavedOnlyChange,
}: ArchiveFiltersProps) {
  const handleCategoryToggle = (category: Category) => {
    const newCategories = new Set(enabledCategories)
    if (newCategories.has(category)) {
      newCategories.delete(category)
    } else {
      newCategories.add(category)
    }
    onCategoriesChange(newCategories)
  }

  const handleSelectAllCategories = () => {
    onCategoriesChange(new Set(categories.map((c: { id: Category; name: string; color: string }) => c.id)))
  }

  const handleDeselectAllCategories = () => {
    onCategoriesChange(new Set())
  }

  const formatDateForInput = (date: Date | null) => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onCustomStartDateChange(value ? new Date(value) : null)
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onCustomEndDateChange(value ? new Date(value) : null)
  }

  return (
    <div className={styles.filters}>
      {/* Search Bar */}
      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Search events by title, description, location, or sender..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Date Range Filter */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Date Range</h3>
        <div className={styles.datePresets}>
          <button
            className={`${styles.presetButton} ${dateRangePreset === 'week' ? styles.active : ''}`}
            onClick={() => onDateRangePresetChange('week')}
          >
            Last Week
          </button>
          <button
            className={`${styles.presetButton} ${dateRangePreset === 'month' ? styles.active : ''}`}
            onClick={() => onDateRangePresetChange('month')}
          >
            Last Month
          </button>
          <button
            className={`${styles.presetButton} ${dateRangePreset === '3months' ? styles.active : ''}`}
            onClick={() => onDateRangePresetChange('3months')}
          >
            Last 3 Months
          </button>
          <button
            className={`${styles.presetButton} ${dateRangePreset === '6months' ? styles.active : ''}`}
            onClick={() => onDateRangePresetChange('6months')}
          >
            Last 6 Months
          </button>
          <button
            className={`${styles.presetButton} ${dateRangePreset === 'year' ? styles.active : ''}`}
            onClick={() => onDateRangePresetChange('year')}
          >
            Last Year
          </button>
          <button
            className={`${styles.presetButton} ${dateRangePreset === 'all' ? styles.active : ''}`}
            onClick={() => onDateRangePresetChange('all')}
          >
            All Time
          </button>
          <button
            className={`${styles.presetButton} ${dateRangePreset === 'custom' ? styles.active : ''}`}
            onClick={() => onDateRangePresetChange('custom')}
          >
            Custom
          </button>
        </div>

        {dateRangePreset === 'custom' && (
          <div className={styles.customDateInputs}>
            <div className={styles.dateInput}>
              <label>Start Date:</label>
              <input
                type="date"
                value={formatDateForInput(customStartDate)}
                onChange={handleStartDateChange}
              />
            </div>
            <div className={styles.dateInput}>
              <label>End Date:</label>
              <input
                type="date"
                value={formatDateForInput(customEndDate)}
                onChange={handleEndDateChange}
              />
            </div>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Categories</h3>
          <div className={styles.categoryActions}>
            <button onClick={handleSelectAllCategories} className={styles.textButton}>
              Select All
            </button>
            <span className={styles.separator}>•</span>
            <button onClick={handleDeselectAllCategories} className={styles.textButton}>
              Deselect All
            </button>
          </div>
        </div>

        <div className={styles.categories}>
          {categories.map((category: { id: Category; name: string; color: string }) => (
            <label key={category.id} className={styles.categoryLabel}>
              <input
                type="checkbox"
                checked={enabledCategories.has(category.id)}
                onChange={() => handleCategoryToggle(category.id)}
                className={styles.checkbox}
                style={{
                  accentColor: category.color
                }}
              />
              <span className={styles.categoryName}>{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Saved Only Filter */}
      <div className={styles.section}>
        <label className={styles.savedOnlyLabel}>
          <input
            type="checkbox"
            checked={showSavedOnly}
            onChange={(e) => onShowSavedOnlyChange(e.target.checked)}
            className={styles.checkbox}
            style={{ accentColor: '#e67e22' }}
          />
          <span>Show saved events only</span>
        </label>
      </div>
    </div>
  )
}
