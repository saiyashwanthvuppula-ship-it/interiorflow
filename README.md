# InteriorFlow — Turn Enquiries Into Projects.
Demo CRM for interior design firms (fictional company: Vertex Interiors). All data is sample data stored in browser localStorage. No API keys needed.

## Run
npm install
npm run dev
npm run build   (output: dist)

## Deploy
1. Upload this folder to a GitHub repo (node_modules, dist, .env are git-ignored).
2. In Vercel: Import the repo. Framework: Vite. Build: `npm run build`. Output: `dist`. `vercel.json` handles route refresh.

## Notes
- Scoring is rule-based (not AI). The "AI-assisted" panel is local text rules; no model is connected.
- PDF = browser Print → Save as PDF. Emails/SMS are never sent.
- Role switcher is a demo only, not security.
- Reset demo data: Settings → Data management.

## Known limitations
Settings sections for stages/sources/types/notifications are not editable yet. No React Hook Form/Zod/shadcn (plain forms). Date filters on Overview/Analytics use presets. Not browser- or responsive-tested.
