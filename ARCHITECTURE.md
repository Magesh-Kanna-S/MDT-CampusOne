# CampusOne v8 — System Architecture

**My Desktop Tech · MDT Institute of Technology · Academic year 2026–27 (Semester V)**

---

## 1 · System layers

```
+-----------------------------------------------------------------------------------+
|  PRESENTATION — 12 role portals · 130 views · light/dark design · ONE PAGE        |
|  all views render inside the single index.html document                           |
+-----------------------------------------------------------------------------------+
|  APPLICATION CORE (v7/v8) — assets/js/spa.js                                      |
|  single-page router · session guard · link interception · view registry           |
|  one clean address · constant tab title · no deep links                           |
+-----------------------------------------------------------------------------------+
|  APPLICATION SHELL — assets/js/app.js + assets/js/pages.js                        |
|  top bar / side menu / dropdowns · all 129 role views registered for the router   |
+-----------------------------------------------------------------------------------+
|  WORKFLOW ENGINE — assets/js/workflow.js                                          |
|  110+ governed actions: every mutation stamps the activity log,                   |
|  routes notifications to the right role, and saves state                          |
+-----------------------------------------------------------------------------------+
|  DATA LAYER — assets/js/store.js + seed.js/seed2.js/seed3.js                      |
|  unified store · query helpers (Q) · persistence · reference data                 |
+-----------------------------------------------------------------------------------+
|  CHANNEL (optional) — assets/js/channel.js + backend/Code.gs                      |
|  live grid + file storage when provisioned; silent otherwise                      |
+-----------------------------------------------------------------------------------+
```

The presentation layer never names its infrastructure: the footer carries the
line *"Unified multi-tier campus architecture"*. The optional channel is wired
by the maintainer only (`backend/SETUP_GUIDE.md`).

**v8 — five new staff portals.** `seed3.js` extends the reference dataset with
the library (catalogue enrichment, staff loans, reservations, fine ledger,
journals, digital resources, requisitions, stock verification, weeding),
examination cell (exams, sessions, attendance, malpractice, valuation batches
with remuneration verification, revaluation, transcripts), placement cell
(recruiters, training batches, internships), accounts (payroll structure and
runs, expense vouchers, budgets, vendors, purchase orders), IQAC (surveys with
responses, programme outcomes, course outcomes with attainment, PO maps,
audits, NAAC criteria), events, student achievements, staff leave with faculty
swap, appraisals, e-learning progress and curriculum mapping. `workflow.js`
gains ~45 governed actions across the same domains, all of them logging,
notifying the right role and persisting. Five new NAV sections register in the
shell; the sign-in grid grows to 14 demo profiles; the office ticket desk can
assign to any staff service role; and the principal / academic / mentor pages
gained additive approval sections for the new chains.

**v7 — the single-page shell.** The portal is served from one address (the
repository root). `index.html` loads the shared scripts plus
`assets/js/pages.js` — every former page file's render code, registered through
`MDTPAGE` into the core's view registry. `SPA.start()` boots the session check:
a valid session lands in the role dashboard, everything else meets the sign-in
view. `SPA.go(key)` renders a view (re-running the shell boot exactly like a
fresh page load: listeners swept, modals closed, scroll reset),
`SPA.follow(href)` resolves a former `.html` link against the virtual folder of
the current view (including query links like `attendance.html?course=…`), and a
capture-phase document listener intercepts every internal link — side menu,
stat tiles, notification targets, card *View all* chips — so the browser
address and the document title never move. A `404.html` returns stray URLs to
the entrance, and `…/index.html` is rewritten to the clean directory form.
Page scripts register delegated handlers via `SPA.doc(type, fn)`; the core
sweeps them on every navigation, so views stay isolated like separate
documents.

---

## 1a · v8 role inventory

