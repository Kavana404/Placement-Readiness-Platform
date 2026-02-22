# Placement Readiness Platform

A React app for JD analysis, readiness scoring, and placement preparation.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
```

Output is in the `dist/` folder.

## Deploy on Vercel

1. Push this project to a GitHub repo.
2. In Vercel: **Add New** → **Project** → Import your repo.
3. **Framework Preset:** Vite  
   **Build Command:** `npm run build`  
   **Output Directory:** `dist`
4. Deploy. The `vercel.json` in this repo configures SPA routing.
