# GharVision 🏡

**Your home, imagined.** A thoughtful home-design workspace for planning, visualising, and personalising a dream home.

## Features

- **Phase 1 — Workspace foundation:** responsive dashboard, navigation, light/dark theme, project creation/search, inspiration gallery and browser-local persistence.
- **Phase 2 — 2D Floor Planner:** add, select, move, rename, resize and remove rooms; plot settings; save locally; export plan data as JSON.
- **Phase 4 — Floor Plan Concepts:** generate three rule-based layout concepts from plot size, bedroom/bathroom counts and layout preference; compare and export concepts; open a selected layout in the planner.
- **Phase 5 — Room Makeover:** preview a room photo locally, choose room type and design mood, tick practical suggestions and export a checklist.
- **Phase 6 — Paint & Materials Studio:** select paint swatches, build a persistent colour palette, save flooring/wall/countertop finishes, estimate paint quantity and indicative cost, and export/copy a material board.
- **Phase 7 — Interior Design Studio:** select a room, design style and budget level; explore a visual concept board and curated furniture/decor list; save selections per room/style; estimate a sample budget; and export or copy the shortlist.
- **Phase 8 — 3D Home View:** render the saved 2D room rectangles in an interactive isometric concept view; select rooms to inspect approximate dimensions; adjust conceptual wall height; toggle labels; sync from the Floor Planner; and export model data.
- **Phase 9 — Exterior Design Studio:** choose a facade direction, customise wall/trim/roof colours, compare illustrative exterior finishes, select landscape features, estimate an indicative budget, and save/export a design summary.
- **Phase 10 — Exterior Designer:** customise the front gate, boundary wall, balcony railing, window pattern, front door, driveway and exterior lights; see these choices reflected in the facade concept; save locally and export/copy the full frontage specification.
- **Phase 11 — Home Build Budget:** estimate a multi-floor home's indicative cost using editable work-category rates, built-up area, finish tier, location band and contingency; review a breakdown; save on-device; export CSV or copy a summary.
- **Phase 12 — Home Maintenance Planner:** manage a household checklist with room, category, frequency, due date, priority, status, notes and indicative cost; search/filter tasks; mark work complete; persist locally; and export the task register to CSV.
- **Phase 13 — Renovation Project Tracker:** manage a project name, budget and target dates; track task owners, priorities, due dates and statuses; log actual expenses; monitor completion and budget usage; search/filter tasks; save on-device; and export the project register to CSV.

### Honest limitations
The floor-plan generator and room-makeover suggestions are **rule-based demos, not a trained AI model**. Paint coverage, material costs and interior furnishing budgets are planning estimates with sample rates, not supplier quotes. Interior moodboards are illustrative concepts, not scaled room renders. The Phase 8 home view is an isometric 3D-style illustration, not a full 3D engine or photorealistic model. The Phase 9/10 exterior facade is an illustrative concept elevation, not a scaled or structurally validated building design. Room photos are previewed locally in the browser and are not sent to a server by this feature. The current app does not automatically detect objects, move furniture in photos, provide true 3D rendering, or sync data across devices. Renovation tracking and expense entries are stored in this browser on this device only; they are not shared with contractors or synced to another device. Floor plans are conceptual only and are not construction-ready architectural drawings.

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
