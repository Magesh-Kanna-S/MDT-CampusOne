/* v8 — photo updates refresh the current view in place (SPA.refresh) 
   instead of reloading the document — the address never moves. */
/* My Desktop Tech — CampusOne · UI kit */
(function (g) {
'use strict';
var UI = {};
var ROOT = window.MDT_ROOT || '';

/* ---------------- icons ---------------- */
var P = {
  home:'M3 11.5 12 4l9 7.5M5 10v10h5v-6h4v6h5V10',
  grid:'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  bell:'M6 16v-5a6 6 0 0112 0v5l2 3H4zM10 21a2 2 0 004 0',
  calendar:'M5 6h14v14H5zM8 3v4M16 3v4M5 10h14M9 14h2M13 14h2M9 17h2M13 17h2',
  clock:'M12 4a8 8 0 100 16 8 8 0 000-16zM12 8v4l3 2',
  book:'M5 4a2 2 0 012-2h12v18H7a2 2 0 00-2-2zM9 3v18',
  play:'M8 6v12l10-6z',
  file:'M6 3h9l4 4v14H6zM14 3v5h5M9 12h6M9 16h4',
  clipboard:'M9 5H7v16h10V5h-2M9 5V3h6v2M9 11h6M9 15h4',
  check:'M5 13l4 4L19 7',
  x:'M6 6l12 12M18 6L6 18',
  user:'M12 4a4 4 0 100 8 4 4 0 000-8zM4 21c0-4 4-6 8-6s8 2 8 6',
  users:'M9 4a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5M16 4a3.5 3.5 0 010 7M15 14c3 .5 7 1.5 7 6',
  wallet:'M4 7h16v12H4zM4 7l11-3v3M15 13h3',
  rupee:'M7 4h10M7 8h10M8 12h5a4 4 0 004-8M13 12l5 8M13 12H8l5 8',
  trophy:'M7 4h10v4a5 5 0 01-10 0zM7 5H4v2a3 3 0 003 3M17 5h3v2a3 3 0 01-3 3M12 13v4M8 21h8l-1-4h-6z',
  star:'M12 3l2.7 5.8 6.3.8-4.6 4.3 1.2 6.1-5.6-3.1-5.6 3.1 1.2-6.1L3 9.6l6.3-.8z',
  briefcase:'M4 8h16v12H4zM9 8V6a2 2 0 012-2h2a2 2 0 012 2v2M4 13h16',
  cap:'M3 9l9-4 9 4-9 4zM6 11.5V16c2 1.6 10 1.6 12 0v-4.5M21 9v5',
  bed:'M3 18v-8h18v8M3 13h18M3 10V7M7 11a2 2 0 100 .01',
  building:'M5 21V5h8v16M13 9h6v12M8 8h2M8 12h2M8 16h2M16 13h2M16 17h2M4 21h17',
  door:'M6 21V4a1 1 0 011-1h10a1 1 0 011 1v17M6 21h12M14 12h.01',
  key:'M8 4a4 4 0 100 8 4 4 0 000-8zM11 11l9 9M17 17l2-2M14 14l2-2',
  moon:'M20 14A8 8 0 1110 4a6.5 6.5 0 0010 10z',
  sun:'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4',
  gear:'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v3M12 19v3M2 12h3M19 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M19.4 4.6l-2.1 2.1M6.7 17.3l-2.1 2.1',
  shield:'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  lock:'M6 11h12v10H6zM8 11V8a4 4 0 018 0v3',
  mail:'M4 6h16v13H4zM4 7l8 6 8-6',
  phone:'M5 4h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
  pin:'M12 21s-7-5.5-7-11a7 7 0 0114 0c0 5.5-7 11-7 11zM12 8a2.5 2.5 0 100 5 2.5 2.5 0 000-5z',
  chart:'M4 20V10M10 20V4M16 20v-6M2 20h20',
  pie:'M12 3a9 9 0 109 9h-9z',
  trend:'M3 17l6-6 4 4 8-8M15 7h6v6',
  layers:'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  list:'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  message:'M4 5h16v11H9l-5 4z',
  ticket:'M4 7h16v3a2 2 0 000 4v3H4v-3a2 2 0 000-4zM13 8v8',
  wrench:'M6 21a3 3 0 110-6l9.5-9.5a3 3 0 114 4L11 17',
  utensils:'M7 3v8M5 3v5a2 2 0 004 0V3M16 3c0 6-3 7-3 10v8M13 12h6',
  camera:'M4 8h3l1.5-3h7L17 8h3v12H4zM12 11a4 4 0 100 8 4 4 0 000-8z',
  image:'M4 5h16v14H4zM8 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM4 17l6-6 4 4 3-3 3 3',
  eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z',
  printer:'M7 8V3h10v5M5 8h14v8h-3v5H8v-5H5zM9 14h6',
  send:'M22 2L11 13M22 2l-7 20-4-9-9-4z',
  logout:'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
  menu:'M4 7h16M4 12h16M4 17h16',
  chevD:'M6 9l6 6 6-6',
  chevR:'M9 6l6 6-6 6',
  arrowR:'M5 12h14M13 6l6 6-6 6',
  filter:'M4 5h16l-6 8v6l-4-2v-4z',
  plus:'M12 5v14M5 12h14',
  edit:'M4 20h4L20 8l-4-4L4 16zM14 6l4 4',
  trash:'M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6',
  download:'M12 4v11M7 12l5 5 5-5M4 21h16',
  upload:'M12 15V4M7 8l5-5 5 5M4 21h16',
  alert:'M12 3l10 18H2zM12 10v4M12 17h.01',
  info:'M12 3a9 9 0 100 18 9 9 0 000-18zM12 11v5M12 8h.01',
  refresh:'M20 12a8 8 0 11-2.3-5.7M20 4v5h-5',
  idcard:'M3 5h18v14H3zM8.5 10a2 2 0 100 4 2 2 0 000-4zM6 16c.8-1.2 5.2-1.2 6 0M14 9h5M14 13h5M14 17h3',
  bus:'M5 6h14v11H5zM5 10h14M9 17a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM15 17a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM7 6V4M17 6V4',
  wifi:'M5 12a10 10 0 0114 0M8 15a6 6 0 018 0M11 18h2',
  flask:'M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3M8 3h8M8 15h8',
  video:'M3 6h13v12H3zM16 10l6-3v10l-6-3z',
  checkc:'M12 3a9 9 0 100 18 9 9 0 000-18zM8.5 12.5l2.5 2.5 5-6',
  xc:'M12 3a9 9 0 100 18 9 9 0 000-18zM8.5 8.5l7 7M15.5 8.5l-7 7',
  medal:'M12 3a4 4 0 100 8 4 4 0 000-8zM8 6l-3 3 2 12 5-3 5 3 2-12-3-3',
  target:'M12 4a8 8 0 100 16 8 8 0 000-16zM12 8a4 4 0 100 8 4 4 0 000-8zM12 11a1 1 0 100 2 1 1 0 000-2z',
  search:'M11 4a7 7 0 100 14 7 7 0 000-14zM16 16l5 5',
  panel:'M4 5h16v14H4zM9 5v14',
  linkedin:'M7 10v7M7 6.5v.1M11 17v-4a2.5 2.5 0 015 0v4M11 9.5V17',
  globe:'M12 3a9 9 0 100 18 9 9 0 000-18zM3.5 9h17M3.5 15h17M12 3c2.4 2.5 3.8 5.6 3.8 9s-1.4 6.5-3.8 9c-2.4-2.5-3.8-5.6-3.8-9S9.6 5.5 12 3z'
};
UI.icon = function (name, cls) {
  var p = P[name] || P.info;
  return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + p + '"/></svg>';
};
UI.iconLg = function (name, cls, size) {
  var p = P[name] || P.info; var s = size || 20;
  return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + p + '"/></svg>';
};

/* ---------------- escape / format ---------------- */
UI.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
UI.fmtDate = function (iso) {
  if (!iso) return '—';
  var p = String(iso).slice(0, 10).split('-');
  return (+p[2]) + ' ' + MON[+p[1] - 1] + ' ' + p[0];
};
UI.fmtDT = function (s) { if (!s) return '—'; var d = String(s).slice(0, 10); var t = String(s).slice(11, 16); return UI.fmtDate(d) + (t ? ' · ' + t : ''); };
UI.money = function (n) { return '₹ ' + Number(n || 0).toLocaleString('en-IN'); };
UI.initials = function (name) { var x = String(name || '?').split(' '); return (x[0][0] + (x[1] ? x[1][0] : '')).toUpperCase(); };

/* ---------------- avatars (photo → placeholder icon) ---------------- */
UI.avatar = function (person, size) {
  var s = size || 34, url = null;
  if (person && person.id && g.DB && g.DB.photos && g.DB.photos[person.id]) url = g.DB.photos[person.id];
  if (!url && person && typeof person.photo === 'string' && person.photo.slice(0, 5) === 'data:') url = person.photo;
  if (url) return '<img class="avatar s' + s + '" src="' + url + '" alt="' + UI.esc(person ? person.name : '') + '">';
  var gph = person ? person.gender : 'M';
  var tint = gph === 'F' ? 'var(--g-red)' : 'var(--g-blue)';
  var txt = person ? UI.initials(person.name) : '?';
  return '<span class="avatar s' + s + '" style="display:inline-flex;align-items:center;justify-content:center;font-weight:700;color:' +
    tint + ';background:' + (gph === 'F' ? 'var(--red-tint)' : 'var(--blue-tint)') + ';border:1px solid ' + (gph === 'F' ? 'var(--red-glow)' : 'var(--blue-glow)') + ';font-size:' + Math.round(s * 0.36) + 'px">' + UI.esc(txt) + '</span>';
};
UI.photoBox = function (person, note) {
  var has = g.DB.photos && g.DB.photos[person.id];
  var inner = has ? '<img class="avatar s96" src="' + g.DB.photos[person.id] + '" alt="photo">' :
    '<span class="avatar s96" style="display:inline-flex;align-items:center;justify-content:center;background:var(--surface-3);color:var(--text-3)">' + UI.icon('user', 'avatar-ph') + '</span>';
  return '<div class="photobox"><div class="photo-frame">' + inner + '<span class="cam">' + UI.icon('camera') + '</span></div>' +
    '<div><b>' + UI.esc(person.name) + '</b><div class="ph-note">' + (note || 'Photo updates sync with the campus directory.') + '</div></div>' +
    '<div class="rowflex"><button class="btn pri sm" data-photo="' + person.id + '">' + UI.icon('upload') + 'Update Photo</button>' +
    (has ? '<button class="btn ghost-r sm" data-photo-remove="' + person.id + '">Remove</button>' : '') + '</div></div>';
};

/* ---------------- badges ---------------- */
var TONE = {
  Approved: 'green', Verified: 'green', Issued: 'green', Published: 'green', Paid: 'green', Completed: 'green', Active: 'green',
  Graded: 'green', Eligible: 'green', Offered: 'green', Resolved: 'green', Cleared: 'green', Recommended: 'blue', Applied: 'blue',
  Submitted: 'yellow', Pending: 'yellow', 'In Progress': 'yellow', Open: 'yellow', Scheduled: 'blue', Shortlisted: 'blue',
  'Warden Approved': 'yellow', 'AD Approved': 'yellow', Returned: 'red', Rejected: 'red', Blocked: 'red', Overdue: 'red',
  'Not Selected': 'red', Absent: 'red', Missed: 'red', Processing: 'yellow', Draft: 'neutral', Withdrawn: 'neutral', Closed: 'neutral'
};
UI.tone = function (st) { return TONE[st] || 'neutral'; };
UI.badge = function (st, extra) {
  return '<span class="badge b-' + UI.tone(st) + '">' + (extra || st) + '</span>';
};
UI.pbadge = function (st) { return '<span class="badge b-' + (st === 'Critical' ? 'red' : st === 'High' ? 'yellow' : st === 'Medium' ? 'blue' : 'neutral') + '">' + UI.esc(st) + '</span>'; };

/* ---------------- layout components ---------------- */
UI.stat = function (o) {
  return '<a class="stat t' + o.tone + '"' + (o.href ? ' href="' + o.href + '"' : '') + '>' +
    '<span class="sicon t' + o.tone + '">' + UI.icon(o.icon || 'chart') + '</span><span>' +
    '<span class="sv">' + o.value + '</span><span class="sl">' + o.label + '</span>' +
    (o.sub ? '<span class="sd">' + o.sub + '</span>' : '') + '</span></a>';
};
UI.table = function (cols, rows, opts) {
  opts = opts || {};
  var h = '<div class="tblwrap' + (opts.plain ? ' plain' : '') + '"><table class="tbl"><thead><tr>';
  cols.forEach(function (c) { h += '<th>' + c.h + '</th>'; });
  h += '</tr></thead><tbody>';
  if (!rows.length) { h += '<tr><td colspan="' + cols.length + '">' + UI.empty(opts.empty || 'Nothing here yet', 'list') + '</td></tr>'; }
  rows.forEach(function (r, i) {
    h += '<tr' + (r.__hl ? ' class="hl"' : '') + (opts.rowAttr ? ' ' + opts.rowAttr(r) : '') + '>';
    cols.forEach(function (c) { h += '<td data-lbl="' + UI.esc(c.h || '') + '">' + (c.render ? c.render(r, i) : UI.esc(r[c.k])) + '</td>'; });
    h += '</tr>';
  });
  return h + '</tbody></table></div>';
};
/* v6: adaptive tables — if a table's content is wider than the space the phone
   gives it, it dynamically restyles into stacked rows (one card per record,
   label : value), so every column stays fully visible. Narrow tables keep
   the normal compact form. Re-runs on resize. */
UI.adaptTables = function (root) {
  var scope = root || document;
  var tables = scope.querySelectorAll ? scope.querySelectorAll('table.tbl') : [];
  for (var i = 0; i < tables.length; i++) {
    (function (t) {
      var wrap = t.parentNode && t.parentNode.classList && t.parentNode.classList.contains('tblwrap') ? t.parentNode : null;
      var avail = (wrap ? wrap.clientWidth : (document.documentElement.clientWidth || 390));
      if (!avail) return;
      /* measure the natural (unstacked) width, then decide */
      var was = t.classList.contains('stack');
      if (was) { t.classList.remove('stack'); if (wrap) wrap.classList.remove('stacked'); }
      var over = t.scrollWidth > avail + 1;
      t.classList.toggle('stack', over);
      if (wrap) wrap.classList.toggle('stacked', over);
    })(tables[i]);
  }
};
UI.empty = function (title, icon, sub) {
  return '<div class="empty">' + UI.icon(icon || 'info') + '<b>' + UI.esc(title) + '</b>' + (sub ? '<span>' + UI.esc(sub) + '</span>' : '') + '</div>';
};
UI.bar = function (pct, tone, w) {
  return '<div class="pbar ' + (tone || '') + '"' + (w ? ' style="width:' + w + '"' : '') + '><i style="width:' + Math.max(0, Math.min(100, pct)) + '%"></i></div>';
};
UI.donut = function (pct, tone, size, label) {
  size = size || 110; var r = (size - 14) / 2, c = 2 * Math.PI * r;
  var color = { blue: 'var(--g-blue)', green: 'var(--g-green)', yellow: 'var(--g-yellow)', red: 'var(--g-red)' }[tone || 'blue'];
  return '<div class="donut" style="width:' + size + 'px;height:' + size + 'px"><svg width="' + size + '" height="' + size + '">' +
    '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="var(--surface-3)" stroke-width="11"/>' +
    '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="11" stroke-linecap="round" stroke-dasharray="' + (c * pct / 100) + ' ' + c + '"/>' +
    '</svg><div class="dlab"><b>' + pct + '%</b><span>' + (label || '') + '</span></div></div>';
};
UI.timeline = function (steps) {
  var h = '<div class="tl">';
  steps.forEach(function (t) {
    var cls = '';
    if (String(t.s).indexOf('Approved') >= 0 || String(t.s).indexOf('Completed') >= 0 || String(t.s).indexOf('Verified') >= 0 || String(t.s).indexOf('Issued') >= 0 || String(t.s).indexOf('Recommended') >= 0 || String(t.s).indexOf('Countersigned') >= 0 || String(t.s).indexOf('informed') >= 0) cls = 'done';
    else if (String(t.s).indexOf('Rejected') >= 0 || String(t.s).indexOf('Returned') >= 0) cls = 'rej';
    else if (t.at) cls = 'done';
    else cls = 'cur';
    h += '<div class="tstep ' + cls + '"><div class="tlh"><b>' + UI.esc(t.s) + '</b>' + (t.at ? UI.badge(t.at) : '') + '</div>' +
      (t.by ? '<div class="tld">' + UI.esc(Q.name(t.by)) + '</div>' : '') +
      (t.note ? '<div class="note">' + UI.esc(t.note) + '</div>' : '') + '</div>';
  });
  return h + '</div>';
};
UI.tabs = function (items, active) {
  var h = '<div class="tabs">';
  items.forEach(function (it) {
    h += '<button class="tab' + (it.id === active ? ' on' : '') + '" data-tab="' + it.id + '">' + UI.esc(it.label) +
      (it.cnt != null ? ' <span class="cnt' + (it.cntTone ? ' ' + it.cntTone : '') + '">' + it.cnt + '</span>' : '') + '</button>';
  });
  return h + '</div>';
};
UI.card = function (title, icon, body, tone, more) {
  return '<div class="card glow' + (tone ? ' glow-' + tone : '') + (tone ? ' accent-' + tone : '') + '"><div class="card-t">' +
    UI.icon(icon) + (title ? '<h3>' + title + '</h3>' : '') + (more ? '<span class="more" data-more="' + more.href + '">' + more.label + '</span>' : '') +
    '</div>' + body + '</div>';
};
UI.kv = function (pairs) {
  var h = '<div class="kv">';
  pairs.forEach(function (p) { h += '<span class="k">' + UI.esc(p[0]) + '</span><span>' + p[1] + '</span>'; });
  return h + '</div>';
};
UI.hint = function (text, tone, icon) {
  return '<div class="hint-card' + (tone ? ' ' + tone : '') + '">' + UI.icon(icon || 'info') + '<div>' + text + '</div></div>';
};

/* ---------------- modal / toast ---------------- */
UI.modal = function (o) {
  var mask = document.getElementById('ui-mask');
  if (!mask) {
    mask = document.createElement('div'); mask.id = 'ui-mask'; mask.className = 'mask';
    document.body.appendChild(mask);
    mask.addEventListener('click', function (e) { if (e.target === mask) UI.closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') UI.closeModal(); });
  }
  mask.innerHTML = '<div class="modal' + (o.lg ? ' lg' : '') + '"><div class="mhead"><h3>' + (o.title || '') + '</h3>' +
    '<span class="x" onclick="UI.closeModal()">' + UI.icon('x') + '</span></div>' +
    '<div class="mbody">' + (o.body || '') + '</div>' +
    (o.actions ? '<div class="mfoot">' + o.actions + '</div>' : '') + '</div>';
  mask.classList.add('open');
  return mask;
};
UI.closeModal = function () { var m = document.getElementById('ui-mask'); if (m) { m.classList.remove('open'); m.innerHTML = ''; } };
UI.toast = function (title, body, tone) {
  tone = tone || 'blue';
  var box = document.getElementById('toasts');
  if (!box) { box = document.createElement('div'); box.id = 'toasts'; document.body.appendChild(box); }
  var ic = { green: 'checkc', red: 'xc', yellow: 'alert', blue: 'info' }[tone];
  var t = document.createElement('div');
  t.className = 'toast t' + (tone === 'green' ? 'g' : tone === 'red' ? 'r' : tone === 'yellow' ? 'y' : '');
  t.innerHTML = UI.icon(ic) + '<div><b>' + UI.esc(title) + '</b>' + (body ? '<span>' + UI.esc(body) + '</span>' : '') + '</div>';
  box.appendChild(t);
  setTimeout(function () { t.classList.add('bye'); setTimeout(function () { t.remove(); }, 320); }, 3600);
};
UI.download = function (filename, text) {
  var blob = new Blob([text], { type: 'text/plain' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
  UI.toast('Download started', filename, 'green');
};
/* CSV export — bills, receipts, statements, registers (Excel-friendly, BOM included) */
UI.downloadCSV = function (filename, rows) {
  var esc = function (v) {
    var s = String(v == null ? '' : v);
    if (/[",\n\r]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  var csv = '\ufeff' + (rows || []).map(function (r) { return r.map(esc).join(','); }).join('\r\n') + '\r\n';
  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
  UI.toast('Download started', filename, 'green');
};
UI.stars = function (n) {
  var h = '<span class="stars">';
  for (var i = 1; i <= 5; i++) h += '<button data-star="' + i + '" type="button">' + UI.icon('star', i <= n ? 'on' : '') + '</button>';
  return h + '</span>';
};
UI.select = function (id, opts, val, ph) {
  var h = '<select class="input" id="' + id + '">';
  if (ph) h += '<option value="">' + ph + '</option>';
  (opts || []).forEach(function (o) {
    var v = o.v != null ? o.v : o, l = o.l != null ? o.l : o;
    h += '<option value="' + UI.esc(v) + '"' + (String(v) === String(val) ? ' selected' : '') + '>' + UI.esc(l) + '</option>';
  });
  return h + '</select>';
};
UI.field = function (id, label, input, req, hint) {
  return '<div class="fld"><label' + (req ? ' class="req"' : '') + '>' + label + '</label>' + input + (hint ? '<div class="fhint">' + hint + '</div>' : '') + '</div>';
};

/* ---------------- timetable ---------------- */
UI.DAYN = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
UI.courseTint = function (code) {
  var t = ['ct-b','ct-g','ct-y','ct-r','ct-n','ct-b'];
  var n = 0; for (var i = 0; i < code.length; i++) n += code.charCodeAt(i);
  return t[n % t.length];
};
UI.timetable = function (classId, todayDay) {
  var slots = Q.timetableOf(classId);
  var dayIdx = todayDay === undefined ? 4 : todayDay; /* default Friday anchor */
  var h = '<div class="tblwrap"><table class="tt"><thead><tr><th style="width:70px">Day</th>';
  for (var p = 1; p <= 8; p++) h += '<th>' + (p === 5 ? 'Lunch' : 'P' + p) + '</th>';
  h += '</tr></thead><tbody>';
  for (var d = 0; d < 5; d++) {
    h += '<tr><th style="text-align:left;padding:8px' + (d === dayIdx ? ';color:var(--g-blue)' : '') + '">' + UI.DAYN[d] + '</th>';
    var row = slots.filter(function (s) { return s.day === d; }).sort(function (a, b) { return a.period - b.period; });
    row.forEach(function (s) {
      if (s.break) { h += '<td class="brk">LUNCH</td>'; return; }
      var c = Q.courseById(s.courseId), cls = UI.courseTint(s.courseId);
      h += '<td class="' + cls + (s.lab ? ' lab' : '') + (d === dayIdx ? ' todaycol' : '') + '"><span class="ttc">' + s.courseId + '</span>' +
        (s.lab ? '<div class="ttn">Lab — ' + UI.esc(c ? c.title : '') + '</div>' : '<div class="ttn">' + UI.esc(c ? c.title.slice(0, 22) : '') + '</div>') +
        '<div class="ttr">' + UI.esc(Q.name(s.teacherId)) + ' · ' + s.room + (s.rescheduledNote ? ' ↻' : '') + '</div></td>';
    });
    h += '</tr>';
  }
  return h + '</tbody></table></div>';
};

/* ---------------- calendar month ---------------- */
UI.monthCal = function (y, m, events, todayIso) {
  var first = new Date(y, m, 1), start = (first.getDay() + 6) % 7; /* Mon=0 */
  var dim = new Date(y, m + 1, 0).getDate();
  var h = '<div class="cal">';
  ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(function (d) { h += '<div class="calh">' + d + '</div>'; });
  for (var i = 0; i < start; i++) h += '<div class="cald out"></div>';
  for (var d2 = 1; d2 <= dim; d2++) {
    var iso = y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d2).padStart(2, '0');
    var evs = events.filter(function (e) { return e.date === iso; });
    h += '<div class="cald' + (iso === todayIso ? ' today' : '') + '"><span class="cdn">' + d2 + '</span>';
    evs.slice(0, 3).forEach(function (e) { h += '<span class="evc ' + e.type.toLowerCase() + '" title="' + UI.esc(e.title) + '">' + UI.esc(e.title) + '</span>'; });
    h += '</div>';
  }
  return h + '</div>';
};

/* ---------------- request card ---------------- */
UI.reqCard = function (r, opts) {
  opts = opts || {};
  var s = Q.studentById(r.studentId);
  var sub = (opts.titleKey ? r[opts.titleKey] : (r.event || r.type || '')) + ' · ' + UI.fmtDate(r.date || r.from || r.out);
  var h = '<div class="card glow accent-b"><div class="spread">' +
    '<div style="display:flex;gap:12px;align-items:center;min-width:0">' +
    (s ? UI.avatar(s, 44) : '') +
    '<div style="min-width:0"><b>' + (s ? UI.esc(s.name) : '') + '</b>' +
    '<div style="font-size:12px;color:var(--text-2)">' + (s ? s.reg + ' · ' + s.classId : '') + '</div></div></div>' +
    '<div style="text-align:right">' + UI.badge(r.status) + (r.adStatus ? '<div class="mt8" style="font-size:11px;color:var(--text-2)">AD: ' + r.adStatus + '</div>' : '') + '</div></div>' +
    '<div class="mt8" style="font-size:13.5px"><b>' + UI.esc(sub) + '</b></div>' +
    '<div class="mt8">' + UI.timeline(r.timeline) + '</div>';
  if (opts.actions) h += '<div class="frow" style="justify-content:flex-start">' + opts.actions + '</div>';
  return h + '</div>';
};

/* ---------------- charts ---------------- */
UI.barsChart = function (rows, tone) {
  var h = '<div class="bars">';
  rows.forEach(function (r) {
    h += '<div class="brow"><span class="bl" title="' + UI.esc(r.l) + '">' + UI.esc(r.l) + '</span>' +
      '<div class="pbar ' + (r.tone || tone || 'b2') + '"><i style="width:' + Math.max(2, Math.min(100, r.v)) + '%"></i></div>' +
      '<span class="bn">' + (r.n != null ? r.n : r.v) + '</span></div>';
  });
  return h + '</div>';
};
UI.ticker = function (items) {
  if (!items || !items.length) return '';
  var txt = items.join('     •     ');
  return '<div class="ticker"><span class="tk-tag">' + UI.icon('alert') + 'Flash news</span><div class="tk-body"><span>' + UI.esc(txt) + '</span></div></div>';
};

/* ---------------- photo upload binding ---------------- */
UI.bindPhoto = function (root) {
  (root.querySelectorAll('[data-photo]') || []).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pid = btn.getAttribute('data-photo');
      UI.modal({ title: 'Update photo', body:
        '<div style="text-align:center;padding:10px 0"><div id="ph-prev" style="margin-bottom:14px"><span class="avatar s96" style="display:inline-flex;align-items:center;justify-content:center;background:var(--surface-3);color:var(--text-3)">' + UI.icon('image') + '</span></div>' +
        '<input type="file" id="ph-file" accept="image/*" class="input" style="text-align:center">' +
        '<p class="ph-note" style="margin-top:10px">Square photos look best. The campus directory photo is used across the portal.</p></div>',
        actions: '<button class="btn pri" id="ph-save" disabled>' + UI.icon('check') + 'Save photo</button><button class="btn" onclick="UI.closeModal()">Cancel</button>' });
      var url = null;
      document.getElementById('ph-file').addEventListener('change', function (e) {
        var f = e.target.files[0]; if (!f) return;
        var rd = new FileReader();
        rd.onload = function () {
          url = rd.result;
          document.getElementById('ph-prev').innerHTML = '<img class="avatar s96" src="' + url + '">';
          document.getElementById('ph-save').disabled = false;
        };
        rd.readAsDataURL(f);
      });
      document.getElementById('ph-save').addEventListener('click', function () {
        if (!url) return;
        WF.updatePhoto(pid, url);
        UI.closeModal();
        UI.toast('Photo updated', 'Your new photo is live across the portal.', 'green');
        setTimeout(function () { SPA.refresh(); }, 700);
      });
    });
  });
  (root.querySelectorAll('[data-photo-remove]') || []).forEach(function (btn) {
    btn.addEventListener('click', function () {
      WF.updatePhoto(btn.getAttribute('data-photo-remove'), null);
      UI.toast('Photo removed', 'Placeholder restored.', 'yellow');
      setTimeout(function () { SPA.refresh(); }, 700);
    });
  });
};

/* ---------------- v5: service-desk & export helpers ---------------- */
/* ticket status tones */
TONE['Assigned'] = 'blue'; TONE['Reopened'] = 'yellow'; TONE['Overdue'] = 'red'; TONE['Due Today'] = 'yellow';

/* SLA: expected resolution window per ticket priority */
UI.SLA = { Critical: 1, High: 2, Medium: 4, Low: 7 };   /* working days */
UI.slaLabel = function (p) {
  var d = UI.SLA[p] || 4;
  return d <= 1 ? 'within 4 working hours' : 'within ' + d + ' working days';
};
UI.addDays = function (iso, n) {
  var d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
UI.daysTo = function (iso) {
  if (!iso) return null;
  return Math.round((new Date(iso + 'T00:00:00') - new Date(Q.today() + 'T00:00:00')) / 86400000);
};
UI.etaChip = function (eta, resolved) {
  if (!eta) return '';
  if (resolved) return '<span class="eta-chip done">' + UI.icon('checkc') + 'Resolved ' + UI.fmtDate(eta) + '</span>';
  var d = UI.daysTo(eta);
  var cls = d < 0 ? 'late' : d <= 1 ? 'warn' : 'ok';
  var lab = d < 0 ? Math.abs(d) + ' day' + (d === -1 ? '' : 's') + ' overdue' : d === 0 ? 'due today' : d + ' day' + (d === 1 ? '' : 's') + ' left';
  return '<span class="eta-chip ' + cls + '">' + UI.icon('clock') + 'Expected ' + UI.fmtDate(eta) + ' · ' + lab + '</span>';
};
/* v6: raiser-requested deadline chip (outing requests) */
UI.reqDeadlineChip = function (deadline) {
  if (!deadline) return '';
  var d = UI.daysTo(deadline);
  var lab = d < 0 ? 'passed' : d === 0 ? 'today' : d === 1 ? 'tomorrow' : 'in ' + d + ' days';
  return '<span class="eta-chip req">' + UI.icon('clock') + 'Requested deadline ' + UI.fmtDate(deadline) + ' · ' + lab + '</span>';
};
UI.fmtSize = function (n) {
  if (n >= 1048576) return (n / 1048576).toFixed(1) + ' MB';
  if (n >= 1024) return Math.round(n / 1024) + ' KB';
  return n + ' B';
};
/* attachment chips (with working downloads when the file was kept) */
UI.attachChips = function (files) {
  if (!files || !files.length) return '';
  return '<div class="atchs">' + files.map(function (f, i) {
    return '<span class="atch" data-atch="' + i + '" title="' + UI.esc(f.name) + '">' + UI.icon('file') +
      '<span class="an">' + UI.esc(f.name) + '</span><span class="as">' + UI.fmtSize(f.size) + '</span>' +
      '<span class="dl">' + UI.icon('download') + '</span></span>';
  }).join('') + '</div>';
};
UI.bindAttach = function (root, files) {
  (root.querySelectorAll('[data-atch]') || []).forEach(function (el) {
    el.addEventListener('click', function () {
      var f = files[+el.getAttribute('data-atch')];
      if (!f) return;
      if (f.data) {
        var a = document.createElement('a');
        a.href = f.data; a.download = f.name;
        document.body.appendChild(a); a.click(); a.remove();
        UI.toast('Downloading attachment', f.name, 'green');
      } else {
        UI.toast('Attachment stored on the service desk', f.name + ' · ' + UI.fmtSize(f.size), 'blue');
      }
    });
  });
};
/* file drop area — collects up to max files, each under maxMB */
UI.fileDrop = function (id, note, max, maxMB) {
  return '<label class="filedrop" for="' + id + '">' + UI.icon('upload') + 'Attach files — click to browse' +
    '<input type="file" id="' + id + '" multiple></label>' +
    '<div class="atchs" id="' + id + '-list"></div>' +
    '<div class="fhint">' + (note || 'Up to ' + (max || 3) + ' files · ' + (maxMB || 2) + ' MB each · images and documents') + '</div>';
};
UI.bindFileDrop = function (id, files, max, maxMB) {
  var inp = document.getElementById(id), list = document.getElementById(id + '-list');
  if (!inp || !list) return;
  function draw() {
    list.innerHTML = files.map(function (f, i) {
      return '<span class="atch" data-fx="' + i + '" title="' + UI.esc(f.name) + '">' + UI.icon('file') +
        '<span class="an">' + UI.esc(f.name) + '</span><span class="as">' + UI.fmtSize(f.size) + '</span>' +
        '<span class="dl" style="color:var(--red-ink)">' + UI.icon('x') + '</span></span>';
    }).join('');
    list.querySelectorAll('[data-fx]').forEach(function (el) {
      el.addEventListener('click', function () { files.splice(+el.getAttribute('data-fx'), 1); draw(); });
    });
  }
  inp.addEventListener('change', function () {
    Array.prototype.slice.call(inp.files || []).forEach(function (f) {
      if (files.length >= (max || 3)) { UI.toast('Limit reached', 'Up to ' + (max || 3) + ' attachments per request.', 'yellow'); return; }
      if (f.size > (maxMB || 2) * 1048576) { UI.toast('File too large', f.name + ' exceeds ' + (maxMB || 2) + ' MB.', 'red'); return; }
      var item = { name: f.name, size: f.size, type: f.type, data: null };
      files.push(item);
      if (f.size <= 512 * 1024) {
        try {
          var rd = new FileReader();
          rd.onload = function () { item.data = rd.result; };
          rd.readAsDataURL(f);
        } catch (e) {}
      }
    });
    inp.value = ''; draw();
  });
  draw();
};
/* read-only stars */
UI.starsRO = function (n) {
  var h = '<span class="stars ro">';
  for (var i = 1; i <= 5; i++) h += '<span>' + UI.icon('star', i <= n ? 'on' : '') + '</span>';
  return h + '</span>';
};
/* filter chip row + search box (list filtering) */
UI.chiprow = function (items, active) {
  return '<div class="fchips">' + items.map(function (it) {
    var v = it.v != null ? it.v : it, l = it.l != null ? it.l : it;
    return '<button type="button" class="chip' + (String(v) === String(active) ? ' on' : '') + '" data-f="' + UI.esc(v) + '">' + UI.esc(l) +
      (it.c != null ? ' · ' + it.c : '') + '</button>';
  }).join('') + '</div>';
};
UI.srch = function (id, ph) {
  return '<div class="qsearch">' + UI.icon('search') + '<input class="input" id="' + id + '" placeholder="' + UI.esc(ph || 'Search…') + '"></div>';
};
UI.expBtn = function (id, label) {
  return '<button class="btn ghost" id="' + id + '">' + UI.icon('download') + (label || 'Export CSV') + '</button>';
};

g.UI = UI;
})(window);
