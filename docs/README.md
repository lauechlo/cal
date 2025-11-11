# 🗓️ HoagieCalendar

**A unified event discovery platform for Princeton University students**

HoagieCalendar transforms Princeton's fragmented event landscape by aggregating HoagieMail announcements into a beautiful, filterable calendar interface. Students can browse, save, and export campus events without digging through hundreds of emails.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Current Status](#current-status)
- [HoagieClub Ecosystem](#hoagieclub-ecosystem)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [API Specification](#api-specification)
- [Development Roadmap](#development-roadmap)
- [Getting Started](#getting-started)
- [Contributing](#contributing)

---

## 🎯 Project Overview

### The Problem
Princeton students receive 10-50+ HoagieMail blasts daily announcing campus events. These emails get lost in overflowing inboxes, making it hard to:
- Discover relevant events
- Remember event details
- Sync events with personal calendars
- Filter by category or date

### The Solution
HoagieCalendar provides:
- **Visual Calendar Interface**: See all events at a glance
- **Smart Filtering**: Browse by category (Academic, Social, Food, Arts, Sports, Career, Housing, Other)
- **Event Search**: Find events by title, description, or sender
- **Save & Export**: Bookmark events and export to Google Calendar, Apple Calendar, or Outlook
- **Email Archives**: Search past HoagieMails with full filtering
- **Category Notifications**: Subscribe to specific event categories

---

## ✅ Current Status

### Fully Implemented (Frontend Prototype)
✓ **UI/UX Design** - Complete, polished, production-ready
✓ **Month View** - Full calendar grid with event pills
✓ **Week View** - Time-based grid showing events by hour and day
✓ **Day View** - Detailed hourly schedule (placeholder, needs implementation)
✓ **Category Filtering** - 8 categories with colored checkboxes
✓ **Event Details Modal** - Shows full event info, original HoagieMail, sender details
✓ **Save Events** - Users can bookmark events (local storage)
✓ **Export Calendar** - Beautiful modal with options for Google/Apple/Outlook/.ics
✓ **Archives Modal** - Browse past events with search and filters
✓ **Report System** - Flag duplicate/spam/offensive events
✓ **Category Notifications** - Subscribe to event type alerts
✓ **Tutorial/Onboarding** - Interactive guide for new users
✓ **Profile Dropdown** - Access saved events, settings, logout
✓ **Responsive Design** - Desktop-optimized (mobile needs work)

### Needs Backend Implementation
⚠️ **User Authentication** - Princeton SSO / email verification
⚠️ **Database Integration** - Store events, users, saves, subscriptions
⚠️ **HoagieMail Parsing** - Extract event data from emails
⚠️ **Real Data Loading** - Fetch events from database
⚠️ **Month Navigation** - Load events for different months
⚠️ **Add Event Form** - Submit new events + send HoagieMail
⚠️ **Edit/Delete Events** - Modify/remove posted events
⚠️ **Report Moderation** - Admin review of flagged events
⚠️ **"Interested" Feature** - RSVP/interest tracking
⚠️ **Email Notifications** - Send category subscription alerts
⚠️ **Calendar Sync** - Two-way sync with external calendars
⚠️ **Search Indexing** - Full-text search for archives

### Missing Features (Nice-to-Have)
❌ **Mobile App** - Native iOS/Android apps
❌ **Recurring Events** - Weekly/monthly event series
❌ **Event Reminders** - Push notifications before events
❌ **Event Photos** - Upload flyers/posters
❌ **Waitlist System** - For events at capacity
❌ **Social Features** - See which friends are interested
❌ **Event Analytics** - Track views, interests, attendance

---

## 🏛️ HoagieClub Ecosystem

### Overview
HoagieCalendar is part of the **HoagieClub** ecosystem, a suite of tools for Princeton students:

1. **HoagieMail** - Campus-wide email blast system (existing)
2. **HoagieCalendar** - Event aggregation platform (this project)
3. **[Future]** - Other potential integrations (housing, dining, etc.)

### HoagieMail Integration

#### Current HoagieMail System
- Students can send emails to all undergrads (`hoagie@lists.princeton.edu`)
- Used for event announcements, housing sublets, item sales, club promotions
- No structured data - just free-form emails
- No filtering or archiving capabilities

#### Integration Strategy

**Option 1: Manual Event Creation (MVP)**
```
User workflow:
1. Student creates event in HoagieCalendar UI
2. Fills out structured form (title, date, time, location, category, description)
3. Optionally checks "Send as HoagieMail"
4. System sends both:
   - Formatted email to hoagie@lists
   - Structured event data to HoagieCalendar database
```

**Option 2: Email Parsing (Future Enhancement)**
```
Automated workflow:
1. Student sends regular HoagieMail
2. Backend receives email via webhook/API
3. NLP/AI extracts: title, date, time, location, category
4. Creates calendar event automatically
5. Sender receives confirmation link to edit details
```

**Option 3: Hybrid Approach (Recommended)**
```
Balanced workflow:
1. Backend monitors hoagie@lists for new emails
2. AI suggests event details (title, date, category)
3. Sender gets email: "We detected an event! Click to add to HoagieCalendar"
4. Sender reviews/edits suggested details
5. Confirms to publish to calendar
```

#### Technical Integration Points

**Email Reception**
- Set up email forwarding rule: hoagie@lists → calendar-parser@hoagieclub.princeton.edu
- Use service like SendGrid Inbound Parse or AWS SES
- Parse incoming emails to extract sender, subject, body, timestamp

**Data Extraction**
```javascript
// Example email parsing pipeline
{
  raw_email: "...",
  parsed: {
    from: "jsmith@princeton.edu",
    subject: "Free Pizza @ Frist Tomorrow 12pm",
    body: "Come grab free pizza...",
    received_at: "2025-11-05T10:30:00Z"
  },
  extracted: {
    title: "Free Pizza at Frist",
    date: "2025-11-06",
    time: "12:00 PM",
    location: "Frist Campus Center",
    category: "food",  // AI-suggested
    confidence: 0.87
  }
}
```

**Calendar Event Creation**
- POST to `/api/events` with extracted data
- Store original email content in `email_content` field
- Link event to sender's Princeton email
- Send confirmation email with edit link

#### Database Schema for Integration

```sql
-- Track HoagieMail sources
CREATE TABLE hoagiemails (
  id UUID PRIMARY KEY,
  message_id TEXT UNIQUE,          -- Email Message-ID header
  from_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  received_at TIMESTAMP NOT NULL,
  parsed_at TIMESTAMP,
  event_id UUID REFERENCES events(id),  -- Linked calendar event
  parsing_status TEXT,              -- pending, approved, rejected, failed
  created_at TIMESTAMP DEFAULT NOW()
);

-- Events table includes HoagieMail reference
ALTER TABLE events ADD COLUMN hoagiemail_id UUID REFERENCES hoagiemails(id);
```

---

## 🎨 Features

### Core Features

#### 1. Calendar Views
- **Month View**: 7×5 grid showing all events
- **Week View**: Hourly time slots (8am-7pm) across 7 days
- **Day View**: Detailed schedule for single day

#### 2. Event Management
- **Browse Events**: Visual cards with category colors
- **Event Details**: Full modal with description, time, location, sender
- **Save Events**: Bookmark to personal list
- **Export Events**: Download to external calendars

#### 3. Filtering & Search
- **Category Filters**: 8 categories with colored checkboxes
  - Social Events (red)
  - Academic (blue)
  - Food & Dining (orange)
  - Arts & Culture (purple)
  - Sports & Fitness (green)
  - Career (violet)
  - Housing & Sales (pink)
  - Other (gray)
- **Search**: Full-text search across title, description, sender
- **Time Filters**: This Week, This Month, Last 3 Months, by Semester

#### 4. Archives
- **Browse Past Events**: Searchable archive of all HoagieMails
- **Filter Archives**: Same category/time filters as main calendar
- **Full Email Content**: View original HoagieMail text

#### 5. User Features
- **Profile Menu**: Access saved events, settings, logout
- **Category Notifications**: Subscribe to email alerts for specific categories
- **Tutorial**: Interactive onboarding guide
- **Report Events**: Flag duplicate/spam/inappropriate content

#### 6. Event Creation
- **Add Event Form**: Create new events with all details
- **Optional HoagieMail**: Check box to send campus-wide email
- **Event Preview**: See how event will appear before posting

---

## 🛠️ Tech Stack

### Recommended Stack

#### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + React Query
- **Calendar Library**: date-fns (lightweight alternative to moment.js)
- **Forms**: React Hook Form + Zod validation

#### Backend
- **Runtime**: Node.js 20+
- **Framework**: Next.js API Routes (or separate Express server)
- **Database**: PostgreSQL 15+
- **ORM**: Prisma or Drizzle ORM
- **Authentication**: NextAuth.js with Princeton CAS/OAuth
- **Email Service**: SendGrid or AWS SES
- **Storage**: Supabase Storage (for event images)

#### Infrastructure
- **Hosting**: Vercel (frontend + API) or AWS
- **Database**: Supabase or Railway PostgreSQL
- **CDN**: Vercel Edge Network or Cloudflare
- **Monitoring**: Sentry (error tracking) + Vercel Analytics

#### Development Tools
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Testing**: Jest + React Testing Library + Playwright
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode

### Alternative Stacks

**Option 2: Firebase-based**
- Frontend: React/Next.js
- Backend: Firebase Functions
- Database: Firestore
- Auth: Firebase Auth with custom Princeton provider
- Pros: Real-time sync, easier setup
- Cons: NoSQL limitations, vendor lock-in

**Option 3: Supabase-native**
- Frontend: React/Next.js
- Backend: Supabase Edge Functions
- Database: Supabase PostgreSQL
- Auth: Supabase Auth with custom Princeton OAuth
- Pros: All-in-one solution, excellent DX
- Cons: Smaller ecosystem than Firebase

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     User Browser                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Next.js Frontend (React)                  │  │
│  │  - Calendar UI                                    │  │
│  │  - Event Modals                                   │  │
│  │  - Filtering/Search                               │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS/REST
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js API Routes / Backend                │
│  ┌──────────────────────────────────────────────────┐  │
│  │  /api/events         - CRUD operations           │  │
│  │  /api/users          - User management           │  │
│  │  /api/saved          - Saved events              │  │
│  │  /api/subscriptions  - Category notifications    │  │
│  │  /api/reports        - Report events             │  │
│  │  /api/export         - Generate .ics files       │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌────────────────┐      ┌────────────────────┐
│   PostgreSQL   │      │  Email Service     │
│   Database     │      │  (SendGrid/SES)    │
│                │      │                    │
│  - events      │      │  - Parse incoming  │
│  - users       │      │  - Send HoagieMail │
│  - saved_events│      │  - Notifications   │
│  - reports     │      └────────────────────┘
│  - hoagiemails │
└────────────────┘

        │
        ▼
┌────────────────────┐
│  External Services │
│                    │
│  - Princeton CAS   │ (Authentication)
│  - Google Calendar │ (Export integration)
│  - Apple Calendar  │
│  - Outlook API     │
└────────────────────┘
```

### Data Flow

#### Event Creation Flow
```
1. User submits "Add Event" form
   ↓
2. Frontend validates data (React Hook Form + Zod)
   ↓
3. POST /api/events with event data + optionalHoagieMail flag
   ↓
4. Backend validates + authenticates user
   ↓
5. Insert event into database
   ↓
6. If HoagieMail checked:
   - Format event as email template
   - Send to hoagie@lists.princeton.edu via SendGrid
   - Store hoagiemail record with link to event
   ↓
7. Return event object to frontend
   ↓
8. Update calendar UI with new event
```

#### Event Discovery Flow
```
1. User loads calendar page
   ↓
2. Frontend calls GET /api/events?month=2025-11&categories=social,food
   ↓
3. Backend queries database with filters
   ↓
4. Return events array (with pagination)
   ↓
5. Frontend renders events on calendar
   ↓
6. User clicks event → Opens modal with full details
```

#### HoagieMail Integration Flow (Future)
```
1. Student sends email to hoagie@lists.princeton.edu
   ↓
2. Email server forwards to calendar-parser@hoagieclub.com
   ↓
3. SendGrid Inbound Parse webhook triggers API route
   ↓
4. POST /api/hoagiemail/parse receives email data
   ↓
5. AI/NLP extracts event details:
   - OpenAI GPT-4 prompt: "Extract event info from this email"
   - Returns: {title, date, time, location, category, confidence}
   ↓
6. If confidence > 0.75:
   - Create draft event in database
   - Send email to sender: "Confirm event details?"
   ↓
7. Sender clicks link → Opens pre-filled form
   ↓
8. Sender edits/confirms → Event published to calendar
```

---

## 🗄️ Database Schema

### Core Tables

```sql
-- Users (Princeton students)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,                -- must be @princeton.edu
  name TEXT NOT NULL,
  class_year INTEGER,                        -- graduation year
  major TEXT,
  profile_image_url TEXT,
  notification_preferences JSONB DEFAULT '{
    "email": true,
    "push": false,
    "frequency": "daily"
  }',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,                    -- social, academic, food, arts, sports, career, housing, other
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  location TEXT NOT NULL,
  registration_link TEXT,
  capacity INTEGER,
  image_url TEXT,                            -- event flyer/poster
  tags TEXT[],                               -- additional categorization
  
  -- Sender info
  created_by UUID REFERENCES users(id) NOT NULL,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  
  -- HoagieMail integration
  hoagiemail_id UUID REFERENCES hoagiemails(id),
  email_content TEXT,                        -- original HoagieMail body
  
  -- Engagement metrics
  interested_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'active',              -- active, cancelled, past, reported
  is_featured BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_events_date (date),
  INDEX idx_events_category (category),
  INDEX idx_events_created_by (created_by),
  INDEX idx_events_status (status)
);

-- Saved Events (user bookmarks)
CREATE TABLE saved_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  event_id UUID REFERENCES events(id) NOT NULL,
  saved_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, event_id),
  INDEX idx_saved_user (user_id),
  INDEX idx_saved_event (event_id)
);