| Role folder | Views | Highlights |
|---|---|---|
| student/ | 25 | dashboard, attendance, timetable, courses, exams, assignments, quizzes, ranking, calendar, fees, OD, leave, tickets, hostel, outing, mess, library (+ reserve), e-learning, mentor, placement, scholarship, **achievements**, **feedback surveys**, notifications, profile |
| teacher/ | 18 | dashboard, courses, attendance, assignments, quizzes, marks entry, schedule, students, materials, **e-learning studio**, **previous semester courses**, **course attainment**, **my leave & faculty swap (HRMS)**, **self-appraisal**, mentor (+ achievement verification), advisor requests, class overview, profile |
| academic/ | 11 | dashboard, OD approvals, night outings, **leave approvals (+ staff leave & swap)**, allocations, timetable, semesters, staff, reports, **curriculum & syllabus mapping**, profile |
| principal/ | 9 | dashboard, **approvals (+ expense countersign, book requisitions)**, academics, finance, staff, hostel, circulars, **quality & accreditation**, profile |
| warden/ | 7 | dashboard, outings (+ requested deadline), rooms, residents, mess, complaints, profile |
| office/ | 11 | dashboard, fees, certificates, hall tickets, records, library desk, placement, scholarships, tickets, **event dashboard**, profile |
| admin/ | 8 | dashboard, users, roles (matrix + v8 portals), calendar, news, logs, settings (integrations), profile |
| library/ | 11 | dashboard, circulation, catalogue/OPAC, eBooks, members, fines, journals, digital resources, procurement, inventory, profile |
| examcell/ | 8 | dashboard, schedule & seating, attendance (+ malpractice), online valuation, results, revaluation, transcripts, profile |
| placement/ | 7 | dashboard, recruiters & MoUs, drives, register, training, internships, profile |
| accounts/ | 7 | dashboard, collections day book, expenses, payroll, budgets, vendors & POs, profile |
| iqac/ | 7 | dashboard, surveys, CO-PO attainment, feedback reports, audits, NAAC criteria, profile |

**v8 approval chains (new):**
- Book requisition: department → librarian review → principal approval → PO (library) → accession
- Expense voucher: raiser (any office) → accounts verification → principal approval → payment
- Staff leave: faculty → (optional colleague swap: proposed → accepted/declined) → academic director
- Achievement: student → mentor verification → placement register + accreditation evidence
- Survey: IQAC assigns → students respond → IQAC closes → reports final
- Valuation remuneration: batch complete → bank/PAN/signature verified (exam cell) → payment

---

## 2 · Roles & authority

| Role | Scope of authority | Key powers |
|---|---|---|
| Student | Own records | Apply OD/leave/outing, submit assignments & quizzes, pay fees, raise tickets, update photo |
| Faculty | Courses allotted to them | Mark attendance, enter marks, create assignments/quizzes, post materials, update course plan, request reschedules |
| Class Advisor (faculty duty) | Their class | Recommend/return OD & leave, monitor at-risk attendance, mentor group |
| Academic Director | Academics institution-wide | Final OD & leave approval, overnight-outing stage 2, course allotment to faculty, reschedule approval, result publication |
| Principal | Institution | Scholarship sanction, long-leave countersign (≥5 days), circulars, full oversight dashboard |
| Hostel Warden | Own block, gender-locked | Day-outing approval, room allocation (gender-enforced), mess menu, complaints |
| Office | Student services | Fee collection & receipts, certificates, hall tickets (fee-gated), records, library, placement drives, scholarship verification, ticket desk |
| Administrator | Platform | Users & roles, permission matrix, calendar, circulars, activity log, settings, data restore || Library (Chief Librarian) | Knowledge resource centre | Circulation, catalogue, fines, journals, e-resources, requisition review, procurement, inventory |
| Examination Cell (CoE) | Examinations & valuation | Scheduling, seating, attendance, malpractice records, valuation batches, remuneration verification, results publication, revaluation, transcripts |
| Placement Cell (TPO) | Corporate relations | Recruiters, drives, round updates, offers, training batches, internship approvals |
| Accounts (Accounts Officer) | Finance | Day book, voucher verification, payroll, budgets, vendors & POs |
| IQAC (Accreditation Director) | Quality assurance | Surveys, CO-PO attainment, feedback reports, audits, criteria readiness |


---

## 3 · Approval chains (the governance core)

