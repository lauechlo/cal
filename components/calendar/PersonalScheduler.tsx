'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DndContext, DragEndEvent, DragOverlay, useDraggable, useDroppable, DragStartEvent } from '@dnd-kit/core'
import { format, addDays, startOfWeek, parseISO, setHours, setMinutes, differenceInMinutes } from 'date-fns'
import { CalendarEvent } from '@/types'
import { getCategoryColor, formatEventTime, cn } from '@/lib/utils'
import { Clock, AlertCircle, GripVertical } from 'lucide-react'
import Button from '@/components/ui/Button'

interface PersonalScheduleEvent extends CalendarEvent {
  customStartTime?: string
  customEndTime?: string
  customDate?: string
}

interface PersonalSchedulerProps {
  currentDate: Date
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
}

function DraggableEvent({ event, onClick }: { event: PersonalScheduleEvent; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
  })

  const category = getCategoryColor(event.category)

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'mb-2 cursor-move',
        isDragging && 'opacity-50'
      )}
      {...attributes}
      {...listeners}
    >
      <div
        className={`${category.bgColor} ${category.borderColor} border-l-4 rounded-md p-3 hover:shadow-lg transition-shadow`}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
      >
        <div className="flex items-start gap-2">
          <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className={`text-sm font-semibold ${category.color} truncate`}>
              {event.title}
            </div>
            <div className="text-xs text-gray-600 flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              {formatEventTime(
                event.customStartTime || event.startTime,
                event.customEndTime || event.endTime
              )}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{event.location}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TimeSlot({ day, hour, events, onEventClick }: {
  day: Date
  hour: number
  events: PersonalScheduleEvent[]
  onEventClick: (event: CalendarEvent) => void
}) {
  const slotId = `${format(day, 'yyyy-MM-dd')}-${hour}`
  const { setNodeRef, isOver } = useDroppable({
    id: slotId,
  })

  // Filter events for this specific hour slot
  const slotEvents = events.filter(event => {
    const eventDate = event.customDate || event.date
    const eventStartHour = parseInt((event.customStartTime || event.startTime).split(':')[0])
    return format(day, 'yyyy-MM-dd') === eventDate && eventStartHour === hour
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'border-t border-gray-200 min-h-[80px] p-2 transition-colors',
        isOver && 'bg-primary/10 border-primary'
      )}
    >
      {slotEvents.map(event => (
        <DraggableEvent key={event.id} event={event} onClick={() => onEventClick(event)} />
      ))}
    </div>
  )
}

export default function PersonalScheduler({ currentDate, events, onEventClick }: PersonalSchedulerProps) {
  const [personalEvents, setPersonalEvents] = useState<PersonalScheduleEvent[]>(
    events.map(e => ({ ...e }))
  )
  const [activeEvent, setActiveEvent] = useState<PersonalScheduleEvent | null>(null)

  const weekStart = startOfWeek(currentDate)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const hours = Array.from({ length: 16 }, (_, i) => i + 6) // 6 AM to 10 PM

  const handleDragStart = (event: DragStartEvent) => {
    const draggedEvent = personalEvents.find(e => e.id === event.active.id)
    setActiveEvent(draggedEvent || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveEvent(null)

    const { active, over } = event
    if (!over) return

    const eventId = active.id as string
    const [newDate, newHourStr] = (over.id as string).split('-')
    const newHour = parseInt(newHourStr)

    setPersonalEvents(prev =>
      prev.map(e => {
        if (e.id !== eventId) return e

        // Calculate duration to maintain it when moving
        const oldStart = e.customStartTime || e.startTime
        const oldEnd = e.customEndTime || e.endTime
        const [startHour, startMin] = oldStart.split(':').map(Number)
        const [endHour, endMin] = oldEnd.split(':').map(Number)
        const duration = differenceInMinutes(
          setHours(setMinutes(new Date(), endMin), endHour),
          setHours(setMinutes(new Date(), startMin), startHour)
        )

        const newStartTime = `${newHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`
        const newEndDate = setMinutes(setHours(new Date(), newHour), startMin + duration)
        const newEndTime = format(newEndDate, 'HH:mm')

        return {
          ...e,
          customDate: newDate,
          customStartTime: newStartTime,
          customEndTime: newEndTime,
        }
      })
    )
  }

  // Check for overlapping events
  const getConflicts = (): string[] => {
    const conflicts: string[] = []
    personalEvents.forEach((event1, i) => {
      personalEvents.slice(i + 1).forEach(event2 => {
        const date1 = event1.customDate || event1.date
        const date2 = event2.customDate || event2.date
        if (date1 !== date2) return

        const start1 = event1.customStartTime || event1.startTime
        const end1 = event1.customEndTime || event1.endTime
        const start2 = event2.customStartTime || event2.startTime
        const end2 = event2.customEndTime || event2.endTime

        if ((start1 < end2 && end1 > start2) || (start2 < end1 && end2 > start1)) {
          if (!conflicts.includes(event1.id)) conflicts.push(event1.id)
          if (!conflicts.includes(event2.id)) conflicts.push(event2.id)
        }
      })
    })
    return conflicts
  }

  const conflicts = getConflicts()

  const resetSchedule = () => {
    setPersonalEvents(events.map(e => ({ ...e })))
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 bg-white rounded-lg shadow-lg p-4 overflow-auto"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Personal Scheduler</h2>
          <p className="text-sm text-gray-600">Drag events to reschedule them to your preferred times</p>
        </div>
        <Button variant="outline" size="sm" onClick={resetSchedule}>
          Reset to Original Times
        </Button>
      </div>

      {/* Conflict Warning */}
      <AnimatePresence>
        {conflicts.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-4 bg-orange-50 border-2 border-orange-300 rounded-lg p-3 flex items-center gap-2 overflow-hidden"
          >
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
            <p className="text-sm text-orange-700 font-medium">
              You have {conflicts.length} event{conflicts.length !== 1 ? 's' : ''} with time conflicts!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="min-w-[900px]">
          {/* Day headers */}
          <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-2 mb-2 sticky top-0 bg-white z-10">
            <div></div>
            {weekDays.map(day => (
              <div key={day.toISOString()} className="text-center py-2 rounded-lg bg-gray-100">
                <div className="text-sm font-semibold">{format(day, 'EEE')}</div>
                <div className="text-lg text-gray-700">{format(day, 'd')}</div>
              </div>
            ))}
          </div>

          {/* Time grid */}
          <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-2">
            {hours.map(hour => (
              <div key={hour} className="contents">
                {/* Time label */}
                <div className="text-sm text-gray-600 text-right pr-2 py-4">
                  {format(new Date().setHours(hour, 0), 'h a')}
                </div>

                {/* Day columns */}
                {weekDays.map(day => (
                  <TimeSlot
                    key={`${day.toISOString()}-${hour}`}
                    day={day}
                    hour={hour}
                    events={personalEvents}
                    onEventClick={onEventClick}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeEvent && (
            <div className="opacity-90">
              <DraggableEvent event={activeEvent} onClick={() => {}} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </motion.div>
  )
}
