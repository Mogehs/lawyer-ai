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
- **AI Integration**: OpenAI GPT-4o (configurable via environment variables)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Custom email/password authentication with bcrypt

### Key Files
- `client/src/lib/i18n.tsx` - Localization provider with all Arabic/English translations
- `client/src/lib/theme-provider.tsx` - Dark/Light theme provider
- `client/src/lib/queryClient.ts` - API client with configurable base URL
- `client/src/components/app-sidebar.tsx` - Main navigation sidebar
- `client/src/pages/translation.tsx` - Legal translation module
- `client/src/pages/memorandum.tsx` - Memorandum drafting wizard
- `client/src/pages/history.tsx` - Document history viewer
- `client/src/pages/auth.tsx` - Authentication (login/register)
- `server/routes.ts` - API endpoints including AI translation and memo generation
- `server/auth.ts` - Authentication middleware and routes
- `server/storage.ts` - PostgreSQL storage with Drizzle ORM
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

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout current session
- `GET /api/auth/user` - Get current authenticated user

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

## Environment Variables

### Backend (.env)
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key
- `OPENAI_BASE_URL` - (Optional) Custom OpenAI endpoint
- `SESSION_SECRET` - Secret for session encryption
- `CORS_ORIGIN` - (Optional) Allowed CORS origins for separate deployment
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

### Frontend (client/.env)
- `VITE_API_BASE_URL` - Backend API URL (leave empty for same-origin)

## Development

### Running the Application
```bash
npm run dev
```

### Key Commands
- Frontend binds to port 5000
- Backend API available at `/api/*`
- Database migrations: `npm run db:push`

## Deployment

See `DEPLOYMENT.md` for detailed instructions on deploying:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Neon, Supabase, or any PostgreSQL provider

## Design System
- Uses IBM Plex Sans Arabic for Arabic text
- Uses Inter for English text
- Professional navy/gold color scheme
- Automatic RTL/LTR switching based on language selection
- AI disclaimer banner always visible
- Luxury gradient hero sections
- Shadow-based card designs

## Recent Changes
- December 2024: Initial implementation with full translation and memorandum modules
- Full Arabic localization with RTL support
- OpenAI integration for AI-powered translation and drafting
- Custom email/password authentication
- Environment variable configuration for external deployment
- CORS support for separate frontend/backend deployment
- Enhanced page styling with modern gradients and layouts
