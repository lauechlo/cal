'use client'

import { motion } from 'framer-motion'
import { format, startOfWeek, addDays, isToday } from 'date-fns'
import { CalendarEvent } from '@/types'
import { getEventsForDate, getTimeSlotPosition, cn } from '@/lib/utils'
import EventCard from './EventCard'

interface WeekViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
}

export default function WeekView({ currentDate, events, onEventClick }: WeekViewProps) {
  const weekStart = startOfWeek(currentDate)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const hours = Array.from({ length: 14 }, (_, i) => i + 6) // 6 AM to 8 PM

  return (
    <motion.div
      key={format(currentDate, 'yyyy-ww')}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 bg-white rounded-lg shadow-lg p-4 overflow-auto"
    >
      <div className="min-w-[900px]">
        {/* Day headers */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-2 mb-2 sticky top-0 bg-white z-10">
          <div></div>
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className={cn(
                'text-center py-2 rounded-lg',
                isToday(day) && 'bg-primary text-white font-bold'
              )}
            >
              <div className="text-sm font-semibold">{format(day, 'EEE')}</div>
              <div className={cn('text-lg', isToday(day) ? 'text-white' : 'text-gray-700')}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-2">
          {hours.map((hour) => (
            <div key={hour} className="contents">
              {/* Time label */}
              <div className="text-sm text-gray-600 text-right pr-2 py-4">
                {format(new Date().setHours(hour, 0), 'h a')}
              </div>

              {/* Day columns */}
              {weekDays.map((day) => {
                const dayEvents = getEventsForDate(events, day)
                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className="border-t border-gray-200 min-h-[60px] relative"
                  >
                    {hour === 6 && dayEvents.map((event, index) => {
                      const { top, height } = getTimeSlotPosition(event.startTime, event.endTime)
                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="absolute left-0 right-0 px-1 z-10"
                          style={{ top: `${top}px`, height: `${Math.max(height, 40)}px` }}
                        >
                          <EventCard
                            event={event}
                            onClick={() => onEventClick(event)}
                            layout="compact"
                            index={index}
                          />
                        </motion.div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
