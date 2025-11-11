# 🚀 HoagieCalendar Implementation Checklist (Updated for HoagieMail Tech Stack)

Use this checklist to track your progress as you build HoagieCalendar **using the same tech structure as HoagieMail**.

---

## ⚠️ IMPORTANT CHANGES

This checklist has been **updated** to match HoagieMail's tech stack:

| Removed ❌ | Added ✅ | Reason |
|-----------|---------|--------|
| Tailwind CSS | Plain CSS + CSS Modules | Match HoagieMail |
| NextAuth.js | Hoagie/CAS JWT Auth | Match HoagieMail |
| npm | Yarn | Match HoagieMail |
| System fonts | Poppins + Inter | Hoagie standard |

---

## 📦 Phase 1: Setup & Configuration (Day 1)

### Project Setup
- [ ] Initialize Next.js 14 project with TypeScript (NO Tailwind)
  ```bash
  npx create-next-app@latest hoagiecalendar --typescript --app --no-tailwind --eslint
  ```
- [ ] Switch to Yarn (remove package-lock.json)
  ```bash
  rm package-lock.json && yarn install
  ```
- [ ] Clone HoagieMail to extract hoagie-ui
  ```bash
  git clone https://github.com/lauechlo/mail.git ../hoagiemail
  ```
- [ ] Copy `lib/hoagie-ui` from HoagieMail
  ```bash
  cp -r ../hoagiemail/lib/hoagie-ui ./lib/
  ```
- [ ] Copy ESLint and Prettier configs from HoagieMail
  ```bash
  cp ../hoagiemail/.eslintrc.* . && cp ../hoagiemail/.prettierrc .
  ```
- [ ] Install dependencies (Prisma, React Hook Form, date-fns, ics)
  ```bash
  yarn add prisma @prisma/client react-hook-form zod @hookform/resolvers date-fns ics
  ```
- [ ] Set up Poppins + Inter fonts in `app/layout.tsx`
- [ ] Create CSS structure (variables.css, globals.css, component CSS files)
- [ ] Set up `.env.local` with environment variables
- [ ] Create project structure
  ```
  hoagiecalendar/
  ├── app/
  ├── components/
  ├── lib/
  │   └── hoagie-ui/  ← Copied from HoagieMail
  ├── styles/
  ├── prisma/
  └── types/
  ```

### Database Setup
- [ ] Set up PostgreSQL database (local or Supabase)
- [ ] Copy schema from README to `prisma/schema.prisma`
- [ ] Run `npx prisma migrate dev --name init`
- [ ] Run `npx prisma generate`
- [ ] Test database connection
- [ ] Create seed script with sample events (`prisma/seed.ts`)
- [ ] Run seed script to populate test data
  ```bash
  npx prisma db seed
  ```

### Authentication Setup (Using Hoagie/CAS)
- [ ] Study HoagieMail's auth implementation
  ```bash
  cd ../hoagiemail && grep -r "useAuth\|JWT\|CAS" --include="*.ts" --include="*.tsx"
  ```
- [ ] Copy auth utilities from HoagieMail to `lib/auth.ts`
- [ ] Configure Hoagie/CAS JWT system
- [ ] Create auth API routes (`app/api/auth/...`)
- [ ] Set up session management
- [ ] Create auth middleware for protected routes
- [ ] Test login/logout flow with Princeton credentials

---

## 🧩 Phase 2: Integrate hoagie-ui Components (Day 2)

### Layout Components (Reuse from hoagie-ui)
- [ ] **Import hoagie-ui components**
  ```tsx
  import { Layout, Nav, Footer, AuthButton, ProfileCard, Theme } from '@/lib/hoagie-ui'
  ```
- [ ] **Use `<Layout>` wrapper** in `app/layout.tsx`
- [ ] **Use `<Nav>` component** with calendar branding
  - [ ] Add "hoagiecalendar" logo
  - [ ] Add "+ Add Event" button
  - [ ] Add "Archives" button
  - [ ] Add help icon (?)
  - [ ] Integrate `<ProfileCard>` dropdown
