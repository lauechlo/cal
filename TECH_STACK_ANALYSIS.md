# HoagieCalendar Tech Stack Analysis
## Comparison with HoagieMail & Adaptation Recommendations

**Date:** November 11, 2025
**Prepared for:** Chloe Lau (@lauechlo)

---

## Executive Summary

After analyzing the HoagieMail repository and comparing it with the HoagieCalendar prototype, several **critical mismatches** have been identified that need to be addressed to ensure consistency across the Hoagie ecosystem.

### 🚨 Key Issues
1. **Typography mismatch** - Prototype doesn't use Hoagie fonts
2. **No component reuse** - Hoagie-UI library not utilized
3. **Inconsistent styling approach** - Inline styles vs. modular CSS
4. **Authentication divergence** - Different auth systems proposed
5. **Missing Hoagie branding** - Color scheme not aligned

---

## Tech Stack Comparison

### HoagieMail (`lauechlo/mail`) - Current Ecosystem

| Category | Technology |
|----------|------------|
| **Frontend Framework** | Next.js |
| **Language** | TypeScript (75.2%), JavaScript (3.5%) |
| **Styling** | Plain CSS (21.3%) |
| **UI Library** | Custom `lib/hoagie-ui` components |
| **Fonts** | Poppins (branding/headers), Inter (body) |
| **Authentication** | JWT + Hoagie/CAS System |
| **Package Manager** | Yarn |
| **Code Quality** | ESLint + Prettier |
| **Components** | AuthButton, Footer, Layout, Nav, ProfileCard, Theme |

### HoagieCalendar (README Recommendations)

| Category | Technology |
|----------|------------|
| **Frontend Framework** | Next.js 14+ (App Router) |
| **Language** | TypeScript |
| **Styling** | ⚠️ Tailwind CSS |
| **State Management** | React Context + React Query |
| **Database** | PostgreSQL 15+ |
| **ORM** | Prisma or Drizzle |
| **Authentication** | ⚠️ NextAuth.js with Princeton CAS/OAuth |
| **Email Service** | SendGrid or AWS SES |
| **Package Manager** | Not specified (should be Yarn) |

### HTML Prototype (User Provided)

