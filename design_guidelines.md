# AI Legal Translation & Memorandum System - Design Guidelines

## Design Philosophy
A **luxury legal concierge** experience with refined elegance, modern minimalism, and professional sophistication. The interface conveys trust, authority, and premium quality expected in the legal industry.

## Core Design Principles
1. **Bilingual Excellence**: Seamless Arabic/English switching with perfect RTL/LTR support
2. **Professional Trust**: Conservative, authoritative aesthetic suitable for legal professionals
3. **Elegant Minimalism**: Clean, uncluttered interfaces with generous whitespace
4. **Premium Quality**: Every interaction feels refined and intentional

## Typography
**English**: Inter (primary), 400/500/600 weights
**Arabic**: IBM Plex Sans Arabic (primary), 400/500/600 weights
- Display: 2.5rem for hero headings
- Headings: 1.5rem/1.25rem/1rem (h1/h2/h3)
- Body: 1rem (base), 0.875rem for secondary text
- Line height: 1.6 for Arabic, 1.5 for English
- Letter spacing: Slightly loose for elegance

## Color Strategy
### Primary Palette
- **Deep Navy** (#1e3a5f): Primary brand color, authoritative
- **Slate Gray**: Sophisticated neutrals for UI elements
- **Warm Amber**: Warning/disclaimer accents

### Surface Colors
- Light mode: Soft whites with subtle cream undertones
- Dark mode: Deep graphite (#0F1419) with elevated surfaces
- Cards: Subtle elevation with refined shadows

## Layout System
**Spacing Primitives**: 4, 8, 12, 16, 24, 32, 48
- Component padding: p-5, p-6 (generous)
- Section spacing: py-8, py-12
- Form gaps: gap-5, gap-6
- Container: max-w-6xl for main content

## Component Library

### Navigation
- Refined left sidebar with subtle hover states
- User avatar and profile dropdown
- Language toggle (AR/EN) prominently placed
- Active state with subtle accent highlight

### Cards
- Rounded corners (rounded-xl for 12px)
- Subtle shadow in light mode
- Generous internal padding (p-6)
- Clear visual hierarchy

### Forms & Inputs
- Label above input with adequate spacing
- Refined focus rings
- Clear validation states
- Generous input padding

### Buttons
- Primary: Deep navy with smooth hover transition
- Secondary: Outlined with subtle fill on hover
- Ghost: Minimal, text-based

### Trust Elements
- **AI Disclaimer**: Amber banner, always visible, compact
- Status badges: Draft | Under Review | Approved
- Timestamps: Small, subtle, consistent placement

## Dashboard Features
- Welcome message with user name
- Recent memorandums section (last 5)
- Recent translations section (last 5)
- Quick action cards
- Activity statistics

## Responsive Behavior
- Desktop-first (primary use case)
- Tablet: Collapsible sidebar
- Mobile: Simplified navigation

## RTL Implementation
- Automatic layout mirroring
- Text alignment switching
- Icon direction awareness
- Form labels properly aligned

## Animations
- Subtle transitions (150ms ease-out)
- No distracting movements
- Loading skeletons for content
- Smooth hover elevations