- [ ] **Extend `<ProfileCard>`** with calendar-specific menu items
  - [ ] Saved Events link (with count)
  - [ ] Category Notifications link
  - [ ] Settings link
  - [ ] Logout button
- [ ] **Use `<AuthButton>`** for authentication UI
- [ ] **Use `<Footer>`** component (optional)
- [ ] **Import `theme.css`** for Hoagie design tokens
- [ ] **Test hoagie-ui integration** - verify components render correctly

---

## 🎨 Phase 3: Build Custom Components (Days 3-7)

### Sidebar Component (No hoagie-ui equivalent)
- [ ] **Create `components/Sidebar.tsx`**
  - [ ] Category filters with colored checkboxes
  - [ ] Event count badges per category
  - [ ] Toggle functionality for filters
  - [ ] Quick Actions section
    - [ ] "Saved Events" button with count
    - [ ] "Category Notifications" button
    - [ ] "Export Calendar" button
- [ ] **Create `components/CategoryFilter.tsx`**
  - [ ] Colored checkbox (custom styled)
  - [ ] Category label
  - [ ] Event count
  - [ ] Toggle state management
- [ ] **Create `styles/components/sidebar.css`**
- [ ] **Test sidebar** - verify filters work

### Calendar Components (No hoagie-ui equivalent)
- [ ] **Create `components/calendar/CalendarView.tsx`** (container)
  - [ ] View state management (month/week/day)
  - [ ] Current date state
  - [ ] View switcher integration
- [ ] **Create `components/calendar/CalendarControls.tsx`**
  - [ ] Month/year title display
  - [ ] Previous/Next month buttons
  - [ ] "Today" button
  - [ ] View toggle buttons (Month/Week/Day)
- [ ] **Create `components/calendar/MonthView.tsx`**
  - [ ] 7×5 day grid layout using date-fns
  - [ ] Day headers (Sun-Sat)
  - [ ] Current day highlighting (isToday)
  - [ ] Other month days styling
  - [ ] Event pills per day
  - [ ] Click day to open day view
- [ ] **Create `components/calendar/WeekView.tsx`**
  - [ ] 7-column layout for days
  - [ ] Hourly time slots (8am-7pm)
  - [ ] Events positioned by time
  - [ ] Current day highlighting
  - [ ] Scrollable time grid
- [ ] **Create `components/calendar/DayView.tsx`**
  - [ ] Hourly breakdown
  - [ ] List of events with times
  - [ ] Empty state message
- [ ] **Create `components/EventCard.tsx`**
  - [ ] Category color coding (left border)
  - [ ] Event title (truncated with ellipsis)
  - [ ] Time display
  - [ ] Location icon + text (optional)
  - [ ] Interest count badge ("👥 47 interested")
  - [ ] Click handler to open detail modal
- [ ] **Create `styles/calendar.css`** - extract from prototype
- [ ] **Create `styles/components/event-card.css`**
- [ ] **Test calendar views** - verify navigation and display

### Modal Components (No hoagie-ui equivalent)
- [ ] **Create `components/modals/Modal.tsx`** (base modal wrapper)
  - [ ] Overlay with backdrop
  - [ ] Click outside to close
  - [ ] ESC key to close
  - [ ] Center content
  - [ ] Prevent body scroll when open
- [ ] **Create `components/modals/EventDetailModal.tsx`**
  - [ ] Event title and category tag
  - [ ] Date, time, location display
  - [ ] Full description
  - [ ] Sender information box (name + email)
  - [ ] Original HoagieMail content display
  - [ ] "Save Event" button (toggle state)
  - [ ] "Add to Calendar" button
  - [ ] "Interested" button with count
  - [ ] "Report" link
  - [ ] Close button (X)
- [ ] **Create `components/modals/AddEventModal.tsx`**
  - [ ] React Hook Form setup
  - [ ] Zod schema validation
  - [ ] Form fields: title, description, date, time, location, category
  - [ ] Category dropdown with color indicators
  - [ ] Date picker (HTML5 or library)
  - [ ] Time picker (start & end)
  - [ ] "Send as HoagieMail" checkbox
  - [ ] Submit button with loading state
  - [ ] Validation error messages
  - [ ] Success notification (toast)