| Category | Technology |
|----------|------------|
| **Structure** | Pure HTML with inline `<style>` block |
| **Fonts** | ⚠️ System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto) |
| **Styling** | ⚠️ Inline CSS (10,000+ lines in `<style>` tag) |
| **Colors** | Teal (#5EEAD4, #0F766E), Purple gradient (#E9D5FF → #F3E8FF) |
| **Components** | ⚠️ None - custom HTML elements |
| **Framework** | ⚠️ Vanilla JavaScript (no React) |

---

## Critical Mismatches

### 1. Typography ❌

**Current Prototype:**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

**Should Be (Hoagie Standard):**
```css
/* Headers/Branding */
font-family: 'Poppins', sans-serif;
font-weight: 600;

/* Body Text */
font-family: 'Inter', sans-serif;
```

**Impact:** Breaks visual consistency with HoagieMail and Hoagie ecosystem
**Priority:** 🔴 HIGH

---

### 2. Component Library Integration ❌

**Current Prototype:**
- Custom HTML elements
- No reuse of hoagie-ui components
- Duplicate implementations of common patterns

**Should Use:**
```javascript
import { Nav, Layout, Footer, AuthButton, ProfileCard } from '@/lib/hoagie-ui'
```

**Available Components:**
- `<Nav>` - Navigation bar
- `<Layout>` - Page wrapper
- `<Footer>` - Footer component
- `<AuthButton>` - Authentication button
- `<ProfileCard>` - User profile display
- `<Theme>` - Theming system

**Impact:**
- Increases maintenance burden
- Inconsistent UX across Hoagie apps
- No benefit from shared component updates

**Priority:** 🔴 HIGH

---

### 3. Styling Approach ⚠️

**Current State:**
- Prototype: 10,000+ lines of inline CSS
- README: Recommends Tailwind CSS
- HoagieMail: Uses plain CSS with theme.css

**Recommendation:**
Use **plain CSS** matching HoagieMail approach:

```
hoagiecalendar/
├── styles/
│   ├── globals.css          # Global resets
│   ├── theme.css            # Import from hoagie-ui
│   ├── calendar.css         # Calendar-specific styles
│   └── components/          # Component-specific styles
│       ├── event-card.css
│       ├── modal.css
│       └── sidebar.css
```

**Why Not Tailwind?**
- HoagieMail doesn't use Tailwind
- Would create inconsistency
- CSS modules + plain CSS is more maintainable for this use case

**Priority:** 🟡 MEDIUM

---

### 4. Authentication System ⚠️

**README Proposal:**
```javascript
// NextAuth.js approach
import { signIn, signOut, useSession } from 'next-auth/react'
```

**Hoagie Standard:**
```javascript
// Use existing Hoagie/CAS JWT system
import { useAuth } from '@/lib/hoagie-api'
```

**Recommendation:**
Integrate with **existing Hoagie authentication infrastructure**:
- JWT tokens
- Princeton CAS integration
- Consistent auth flow with HoagieMail

**Impact:** Auth inconsistency would confuse users switching between Hoagie apps
**Priority:** 🔴 HIGH

---

### 5. Color Scheme 🎨

**Prototype Colors:**
```css
/* Header */
background: #5EEAD4;  /* Teal */
color: #0F172A;       /* Dark slate */

/* Dark accents */
background: #0F766E;  /* Dark teal */

/* Page background */
background: linear-gradient(180deg, #E9D5FF 0%, #F3E8FF 100%); /* Purple gradient */

/* Buttons */
primary: #0F766E;     /* Dark teal */
secondary: white with teal border;
```

**Status:**
Unable to verify exact Hoagie brand colors (403 errors on hoagie.io sites)

**Recommendation:**
1. ✅ If teal (#5EEAD4) is the official Hoagie brand color, keep it
2. ⚠️ Verify the purple gradient background fits Hoagie brand
3. 📋 Extract exact color values from HoagieMail codebase
4. 📋 Create shared CSS variables in theme.css

**Action Needed:**
Access HoagieMail's CSS files to extract exact brand colors:
```bash
# Clone HoagieMail repo locally
git clone https://github.com/lauechlo/mail.git
cd mail
# Extract colors from CSS files
grep -r "background.*#" --include="*.css" lib/hoagie-ui/
grep -r "color.*#" --include="*.css" lib/hoagie-ui/
```

---

## Recommended Tech Stack (Aligned with Hoagie Ecosystem)

### Frontend

| Category | Technology | Reason |
|----------|------------|--------|
| **Framework** | Next.js 14+ (App Router) | ✅ Matches HoagieMail |
| **Language** | TypeScript | ✅ Matches HoagieMail (75.2%) |
| **Styling** | Plain CSS + CSS Modules | ✅ Matches HoagieMail approach |
| **UI Components** | `lib/hoagie-ui` (reused) | ✅ Consistency |
| **Fonts** | Poppins + Inter | ✅ Hoagie standard |
| **State** | React Context + React Query | ✅ Good choice |
| **Forms** | React Hook Form + Zod | ✅ Good choice |

### Backend

| Category | Technology | Reason |
|----------|------------|--------|
| **Database** | PostgreSQL 15+ | ✅ Good choice |
| **ORM** | Prisma | ✅ Good DX, type-safe |
| **Auth** | Hoagie/CAS JWT system | ✅ Matches HoagieMail |
| **Email** | SendGrid or AWS SES | ✅ Good choice |

### Tooling

| Category | Technology | Reason |
|----------|------------|--------|
| **Package Manager** | Yarn | ✅ Matches HoagieMail |
| **Linting** | ESLint | ✅ Matches HoagieMail |
| **Formatting** | Prettier | ✅ Matches HoagieMail |
| **Type Checking** | TypeScript strict | ✅ Good practice |

---

## Migration Path: Prototype → Production

### Phase 1: Setup Project Structure ⚙️

```bash
# Initialize Next.js with TypeScript
npx create-next-app@latest hoagiecalendar --typescript --app --no-tailwind

cd hoagiecalendar

# Use Yarn (matching HoagieMail)
yarn install

# Add hoagie-ui as dependency or submodule
# Option A: Copy from HoagieMail
cp -r ../mail/lib/hoagie-ui ./lib/

# Option B: Create as shared package (better long-term)
# @hoagie/ui published to npm
```

### Phase 2: Integrate Hoagie UI Library 🎨

```bash
lib/hoagie-ui/
├── components/
│   ├── AuthButton.tsx
│   ├── Footer.tsx
│   ├── Layout.tsx
│   ├── Nav.tsx
│   ├── ProfileCard.tsx
│   └── Theme.tsx
├── theme.css
└── index.ts
```

**Update Prototype Components:**

**Before (Prototype):**
```html
<div class="header">
    <div class="logo">
        <div class="logo-icon">📅</div>
        <div class="logo-text">hoagie<span>calendar</span></div>
    </div>
    <div class="header-actions">
        <button class="btn btn-secondary">Contact</button>
        <!-- ... -->
    </div>
</div>
```

**After (With hoagie-ui):**
```tsx
import { Nav, Layout } from '@/lib/hoagie-ui'

export default function CalendarPage() {
  return (
    <Layout>
      <Nav
        appName="calendar"
        logo={<>hoagie<span>calendar</span></>}
        rightActions={
          <>
            <button className="btn-secondary">Contact</button>
            <button className="btn-primary">+ Add Event</button>
            <ProfileButton />
          </>
        }
      />
      {/* Calendar content */}
    </Layout>
  )
}
```

### Phase 3: Extract and Modularize Styles 💅

**Current:** 10,000+ lines in `<style>` tag
**Target:** Modular CSS files

```
styles/
├── globals.css           # Global resets + Hoagie theme
├── calendar.css          # Calendar grid styles
├── components/
│   ├── event-card.css
│   ├── modal.css
│   ├── sidebar.css
│   └── filters.css
└── variables.css         # Color palette, spacing, typography
```

**variables.css** (extract from HoagieMail):
```css
:root {
  /* Colors (TO BE EXTRACTED FROM HOAGIEMAIL) */
  --color-primary: #5EEAD4;         /* Teal */
  --color-primary-dark: #0F766E;    /* Dark teal */
  --color-background: #FAFAFA;
  --color-surface: #FFFFFF;
  --color-text-primary: #0F172A;
  --color-text-secondary: #6B7280;
  --color-border: #E5E7EB;

  /* Category colors */
  --color-social: #EF4444;
  --color-academic: #3B82F6;
  --color-food: #F59E0B;
  --color-arts: #A855F7;
  --color-sports: #10B981;
  --color-career: #8B5CF6;
  --color-housing: #F43F5E;
  --color-other: #6B7280;

  /* Typography */
  --font-heading: 'Poppins', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
}
```

### Phase 4: Convert Vanilla JS to React Components 🧩

**Example: Event Modal**

**Before (Vanilla JS in `<script>` tag):**
```javascript
function showEventModal(eventName, category) {
    const modal = document.getElementById('eventModal');
    const data = eventData[eventName];
    document.getElementById('modalTitle').textContent = eventName;
    modal.classList.add('active');
}
```

**After (React Component):**
```tsx
// components/modals/EventDetailModal.tsx
import { useState } from 'react'
import { Event } from '@/types'

interface EventDetailModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
}

export function EventDetailModal({ event, isOpen, onClose }: EventDetailModalProps) {
  if (!event || !isOpen) return null

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className={`event-tag cat-${event.category}`}>
              {categoryMap[event.category]}
            </span>
            <h2>{event.title}</h2>
            <div className="modal-time">{event.time}</div>
          </div>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <p>{event.description}</p>

        {/* Original HoagieMail preview */}
        <div className="email-preview">
          <h3>📧 ORIGINAL HOAGIEMAIL</h3>
          <div className="sender-info">
            <strong>From:</strong> {event.senderName} ({event.senderEmail})
          </div>
          <div className="email-body">{event.emailContent}</div>
        </div>

        <div className="modal-actions">
          <button className="btn-primary" onClick={() => saveEvent(event.id)}>
            ⭐ Save Event
          </button>
          <button className="btn-secondary" onClick={() => exportToCalendar(event)}>
            📅 Add to Calendar
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Phase 5: Integrate Hoagie Authentication 🔐

```typescript
// lib/auth.ts
import { useEffect, useState } from 'react'

// Import from Hoagie API (same as HoagieMail)
export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Use JWT token from Hoagie/CAS system
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        setUser(data.user)
        setLoading(false)
      })
  }, [])

  return { user, loading }
}
```

**Update Profile Button:**
```tsx
import { useAuth } from '@/lib/auth'
import { ProfileCard } from '@/lib/hoagie-ui'