-- Interested (RSVP/interest tracking)
CREATE TABLE interested (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  event_id UUID REFERENCES events(id) NOT NULL,
  interested_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, event_id),
  INDEX idx_interested_user (user_id),
  INDEX idx_interested_event (event_id)
);

-- Category Subscriptions (notification preferences)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  category TEXT NOT NULL,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, category),
  INDEX idx_subscriptions_user (user_id)
);

-- Event Reports (flagging system)
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) NOT NULL,
  reported_by UUID REFERENCES users(id) NOT NULL,
  reason TEXT NOT NULL,                      -- duplicate, spam, offensive, incorrect, other
  details TEXT,
  status TEXT DEFAULT 'pending',             -- pending, reviewed, action_taken, dismissed
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_reports_event (event_id),
  INDEX idx_reports_status (status)
);

-- HoagieMails (email parsing/tracking)
CREATE TABLE hoagiemails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id TEXT UNIQUE,                    -- Email Message-ID header
  from_email TEXT NOT NULL,
  from_name TEXT,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  html_body TEXT,
  received_at TIMESTAMP NOT NULL,
  
  -- Parsing status
  parsed_at TIMESTAMP,
  parsing_status TEXT DEFAULT 'pending',     -- pending, success, failed, rejected
  parsing_confidence FLOAT,
  extracted_data JSONB,                      -- AI-extracted event details
  
  -- Event linkage
  event_id UUID REFERENCES events(id),
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_hoagiemails_from (from_email),
  INDEX idx_hoagiemails_received (received_at),
  INDEX idx_hoagiemails_status (parsing_status)
);

