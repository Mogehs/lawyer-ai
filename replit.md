# AI Legal Translation & Memorandum Writing System

## Overview
A private AI system for legal translation (Arabic ↔ English) and legal memorandum drafting. Designed as an assistive drafting tool for law firms with full bilingual support and RTL/LTR interface switching.

## Architecture

### Frontend (client/)
- **Framework**: React + TypeScript + Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: Wouter
- **Localization**: Custom i18n provider with Arabic/English support and automatic RTL switching
- **Theme**: Light/Dark mode with ThemeProvider

### Backend (server/)
- **Framework**: Express.js
- **AI Integration**: OpenAI via Replit AI Integrations (gpt-4o model)
- **Storage**: In-memory storage (MemStorage)

### Key Files
- `client/src/lib/i18n.tsx` - Localization provider with all Arabic/English translations
- `client/src/lib/theme-provider.tsx` - Dark/Light theme provider
- `client/src/components/app-sidebar.tsx` - Main navigation sidebar
- `client/src/pages/translation.tsx` - Legal translation module
- `client/src/pages/memorandum.tsx` - Memorandum drafting wizard
- `client/src/pages/history.tsx` - Document history viewer
- `server/routes.ts` - API endpoints including AI translation and memo generation
- `server/storage.ts` - In-memory data storage
- `shared/schema.ts` - TypeScript types and Zod schemas

## Features

### Module 1: AI Legal Translation
- Arabic ↔ English translation
- Supported document types: Legal memorandums, contracts, statements of claim, court judgments, legal correspondence
- Configurable: Document purpose (Court/Internal/Client), Writing tone (Formal/Professional/Concise), Jurisdiction (Qatar/GCC/Neutral)
- Version history tracking

### Module 2: AI Legal Memorandum Drafting
- Supported types: Defense, Response, Reply, Statement of Claim, Appeal, Legal Motions
- Multi-step wizard interface
- Configurable writing strength: Strong, Neutral, Defensive
- Case information input: Court name, case number, facts, legal requests, defense points
- Version tracking

## API Endpoints

### Translations
- `GET /api/translations` - List all translations
- `GET /api/translations/:id` - Get single translation
- `POST /api/translate` - Create new translation with AI
- `DELETE /api/translations/:id` - Delete translation

### Memorandums
- `GET /api/memorandums` - List all memorandums
- `GET /api/memorandums/:id` - Get single memorandum
- `POST /api/memorandums/generate` - Generate memorandum with AI
- `DELETE /api/memorandums/:id` - Delete memorandum

## Development

### Running the Application
```bash
npm run dev
```

### Key Commands
- Frontend binds to port 5000
- Backend API available at `/api/*`

## Design System
- Uses IBM Plex Sans Arabic for Arabic text
- Uses Inter for English text
- Professional blue color scheme
- Automatic RTL/LTR switching based on language selection
- AI disclaimer banner always visible

## Recent Changes
- December 2024: Initial implementation with full translation and memorandum modules
- Full Arabic localization with RTL support
- OpenAI integration for AI-powered translation and drafting
