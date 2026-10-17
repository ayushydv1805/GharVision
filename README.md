# GharVision 🏡

**Your home, imagined.** A thoughtful home-design workspace for planning, visualising, and personalising a dream home.

## Features

- **Phase 1 — Workspace foundation:** responsive dashboard, navigation, light/dark theme, project creation/search, inspiration gallery and browser-local persistence.
- **Phase 2 — 2D Floor Planner:** add, select, move, rename, resize and remove rooms; plot settings; save locally; export plan data as JSON.
- **Phase 4 — Floor Plan Concepts:** generate three rule-based layout concepts from plot size, bedroom/bathroom counts and layout preference; compare and export concepts; open a selected layout in the planner.
- **Phase 5 — Room Makeover:** preview a room photo locally, choose room type and design mood, tick practical suggestions and export a checklist.

### Honest limitations
The floor-plan generator and room-makeover suggestions are **rule-based demos, not a trained AI model**. Room photos are previewed locally in the browser and are not sent to a server by this feature. The current app does not automatically detect objects, move furniture in photos, provide true 3D rendering, or sync data across devices. Floor plans are conceptual only and are not construction-ready architectural drawings.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## GitHub Pages deployment

The production site is published from the `main` branch using the GitHub Actions workflow at `.github/workflows/deploy-pages.yml`.

- **Live site:** https://ayushydv1805.github.io/GharVision/
- **Repository:** https://github.com/ayushydv1805/GharVision
- Build command: `npm run build`
- Vite uses `/GharVision/` as the base path in GitHub Actions so assets resolve correctly on project Pages.

To redeploy manually, open the repository's **Actions** tab, select **Deploy GharVision to GitHub Pages**, then choose **Run workflow**. Pushes to `main` also trigger deployment automatically.

## Stack

React, Vite, Lucide, custom CSS and browser local storage.
