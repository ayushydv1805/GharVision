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
- **Phase 14 — Material Estimator:** compare finish options by category and room; enter quantity, unit rate and waste allowance; track supplier notes and shortlisted options; compare the estimate against a materials budget; persist locally; and export the material register to CSV.\n- **Phase 15 — Home Inventory & Warranty Vault:** register household items by room and category; record purchase cost, date, brand, serial/model and notes; calculate estimated warranty end dates; flag warranties expiring within 60 days or already expired; star important items; search/filter the register; persist locally; and export a CSV backup.\n- **Phase 16 — Home Utility & Bill Tracker:** log monthly electricity, water, gas, internet and other bills; record usage, provider, due date, notes and payment status; track a monthly budget; compare recorded spending across six months; filter/search bills; and export a CSV backup.
- **Phase 17 — Home Sustainability Planner:** estimate a rough solar system size, panel count, roof area, annual bill offset and simple payback; estimate theoretical rainwater collection; track energy, water, waste and garden actions; save assumptions locally; and export the checklist to CSV.
- **Phase 18 — Home Safety & Emergency Plan:** keep household plan details, verified emergency contacts, meeting point and utility shutoff locations; track a preparedness checklist; save data locally; print the plan; and export a JSON backup.
- **Phase 19 — Cleaning & Chore Scheduler:** manage a starter household routine, add/edit chores, assign responsibilities, set due dates and notes, search/filter by status and room, track overdue and completed work, save locally, and export a CSV schedule.
- **Phase 20 — Moving Planner:** organise a move date and origin/destination notes, track a starter relocation checklist, add custom tasks with categories/due dates/priority/notes, filter and search tasks, compare planned budget with actual spend, save locally, and export the checklist to CSV.
- **Phase 21 — Home Project Tracker:** organise improvement work with project name and target dates, manage a starter task list, set status and priority, record due dates, notes, task budgets and actual spend, review completion/overdue metrics, search and filter tasks, and export a CSV.

### Honest limitations
The floor-plan generator and room-makeover suggestions are **rule-based demos, not a trained AI model**. Paint coverage, material costs and interior furnishing budgets are planning estimates with sample rates, not supplier quotes. Interior moodboards are illustrative concepts, not scaled room renders. The Phase 8 home view is an isometric 3D-style illustration, not a full 3D engine or photorealistic model. The Phase 9/10 exterior facade is an illustrative concept elevation, not a scaled or structurally validated building design. Room photos are previewed locally in the browser and are not sent to a server by this feature. The current app does not automatically detect objects, move furniture in photos, provide true 3D rendering, or sync data across devices. Renovation tracking and expense entries are stored in this browser on this device only; they are not shared with contractors or synced to another device. Material quantities and sample prices are illustrative and must be verified with suppliers; the estimator is not a live market-price feed. The home inventory is a local record, not a warranty validation service; coverage must be confirmed against invoices and manufacturer terms. The utility tracker does not connect to providers or import bills automatically; spending comparisons use only entries you record, and sample entries are illustrative. The sustainability planner uses simplified assumptions for solar output, installation cost, payback and rainwater collection; it is not an energy audit, installer quote, engineering design or water-quality assessment. Confirm local rainfall, roof conditions, regulations, system sizing and costs with qualified professionals. The home safety plan stores information only in the current browser and does not call emergency services, send alerts or verify contact numbers; enter verified local numbers and follow official instructions in an emergency. Exported backups may contain private household information, so store them securely. The cleaning scheduler stores tasks only in the current browser; it does not send notifications, sync between devices or automatically reschedule recurring chores, so update due dates as needed. CSV exports may include household assignments and notes; store them appropriately. The moving planner stores addresses, dates, tasks and budget details only in the current browser; it does not book movers, transfer utilities, send reminders or sync across devices. Budget figures are manual estimates and should be reconciled with actual quotes and receipts. The home project tracker also stores information only in the current browser; it does not contact contractors, make purchases, send reminders or sync between devices. Estimates are user-entered and should be checked against quotes, permits and qualified professional advice. Floor plans are conceptual only and are not construction-ready architectural drawings.


- **Floor planning improvements:** enter plot dimensions (15–43 ft per side), choose bedroom/bathroom counts and optional dining, study, parking, puja and store rooms, compare three locally generated layout concepts, then open a selected plan in Floor Planner. Rooms can be dragged, resized from the bottom-right handle, renamed, dimensioned and removed; export the plan data as JSON.


- **Phase 22 — Vendor & quote tracker:** record vendor/trade, contact details, quoted amount, duration, status and scope notes; search/filter the shortlist, mark a vendor selected, view quote totals and export CSV. Starter entries are examples, not real recommendations. Data is stored in local browser storage and does not sync across devices.

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
