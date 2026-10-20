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


- **Stability fixes:** the floor planner now keeps room positions and resize limits within the configured plot, clamps plot dimensions to the canvas-supported range (10–43 ft), and clamps existing rooms when plot dimensions change. Vendor quote loading now ignores malformed saved data, and CSV export keeps its temporary download URL alive long enough for browsers to process the download.


## Phase 23 — Home care log

- Add and manage household maintenance tasks by area, due date, recurrence label, priority, status, and notes.
- Search and filter tasks; mark work complete or reopen it; edit due dates/status and remove tasks.
- Dashboard counts highlight overdue work, tasks due within 14 days, and completed tasks.
- Export the task list as CSV. Data is stored in this browser only; it does not sync between devices or send notifications. Recurrence is recorded as a label and does not automatically generate future tasks. Seed tasks are clearly labelled examples.


## Phase 24 — Insurance & renewal tracker

- Keep home and contents insurance policy records, provider/contact details, premium, payment frequency, coverage summary, status, renewal date and notes.
- Surface active policies that are overdue or due within 30 days, and estimate annual premium spend from the entered amounts and payment frequency.
- Search/filter records, edit renewal dates/status/premiums, delete records and export CSV.
- Data is stored in the current browser only; no cross-device sync, alerts, insurer integration or claims processing. Renewal status is a personal reminder, not confirmation of cover. The initial example is clearly labelled and must be replaced with real details.
- Currency display uses INR (₹).


## Phase 25 — Home budget planner

- Create budget line items for construction, interiors, furniture, appliances, labour, repairs and other home costs.
- Compare planned and actual amounts, calculate remaining budget or overspend, show overall usage, and flag line items over estimate.
- Track status, date, vendor and notes; search/filter entries; edit planned and actual costs inline; delete entries and export a CSV backup.
- Amounts are displayed in INR. Data is stored in the current browser only; no cloud sync, bank integration, invoicing or tax/financing calculation. The initial sample is clearly labelled as an example and should be replaced or deleted.


## Phase 26 — Home handover & snag checklist

- Record inspection issues and checks with area/trade, severity, target date, assigned person and notes.
- Track each item through Open, In progress, Ready to verify, Resolved or Accepted / deferred.
- View unresolved, high-priority and overdue counts; monitor resolved-item progress.
- Search and filter by issue, area, assigned person, status or severity; edit status, severity and due date inline; delete items; export a CSV register.
- Includes clearly labelled example entries that can be edited or deleted. Records are stored in the current browser on this device; there is no cloud sync, photo upload, contractor messaging or reminder service.
- This is a record-keeping aid, not a professional building inspection or safety/compliance certificate. Have safety-critical or technical concerns assessed by qualified professionals.


## Phase 27 — Change order & decision log

- Record requested design changes, material substitutions, extra work, omissions/credits, site conditions and schedule changes.
- Track decision status from Proposed and Under review to Approved, Rejected or Implemented.
- Store request date, requester, notes/reference, estimated cost impact in INR and schedule impact in days.
- Review requests awaiting a decision, approved/implemented cost impact, non-rejected cost exposure and the summed potential schedule impact.
- Search and filter the register, update status/cost/day estimates inline, delete records, and export the register as CSV.
- Includes clearly labelled example requests that can be edited or deleted. Records are stored in the current browser on this device; there is no cloud sync, automatic notification, quote validation or contractor communication.
- Cost and time impact figures are user-entered planning estimates, not a forecast, contractual approval or substitute for a signed change order and professional advice.


## Phase 28 — Home document vault

