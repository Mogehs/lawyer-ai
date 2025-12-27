# AI Legal Translation & Memorandum System - Design Guidelines

## Design Approach
**System-Based Approach**: Professional enterprise design emphasizing trust, clarity, and efficiency. Drawing from Fluent Design principles for data-heavy legal applications, with strong influences from Notion for document editing and Linear for clean form interfaces.

## Core Design Principles
1. **Bilingual Excellence**: Seamless Arabic/English switching with perfect RTL/LTR support
2. **Professional Trust**: Conservative, authoritative aesthetic suitable for legal professionals
3. **Functional Clarity**: Zero ambiguity in workflows and document states
4. **Efficient Workflows**: Minimize clicks, maximize productivity

## Typography
**English**: Inter (primary), 400/500/600 weights
**Arabic**: IBM Plex Sans Arabic (primary), 400/500/600 weights
- Headings: 24px/20px/16px (xl/lg/base)
- Body: 15px (base), 14px (sm) for secondary text
- Monospace: For case numbers, references - 13px
- Line height: 1.6 for Arabic, 1.5 for English
- Text direction switching must be automatic and contextual

## Layout System
**Spacing Primitives**: Use Tailwind units of 3, 4, 6, 8, 12
- Component padding: p-4, p-6
- Section spacing: py-8, py-12
- Form gaps: gap-4, gap-6
- Container max-width: max-w-6xl for main content, max-w-4xl for documents

## Component Library

### Navigation
- Persistent left sidebar (240px wide)
- Two-level navigation: Main modules + sub-sections
- Language toggle (AR/EN) in top-right header
- User profile/firm branding in header
- Breadcrumb trail for deep navigation

### Translation Module Interface
- Split-pane layout: Source (left) | Target (right)
- Document type selector (dropdown)
- Tone selector (chips: Formal/Professional/Concise)
- Jurisdiction selector (Qatar/GCC/Neutral)
- Full-height editor with line numbers
- Floating action buttons: Translate, Export, Save Version
- Translation history sidebar (collapsible)

### Memorandum Drafting Interface
- Multi-step wizard layout:
  1. Memorandum type selection (cards with icons)
  2. Case information form (structured inputs)
  3. AI drafting interface (prompt + generated output)
  4. Edit & refine (WYSIWYG editor)
- Tone strength slider (Strong ← Neutral → Defensive)
- Live preview panel
- Template library (modal overlay)

### Forms & Inputs
- Label above input (not floating)
- Clear validation states with Arabic-appropriate error messages
- Textarea auto-expand for case facts/legal arguments
- Date pickers with Hijri calendar support
- Dropdown menus with search for long lists (courts, case types)

### Document Editor
- Clean toolbar (similar to Notion)
- Formatting: Bold, Italic, Underline, Headings, Lists
- Legal citation insertion tool
- Comment/annotation capability
- Version comparison view (side-by-side diff)

### Trust & Compliance Elements
- Prominent disclaimer banner: "AI-Generated Draft – Lawyer Review Required" (amber background, persistent)
- Status badges: Draft | Under Review | Approved
- Audit trail timestamps (small, subtle, bottom of documents)
- Lock icon for finalized documents

### Modals & Overlays
- Export dialog: Format selection (DOCX/PDF), metadata input
- Template manager: Grid of saved templates with preview
- Version history: Timeline view with restore capability

## Color Strategy
Reserved for implementation - focus on professional blues/grays with amber for warnings

## Responsive Behavior
- Desktop-first (primary use case)
- Tablet: Collapsible sidebar
- Mobile: Not primary target, but basic document viewing supported

## Images
**No hero images** - this is a professional tool, not marketing
**Icons**: Heroicons for UI elements, Font Awesome for legal-specific symbols (scales, gavel)
**Firm Logo**: Placeholder in top-left (white-label ready)

## Critical RTL Implementation
- Automatic text-align switching
- Mirrored layout for sidebar (right-aligned in Arabic)
- Reversed flex/grid directions where appropriate
- Icons that don't flip: arrows, chevrons DO flip; symbolic icons DON'T
- Form labels maintain proper alignment (right-aligned in RTL)

## Animations
**Minimal**: Page transitions (150ms fade), dropdown openings (100ms), success confirmations (subtle scale)