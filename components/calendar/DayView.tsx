'use client'

import { motion } from 'framer-motion'
import { format, isToday } from 'date-fns'
import { CalendarEvent } from '@/types'
import { getEventsForDate, getTimeSlotPosition } from '@/lib/utils'
import EventCard from './EventCard'

interface DayViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
}

export default function DayView({ currentDate, events, onEventClick }: DayViewProps) {
  const dayEvents = getEventsForDate(events, currentDate)
  const hours = Array.from({ length: 18 }, (_, i) => i + 6) // 6 AM to 12 AM

  return (
    <motion.div
      key={format(currentDate, 'yyyy-MM-dd')}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 bg-white rounded-lg shadow-lg p-4 overflow-auto"
    >
      {/* Day header */}
      <div className={`text-center py-4 mb-4 rounded-lg ${isToday(currentDate) ? 'bg-primary text-white' : 'bg-gray-100'}`}>
        <div className="text-lg font-semibold">{format(currentDate, 'EEEE')}</div>
        <div className="text-3xl font-bold">{format(currentDate, 'MMMM d, yyyy')}</div>
      </div>

      {/* Time slots */}
      <div className="relative">
        {hours.map((hour) => (
          <div key={hour} className="flex border-t border-gray-200">
            <div className="w-20 text-sm text-gray-600 text-right pr-4 py-4">
              {format(new Date().setHours(hour, 0), 'h a')}
            </div>
            <div className="flex-1 min-h-[80px] relative"></div>
          </div>
        ))}

        {/* Events overlay */}
        <div className="absolute top-0 left-20 right-0 bottom-0">
          {dayEvents.map((event, index) => {
            const { top, height } = getTimeSlotPosition(event.startTime, event.endTime)
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="absolute left-0 right-0 px-2"
                style={{ top: `${top}px`, height: `${Math.max(height, 60)}px` }}
              >
                <EventCard
                  event={event}
                  onClick={() => onEventClick(event)}
                  layout="default"
                  index={index}
                />
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