- [ ] **Create `components/modals/ExportModal.tsx`**
  - [ ] Event count display
  - [ ] Google Calendar button
  - [ ] Apple Calendar button (.ics download)
  - [ ] Outlook Calendar button
  - [ ] Generic .ics download button
  - [ ] Cancel button
- [ ] **Create `components/modals/ArchivesModal.tsx`**
  - [ ] Search bar with debounced filtering
  - [ ] Category filter checkboxes
  - [ ] Time period filter checkboxes
  - [ ] List of past events (paginated)
  - [ ] "Showing X of Y events" counter
  - [ ] Click event to open EventDetailModal
  - [ ] Report icon on each item
  - [ ] Pagination controls (prev/next)
- [ ] **Create `components/modals/ReportModal.tsx`**
  - [ ] Display event name being reported
  - [ ] Radio buttons for reasons
    - [ ] Duplicate
    - [ ] Spam
    - [ ] Offensive
    - [ ] Incorrect information
    - [ ] Other
  - [ ] Optional details textarea
  - [ ] Warning message about false reports
  - [ ] Submit button
  - [ ] Cancel button
- [ ] **Create `components/modals/TutorialModal.tsx`**
  - [ ] 7-step walkthrough with icons
  - [ ] Pro tip callout box
  - [ ] "Got it!" button
  - [ ] Store "tutorial seen" in localStorage
- [ ] **Create `components/modals/SubscriptionsModal.tsx`**
  - [ ] Toggle switches for each category
  - [ ] Email frequency dropdown (daily/weekly/instant)
  - [ ] Explanation text
  - [ ] "Save Preferences" button
  - [ ] Success confirmation
- [ ] **Create `styles/components/modal.css`** - extract from prototype
- [ ] **Test all modals** - verify open/close behavior

### UI Components (Reusable Utilities)
- [ ] **Create `components/ui/Button.tsx`**
  - [ ] Variants: primary, secondary, danger
  - [ ] Sizes: sm, md, lg
  - [ ] Loading state with spinner
  - [ ] Disabled state
- [ ] **Create `components/ui/Input.tsx`**
  - [ ] Text input with label
  - [ ] Error message display
  - [ ] Required indicator (*)
- [ ] **Create `components/ui/Select.tsx`**
  - [ ] Dropdown with custom styling
  - [ ] Error message display
- [ ] **Create `components/ui/Checkbox.tsx`**
  - [ ] Standard checkbox
  - [ ] Colored checkbox variant
- [ ] **Create `components/ui/Badge.tsx`**
  - [ ] Category color tags
  - [ ] Count badges
- [ ] **Create `components/ui/Spinner.tsx`**
  - [ ] Loading indicator
- [ ] **Create `components/ui/Toast.tsx`**
  - [ ] Success/error notifications
  - [ ] Auto-dismiss after 3s
  - [ ] Close button

---

## 🔌 Phase 4: Backend API Routes (Days 8-12)

### Event Routes
- [ ] **Create `app/api/events/route.ts`** - GET (list) + POST (create)
  - [ ] GET: Query params (month, categories, search, startDate, endDate)
  - [ ] GET: Return paginated results
  - [ ] GET: Add sorting by date
  - [ ] GET: Include event counts by category
  - [ ] POST: Validate input with Zod schema
  - [ ] POST: Check authentication
  - [ ] POST: Insert into database via Prisma
  - [ ] POST: If sendHoagieMail=true, send email
  - [ ] POST: Return created event
- [ ] **Create `app/api/events/[id]/route.ts`** - GET, PATCH, DELETE
  - [ ] GET: Return full event details
  - [ ] GET: Increment view count
  - [ ] GET: Include interest count
  - [ ] PATCH: Verify user is creator or admin
  - [ ] PATCH: Validate changes with Zod
  - [ ] PATCH: Update database
  - [ ] DELETE: Verify user is creator or admin
  - [ ] DELETE: Soft delete (set status="deleted")

