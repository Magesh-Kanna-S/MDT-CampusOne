# My Desktop Tech · CampusOne Portal — v8

A complete multi-role campus management portal for **MDT Institute of Technology**,
built and branded for **My Desktop Tech**. **Twelve connected role portals** —
student, faculty, class advisor, academic director, principal, hostel warden
(gender-split), office, administrator, **library, examination cell, placement
cell, accounts and IQAC** — share one governed data flow: every request, mark,
fee receipt, valuation, voucher and approval routes through the right chain
of authority automatically.

> Runs on the institution's unified multi-tier campus architecture.
> The portal is self-contained out of the box — open it and it works.

## Quick start

Open `index.html` (or the site root) in any modern browser and use the demo
access profiles (one-tap sign-in — 14 cards), or sign in with any
institutional email from the list below (password: `demo123`).

| Profile | Email | Lands in |
|---|---|---|
| Aarav Menon — student (hosteller) | `aarav.menon.24cs001@students.mdt.ac.in` | Student portal |
| Priya Krishnan — student (girls block) | `priya.krishnan.24ec001@students.mdt.ac.in` | Student portal |
| Karthikeyan R — faculty + class advisor | `karthikeyan@mdt.ac.in` | Faculty portal |
| **Sundaram P — chief librarian** | `library@mdt.ac.in` | **Library portal** |
| **Dr. Nirmala Raghavan — controller of examinations** | `coe@mdt.ac.in` | **Examination cell** |
| **Balaji R — training & placement officer** | `placement@mdt.ac.in` | **Placement cell** |
| **Gomathi Priya — senior accounts officer** | `accounts@mdt.ac.in` | **Accounts portal** |
| **Dr. Vasanthi Priyadharshini — IQAC director** | `iqac@mdt.ac.in` | **IQAC portal** |
| Meenakshi Sundaresan — assistant librarian | `library.desk@mdt.ac.in` | Library portal |
| Dr. Meera Krishnan — academic director | `meera@mdt.ac.in` | Academic portal |
| Dr. Suresh Chandran — principal | `principal@mdt.ac.in` | Principal portal |
| Ravi Shankar B — warden, boys block | `warden.boys@mdt.ac.in` | Warden portal |
| Lakshmi Narayanan — warden, girls block | `warden.girls@mdt.ac.in` | Warden portal |
| Devi Raj — office administrator | `office@mdt.ac.in` | Office portal |
| Arjun M — system administrator | `sysadmin@mdt.ac.in` | Admin portal |

Each login always starts in the **light theme**; users can switch to dark from
the appearance control next to the profile (or from the side menu on phones).

## v8 refinements — five new staff portals, one governed campus

Everything below is **purely additive** — no v7 view, action or dataset was
removed or reduced.

- **Library portal (11 views)** — the Chief Librarian finally gets a full
  workspace: circulation desk (issue / return / renew for students *and*
  staff, with reservations), the OPAC catalogue manager (accession records
  with rack, shelf, publisher, price), eBook & digital-resource registers,
  the membership register, the fine ledger (collect / waive with audit
  trail), journal & periodical subscriptions with issue receipts and vendor
  claims, departmental **book requisitions → librarian → principal →
  purchase order → accession**, and stock verification with the weeding
  register.
- **Examination cell (8 views)** — exam scheduling with rooms, sessions and
  invigilation duty; internal-exam attendance rosters and a malpractice
  register (cases reach the principal instantly); the **ESE-style online
  valuation workspace** with batch progress and remuneration verification
  (bank · PAN · signature) before payment; consolidated results with
  publication control; revaluation & recount with live mark updates; and
  transcripts / consolidated marksheets issued from the live record.
- **Placement cell (7 views)** — recruiter & MoU directory with invites,
  drives with round-by-round tracking (every change notifies the student),
  the batch placement register, training batches (aptitude, soft skills,
  GD, technical, mock interviews) with attendance analytics, and internship
  approvals with faculty mentors.
- **Accounts (7 views)** — the collections day book with mode split and
  reconciliation, expense vouchers on the **raiser → accounts → principal →
  payment** chain, monthly **payroll** with structure registers and payslip
  downloads, budget heads with utilisation, and the vendor / purchase-order
  book.
- **IQAC (7 views)** — survey administration (create, assign, monitor,
  close — students answer on their own portal), the **CO-PO attainment
  matrices** (direct attainment + correlation levels for all 24 courses),
  feedback reports with question averages and individual statements, the
  audit calendar with findings closure, and NAAC criteria readiness.
- **Faculty additions (5 views)** — *My Leave & Faculty Swap* (HRMS: on-duty
  / leave / permission with colleague swap proposals the colleague answers
  on their own page before the director approves), the *e-Learning studio*
  with per-student progress, *self-appraisal* submissions with auto-KPIs,
  *previous semester courses* with the archived report set, and *course
  attainment* views.
- **Student additions (2 views + a new action)** — *My Achievements*
  (submit prizes, certifications and leadership records — the mentor
  verifies, placement and IQAC consume) and *Feedback Surveys* (answer the
  cycles IQAC assigns, anonymous in reports). The library catalogue also
  gains a **Reserve** action when every copy is out.
