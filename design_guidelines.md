# Design Guidelines for The Student Hub

## Design Approach
**Reference-Based**: Modern student-focused platforms (Discord for community, Notion for resources, LinkedIn for mentorship) with emphasis on safe, anonymous social interaction.

## Color Palette
- **Primary Teal**: #208090 (buttons, links, highlights)
- **Secondary Purple**: #6366F1 (accent elements, badges)
- **Background**: #F8FAFB (light gray)
- **Surface**: #FFFFFF (cards, modals)
- **Text Primary**: #1F2937 (dark gray)
- **Text Secondary**: #6B7280 (medium gray)
- **Success**: #10B981 | **Warning**: #F59E0B | **Error**: #EF4444

## Typography
- **Headings**: Inter Bold (600) - H1: 32px, H2: 28px, H3: 24px, H4: 20px, H5: 18px, H6: 16px
- **Body**: Inter Regular (400), 14px
- **Small Text**: Inter Regular (400), 12px
- **Code/Monospace**: Courier New, 12px

## Layout System
**Tailwind Spacing**: Primary units: 2, 4, 6, 8, 12, 16, 20, 24 (p-4, m-8, gap-6, etc.)

**Breakpoints**:
- Desktop: 1280px+ (sidebar visible, multi-column layouts)
- Tablet: 768-1023px (collapsible sidebar, 2-column max)
- Mobile: 375-767px (single column, bottom tab nav)

## Navigation
- **Desktop**: Floating top navbar (logo left, nav links center, profile/settings right) + fixed left sidebar with quick links
- **Tablet**: Collapsible hamburger menu, top navbar
- **Mobile**: Bottom tab bar (Connect, Forums, Resources, Clubs, Profile) + hamburger for overflow

## Core Components

**Buttons**:
- Primary CTA: Teal (#208090) background, white text, hover darkens
- Secondary: Light gray outline, hover fills
- Sizes: sm (py-2 px-4), md (py-3 px-6), lg (py-4 px-8)
- Min touch target: 44px height for mobile

**Cards**:
- White background, subtle shadow (shadow-md)
- 8px border-radius (rounded-lg)
- Hover: slight lift (transform translateY(-2px)), shadow-lg
- Padding: p-6 for content

**Forms**:
- Input fields: border, rounded-md, focus:ring-2 ring-teal-500
- Labels above inputs, placeholder text inside
- Error states: red border + error message below
- Validation feedback: green checkmark for success

**Modals**:
- Centered overlay, semi-transparent backdrop
- Close button (top-right X)
- Focus trap, click outside to dismiss
- Smooth fade-in animation (250ms)

**Avatars**: Anonymous icon/initials for profiles, circular, various sizes (sm: 32px, md: 48px, lg: 64px)

**Tags/Badges**: 
- Category tags: rounded-full, px-3 py-1, colored backgrounds (purple, teal, orange)
- Status badges: "Mentor", "Senior", "Verified" with icons

## Page Layouts

**Home/Dashboard**:
- Hero section: Welcoming banner with navigation cards to key sections
- Quick stats row: Active users, forums, mentors (animated counters)
- Feed grid: 2-column (desktop), 1-column (mobile) with recent posts
- Right sidebar: Trending topics, upcoming events, suggested mentors

**Forums/Discussions**:
- Category tabs at top (Academic, Social, Mental Health, Clubs)
- Thread list: Title, author, replies count, last activity
- Search bar with filters
- Thread detail: Original post + nested reply tree with indentation

**Mentorship**:
- Mentor cards grid: 3-column (desktop), 2-column (tablet), 1-column (mobile)
- Each card: Anonymous avatar, expertise tags, rating, "Request Mentorship" button
- Active sessions: Split layout (chat left, session notes/calendar right)

**Resources**:
- Category tabs: Study Materials, Tips, Mental Health, Academic Support
- Resource cards grid with preview, download button, ratings
- Upload button (fixed bottom-right on mobile)

**Clubs & Events**:
- Clubs grid: Club logo, name, member count, "Join" button
- Events calendar: Month/week/day toggle, event cards with date/time/location

## Animations
- **Transitions**: 250ms ease-in-out for all state changes
- **Page Load**: Fade-in on components (stagger by 50ms)
- **Notifications**: Subtle pulse on badge updates
- **Hover States**: Smooth color transitions, slight scale/lift effects
- **Avoid**: Heavy parallax, excessive motion

## Images
**Hero Section**: Modern, inclusive stock photo of diverse students collaborating (Unsplash/Pexels)
- Placement: Home/Dashboard hero background with overlay gradient
- Style: Warm, inviting, campus setting

**Empty States**: Light geometric illustrations for no content scenarios

**Profile Placeholders**: Anonymous avatar icons (user silhouette)

**Club Logos**: User-uploaded, circular cropped, consistent sizing

## Accessibility
- WCAG AA contrast ratios
- Focus indicators on all interactive elements
- Screen reader labels
- Keyboard navigation support
- Touch targets minimum 44px

## Branding
**Logo**: "The Student Hub" text with interconnected circles icon, top-left navbar placement

**Design Style**: Modern, clean, inclusive, minimalist with warm teal/purple accents emphasizing community and safety