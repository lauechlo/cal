'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { format, isSameMonth, isToday } from 'date-fns'
import { CalendarEvent } from '@/types'
import { getCalendarDays, getEventsForDate, cn } from '@/lib/utils'
import EventCard from './EventCard'

interface MonthViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
}

export default function MonthView({ currentDate, events, onEventClick }: MonthViewProps) {
  const calendarDays = getCalendarDays(currentDate)

  return (
    <motion.div
      key={format(currentDate, 'yyyy-MM')}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 bg-white rounded-lg shadow-lg p-4"
    >
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-semibold text-gray-700 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        <AnimatePresence mode="popLayout">
          {calendarDays.map((day, index) => {
            const dayEvents = getEventsForDate(events, day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isTodayDate = isToday(day)

            return (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.01 }}
                className={cn(
                  'min-h-[120px] border-2 rounded-lg p-2 transition-all',
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                  isTodayDate && 'border-primary bg-primary/5',
                  !isTodayDate && 'border-gray-200'
                )}
              >
                <div
                  className={cn(
                    'text-sm font-semibold mb-1',
                    isTodayDate && 'text-primary',
                    !isTodayDate && isCurrentMonth && 'text-gray-900',
                    !isCurrentMonth && 'text-gray-400'
                  )}
                >
                  {format(day, 'd')}
                </div>
                <div className="space-y-1 overflow-y-auto max-h-[90px]">
                  {dayEvents.map((event, eventIndex) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={() => onEventClick(event)}
                      layout="compact"
                      index={eventIndex}
                    />
                  ))}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