-- Admin/Moderation
CREATE TABLE moderators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL UNIQUE,
  role TEXT DEFAULT 'moderator',             -- moderator, admin, super_admin
  granted_at TIMESTAMP DEFAULT NOW(),
  granted_by UUID REFERENCES users(id)
);
```

### Indexes and Constraints

```sql
-- Full-text search on events
CREATE INDEX idx_events_search ON events USING gin(
  to_tsvector('english', title || ' ' || description || ' ' || location)
);

-- Compound index for common queries
CREATE INDEX idx_events_date_category ON events(date, category);

-- Ensure one report per user per event
ALTER TABLE reports ADD CONSTRAINT unique_report_per_user 
  UNIQUE(event_id, reported_by);
```

---

## 🔌 API Specification

### Authentication
All API routes (except public event views) require authentication.

```
Authorization: Bearer <jwt_token>
```

### Endpoints

#### Events

**GET /api/events**
Get events with filtering and pagination.

```typescript
Query Parameters:
  month?: string        // YYYY-MM format (default: current month)
  categories?: string   // comma-separated: "social,food,academic"
  search?: string       // full-text search query
  startDate?: string    // ISO date
  endDate?: string      // ISO date
  limit?: number        // default: 50, max: 100
  offset?: number       // for pagination

Response: {
  events: Event[],
  total: number,
  hasMore: boolean
}
```

**GET /api/events/:id**
Get single event details.

```typescript
Response: Event
```

**POST /api/events**
Create new event.

```typescript
Body: {
  title: string,
  description: string,
  category: string,
  date: string,          // YYYY-MM-DD
  startTime: string,     // HH:MM
  endTime?: string,
  location: string,
  registrationLink?: string,
  capacity?: number,
  imageUrl?: string,
  tags?: string[],
  sendHoagieMail: boolean
}

