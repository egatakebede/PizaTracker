# Evangelism Onboarding - Developer Handoff Documentation

## Project Overview

A mobile-first Telegram Mini App designed for evangelism team onboarding and training. The application supports two user roles: **Admin** and **User**, with comprehensive features for content management, learning, and progress tracking.

---

## Tech Stack

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS v4.0
- **Icons**: Lucide React
- **Deployment**: Telegram WebView compatible

---

## Design System

### Color Palette (Warm & Trustworthy)

```css
/* Primary - Orange (Warm, Inviting) */
bg-orange-50    /* Light backgrounds */
bg-orange-100   /* Subtle highlights */
bg-orange-500   /* Primary actions */
bg-orange-600   /* Hover states */
text-orange-600 /* Accents */

/* Secondary - Amber */
bg-amber-50     /* Gradients */
bg-amber-500    /* Secondary actions */

/* Success - Green */
bg-green-50, bg-green-100, bg-green-500, text-green-600

/* Error/Danger - Red */
bg-red-50, bg-red-500, text-red-600

/* Neutral - Gray */
bg-gray-50      /* Page backgrounds */
bg-gray-100     /* Card backgrounds */
bg-gray-200     /* Borders */
text-gray-500   /* Secondary text */
text-gray-600   /* Body text */
text-gray-700   /* Labels */
text-gray-900   /* Headings */
```

### Typography Tokens

Defined in `/styles/globals.css`:

```css
--text-xs: 0.75rem;    /* 12px - Helper text */
--text-sm: 0.875rem;   /* 14px - Small text */
--text-base: 1rem;     /* 16px - Body text */
--text-lg: 1.125rem;   /* 18px - Subheadings */
--text-xl: 1.25rem;    /* 20px - Section headings */
--text-2xl: 1.5rem;    /* 24px - Page headings */
--text-3xl: 1.875rem;  /* 30px - Hero text */
```

### Spacing Scale

```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
```

### Border Radius

```css
rounded-lg   /* 0.5rem - 8px */
rounded-xl   /* 0.75rem - 12px */
rounded-2xl  /* 1rem - 16px */
rounded-full /* Perfect circles */
```

---

## Component Architecture

### Core Components

#### 1. **InviteCodeEntry** (`/components/InviteCodeEntry.tsx`)

**Purpose**: User signup flow via invite code validation

**Props**:
```typescript
interface InviteCodeEntryProps {
  onSuccess: (name: string, language: 'en' | 'am' | 'om' | 'ti') => void;
  onCancel?: () => void;
}
```

**States**:
- Code entry (with validation)
- Profile creation (name + language selection)
- Loading state during validation
- Error state for invalid codes

**Valid Demo Codes**: `WELCOME2024`, `TEAM123`, `FAITH777`

---

#### 2. **TopicCard** (`/components/TopicCard.tsx`)

**Purpose**: Display topic preview with progress

**Props**:
```typescript
interface TopicCardProps {
  topic: Topic;
  progress: number; // 0-100
  onClick: () => void;
}
```

**Visual Features**:
- Difficulty badge (beginner/intermediate/advanced)
- Progress bar (if started)
- Quiz question count
- Completion indicator

---

#### 3. **LessonViewer** (`/components/LessonViewer.tsx`)

**Purpose**: Display full lesson content with media and verses

**Props**:
```typescript
interface LessonViewerProps {
  topic: Topic;
  user: User;
  onClose: () => void;
}
```

**Features**:
- HTML content rendering
- Bible verse display with copy-to-clipboard
- Media player UI (audio/video)
- Share to Telegram functionality
- CTA to start quiz

---

#### 4. **QuizComponent** (`/components/QuizComponent.tsx`)

**Purpose**: Interactive quiz with immediate feedback

**Props**:
```typescript
interface QuizComponentProps {
  topic: Topic;
  user: User;
  onClose: () => void;
  onComplete: () => void;
}
```

**Flow**:
1. Question display with 4 options
2. Answer selection
3. Immediate feedback (correct/incorrect)
4. Explanation display
5. Next question
6. Final score and completion screen
7. Option to retake