- **Cross-portal wiring** — requisitions, expenses, surveys, achievements,
  swaps, valuation and payroll all notify the right roles and update the
  consuming pages instantly (the office ticket desk can now assign tickets
  to any staff service role; the academic director gains the staff-leave
  approvals; the principal's desk gains expense countersigns and
  book-purchase approvals alongside a new quality overview).

### Pushing to GitHub & publishing on GitHub Pages

1. Create a new repository on GitHub (e.g. `campusone-portal`).
2. From this folder:
   ```bash
   git init
   git add .
   git commit -m "CampusOne Portal v8 — My Desktop Tech"
   git branch -M main
   git remote add origin https://github.com/<your-user>/campusone-portal.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy
   from a branch** → Branch: `main` / `/ (root)` → **Save**.
4. Your portal is served at `https://<your-user>.github.io/campusone-portal/`
   — one clean address, constant tab title, exactly as designed.

The bundle also works unchanged on Netlify, Vercel static, Cloudflare Pages,
or any web server directory — `index.html` is the single entry point.

## v7 refinements — a single secured page

 — a single secured page

- **One clean address**: the portal is now a **single-page application**.
  All 80 views render inside one document served from the root URL — the
  browser address bar never shows a `.html` page name again, and never
  changes while you move around. Opening `…/index.html` is silently
  rewritten to the clean directory form.
- **Constant tab title**: the browser tab reads *CampusOne — My Desktop
  Tech* from sign-in to sign-out, like a professional portal — no
  per-page title swapping.
- **No deep links — secured access**: there are no per-page links to open,
  share or guess. The portal boots at its single address and requires a
  signed-in session before any view renders; a session with the wrong role
  for an area is bounced back to sign-in. A stray or guessed URL simply
  meets `404.html`, which returns visitors to the portal entrance.
- **Internal transitions everywhere**: every former page link (side menu,
  stat tiles, card *View all* targets, notification links, in-page actions,
  query links such as *Take attendance → course*) is intercepted and
  resolved as an internal navigation — the address and the tab never move.
- **"View all" card links now work**: the *View all* / *Manage* links on
  dashboard cards (which previously went nowhere) navigate to their views.
- **Clean view lifecycle**: page scripts register their delegated handlers
  through the application core, so listeners are swept on every navigation —
  no build-up between views; modals close and the view scrolls to the top
  on each transition, exactly like a fresh page load.
- **GitHub-ready**: the repository is a plain static bundle — push it and
  enable GitHub Pages (below); no build step, no server code, no
  dependencies.

### Pushing to GitHub & publishing on GitHub Pages

1. Create a new repository on GitHub (e.g. `campusone-portal`).
2. From this folder:
   ```bash
   git init
   git add .
   git commit -m "CampusOne Portal v7 — My Desktop Tech"
   git branch -M main
   git remote add origin https://github.com/<your-user>/campusone-portal.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy
   from a branch** → Branch: `main` / `/ (root)` → **Save**.
4. Your portal is served at `https://<your-user>.github.io/campusone-portal/`
   — one clean address, constant tab title, exactly as designed.

The bundle also works unchanged on Netlify, Vercel static, Cloudflare Pages,
or any web server directory — `index.html` is the single entry point.

## v6 refinements

- **Tables fully visible on phones**: every table (marks, fees, registers,
  logs, ticket queues…) fits the mobile layout completely — fonts and cell
  padding shrink with the viewport, long text wraps instead of being cut
  off, and in-table controls compact. No horizontally cut-off columns.
- **Creator photo**: the creator & designer card on the home screen shows
  Magesh Kanna S's actual profile photo.
- **Outing requests — raiser-requested deadline**: the student raising an
  outing can request a decision deadline themselves; if a deadline is
  selected the form reminds them to state the reason clearly in the reason
  box (and validates it). The deadline shows on every approval screen, in
  the timeline and in the CSV exports.
- **Grades-so-far fixed**: the assignments page's *Graded score so far* stat
  had a rendering defect that printed `0[object Object]…` — fixed, and the
  whole codebase was swept for the same pattern.
- **Database integration placeholders (maintenance)**: Admin → Settings
  carries a *Database & integrations* card with placeholders for the
  **Google Sheets data channel** (Apps Script endpoint URL, API key,
  spreadsheet ID) and the **Google Drive file database** (API key, folder
  ID). When the administrator saves real keys, the background data source
  reflects the change dynamically (no reload/redeploy); a live *Test
  connection* button pings the channel, and the admin dashboard shows the
  current source at a glance. Keys persist independently of demo-data resets.

## v5 refinements

- **Top-left button placed correctly**: the side-menu button is docked flush
  at the exact top-left corner above a full-width top bar; the collapsed rail
  state highlights the button.
- **Help tickets — full service desk**: file attachments (up to 3), expected
  resolution dates from the priority SLA (editable by the office), a
  time-stamped tracking timeline, reopen / confirm & close, star rating,
  status filters, search and CSV export. The office desk gains assignment,
  SLA-overdue flags, desk-health analytics and a full service-desk log CSV.