### User Event Routes
- [ ] **Create `app/api/saved/route.ts`** - GET user's saved events
  - [ ] Filter by current user (from JWT)
  - [ ] Include full event details (JOIN)
  - [ ] Sort by saved date
- [ ] **Create `app/api/saved/[eventId]/route.ts`** - POST, DELETE
  - [ ] POST: Check authentication
  - [ ] POST: Create saved_event record
  - [ ] POST: Handle duplicate (already saved)
  - [ ] DELETE: Remove saved_event record
- [ ] **Create `app/api/interested/[eventId]/route.ts`** - POST, DELETE
  - [ ] POST: Create interested record
  - [ ] POST: Increment event.interestedCount
  - [ ] POST: Return new count
  - [ ] DELETE: Remove interested record
  - [ ] DELETE: Decrement event.interestedCount

### Subscription Routes
- [ ] **Create `app/api/subscriptions/route.ts`** - GET, POST
  - [ ] GET: Return object with category boolean flags
  - [ ] POST: Create or delete subscription record
  - [ ] POST: Return updated subscriptions object

### Report Routes
- [ ] **Create `app/api/reports/route.ts`** - POST (submit), GET (list, admin only)
  - [ ] POST: Validate reason (enum check)
  - [ ] POST: Create report record
  - [ ] POST: Send notification email to moderators
  - [ ] POST: Return success message
  - [ ] GET: Check if user is admin/moderator
  - [ ] GET: Filter by status (pending, reviewed, etc.)
  - [ ] GET: Include event and reporter details
  - [ ] GET: Paginate results
- [ ] **Create `app/api/reports/[id]/route.ts`** - PATCH (review, admin only)
  - [ ] Check admin authorization
  - [ ] Update status (reviewed, action_taken, dismissed)
  - [ ] Record reviewer (current user)
  - [ ] Update reviewed_at timestamp

### Export Routes
- [ ] **Create `app/api/export/ics/route.ts`** - Generate .ics file
  - [ ] Accept query params: eventIds or filters (month, categories)
  - [ ] Fetch events from database
  - [ ] Generate iCalendar format using `ics` library
  - [ ] Set Content-Type: text/calendar
  - [ ] Set Content-Disposition: attachment
  - [ ] Return as downloadable file

### HoagieMail Integration Routes (Phase 5)
- [ ] **Create `app/api/hoagiemail/parse/route.ts`** - POST (webhook)
  - [ ] Set up SendGrid/SES webhook endpoint
  - [ ] Parse incoming email data
  - [ ] Extract: messageId, from, subject, body, receivedAt
  - [ ] Use AI (GPT-4) to extract event details
  - [ ] Create hoagiemail record with status="pending"
  - [ ] Send confirmation email to sender with edit link
- [ ] **Create `app/api/hoagiemail/[id]/confirm/route.ts`** - GET, POST
  - [ ] GET: Return hoagiemail record with extracted data
  - [ ] POST: Create event from confirmed hoagiemail
  - [ ] POST: Link hoagiemail.event_id to created event
  - [ ] POST: Update hoagiemail.parsing_status to "success"

---

## 🔐 Phase 5: Authentication & Authorization (Days 13-14)

### Auth Implementation (Using Hoagie/CAS)
- [ ] Copy auth code from HoagieMail
  - [ ] `lib/auth.ts` - auth utilities
  - [ ] `lib/hoagie-api.ts` - Hoagie API client
  - [ ] JWT token handling
- [ ] Set up Princeton CAS OAuth flow
- [ ] Implement email domain validation (@princeton.edu only)
- [ ] Create protected route middleware
  ```tsx
  // middleware.ts
  export { default } from '@/lib/auth-middleware'
  ```
- [ ] Add user session management
- [ ] Handle token refresh
- [ ] Test login/logout flow

