'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Download, LayoutGrid, List, Columns, User } from 'lucide-react'

import { ViewMode, CalendarEvent, FilterOptions } from '@/types'
import { sampleEvents } from '@/lib/sampleData'
import { filterEvents, getEventsForMonth } from '@/lib/utils'

import Button from '@/components/ui/Button'
import MonthView from '@/components/calendar/MonthView'
import WeekView from '@/components/calendar/WeekView'
import DayView from '@/components/calendar/DayView'
import PersonalScheduler from '@/components/calendar/PersonalScheduler'
import FilterPanel from '@/components/FilterPanel'
import EventDetailModal from '@/components/modals/EventDetailModal'
import ExportModal from '@/components/modals/ExportModal'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode | 'personal'>('month')
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showExportModal, setShowExportModal] = useState(false)
  const [savedEventIds, setSavedEventIds] = useState<Set<string>>(new Set())

  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    dateRange: { start: null, end: null },
    search: '',
    location: '',
    onlyFreeFood: false,
    onlySavedEvents: false,
    timeOfDay: 'all',
  })

  // Mark saved events
  const eventsWithSaveStatus = useMemo(
    () => sampleEvents.map(e => ({ ...e, isSaved: savedEventIds.has(e.id) })),
    [savedEventIds]
  )

  // Apply filters
  const filteredEvents = useMemo(
    () => filterEvents(eventsWithSaveStatus, filters),
    [eventsWithSaveStatus, filters]
  )

  // Get events for current view
  const displayEvents = useMemo(() => {
    if (viewMode === 'month') {
      return getEventsForMonth(filteredEvents, currentDate)
    }
    return filteredEvents
  }, [filteredEvents, currentDate, viewMode])

  const handlePrevious = () => {
    if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1))
    else if (viewMode === 'week' || viewMode === 'personal') setCurrentDate(subWeeks(currentDate, 1))
    else setCurrentDate(subDays(currentDate, 1))
  }

  const handleNext = () => {
    if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1))
    else if (viewMode === 'week' || viewMode === 'personal') setCurrentDate(addWeeks(currentDate, 1))
    else setCurrentDate(addDays(currentDate, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleSaveEvent = (eventId: string) => {
    setSavedEventIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(eventId)) {
        newSet.delete(eventId)
      } else {
        newSet.add(eventId)
      }
      return newSet
    })
  }

  const getDateRangeLabel = () => {
    if (viewMode === 'month') return format(currentDate, 'MMMM yyyy')
    if (viewMode === 'week' || viewMode === 'personal') {
      const weekStart = new Date(currentDate)
      weekStart.setDate(currentDate.getDate() - currentDate.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
    }
    return format(currentDate, 'EEEE, MMMM d, yyyy')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-md sticky top-0 z-30"
      >
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">HoagieCalendar</h1>
                <p className="text-xs text-gray-600">Princeton Event Discovery</p>
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            eventCount={displayEvents.length}
          />

          {/* Calendar */}
          <div className="flex-1 space-y-4">
            {/* Calendar Controls */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <div className="flex items-center justify-between">
                {/* Date Navigation */}
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={handleToday}>
                    Today
                  </Button>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePrevious}
                      className="p-2"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleNext}
                      className="p-2"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 min-w-[300px]">
                    {getDateRangeLabel()}
                  </h2>
                </div>

                {/* View Mode Selector */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('month')}
                    className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${
                      viewMode === 'month'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    Month
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('week')}
                    className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${
                      viewMode === 'week'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Columns className="w-4 h-4" />
                    Week
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('day')}
                    className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${
                      viewMode === 'day'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <List className="w-4 h-4" />
                    Day
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('personal')}
                    className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${
                      viewMode === 'personal'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Personal
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Calendar View */}
            <AnimatePresence mode="wait">
              {viewMode === 'month' && (
                <MonthView
                  key="month"
                  currentDate={currentDate}
                  events={displayEvents}
                  onEventClick={setSelectedEvent}
                />
              )}
              {viewMode === 'week' && (
                <WeekView
                  key="week"
                  currentDate={currentDate}
                  events={displayEvents}
                  onEventClick={setSelectedEvent}
                />
              )}
              {viewMode === 'day' && (
                <DayView
                  key="day"
                  currentDate={currentDate}
                  events={displayEvents}
                  onEventClick={setSelectedEvent}
                />
              )}
              {viewMode === 'personal' && (
                <PersonalScheduler
                  key="personal"
                  currentDate={currentDate}
                  events={displayEvents}
                  onEventClick={setSelectedEvent}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onSave={handleSaveEvent}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        events={eventsWithSaveStatus}
        filteredEvents={displayEvents}
      />
    </div>
  )
}