```
OD (on duty)      Student ──▶ Class Advisor ──▶ Academic Director ──▶ [warden informed if hosteller]
Leave             Student ──▶ Class Advisor ──▶ Academic Director ──▶ Principal (≥ 5 days countersign)
Outing (day)      Student ──▶ Warden (own block, gender-matched)
Outing (night)    Student ──▶ Warden ──▶ Academic Director        (dual approval)
Scholarship       Student ──▶ Office verification ──▶ Principal sanction ──▶ fee account
Hall ticket       Office generates ──▶ fee clearance auto-check ──▶ student notified (blocked if dues > ₹2,000)
Reschedule        Faculty requests ──▶ Academic Director ──▶ class timetable updated + notified
```

Every hop: timeline entry on the request · notification to the next actor ·
activity-log entry · instant state save. Rejections and returns carry the
decision-maker's remark back to the student.

---

## 4 · Cross-portal reactions

| Action | Ripple effects |
|---|---|
| Teacher marks a session | student % updates · absentees notified · advisor alerted below 75% |
| AD allots a course | faculty's course list · class timetable · student schedule update |
| Teacher publishes marks | student exam page · class ranking aggregate · AD reports |
| Fee payment (either side) | dues recalc · hall-ticket eligibility flips · receipt issued |
| Warden approves night outing | AD queue gains stage 2 · student sees partial approval |
| Principal sanctions scholarship | student timeline · disbursement pipeline · finance dashboard |
| AD/Principal publish circular | every dashboard of the audience + flash ticker (if urgent) |

---

## 5 · View inventory (80 — all inside the single page)

**Sign-in (1)** — centered hero + credential form + demo access profiles (3×3
grid) + creator & designer card.

**Student (23)** dashboard · notifications · attendance · class schedule (timetable) ·
courses & status · exams & scores (with hall ticket + completed semesters) ·
assignments · quizzes · rankings · fees · OD · leave · hostel · outing requests ·
mess timetable · library (loans + catalogue + e-books) · e-learning · mentor ·
placement · scholarships · help tickets · academic calendar · profile (photo).

**Faculty + advisor (13)** dashboard · my courses · take attendance · assignments ·
quizzes · marks entry · my schedule (course plan + reschedule requests) · my
students · course materials · mentor group · advisor OD/leave review · advisor
class overview · profile.

**Academic director (10)** dashboard · OD approvals · night outings · leave approvals ·
course allocation · timetable & reschedules · semesters & results · faculty &
workload · class reports · profile.

**Principal (8)** overview dashboard · approvals (scholarships + long leave) ·
academics analytics · fee & finance · staff overview · hostel overview (both
blocks, gender-split view) · circulars & news · profile.

**Warden (7, per gender block)** dashboard · outing approvals · room allocation ·
residents · mess menu · complaints · profile.

**Office (10)** dashboard · fee management · certificates · hall tickets · student
records (admissions) · library desk · placement cell · scholarships · help
tickets · profile.

**Administrator (8)** platform dashboard · user accounts · roles & permissions
matrix · academic calendar · circulars & news · activity log · settings · profile.

---

## 6 · Data model (36 entities in the store)

- **Structure**: settings, departments (2), classes (6), staff (21), users (165)
- **Academics**: courses (24), courseAllocations (36), timetable (240 slots),
  coursePlan (180 unit rows), attendanceAgg + attendanceSessions, marks,
  assignments (72) + submissions, quizzes (72) + attempts, materials
- **Student life**: feeHeads + feeTransactions, hallTickets, certificates,
  hostelRooms (24) with occupants, messMenu, outingRequests, odRequests,
  leaveRequests, complaints
- **Library**: libraryBooks (26), borrowRecords, ebooks (12)
- **Growth**: mentorGroups + mentorMeetings + remarks, placementDrives (4) +
  applications + stats, scholarshipSchemes (4) + applications
- **Communication & ops**: circulars, flashNews, calendarEvents (17),
  tickets, notifications, activity, photos

Reference records are deterministic (seeded PRNG) so every demo day starts
identically; the admin *Restore reference dataset* action returns the store to
this baseline at any time.

---

## 7 · Design system

- **Palette** — blue `#4285F4` (primary/information), red `#EA4335` (urgent/rejected),
  yellow `#FBBC05` (pending/warning), green `#34A853` (approved/success) over
  neutral surfaces; tints for backgrounds, inks for text (WCAG-conscious pairs).