Response: Event
```

**PATCH /api/events/:id**
Update event (creator or admin only).

```typescript
Body: Partial<Event>
Response: Event
```

**DELETE /api/events/:id**
Delete event (creator or admin only).

```typescript
Response: { success: boolean }
```

#### User Events

**GET /api/saved**
Get user's saved events.

```typescript
Response: SavedEvent[]
```

**POST /api/saved/:eventId**
Save event to user's list.

```typescript
Response: SavedEvent
```

**DELETE /api/saved/:eventId**
Remove saved event.

```typescript
Response: { success: boolean }
```

**POST /api/interested/:eventId**
Mark interest in event (RSVP).

```typescript
Response: { interestedCount: number }
```

**DELETE /api/interested/:eventId**
Remove interest.

```typescript
Response: { interestedCount: number }
```

#### Subscriptions

**GET /api/subscriptions**
Get user's category subscriptions.

```typescript
Response: {
  social: boolean,
  academic: boolean,
  food: boolean,
  arts: boolean,
  sports: boolean,
  career: boolean,
  housing: boolean,
  other: boolean
}
```

**POST /api/subscriptions**
Update subscriptions.

```typescript
Body: {
  category: string,
  subscribed: boolean
}

Response: Subscription
```

#### Reports

**POST /api/reports**
Report an event.

```typescript
Body: {
  eventId: string,
  reason: "duplicate" | "spam" | "offensive" | "incorrect" | "other",
  details?: string
}

