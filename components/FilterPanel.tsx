'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { EventCategory, FilterOptions, CATEGORIES } from '@/types'
import Checkbox from '@/components/ui/Checkbox'
import Button from '@/components/ui/Button'
import { Search, X, Calendar, MapPin, Coffee, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface FilterPanelProps {
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
  eventCount: number
}

export default function FilterPanel({ filters, onFilterChange, eventCount }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showDateRange, setShowDateRange] = useState(false)

  const toggleCategory = (category: EventCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    onFilterChange({ ...filters, categories: newCategories })
  }

  const clearFilters = () => {
    onFilterChange({
      categories: [],
      dateRange: { start: null, end: null },
      search: '',
      location: '',
      onlyFreeFood: false,
      onlySavedEvents: false,
      timeOfDay: 'all',
    })
  }

  const activeFilterCount =
    filters.categories.length +
    (filters.search ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.onlyFreeFood ? 1 : 0) +
    (filters.onlySavedEvents ? 1 : 0) +
    (filters.timeOfDay !== 'all' ? 1 : 0) +
    (filters.dateRange.start || filters.dateRange.end ? 1 : 0)

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-80 bg-white rounded-lg shadow-lg p-4 h-fit sticky top-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          <p className="text-sm text-gray-600">{eventCount} events found</p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Active filters indicator */}
      {activeFilterCount > 0 && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-4 flex items-center justify-between bg-primary/10 border-2 border-primary/30 rounded-lg p-2"
        >
          <span className="text-sm font-medium text-primary">
            {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
          </span>
          <button
            onClick={clearFilters}
            className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear All
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 overflow-hidden"
          >
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                  placeholder="Search events..."
                  className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Categories</label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {CATEGORIES.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Checkbox
                      checked={filters.categories.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      label={category.label}
                      colorClass={category.borderColor}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Time of Day */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Time of Day</label>
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'morning', label: 'Morning' },
                  { value: 'afternoon', label: 'Afternoon' },
                  { value: 'evening', label: 'Evening' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onFilterChange({ ...filters, timeOfDay: option.value as any })}
                    className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg border-2 transition-all ${
                      filters.timeOfDay === option.value
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
                  placeholder="Filter by location..."
                  className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Quick Filters</label>
              <div className="space-y-2">
                <Checkbox
                  checked={filters.onlyFreeFood}
                  onChange={(e) => onFilterChange({ ...filters, onlyFreeFood: e.target.checked })}
                  label="🍕 Free Food Only"
                />
                <Checkbox
                  checked={filters.onlySavedEvents}
                  onChange={(e) => onFilterChange({ ...filters, onlySavedEvents: e.target.checked })}
                  label="❤️ Saved Events Only"
                />
              </div>
            </div>

            {/* Date Range */}
            <div>
              <button
                onClick={() => setShowDateRange(!showDateRange)}
                className="w-full flex items-center justify-between text-sm font-semibold mb-2 text-gray-700 hover:text-gray-900"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date Range
                </span>
                {showDateRange ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <AnimatePresence>
                {showDateRange && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <input
                      type="date"
                      value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
                      onChange={(e) => onFilterChange({
                        ...filters,
                        dateRange: { ...filters.dateRange, start: e.target.value ? new Date(e.target.value) : null }
                      })}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    />
                    <input
                      type="date"
                      value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
                      onChange={(e) => onFilterChange({
                        ...filters,
                        dateRange: { ...filters.dateRange, end: e.target.value ? new Date(e.target.value) : null }
                      })}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