### Authorization Checks
- [ ] Verify user can create events (authenticated)
- [ ] Verify user can edit own events (creator check)
- [ ] Verify user can delete own events (creator check)
- [ ] Verify admin can moderate reports (role check)
- [ ] Implement rate limiting
  - [ ] Max 5 events per user per day
  - [ ] Max 1 HoagieMail blast per user per day
- [ ] Create admin role checking utility

---

## 🧪 Phase 6: Testing (Days 15-17)

### Unit Tests (Jest + React Testing Library)
- [ ] Set up Jest + React Testing Library
- [ ] Test `<EventCard>` component rendering
- [ ] Test `<MonthView>` date calculations (date-fns)
- [ ] Test category filtering logic
- [ ] Test form validation (Zod schemas)
- [ ] Test API route handlers (mock Prisma)
- [ ] Test auth utilities
- [ ] Aim for >70% code coverage

### Integration Tests
- [ ] Test event creation flow (form → API → DB)
- [ ] Test save event flow (button → API → state update)
- [ ] Test export calendar flow (modal → API → download)
- [ ] Test report submission flow
- [ ] Test authentication flow (login → redirect → protected route)
- [ ] Test filter + search combination

### E2E Tests (Playwright)
- [ ] Set up Playwright
- [ ] Test complete user journey
  - [ ] Login
  - [ ] Browse calendar
  - [ ] Click event → view details
  - [ ] Save event
  - [ ] Create new event
  - [ ] Export calendar
- [ ] Test calendar navigation (prev/next month)
- [ ] Test event creation with HoagieMail checkbox
- [ ] Test mobile responsive design
- [ ] Test cross-browser (Chrome, Firefox, Safari)

---

## 🎯 Phase 7: HoagieMail Integration (Days 18-21)

### Email Service Setup
- [ ] Choose email service (SendGrid or AWS SES)
- [ ] Set up account and API keys
- [ ] Configure domain authentication
- [ ] Set up email forwarding from hoagie@lists.princeton.edu
- [ ] Configure inbound parsing webhook
- [ ] Test webhook endpoint with sample emails

### Email Parsing
- [ ] Create AI prompt for GPT-4 event extraction
- [ ] Test with historical HoagieMails
- [ ] Handle edge cases:
  - [ ] Missing dates
  - [ ] Unclear categories
  - [ ] Multiple events in one email
  - [ ] Non-event emails
- [ ] Store original email content

### Email Templates
- [ ] **Event announcement template** (for HoagieMail blast)
  - [ ] Event title, date, time, location
  - [ ] Category badge
  - [ ] Description
  - [ ] Link to view on HoagieCalendar
  - [ ] Footer with unsubscribe link
- [ ] **Confirmation email template** (parsed events)
  - [ ] "We detected an event in your email!"
  - [ ] Show extracted data
  - [ ] "Click to confirm and edit" button
  - [ ] Expires in 7 days
- [ ] **Category notification template**
  - [ ] New event alert
  - [ ] Event details
  - [ ] Link to calendar
- [ ] **Report notification template** (for moderators)
  - [ ] Event reported
  - [ ] Reason
  - [ ] Reporter details
  - [ ] Review link
- [ ] **Welcome email template**
  - [ ] Introduction to HoagieCalendar
  - [ ] Quick start guide
  - [ ] Link to tutorial

### Testing Email Integration
- [ ] Test sending HoagieMail from calendar
- [ ] Test receiving and parsing HoagieMail
- [ ] Test confirmation flow
- [ ] Test category notifications
- [ ] Test with real Princeton email addresses

---

## 📱 Phase 8: Mobile & Responsive (Days 22-24)

### Mobile Optimization
- [ ] Test on iPhone (Safari iOS)
- [ ] Test on Android (Chrome)
- [ ] Make sidebar collapsible (hamburger menu)
  ```css
  @media (max-width: 768px) {
    .sidebar { /* mobile styles */ }
  }
  ```
