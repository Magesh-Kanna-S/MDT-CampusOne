/* My Desktop Tech — CampusOne · application shell — auth, navigation, theme
   v8: 12 role portals; the shell renders views inside one document; navigations
   are internal (SPA.go / SPA.follow) — the address bar and the tab title
   never change. */
(function (g) {
'use strict';
var ROOT = window.MDT_ROOT || '';

/* ---------------- theme ---------------- */
var Theme = {
  KEY: 'MDT_THEME',
  apply: function (t) { document.documentElement.setAttribute('data-theme', t); try { g.localStorage.setItem(this.KEY, t); } catch (e) {} },
  get: function () { return document.documentElement.getAttribute('data-theme') || 'light'; },
  toggle: function () { this.apply(this.get() === 'dark' ? 'light' : 'dark'); },
  resetToLight: function () { this.apply('light'); }
};
try { var t = g.localStorage.getItem(Theme.KEY); if (t) Theme.apply(t); } catch (e) {}
g.Theme = Theme;

/* ---------------- auth ---------------- */
var Auth = {
  KEY: 'MDT_SESSION',
  user: function () { try { return JSON.parse(g.localStorage.getItem(this.KEY)); } catch (e) { return null; } },
  login: function (uid) {
    g.Store.load();
    var u = Q.user(uid);
    if (!u || !u.active) return null;
    u.lastLogin = g.DB.meta.today + ' ' + new Date().toTimeString().slice(0, 5);
    g.Store.save();
    g.localStorage.setItem(this.KEY, JSON.stringify({ uid: u.id, role: u.role }));
    Theme.resetToLight(); /* light theme on every login */
    return u;
  },
  logout: function () { g.localStorage.removeItem(this.KEY); SPA.go('login'); },
  signoutHere: function () { g.localStorage.removeItem(this.KEY); SPA.go('login'); }
};
g.Auth = Auth;

/* ---------------- navigation per role ---------------- */
var ACCOUNT_SEC = { sec: 'Account', items: [ { id: 'profile', label: 'My Profile', href: 'profile.html', ic: 'user' } ] };
var NAV = {
  student: [
    { sec: 'Overview', items: [
      { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', ic: 'home' },
      { id: 'notifications', label: 'Notifications', href: 'notifications.html', ic: 'bell' }
    ] },
    { sec: 'Academics', items: [
      { id: 'attendance', label: 'Attendance', href: 'attendance.html', ic: 'checkc' },
      { id: 'timetable', label: 'Class Schedule', href: 'timetable.html', ic: 'calendar' },
      { id: 'courses', label: 'Courses & Status', href: 'courses.html', ic: 'layers' },
      { id: 'exams', label: 'Exams & Scores', href: 'exams.html', ic: 'file' },
      { id: 'assignments', label: 'Assignments', href: 'assignments.html', ic: 'clipboard' },
      { id: 'quizzes', label: 'Quizzes', href: 'quizzes.html', ic: 'target' },
      { id: 'ranking', label: 'Rankings', href: 'ranking.html', ic: 'trophy' },
      { id: 'calendar', label: 'Academic Calendar', href: 'calendar.html', ic: 'calendar' }
    ] },
    { sec: 'Requests & Fees', items: [
      { id: 'fees', label: 'Fees', href: 'fees.html', ic: 'rupee' },
      { id: 'od', label: 'On Duty (OD)', href: 'od.html', ic: 'door' },
      { id: 'leave', label: 'Leave', href: 'leave.html', ic: 'key' },
      { id: 'tickets', label: 'Help Tickets', href: 'tickets.html', ic: 'ticket' }
    ] },
    { sec: 'Hostel Life', items: [
      { id: 'hostel', label: 'My Hostel', href: 'hostel.html', ic: 'bed', hostel: true },
      { id: 'outing', label: 'Outing Requests', href: 'outing.html', ic: 'door', hostel: true },
      { id: 'mess', label: 'Mess Timetable', href: 'mess.html', ic: 'utensils', hostel: true }
    ] },
    { sec: 'Resources', items: [
      { id: 'library', label: 'Library', href: 'library.html', ic: 'book' },
      { id: 'elearning', label: 'e-Learning', href: 'elearning.html', ic: 'play' },
      { id: 'mentor', label: 'Mentor', href: 'mentor.html', ic: 'users' },
      { id: 'placement', label: 'Placement', href: 'placement.html', ic: 'briefcase' },
      { id: 'scholarship', label: 'Scholarships', href: 'scholarship.html', ic: 'medal' }
    ] },
    { sec: 'Account', items: [ { id: 'profile', label: 'My Profile', href: 'profile.html', ic: 'user' } ] }
  ],
  teacher: [
    { sec: 'Overview', items: [ { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', ic: 'home' } ] },
    { sec: 'Teaching', items: [
      { id: 'courses', label: 'My Courses', href: 'courses.html', ic: 'layers' },
      { id: 'attendance', label: 'Take Attendance', href: 'attendance.html', ic: 'checkc' },
      { id: 'assignments', label: 'Assignments', href: 'assignments.html', ic: 'clipboard' },
      { id: 'quizzes', label: 'Quizzes', href: 'quizzes.html', ic: 'target' },
      { id: 'exams', label: 'Marks Entry', href: 'exams.html', ic: 'chart' },
      { id: 'schedule', label: 'My Schedule', href: 'schedule.html', ic: 'calendar' },
      { id: 'students', label: 'My Students', href: 'students.html', ic: 'users' },
      { id: 'materials', label: 'Course Materials', href: 'materials.html', ic: 'play' },
      { id: 'elearning', label: 'e-Learning Studio', href: 'elearning.html', ic: 'play' },
      { id: 'previous', label: 'Previous Semester Courses', href: 'previous.html', ic: 'layers' },
      { id: 'attainment', label: 'Course Attainment', href: 'attainment.html', ic: 'chart' }
    ] },
    { sec: 'Self Service (HRMS)', items: [
      { id: 'leaves', label: 'My Leave & Swap', href: 'leaves.html', ic: 'key' },
      { id: 'appraisal', label: 'My Appraisal', href: 'appraisal.html', ic: 'medal' }
    ] },
    { sec: 'Mentoring', items: [ { id: 'mentor', label: 'Mentor Group', href: 'mentor.html', ic: 'users' } ] },
    { sec: 'Class Advisor', items: [
      { id: 'advisor-requests', label: 'OD & Leave Review', href: 'advisor-requests.html', ic: 'door', advisor: true },
      { id: 'advisor-class', label: 'Class Overview', href: 'advisor-class.html', ic: 'grid', advisor: true }
    ] },
    { sec: 'Account', items: [ { id: 'profile', label: 'My Profile', href: 'profile.html', ic: 'user' } ] }
  ],
  academic: [
    { sec: 'Overview', items: [ { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', ic: 'home' } ] },
    { sec: 'Approvals', items: [
      { id: 'od', label: 'OD Approvals', href: 'od.html', ic: 'door' },
      { id: 'outing', label: 'Night Outings', href: 'outing.html', ic: 'key' },
      { id: 'leaves', label: 'Leave Approvals', href: 'leaves.html', ic: 'list' }
    ] },
    { sec: 'Academics', items: [
      { id: 'allocations', label: 'Course Allocation', href: 'allocations.html', ic: 'layers' },
      { id: 'timetable', label: 'Timetable & Reschedules', href: 'timetable.html', ic: 'calendar' },
      { id: 'semesters', label: 'Semesters & Results', href: 'semesters.html', ic: 'cap' },
      { id: 'staff', label: 'Faculty & Workload', href: 'staff.html', ic: 'users' },
      { id: 'reports', label: 'Class Reports', href: 'reports.html', ic: 'chart' }
    ] },
    ACCOUNT_SEC
  ],
  principal: [
    { sec: 'Overview', items: [ { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', ic: 'grid' } ] },
    { sec: 'Governance', items: [
      { id: 'approvals', label: 'Approvals', href: 'approvals.html', ic: 'checkc' },
      { id: 'academics', label: 'Academics', href: 'academics.html', ic: 'cap' },
      { id: 'finance', label: 'Fee & Finance', href: 'finance.html', ic: 'rupee' },
      { id: 'staff', label: 'Staff Overview', href: 'staff.html', ic: 'users' },
      { id: 'hostel', label: 'Hostel Overview', href: 'hostel.html', ic: 'bed' }
    ] },
    { sec: 'Communication', items: [ { id: 'circulars', label: 'Circulars & News', href: 'circulars.html', ic: 'send' } ] },
    ACCOUNT_SEC
  ],
  warden: [
    { sec: 'Overview', items: [ { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', ic: 'home' } ] },
    { sec: 'My Block', items: [
      { id: 'outings', label: 'Outing Approvals', href: 'outings.html', ic: 'door' },
      { id: 'rooms', label: 'Room Allocation', href: 'rooms.html', ic: 'key' },
      { id: 'residents', label: 'Residents', href: 'residents.html', ic: 'users' },
      { id: 'mess', label: 'Mess Menu', href: 'mess.html', ic: 'utensils' },
      { id: 'complaints', label: 'Complaints', href: 'complaints.html', ic: 'wrench' }
    ] },
    { sec: 'Account', items: [ { id: 'profile', label: 'My Profile', href: 'profile.html', ic: 'user' } ] }
  ],
  office: [
    { sec: 'Overview', items: [ { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', ic: 'home' } ] },
    { sec: 'Student Services', items: [
      { id: 'fees', label: 'Fee Management', href: 'fees.html', ic: 'rupee' },
      { id: 'certificates', label: 'Certificates', href: 'certificates.html', ic: 'file' },
      { id: 'halltickets', label: 'Hall Tickets', href: 'halltickets.html', ic: 'idcard' },
      { id: 'records', label: 'Student Records', href: 'records.html', ic: 'users' }
    ] },
    { sec: 'Campus Services', items: [
      { id: 'library', label: 'Library Desk', href: 'library.html', ic: 'book' },
      { id: 'placement', label: 'Placement Cell', href: 'placement.html', ic: 'briefcase' },
      { id: 'scholarships', label: 'Scholarships', href: 'scholarships.html', ic: 'medal' },
      { id: 'tickets', label: 'Help Tickets', href: 'tickets.html', ic: 'ticket' }
    ] },
    ACCOUNT_SEC
  ],
  library: [
    { sec: 'Overview', items: [ { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', ic: 'home' } ] },
    { sec: 'Circulation', items: [
      { id: 'transactions', label: 'Issue · Return · Renew', href: 'transactions.html', ic: 'key' },
      { id: 'members', label: 'Members', href: 'members.html', ic: 'users' },
      { id: 'fines', label: 'Fines & Payments', href: 'fines.html', ic: 'rupee' }
    ] },
    { sec: 'Collection', items: [
      { id: 'catalog', label: 'Catalogue (OPAC)', href: 'catalog.html', ic: 'book' },
      { id: 'ebooks', label: 'eBooks', href: 'ebooks.html', ic: 'play' },
      { id: 'journals', label: 'Journals & Periodicals', href: 'journals.html', ic: 'list' },
      { id: 'digital', label: 'Digital Resources', href: 'digital.html', ic: 'globe' }
    ] },
    { sec: 'Administration', items: [
      { id: 'procurement', label: 'Procurement', href: 'procurement.html', ic: 'clipboard' },
      { id: 'inventory', label: 'Inventory & Stock', href: 'inventory.html', ic: 'grid' }
    ] },
    { sec: 'Account', items: [ { id: 'profile', label: 'My Profile', href: 'profile.html', ic: 'user' } ] }
  ],
  examcell: [
    { sec: 'Overview', items: [ { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', ic: 'home' } ] },
    { sec: 'Examinations', items: [
      { id: 'exams', label: 'Exam Schedule & Seating', href: 'exams.html', ic: 'calendar' },
      { id: 'attendance', label: 'Exam Attendance', href: 'attendance.html', ic: 'checkc' },
      { id: 'valuation', label: 'Online Valuation', href: 'valuation.html', ic: 'chart' }
    ] },
    { sec: 'Results', items: [
      { id: 'results', label: 'Results & Publishing', href: 'results.html', ic: 'cap' },
      { id: 'revaluation', label: 'Revaluation', href: 'revaluation.html', ic: 'target' },
      { id: 'transcripts', label: 'Transcripts & Marksheets', href: 'transcripts.html', ic: 'file' }
    ] },
    { sec: 'Account', items: [ { id: 'profile', label: 'My Profile', href: 'profile.html', ic: 'user' } ] }
  ],
  placement: [
    { sec: 'Overview', items: [ { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', ic: 'home' } ] },
    { sec: 'Recruitment', items: [
      { id: 'recruiters', label: 'Recruiters & MoUs', href: 'recruiters.html', ic: 'briefcase' },
      { id: 'drives', label: 'Placement Drives', href: 'drives.html', ic: 'calendar' },
      { id: 'students', label: 'Placement Register', href: 'students.html', ic: 'users' }
    ] },
    { sec: 'Preparedness', items: [
      { id: 'training', label: 'Training Batches', href: 'training.html', ic: 'target' },
      { id: 'internships', label: 'Internships', href: 'internships.html', ic: 'door' }
    ] },
    { sec: 'Account', items: [ { id: 'profile', label: 'My Profile', href: 'profile.html', ic: 'user' } ] }
  ],
  accounts: [
    { sec: 'Overview', items: [ { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', ic: 'home' } ] },
    { sec: 'Operations', items: [
      { id: 'collections', label: 'Collections & Day Book', href: 'collections.html', ic: 'rupee' },
      { id: 'expenses', label: 'Expense Vouchers', href: 'expenses.html', ic: 'file' },
      { id: 'payroll', label: 'Payroll', href: 'payroll.html', ic: 'users' }
    ] },
    { sec: 'Planning', items: [
      { id: 'budgets', label: 'Budgets', href: 'budgets.html', ic: 'chart' },
      { id: 'vendors', label: 'Vendors & POs', href: 'vendors.html', ic: 'grid' }
    ] },
    { sec: 'Account', items: [ { id: 'profile', label: 'My Profile', href: 'profile.html', ic: 'user' } ] }
  ],
  iqac: [
    { sec: 'Overview', items: [ { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', ic: 'home' } ] },
    { sec: 'Quality Cycles', items: [
      { id: 'surveys', label: 'Surveys', href: 'surveys.html', ic: 'list' },
      { id: 'copo', label: 'CO-PO Attainment', href: 'copo.html', ic: 'chart' },
      { id: 'reports', label: 'Feedback Reports', href: 'reports.html', ic: 'file' }
    ] },
    { sec: 'Accreditation', items: [
      { id: 'audits', label: 'Audit Calendar', href: 'audits.html', ic: 'checkc' },
      { id: 'criteria', label: 'NAAC Criteria', href: 'criteria.html', ic: 'medal' }
    ] },
    { sec: 'Account', items: [ { id: 'profile', label: 'My Profile', href: 'profile.html', ic: 'user' } ] }
  ],
  admin: [
    { sec: 'Overview', items: [ { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', ic: 'grid' } ] },
    { sec: 'Access', items: [
      { id: 'users', label: 'User Accounts', href: 'users.html', ic: 'users' },
      { id: 'roles', label: 'Roles & Permissions', href: 'roles.html', ic: 'shield' }
    ] },
    { sec: 'Platform', items: [
      { id: 'calendar', label: 'Academic Calendar', href: 'calendar.html', ic: 'calendar' },
      { id: 'news', label: 'Circulars & News', href: 'news.html', ic: 'send' },
      { id: 'logs', label: 'Activity Log', href: 'logs.html', ic: 'list' }
    ] },
    { sec: 'Config', items: [ { id: 'settings', label: 'Settings', href: 'settings.html', ic: 'gear' } ] },
    ACCOUNT_SEC
  ]
};
var ROLE_LABEL = { student: 'Student', teacher: 'Faculty', academic: 'Academic Director', principal: 'Principal', warden: 'Hostel Warden', office: 'Office', admin: 'Administrator', library: 'Library', examcell: 'Examination Cell', placement: 'Placement Cell', accounts: 'Accounts', iqac: 'IQAC' };
var ROLE_TINT = { student: 'b', teacher: 'g', academic: 'y', principal: 'r', warden: 'b', office: 'g', admin: 'y', library: 'g', examcell: 'y', placement: 'b', accounts: 'r', iqac: 'y' };

/* ---------------- app boot ---------------- */
var App = {};
App.boot = function (cfg) {
  g.Store.load();
  g.DB = g.Store.db;
  var sess = Auth.user();
  if (!sess) { SPA.denied = true; SPA.go('login'); return; }
  var user = Q.user(sess.uid);
  if (!user || !user.active) { SPA.denied = true; SPA.go('login'); return; }
  if (cfg.role && user.role !== cfg.role) { SPA.denied = true; SPA.go('login'); return; }
  var person = user.personType === 'student' ? Q.studentById(user.personId) : Q.person(user.personId);
  var ctx = { user: user, person: person, role: user.role, root: ROOT };

  /* build shell — v5: full-width top bar with the side-menu button docked at
     the exact top-left corner; side rail + main column sit in .bodyrow below it */
  document.body.classList.add('mdt-app');
  var app = document.getElementById('app');
  app.className = 'shell';
  var isStudent = user.role === 'student';
  try { if (g.localStorage.getItem('MDT_NAV_MINI') === '1') document.body.classList.add('nav-mini'); } catch (e) {}
  app.innerHTML =
    '<div class="scrim" id="scrim"></div>' +
    '<header class="topbar">' +
      '<button class="iconbtn edge" id="navToggle" title="Hide side menu">' + UI.icon('panel') + '</button>' +
      '<button class="iconbtn edge burger" id="burger" title="Open menu">' + UI.icon('menu') + '</button>' +
      '<a class="brand" href="' + cfg.folder + '/dashboard.html"><img src="' + ROOT + 'assets/img/logo-square.png" alt="MDT">' +
      '<span class="bt"><b>My Desktop Tech</b><span>CampusOne · ' + ROLE_LABEL[user.role] + '</span></span></a>' +
      '<span class="chip-demo">DEMO</span>' +
      '<span class="spacer"></span>' +
      '<button class="iconbtn toputil" id="themeBtn" title="Toggle light / dark theme">' + UI.icon(Theme.get() === 'dark' ? 'sun' : 'moon') + '</button>' +
      '<div class="dd toputil" id="notifDD"><button class="iconbtn" id="notifBtn" title="Notifications">' + UI.icon('bell') + '<span class="dot" id="notifDot"></span></button>' +
      '<div class="ddmenu" id="notifMenu"></div></div>' +
      '<div class="dd" id="profDD"><div class="profile" id="profBtn" title="Account">' + UI.avatar(person, 34) +
      '<span class="nm"><b>' + UI.esc(person ? person.name : user.email) + '</b><span>' + ROLE_LABEL[user.role] + '</span></span><span class="chev">' + UI.icon('chevD') + '</span></div>' +
      '<div class="ddmenu" id="profMenu"></div></div>' +
    '</header>' +
    '<div class="bodyrow"><div class="sidebar" id="sidebar">' + App.sidebar(cfg, person) + '</div>' +
    '<div class="mainwrap"><main class="content" id="view"></main>' +
    '<footer class="footer"><span>© 2026 My Desktop Tech · CampusOne — ' + UI.esc(DB.settings.institute) + '</span>' +
    '<span class="fdots"><i style="background:var(--g-blue)"></i><i style="background:var(--g-red)"></i><i style="background:var(--g-yellow)"></i><i style="background:var(--g-green)"></i>' +
    '<span style="margin-left:6px">Unified multi-tier campus architecture</span></span></footer></div></div>';

  /* bindings */
  App.setThemeUI = function () {
    var dark = Theme.get() === 'dark';
    var tb = document.getElementById('themeBtn'); if (tb) tb.innerHTML = UI.icon(dark ? 'sun' : 'moon');
    var si = document.getElementById('suThemeIc'); if (si) si.innerHTML = UI.icon(dark ? 'sun' : 'moon');
    var sl = document.getElementById('suThemeLab'); if (sl) sl.textContent = dark ? 'Dark theme · on' : 'Light theme · on';
    var lab = document.getElementById('dd-theme-lab'); if (lab) lab.textContent = dark ? 'Dark' : 'Light';
  };
  document.getElementById('themeBtn').addEventListener('click', function () { Theme.toggle(); App.setThemeUI(); });
  var suTheme = document.getElementById('suTheme');
  if (suTheme) suTheme.addEventListener('click', function () { Theme.toggle(); App.setThemeUI(); });
  var navToggle = document.getElementById('navToggle');
  navToggle.addEventListener('click', function () {
    var mini = document.body.classList.toggle('nav-mini');
    try { g.localStorage.setItem('MDT_NAV_MINI', mini ? '1' : '0'); } catch (e) {}
    navToggle.title = mini ? 'Show side menu' : 'Hide side menu';
  });
  var burger = document.getElementById('burger');
  var scrim = document.getElementById('scrim');
  var sidebar = document.getElementById('sidebar');
  /* drawer: opening locks the page behind it so the background never scrolls */
  function sideIsOpen() { return sidebar.classList.contains('open'); }
  function setSide(open) {
    sidebar.classList.toggle('open', open);
    scrim.classList.toggle('show', open);
    document.documentElement.classList.toggle('mlock', open);
    document.body.classList.toggle('mlock', open);
    if (burger) { burger.title = open ? 'Close menu' : 'Open menu'; burger.innerHTML = UI.icon(open ? 'x' : 'menu'); }
  }
  function closeSide() { setSide(false); }
  if (burger) burger.addEventListener('click', function () { setSide(!sideIsOpen()); });
  if (scrim) scrim.addEventListener('click', closeSide);
  sidebar.querySelectorAll('.navitem').forEach(function (a) { a.addEventListener('click', closeSide); });
  SPA.doc('keydown', function (e) { if (e.key === 'Escape' && sideIsOpen()) closeSide(); });
  /* growing back to desktop width closes the drawer and releases the lock */
  try {
    var mqWide = g.matchMedia('(min-width:921px)');
    var onWide = function () { if (mqWide.matches) closeSide(); };
    if (mqWide.addEventListener) mqWide.addEventListener('change', onWide);
    else if (mqWide.addListener) mqWide.addListener(onWide);
  } catch (e) {}
  App.renderNotifs(person, user, cfg);
  App.renderProfile(person, user, cfg);
  var view = document.getElementById('view');
  try { cfg.render(view, ctx); } catch (err) {
    view.innerHTML = UI.hint('This view could not be rendered — please refresh the page.', 'danger', 'alert');
    if (g.console) console.error(err);
  }
  UI.bindPhoto(view);
  /* v6: adaptive tables — phones get stacked rows when a table can't fit */
  UI.adaptTables(view);
  try {
    var rszT = null;
    g.removeEventListener('resize', g.__mdtAdapt);
    g.__mdtAdapt = function () { clearTimeout(rszT); rszT = setTimeout(function () { UI.adaptTables(document.getElementById('view')); }, 140); };
    g.addEventListener('resize', g.__mdtAdapt);
  } catch (e) {}
};
App.sidebar = function (cfg, person) {
  var sess = Auth.user(), user = Q.user(sess.uid);
  var nav = NAV[user.role] || [];
  var unreadN = Q.notifsFor(user, person).filter(function (n) { return !n.read; }).length;
  var h = '';
  /* utilities — shown in the side menu on small screens (no topbar overlap) */
  h += '<div class="side-utils">' +
    '<button type="button" class="su-row" id="suTheme"><span id="suThemeIc">' + UI.icon(Theme.get() === 'dark' ? 'sun' : 'moon') + '</span><span id="suThemeLab">' + (Theme.get() === 'dark' ? 'Dark theme · on' : 'Light theme · on') + '</span></button>' +
    '<button type="button" class="su-row" id="suNotifBtn">' + UI.icon('bell') + '<span>Notifications</span>' +
    (unreadN ? '<span class="pill" id="suNotifBadge">' + unreadN + '</span>' : '<span class="pill" id="suNotifBadge" style="display:none"></span>') + '</button>' +
    '<div class="su-notifs" id="suNotifList"></div></div>';
  nav.forEach(function (sec) {
    var items = sec.items.filter(function (it) {
      if (it.hostel) return user.role === 'student' && person && person.hostel;
      if (it.advisor) return user.role === 'teacher' && person && person.advisorClass;
      return true;
    });
    if (!items.length) return;
    h += '<div class="side-sec">' + sec.sec + '</div>';
    items.forEach(function (it) {
      var badge = '';
      if (it.id === 'notifications' && user.role === 'student') {
        var n = Q.notifsFor(user, person).filter(function (x) { return !x.read; }).length;
        if (n) badge = '<span class="pill y">' + n + '</span>';
      }
      if (it.id === 'advisor-requests' && person && person.advisorClass) {
        var pend = DB.odRequests.filter(function (r) { return r.status === 'Submitted' && Q.studentById(r.studentId) && Q.studentById(r.studentId).classId === person.advisorClass; }).length +
                   DB.leaveRequests.filter(function (r) { return r.status === 'Submitted' && Q.studentById(r.studentId) && Q.studentById(r.studentId).classId === person.advisorClass; }).length;
        if (pend) badge = '<span class="pill y">' + pend + '</span>';
      }
      if (user.role === 'academic' && it.id === 'od') {
        var p2 = DB.odRequests.filter(function (r) { return r.status === 'Recommended'; }).length;
        if (p2) badge = '<span class="pill y">' + p2 + '</span>';
      }
      h += '<a class="navitem' + (it.id === cfg.id ? ' active' : '') + '" href="' + it.href + '" title="' + UI.esc(it.label) + '">' + UI.icon(it.ic) + '<span>' + it.label + '</span>' + badge + '</a>';
    });
  });
  h += '<div class="sidefoot"><b>' + DB.settings.institute + '</b>Academic year ' + DB.settings.academicYear + ' · Semester ' + DB.settings.currentSem + '</div>';
  return h;
};
App.renderNotifs = function (person, user, cfg) {
  var btn = document.getElementById('notifBtn'), menu = document.getElementById('notifMenu');
  var sBtn = document.getElementById('suNotifBtn'), sList = document.getElementById('suNotifList'), sBadge = document.getElementById('suNotifBadge');
  var list = Q.notifsFor(user, person);
  var unread = list.filter(function (n) { return !n.read; }).length;
  var dot = document.getElementById('notifDot');
  if (dot) { dot.style.display = unread ? 'flex' : 'none'; dot.textContent = unread > 9 ? '9+' : unread; }
  if (sBadge) { sBadge.style.display = unread ? 'inline-flex' : 'none'; if (unread) sBadge.textContent = unread > 9 ? '9+' : unread; }
  function itemsHTML() {
    return (list.length ? list.slice(0, 8).map(function (n) {
      return '<div class="ddi' + (n.read ? '' : ' unread') + '" data-nlink="' + (n.link || '') + '"><span class="ic">' + UI.icon('bell') + '</span>' +
        '<span class="tt"><b>' + UI.esc(n.title) + '</b><span>' + UI.esc(n.body) + '</span></span><span class="ltime">' + UI.esc(n.at.slice(5, 16)) + '</span></div>';
    }).join('') : UI.empty('No notifications', 'bell')) +
      (list.length > 8 ? '<div class="ddsep"></div><a class="ddlink" href="' + (user.role === 'student' ? 'notifications.html' : 'dashboard.html') + '">' + UI.icon('list') + 'View all</a>' : '');
  }
  function markRead() {
    if (!list.filter(function (n) { return !n.read; }).length) return;
    DB.notifications.forEach(function (n) { if (Q.notifsFor(user, person).indexOf(n) >= 0) n.read = true; });
    g.Store.save();
    if (dot) dot.style.display = 'none';
    if (sBadge) sBadge.style.display = 'none';
  }
  if (btn && menu) btn.addEventListener('click', function (e) {
    e.stopPropagation();
    document.getElementById('profMenu').classList.remove('open');
    if (sList) sList.classList.remove('open');
    menu.classList.toggle('open');
    menu.innerHTML = '<div class="ddh">Notifications</div>' + itemsHTML();
    markRead();
  });
  if (sBtn && sList) sBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (menu) menu.classList.remove('open');
    var open = sList.classList.toggle('open');
    if (open) { sList.innerHTML = '<div class="ddh">Notifications</div>' + itemsHTML(); markRead(); }
  });
  [menu, sList].forEach(function (root) {
    if (!root) return;
    root.addEventListener('click', function (e) {
      var el = e.target.closest('[data-nlink]');
      if (el && el.getAttribute('data-nlink')) { SPA.follow(el.getAttribute('data-nlink')); }
    });
  });
};
App.renderProfile = function (person, user, cfg) {
  var btn = document.getElementById('profBtn'), menu = document.getElementById('profMenu');
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    document.getElementById('notifMenu').classList.remove('open');
    menu.classList.toggle('open');
    menu.innerHTML =
      '<div class="ddi" style="cursor:default">' + UI.avatar(person, 44) + '<span class="tt"><b>' + UI.esc(person ? person.name : '') + '</b>' +
      '<span>' + UI.esc(user.email) + '</span></span></div><div class="ddsep"></div>' +
      '<a class="ddlink" href="' + (cfg.profileHref || 'profile.html') + '">' + UI.icon('user') + 'My profile</a>' +
      '<div class="ddlink" id="dd-theme"><span style="display:flex;align-items:center;gap:10px">' + UI.icon(Theme.get() === 'dark' ? 'sun' : 'moon') + 'Appearance · <b id="dd-theme-lab">' + (Theme.get() === 'dark' ? 'Dark' : 'Light') + '</b></span></div>' +
      '<div class="ddsep"></div>' +
      '<div class="ddlink danger" id="dd-logout">' + UI.icon('logout') + 'Sign out</div>';
    document.getElementById('dd-theme').addEventListener('click', function () {
      Theme.toggle();
      App.setThemeUI();
    });
    document.getElementById('dd-logout').addEventListener('click', function () { Auth.signoutHere(); });
  });
};
document.addEventListener('click', function () {
  ['notifMenu', 'profMenu'].forEach(function (id) { var m = document.getElementById(id); if (m) m.classList.remove('open'); });
});
g.App = App;

/* v8: view registration and boot live in the single-page core (spa.js) —
   assets/js/pages.js registers every view through MDTPAGE, and SPA.start()
   decides between the sign-in screen and a restored session. */
})(window);