- Keep a searchable register of property papers, floor plans/drawings, permits, invoices, warranties, insurance, contracts and maintenance records.
- Record document type, safe file-location reference, issue/purchase date, expiry/renewal date, status and notes.
- Highlight active records with past expiry dates or expiry within 30 days; filter by type, status, expiring soon and expired.
- Update record status and expiry date, archive records, remove outdated entries and export the register to CSV.
- Starter entries are examples and should be replaced or deleted. The vault stores document metadata only—not the actual files—and keeps it in the current browser on this device. It does not upload/encrypt files, send reminders, validate legal documents or sync across devices.
- Avoid storing passwords, full identity numbers, bank details or other secrets. Keep actual documents in a secure location and export CSV backups carefully.


## Phase 29 — Home action center

- Bring together dated actions from the Home care log, Insurance & renewals, Home document vault, Handover & snag list and Home project tracker, plus pending change-order decisions and open high/critical snags.
- Prioritise overdue dates, items due this week / within 30 days, pending decisions and high-priority issues.
- Filter the action list, jump directly to the source tracker, refresh after edits and export the visible list to CSV.
- Reads each tool's existing browser-local data without editing it. Refresh the page after making changes in another tool; no cloud sync, background monitoring, push/email notifications or automatic task updates are provided.
- This is a planning aid, not a professional safety inspection or guarantee that every deadline has been entered. Review source records and confirm critical issues with qualified professionals.


## Phase 29 — Home accessibility planner

- Create a room-by-room list of accessibility checks and practical improvements for safer movement, comfort and everyday independence.
- Track area, priority, status, notes and estimated cost in INR; highlight open high-priority actions and total open estimated cost.
- Search and filter actions, update status/priority/cost inline, delete entries and export a CSV backup.
- Includes clearly labelled example checks that can be edited or removed. Records are stored in the current browser on this device; there is no cloud sync, professional assessment, compliance certification or automatic reminder.
- This is a planning aid only. Needs vary by person and property. Consult qualified professionals for ramps, grab bars, handrails, electrical work, structural changes and local accessibility requirements.


## Phase 30 — Warranty & claims tracker

- Record warranty/claim type, provider, safe reference or evidence location, warranty expiry, claim date, follow-up date, status, claimed amount, approved amount and notes.
- See open claim count, follow-ups due in the next seven days, claimed value and approved value; search and filter the register and update status, amounts or follow-up dates inline.
- Export the register to CSV. Includes clearly labelled example records that can be edited or deleted.
- Data is stored in the current browser on this device only. The app does not upload evidence, contact providers, submit claims, send notifications, or determine policy/contract eligibility. Verify all dates, coverage and submission requirements with the relevant provider and review your policy or contract.


## Phase 31 — Home emergency plan

- Organise emergency contacts, exit routes, household meeting points, utility shut-off locations, safety equipment and important instructions in one checklist.
- Track category, location/details, optional contact name and phone, priority, verification status and notes.
- View readiness counts, highlight unchecked high-priority items, search/filter records, edit status and priority inline, delete entries and export a CSV backup.
- Includes clearly labelled example checklist items that can be edited or removed. Data is stored in the current browser on this device only; there is no cloud sync, calling, automatic alerting or emergency-service connection.
- Avoid storing passwords, access codes or sensitive personal information. In an immediate emergency, follow local emergency guidance and contact emergency services. Do not attempt unfamiliar gas/electrical shut-off procedures; have qualified professionals explain safe steps.


## Phase 31 — Meter reading tracker

- Log dated readings for electricity, water, gas or another utility, with a meter name, unit label, optional per-unit rate and notes.
- Compare each entry with the previous earlier reading for the same utility and meter; show usage and an estimated variable cost when a comparable earlier reading exists.
- Search/filter history, edit readings and rates inline, delete records and export the visible register to CSV.
- Includes clearly labelled demonstration readings that should be replaced or removed. Data is stored in the current browser on this device only; no utility-account connection, bill import, cross-device sync or automatic alerts are provided.
- Estimates exclude fixed charges, taxes, tiered tariffs, adjustments and other bill-specific rules. Use consistent meter units and verify calculations against the actual utility bill. A meter replacement or reset needs a new meter name or explanatory note to avoid misleading comparisons.