- [ ] Optimize touch targets (min 44x44px)
- [ ] Test all modals on mobile (full-screen on small devices)
- [ ] Add swipe gestures for month navigation (optional)
- [ ] Optimize calendar grid for small screens
  - [ ] Stack weeks vertically
  - [ ] Larger event pills
  - [ ] Show fewer event details
- [ ] Test form inputs on mobile keyboards
- [ ] Optimize images (responsive srcset)

### PWA Features (Optional)
- [ ] Create `manifest.json`
- [ ] Add service worker for offline support
- [ ] Enable "Add to Home Screen" prompt
- [ ] Implement offline event viewing (cache API)
- [ ] Add push notification support (browser notifications)

---

## 🚀 Phase 9: Deployment (Days 25-26)

### Pre-deployment Checklist
- [ ] Run production build locally
  ```bash
  yarn build
  yarn start
  ```
- [ ] Fix all TypeScript errors
- [ ] Fix all ESLint warnings
- [ ] Run all tests and ensure they pass
- [ ] Check bundle size (should be <500KB)
- [ ] Optimize images (compress, use WebP)
- [ ] Set up error tracking (Sentry)
  ```bash
  yarn add @sentry/nextjs
  ```
- [ ] Set up analytics (Vercel Analytics)
- [ ] Review security (no exposed secrets, HTTPS only)

### Vercel Deployment
- [ ] Connect GitHub repo to Vercel
- [ ] Configure build settings
  - [ ] Framework: Next.js
  - [ ] Build command: `yarn build`
  - [ ] Output directory: `.next`
- [ ] Set environment variables in Vercel dashboard
  - [ ] DATABASE_URL
  - [ ] HOAGIE_AUTH_SECRET
  - [ ] SENDGRID_API_KEY
  - [ ] OPENAI_API_KEY (for email parsing)
  - [ ] SENTRY_DSN
- [ ] Configure custom domain (calendar.hoagie.io)
- [ ] Set up preview deployments (auto-deploy PRs)
- [ ] Deploy to production
- [ ] Test production deployment thoroughly

### Database Deployment
- [ ] Set up production PostgreSQL (Supabase or Railway)
- [ ] Run migrations on production database
  ```bash
  npx prisma migrate deploy
  ```
- [ ] Seed production with initial data (optional)
- [ ] Set up automated backups (daily)
- [ ] Configure database connection pooling
- [ ] Set up database monitoring (alerts for downtime)

---

## 📊 Phase 10: Monitoring & Analytics (Days 27-28)

### Monitoring Setup
- [ ] Configure Sentry error tracking
- [ ] Set up performance monitoring
- [ ] Set up uptime monitoring (Vercel or Pingdom)
- [ ] Create alert rules
  - [ ] Error rate > 5%
  - [ ] Response time > 2s
  - [ ] Downtime > 1 minute
- [ ] Monitor API response times
- [ ] Set up database query logging

### Analytics
- [ ] Enable Vercel Analytics
- [ ] Track custom events:
  - [ ] Event creation
  - [ ] Event saves
  - [ ] Calendar exports
  - [ ] Category filter usage
  - [ ] Search queries
- [ ] Create analytics dashboard
- [ ] Monitor:
  - [ ] Daily active users
  - [ ] Most popular categories
  - [ ] Peak usage times
  - [ ] Average events per user

---

## 🎉 Phase 11: Launch Preparation (Days 29-30)

### Beta Testing
- [ ] Recruit 10-20 beta testers (Princeton students)
- [ ] Create feedback form (Google Form or Typeform)
- [ ] Send beta invite email with instructions
- [ ] Monitor for bugs (check Sentry dashboard)
- [ ] Gather user feedback
- [ ] Create prioritized bug fix list
- [ ] Iterate based on feedback (2-3 rounds)

### Documentation
- [ ] Write user guide (how to use HoagieCalendar)
- [ ] Create FAQ page (common questions)
- [ ] Document API endpoints (for future integrations)
- [ ] Create troubleshooting guide (common issues)
- [ ] Write developer documentation (for contributors)

### Marketing
- [ ] Create launch announcement email
  - [ ] Target: All Princeton undergrads
  - [ ] Subject: "Introducing HoagieCalendar 🗓️"
  - [ ] Include screenshots
  - [ ] Link to tutorial