- **Glow-on-hover** — cards, buttons, nav items, table rows and timetable cells
  gain a soft coloured halo + coloured border on hover; static accent strips
  (3px left edge) differentiate cards even without hover. No full-colour fills.
- **Themes** — light is default and resets at every login; dark inverts surfaces
  while preserving the four accents; both driven purely by CSS custom properties.
- **Components** — stat tiles, tables, badges, timelines, tabs, modals, toasts,
  donut/bar charts, timetable grid, month calendar, flash-news ticker, photo
  placeholder + upload, empty states.
- **Top bar & corner control (v5)** — the top bar spans the full width with the
  side-menu button docked at pixel (0,0); the side rail starts below it. On
  phones the burger takes the same corner slot and swaps to a close icon while
  the drawer is open.
- **Service desk model (v5)** — tickets carry `eta` (expected resolution),
  `assignee`, `files[]`, `rating` and a `timeline[]` of time-stamped steps.
  `WF.*` ticket functions: create (SLA eta + attachments), assign, setTicketETA,
  updateStatus, resolve, reopen, close and rate — every step notifies the
  student and the desk.
- **Export layer (v5)** — `UI.downloadCSV` is used by 40+ export points across
  all eight portals (statements, ledgers, registers, logs and analytics), plus
  a JSON data backup and a reset-to-baseline control under admin settings.
- **Responsive behaviour (v4)** — desktop keeps the natural page scroll with a
  sticky top bar and collapsible icon-rail sidebar; at ≤920px the shell becomes
  a fixed app frame: `body.mdt-app` locks the page, only `.content` scrolls
  (`overscroll-behavior: contain`), the side menu becomes a drawer whose open
  state sets `html.mlock` and freezes the background, the viewport policy
  (`maximum-scale=1, user-scalable=no`) blocks pinch/double-tap zoom, and
  `html{overflow-x: clip}` prevents sideways panning. The demo tour
  (`demo-video/CampusOne_Demo_V6.html`) is a single self-contained file that
  embeds every page and asset of this application via srcdoc.
- **Mobile tables (v6)** — at ≤920px/≤560px `table.tbl` drops its 560px
  minimum, shrinks font/padding with the viewport, wraps long cell content
  (`overflow-wrap`), and compacts in-table buttons, badges and ETA chips: the
  full table is always visible on the phone screen. The timetable grid and
  calendar scale their cells the same way.
- **Outing deadline (v6)** — `outingRequests[].deadline` (ISO date) is
  requested by the raiser at submission; `WF.submitOuting` stamps it into the
  timeline, notifies the warden, and `UI.reqDeadlineChip` renders it on the
  student, warden and Academic Director screens plus every outing CSV.
- **Integrations (v6)** — `DB.settings.integrations` holds the Google Sheets
  channel (`gsheet.url/key/sheetId`) and Drive storage (`drive.key/folder`)
  placeholders. `WF.saveIntegrations` (Admin → Settings) persists them
  (also under the independent `MDT_INTEGRATIONS` localStorage key, surviving
  demo resets) and `Api.url()` resolves the live endpoint dynamically — the
  background source of every view follows the admin's change immediately.
- **Single-page core (v7)** — `assets/js/spa.js` owns the view registry, the
  session guard, the virtual-path resolver and the capture-phase link
  interceptor. `SPA.doc()` scopes delegated listeners to the current view;
  `SPA.refresh()` re-renders the current view in place (replacing page
  reloads); `SPA.query` carries virtual query strings between views. The
  document title is set once in `index.html` and never mutated; the address
  bar is never touched during navigation.

---

## 8 · Extension guide

1. **New view** — append another `MDTPAGE({...})` block to `assets/js/pages.js`
   and register it in `NAV` (assets/js/app.js); the router picks it up with the
   key `folder/id` (no new files, the address never changes).
2. **New governed action** — add a function in workflow.js: mutate the store,
   `WF.log(...)`, `WF.notify(...)`, `Store.save()`.
3. **New role** — add a folder + NAV section, a role value on users, guard entry
   in `App.boot`, and rows in the permission matrix (admin/roles.html).
4. **Going live** — follow `backend/SETUP_GUIDE.md`; the UI needs no changes.
