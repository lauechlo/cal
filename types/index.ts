export type EventCategory =
  | 'social'
  | 'academic'
  | 'food'
  | 'arts'
  | 'sports'
  | 'career'
  | 'housing'
  | 'other'

export interface CalendarEvent {
  id: string
  title: string
  description: string
  category: EventCategory
  date: string // ISO format
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  location: string
  registrationLink?: string
  capacity?: number
  interestedCount: number
  tags: string[]
  isSaved?: boolean
}

export type ViewMode = 'month' | 'week' | 'day'

export interface FilterOptions {
  categories: EventCategory[]
  dateRange: {
    start: Date | null
    end: Date | null
  }
  search: string
  location: string
  onlyFreeFood: boolean
  onlySavedEvents: boolean
  timeOfDay: 'all' | 'morning' | 'afternoon' | 'evening'
}

export interface CategoryInfo {
  id: EventCategory
  label: string
  color: string
  bgColor: string
  borderColor: string
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'social', label: 'Social Events', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-300' },
  { id: 'academic', label: 'Academic', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-300' },
  { id: 'food', label: 'Food & Dining', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-300' },
  { id: 'arts', label: 'Arts & Culture', color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-300' },
  { id: 'sports', label: 'Sports & Fitness', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-300' },
  { id: 'career', label: 'Career', color: 'text-violet-600', bgColor: 'bg-violet-50', borderColor: 'border-violet-300' },
  { id: 'housing', label: 'Housing & Sales', color: 'text-pink-600', bgColor: 'bg-pink-50', borderColor: 'border-pink-300' },
  { id: 'other', label: 'Other', color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-300' },
]