- **Fees — overall paid & dues with CSV**: a transaction-ledger download with
  overall billed / paid / dues, every receipt, head-wise rows and a running
  balance; due dates carry countdown chips, per-head receipts re-download.
- **Attendance CSV + month trend**: the student statement exports as CSV and
  a month-wise trend chart shows the last six months.
- **Exports everywhere**: CSV downloads across every portal — timetable,
  scores, assignments, quizzes, rankings, OD / leave / outing requests,
  library, e-learning, mentor, placement, scholarships, notifications;
  faculty registers, submissions, marks, class lists, mentee registers,
  advisor overviews; academic allocations, workload and results; principal
  decisions, analytics, finance, staff and hostel occupancy; warden logs;
  office defaulters, collections, certificates, hall tickets, records and
  the library register; admin users, calendar, circulars and a full data
  backup (JSON). The office can also send fee reminders to defaulters.
- **Assignment & material attachments**: students attach files to
  submissions; faculty attach files to course materials.
- **Stat cards fixed**: dashboard stat tiles stack value / label / sub-line.

## v4 / v3 refinements

- **Fixed app shell on phones**: the page never pans, zooms or scrolls as a
  whole — only the content area scrolls; pinch and double-tap zoom are
  disabled via the viewport policy (verified on all pages at 390px).
- **Drawer never scrolls the background**: opening the side menu locks the
  page behind it; closing releases it (scrim, navigation tap, Escape key,
  or rotating back to desktop width).
- **Centered sign-in home** with demo access grid and the creator card;
  **My Profile** works for every role; consistent icon sizing; responsive
  topbar; **collapsible side menu on desktop** (remembered); theme and
  notifications move into the drawer on phones; CSV exports for receipts,
  statements, hall tickets, certificates, class reports and activity logs.

## What's inside (v7 — single-page bundle)

```
├── index.html               the single secured entry — all 80 views render here
├── 404.html                 stray URLs return to the portal entrance
├── .nojekyll                safe publishing marker for GitHub Pages
├── assets/css/style.css     the design system (light & dark)
├── assets/js/spa.js         v7 core — router, session guard, link interception
├── assets/js/pages.js       all 79 role views, registered for the router
├── assets/js/app.js         application shell (topbar, side menu, dropdowns)
├── assets/js/ui.js          widgets: tables, cards, modals, toasts, CSV
├── assets/js/workflow.js    the cross-portal approval & notification engine
├── assets/js/seed*.js       deterministic reference dataset (demo mode)
├── assets/js/store.js       data store (versioned, browser-local)
├── assets/js/api.js         live channel client (GSheet/Drive, dynamic)
├── assets/img/              logos, favicon, creator photo
├── demo-video/              CampusOne_Demo_V7.html — 5-minute + full tour
├── backend/                 live-channel provision pack (maintainer only)
└── database-seed/           seed workbook for the live data grid (maintainer only)
```

`ARCHITECTURE.md` documents every view, permission and approval chain.
**The recommended walkthrough is `demo-video/CampusOne_Demo_V7.html`** — a
single self-contained file (the real version-7 application travels inside
it) that opens with a picker: a **5-minute overview** and the **full tour**
(all 80 pages, ~93 scenes), with voice narration, typed subtitles, scene
controls and a chapter menu. It plays straight from a double-click — no
server, no setup.

## Highlights

- **Approval chains that actually route**: OD and leave travel
  *student → class advisor → academic director (→ principal for long leave)*;
  day outings close at the (gender-matched) warden; overnight outings add the
  academic director; scholarships flow *office → principal*.
- **Cross-portal reactions**: a teacher marking attendance updates the
  student's percentage, flags the advisor below 75%, and can hold hall
  tickets; paying a due at the office (or from the student page) unblocks
  the ticket instantly.
- **Gender-split hostel governance**: wardens only ever see their own block's
  residents, rooms, outings and complaints; cross-block allocation is
  rejected by the platform.
- **Design system**: Google four-colour palette (#4285F4 / #EA4335 / #FBBC05 /
  #34A853) on restrained surfaces — colour appears as accent strips, badges,
  timelines and soft glow-on-hover borders, never as full-page fills.
- **Photo management**: every profile carries a placeholder icon; users can
  update their photo from the profile page and it propagates across the portal.

## Theming

Light theme is the default at every login. The toggle (sun/moon, top-right,
next to the profile — or the *Light/Dark* row in the side menu on phones)
switches instantly and carries across views within the session.
All colours are CSS custom properties on `assets/css/style.css`.

## Maintainer notes

- `backend/SETUP_GUIDE.md` — provision the live channel (sheets + file
  storage) if you want centralized data; the portal runs self-contained
  without it.
- `database-seed/MDT_CampusOne_Seed.xlsx` — the seed workbook (40 sheets).
- `ARCHITECTURE.md` — the full system design: roles, permissions, chains,
  views.
- Demo data reset: Admin portal → Settings → *Restore reference dataset*
  (the store re-seeds instantly inside the single page — no reload flash).

© 2026 My Desktop Tech. All rights reserved.