**Pass threshold**: 70%

---

#### 5. **TopicEditor** (`/components/TopicEditor.tsx`)

**Purpose**: Admin CRUD interface for topics

**Features**:
- Basic info (title, summary, category, difficulty)
- HTML content editor
- Bible verse management (add/remove)
- Quiz question builder
- Media attachments
- Publish toggle

---

#### 6. **InviteCodeModal** (`/components/InviteCodeModal.tsx`)

**Purpose**: Admin invite code generation

**Options**:
- Code type: Single-use vs Multi-use
- Expiry: 1-365 days
- Actions: Copy code, Share on Telegram

---

### Admin Dashboard Components

- `AdminDashboard`: Main admin container with sidebar navigation
- `AdminHome`: Dashboard with stats and recent activity
- `AdminTopics`: Topic list with search and filters
- `AdminUsers`: User management and invite tracking
- `AdminSettings`: Account settings and audit logs

### User App Components

- `UserApp`: Main user container with bottom tab navigation
- `UserHome`: Home screen with assigned topics and progress
- `UserTopics`: Browse all available topics with search
- `UserProgress`: Progress tracking and stats
- `UserProfile`: User settings and help options
- `UserOnboarding`: Multi-step onboarding wizard

---

## Data Models

### Topic JSON Structure

```typescript
interface Topic {
  id: string;
  title: string;
  summary: string; // 1-2 lines
  contentHtml: string; // Rich text lesson content
  verses: Array<{
    book: string;
    chapter: number;
    verse: string; // Can be range: "19-20"
    text: string;
  }>;
  media: Array<{
    type: 'image' | 'audio' | 'video';
    url: string;
    title?: string;
  }>;
  quiz: Array<{
    q: string;
    options: string[]; // Always 4 options
    answerIndex: number; // 0-3
    explanation: string;
  }>;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  languages: string[]; // ['en', 'am', 'om', 'ti']
  category: string;
  published: boolean;
  createdAt: string; // ISO date
  createdBy: string; // Admin user ID
}
```

### Invite Code JSON Structure

```typescript
interface InviteCode {
  code: string; // e.g., "WELCOME2024"
  type: 'single' | 'multi';
  expiresAt: string; // ISO date
  issuedBy: string; // Admin user ID
  usedBy?: string[]; // User IDs who used this code
  isActive: boolean;
}
```

### User JSON Structure

```typescript
interface User {
  id: string;
  name: string;
  email?: string; // Optional for users
  role: 'admin' | 'user';
  language: 'en' | 'am' | 'om' | 'ti';
  assignedTopics: string[]; // Topic IDs
  progress: Record<string, number>; // topicId: percentage (0-100)
  onboardingComplete: boolean;
}
```

---

## Key User Flows

### 1. User Signup Flow

```
Landing → Enter Invite Code → Validate Code → Create Profile → Onboarding → Home
```

**Validation**: Code must exist in database and not be expired

### 2. User Learning Flow

```
Home → Select Topic → Read Lesson → View Verses/Media → Take Quiz → See Results → Mark Complete
```

**Progress Tracking**: Update `user.progress[topicId]` after quiz completion

### 3. Admin Topic Creation Flow

```
Topics List → Create New → Fill Details → Add Verses → Add Questions → Preview → Publish
```

### 4. Admin Invite Flow

```
Users → Generate Invite → Select Type & Expiry → Generate → Copy/Share via Telegram
```

---

## Responsive Design

### Mobile-First Approach

- **Primary**: 320px - 768px (Telegram WebView)
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Key Breakpoints (Tailwind)

```css
sm:  640px   /* Small tablets */
md:  768px   /* Tablets */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
```

### Mobile Optimizations

- Bottom tab navigation (user app)
- Sticky headers with shadow
- Touch-friendly buttons (min 44px height)
- Safe area insets for iOS:
  ```css
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
  ```
  Apply with: `pb-20 safe-area-inset-bottom`

---

## State Management

