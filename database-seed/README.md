# Seed Workbook — MDT_CampusOne_Seed.xlsx

Import this workbook to stand up the live data grid for the portal (maintainer
step — see `backend/SETUP_GUIDE.md`). 40 sheets · ~1,400 reference rows.

## Import order

Settings → Departments → Classes → Staff → Users → Students → Courses →
CourseAllocations → Timetable → CoursePlan → everything else (order-free).

## Conventions

- Row 1 on every sheet = machine-readable headers — keep them exactly as-is.
- Column A = record ID; the channel auto-generates next IDs on insert.
- Pipe-separated lists: `HostelRooms.occupants`, `MentorGroups.students`,
  `ScholarshipApps.docs`.
- JSON text columns (timelines, threads) preserve the portal's approval history
  structure: `ODRequests.timeline`, `LeaveRequests.timeline`,
  `OutingRequests.timeline`, `ScholarshipApps.timeline`, `Tickets.thread`.
- Boolean-ish columns use Yes/No.
- `Users.pass` holds the demo credential `demo123` — rotate before production.

## Sheet guide

The `README` sheet inside the workbook carries the same entity guide, so the
mapping travels with the file.