export function ProfileButton() {
  const { user } = useAuth()

  return (
    <ProfileCard
      name={user?.name || 'User'}
      email={user?.email || ''}
      initials={user?.name?.split(' ').map(n => n[0]).join('') || 'CL'}
      menuItems={[
        { icon: '⭐', label: 'Saved Events', href: '/saved' },
        { icon: '🔔', label: 'Category Notifications', href: '/notifications' },
        { icon: '⚙️', label: 'Settings', href: '/settings' },
        { icon: '🚪', label: 'Log Out', onClick: handleLogout },
      ]}
    />
  )
}
```

---

## Action Items

### Immediate (Before Writing Any Code) 🚨

- [ ] **Clone HoagieMail repository locally** to extract:
  - [ ] Exact brand colors from CSS files
  - [ ] `lib/hoagie-ui` components
  - [ ] Authentication integration code
  - [ ] Theme tokens and design system values

```bash
git clone https://github.com/lauechlo/mail.git
cd mail
yarn install
# Explore the codebase
```

- [ ] **Create design system documentation**
  - [ ] Extract all color values
  - [ ] Document typography scale
  - [ ] List spacing values
  - [ ] Capture button styles
  - [ ] Screenshot HoagieMail UI for reference

- [ ] **Set up shared hoagie-ui package** (if not already done)
  - [ ] Option A: Copy `lib/hoagie-ui` to HoagieCalendar
  - [ ] Option B: Create `@hoagie/ui` npm package
  - [ ] Option C: Use Git submodules

### Phase 1: Foundation (Week 1)

- [ ] Initialize Next.js 14+ with TypeScript (no Tailwind)
- [ ] Set up Yarn as package manager
- [ ] Configure ESLint + Prettier (match HoagieMail config)
- [ ] Import hoagie-ui library
- [ ] Set up CSS structure with theme.css
- [ ] Add Poppins + Inter fonts
- [ ] Create color variables CSS file

### Phase 2: Core Components (Week 2)

- [ ] Convert header → use `<Nav>` from hoagie-ui
- [ ] Convert page layout → use `<Layout>` from hoagie-ui
- [ ] Convert profile dropdown → use `<ProfileCard>` from hoagie-ui
- [ ] Create `<CalendarGrid>` component (month view)
- [ ] Create `<EventCard>` component
- [ ] Create `<CategoryFilter>` component

### Phase 3: Modals & Interactions (Week 3)

- [ ] Convert event detail modal to React component
- [ ] Convert add event modal to React component
- [ ] Convert export calendar modal to React component
- [ ] Convert report modal to React component
- [ ] Add proper React state management
- [ ] Implement form validation with React Hook Form + Zod

### Phase 4: Backend Integration (Week 4-6)

- [ ] Set up PostgreSQL database
- [ ] Create Prisma schema (use schema from README)
- [ ] Build API routes for events
- [ ] Integrate Hoagie/CAS authentication
- [ ] Connect frontend to API
- [ ] Test with real data

---

## File Structure (Recommended)

```
hoagiecalendar/
├── app/                              # Next.js 14 App Router
│   ├── layout.tsx                    # Root layout (uses hoagie-ui <Layout>)
│   ├── page.tsx                      # Home → redirects to /calendar
│   ├── calendar/
│   │   ├── page.tsx                  # Main calendar page
│   │   └── layout.tsx
│   ├── archives/
│   │   └── page.tsx                  # Archives page
│   ├── saved/
│   │   └── page.tsx                  # Saved events
│   ├── api/                          # API routes
│   │   ├── events/
│   │   │   ├── route.ts              # GET /api/events
│   │   │   └── [id]/
│   │   │       └── route.ts          # GET/PATCH/DELETE /api/events/:id
│   │   ├── saved/
│   │   ├── subscriptions/
│   │   ├── reports/
│   │   └── export/
│   └── globals.css                   # Import theme.css + base styles
├── components/
│   ├── calendar/
│   │   ├── MonthView.tsx
│   │   ├── WeekView.tsx
│   │   ├── DayView.tsx
│   │   ├── EventCard.tsx
│   │   └── CalendarControls.tsx
│   ├── modals/
│   │   ├── EventDetailModal.tsx
│   │   ├── AddEventModal.tsx
│   │   ├── ExportModal.tsx
│   │   ├── ArchivesModal.tsx
│   │   └── ReportModal.tsx
│   ├── sidebar/
│   │   ├── Sidebar.tsx
│   │   ├── CategoryFilters.tsx
│   │   └── QuickActions.tsx
│   └── ui/                           # Shared UI components
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── Input.tsx
├── lib/
│   ├── hoagie-ui/                    # Copied from HoagieMail
│   │   ├── components/
│   │   │   ├── AuthButton.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── Nav.tsx
│   │   │   ├── ProfileCard.tsx
│   │   │   └── Theme.tsx
│   │   ├── theme.css
│   │   └── index.ts
│   ├── db.ts                         # Prisma client
│   ├── auth.ts                       # Hoagie/CAS auth helpers
│   ├── email.ts                      # Email service
│   └── utils.ts
├── styles/
│   ├── globals.css                   # Global resets
│   ├── variables.css                 # Design tokens
│   ├── calendar.css                  # Calendar-specific
│   └── components/
│       ├── event-card.css
│       ├── modal.css
│       └── sidebar.css
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── types/
│   └── index.ts
├── public/
│   └── icons/
├── package.json
├── yarn.lock                         # Use Yarn!
├── tsconfig.json
├── .eslintrc.js                      # Match HoagieMail config
├── .prettierrc                       # Match HoagieMail config
└── README.md
```

---

## Summary

### ✅ What's Good in the Prototype

1. **Comprehensive UI design** - All features visualized
2. **Clear user flows** - Well thought out interactions
3. **Feature completeness** - Modal system, filters, exports all designed
4. **Category system** - Good categorization with colors
5. **Accessibility considerations** - Keyboard shortcuts, proper labeling

### ⚠️ What Needs to Change

1. **Use Poppins + Inter fonts** (not system fonts)
2. **Integrate hoagie-ui components** (Nav, Layout, ProfileCard)
3. **Extract inline CSS** to modular CSS files
4. **Convert vanilla JS** to React components
5. **Use Hoagie/CAS authentication** (not NextAuth)
6. **Verify brand colors** by extracting from HoagieMail
7. **Use Yarn** as package manager
8. **Set up proper Next.js project structure**

### 🎯 Priority Matrix

| Priority | Task | Reason |
|----------|------|--------|
| 🔴 **P0** | Clone HoagieMail & extract design system | Blocks all UI work |
| 🔴 **P0** | Set up Next.js with proper structure | Foundation for everything |
| 🔴 **P0** | Integrate hoagie-ui components | Core requirement for consistency |
| 🔴 **P0** | Implement Hoagie/CAS auth | Security critical |
| 🟡 **P1** | Convert to React components | Modernization |
| 🟡 **P1** | Modularize CSS | Maintainability |
| 🟢 **P2** | Add animations/transitions | Polish |

---

## Questions for Discussion

1. **Color Scheme**: Is the teal (#5EEAD4) + purple gradient the official Hoagie brand? Should we verify/change colors?

2. **hoagie-ui Distribution**: Should we:
   - A) Copy `lib/hoagie-ui` directly into HoagieCalendar?
   - B) Create a shared `@hoagie/ui` npm package?
   - C) Use Git submodules?

3. **Calendar Library**: Do we need a calendar library (react-big-calendar, FullCalendar) or build from scratch?

4. **Mobile Support**: The prototype is desktop-first. What's the mobile strategy?
   - Responsive web design?
   - Separate mobile site?
   - Native app?

5. **HoagieMail Integration**: Should we implement email parsing in MVP or start with manual event creation?

---

## Next Steps

**Recommended order:**

1. **Meet with HoagieClub team** to:
   - Confirm brand colors
   - Get access to hoagie-ui library
   - Understand authentication flow
   - Align on tech decisions

2. **Clone and study HoagieMail**:
   ```bash
   git clone https://github.com/lauechlo/mail.git
   cd mail
   yarn install
   yarn dev  # See it running locally
   ```

3. **Extract design tokens**:
   - Document all colors, fonts, spacing
   - Screenshot UI patterns
   - Create design system guide

4. **Initialize HoagieCalendar with proper setup**:
   ```bash
   npx create-next-app@latest hoagiecalendar --typescript --app --no-tailwind
   # Copy hoagie-ui
   # Set up ESLint/Prettier
   # Configure auth
   ```

5. **Build MVP iteratively** following the migration phases above

---

## Resources

- **HoagieMail Repo**: https://github.com/lauechlo/mail
- **Hoagie Club**: https://club.hoagie.io
- **Hoagie Platform**: https://hoagie.io
- **Next.js 14 Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs

---

**Prepared by:** Claude Code
**For:** HoagieCalendar Project (@lauechlo)
**Last Updated:** November 11, 2025