Currently using React useState for simplicity. For production, consider:

1. **Context API** for global user state
2. **React Query** for server data caching
3. **Zustand** for complex client state

### Recommended Backend Integration

This prototype uses **mock data**. For production:

#### Option 1: Supabase (Recommended)

**Tables**:
- `users` (auth + profile)
- `topics` (content management)
- `invite_codes` (code tracking)
- `user_progress` (learning progress)
- `quiz_attempts` (quiz history)

**Auth**: Supabase Auth with invite code validation
**Storage**: For media files (audio/video/images)
**RLS**: Row-level security for multi-tenant isolation

#### Option 2: Firebase

- Firestore for data
- Firebase Auth
- Cloud Storage for media

#### Option 3: Custom REST API

---

## Telegram Mini App Integration

### 1. WebView Setup

Add to `index.html` head:
```html
<script src="https://telegram.org/js/telegram-web-app.js"></script>
```

### 2. Access Telegram API

```typescript
const tg = window.Telegram.WebApp;

// Expand to full height
tg.expand();

// Theme colors
const bgColor = tg.themeParams.bg_color;
const textColor = tg.themeParams.text_color;

// Close app
tg.close();

// User info
const telegramUser = tg.initDataUnsafe.user;
```

### 3. Share Functionality

Already implemented in `LessonViewer` and `InviteCodeModal`:
```typescript
const shareUrl = `https://t.me/share/url?text=${encodeURIComponent(message)}`;
window.open(shareUrl, '_blank');
```

---

## Accessibility Guidelines

### Color Contrast

All text meets **WCAG AA** standards:
- Normal text: 4.5:1
- Large text: 3:1

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Focus states visible (Tailwind `focus:ring-2`)

### Screen Readers

- Semantic HTML (`<header>`, `<nav>`, `<main>`)
- ARIA labels on icon-only buttons
- Alt text placeholders for images

### Text Scaling

- Uses `rem` units for responsive font scaling
- Supports up to 200% zoom without horizontal scroll

---

## Multi-Language Support (i18n)

### Current Implementation

Language selection stored in `user.language`:
- `en`: English
- `am`: Amharic (አማርኛ)
- `om`: Afaan Oromo
- `ti`: Tigrigna (ትግርኛ)

### Recommended Libraries

1. **react-i18next**: Full i18n solution
2. **next-intl**: If using Next.js

### Content Translation

Topics should have `languages` array indicating available translations. Filter topics by user's preferred language.

---

## Performance Optimizations

### Current

- Component code splitting (React.lazy potential)
- Memoization candidates: `TopicCard`, `QuizComponent`

### Recommended

1. **Image Optimization**
   - Use WebP format
   - Lazy load images below fold
   - Responsive images with srcset

2. **Code Splitting**
   ```typescript
   const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
   ```

3. **Virtual Scrolling**
   - Use `react-window` for long topic lists

4. **Caching**
   - Cache topic content locally
   - Service Worker for offline support

---

## Security Considerations

### Important Notes

⚠️ **Figma Make is NOT for PII or sensitive data**

For production:

1. **Authentication**
   - Secure JWT tokens
   - HTTPS only
   - CSRF protection

2. **Invite Codes**
   - Server-side validation
   - Rate limiting on code attempts
   - Expiry enforcement

3. **Content Security**
   - Sanitize HTML content before rendering
   - XSS protection for user-generated content
   - Use DOMPurify for HTML sanitization

4. **API Security**
   - API rate limiting
   - Input validation
   - SQL injection prevention (use parameterized queries)

---

## Testing Checklist

### User Flows

- [ ] Invite code validation (valid/invalid/expired)
- [ ] User signup and onboarding
- [ ] Topic browsing and search
- [ ] Lesson viewing with media
- [ ] Quiz taking (all paths: pass/fail/retake)
- [ ] Progress tracking updates
- [ ] Share to Telegram functionality

### Admin Flows

- [ ] Admin login
- [ ] Topic creation (all fields)
- [ ] Topic editing
- [ ] Invite code generation (single/multi)
- [ ] User management view
- [ ] Analytics display

### Responsive Testing

- [ ] iPhone SE (320px)
- [ ] iPhone 12/13 (390px)
- [ ] iPad (768px)
- [ ] Desktop (1024px+)

### Accessibility

- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast validation
- [ ] Text scaling (200%)

---

## Deployment

### Environment Variables

```env
# Backend API
REACT_APP_API_URL=https://your-api.com

