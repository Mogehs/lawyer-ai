# AI Legal Translation & Memorandum System - Design Guidelines

## Design Philosophy
A **luxury legal concierge** experience with refined elegance, modern minimalism, and professional sophistication. The interface conveys trust, authority, and premium quality expected in the legal industry.

## Core Design Principles
1. **Bilingual Excellence**: Seamless Arabic/English switching with perfect RTL/LTR support
2. **Professional Trust**: Conservative, authoritative aesthetic suitable for legal professionals
3. **Elegant Minimalism**: Clean, uncluttered interfaces with generous whitespace
4. **Premium Quality**: Every interaction feels refined and intentional
5. **Gold Accents**: Strategic use of gold/champagne tones for elegance

## Typography
**English**: Inter (primary), 400/500/600 weights
**Arabic**: IBM Plex Sans Arabic (primary), 400/500/600 weights
- Display: 3rem-4rem for hero headings
- Headings: 1.5rem/1.25rem/1rem (h1/h2/h3)
- Body: 1rem (base), 0.875rem for secondary text
- Line height: 1.7 for Arabic, 1.5 for English
- Letter spacing: Slightly loose for elegance

## Color Strategy
### Primary Palette
- **Deep Midnight Navy** (220 60% 30%): Primary brand color, authoritative
- **Gold/Champagne** (38 75% 55%): Accent color for elegance and highlights
- **Slate Neutrals**: Sophisticated grays for UI elements

### Sidebar Colors (Dark Theme)
- Background: Deep navy (220 35% 15%)
- Active item: Subtle elevation with gold highlight
- Text: Light for contrast (220 15% 95%)

### Surface Colors
- Light mode: Soft whites with subtle warm undertones (220 20% 97%)
- Dark mode: Deep navy-black (220 25% 7%) with elevated surfaces
- Cards: Clean white/dark with subtle shadows

### Special Elements
- Gold accent for important actions and highlights
- Amber tones for warnings/disclaimers
- Gradient backgrounds for hero sections

## Layout System
**Spacing Primitives**: 4, 8, 12, 16, 24, 32, 48
- Component padding: p-5, p-6, p-8 (generous)
- Section spacing: py-20, py-24
- Form gaps: gap-5, gap-6
- Container: max-w-6xl for main content

## Component Library

### Navigation
- Dark sidebar with luxury navy background
- Gold-accented logo with gradient
- Subtle hover states with elevation utilities
- Active state with accent background

### Hero Sections
- Gradient background (luxury-gradient utility)
- Subtle pattern overlays
- Large, bold typography
- Gold accent buttons

### Cards
- Rounded corners (rounded-xl)
- Subtle shadow in light mode
- Generous internal padding (p-6, p-8)
- Clear visual hierarchy
- Border-less for cleaner look

### Forms & Inputs
- Label above input with adequate spacing
- Refined focus rings
- Clear validation states
- Generous input padding

### Buttons
- Primary: Deep navy with smooth hover transition
- Gold CTA: Gold background for important actions
- Outline: Subtle border with fill on hover
- Ghost: Minimal, text-based

### Trust Elements
- **AI Disclaimer**: Amber banner, always visible, compact
- Status badges: Draft | Under Review | Approved
- Timestamps: Small, subtle, consistent placement

## Dashboard Features
- Welcome message with user name
- Recent memorandums section (last 5)
- Recent translations section (last 5)
- Quick action cards with gradient accent
- Activity statistics with icons

## Landing Page Features
- Language dropdown (EN/AR) in header
- Hero section with gradient background
- Feature cards in grid layout
- Important notice section
- CTA section with gold button

## Responsive Behavior
- Desktop-first (primary use case)
- Tablet: Collapsible sidebar
- Mobile: Simplified navigation

## RTL Implementation
- Automatic layout mirroring
- Text alignment switching
- Icon direction awareness (arrows rotate)
- Form labels properly aligned

## Animations
- Subtle transitions (150ms ease-out)
- No distracting movements
- Loading skeletons for content
- Smooth hover elevations using utility classes

## Utility Classes
- `luxury-gradient`: Dark gradient background for hero sections
- `luxury-gradient-light`: Light gradient for backgrounds
- `gold-accent`: Gold text color
- `gold-bg`: Gold background with appropriate foreground
- `hover-elevate`: Subtle elevation on hover
- `active-elevate-2`: More pronounced elevation on click