- [ ] Design social media graphics
- [ ] Create demo video (2-3 minutes)
  - [ ] Show key features
  - [ ] Walk through event creation
  - [ ] Show HoagieMail integration
- [ ] Plan launch timeline
  - [ ] Beta launch: Week 1
  - [ ] Feedback period: Week 2-3
  - [ ] Public launch: Week 4
- [ ] Coordinate with HoagieClub for launch announcement

---

## 🔄 Phase 12: Post-Launch (Ongoing)

### Week 1 (Monitor Closely)
- [ ] Monitor error rates hourly
- [ ] Respond to user feedback within 24h
- [ ] Fix critical bugs immediately
- [ ] Update documentation based on questions
- [ ] Send "thank you" email to beta testers

### Week 2-4 (Stabilize)
- [ ] Analyze usage patterns
  - [ ] Which categories are most popular?
  - [ ] What times do users visit?
  - [ ] Which features are most used?
- [ ] Optimize slow database queries
- [ ] Add requested features (prioritize by votes)
- [ ] Improve onboarding flow (reduce drop-off)
- [ ] Write blog post about launch

### Ongoing Maintenance
- [ ] Weekly bug fixes (dedicate Friday afternoons)
- [ ] Monthly feature releases (plan roadmap)
- [ ] Quarterly user surveys (gather feedback)
- [ ] Continuous optimization (performance, UX)
- [ ] Security updates (keep dependencies updated)
- [ ] Backup database weekly (verify backups work)

---

## 📝 Quick Reference

### Development Commands

```bash
# Development
yarn dev                    # Start dev server (localhost:3000)
yarn lint                   # Run ESLint
yarn type-check             # TypeScript checks
yarn format                 # Run Prettier

# Database
npx prisma studio           # Open database GUI
npx prisma migrate dev      # Create & run migration
npx prisma db seed          # Seed database
npx prisma generate         # Generate Prisma Client

# Testing
yarn test                   # Run unit tests
yarn test:watch             # Watch mode
yarn test:coverage          # Coverage report
yarn test:e2e               # Run Playwright tests

# Production
yarn build                  # Production build
yarn start                  # Start production server
```

### Important File Paths

```
hoagiecalendar/
├── lib/hoagie-ui/          ← Copied from HoagieMail
├── styles/variables.css    ← Design tokens
├── app/calendar/page.tsx   ← Main calendar page
├── components/Sidebar.tsx  ← Category filters
├── prisma/schema.prisma    ← Database schema
└── .env.local              ← Environment variables
```

### Tech Stack Reference

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 + TypeScript |
| Styling | **Plain CSS** (NOT Tailwind) |
| UI Library | hoagie-ui (from HoagieMail) |
| Fonts | Poppins + Inter |
| Auth | Hoagie/CAS JWT |
| Database | PostgreSQL + Prisma |
| Email | SendGrid/AWS SES |
| Package Manager | **Yarn** (NOT npm) |

---

## 🎯 Progress Tracking

**Last Updated**: November 11, 2025
**Phase**: Setup
**Progress**: 0% Complete

### Completion Status

- [ ] Phase 1: Setup (0/13)
- [ ] Phase 2: hoagie-ui Integration (0/8)
- [ ] Phase 3: Custom Components (0/40)
- [ ] Phase 4: Backend API (0/24)
- [ ] Phase 5: Authentication (0/10)
- [ ] Phase 6: Testing (0/15)
- [ ] Phase 7: HoagieMail Integration (0/18)
- [ ] Phase 8: Mobile & Responsive (0/12)
- [ ] Phase 9: Deployment (0/14)
- [ ] Phase 10: Monitoring & Analytics (0/12)
- [ ] Phase 11: Launch Preparation (0/10)
- [ ] Phase 12: Post-Launch (0/8)

**Total Tasks**: 184
**Completed**: 0
**Remaining**: 184

---

**Let's build this! 🚀**