Response: Report
```

**GET /api/reports** (Admin only)
Get all reports for moderation.

```typescript
Query Parameters:
  status?: "pending" | "reviewed" | "action_taken" | "dismissed"
  limit?: number
  offset?: number

Response: {
  reports: Report[],
  total: number
}
```

#### Export

**GET /api/export/ics**
Generate .ics file for saved events.

```typescript
Query Parameters:
  eventIds?: string     // comma-separated event IDs
  month?: string        // export all from month
  categories?: string   // export filtered categories

Response: .ics file (text/calendar)
```

#### HoagieMail Integration

**POST /api/hoagiemail/parse** (Internal webhook)
Parse incoming HoagieMail.

```typescript
Body: {
  messageId: string,
  from: string,
  subject: string,
  body: string,
  receivedAt: string
}

Response: {
  hoagiemailId: string,
  extractedData?: EventData,
  confidence: number
}
```

**POST /api/hoagiemail/confirm/:id**
Confirm parsed event details.

```typescript
Body: Partial<Event>
Response: Event
```

---

## 🚀 Development Roadmap

### Phase 1: MVP (4-6 weeks)

#### Week 1-2: Setup & Core Infrastructure
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Set up Tailwind CSS with design system tokens
- [ ] Create database schema in PostgreSQL
- [ ] Set up Prisma ORM
- [ ] Implement Princeton SSO authentication
- [ ] Create basic API routes structure
- [ ] Set up development environment (Docker, env vars)

#### Week 3-4: Core Features
- [ ] Build event listing page (month view)
- [ ] Implement event detail modal
- [ ] Create event creation form
- [ ] Build category filtering system
- [ ] Implement save event functionality
- [ ] Create user profile dropdown
- [ ] Build archives page with search

#### Week 5-6: Polish & Testing
- [ ] Add export to .ics functionality
- [ ] Implement report system
- [ ] Build admin moderation dashboard
- [ ] Write unit tests (Jest)
- [ ] Write E2E tests (Playwright)
- [ ] Deploy to staging environment
- [ ] User testing with 10-20 Princeton students
- [ ] Bug fixes and refinements

### Phase 2: HoagieMail Integration (2-3 weeks)

#### Week 7-8: Email Parsing
- [ ] Set up SendGrid/SES inbound parsing
- [ ] Implement AI-based event extraction (GPT-4)
- [ ] Create confirmation email flow
- [ ] Build event editing interface
- [ ] Test with historical HoagieMail data

#### Week 9: Sending HoagieMail
- [ ] Integrate with existing hoagie@lists system
- [ ] Format event as email template
- [ ] Add preview before sending
- [ ] Implement rate limiting (prevent spam)

### Phase 3: Enhanced Features (3-4 weeks)

#### Week 10-11: Engagement Features
- [ ] Build "Interested" RSVP system
- [ ] Show "X people interested" on events
- [ ] Add event image upload
- [ ] Implement event capacity limits
- [ ] Create waitlist system

#### Week 12: Notifications
- [ ] Build category subscription system
- [ ] Implement email digest (daily/weekly)
- [ ] Add push notifications (web)
- [ ] Create notification preferences page

#### Week 13: Mobile & Polish
- [ ] Make fully mobile-responsive
- [ ] Add PWA support (install on phone)
- [ ] Implement offline support
- [ ] Performance optimizations
- [ ] Final user testing

### Phase 4: Launch & Growth (Ongoing)

- [ ] Beta launch to 100 students
- [ ] Collect feedback and iterate
- [ ] Full launch to all Princeton undergrads
- [ ] Monitor usage analytics
- [ ] Add requested features based on feedback

---

## 💻 Getting Started

### Prerequisites

```bash
Node.js 20+
PostgreSQL 15+
npm or yarn or pnpm
```

### Installation

```bash
# Clone the repository
git clone https://github.com/princeton/hoagiecalendar.git
cd hoagiecalendar

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Set up database
npx prisma migrate dev

