'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { CalendarEvent } from '@/types'
import { generateICS } from '@/lib/utils'
import { Download, Calendar, Check, Copy } from 'lucide-react'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  events: CalendarEvent[]
  filteredEvents: CalendarEvent[]
}

export default function ExportModal({ isOpen, onClose, events, filteredEvents }: ExportModalProps) {
  const [exportOption, setExportOption] = useState<'all' | 'filtered' | 'selected'>('filtered')
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)

  const eventsToExport =
    exportOption === 'all'
      ? events
      : exportOption === 'filtered'
      ? filteredEvents
      : events.filter(e => selectedEvents.has(e.id))

  const toggleEventSelection = (eventId: string) => {
    const newSelection = new Set(selectedEvents)
    if (newSelection.has(eventId)) {
      newSelection.delete(eventId)
    } else {
      newSelection.add(eventId)
    }
    setSelectedEvents(newSelection)
  }

  const downloadICS = () => {
    const icsContent = generateICS(eventsToExport)
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'hoagiecalendar-events.ics'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const copyWebcalURL = () => {
    // In a real app, this would be a server-generated subscription URL
    const webcalURL = `webcal://hoagiecalendar.com/subscribe/${Math.random().toString(36).substr(2, 9)}`
    navigator.clipboard.writeText(webcalURL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openGoogleCalendar = () => {
    // For simplicity, we'll download the ICS file which can be imported to Google Calendar
    // In production, you'd use the Google Calendar API
    downloadICS()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Events" size="lg">
      <div className="space-y-6">
        {/* Export Options */}
        <div>
          <h3 className="font-semibold text-lg mb-3">What would you like to export?</h3>
          <div className="space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setExportOption('all')}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                exportOption === 'all'
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">All Events</div>
                  <div className="text-sm text-gray-600">{events.length} events</div>
                </div>
                {exportOption === 'all' && <Check className="w-5 h-5 text-primary" />}
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setExportOption('filtered')}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                exportOption === 'filtered'
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Current Filtered Events</div>
                  <div className="text-sm text-gray-600">{filteredEvents.length} events matching your filters</div>
                </div>
                {exportOption === 'filtered' && <Check className="w-5 h-5 text-primary" />}
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setExportOption('selected')}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                exportOption === 'selected'
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Select Specific Events</div>
                  <div className="text-sm text-gray-600">
                    {selectedEvents.size > 0 ? `${selectedEvents.size} selected` : 'Choose events to export'}
                  </div>
                </div>
                {exportOption === 'selected' && <Check className="w-5 h-5 text-primary" />}
              </div>
            </motion.button>
          </div>
        </div>

        {/* Event Selection */}
        {exportOption === 'selected' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2 max-h-64 overflow-y-auto border-2 border-gray-300 rounded-lg p-3"
          >
            {events.map((event) => (
              <Checkbox
                key={event.id}
                checked={selectedEvents.has(event.id)}
                onChange={() => toggleEventSelection(event.id)}
                label={`${event.title} - ${new Date(event.date).toLocaleDateString()}`}
              />
            ))}
          </motion.div>
        )}

        {/* Export Methods */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Choose Export Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                onClick={downloadICS}
                disabled={eventsToExport.length === 0}
                className="w-full h-24 flex-col gap-2"
              >
                <Download className="w-6 h-6" />
                <div>
                  <div className="font-semibold">Download .ICS</div>
                  <div className="text-xs text-gray-600">Import to any calendar app</div>
                </div>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                onClick={openGoogleCalendar}
                disabled={eventsToExport.length === 0}
                className="w-full h-24 flex-col gap-2"
              >
                <Calendar className="w-6 h-6" />
                <div>
                  <div className="font-semibold">Google Calendar</div>
                  <div className="text-xs text-gray-600">Add to Google Calendar</div>
                </div>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                onClick={downloadICS}
                disabled={eventsToExport.length === 0}
                className="w-full h-24 flex-col gap-2"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                </svg>
                <div>
                  <div className="font-semibold">Apple Calendar</div>
                  <div className="text-xs text-gray-600">Open in Calendar app</div>
                </div>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                onClick={downloadICS}
                disabled={eventsToExport.length === 0}
                className="w-full h-24 flex-col gap-2"
              >
                <Calendar className="w-6 h-6" />
                <div>
                  <div className="font-semibold">Outlook</div>
                  <div className="text-xs text-gray-600">Import to Outlook</div>
                </div>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Calendar Subscription */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4"
        >
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Calendar Subscription (Auto-Update)
          </h4>
          <p className="text-sm text-gray-700 mb-3">
            Subscribe to a live feed that automatically updates when new events are added!
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={copyWebcalURL}
            className="flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Subscription URL'}
          </Button>
        </motion.div>

        {/* Summary */}
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600">
            Ready to export <span className="font-semibold text-gray-900">{eventsToExport.length} event{eventsToExport.length !== 1 ? 's' : ''}</span>
          </p>
        </div>
      </div>
    </Modal>
  )
}
