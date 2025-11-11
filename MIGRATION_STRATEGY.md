# 🚀 HoagieCalendar Migration Strategy
## Efficient Path from Prototype to Production (Aligned with HoagieMail)

**Created:** November 11, 2025
**Goal:** Build HoagieCalendar using the same tech structure as HoagieMail

---

## 🎯 Key Principle: Reuse, Don't Rebuild

**Philosophy:** Maximize code reuse from HoagieMail's `hoagie-ui` library to maintain consistency and reduce development time.

---

## 📊 Component Mapping: Prototype → Production

### Reusable Components from `hoagie-ui` Library

| HoagieCalendar Feature | Use hoagie-ui Component | Custom Component Needed? |
|------------------------|-------------------------|--------------------------|
| **Header/Navigation** | ✅ `<Nav>` | Extend with calendar-specific buttons |
| **Page Layout** | ✅ `<Layout>` | Use as-is |
| **Footer** | ✅ `<Footer>` | Use as-is |
| **Profile Dropdown** | ✅ `<ProfileCard>` | Extend menu items |
| **Authentication** | ✅ `<AuthButton>` | Use as-is |
| **Theme System** | ✅ `<Theme>` + `theme.css` | Use as-is |
| **Calendar Grid** | ❌ None | Build custom `<CalendarGrid>` |
| **Event Cards** | ❌ None | Build custom `<EventCard>` |
| **Modals** | ❌ None | Build custom modal system |
| **Sidebar Filters** | ❌ None | Build custom `<Sidebar>` |

### Component Reuse Score: **40% Reusable** (Layout/Nav/Auth), **60% Custom** (Calendar UI)

---

## 🛠️ Updated Tech Stack (Matching HoagieMail)

### ⚠️ Important Changes to Your Checklist

| Your Checklist Says | HoagieMail Actually Uses | Change Required |
|---------------------|--------------------------|-----------------|
| Tailwind CSS | ❌ Plain CSS + CSS Modules | **Remove Tailwind** |
| NextAuth.js | ❌ JWT + Hoagie/CAS | **Use Hoagie Auth** |
| npm | ❌ Yarn | **Use Yarn** |
| System fonts | ❌ Poppins + Inter | **Add Google Fonts** |

### Correct Tech Stack

```json
{
  "framework": "Next.js 14+ (App Router)",
  "language": "TypeScript",
  "styling": "Plain CSS + CSS Modules",
  "fonts": "Poppins (headings) + Inter (body)",
  "ui-library": "hoagie-ui (from HoagieMail)",
  "auth": "JWT + Hoagie/CAS system",
  "database": "PostgreSQL 15+",
  "orm": "Prisma",
  "email": "SendGrid or AWS SES",
  "package-manager": "Yarn",
  "linting": "ESLint + Prettier"
}
```

---

## 📦 Phase 1: Project Setup (Day 1)

### Step 1.1: Initialize Next.js Project

```bash
# Create Next.js app WITHOUT Tailwind
npx create-next-app@latest hoagiecalendar \
  --typescript \
  --app \
  --no-tailwind \
  --eslint \
  --src-dir

cd hoagiecalendar

# Switch to Yarn (matching HoagieMail)
rm package-lock.json
yarn install
```

### Step 1.2: Clone HoagieMail to Extract Components

```bash
# Clone in parallel directory
cd ..
git clone https://github.com/lauechlo/mail.git hoagiemail
cd hoagiemail
yarn install

# Study the structure
ls -la lib/hoagie-ui/
cat lib/hoagie-ui/theme.css
```

### Step 1.3: Copy `hoagie-ui` Library

```bash
cd ../hoagiecalendar

# Copy entire hoagie-ui library
cp -r ../hoagiemail/lib/hoagie-ui ./lib/

# Copy ESLint and Prettier configs
cp ../hoagiemail/.eslintrc.* .
cp ../hoagiemail/.prettierrc .

# Verify
ls -la lib/hoagie-ui/
```

**Files you should now have:**
```
hoagiecalendar/
├── lib/
│   └── hoagie-ui/
│       ├── components/
│       │   ├── AuthButton.tsx
│       │   ├── Footer.tsx
│       │   ├── Layout.tsx
│       │   ├── Nav.tsx
│       │   ├── ProfileCard.tsx
│       │   └── Theme.tsx
│       ├── theme.css
│       └── index.ts
├── .eslintrc.*
├── .prettierrc
└── package.json
```

### Step 1.4: Install Dependencies