# Seed database with sample data
npm run seed

# Start development server
npm run dev
```

### Environment Variables

```bash
# .env.local

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hoagiecalendar"

# Authentication (Princeton CAS)
PRINCETON_CAS_URL="https://fed.princeton.edu/cas"
PRINCETON_CAS_CALLBACK="http://localhost:3000/api/auth/callback"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Email (SendGrid)
SENDGRID_API_KEY="your-sendgrid-api-key"
SENDGRID_FROM_EMAIL="noreply@hoagiecalendar.princeton.edu"
HOAGIEMAIL_ADDRESS="hoagie@lists.princeton.edu"

# File Storage (Supabase)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
SUPABASE_SERVICE_KEY="your-supabase-service-key"

# AI (OpenAI for email parsing)
OPENAI_API_KEY="your-openai-api-key"

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="your-analytics-id"
```

### Project Structure

```
hoagiecalendar/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── events/
│   │   ├── saved/
│   │   ├── subscriptions/
│   │   ├── reports/
│   │   └── export/
│   ├── calendar/                 # Calendar page
│   ├── archives/                 # Archives page
│   └── layout.tsx
├── components/                   # React components
│   ├── calendar/
│   │   ├── MonthView.tsx
│   │   ├── WeekView.tsx
│   │   ├── DayView.tsx
│   │   └── EventCard.tsx
│   ├── modals/
│   │   ├── EventDetailModal.tsx
│   │   ├── AddEventModal.tsx
│   │   ├── ExportModal.tsx
│   │   └── ReportModal.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── ProfileDropdown.tsx
│   └── ui/                       # Reusable UI components
├── lib/                          # Utilities
│   ├── db.ts                     # Database client
│   ├── auth.ts                   # Authentication helpers
│   ├── email.ts                  # Email service
│   └── utils.ts                  # General utilities
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/
├── public/
│   └── icons/
├── styles/
│   └── globals.css
├── types/
│   └── index.ts                  # TypeScript types
└── tests/
    ├── unit/
    └── e2e/
