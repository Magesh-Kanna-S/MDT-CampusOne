/* My Desktop Tech — CampusOne · v8 single-page application core (v7 core, v8 roles)
   ─────────────────────────────────────────────────────────────────
   One clean address · one constant tab title · no deep links.
   • every view of the portal registers here and renders inside this
     single document, so the browser address never changes and never
     exposes a .html page name — the portal is served from one URL
   • the document title stays fixed ("CampusOne — My Desktop Tech")
     like a professional portal, whatever view is on screen
   • there are no per-page links to open, share or guess: the portal
     boots at its one address, requires a signed-in session, and every
     navigation is an internal, secured transition (a stray URL only
     meets the sign-in screen — see 404.html)
   • anything that used to be a page link is intercepted and resolved
     against the virtual folder of the current view
   • page scripts register their delegated document listeners through
     SPA.doc() so they are swept automatically on every navigation —
     no listener leaks between views */
(function (g) {
'use strict';

var ROLE_DIR = { student: 'student', teacher: 'teacher', academic: 'academic', principal: 'principal', warden: 'warden', office: 'office', admin: 'admin', library: 'library', examcell: 'examcell', placement: 'placement', accounts: 'accounts', iqac: 'iqac' };

var SPA = {
  pages: {},        /* 'folder/id' -> view cfg (from pages.js) */
  login: null,      /* sign-in view cfg */
  current: null,    /* current view key, e.g. 'student/fees' */
  folder: '',       /* virtual folder of the current view */
  query: '',        /* virtual query string of the current view */
  denied: false,    /* set when a role/session check bounced to sign-in */
  token: 0,         /* ownership token for page-scoped listeners */
  listeners: []     /* live SPA.doc listeners of the current view */
};

/* ── view registration — replaces the v6 one-file-per-page boot ──
   pages.js calls MDTPAGE({...}) once per view at load time; the
   login view registers through MDTLOGIN. Nothing boots until
   SPA.start() decides between the sign-in screen and a session. */
SPA.register = function (cfg) { SPA.pages[cfg.folder + '/' + cfg.id] = cfg; };
SPA.registerLogin = function (cfg) { SPA.login = cfg; };
g.MDTPAGE = SPA.register;
g.MDTLOGIN = SPA.registerLogin;

/* ── page-scoped document listeners ──
   v6 page files registered delegated handlers directly on the
   document; in the single-page shell those would pile up across
   views. Every page script now registers through SPA.doc(): the
   wrapper only runs while its view owns the token, and the whole
   set is removed the moment the app moves to another view. */
SPA.doc = function (type, fn, capture) {
  var my = SPA.token;
  var wrapped = function (e) { if (SPA.token !== my) return; fn(e); };
  document.addEventListener(type, wrapped, capture);
  SPA.listeners.push([type, wrapped, capture]);
};
function sweep() {
  SPA.token++;
  var live = SPA.listeners;
  SPA.listeners = [];
  live.forEach(function (l) { document.removeEventListener(l[0], l[1], l[2]); });
}

/* ── session ── */
function session() {
  try { return JSON.parse(g.localStorage.getItem('MDT_SESSION')); } catch (e) { return null; }
}
function dashboardOf(role) {
  var dir = ROLE_DIR[role] || 'student';
  return SPA.pages[dir + '/dashboard'] ? dir + '/dashboard' : 'login';
}

/* ── virtual path resolution (mirrors how the v6 folders resolved) ──
   'fees.html' from student/fees -> 'student/fees'
   '../index.html'               -> 'login'
   'student/dashboard.html'      -> 'student/dashboard'
   'attendance.html?course=CS..' -> 'teacher/attendance' + query  */
function splitHref(href) {
  var i = href.indexOf('?');
  if (i < 0) return { path: href, query: '' };
  return { path: href.slice(0, i), query: href.slice(i + 1) };
}
function keyOf(path, fromFolder) {
  path = String(path || '').replace(/^\.\//, '');
  while (path.indexOf('../') === 0) { path = path.slice(3); fromFolder = ''; }
  if (path === '' || path === 'index.html' || path === 'index') return 'login';
  if (path.indexOf('/') < 0) path = (fromFolder ? fromFolder + '/' : '') + path;
  path = path.replace(/\.html$/, '');
  return SPA.pages[path] ? path : null;
}

/* ── navigate ── */
SPA.go = function (key, query) {
  sweep();
  try { g.UI.closeModal(); } catch (e) {}
  if (key === 'login') {
    SPA.current = null; SPA.folder = ''; SPA.query = '';
    document.body.className = '';
    try { document.documentElement.classList.remove('mlock'); } catch (e) {}
    var app = document.getElementById('app');
    app.className = '';
    g.Store.load(); g.DB = g.Store.db;
    SPA.login.render(app);
    SPA.denied = false;
    try { g.scrollTo(0, 0); } catch (e) {}
    return;
  }
  if (!SPA.pages[key]) key = dashboardOf(session() && session().role);
  var cfg = SPA.pages[key];
  SPA.current = key;
  SPA.folder = cfg.folder;
  SPA.query = query || '';
  /* release any open mobile drawer lock — the interceptor stops the
     v6 closeSide() handler, so the transition resets the lock itself */
  try { document.body.classList.remove('mlock'); document.documentElement.classList.remove('mlock'); } catch (e) {}
  App.boot(cfg); /* boots the shell; any auth failure routes back to 'login' */
  try { g.scrollTo(0, 0); } catch (e) {}
};

/* ── resolve an intercepted link against the current view and go ── */
SPA.follow = function (href) {
  var parts = splitHref(String(href || ''));
  var key = keyOf(parts.path, SPA.folder);
  if (!key) {
    try { g.UI.toast('Not available', 'That area could not be opened from here.', 'yellow'); } catch (e) {}
    return;
  }
  SPA.go(key, parts.query);
};

/* ── re-render the current view (replaces v6 location.reload) ── */
SPA.refresh = function () {
  if (SPA.current) SPA.go(SPA.current, SPA.query);
  else SPA.go('login');
};

/* ── global interception of every internal link (capture phase) ──
   hrefs that used to load a sibling .html page now become internal
   transitions; the address bar and the tab title never move. card
   "View all" targets (data-more) and notification links (data-nlink)
   are resolved the same way — previously dead, now working. */
document.addEventListener('click', function (e) {
  if (e.defaultPrevented) return;
  var t = e.target;
  if (!t || !t.closest) return;
  var el = t.closest('[data-nlink]');
  if (!el || !el.getAttribute('data-nlink')) el = t.closest('[data-more]');
  if (el) {
    var h = (el.getAttribute('data-nlink') || el.getAttribute('data-more') || '');
    if (h) { e.preventDefault(); e.stopPropagation(); SPA.follow(h); }
    return;
  }
  var a = t.closest('a[href]');
  if (!a) return;
  var href = a.getAttribute('href') || '';
  if (!href || href.indexOf('.html') < 0) return;               /* in-page anchors, buttons */
  if (/^[a-z]+:\/\//i.test(href) || href.indexOf('//') === 0) return; /* external */
  if (a.target && a.target !== '_self') return;                 /* external window */
  e.preventDefault();
  e.stopPropagation();
  SPA.follow(href);
}, true);

/* ── one clean address ──
   if the portal was opened as …/index.html the address is silently
   rewritten to the directory form, so a single canonical URL is
   always shown (no history entry is created). */
function canonicalAddress() {
  try {
    var p = g.location.pathname;
    if (/index\.html$/i.test(p)) g.history.replaceState(null, document.title, p.slice(0, -10));
  } catch (e) {}
}

/* ── boot: session first, sign-in otherwise — nothing is addressable ── */
SPA.start = function () {
  canonicalAddress();
  var sess = session();
  SPA.go(sess && sess.uid ? dashboardOf(sess.role) : 'login');
};

g.SPA = SPA;
})(window);
