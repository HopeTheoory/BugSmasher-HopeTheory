# Deployment Verification and Vercel Runbook (2026-05-06)

## Current Deployment Model
BugSmasher is configured as a Vite single-page application. The repository now includes `vercel.json` so Vercel can build the app consistently from GitHub-connected deployments.

## Vercel Settings
Use these settings in the Vercel project dashboard:

| Setting | Value |
| --- | --- |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Production Branch | repository default production branch |

## Required Environment Variables
Set these in Vercel Project Settings → Environment Variables for Production, Preview, and Development as appropriate:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Optional OAuth variables should be configured only if the deployed app needs provider-specific client IDs:

```bash
VITE_GOOGLE_CLIENT_ID=your-client-id
```

## Release Verification Checklist
Run the following before merging or deploying:

```bash
npm run lint -- --max-warnings=0
npm run typecheck
npm test
npm run build
```

## Deployment Attempts
A local CLI deployment attempt was made with:

```bash
npx vercel deploy --prod --yes
```

The command could not complete from this environment because no Vercel credentials were available and the CLI could not reach Vercel's login endpoint. If the GitHub repository is connected to Vercel, pushing this branch and merging the PR should trigger the normal Vercel Git deployment flow.

## Manual CLI Deployment
If CLI deployment is needed outside GitHub automation:

1. Install or use the Vercel CLI: `npx vercel --version`.
2. Authenticate: `npx vercel login`.
3. Link the project if needed: `npx vercel link`.
4. Deploy production: `npx vercel deploy --prod`.