```

### Development Commands

```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm run test              # Unit tests
npm run test:e2e          # E2E tests
npm run test:coverage     # Coverage report

# Database
npx prisma studio         # Open database GUI
npx prisma migrate dev    # Run migrations
npx prisma generate       # Generate Prisma Client

# Build
npm run build
npm run start             # Production server
```

---

## 🤝 Contributing

### Coding Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Enforce consistent code style
- **Prettier**: Auto-format on save
- **Commit Convention**: Conventional Commits
  - `feat:` new feature
  - `fix:` bug fix
  - `docs:` documentation
  - `style:` formatting
  - `refactor:` code restructuring
  - `test:` adding tests
  - `chore:` maintenance

### Git Workflow

```bash
# Create feature branch
git checkout -b feat/add-recurring-events

# Make changes and commit
git add .
git commit -m "feat: add recurring events UI"

# Push and create PR
git push origin feat/add-recurring-events
```

### Pull Request Process

1. Create feature branch from `main`
2. Write code + tests
3. Ensure all tests pass
4. Update documentation if needed
5. Create PR with description
6. Request review from team
7. Address feedback
8. Merge when approved

---

## 📝 Notes for Claude Code

### Key Considerations

1. **Data Consistency**: Event times must be stored in EST/EDT (Princeton timezone)
2. **Email Validation**: Only @princeton.edu addresses allowed
3. **Rate Limiting**: Prevent spam (max 5 events/user/day, 1 HoagieMail/user/day)
4. **Moderation**: Implement report review queue for admins
5. **Privacy**: Don't expose user email addresses publicly
6. **Performance**: Implement database indexing for fast queries
7. **Caching**: Cache event lists to reduce database load

### Integration Checklist

When implementing HoagieMail integration:
- [ ] Verify hoagie@lists.princeton.edu forwarding setup
- [ ] Test email parsing with real HoagieMail examples
- [ ] Implement sender verification (email domain must match)
- [ ] Add confirmation step before creating event from email
- [ ] Store original email content for reference
- [ ] Handle edge cases (missing dates, unclear category)
- [ ] Set up monitoring for parsing failures

### Security Considerations

- [ ] Implement CSRF protection on all forms
- [ ] Sanitize user input (prevent XSS)
- [ ] Use parameterized queries (prevent SQL injection)
- [ ] Validate all API inputs with Zod schemas
- [ ] Implement rate limiting on API routes
- [ ] Secure file uploads (validate image types/sizes)
- [ ] Use HTTPS in production
- [ ] Implement proper session management

---

## 📞 Contact

**Project Lead**: Chloe Lau 
**Email**: chloelau@princeton.edu  
**GitHub**: (https://github.com/lauechlo)

**HoagieClub**: hoagieclub@princeton.edu

---

## 📄 License

[MIT License](LICENSE) - Open source for Princeton community

---

**Last Updated**: November 11, 2025  
**Version**: 1.0.0 (MVP in development)
