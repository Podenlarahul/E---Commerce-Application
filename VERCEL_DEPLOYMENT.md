# Vercel Deployment Guide

## Current architecture
- `frontend` is a CRA app served as static build output.
- `backend/server.js` is deployed as a Vercel Node serverless function.
- `socket` is a separate realtime service and should be deployed outside Vercel functions.

## Required Vercel project settings
Set project root to repository root (where `vercel.json` exists).

## Environment variables
Add these in Vercel Project Settings -> Environment Variables:

### Backend
- `DB_URL`
- `JWT_SECRET_KEY`
- `JWT_EXPIRES`
- `ACTIVATION_SECRET`
- `SMPT_HOST`
- `SMPT_PORT`
- `SMPT_SERVICE` (optional if using host/port only)
- `SMPT_MAIL`
- `SMPT_PASSWORD`
- `STRIPE_API_KEY`
- `STRIPE_SECRET_KEY`
- `CLIENT_URL` (your frontend URL, e.g. `https://your-app.vercel.app`)
- `CORS_ORIGINS` (comma-separated allowed origins)
- `COOKIE_SAMESITE` (optional, default: `none` in production, `lax` in development)
- `COOKIE_SECURE` (optional, default: `true` in production, `false` in development)
- `COOKIE_DOMAIN` (optional)

### Frontend
- `REACT_APP_API_BASE_URL` (use empty for same-domain API routing, or explicit backend URL)
- `REACT_APP_UPLOADS_BASE_URL` (usually same as API base URL origin)
- `REACT_APP_SOCKET_URL` (URL of your separately deployed socket service)

## Notes
- File uploads on Vercel use `/tmp/uploads` at runtime (ephemeral storage). Persistent image hosting should be moved to object storage/CDN for full production durability.
- Vercel routing now rewrites `/uploads/*` to the backend function so product/user images resolve correctly from the CRA app.
- If `REACT_APP_SOCKET_URL` is not set, chat pages still work without realtime updates.
