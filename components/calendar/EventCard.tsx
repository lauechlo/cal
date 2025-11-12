'use client'

import { motion } from 'framer-motion'
import { CalendarEvent } from '@/types'
import { getCategoryColor, formatEventTime } from '@/lib/utils'
import { MapPin, Clock, Users } from 'lucide-react'

interface EventCardProps {
  event: CalendarEvent
  onClick: () => void
  layout?: 'default' | 'compact'
  index?: number
}

export default function EventCard({ event, onClick, layout = 'default', index = 0 }: EventCardProps) {
  const category = getCategoryColor(event.category)

  if (layout === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.03 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`${category.bgColor} ${category.borderColor} border-l-4 rounded-md p-2 mb-1 cursor-pointer hover:shadow-md transition-shadow`}
        onClick={onClick}
      >
        <div className={`text-xs font-semibold ${category.color} truncate`}>
          {event.title}
        </div>
        <div className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
          <Clock className="w-3 h-3" />
          {event.startTime.slice(0, 5)}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`${category.bgColor} ${category.borderColor} border-2 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className={`font-bold text-lg ${category.color}`}>{event.title}</h3>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${category.bgColor} ${category.color} border ${category.borderColor}`}>
          {category.label}
        </span>
      </div>

      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{event.description}</p>

      <div className="space-y-1 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{formatEventTime(event.startTime, event.endTime)}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
        {event.interestedCount > 0 && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{event.interestedCount} interested</span>
          </div>
        )}
      </div>

      {event.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {event.tags.map((tag, i) => (
            <span key={i} className="text-xs bg-white px-2 py-0.5 rounded-full border border-gray-300">
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}