```bash
# Core dependencies
yarn add prisma @prisma/client
yarn add react-hook-form zod @hookform/resolvers
yarn add date-fns
yarn add ics  # For .ics calendar export

# Dev dependencies
yarn add -D @types/node
yarn add -D prisma
```

**NO Tailwind, NO NextAuth** - we'll use Hoagie's systems instead!

### Step 1.5: Set Up Fonts (Poppins + Inter)

Create `app/layout.tsx`:

```tsx
import { Inter, Poppins } from 'next/font/google'
import '@/lib/hoagie-ui/theme.css'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

### Step 1.6: Create CSS Structure

```bash
mkdir -p styles/components

touch styles/globals.css
touch styles/variables.css
touch styles/calendar.css
touch styles/components/modal.css
touch styles/components/event-card.css
touch styles/components/sidebar.css
```

**`styles/variables.css`** (extract from HoagieMail):
```css
:root {
  /* Typography - using CSS variables from theme.css */
  --font-heading: var(--font-poppins), 'Poppins', sans-serif;
  --font-body: var(--font-inter), 'Inter', sans-serif;

  /* Colors - will match HoagieMail color scheme */
  --color-primary: #14B8A6;
  --color-primary-dark: #0F766E;
  --color-background: #FAFAFA;
  --color-surface: #FFFFFF;
  --color-border: #E5E7EB;
  --color-text: #0F172A;
  --color-text-secondary: #6B7280;

  /* Category colors (you defined these well) */
  --color-social: #EF4444;
  --color-academic: #3B82F6;
  --color-food: #F59E0B;
  --color-arts: #A855F7;
  --color-sports: #10B981;
  --color-career: #8B5CF6;
  --color-housing: #F43F5E;
  --color-other: #6B7280;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

**`styles/globals.css`**:
```css
@import './variables.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-body);
  background: var(--color-background);
  color: var(--color-text);
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 600;
}

button {
  font-family: inherit;
  cursor: pointer;
}

/* You can extract more from your prototype's <style> block */
```

---

## 🧩 Phase 2: Integrate hoagie-ui Components (Day 2)

### Component Integration Priority

1. ✅ **Layout** (highest reuse)
2. ✅ **Nav** (critical for branding)
3. ✅ **AuthButton** (critical for auth)
4. ✅ **ProfileCard** (user menu)
5. ✅ **Footer** (nice to have)

### Step 2.1: Create Main Calendar Page with hoagie-ui

**`app/calendar/page.tsx`**:
```tsx
import { Layout, Nav } from '@/lib/hoagie-ui'
import { ProfileButton } from '@/components/ProfileButton'
import { CalendarView } from '@/components/calendar/CalendarView'
import { Sidebar } from '@/components/Sidebar'

export default function CalendarPage() {
  return (
    <Layout>
      <Nav
        appName="calendar"
        logo={
          <div className="logo">
            <span className="logo-icon">📅</span>
            <span className="logo-text">
              hoagie<span className="logo-accent">calendar</span>
            </span>
          </div>
        }
        actions={
          <>
            <button className="nav-button">Contact</button>
            <button className="nav-button">Archives</button>
            <button className="nav-button-primary">+ Add Event</button>
            <button className="nav-icon-button">❓</button>
            <ProfileButton />
          </>
        }
      />

      <div className="calendar-container">
        <Sidebar />
        <CalendarView />
      </div>
    </Layout>
  )
}
```

### Step 2.2: Extend ProfileCard for Calendar-Specific Menu

**`components/ProfileButton.tsx`**:
```tsx
'use client'

import { useState } from 'react'
import { ProfileCard } from '@/lib/hoagie-ui'
import { useAuth } from '@/lib/auth'  // Will create this

export function ProfileButton() {
  const { user } = useAuth()
  const [savedCount, setSavedCount] = useState(0)  // TODO: fetch from API

  return (
    <ProfileCard
      name={user?.name || 'User'}
      email={user?.email || ''}
      initials={getInitials(user?.name || 'User')}
      menuItems={[
        {
          icon: '⭐',
          label: `Saved Events (${savedCount})`,
          href: '/saved',
        },
        {
          icon: '🔔',
          label: 'Category Notifications',
          href: '/notifications',
        },
        {
          icon: '⚙️',
          label: 'Settings',
          href: '/settings',
        },
        {
          icon: '🚪',
          label: 'Log Out',
          onClick: handleLogout,
        },
      ]}
    />
  )
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

function handleLogout() {
  // TODO: Implement logout
}
```

### Step 2.3: Style hoagie-ui Components for Calendar

**`styles/calendar.css`**:
```css
.calendar-container {
  display: flex;
  height: calc(100vh - 88px);  /* Subtract nav height */
  max-width: 1600px;
  margin: 0 auto;
  background: white;
  box-shadow: var(--shadow-md);
}

/* Extend Nav component styles for calendar */
.nav-button {
  padding: 10px 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: white;
  color: var(--color-text);
  font-weight: 500;
  transition: all 0.2s;
}

.nav-button:hover {
  background: var(--color-background);
}

.nav-button-primary {
  background: var(--color-primary-dark);
  color: white;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  border: none;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-button-primary:hover {
  background: var(--color-primary);
}

.nav-icon-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 18px;
  transition: all 0.2s;
}

.nav-icon-button:hover {
  background: rgba(255, 255, 255, 0.3);
}
```

---

## 🗓️ Phase 3: Build Custom Calendar Components (Days 3-5)

### Components to Build from Scratch

Since hoagie-ui doesn't have calendar components, you'll build these:

1. **Sidebar** (filters, quick actions)
2. **CalendarGrid** (month/week/day views)
3. **EventCard** (event display)
4. **Modal system** (event details, add event, etc.)

### Step 3.1: Sidebar Component

**`components/Sidebar.tsx`**:
```tsx
'use client'

import { useState } from 'react'
import { CategoryFilter } from './CategoryFilter'
import '@/styles/components/sidebar.css'

const CATEGORIES = [
  { id: 'social', label: 'Social Events', color: '#EF4444' },
  { id: 'academic', label: 'Academic', color: '#3B82F6' },
  { id: 'food', label: 'Food & Dining', color: '#F59E0B' },
  { id: 'arts', label: 'Arts & Culture', color: '#A855F7' },
  { id: 'sports', label: 'Sports & Fitness', color: '#10B981' },
  { id: 'career', label: 'Career', color: '#8B5CF6' },
  { id: 'housing', label: 'Housing & Sales', color: '#F43F5E' },
  { id: 'other', label: 'Other', color: '#6B7280' },
]

export function Sidebar() {
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(
    new Set(CATEGORIES.map(c => c.id))
  )

  const toggleCategory = (categoryId: string) => {
    setEnabledCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-heading">Categories</h3>
        <div className="category-filters">
          {CATEGORIES.map(category => (
            <CategoryFilter
              key={category.id}
              category={category}
              enabled={enabledCategories.has(category.id)}
              onToggle={() => toggleCategory(category.id)}
            />
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-heading">Quick Actions</h3>
        <button className="quick-action-btn">
          ⭐ Saved Events (0)
        </button>
        <button className="quick-action-btn">
          🔔 Category Notifications
        </button>
        <button className="quick-action-btn">
          📤 Export Calendar
        </button>
      </div>
    </aside>
  )
}
```

**`components/CategoryFilter.tsx`**:
```tsx
interface CategoryFilterProps {
  category: {
    id: string
    label: string
    color: string
  }
  enabled: boolean
  onToggle: () => void
}

export function CategoryFilter({ category, enabled, onToggle }: CategoryFilterProps) {
  return (
    <div
      className={`filter-item ${!enabled ? 'inactive' : ''}`}
      onClick={onToggle}
    >
      <input
        type="checkbox"
        checked={enabled}
        readOnly
        className="colored-checkbox"
        style={{
          background: enabled ? category.color : 'transparent',
          borderColor: category.color,
        }}
      />
      <span className="filter-label">{category.label}</span>
      <span className="filter-count">0</span>  {/* TODO: fetch count */}
    </div>
  )
}
```

**`styles/components/sidebar.css`**:
```css
.sidebar {
  width: 280px;
  background: var(--color-background);
  border-right: 1px solid var(--color-border);
  padding: var(--spacing-lg);
  overflow-y: auto;
}

.sidebar-section {
  margin-bottom: var(--spacing-2xl);
}

.sidebar-heading {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  margin-bottom: var(--spacing-md);
  letter-spacing: 0.5px;
}

.category-filters {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 0.2s;
}

.filter-item:hover {
  background: rgba(0, 0, 0, 0.03);
}

.filter-item.inactive {
  opacity: 0.4;
}

.colored-checkbox {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: var(--radius-sm);
  border: 2px solid;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.colored-checkbox:checked::after {
  content: '✓';
  position: absolute;
  color: white;
  font-size: 14px;
  font-weight: bold;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.filter-label {
  flex: 1;
  font-size: 14px;
  color: var(--color-text);
}

.filter-count {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.quick-action-btn {
  width: 100%;
  padding: 12px;
  margin-bottom: var(--spacing-sm);
  background: white;
  border: 1.5px solid var(--color-primary);
  border-radius: var(--radius-md);
  color: var(--color-primary-dark);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.quick-action-btn:hover {
  background: rgba(20, 184, 166, 0.05);
  transform: translateY(-1px);
}
```

### Step 3.2: Calendar Grid Component

This is complex, so let's break it down:

**`components/calendar/CalendarView.tsx`** (container):
```tsx
'use client'

import { useState } from 'react'
import { MonthView } from './MonthView'
import { WeekView } from './WeekView'
import { DayView } from './DayView'
import { CalendarControls } from './CalendarControls'
import '@/styles/calendar.css'

type View = 'month' | 'week' | 'day'

export function CalendarView() {
  const [view, setView] = useState<View>('month')
  const [currentDate, setCurrentDate] = useState(new Date())

  return (
    <div className="calendar-main">
      <CalendarControls
        view={view}
        onViewChange={setView}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
      />

      <div className="calendar-content">
        {view === 'month' && <MonthView date={currentDate} />}
        {view === 'week' && <WeekView date={currentDate} />}
        {view === 'day' && <DayView date={currentDate} />}
      </div>
    </div>
  )
}
```

**`components/calendar/CalendarControls.tsx`**:
```tsx
import { format, addMonths, subMonths } from 'date-fns'

interface CalendarControlsProps {
  view: 'month' | 'week' | 'day'
  onViewChange: (view: 'month' | 'week' | 'day') => void
  currentDate: Date
  onDateChange: (date: Date) => void
}

export function CalendarControls({
  view,
  onViewChange,
  currentDate,
  onDateChange,
}: CalendarControlsProps) {
  return (
    <div className="calendar-controls">
      <div className="controls-left">
        <h2 className="month-title">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="nav-buttons">
          <button
            className="nav-btn"
            onClick={() => onDateChange(subMonths(currentDate, 1))}
          >
            ←
          </button>
          <button
            className="today-btn"
            onClick={() => onDateChange(new Date())}
          >
            Today
          </button>
          <button
            className="nav-btn"
            onClick={() => onDateChange(addMonths(currentDate, 1))}
          >
            →
          </button>
        </div>
      </div>

      <div className="view-toggle">
        <button
          className={`view-btn ${view === 'month' ? 'active' : ''}`}
          onClick={() => onViewChange('month')}
        >
          Month
        </button>
        <button
          className={`view-btn ${view === 'week' ? 'active' : ''}`}
          onClick={() => onViewChange('week')}
        >
          Week
        </button>
        <button
          className={`view-btn ${view === 'day' ? 'active' : ''}`}
          onClick={() => onViewChange('day')}
        >
          Day
        </button>
      </div>
    </div>
  )
}
```

**`components/calendar/MonthView.tsx`**:
```tsx
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
} from 'date-fns'

interface MonthViewProps {
  date: Date
}

export function MonthView({ date }: MonthViewProps) {
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  return (
    <div className="month-view">
      <div className="month-grid">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="day-header">{day}</div>
        ))}

        {/* Day cells */}
        {days.map(day => (
          <DayCell
            key={day.toString()}
            date={day}
            isCurrentMonth={isSameMonth(day, date)}
            isToday={isToday(day)}
          />
        ))}
      </div>
    </div>
  )
}

interface DayCellProps {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
}

function DayCell({ date, isCurrentMonth, isToday }: DayCellProps) {
  const className = [
    'day-cell',
    !isCurrentMonth && 'other-month',
    isToday && 'today',
  ].filter(Boolean).join(' ')

  return (
    <div className={className}>
      <div className="day-number">
        {format(date, 'd')}
      </div>
      {/* TODO: Render events for this day */}
    </div>
  )
}
```

I'll continue with more components, but this gives you the structure!

---

## 📋 Updated Implementation Checklist

### ⚠️ Key Changes from Original Checklist

| Original | Updated | Reason |
|----------|---------|--------|
| ❌ "Install Tailwind" | ✅ "Set up plain CSS structure" | Match HoagieMail |
| ❌ "Configure Tailwind colors" | ✅ "Create CSS variables file" | Match HoagieMail |
| ❌ "Install NextAuth" | ✅ "Integrate Hoagie/CAS auth" | Match HoagieMail |
| ❌ "npm install" | ✅ "yarn install" | Match HoagieMail |

---

## 🎯 Efficient Migration Priority

### Critical Path (Can't Skip)

```
1. Setup Project → 2. Copy hoagie-ui → 3. Integrate Auth → 4. Build Calendar → 5. Connect API
```

### Parallel Work Streams

**Stream A: Frontend UI** (1 developer)
- Day 1: Setup + hoagie-ui integration
- Day 2-3: Sidebar + filters
- Day 4-5: Calendar grid (month view)
- Day 6-7: Modals

**Stream B: Backend API** (1 developer, can start immediately)
- Day 1: Database schema + migrations
- Day 2-3: Event CRUD API routes
- Day 4-5: Auth integration
- Day 6-7: Email service

**Stream C: HoagieMail Integration** (wait for A+B)
- Week 2: Email parsing
- Week 3: Testing

---

## 📊 Component Reuse Breakdown

### What You Get "For Free" from hoagie-ui

✅ **Navigation Bar** (~100 lines saved)
✅ **Layout Wrapper** (~50 lines saved)
✅ **Auth Button** (~150 lines saved)
✅ **Profile Menu** (~200 lines saved)
✅ **Footer** (~80 lines saved)
✅ **Theme System** (~100 lines saved)

**Total Time Saved: ~2-3 days of development**

### What You Must Build

❌ **Sidebar** (~300 lines)
❌ **Calendar Grid** (~500 lines)
❌ **Event Cards** (~200 lines)
❌ **Modals** (~800 lines)
❌ **Forms** (~400 lines)

**Total Custom Code: ~2200 lines**

---

## 🚀 Quick Start Commands

### Day 1 Setup Script

```bash
# Create project
npx create-next-app@latest hoagiecalendar --typescript --app --no-tailwind --eslint
cd hoagiecalendar
rm package-lock.json
yarn install

# Clone HoagieMail
cd ..
git clone https://github.com/lauechlo/mail.git hoagiemail
cd hoagiemail
yarn install

# Copy hoagie-ui
cd ../hoagiecalendar
cp -r ../hoagiemail/lib/hoagie-ui ./lib/
cp ../hoagiemail/.eslintrc.* .
cp ../hoagiemail/.prettierrc .

# Install deps
yarn add prisma @prisma/client react-hook-form zod @hookform/resolvers date-fns ics
yarn add -D @types/node

# Create folder structure
mkdir -p styles/components
mkdir -p components/calendar
mkdir -p components/modals
mkdir -p lib
mkdir -p prisma

# Create CSS files
touch styles/globals.css
touch styles/variables.css
touch styles/calendar.css

# Init Prisma
npx prisma init

# Ready to code!
echo "✅ Setup complete! Start building."
```

---

## 🤔 Key Decisions to Make

### 1. hoagie-ui Distribution Strategy

**Option A: Copy Library** (fastest for MVP)
```bash
cp -r ../hoagiemail/lib/hoagie-ui ./lib/
```
✅ Pros: Fast, works immediately
❌ Cons: Duplication, no automatic updates

**Option B: Git Submodule**
```bash
git submodule add https://github.com/lauechlo/mail.git vendor/mail
ln -s vendor/mail/lib/hoagie-ui lib/hoagie-ui
```
✅ Pros: Shared codebase, easy updates
❌ Cons: Submodule complexity

**Option C: Publish to npm** (best long-term)
```bash
# Create @hoagie/ui package
cd hoagiemail/lib/hoagie-ui
npm init @hoagie/ui
npm publish
```
✅ Pros: Professional, versioned, shareable
❌ Cons: Setup time, requires npm account

**Recommendation for MVP: Option A (Copy)**

### 2. Styling Strategy

**Option A: Extract all from prototype** (your current plan)
- Take 10,000 lines from `<style>` tag
- Split into modular CSS files
- ✅ Fastest migration
- ❌ Lots of cleanup needed

**Option B: Rebuild with CSS modules** (cleaner)
- Study HoagieMail's CSS patterns
- Rebuild each component's styles
- ✅ Cleaner code
- ❌ More time

**Recommendation: Start with Option A, refactor to B over time**

---

## 📝 Next Steps

1. **Run the Day 1 setup script** (above)
2. **Extract exact colors from HoagieMail**:
   ```bash
   cd hoagiemail
   grep -r "background.*#\|color.*#" --include="*.css" lib/hoagie-ui/ > ../colors.txt
   ```
3. **Create first page** using hoagie-ui Layout + Nav
4. **Build Sidebar** component
5. **Build Calendar grid** (month view first)

Would you like me to:
- Generate the complete file structure?
- Create conversion scripts for the prototype CSS?
- Write the auth integration code?
- Build any specific component?

Let me know which part you want to tackle first! 🚀
