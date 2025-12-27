# Deployment Guide

This guide explains how to deploy the Legal AI Translation & Memorandum System with the frontend on **Vercel** and the backend on **Render**.

## Architecture Overview

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│   Vercel        │◄───────►│   Render        │◄───────►│   PostgreSQL    │
│   (Frontend)    │   API   │   (Backend)     │   DB    │   Database      │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

---

## Prerequisites

Before deploying, ensure you have:

1. **OpenAI API Key** - Get from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **PostgreSQL Database** - You can use:
   - [Neon](https://neon.tech) (recommended, free tier available)
   - [Supabase](https://supabase.com)
   - [Railway](https://railway.app)
   - Any PostgreSQL provider
3. **GitHub Account** - For connecting to Vercel and Render
4. **Vercel Account** - [Sign up](https://vercel.com)
5. **Render Account** - [Sign up](https://render.com)

---

## Step 1: Prepare Your Database

### Option A: Using Neon (Recommended)

1. Create an account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string (looks like: `postgresql://user:pass@host/dbname`)
4. Run the database migrations:
   ```bash
   npm run db:push
   ```

### Option B: Using Supabase

1. Create an account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database → Connection string
4. Copy the connection string

---

## Step 2: Deploy Backend to Render

### 2.1 Create a New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:

   | Setting | Value |
   |---------|-------|
   | **Name** | `legal-ai-backend` |
   | **Environment** | `Node` |
   | **Region** | Choose closest to your users |
   | **Branch** | `main` |
   | **Build Command** | `npm install && npm run build` |
   | **Start Command** | `npm run start` |

### 2.2 Configure Environment Variables

In Render, go to **Environment** and add these variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://...` | Your PostgreSQL connection string |
| `OPENAI_API_KEY` | `sk-...` | Your OpenAI API key |
| `SESSION_SECRET` | `(random-32-chars)` | Generate a secure random string |
| `NODE_ENV` | `production` | Set to production |
| `CORS_ORIGIN` | `https://your-app.vercel.app` | Your Vercel frontend URL |
| `PORT` | `10000` | Render uses port 10000 by default |

### 2.3 Deploy

Click **Create Web Service**. Render will build and deploy your backend.

Note your backend URL (e.g., `https://legal-ai-backend.onrender.com`)

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New...** → **Project**
3. Import your GitHub repository

### 3.2 Configure Build Settings

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `client` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 3.3 Configure Environment Variables

Add the following environment variable:

| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | `https://your-backend.onrender.com` |

### 3.4 Deploy

Click **Deploy**. Vercel will build and deploy your frontend.

---

## Step 4: Update CORS Settings

After deploying the frontend, update your Render backend's `CORS_ORIGIN` environment variable with your actual Vercel URL:

```
CORS_ORIGIN=https://your-app.vercel.app
```

Render will automatically redeploy with the new settings.

---

## Database Migrations

When you make schema changes, run migrations:

```bash
# Push schema changes to database
npm run db:push
```

---

## Environment Variables Reference

### Backend (Render)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `OPENAI_API_KEY` | Yes | OpenAI API key for AI features |
| `SESSION_SECRET` | Yes | Secret for session encryption (32+ chars) |
| `NODE_ENV` | Yes | Set to `production` |
| `CORS_ORIGIN` | Yes | Frontend URL(s), comma-separated |
| `PORT` | No | Defaults to 5000, Render uses 10000 |
| `OPENAI_BASE_URL` | No | Custom OpenAI endpoint (for Azure, etc.) |

### Frontend (Vercel)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | Yes | Backend API URL (Render URL) |

---

## Troubleshooting

### CORS Errors
- Ensure `CORS_ORIGIN` on Render matches your Vercel URL exactly (including https://)
- Check for trailing slashes (remove them)

### Database Connection Issues
- Verify `DATABASE_URL` is correct and includes `?sslmode=require` for most cloud providers
- Check if your database allows connections from Render's IP addresses

### Session Not Persisting
- Ensure `SESSION_SECRET` is set and consistent across deploys
- Cross-origin cookies require `CORS_ORIGIN` to be set (this enables `SameSite=None` cookies)
- Ensure both frontend and backend use HTTPS in production
- If using a custom domain, ensure cookies are set correctly

### OpenAI API Errors
- Verify your API key is valid and has available credits
- Check if you're using the correct model (gpt-4o)

---

## Local Development

For local development, copy the example environment files:

```bash
# Backend
cp .env.example .env

# Frontend
cp client/.env.example client/.env
```

Then fill in your local values and run:

```bash
npm run dev
```

---

## Security Checklist

Before going to production:

- [ ] Use strong, unique `SESSION_SECRET` (32+ characters)
- [ ] Set `CORS_ORIGIN` to specific domains (not `*`)
- [ ] Enable SSL on your database connection
- [ ] Keep API keys secure and never commit them
- [ ] Enable Vercel and Render's security features
- [ ] Set up monitoring and logging

---

## Support

If you encounter issues:

1. Check the Render and Vercel logs
2. Verify all environment variables are set correctly
3. Ensure database migrations have been run
4. Check browser console for frontend errors
