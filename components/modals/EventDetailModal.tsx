'use client'

import { CalendarEvent } from '@/types'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { getCategoryColor, formatEventTime } from '@/lib/utils'
import { Calendar, Clock, MapPin, Users, ExternalLink, Heart, Share2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface EventDetailModalProps {
  event: CalendarEvent | null
  isOpen: boolean
  onClose: () => void
  onSave?: (eventId: string) => void
}

export default function EventDetailModal({ event, isOpen, onClose, onSave }: EventDetailModalProps) {
  if (!event) return null

  const category = getCategoryColor(event.category)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event.title} size="lg">
      <div className="space-y-6">
        {/* Category badge */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${category.bgColor} ${category.color} border-2 ${category.borderColor}`}>
            {category.label}
          </span>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <h3 className="font-semibold text-lg mb-2">About This Event</h3>
          <p className="text-gray-700 leading-relaxed">{event.description}</p>
        </motion.div>

        {/* Event details */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="font-medium">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <Clock className="w-5 h-5 text-primary" />
            <span>{formatEventTime(event.startTime, event.endTime)}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <MapPin className="w-5 h-5 text-primary" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <Users className="w-5 h-5 text-primary" />
            <span>{event.interestedCount} people interested</span>
          </div>
        </motion.div>

        {/* Tags */}
        {event.tags.length > 0 && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <h3 className="font-semibold text-sm mb-2 text-gray-600">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-300">
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Capacity warning */}
        {event.capacity && event.interestedCount >= event.capacity * 0.8 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-orange-50 border-2 border-orange-300 rounded-lg p-3"
          >
            <p className="text-orange-700 font-medium text-sm">
              ⚠️ This event is filling up fast! Only {event.capacity - event.interestedCount} spots remaining.
            </p>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap gap-3 pt-4 border-t"
        >
          <Button
            variant="primary"
            onClick={() => onSave?.(event.id)}
            className="flex items-center gap-2"
          >
            <Heart className="w-4 h-4" />
            {event.isSaved ? 'Saved' : 'Save Event'}
          </Button>

          {event.registrationLink && (
            <Button
              variant="secondary"
              onClick={() => window.open(event.registrationLink, '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Register
            </Button>
          )}

          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </motion.div>
      </div>
    </Modal>
  )
}