# Supabase (if using)
REACT_APP_SUPABASE_URL=https://xxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-key

# Telegram
REACT_APP_TELEGRAM_BOT_TOKEN=your-bot-token
```

### Build for Production

```bash
npm run build
```

### Telegram Bot Setup

1. Create bot via @BotFather
2. Set Mini App URL
3. Configure bot commands
4. Test in Telegram

---

## File Structure

```
/
├── App.tsx                    # Main app entry, routing logic
├── components/
│   ├── AdminDashboard.tsx     # Admin container
│   ├── AdminHome.tsx          # Dashboard stats
│   ├── AdminTopics.tsx        # Topic management
│   ├── AdminUsers.tsx         # User management
│   ├── AdminSettings.tsx      # Settings & logs
│   ├── AdminLogin.tsx         # Admin auth
│   ├── UserApp.tsx            # User container
│   ├── UserHome.tsx           # User home screen
│   ├── UserTopics.tsx         # Topic browser
│   ├── UserProgress.tsx       # Progress tracking
│   ├── UserProfile.tsx        # User profile & settings
│   ├── UserOnboarding.tsx     # Multi-step onboarding
│   ├── InviteCodeEntry.tsx    # Invite validation
│   ├── TopicCard.tsx          # Topic list item
│   ├── LessonViewer.tsx       # Lesson detail view
│   ├── QuizComponent.tsx      # Interactive quiz
│   ├── TopicEditor.tsx        # Admin topic CRUD
│   └── InviteCodeModal.tsx    # Invite generation
├── data/
│   └── mockTopics.ts          # Sample data
└── styles/
    └── globals.css            # Design tokens & base styles
```

---

## Sample Copy (Microcopy)

### Invite Code Screen
- **Title**: "Enter Invite Code"
- **Subtitle**: "Your team admin sent this to you. No code = no signup."
- **Error**: "That code isn't valid or has expired. Ask your team admin to send a new one."

### Quiz Feedback
- **Correct**: "Nice — that's right! Here's why..."
- **Incorrect**: "Not quite. Here's the explanation:"

### Admin Actions
- **Publish Confirmation**: "Publish topic — visible to invited users?"
- **Delete Warning**: "This action cannot be undone. Delete topic?"

### Empty States
- **No Topics**: "No topics yet. Your admin will assign topics to you soon. Check back later!"
- **No Users**: "No users found. Generate an invite code to get started."

---

## Known Limitations (Prototype)

1. **No real backend** - Uses mock data
2. **No authentication** - Simulated login
3. **No file uploads** - Media URLs are placeholders
4. **No real-time updates** - Would need WebSocket/Supabase Realtime
5. **No offline support** - Would need Service Worker

---

## Next Steps for Production

1. **Backend Integration**
   - Set up Supabase or custom API
   - Implement authentication
   - Set up database tables

2. **Media Management**
   - Implement file upload
   - Video/audio hosting (Cloudinary, S3)
   - Transcoding pipeline

3. **Advanced Features**
   - Push notifications (Telegram Bot API)
   - Real-time progress updates
   - Group discussions
   - Leaderboards/gamification

4. **Localization**
   - Complete translations (Amharic, Afaan Oromo, Tigrigna)
   - RTL support if needed

5. **Analytics**
   - User engagement tracking
   - Completion rates
   - Quiz performance analytics

---

## Support & Questions

For implementation questions or clarifications on the design system, refer to:
- Component source code (inline comments)
- TypeScript interfaces in `App.tsx`
- Design tokens in `/styles/globals.css`

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: Prototype Ready for Development Handoff
