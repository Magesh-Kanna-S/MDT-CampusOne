/* My Desktop Tech — CampusOne · v8 view registry
   Every former page file’s render code lives here as a registered view
   (MDTPAGE). The single-page core (assets/js/spa.js) boots them on
   demand — the address bar and the tab title never move.
   v8: 129 views across 12 role portals (library, examination cell,
   placement cell, accounts and IQAC joined the roster).
   Delegated document handlers are registered through SPA.doc() so they
   are swept automatically on every navigation; page reloads became
   SPA.refresh(); query strings became SPA.query. */

/* ── student/achievements ........................ ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'achievements',
  render: function (view, ctx) {

    var me = ctx.person;
    function render() {
      var mine = DB.achievements.filter(function (a) { return a.studentId === me.id; });
      var verified = mine.filter(function (a) { return a.status === 'Verified'; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>My Achievements</h1><div class="sub">Academic, technical, cultural, sports and leadership records — verified by your mentor, visible to placement and IQAC</div></div>' +
        '<div class="actions"><button class="btn pri" id="newACH">' + UI.icon('plus') + 'Submit an achievement</button>' + (mine.length ? UI.expBtn('achExp', 'Export my records') : '') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'g', icon: 'medal', value: verified.length, label: 'Verified records' }) +
        UI.stat({ tone: 'y', icon: 'door', value: mine.filter(function (a) { return a.status === 'Pending'; }).length, label: 'Awaiting mentor verification' }) +
        UI.stat({ tone: 'b', icon: 'trophy', value: mine.filter(function (a) { return String(a.prize).indexOf('Prize') === 0; }).length, label: 'Prize wins' }) +
        UI.stat({ tone: 'r', icon: 'chart', value: mine.filter(function (a) { return a.level === 'National'; }).length, label: 'National level' }) +
        '</div>' +
        (mine.length ? '<div class="grid g2">' + mine.map(function (a) {
          var tone = a.status === 'Verified' ? 'g' : a.status === 'Rejected' ? 'r' : 'y';
          return '<div class="card glow glow-' + tone + ' accent-' + tone + '"><div class="spread"><div><b>' + UI.esc(a.name) + '</b>' +
            '<div style="font-size:11px;color:var(--text-2)">' + a.category + ' · ' + a.level + ' · ' + UI.fmtDate(a.date) + '</div></div>' + UI.badge(a.status) + '</div>' +
            '<div class="mt8">' + UI.kv([
              ['Outcome', UI.esc(a.prize)], ['Place', UI.esc(a.place)],
              ['Attachment', a.attachment ? '<span class="tag g">' + UI.esc(a.attachment) + '</span>' : '—'],
              ['Verified by', a.verifiedBy ? UI.esc(Q.name(a.verifiedBy)) : (a.status === 'Rejected' ? UI.esc(Q.name(a.verifiedBy)) : 'pending — mentor desk')]
            ]) + '</div>' +
            '<div class="mt8" style="font-size:12.5px;color:var(--text-2)">' + UI.esc(a.desc) + (a.reason ? '<div style="color:var(--red-ink);margin-top:4px">' + UI.esc(a.reason) + '</div>' : '') + '</div></div>';
        }).join('') + '</div>' : UI.empty('No achievements submitted yet — prizes, certifications, leadership roles and participations all count', 'medal')) +
        UI.hint('Verified achievements enrich your placement register and the accreditation evidence base automatically.', '', 'info');
      document.getElementById('newACH').addEventListener('click', function () {
        UI.modal({ title: 'Submit an achievement', body:
          UI.field('ac-n', 'Achievement', '<input class="input" id="ac-n" placeholder="e.g. Smart India Hackathon — Finalist">', true) +
          '<div class="fgrid">' +
          UI.field('ac-c', 'Category', UI.select('ac-c', ['Academic', 'Technical', 'Cultural', 'Sports', 'Leadership', 'Entrepreneurship']), true) +
          UI.field('ac-l', 'Level', UI.select('ac-l', ['College', 'State', 'National', 'International']), true) +
          UI.field('ac-d', 'Date', '<input class="input" id="ac-d" type="date" max="' + Q.today() + '">', true) +
          UI.field('ac-p', 'Outcome', UI.select('ac-p', ['Prize — 1st', 'Prize — 2nd', 'Prize — 3rd', 'Participation', 'Certification', 'Position']), true) + '</div>' +
          UI.field('ac-pl', 'Place / platform', '<input class="input" id="ac-pl" placeholder="e.g. PSG Tech, Coimbatore">', true) +
          UI.field('ac-de', 'Describe (for verification)', '<textarea class="input" id="ac-de" rows="2" placeholder="Team, problem statement, selection scale — helps the mentor verify"></textarea>', true) +
          UI.field('ac-f', 'Certificate file name (optional)', '<input class="input" id="ac-f" placeholder="e.g. sih-finalist.pdf">'),
          actions: '<button class="btn pri" id="ac-go">' + UI.icon('check') + 'Submit for verification</button>' });
        document.getElementById('ac-go').addEventListener('click', function () {
          var f = { name: document.getElementById('ac-n').value, category: document.getElementById('ac-c').value, level: document.getElementById('ac-l').value,
            date: document.getElementById('ac-d').value || Q.today(), prize: document.getElementById('ac-p').value, place: document.getElementById('ac-pl').value,
            desc: document.getElementById('ac-de').value, attachment: document.getElementById('ac-f').value || null };
          if (!f.name || !f.desc) { UI.toast('Name and description required', 'The description is what your mentor verifies.', 'red'); return; }
          WF.submitAchievement(me.id, f);
          UI.closeModal(); UI.toast('Submitted', 'Mentor notified for verification.', 'green'); render();
        });
      });
      var ex = document.getElementById('achExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'ACHIEVEMENT RECORD'],
          ['Student', me.name + ' (' + me.reg + ')'],
          ['Generated', Q.today()],
          [],
          ['Achievement', 'Category', 'Level', 'Date', 'Outcome', 'Place', 'Status', 'Verified by']
        ];
        mine.forEach(function (a) { rows.push([a.name, a.category, a.level, a.date, a.prize, a.place, a.status, a.verifiedBy ? Q.name(a.verifiedBy) : '—']); });
        UI.downloadCSV('Achievements-' + me.reg + '.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── student/assignments ......................... ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'assignments',
  render: function (view, ctx) {


    var s = ctx.person;
    var all = DB.assignments.filter(function (a) { return a.classId === s.classId; });
    var state = { tab: 'Pending' };
    function rowsFor(tab) {
        return all.filter(function (a) { return Q.subOf(a.id, s.id).st === tab; });
    }
    function render() {
      var rows = rowsFor(state.tab);
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Assignments</h1><div class="sub">Semester V · ' + all.length + ' assignments across courses</div></div>' +
        '<div class="actions">' + (all.length ? UI.expBtn('asgExp', 'Export CSV') : '') + '</div></div>' +
        UI.tabs([
          { id: 'Pending', label: 'Open', cnt: rowsFor('Pending').length, cntTone: 'y' },
          { id: 'Submitted', label: 'Submitted', cnt: rowsFor('Submitted').length, cntTone: '' },
          { id: 'Graded', label: 'Graded', cnt: rowsFor('Graded').length, cntTone: 'y' }
        ], state.tab) +
        UI.card('Assignment tracker', 'clipboard', UI.table([
          { h: 'Assignment', render: function (r) { return '<b>' + UI.esc(r.title) + '</b><div style="font-size:11.5px;color:var(--text-2)">' + r.courseId + ' · ' + UI.esc(Q.name(r.teacherId)) + '</div>'; } },
          { h: 'Assigned', render: function (r) { return UI.fmtDate(r.assignedAt); } },
          { h: 'Due', render: function (r) { return r.dueAt < Q.today() && Q.subOf(r.id, s.id).st === 'Pending' ? '<b style="color:var(--red-ink)">' + UI.fmtDate(r.dueAt) + '</b>' : UI.fmtDate(r.dueAt); } },
          { h: 'Max', render: function (r) { return '<span class="num">' + r.max + '</span>'; } },
          { h: 'Status', render: function (r) { var sub = Q.subOf(r.id, s.id); return UI.badge(sub.st) + (sub.marks != null ? ' <span class="mono">' + sub.marks + '/' + r.max + '</span>' : ''); } },
          { h: 'Action', render: function (r) { var sub = Q.subOf(r.id, s.id); return sub.st === 'Pending' ? '<button class="btn sm pri" data-submit="' + r.id + '">' + UI.icon('upload') + 'Submit</button>' : sub.st === 'Graded' ? '<span class="dl" data-adv="' + r.id + '">View remark</span>' : UI.badge('Approved', 'Awaiting grading'); } }
        ], rows)) +
        '<div class="grid g3">' +
        UI.stat({ tone: 'y', icon: 'clock', value: rowsFor('Pending').length, label: 'Open assignments' }) +
        UI.stat({ tone: 'b', icon: 'send', value: rowsFor('Submitted').length, label: 'Awaiting grading' }) +
        UI.stat({ tone: 'g', icon: 'checkc', value: all.reduce(function (sum, a) { var m = Q.subOf(a.id, s.id); return sum + (m.st === 'Graded' && m.marks != null ? m.marks : 0); }, 0), label: 'Graded score so far' }) +
        '</div>';
      view.querySelectorAll('.tab').forEach(function (t) { t.addEventListener('click', function () { state.tab = t.getAttribute('data-tab'); render(); }); });
      var aex = document.getElementById('asgExp');
      if (aex) aex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'ASSIGNMENT TRACKER'],
          ['Student', s.name + ' (' + s.reg + ')'],
          ['Class', s.classId],
          [],
          ['Course', 'Assignment', 'Faculty', 'Assigned', 'Due', 'Max', 'Status', 'Score', 'Attachments', 'Note']
        ];
        all.forEach(function (a) {
          var sub = Q.subOf(a.id, s.id);
          rows.push([a.courseId, a.title, Q.name(a.teacherId), a.assignedAt, a.dueAt, a.max, sub.st, sub.marks != null ? sub.marks : '—', (sub.files || []).length, sub.text || '']);
        });
        UI.downloadCSV('Assignments-' + s.reg + '.csv', rows);
      });
      view.querySelectorAll('[data-submit]').forEach(function (b) { b.addEventListener('click', function () {
        var id = b.getAttribute('data-submit'), a = DB.assignments.filter(function (x) { return x.id === id; })[0];
        var files = [];
        UI.modal({ title: 'Submit — ' + a.title, body:
          UI.field('sb-files', 'Attachments', UI.fileDrop('sb-files', 'Reports, code archives or photos of written work')) +
          UI.field('sb-note', 'Note to faculty', '<textarea class="input" id="sb-note" placeholder="Anything your faculty should know (optional)"></textarea>') +
          '<div class="fhint">Files are handed to your faculty\u2019s submission tray for evaluation.</div>',
          actions: '<button class="btn pri" id="sb-go">' + UI.icon('send') + 'Submit assignment</button><button class="btn" onclick="UI.closeModal()">Cancel</button>' });
        UI.bindFileDrop('sb-files', files, 3, 2);
        document.getElementById('sb-go').addEventListener('click', function () {
          WF.submitAssignment(id, s.id, document.getElementById('sb-note').value.trim(), files);
          UI.closeModal(); UI.toast('Assignment submitted', files.length ? files.length + ' attachment(s) handed to the faculty tray.' : 'Your faculty has been notified.', 'green');
          render();
        });
      }); });
      view.querySelectorAll('[data-adv]').forEach(function (el) { el.addEventListener('click', function () {
        var a = DB.assignments.filter(function (x) { return x.id === el.getAttribute('data-adv'); })[0];
        var sub = Q.subOf(a.id, s.id);
        UI.modal({ title: a.title, body: UI.kv([['Course', a.courseId], ['Score', '<b>' + sub.marks + ' / ' + a.max + '</b>'], ['Submitted', UI.fmtDT(sub.at)], ['Faculty', UI.esc(Q.name(a.teacherId))]]) +
          ((sub.files || []).length ? '<div class="fld mt16"><label>My attachments</label>' + UI.attachChips(sub.files) + '</div>' : '') +
          (sub.text ? '<p style="margin-top:10px">' + UI.esc(sub.text) + '</p>' : '') });
        UI.bindAttach(document.getElementById('ui-mask'), sub.files || []);
      }); });
    }
    render();
  }
});
})();

/* ── student/attendance .......................... ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'attendance',
  render: function (view, ctx) {

    var s = ctx.person;
    var att = Q.attPctOverall(s.id);
    var rows = Q.allocationsOf(s.classId).map(function (al) {
      var a = Q.attOf(s.id)[al.courseId] || { p: 0, t: 0, l: 0 };
      var pct = Q.attPct(s.id, al.courseId);
      return { courseId: al.courseId, teacher: Q.name(al.teacherId), p: a.p, t: a.t, pct: pct, pct: Q.attPct(s.id, al.courseId) };
    });
    var sess = DB.attendanceSessions.filter(function (x) { return x.classId === s.classId; })
      .sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 8);
    /* month-wise trend (last 6 months of marked sessions) */
    var byMonth = {};
    DB.attendanceSessions.filter(function (x) { return x.classId === s.classId; }).forEach(function (x) {
      var mo = x.date.slice(0, 7);
      if (!byMonth[mo]) byMonth[mo] = { p: 0, t: 0 };
      byMonth[mo].t++;
      var mk = x.marks[s.id];
      if (mk === 'P' || mk === 'L') byMonth[mo].p += mk === 'P' ? 1 : 0.5;
    });
    var months = Object.keys(byMonth).sort().slice(-6);
    var MMON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var trend = months.map(function (mo) {
      var v = Math.round(byMonth[mo].p / byMonth[mo].t * 100);
      return { l: MMON[+mo.slice(5, 7) - 1], v: v, n: v + '%', tone: v >= 85 ? 'g' : v >= 75 ? 'b2' : 'r' };
    });
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>Attendance</h1><div class="sub">Semester V · minimum ' + DB.settings.wf.attMin + '% required for exam eligibility</div></div>' +
      '<div class="actions">' + UI.expBtn('attExp', 'Export CSV') + '</div></div>' +
      (att < DB.settings.wf.attMin ? UI.hint('Your overall attendance is <b>' + att + '%</b> — below the ' + DB.settings.wf.attMin + '% requirement. Approach your class advisor with supporting documents to regularise.', 'danger', 'alert') : '') +
      '<div class="split-eq">' +
      '<div>' +
        '<div class="statrow" style="margin-bottom:16px">' +
        UI.stat({ tone: att >= 85 ? 'g' : att >= 75 ? 'y' : 'r', icon: 'checkc', value: att + '%', label: 'Overall attendance' }) +
        UI.stat({ tone: 'b', icon: 'calendar', value: rows.filter(function (r) { return r.pct >= 85; }).length + '/' + rows.length, label: 'Courses at 85% or above' }) +
        '</div>' +
        UI.card('Course-wise attendance', 'list', UI.table([
          { h: 'Course', render: function (r) { var c = Q.courseById(r.courseId); return '<b class="mono" style="color:var(--blue-ink)">' + r.courseId + '</b> · ' + UI.esc(c.title.slice(0, 34)); } },
          { h: 'Faculty', render: function (r) { return UI.esc(r.teacher); } },
          { h: 'Present', render: function (r) { return '<span class="num">' + r.p + '/' + r.t + '</span>'; } },
          { h: 'Progress', render: function (r) { return UI.bar(r.pct, r.pct >= 85 ? 'g' : r.pct >= 75 ? 'y' : 'r'); } },
          { h: '%', render: function (r) { return '<b class="num">' + r.pct + '%</b>'; } },
          { h: 'Status', render: function (r) { return UI.badge(r.pct >= 85 ? 'Approved' : r.pct >= 75 ? 'Processing' : 'Overdue', r.pct >= 85 ? 'On track' : r.pct >= 75 ? 'Adequate' : 'Condonation'); } }
        ], rows)) +
      '</div>' +
      '<div>' +
        UI.card('Semester snapshot', 'pie', '<div style="display:flex;justify-content:center;padding:8px">' + UI.donut(att, att >= 85 ? 'green' : att >= 75 ? 'yellow' : 'red', 150, 'attendance') + '</div>' +
        '<div class="legend" style="justify-content:center"><span><i style="background:var(--g-green)"></i>Present</span><span><i style="background:var(--surface-3)"></i>Total sessions</span></div>') +
        (trend.length ? UI.card('Month-wise trend', 'trend', UI.barsChart(trend) +
          '<div class="fhint" style="margin-top:8px">Late arrivals are counted as half a presence, matching the official aggregate.</div>') : '') +
        UI.card('Recent marked sessions', 'clock',
          (sess.length ? UI.table([
            { h: 'Date', render: function (r) { return UI.fmtDate(r.date); } },
            { h: 'Course', render: function (r) { return '<span class="mono">' + r.courseId + '</span>'; } },
            { h: 'Period', render: function (r) { return 'P' + r.period; } },
            { h: 'You', render: function (r) { var m = r.marks[s.id]; return m === 'P' ? UI.badge('Approved', 'Present') : m === 'L' ? UI.badge('Processing', 'Late') : UI.badge('Absent', 'Absent'); } }
          ], sess) : UI.empty('Sessions are marked by your faculty during class hours', 'clock'))) +
      '</div></div>';
    document.getElementById('attExp').addEventListener('click', function () {
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'ATTENDANCE STATEMENT'],
        ['Institute', DB.settings.institute],
        ['Student', s.name + ' (' + s.reg + ')'],
        ['Class', s.classId],
        ['Semester', 'V — ' + DB.settings.academicYear],
        ['Overall attendance', att + '%'],
        [],
        ['Course', 'Faculty', 'Present', 'Total', 'Percentage', 'Status']
      ];
      Q.allocationsOf(s.classId).forEach(function (al) {
        var p = Q.attPct(s.id, al.courseId);
        var a = Q.attOf(s.id)[al.courseId] || { p: 0, t: 0, l: 0 };
        rows.push([al.courseId, Q.name(al.teacherId), a.p + '/' + a.t, a.t, p + '%', p >= 85 ? 'On track' : p >= 75 ? 'Adequate' : 'Condonation']);
      });
      rows.push([]);
      rows.push(['Recent sessions', '', '', '', '', '']);
      rows.push(['Date', 'Course', 'Period', 'Marked']);
      DB.attendanceSessions.filter(function (x) { return x.classId === s.classId; })
        .sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 12).forEach(function (x) {
          var m = x.marks[s.id];
          rows.push([x.date, x.courseId, 'P' + x.period, m === 'P' ? 'Present' : m === 'L' ? 'Late' : m === 'A' ? 'Absent' : 'Not marked']);
        });
      UI.downloadCSV('Attendance-' + s.reg + '.csv', rows);
    });

  }
});
})();

/* ── student/calendar ............................ ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'calendar',
  render: function (view, ctx) {

    var s = ctx.person;
    var y = 2026, m = 8; /* Sep 2026 */
    var MONN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    function render() {
      var events = DB.calendarEvents;
      var monthEvents = events.filter(function (e) { return e.date.slice(0, 7) === y + '-' + String(m + 1).padStart(2, '0'); });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Academic Calendar</h1><div class="sub">Semester V · ' + DB.settings.academicYear + '</div></div>' +
        '<div class="actions"><button class="btn ghost" id="pm">' + UI.icon('chevR') + 'Prev</button>' +
        '<b style="min-width:150px;text-align:center">' + MONN[m] + ' ' + y + '</b>' +
        '<button class="btn ghost" id="nm">Next' + UI.icon('arrowR') + '</button></div></div>' +
        UI.card(MONN[m] + ' ' + y + ' — ' + monthEvents.length + ' events', 'calendar', UI.monthCal(y, m, events, Q.today()) +
          '<div class="legend"><span><i style="background:var(--g-red)"></i>Exams</span><span><i style="background:var(--g-green)"></i>Holidays</span><span><i style="background:var(--g-yellow)"></i>Fee dates</span><span><i style="background:var(--g-blue)"></i>Events</span><span><i style="background:var(--border-2)"></i>Academics</span></div>') +
        UI.card('Upcoming this semester', 'list', events.filter(function (e) { return e.date >= Q.today(); }).slice(0, 10).map(function (e) {
          var ic = { Exam: 'file', Holiday: 'sun', Fee: 'rupee', Event: 'star', Academic: 'cap' }[e.type];
          var tint = { Exam: 'r', Holiday: 'g', Fee: 'y', Event: 'b', Academic: 'n' }[e.type];
          return '<div class="lrow" style="cursor:default"><span class="ic" style="color:var(--g-' + tint + ')">' + UI.icon(ic) + '</span>' +
            '<span class="lmain"><b>' + UI.esc(e.title) + '</b><span>' + UI.fmtDate(e.date) + ' · ' + UI.esc(e.audience) + '</span></span>' +
            '<span class="tag ' + tint + '">' + e.type + '</span></div>';
        }).join(''));
      document.getElementById('pm').addEventListener('click', function () { m--; if (m < 0) { m = 11; y--; } render(); });
      document.getElementById('nm').addEventListener('click', function () { m++; if (m > 11) { m = 0; y++; } render(); });
    }
    render();

  }
});
})();

/* ── student/courses ............................. ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'courses',
  render: function (view, ctx) {

    var s = ctx.person;
    var rows = Q.allocationsOf(s.classId).map(function (al) {
      var c = Q.courseById(al.courseId);
      var plan = Q.coursePlan(s.classId, al.courseId);
      var done = plan.filter(function (p) { return p.status === 'Completed'; }).length;
      var ip = plan.filter(function (p) { return p.status === 'In Progress'; })[0];
      return { al: al, c: c, done: done, ip: ip ? ip.topic : 'Unit ' + (done + 1) };
    });
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>Courses & Status</h1><div class="sub">Semester V · ' + rows.length + ' registered courses</div></div></div>' +
      '<div class="grid g2">' + rows.map(function (r) {
        return '<div class="card glow glow-b accent-b"><div class="spread">' +
          '<span style="display:flex;gap:10px;align-items:center"><span class="sicon tb" style="width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;background:var(--blue-tint);color:var(--g-blue)">' + UI.icon(r.c.type === 'Lab' ? 'flask' : 'layers') + '</span>' +
          '<span><b class="mono" style="color:var(--blue-ink)">' + r.c.id + '</b><div style="font-size:13px;font-weight:600">' + UI.esc(r.c.title) + '</div></span></span>' +
          UI.badge('Active', 'Ongoing') + '</div>' +
          '<div class="mt8" style="display:flex;gap:10px;align-items:center">' + UI.avatar(Q.person(r.al.teacherId), 28) +
          '<div><div style="font-size:13px;font-weight:600">' + UI.esc(Q.name(r.al.teacherId)) + '</div>' +
          '<div style="font-size:11.5px;color:var(--text-2)">' + UI.esc((Q.person(r.al.teacherId) || {}).designation || 'Faculty') + ' · allotted by Academic Director</div></div></div>' +
          '<div class="mt8" style="font-size:12px;color:var(--text-2)"><b>Now covering:</b> ' + UI.esc(r.ip) + '</div>' +
          '<div class="mt8">' + UI.bar(Math.round(r.done / 5 * 100), 'b2') + '</div>' +
          '<div class="spread mt8" style="font-size:11.5px;color:var(--text-2)"><span>' + r.c.credits + ' credits · ' + r.al.periods + ' periods/week</span><span>' + r.done + '/5 units completed</span></div></div>';
      }).join('') + '</div>' +
      UI.card('Completed semesters', 'cap', UI.table([
        { h: 'Semester', render: function (r, i) { return '<b>Semester ' + (i + 1) + '</b>'; } },
        { h: 'Status', render: function () { return UI.badge('Completed'); } },
        { h: 'SGPA', render: function (r) { return '<b class="num">' + r.toFixed(2) + '</b>'; } },
        { h: 'Courses', render: function () { return '6 cleared'; } },
        { h: 'Cumulative', render: function (r, i) { var t = 0; for (var k = 0; k <= i; k++) t += s.semCgpa[k]; return '<span class="num">' + (t / (i + 1)).toFixed(2) + '</span>'; } }
      ], s.semCgpa) + '<div class="fhint">Semester V is in progress — results publish after the end-semester examination.</div>');

  }
});
})();

/* ── student/dashboard ........................... ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'dashboard',
  render: function (view, ctx) {

    var s = ctx.person;
    var dues = Q.duesOf(s.id);
    var rank = Q.rankOf(s.id);
    var att = Q.attPctOverall(s.id);
    var slots = Q.timetableOf(s.classId, 4).filter(function (t) { return !t.break; }).sort(function (a, b) { return a.period - b.period; });
    var asg = DB.assignments.filter(function (a) { return a.classId === s.classId; }).filter(function (a) { return a.dueAt >= Q.today(); });
    var ods = Q.odsOf(s.id), outs = Q.outingsOf(s.id);
    var circs = DB.circulars.filter(function (c) { return c.audience === 'Students' || c.audience === 'All'; }).slice(0, 4);
    var notifs = Q.notifsFor(ctx.user, s).slice(0, 5);

    view.innerHTML =
      UI.ticker(DB.flashNews) +
      '<div class="pagehead"><span style="display:flex;gap:14px;align-items:center">' + UI.avatar(s, 44) +
      '<span><h1>Good day, ' + UI.esc(s.name.split(' ')[0]) + '</h1><div class="sub">' + UI.esc(s.reg) + ' · ' + s.classId + ' · Semester ' + s.sem +
      (s.hostel ? ' · ' + UI.esc(Q.roomOf(s.id).id) : '') + '</div></span></span></div>' +

      '<div class="statrow">' +
        UI.stat({ tone: att < 75 ? 'r' : 'g', icon: 'checkc', value: att + '%', label: 'Overall attendance', sub: att < 75 ? 'Below the 75% requirement' : 'Healthy — keep it up', href: 'attendance.html' }) +
        UI.stat({ tone: 'b', icon: 'cap', value: s.cgpa.toFixed(2), label: 'Current CGPA', sub: s.arrears ? s.arrears + ' standing arrear' : 'No standing arrears', href: 'exams.html' }) +
        UI.stat({ tone: 'y', icon: 'trophy', value: '#' + rank.rank + ' / ' + rank.of, label: 'Class rank', sub: 'Internal assessment aggregate', href: 'ranking.html' }) +
        UI.stat({ tone: dues.total ? 'r' : 'g', icon: 'rupee', value: dues.total ? UI.money(dues.total) : 'Cleared', label: 'Fee dues', sub: dues.total ? dues.heads.length + ' pending head' + (dues.heads.length > 1 ? 's' : '') : 'All heads settled', href: 'fees.html' }) +
      '</div>' +

      '<div class="split">' +
      '<div>' +
        UI.card('Today\u2019s classes — ' + 'Friday', 'calendar',
          (slots.length ? UI.table([
            { h: 'Period', render: function (r) { return '<b>P' + r.period + '</b>'; } },
            { h: 'Course', render: function (r) { var c = Q.courseById(r.courseId); return '<span class="ttc" style="color:var(--blue-ink)">' + r.courseId + '</span> · ' + UI.esc(c.title.slice(0, 30)); } },
            { h: 'Faculty', render: function (r) { return UI.esc(Q.name(r.teacherId)); } },
            { h: 'Venue', render: function (r) { return r.lab ? 'Lab' : r.room; } }
          ], slots) : UI.empty('No classes scheduled today', 'calendar'))) +
        UI.card('Assignments in focus', 'clipboard',
          (asg.length ? UI.table([
            { h: 'Assignment', render: function (r) { var sub = Q.subOf(r.id, s.id); return '<b>' + UI.esc(r.title) + '</b><div style="font-size:11.5px;color:var(--text-2)">' + r.courseId + ' · max ' + r.max + ' marks</div>'; } },
            { h: 'Due', render: function (r) { return UI.fmtDate(r.dueAt); } },
            { h: 'Status', render: function (r) { var sub = Q.subOf(r.id, s.id); return UI.badge(sub.st) + (sub.marks != null ? ' <span class="mono">' + sub.marks + '/' + r.max + '</span>' : ''); } }
          ], asg, { empty: 'No open assignments' }) : UI.empty('All caught up', 'checkc')), null, { href: 'assignments.html', label: 'View all' }) +
        (notifs.length ? UI.card('Recent notifications', 'bell', notifs.map(function (n) {
          return '<div class="lrow' + (n.read ? '' : '') + '"><span class="ic" style="color:var(--g-blue)">' + UI.icon('bell') + '</span><span class="lmain"><b>' + UI.esc(n.title) + '</b><span>' + UI.esc(n.body) + '</span></span><span class="ltime">' + UI.esc(n.at) + '</span></div>';
        }).join(''), null, { href: 'notifications.html', label: 'View all' }) : '') +
      '</div>' +
      '<div>' +
        (ods.length ? UI.card('My latest OD', 'door',
          '<div class="spread"><b>' + UI.esc(ods[0].event) + '</b>' + UI.badge(ods[0].status) + '</div>' +
          '<div class="mt8" style="font-size:12.5px;color:var(--text-2)">' + UI.fmtDate(ods[0].date) + ' · ' + ods[0].session + '</div>' + UI.timeline(ods[0].timeline), null, { href: 'od.html', label: 'Manage' }) : '') +
        (s.hostel && outs.length ? UI.card('Hostel outing', 'key',
          '<div class="spread"><b>' + UI.esc(outs[0].place) + '</b>' + UI.badge(outs[0].status) + '</div>' +
          '<div class="mt8" style="font-size:12.5px;color:var(--text-2)">' + outs[0].type + ' · ' + UI.esc(outs[0].out) + ' → ' + UI.esc(outs[0].in) + '</div>' +
          (outs[0].adStatus ? '<div class="mt8">' + UI.hint('Overnight outings carry an Academic Director approval in addition to the warden\u2019s.', 'warn', 'alert') + '</div>' : ''), null, { href: 'outing.html', label: 'Manage' }) : '') +
        UI.card('Circulars', 'send', circs.map(function (c) {
          return '<div class="lrow" style="cursor:default"><span class="ic" style="color:' + (c.urgent ? 'var(--g-red)' : 'var(--g-blue)') + '">' + UI.icon(c.urgent ? 'alert' : 'file') + '</span><span class="lmain"><b>' + UI.esc(c.title) + '</b><span>' + UI.esc(c.body.slice(0, 90)) + '…</span></span><span class="ltime">' + UI.fmtDate(c.at) + '</span></div>';
        }).join(''), null, { href: 'calendar.html', label: 'Calendar' }) +
        '<div class="card glow glow-b accent-b"><div class="card-t">' + UI.icon('grid') + '<h3>Quick links</h3></div>' +
        '<div class="quickgrid">' +
          [{ i: 'rupee', l: 'Fees', h: 'fees.html' }, { i: 'checkc', l: 'Attendance', h: 'attendance.html' }, { i: 'book', l: 'Library', h: 'library.html' }, { i: 'play', l: 'e-Learning', h: 'elearning.html' }, { i: 'briefcase', l: 'Placement', h: 'placement.html' }, { i: 'ticket', l: 'Help', h: 'tickets.html' }].map(function (q) {
            return '<a class="bigbtn-tile" href="' + q.h + '">' + UI.icon(q.i) + '<b>' + q.l + '</b></a>';
          }).join('') + '</div></div>' +
      '</div></div>';

  }
});
})();

/* ── student/elearning ........................... ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'elearning',
  render: function (view, ctx) {

    var s = ctx.person;
    var state = { course: '' };
    function render() {
      var mats = Q.materialsOf(s.classId).filter(function (m) { return !state.course || m.courseId === state.course; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>e-Learning</h1><div class="sub">Course materials posted by your faculty — slides, videos, worksheets and notes</div></div>' +
        '<div class="actions">' + (mats.length ? UI.expBtn('elExp', 'Export list') : '') + '</div></div>' +
        '<div class="rowflex mb8" style="margin-bottom:16px">' +
        '<span class="chip' + (!state.course ? ' on' : '') + '" data-c="">All courses</span>' +
        Q.allocationsOf(s.classId).map(function (al) { return '<span class="chip' + (state.course === al.courseId ? ' on' : '') + '" data-c="' + al.courseId + '">' + al.courseId + '</span>'; }).join('') +
        '</div>' +
        (mats.length ? '<div class="grid g2">' + mats.map(function (m) {
          var ic = { 'PDF': 'file', 'Video': 'video', 'Slides': 'layers', 'Worksheet': 'clipboard', 'Notebook': 'edit' }[m.type] || 'file';
          var tint = { 'PDF': 'r', 'Video': 'b', 'Slides': 'y', 'Worksheet': 'g', 'Notebook': 'b' }[m.type] || 'b';
          return '<div class="card glow glow-' + tint + ' accent-' + tint + '"><div class="spread">' +
            '<div style="display:flex;gap:11px;align-items:center"><span class="sicon t' + tint + '" style="width:42px;height:42px;border-radius:11px;display:flex;align-items:center;justify-content:center;background:var(--' + tint + '-tint);color:var(--g-' + tint + ')">' + UI.icon(ic) + '</span>' +
            '<span><b style="font-size:13.5px">' + UI.esc(m.title) + '</b><div style="font-size:11px;color:var(--text-2)">' + m.courseId + ' · ' + m.type + ' · ' + UI.esc(Q.name(m.postedBy)) + '</div></span></div>' +
            '<span class="ltime">' + UI.fmtDate(m.postedAt) + '</span></div>' +
            '<div class="mt8" style="font-size:12.5px;color:var(--text-2)">' + UI.esc(m.desc) + '</div>' +
            '<div class="frow" style="justify-content:flex-start"><button class="btn sm ghost" data-mat="' + m.id + '">' + UI.icon('eye') + 'Open</button></div></div>';
        }).join('') + '</div>' : UI.empty('No materials posted for this filter', 'play')) +
        UI.card('Study rooms & practice', 'info', '<div class="quickgrid">' +
          '<div class="bigbtn-tile">' + UI.icon('book') + '<b>Digital library</b><span>26 titles · 12 e-books</span></div>' +
          '<div class="bigbtn-tile">' + UI.icon('target') + '<b>Quiz arena</b><span>course quizzes</span></div>' +
          '<div class="bigbtn-tile">' + UI.icon('users') + '<b>Mentor desk</b><span>book guidance</span></div>' +
          '</div>');
      view.querySelectorAll('[data-c]').forEach(function (c) { c.addEventListener('click', function () { state.course = c.getAttribute('data-c'); render(); }); });
      var eex = document.getElementById('elExp');
      if (eex) eex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'E-LEARNING MATERIALS'],
          ['Student', s.name + ' (' + s.reg + ')'],
          ['Filter', state.course || 'All courses'],
          [],
          ['Posted', 'Course', 'Type', 'Title', 'Faculty', 'Description']
        ];
        DB.materials.filter(function (m) { return !state.course || m.courseId === state.course; }).forEach(function (m) {
          rows.push([m.postedAt, m.courseId, m.type, m.title, Q.name(m.postedBy), m.desc]);
        });
        UI.downloadCSV('eLearning-Materials-' + s.reg + '.csv', rows);
      });
      view.querySelectorAll('[data-mat]').forEach(function (b) { b.addEventListener('click', function () {
        var m = DB.materials.filter(function (x) { return x.id === b.getAttribute('data-mat'); })[0];
        UI.modal({ title: m.title, body: UI.kv([['Course', m.courseId], ['Type', m.type], ['Posted by', UI.esc(Q.name(m.postedBy))], ['Posted on', UI.fmtDate(m.postedAt)]]) +
          '<p style="margin-top:12px">' + UI.esc(m.desc) + '</p>' + UI.hint('Materials open in the campus reader with offline access during exam weeks.', '', 'info'),
          actions: '<button class="btn pri" data-open="' + m.id + '">' + UI.icon('download') + 'Open material</button>' });
        document.querySelector('[data-open]').addEventListener('click', function () {
          UI.download(m.title.replace(/\s+/g, '-') + '.txt', m.title + '\n' + m.courseId + ' — ' + m.type + '\n\n' + m.desc + '\n\nPosted by ' + Q.name(m.postedBy) + ' on ' + m.postedAt + '\n(demo extract)\n');
          UI.closeModal();
        });
      }); });
    }
    render();

  }
});
})();

/* ── student/exams ............................... ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'exams',
  render: function (view, ctx) {

    var s = ctx.person;
    var upcoming = DB.calendarEvents.filter(function (e) { return e.type === 'Exam' && e.date >= Q.today(); }).slice(0, 4);
    var rows = Q.allocationsOf(s.classId).map(function (al) {
      var m = Q.marksOf(s.id)[al.courseId] || {};
      return { c: Q.courseById(al.courseId), i1: m.I1 != null ? m.I1 : '—', q1: m.Q1 != null ? m.Q1 : '—', i2: m.I2 != null ? m.I2 : '—' };
    });
    var ht = DB.hallTickets.filter(function (h) { return h.published && (h.classId === s.classId || !h.classId); })[0];
    var dues = Q.duesOf(s.id);
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>Exams & Scores</h1><div class="sub">Continuous assessment track · semester V</div></div>' +
      '<div class="actions">' + UI.expBtn('exExp', 'Export scores') + (ht && dues.total <= DB.settings.wf.feeGrace ? '<button class="btn ok" id="dlHT">' + UI.icon('download') + 'Hall ticket — ' + UI.esc(ht.exam.slice(0, 22)) + '</button>' : '') + '</div></div>' +
      (ht && dues.total > DB.settings.wf.feeGrace ? UI.hint('Hall tickets for <b>' + UI.esc(ht.exam) + '</b> are on hold — settle ₹' + dues.total.toLocaleString('en-IN') + ' of fee dues at the office or via the Fees page to unlock.', 'danger', 'alert') : '') +
      '<div class="statrow">' +
      UI.stat({ tone: 'b', icon: 'chart', value: rows.reduce(function (a, r) { return a + (r.i1 || 0) + (r.q1 || 0); }, 0), label: 'Assessment aggregate', sub: 'Internal-1 (×20) + Quiz-1 (×10) across 6 courses', href: 'ranking.html' }) +
      UI.stat({ tone: 'g', icon: 'cap', value: s.cgpa.toFixed(2), label: 'CGPA after 4 semesters' }) +
      UI.stat({ tone: 'y', icon: 'clock', value: 'Internal-2', label: 'Next assessment', sub: '5–7 Oct 2026', href: 'calendar.html' }) +
      '</div>' +
      '<div class="split">' +
      '<div>' + UI.card('Internal assessment marks', 'list', UI.table([
        { h: 'Course', render: function (r) { return '<b class="mono" style="color:var(--blue-ink)">' + r.c.id + '</b> · ' + UI.esc(r.c.title.slice(0, 28)); } },
        { h: 'Internal-1 (20)', render: function (r) { return '<b class="num">' + r.i1 + '</b>'; } },
        { h: 'Internal-2 (20)', render: function (r) { return '<b class="num">' + r.i2 + '</b>'; } },
        { h: 'Quiz-1 (10)', render: function (r) { return '<b class="num">' + r.q1 + '</b>'; } },
        { h: 'Score bar', render: function (r) { var t = (typeof r.i1 === 'number' ? r.i1 : 0) + (typeof r.q1 === 'number' ? r.q1 : 0) + (typeof r.i2 === 'number' ? r.i2 : 0); return UI.bar(Math.round(t / 50 * 100), t >= 40 ? 'g' : t >= 30 ? 'y' : 'r'); } }
      ], rows)) +
      UI.card('Semester GPA history', 'trend',
        '<div class="bars">' + s.semCgpa.map(function (v, i) {
          return '<div class="brow"><span class="bl">Semester ' + (i + 1) + '</span>' + UI.bar(v * 10, v >= 8 ? 'g' : 'y') + '<span class="bn">' + v.toFixed(2) + '</span></div>';
        }).join('') + '<div class="brow"><span class="bl"><b>Cumulative</b></span>' + UI.bar(s.cgpa * 10, 'b2') + '<span class="bn"><b>' + s.cgpa.toFixed(2) + '</b></span></div></div>') +
      '</div>' +
      '<div>' +
      UI.card('Examination calendar', 'calendar', upcoming.map(function (e) {
        return '<div class="lrow" style="cursor:default"><span class="ic" style="color:var(--g-red)">' + UI.icon('file') + '</span><span class="lmain"><b>' + UI.esc(e.title) + '</b><span>' + UI.fmtDate(e.date) + '</span></span>' + UI.badge('Scheduled') + '</div>';
      }).join('')) +
      UI.card('Completed semesters', 'cap', UI.table([
        { h: 'Semester', render: function (r, i) { return '<b>S' + (i + 1) + '</b>'; } },
        { h: 'SGPA', render: function (r) { return '<b class="num">' + r.toFixed(2) + '</b>'; } },
        { h: 'Result', render: function () { return UI.badge('Published'); } }
      ], s.semCgpa) + '<div class="fhint">Marks are entered by course faculty and published course-wise after review.</div>') +
      '</div></div>';
    var dl = document.getElementById('dlHT');
    if (dl) dl.addEventListener('click', function () {
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Institute', DB.settings.institute],
        ['Document', 'HALL TICKET'],
        ['Examination', ht.exam],
        ['Name', s.name],
        ['Reg No', s.reg],
        ['Class', s.classId],
        [],
        ['Course Code', 'Course Title']
      ];
      Q.allocationsOf(s.classId).forEach(function (al) { rows.push([al.courseId, Q.courseById(al.courseId).title]); });
      rows.push([]);
      rows.push(['Issued on', ht.publishedAt]);
      rows.push(['Issued by', 'Office of Academic Administration']);
      rows.push(['Note', 'Candidate must carry this ticket and the ID card.']);
      UI.downloadCSV('HallTicket-' + s.reg + '-' + ht.exam.replace(/[^A-Za-z0-9]+/g, '-') + '.csv', rows);
    });
    var exx = document.getElementById('exExp');
    if (exx) exx.addEventListener('click', function () {
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'ASSESSMENT SCORE REPORT'],
        ['Student', s.name + ' (' + s.reg + ')'],
        ['Class', s.classId],
        ['CGPA', s.cgpa.toFixed(2)],
        [],
        ['Course', 'Title', 'Internal-1 (20)', 'Internal-2 (20)', 'Quiz-1 (10)']
      ];
      Q.allocationsOf(s.classId).forEach(function (al) {
        var m = Q.marksOf(s.id)[al.courseId] || {};
        rows.push([al.courseId, Q.courseById(al.courseId).title, m.I1 != null ? m.I1 : '—', m.I2 != null ? m.I2 : '—', m.Q1 != null ? m.Q1 : '—']);
      });
      rows.push([]);
      s.semCgpa.forEach(function (v, i) { rows.push(['SGPA S' + (i + 1), v.toFixed(2)]); });
      UI.downloadCSV('ScoreReport-' + s.reg + '.csv', rows);
    });

  }
});
})();

/* ── student/fees ................................ ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'fees',
  render: function (view, ctx) {

    var s = ctx.person;
    var dues = Q.duesOf(s.id);
    var tx = Q.feeTxOf(s.id);
    function receiptRows(rc, head, amount, mode, date) {
      return [
        ['My Desktop Tech — CampusOne', ''],
        ['Institute', DB.settings.institute],
        ['Document', 'FEE RECEIPT'],
        ['Receipt No', rc],
        ['Student', s.name + ' (' + s.reg + ')'],
        ['Class', s.classId],
        ['Head', head],
        ['Amount (Rs)', amount],
        ['Mode', mode],
        ['Date', date],
        ['Issued by', 'Office of Finance & Accounts']
      ];
    }
    function render() {
      dues = Q.duesOf(s.id); tx = Q.feeTxOf(s.id);
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Fees</h1><div class="sub">Semester V · ' + DB.settings.academicYear + '</div></div>' +
        '<div class="actions">' + UI.expBtn('feeTx', 'Download transactions') + '<button class="btn ghost" id="feeLed">' + UI.icon('download') + 'Download statement</button></div></div>' +
        (dues.total ? UI.hint('Outstanding dues: <b>' + UI.money(dues.total) + '</b> across ' + dues.heads.length + ' head(s). Hall tickets hold when dues exceed the permitted grace.', 'warn', 'alert') :
          UI.hint('All fee heads for this semester are <b>cleared</b>. Thank you.', 'ok', 'checkc')) +
        '<div class="statrow">' +
        UI.stat({ tone: dues.total ? 'r' : 'g', icon: 'rupee', value: dues.total ? UI.money(dues.total) : 'Cleared', label: 'Total dues' }) +
        UI.stat({ tone: 'g', icon: 'check', value: tx.length, label: 'Payments made', sub: 'this semester' }) +
        UI.stat({ tone: 'b', icon: 'wallet', value: UI.money(tx.reduce(function (a, b) { return a + b.amount; }, 0)), label: 'Total paid' }) +
        '</div>' +
        '<div class="split">' +
        '<div>' + UI.card('Fee heads & status', 'list', UI.table([
          { h: 'Head', render: function (r) { var d = UI.daysTo(r.head.due); var chip = r.due ? '<span class="eta-chip ' + (d < 0 ? 'late' : d <= 3 ? 'warn' : 'ok') + '">' + UI.icon('clock') + (d < 0 ? 'overdue ' + Math.abs(d) + 'd' : d === 0 ? 'due today' : d + 'd left') + '</span>' : ''; return '<b>' + UI.esc(r.head.name) + '</b><div style="font-size:11.5px;color:var(--text-2);margin-top:3px">Due by ' + UI.fmtDate(r.head.due) + (r.due ? ' · ' + chip : '') + '</div>'; } },
          { h: 'Amount', render: function (r) { return '<span class="num">' + UI.money(r.head.amount) + '</span>'; } },
          { h: 'Paid', render: function (r) { return '<span class="num">' + (r.paid ? UI.money(r.paid) : '—') + '</span>'; } },
          { h: 'Balance', render: function (r) { return r.due ? '<b class="num" style="color:var(--red-ink)">' + UI.money(r.due) + '</b>' : UI.badge('Paid'); } },
          { h: 'Action', render: function (r) { return r.due ? '<button class="btn sm pri" data-pay="' + r.head.id + '">' + UI.icon('rupee') + 'Pay now</button>' : '<span class="dl" data-rcpt="' + r.head.id + '">Receipt</span>'; } }
        ], dues.heads.map(function (h) { return { head: h.head, due: h.due, paid: h.paid }; }).concat(
          DB.feeHeads.filter(function (h) { return !dues.heads.filter(function (x) { return x.head.id === h.id; }).length && (h.applies !== 'hostellers' || s.hostel); })
            .map(function (h) { return { head: h, due: 0, paid: h.amount }; })))) + '</div>' +
        '<div>' + UI.card('Payment history', 'clock', UI.table([
          { h: 'Date', render: function (r) { return UI.fmtDate(r.date); } },
          { h: 'Receipt', render: function (r) { return '<span class="mono">' + r.receipt + '</span>'; } },
          { h: 'Head', render: function (r) { var h2 = DB.feeHeads.filter(function (x) { return x.id === r.head; })[0]; return UI.esc(h2 ? h2.name : '—'); } },
          { h: 'Mode', render: function (r) { return r.mode; } },
          { h: 'Amount', render: function (r) { return '<b class="num">' + UI.money(r.amount) + '</b>'; } },
          { h: '', render: function (r) { return '<span class="dl" data-dlt="' + r.id + '">' + UI.icon('download') + '</span>'; } }
        ], tx)) +
        UI.card('Help with fees', 'info', UI.hint('Facing a constraint? Scholarships and instalment plans are available — meet the office with your parent/guardian, or raise a Fees ticket from the Help page.', '', 'info')) +
        '</div></div>';
      view.querySelectorAll('[data-pay]').forEach(function (b) { b.addEventListener('click', function () {
        var hid = b.getAttribute('data-pay'), h = DB.feeHeads.filter(function (x) { return x.id === hid; })[0];
        var d = dues.heads.filter(function (x) { return x.head.id === hid; })[0];
        var amt = d ? d.due : h.amount;
        UI.modal({ title: 'Pay — ' + h.name, body:
          UI.kv([['Head', UI.esc(h.name)], ['Semester dues', UI.money(amt)]]) +
          '<div class="mt16">' + UI.field('fp-mode', 'Payment mode', UI.select('fp-mode', ['UPI', 'Net Banking', 'Card'])) + '</div>' +
          '<div class="mt8">' + UI.field('fp-amt', 'Amount', '<input class="input" id="fp-amt" type="number" value="' + amt + '" min="1" max="' + amt + '">') + '</div>' +
          '<div class="hint-card mt16">' + UI.icon('shield') + '<div>Payments are processed on the institution\u2019s secured channel. A receipt is generated instantly.</div></div>',
          actions: '<button class="btn ok" id="fp-go">' + UI.icon('check') + 'Proceed to pay</button><button class="btn" onclick="UI.closeModal()">Cancel</button>' });
        document.getElementById('fp-go').addEventListener('click', function () {
          var a = +document.getElementById('fp-amt').value, m = document.getElementById('fp-mode').value;
          if (!a || a < 1) { UI.toast('Enter a valid amount', '', 'red'); return; }
          var rc = WF.collectFee(s.id, hid, a, m, s.id);
          UI.closeModal();
          UI.downloadCSV('Receipt-' + rc + '.csv', receiptRows(rc, h.name, a.toLocaleString('en-IN'), m, Q.today()));
          UI.toast('Payment successful', 'Receipt ' + rc + ' · the office has been notified.', 'green');
          render();
        });
      }); });
      view.querySelectorAll('[data-dlt]').forEach(function (el) { el.addEventListener('click', function () {
        var r = DB.feeTransactions.filter(function (x) { return x.id === el.getAttribute('data-dlt'); })[0];
        UI.downloadCSV('Receipt-' + r.receipt + '.csv', receiptRows(r.receipt, DB.feeHeads.filter(function (h) { return h.id === r.head; })[0].name, r.amount.toLocaleString('en-IN'), r.mode, r.date));
      }); });
      view.querySelectorAll('[data-rcpt]').forEach(function (el) { el.addEventListener('click', function () {
        var hid = el.getAttribute('data-rcpt');
        var myTx = DB.feeTransactions.filter(function (x) { return x.studentId === s.id && x.head === hid; });
        if (myTx.length) {
          var r = myTx[myTx.length - 1];
          var h = DB.feeHeads.filter(function (x) { return x.id === hid; })[0];
          UI.downloadCSV('Receipt-' + r.receipt + '.csv', receiptRows(r.receipt, h.name, r.amount.toLocaleString('en-IN'), r.mode, r.date));
        } else {
          UI.toast('No receipt yet', 'Pay this head to generate a receipt.', 'yellow');
        }
      }); });
      document.getElementById('feeLed').addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'FEE STATEMENT'],
          ['Institute', DB.settings.institute],
          ['Student', s.name + ' (' + s.reg + ')'],
          ['Class', s.classId],
          ['Semester', 'V — ' + DB.settings.academicYear],
          [],
          ['Head', 'Amount (Rs)', 'Paid (Rs)', 'Balance (Rs)']
        ];
        DB.feeHeads.filter(function (h) { return h.applies !== 'hostellers' || s.hostel; }).forEach(function (h) {
          var p = (s.feePaid || {})[h.id] || 0;
          rows.push([h.name, h.amount.toLocaleString('en-IN'), p.toLocaleString('en-IN'), Math.max(0, h.amount - p).toLocaleString('en-IN')]);
        });
        rows.push([]);
        rows.push(['Total dues', Q.duesOf(s.id).total.toLocaleString('en-IN')]);
        UI.downloadCSV('FeeStatement-' + s.reg + '.csv', rows);
      });
      document.getElementById('feeTx').addEventListener('click', function () {
        var billed = DB.feeHeads.filter(function (h) { return h.applies !== 'hostellers' || s.hostel; }).reduce(function (a, h) { return a + h.amount; }, 0);
        var paid = tx.reduce(function (a, b) { return a + b.amount; }, 0);
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'FEE TRANSACTION LEDGER'],
          ['Institute', DB.settings.institute],
          ['Student', s.name + ' (' + s.reg + ')'],
          ['Class', s.classId],
          ['Semester', 'V — ' + DB.settings.academicYear],
          ['Generated', Q.today()],
          [],
          ['Overall billed (Rs)', billed.toLocaleString('en-IN')],
          ['Overall paid (Rs)', paid.toLocaleString('en-IN')],
          ['Overall dues (Rs)', Q.duesOf(s.id).total.toLocaleString('en-IN')],
          ['Payments made', tx.length],
          [],
          ['Date', 'Receipt', 'Head', 'Mode', 'Amount (Rs)', 'Running balance due (Rs)']
        ];
        var run = billed;
        tx.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; }).forEach(function (r) {
          run = Math.max(0, run - r.amount);
          var h = DB.feeHeads.filter(function (x) { return x.id === r.head; })[0];
          rows.push([r.date, r.receipt, h ? h.name : '—', r.mode, r.amount.toLocaleString('en-IN'), run.toLocaleString('en-IN')]);
        });
        rows.push([]);
        rows.push(['Heads pending', Q.duesOf(s.id).heads.map(function (x) { return x.head.name; }).join(' | ') || 'None — all cleared']);
        UI.downloadCSV('FeeTransactions-' + s.reg + '.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── student/hostel .............................. ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'hostel',
  render: function (view, ctx) {

    var s = ctx.person;
    if (!s.hostel) {
      view.innerHTML = '<div class="pagehead"><div class="ph-t"><h1>My Hostel</h1><div class="sub">Hostel services</div></div></div>' +
        UI.hint('You are enrolled as a <b>day scholar</b>. Hostel modules are available for residents only. Contact the office if you wish to apply for residency.', '', 'info');
      return;
    }
    var room = Q.roomOf(s.id);
    var warden = Q.wardenOf(s.block);
    var mates = (room.occupants || []).filter(function (x) { return x !== s.id; }).map(function (x) { return Q.studentById(x); });
    var complaints = DB.complaints.filter(function (c) { return c.by === s.id; });
    function render() {
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>My Hostel</h1><div class="sub">' + UI.esc(warden.blockName) + ' · resident since Jul 2026</div></div>' +
        '<div class="actions"><button class="btn ghost" id="newCmp">' + UI.icon('wrench') + 'Raise complaint</button></div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'key', value: room.id, label: 'My room', sub: room.capacity + '-sharing · Floor ' + room.floor }) +
        UI.stat({ tone: 'g', icon: 'bed', value: (room.occupants || []).length + '/' + room.capacity, label: 'Occupancy' }) +
        UI.stat({ tone: 'y', icon: 'utensils', value: 'Central mess', label: 'Dining', sub: s.block === 'A' ? 'Block A dining hall' : 'Block B dining hall', href: 'mess.html' }) +
        '</div>' +
        '<div class="split">' +
        '<div>' +
        UI.card('Room ' + room.id, 'bed',
          '<div class="rowflex">' + mates.map(function (m) {
            return '<span style="display:inline-flex;align-items:center;gap:8px;background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:7px 12px">' + UI.avatar(m, 30) +
              '<span><b style="font-size:12.5px">' + UI.esc(m.name) + '</b><div style="font-size:10.5px;color:var(--text-2)">' + m.reg + ' · ' + m.classId + '</div></span></span>';
          }).join('<span style="width:8px"></span>') + '</div>' +
          '<div class="mt16">' + UI.hint('Room allotment and vacancy are governed by the warden of your block. Movements are recorded at the gate register.', '', 'info') + '</div>') +
        UI.card('Warden — ' + UI.esc(warden.blockName), 'shield',
          '<div style="display:flex;gap:12px;align-items:center">' + UI.avatar(warden, 38) +
          '<div style="min-width:0"><b style="font-size:13.5px">' + UI.esc(warden.name) + '</b><div style="font-size:11.5px;color:var(--text-2)">' + UI.esc(warden.designation) + '</div>' +
          '<div class="mt8 rowflex" style="gap:8px;font-size:12px;flex-wrap:wrap">' +
          '<span class="chip" style="cursor:default;padding:3px 10px">' + UI.icon('phone') + UI.esc(warden.phone) + '</span>' +
          '<span class="chip" style="cursor:default;padding:3px 10px">' + UI.icon('mail') + UI.esc(warden.email) + '</span></div></div></div>' +
          '<div class="mt8">' + UI.hint('Outing requests, complaints and mess feedback for ' + (s.gender === 'F' ? 'the girls block' : 'the boys block') + ' route to your warden directly.', '', 'info') + '</div>') +
        '</div>' +
        '<div>' +
        UI.card('My complaints', 'wrench',
          (complaints.length ? UI.table([
            { h: 'Complaint', render: function (r) { return '<b>' + UI.esc(r.title) + '</b><div style="font-size:11px;color:var(--text-2)">' + r.category + ' · ' + UI.fmtDT(r.at) + '</div>'; } },
            { h: 'Status', render: function (r) { return UI.badge(r.status); } },
            { h: 'Resolution', render: function (r) { return r.resolution ? UI.esc(r.resolution) : '—'; } }
          ], complaints) : UI.empty('No complaints raised', 'checkc'))) +
        UI.card('Quick actions', 'grid', '<div class="quickgrid">' +
          '<a class="bigbtn-tile" href="outing.html">' + UI.icon('door') + '<b>Outing request</b><span>gate pass</span></a>' +
          '<a class="bigbtn-tile" href="mess.html">' + UI.icon('utensils') + '<b>Mess menu</b><span>this week</span></a>' +
          '<a class="bigbtn-tile" href="fees.html">' + UI.icon('rupee') + '<b>Mess fee</b><span>pay dues</span></a>' +
          '<a class="bigbtn-tile" href="tickets.html">' + UI.icon('ticket') + '<b>Help ticket</b><span>escalate</span></a>' +
          '</div>') +
        '</div></div>';
      document.getElementById('newCmp').addEventListener('click', function () {
        UI.modal({ title: 'Raise a hostel complaint', body:
          UI.field('cm-cat', 'Category', UI.select('cm-cat', ['Maintenance', 'Housekeeping', 'Mess', 'Security', 'Other']), true) +
          UI.field('cm-title', 'Title', '<input class="input" id="cm-title" placeholder="Short summary">', true) +
          UI.field('cm-desc', 'Details', '<textarea class="input" id="cm-desc"></textarea>', true),
          actions: '<button class="btn pri" id="cm-go">' + UI.icon('send') + 'Submit to warden</button>' });
        document.getElementById('cm-go').addEventListener('click', function () {
          var f = { category: val('cm-cat'), title: val('cm-title'), desc: val('cm-desc') };
          if (!f.title || !f.desc) { UI.toast('Fill the required fields', '', 'red'); return; }
          WF.submitComplaint(s.id, f);
          UI.closeModal(); UI.toast('Complaint submitted', 'Your warden has been notified.', 'green');
          render();
        });
      });
    }
    function val(id) { return document.getElementById(id).value.trim(); }
    render();

  }
});
})();

/* ── student/leave ............................... ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'leave',
  render: function (view, ctx) {

    var s = ctx.person;
    function render() {
      var list = Q.leavesOf(s.id);
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Leave Requests</h1><div class="sub">Sick & casual leave · beyond ' + DB.settings.wf.longLeaveDays + ' days needs the Principal\u2019s countersignature</div></div>' +
        '<div class="actions">' + (list.length ? UI.expBtn('lvExp', 'Export CSV') : '') + '<button class="btn pri" id="newLv">' + UI.icon('plus') + 'New leave request</button></div></div>' +
        (list.length ? '' : UI.empty('No leave requests yet', 'key')) +
        '<div class="grid g2">' + list.map(function (r) {
          return '<div class="card glow glow-y accent-y"><div class="spread"><div><b>' + UI.esc(r.type) + ' · ' + r.days + ' day' + (r.days > 1 ? 's' : '') + '</b>' +
            '<div style="font-size:12px;color:var(--text-2)">' + UI.fmtDate(r.from) + ' → ' + UI.fmtDate(r.to) + '</div></div>' + UI.badge(r.status) + '</div>' +
            '<div class="mt8" style="font-size:12.5px;color:var(--text-2)">' + UI.esc(r.reason) + '</div>' +
            '<div class="mt8">' + UI.timeline(r.timeline) + '</div></div>';
        }).join('') + '</div>';
      document.getElementById('newLv').addEventListener('click', function () {
        UI.modal({ title: 'New leave request', body:
          '<div class="fgrid">' +
          UI.field('lv-type', 'Leave type', UI.select('lv-type', ['Sick Leave', 'Casual Leave', 'On Duty Leave'])) +
          UI.field('lv-from', 'From', '<input class="input" id="lv-from" type="date" min="' + Q.today() + '">', true) +
          UI.field('lv-to', 'To', '<input class="input" id="lv-to" type="date" min="' + Q.today() + '">', true) +
          '</div>' +
          UI.field('lv-reason', 'Reason', '<textarea class="input" id="lv-reason"></textarea>', true) +
          UI.field('lv-proof', 'Supporting document', '<input type="file" class="input" id="lv-proof" style="text-align:left">') +
          '<div class="fhint">Sick leave beyond 2 days should carry a medical certificate.</div>',
          actions: '<button class="btn pri" id="lv-go">' + UI.icon('send') + 'Submit</button><button class="btn" onclick="UI.closeModal()">Cancel</button>' });
        document.getElementById('lv-go').addEventListener('click', function () {
          var f = { type: val('lv-type'), from: val('lv-from'), to: val('lv-to'), reason: val('lv-reason') };
          var file = document.getElementById('lv-proof').files[0]; f.proof = file ? file.name : '';
          if (!f.from || !f.to || !f.reason) { UI.toast('Fill the required fields', '', 'red'); return; }
          if (f.to < f.from) { UI.toast('Check the dates', 'End date is before the start.', 'red'); return; }
          WF.submitLeave(s.id, f);
          UI.closeModal(); UI.toast('Leave request submitted', 'Your class advisor has been notified.', 'green');
          render();
        });
      });
    }
    function val(id) { return document.getElementById(id).value.trim(); }
    var lvex = document.getElementById('lvExp');
    if (lvex) lvex.addEventListener('click', function () {
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'LEAVE REQUESTS STATEMENT'],
        ['Student', s.name + ' (' + s.reg + ')'],
        ['Class', s.classId],
        [],
        ['Type', 'From', 'To', 'Days', 'Reason', 'Proof', 'Status']
      ];
      Q.leavesOf(s.id).forEach(function (r) { rows.push([r.type, r.from, r.to, r.days || '—', r.reason, r.proof || '—', r.status]); });
      UI.downloadCSV('LeaveRequests-' + s.reg + '.csv', rows);
    });
    render();

  }
});
})();

/* ── student/library ............................. ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'library',
  render: function (view, ctx) {

    var s = ctx.person;
    var state = { q: '', subject: '' };
    function render() {
      var mine = Q.borrowsOf(s.id);
      var books = DB.libraryBooks.filter(function (b) {
        return (!state.q || (b.title + b.author).toLowerCase().indexOf(state.q.toLowerCase()) >= 0) &&
               (!state.subject || b.subject === state.subject);
      });
      var subjects = DB.libraryBooks.map(function (b) { return b.subject; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort();
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Library</h1><div class="sub">Borrow, renew, discover · overdue fine ₹5 per day</div></div>' +
        '<div class="actions">' + (mine.length ? UI.expBtn('libExp', 'Export history') : '') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'g', icon: 'book', value: mine.filter(function (r) { return r.status === 'Active'; }).length, label: 'Currently borrowed' }) +
        UI.stat({ tone: 'r', icon: 'alert', value: mine.filter(function (r) { return r.status === 'Overdue'; }).length, label: 'Overdue' }) +
        UI.stat({ tone: 'b', icon: 'grid', value: DB.libraryBooks.reduce(function (a, b) { return a + b.copies; }, 0), label: 'Titles in catalogue' }) +
        UI.stat({ tone: 'y', icon: 'play', value: DB.ebooks.length, label: 'e-Books' }) +
        '</div>' +
        UI.card('My loans', 'book', mine.length ? UI.table([
          { h: 'Book', render: function (r) { var b = Q.bookByAcc(r.acc); return '<b>' + UI.esc(b.title) + '</b><div style="font-size:11px;color:var(--text-2)">' + UI.esc(b.author) + ' · ' + r.acc + '</div>'; } },
          { h: 'Borrowed', render: function (r) { return UI.fmtDate(r.out); } },
          { h: 'Due', render: function (r) { return r.status === 'Overdue' ? '<b style="color:var(--red-ink)">' + UI.fmtDate(r.due) + '</b>' : UI.fmtDate(r.due); } },
          { h: 'Fine', render: function (r) { return r.fine ? '<b class="num" style="color:var(--red-ink)">' + UI.money(r.fine) + '</b>' : '—'; } },
          { h: 'Status', render: function (r) { return UI.badge(r.status); } },
          { h: 'Action', render: function (r) { return (r.status === 'Active' || r.status === 'Overdue') ? '<span class="dl" data-renew="' + r.id + '">Renew</span>' : ''; } }
        ], mine) : UI.empty('No active loans — the catalogue is open', 'book')) +
        '<div class="split-eq mt16">' +
        '<div>' + UI.card('Catalogue', 'search',
          '<div class="rowflex mb8"><div class="qsearch" style="flex:1">' + UI.icon('search') + '<input class="input" id="lib-q" placeholder="Search title or author" value="' + UI.esc(state.q) + '"></div>' +
          UI.select('lib-subj', subjects.map(function (x) { return { v: x, l: x }; }), state.subject, 'All subjects') + '</div>' +
          UI.table([
            { h: 'Title', render: function (r) { return '<b>' + UI.esc(r.title) + '</b><div style="font-size:11px;color:var(--text-2)">' + UI.esc(r.author) + '</div>'; } },
            { h: 'Subject', render: function (r) { return '<span class="tag n">' + UI.esc(r.subject) + '</span>'; } },
            { h: 'Available', render: function (r) { return r.available > 0 ? '<b class="num" style="color:var(--green-ink)">' + r.available + '/' + r.copies + '</b>' : UI.badge('Blocked', 'All out'); } },
            { h: 'Acc No', render: function (r) { return '<span class="mono">' + r.acc + '</span>'; } },
            { h: 'Action', render: function (r) {
                var rsv = (DB.bookReservations || []).filter(function (x) { return x.acc === r.acc && x.studentId === s.id && x.status !== 'Closed'; })[0];
                return rsv ? '<span class="tag y">reserved · ' + rsv.status + '</span>' : (r.available > 0 ? '' : '<span class="dl" data-rsvb="' + r.acc + '">Reserve</span>');
              } }
          ], books)) + '</div>' +
        '<div>' + UI.card('Digital shelf — e-Books', 'play',
          '<div class="grid" style="gap:10px">' + DB.ebooks.map(function (e) {
            return '<div class="lrow"><span style="width:42px;height:56px;border-radius:8px;background:var(--blue-tint);color:var(--g-blue);display:flex;align-items:center;justify-content:center;flex-shrink:0">' + UI.icon('book') + '</span>' +
              '<span class="lmain"><b>' + UI.esc(e.title) + '</b><span>' + UI.esc(e.subject) + ' · ' + e.size + ' · ' + UI.esc(e.author) + '</span></span>' +
              '<button class="btn sm ghost" data-eb="' + e.id + '">' + UI.icon('download') + 'Access</button></div>';
          }).join('') + '</div>') + '</div>' +
        '</div>';
      var q = document.getElementById('lib-q');
      var lex = document.getElementById('libExp');
      if (lex) lex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'LIBRARY LOAN HISTORY'],
          ['Student', s.name + ' (' + s.reg + ')'],
          [],
          ['Acc No', 'Title', 'Author', 'Borrowed', 'Due', 'Returned', 'Fine (Rs)', 'Status']
        ];
        Q.borrowsOf(s.id).forEach(function (r) {
          var b = Q.bookByAcc(r.acc);
          rows.push([r.acc, b.title, b.author, r.out, r.due, r.ret || '—', r.fine || 0, r.status]);
        });
        UI.downloadCSV('LibraryHistory-' + s.reg + '.csv', rows);
      });
      q.addEventListener('input', function () { state.q = q.value; var pos = q.selectionStart; render(); var q2 = document.getElementById('lib-q'); q2.focus(); q2.setSelectionRange(pos, pos); });
      var sj = document.getElementById('lib-subj');
      sj.addEventListener('change', function () { state.subject = sj.value; render(); });
      view.querySelectorAll('[data-renew]').forEach(function (el) { el.addEventListener('click', function () {
        WF.renewBook(el.getAttribute('data-renew')); UI.toast('Renewed', 'Two more weeks added.', 'green'); render();
      }); });
      view.querySelectorAll('[data-eb]').forEach(function (el) { el.addEventListener('click', function () {
        var e = DB.ebooks.filter(function (x) { return x.id === el.getAttribute('data-eb'); })[0];
        UI.download(e.title.replace(/\s+/g, '-') + '.txt', e.title + '\n' + e.author + '\n' + e.subject + ' — digital reader copy (demo file).\n');
      }); });
      view.querySelectorAll('[data-rsvb]').forEach(function (el) { el.addEventListener('click', function () {
        var acc = el.getAttribute('data-rsvb');
        var b = Q.bookByAcc(acc);
        var queue = (DB.bookReservations || []).filter(function (x) { return x.acc === acc && x.status === 'Waiting'; }).length;
        WF.reserveBook(acc, s.id);
        UI.toast('Reserved — ' + (queue + 1) + ' in queue', b.title + '. The library desk notifies you when a copy is ready.', 'green'); render();
      }); });
    }
    render();

  }
});
})();

/* ── student/mentor .............................. ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'mentor',
  render: function (view, ctx) {

    var s = ctx.person;
    var mg = Q.mentorGroupOf(s.id);
    if (!mg) { view.innerHTML = UI.empty('No mentor group assigned', 'users'); return; }
    var mentor = Q.person(mg.mentorId);
    var meetings = DB.mentorMeetings.filter(function (m) { return m.groupId === mg.id; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    var remarks = DB.mentorRemarks.filter(function (r) { return r.studentId === s.id; });
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>Mentor</h1><div class="sub">Group of ' + mg.students.length + ' · ' + mg.classId + '</div></div>' +
      '<div class="actions">' + UI.expBtn('mtExp', 'Export history') + '<button class="btn pri" id="reqMeet">' + UI.icon('calendar') + 'Request a meeting</button></div></div>' +
      '<div class="split">' +
      '<div>' +
      UI.card('My mentor', 'user', '<div style="display:flex;gap:14px;align-items:center">' + UI.avatar(mentor, 64) +
        '<div><b style="font-size:16px">' + UI.esc(mentor.name) + '</b><div style="font-size:12.5px;color:var(--text-2)">' + UI.esc(mentor.designation) + ' · ' + DB.departments.filter(function (d) { return d.id === mentor.dept; }).map(function (d) { return d.name; }) + '</div>' +
        '<div style="font-size:12px;margin-top:5px">' + UI.icon('mail') + ' ' + UI.esc(mentor.email) + '</div></div></div>' +
        '<div class="mt16">' + UI.hint('Mentor meetings happen once a fortnight. Attendance, academics and wellbeing are reviewed — everything you share stays with the mentor.', '', 'info') + '</div>') +
      UI.card('Meeting history', 'users', meetings.map(function (m) {
        var upcoming = m.date > Q.today();
        return '<div class="lrow" style="cursor:default"><span class="ic" style="color:' + (upcoming ? 'var(--g-yellow)' : 'var(--g-green)') + '">' + UI.icon(upcoming ? 'clock' : 'checkc') + '</span>' +
          '<span class="lmain"><b>' + UI.esc(m.agenda) + '</b><span>' + UI.fmtDate(m.date) + (upcoming ? ' · upcoming' : ' · ' + m.attended + ' attended') + '</span>' +
          (m.notes ? '<span style="color:var(--text-2);font-size:12px">' + UI.esc(m.notes) + '</span>' : '') + '</span></div>';
      }).join('')) +
      '</div>' +
      '<div>' +
      UI.card('Mentor remarks about me', 'message',
        (remarks.length ? remarks.map(function (r) {
          return '<div class="lrow" style="cursor:default"><span class="ic" style="color:var(--g-blue)">' + UI.icon('message') + '</span>' +
            '<span class="lmain"><b>' + UI.fmtDate(r.date) + '</b><span>' + UI.esc(r.remark) + '</span></span></div>';
        }).join('') : UI.empty('No remarks yet', 'message'))) +
      UI.card('My group mates', 'users', '<div class="rowflex">' + mg.students.filter(function (x) { return x !== s.id; }).slice(0, 11).map(function (x) {
        var m = Q.studentById(x);
        return '<span title="' + UI.esc(m.name) + '" style="position:relative;cursor:default">' + UI.avatar(m, 34) + '</span>';
      }).join('') + '</div>') +
      '</div></div>';
    var mtex = document.getElementById('mtExp');
    if (mtex) mtex.addEventListener('click', function () {
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'MENTOR MEETING HISTORY'],
        ['Student', s.name + ' (' + s.reg + ')'],
        ['Mentor', mentor.name],
        [],
        ['Date', 'Agenda', 'Attended', 'Notes']
      ];
      meetings.forEach(function (m) { rows.push([m.date, m.agenda, m.attended || '—', m.notes || '']); });
      DB.mentorRemarks.filter(function (r) { return r.studentId === s.id; }).forEach(function (r) { rows.push([r.at || '', 'Mentor remark', '—', r.text || r.remark || '']); });
      UI.downloadCSV('MentorHistory-' + s.reg + '.csv', rows);
    });
    document.getElementById('reqMeet').addEventListener('click', function () {
      UI.modal({ title: 'Request a mentor meeting', body:
        UI.field('mm-topic', 'Topic', '<input class="input" id="mm-topic" placeholder="e.g. Internship guidance, academic pressure">', true),
        actions: '<button class="btn pri" id="mm-go">' + UI.icon('send') + 'Send request</button>' });
      document.getElementById('mm-go').addEventListener('click', function () {
        var t = document.getElementById('mm-topic').value.trim();
        if (!t) { UI.toast('Add a topic', '', 'red'); return; }
        WF.requestMentorMeeting(s.id, t);
        UI.closeModal(); UI.toast('Request sent', mentor.name + ' will confirm a slot.', 'green');
      });
    });

  }
});
})();

/* ── student/mess ................................ ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'mess',
  render: function (view, ctx) {

    var s = ctx.person;
    var days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    var todayIdx = 4; /* Friday anchor */
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>Mess Timetable</h1><div class="sub">Central mess · ' + (s.block === 'A' ? 'Block A dining hall (Boys)' : 'Block B dining hall (Girls)') + ' · menu maintained by the warden & mess committee</div></div>' +
      '<div class="actions"><button class="btn ghost" id="feedback">' + UI.icon('star') + 'Give feedback</button></div></div>' +
      UI.card('This week\u2019s menu', 'utensils', UI.table([
        { h: 'Day', render: function (r, i) { return '<b' + (i === todayIdx ? ' style="color:var(--g-blue)"' : '') + '>' + r.day + '</b>' + (i === todayIdx ? ' <span class="tag b">today</span>' : ''); } },
        { h: 'Breakfast', render: function (r) { return UI.esc(r.breakfast); } },
        { h: 'Lunch', render: function (r) { return UI.esc(r.lunch); } },
        { h: 'Snacks', render: function (r) { return UI.esc(r.snacks); } },
        { h: 'Dinner', render: function (r) { return UI.esc(r.dinner); } }
      ], DB.messMenu)) +
      UI.hint('Breakfast 7:30–9:00 · Lunch 12:30–2:00 · Snacks 4:30–5:15 · Dinner 7:30–9:00. Non-veg days as marked. Special menu on festival days is announced via circulars.', '', 'info') +
      UI.card('Mess fee', 'rupee', UI.kv([
        ['Mess charges', UI.money(18000) + ' <span style="color:var(--text-2)">(Sep–Nov 2026)</span>'],
        ['Status', ((s.feePaid || {}).MS) ? UI.badge('Paid', 'Settled') : UI.badge('Pending', 'Due by 10 Oct')],
        ['Payment', '<a href="fees.html" class="dl">Open the Fees page →</a>']
      ]));
    document.getElementById('feedback').addEventListener('click', function () {
      var stars = 0;
      UI.modal({ title: 'Mess feedback', body:
        UI.field('mf-day', 'Day', UI.select('mf-day', days)) +
        '<div class="fld"><label>Your rating</label><div id="mf-stars">' + UI.stars(0) + '</div></div>' +
        UI.field('mf-note', 'Comments', '<textarea class="input" id="mf-note" placeholder="What improved? What should change?"></textarea>'),
        actions: '<button class="btn pri" id="mf-go">' + UI.icon('send') + 'Send feedback</button>' });
      document.querySelectorAll('#mf-stars button').forEach(function (b) {
        b.addEventListener('click', function () {
          stars = +b.getAttribute('data-star');
          document.getElementById('mf-stars').innerHTML = UI.stars(stars);
          document.querySelectorAll('#mf-stars button').forEach(function (x) {
            x.addEventListener('click', function () { document.getElementById('mf-stars').innerHTML = ''; });
          });
          rebindStars();
        });
      });
      function rebindStars() {
        document.querySelectorAll('#mf-stars button').forEach(function (b) {
          b.addEventListener('click', function () {
            stars = +b.getAttribute('data-star');
            document.getElementById('mf-stars').innerHTML = UI.stars(stars);
            rebindStars();
          });
        });
      }
      document.getElementById('mf-go').addEventListener('click', function () {
        if (!stars) { UI.toast('Pick a rating', 'Tap the stars.', 'yellow'); return; }
        UI.closeModal(); UI.toast('Feedback recorded', 'Thank you — the mess committee reviews weekly.', 'green');
      });
    });

  }
});
})();

/* ── student/notifications ....................... ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'notifications',
  render: function (view, ctx) {

    var s = ctx.person;
    var nfilter = 'All';
    function render() {
      var list = Q.notifsFor(ctx.user, s);
      var unread = list.filter(function (n) { return !n.read; }).length;
      var shown = nfilter === 'Unread' ? list.filter(function (n) { return !n.read; }) : list;
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Notifications</h1><div class="sub">' + list.length + ' messages · ' + unread + ' unread · newest first</div></div>' +
        '<div class="actions">' + (list.length ? UI.expBtn('ntfExp', 'Export CSV') : '') + '<button class="btn ghost" id="markall">' + UI.icon('check') + 'Mark all as read</button></div></div>' +
        '<div class="chiprow">' + UI.chiprow([{ v: 'All', l: 'All', c: list.length }, { v: 'Unread', l: 'Unread', c: unread }], nfilter) + '</div>' +
        '<div class="card glow glow-b">' +
        (shown.length ? shown.map(function (n) {
          return '<div class="lrow' + (n.read ? '' : '" style="background:var(--blue-tint);border-left:3px solid var(--g-blue)') + '">' +
            '<span class="ic" style="color:var(--g-blue)">' + UI.icon('bell') + '</span>' +
            '<span class="lmain"><b>' + UI.esc(n.title) + '</b><span>' + UI.esc(n.body) + '</span></span>' +
            '<span class="ltime">' + UI.esc(n.at) + '</span>' +
            (n.link ? '<a class="btn sm ghost" href="' + n.link + '">Open</a>' : '') + '</div>';
        }).join('') : UI.empty(nfilter === 'Unread' ? 'No unread notifications' : 'No notifications yet', 'bell')) + '</div>';
      view.querySelectorAll('[data-f]').forEach(function (c) { c.addEventListener('click', function () { nfilter = c.getAttribute('data-f'); render(); }); });
      var nex = document.getElementById('ntfExp');
      if (nex) nex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'NOTIFICATION INBOX'],
          ['Student', s.name + ' (' + s.reg + ')'],
          ['Generated', Q.today()],
          [],
          ['Received', 'Title', 'Message', 'Read']
        ];
        Q.notifsFor(ctx.user, s).forEach(function (n) { rows.push([n.at, n.title, n.body, n.read ? 'Yes' : 'No']); });
        UI.downloadCSV('Notifications-' + s.reg + '.csv', rows);
      });
      var mk = document.getElementById('markall');
      if (mk) mk.addEventListener('click', function () {
        DB.notifications.forEach(function (n) { if (n.aud === 'uid:' + s.id || n.aud === 'role:student' || n.aud === 'all') n.read = true; });
        Store.save(); render();
      });
    }
    render();

  }
});
})();

/* ── student/od .................................. ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'od',
  render: function (view, ctx) {

    var s = ctx.person;
    function render() {
      var list = Q.odsOf(s.id);
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>On Duty (OD)</h1><div class="sub">Route: Class Advisor → Academic Director' + (s.hostel ? ' · warden is informed for hostellers' : '') + '</div></div>' +
        '<div class="actions">' + (list.length ? UI.expBtn('odExp', 'Export CSV') : '') + '<button class="btn pri" id="newOd">' + UI.icon('plus') + 'New OD request</button></div></div>' +
        (list.length ? '' : UI.empty('No OD requests yet', 'door', 'Raise one for symposia, sports, paper presentations and official events.')) +
        '<div class="grid g2">' + list.map(function (r) {
          return '<div class="card glow glow-b accent-b"><div class="spread"><div><b>' + UI.esc(r.event) + '</b>' +
            '<div style="font-size:12px;color:var(--text-2)">' + UI.esc(r.venue) + ' · ' + UI.fmtDate(r.date) + ' · ' + r.session + '</div></div>' + UI.badge(r.status) + '</div>' +
            '<div class="mt8" style="font-size:12.5px;color:var(--text-2)"><b>Reason:</b> ' + UI.esc(r.reason) + '</div>' +
            '<div class="mt8" style="font-size:12px"><span class="tag n">proof: ' + UI.esc(r.proof) + '</span></div>' +
            '<div class="mt8">' + UI.timeline(r.timeline) + '</div></div>';
        }).join('') + '</div>' +
        UI.card('Points to remember', 'info',
          '<ul style="margin:6px 0 0 16px;padding:0;font-size:12.5px;color:var(--text-2);line-height:1.9">' +
          '<li>Attach the invitation or selection letter — requests without proof are usually rejected at the director level.</li>' +
          '<li>Submit at least <b>3 working days</b> before the event.</li>' +
          '<li>OD hours are counted as attended once approved — your attendance percentage updates automatically.</li>' +
          (s.hostel ? '<li>Hostellers: the warden is auto-informed after the director\u2019s approval; carry the approval at the gate.</li>' : '') + '</ul>');
      document.getElementById('newOd').addEventListener('click', function () {
        UI.modal({ title: 'New OD request', body:
          '<div class="fgrid">' +
          UI.field('od-event', 'Event', '<input class="input" id="od-event" placeholder="e.g. Yuva Tech \u201926 — Paper presentation">', true) +
          UI.field('od-venue', 'Venue', '<input class="input" id="od-venue" placeholder="e.g. PSG College of Technology">', true) +
          UI.field('od-date', 'Date', '<input class="input" id="od-date" type="date" min="' + Q.today() + '">', true) +
          UI.field('od-session', 'Session', UI.select('od-session', ['FN', 'AN', 'Full Day'], 'Full Day'), true) +
          '</div>' +
          UI.field('od-reason', 'Reason', '<textarea class="input" id="od-reason" placeholder="Why should this OD be granted?"></textarea>', true) +
          UI.field('od-proof', 'Proof (invitation / selection letter)', '<input type="file" class="input" id="od-proof" style="text-align:left">') +
          '<div class="fhint">The request goes first to your class advisor (' + UI.esc(Q.name(s.advisorId)) + '), then to the Academic Director.</div>',
          actions: '<button class="btn pri" id="od-go">' + UI.icon('send') + 'Submit request</button><button class="btn" onclick="UI.closeModal()">Cancel</button>' });
        document.getElementById('od-go').addEventListener('click', function () {
          var f = { event: val('od-event'), venue: val('od-venue'), date: val('od-date'), session: val('od-session'), reason: val('od-reason') };
          var file = document.getElementById('od-proof').files[0];
          f.proof = file ? file.name : '';
          if (!f.event || !f.venue || !f.date || !f.reason) { UI.toast('Fill the required fields', '', 'red'); return; }
          WF.submitOd(s.id, f);
          UI.closeModal(); UI.toast('OD request submitted', 'Your class advisor has been notified.', 'green');
          render();
        });
      });
    }
    function val(id) { return document.getElementById(id).value.trim(); }
    var odex = document.getElementById('odExp');
    if (odex) odex.addEventListener('click', function () {
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'OD REQUESTS STATEMENT'],
        ['Student', s.name + ' (' + s.reg + ')'],
        ['Class', s.classId],
        [],
        ['Event', 'Venue', 'Date', 'Session', 'Reason', 'Proof', 'Status']
      ];
      Q.odsOf(s.id).forEach(function (r) { rows.push([r.event, r.venue, r.date, r.session, r.reason, r.proof || '—', r.status]); });
      UI.downloadCSV('ODRequests-' + s.reg + '.csv', rows);
    });
    render();

  }
});
})();

/* ── student/outing .............................. ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'outing',
  render: function (view, ctx) {


    var s = ctx.person;
    function render() {
      var list = Q.outingsOf(s.id);
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Outing Requests</h1><div class="sub">' + (s.hostel ? 'Warden approval' + (true ? ' · overnight adds the Academic Director' : '') : 'Hostel residents only') + '</div></div>' +
        '<div class="actions">' + (list.length ? UI.expBtn('outExp', 'Export CSV') : '') + (s.hostel ? '<button class="btn pri" id="newOut">' + UI.icon('plus') + 'Request outing</button>' : '') + '</div></div>' +
        (list.length ? '' : UI.empty('No outing requests yet', 'door', 'Day outings close at 8 PM; overnight outings need both approvals.')) +
        '<div class="grid g2">' + list.map(function (r) {
          return '<div class="card glow glow-' + (r.status === 'Approved' || r.status === 'Completed' ? 'g' : r.status === 'Rejected' ? 'r' : 'y') + ' accent-' + (r.status === 'Approved' || r.status === 'Completed' ? 'g' : r.status === 'Rejected' ? 'r' : 'y') + '">' +
            '<div class="spread"><div><b>' + UI.esc(r.place) + '</b><div style="font-size:12px;color:var(--text-2)">' + r.type + ' outing · ' + UI.esc(r.out) + ' → ' + UI.esc(r.in) + '</div></div>' +
            '<div style="text-align:right">' + UI.badge(r.status) + (r.adStatus ? '<div style="font-size:10.5px;color:var(--text-2);margin-top:4px">AD: ' + r.adStatus + '</div>' : '') + '</div></div>' +
            '<div class="mt8" style="font-size:12.5px;color:var(--text-2)">' + UI.esc(r.reason) + '</div>' +
            (r.deadline ? '<div class="tk-meta" style="margin:8px 0 0">' + UI.reqDeadlineChip(r.deadline) + '<span class="fhint">requested by you at submission</span></div>' : '') +
            '<div class="mt8">' + UI.timeline(r.timeline) + '</div></div>';
        }).join('') + '</div>';
      var nb = document.getElementById('newOut');
      var oex = document.getElementById('outExp');
      if (oex) oex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'OUTING REQUESTS STATEMENT'],
          ['Student', s.name + ' (' + s.reg + ')'],
          ['Class', s.classId],
          [],
          ['Type', 'Place', 'Out', 'In', 'Reason', 'Requested deadline', 'Status', 'AD stage']
        ];
        Q.outingsOf(s.id).forEach(function (r) { rows.push([r.type, r.place, r.out, r.in, r.reason, r.deadline || '—', r.status, r.adStatus || '—']); });
        UI.downloadCSV('OutingRequests-' + s.reg + '.csv', rows);
      });
      if (nb) nb.addEventListener('click', function () {
        UI.modal({ title: 'Request an outing', body:
          '<div class="fgrid">' +
          UI.field('ou-type', 'Type', UI.select('ou-type', [{ v: 'Day', l: 'Day outing (return by 8 PM)' }, { v: 'Night', l: 'Night outing (dual approval)' }])) +
          UI.field('ou-place', 'Place', '<input class="input" id="ou-place" placeholder="Where are you going?">', true) +
          UI.field('ou-out', 'Going out (date & time)', '<input class="input" id="ou-out" type="datetime-local" value="2026-09-05T09:00">', true) +
          UI.field('ou-in', 'Returning (date & time)', '<input class="input" id="ou-in" type="datetime-local" value="2026-09-05T18:00">', true) +
          '</div>' +
          UI.field('ou-reason', 'Reason', '<textarea class="input" id="ou-reason" placeholder="Parent acknowledgement helps faster approval"></textarea>', true) +
          UI.field('ou-deadline', 'Requested decision deadline (optional)', '<input class="input" id="ou-deadline" type="date" min="' + Q.today() + '">' +
            '<div class="fhint">If you select a requested deadline, mention the reason for it <b>clearly in the reason box above</b> — your warden and the Academic Director weigh it while deciding.</div>') +
          '<div class="fhint">Overnight requests are routed to your warden <b>and</b> the Academic Director. Gate entry is recorded against your room.</div>',
          actions: '<button class="btn pri" id="ou-go">' + UI.icon('send') + 'Submit request</button>' });
        document.getElementById('ou-go').addEventListener('click', function () {
          var f = { type: val('ou-type'), place: val('ou-place'), out: dtval('ou-out'), in: dtval('ou-in'), reason: val('ou-reason'), deadline: document.getElementById('ou-deadline').value || '' };
          if (!f.place || !f.reason) { UI.toast('Fill the required fields', '', 'red'); return; }
          if (f.deadline && f.reason.length < 25) { UI.toast('State the deadline reason', 'You requested a decision by ' + f.deadline + ' — mention why, clearly, in the reason box.', 'yellow'); return; }
          WF.submitOuting(s.id, f);
          UI.closeModal(); UI.toast('Outing requested', f.deadline ? 'Your warden has been notified — decision requested by ' + f.deadline + '.' : 'Your warden has been notified.', 'green');
          render();
        });
      });
    }
    function val(id) { return document.getElementById(id).value.trim(); }
    function dtval(id) { var v = document.getElementById(id).value; return v ? v.replace('T', ' ') : ''; }
    render();
  }
});
})();

/* ── student/placement ........................... ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'placement',
  render: function (view, ctx) {

    var s = ctx.person;
    function render() {
      var drives = DB.placementDrives;
      var myApps = DB.placementApps.filter(function (a) { return a.studentId === s.id; });
      var eligible = s.cgpa >= 7.5 && !s.arrears;
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Placement & Internships</h1><div class="sub">Pre-final and final year drives · ' + DB.placementStats.companies + ' partner companies (2025 batch)</div></div>' +
        '<div class="actions">' + (myApps.length ? UI.expBtn('plExp', 'Export applications') : '') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'briefcase', value: drives.filter(function (d) { return d.status === 'Open'; }).length, label: 'Open drives' }) +
        UI.stat({ tone: 'g', icon: 'check', value: myApps.length, label: 'My applications' }) +
        UI.stat({ tone: 'y', icon: 'cap', value: s.cgpa.toFixed(2), label: 'CGPA', sub: 'most drives need ≥ 7.5' }) +
        UI.stat({ tone: eligible ? 'g' : 'r', icon: 'shield', value: eligible ? 'Eligible' : 'Review', label: 'Eligibility', sub: s.arrears ? 'clear standing arrears' : 'criteria met' }) +
        '</div>' +
        '<div class="grid g2">' + drives.map(function (d) {
          var applied = myApps.filter(function (a) { return a.driveId === d.id; })[0];
          return '<div class="card glow glow-b accent-b"><div class="spread">' +
            '<div style="display:flex;gap:11px;align-items:center"><span style="width:44px;height:44px;border-radius:12px;background:var(--green-tint);color:var(--g-green);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px">' + UI.esc(d.company.slice(0, 2).toUpperCase()) + '</span>' +
            '<span><b>' + UI.esc(d.company) + '</b><div style="font-size:12px;color:var(--text-2)">' + UI.esc(d.role) + '</div></span></div>' +
            UI.badge(d.status === 'Open' ? 'Active' : 'Closed', d.status) + '</div>' +
            '<div class="mt8">' + UI.kv([['CTC', '<b>' + UI.esc(d.ctc) + '</b>'], ['Drive date', UI.fmtDate(d.date)], ['Register by', UI.fmtDate(d.regBy)], ['Location', UI.esc(d.location)], ['Eligibility', UI.esc(d.eligibility)]]) + '</div>' +
            '<div class="frow" style="justify-content:flex-start">' +
            (applied ? UI.badge(applied.status) + '<span style="font-size:12px;color:var(--text-2)">' + UI.esc(applied.rounds) + '</span>'
                     : '<button class="btn sm pri" data-apply="' + d.id + '">' + UI.icon('send') + 'Register</button>') +
            '</div></div>';
        }).join('') + '</div>' +
        '<div class="split-eq">' +
        UI.card('My applications', 'send', myApps.length ? UI.table([
          { h: 'Drive', render: function (r) { var d = DB.placementDrives.filter(function (x) { return x.id === r.driveId; })[0]; return '<b>' + UI.esc(d.company) + '</b><div style="font-size:11px;color:var(--text-2)">' + UI.esc(d.role) + '</div>'; } },
          { h: 'Applied', render: function (r) { return UI.fmtDate(r.at); } },
          { h: 'Status', render: function (r) { return UI.badge(r.status); } },
          { h: 'Rounds', render: function (r) { return UI.esc(r.rounds); } },
          { h: 'Offer', render: function (r) { return r.offer ? '<b style="color:var(--green-ink)">' + UI.esc(r.offer) + '</b>' : '—'; } }
        ], myApps) : UI.empty('You have not registered for any drive yet', 'briefcase')) +
        UI.card('Last year\u2019s outcome (2025 batch)', 'chart', UI.kv([
          ['Placement percentage', '<b style="font-size:19px;color:var(--green-ink)">' + DB.placementStats.percentage + '%</b>'],
          ['Placed / eligible', DB.placementStats.placed + ' of ' + DB.placementStats.eligible + ' graduates'],
          ['Highest package', '<b>' + DB.placementStats.highest + '</b>'],
          ['Average package', DB.placementStats.average],
          ['Top recruiters', UI.esc(DB.placementStats.top)]
        ])) + '</div>';
      var plex = document.getElementById('plExp');
      if (plex) plex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'PLACEMENT APPLICATIONS'],
          ['Student', s.name + ' (' + s.reg + ')'],
          [],
          ['Company', 'Role', 'CTC', 'Applied', 'Status', 'Rounds', 'Offer']
        ];
        DB.placementApps.filter(function (a) { return a.studentId === s.id; }).forEach(function (a) {
          var d = DB.placementDrives.filter(function (x) { return x.id === a.driveId; })[0] || {};
          rows.push([d.company || '', d.role || '', d.ctc || '', a.at, a.status, a.rounds || '', a.offer || '—']);
        });
        UI.downloadCSV('PlacementApplications-' + s.reg + '.csv', rows);
      });
      view.querySelectorAll('[data-apply]').forEach(function (b) { b.addEventListener('click', function () {
        var d = DB.placementDrives.filter(function (x) { return x.id === b.getAttribute('data-apply'); })[0];
        UI.modal({ title: 'Register — ' + d.company, body:
          UI.kv([['Role', UI.esc(d.role)], ['CTC', UI.esc(d.ctc)], ['Drive date', UI.fmtDate(d.date)], ['Eligibility', UI.esc(d.eligibility)]]) +
          UI.hint('Your profile (CGPA ' + s.cgpa.toFixed(2) + ', ' + (s.arrears ? s.arrears + ' arrear' : 'no arrears') + ') and resume are shared with the placement cell.', '', 'info'),
          actions: '<button class="btn ok" id="ap-go">' + UI.icon('check') + 'Confirm registration</button>' });
        document.getElementById('ap-go').addEventListener('click', function () {
          WF.applyDrive(d.id, s.id); UI.closeModal(); UI.toast('Registered', d.company + ' — watch for shortlist updates.', 'green'); render();
        });
      }); });
    }
    render();

  }
});
})();

/* ── student/profile ............................. ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'profile',
  render: function (view, ctx) {

    var s = ctx.person;
    var certs = DB.certificates.filter(function (c) { return c.studentId === s.id; });
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>My Profile</h1><div class="sub">Personal, academic and document records</div></div>' +
      '<div class="actions"><button class="btn pri" id="reqCert">' + UI.icon('file') + 'Request certificate</button></div></div>' +
      '<div class="split-eq">' +
      '<div>' +
        '<div class="card glow glow-b accent-b">' + UI.photoBox(s, 'Your photo appears across the portal — attendance rosters, hostel rolls and library desk.') + '</div>' +
        UI.card('Academic identity', 'cap', UI.kv([
          ['Register number', '<b class="mono">' + s.reg + '</b>'],
          ['Department', UI.esc(DB.departments.filter(function (d) { return d.id === s.dept; })[0].name)],
          ['Class / Section', s.classId],
          ['Current semester', 'V — Odd 2026\u201327'],
          ['Batch', s.batch],
          ['Class advisor', UI.avatar(Q.person(s.advisorId), 28) + ' ' + UI.esc(Q.name(s.advisorId))],
          ['CGPA', '<b>' + s.cgpa.toFixed(2) + '</b>'],
          ['Standing arrears', s.arrears ? UI.badge('Absent', s.arrears + ' paper') : UI.badge('Cleared', 'None')]
        ])) +
        (s.hostel ? UI.card('Hostel identity', 'bed', UI.kv([
          ['Resident', 'Hosteller'],
          ['Block', s.block === 'A' ? 'Block A — Boys' : 'Block B — Girls'],
          ['Room', '<b class="mono">' + s.roomId + '</b>'],
          ['Warden', UI.esc(Q.name(s.block === 'B' ? 'WG1' : 'WB1'))],
          ['Mess', 'Central mess · ' + (s.block === 'A' ? 'Block A dining' : 'Block B dining')]
        ])) : UI.card('Hostel identity', 'bed', UI.hint('Day scholar — not enrolled for hostel services.', '', 'info'))) +
      '</div>' +
      '<div>' +
        UI.card('Personal information', 'idcard', UI.kv([
          ['Full name', UI.esc(s.name)],
          ['Date of birth', UI.fmtDate(s.dob)],
          ['Gender', s.gender === 'F' ? 'Female' : 'Male'],
          ['Blood group', '<b>' + s.blood + '</b>'],
          ['Community', s.community],
          ['Religion', s.religion],
          ['Email', '<a href="#">' + UI.esc(s.email) + '</a>'],
          ['Mobile', UI.esc(s.phone)],
          ['Address', UI.esc(s.address)]
        ])) +
        UI.card('Parent / guardian', 'users', UI.kv([
          ['Name', UI.esc(s.parentName)],
          ['Contact', UI.esc(s.parentPhone)],
          ['Relation', 'Parent']
        ])) +
        UI.card('Documents & certificates', 'file',
          (certs.length ? UI.table([
            { h: 'Document', render: function (r) { return '<b>' + UI.esc(r.type) + '</b>'; } },
            { h: 'Ref', render: function (r) { return r.refNo ? '<span class="mono">' + r.refNo + '</span>' : '—'; } },
            { h: 'Status', render: function (r) { return UI.badge(r.status); } },
            { h: '', render: function (r) { return r.status === 'Issued' ? '<span class="dl" data-dlcert="' + r.id + '">' + UI.icon('download') + ' Download</span>' : ''; } }
          ], certs) : UI.empty('No certificates requested yet', 'file')) +
          '<div class="fhint" style="margin-top:8px">Bonafide, transcript and character certificates are issued by the office, usually within two working days.</div>') +
      '</div></div>';

    document.getElementById('reqCert').addEventListener('click', function () {
      UI.modal({ title: 'Request a certificate', body:
        UI.field('rc-type', 'Certificate', UI.select('rc-type', [
          { v: 'Bonafide Certificate', l: 'Bonafide certificate' }, { v: 'Transcript (Sem I–IV)', l: 'Transcript (Sem I–IV)' }, { v: 'Character Certificate', l: 'Character certificate' }]), true) +
        UI.field('rc-reason', 'Reason', '<textarea class="input" id="rc-reason" placeholder="e.g. Bank loan, passport, higher studies"></textarea>', true),
        actions: '<button class="btn pri" id="rc-go">' + UI.icon('send') + 'Submit request</button><button class="btn" onclick="UI.closeModal()">Cancel</button>' });
      document.getElementById('rc-go').addEventListener('click', function () {
        var t = document.getElementById('rc-type').value, r = document.getElementById('rc-reason').value.trim();
        if (!r) { UI.toast('Add a reason', 'The office needs the purpose to prepare the letter.', 'red'); return; }
        WF.requestCertificate(s.id, t, r);
        UI.closeModal(); UI.toast('Request submitted', 'You will be notified when it is issued.', 'green');
        App.boot({ role: 'student', folder: 'student', id: 'profile', render: function () {} });
        SPA.refresh();
      });
    });
    view.querySelectorAll('[data-dlcert]').forEach(function (el) {
      el.addEventListener('click', function () {
        var c = DB.certificates.filter(function (x) { return x.id === el.getAttribute('data-dlcert'); })[0];
        UI.downloadCSV('MDT-' + c.type.replace(/[^A-Za-z]+/g, '-') + '-' + s.reg + '.csv', [
          ['My Desktop Tech — CampusOne', ''],
          ['Institute', DB.settings.institute],
          ['City', DB.settings.city],
          ['Document', c.type.toUpperCase()],
          ['Ref No', c.refNo],
          ['Date', c.issuedAt],
          [],
          ['Certified student', s.name],
          ['Register no', s.reg],
          ['Department', DB.departments.filter(function (d) { return d.id === s.dept; })[0].name],
          ['Status', 'Bonafide student of this institution'],
          ['Purpose', c.reason],
          [],
          ['Issued by', 'Office of Academic Administration']
        ]);
      });
    });

  }
});
})();

/* ── student/quizzes ............................. ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'quizzes',
  render: function (view, ctx) {

    var s = ctx.person;
    function render() {
      var list = Q.quizzesOfStudent(s);
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Quizzes</h1><div class="sub">Course-wise quiz windows · attempt within the open window</div></div>' +
        '<div class="actions">' + (list.length ? UI.expBtn('qzExp', 'Export history') : '') + '</div></div>' +
        '<div class="grid g2">' + list.map(function (qz) {
          var att = (DB.quizAttempts[qz.id] || {})[s.id];
          var open = qz.status === 'Open';
          var pct = att ? Math.round(att.score / qz.max * 100) : 0;
          return '<div class="card glow ' + (att ? 'glow-g' : open ? 'glow-y' : 'glow-b') + ' accent-' + (att ? 'g' : open ? 'y' : 'b') + '">' +
            '<div class="spread"><div style="display:flex;gap:9px;align-items:center;min-width:0">' + UI.icon('target') +
            '<span style="min-width:0"><b class="mono" style="color:var(--blue-ink);font-size:12.5px">' + qz.courseId + '</b> <span style="font-size:12px;color:var(--text-2)">· ' + qz.title.split(' —')[0] + '</span></span></div>' +
            (att ? UI.badge('Graded') : open ? UI.badge('Open') : UI.badge('Scheduled')) + '</div>' +
            '<div class="mt8" style="font-size:12.5px;color:var(--text-2)">' + UI.icon('clock') + ' ' + UI.fmtDate(qz.opensAt) + ' – ' + UI.fmtDate(qz.closesAt) + ' · ' + qz.duration + ' min · max ' + qz.max + ' marks</div>' +
            (att ? '<div class="mt8"><div class="spread" style="margin-bottom:5px"><b class="num" style="font-size:15px">' + att.score + ' / ' + qz.max + '</b>' +
              '<span style="font-size:11px;color:var(--text-3)">attempted ' + UI.esc(att.at) + '</span></div>' +
              UI.bar(pct, pct >= 70 ? 'g' : 'y') + '</div>'
             : (open ? '<button class="btn sm pri mt8" data-quiz="' + qz.id + '">' + UI.icon('play') + 'Start quiz</button>' : '<div class="fhint mt8">Opens ' + UI.fmtDate(qz.opensAt) + '.</div>')) + '</div>';
        }).join('') + '</div>';
      var qex = document.getElementById('qzExp');
      if (qex) qex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'QUIZ HISTORY'],
          ['Student', s.name + ' (' + s.reg + ')'],
          [],
          ['Course', 'Quiz', 'Opens', 'Closes', 'Status', 'Score', 'Max', 'Attempted']
        ];
        Q.quizzesOfStudent(s).forEach(function (qz) {
          var att = (DB.quizAttempts[qz.id] || {})[s.id];
          rows.push([qz.courseId, qz.title, qz.opensAt, qz.closesAt, att ? 'Attempted' : qz.status, att ? att.score : '—', qz.max, att ? att.at : '—']);
        });
        UI.downloadCSV('QuizHistory-' + s.reg + '.csv', rows);
      });
      view.querySelectorAll('[data-quiz]').forEach(function (b) { b.addEventListener('click', function () {
        var qz = DB.quizzes.filter(function (x) { return x.id === b.getAttribute('data-quiz'); })[0];
        var body = '<div class="fhint" style="margin-bottom:10px">' + qz.duration + ' minutes · 3 questions · ' + qz.max + ' marks. Answer carefully — one attempt only.</div>';
        qz.qs.forEach(function (q, qi) {
          body += '<div class="card" style="box-shadow:none;border-style:dashed;margin:10px 0"><b>Q' + (qi + 1) + '. ' + UI.esc(q.q) + '</b><div class="mt8" style="display:grid;gap:7px">' +
            q.o.map(function (o, oi) { return '<label style="display:flex;gap:9px;align-items:center;font-size:13px;cursor:pointer"><input type="radio" name="qq' + qi + '" value="' + oi + '"> ' + UI.esc(o) + '</label>'; }).join('') + '</div></div>';
        });
        UI.modal({ title: qz.title + ' — ' + qz.courseId, body: body,
          actions: '<button class="btn pri" id="qz-go">' + UI.icon('send') + 'Submit answers</button>' });
        document.getElementById('qz-go').addEventListener('click', function () {
          var score = 0, unanswered = 0;
          qz.qs.forEach(function (q, qi) {
            var sel = document.querySelector('input[name="qq' + qi + '"]:checked');
            if (!sel) unanswered++;
            else if (+sel.value === q.a) score += Math.round(qz.max / 3);
          });
          if (unanswered) { UI.toast('Unanswered questions', unanswered + ' question(s) left blank.', 'yellow'); return; }
          WF.attemptQuiz(qz.id, s.id, score);
          UI.closeModal();
          UI.modal({ title: 'Quiz submitted', body: '<div style="text-align:center">' + UI.donut(Math.round(score / qz.max * 100), score / qz.max >= 0.7 ? 'green' : 'yellow', 96, 'score') +
            '<p style="margin-top:10px"><b style="font-size:17px">' + score + ' / ' + qz.max + '</b></p><p style="color:var(--text-2);font-size:12.5px">Your score is recorded and visible to your course faculty.</p></div>',
            actions: '<button class="btn pri" onclick="UI.closeModal()">Done</button>' });
          render();
        });
      }); });
    }
    render();

  }
});
})();

/* ── student/ranking ............................. ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'ranking',
  render: function (view, ctx) {

    var s = ctx.person;
    var list = Q.rankList(s.classId);
    var myIdx = list.map(function (x) { return x.id; }).indexOf(s.id);
    var pctile = Math.round((list.length - myIdx) / list.length * 100);
    var toppers = list.slice(0, 3);
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>Rankings</h1><div class="sub">' + s.classId + ' · internal assessment aggregate (Internal-1 + Quiz-1 across courses)</div></div>' +
      '<div class="actions">' + UI.expBtn('rkExp', 'Export CSV') + '</div></div>' +
      '<div class="statrow">' +
      UI.stat({ tone: 'y', icon: 'trophy', value: '#' + (myIdx + 1), label: 'My class rank', sub: 'of ' + list.length + ' students' }) +
      UI.stat({ tone: 'b', icon: 'trend', value: pctile + 'th', label: 'Percentile', sub: 'Top ' + (100 - pctile) + '% of the class' }) +
      UI.stat({ tone: 'g', icon: 'chart', value: Q.totalOf(s.id), label: 'My aggregate', sub: 'out of 180 (6 × 30)' }) +
      UI.stat({ tone: 'r', icon: 'users', value: Q.classAvgTotal(s.classId), label: 'Class average' }) +
      '</div>' +
      '<div class="split">' +
      '<div>' + UI.card('Class ranking — Semester V', 'trophy', UI.table([
        { h: '#', render: function (r, i) { return i < 3 ? UI.icon('medal') + ' <b>' + (i + 1) + '</b>' : '<b>' + (i + 1) + '</b>'; } },
        { h: 'Student', render: function (r) { return UI.avatar(r, 28) + ' ' + UI.esc(r.name) + '<div style="font-size:11px;color:var(--text-2)">' + r.reg + '</div>'; } },
        { h: 'Aggregate', render: function (r) { return '<b class="num">' + Q.totalOf(r.id) + '</b> / 180'; } },
        { h: 'CGPA', render: function (r) { return '<span class="num">' + r.cgpa.toFixed(2) + '</span>'; } },
        { h: 'Attendance', render: function (r) { return UI.bar(Q.attPctOverall(r.id), 'b2') + ' <span class="num">' + Q.attPctOverall(r.id) + '%</span>'; } }
      ], list.map(function (r, i) { r.__hl = r.id === s.id; return r; }), { rowAttr: function (r) { return r.__hl ? '' : ''; } })) + '</div>' +
      '<div>' + UI.card('Class toppers', 'star', toppers.map(function (t, i) {
        return '<div class="lrow" style="cursor:default"><span class="ic" style="color:' + ['#C79400', '#9AA0A6', '#C08457'][i] + '">' + UI.icon('trophy') + '</span>' + UI.avatar(t, 34) +
          '<span class="lmain"><b>' + UI.esc(t.name) + '</b><span>' + Q.totalOf(t.id) + ' / 180 · CGPA ' + t.cgpa.toFixed(2) + '</span></span><span class="ltime">#' + (i + 1) + '</span></div>';
      }).join('')) +
      UI.card('Semester-wise position', 'trend', '<div class="bars">' + s.semCgpa.map(function (v, i) {
        return '<div class="brow"><span class="bl">S' + (i + 1) + ' · ' + v.toFixed(2) + '</span>' + UI.bar(v * 10, v >= 8.5 ? 'g' : 'b') + '<span class="bn">' + (Math.round(v * 10)) + '</span></div>';
      }).join('') + '</div><div class="fhint">Ranks are provisional until the semester result is published by the Academic Director.</div>') +
      '</div></div>';
    document.getElementById('rkExp').addEventListener('click', function () {
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'CLASS RANKINGS'],
        ['Class', s.classId],
        ['Basis', 'Internal-1 + Quiz-1 aggregate (out of 180)'],
        [],
        ['Rank', 'Register No', 'Student', 'Aggregate', 'CGPA', 'Attendance %']
      ];
      Q.rankList(s.classId).forEach(function (r, i) {
        rows.push([i + 1, r.reg, r.name, Q.totalOf(r.id), r.cgpa.toFixed(2), Q.attPctOverall(r.id) + '%']);
      });
      UI.downloadCSV('ClassRankings-' + s.classId + '.csv', rows);
    });

  }
});
})();

/* ── student/scholarship ......................... ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'scholarship',
  render: function (view, ctx) {

    var s = ctx.person;
    function render() {
      var apps = DB.scholarshipApps.filter(function (a) { return a.studentId === s.id; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Scholarships</h1><div class="sub">Route: Office verification → Principal approval</div></div>' +
        '<div class="actions">' + (apps.length ? UI.expBtn('scExp', 'Export applications') : '') + '</div></div>' +
        '<div class="grid g2">' + DB.scholarshipSchemes.map(function (sc) {
          var mine = apps.filter(function (a) { return a.schemeId === sc.id; })[0];
          return '<div class="card glow glow-y accent-y"><div class="spread"><div><b>' + UI.esc(sc.name) + '</b>' +
            '<div style="font-size:12px;color:var(--text-2)">' + sc.by + ' · ' + UI.esc(sc.criteria) + '</div></div>' +
            '<span class="sicon ty" style="width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:var(--yellow-tint);color:#C79400">' + UI.icon('medal') + '</span></div>' +
            '<div class="spread mt8"><b style="font-size:17px">' + UI.money(sc.amount) + '</b>' +
            (mine ? UI.badge(mine.status) : '<button class="btn sm pri" data-sc="' + sc.id + '">Apply</button>') + '</div></div>';
        }).join('') + '</div>' +
        (apps.length ? UI.card('My applications', 'file', '<div class="grid g2">' + apps.map(function (a) {
          return '<div><div class="spread"><b>' + UI.esc(Q.schemeName(a.schemeId)) + '</b>' + UI.badge(a.status) + '</div>' +
            '<div class="mt8" style="font-size:12px;color:var(--text-2)">Applied ' + UI.fmtDate(a.appliedAt) + ' · docs: ' + a.docs.join(', ') + '</div>' +
            UI.timeline(a.timeline) + '</div>';
        }).join('') + '</div>') : '') +
        UI.hint('Scholarship verification drives run monthly — keep bonafide, marksheet and community/income certificates ready in the document locker.', '', 'info');
      var scex = document.getElementById('scExp');
      if (scex) scex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'SCHOLARSHIP APPLICATIONS'],
          ['Student', s.name + ' (' + s.reg + ')'],
          [],
          ['Scheme', 'Award (Rs)', 'Applied', 'Status', 'Documents']
        ];
        DB.scholarshipApps.filter(function (a) { return a.studentId === s.id; }).forEach(function (a) {
          var sc = DB.scholarshipSchemes.filter(function (x) { return x.id === a.schemeId; })[0] || {};
          rows.push([Q.schemeName(a.schemeId), sc.amount || '', a.appliedAt, a.status, (a.docs || []).join(' | ')]);
        });
        UI.downloadCSV('ScholarshipApplications-' + s.reg + '.csv', rows);
      });
      view.querySelectorAll('[data-sc]').forEach(function (b) { b.addEventListener('click', function () {
        var sc = DB.scholarshipSchemes.filter(function (x) { return x.id === b.getAttribute('data-sc'); })[0];
        UI.modal({ title: 'Apply — ' + sc.name, body:
          UI.kv([['Award', UI.money(sc.amount)], ['Criteria', UI.esc(sc.criteria)]]) +
          '<div class="mt16">' + UI.field('sc-docs', 'Documents', '<input type="file" class="input" id="sc-docs" multiple style="text-align:left">') + '</div>' +
          UI.hint('Typical set: bonafide, latest marksheet, community/income certificate as applicable.', '', 'info'),
          actions: '<button class="btn pri" id="sc-go">' + UI.icon('send') + 'Submit application</button>' });
        document.getElementById('sc-go').addEventListener('click', function () {
          var files = document.getElementById('sc-docs').files;
          var docs = []; for (var i = 0; i < files.length; i++) docs.push(files[i].name);
          WF.applyScholarship(s.id, sc.id, docs);
          UI.closeModal(); UI.toast('Application submitted', 'The office will verify your documents.', 'green'); render();
        });
      }); });
    }
    render();

  }
});
})();

/* ── student/survey .............................. ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'survey',
  render: function (view, ctx) {

    var me = ctx.person;
    var state = { sv: '' };
    function render() {
      var open = DB.surveys.filter(function (s) { return (s.status === 'Ongoing') && s.assigned > 0; });
      var upcoming = DB.surveys.filter(function (s) { return s.status === 'Upcoming'; });
      var myResp = function (svId) { return (DB.surveyResponses[svId] || {})[me.id]; };
      var sv = state.sv ? DB.surveys.filter(function (x) { return x.id === state.sv; })[0] : open[0];
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Feedback Surveys</h1><div class="sub">Course, facility and exit surveys assigned to you — anonymous to faculty, decisive for quality</div></div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'g', icon: 'list', value: open.length, label: 'Open for you' }) +
        UI.stat({ tone: 'y', icon: 'clock', value: open.filter(function (s) { return !myResp(s.id); }).length, label: 'Pending your response' }) +
        UI.stat({ tone: 'b', icon: 'checkc', value: open.filter(function (s) { return myResp(s.id); }).length, label: 'Submitted' }) +
        UI.stat({ tone: 'r', icon: 'calendar', value: upcoming.length, label: 'Upcoming cycles' }) +
        '</div>' +
        (open.length ?
        '<div class="rowflex mb16" style="gap:8px;flex-wrap:wrap">' + open.map(function (s) {
          return '<span class="chip' + (sv && sv.id === s.id ? ' on' : '') + '" data-sv="' + s.id + '">' + UI.esc(s.title.split('—')[0].trim()) + (myResp(s.id) ? ' ✓' : '') + '</span>';
        }).join('') + '</div>' : UI.empty('No surveys open for you right now', 'checkc')) +
        (sv ? UI.card(sv.title, 'list',
          UI.kv([['Type', sv.type], ['Questions', sv.questions.length], ['Window', UI.fmtDate(sv.from) + ' → ' + UI.fmtDate(sv.to)], ['Your response', myResp(sv.id) ? '<span class="tag g">submitted</span>' : UI.badge('Pending')]]) +
          (myResp(sv.id) ?
            UI.table([
              { h: 'Question', render: function (q, i) { return UI.esc(q); } },
              { h: 'Your rating', render: function (q, i) { return UI.starsRO(myResp(sv.id)[i + 1]); } }
            ], sv.questions) :
            '<div class="mt8">' + sv.questions.map(function (q, i) {
              return '<div class="fld"><label class="req">' + (i + 1) + '. ' + UI.esc(q) + '</label>' +
                '<div class="rowflex" style="gap:6px">' + [1, 2, 3, 4, 5].map(function (v) {
                  return '<button type="button" class="chip" data-q="' + (i + 1) + '" data-v="' + v + '">' + v + '</button>';
                }).join('') + '</div><div class="fhint">1 — poor · 5 — excellent</div></div>';
            }).join('') + '<div class="frow" style="justify-content:flex-start"><button class="btn pri" id="sv-go">' + UI.icon('check') + 'Submit response</button></div>') +
          UI.hint('Responses are consolidated by the quality cell with class averages — individual ratings stay anonymous in every report.', '', 'info')) : '') +
        (upcoming.length ? UI.card('Upcoming cycles', 'calendar', UI.table([
          { h: 'Survey', render: function (s) { return UI.esc(s.title); } },
          { h: 'Opens', render: function (s) { return UI.fmtDate(s.from); } },
          { h: 'Closes', render: function (s) { return UI.fmtDate(s.to); } }
        ], upcoming)) : '');
      view.querySelectorAll('[data-sv]').forEach(function (c) { c.addEventListener('click', function () { state.sv = c.getAttribute('data-sv'); render(); }); });
      var picked = {};
      view.querySelectorAll('[data-q]').forEach(function (b) { b.addEventListener('click', function () {
        picked[b.getAttribute('data-q')] = +b.getAttribute('data-v');
        b.parentNode.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('on'); });
        b.classList.add('on');
      }); });
      var go = document.getElementById('sv-go');
      if (go) go.addEventListener('click', function () {
        var nq = sv.questions.length;
        for (var i = 1; i <= nq; i++) if (!picked[i]) { UI.toast('Rate every question', 'Question ' + i + ' is still unrated.', 'red'); return; }
        WF.submitSurveyResponse(me.id, sv.id, picked);
        UI.toast('Response submitted', 'Thank you — the quality cell counts it instantly.', 'green'); render();
      });
    }
    render();

  }
});
})();

/* ── student/tickets ............................. ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'tickets',
  render: function (view, ctx) {

    var s = ctx.person;
    var filter = 'All', query = '';
    function tkEta(t) { return t.eta || UI.addDays(String(t.at).slice(0, 10), UI.SLA[t.priority] || 4); }
    function render() {
      var mine = DB.tickets.filter(function (t) { return t.by === ctx.user.id; });
      var counts = { All: mine.length, Open: 0, 'In Progress': 0, Resolved: 0, Closed: 0 };
      mine.forEach(function (t) { if (counts[t.status] != null) counts[t.status]++; });
      var shown = mine.filter(function (t) {
        return (filter === 'All' || t.status === filter) &&
          (!query || (t.no + ' ' + t.title + ' ' + t.category + ' ' + t.desc).toLowerCase().indexOf(query) >= 0);
      });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Help Tickets</h1><div class="sub">IT & access, library, hostel, fees, examinations and general requests</div></div>' +
        '<div class="actions">' + UI.expBtn('tkExp', 'Export CSV') + '<button class="btn pri" id="newTk">' + UI.icon('plus') + 'New ticket</button></div></div>' +
        '<div class="chiprow">' + UI.chiprow([
          { v: 'All', l: 'All', c: counts.All }, { v: 'Open', l: 'Open', c: counts.Open },
          { v: 'In Progress', l: 'In progress', c: counts['In Progress'] },
          { v: 'Resolved', l: 'Resolved', c: counts.Resolved }, { v: 'Closed', l: 'Closed', c: counts.Closed }
        ], filter) + '<span class="sp"></span>' + UI.srch('tkQ', 'Search tickets…') + '</div>' +
        (shown.length ? UI.card('My tickets', 'ticket', shown.map(function (t) {
          return '<div class="lrow" data-tk="' + t.id + '"><span class="ic" style="color:var(--g-blue)">' + UI.icon('ticket') + '</span>' +
            '<span class="lmain"><b>' + t.no + ' — ' + UI.esc(t.title) + '</b><span>' + t.category + ' · opened ' + UI.esc(t.at) +
            (t.thread.length ? ' · ' + t.thread.length + ' replies' : '') + (t.files && t.files.length ? ' · ' + t.files.length + ' attachment' + (t.files.length > 1 ? 's' : '') : '') + '</span>' +
            '<span class="tk-meta" style="margin:4px 0 0">' + UI.etaChip(tkEta(t), t.status === 'Resolved' || t.status === 'Closed') + '</span></span>' +
            '<span style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:flex-end">' + UI.pbadge(t.priority) + UI.badge(t.status) + '</span></div>';
        }).join('')) : UI.empty('No tickets in this view', 'ticket', 'Any portal or campus issue — raise it here and track it to resolution.')) +
        '<div class="split">' +
        UI.card('How tracking works', 'info', UI.kv([
          ['Opened', 'You get a ticket number and a confirmation'],
          ['Assigned', 'The service desk hands it to a handler'],
          ['In progress', 'Work starts — every step is time-stamped'],
          ['Resolved', 'You verify, rate the service and close']
        ])) +
        UI.card('Service levels', 'clock', UI.kv([
          ['Critical', 'Expected within 4 working hours'],
          ['High', 'Expected within 2 working days'],
          ['Medium', 'Expected within 4 working days'],
          ['Low', 'Expected within a week']
        ]) + UI.hint('Each ticket carries an expected resolution date — you are notified the moment it changes.', '', 'info')) +
        '</div>';
      view.querySelectorAll('[data-f]').forEach(function (c) { c.addEventListener('click', function () {
        filter = c.getAttribute('data-f'); render();
      }); });
      var q = document.getElementById('tkQ');
      if (q) q.addEventListener('input', function () { query = q.value.trim().toLowerCase(); render();
        var q2 = document.getElementById('tkQ'); if (q2) { q2.focus(); q2.setSelectionRange(q2.value.length, q2.value.length); } });
      document.getElementById('tkExp').addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'HELP TICKETS STATEMENT'],
          ['Student', s.name + ' (' + s.reg + ')'],
          ['Class', s.classId],
          ['Generated', Q.today()],
          [],
          ['Ticket', 'Title', 'Category', 'Priority', 'Status', 'Opened', 'Expected resolution', 'Attachments', 'Replies']
        ];
        mine.forEach(function (t) {
          rows.push([t.no, t.title, t.category, t.priority, t.status, t.at, tkEta(t), (t.files || []).length, (t.thread || []).length]);
        });
        UI.downloadCSV('HelpTickets-' + s.reg + '.csv', rows);
      });
      document.getElementById('newTk').addEventListener('click', function () {
        var files = [];
        UI.modal({ title: 'New help ticket', body:
          '<div class="fgrid">' +
          UI.field('tk-cat', 'Category', UI.select('tk-cat', ['IT & Access', 'Library', 'Hostel', 'Fees', 'Examination', 'Other']), true) +
          UI.field('tk-pri', 'Priority', UI.select('tk-pri', ['Low', 'Medium', 'High', 'Critical'], 'Medium'), true) +
          '</div>' +
          UI.field('tk-title', 'Title', '<input class="input" id="tk-title" placeholder="One-line summary">', true) +
          UI.field('tk-desc', 'Describe the issue', '<textarea class="input" id="tk-desc"></textarea>', true) +
          '<div class="mt16">' + UI.field('tk-files', 'Attachments', UI.fileDrop('tk-files', 'Screenshots help the desk diagnose faster')) + '</div>' +
          '<div class="hint-card mt16" id="tk-sla">' + UI.icon('clock') + '<div>Expected resolution: <b id="tk-eta-prev">' + UI.fmtDate(UI.addDays(Q.today(), UI.SLA.Medium)) + '</b> · ' + UI.slaLabel('Medium') + '</div></div>',
          actions: '<button class="btn pri" id="tk-go">' + UI.icon('send') + 'Submit ticket</button>' });
        UI.bindFileDrop('tk-files', files, 3, 2);
        document.getElementById('tk-pri').addEventListener('change', function () {
          var p = this.value;
          document.getElementById('tk-eta-prev').textContent = UI.fmtDate(UI.addDays(Q.today(), UI.SLA[p] || 4));
          document.getElementById('tk-sla').lastElementChild.innerHTML = 'Expected resolution: <b id="tk-eta-prev">' + UI.fmtDate(UI.addDays(Q.today(), UI.SLA[p] || 4)) + '</b> · ' + UI.slaLabel(p);
        });
        document.getElementById('tk-go').addEventListener('click', function () {
          var f = { category: val('tk-cat'), priority: val('tk-pri'), title: val('tk-title'), desc: val('tk-desc'), files: files };
          if (!f.title || !f.desc) { UI.toast('Fill the required fields', '', 'red'); return; }
          var t = WF.createTicket(ctx.user.id, f, s);
          UI.closeModal(); UI.toast('Ticket ' + t.no + ' raised', 'Expected resolution ' + UI.fmtDate(t.eta) + '. The service desk has been notified.', 'green'); render();
        });
      });
      view.querySelectorAll('[data-tk]').forEach(function (el) { el.addEventListener('click', function () {
        var t = DB.tickets.filter(function (x) { return x.id === el.getAttribute('data-tk'); })[0];
        openDetail(t);
      }); });
    }
    function openDetail(t) {
      var resolved = t.status === 'Resolved' || t.status === 'Closed';
      var handler = t.assignee ? (Q.user(t.assignee) ? Q.name(Q.user(t.assignee).personId) : 'Service desk') : 'Not yet assigned';
      var body = UI.kv([['Ticket', t.no], ['Category', t.category], ['Priority', UI.pbadge(t.priority)], ['Status', UI.badge(t.status)], ['Opened', UI.esc(t.at)], ['Handled by', UI.esc(handler)]]) +
        '<div class="tk-meta">' + UI.etaChip(tkEta(t), resolved) + '</div>' +
        '<p>' + UI.esc(t.desc) + '</p>' +
        (t.files && t.files.length ? '<div class="fld"><label>Attachments</label>' + UI.attachChips(t.files) + '</div>' : '') +
        '<div class="divider"></div>' +
        '<div class="fld"><label>Tracking</label>' + UI.timeline(t.timeline || []) + '</div>' +
        '<div class="divider"></div>' +
        '<div class="fld"><label>Conversation</label>' +
        (t.thread.length ? t.thread.map(function (m) {
          var isMe = m.by === ctx.user.id;
          return '<div class="lrow" style="cursor:default"><span class="ic" style="color:' + (isMe ? 'var(--g-blue)' : 'var(--g-green)') + '">' + UI.icon(isMe ? 'user' : 'wrench') + '</span>' +
            '<span class="lmain"><b>' + (isMe ? 'You' : 'Service desk') + '</b><span>' + UI.esc(m.text) + '</span></span><span class="ltime">' + UI.esc(m.at) + '</span></div>';
        }).join('') : UI.empty('No replies yet', 'message')) + '</div>';
      var actions = '';
      if (t.status !== 'Resolved' && t.status !== 'Closed') {
        actions = '<button class="btn pri" id="tk-rep">' + UI.icon('send') + 'Send reply</button><button class="btn" onclick="UI.closeModal()">Close</button>';
        body += '<div class="fld mt16"><label>Reply</label><textarea class="input" id="tk-reply"></textarea></div>';
      } else if (t.status === 'Resolved') {
        body += '<div class="rating-wrap mt16">' +
          '<span class="rt">' + UI.icon('star') + 'Rate this resolution</span>' +
          (t.rating ? UI.starsRO(t.rating.stars) + '<span style="font-size:12.5px;color:var(--text-2)">' + UI.esc(t.rating.remark || '') + '</span>' :
            UI.stars(0) + '<input class="input mt8" id="tk-remark" placeholder="Optional remark">') + '</div>';
        actions = '<button class="btn ok" id="tk-confirm">' + UI.icon('check') + 'Confirm & close</button><button class="btn ghost-r" id="tk-reopen">' + UI.icon('refresh') + 'Reopen</button>';
      } else {
        body += '<div class="rating-wrap mt16"><span class="rt">' + UI.icon('checkc') + 'Closed ticket</span>' +
          (t.rating ? UI.starsRO(t.rating.stars) + '<span style="font-size:12.5px;color:var(--text-2)">' + UI.esc(t.rating.remark || '') + '</span>' : '') + '</div>';
        actions = '<button class="btn pri" onclick="UI.closeModal()">Done</button>';
      }
      UI.modal({ title: t.no + ' — ' + t.title, body: body, lg: true, actions: actions });
      UI.bindAttach(document.getElementById('ui-mask'), t.files || []);
      var rep = document.getElementById('tk-rep');
      if (rep) rep.addEventListener('click', function () {
        var txt = document.getElementById('tk-reply').value.trim();
        if (!txt) { UI.toast('Write a reply first', '', 'red'); return; }
        WF.replyTicket(t.id, ctx.user.id, txt);
        UI.closeModal(); UI.toast('Reply sent', 'The service desk has been notified.', 'green'); render();
      });
      var stars = document.querySelectorAll('#ui-mask [data-star]');
      if (stars.length) stars.forEach(function (b) { b.addEventListener('click', function () {
        var n = +b.getAttribute('data-star');
        stars.forEach(function (x) { x.firstChild.setAttribute('class', +x.getAttribute('data-star') <= n ? 'on' : ''); });
        var rm = document.getElementById('tk-remark');
        WF.rateTicket(t.id, ctx.user.id, n, rm ? rm.value.trim() : '');
        UI.toast('Thanks for the feedback', n + '/5 recorded for ' + t.no + '.', 'green');
        setTimeout(function () { var again = DB.tickets.filter(function (x) { return x.id === t.id; })[0]; if (again) openDetail(again); }, 250);
      }); });
      var conf = document.getElementById('tk-confirm');
      if (conf) conf.addEventListener('click', function () {
        WF.closeTicket(t.id, ctx.user.id);
        UI.closeModal(); UI.toast('Ticket closed', t.no + ' — resolution confirmed.', 'green'); render();
      });
      var reop = document.getElementById('tk-reopen');
      if (reop) reop.addEventListener('click', function () {
        WF.reopenTicket(t.id, ctx.user.id, 'Issue not fully resolved — reopening');
        UI.closeModal(); UI.toast('Ticket reopened', 'The service desk will follow up.', 'yellow'); render();
      });
    }
    function val(id) { return document.getElementById(id).value.trim(); }
    render();

  }
});
})();

/* ── student/timetable ........................... ── */
(function () {
MDTPAGE({
  role: 'student',
  folder: 'student',
  id: 'timetable',
  render: function (view, ctx) {

    var s = ctx.person;
    var rs = (DB.reschedules || []).filter(function (r) { return r.classId === s.classId && r.status === 'Approved'; });
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>Class Schedule</h1><div class="sub">' + s.classId + ' · Semester V · Monday–Friday, 8 periods (lunch at P5)</div></div>' +
      '<div class="actions">' + UI.expBtn('ttExp', 'Export CSV') + '<button class="btn ghost" id="printTT">' + UI.icon('printer') + 'Print</button></div></div>' +
      (rs.length ? UI.hint('Approved schedule change: <b>' + UI.esc(rs[0].from) + ' → ' + UI.esc(rs[0].to) + '</b> for ' + rs[0].courseId + ' — ' + UI.esc(rs[0].reason) + '.', 'warn', 'alert') : '') +
      UI.card('Weekly timetable', 'calendar', UI.timetable(s.classId, 4) +
        '<div class="legend"><span><i style="background:var(--blue-tint2)"></i>Theory</span><span><i style="background:var(--yellow-tint2)"></i>Lab (P6)</span><span><i style="background:var(--surface-3)"></i>Lunch</span><span style="color:var(--g-blue)">▣ today\u2019s column</span></div>') +
      '<div class="grid g3">' +
      Q.allocationsOf(s.classId).slice(0, 3).map(function (al) {
        var c = Q.courseById(al.courseId);
        var plan = Q.coursePlan(s.classId, al.courseId);
        var done = plan.filter(function (p) { return p.status === 'Completed'; }).length;
        return '<div class="card glow glow-b"><div class="spread"><b class="mono" style="color:var(--blue-ink)">' + c.id + '</b>' + UI.badge('Active', 'Ongoing') + '</div>' +
          '<div style="font-size:13.5px;margin:6px 0 2px"><b>' + UI.esc(c.title) + '</b></div>' +
          '<div style="font-size:12px;color:var(--text-2)">' + UI.esc(Q.name(al.teacherId)) + ' · ' + c.credits + ' credits</div>' +
          '<div class="mt8">' + UI.bar(Math.round(done / 5 * 100), 'b2') + '</div>' +
          '<div style="font-size:11.5px;color:var(--text-2);margin-top:4px">Syllabus progress: ' + done + ' of 5 units</div></div>';
      }).join('') + '</div>';
    document.getElementById('printTT').addEventListener('click', function () { window.print(); });
    document.getElementById('ttExp').addEventListener('click', function () {
      var slots = Q.timetableOf(s.classId);
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'CLASS SCHEDULE'],
        ['Class', s.classId],
        ['Semester', 'V — ' + DB.settings.academicYear],
        [],
        ['Day', 'Period', 'Course', 'Title', 'Faculty', 'Room', 'Type']
      ];
      UI.DAYN.forEach(function (d, di) {
        slots.filter(function (t) { return t.day === di; }).sort(function (a, b) { return a.period - b.period; }).forEach(function (t) {
          if (t.break) { rows.push([d, t.period, 'LUNCH', '', '', '', 'Break']); return; }
          var c = Q.courseById(t.courseId);
          rows.push([d, 'P' + t.period, t.courseId, c ? c.title : '', Q.name(t.teacherId), t.room, t.lab ? 'Lab' : 'Theory']);
        });
      });
      UI.downloadCSV('ClassSchedule-' + s.classId + '.csv', rows);
    });

  }
});
})();

/* ── teacher/advisor-class ....................... ── */
(function () {
MDTPAGE({
  role: 'teacher',
  folder: 'teacher',
  id: 'advisor-class',
  render: function (view, ctx) {

    var t = ctx.person;
    if (!t.advisorClass) { view.innerHTML = UI.empty('You are not a class advisor', 'users'); return; }
    var cid = t.advisorClass;
    var students = Q.studentsOf(cid);
    var atRisk = Q.atRisk(cid);
    var avg = Q.classAttAvg(cid);
    var rank = Q.rankList(cid);
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>Class Overview — ' + cid + '</h1><div class="sub">' + students.length + ' students · ' + UI.esc(Q.classById(cid).batch) + ' · room ' + Q.classById(cid).room + '</div></div>' +
      '<div class="actions">' + UI.expBtn('acExp', 'Export overview') + '<a class="btn ghost" href="students.html">' + UI.icon('users') + 'Full student list</a></div></div>' +
      '<div class="statrow">' +
      UI.stat({ tone: 'g', icon: 'checkc', value: avg + '%', label: 'Class attendance average' }) +
      UI.stat({ tone: 'y', icon: 'chart', value: Q.classAvgTotal(cid), label: 'Assessment average', sub: 'out of 180' }) +
      UI.stat({ tone: 'r', icon: 'alert', value: atRisk.length, label: 'Below 75% attendance', sub: 'needs follow-up' }) +
      UI.stat({ tone: 'b', icon: 'bed', value: students.filter(function (s) { return s.hostel; }).length, label: 'Hostellers' }) +
      '</div>' +
      '<div class="split">' +
      '<div>' + UI.card('Attendance watchlist', 'alert',
        (atRisk.length ? UI.table([
          { h: 'Student', render: function (r) { return UI.avatar(r, 28) + ' <b>' + UI.esc(r.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + r.reg + '</div>'; } },
          { h: 'Attendance', render: function (r) { var p = Q.attPctOverall(r.id); return UI.bar(p, 'r') + ' <b class="num" style="color:var(--red-ink)">' + p + '%</b>'; } },
          { h: 'Deficit', render: function (r) { return '<span class="num">-' + (75 - Q.attPctOverall(r.id)) + '%</span>'; } },
          { h: 'Hosteller', render: function (r) { return r.hostel ? '<span class="tag b">' + r.roomId + '</span>' : '<span class="tag n">day</span>'; } }
        ], atRisk) : UI.empty('Every student is above the threshold', 'checkc'))) +
        UI.card('Course-wise class average', 'chart', UI.barsChart(Q.allocationsOf(cid).map(function (al) {
          var sum = 0; students.forEach(function (s) { sum += Q.attPct(s.id, al.courseId); });
          var v = Math.round(sum / students.length);
          return { l: al.courseId, v: v, n: v + '%', tone: v >= 80 ? 'g' : 'y' };
        }))) + '</div>' +
      '<div>' + UI.card('Top performers', 'trophy', rank.slice(0, 5).map(function (s, i) {
        return '<div class="lrow" style="cursor:default"><span class="lmain"><b>' + (i + 1) + '. ' + UI.esc(s.name) + '</b><span>' + Q.totalOf(s.id) + ' / 180 · CGPA ' + s.cgpa.toFixed(2) + '</span></span>' + UI.avatar(s, 30) + '</div>';
      }).join('')) +
      UI.card('Class composition', 'users', UI.barsChart([
        { l: 'Boys', v: students.filter(function (s) { return s.gender === 'M'; }).length / students.length * 100, n: students.filter(function (s) { return s.gender === 'M'; }).length, tone: 'b' },
        { l: 'Girls', v: students.filter(function (s) { return s.gender === 'F'; }).length / students.length * 100, n: students.filter(function (s) { return s.gender === 'F'; }).length, tone: 'r' },
        { l: 'Hostellers', v: students.filter(function (s) { return s.hostel; }).length / students.length * 100, n: students.filter(function (s) { return s.hostel; }).length, tone: 'g' },
        { l: 'Arrears', v: students.filter(function (s) { return s.arrears; }).length / students.length * 100, n: students.filter(function (s) { return s.arrears; }).length, tone: 'y' }
      ])) +
      UI.card('My advisor actions', 'grid', '<div class="quickgrid">' +
        '<a class="bigbtn-tile" href="advisor-requests.html">' + UI.icon('door') + '<b>OD & leave</b><span>recommend</span></a>' +
        '<a class="bigbtn-tile" href="mentor.html">' + UI.icon('users') + '<b>Mentor desk</b><span>12 mentees</span></a>' +
        '<a class="bigbtn-tile" href="attendance.html">' + UI.icon('checkc') + '<b>Mark class</b><span>register</span></a>' +
        '</div>') + '</div></div>';

  }
});
})();

/* ── teacher/advisor-requests .................... ── */
(function () {
MDTPAGE({
  role: 'teacher',
  folder: 'teacher',
  id: 'advisor-requests',
  render: function (view, ctx) {

    var t = ctx.person;
    if (!t.advisorClass) { view.innerHTML = UI.empty('You are not a class advisor', 'users'); return; }
    var myClass = t.advisorClass;
    function render() {
      var ods = DB.odRequests.filter(function (r) { var s = Q.studentById(r.studentId); return s && s.classId === myClass && (r.status === 'Submitted' || r.status === 'Recommended' || r.status === 'Returned'); });
      var lvs = DB.leaveRequests.filter(function (r) { var s = Q.studentById(r.studentId); return s && s.classId === myClass && r.status !== 'Approved' && r.status !== 'Rejected'; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>OD & Leave Review</h1><div class="sub">Class advisor — ' + myClass + ' · your recommendation routes each request to the Academic Director</div></div>' +
        '<div class="actions">' + ((ods.length + lvs.length) ? UI.expBtn('arExp', 'Export queue') : '') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'y', icon: 'door', value: ods.filter(function (r) { return r.status === 'Submitted'; }).length, label: 'OD awaiting recommendation' }) +
        UI.stat({ tone: 'b', icon: 'key', value: lvs.filter(function (r) { return r.status === 'Submitted'; }).length, label: 'Leave awaiting recommendation' }) +
        UI.stat({ tone: 'g', icon: 'check', value: DB.odRequests.filter(function (r) { var s = Q.studentById(r.studentId); return s && s.classId === myClass && r.status === 'Recommended'; }).length, label: 'Recommended to Director' }) +
        '</div>' +
        UI.card('On Duty requests — ' + myClass, 'door',
          (ods.length ? '<div class="grid g2">' + ods.map(function (r) {
            var s = Q.studentById(r.studentId);
            return '<div class="card" style="box-shadow:none;border-style:dashed;margin:0"><div class="spread">' +
              '<div style="display:flex;gap:10px;align-items:center">' + UI.avatar(s, 38) + '<span><b>' + UI.esc(s.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + s.reg + (s.hostel ? ' · ' + s.roomId : '') + '</div></span></div>' +
              UI.badge(r.status) + '</div>' +
              '<div class="mt8"><b style="font-size:13.5px">' + UI.esc(r.event) + '</b><div style="font-size:12px;color:var(--text-2)">' + UI.esc(r.venue) + ' · ' + UI.fmtDate(r.date) + ' · ' + r.session + (r.hosteller ? ' · hosteller' : '') + '</div></div>' +
              '<div class="mt8" style="font-size:12.5px;color:var(--text-2)">' + UI.esc(r.reason) + '</div>' +
              (r.proof && r.proof !== '—' ? '<div class="mt8"><span class="tag n">proof: ' + UI.esc(r.proof) + '</span></div>' : '<div class="mt8">' + UI.hint('No proof attached.', 'warn', 'alert') + '</div>') +
              (r.status === 'Submitted' ? '<div class="frow" style="justify-content:flex-start">' +
                '<button class="btn sm ok" data-rec="' + r.id + '">' + UI.icon('check') + 'Recommend</button>' +
                '<button class="btn sm ghost-r" data-ret="' + r.id + '">' + UI.icon('x') + 'Return</button></div>' : '') + '</div>';
          }).join('') + '</div>' : UI.empty('No pending OD requests', 'checkc'))) +
        UI.card('Leave requests — ' + myClass, 'key',
          (lvs.length ? '<div class="grid g2">' + lvs.map(function (r) {
            var s = Q.studentById(r.studentId);
            return '<div class="card" style="box-shadow:none;border-style:dashed;margin:0"><div class="spread">' +
              '<div style="display:flex;gap:10px;align-items:center">' + UI.avatar(s, 38) + '<span><b>' + UI.esc(s.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + s.reg + ' · ' + Q.attPctOverall(s.id) + '% att.</div></span></div>' +
              UI.badge(r.status) + '</div>' +
              '<div class="mt8"><b>' + UI.esc(r.type) + ' · ' + r.days + ' day(s)</b><div style="font-size:12px;color:var(--text-2)">' + UI.fmtDate(r.from) + ' → ' + UI.fmtDate(r.to) + (r.principalId ? ' · Principal countersign required' : '') + '</div></div>' +
              '<div class="mt8" style="font-size:12.5px;color:var(--text-2)">' + UI.esc(r.reason) + '</div>' +
              (r.status === 'Submitted' ? '<div class="frow" style="justify-content:flex-start">' +
                '<button class="btn sm ok" data-lrec="' + r.id + '">' + UI.icon('check') + 'Recommend</button>' +
                '<button class="btn sm ghost-r" data-lret="' + r.id + '">' + UI.icon('x') + 'Return</button></div>' : '') + '</div>';
          }).join('') + '</div>' : UI.empty('No pending leave requests', 'checkc'))) +
        UI.hint('Recommended requests move to the Academic Director\u2019s queue. Leave beyond ' + DB.settings.wf.longLeaveDays + ' days additionally needs the Principal\u2019s countersignature.', '', 'info');
      view.querySelectorAll('[data-rec]').forEach(function (b) { b.addEventListener('click', function () {
        var id = b.getAttribute('data-rec');
        UI.modal({ title: 'Recommend this OD?', body: '<div class="fld"><label>Note to the Academic Director (optional)</label><textarea class="input" id="rec-note" placeholder="e.g. Verified with the physical director"></textarea></div>',
          actions: '<button class="btn ok" id="rec-go">' + UI.icon('check') + 'Confirm recommendation</button><button class="btn" onclick="UI.closeModal()">Cancel</button>' });
        document.getElementById('rec-go').addEventListener('click', function () {
          WF.recommendOd(id, t.id, document.getElementById('rec-note').value.trim(), true);
          UI.closeModal(); UI.toast('Recommended', 'The Academic Director has been notified.', 'green'); render();
        });
      }); });
      view.querySelectorAll('[data-ret]').forEach(function (b) { b.addEventListener('click', function () {
        var id = b.getAttribute('data-ret');
        UI.modal({ title: 'Return this request?', body: '<div class="fld"><label>Remark for the student</label><textarea class="input" id="ret-note" placeholder="What should be corrected?"></textarea></div>',
          actions: '<button class="btn danger" id="ret-go">' + UI.icon('x') + 'Return to student</button><button class="btn" onclick="UI.closeModal()">Cancel</button>' });
        document.getElementById('ret-go').addEventListener('click', function () {
          WF.recommendOd(id, t.id, document.getElementById('ret-note').value.trim(), false);
          UI.closeModal(); UI.toast('Request returned', 'The student has been notified.', 'yellow'); render();
        });
      }); });
      view.querySelectorAll('[data-lrec]').forEach(function (b) { b.addEventListener('click', function () {
        WF.recommendLeave(b.getAttribute('data-lrec'), t.id, '', true);
        UI.toast('Recommended', 'Moved up the approval chain.', 'green'); render();
      }); });
      view.querySelectorAll('[data-lret]').forEach(function (b) { b.addEventListener('click', function () {
        WF.recommendLeave(b.getAttribute('data-lret'), t.id, 'Please review and re-apply.', false);
        UI.toast('Leave returned', '', 'yellow'); render();
      }); });
    }
    render();

  }
});
})();

/* ── teacher/appraisal ........................... ── */
(function () {
MDTPAGE({
  role: 'teacher',
  folder: 'teacher',
  id: 'appraisal',
  render: function (view, ctx) {

    var me = ctx.person;
    function render() {
      var mine = DB.appraisals.filter(function (a) { return a.staffId === me.id; });
      var cur = mine.filter(function (a) { return a.cycle === DB.settings.academicYear; })[0];
      var hist = mine.filter(function (a) { return a.cycle !== DB.settings.academicYear; });
      var kpi = (function () {
        var al = Q.allocationsOfTeacher(me.id);
        var attSum = 0, attN = 0;
        al.forEach(function (a) {
          var sess = Q.sessionsOf(a.classId, a.courseId);
          var per = 0;
          sess.forEach(function (sx) {
            var m = DB.attendanceSessions.filter(function (y) { return y.classId === a.classId && y.courseId === a.courseId; }).length;
            per += m;
          });
          Q.studentsOf(a.classId).forEach(function (s) { attSum += Q.attPct(s.id, a.courseId); attN++; });
        });
        var mentees = Q.mentorGroupsOf(me.id).reduce(function (acc, g) { return acc + g.students.length; }, 0);
        return { att: attN ? Math.round(attSum / attN) : 0, courses: al.length, mentees: mentees };
      })();
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>My Appraisal</h1><div class="sub">Annual self-review — teaching, research, service — reviewed by the Academic Director</div></div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'chart', value: kpi.courses, label: 'Courses this cycle' }) +
        UI.stat({ tone: 'g', icon: 'checkc', value: kpi.att + '%', label: 'Class attendance (avg)' }) +
        UI.stat({ tone: 'y', icon: 'users', value: kpi.mentees, label: 'Mentees guided' }) +
        UI.stat({ tone: 'r', icon: 'medal', value: (cur && cur.status === 'Reviewed') ? cur.score + '/100' : (cur ? cur.status : 'Draft due'), label: 'Current cycle' }) +
        '</div>' +
        '<div class="split">' +
        '<div>' + UI.card('Self-appraisal — ' + DB.settings.academicYear, 'edit',
          (cur ? UI.hint('Your submission for this cycle is <b>' + cur.status + '</b>' + (cur.reviewer ? ' — reviewer ' + UI.esc(Q.name(cur.reviewer)) : '') + '.', '', 'info') : '') +
          '<div class="fgrid">' +
          UI.field('ap-te', 'Teaching hours (to date)', '<input class="input" id="ap-te" type="number" value="' + (cur ? cur.self.teaching : 108) + '">', true) +
          UI.field('ap-pu', 'Publications', '<input class="input" id="ap-pu" type="number" min="0" value="' + (cur ? cur.self.publications : 0) + '">', true) +
          UI.field('ap-fd', 'FDPs / trainings attended', '<input class="input" id="ap-fd" type="number" min="0" value="' + (cur ? cur.self.fdp : 1) + '">', true) +
          UI.field('ap-ev', 'Events / conclaves organised', '<input class="input" id="ap-ev" type="number" min="0" value="' + (cur ? cur.self.events : 2) + '">', true) + '</div>' +
          UI.field('ap-fb', 'Student feedback score (of 5)', '<input class="input" id="ap-fb" type="number" step="0.1" min="0" max="5" value="' + (cur ? cur.self.feedback : 4.4) + '">', true) +
          '<div class="frow" style="justify-content:flex-start"><button class="btn pri" id="ap-go">' + UI.icon('check') + 'Submit for review</button></div>' +
          UI.hint('Auto-KPIs (attendance, mentees) attach themselves from the live record — the director sees them alongside your inputs.', '', 'info')) + '</div>' +
        '<div>' + UI.card('Review history', 'medal', hist.length ? UI.table([
          { h: 'Cycle', render: function (a) { return '<b>' + a.cycle + '</b>'; } },
          { h: 'Self inputs', render: function (a) { return a.self.teaching + 'h · ' + a.self.publications + ' pub · ' + a.self.fdp + ' FDP'; } },
          { h: 'KPIs', render: function (a) { return 'att ' + a.kpis.attAvg + '% · res ' + a.kpis.results + '%'; } },
          { h: 'Score', render: function (a) { return a.score ? '<b class="num" style="color:var(--green-ink)">' + a.score + '/100</b>' : '—'; } },
          { h: 'Remark', render: function (a) { return UI.esc(a.remark || '—'); } },
          { h: 'Status', render: function (a) { return UI.badge(a.status); } }
        ], hist) : UI.empty('First cycle on record — submit to begin the trail', 'medal')) +
        UI.card('How scoring works', 'info', '<ul style="margin:4px 0 0 16px;padding:0;font-size:12.5px;color:var(--text-2);line-height:1.9">' +
          '<li>Teaching load &amp; class attendance feed from the live timetable and sessions.</li>' +
          '<li>Research counts publications and FDPs certified this cycle.</li>' +
          '<li>Mentoring weighs meetings logged with your mentee group.</li>' +
          '<li>The director scores out of 100 with a written remark.</li></ul>') + '</div>' +
        '</div>';
      document.getElementById('ap-go').addEventListener('click', function () {
        WF.submitAppraisal(me.id, { teaching: document.getElementById('ap-te').value, publications: document.getElementById('ap-pu').value,
          fdp: document.getElementById('ap-fd').value, events: document.getElementById('ap-ev').value, feedback: document.getElementById('ap-fb').value,
          attAvg: kpi.att, results: 0, menteeMeetings: kpi.mentees });
        UI.toast('Appraisal submitted', 'Academic director notified for review.', 'green'); render();
      });
    }
    render();

  }
});
})();

/* ── teacher/assignments ......................... ── */
(function () {
MDTPAGE({
  role: 'teacher',
  folder: 'teacher',
  id: 'assignments',
  render: function (view, ctx) {

    var t = ctx.person;
    var allocs = Q.allocationsOfTeacher(t.id);
    var state = { course: allocs[0] ? allocs[0].courseId : '', tab: 'A2' };
    function render() {
      var mine = DB.assignments.filter(function (a) { return a.teacherId === t.id && (!state.course || a.courseId === state.course); });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Assignments</h1><div class="sub">Create, track submissions and grade</div></div>' +
        '<div class="actions">' + (mine.length ? UI.expBtn('taExp', 'Export tracker') : '') + '<button class="btn pri" id="newAs">' + UI.icon('plus') + 'New assignment</button></div></div>' +
        '<div class="rowflex mb8" style="margin-bottom:16px">' +
        '<span class="chip' + (!state.course ? ' on' : '') + '" data-c="">All courses</span>' +
        allocs.map(function (a) { return '<span class="chip' + (state.course === a.courseId ? ' on' : '') + '" data-c="' + a.courseId + '">' + a.courseId + '</span>'; }).join('') +
        '</div>' +
        UI.card('Assignment tracker', 'clipboard',
          (mine.length ? UI.table([
            { h: 'Title', render: function (r) { return '<b>' + UI.esc(r.title) + '</b><div style="font-size:11.5px;color:var(--text-2)">' + r.courseId + ' · ' + r.classId + ' · max ' + r.max + '</div>'; } },
            { h: 'Due', render: function (r) { return UI.fmtDate(r.dueAt); } },
            { h: 'Submissions', render: function (r) {
                var subs = DB.submissions[r.id] || {};
                var sub = 0, gr = 0; Object.keys(subs).forEach(function (k) { if (subs[k].st !== 'Pending') sub++; if (subs[k].st === 'Graded') gr++; });
                return '<span class="num">' + sub + '/' + Q.studentsOf(r.classId).length + '</span> · <span style="color:var(--green-ink)">' + gr + ' graded</span>';
            } },
            { h: 'Status', render: function (r) { var subs = DB.submissions[r.id] || {}; var pend = 0; Object.keys(subs).forEach(function (k) { if (subs[k].st === 'Submitted') pend++; }); return pend ? UI.badge('In Progress', pend + ' to grade') : UI.badge('Published', 'Graded'); } },
            { h: 'Action', render: function (r) { return '<button class="btn sm pri" data-open="' + r.id + '">' + UI.icon('eye') + 'Submissions</button>'; } }
          ], mine) : UI.empty('No assignments yet in this filter', 'clipboard'))) +
        UI.card('Grading outlook', 'chart',
          UI.barsChart(mine.map(function (a) {
            var subs = DB.submissions[a.id] || {};
            var pend = 0; Object.keys(subs).forEach(function (k) { if (subs[k].st === 'Submitted') pend++; });
            return { l: a.courseId + ' ' + a.title.slice(0, 14), v: pend, n: pend, tone: pend ? 'y' : 'g' };
          })));
      view.querySelectorAll('[data-c]').forEach(function (c) { c.addEventListener('click', function () { state.course = c.getAttribute('data-c'); render(); }); });
      var taex = document.getElementById('taExp');
      if (taex) taex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'ASSIGNMENT TRACKER — FACULTY VIEW'],
          ['Faculty', t.name],
          [],
          ['Course', 'Class', 'Title', 'Assigned', 'Due', 'Max', 'Submitted', 'Graded', 'Class size']
        ];
        mine.forEach(function (a) {
          var subs = DB.submissions[a.id] || {};
          var sub = 0, gr = 0; Object.keys(subs).forEach(function (k) { if (subs[k].st !== 'Pending') sub++; if (subs[k].st === 'Graded') gr++; });
          rows.push([a.courseId, a.classId, a.title, a.assignedAt, a.dueAt, a.max, sub, gr, Q.studentsOf(a.classId).length]);
        });
        UI.downloadCSV('AssignmentTracker-' + t.id + '.csv', rows);
      });
      document.getElementById('newAs').addEventListener('click', function () {
        UI.modal({ title: 'New assignment', body:
          '<div class="fgrid">' +
          UI.field('na-course', 'Course · Class', UI.select('na-course', allocs.map(function (a) { return { v: a.courseId + '|' + a.classId, l: a.courseId + ' · ' + a.classId }; })), true) +
          UI.field('na-due', 'Due date', '<input class="input" id="na-due" type="date" min="' + Q.today() + '" value="2026-09-12">', true) +
          '</div>' +
          UI.field('na-title', 'Title', '<input class="input" id="na-title" placeholder="e.g. Unit assessment — Unit 3">', true) +
          UI.field('na-desc', 'Brief for students', '<textarea class="input" id="na-desc"></textarea>') +
          UI.field('na-max', 'Maximum marks', '<input class="input" id="na-max" type="number" value="15" min="5" max="50">'),
          actions: '<button class="btn pri" id="na-go">' + UI.icon('send') + 'Publish to class</button>' });
        document.getElementById('na-go').addEventListener('click', function () {
          var v = document.getElementById('na-course').value.split('|');
          var f = { courseId: v[0], classId: v[1], title: val('na-title'), desc: val('na-desc'), due: document.getElementById('na-due').value, max: +document.getElementById('na-max').value };
          if (!f.title) { UI.toast('Add a title', '', 'red'); return; }
          WF.createAssignment(t.id, f);
          UI.closeModal(); UI.toast('Assignment published', f.classId + ' has been notified.', 'green'); render();
        });
      });
      view.querySelectorAll('[data-open]').forEach(function (b) { b.addEventListener('click', function () {
        var a = DB.assignments.filter(function (x) { return x.id === b.getAttribute('data-open'); })[0];
        var subs = DB.submissions[a.id] || {};
        var rows = Q.studentsOf(a.classId).map(function (s) {
          return { s: s, sub: subs[s.id] || { st: 'Pending' } };
        });
        UI.modal({ title: a.title + ' — submissions', lg: true, body:
          UI.table([
            { h: 'Student', render: function (r) { return UI.avatar(r.s, 28) + ' ' + UI.esc(r.s.name) + '<div style="font-size:11px;color:var(--text-2)">' + r.s.reg + '</div>'; } },
            { h: 'Status', render: function (r) { return UI.badge(r.sub.st); } },
            { h: 'Submitted', render: function (r) { return r.sub.at ? UI.esc(r.sub.at) : '—'; } },
            { h: 'Files', render: function (r) { var fl = r.sub.files || []; return fl.length ? '<span class="mono">' + fl.length + ' file' + (fl.length > 1 ? 's' : '') + '</span>' : '—'; } },
            { h: 'Note', render: function (r) { return r.sub.text ? '<span style="color:var(--text-2)">' + UI.esc(r.sub.text.slice(0, 40)) + (r.sub.text.length > 40 ? '…' : '') + '</span>' : '—'; } },
            { h: 'Score', render: function (r) {
                return r.sub.st === 'Submitted' || r.sub.st === 'Graded' ?
                '<input class="input" style="width:90px;padding:6px 10px" type="number" min="0" max="' + a.max + '" value="' + (r.sub.marks != null ? r.sub.marks : '') + '" placeholder="/' + a.max + '" data-g="' + r.s.id + '">' : (r.sub.marks != null ? '<b class="num">' + r.sub.marks + '/' + a.max + '</b>' : '—');
            } }
          ], rows) +
          '<div class="chiprow mt8">' + UI.expBtn('subExp', 'Export submissions CSV') + '</div>',
          actions: '<button class="btn ok" id="gr-save">' + UI.icon('check') + 'Save grades & notify</button>' });
        document.getElementById('subExp').addEventListener('click', function () {
          var out = [
            ['My Desktop Tech — CampusOne', ''],
            ['Document', 'ASSIGNMENT SUBMISSIONS'],
            ['Assignment', a.title],
            ['Course · Class', a.courseId + ' · ' + a.classId],
            [],
            ['Register No', 'Student', 'Status', 'Submitted', 'Files', 'Note', 'Score/' + a.max]
          ];
          rows.forEach(function (r) {
            out.push([r.s.reg, r.s.name, r.sub.st, r.sub.at || '—', (r.sub.files || []).map(function (f) { return f.name; }).join(' | ') || '—', r.sub.text || '', r.sub.marks != null ? r.sub.marks : '—']);
          });
          UI.downloadCSV('Submissions-' + a.courseId + '-' + a.title.replace(/[^A-Za-z0-9]+/g, '-') + '.csv', out);
        });
        document.getElementById('gr-save').addEventListener('click', function () {
          var n = 0;
          document.querySelectorAll('[data-g]').forEach(function (inp) {
            var sidX = inp.getAttribute('data-g');
            if (inp.value !== '' && inp.value != null) { WF.gradeAssignment(a.id, sidX, +inp.value, t.id); n++; }
          });
          UI.closeModal(); UI.toast('Grades saved', n + ' students scored — they have been notified.', 'green'); render();
        });
      }); });
    }
    function val(id) { return document.getElementById(id).value.trim(); }
    render();

  }
});
})();

/* ── teacher/attainment .......................... ── */
(function () {
MDTPAGE({
  role: 'teacher',
  folder: 'teacher',
  id: 'attainment',
  render: function (view, ctx) {

    var me = ctx.person;
    var state = { course: '' };
    function render() {
      var allocs = Q.allocationsOfTeacher(me.id);
      if (state.course && !allocs.filter(function (a) { return a.courseId === state.course; }).length) state.course = '';
      var course = state.course || (allocs[0] ? allocs[0].courseId : '');
      var cos = DB.courseCOs[course] || [];
      var cls = allocs.filter(function (a) { return a.courseId === course; })[0];
      var studs = cls ? Q.studentsOf(cls.classId) : [];
      var pass = studs.filter(function (s) { var m = Q.marksOf(s.id)[course]; return m && (m.I1 || 0) >= 8; }).length;
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Course Attainment</h1><div class="sub">CO-wise attainment from your own marks record · levels follow the institutional rubric</div></div>' +
        '<div class="actions">' + UI.expBtn('atExp', 'Export attainment') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'chart', value: cos.length ? Math.round(cos.reduce(function (a, co) { return a + co.att; }, 0) / cos.length) + '%' : '—', label: 'Average attainment', sub: course ? course : '—' }) +
        UI.stat({ tone: 'g', icon: 'checkc', value: studs.length ? Math.round(pass / studs.length * 100) + '%' : '—', label: 'Students above threshold', sub: pass + ' of ' + studs.length }) +
        UI.stat({ tone: 'y', icon: 'layers', value: allocs.length, label: 'Courses (this sem)' }) +
        UI.stat({ tone: 'r', icon: 'medal', value: cos.filter(function (co) { return co.att < 55; }).length, label: 'Low COs', sub: 'below 55%' }) +
        '</div>' +
        '<div class="rowflex mb16" style="gap:8px;flex-wrap:wrap">' +
        allocs.map(function (a) { return '<span class="chip' + (course === a.courseId ? ' on' : '') + '" data-at="' + a.courseId + '">' + a.courseId + '</span>'; }).join('') + '</div>' +
        '<div class="split">' +
        '<div>' + UI.card('CO attainment — ' + course, 'chart', UI.table([
          { h: 'CO', render: function (co) { return '<b class="mono">' + co.co + '</b>'; } },
          { h: 'Statement', render: function (co) { return UI.esc(co.stmt.slice(0, 60)); } },
          { h: 'Attainment', render: function (co) { return UI.bar(co.att, co.att >= 70 ? 'g' : co.att >= 55 ? 'y' : 'r'); } },
          { h: 'Level', render: function (co) { return UI.badge(co.att >= 70 ? 'High' : co.att >= 55 ? 'Moderate' : 'Low'); } }
        ], cos)) + '</div>' +
        '<div>' + UI.card('Result distribution — ' + course, 'grid', (function () {
          if (!studs.length) return UI.empty('Pick a course', 'chart');
          var bands = [0, 0, 0, 0];
          studs.forEach(function (s) { var m = Q.marksOf(s.id)[course]; var v = m ? (m.I1 || 0) + (m.Q1 || 0) : 0; bands[v >= 25 ? 0 : v >= 20 ? 1 : v >= 15 ? 2 : 3]++; });
          return UI.barsChart([
            { l: '25–30 (excellent)', v: Math.round(bands[0] / studs.length * 100), n: bands[0], tone: 'g' },
            { l: '20–24 (good)', v: Math.round(bands[1] / studs.length * 100), n: bands[1], tone: 'g2' },
            { l: '15–19 (average)', v: Math.round(bands[2] / studs.length * 100), n: bands[2], tone: 'y' },
            { l: '< 15 (at risk)', v: Math.round(bands[3] / studs.length * 100), n: bands[3], tone: 'r' }
          ]);
        })()) +
        UI.card('Next actions', 'info', '<ul style="margin:4px 0 0 16px;padding:0;font-size:12.5px;color:var(--text-2);line-height:1.9">' +
          '<li>COs below 55% need remedial sessions before Internal-II.</li>' +
          '<li>IQAC consolidates this data with the survey cycle for indirect attainment.</li>' +
          '<li>The archived cycle reports live in Previous Semester Courses.</li></ul>') + '</div>' +
        '</div>';
      view.querySelectorAll('[data-at]').forEach(function (c) { c.addEventListener('click', function () { state.course = c.getAttribute('data-at'); render(); }); });
      var ex = document.getElementById('atExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'COURSE ATTAINMENT — FACULTY VIEW'],
          ['Faculty', me.name],
          ['Generated', Q.today()],
          [],
          ['Course', 'CO', 'Statement', 'Attainment %', 'Level']
        ];
        Q.allocationsOfTeacher(me.id).forEach(function (a) {
          (DB.courseCOs[a.courseId] || []).forEach(function (co) {
            rows.push([a.courseId, co.co, co.stmt, co.att, co.att >= 70 ? 'High' : co.att >= 55 ? 'Moderate' : 'Low']);
          });
        });
        UI.downloadCSV('Course-Attainment.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── teacher/attendance .......................... ── */
(function () {
MDTPAGE({
  role: 'teacher',
  folder: 'teacher',
  id: 'attendance',
  render: function (view, ctx) {

    var t = ctx.person;
    var allocs = Q.allocationsOfTeacher(t.id);
    var state = {
      course: allocs[0] ? allocs[0].courseId : '',
      klass: allocs[0] ? allocs[0].classId : '',
      date: Q.today(), period: 1, marks: {}
    };
    var qs = new URLSearchParams(SPA.query);
    if (qs.get('course')) state.course = qs.get('course');
    if (qs.get('class')) state.klass = qs.get('class');
    if (qs.get('period')) state.period = +qs.get('period');
    function alloc() { return allocs.filter(function (a) { return a.courseId === state.course && a.classId === state.klass; })[0] || allocs[0]; }
    function loadMarks() {
      state.marks = {};
      var sess = DB.attendanceSessions.filter(function (s) { return s.classId === state.klass && s.courseId === state.course && s.date === state.date && s.period === state.period; })[0];
      if (sess) state.marks = Object.assign({}, sess.marks);
      else Q.studentsOf(state.klass).forEach(function (s) { state.marks[s.id] = 'P'; });
    }
    function render() {
      if (!allocs.length) { view.innerHTML = UI.empty('No course allocations yet', 'layers', 'The Academic Director assigns courses to faculty.'); return; }
      loadMarks();
      var students = Q.studentsOf(state.klass);
      var counts = { P: 0, A: 0, L: 0 }; students.forEach(function (s) { counts[state.marks[s.id]]++; });
      var past = DB.attendanceSessions.filter(function (s) { return s.teacherId === t.id; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 8);
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Attendance</h1><div class="sub">Mark the register — updates flow to students, advisors and thresholds instantly</div></div>' +
        '<div class="actions">' + UI.expBtn('attRg', 'Export register') + '</div></div>' +
        '<div class="card glow glow-b accent-b"><div class="card-t">' + UI.icon('checkc') + '<h3>Session</h3></div>' +
        '<div class="fgrid">' +
        '<div class="fld"><label>Course</label>' + UI.select('at-course', allocs.map(function (a) { return { v: a.courseId + '|' + a.classId, l: a.courseId + ' · ' + a.classId }; }), state.course + '|' + state.klass) + '</div>' +
        '<div class="fld"><label>Date</label><input class="input" id="at-date" type="date" value="' + state.date + '"></div>' +
        '<div class="fld"><label>Period</label>' + UI.select('at-period', [1, 2, 3, 4, 6, 7, 8].map(function (p) { return { v: p, l: 'P' + p }; }), state.period) + '</div>' +
        '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'g', icon: 'check', value: counts.P, label: 'Present' }) +
        UI.stat({ tone: 'y', icon: 'clock', value: counts.L, label: 'Late' }) +
        UI.stat({ tone: 'r', icon: 'x', value: counts.A, label: 'Absent' }) +
        '</div>' +
        UI.card('Register — ' + state.course + ' · ' + state.klass, 'users',
          '<div class="rowflex" style="margin-bottom:12px">' +
          '<button class="btn sm ghost" id="allP">All present</button><button class="btn sm ghost-r" id="allA">All absent</button></div>' +
          UI.table([
            { h: '#', render: function (r, i) { return i + 1; } },
            { h: 'Student', render: function (r) { return UI.avatar(r, 28) + ' ' + UI.esc(r.name) + '<div style="font-size:11px;color:var(--text-2)">' + r.reg + '</div>'; } },
            { h: 'Course attendance', render: function (r) { return UI.bar(Q.attPct(r.id, state.course), 'b2') + ' <span class="num">' + Q.attPct(r.id, state.course) + '%</span>'; } },
            { h: 'Mark', render: function (r) {
                var cur = state.marks[r.id];
                return '<span class="rowflex" style="gap:4px">' +
                ['P', 'A', 'L'].map(function (m) { return '<span class="att-pill ' + m.toLowerCase() + (cur === m ? ' ' + m.toLowerCase() : '') + '" style="' + (cur === m ? '' : 'background:var(--surface-2);color:var(--text-2)') + '" data-sid="' + r.id + '" data-m="' + m + '">' + m + '</span>'; }).join('') + '</span>';
            } }
          ], students) +
          '<div class="frow"><button class="btn ok" id="at-save">' + UI.icon('check') + 'Save register</button></div>') +
        UI.card('Recent sessions', 'clock', UI.table([
          { h: 'Date', render: function (r) { return UI.fmtDate(r.date); } },
          { h: 'Course · Class', render: function (r) { return '<span class="mono">' + r.courseId + '</span> · ' + r.classId; } },
          { h: 'Period', render: function (r) { return 'P' + r.period; } },
          { h: 'Present', render: function (r) { var c = 0; Object.keys(r.marks).forEach(function (k) { if (r.marks[k] === 'P') c++; }); return '<span class="num">' + c + '/' + Object.keys(r.marks).length + '</span>'; } },
          { h: 'Action', render: function (r) { return '<span class="dl" data-edit="' + r.id + '">Open</span>'; } }
        ], past));
      document.getElementById('at-course').addEventListener('change', function () {
        var v = document.getElementById('at-course').value.split('|');
        state.course = v[0]; state.klass = v[1]; render();
      });
      document.getElementById('at-date').addEventListener('change', function () { state.date = document.getElementById('at-date').value || Q.today(); render(); });
      document.getElementById('at-period').addEventListener('change', function () { state.period = +document.getElementById('at-period').value; render(); });
      document.getElementById('allP').addEventListener('click', function () { students.forEach(function (s) { state.marks[s.id] = 'P'; }); render(); });
      document.getElementById('allA').addEventListener('click', function () { students.forEach(function (s) { state.marks[s.id] = 'A'; }); render(); });
      view.querySelectorAll('[data-sid]').forEach(function (el) { el.addEventListener('click', function () {
        state.marks[el.getAttribute('data-sid')] = el.getAttribute('data-m'); render();
      }); });
      view.querySelectorAll('[data-edit]').forEach(function (el) { el.addEventListener('click', function () {
        var s = DB.attendanceSessions.filter(function (x) { return x.id === el.getAttribute('data-edit'); })[0];
        state.course = s.courseId; state.klass = s.classId; state.date = s.date; state.period = s.period; render();
        window.scrollTo(0, 0);
      }); });
      document.getElementById('at-save').addEventListener('click', function () {
        WF.markAttendance(t.id, state.klass, state.course, state.date, state.period, Object.assign({}, state.marks));
        UI.toast('Register saved', counts.P + ' present · ' + counts.A + ' absent · students and advisor notified of impact.', 'green');
        render();
      });
      document.getElementById('attRg').addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'ATTENDANCE REGISTER'],
          ['Course', state.course],
          ['Class', state.klass],
          ['Faculty', t.name],
          ['Generated', Q.today()],
          [],
          ['Register No', 'Student', 'Present', 'Total sessions', 'Percentage', 'Standing']
        ];
        Q.studentsOf(state.klass).forEach(function (s) {
          var a = Q.attOf(s.id)[state.course] || { p: 0, t: 0, l: 0 };
          var p = Q.attPct(s.id, state.course);
          rows.push([s.reg, s.name, a.p, a.t, p + '%', p >= 85 ? 'On track' : p >= 75 ? 'Adequate' : 'Condonation']);
        });
        UI.downloadCSV('AttendanceRegister-' + state.course + '-' + state.klass + '.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── teacher/courses ............................. ── */
(function () {
MDTPAGE({
  role: 'teacher',
  folder: 'teacher',
  id: 'courses',
  render: function (view, ctx) {

    var t = ctx.person;
    var allocs = Q.allocationsOfTeacher(t.id);
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>My Courses</h1><div class="sub">' + allocs.length + ' allocations · assigned by the Academic Director (' + UI.esc(Q.name('AD1')) + ')</div></div></div>' +
      '<div class="grid g2">' + allocs.map(function (a) {
        var c = Q.courseById(a.courseId);
        var plan = DB.coursePlan.filter(function (p) { return p.classId === a.classId && p.courseId === a.courseId; });
        var done = plan.filter(function (p) { return p.status === 'Completed'; }).length;
        var cur = plan.filter(function (p) { return p.status === 'In Progress'; })[0];
        return '<div class="card glow glow-b accent-b"><div class="spread">' +
          '<span style="display:flex;gap:10px;align-items:center"><span class="sicon tb" style="width:42px;height:42px;border-radius:11px;display:flex;align-items:center;justify-content:center;background:var(--blue-tint);color:var(--g-blue)">' + UI.icon('layers') + '</span>' +
          '<span><b class="mono" style="color:var(--blue-ink)">' + c.id + '</b><div style="font-size:13px;font-weight:600">' + UI.esc(c.title) + '</div></span></span>' +
          '<div style="text-align:right"><span class="tag b">' + a.classId + '</span><div style="font-size:10.5px;color:var(--text-2);margin-top:4px">allotted ' + UI.fmtDate(a.assignedAt) + '</div></div></div>' +
          '<div class="mt8">' + UI.kv([['Credits', c.credits], ['Periods/week', a.periods], ['Students', Q.studentsOf(a.classId).length], ['Type', c.type]]) + '</div>' +
          '<div class="mt8" style="font-size:12px;color:var(--text-2)"><b>Current unit:</b> ' + (cur ? UI.esc(cur.topic) : 'Unit ' + (done + 1)) + ' · ' + (cur ? cur.week : 'W' + (done * 2 + 1)) + '</div>' +
          '<div class="mt8">' + UI.bar(Math.round(done / 5 * 100), 'b2') + '</div>' +
          '<div class="frow" style="justify-content:flex-start">' +
          '<a class="btn sm ghost" href="attendance.html?course=' + a.courseId + '&class=' + a.classId + '">' + UI.icon('checkc') + 'Attendance</a>' +
          '<a class="btn sm ghost" href="exams.html?course=' + a.courseId + '">' + UI.icon('chart') + 'Marks</a>' +
          '<a class="btn sm ghost" href="schedule.html">' + UI.icon('calendar') + 'Plan</a>' +
          '</div></div>';
      }).join('') + '</div>';

  }
});
})();

/* ── teacher/dashboard ........................... ── */
(function () {
MDTPAGE({
  role: 'teacher',
  folder: 'teacher',
  id: 'dashboard',
  render: function (view, ctx) {

    var t = ctx.person;
    var allocs = Q.allocationsOfTeacher(t.id);
    var students = 0; allocs.forEach(function (a) { students += Q.studentsOf(a.classId).length; });
    var myTT = DB.timetable.filter(function (s) { return s.teacherId === t.id && !s.break; });
    var todaySlots = myTT.filter(function (s) { return s.day === 4; }).sort(function (a, b) { return a.period - b.period; });
    var pendGrade = 0;
    DB.assignments.filter(function (a) { return a.teacherId === t.id; }).forEach(function (a) {
      var subs = DB.submissions[a.id] || {};
      Object.keys(subs).forEach(function (k) { if (subs[k].st === 'Submitted') pendGrade++; });
    });
    var odPend = t.advisorClass ? DB.odRequests.filter(function (r) { return r.status === 'Submitted' && Q.studentById(r.studentId) && Q.studentById(r.studentId).classId === t.advisorClass; }).length : 0;
    var lvPend = t.advisorClass ? DB.leaveRequests.filter(function (r) { return r.status === 'Submitted' && Q.studentById(r.studentId) && Q.studentById(r.studentId).classId === t.advisorClass; }).length : 0;
    view.innerHTML =
      '<div class="pagehead"><span style="display:flex;gap:14px;align-items:center">' + UI.avatar(t, 44) +
      '<span><h1>' + UI.esc(t.name) + '</h1><div class="sub">' + UI.esc(t.designation) + ' · ' + t.dept + (t.advisorClass ? ' · Class Advisor — ' + t.advisorClass : '') + '</div></span></span></div>' +
      '<div class="statrow">' +
      UI.stat({ tone: 'b', icon: 'layers', value: allocs.length, label: 'Courses this semester', sub: 'allotted by the Academic Director', href: 'courses.html' }) +
      UI.stat({ tone: 'g', icon: 'users', value: students, label: 'Students across classes', href: 'students.html' }) +
      UI.stat({ tone: 'y', icon: 'clipboard', value: pendGrade, label: 'Submissions to grade', href: 'assignments.html' }) +
      UI.stat({ tone: 'r', icon: 'door', value: odPend + lvPend, label: 'Advisor queue', sub: t.advisorClass ? t.advisorClass + ' · OD & leave' : 'not an advisor', href: t.advisorClass ? 'advisor-requests.html' : 'dashboard.html' }) +
      '</div>' +
      '<div class="split">' +
      '<div>' +
      UI.card('Today — Friday', 'calendar',
        (todaySlots.length ? UI.table([
          { h: 'Period', render: function (r) { return '<b>P' + r.period + '</b>'; } },
          { h: 'Course · Class', render: function (r) { return '<span class="mono" style="color:var(--blue-ink)">' + r.courseId + '</span> · ' + r.classId; } },
          { h: 'Venue', render: function (r) { return (r.lab ? 'Lab — ' : '') + r.room; } },
          { h: 'Action', render: function (r) { return '<a class="btn sm pri" href="attendance.html?course=' + r.courseId + '&class=' + r.classId + '&period=' + r.period + '">' + UI.icon('checkc') + 'Take attendance</a>'; } }
        ], todaySlots) : UI.empty('No classes allotted today', 'calendar'))) +
      UI.card('My courses', 'layers', '<div class="grid" style="gap:10px">' + allocs.map(function (a) {
        var c = Q.courseById(a.courseId);
        var plan = DB.coursePlan.filter(function (p) { return p.classId === a.classId && p.courseId === a.courseId && p.status === 'Completed'; }).length;
        return '<a class="lrow" href="courses.html"><span class="lmain"><b>' + c.id + ' — ' + UI.esc(c.title) + '</b><span>' + a.classId + ' · ' + a.periods + ' periods/week · ' + Q.studentsOf(a.classId).length + ' students</span></span>' +
          '<span class="lact"><span class="tag b">' + plan + '/5 units</span>' + UI.icon('chevR') + '</span></a>';
      }).join('') + '</div>') +
      '</div>' +
      '<div>' +
      (t.advisorClass ? UI.card('Advisor watch — ' + t.advisorClass, 'alert',
        (Q.atRisk(t.advisorClass).length ? UI.hint('<b>' + Q.atRisk(t.advisorClass).length + ' students</b> are below the 75% attendance threshold — follow up before internal-2.', 'danger', 'alert') : UI.hint('All students above the attendance threshold.', 'ok', 'checkc')) +
        '<div class="mt8">' + UI.table([
          { h: 'Student', render: function (r) { return UI.avatar(r, 28) + ' ' + UI.esc(r.name); } },
          { h: 'Attendance', render: function (r) { return UI.badge('Overdue', Q.attPctOverall(r.id) + '%'); } }
        ], Q.atRisk(t.advisorClass)) + '</div>', null, { href: 'advisor-class.html', label: 'Class overview' }) : '') +
      UI.card('Circulars for staff', 'send', DB.circulars.filter(function (c) { return c.audience === 'Staff' || c.audience === 'All'; }).slice(0, 3).map(function (c) {
        return '<div class="lrow" style="cursor:default"><span class="ic" style="color:var(--g-blue)">' + UI.icon('file') + '</span><span class="lmain"><b>' + UI.esc(c.title) + '</b><span>' + UI.esc(c.body.slice(0, 80)) + '…</span></span><span class="ltime">' + UI.fmtDate(c.at) + '</span></div>';
      }).join('')) +
      '<div class="card glow glow-b accent-b"><div class="card-t">' + UI.icon('grid') + '<h3>Quick actions</h3></div><div class="quickgrid">' +
      '<a class="bigbtn-tile" href="attendance.html">' + UI.icon('checkc') + '<b>Attendance</b></a>' +
      '<a class="bigbtn-tile" href="assignments.html">' + UI.icon('clipboard') + '<b>Assignment</b></a>' +
      '<a class="bigbtn-tile" href="exams.html">' + UI.icon('chart') + '<b>Marks entry</b></a>' +
      '<a class="bigbtn-tile" href="materials.html">' + UI.icon('play') + '<b>Material</b></a>' +
      '</div></div>' +
      '</div></div>';

  }
});
})();

/* ── teacher/elearning ........................... ── */
(function () {
MDTPAGE({
  role: 'teacher',
  folder: 'teacher',
  id: 'elearning',
  render: function (view, ctx) {

    var me = ctx.person;
    var state = { course: '' };
    function render() {
      var allocs = Q.allocationsOfTeacher(me.id);
      if (!allocs.filter(function (a) { return !state.course || a.courseId === state.course; }).length) state.course = '';
      var mats = DB.materials.filter(function (m) {
        var mine = allocs.filter(function (a) { return a.courseId === m.courseId && a.classId === m.classId; }).length;
        return mine && (!state.course || m.courseId === state.course);
      });
      var prog = state.course ? (function () {
        var rows = [];
        var cls = allocs.filter(function (a) { return a.courseId === state.course; })[0];
        if (!cls) return [];
        Q.studentsOf(cls.classId).forEach(function (s) {
          var p = (DB.elearnProgress[s.id] || {})[state.course] || { done: 0, total: 12, score: null };
          rows.push({ s: s, p: p });
        });
        return rows;
      })() : [];
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>e-Learning Studio</h1><div class="sub">Course content setup — units, materials and quizzes — with live student progress</div></div>' +
        '<div class="actions">' + UI.expBtn('elxExp', 'Export progress') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'play', value: allocs.length, label: 'Courses with e-content' }) +
        UI.stat({ tone: 'g', icon: 'file', value: mats.length, label: 'Materials posted' }) +
        UI.stat({ tone: 'y', icon: 'chart', value: prog.length ? Math.round(prog.reduce(function (a, r) { return a + r.p.done / r.p.total; }, 0) / prog.length * 100) + '%' : '—', label: 'Class progress' }) +
        UI.stat({ tone: 'r', icon: 'users', value: allocs.reduce(function (a, x) { return a + Q.studentsOf(x.classId).length; }, 0), label: 'Enrolled learners' }) +
        '</div>' +
        '<div class="rowflex mb16" style="gap:8px;flex-wrap:wrap">' +
        '<span class="chip' + (!state.course ? ' on' : '') + '" data-el="">All courses</span>' +
        allocs.map(function (a) { return '<span class="chip' + (state.course === a.courseId ? ' on' : '') + '" data-el="' + a.courseId + '">' + a.courseId + '</span>'; }).join('') + '</div>' +
        '<div class="split">' +
        '<div>' + UI.card('Course content setup', 'layers', UI.table([
          { h: 'Course · Class', render: function (a) { return '<b class="mono" style="color:var(--blue-ink)">' + a.courseId + '</b> · ' + a.classId; } },
          { h: 'Units planned', render: function (a) { return DB.coursePlan.filter(function (p) { return p.classId === a.classId && p.courseId === a.courseId; }).length + ' units'; } },
          { h: 'Materials', render: function (a) { return DB.materials.filter(function (m) { return m.courseId === a.courseId && m.classId === a.classId; }).length + ' posted'; } },
          { h: 'Quizzes', render: function (a) { return DB.quizzes.filter(function (q) { return q.courseId === a.courseId && q.classId === a.classId; }).length; } },
          { h: 'Action', render: function (a) { return '<a class="btn sm ghost" href="materials.html">' + UI.icon('edit') + 'Add material</a>'; } }
        ], allocs)) +
        (mats.length ? UI.card('Recent materials', 'file', '<div class="grid" style="gap:8px">' + mats.slice(0, 6).map(function (m) {
          return '<div class="lrow" style="cursor:default"><span class="lmain"><b>' + UI.esc(m.title) + '</b><span>' + m.courseId + ' · ' + m.type + ' · ' + UI.fmtDate(m.postedAt) + '</span></span><span class="ltime">' + (m.views || '') + '</span></div>';
        }).join('') + '</div>') : '') + '</div>' +
        '<div>' + (state.course ?
          UI.card('Students progress — ' + state.course, 'chart', UI.table([
            { h: 'Student', render: function (r) { return UI.avatar(r.s, 26) + ' ' + UI.esc(r.s.name) + '<div style="font-size:10px;color:var(--text-2)">' + r.s.reg + '</div>'; } },
            { h: 'Units done', render: function (r) { return '<b class="num">' + r.p.done + '/' + r.p.total + '</b>'; } },
            { h: 'Progress', render: function (r) { return UI.bar(Math.round(r.p.done / r.p.total * 100), r.p.done / r.p.total > 0.6 ? 'g' : 'y'); } },
            { h: 'Assessment', render: function (r) { return r.p.score != null ? '<b class="num">' + r.p.score + '</b>' : '—'; } }
          ], prog)) +
          UI.hint('Progress reflects the learner\u2019s unit completion on their e-Learning page; assessments appear after the practice quizzes.', '', 'info')
          : UI.card('Student progress', 'chart', UI.empty('Pick a course chip to see the class progress ledger', 'chart'))) + '</div>' +
        '</div>';
      view.querySelectorAll('[data-el]').forEach(function (c) { c.addEventListener('click', function () { state.course = c.getAttribute('data-el'); render(); }); });
      var ex = document.getElementById('elxExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'E-LEARNING PROGRESS — ' + (state.course || 'ALL COURSES')],
          ['Faculty', me.name],
          ['Generated', Q.today()],
          [],
          ['Course', 'Class', 'Register No', 'Student', 'Units Done', 'Units Total', 'Progress %', 'Assessment']
        ];
        allocs.forEach(function (a) {
          if (state.course && a.courseId !== state.course) return;
          Q.studentsOf(a.classId).forEach(function (s) {
            var p = (DB.elearnProgress[s.id] || {})[a.courseId] || { done: 0, total: 12, score: null };
            rows.push([a.courseId, a.classId, s.reg, s.name, p.done, p.total, Math.round(p.done / p.total * 100) + '%', p.score != null ? p.score : '']);
          });
        });
        UI.downloadCSV('eLearning-Progress.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── teacher/exams ............................... ── */
(function () {
MDTPAGE({
  role: 'teacher',
  folder: 'teacher',
  id: 'exams',
  render: function (view, ctx) {

    var t = ctx.person;
    var allocs = Q.allocationsOfTeacher(t.id);
    var qs = new URLSearchParams(SPA.query);
    var state = { course: qs.get('course') || (allocs[0] ? allocs[0].courseId : ''), assess: 'I2' };
    var ASSESS = [{ v: 'I2', l: 'Internal-2 (20)' }, { v: 'I1', l: 'Internal-1 (20)' }, { v: 'Q1', l: 'Quiz-1 (10)' }];
    function render() {
      var rows = allocs.filter(function (a) { return !state.course || a.courseId === state.course; });
      var sel = rows[0];
      var students = sel ? Q.studentsOf(sel.classId) : [];
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Marks Entry</h1><div class="sub">Internal assessment scores · publishing notifies the class</div></div>' +
        '<div class="actions">' + UI.expBtn('mkExp', 'Export marks') + '</div></div>' +
        '<div class="card glow glow-b accent-b"><div class="card-t">' + UI.icon('chart') + '<h3>Select assessment</h3></div><div class="fgrid">' +
        UI.field('ex-course', 'Course · Class', UI.select('ex-course', allocs.map(function (a) { return { v: a.courseId, l: a.courseId + ' · ' + a.classId }; }), state.course)) +
        UI.field('ex-assess', 'Assessment', UI.select('ex-assess', ASSESS, state.assess)) +
        '</div></div>' +
        (sel ? UI.card('Score sheet — ' + sel.courseId + ' · ' + sel.classId + ' · ' + (ASSESS.filter(function (x) { return x.v === state.assess; })[0].l), 'list',
          UI.table([
            { h: '#', render: function (r, i) { return i + 1; } },
            { h: 'Student', render: function (r) { return UI.avatar(r, 28) + ' ' + UI.esc(r.name) + '<div style="font-size:11px;color:var(--text-2)">' + r.reg + '</div>'; } },
            { h: 'Existing marks', render: function (r) { var m = Q.marksOf(r.id)[sel.courseId] || {}; return m[state.assess] != null ? '<b class="num">' + m[state.assess] + '</b>' : '—'; } },
            { h: 'New mark', render: function (r) { var m = Q.marksOf(r.id)[sel.courseId] || {}; return '<input class="input" style="width:100px;padding:6px 10px" type="number" min="0" max="' + (state.assess === 'Q1' ? 10 : 20) + '" value="' + (m[state.assess] != null ? m[state.assess] : '') + '" data-mk="' + r.id + '">'; } },
            { h: 'Course aggregate', render: function (r) { var m = Q.marksOf(r.id)[sel.courseId] || {}; var tot = (m.I1 || 0) + (m.Q1 || 0) + (m.I2 || 0); return UI.bar(tot / 50 * 100, 'b2') + ' <span class="num">' + tot + '/50</span>'; } }
          ], students) +
          '<div class="frow"><button class="btn ok" id="mk-save">' + UI.icon('check') + 'Save & publish</button></div>') :
          UI.empty('No course allocations', 'layers')) +
        UI.hint('Published marks appear on the student\u2019s examination page instantly and feed the class ranking aggregate.', '', 'info');
      document.getElementById('ex-course').addEventListener('change', function () { state.course = document.getElementById('ex-course').value; render(); });
      document.getElementById('ex-assess').addEventListener('change', function () { state.assess = document.getElementById('ex-assess').value; render(); });
      var sv = document.getElementById('mk-save');
      if (sv) sv.addEventListener('click', function () {
        var entries = [];
        document.querySelectorAll('[data-mk]').forEach(function (inp) {
          if (inp.value !== '') entries.push({ sid: inp.getAttribute('data-mk'), val: +inp.value });
        });
        WF.saveMarks(t.id, sel.courseId, sel.classId, state.assess, entries);
        UI.toast('Marks published', entries.length + ' entries saved for ' + sel.courseId + ' · ' + sel.classId + '.', 'green');
        render();
      });
      document.getElementById('mkExp').addEventListener('click', function () {
        var out = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'ASSESSMENT MARKS'],
          ['Course', sel ? sel.courseId : '—'],
          ['Class', sel ? sel.classId : '—'],
          ['Assessment', state.assess],
          ['Faculty', t.name],
          [],
          ['Register No', 'Student', state.assess + ' score']
        ];
        students.forEach(function (s) {
          var m = Q.marksOf(s.id)[sel.courseId] || {};
          out.push([s.reg, s.name, m[state.assess] != null ? m[state.assess] : '—']);
        });
        UI.downloadCSV('Marks-' + (sel ? sel.courseId + '-' + sel.classId + '-' + state.assess : 'export') + '.csv', out);
      });
    }
    render();

  }
});
})();

/* ── teacher/leaves .............................. ── */
(function () {
MDTPAGE({
  role: 'teacher',
  folder: 'teacher',
  id: 'leaves',
  render: function (view, ctx) {

    var me = ctx.person;
    var state = { tab: 'mine' };
    function render() {
      var mine = DB.staffLeaves.filter(function (l) { return l.staffId === me.id; });
      var forMe = DB.staffLeaves.filter(function (l) { return l.swapTo === me.id && l.swapStatus === 'Pending'; });
      var all = DB.staffLeaves;
      var CL = 12, OD = 6, ML = 8, taken = mine.filter(function (l) { return l.status === 'Approved' && l.type === 'Leave'; }).reduce(function (a, l) { return a + (l.days || 1); }, 0);
      var list = state.tab === 'mine' ? mine : state.tab === 'swap' ? forMe : all;
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>My Leave &amp; Faculty Swap</h1><div class="sub">On duty, leave and permission hours · propose a swap with a colleague · the Academic Director approves</div></div>' +
        '<div class="actions"><button class="btn pri" id="newLV">' + UI.icon('plus') + 'New request</button>' + UI.expBtn('slvExp', 'Export my requests') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'g', icon: 'key', value: (CL - taken) + ' / ' + CL, label: 'Casual leave balance', sub: 'annual' }) +
        UI.stat({ tone: 'b', icon: 'door', value: OD, label: 'On-duty days available' }) +
        UI.stat({ tone: 'y', icon: 'users', value: forMe.length, label: 'Swap requests for me', sub: 'respond below' }) +
        UI.stat({ tone: 'r', icon: 'list', value: mine.length, label: 'My requests (all)' }) +
        '</div>' +
        '<div class="rowflex mb16">' + UI.chiprow([
          { v: 'mine', l: 'My requests', c: mine.length },
          { v: 'swap', l: 'Waiting for me', c: forMe.length },
          { v: 'all', l: 'Department requests', c: all.length }
        ], state.tab) + '</div>' +
        '<div class="grid g2">' + (list.length ? list.map(function (l) {
          var who = Q.person(l.staffId);
          var tone = l.status === 'Approved' ? 'g' : l.status === 'Rejected' || l.status === 'Swap Declined' ? 'r' : 'y';
          return '<div class="card glow glow-' + tone + ' accent-' + tone + '"><div class="spread">' +
            '<div style="display:flex;gap:10px;align-items:center">' + UI.avatar(who, 36) +
            '<span><b>' + UI.esc(who.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + UI.esc(who.designation) + (l.staffId === me.id ? ' · your request' : '') + '</div></span></div>' + UI.badge(l.status) + '</div>' +
            '<div class="mt8">' + UI.kv([
              ['Type', l.type + (l.mode === 'Hours' ? ' · ' + l.hours + ' permission' : ' · ' + (l.days || 1) + ' day(s)')],
              ['Window', UI.fmtDate(l.from) + ' → ' + UI.fmtDate(l.to)],
              ['Reason', UI.esc(l.reason)],
              ['Proof', l.proof ? '<span class="tag g">' + UI.esc(l.proof) + '</span>' : '—'],
              ['Faculty swap', l.swapTo ? UI.esc(Q.name(l.swapTo)) + ' · ' + (l.swapStatus || '—') : '—']
            ]) + '</div>' +
            '<div class="mt8">' + UI.timeline(l.history.map(function (h) { return { s: h.s, at: h.at, by: h.by }; })) + '</div>' +
            (l.swapTo === me.id && l.swapStatus === 'Pending' ? '<div class="frow" style="justify-content:flex-start">' +
              '<button class="btn ok" data-sw="' + l.id + '">' + UI.icon('check') + 'Accept swap</button>' +
              '<button class="btn ghost-r" data-swn="' + l.id + '">' + UI.icon('x') + 'Decline</button></div>' : '') +
            '</div>';
        }).join('') : '<div class="card">' + UI.empty('Nothing here yet', 'key') + '</div>') + '</div>';
      view.querySelectorAll('.chip[data-f]').forEach(function (c) { c.addEventListener('click', function () { state.tab = c.getAttribute('data-f'); render(); }); });
      view.querySelectorAll('[data-sw]').forEach(function (b) { b.addEventListener('click', function () {
        WF.respondSwap(me.id, b.getAttribute('data-sw'), true);
        UI.toast('Swap accepted', 'Colleague and academic director notified.', 'green'); render();
      }); });
      view.querySelectorAll('[data-swn]').forEach(function (b) { b.addEventListener('click', function () {
        WF.respondSwap(me.id, b.getAttribute('data-swn'), false);
        UI.toast('Swap declined', 'Colleague notified to propose another.', 'red'); render();
      }); });
      document.getElementById('newLV').addEventListener('click', function () {
        var colleagues = DB.staff.filter(function (s) { return s.role === 'teacher' && s.id !== me.id; });
        UI.modal({ title: 'New leave / on-duty request', body:
          UI.field('nl-t', 'Type', UI.select('nl-t', ['On Duty', 'Leave', 'Permission']), true) +
          '<div class="fgrid">' +
          UI.field('nl-m', 'Mode', UI.select('nl-m', [{ v: 'Days', l: 'Days' }, { v: 'Hours', l: 'Hours (permission)' }]), true) +
          UI.field('nl-f', 'From', '<input class="input" id="nl-f" type="date" min="' + Q.today() + '">', true) +
          UI.field('nl-tt', 'To', '<input class="input" id="nl-tt" type="date" min="' + Q.today() + '">', true) +
          UI.field('nl-h', 'Hours (if permission)', UI.select('nl-h', ['1hr', '2hr', '3hr'])) + '</div>' +
          UI.field('nl-r', 'Reason', '<textarea class="input" id="nl-r" rows="2" placeholder="State the reason clearly — approvals read this first"></textarea>', true) +
          UI.field('nl-p', 'Proof (file name, if any)', '<input class="input" id="nl-p" placeholder="e.g. invitation-letter.pdf">') +
          UI.field('nl-s', 'Propose faculty swap (optional)', UI.select('nl-s', [{ v: '', l: 'No swap needed' }].concat(colleagues.map(function (t) { return { v: t.id, l: t.name + ' · ' + t.designation }; }))), false, 'The colleague you name sees the swap request on their Leave &amp; Swap page and accepts or declines before the director decides.'),
          actions: '<button class="btn pri" id="nl-go">' + UI.icon('check') + 'Submit request</button>' });
        document.getElementById('nl-go').addEventListener('click', function () {
          var f = { type: document.getElementById('nl-t').value, mode: document.getElementById('nl-m').value, from: document.getElementById('nl-f').value,
            to: document.getElementById('nl-tt').value || document.getElementById('nl-f').value, hours: document.getElementById('nl-h').value,
            reason: document.getElementById('nl-r').value, proof: document.getElementById('nl-p').value || null, swapTo: document.getElementById('nl-s').value || null };
          if (!f.from || !f.reason) { UI.toast('Date and reason required', 'The reason carries the request — write it clearly.', 'red'); return; }
          WF.submitStaffLeave(me.id, f);
          UI.closeModal(); UI.toast('Request submitted', 'Academic director notified' + (f.swapTo ? ' · swap proposed to ' + Q.name(f.swapTo) : '') + '.', 'green'); render();
        });
      });
      var ex = document.getElementById('slvExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'STAFF LEAVE & SWAP — MY REQUESTS'],
          ['Staff', me.name + ' (' + me.id + ')'],
          ['Generated', Q.today()],
          [],
          ['Type', 'Mode', 'From', 'To', 'Days/Hours', 'Reason', 'Swap with', 'Swap status', 'Status']
        ];
        mine.forEach(function (l) { rows.push([l.type, l.mode, l.from, l.to, l.mode === 'Hours' ? l.hours : l.days, l.reason, l.swapTo ? Q.name(l.swapTo) : '—', l.swapStatus || '—', l.status]); });
        UI.downloadCSV('MyLeave-Swap.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── teacher/materials ........................... ── */
(function () {
MDTPAGE({
  role: 'teacher',
  folder: 'teacher',
  id: 'materials',
  render: function (view, ctx) {

    var t = ctx.person;
    var allocs = Q.allocationsOfTeacher(t.id);
    function render() {
      var mine = DB.materials.filter(function (m) { return m.postedBy === t.id; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Course Materials</h1><div class="sub">Post slides, videos, worksheets and notes — students see them instantly</div></div>' +
        '<div class="actions">' + (mine.length ? UI.expBtn('mtExp', 'Export list') : '') + '<button class="btn pri" id="newMt">' + UI.icon('plus') + 'Post material</button></div></div>' +
        UI.card('My postings', 'play',
          (mine.length ? UI.table([
            { h: 'Material', render: function (r) { var ic = { PDF: 'file', Video: 'video', Slides: 'layers', Worksheet: 'clipboard', Notebook: 'edit' }[r.type] || 'file'; return UI.icon(ic) + ' <b>' + UI.esc(r.title) + '</b><div style="font-size:11.5px;color:var(--text-2)">' + r.courseId + ' · ' + r.classId + ' · ' + r.type + '</div>'; } },
            { h: 'Posted', render: function (r) { return UI.fmtDate(r.postedAt); } },
            { h: 'Description', render: function (r) { return '<span style="color:var(--text-2)">' + UI.esc(r.desc.slice(0, 60)) + '…</span>'; } }
          ], mine) : UI.empty('Nothing posted yet', 'play'))) +
        UI.hint('Students of the class get a notification for every new posting. Large files are handled by the campus content channel.', '', 'info');
      document.getElementById('newMt').addEventListener('click', function () {
        UI.modal({ title: 'Post course material', body:
          '<div class="fgrid">' +
          UI.field('mt-course', 'Course · Class', UI.select('mt-course', allocs.map(function (a) { return { v: a.courseId + '|' + a.classId, l: a.courseId + ' · ' + a.classId }; })), true) +
          UI.field('mt-type', 'Type', UI.select('mt-type', ['PDF', 'Slides', 'Video', 'Worksheet', 'Notebook']), true) +
          '</div>' +
          UI.field('mt-title', 'Title', '<input class="input" id="mt-title" placeholder="e.g. Unit 4 — Graph algorithms">', true) +
          UI.field('mt-desc', 'Description', '<textarea class="input" id="mt-desc"></textarea>') +
          '<div class="mt8">' + UI.field('mt-files', 'Attachments', UI.fileDrop('mt-files', 'Slides, datasets or reference PDFs')) + '</div>',
          actions: '<button class="btn pri" id="mt-go">' + UI.icon('send') + 'Publish to class</button>' });
        var mtFiles = [];
        UI.bindFileDrop('mt-files', mtFiles, 3, 2);
        document.getElementById('mt-go').addEventListener('click', function () {
          var v = document.getElementById('mt-course').value.split('|');
          WF.postMaterial(t.id, v[1], v[0], { type: document.getElementById('mt-type').value, title: val('mt-title'), desc: val('mt-desc'), files: mtFiles });
          UI.closeModal(); UI.toast('Material posted', v[1] + ' has been notified' + (mtFiles.length ? ' — ' + mtFiles.length + ' attachment(s)' : '') + '.', 'green'); render();
        });
      });
      var mtex = document.getElementById('mtExp');
      if (mtex) mtex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'COURSE MATERIALS — FACULTY VIEW'],
          ['Faculty', t.name],
          [],
          ['Course', 'Class', 'Type', 'Title', 'Posted', 'Attachments', 'Description']
        ];
        DB.materials.filter(function (m) { return m.postedBy === t.id; }).forEach(function (m) {
          rows.push([m.courseId, m.classId, m.type, m.title, m.postedAt, (m.files || []).length, m.desc]);
        });
        UI.downloadCSV('CourseMaterials-' + t.id + '.csv', rows);
      });
    }
    function val(id) { return document.getElementById(id).value.trim(); }
    render();

  }
});
})();

/* ── teacher/mentor .............................. ── */
(function () {
MDTPAGE({
  role: 'teacher',
  folder: 'teacher',
  id: 'mentor',
  render: function (view, ctx) {

    var t = ctx.person;
    var groups = Q.mentorGroupsOf(t.id);
    if (!groups.length) { view.innerHTML = UI.empty('No mentor group assigned', 'users', 'The Academic Director maps mentor groups each semester.'); return; }
    var mg = groups[0];
    var meetings = DB.mentorMeetings.filter(function (m) { return m.groupId === mg.id; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>Mentor Group</h1><div class="sub">' + mg.students.length + ' mentees · ' + mg.classId + ' · fortnightly cadence</div></div>' +
      '<div class="actions">' + UI.expBtn('mmExp', 'Export mentees') + '<button class="btn pri" id="logMM">' + UI.icon('clipboard') + 'Log a meeting</button></div></div>' +
      '<div class="split">' +
      '<div>' + UI.card('Mentees', 'users', UI.table([
        { h: 'Student', render: function (r) { return UI.avatar(r, 28) + ' <b>' + UI.esc(r.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + r.reg + '</div>'; } },
        { h: 'Attendance', render: function (r) { var p = Q.attPctOverall(r.id); return UI.bar(p, p >= 75 ? 'g' : 'r') + ' <b class="num">' + p + '%</b>'; } },
        { h: 'CGPA', render: function (r) { return '<span class="num">' + r.cgpa.toFixed(2) + '</span>'; } },
        { h: 'Watch', render: function (r) { return Q.attPctOverall(r.id) < 75 ? UI.badge('Overdue', 'follow up') : (r.cgpa < 7.5 ? UI.badge('Processing', 'support') : UI.badge('Approved', 'on track')); } }
      ], mg.students.map(function (x) { return Q.studentById(x); }))) + '</div>' +
      '<div>' + UI.card('Meeting log', 'calendar', meetings.map(function (m) {
        return '<div class="lrow" style="cursor:default"><span class="ic" style="color:' + (m.date > Q.today() ? 'var(--g-yellow)' : 'var(--g-green)') + '">' + UI.icon(m.date > Q.today() ? 'clock' : 'checkc') + '</span>' +
          '<span class="lmain"><b>' + UI.esc(m.agenda) + ' — ' + UI.fmtDate(m.date) + '</b>' + (m.notes ? '<span>' + UI.esc(m.notes) + '</span>' : '') + '</span>' + (m.attended ? '<span class="ltime">' + m.attended + ' present</span>' : '') + '</div>';
      }).join('')) +
      UI.card('Latest remarks', 'message', DB.mentorRemarks.slice(0, 4).map(function (r) {
        return '<div class="lrow" style="cursor:default"><span class="ic" style="color:var(--g-blue)">' + UI.icon('message') + '</span>' +
          '<span class="lmain"><b>' + UI.esc(Q.name(r.studentId)) + ' · ' + UI.fmtDate(r.date) + '</b><span>' + UI.esc(r.remark) + '</span></span></div>';
      }).join('')) +
      UI.card('Achievements to verify', 'medal', (function () {
        var pend3 = DB.achievements.filter(function (a) { return a.status === 'Pending' && mg.students.indexOf(a.studentId) >= 0; });
        if (!pend3.length) return UI.empty('No achievement submissions from your mentees', 'checkc');
        return pend3.map(function (a) {
          var st = Q.studentById(a.studentId);
          return '<div class="card" style="box-shadow:none;border-style:dashed"><div class="spread"><div><b>' + UI.esc(a.name) + '</b>' +
            '<div style="font-size:11px;color:var(--text-2)">' + UI.esc(st.name) + ' · ' + a.category + ' · ' + a.level + ' · ' + UI.fmtDate(a.date) + '</div></div>' + UI.badge(a.prize) + '</div>' +
            '<div class="mt8" style="font-size:12.5px;color:var(--text-2)">' + UI.esc(a.desc) + (a.attachment ? ' · <span class="tag g">' + UI.esc(a.attachment) + '</span>' : '') + '</div>' +
            '<div class="frow" style="justify-content:flex-start">' +
            '<button class="btn sm ok" data-achv="' + a.id + '">' + UI.icon('check') + 'Verify</button>' +
            '<button class="btn sm ghost-r" data-achr="' + a.id + '">' + UI.icon('x') + 'Reject</button></div></div>';
        }).join('');
      })()) + '</div></div>';
    view.querySelectorAll('[data-achv]').forEach(function (b) { b.addEventListener('click', function () {
      WF.verifyAchievement(t.id, b.getAttribute('data-achv'), true, 'Verified from the mentor desk');
      UI.toast('Achievement verified', 'Student, placement and quality registers updated.', 'green'); SPA.refresh();
    }); });
    view.querySelectorAll('[data-achr]').forEach(function (b) { b.addEventListener('click', function () {
      WF.verifyAchievement(t.id, b.getAttribute('data-achr'), false, 'Proof not sufficient — resubmit with certificate');
      UI.toast('Achievement not accepted', 'Student notified with the reason.', 'red'); SPA.refresh();
    }); });
    var mmex = document.getElementById('mmExp');
    if (mmex) mmex.addEventListener('click', function () {
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'MENTOR GROUP — MENTEE REGISTER'],
        ['Mentor', t.name],
        ['Class', mg.classId],
        [],
        ['Register No', 'Mentee', 'Attendance %', 'Aggregate /180', 'CGPA', 'Arrears', 'Hostel']
      ];
      mg.students.map(function (id) { return Q.studentById(id); }).forEach(function (s) {
        rows.push([s.reg, s.name, Q.attPctOverall(s.id) + '%', Q.totalOf(s.id), s.cgpa.toFixed(2), s.arrears || 0, s.hostel ? (Q.roomOf(s.id) ? Q.roomOf(s.id).id : 'Hostel') : 'Day scholar']);
      });
      UI.downloadCSV('Mentees-' + t.id + '.csv', rows);
    });
    document.getElementById('logMM').addEventListener('click', function () {
      UI.modal({ title: 'Log a mentor meeting', body:
        UI.field('lm-agenda', 'Agenda', '<input class="input" id="lm-agenda" value="Mentor session">', true) +
        UI.field('lm-notes', 'Notes', '<textarea class="input" id="lm-notes" placeholder="Discussion summary, follow-ups…"></textarea>', true),
        actions: '<button class="btn pri" id="lm-go">' + UI.icon('check') + 'Save log</button>' });
      document.getElementById('lm-go').addEventListener('click', function () {
        var n = document.getElementById('lm-notes').value.trim();
        if (!n) { UI.toast('Add notes', '', 'red'); return; }
        WF.logMentorMeeting(t.id, n);
        UI.closeModal(); UI.toast('Meeting logged', 'Mentees can see the summary.', 'green'); SPA.refresh();
      });
    });

  }
});
})();

/* ── teacher/previous ............................ ── */
(function () {
MDTPAGE({
  role: 'teacher',
  folder: 'teacher',
  id: 'previous',
  render: function (view, ctx) {

    var me = ctx.person;
    function render() {
      /* synthesised previous-cycle allocations from the current set — the
         archived cycle view for reports & attainment history */
      var prev = Q.allocationsOfTeacher(me.id).map(function (a, i) {
        var cls = Q.classById(a.classId);
        return { a: a, cls: cls, sem: Math.max(1, cls.sem - 2), year: '2025–26', regulation: cls.batch.indexOf('2025') >= 0 ? 'R2024' : 'R2021' };
      });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Previous Semester Courses</h1><div class="sub">Archived cycles with consolidated reports — attendance, internal marks, attainment and CO mapping</div></div>' +
        '<div class="actions">' + UI.expBtn('pvExp', 'Export archive') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'layers', value: prev.length, label: 'Courses in archive' }) +
        UI.stat({ tone: 'g', icon: 'chart', value: prev.length * 5, label: 'Reports available', sub: '5 per course' }) +
        UI.stat({ tone: 'y', icon: 'calendar', value: '2025–26', label: 'Archive cycle' }) +
        UI.stat({ tone: 'r', icon: 'file', value: 2, label: 'Pending consolidations', sub: 'marks entry lag' }) +
        '</div>' +
        UI.card('Archived allocations — 2025–26', 'layers', UI.table([
          { h: 'Course', render: function (p) { var c = Q.courseById(p.a.courseId); return '<b class="mono" style="color:var(--blue-ink)">' + p.a.courseId + '</b> · ' + UI.esc(c ? c.title.slice(0, 34) : ''); } },
          { h: 'Degree / Branch', render: function (p) { return UI.esc(p.cls.dept + ' · B.Tech'); } },
          { h: 'Section', render: function (p) { return p.cls.id + ' (sem ' + p.sem + ')'; } },
          { h: 'Batch', render: function (p) { return UI.esc(p.cls.batch) + ' · ' + p.regulation; } },
          { h: 'Marks entry', render: function (p, i) { return i === 3 ? UI.badge('Pending') : '<span class="tag g">completed &amp; frozen</span>'; } },
          { h: 'Reports', render: function (p, i) {
              return '<span class="dl" data-r1="' + i + '">Attendance</span> <span class="dl" data-r2="' + i + '">Marks</span> <span class="dl" data-r3="' + i + '">Attainment</span> <span class="dl" data-r4="' + i + '">CO map</span>';
            } }
        ], prev)) +
        UI.hint('Archived reports open exactly like the reference cycle: consolidated attendance, internal mark report, attainment and the indirect mapping — each downloads as CSV.', '', 'info');
      var mk = function (idx, kind) {
        var p = prev[idx];
        var c = Q.courseById(p.a.courseId);
        var studs = Q.studentsOf(p.cls.id);
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', kind + ' — ' + p.a.courseId + ' · ' + p.cls.id + ' · SEM ' + p.sem + ' (2025–26)'],
          ['Faculty', me.name],
          ['Generated', Q.today()],
          []
        ];
        if (kind.indexOf('ATTENDANCE') === 0) {
          rows.push(['Register No', 'Student', 'Hours Conducted', 'Hours Attended', 'Attendance %']);
          studs.forEach(function (s) {
            var a = Q.attOf(s.id)[p.a.courseId] || { p: 20, t: 22 };
            rows.push([s.reg, s.name, a.t, a.p, Math.round(a.p / a.t * 100) + '%']);
          });
        } else if (kind.indexOf('INTERNAL') === 0) {
          rows.push(['Register No', 'Student', 'Internal I (20)', 'Quiz I (10)', 'Total']);
          studs.forEach(function (s) {
            var m = (Q.marksOf(s.id)[p.a.courseId] || {});
            rows.push([s.reg, s.name, m.I1 || 0, m.Q1 || 0, (m.I1 || 0) + (m.Q1 || 0)]);
          });
        } else if (kind.indexOf('ATTAINMENT') === 0) {
          rows.push(['Course', 'CO', 'Attainment %', 'Level']);
          (DB.courseCOs[p.a.courseId] || []).forEach(function (co) {
            rows.push([p.a.courseId, co.co, co.att, co.att >= 70 ? 'High' : co.att >= 55 ? 'Moderate' : 'Low']);
          });
        } else {
          rows.push(['CO', 'PO', 'Correlation level (1-3)']);
          Object.keys(DB.poMaps[p.a.courseId] || {}).forEach(function (co) {
            (DB.poMaps[p.a.courseId][co] || []).forEach(function (m) { rows.push([co, m.po, m.lvl]); });
          });
        }
        UI.downloadCSV(kind.replace(/\s+/g, '-') + '-' + p.a.courseId + '-' + p.cls.id + '-2025-26.csv', rows);
      };
      view.querySelectorAll('[data-r1]').forEach(function (el) { el.addEventListener('click', function () { mk(+el.getAttribute('data-r1'), 'CONSOLIDATED ATTENDANCE REPORT'); }); });
      view.querySelectorAll('[data-r2]').forEach(function (el) { el.addEventListener('click', function () { mk(+el.getAttribute('data-r2'), 'INTERNAL MARK REPORT'); }); });
      view.querySelectorAll('[data-r3]').forEach(function (el) { el.addEventListener('click', function () { mk(+el.getAttribute('data-r3'), 'ATTAINMENT REPORT'); }); });
      view.querySelectorAll('[data-r4]').forEach(function (el) { el.addEventListener('click', function () { mk(+el.getAttribute('data-r4'), 'CO MAPPING'); }); });
      var ex = document.getElementById('pvExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'PREVIOUS SEMESTER COURSES — FACULTY ARCHIVE'],
          ['Faculty', me.name],
          ['Generated', Q.today()],
          [],
          ['Course', 'Title', 'Class', 'Section Sem', 'Batch', 'Regulation', 'Marks entry']
        ];
        prev.forEach(function (p, i) { var c = Q.courseById(p.a.courseId); rows.push([p.a.courseId, c ? c.title : '', p.cls.id, p.sem, p.cls.batch, p.regulation, i === 3 ? 'Pending' : 'Completed']); });
        UI.downloadCSV('PreviousSemesterCourses.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── teacher/profile ............................. ── */
(function () {
MDTPAGE({
  role: 'teacher',
  folder: 'teacher',
  id: 'profile',
  render: function (view, ctx) {

    var t = ctx.person;
    var wl = Q.staffWorkload(t.id);
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>My Profile</h1><div class="sub">Faculty profile · ' + t.dept + '</div></div></div>' +
      '<div class="split-eq">' +
      '<div>' + '<div class="card glow glow-b accent-b">' + UI.photoBox(t, 'Your photo appears to students on courses, timetable and mentor pages.') + '</div>' +
      UI.card('Teaching identity', 'cap', UI.kv([
        ['Employee code', '<b class="mono">' + t.id + '</b>'],
        ['Designation', UI.esc(t.designation)],
        ['Department', DB.departments.filter(function (d) { return d.id === t.dept; }).map(function (d) { return UI.esc(d.name); })[0] || t.dept],
        ['Experience', t.exp + ' years'],
        ['Expertise', UI.esc(t.expertise)],
        ['Class advisor', t.advisorClass ? t.advisorClass + ' — OD/leave recommendations' : '—'],
        ['Mentor group', Q.mentorGroupsOf(t.id).length ? Q.mentorGroupsOf(t.id)[0].students.length + ' mentees (' + Q.mentorGroupsOf(t.id)[0].classId + ')' : '—'],
        ['Workload', wl.courses + ' courses · ' + wl.periods + ' periods/week']
      ])) + '</div>' +
      '<div>' + UI.card('Contact', 'idcard', UI.kv([
        ['Email', UI.esc(t.email)],
        ['Phone', UI.esc(t.phone)],
        ['Campus', DB.settings.institute]
      ])) +
      UI.card('My current allocations', 'layers', UI.table([
        { h: 'Course', render: function (r) { return '<b class="mono" style="color:var(--blue-ink)">' + r.courseId + '</b>'; } },
        { h: 'Title', render: function (r) { return UI.esc(Q.courseById(r.courseId).title); } },
        { h: 'Class', render: function (r) { return r.classId; } },
        { h: 'Allotted by', render: function (r) { return UI.esc(Q.name(r.assignedBy)); } }
      ], Q.allocationsOfTeacher(t.id))) +
      '</div></div>';

  }
});
})();

/* ── teacher/quizzes ............................. ── */
(function () {
MDTPAGE({
  role: 'teacher',
  folder: 'teacher',
  id: 'quizzes',
  render: function (view, ctx) {

    var t = ctx.person;
    var mine = DB.quizzes.filter(function (q) { return q.teacherId === t.id; });
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>Quizzes</h1><div class="sub">Course quiz windows and attempt analytics</div></div>' +
      '<div class="actions">' + (mine.length ? UI.expBtn('qzExp', 'Export analytics') : '') + '</div></div>' +
      '<div class="grid g2">' + mine.map(function (qz) {
        var att = DB.quizAttempts[qz.id] || {};
        var scores = Object.keys(att).map(function (k) { return att[k].score; });
        var avg = scores.length ? Math.round(scores.reduce(function (a, b) { return a + b; }, 0) / scores.length * 10) / 10 : 0;
        var top = Math.max.apply(null, scores.concat([0]));
        return '<div class="card glow glow-b accent-b"><div class="spread"><div><b class="mono" style="color:var(--blue-ink)">' + qz.courseId + '</b> <span style="font-size:12px;color:var(--text-2)">· ' + qz.classId + '</span>' +
          '<div style="font-size:13px;margin-top:2px"><b>' + UI.esc(qz.title) + '</b></div></div>' + UI.badge(qz.status === 'Open' ? 'Active' : 'Scheduled', qz.status) + '</div>' +
          '<div class="mt8" style="font-size:12px;color:var(--text-2)">' + UI.fmtDate(qz.opensAt) + ' – ' + UI.fmtDate(qz.closesAt) + ' · ' + qz.duration + ' min · max ' + qz.max + '</div>' +
          '<div class="mt8">' + UI.barsChart([
            { l: 'Attempts', v: Math.round(scores.length / Q.studentsOf(qz.classId).length * 100), n: scores.length + '/' + Q.studentsOf(qz.classId).length, tone: 'b' },
            { l: 'Class average', v: avg / qz.max * 100, n: avg + '/' + qz.max, tone: 'g' },
            { l: 'Top score', v: top / qz.max * 100, n: top + '/' + qz.max, tone: 'y' }
          ]) + '</div>' +
          '<div class="frow" style="justify-content:flex-start"><button class="btn sm ghost" data-at="' + qz.id + '">' + UI.icon('users') + 'Attempts</button></div></div>';
      }).join('') + '</div>';
    var qzex = document.getElementById('qzExp');
    if (qzex) qzex.addEventListener('click', function () {
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'QUIZ ANALYTICS — FACULTY VIEW'],
        ['Faculty', t.name],
        [],
        ['Course', 'Class', 'Quiz', 'Status', 'Attempts', 'Class size', 'Average', 'Top score', 'Max']
      ];
      mine.forEach(function (qz) {
        var att = DB.quizAttempts[qz.id] || {};
        var scores = Object.keys(att).map(function (k) { return att[k].score; });
        var avg = scores.length ? Math.round(scores.reduce(function (a, b) { return a + b; }, 0) / scores.length * 10) / 10 : 0;
        var top = Math.max.apply(null, scores.concat([0]));
        rows.push([qz.courseId, qz.classId, qz.title, qz.status, scores.length, Q.studentsOf(qz.classId).length, avg, top, qz.max]);
      });
      UI.downloadCSV('QuizAnalytics-' + t.id + '.csv', rows);
    });
    view.querySelectorAll('[data-at]').forEach(function (b) { b.addEventListener('click', function () {
      var qz = DB.quizzes.filter(function (x) { return x.id === b.getAttribute('data-at'); })[0];
      var att = DB.quizAttempts[qz.id] || {};
      var rows = Q.studentsOf(qz.classId).map(function (s) { return { s: s, a: att[s.id] }; });
      UI.modal({ title: qz.title + ' — attempts', lg: true, body: UI.table([
        { h: 'Student', render: function (r) { return UI.avatar(r.s, 28) + ' ' + UI.esc(r.s.name); } },
        { h: 'Attempted', render: function (r) { return r.a ? UI.esc(r.a.at) : '—'; } },
        { h: 'Score', render: function (r) { return r.a ? '<b class="num">' + r.a.score + '/' + qz.max + '</b>' : UI.badge('Pending', 'Not attempted'); } },
        { h: 'Performance', render: function (r) { return r.a ? UI.bar(Math.round(r.a.score / qz.max * 100), r.a.score / qz.max >= 0.7 ? 'g' : 'y') : ''; } }
      ], rows) + '<div class="chiprow mt8">' + UI.expBtn('qresExp', 'Export results CSV') + '</div>',
        actions: '<button class="btn pri" onclick="UI.closeModal()">Close</button>' });
      document.getElementById('qresExp').addEventListener('click', function () {
        var out = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'QUIZ RESULTS'],
          ['Quiz', qz.title],
          ['Course · Class', qz.courseId + ' · ' + qz.classId],
          ['Max marks', qz.max],
          [],
          ['Register No', 'Student', 'Attempted', 'Score', 'Percentage']
        ];
        rows.forEach(function (r) {
          out.push([r.s.reg, r.s.name, r.a ? r.a.at : 'Not attempted', r.a ? r.a.score : '—', r.a ? Math.round(r.a.score / qz.max * 100) + '%' : '—']);
        });
        UI.downloadCSV('QuizResults-' + qz.courseId + '.csv', out);
      });
    }); });

  }
});
})();

/* ── teacher/schedule ............................ ── */
(function () {
MDTPAGE({
  role: 'teacher',
  folder: 'teacher',
  id: 'schedule',
  render: function (view, ctx) {

    var t = ctx.person;
    var allocs = Q.allocationsOfTeacher(t.id);
    var state = { course: allocs[0] ? allocs[0].courseId : '' };
    function render() {
      var mySlots = DB.timetable.filter(function (s) { return s.teacherId === t.id; });
      var plan = DB.coursePlan.filter(function (p) { return p.courseId === state.course; });
      var cls = allocs.filter(function (a) { return a.courseId === state.course; }).map(function (a) { return a.classId; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>My Schedule</h1><div class="sub">Weekly allotment, course plan progress and reschedule requests</div></div>' +
        '<div class="actions"><button class="btn pri" id="rs-req">' + UI.icon('refresh') + 'Request reschedule</button></div></div>' +
        UI.card('Weekly periods — ' + t.name, 'calendar',
          '<div class="tblwrap"><table class="tbl"><thead><tr><th>Day</th><th>Periods</th></tr></thead><tbody>' +
          UI.DAYN.map(function (d, di) {
            var slots = mySlots.filter(function (s) { return s.day === di; }).sort(function (a, b) { return a.period - b.period; });
            return '<tr><td><b>' + d + '</b></td><td>' + (slots.length ? slots.map(function (s) {
              return '<span class="chip" style="margin:2px 4px 2px 0">' + s.period + ' · ' + s.courseId + ' · ' + s.classId + (s.lab ? ' (Lab)' : '') + '</span>';
            }).join('') : '<span style="color:var(--text-3)">—</span>') + '</td></tr>';
          }).join('') + '</tbody></table></div>') +
        '<div class="split">' +
        '<div>' + UI.card('Course plan — unit progress', 'layers',
          '<div class="rowflex mb8" style="margin-bottom:12px">' + allocs.map(function (a) {
            return '<span class="chip' + (state.course === a.courseId ? ' on' : '') + '" data-cp="' + a.courseId + '">' + a.courseId + ' · ' + a.classId + '</span>';
          }).join('') + '</div>' +
          UI.table([
            { h: 'Unit', render: function (r) { return '<b>U' + r.unit + '</b> · ' + r.week; } },
            { h: 'Topic', render: function (r) { return UI.esc(r.topic); } },
            { h: 'Status', render: function (r) { return UI.badge(r.status === 'Completed' ? 'Published' : r.status === 'In Progress' ? 'In Progress' : 'Scheduled', r.status); } },
            { h: 'Action', render: function (r) {
                return r.status !== 'Completed' ? '<button class="btn sm ghost-g" data-unit="' + r.unit + '" data-next="Completed">' + UI.icon('check') + 'Mark done</button>' : '';
            } }
          ], plan.filter(function (p) { return cls.indexOf(p.classId) >= 0; })) +
          '<div class="fhint">Unit status is instantly visible to students on their Courses page.</div>') + '</div>' +
        '<div>' +
        UI.card('Reschedule requests', 'refresh',
          ((DB.reschedules || []).filter(function (r) { return r.teacherId === t.id; }).length ? UI.table([
            { h: 'Course · Class', render: function (r) { return '<span class="mono">' + r.courseId + '</span> · ' + r.classId; } },
            { h: 'Change', render: function (r) { return UI.esc(r.from) + ' → ' + UI.esc(r.to); } },
            { h: 'Status', render: function (r) { return UI.badge(r.status === 'Approved' ? 'Approved' : 'Pending'); } }
          ], (DB.reschedules || []).filter(function (r) { return r.teacherId === t.id; })) : UI.empty('No reschedule requests', 'refresh', 'Approved changes update the class timetable for everyone.'))) +
        UI.card('Workload', 'trend', UI.barsChart([
          { l: 'Periods / week', v: mySlots.length / 30 * 100, n: mySlots.length, tone: 'b' },
          { l: 'Courses', v: allocs.length / 6 * 100, n: allocs.length, tone: 'g' },
          { l: 'Classes', v: allocs.map(function (a) { return a.classId; }).filter(function (v, i, arr) { return arr.indexOf(v) === i; }).length / 6 * 100, n: allocs.map(function (a) { return a.classId; }).filter(function (v, i, arr) { return arr.indexOf(v) === i; }).length, tone: 'y' }
        ])) +
        '</div></div>';
      view.querySelectorAll('[data-cp]').forEach(function (c) { c.addEventListener('click', function () { state.course = c.getAttribute('data-cp'); render(); }); });
      view.querySelectorAll('[data-unit]').forEach(function (b) { b.addEventListener('click', function () {
        var al = allocs.filter(function (a) { return a.courseId === state.course; })[0];
        WF.updateCoursePlan(t.id, al.classId, al.courseId, +b.getAttribute('data-unit'), b.getAttribute('data-next'));
        UI.toast('Course plan updated', state.course + ' — students of ' + al.classId + ' notified.', 'green');
        render();
      }); });
      document.getElementById('rs-req').addEventListener('click', function () {
        UI.modal({ title: 'Request a class reschedule', body:
          '<div class="fgrid">' +
          UI.field('rs-course', 'Course · Class', UI.select('rs-course', allocs.map(function (a) { return { v: a.courseId + '|' + a.classId, l: a.courseId + ' · ' + a.classId }; })), true) +
          UI.field('rs-from', 'Current slot', '<input class="input" id="rs-from" placeholder="e.g. P3 Thursday">', true) +
          '</div>' +
          UI.field('rs-to', 'Requested slot', '<input class="input" id="rs-to" placeholder="e.g. P6 Friday (Lab free)">', true) +
          UI.field('rs-reason', 'Reason', '<input class="input" id="rs-reason" placeholder="e.g. Conference travel, lab availability">', true) +
          '<div class="fhint">Reschedules are approved by the Academic Director; the class is notified after approval.</div>',
          actions: '<button class="btn pri" id="rs-go">' + UI.icon('send') + 'Send request</button>' });
        document.getElementById('rs-go').addEventListener('click', function () {
          var v = document.getElementById('rs-course').value.split('|');
          WF.rescheduleClass(t.id, v[1], v[0], { from: val('rs-from'), to: val('rs-to'), reason: val('rs-reason') });
          UI.closeModal(); UI.toast('Request sent', 'Awaiting the Academic Director\u2019s approval.', 'green'); render();
        });
      });
    }
    function val(id) { return document.getElementById(id).value.trim(); }
    render();

  }
});
})();

/* ── teacher/students ............................ ── */
(function () {
MDTPAGE({
  role: 'teacher',
  folder: 'teacher',
  id: 'students',
  render: function (view, ctx) {

    var t = ctx.person;
    var allocs = Q.allocationsOfTeacher(t.id);
    var classIds = allocs.map(function (a) { return a.classId; }).filter(function (v, i, arr) { return arr.indexOf(v) === i; });
    var state = { klass: classIds[0], q: '' };
    function render() {
      var students = Q.studentsOf(state.klass).filter(function (s) {
        return !state.q || (s.name + s.reg).toLowerCase().indexOf(state.q.toLowerCase()) >= 0;
      });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>My Students</h1><div class="sub">' + classIds.length + ' classes · ' + classIds.map(function (c) { return c; }).join(', ') + '</div></div>' +
        '<div class="actions">' + UI.expBtn('stExp', 'Export class list') + '</div></div>' +
        '<div class="rowflex" style="margin-bottom:16px">' + classIds.map(function (c) {
          return '<span class="chip' + (state.klass === c ? ' on' : '') + '" data-cl="' + c + '">' + c + ' (' + Q.studentsOf(c).length + ')</span>';
        }).join('') +
        '<span class="qsearch" style="margin-left:auto">' + UI.icon('search') + '<input class="input" id="st-q" placeholder="Search name or reg no" value="' + UI.esc(state.q) + '"></span></div>' +
        UI.card('Students — ' + state.klass, 'users', UI.table([
          { h: 'Student', render: function (r) { return UI.avatar(r, 30) + ' <b>' + UI.esc(r.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + r.reg + '</div>'; } },
          { h: 'Attendance', render: function (r) { var p = Q.attPctOverall(r.id); return UI.bar(p, p >= 85 ? 'g' : p >= 75 ? 'y' : 'r') + ' <b class="num">' + p + '%</b>'; } },
          { h: 'Assessment', render: function (r) { return '<span class="num">' + Q.totalOf(r.id) + '</span> / 180'; } },
          { h: 'CGPA', render: function (r) { return '<span class="num">' + r.cgpa.toFixed(2) + '</span>'; } },
          { h: 'Hostel', render: function (r) { return r.hostel ? '<span class="tag b">' + r.roomId + '</span>' : '<span class="tag n">day scholar</span>'; } },
          { h: 'Action', render: function (r) { return '<span class="dl" data-stu="' + r.id + '">Profile</span>'; } }
        ], students));
      view.querySelectorAll('[data-cl]').forEach(function (c) { c.addEventListener('click', function () { state.klass = c.getAttribute('data-cl'); render(); }); });
      var q = document.getElementById('st-q');
      q.addEventListener('input', function () { state.q = q.value; var pos = q.selectionStart; render(); var q2 = document.getElementById('st-q'); q2.focus(); q2.setSelectionRange(pos, pos); });
      var stex = document.getElementById('stExp');
      if (stex) stex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'CLASS LIST'],
          ['Class', state.klass],
          ['Faculty', t.name],
          [],
          ['Register No', 'Student', 'Attendance %', 'Aggregate /180', 'CGPA', 'Standing']
        ];
        Q.studentsOf(state.klass).forEach(function (s) {
          var p = Q.attPctOverall(s.id);
          rows.push([s.reg, s.name, p + '%', Q.totalOf(s.id), s.cgpa.toFixed(2), p >= 85 ? 'On track' : p >= 75 ? 'Adequate' : 'Condonation']);
        });
        UI.downloadCSV('ClassList-' + state.klass + '.csv', rows);
      });
      view.querySelectorAll('[data-stu]').forEach(function (el) { el.addEventListener('click', function () {
        var s = Q.studentById(el.getAttribute('data-stu'));
        UI.modal({ title: s.name, body:
          '<div style="display:flex;gap:14px;align-items:center;margin-bottom:12px">' + UI.avatar(s, 64) +
          '<div><b>' + UI.esc(s.name) + '</b><div style="font-size:12px;color:var(--text-2)">' + s.reg + ' · ' + s.classId + ' · Sem ' + s.sem + '</div></div></div>' +
          UI.kv([['Attendance', '<b>' + Q.attPctOverall(s.id) + '%</b>'], ['Assessment aggregate', Q.totalOf(s.id) + ' / 180'], ['CGPA', s.cgpa.toFixed(2)],
          ['Class rank', '#' + Q.rankOf(s.id).rank + ' of ' + Q.rankOf(s.id).of], ['Class advisor', UI.esc(Q.name(s.advisorId))],
          ['Hostel', s.hostel ? s.roomId + ' (' + (s.block === 'A' ? 'Boys' : 'Girls') + ' block)' : 'Day scholar'],
          ['Parent', UI.esc(s.parentName) + ' · ' + UI.esc(s.parentPhone)]]) });
      }); });
    }
    render();

  }
});
})();

/* ── academic/allocations ........................ ── */
(function () {
MDTPAGE({
  role: 'academic',
  folder: 'academic',
  id: 'allocations',
  render: function (view, ctx) {

    var teachers = DB.staff.filter(function (s) { return s.role === 'teacher'; });
    function render() {
      var al = DB.courseAllocations;
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Course Allocation</h1><div class="sub">Assign faculty to courses & classes — timetables and student schedules update instantly</div></div>' +
      '<div class="actions">' + UI.expBtn('alExp', 'Export allocations') + '</div></div>' +
        '<div class="actions"><button class="btn pri" id="newAl">' + UI.icon('plus') + 'New allocation</button></div></div>' +
        UI.card('Active allocations — ' + DB.settings.academicYear, 'layers', UI.table([
          { h: 'Class', render: function (r) { return '<b>' + r.classId + '</b> <span style="color:var(--text-2);font-size:11px">· sem ' + r.sem + '</span>'; } },
          { h: 'Course', render: function (r) { return '<span class="mono" style="color:var(--blue-ink)">' + r.courseId + '</span> · ' + UI.esc(Q.courseById(r.courseId).title.slice(0, 30)); } },
          { h: 'Faculty', render: function (r) { return UI.avatar(Q.person(r.teacherId), 28) + ' ' + UI.esc(Q.name(r.teacherId)); } },
          { h: 'Periods', render: function (r) { return '<span class="num">' + r.periods + '/wk</span>'; } },
          { h: 'Allotted', render: function (r) { return UI.fmtDate(r.assignedAt); } },
          { h: 'Action', render: function (r) { return '<button class="btn sm ghost" data-ral="' + r.id + '">' + UI.icon('edit') + 'Reassign</button>'; } }
        ], al)) +
        UI.card('Faculty workload balance', 'chart', UI.barsChart(teachers.map(function (t) {
          var wl = Q.staffWorkload(t.id);
          return { l: t.name.split(' ')[0] + ' ' + (t.name.split(' ')[1] || ''), v: wl.periods / 25 * 100, n: wl.periods + 'p · ' + wl.courses + 'c', tone: wl.periods > 20 ? 'r' : wl.periods > 14 ? 'y' : 'g' };
        })));
      document.getElementById('newAl').addEventListener('click', function () {
        UI.modal({ title: 'New / update allocation', body:
          '<div class="fgrid">' +
          UI.field('al-class', 'Class', UI.select('al-class', DB.classes.map(function (c) { return { v: c.id, l: c.id + ' · sem ' + c.sem }; })), true) +
          UI.field('al-course', 'Course', UI.select('al-course', DB.courses.map(function (c) { return { v: c.id, l: c.id + ' · ' + c.title.slice(0, 26) }; })), true) +
          '</div>' +
          UI.field('al-teacher', 'Faculty', UI.select('al-teacher', teachers.map(function (t) { return { v: t.id, l: t.name + ' · ' + t.designation }; })), true) +
          '<div class="fhint">Re-allocating an existing course moves it to the new faculty — timetable, materials and student pages follow automatically.</div>',
          actions: '<button class="btn pri" id="al-go">' + UI.icon('check') + 'Publish allocation</button>' });
        document.getElementById('al-go').addEventListener('click', function () {
          WF.allocateCourse('AD1', document.getElementById('al-class').value, document.getElementById('al-course').value, document.getElementById('al-teacher').value);
          UI.closeModal(); UI.toast('Allocation published', 'Faculty and class notified.', 'green'); render();
        });
      });
      view.querySelectorAll('[data-ral]').forEach(function (b) { b.addEventListener('click', function () {
        var a = DB.courseAllocations.filter(function (x) { return x.id === b.getAttribute('data-ral'); })[0];
        UI.modal({ title: 'Reassign — ' + a.courseId + ' · ' + a.classId, body:
          UI.field('ra-teacher', 'New faculty', UI.select('ra-teacher', teachers.map(function (t) { return { v: t.id, l: t.name + ' · ' + t.designation }; }), a.teacherId), true),
          actions: '<button class="btn pri" id="ra-go">' + UI.icon('check') + 'Confirm reassignment</button>' });
        document.getElementById('ra-go').addEventListener('click', function () {
          WF.allocateCourse('AD1', a.classId, a.courseId, document.getElementById('ra-teacher').value);
          UI.closeModal(); UI.toast('Course reassigned', 'New faculty and class notified.', 'green'); render();
        });
      }); });
    }
    render();

    /* v5-export:al handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#alExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'COURSE ALLOCATION REGISTER'],
        ['Generated', Q.today()],
        [],
        ['Course', 'Title', 'Class', 'Faculty', 'Periods/week']
      ];
      DB.courseAllocations.forEach(function (a) {
        var c = Q.courseById(a.courseId);
        rows.push([a.courseId, c ? c.title : '', a.classId, Q.name(a.teacherId), a.periods]);
      });
      UI.downloadCSV('CourseAllocations.csv', rows);
    });

  }
});
})();

/* ── academic/curriculum ......................... ── */
(function () {
MDTPAGE({
  role: 'academic',
  folder: 'academic',
  id: 'curriculum',
  render: function (view, ctx) {

    var state = { cu: 'CU1' };
    function render() {
      var cu = DB.curriculum.filter(function (c) { return c.id === state.cu; })[0] || DB.curriculum[0];
      var courses = DB.courses.filter(function (c) { return cu.dept === 'GEN' || c.dept === cu.dept; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Curriculum &amp; Syllabus Mapping</h1><div class="sub">Programme-wise regulations, batches and syllabus versions — the single source for every allocation and lesson plan</div></div>' +
        '<div class="actions">' + UI.expBtn('cuExp', 'Export mapping') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'layers', value: DB.curriculum.length, label: 'Programme records' }) +
        UI.stat({ tone: 'g', icon: 'checkc', value: DB.curriculum.filter(function (c) { return c.status === 'Current'; }).length, label: 'Current regulations' }) +
        UI.stat({ tone: 'y', icon: 'calendar', value: DB.curriculum.filter(function (c) { return c.review && c.review !== '—'; }).length, label: 'Reviews scheduled' }) +
        UI.stat({ tone: 'r', icon: 'grid', value: DB.curriculum.reduce(function (a, c) { return a + c.courses; }, 0), label: 'Courses (all regulations)' }) +
        '</div>' +
        '<div class="rowflex mb16">' + UI.chiprow(DB.curriculum.map(function (c) { return { v: c.id, l: c.dept + ' · ' + c.regulation }; }), state.cu) + '</div>' +
        '<div class="split">' +
        '<div>' + UI.card(cu.programme, 'cap', UI.kv([
          ['Department', cu.dept],
          ['Regulation', '<b>' + cu.regulation + '</b>'],
          ['Batches', cu.batches.join(', ')],
          ['Semesters', cu.sems || '—'],
          ['Courses', cu.courses],
          ['Syllabus version', UI.esc(cu.syllabusVersion)],
          ['Next review', cu.review !== '—' ? UI.fmtDate(cu.review) : '—'],
          ['Status', UI.badge(cu.status)],
          ['Notes', UI.esc(cu.notes)]
        ])) + UI.card('Mapping register — all programmes', 'list', UI.table([
          { h: 'Programme', render: function (c) { return '<b>' + UI.esc(c.programme) + '</b>'; } },
          { h: 'Dept', render: function (c) { return c.dept; } },
          { h: 'Regulation', render: function (c) { return c.regulation; } },
          { h: 'Batches', render: function (c) { return c.batches.join(', '); } },
          { h: 'Syllabus', render: function (c) { return UI.esc(c.syllabusVersion); } },
          { h: 'Status', render: function (c) { return UI.badge(c.status); } }
        ], DB.curriculum)) + '</div>' +
        '<div>' + UI.card('Course units & syllabus coverage — ' + cu.regulation + ' ' + cu.dept, 'grid', UI.table([
          { h: 'Course', render: function (c) { return '<span class="mono" style="color:var(--blue-ink)">' + c.id + '</span>'; } },
          { h: 'Title', render: function (c) { return UI.esc(c.title.slice(0, 36)); } },
          { h: 'Sem', render: function (c) { return c.sem; } },
          { h: 'Credits', render: function (c) { return c.credits; } },
          { h: 'Type', render: function (c) { return c.type; } },
          { h: 'Units', render: function (c) { return (DB.courseCOs[c.id] || []).length + ' COs'; } },
          { h: 'Action', render: function (c) { return '<span class="dl" data-syl="' + c.id + '">Syllabus</span>'; } }
        ], courses)) + '</div>' +
        '</div>';
      view.querySelectorAll('.chip[data-f]').forEach(function (c) { c.addEventListener('click', function () { state.cu = c.getAttribute('data-f'); render(); }); });
      view.querySelectorAll('[data-syl]').forEach(function (el) { el.addEventListener('click', function () {
        var c = Q.courseById(el.getAttribute('data-syl'));
        var plan = UNITS_of(c);
        UI.modal({ title: c.id + ' — ' + c.title, body: UI.kv([['Credits', c.credits], ['Semester', c.sem], ['Type', c.type], ['Regulation', cu.regulation]]) +
          '<div style="margin-top:10px;font-size:12.5px;color:var(--text-2)"><b>Unit coverage</b><ol style="margin:4px 0 0 18px">' + plan.map(function (u) { return '<li>' + UI.esc(u) + '</li>'; }).join('') + '</ol></div>',
          actions: '<button class="btn pri" onclick="UI.closeModal()">Close</button>' });
      }); });
      function UNITS_of(c) {
        var p = DB.coursePlan.filter(function (x) { return x.courseId === c.id; });
        if (p.length) return p.map(function (x) { return x.topic; });
        return ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'];
      }
      var ex = document.getElementById('cuExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'CURRICULUM / SYLLABUS MAPPING'],
          ['Generated', Q.today()],
          [],
          ['Programme', 'Department', 'Regulation', 'Batches', 'Semesters', 'Courses', 'Syllabus version', 'Next review', 'Status', 'Notes']
        ];
        DB.curriculum.forEach(function (c) { rows.push([c.programme, c.dept, c.regulation, c.batches.join(' '), c.sems, c.courses, c.syllabusVersion, c.review, c.status, c.notes]); });
        UI.downloadCSV('Curriculum-Mapping.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── academic/dashboard .......................... ── */
(function () {
MDTPAGE({
  role: 'academic',
  folder: 'academic',
  id: 'dashboard',
  render: function (view, ctx) {

    var me = ctx.person;
    var odPend = DB.odRequests.filter(function (r) { return r.status === 'Recommended'; });
    var lvPend = DB.leaveRequests.filter(function (r) { return r.status === 'Recommended'; });
    var ouPend = DB.outingRequests.filter(function (r) { return r.adStatus === 'Pending' && (r.status === 'Pending' || r.status === 'Warden Approved'); });
    var rsPend = (DB.reschedules || []).filter(function (r) { return r.status === 'Pending'; });
    var classes = DB.classes;
    view.innerHTML =
      '<div class="pagehead"><span style="display:flex;gap:14px;align-items:center">' + UI.avatar(me, 44) +
      '<span><h1>' + UI.esc(me.name) + '</h1><div class="sub">' + UI.esc(me.designation) + ' · academic governance across ' + classes.length + ' classes</div></span></span></div>' +
      '<div class="statrow">' +
      UI.stat({ tone: 'y', icon: 'door', value: odPend.length, label: 'OD awaiting approval', href: 'od.html' }) +
      UI.stat({ tone: 'b', icon: 'key', value: lvPend.length, label: 'Leave awaiting approval', href: 'leaves.html' }) +
      UI.stat({ tone: 'r', icon: 'bed', value: ouPend.length, label: 'Night outings (dual chain)', href: 'outing.html' }) +
      UI.stat({ tone: 'g', icon: 'refresh', value: rsPend.length, label: 'Reschedule requests', href: 'timetable.html' }) +
      '</div>' +
      '<div class="split">' +
      '<div>' + UI.card('Class pulse — attendance & assessment', 'chart', UI.table([
        { h: 'Class', render: function (r) { return '<b>' + r.id + '</b>'; } },
        { h: 'Advisor', render: function (r) { return UI.esc(Q.name(r.advisor)); } },
        { h: 'Students', render: function (r) { return '<span class="num">' + Q.studentsOf(r.id).length + '</span>'; } },
        { h: 'Attendance avg', render: function (r) { var p = Q.classAttAvg(r.id); return UI.bar(p, p >= 80 ? 'g' : 'y') + ' <b class="num">' + p + '%</b>'; } },
        { h: 'At-risk', render: function (r) { var n = Q.atRisk(r.id).length; return n ? UI.badge('Overdue', n + ' below 75%') : UI.badge('Approved', 'clear'); } }
      ], classes)) +
      UI.card('Course allotment coverage', 'layers', UI.barsChart(classes.map(function (c) {
        var al = Q.allocationsOf(c.id);
        return { l: c.id, v: al.length / 6 * 100, n: al.length + '/6', tone: 'b' };
      }))) + '</div>' +
      '<div>' + UI.card('Waiting on you', 'door',
        (odPend.length + lvPend.length + ouPend.length + rsPend.length ?
          odPend.slice(0, 3).map(function (r) { var s = Q.studentById(r.studentId);
            return '<a class="lrow" href="od.html"><span class="ic" style="color:var(--g-yellow)">' + UI.icon('door') + '</span><span class="lmain"><b>' + UI.esc(s.name) + ' — OD</b><span>' + UI.esc(r.event) + ' · ' + UI.fmtDate(r.date) + '</span></span>' + UI.badge('Recommended') + '</a>'; }).join('') +
          ouPend.slice(0, 2).map(function (r) { var s = Q.studentById(r.studentId);
            return '<a class="lrow" href="outing.html"><span class="ic" style="color:var(--g-red)">' + UI.icon('bed') + '</span><span class="lmain"><b>' + UI.esc(s.name) + ' — night outing</b><span>' + UI.esc(r.place) + ' · warden: ' + r.status + '</span></span>' + UI.badge('Pending') + '</a>'; }).join('') +
          rsPend.slice(0, 2).map(function (r) {
            return '<a class="lrow" href="timetable.html"><span class="ic" style="color:var(--g-blue)">' + UI.icon('refresh') + '</span><span class="lmain"><b>Reschedule — ' + r.courseId + '</b><span>' + r.classId + ' · ' + UI.esc(r.reason) + '</span></span>' + UI.badge('Pending') + '</a>'; }).join('')
        : UI.empty('Queue is clear', 'checkc'))) +
      UI.card('Governance notes', 'shield',
        '<ul style="margin:4px 0 0 16px;padding:0;font-size:12.5px;color:var(--text-2);line-height:1.9">' +
        '<li>Hosteller ODs auto-inform the warden once you approve — the gate register is updated.</li>' +
        '<li>Overnight outings need both the warden\u2019s and your approval.</li>' +
        '<li>Course allotments you publish flow to faculty timetables and student schedules immediately.</li>' +
        '<li>Leave beyond ' + DB.settings.wf.longLeaveDays + ' days is countersigned by the Principal.</li></ul>') +
      '</div></div>';

  }
});
})();

/* ── academic/leaves ............................. ── */
(function () {
MDTPAGE({
  role: 'academic',
  folder: 'academic',
  id: 'leaves',
  render: function (view, ctx) {

    function render() {
      var pend = DB.leaveRequests.filter(function (r) { return r.status === 'Recommended'; });
      var hist = DB.leaveRequests.filter(function (r) { return r.status === 'Approved' || r.status === 'Rejected' || r.status === 'AD Approved'; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Leave Approvals</h1><div class="sub">Advisor-recommended leave · beyond ' + DB.settings.wf.longLeaveDays + ' days goes to the Principal after you</div></div>' +
      '<div class="actions">' + UI.expBtn('lvExp', 'Export log') + '</div></div>' +
        (pend.length ? '<div class="grid g2">' + pend.map(function (r) {
          var s = Q.studentById(r.studentId);
          return '<div class="card glow glow-y accent-y"><div class="spread">' +
            '<div style="display:flex;gap:10px;align-items:center">' + UI.avatar(s, 40) + '<span><b>' + UI.esc(s.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + s.reg + ' · ' + s.classId + '</div></span></div>' +
            UI.badge('Recommended') + '</div>' +
            '<div class="mt8"><b>' + UI.esc(r.type) + ' · ' + r.days + ' day(s)</b><div style="font-size:12px;color:var(--text-2)">' + UI.fmtDate(r.from) + ' → ' + UI.fmtDate(r.to) + (r.principalId ? ' · Principal countersign next' : '') + '</div></div>' +
            '<div class="mt8" style="font-size:12.5px;color:var(--text-2)">' + UI.esc(r.reason) + '</div>' +
            '<div class="mt8">' + UI.timeline(r.timeline) + '</div>' +
            '<div class="frow" style="justify-content:flex-start">' +
            '<button class="btn ok" data-lap="' + r.id + '">' + UI.icon('check') + 'Approve</button>' +
            '<button class="btn ghost-r" data-lrj="' + r.id + '">' + UI.icon('x') + 'Reject</button></div></div>';
        }).join('') + '</div>' : UI.empty('No leave requests awaiting approval', 'checkc')) +
        UI.card('History', 'list', UI.table([
          { h: 'Student', render: function (r) { var s = Q.studentById(r.studentId); return UI.avatar(s, 28) + ' ' + UI.esc(s.name); } },
          { h: 'Type', render: function (r) { return r.type + ' · ' + r.days + 'd'; } },
          { h: 'Window', render: function (r) { return UI.fmtDate(r.from) + ' → ' + UI.fmtDate(r.to); } },
          { h: 'Status', render: function (r) { return UI.badge(r.status); } }
        ], hist)) +
        '<div class="mt16"></div>' +
        UI.card('Staff leave &amp; faculty swap approvals — HRMS', 'users',
          (function () {
            var pend2 = DB.staffLeaves.filter(function (l) { return l.status === 'Submitted' || l.status === 'Recommended'; });
            if (!pend2.length) return UI.empty('No staff leave requests pending', 'checkc');
            return '<div class="grid g2">' + pend2.map(function (l) {
              var t = Q.person(l.staffId);
              return '<div class="card" style="box-shadow:none;border-style:dashed;margin:0"><div class="spread">' +
                '<div style="display:flex;gap:10px;align-items:center">' + UI.avatar(t, 36) + '<span><b>' + UI.esc(t.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + UI.esc(t.designation) + '</div></span></div>' + UI.badge(l.status) + '</div>' +
                '<div class="mt8">' + UI.kv([['Type', l.type + (l.mode === 'Hours' ? ' · ' + l.hours : ' · ' + (l.days || 1) + ' day(s)')],
                  ['Window', UI.fmtDate(l.from) + ' → ' + UI.fmtDate(l.to)], ['Reason', UI.esc(l.reason)],
                  ['Faculty swap', l.swapTo ? UI.esc(Q.name(l.swapTo)) + ' — ' + (l.swapStatus || 'pending') : 'none proposed']]) + '</div>' +
                '<div class="frow" style="justify-content:flex-start">' +
                '<button class="btn sm ok" data-slap="' + l.id + '">' + UI.icon('check') + 'Approve</button>' +
                '<button class="btn sm ghost-r" data-slrj2="' + l.id + '">' + UI.icon('x') + 'Reject</button></div></div>';
            }).join('') + '</div>';
          })()) +
        '<div class="mt8"></div>' +
        UI.card('Staff leave register', 'list', UI.table([
          { h: 'Staff', render: function (l) { return UI.esc(Q.name(l.staffId)); } },
          { h: 'Type', render: function (l) { return l.type + (l.mode === 'Hours' ? ' · ' + l.hours : ' · ' + (l.days || 1) + 'd'); } },
          { h: 'Window', render: function (l) { return UI.fmtDate(l.from) + ' → ' + UI.fmtDate(l.to); } },
          { h: 'Swap', render: function (l) { return l.swapTo ? UI.esc(Q.name(l.swapTo)) + ' · ' + (l.swapStatus || '—') : '—'; } },
          { h: 'Status', render: function (l) { return UI.badge(l.status); } }
        ], DB.staffLeaves));
      view.querySelectorAll('[data-lap]').forEach(function (b) { b.addEventListener('click', function () {
        WF.decideLeave(b.getAttribute('data-lap'), 'AD1', true, '');
        UI.toast('Leave approved', 'Student notified.', 'green'); render();
      }); });
      view.querySelectorAll('[data-lrj]').forEach(function (b) { b.addEventListener('click', function () {
        WF.decideLeave(b.getAttribute('data-lrj'), 'AD1', false, 'Not approved at the director level.');
        UI.toast('Leave rejected', 'Student notified.', 'red'); render();
      }); });
      view.querySelectorAll('[data-slap]').forEach(function (b) { b.addEventListener('click', function () {
        WF.decideStaffLeave(b.getAttribute('data-slap'), true, 'Class arrangements confirmed');
        UI.toast('Staff leave approved', 'Faculty notified — timetable notes updated.', 'green'); render();
      }); });
      view.querySelectorAll('[data-slrj2]').forEach(function (b) { b.addEventListener('click', function () {
        WF.decideStaffLeave(b.getAttribute('data-slrj2'), false, 'Not approved — department load');
        UI.toast('Staff leave rejected', 'Faculty notified.', 'red'); render();
      }); });
    }
    render();

    /* v5-export:lv handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#lvExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'LEAVE APPROVAL LOG'],
        ['Generated', Q.today()],
        [],
        ['Register No', 'Student', 'Class', 'Type', 'From', 'To', 'Days', 'Status']
      ];
      DB.leaveRequests.forEach(function (r) {
        var st = Q.studentById(r.studentId);
        rows.push([st ? st.reg : '—', st ? st.name : '—', st ? st.classId : '—', r.type, r.from, r.to, r.days || '—', r.status]);
      });
      UI.downloadCSV('Leave-ApprovalLog.csv', rows);
    });

  }
});
})();

/* ── academic/od ................................. ── */
(function () {
MDTPAGE({
  role: 'academic',
  folder: 'academic',
  id: 'od',
  render: function (view, ctx) {

    function render() {
      var pend = DB.odRequests.filter(function (r) { return r.status === 'Recommended'; });
      var hist = DB.odRequests.filter(function (r) { return r.status === 'Approved' || r.status === 'Rejected'; }).slice(0, 6);
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>OD Approvals</h1><div class="sub">Recommended by class advisors · final decision rests here</div></div>' +
      '<div class="actions">' + UI.expBtn('odExp', 'Export log') + '</div></div>' +
        (pend.length ? '<div class="grid g2">' + pend.map(function (r) {
          var s = Q.studentById(r.studentId);
          return '<div class="card glow glow-y accent-y"><div class="spread">' +
            '<div style="display:flex;gap:10px;align-items:center">' + UI.avatar(s, 40) + '<span><b>' + UI.esc(s.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + s.reg + ' · ' + s.classId + (r.hosteller ? ' · hosteller (' + s.roomId + ')' : '') + '</div></span></div>' +
            UI.badge('Recommended') + '</div>' +
            '<div class="mt8"><b style="font-size:14px">' + UI.esc(r.event) + '</b><div style="font-size:12px;color:var(--text-2)">' + UI.esc(r.venue) + ' · ' + UI.fmtDate(r.date) + ' · ' + r.session + '</div></div>' +
            '<div class="mt8" style="font-size:12.5px;color:var(--text-2)"><b>Reason:</b> ' + UI.esc(r.reason) + '</div>' +
            '<div class="mt8">' + UI.timeline(r.timeline) + '</div>' +
            '<div class="frow" style="justify-content:flex-start">' +
            '<button class="btn ok" data-ap="' + r.id + '">' + UI.icon('check') + 'Approve OD</button>' +
            '<button class="btn ghost-r" data-rj="' + r.id + '">' + UI.icon('x') + 'Reject</button></div></div>';
        }).join('') + '</div>' : UI.empty('No OD requests awaiting approval', 'checkc', 'Advisor recommendations land here.')) +
        UI.card('Recent decisions', 'list', UI.table([
          { h: 'Student', render: function (r) { var s = Q.studentById(r.studentId); return UI.avatar(s, 28) + ' ' + UI.esc(s.name) + '<div style="font-size:11px;color:var(--text-2)">' + s.classId + '</div>'; } },
          { h: 'Event', render: function (r) { return UI.esc(r.event); } },
          { h: 'Date', render: function (r) { return UI.fmtDate(r.date); } },
          { h: 'Outcome', render: function (r) { return UI.badge(r.status); } }
        ], hist));
      view.querySelectorAll('[data-ap]').forEach(function (b) { b.addEventListener('click', function () {
        var id = b.getAttribute('data-ap');
        UI.modal({ title: 'Approve this OD?', body: '<div class="fld"><label>Remarks (optional)</label><textarea class="input" id="ap-note" placeholder="Recorded on the student\u2019s timeline"></textarea></div>',
          actions: '<button class="btn ok" id="ap-go">' + UI.icon('check') + 'Confirm approval</button><button class="btn" onclick="UI.closeModal()">Cancel</button>' });
        document.getElementById('ap-go').addEventListener('click', function () {
          WF.decideOd(id, true, document.getElementById('ap-note').value.trim());
          UI.closeModal(); UI.toast('OD approved', 'Student notified' + (Q.studentById(DB.odRequests.filter(function (r) { return r.id === id; })[0].studentId).hostel ? ' · warden informed' : ''), 'green');
          render();
        });
      }); });
      view.querySelectorAll('[data-rj]').forEach(function (b) { b.addEventListener('click', function () {
        var id = b.getAttribute('data-rj');
        UI.modal({ title: 'Reject this OD?', body: '<div class="fld"><label>Reason for the student</label><textarea class="input" id="rj-note" placeholder="e.g. Insufficient proof"></textarea></div>',
          actions: '<button class="btn danger" id="rj-go">' + UI.icon('x') + 'Confirm rejection</button><button class="btn" onclick="UI.closeModal()">Cancel</button>' });
        document.getElementById('rj-go').addEventListener('click', function () {
          WF.decideOd(id, false, document.getElementById('rj-note').value.trim() || 'Rejected at the director level.');
          UI.closeModal(); UI.toast('OD rejected', 'Student notified.', 'red'); render();
        });
      }); });
    }
    render();

    /* v5-export:od handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#odExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'OD APPROVAL LOG'],
        ['Generated', Q.today()],
        [],
        ['Register No', 'Student', 'Class', 'Event', 'Venue', 'Date', 'Session', 'Status']
      ];
      DB.odRequests.forEach(function (r) {
        var st = Q.studentById(r.studentId);
        rows.push([st ? st.reg : '—', st ? st.name : '—', st ? st.classId : '—', r.event, r.venue, r.date, r.session, r.status]);
      });
      UI.downloadCSV('OD-ApprovalLog.csv', rows);
    });

  }
});
})();

/* ── academic/outing ............................. ── */
(function () {
MDTPAGE({
  role: 'academic',
  folder: 'academic',
  id: 'outing',
  render: function (view, ctx) {


    function render() {
      var pend = DB.outingRequests.filter(function (r) { return r.adStatus === 'Pending' && (r.status === 'Pending' || r.status === 'Warden Approved'); });
      var hist = DB.outingRequests.filter(function (r) { return r.type === 'Night' && (r.status === 'Approved' || r.status === 'Rejected'); });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Night Outing Approvals</h1><div class="sub">Overnight outings need the warden\u2019s clearance plus the Academic Director\u2019s consent</div></div>' +
      '<div class="actions">' + UI.expBtn('ouExp', 'Export log') + '</div></div>' +
        (pend.length ? UI.hint('These requests remain subject to the warden\u2019s own decision of the block — approve only after the warden\u2019s stage is cleared when shown.', '', 'info') : '') +
        '<div class="grid g2">' + (pend.length ? pend.map(function (r) {
          var s = Q.studentById(r.studentId);
          return '<div class="card glow glow-y accent-y"><div class="spread">' +
            '<div style="display:flex;gap:10px;align-items:center">' + UI.avatar(s, 40) + '<span><b>' + UI.esc(s.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + s.reg + ' · ' + s.roomId + ' (' + Q.genderLabel(s.gender) + ' block)</div></span></div>' +
            UI.badge('Pending') + '</div>' +
            '<div class="mt8"><b>' + UI.esc(r.place) + '</b><div style="font-size:12px;color:var(--text-2)">' + r.type + ' · out ' + UI.esc(r.out) + ' · in ' + UI.esc(r.in) + '</div></div>' +
            '<div class="mt8" style="font-size:12.5px;color:var(--text-2)">' + UI.esc(r.reason) + '</div>' +
            (r.deadline ? '<div class="tk-meta" style="margin:8px 0 0">' + UI.reqDeadlineChip(r.deadline) + '<span class="fhint">decision requested by the student</span></div>' : '') +
            '<div class="mt8">' + UI.timeline(r.timeline) + '</div>' +
            '<div class="frow" style="justify-content:flex-start">' +
            '<button class="btn ok" data-ouap="' + r.id + '">' + UI.icon('check') + 'Approve</button>' +
            '<button class="btn ghost-r" data-ourj="' + r.id + '">' + UI.icon('x') + 'Reject</button></div></div>';
        }).join('') : '<div class="card">' + UI.empty('No overnight outings in the chain', 'checkc') + '</div>') + '</div>' +
        UI.card('Night outing history', 'list', UI.table([
          { h: 'Student', render: function (r) { var s = Q.studentById(r.studentId); return UI.avatar(s, 28) + ' ' + UI.esc(s.name); } },
          { h: 'Place', render: function (r) { return UI.esc(r.place); } },
          { h: 'Window', render: function (r) { return UI.esc(r.out) + ' → ' + UI.esc(r.in); } },
          { h: 'Warden', render: function (r) { return UI.esc(Q.name(r.wardenId)); } },
          { h: 'Outcome', render: function (r) { return UI.badge(r.status); } }
        ], hist));
      view.querySelectorAll('[data-ouap]').forEach(function (b) { b.addEventListener('click', function () {
        WF.decideOutingAD(b.getAttribute('data-ouap'), true, 'Overnight consent granted.');
        UI.toast('Outing approved', 'Student and warden notified.', 'green'); render();
      }); });
      view.querySelectorAll('[data-ourj]').forEach(function (b) { b.addEventListener('click', function () {
        WF.decideOutingAD(b.getAttribute('data-ourj'), false, 'Overnight consent declined.');
        UI.toast('Outing rejected', 'Student notified.', 'red'); render();
      }); });
    }
    render();

    /* v5-export:ou handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#ouExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'NIGHT OUTING APPROVAL LOG'],
        ['Generated', Q.today()],
        [],
        ['Register No', 'Student', 'Block', 'Place', 'Out', 'In', 'Requested deadline', 'Status', 'AD stage']
      ];
      DB.outingRequests.filter(function (r) { return r.type === 'Night'; }).forEach(function (r) {
        var st = Q.studentById(r.studentId);
        rows.push([st ? st.reg : '—', st ? st.name : '—', st ? st.block : '—', r.place, r.out, r.in, r.deadline || '—', r.status, r.adStatus || '—']);
      });
      UI.downloadCSV('NightOuting-ApprovalLog.csv', rows);
    });
  }
});
})();

/* ── academic/profile ............................ ── */
(function () {
MDTPAGE({
  role: 'academic',
  folder: 'academic',
  id: 'profile',
  render: function (view, ctx) {

    var me = ctx.person;
    var odDone = DB.odRequests.filter(function (r) { return r.status === 'Approved'; }).length;
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>My Profile</h1><div class="sub">Academic Director · ' + UI.esc(DB.departments.filter(function (d) { return d.id === me.dept; })[0].name) + '</div></div></div>' +
      '<div class="split-eq">' +
      '<div>' +
        '<div class="card glow glow-y accent-y">' + UI.photoBox(me, 'Your photo appears on approval notices and the faculty directory.') + '</div>' +
        UI.card('Academic office', 'cap', UI.kv([
          ['Employee code', '<b class="mono">' + me.id + '</b>'],
          ['Designation', UI.esc(me.designation)],
          ['Department', UI.esc(DB.departments.filter(function (d) { return d.id === me.dept; })[0].name)],
          ['Expertise', UI.esc(me.expertise)],
          ['Experience', me.exp + ' years'],
          ['Academic year', DB.settings.academicYear + ' · Semester ' + DB.settings.currentSem]
        ])) +
        UI.card('Approvals in your hands', 'checkc', '<ul style="margin:4px 0 0 16px;padding:0;font-size:12.5px;color:var(--text-2);line-height:1.9">' +
          '<li><b>OD requests</b> — final approval after the class advisor recommends.</li>' +
          '<li><b>Overnight outings</b> — second consent after the block warden approves.</li>' +
          '<li><b>Long leave</b> — recommendation to the Principal for countersignature.</li>' +
          '<li><b>Class reschedules</b> — teacher requests routed for your clearance.</li>' +
          '<li><b>Semester results</b> — publication switch rests with your office.</li></ul>') +
      '</div>' +
      '<div>' +
        UI.card('Contact', 'idcard', UI.kv([
          ['Email', UI.esc(me.email)],
          ['Phone', UI.esc(me.phone)],
          ['Campus', DB.settings.institute + ', ' + DB.settings.city]
        ])) +
        UI.card('Allocation & curriculum scope', 'layers', '<ul style="margin:4px 0 0 16px;padding:0;font-size:12.5px;color:var(--text-2);line-height:1.9">' +
          '<li>Assign courses to faculty and balance teaching workload across departments.</li>' +
          '<li>Approve timetable changes and room reassignments proposed by faculty.</li>' +
          '<li>Co-govern hostel residents together with the wardens of both blocks.</li>' +
          '<li>' + odDone + ' OD requests approved this semester — every decision notifies the student, advisor and warden instantly.</li></ul>') +
        UI.card('Account', 'shield', UI.kv([
          ['Role', '<b>' + UI.esc(ctx.role) + '</b> — Academic Director'],
          ['Access', 'Academics, approvals, allocations, reports'],
          ['Sign-in', UI.esc(ctx.user.lastLogin)]
        ])) +
      '</div></div>';

  }
});
})();

/* ── academic/reports ............................ ── */
(function () {
MDTPAGE({
  role: 'academic',
  folder: 'academic',
  id: 'reports',
  render: function (view, ctx) {

    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>Class Reports</h1><div class="sub">Attendance, assessment and outcome analytics by class</div></div>' +
      '<div class="actions"><button class="btn ghost" id="dlRep">' + UI.icon('download') + 'Export summary</button></div></div>' +
      '<div class="split">' +
      '<div>' + UI.card('Attendance by class', 'chart', UI.barsChart(DB.classes.map(function (c) {
        var v = Q.classAttAvg(c.id);
        return { l: c.id, v: v, n: v + '%', tone: v >= 82 ? 'g' : v >= 75 ? 'y' : 'r' };
      }))) +
      UI.card('Assessment average by class', 'trend', UI.barsChart(DB.classes.map(function (c) {
        var v = Q.classAvgTotal(c.id);
        return { l: c.id, v: v / 180 * 100, n: v + '/180', tone: 'b' };
      }))) + '</div>' +
      '<div>' + UI.card('Class summary', 'list', UI.table([
        { h: 'Class', render: function (r) { return '<b>' + r.id + '</b>'; } },
        { h: 'Students', render: function (r) { return '<span class="num">' + Q.studentsOf(r.id).length + '</span>'; } },
        { h: 'Attendance', render: function (r) { return Q.classAttAvg(r.id) + '%'; } },
        { h: 'At-risk', render: function (r) { var n = Q.atRisk(r.id).length; return n ? UI.badge('Overdue', n) : UI.badge('Approved', '0'); } },
        { h: 'Topper', render: function (r) { var t = Q.rankList(r.id)[0]; return UI.esc(t.name); } },
        { h: 'Fee cleared', render: function (r) { var st = Q.studentsOf(r.id); var ok = st.filter(function (s) { return Q.duesOf(s.id).total <= DB.settings.wf.feeGrace; }).length; return '<span class="num">' + ok + '/' + st.length + '</span>'; } }
      ], DB.classes)) +
      UI.card('Watch indicators', 'shield', '<ul style="margin:4px 0 0 16px;padding:0;font-size:12.5px;color:var(--text-2);line-height:1.9">' +
      '<li>Any class below 80% average attendance triggers a advisor-level review.</li>' +
      '<li>Assessment averages below 60% call for a curriculum pacing review.</li>' +
      '<li>Fee clearance below 90% of a class holds hall ticket batches.</li></ul>') + '</div></div>';
    document.getElementById('dlRep').addEventListener('click', function () {
      var rows = [
        ['Class Report — ' + DB.settings.institute, ''],
        ['Generated', Q.today()],
        [],
        ['Class', 'Students', 'Attendance %', 'Assessment (of 180)', 'At-risk']
      ];
      DB.classes.forEach(function (c) {
        rows.push([c.id, Q.studentsOf(c.id).length, Q.classAttAvg(c.id), Q.classAvgTotal(c.id), Q.atRisk(c.id).length]);
      });
      UI.downloadCSV('Class-Report-' + Q.today() + '.csv', rows);
    });

  }
});
})();

/* ── academic/semesters .......................... ── */
(function () {
MDTPAGE({
  role: 'academic',
  folder: 'academic',
  id: 'semesters',
  render: function (view, ctx) {

    function render() {
      var sems = DB.classes.map(function (c) {
        return { c: c, avg: Q.classAvgTotal(c.id), att: Q.classAttAvg(c.id) };
      });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Semesters & Results</h1><div class="sub">Semester lifecycle, result publication and class outcomes</div></div>' +
      '<div class="actions">' + UI.expBtn('seExp', 'Export results') + '</div></div>' +
        '<div class="actions"><button class="btn pri" id="pubRes">' + UI.icon('send') + 'Publish assessment results</button></div></div>' +
        UI.card('Running semesters', 'cap', UI.table([
          { h: 'Semester', render: function (r) { return '<b>Sem ' + r.c.sem + '</b> · ' + r.c.batch; } },
          { h: 'Classes', render: function (r) { return r.c.id; } },
          { h: 'Students', render: function (r) { return '<span class="num">' + Q.studentsOf(r.c.id).length + '</span>'; } },
          { h: 'Assessment avg', render: function (r) { return UI.bar(Math.round(r.avg / 180 * 100), 'b2') + ' <span class="num">' + r.avg + '/180</span>'; } },
          { h: 'Attendance', render: function (r) { return UI.bar(r.att, r.att >= 80 ? 'g' : 'y') + ' <span class="num">' + r.att + '%</span>'; } },
          { h: 'Status', render: function () { return UI.badge('Active', 'In session'); } }
        ], sems) +
        '<div class="fhint">Semester V ends 26 Nov 2026 · results publish after the end-semester board meeting.</div>') +
        UI.card('Completed semesters — cohort result summary', 'chart',
          UI.barsChart(DB.classes.slice(0, 4).map(function (c) {
            var cg = Q.studentsOf(c.id).map(function (s) { return s.cgpa; });
            var avg = cg.reduce(function (a, b) { return a + b; }, 0) / cg.length;
            return { l: c.id + ' (S1–S4)', v: avg * 10, n: avg.toFixed(2), tone: 'g' };
          }))) +
        UI.card('Result publication log', 'list', DB.activity.filter(function (a) { return a.action.indexOf('marks') >= 0 || a.action.indexOf('result') >= 0 || a.action.indexOf('Hall ticket') >= 0 || a.action.indexOf('hall tickets') >= 0; }).slice(0, 6).map(function (a) {
          return '<div class="lrow" style="cursor:default"><span class="ic" style="color:var(--g-blue)">' + UI.icon('file') + '</span><span class="lmain"><b>' + UI.esc(a.action) + '</b><span>' + UI.esc(a.detail) + '</span></span><span class="ltime">' + UI.esc(a.at) + '</span></div>';
        }).join(''));
      document.getElementById('pubRes').addEventListener('click', function () {
        UI.modal({ title: 'Publish assessment results', body:
          UI.field('pr-class', 'Class', UI.select('pr-class', DB.classes.map(function (c) { return { v: c.id, l: c.id }; })), true) +
          UI.hint('Publishing pushes Internal-1, Quiz-1 and any saved Internal-2 marks of the class to every student\u2019s examination page.', '', 'info'),
          actions: '<button class="btn ok" id="pr-go">' + UI.icon('send') + 'Publish now</button>' });
        document.getElementById('pr-go').addEventListener('click', function () {
          var cid = document.getElementById('pr-class').value;
          WF.log('AD1', 'Published assessment results', 'Semester V continuous assessment — ' + cid);
          WF.notify({ aud: 'class:' + cid, title: 'Assessment results published', body: 'Check your Exams & Scores page.', link: '../student/exams.html', tone: 'green' });
          Store.save();
          UI.closeModal(); UI.toast('Results published', cid + ' has been notified.', 'green');
        });
      });
    }
    render();

    /* v5-export:sem handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#seExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'CLASS RESULTS — SEMESTER V'],
        ['Generated', Q.today()],
        [],
        ['Register No', 'Student', 'Class', 'Aggregate /180', 'CGPA', 'Attendance %', 'Standing arrears']
      ];
      DB.students.forEach(function (st) {
        rows.push([st.reg, st.name, st.classId, Q.totalOf(st.id), st.cgpa.toFixed(2), Q.attPctOverall(st.id) + '%', st.arrears || 0]);
      });
      UI.downloadCSV('ClassResults-SemV.csv', rows);
    });

  }
});
})();

/* ── academic/staff .............................. ── */
(function () {
MDTPAGE({
  role: 'academic',
  folder: 'academic',
  id: 'staff',
  render: function (view, ctx) {

    var teachers = DB.staff.filter(function (s) { return s.role === 'teacher'; });
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>Faculty & Workload</h1><div class="sub">' + teachers.length + ' teaching faculty · allotments, workload and advising duties</div></div>' +
      '<div class="actions">' + UI.expBtn('stExp', 'Export workload') + '</div></div>' +
      '<div class="statrow">' +
      UI.stat({ tone: 'b', icon: 'users', value: teachers.length, label: 'Teaching faculty' }) +
      UI.stat({ tone: 'g', icon: 'cap', value: teachers.filter(function (t) { return t.designation === 'Professor'; }).length, label: 'Professors' }) +
      UI.stat({ tone: 'y', icon: 'door', value: teachers.filter(function (t) { return t.advisorClass; }).length, label: 'Class advisors' }) +
      UI.stat({ tone: 'r', icon: 'alert', value: teachers.filter(function (t) { return Q.staffWorkload(t.id).periods > 20; }).length, label: 'Overloaded (> 20 periods)' }) +
      '</div>' +
      UI.card('Faculty register', 'users', UI.table([
        { h: 'Faculty', render: function (r) { return UI.avatar(r, 30) + ' <b>' + UI.esc(r.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + r.id + ' · ' + UI.esc(r.designation) + '</div>'; } },
        { h: 'Dept', render: function (r) { return r.dept; } },
        { h: 'Courses', render: function (r) { return '<span class="num">' + Q.allocationsOfTeacher(r.id).length + '</span> <span style="color:var(--text-2);font-size:11px">' + Q.allocationsOfTeacher(r.id).map(function (a) { return a.courseId; }).join(', ') + '</span>'; } },
        { h: 'Load', render: function (r) { var p = Q.staffWorkload(r.id).periods; return UI.bar(p / 25 * 100, p > 20 ? 'r' : 'g') + ' <span class="num">' + p + 'p</span>'; } },
        { h: 'Advisor', render: function (r) { return r.advisorClass ? '<span class="tag b">' + r.advisorClass + '</span>' : '—'; } },
        { h: 'Expertise', render: function (r) { return '<span style="color:var(--text-2);font-size:12px">' + UI.esc(r.expertise) + '</span>'; } }
      ], teachers));

    /* v5-export:staff handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#stExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'FACULTY WORKLOAD REGISTER'],
        ['Generated', Q.today()],
        [],
        ['Staff ID', 'Faculty', 'Designation', 'Courses', 'Periods/week', 'Advisor of']
      ];
      DB.staff.filter(function (s) { return s.role === 'teacher'; }).forEach(function (s) {
        var wl = Q.staffWorkload(s.id);
        var c = Q.classes.filter(function (x) { return x.advisor === s.id; }).map(function (x) { return x.id; }).join(', ');
        rows.push([s.id, s.name, s.designation, wl.courses, wl.periods, c || '—']);
      });
      UI.downloadCSV('FacultyWorkload.csv', rows);
    });

  }
});
})();

/* ── academic/timetable .......................... ── */
(function () {
MDTPAGE({
  role: 'academic',
  folder: 'academic',
  id: 'timetable',
  render: function (view, ctx) {

    var state = { klass: 'CSE-A' };
    function render() {
      var rs = (DB.reschedules || []);
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Timetable & Reschedules</h1><div class="sub">Class timetables and faculty-initiated reschedule approvals</div></div></div>' +
        '<div class="rowflex" style="margin-bottom:16px">' + DB.classes.map(function (c) {
          return '<span class="chip' + (state.klass === c.id ? ' on' : '') + '" data-tk="' + c.id + '">' + c.id + '</span>';
        }).join('') + '</div>' +
        UI.card(state.klass + ' — weekly timetable', 'calendar', UI.timetable(state.klass, 4)) +
        UI.card('Reschedule requests', 'refresh',
          (rs.length ? UI.table([
            { h: 'Course · Class', render: function (r) { return '<span class="mono">' + r.courseId + '</span> · ' + r.classId; } },
            { h: 'Requested by', render: function (r) { return UI.esc(Q.name(r.teacherId)); } },
            { h: 'Change', render: function (r) { return UI.esc(r.from) + ' → <b>' + UI.esc(r.to) + '</b>'; } },
            { h: 'Reason', render: function (r) { return UI.esc(r.reason); } },
            { h: 'Status', render: function (r) { return UI.badge(r.status === 'Approved' ? 'Approved' : 'Pending'); } },
            { h: 'Action', render: function (r) { return r.status === 'Pending' ? '<button class="btn sm ok" data-rsap="' + r.id + '">' + UI.icon('check') + 'Approve</button> <button class="btn sm ghost-r" data-rsrj="' + r.id + '">' + UI.icon('x') + '</button>' : ''; } }
          ], rs) : UI.empty('No reschedule requests', 'refresh'))) +
        UI.hint('Approved reschedules stamp the class timetable and notify every student of that class.', '', 'info');
      view.querySelectorAll('[data-tk]').forEach(function (c) { c.addEventListener('click', function () { state.klass = c.getAttribute('data-tk'); render(); }); });
      view.querySelectorAll('[data-rsap]').forEach(function (b) { b.addEventListener('click', function () {
        WF.decideReschedule('AD1', b.getAttribute('data-rsap'), true);
        UI.toast('Reschedule approved', 'Class and faculty notified.', 'green'); render();
      }); });
      view.querySelectorAll('[data-rsrj]').forEach(function (b) { b.addEventListener('click', function () {
        WF.decideReschedule('AD1', b.getAttribute('data-rsrj'), false);
        UI.toast('Reschedule rejected', 'Faculty notified.', 'red'); render();
      }); });
    }
    render();

  }
});
})();

/* ── principal/academics ......................... ── */
(function () {
MDTPAGE({
  role: 'principal',
  folder: 'principal',
  id: 'academics',
  render: function (view, ctx) {

    var cgs = DB.students.map(function (s) { return s.cgpa; });
    var bands = { '9+': 0, '8–9': 0, '7–8': 0, 'below 7': 0 };
    cgs.forEach(function (c) { if (c >= 9) bands['9+']++; else if (c >= 8) bands['8–9']++; else if (c >= 7) bands['7–8']++; else bands['below 7']++; });
    var toppers = DB.students.slice().sort(function (a, b) { return b.cgpa - a.cgpa; }).slice(0, 8);
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>Academics</h1><div class="sub">Outcome analytics across departments and batches</div></div>' +
      '<div class="actions">' + UI.expBtn('acExp', 'Export analytics') + '</div></div>' +
      '<div class="statrow">' +
      UI.stat({ tone: 'g', icon: 'cap', value: (cgs.reduce(function (a, b) { return a + b; }, 0) / cgs.length).toFixed(2), label: 'Institutional CGPA average' }) +
      UI.stat({ tone: 'b', icon: 'star', value: bands['9+'] + bands['8–9'], label: 'Students at 8+ CGPA', sub: 'of ' + DB.students.length }) +
      UI.stat({ tone: 'r', icon: 'alert', value: bands['below 7'], label: 'Below 7 CGPA — mentoring focus' }) +
      UI.stat({ tone: 'y', icon: 'chart', value: DB.placementStats.percentage + '%', label: 'Last batch placement' }) +
      '</div>' +
      '<div class="split">' +
      '<div>' + UI.card('CGPA distribution', 'pie', '<div style="display:flex;gap:18px;flex-wrap:wrap;align-items:center;justify-content:center;padding:6px">' +
        UI.donut(Math.round((bands['9+'] + bands['8–9']) / DB.students.length * 100), 'green', 130, 'at 8+') +
        '<div>' + UI.barsChart([
          { l: '9+ CGPA', v: bands['9+'] / DB.students.length * 100, n: bands['9+'], tone: 'g' },
          { l: '8–9 CGPA', v: bands['8–9'] / DB.students.length * 100, n: bands['8–9'], tone: 'b' },
          { l: '7–8 CGPA', v: bands['7–8'] / DB.students.length * 100, n: bands['7–8'], tone: 'y' },
          { l: 'Below 7', v: bands['below 7'] / DB.students.length * 100, n: bands['below 7'], tone: 'r' }
        ]) + '</div></div>') +
      UI.card('Department comparison', 'chart', UI.barsChart(DB.classes.map(function (c) {
        var st = Q.studentsOf(c.id);
        var avg = st.reduce(function (a, s) { return a + s.cgpa; }, 0) / st.length;
        return { l: c.id + ' · ' + c.dept, v: avg * 10, n: avg.toFixed(2), tone: avg >= 8.2 ? 'g' : 'y' };
      }))) + '</div>' +
      '<div>' + UI.card('Institution toppers', 'trophy', toppers.map(function (s, i) {
        return '<div class="lrow" style="cursor:default"><span class="lmain"><b>' + (i + 1) + '. ' + UI.esc(s.name) + '</b><span>' + s.reg + ' · ' + s.classId + ' · CGPA ' + s.cgpa.toFixed(2) + '</span></span>' + UI.avatar(s, 30) + '</div>';
      }).join('')) +
      UI.card('Arrear watch', 'alert',
        (DB.students.filter(function (s) { return s.arrears; }).length ? UI.table([
          { h: 'Student', render: function (r) { return UI.avatar(r, 28) + ' ' + UI.esc(r.name) + '<div style="font-size:11px;color:var(--text-2)">' + r.reg + ' · ' + r.classId + '</div>'; } },
          { h: 'Arrears', render: function (r) { return UI.badge('Absent', r.arrears + ' paper'); } },
          { h: 'Mentor', render: function (r) { var mg = Q.mentorGroupOf(r.id); return mg ? UI.esc(Q.name(mg.mentorId)) : '—'; } }
        ], DB.students.filter(function (s) { return s.arrears; })) : UI.empty('No standing arrears in the institution', 'checkc'))) +
      '</div></div>';

    /* v5-export:ac handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#acExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'ACADEMIC ANALYTICS — BY CLASS'],
        ['Generated', Q.today()],
        [],
        ['Class', 'Students', 'Attendance average %', 'Assessment average /180', 'Topper', 'Topper aggregate']
      ];
      DB.classes.forEach(function (c) {
        var rk = Q.rankList(c.id);
        rows.push([c.id, Q.studentsOf(c.id).length, Q.classAttAvg(c.id) + '%', Q.classAvgTotal(c.id), rk.length ? rk[0].name : '—', rk.length ? Q.totalOf(rk[0].id) : '—']);
      });
      UI.downloadCSV('AcademicAnalytics.csv', rows);
    });

  }
});
})();

/* ── principal/approvals ......................... ── */
(function () {
MDTPAGE({
  role: 'principal',
  folder: 'principal',
  id: 'approvals',
  render: function (view, ctx) {

    function render() {
      var sch = DB.scholarshipApps.filter(function (a) { return a.status === 'Verified'; });
      var lv = DB.leaveRequests.filter(function (l) { return l.principalId && l.status === 'AD Approved'; });
      var evV = DB.expenses.filter(function (e) { return e.status === 'Accounts Verified'; });
      var rqP = DB.requisitions.filter(function (r) { return r.status === 'With Principal'; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Approvals</h1><div class="sub">Final signature layer — scholarships and long leave countersigns</div></div>' +
      '<div class="actions">' + UI.expBtn('apExp', 'Export decisions') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'y', icon: 'medal', value: sch.length, label: 'Scholarships awaiting signature' }) +
        UI.stat({ tone: 'b', icon: 'key', value: lv.length, label: 'Long-leave countersigns' }) +
        UI.stat({ tone: 'r', icon: 'file', value: evV.length, label: 'Expense vouchers to countersign', sub: 'accounts verified' }) +
        UI.stat({ tone: 'g', icon: 'book', value: rqP.length, label: 'Book requisitions', sub: 'librarian recommended' }) +
        '</div>' +
        UI.card('Scholarship decisions', 'medal',
          (sch.length ? '<div class="grid g2">' + sch.map(function (a) {
            var s = Q.studentById(a.studentId);
            return '<div class="card" style="box-shadow:none;border-style:dashed;margin:0"><div class="spread">' +
              '<div style="display:flex;gap:10px;align-items:center">' + UI.avatar(s, 40) + '<span><b>' + UI.esc(s.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + s.reg + ' · CGPA ' + s.cgpa.toFixed(2) + '</div></span></div>' +
              UI.badge('Verified') + '</div>' +
              '<div class="mt8"><b>' + UI.esc(Q.schemeName(a.schemeId)) + '</b> · ' + UI.money((DB.scholarshipSchemes.filter(function (x) { return x.id === a.schemeId; })[0] || {}).amount || 0) + '</div>' +
              '<div class="mt8" style="font-size:11.5px;color:var(--text-2)">Docs: ' + a.docs.join(', ') + ' · verified by ' + UI.esc(Q.name(a.verifiedBy)) + '</div>' +
              '<div class="mt8">' + UI.timeline(a.timeline) + '</div>' +
              '<div class="frow" style="justify-content:flex-start">' +
              '<button class="btn sm ok" data-sap="' + a.id + '">' + UI.icon('check') + 'Sanction</button>' +
              '<button class="btn sm ghost-r" data-srj="' + a.id + '">' + UI.icon('x') + 'Decline</button></div></div>';
          }).join('') + '</div>' : UI.empty('No scholarships awaiting signature', 'checkc'))) +
        UI.card('Long-leave countersignatures', 'key',
          (lv.length ? lv.map(function (l) {
            var s = Q.studentById(l.studentId);
            return '<div class="card" style="box-shadow:none;border-style:dashed"><div class="spread">' +
              '<div style="display:flex;gap:10px;align-items:center">' + UI.avatar(s, 38) + '<span><b>' + UI.esc(s.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + s.reg + ' · ' + s.classId + '</div></span></div>' + UI.badge(l.status) + '</div>' +
              '<div class="mt8">' + UI.esc(l.type) + ' · ' + l.days + ' days · ' + UI.fmtDate(l.from) + ' → ' + UI.fmtDate(l.to) + '</div>' +
              '<div class="mt8" style="font-size:12.5px;color:var(--text-2)">' + UI.esc(l.reason) + '</div>' +
              '<div class="mt8">' + UI.timeline(l.timeline) + '</div>' +
              '<div class="frow" style="justify-content:flex-start">' +
              '<button class="btn sm ok" data-plap="' + l.id + '">' + UI.icon('check') + 'Countersign</button>' +
              '<button class="btn sm ghost-r" data-plrj="' + l.id + '">' + UI.icon('x') + 'Decline</button></div></div>';
          }).join('') : UI.empty('No countersigns pending', 'checkc'))) +
        UI.card('Expense vouchers — countersign after accounts verification', 'file',
          (evV.length ? '<div class="grid g2">' + evV.map(function (e) {
            return '<div class="card" style="box-shadow:none;border-style:dashed;margin:0"><div class="spread">' +
              '<div><b class="mono">' + e.id + '</b> · ' + UI.esc(e.category) + '<div style="font-size:11px;color:var(--text-2)">raised by ' + UI.esc(Q.name(e.by)) + ' · ' + UI.fmtDate(e.raisedAt) + '</div></div>' +
              '<b class="num">' + UI.money(e.amount) + '</b></div>' +
              '<div class="mt8" style="font-size:12.5px;color:var(--text-2)">' + UI.esc(e.desc) + '</div>' +
              '<div class="frow" style="justify-content:flex-start">' +
              '<button class="btn sm ok" data-evap="' + e.id + '">' + UI.icon('check') + 'Countersign</button>' +
              '<button class="btn sm ghost-r" data-evrj="' + e.id + '">' + UI.icon('x') + 'Decline</button></div></div>';
          }).join('') + '</div>' : UI.empty('No expense vouchers awaiting your signature', 'checkc'))) +
        UI.card('Book purchase requisitions — librarian recommended', 'book',
          (rqP.length ? rqP.map(function (r) {
            return '<div class="card" style="box-shadow:none;border-style:dashed"><div class="spread"><div><b>' + r.id + ' · ' + r.dept + '</b>' +
              '<div style="font-size:11px;color:var(--text-2)">' + UI.esc(Q.name(r.by)) + ' · ' + r.items.length + ' titles · ' + UI.money(r.total) + '</div></div>' + UI.badge(r.status) + '</div>' +
              '<div class="frow" style="justify-content:flex-start">' +
              '<button class="btn sm ok" data-rqap="' + r.id + '">' + UI.icon('check') + 'Approve purchase</button>' +
              '<button class="btn sm ghost-r" data-rqrj="' + r.id + '">' + UI.icon('x') + 'Reject</button></div></div>';
          }).join('') : UI.empty('No requisitions awaiting your approval', 'checkc'))) +
        UI.hint('Approving a scholarship marks it for fee-account adjustment. Countersigning a long leave closes its chain — the student, advisor and director are all notified.', '', 'info');
      view.querySelectorAll('[data-sap]').forEach(function (b) { b.addEventListener('click', function () {
        WF.decideScholarship(b.getAttribute('data-sap'), true, 'Sanctioned by the Principal\u2019s office.');
        UI.toast('Scholarship sanctioned', 'Student and office notified.', 'green'); render();
      }); });
      view.querySelectorAll('[data-srj]').forEach(function (b) { b.addEventListener('click', function () {
        WF.decideScholarship(b.getAttribute('data-srj'), false, 'Declined at the Principal\u2019s level.');
        UI.toast('Scholarship declined', 'Student notified.', 'red'); render();
      }); });
      view.querySelectorAll('[data-plap]').forEach(function (b) { b.addEventListener('click', function () {
        WF.decideLeave(b.getAttribute('data-plap'), 'PR1', true, 'Countersigned by the Principal.');
        UI.toast('Leave countersigned', 'Approval chain closed.', 'green'); render();
      }); });
      view.querySelectorAll('[data-plrj]').forEach(function (b) { b.addEventListener('click', function () {
        WF.decideLeave(b.getAttribute('data-plrj'), 'PR1', false, 'Declined by the Principal.');
        UI.toast('Leave declined', '', 'red'); render();
      }); });
      view.querySelectorAll('[data-evap]').forEach(function (b) { b.addEventListener('click', function () {
        WF.decideExpense(b.getAttribute('data-evap'), true, 'Countersigned by the Principal');
        UI.toast('Voucher countersigned', 'Accounts will disburse on the next run.', 'green'); render();
      }); });
      view.querySelectorAll('[data-evrj]').forEach(function (b) { b.addEventListener('click', function () {
        WF.decideExpense(b.getAttribute('data-evrj'), false, 'Declined at the Principal\u2019s desk');
        UI.toast('Voucher declined', 'Accounts and raiser notified.', 'red'); render();
      }); });
      view.querySelectorAll('[data-rqap]').forEach(function (b) { b.addEventListener('click', function () {
        WF.decideRequisition(b.getAttribute('data-rqap'), 'principal', true, '');
        UI.toast('Requisition approved', 'Library can place the purchase order.', 'green'); render();
      }); });
      view.querySelectorAll('[data-rqrj]').forEach(function (b) { b.addEventListener('click', function () {
        WF.decideRequisition(b.getAttribute('data-rqrj'), 'principal', false, 'Budget priorities this quarter');
        UI.toast('Requisition rejected', 'Library and department notified.', 'red'); render();
      }); });
    }
    render();

    /* v5-export:ap handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#apExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'PRINCIPAL DECISION LOG'],
        ['Generated', Q.today()],
        [],
        ['Register No', 'Student', 'Item', 'Type', 'Status']
      ];
      DB.scholarshipApps.forEach(function (a) {
        var st = Q.studentById(a.studentId);
        rows.push([st ? st.reg : '—', st ? st.name : '—', Q.schemeName(a.schemeId), 'Scholarship', a.status]);
      });
      DB.leaveRequests.filter(function (r) { return r.days > DB.settings.wf.longLeaveDays; }).forEach(function (r) {
        var st = Q.studentById(r.studentId);
        rows.push([st ? st.reg : '—', st ? st.name : '—', r.type + ' leave ' + r.from + ' to ' + r.to, 'Long leave', r.status]);
      });
      UI.downloadCSV('Principal-Decisions.csv', rows);
    });

  }
});
})();

/* ── principal/circulars ......................... ── */
(function () {
MDTPAGE({
  role: 'principal',
  folder: 'principal',
  id: 'circulars',
  render: function (view, ctx) {

    function render() {
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Circulars & Flash News</h1><div class="sub">Institution-wide announcements reach every dashboard instantly</div></div>' +
        '<div class="actions"><button class="btn pri" id="newCir">' + UI.icon('send') + 'New circular</button></div></div>' +
        UI.card('Published circulars', 'send', UI.table([
          { h: 'Circular', render: function (r) { return '<b>' + UI.esc(r.title) + '</b>' + (r.urgent ? ' <span class="tag r">URGENT</span>' : '') + '<div style="font-size:11.5px;color:var(--text-2)">' + UI.esc(r.body.slice(0, 90)) + '…</div>'; } },
          { h: 'Audience', render: function (r) { return '<span class="tag n">' + r.audience + '</span>'; } },
          { h: 'By', render: function (r) { return UI.esc(Q.name(r.by)); } },
          { h: 'Date', render: function (r) { return UI.fmtDate(r.at); } }
        ], DB.circulars)) +
        UI.card('Flash news ticker (live on student dashboards)', 'alert',
          DB.flashNews.map(function (f) { return '<div class="lrow" style="cursor:default"><span class="ic" style="color:var(--g-yellow)">' + UI.icon('bell') + '</span><span class="lmain"><span>' + UI.esc(f) + '</span></span></div>'; }).join(''));
      document.getElementById('newCir').addEventListener('click', function () {
        UI.modal({ title: 'Publish a circular', body:
          '<div class="fgrid">' +
          UI.field('ci-aud', 'Audience', UI.select('ci-aud', ['All', 'Students', 'Staff', 'Hostellers'])) +
          UI.field('ci-urg', 'Mark urgent', '<label class="switch"><input type="checkbox" id="ci-urg"><span class="tr"></span> Add to flash news ticker</label>') +
          '</div>' +
          UI.field('ci-title', 'Title', '<input class="input" id="ci-title" placeholder="Circular heading">', true) +
          UI.field('ci-body', 'Message', '<textarea class="input" id="ci-body" placeholder="Full circular text"></textarea>', true),
          actions: '<button class="btn pri" id="ci-go">' + UI.icon('send') + 'Publish now</button>' });
        document.getElementById('ci-go').addEventListener('click', function () {
          var f = { audience: document.getElementById('ci-aud').value, urgent: document.getElementById('ci-urg').checked, title: document.getElementById('ci-title').value.trim(), body: document.getElementById('ci-body').value.trim() };
          if (!f.title || !f.body) { UI.toast('Title and message are required', '', 'red'); return; }
          WF.publishCircular('PR1', f);
          UI.closeModal(); UI.toast('Circular published', 'Audience dashboards updated.', 'green'); render();
        });
      });
    }
    render();

  }
});
})();

/* ── principal/dashboard ......................... ── */
(function () {
MDTPAGE({
  role: 'principal',
  folder: 'principal',
  id: 'dashboard',
  render: function (view, ctx) {

    var me = ctx.person;
    var students = DB.students.length, staff = DB.staff.length;
    var attAvg = Math.round(DB.classes.reduce(function (a, c) { return a + Q.classAttAvg(c.id); }, 0) / DB.classes.length);
    var collected = DB.feeTransactions.reduce(function (a, b) { return a + b.amount; }, 0);
    var feeTarget = DB.feeHeads.filter(function (h) { return h.id === 'TU' || h.id === 'EX'; }).reduce(function (a, h) { return a + h.amount; }, 0) * students;
    var occA = Q.occupancy('A'), occB = Q.occupancy('B');
    var pendSch = DB.scholarshipApps.filter(function (a) { return a.status === 'Verified'; });
    var pendLv = DB.leaveRequests.filter(function (l) { return l.principalId && l.status === 'AD Approved'; });
    var openTk = DB.tickets.filter(function (t) { return t.status === 'Open'; }).length;
    view.innerHTML =
      '<div class="pagehead"><span style="display:flex;gap:14px;align-items:center">' + UI.avatar(me, 44) +
      '<span><h1>Institution Overview</h1><div class="sub">' + UI.esc(DB.settings.institute) + ' · ' + UI.esc(DB.settings.academicYear) + ' · Semester V</div></span></span>' +
      '<div class="actions"><a class="btn pri" href="circulars.html">' + UI.icon('send') + 'Publish circular</a></div></div>' +
      '<div class="statrow">' +
      UI.stat({ tone: 'b', icon: 'users', value: students, label: 'Students on roll', sub: '6 classes · 2 departments' }) +
      UI.stat({ tone: 'g', icon: 'cap', value: staff, label: 'Faculty & staff' }) +
      UI.stat({ tone: attAvg >= 80 ? 'g' : 'y', icon: 'checkc', value: attAvg + '%', label: 'Institutional attendance' }) +
      UI.stat({ tone: 'r', icon: 'rupee', value: Math.round(collected / 100000) / 10 + ' L', label: 'Fee collection', sub: 'of ' + Math.round(feeTarget / 100000) / 10 + ' L target' }) +
      '</div>' +
      '<div class="split">' +
      '<div>' +
      UI.card('Governance queue', 'checkc',
        UI.table([
          { h: 'Item', render: function (r) { return '<b>' + UI.esc(r.t) + '</b><div style="font-size:11.5px;color:var(--text-2)">' + UI.esc(r.d) + '</div>'; } },
          { h: 'Owner chain', render: function (r) { return UI.esc(r.chain); } },
          { h: 'Status', render: function (r) { return UI.badge(r.s, r.l); } },
          { h: 'Action', render: function (r) { return r.href ? '<a class="btn sm pri" href="' + r.href + '">Review</a>' : ''; } }
        ], [
          { t: 'Scholarship approvals', d: pendSch.length + ' verified applications awaiting your signature', chain: 'Office → Principal', s: 'Pending', l: pendSch.length + ' pending', href: 'approvals.html' },
          { t: 'Long leave countersign', d: pendLv.length + ' leave(s) beyond ' + DB.settings.wf.longLeaveDays + ' days', chain: 'Advisor → Director → Principal', s: pendLv.length ? 'Pending' : 'Approved', l: pendLv.length ? 'Awaiting' : 'Clear', href: 'approvals.html' },
          { t: 'Open help tickets', d: openTk + ' tickets across categories', chain: 'Office & Admin desks', s: openTk ? 'Open' : 'Resolved', l: openTk ? openTk + ' open' : 'All clear', href: '../office/tickets.html' }
        ])) +
      UI.card('Department pulse', 'chart', UI.barsChart(DB.classes.map(function (c) {
        return { l: c.id, v: Q.classAttAvg(c.id), n: Q.classAttAvg(c.id) + '%', tone: 'b' };
      }))) +
      UI.card('Latest circulars', 'send', DB.circulars.slice(0, 4).map(function (c) {
        return '<div class="lrow" style="cursor:default"><span class="ic" style="color:' + (c.urgent ? 'var(--g-red)' : 'var(--g-blue)') + '">' + UI.icon(c.urgent ? 'alert' : 'file') + '</span><span class="lmain"><b>' + UI.esc(c.title) + '</b><span>' + UI.esc(c.body.slice(0, 70)) + '…</span></span><span class="ltime">' + UI.fmtDate(c.at) + '</span></div>';
      }).join(''), null, { href: 'circulars.html', label: 'Manage' }) +
      '</div>' +
      '<div>' +
      UI.card('Hostel occupancy — gender split', 'bed',
        UI.kv([
          ['Block A (Boys) — ' + UI.esc(Q.wardenOf('A').name), UI.bar(occA.pct, 'b') + ' <b class="num">' + occA.occ + '/' + occA.cap + '</b> (' + occA.pct + '%)'],
          ['Block B (Girls) — ' + UI.esc(Q.wardenOf('B').name), UI.bar(occB.pct, 'r') + ' <b class="num">' + occB.occ + '/' + occB.cap + '</b> (' + occB.pct + '%)']
        ]) + '<div class="mt8">' + UI.hint('Wardens govern their own blocks — outings, rooms, mess and complaints. Overnight outings also involve the Academic Director.', '', 'info') + '</div>', null, { href: 'hostel.html', label: 'Hostel overview' }) +
      UI.card('Placement outcome — 2025 batch', 'briefcase', '<div style="display:flex;justify-content:center">' + UI.donut(DB.placementStats.percentage, 'green', 120, 'placed') + '</div>' +
        '<div class="legend" style="justify-content:center"><span><i style="background:var(--g-green)"></i>' + DB.placementStats.placed + ' placed</span><span><i style="background:var(--surface-3)"></i>' + DB.placementStats.eligible + ' eligible</span></div>' +
        '<div class="mt8" style="font-size:12.5px;color:var(--text-2);text-align:center">Highest ' + DB.placementStats.highest + ' · average ' + DB.placementStats.average + ' · ' + DB.placementStats.companies + ' companies</div>', null, { href: 'academics.html', label: 'Academics' }) +
      UI.card('Operations today', 'grid', UI.kv([
        ['Attendance sessions marked', '<b class="num">' + DB.attendanceSessions.length + '</b>'],
        ['Outing requests pending', '<b class="num">' + DB.outingRequests.filter(function (r) { return r.status === 'Pending'; }).length + '</b>'],
        ['Fee receipts today', '<b class="num">' + DB.feeTransactions.filter(function (x) { return x.date === Q.today(); }).length + '</b>'],
        ['Library active loans', '<b class="num">' + DB.borrowRecords.filter(function (b) { return !b.returned; }).length + '</b>']
      ])) +
      '</div></div>';

  }
});
})();

/* ── principal/finance ........................... ── */
(function () {
MDTPAGE({
  role: 'principal',
  folder: 'principal',
  id: 'finance',
  render: function (view, ctx) {

    var months = {};
    DB.feeTransactions.forEach(function (t) { var m = t.date.slice(0, 7); months[m] = (months[m] || 0) + t.amount; });
    var totalDues = DB.students.reduce(function (a, s) { return a + Q.duesOf(s.id).total; }, 0);
    var collected = DB.feeTransactions.reduce(function (a, b) { return a + b.amount; }, 0);
    var disbursed = DB.scholarshipApps.filter(function (a) { return a.status === 'Approved'; }).length * 20000;
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>Fee & Finance</h1><div class="sub">Collections, dues and scholarship disbursement</div></div>' +
      '<div class="actions">' + UI.expBtn('fnExp', 'Export finance') + '</div></div>' +
      '<div class="statrow">' +
      UI.stat({ tone: 'g', icon: 'rupee', value: UI.money(collected), label: 'Collected this semester' }) +
      UI.stat({ tone: 'r', icon: 'alert', value: UI.money(totalDues), label: 'Outstanding dues', sub: DB.students.filter(function (s) { return Q.duesOf(s.id).total > 2000; }).length + ' students above grace' }) +
      UI.stat({ tone: 'b', icon: 'medal', value: UI.money(disbursed), label: 'Scholarships disbursed' }) +
      UI.stat({ tone: 'y', icon: 'chart', value: Math.round(collected / (collected + totalDues) * 100) + '%', label: 'Realisation rate' }) +
      '</div>' +
      '<div class="split">' +
      '<div>' + UI.card('Monthly collections', 'chart', UI.barsChart(Object.keys(months).sort().map(function (m) {
        return { l: m, v: months[m] / Math.max.apply(null, Object.keys(months).map(function (x) { return months[x]; })) * 100, n: '₹' + Math.round(months[m] / 1000) + 'k', tone: 'g' };
      }))) +
      UI.card('Dues by class', 'alert', UI.barsChart(DB.classes.map(function (c) {
        var d = Q.studentsOf(c.id).reduce(function (a, s) { return a + Q.duesOf(s.id).total; }, 0);
        return { l: c.id, v: d / 300000 * 100, n: '₹' + Math.round(d / 1000) + 'k', tone: d > 100000 ? 'r' : 'y' };
      }))) + '</div>' +
      '<div>' + UI.card('Fee heads ledger', 'list', UI.table([
        { h: 'Head', render: function (r) { return UI.esc(r.name); } },
        { h: 'Per student', render: function (r) { return '<span class="num">' + UI.money(r.amount) + '</span>'; } },
        { h: 'Collected', render: function (r) { return '<span class="num">' + UI.money(DB.feeTransactions.filter(function (t) { return t.head === r.id; }).reduce(function (a, b) { return a + b.amount; }, 0)) + '</span>'; } }
      ], DB.feeHeads)) +
      UI.card('Disbursement pipeline', 'medal', UI.table([
        { h: 'Scheme', render: function (r) { return UI.esc(r.name); } },
        { h: 'Applications', render: function (r) { return '<span class="num">' + DB.scholarshipApps.filter(function (a) { return a.schemeId === r.id; }).length + '</span>'; } },
        { h: 'Sanctioned', render: function (r) { return '<span class="num">' + DB.scholarshipApps.filter(function (a) { return a.schemeId === r.id && a.status === 'Approved'; }).length + '</span>'; } }
      ], DB.scholarshipSchemes)) + '</div></div>';

    /* v5-export:fn handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#fnExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'FINANCE SUMMARY'],
        ['Generated', Q.today()],
        [],
        ['Class', 'Collected (Rs)', 'Outstanding dues (Rs)', 'Defaulters above grace']
      ];
      var totC = 0, totD = 0;
      DB.classes.forEach(function (c) {
        var coll = DB.feeTransactions.filter(function (t) { var s = Q.studentById(t.studentId); return s && s.classId === c.id; }).reduce(function (a, b) { return a + b.amount; }, 0);
        var dues = 0, def = 0;
        Q.studentsOf(c.id).forEach(function (st) { var d = Q.duesOf(st.id).total; dues += d; if (d > DB.settings.wf.feeGrace) def++; });
        totC += coll; totD += dues;
        rows.push([c.id, coll, dues, def]);
      });
      rows.push([]);
      rows.push(['Total', totC, totD, '']);
      rows.push([]);
      rows.push(['Scholarship disbursement']);
      rows.push(['Scheme', 'Approved applications', 'Amount (Rs)']);
      DB.scholarshipSchemes.forEach(function (sc) {
        var n = DB.scholarshipApps.filter(function (a) { return a.schemeId === sc.id && a.status === 'Approved'; }).length;
        rows.push([sc.name, n, n * sc.amount]);
      });
      UI.downloadCSV('FinanceSummary.csv', rows);
    });

  }
});
})();

/* ── principal/hostel ............................ ── */
(function () {
MDTPAGE({
  role: 'principal',
  folder: 'principal',
  id: 'hostel',
  render: function (view, ctx) {

    function render() {
      var occA = Q.occupancy('A'), occB = Q.occupancy('B');
      var outA = DB.outingRequests.filter(function (r) { return Q.studentById(r.studentId) && Q.studentById(r.studentId).block === 'A'; });
      var outB = DB.outingRequests.filter(function (r) { return Q.studentById(r.studentId) && Q.studentById(r.studentId).block === 'B'; });
      var cmp = DB.complaints;
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Hostel Overview</h1><div class="sub">Both blocks, gender-split governance under dedicated wardens</div></div>' +
      '<div class="actions">' + UI.expBtn('hoExp', 'Export occupancy') + '</div></div>' +
        '<div class="split-eq">' +
        '<div class="card glow glow-b accent-b"><div class="card-t">' + UI.icon('bed') + '<h3>Block A — Boys</h3>' + UI.badge('Active', 'Warden: ' + UI.esc(Q.wardenOf('A').name.split(' ')[0])) + '</div>' +
        '<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">' + UI.donut(occA.pct, 'blue', 110, 'filled') +
        '<div style="flex:1;min-width:180px">' + UI.barsChart([
          { l: 'Occupancy', v: occA.pct, n: occA.occ + '/' + occA.cap, tone: 'b' },
          { l: 'Pending outings', v: Math.min(100, outA.filter(function (r) { return r.status === 'Pending'; }).length * 30), n: outA.filter(function (r) { return r.status === 'Pending'; }).length, tone: 'y' },
          { l: 'Open complaints', v: Math.min(100, cmp.filter(function (c) { return c.block === 'A' && c.status !== 'Resolved'; }).length * 30), n: cmp.filter(function (c) { return c.block === 'A' && c.status !== 'Resolved'; }).length, tone: 'r' }
        ]) + '</div></div></div>' +
        '<div class="card glow glow-r accent-r"><div class="card-t">' + UI.icon('bed') + '<h3>Block B — Girls</h3>' + UI.badge('Active', 'Warden: ' + UI.esc(Q.wardenOf('B').name.split(' ')[0])) + '</div>' +
        '<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">' + UI.donut(occB.pct, 'red', 110, 'filled') +
        '<div style="flex:1;min-width:180px">' + UI.barsChart([
          { l: 'Occupancy', v: occB.pct, n: occB.occ + '/' + occB.cap, tone: 'r' },
          { l: 'Pending outings', v: Math.min(100, outB.filter(function (r) { return r.status === 'Pending'; }).length * 30), n: outB.filter(function (r) { return r.status === 'Pending'; }).length, tone: 'y' },
          { l: 'Open complaints', v: Math.min(100, cmp.filter(function (c) { return c.block === 'B' && c.status !== 'Resolved'; }).length * 30), n: cmp.filter(function (c) { return c.block === 'B' && c.status !== 'Resolved'; }).length, tone: 'r' }
        ]) + '</div></div></div>' +
        '</div>' +
        UI.card('Outing activity — both blocks', 'door', UI.table([
          { h: 'Student', render: function (r) { var s = Q.studentById(r.studentId); return UI.avatar(s, 28) + ' ' + UI.esc(s.name) + '<div style="font-size:11px;color:var(--text-2)">' + s.roomId + ' · ' + Q.genderLabel(s.gender) + '</div>'; } },
          { h: 'Type', render: function (r) { return r.type; } },
          { h: 'Window', render: function (r) { return UI.esc(r.out) + ' → ' + UI.esc(r.in); } },
          { h: 'Warden stage', render: function (r) { return UI.badge(r.status); } },
          { h: 'Director stage', render: function (r) { return r.adStatus ? UI.badge(r.adStatus) : '<span style="color:var(--text-3)">—</span>'; } }
        ], DB.outingRequests)) +
        UI.card('Complaint resolution', 'wrench', UI.barsChart([
          { l: 'Resolved', v: cmp.filter(function (c) { return c.status === 'Resolved'; }).length / Math.max(1, cmp.length) * 100, n: cmp.filter(function (c) { return c.status === 'Resolved'; }).length, tone: 'g' },
          { l: 'In progress', v: cmp.filter(function (c) { return c.status === 'In Progress'; }).length / Math.max(1, cmp.length) * 100, n: cmp.filter(function (c) { return c.status === 'In Progress'; }).length, tone: 'y' },
          { l: 'Open', v: cmp.filter(function (c) { return c.status === 'Open'; }).length / Math.max(1, cmp.length) * 100, n: cmp.filter(function (c) { return c.status === 'Open'; }).length, tone: 'r' }
        ]));
    }
    render();

    /* v5-export:ho handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#hoExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'HOSTEL OCCUPANCY REGISTER'],
        ['Generated', Q.today()],
        [],
        ['Block', 'Room', 'Floor', 'Capacity', 'Occupants', 'Vacancy']
      ];
      ['A', 'B'].forEach(function (blk) {
        Q.roomsOf(blk).forEach(function (r) {
          rows.push([blk, r.id, 'Floor ' + r.floor, r.capacity, r.occupants.length, r.capacity - r.occupants.length]);
        });
      });
      UI.downloadCSV('HostelOccupancy.csv', rows);
    });

  }
});
})();

/* ── principal/profile ........................... ── */
(function () {
MDTPAGE({
  role: 'principal',
  folder: 'principal',
  id: 'profile',
  render: function (view, ctx) {

    var me = ctx.person;
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>My Profile</h1><div class="sub">Principal · institutional leadership</div></div></div>' +
      '<div class="split-eq">' +
      '<div>' +
        '<div class="card glow glow-r accent-r">' + UI.photoBox(me, 'Your photo appears on circulars and the institutional directory.') + '</div>' +
        UI.card('Office of the Principal', 'cap', UI.kv([
          ['Employee code', '<b class="mono">' + me.id + '</b>'],
          ['Designation', UI.esc(me.designation)],
          ['Experience', me.exp + ' years'],
          ['Oversight', 'Academics · finance · hostel · staff · communication'],
          ['Academic year', DB.settings.academicYear + ' · Semester ' + DB.settings.currentSem]
        ])) +
        UI.card('Governance scope', 'shield', '<ul style="margin:4px 0 0 16px;padding:0;font-size:12.5px;color:var(--text-2);line-height:1.9">' +
          '<li><b>Long leave</b> — final countersignature after the Academic Director recommends.</li>' +
          '<li><b>Circulars &amp; news</b> — institution-wide publications from your desk.</li>' +
          '<li><b>Fee &amp; finance</b> — collection overview and scholarship sanctions across classes.</li>' +
          '<li><b>Hostel</b> — live occupancy overview of both the boys and girls blocks.</li>' +
          '<li><b>Staff</b> — faculty and administrative overview with workload health.</li></ul>') +
      '</div>' +
      '<div>' +
        UI.card('Contact', 'idcard', UI.kv([
          ['Email', UI.esc(me.email)],
          ['Phone', UI.esc(me.phone)],
          ['Campus', DB.settings.institute + ', ' + DB.settings.city]
        ])) +
        UI.card('Dashboard pulse', 'chart', '<div class="bars">' +
          '<div class="brow"><span class="bl">Students</span>' + UI.bar(100, 'b2') + '<span class="bn">' + DB.students.length + '</span></div>' +
          '<div class="brow"><span class="bl">Faculty &amp; staff</span>' + UI.bar(100, 'g') + '<span class="bn">' + DB.staff.length + '</span></div>' +
          '<div class="brow"><span class="bl">Classes</span>' + UI.bar(100, 'y') + '<span class="bn">' + DB.classes.length + '</span></div>' +
          '<div class="brow"><span class="bl">Residential</span>' + UI.bar(70, 'b') + '<span class="bn">' + DB.students.filter(function (s) { return s.hostel; }).length + '</span></div>' +
        '</div>') +
        UI.card('Account', 'shield', UI.kv([
          ['Role', '<b>' + UI.esc(ctx.role) + '</b> — Principal'],
          ['Access', 'Institution-wide, read-and-approve governance'],
          ['Sign-in', UI.esc(ctx.user.lastLogin)]
        ])) +
      '</div></div>';

  }
});
})();

/* ── principal/quality ........................... ── */
(function () {
MDTPAGE({
  role: 'principal',
  folder: 'principal',
  id: 'quality',
  render: function (view, ctx) {

    function render() {
      var readiness = DB.naacCriteria.reduce(function (a, c) { return a + c.readiness; }, 0) / DB.naacCriteria.length;
      var ongoing = DB.surveys.filter(function (s) { return s.status === 'Ongoing'; });
      var copoAvg = 0, copoN = 0;
      Object.keys(DB.courseCOs).forEach(function (cid) { DB.courseCOs[cid].forEach(function (co) { copoAvg += co.att; copoN++; }); });
      copoAvg = Math.round(copoAvg / (copoN || 1));
      var pendingReq = DB.requisitions.filter(function (r) { return r.status === 'With Principal' || r.status === 'Approved'; });
      var pendingExp = DB.expenses.filter(function (e) { return e.status === 'Accounts Verified'; });
      var appraisalsPending = DB.appraisals.filter(function (a) { return a.status === 'Submitted'; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Quality &amp; Accreditation</h1><div class="sub">The IQAC registers mirrored for governance — attainment, surveys, audits and criteria readiness</div></div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'g', icon: 'medal', value: Math.round(readiness) + '%', label: 'NAAC readiness', sub: 'weighted view on criteria page' }) +
        UI.stat({ tone: 'b', icon: 'chart', value: copoAvg + '%', label: 'CO attainment (avg)', sub: 'direct, all courses' }) +
        UI.stat({ tone: 'y', icon: 'list', value: ongoing.length, label: 'Surveys running', sub: ongoing.map(function (s) { return Math.round(s.submitted / (s.assigned || 1) * 100) + '%'; }).join(' · ') }) +
        UI.stat({ tone: 'r', icon: 'checkc', value: DB.audits.filter(function (a) { return a.status !== 'Closed'; }).length, label: 'Audits open / scheduled' }) +
        '</div>' +
        '<div class="split">' +
        '<div>' +
        UI.card('Criteria readiness (weighted)', 'chart', UI.barsChart(DB.naacCriteria.map(function (c) {
          return { l: c.c, v: c.readiness, n: c.readiness + '% · wt ' + c.weight + '%', tone: c.readiness > 85 ? 'g' : c.readiness > 75 ? 'y' : 'r' };
        }))) +
        UI.card('Survey cycles — completion', 'list', UI.table([
          { h: 'Survey', render: function (s) { return UI.esc(s.title); } },
          { h: 'Responses', render: function (s) { return s.submitted + '/' + s.assigned; } },
          { h: 'Completion', render: function (s) { return UI.bar(Math.round(s.submitted / (s.assigned || 1) * 100), 'y'); } },
          { h: 'Status', render: function (s) { return UI.badge(s.status); } }
        ], DB.surveys)) +
        '</div><div>' +
        UI.card('Awaiting the Principal\u2019s desk', 'door', UI.table([
          { h: 'Item', render: function (r) { return r.t; } },
          { h: 'Detail', render: function (r) { return UI.esc(r.d); } },
          { h: 'Action', render: function (r) { return r.go ? '<a class="btn sm pri" href="' + r.go + '">' + UI.icon('check') + 'Review</a>' : ''; } }
        ], [
          { t: 'Book requisitions', d: pendingReq.length + ' departmental requisition(s) in the chain', go: 'approvals.html' },
          { t: 'Expense vouchers', d: pendingExp.length + ' verified by accounts, countersign due', go: 'approvals.html' },
          { t: 'Staff appraisals', d: appraisalsPending.length + ' self-appraisal(s) ready for review', go: 'staff.html' },
          { t: 'Audit follow-ups', d: DB.audits.filter(function (a) { return a.status === 'Follow-up Pending'; }).length + ' finding(s) open', go: 'academics.html' }
        ])) +
        UI.card('Audit trail', 'checkc', UI.table([
          { h: 'Audit', render: function (a) { return '<b>' + UI.esc(a.type) + '</b><div style="font-size:10.5px;color:var(--text-2)">' + UI.esc(a.scope) + '</div>'; } },
          { h: 'Date', render: function (a) { return UI.fmtDate(a.date); } },
          { h: 'Findings', render: function (a) { return a.findings || 0; } },
          { h: 'Status', render: function (a) { return UI.badge(a.status); } }
        ], DB.audits)) +
        '</div></div>';
    }
    render();

  }
});
})();

/* ── principal/staff ............................. ── */
(function () {
MDTPAGE({
  role: 'principal',
  folder: 'principal',
  id: 'staff',
  render: function (view, ctx) {

    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>Staff Overview</h1><div class="sub">' + DB.staff.length + ' members across teaching, leadership, hostel and office cadres</div></div>' +
      '<div class="actions">' + UI.expBtn('stExp', 'Export staff') + '</div></div>' +
      '<div class="statrow">' +
      UI.stat({ tone: 'b', icon: 'users', value: DB.staff.filter(function (s) { return s.role === 'teacher'; }).length, label: 'Teaching faculty' }) +
      UI.stat({ tone: 'g', icon: 'shield', value: DB.staff.filter(function (s) { return ['warden', 'office'].indexOf(s.role) >= 0; }).length, label: 'Wardens & office' }) +
      UI.stat({ tone: 'y', icon: 'cap', value: DB.staff.reduce(function (a, s) { return a + (s.exp || 0); }, 0), label: 'Combined experience (years)' }) +
      '</div>' +
      UI.card('Institution register', 'users', UI.table([
        { h: 'Member', render: function (r) { return UI.avatar(r, 30) + ' <b>' + UI.esc(r.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + r.id + ' · ' + r.exp + ' yrs</div>'; } },
        { h: 'Designation', render: function (r) { return UI.esc(r.designation); } },
        { h: 'Domain', render: function (r) { return r.dept === 'GEN' ? 'Administration' : r.dept; } },
        { h: 'Role', render: function (r) { return '<span class="tag ' + { teacher: 'b', academic: 'y', principal: 'r', warden: 'g', office: 'g', admin: 'y' }[r.role] + '">' + r.role + '</span>'; } },
        { h: 'Duties', render: function (r) { return r.advisorClass ? 'Class advisor — ' + r.advisorClass : (r.block ? 'Warden — ' + r.blockName : UI.esc(r.expertise.split(',')[0])); } },
        { h: 'Contact', render: function (r) { return '<span style="font-size:12px">' + UI.esc(r.email) + '</span>'; } }
      ], DB.staff));

    /* v5-export:pstaff handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#stExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'STAFF REGISTER'],
        ['Generated', Q.today()],
        [],
        ['Staff ID', 'Name', 'Role', 'Designation', 'Email', 'Phone', 'Experience (yrs)']
      ];
      DB.staff.forEach(function (s) {
        rows.push([s.id, s.name, s.role, s.designation, s.email, s.phone, s.exp]);
      });
      UI.downloadCSV('StaffRegister.csv', rows);
    });

  }
});
})();

/* ── warden/complaints ........................... ── */
(function () {
MDTPAGE({
  role: 'warden',
  folder: 'warden',
  id: 'complaints',
  render: function (view, ctx) {
    var w = ctx.person;
    var BLOCK = w.block, GIRLS = w.genderLock === 'F';
    var GIRLS_LABEL = GIRLS ? 'Girls' : 'Boys';
    var BLOCKNAME = w.blockName;
    var residents = Q.residentsOf(BLOCK);
    var myOutings = function () { return DB.outingRequests.filter(function (r) { var s = Q.studentById(r.studentId); return s && s.block === BLOCK; }); };
    var myComplaints = function () { return DB.complaints.filter(function (c) { return c.block === BLOCK; }); };

    function render() {
      var cmp = myComplaints();
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Complaints</h1><div class="sub">' + UI.esc(BLOCKNAME) + ' · maintenance, housekeeping, mess and security</div></div>' +
        '<div class="actions">' + (myComplaints().length ? UI.expBtn('wcExp', 'Export log') : '') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'r', icon: 'alert', value: cmp.filter(function (c) { return c.status === 'Open'; }).length, label: 'Open' }) +
        UI.stat({ tone: 'y', icon: 'clock', value: cmp.filter(function (c) { return c.status === 'In Progress'; }).length, label: 'In progress' }) +
        UI.stat({ tone: 'g', icon: 'checkc', value: cmp.filter(function (c) { return c.status === 'Resolved'; }).length, label: 'Resolved' }) +
        '</div>' +
        UI.card('Complaint register', 'wrench', UI.table([
          { h: 'Complaint', render: function (r) { return '<b>' + UI.esc(r.title) + '</b><div style="font-size:11.5px;color:var(--text-2)">' + r.category + ' · by ' + UI.esc(Q.name(r.by)) + ' · ' + UI.fmtDT(r.at) + '</div>'; } },
          { h: 'Details', render: function (r) { return '<span style="color:var(--text-2)">' + UI.esc(r.desc) + '</span>'; } },
          { h: 'Status', render: function (r) { return UI.badge(r.status); } },
          { h: 'Resolution', render: function (r) { return r.resolution ? UI.esc(r.resolution) : ''; } },
          { h: 'Action', render: function (r) { return r.status !== 'Resolved' ? '<button class="btn sm ok" data-fix="' + r.id + '">' + UI.icon('check') + 'Resolve</button>' : ''; } }
        ], cmp));
      view.querySelectorAll('[data-fix]').forEach(function (b) { b.addEventListener('click', function () {
        var id = b.getAttribute('data-fix');
        UI.modal({ title: 'Resolve complaint', body:
          UI.field('fx-val', 'Resolution note for the resident', '<textarea class="input" id="fx-val" placeholder="What was done?"></textarea>', true),
          actions: '<button class="btn ok" id="fx-go">' + UI.icon('check') + 'Close complaint</button>' });
        document.getElementById('fx-go').addEventListener('click', function () {
          var v = document.getElementById('fx-val').value.trim();
          if (!v) { UI.toast('Add a resolution note', '', 'red'); return; }
          WF.resolveComplaint(id, w.id, v);
          UI.closeModal(); UI.toast('Complaint resolved', 'Resident notified.', 'green'); render();
        });
      }); });
    }
    render();

    /* v5-export:w complaints handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#wcExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'COMPLAINT LOG — ' + BLOCKNAME],
        ['Generated', Q.today()],
        [],
        ['Raised', 'Register No', 'Resident', 'Room', 'Category', 'Title', 'Status', 'Resolution']
      ];
      myComplaints().forEach(function (c) {
        var s = Q.studentById(c.studentId);
        rows.push([c.at, s ? s.reg : '—', s ? s.name : '—', s ? s.roomId : '—', c.category, c.title, c.status, c.resolution || '—']);
      });
      UI.downloadCSV('Complaints-' + BLOCK + '.csv', rows);
    });
    
  }
});
})();

/* ── warden/dashboard ............................ ── */
(function () {
MDTPAGE({
  role: 'warden',
  folder: 'warden',
  id: 'dashboard',
  render: function (view, ctx) {
    var w = ctx.person;
    var BLOCK = w.block, GIRLS = w.genderLock === 'F';
    var GIRLS_LABEL = GIRLS ? 'Girls' : 'Boys';
    var BLOCKNAME = w.blockName;
    var residents = Q.residentsOf(BLOCK);
    var myOutings = function () { return DB.outingRequests.filter(function (r) { var s = Q.studentById(r.studentId); return s && s.block === BLOCK; }); };
    var myComplaints = function () { return DB.complaints.filter(function (c) { return c.block === BLOCK; }); };

    var occ = Q.occupancy(BLOCK);
    var pend = myOutings().filter(function (r) { return r.status === 'Pending'; });
    var cmp = myComplaints();
    view.innerHTML =
      '<div class="pagehead"><span style="display:flex;gap:14px;align-items:center">' + UI.avatar(w, 44) +
      '<span><h1>' + UI.esc(BLOCKNAME) + '</h1><div class="sub">' + UI.esc(w.name) + ' · ' + residents.length + ' residents · ' + GIRLS_LABEL + '</div></span></span></div>' +
      '<div class="statrow">' +
      UI.stat({ tone: 'b', icon: 'bed', value: occ.occ + '/' + occ.cap, label: 'Occupancy', sub: occ.pct + '% · ' + occ.rooms + ' rooms' }) +
      UI.stat({ tone: 'y', icon: 'door', value: pend.length, label: 'Outing requests pending', href: 'outings.html' }) +
      UI.stat({ tone: 'r', icon: 'wrench', value: cmp.filter(function (c) { return c.status !== 'Resolved'; }).length, label: 'Open complaints', href: 'complaints.html' }) +
      UI.stat({ tone: 'g', icon: 'utensils', value: 'Mess', label: 'Menu & dining', sub: 'weekly plan', href: 'mess.html' }) +
      '</div>' +
      '<div class="split">' +
      '<div>' + UI.card('Today\u2019s outing movement — ' + GIRLS_LABEL + ' block', 'door',
        UI.table([
          { h: 'Resident', render: function (r) { var s = Q.studentById(r.studentId); return UI.avatar(s, 28) + ' ' + UI.esc(s.name) + '<div style="font-size:11px;color:var(--text-2)">' + s.roomId + '</div>'; } },
          { h: 'Window', render: function (r) { return UI.esc(r.out) + ' → ' + UI.esc(r.in); } },
          { h: 'Type', render: function (r) { return r.type; } },
          { h: 'Status', render: function (r) { return UI.badge(r.status) + (r.adStatus ? ' <span style="font-size:10px;color:var(--text-2)">AD: ' + r.adStatus + '</span>' : ''); } }
        ], myOutings().slice(0, 6)), null, { href: 'outings.html', label: 'Approve outings' }) +
      UI.card('Floor occupancy', 'building', UI.barsChart((function () {
        var floors = {}; Q.roomsOf(BLOCK).forEach(function (r) { var f = 'Floor ' + r.floor; floors[f] = floors[f] || { occ: 0, cap: 0 }; floors[f].occ += r.occupants.length; floors[f].cap += r.capacity; });
        return Object.keys(floors).sort().map(function (f) { return { l: f, v: floors[f].occ / floors[f].cap * 100, n: floors[f].occ + '/' + floors[f].cap, tone: 'b' }; });
      })()), null, { href: 'rooms.html', label: 'Manage rooms' }) +
      '</div>' +
      '<div>' + UI.card('Latest complaints', 'wrench', (cmp.length ? cmp.slice(0, 4).map(function (c) {
        return '<a class="lrow" href="complaints.html"><span class="ic" style="color:' + (c.status === 'Resolved' ? 'var(--g-green)' : 'var(--g-yellow)') + '">' + UI.icon('wrench') + '</span>' +
          '<span class="lmain"><b>' + UI.esc(c.title) + '</b><span>' + c.category + ' · ' + UI.fmtDT(c.at) + '</span></span>' + UI.badge(c.status) + '</a>';
      }).join('') : UI.empty('No complaints', 'checkc'))) +
      UI.card('Block governance', 'shield', '<ul style="margin:4px 0 0 16px;padding:0;font-size:12.5px;color:var(--text-2);line-height:1.9">' +
        '<li>Outing approvals for ' + GIRLS_LABEL.toLowerCase() + ' block rest with you alone for day outings.</li>' +
        '<li>Overnight outings additionally require the Academic Director\u2019s consent — dual approval.</li>' +
        '<li>Room allocation is gender-locked: the portal blocks cross-block assignments automatically.</li>' +
        '<li>The Principal sees a live occupancy overview of both blocks.</li></ul>') +
      '</div></div>';

  }
});
})();

/* ── warden/mess ................................. ── */
(function () {
MDTPAGE({
  role: 'warden',
  folder: 'warden',
  id: 'mess',
  render: function (view, ctx) {
    var w = ctx.person;
    var BLOCK = w.block, GIRLS = w.genderLock === 'F';
    var GIRLS_LABEL = GIRLS ? 'Girls' : 'Boys';
    var BLOCKNAME = w.blockName;
    var residents = Q.residentsOf(BLOCK);
    var myOutings = function () { return DB.outingRequests.filter(function (r) { var s = Q.studentById(r.studentId); return s && s.block === BLOCK; }); };
    var myComplaints = function () { return DB.complaints.filter(function (c) { return c.block === BLOCK; }); };

    var days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    function render() {
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Mess Menu</h1><div class="sub">Central mess · ' + UI.esc(BLOCKNAME) + ' dining · click any entry to revise it</div></div></div>' +
        UI.card('Weekly plan', 'utensils', UI.table([
          { h: 'Day', render: function (r, i) { return '<b>' + r.day + '</b>' + (i === 4 ? ' <span class="tag b">today</span>' : ''); } },
          { h: 'Breakfast', render: function (r) { return '<span class="dl" data-mm="' + r.day + '|breakfast">' + UI.esc(r.breakfast) + '</span>'; } },
          { h: 'Lunch', render: function (r) { return '<span class="dl" data-mm="' + r.day + '|lunch">' + UI.esc(r.lunch) + '</span>'; } },
          { h: 'Snacks', render: function (r) { return '<span class="dl" data-mm="' + r.day + '|snacks">' + UI.esc(r.snacks) + '</span>'; } },
          { h: 'Dinner', render: function (r) { return '<span class="dl" data-mm="' + r.day + '|dinner">' + UI.esc(r.dinner) + '</span>'; } }
        ], DB.messMenu)) +
        UI.hint('Every revision notifies the residents and appears on their mess timetable immediately.', '', 'info') +
        UI.card('Nutrition & hygiene checklist', 'shield', UI.kv([
          ['Kitchen inspection', UI.badge('Approved', 'This week — cleared')],
          ['Water test', UI.badge('Approved', 'Monthly — cleared')],
          ['Menu committee review', UI.badge('Processing', 'Due next Monday')]
        ]));
      view.querySelectorAll('[data-mm]').forEach(function (el) { el.addEventListener('click', function () {
        var parts = el.getAttribute('data-mm').split('|');
        var day = parts[0], meal = parts[1];
        var m = DB.messMenu.filter(function (x) { return x.day === day; })[0];
        UI.modal({ title: 'Revise ' + day + ' — ' + meal, body:
          UI.field('mm-val', 'New ' + meal + ' menu', '<input class="input" id="mm-val" value="' + UI.esc(m[meal]) + '">', true),
          actions: '<button class="btn ok" id="mm-go">' + UI.icon('check') + 'Save menu</button>' });
        document.getElementById('mm-go').addEventListener('click', function () {
          var v = document.getElementById('mm-val').value.trim();
          if (!v) { UI.toast('Enter a menu', '', 'red'); return; }
          WF.updateMessMenu(day, meal, v, w.id);
          UI.closeModal(); UI.toast('Menu updated', day + ' ' + meal + ' published to residents.', 'green'); render();
        });
      }); });
    }
    render();

  }
});
})();

/* ── warden/outings .............................. ── */
(function () {
MDTPAGE({
  role: 'warden',
  folder: 'warden',
  id: 'outings',
  render: function (view, ctx) {
    var w = ctx.person;
    var BLOCK = w.block, GIRLS = w.genderLock === 'F';
    var GIRLS_LABEL = GIRLS ? 'Girls' : 'Boys';
    var BLOCKNAME = w.blockName;
    var residents = Q.residentsOf(BLOCK);
    var myOutings = function () { return DB.outingRequests.filter(function (r) { var s = Q.studentById(r.studentId); return s && s.block === BLOCK; }); };
    var myComplaints = function () { return DB.complaints.filter(function (c) { return c.block === BLOCK; }); };


    function render() {
      var all = myOutings();
      var pend = all.filter(function (r) { return r.status === 'Pending'; });
      var act = all.filter(function (r) { return r.status === 'Approved' || r.status === 'Warden Approved' || r.status === 'Completed'; });
      var hist = all.filter(function (r) { return r.status === 'Rejected'; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Outing Approvals</h1><div class="sub">' + UI.esc(BLOCKNAME) + ' · day outings close at 8 PM · overnight needs the Academic Director too</div></div>' +
        '<div class="actions">' + (all.length ? UI.expBtn('woExp', 'Export log') : '') + '</div></div>' +
        (pend.length ? '<div class="grid g2">' + pend.map(function (r) {
          var s = Q.studentById(r.studentId);
          return '<div class="card glow glow-y accent-y"><div class="spread">' +
            '<div style="display:flex;gap:10px;align-items:center">' + UI.avatar(s, 40) + '<span><b>' + UI.esc(s.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + s.reg + ' · ' + s.roomId + ' · ' + s.classId + '</div></span></div>' +
            UI.badge('Pending') + '</div>' +
            '<div class="mt8"><b>' + UI.esc(r.place) + '</b><div style="font-size:12px;color:var(--text-2)">' + r.type + ' · out ' + UI.esc(r.out) + ' · return ' + UI.esc(r.in) + '</div></div>' +
            '<div class="mt8" style="font-size:12.5px;color:var(--text-2)">' + UI.esc(r.reason) + '</div>' +
            (r.deadline ? '<div class="tk-meta" style="margin:8px 0 0">' + UI.reqDeadlineChip(r.deadline) + '<span class="fhint">decision requested by the student</span></div>' : '') +
            '<div class="mt8">' + UI.timeline(r.timeline) + '</div>' +
            (r.adStatus ? '<div class="mt8">' + UI.hint('Overnight request — your approval is stage 1; the Academic Director completes stage 2.', 'warn', 'alert') + '</div>' : '') +
            '<div class="frow" style="justify-content:flex-start">' +
            '<button class="btn ok" data-oap="' + r.id + '">' + UI.icon('check') + 'Approve</button>' +
            '<button class="btn ghost-r" data-orj="' + r.id + '">' + UI.icon('x') + 'Reject</button></div></div>';
        }).join('') + '</div>' : UI.empty('No pending outing requests', 'checkc', 'Residents of your block apply from their portal.')) +
        UI.card('Approved & active', 'door', UI.table([
          { h: 'Resident', render: function (r) { var s = Q.studentById(r.studentId); return UI.avatar(s, 28) + ' ' + UI.esc(s.name); } },
          { h: 'Place', render: function (r) { return UI.esc(r.place); } },
          { h: 'Window', render: function (r) { return UI.esc(r.out) + ' → ' + UI.esc(r.in); } },
          { h: 'Req. deadline', render: function (r) { return r.deadline ? '<span class="mono">' + r.deadline + '</span>' : '—'; } },
          { h: 'Status', render: function (r) { return UI.badge(r.status) + (r.adStatus ? ' <span style="font-size:10px;color:var(--text-2)">AD: ' + r.adStatus + '</span>' : ''); } }
        ], act)) +
        UI.card('Rejected', 'x', UI.table([
          { h: 'Resident', render: function (r) { var s = Q.studentById(r.studentId); return UI.esc(s.name); } },
          { h: 'Place', render: function (r) { return UI.esc(r.place); } },
          { h: 'Reason recorded', render: function (r) { var st = r.timeline.filter(function (t) { return t.s.indexOf('Rejected') >= 0; })[0]; return st ? UI.esc(st.note || '—') : '—'; } }
        ], hist));
      view.querySelectorAll('[data-oap]').forEach(function (b) { b.addEventListener('click', function () {
        var id = b.getAttribute('data-oap');
        UI.modal({ title: 'Approve outing?', body: '<div class="fld"><label>Note for the resident (optional)</label><textarea class="input" id="o-note" placeholder="e.g. Return before 8 PM sharp"></textarea></div>',
          actions: '<button class="btn ok" id="o-go">' + UI.icon('check') + 'Confirm</button><button class="btn" onclick="UI.closeModal()">Cancel</button>' });
        document.getElementById('o-go').addEventListener('click', function () {
          WF.decideOuting(id, w.id, true, document.getElementById('o-note').value.trim());
          UI.closeModal(); UI.toast('Outing approved', 'Resident notified.', 'green'); render();
        });
      }); });
      view.querySelectorAll('[data-orj]').forEach(function (b) { b.addEventListener('click', function () {
        var id = b.getAttribute('data-orj');
        UI.modal({ title: 'Reject outing?', body: '<div class="fld"><label>Reason for the resident</label><textarea class="input" id="or-note"></textarea></div>',
          actions: '<button class="btn danger" id="or-go">' + UI.icon('x') + 'Confirm rejection</button><button class="btn" onclick="UI.closeModal()">Cancel</button>' });
        document.getElementById('or-go').addEventListener('click', function () {
          WF.decideOuting(id, w.id, false, document.getElementById('or-note').value.trim() || 'Rejected by the warden.');
          UI.closeModal(); UI.toast('Outing rejected', 'Resident notified.', 'red'); render();
        });
      }); });
    }
    render();

    /* v5-export:w outings handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#woExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'OUTING LOG — ' + BLOCKNAME],
        ['Generated', Q.today()],
        [],
        ['Register No', 'Resident', 'Room', 'Type', 'Place', 'Out', 'In', 'Requested deadline', 'Status', 'AD stage']
      ];
      myOutings().forEach(function (r) {
        var st = Q.studentById(r.studentId);
        rows.push([st ? st.reg : '—', st ? st.name : '—', st ? st.roomId : '—', r.type, r.place, r.out, r.in, r.deadline || '—', r.status, r.adStatus || '—']);
      });
      UI.downloadCSV('OutingLog-' + BLOCK + '.csv', rows);
    });
    
  }
});
})();

/* ── warden/profile .............................. ── */
(function () {
MDTPAGE({
  role: 'warden',
  folder: 'warden',
  id: 'profile',
  render: function (view, ctx) {
    var w = ctx.person;
    var BLOCK = w.block, GIRLS = w.genderLock === 'F';
    var GIRLS_LABEL = GIRLS ? 'Girls' : 'Boys';
    var BLOCKNAME = w.blockName;
    var residents = Q.residentsOf(BLOCK);
    var myOutings = function () { return DB.outingRequests.filter(function (r) { var s = Q.studentById(r.studentId); return s && s.block === BLOCK; }); };
    var myComplaints = function () { return DB.complaints.filter(function (c) { return c.block === BLOCK; }); };

    var occ = Q.occupancy(BLOCK);
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>My Profile</h1><div class="sub">Warden profile · ' + UI.esc(BLOCKNAME) + '</div></div></div>' +
      '<div class="split-eq">' +
      '<div><div class="card glow glow-b accent-b">' + UI.photoBox(w, 'Your photo appears to residents on their hostel page.') + '</div>' +
      UI.card('Wardenship', 'shield', UI.kv([
        ['Employee code', '<b class="mono">' + w.id + '</b>'],
        ['Designation', UI.esc(w.designation)],
        ['Block', BLOCKNAME],
        ['Gender governance', GIRLS_LABEL + ' block — resident records, outings, rooms and complaints of this block only'],
        ['Residents', '<b>' + residents.length + '</b> · occupancy ' + occ.pct + '%'],
        ['Dining hall', BLOCK === 'A' ? 'Block A dining hall (Boys)' : 'Block B dining hall (Girls)']
      ])) + '</div>' +
      '<div>' + UI.card('Contact', 'idcard', UI.kv([
        ['Email', UI.esc(w.email)],
        ['Phone', UI.esc(w.phone)],
        ['Campus', DB.settings.institute]
      ])) +
      UI.card('Emergency protocol', 'alert',
        '<ul style="margin:4px 0 0 16px;padding:0;font-size:12.5px;color:var(--text-2);line-height:1.9">' +
        '<li>Gate register closes 8:00 PM for day outings.</li>' +
        '<li>Overnight outings need prior Academic Director consent — no exceptions at the gate.</li>' +
        '<li>Medical emergencies: campus medical room (ext. 108) then ' + UI.esc(w.phone) + '.</li></ul>') +
      '</div></div>';

  }
});
})();

/* ── warden/residents ............................ ── */
(function () {
MDTPAGE({
  role: 'warden',
  folder: 'warden',
  id: 'residents',
  render: function (view, ctx) {
    var w = ctx.person;
    var BLOCK = w.block, GIRLS = w.genderLock === 'F';
    var GIRLS_LABEL = GIRLS ? 'Girls' : 'Boys';
    var BLOCKNAME = w.blockName;
    var residents = Q.residentsOf(BLOCK);
    var myOutings = function () { return DB.outingRequests.filter(function (r) { var s = Q.studentById(r.studentId); return s && s.block === BLOCK; }); };
    var myComplaints = function () { return DB.complaints.filter(function (c) { return c.block === BLOCK; }); };

    var state = { q: '' };
    function render() {
      var list = residents.filter(function (s) { return !state.q || (s.name + s.reg + s.roomId).toLowerCase().indexOf(state.q.toLowerCase()) >= 0; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Residents</h1><div class="sub">' + UI.esc(BLOCKNAME) + ' · ' + residents.length + ' residents (' + GIRLS_LABEL.toLowerCase() + ')</div></div>' +
        '<div class="actions">' + UI.expBtn('wtExp', 'Export residents') + '</div></div>' +
        '<div class="rowflex" style="margin-bottom:16px"><span class="qsearch" style="max-width:340px">' + UI.icon('search') + '<input class="input" id="rs-q" placeholder="Search name, reg no or room" value="' + UI.esc(state.q) + '"></span></div>' +
        UI.card('Resident register', 'users', UI.table([
          { h: 'Resident', render: function (r) { return UI.avatar(r, 30) + ' <b>' + UI.esc(r.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + r.reg + '</div>'; } },
          { h: 'Room', render: function (r) { return '<span class="tag b">' + r.roomId + '</span>'; } },
          { h: 'Class', render: function (r) { return r.classId; } },
          { h: 'Attendance', render: function (r) { var p = Q.attPctOverall(r.id); return UI.bar(p, p >= 75 ? 'g' : 'r') + ' <span class="num">' + p + '%</span>'; } },
          { h: 'Contact', render: function (r) { return '<span style="font-size:12px">' + UI.esc(r.phone) + '<div style="color:var(--text-3)">' + UI.esc(r.parentName) + '</div></span>'; } },
          { h: 'Action', render: function (r) { return '<span class="dl" data-vac="' + r.id + '">Vacate</span>'; } }
        ], list));
      var q = document.getElementById('rs-q');
      q.addEventListener('input', function () { state.q = q.value; var pos = q.selectionStart; render(); var q2 = document.getElementById('rs-q'); q2.focus(); q2.setSelectionRange(pos, pos); });
      view.querySelectorAll('[data-vac]').forEach(function (el) { el.addEventListener('click', function () {
        var s = Q.studentById(el.getAttribute('data-vac'));
        UI.modal({ title: 'Vacate ' + s.roomId + '?', body: '<p>' + UI.esc(s.name) + ' will move to day-scholar status and the berth opens up on the block map.</p>',
          actions: '<button class="btn danger" id="vc-go">' + UI.icon('x') + 'Confirm vacate</button><button class="btn" onclick="UI.closeModal()">Cancel</button>' });
        document.getElementById('vc-go').addEventListener('click', function () {
          WF.vacateRoom(s.id, w.id); UI.closeModal(); UI.toast('Vacated', s.name + ' removed from ' + BLOCKNAME + '.', 'yellow'); render();
        });
      }); });
    }
    render();

    /* v5-export:w residents handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#wtExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'RESIDENTS REGISTER — ' + BLOCKNAME],
        ['Generated', Q.today()],
        [],
        ['Register No', 'Resident', 'Room', 'Phone', 'Parent contact', 'Attendance %']
      ];
      residents.forEach(function (s) {
        rows.push([s.reg, s.name, s.roomId, s.phone || '—', s.parentPhone || (s.parent && s.parent.phone) || '—', Q.attPctOverall(s.id) + '%']);
      });
      UI.downloadCSV('Residents-' + BLOCK + '.csv', rows);
    });
    
  }
});
})();

/* ── warden/rooms ................................ ── */
(function () {
MDTPAGE({
  role: 'warden',
  folder: 'warden',
  id: 'rooms',
  render: function (view, ctx) {
    var w = ctx.person;
    var BLOCK = w.block, GIRLS = w.genderLock === 'F';
    var GIRLS_LABEL = GIRLS ? 'Girls' : 'Boys';
    var BLOCKNAME = w.blockName;
    var residents = Q.residentsOf(BLOCK);
    var myOutings = function () { return DB.outingRequests.filter(function (r) { var s = Q.studentById(r.studentId); return s && s.block === BLOCK; }); };
    var myComplaints = function () { return DB.complaints.filter(function (c) { return c.block === BLOCK; }); };

    function render() {
      var rooms = Q.roomsOf(BLOCK);
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Room Allocation</h1><div class="sub">' + UI.esc(BLOCKNAME) + ' · ' + rooms.length + ' rooms · assignments are gender-locked to this block</div></div>' +
        '<div class="actions">' + UI.expBtn('wrExp', 'Export rooms') + '</div></div>' +
        '<div class="actions"><button class="btn pri" id="alloc">' + UI.icon('key') + 'Allocate room</button></div></div>' +
        UI.card('Block map', 'building', '<div class="grid g4">' + rooms.map(function (r) {
          var full = r.occupants.length >= r.capacity;
          var tone = full ? 'r' : r.occupants.length ? 'y' : 'g';
          return '<div class="card glow glow-' + tone + ' accent-' + tone + '" style="margin:0;cursor:pointer" data-room="' + r.id + '">' +
            '<div class="spread"><b class="mono">' + r.id + '</b>' + (full ? UI.badge('Blocked', 'Full') : UI.badge(r.occupants.length ? 'Open' : 'Approved', r.occupants.length ? r.occupants.length + '/' + r.capacity : 'vacant')) + '</div>' +
            '<div class="mt8" style="display:flex;gap:4px">' + r.occupants.map(function (o) { return UI.avatar(Q.studentById(o), 26); }).join('') + '</div></div>';
        }).join('') + '</div>') +
        UI.card('Vacancy summary', 'chart', UI.barsChart((function () {
          var floors = {}; rooms.forEach(function (r) { var f = 'Floor ' + r.floor; floors[f] = floors[f] || { occ: 0, cap: 0 }; floors[f].occ += r.occupants.length; floors[f].cap += r.capacity; });
          return Object.keys(floors).sort().map(function (f) { return { l: f, v: floors[f].occ / floors[f].cap * 100, n: (floors[f].cap - floors[f].occ) + ' free', tone: 'g' }; });
        })()));
      view.querySelectorAll('[data-room]').forEach(function (el) { el.addEventListener('click', function () {
        var room = DB.hostelRooms.filter(function (r) { return r.id === el.getAttribute('data-room'); })[0];
        UI.modal({ title: 'Room ' + room.id, body:
          UI.kv([['Block', BLOCKNAME], ['Capacity', room.capacity], ['Occupied', room.occupants.length]]) +
          '<div class="mt16">' + UI.table([
            { h: 'Resident', render: function (r) { return UI.avatar(r, 28) + ' ' + UI.esc(r.name) + '<div style="font-size:11px;color:var(--text-2)">' + r.reg + ' · ' + r.classId + '</div>'; } },
            { h: 'Contact', render: function (r) { return UI.esc(r.phone); } },
            { h: 'Action', render: function (r) { return '<button class="btn sm ghost-r" data-vac="' + r.id + '">Vacate</button>'; } }
          ], room.occupants.map(function (o) { return Q.studentById(o); })) + '</div>',
          actions: '<button class="btn" onclick="UI.closeModal()">Close</button>' });
        var bind = function () {
          document.querySelectorAll('[data-vac]').forEach(function (vb) { vb.addEventListener('click', function () {
            WF.vacateRoom(vb.getAttribute('data-vac'), w.id);
            UI.toast('Room vacated', 'Occupancy updated.', 'yellow');
            UI.closeModal(); render();
          }); });
        };
        bind();
      }); });
      document.getElementById('alloc').addEventListener('click', function () {
        var nonResidents = DB.students.filter(function (s) { return s.gender === w.genderLock && !s.hostel; });
        UI.modal({ title: 'Allocate a room', body:
          '<div class="fgrid">' +
          UI.field('ac-stu', 'Student (' + GIRLS_LABEL.toLowerCase() + ' applicants only)', UI.select('ac-stu', nonResidents.map(function (s) { return { v: s.id, l: s.name + ' · ' + s.reg + ' · ' + s.classId }; })), true) +
          UI.field('ac-room', 'Room', UI.select('ac-room', rooms.filter(function (r) { return r.occupants.length < r.capacity; }).map(function (r) { return { v: r.id, l: r.id + ' · ' + (r.capacity - r.occupants.length) + ' berth free' }; })), true) +
          '</div>' +
          UI.hint('The portal enforces the block\u2019s gender lock — mismatches are rejected outright.', '', 'info'),
          actions: '<button class="btn ok" id="ac-go">' + UI.icon('key') + 'Confirm allocation</button>' });
        document.getElementById('ac-go').addEventListener('click', function () {
          var ok = WF.allocateRoom(document.getElementById('ac-stu').value, document.getElementById('ac-room').value, w.id);
          if (ok) { UI.closeModal(); UI.toast('Room allocated', 'Resident notified with block and warden details.', 'green'); }
          render();
        });
      });
    }
    render();

    /* v5-export:w rooms handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#wrExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'ROOM REGISTER — ' + BLOCKNAME],
        ['Generated', Q.today()],
        [],
        ['Room', 'Floor', 'Capacity', 'Occupants', 'Vacancy', 'Residents']
      ];
      Q.roomsOf(BLOCK).forEach(function (r) {
        var names = r.occupants.map(function (id) { var s = Q.studentById(id); return s ? s.name + ' (' + s.reg + ')' : id; }).join(' | ');
        rows.push([r.id, 'Floor ' + r.floor, r.capacity, r.occupants.length, r.capacity - r.occupants.length, names]);
      });
      UI.downloadCSV('Rooms-' + BLOCK + '.csv', rows);
    });
    
  }
});
})();

/* ── office/certificates ......................... ── */
(function () {
MDTPAGE({
  role: 'office',
  folder: 'office',
  id: 'certificates',
  render: function (view, ctx) {

    function render() {
      var pend = DB.certificates.filter(function (c) { return c.status === 'Pending'; });
      var done = DB.certificates.filter(function (c) { return c.status === 'Issued'; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Certificates</h1><div class="sub">Bonafide, transcript and character certificates — usually issued in two working days</div></div>' +
        '<div class="actions">' + UI.expBtn('certExp', 'Export log') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'y', icon: 'file', value: pend.length, label: 'Pending requests' }) +
        UI.stat({ tone: 'g', icon: 'checkc', value: done.length, label: 'Issued' }) +
        '</div>' +
        UI.card('Request queue', 'file',
          (pend.length ? UI.table([
            { h: 'Student', render: function (r) { var s = Q.studentById(r.studentId); return UI.avatar(s, 28) + ' <b>' + UI.esc(s.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + s.reg + ' · ' + s.classId + '</div>'; } },
            { h: 'Type', render: function (r) { return UI.esc(r.type); } },
            { h: 'Reason', render: function (r) { return '<span style="color:var(--text-2)">' + UI.esc(r.reason) + '</span>'; } },
            { h: 'Requested', render: function (r) { return UI.fmtDate(r.requestedAt); } },
            { h: 'Action', render: function (r) { return '<button class="btn sm ok" data-iss="' + r.id + '">' + UI.icon('check') + 'Issue now</button>'; } }
          ], pend) : UI.empty('No pending certificate requests', 'checkc'))) +
        UI.card('Issued register', 'list', UI.table([
          { h: 'Ref No', render: function (r) { return '<span class="mono">' + r.refNo + '</span>'; } },
          { h: 'Student', render: function (r) { var s = Q.studentById(r.studentId); return UI.esc(s.name) + ' (' + s.reg + ')'; } },
          { h: 'Type', render: function (r) { return UI.esc(r.type); } },
          { h: 'Issued', render: function (r) { return UI.fmtDate(r.issuedAt); } },
          { h: 'By', render: function (r) { return UI.esc(Q.name(r.issuedBy)); } }
        ], done));
      view.querySelectorAll('[data-iss]').forEach(function (b) { b.addEventListener('click', function () {
        var c = DB.certificates.filter(function (x) { return x.id === b.getAttribute('data-iss'); })[0];
        WF.issueCertificate(c.id, me.id);
        var upd = DB.certificates.filter(function (x) { return x.id === c.id; })[0];
        var s = Q.studentById(c.studentId);
        UI.downloadCSV('MDT-Cert-' + upd.refNo.replace(/\//g, '-') + '.csv', [
          ['My Desktop Tech — CampusOne', ''],
          ['Institute', DB.settings.institute],
          ['City', DB.settings.city],
          ['Document', upd.type.toUpperCase()],
          ['Ref No', upd.refNo],
          ['Date', upd.issuedAt],
          [],
          ['Certified student', s.name],
          ['Register no', s.reg],
          ['Class', s.classId],
          ['Status', 'Bonafide student of this institution'],
          ['Purpose', upd.reason],
          [],
          ['Issued by', 'Office of Academic Administration']
        ]);
        UI.toast('Certificate issued', 'Ref ' + upd.refNo + ' · student notified.', 'green');
        render();
      }); });
    }
    render();

    /* v5-export:cert handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#certExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'CERTIFICATE ISSUE LOG'],
        ['Generated', Q.today()],
        [],
        ['Ref No', 'Register No', 'Student', 'Type', 'Requested', 'Issued', 'Status']
      ];
      DB.certificates.forEach(function (c) {
        var st = Q.studentById(c.studentId);
        rows.push([c.ref || c.id, st ? st.reg : '—', st ? st.name : '—', c.type, c.appliedAt || '—', c.issuedAt || '—', c.status]);
      });
      UI.downloadCSV('CertificateLog.csv', rows);
    });

  }
});
})();

/* ── office/dashboard ............................ ── */
(function () {
MDTPAGE({
  role: 'office',
  folder: 'office',
  id: 'dashboard',
  render: function (view, ctx) {

    var me = ctx.person;
    var certPend = DB.certificates.filter(function (c) { return c.status === 'Pending'; });
    var openTk = DB.tickets.filter(function (t) { return t.status !== 'Resolved'; });
    var duesList = DB.students.filter(function (s) { return Q.duesOf(s.id).total > DB.settings.wf.feeGrace; });
    var schPend = DB.scholarshipApps.filter(function (a) { return a.status === 'Applied'; });
    view.innerHTML =
      '<div class="pagehead"><span style="display:flex;gap:14px;align-items:center">' + UI.avatar(me, 44) +
      '<span><h1>' + UI.esc(me.name) + '</h1><div class="sub">' + UI.esc(me.designation) + ' · student services desk</div></span></span></div>' +
      '<div class="statrow">' +
      UI.stat({ tone: 'g', icon: 'rupee', value: UI.money(Q.collectionToday()), label: 'Collected today', href: 'fees.html' }) +
      UI.stat({ tone: 'y', icon: 'file', value: certPend.length, label: 'Certificates to issue', href: 'certificates.html' }) +
      UI.stat({ tone: 'r', icon: 'idcard', value: duesList.length, label: 'Fee dues above grace', sub: 'hall-ticket holds', href: 'fees.html' }) +
      UI.stat({ tone: 'b', icon: 'ticket', value: openTk.length, label: 'Open help tickets', href: 'tickets.html' }) +
      '</div>' +
      '<div class="split">' +
      '<div>' + UI.card('Service queues', 'grid', UI.table([
        { h: 'Queue', render: function (r) { return '<b>' + UI.esc(r.t) + '</b><div style="font-size:11.5px;color:var(--text-2)">' + UI.esc(r.d) + '</div>'; } },
        { h: 'Count', render: function (r) { return '<b class="num" style="font-size:16px;color:var(--' + r.tone + '-ink)">' + r.n + '</b>'; } },
        { h: 'Action', render: function (r) { return '<a class="btn sm pri" href="' + r.href + '">Open</a>'; } }
      ], [
        { t: 'Fee dues above grace', d: 'students blocked from hall tickets', n: duesList.length, tone: 'r', href: 'fees.html' },
        { t: 'Certificate requests', d: 'bonafide, transcript, character', n: certPend.length, tone: 'y', href: 'certificates.html' },
        { t: 'Hall ticket batches', d: 'generate with fee clearance check', n: 1, tone: 'b', href: 'halltickets.html' },
        { t: 'Scholarship verification', d: 'document checks for the Principal', n: schPend.length, tone: 'g', href: 'scholarships.html' },
        { t: 'Open tickets', d: 'IT, library, hostel, fees, exams', n: openTk.length, tone: 'r', href: 'tickets.html' }
      ])) +
      UI.card('Recent fee activity', 'rupee', DB.feeTransactions.slice(0, 6).map(function (t) {
        var s = Q.studentById(t.studentId);
        return '<div class="lrow" style="cursor:default"><span class="ic" style="color:var(--g-green)">' + UI.icon('rupee') + '</span>' +
          '<span class="lmain"><b>' + UI.esc(s.name) + ' — ' + UI.money(t.amount) + '</b><span>' + (DB.feeHeads.filter(function (h) { return h.id === t.head; })[0] || { name: t.head }).name + ' · ' + t.mode + '</span></span>' +
          '<span class="ltime">' + UI.esc(t.receipt) + '</span></div>';
      }).join('')) + '</div>' +
      '<div>' + UI.card('Today\u2019s desk', 'calendar', UI.kv([
        ['Fee receipts issued', '<b class="num">' + DB.feeTransactions.filter(function (x) { return x.date === Q.today(); }).length + '</b>'],
        ['Library issues/returns', '<b class="num">' + DB.borrowRecords.filter(function (b) { return b.out === Q.today() || b.returned === Q.today(); }).length + '</b>'],
        ['Placement drives open', '<b class="num">' + DB.placementDrives.filter(function (d) { return d.status === 'Open'; }).length + '</b>'],
        ['Circulars this week', '<b class="num">' + DB.circulars.filter(function (c) { return c.at >= '2026-08-29'; }).length + '</b>']
      ])) +
      UI.card('Office quick actions', 'grid', '<div class="quickgrid">' +
        '<a class="bigbtn-tile" href="fees.html">' + UI.icon('rupee') + '<b>Collect fee</b></a>' +
        '<a class="bigbtn-tile" href="certificates.html">' + UI.icon('file') + '<b>Issue certificate</b></a>' +
        '<a class="bigbtn-tile" href="halltickets.html">' + UI.icon('idcard') + '<b>Hall tickets</b></a>' +
        '<a class="bigbtn-tile" href="library.html">' + UI.icon('book') + '<b>Library desk</b></a>' +
        '</div>') + '</div></div>';

  }
});
})();

/* ── office/events ............................... ── */
(function () {
MDTPAGE({
  role: 'office',
  folder: 'office',
  id: 'events',
  render: function (view, ctx) {

    var me = ctx.person;
    var state = { tab: 'upcoming' };
    function render() {
      var upcoming = DB.events.filter(function (e) { return !e.archive && e.to >= Q.today(); });
      var archived = DB.events.filter(function (e) { return e.archive || e.to < Q.today(); });
      var list = state.tab === 'upcoming' ? upcoming : state.tab === 'archived' ? archived : DB.events;
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Event Dashboard</h1><div class="sub">Campus events — technical, cultural, academic, sports · visibility windows and viewable areas controlled here</div></div>' +
        '<div class="actions"><button class="btn pri" id="newEV2">' + UI.icon('plus') + 'Post an event</button>' + UI.expBtn('evtExp', 'Export events') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'g', icon: 'calendar', value: upcoming.length, label: 'Upcoming &amp; live' }) +
        UI.stat({ tone: 'b', icon: 'grid', value: DB.events.length, label: 'Events (all time)' }) +
        UI.stat({ tone: 'y', icon: 'users', value: DB.events.filter(function (e) { return e.internal === 'External'; }).length, label: 'External collaborations' }) +
        UI.stat({ tone: 'r', icon: 'file', value: archived.length, label: 'Archived' }) +
        '</div>' +
        '<div class="rowflex mb16">' + UI.chiprow([
          { v: 'upcoming', l: 'Upcoming', c: upcoming.length },
          { v: 'archived', l: 'Archive', c: archived.length },
          { v: 'all', l: 'All', c: DB.events.length }
        ], state.tab) + '</div>' +
        UI.card('Events — ' + state.tab, 'calendar', UI.table([
          { h: 'Title', render: function (e) { return '<b>' + UI.esc(e.title) + '</b><div style="font-size:10.5px;color:var(--text-2)">' + UI.esc(e.category) + ' · ' + UI.esc(e.type) + ' · ' + UI.esc(e.org) + '</div>'; } },
          { h: 'Internal / External', render: function (e) { return e.internal; } },
          { h: 'Venue', render: function (e) { return UI.esc(e.venue); } },
          { h: 'Window', render: function (e) { return UI.fmtDate(e.from) + ' → ' + UI.fmtDate(e.to); } },
          { h: 'Viewable areas', render: function (e) { return UI.esc(e.areas); } },
          { h: 'Posted', render: function (e) { return UI.fmtDate(e.posted); } },
          { h: 'Status', render: function (e) { return UI.badge(e.status); } },
          { h: 'Action', render: function (e) { return e.archive ? '' : '<span class="dl" data-arcev="' + e.id + '" style="color:var(--red-ink)">Archive</span>'; } }
        ], list)) +
        UI.hint('Posting an event notifies the viewable areas instantly — students see it on the calendar and the news strip; archiving keeps the register complete for accreditation evidence.', '', 'info');
      view.querySelectorAll('.chip[data-f]').forEach(function (c) { c.addEventListener('click', function () { state.tab = c.getAttribute('data-f'); render(); }); });
      view.querySelectorAll('[data-arcev]').forEach(function (el) { el.addEventListener('click', function () {
        WF.archiveEvent(me.id, el.getAttribute('data-arcev'));
        UI.toast('Event archived', 'Register kept, notices withdrawn.', 'yellow'); render();
      }); });
      document.getElementById('newEV2').addEventListener('click', function () {
        UI.modal({ title: 'Post an event', body:
          UI.field('ev-t', 'Title', '<input class="input" id="ev-t" placeholder="e.g. AI Frontiers — Industry Conclave">', true) +
          '<div class="fgrid">' +
          UI.field('ev-c', 'Category', UI.select('ev-c', ['Academic', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar']), true) +
          UI.field('ev-i', 'Type', UI.select('ev-i', ['Internal', 'External']), true) +
          UI.field('ev-ty', 'Format', UI.select('ev-ty', ['Symposium', 'Fest', 'Workshop', 'Seminar', 'Tournament', 'Drive', 'Competition', 'Talk']), true) +
          UI.field('ev-o', 'Organiser / Department', '<input class="input" id="ev-o" placeholder="e.g. CSE Department">', true) + '</div>' +
          '<div class="fgrid">' +
          UI.field('ev-v', 'Venue', '<input class="input" id="ev-v" placeholder="e.g. Seminar Hall">', true) +
          UI.field('ev-a', 'Viewable areas', UI.select('ev-a', ['All', 'Students', 'Students · Faculty', 'CSE · ECE', 'Sem V Students']), true) + '</div>' +
          '<div class="fgrid">' +
          UI.field('ev-f', 'Visible from', '<input class="input" id="ev-f" type="date" min="' + Q.today() + '">', true) +
          UI.field('ev-tt', 'Visible to', '<input class="input" id="ev-tt" type="date" min="' + Q.today() + '">', true) + '</div>',
          actions: '<button class="btn pri" id="ev-go">' + UI.icon('check') + 'Publish event</button>' });
        document.getElementById('ev-go').addEventListener('click', function () {
          var t = document.getElementById('ev-t').value, f = document.getElementById('ev-f').value;
          if (!t || !f) { UI.toast('Title and visibility window required', '', 'red'); return; }
          WF.postEvent(me.id, { title: t, category: document.getElementById('ev-c').value, internal: document.getElementById('ev-i').value, type: document.getElementById('ev-ty').value,
            org: document.getElementById('ev-o').value || 'Campus Office', venue: document.getElementById('ev-v').value || 'Campus',
            areas: document.getElementById('ev-a').value, from: f, to: document.getElementById('ev-tt').value || f });
          UI.closeModal(); UI.toast('Event published', 'Viewable areas notified.', 'green'); render();
        });
      });
      var ex = document.getElementById('evtExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'EVENT REGISTER'],
          ['Generated', Q.today()],
          [],
          ['Title', 'Category', 'Internal/External', 'Organiser', 'Type', 'Venue', 'Posted', 'Visible From', 'Visible To', 'Viewable Areas', 'Status']
        ];
        DB.events.forEach(function (e) { rows.push([e.title, e.category, e.internal, e.org, e.type, e.venue, e.posted, e.from, e.to, e.areas, e.status]); });
        UI.downloadCSV('EventRegister.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── office/fees ................................. ── */
(function () {
MDTPAGE({
  role: 'office',
  folder: 'office',
  id: 'fees',
  render: function (view, ctx) {

    var state = { klass: 'CSE-A', mode: 'dues' };
    function render() {
      var students = Q.studentsOf(state.klass);
      var rows = students.map(function (s) { return { s: s, dues: Q.duesOf(s.id), tx: Q.feeTxOf(s.id) }; });
      var duesOnly = rows.filter(function (r) { return r.dues.total > 0; });
      var shown = state.mode === 'dues' ? duesOnly : rows;
      var collected = Q.feeTxOf('ST001').concat([]).length; /* placeholder */
      var classColl = DB.feeTransactions.filter(function (t) { return Q.studentById(t.studentId) && Q.studentById(t.studentId).classId === state.klass; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Fee Management</h1><div class="sub">Ledgers, collection, dues and receipts · hall tickets respect the ₹' + DB.settings.wf.feeGrace + ' grace</div></div>' +
        '<div class="actions"><button class="btn ghost" id="feeRemind">' + UI.icon('send') + 'Remind defaulters</button>' + UI.expBtn('ofDef', 'Export defaulters') + UI.expBtn('ofColl', 'Export collection') + '</div></div>' +
        '<div class="rowflex" style="margin-bottom:16px">' +
        DB.classes.map(function (c) { return '<span class="chip' + (state.klass === c.id ? ' on' : '') + '" data-fc="' + c.id + '">' + c.id + '</span>'; }).join('') +
        '<span class="spacer" style="flex:1"></span>' +
        '<span class="chip' + (state.mode === 'dues' ? ' on' : '') + '" data-fm="dues">Dues only (' + duesOnly.length + ')</span>' +
        '<span class="chip' + (state.mode === 'all' ? ' on' : '') + '" data-fm="all">All students</span>' +
        '</div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'r', icon: 'alert', value: duesOnly.length, label: 'With dues — ' + state.klass, sub: UI.money(duesOnly.reduce(function (a, r) { return a + r.dues.total; }, 0)) + ' outstanding' }) +
        UI.stat({ tone: 'g', icon: 'rupee', value: UI.money(classColl.reduce(function (a, b) { return a + b.amount; }, 0)), label: 'Collected — ' + state.klass }) +
        '</div>' +
        UI.card('Student ledger — ' + state.klass, 'rupee', UI.table([
          { h: 'Student', render: function (r) { return UI.avatar(r.s, 28) + ' <b>' + UI.esc(r.s.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + r.s.reg + (r.s.hostel ? ' · ' + r.s.roomId : '') + '</div>'; } },
          { h: 'Heads cleared', render: function (r) { var ok = 0; DB.feeHeads.forEach(function (h) { if (h.applies === 'hostellers' && !r.s.hostel) { ok++; return; } if ((r.s.feePaid || {})[h.id] >= h.amount) ok++; }); return '<span class="num">' + ok + '/4</span>'; } },
          { h: 'Dues', render: function (r) { return r.dues.total ? '<b class="num" style="color:var(--red-ink)">' + UI.money(r.dues.total) + '</b>' : UI.badge('Paid', 'Cleared'); } },
          { h: 'Hall ticket', render: function (r) { return r.dues.total > DB.settings.wf.feeGrace ? UI.badge('Blocked') : UI.badge('Eligible'); } },
          { h: 'Last receipt', render: function (r) { return r.tx.length ? '<span class="mono">' + r.tx[0].receipt + '</span><div style="font-size:10.5px;color:var(--text-2)">' + UI.fmtDate(r.tx[0].date) + '</div>' : '—'; } },
          { h: 'Action', render: function (r) { return '<button class="btn sm pri" data-col="' + r.s.id + '">' + UI.icon('rupee') + 'Collect</button>'; } }
        ], shown)) +
        UI.card('Class-wise collection', 'chart', UI.barsChart(DB.classes.map(function (c) {
          var coll = DB.feeTransactions.filter(function (t) { var s = Q.studentById(t.studentId); return s && s.classId === c.id; }).reduce(function (a, b) { return a + b.amount; }, 0);
          return { l: c.id, v: coll / 500000 * 100, n: '₹' + Math.round(coll / 1000) + 'k', tone: 'g' };
        })));
      view.querySelectorAll('[data-fc]').forEach(function (c) { c.addEventListener('click', function () { state.klass = c.getAttribute('data-fc'); render(); }); });
      view.querySelectorAll('[data-fm]').forEach(function (c) { c.addEventListener('click', function () { state.mode = c.getAttribute('data-fm'); render(); }); });
      view.querySelectorAll('[data-col]').forEach(function (b) { b.addEventListener('click', function () {
        var s = Q.studentById(b.getAttribute('data-col'));
        var dues = Q.duesOf(s.id);
        UI.modal({ title: 'Collect fee — ' + s.name, body:
          UI.kv([['Register', s.reg], ['Current dues', UI.money(dues.total)]]) +
          '<div class="fgrid mt16">' +
          UI.field('cl-head', 'Head', UI.select('cl-head', (dues.heads.length ? dues.heads : DB.feeHeads.filter(function (h) { return h.applies !== 'hostellers' || s.hostel; })).map(function (h) { return { v: h.id || h.head.id, l: (h.name || h.head.name) + (h.due != null ? ' · due ' + UI.money(h.due || h.amount) : '') }; })), true) +
          UI.field('cl-mode', 'Mode', UI.select('cl-mode', ['Cash', 'UPI', 'Net Banking', 'DD', 'Card']), true) +
          '</div>' +
          '<div class="mt8">' + UI.field('cl-amt', 'Amount', '<input class="input" id="cl-amt" type="number" placeholder="Amount received">', true) + '</div>',
          actions: '<button class="btn ok" id="cl-go">' + UI.icon('check') + 'Record payment</button>' });
        document.getElementById('cl-go').addEventListener('click', function () {
          var amt = +document.getElementById('cl-amt').value;
          if (!amt || amt < 1) { UI.toast('Enter the amount', '', 'red'); return; }
          var rc = WF.collectFee(s.id, document.getElementById('cl-head').value, amt, document.getElementById('cl-mode').value, me.id);
          UI.closeModal();
          UI.downloadCSV('Receipt-' + rc + '.csv', [
            ['My Desktop Tech — CampusOne', ''],
            ['Institute', DB.settings.institute],
            ['Document', 'FEE RECEIPT'],
            ['Receipt No', rc],
            ['Student', s.name + ' (' + s.reg + ')'],
            ['Class', s.classId],
            ['Head', DB.feeHeads.filter(function (h) { return h.id === document.getElementById('cl-head').value; })[0].name],
            ['Amount (Rs)', amt.toLocaleString('en-IN')],
            ['Mode', document.getElementById('cl-mode').value],
            ['Date', Q.today()],
            ['Issued by', 'Office of Finance & Accounts']
          ]);
          UI.toast('Payment recorded', 'Receipt ' + rc + ' generated.', 'green'); render();
        });
      }); });
    }
    render();

    /* v5-export:fees handlers (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      var el;
      if ((el = e.target.closest('#feeRemind'))) {
        var n = 0;
        DB.students.forEach(function (st) {
          var d = Q.duesOf(st.id);
          if (d.total > DB.settings.wf.feeGrace) {
            n++;
            WF.notify({ aud: 'uid:' + st.id, title: 'Fee reminder', body: 'Dues of ' + UI.money(d.total) + ' are pending — settle online or at the office to keep the hall ticket active.', link: 'fees.html', tone: 'red' });
          }
        });
        WF.log(me.id, 'Sent fee reminders', n + ' students notified');
        Store.save();
        UI.toast('Reminders sent', n + ' students with dues above the grace limit were notified.', 'green');
      } else if ((el = e.target.closest('#ofDef'))) {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'FEE DEFAULTERS LIST'],
          ['Generated', Q.today()],
          ['Grace limit (Rs)', DB.settings.wf.feeGrace],
          [],
          ['Register No', 'Student', 'Class', 'Hostel', 'Dues (Rs)', 'Heads pending', 'Hall ticket']
        ];
        DB.students.forEach(function (st) {
          var d = Q.duesOf(st.id);
          if (d.total > 0) {
            rows.push([st.reg, st.name, st.classId, st.hostel ? 'Hostel' : 'Day scholar', d.total, d.heads.map(function (x) { return x.head.name; }).join(' | '), d.total > DB.settings.wf.feeGrace ? 'Blocked' : 'Eligible']);
          }
        });
        UI.downloadCSV('FeeDefaulters.csv', rows);
      } else if ((el = e.target.closest('#ofColl'))) {
        var rows2 = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'FEE COLLECTION REGISTER'],
          ['Generated', Q.today()],
          [],
          ['Date', 'Receipt', 'Register No', 'Student', 'Class', 'Head', 'Mode', 'Amount (Rs)']
        ];
        var tot = 0;
        DB.feeTransactions.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; }).forEach(function (t) {
          var st = Q.studentById(t.studentId); var h = DB.feeHeads.filter(function (x) { return x.id === t.head; })[0];
          tot += t.amount;
          rows2.push([t.date, t.receipt, st ? st.reg : '—', st ? st.name : '—', st ? st.classId : '—', h ? h.name : '—', t.mode, t.amount]);
        });
        rows2.push([]);
        rows2.push(['Total collected (Rs)', tot]);
        UI.downloadCSV('FeeCollectionRegister.csv', rows2);
      }
    });

  }
});
})();

/* ── office/halltickets .......................... ── */
(function () {
MDTPAGE({
  role: 'office',
  folder: 'office',
  id: 'halltickets',
  render: function (view, ctx) {

    function render() {
      var hist = DB.hallTickets;
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Hall Tickets</h1><div class="sub">Generate with automatic fee-clearance checks — dues above ₹' + DB.settings.wf.feeGrace + ' hold the ticket</div></div>' +
        '<div class="actions">' + UI.expBtn('htExp', 'Export status') + '</div></div>' +
        '<div class="actions"><button class="btn pri" id="genHT">' + UI.icon('idcard') + 'Generate batch</button></div></div>' +
        UI.card('Publish a hall ticket batch', 'idcard',
          '<div class="fhint" style="margin-bottom:10px">The generator sweeps fee ledgers class-wise, marks eligible students, holds defaulters and notifies everyone instantly.</div>' +
          UI.table([
            { h: 'Exam', render: function (r) { return '<b>' + UI.esc(r.exam) + '</b>'; } },
            { h: 'Class', render: function (r) { return r.classId || 'All classes'; } },
            { h: 'Eligible', render: function (r) { return '<span class="num" style="color:var(--green-ink)">' + r.eligible + '</span>'; } },
            { h: 'Blocked', render: function (r) { return r.blocked ? '<span class="num" style="color:var(--red-ink)">' + r.blocked + '</span>' : '<span class="num">0</span>'; } },
            { h: 'Status', render: function (r) { return r.published ? UI.badge('Published', UI.fmtDate(r.publishedAt)) : UI.badge('Draft'); } }
          ], hist)) +
        UI.card('Defaulters preview — all classes', 'alert', UI.table([
          { h: 'Student', render: function (r) { return UI.avatar(r.s, 28) + ' <b>' + UI.esc(r.s.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + r.s.reg + ' · ' + r.s.classId + '</div>'; } },
          { h: 'Dues', render: function (r) { return '<b class="num" style="color:var(--red-ink)">' + UI.money(r.d) + '</b>'; } },
          { h: 'Heads pending', render: function (r) { return Q.duesOf(r.s.id).heads.map(function (h) { return '<span class="tag n">' + h.head.id + '</span>'; }).join(' '); } },
          { h: 'Hall ticket', render: function () { return UI.badge('Blocked'); } }
        ], DB.students.filter(function (s) { return Q.duesOf(s.id).total > DB.settings.wf.feeGrace; }).map(function (s) { return { s: s, d: Q.duesOf(s.id).total }; })));
      document.getElementById('genHT').addEventListener('click', function () {
        UI.modal({ title: 'Generate hall ticket batch', body:
          '<div class="fgrid">' +
          UI.field('ht-exam', 'Examination', UI.select('ht-exam', ['Internal Assessment II — Sep 2026', 'Model Examination — Nov 2026', 'End Semester — Nov 2026'])) +
          UI.field('ht-class', 'Class', UI.select('ht-class', DB.classes.map(function (c) { return { v: c.id, l: c.id }; }))) +
          '</div>' +
          UI.hint('Students with dues above the grace amount are held automatically — they clear at the desk and become eligible instantly.', '', 'info'),
          actions: '<button class="btn ok" id="ht-go">' + UI.icon('send') + 'Publish batch</button>' });
        document.getElementById('ht-go').addEventListener('click', function () {
          var ht = WF.publishHallTicket(document.getElementById('ht-exam').value, document.getElementById('ht-class').value, me.id);
          UI.closeModal(); UI.toast('Batch published', ht.eligible + ' eligible · ' + ht.blocked + ' blocked for dues.', ht.blocked ? 'yellow' : 'green');
          render();
        });
      });
    }
    render();

    /* v5-export:ht handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#htExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'HALL TICKET STATUS REGISTER'],
        ['Generated', Q.today()],
        [],
        ['Register No', 'Student', 'Class', 'Dues (Rs)', 'Hall ticket']
      ];
      DB.students.forEach(function (st) {
        var d = Q.duesOf(st.id);
        rows.push([st.reg, st.name, st.classId, d.total, d.total > DB.settings.wf.feeGrace ? 'Blocked' : 'Eligible']);
      });
      UI.downloadCSV('HallTicketStatus.csv', rows);
    });

  }
});
})();

/* ── office/library .............................. ── */
(function () {
MDTPAGE({
  role: 'office',
  folder: 'office',
  id: 'library',
  render: function (view, ctx) {

    var state = { tab: 'loans' };
    function render() {
      var active = DB.borrowRecords.filter(function (b) { return !b.returned; });
      var overdue = active.filter(function (b) { return b.due < Q.today(); });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Library Desk</h1><div class="sub">Issue, return and renewals · fine ₹5 per day</div></div>' +
        '<div class="actions">' + UI.expBtn('lbExp', 'Export register') + '</div></div>' +
        '<div class="actions"><button class="btn pri" id="issue">' + UI.icon('plus') + 'Issue a book</button></div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'book', value: active.length, label: 'Active loans' }) +
        UI.stat({ tone: 'r', icon: 'alert', value: overdue.length, label: 'Overdue' }) +
        UI.stat({ tone: 'g', icon: 'grid', value: DB.libraryBooks.reduce(function (a, b) { return a + b.available; }, 0), label: 'Copies on shelf' }) +
        UI.stat({ tone: 'y', icon: 'rupee', value: UI.money(overdue.reduce(function (a, b) { return a + b.fine; }, 0)), label: 'Fines outstanding' }) +
        '</div>' +
        UI.tabs([{ id: 'loans', label: 'Active loans', cnt: active.length }, { id: 'overdue', label: 'Overdue', cnt: overdue.length, cntTone: 'y' }, { id: 'catalog', label: 'Catalogue' }], state.tab) +
        (state.tab === 'catalog' ?
        UI.card('Catalogue', 'book', UI.table([
          { h: 'Acc No', render: function (r) { return '<span class="mono">' + r.acc + '</span>'; } },
          { h: 'Title', render: function (r) { return '<b>' + UI.esc(r.title) + '</b><div style="font-size:11px;color:var(--text-2)">' + UI.esc(r.author) + '</div>'; } },
          { h: 'Subject', render: function (r) { return '<span class="tag n">' + UI.esc(r.subject) + '</span>'; } },
          { h: 'Copies', render: function (r) { return '<span class="num">' + r.copies + '</span>'; } },
          { h: 'On shelf', render: function (r) { return '<span class="num" style="color:var(--green-ink)">' + r.available + '</span>'; } }
        ], DB.libraryBooks)) :
        UI.card('Loan register', 'book', UI.table([
          { h: 'Student', render: function (r) { var s = Q.studentById(r.studentId); return UI.avatar(s, 28) + ' ' + UI.esc(s.name) + '<div style="font-size:11px;color:var(--text-2)">' + s.reg + '</div>'; } },
          { h: 'Book', render: function (r) { var b = Q.bookByAcc(r.acc); return UI.esc(b.title); } },
          { h: 'Out', render: function (r) { return UI.fmtDate(r.out); } },
          { h: 'Due', render: function (r) { return r.due < Q.today() ? '<b style="color:var(--red-ink)">' + UI.fmtDate(r.due) + '</b>' : UI.fmtDate(r.due); } },
          { h: 'Fine', render: function (r) { return r.fine ? UI.money(r.fine) : '—'; } },
          { h: 'Action', render: function (r) { return '<button class="btn sm ok" data-ret="' + r.id + '">' + UI.icon('check') + 'Return</button> <button class="btn sm ghost" data-rnw="' + r.id + '">Renew</button>'; } }
        ], state.tab === 'overdue' ? overdue : active)));
      view.querySelectorAll('.tab').forEach(function (t) { t.addEventListener('click', function () { state.tab = t.getAttribute('data-tab'); render(); }); });
      view.querySelectorAll('[data-ret]').forEach(function (b) { b.addEventListener('click', function () {
        var fine = WF.returnBook(b.getAttribute('data-ret'), me.id);
        UI.toast('Book returned', fine ? 'Fine ₹' + fine + ' recorded.' : 'No fine.', fine ? 'yellow' : 'green'); render();
      }); });
      view.querySelectorAll('[data-rnw]').forEach(function (b) { b.addEventListener('click', function () {
        WF.renewBook(b.getAttribute('data-rnw')); UI.toast('Renewed', 'Due date extended by two weeks.', 'green'); render();
      }); });
      document.getElementById('issue').addEventListener('click', function () {
        UI.modal({ title: 'Issue a book', body:
          '<div class="fgrid">' +
          UI.field('ib-stu', 'Student', UI.select('ib-stu', DB.students.slice(0, 60).map(function (s) { return { v: s.id, l: s.name + ' · ' + s.reg }; })), true) +
          UI.field('ib-book', 'Book (available copies)', UI.select('ib-book', DB.libraryBooks.filter(function (b) { return b.available > 0; }).map(function (b) { return { v: b.acc, l: b.acc + ' · ' + b.title.slice(0, 24) }; })), true) +
          UI.field('ib-days', 'Loan period', UI.select('ib-days', [{ v: 14, l: '14 days (standard)' }, { v: 7, l: '7 days (reference)' }])) +
          '</div>',
          actions: '<button class="btn ok" id="ib-go">' + UI.icon('check') + 'Issue book</button>' });
        document.getElementById('ib-go').addEventListener('click', function () {
          var r = WF.issueBook(document.getElementById('ib-book').value, document.getElementById('ib-stu').value, me.id, +document.getElementById('ib-days').value);
          UI.closeModal();
          if (r) UI.toast('Book issued', 'Due ' + UI.fmtDate(r.due) + ' · student notified.', 'green');
          else UI.toast('Issue failed', 'No copies on shelf.', 'red');
          render();
        });
      });
    }
    render();

    /* v5-export:lib handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#lbExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'LIBRARY ISSUE REGISTER'],
        ['Generated', Q.today()],
        [],
        ['Acc No', 'Register No', 'Student', 'Borrowed', 'Due', 'Returned', 'Fine (Rs)', 'Status']
      ];
      DB.borrowRecords.slice().sort(function (a, b) { return a.out < b.out ? 1 : -1; }).forEach(function (r) {
        var st = Q.studentById(r.studentId); var b = Q.bookByAcc(r.acc);
        rows.push([r.acc, st ? st.reg : '—', st ? st.name : '—', r.out, r.due, r.ret || '—', r.fine || 0, r.status]);
      });
      UI.downloadCSV('LibraryRegister.csv', rows);
    });

  }
});
})();

/* ── office/placement ............................ ── */
(function () {
MDTPAGE({
  role: 'office',
  folder: 'office',
  id: 'placement',
  render: function (view, ctx) {

    function render() {
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Placement Cell</h1><div class="sub">Post drives, track applications and update outcomes</div></div>' +
        '<div class="actions">' + (DB.placementApps.length ? UI.expBtn('plExp', 'Export applications') : '') + '</div></div>' +
        '<div class="actions"><button class="btn pri" id="newDr">' + UI.icon('plus') + 'Post a drive</button></div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'briefcase', value: DB.placementDrives.length, label: 'Drives this season' }) +
        UI.stat({ tone: 'g', icon: 'send', value: DB.placementApps.length, label: 'Applications' }) +
        UI.stat({ tone: 'y', icon: 'checkc', value: DB.placementApps.filter(function (a) { return a.status === 'Shortlisted'; }).length, label: 'Shortlisted' }) +
        UI.stat({ tone: 'r', icon: 'star', value: DB.placementApps.filter(function (a) { return a.status === 'Offered'; }).length, label: 'Offers rolled' }) +
        '</div>' +
        '<div class="grid g2">' + DB.placementDrives.map(function (d) {
          var apps = DB.placementApps.filter(function (a) { return a.driveId === d.id; });
          return '<div class="card glow glow-b accent-b"><div class="spread">' +
            '<div style="display:flex;gap:11px;align-items:center"><span style="width:44px;height:44px;border-radius:12px;background:var(--green-tint);color:var(--g-green);display:flex;align-items:center;justify-content:center;font-weight:800">' + UI.esc(d.company.slice(0, 2).toUpperCase()) + '</span>' +
            '<span><b>' + UI.esc(d.company) + '</b><div style="font-size:12px;color:var(--text-2)">' + UI.esc(d.role) + ' · ' + UI.esc(d.ctc) + '</div></span></div>' + UI.badge('Active', d.status) + '</div>' +
            '<div class="mt8">' + UI.kv([['Drive', UI.fmtDate(d.date)], ['Register by', UI.fmtDate(d.regBy)], ['Applications', apps.length]]) + '</div>' +
            '<div class="frow" style="justify-content:flex-start"><button class="btn sm ghost" data-apps="' + d.id + '">' + UI.icon('users') + 'Applications</button></div></div>';
        }).join('') + '</div>' +
        UI.card('Season summary — 2025 batch', 'chart', UI.kv([
          ['Placement', '<b style="font-size:18px;color:var(--green-ink)">' + DB.placementStats.percentage + '%</b> (' + DB.placementStats.placed + ' of ' + DB.placementStats.eligible + ')'],
          ['Highest / average', DB.placementStats.highest + ' · ' + DB.placementStats.average],
          ['Companies', DB.placementStats.companies],
          ['Top recruiters', UI.esc(DB.placementStats.top)]
        ]));
      document.getElementById('newDr').addEventListener('click', function () {
        UI.modal({ title: 'Post a placement drive', body:
          '<div class="fgrid">' +
          UI.field('pd-co', 'Company', '<input class="input" id="pd-co" placeholder="e.g. Bosch Global">', true) +
          UI.field('pd-role', 'Role', '<input class="input" id="pd-role" placeholder="e.g. Graduate Engineer Trainee">', true) +
          UI.field('pd-ctc', 'Package', '<input class="input" id="pd-ctc" placeholder="e.g. ₹6.5 LPA">', true) +
          UI.field('pd-loc', 'Location', '<input class="input" id="pd-loc" placeholder="e.g. Coimbatore / Bengaluru">', true) +
          UI.field('pd-date', 'Drive date', '<input class="input" id="pd-date" type="date" min="' + Q.today() + '">', true) +
          UI.field('pd-reg', 'Register by', '<input class="input" id="pd-reg" type="date" min="' + Q.today() + '">', true) +
          '</div>' +
          UI.field('pd-eli', 'Eligibility', '<input class="input" id="pd-eli" placeholder="e.g. CGPA ≥ 7.5 · No standing arrears">'),
          actions: '<button class="btn ok" id="pd-go">' + UI.icon('send') + 'Publish drive</button>' });
        document.getElementById('pd-go').addEventListener('click', function () {
          var f = { company: val('pd-co'), role: val('pd-role'), ctc: val('pd-ctc'), location: val('pd-loc'), date: document.getElementById('pd-date').value, regBy: document.getElementById('pd-reg').value, eligibility: val('pd-eli') || 'All eligible students' };
          if (!f.company || !f.role || !f.date) { UI.toast('Company, role and date are required', '', 'red'); return; }
          WF.postDrive(me.id, f);
          UI.closeModal(); UI.toast('Drive published', 'Students notified on their placement page.', 'green'); render();
        });
      });
      view.querySelectorAll('[data-apps]').forEach(function (b) { b.addEventListener('click', function () {
        var d = DB.placementDrives.filter(function (x) { return x.id === b.getAttribute('data-apps'); })[0];
        var apps = DB.placementApps.filter(function (a) { return a.driveId === d.id; });
        UI.modal({ title: d.company + ' — applications', lg: true, body:
          UI.table([
            { h: 'Student', render: function (r) { var s = Q.studentById(r.studentId); return UI.avatar(s, 28) + ' ' + UI.esc(s.name) + '<div style="font-size:11px;color:var(--text-2)">' + s.reg + ' · CGPA ' + s.cgpa.toFixed(2) + '</div>'; } },
            { h: 'Applied', render: function (r) { return UI.fmtDate(r.at); } },
            { h: 'Status', render: function (r) { return UI.badge(r.status); } },
            { h: 'Update', render: function (r) { return UI.select('ups-' + r.id, ['Applied', 'Shortlisted', 'Offered', 'Not Selected'], r.status); } }
          ], apps),
          actions: '<button class="btn ok" id="ups-go">' + UI.icon('check') + 'Save updates & notify</button>' });
        document.getElementById('ups-go').addEventListener('click', function () {
          var n = 0;
          apps.forEach(function (a) {
            var sel = document.getElementById('ups-' + a.id);
            if (sel && sel.value !== a.status) { WF.updatePlacementApp(a.id, sel.value, '', me.id); n++; }
          });
          UI.closeModal(); UI.toast('Applications updated', n + ' students notified.', 'green'); render();
        });
      }); });
    }
    function val(id) { return document.getElementById(id).value.trim(); }
    render();

    /* v5-export:pl handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#plExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'PLACEMENT APPLICATIONS'],
        ['Generated', Q.today()],
        [],
        ['Register No', 'Student', 'Class', 'Company', 'Role', 'CTC', 'Applied', 'Status', 'Rounds', 'Offer']
      ];
      DB.placementApps.forEach(function (a) {
        var st = Q.studentById(a.studentId); var d = DB.placementDrives.filter(function (x) { return x.id === a.driveId; })[0] || {};
        rows.push([st ? st.reg : '—', st ? st.name : '—', st ? st.classId : '—', d.company || '', d.role || '', d.ctc || '', a.at, a.status, a.rounds || '', a.offer || '—']);
      });
      UI.downloadCSV('PlacementApplications.csv', rows);
    });

  }
});
})();

/* ── office/profile .............................. ── */
(function () {
MDTPAGE({
  role: 'office',
  folder: 'office',
  id: 'profile',
  render: function (view, ctx) {

    var me = ctx.person;
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>My Profile</h1><div class="sub">Office administration · student services</div></div></div>' +
      '<div class="split-eq">' +
      '<div>' +
        '<div class="card glow glow-g accent-g">' + UI.photoBox(me, 'Your photo appears on receipts, certificates and the office desk.') + '</div>' +
        UI.card('Office of administration', 'cap', UI.kv([
          ['Employee code', '<b class="mono">' + me.id + '</b>'],
          ['Designation', UI.esc(me.designation)],
          ['Experience', me.exp + ' years'],
          ['Service desk', 'Fees · certificates · hall tickets · records · library · placement · scholarships · help tickets']
        ])) +
        UI.card('Services you operate', 'grid', '<ul style="margin:4px 0 0 16px;padding:0;font-size:12.5px;color:var(--text-2);line-height:1.9">' +
          '<li><b>Fee collection</b> — record counter payments; receipts generate instantly as CSV.</li>' +
          '<li><b>Hall tickets</b> — publish batches; the fee gate holds defaulters automatically.</li>' +
          '<li><b>Certificates</b> — issue bonafide, transcript and character letters on request.</li>' +
          '<li><b>Records &amp; registers</b> — the student master register with admission details.</li>' +
          '<li><b>Help tickets</b> — first-line resolution and escalation for every portal user.</li></ul>') +
      '</div>' +
      '<div>' +
        UI.card('Contact', 'idcard', UI.kv([
          ['Email', UI.esc(me.email)],
          ['Phone', UI.esc(me.phone)],
          ['Campus', DB.settings.institute + ', ' + DB.settings.city]
        ])) +
        UI.card('Account', 'shield', UI.kv([
          ['Role', '<b>' + UI.esc(ctx.role) + '</b> — Office'],
          ['Access', 'Student services and campus operations'],
          ['Sign-in', UI.esc(ctx.user.lastLogin)]
        ])) +
        UI.card('Working note', 'info', UI.hint('Office actions raise notifications to students instantly — receipts, hall tickets and certificates reach their portals the moment they are recorded.', '', 'info')) +
      '</div></div>';

  }
});
})();

/* ── office/records .............................. ── */
(function () {
MDTPAGE({
  role: 'office',
  folder: 'office',
  id: 'records',
  render: function (view, ctx) {

    var state = { klass: 'CSE-A', q: '' };
    function render() {
      var students = Q.studentsOf(state.klass).filter(function (s) { return !state.q || (s.name + s.reg).toLowerCase().indexOf(state.q.toLowerCase()) >= 0; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Student Records</h1><div class="sub">Institution register · admissions profile, contacts and residency</div></div>' +
        '<div class="actions">' + UI.expBtn('recExp', 'Export register') + '</div></div>' +
        '<div class="actions"><button class="btn pri" id="newStu">' + UI.icon('plus') + 'New admission</button></div></div>' +
        '<div class="rowflex" style="margin-bottom:16px">' +
        DB.classes.map(function (c) { return '<span class="chip' + (state.klass === c.id ? ' on' : '') + '" data-rc="' + c.id + '">' + c.id + '</span>'; }).join('') +
        '<span class="qsearch" style="margin-left:auto;max-width:300px">' + UI.icon('search') + '<input class="input" id="rc-q" placeholder="Search register" value="' + UI.esc(state.q) + '"></span></div>' +
        UI.card('Register — ' + state.klass + ' (' + students.length + ')', 'users', UI.table([
          { h: 'Student', render: function (r) { return UI.avatar(r, 28) + ' <b>' + UI.esc(r.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + r.reg + '</div>'; } },
          { h: 'Gender', render: function (r) { return r.gender === 'F' ? 'Female' : 'Male'; } },
          { h: 'DOB', render: function (r) { return UI.fmtDate(r.dob); } },
          { h: 'Blood', render: function (r) { return '<b>' + r.blood + '</b>'; } },
          { h: 'Community', render: function (r) { return r.community; } },
          { h: 'Residency', render: function (r) { return r.hostel ? '<span class="tag b">' + r.roomId + '</span>' : '<span class="tag n">day</span>'; } },
          { h: 'Contact', render: function (r) { return '<span style="font-size:12px">' + UI.esc(r.phone) + '</span>'; } },
          { h: 'Parent', render: function (r) { return '<span style="font-size:12px">' + UI.esc(r.parentName) + '</span>'; } }
        ], students));
      view.querySelectorAll('[data-rc]').forEach(function (c) { c.addEventListener('click', function () { state.klass = c.getAttribute('data-rc'); render(); }); });
      var q = document.getElementById('rc-q');
      q.addEventListener('input', function () { state.q = q.value; var pos = q.selectionStart; render(); var q2 = document.getElementById('rc-q'); q2.focus(); q2.setSelectionRange(pos, pos); });
      document.getElementById('newStu').addEventListener('click', function () {
        UI.modal({ title: 'New admission', body:
          '<div class="fgrid">' +
          UI.field('ns-name', 'Full name', '<input class="input" id="ns-name">', true) +
          UI.field('ns-gender', 'Gender', UI.select('ns-gender', [{ v: 'M', l: 'Male' }, { v: 'F', l: 'Female' }]), true) +
          UI.field('ns-class', 'Class', UI.select('ns-class', DB.classes.map(function (c) { return { v: c.id, l: c.id + ' · sem ' + c.sem }; })), true) +
          UI.field('ns-dob', 'Date of birth', '<input class="input" id="ns-dob" type="date">', true) +
          UI.field('ns-email', 'Email', '<input class="input" id="ns-email" type="email" placeholder="will receive portal access">', true) +
          UI.field('ns-phone', 'Phone', '<input class="input" id="ns-phone">') +
          '</div>' +
          UI.hint('A portal account is provisioned automatically on admission; the student signs in with this email.', '', 'info'),
          actions: '<button class="btn ok" id="ns-go">' + UI.icon('check') + 'Create admission</button>' });
        document.getElementById('ns-go').addEventListener('click', function () {
          var name = document.getElementById('ns-name').value.trim();
          var email = document.getElementById('ns-email').value.trim();
          var cid = document.getElementById('ns-class').value;
          var gender = document.getElementById('ns-gender').value;
          if (!name || !email) { UI.toast('Name and email are required', '', 'red'); return; }
          var cls = Q.classById(cid);
          var deptCode = cls.dept === 'CSE' ? 'CS' : 'EC';
          var yr = cls.sem >= 5 ? '24' : '25';
          var reg = yr + deptCode + '0' + ri(90, 99);
          var sid = 'ST' + ri(900, 999);
          var stu = { id: sid, reg: reg, name: name, gender: gender, dob: document.getElementById('ns-dob').value || '2006-01-01', blood: 'O+', community: 'OC', religion: 'Hindu',
            email: email, phone: document.getElementById('ns-phone').value || '—', address: '—', parentName: '—', parentPhone: '—',
            dept: cls.dept, classId: cid, sem: cls.sem, batch: cls.batch, hostel: false, block: null, roomId: null,
            advisorId: cls.advisor, mentorId: null, cgpa: 7.5, semCgpa: [7.2, 7.4, 7.3, 7.5], arrears: 0, photo: null, admissionDate: Q.today() };
          var sub = {}; Q.allocationsOf(cid).forEach(function (al) { sub[al.courseId] = { p: 0, t: 0, l: 0 }; });
          Store.tx(function (db) { db.students.push(stu); db.attendanceAgg[sid] = sub; db.marks[sid] = {}; DB.users.push({ id: 'U-' + sid, personType: 'student', personId: sid, role: 'student', username: email, email: email, pass: 'demo123', active: true, lastLogin: null }); });
          WF.log(me.id, 'New admission', name + ' — ' + reg + ' (' + cid + ')');
          UI.closeModal(); UI.toast('Admission created', name + ' · ' + reg + ' — portal account provisioned.', 'green'); render();
        });
      });
    }
    function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    render();

    /* v5-export:rec handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#recExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'STUDENT RECORDS REGISTER'],
        ['Generated', Q.today()],
        [],
        ['Register No', 'Student', 'Class', 'Gender', 'DOB', 'Email', 'Phone', 'Residency', 'CGPA', 'Attendance %']
      ];
      DB.students.forEach(function (st) {
        rows.push([st.reg, st.name, st.classId, st.gender, st.dob || '—', st.email || '—', st.phone || '—', st.hostel ? 'Hostel — ' + (Q.roomOf(st.id) ? Q.roomOf(st.id).id : st.roomId) : 'Day scholar', st.cgpa.toFixed(2), Q.attPctOverall(st.id) + '%']);
      });
      UI.downloadCSV('StudentRecords.csv', rows);
    });

  }
});
})();

/* ── office/scholarships ......................... ── */
(function () {
MDTPAGE({
  role: 'office',
  folder: 'office',
  id: 'scholarships',
  render: function (view, ctx) {

    function render() {
      var pend = DB.scholarshipApps.filter(function (a) { return a.status === 'Applied'; });
      var rest = DB.scholarshipApps.filter(function (a) { return a.status !== 'Applied'; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Scholarships</h1><div class="sub">Document verification → Principal approval → disbursement</div></div>' +
        '<div class="actions">' + (DB.scholarshipApps.length ? UI.expBtn('scExp', 'Export applications') : '') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'y', icon: 'medal', value: pend.length, label: 'Awaiting verification' }) +
        UI.stat({ tone: 'g', icon: 'checkc', value: DB.scholarshipApps.filter(function (a) { return a.status === 'Approved'; }).length, label: 'Sanctioned' }) +
        '</div>' +
        UI.card('Verification queue', 'medal',
          (pend.length ? UI.table([
            { h: 'Student', render: function (r) { var s = Q.studentById(r.studentId); return UI.avatar(s, 28) + ' <b>' + UI.esc(s.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + s.reg + ' · ' + s.classId + '</div>'; } },
            { h: 'Scheme', render: function (r) { return UI.esc(Q.schemeName(r.schemeId)); } },
            { h: 'Docs', render: function (r) { return r.docs.map(function (d) { return '<span class="tag n">' + UI.esc(d) + '</span>'; }).join(' '); } },
            { h: 'Applied', render: function (r) { return UI.fmtDate(r.appliedAt); } },
            { h: 'Action', render: function (r) { return '<button class="btn sm ok" data-ver="' + r.id + '">' + UI.icon('check') + 'Verify</button> <button class="btn sm ghost-r" data-vrj="' + r.id + '">Reject</button>'; } }
          ], pend) : UI.empty('No applications awaiting verification', 'checkc'))) +
        UI.card('Processed applications', 'list', UI.table([
          { h: 'Student', render: function (r) { var s = Q.studentById(r.studentId); return UI.esc(s.name) + '<div style="font-size:11px;color:var(--text-2)">' + s.reg + '</div>'; } },
          { h: 'Scheme', render: function (r) { return UI.esc(Q.schemeName(r.schemeId)); } },
          { h: 'Status', render: function (r) { return UI.badge(r.status); } },
          { h: 'Chain', render: function (r) { return UI.esc(r.verifiedBy ? 'Office → ' + (r.approvedBy ? 'Principal ✓' : 'Principal (pending)') : 'Office'); } }
        ], rest)) +
        UI.card('Schemes on offer', 'grid', '<div class="grid g2">' + DB.scholarshipSchemes.map(function (sc) {
          return '<div class="card" style="box-shadow:none;border-style:dashed;margin:0"><div class="spread"><b>' + UI.esc(sc.name) + '</b>' + UI.money(sc.amount) + '</div><div style="font-size:12px;color:var(--text-2)">' + sc.by + ' · ' + UI.esc(sc.criteria) + '</div></div>';
        }).join('') + '</div>');
      view.querySelectorAll('[data-ver]').forEach(function (b) { b.addEventListener('click', function () {
        WF.verifyScholarship(b.getAttribute('data-ver'), me.id, true, 'Documents verified against institutional records.');
        UI.toast('Verified', 'Moved to the Principal\u2019s approval queue.', 'green'); render();
      }); });
      view.querySelectorAll('[data-vrj]').forEach(function (b) { b.addEventListener('click', function () {
        WF.verifyScholarship(b.getAttribute('data-vrj'), me.id, false, 'Documents incomplete — re-apply next drive.');
        UI.toast('Rejected at verification', 'Student notified.', 'red'); render();
      }); });
    }
    render();

    /* v5-export:sc handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#scExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'SCHOLARSHIP APPLICATIONS'],
        ['Generated', Q.today()],
        [],
        ['Register No', 'Student', 'Class', 'Scheme', 'Award (Rs)', 'Applied', 'Status', 'Documents']
      ];
      DB.scholarshipApps.forEach(function (a) {
        var st = Q.studentById(a.studentId); var sc = DB.scholarshipSchemes.filter(function (x) { return x.id === a.schemeId; })[0] || {};
        rows.push([st ? st.reg : '—', st ? st.name : '—', st ? st.classId : '—', Q.schemeName(a.schemeId), sc.amount || '', a.appliedAt, a.status, (a.docs || []).join(' | ')]);
      });
      UI.downloadCSV('ScholarshipApplications.csv', rows);
    });

  }
});
})();

/* ── office/tickets .............................. ── */
(function () {
MDTPAGE({
  role: 'office',
  folder: 'office',
  id: 'tickets',
  render: function (view, ctx) {

    var me = ctx.person;
    var filter = 'Active', query = '';
    var AGENTS = DB.users.filter(function (u) { return ['office','admin','warden','library','examcell','placement','accounts','iqac'].indexOf(u.role) >= 0 && u.active; });
    function tkEta(t) { return t.eta || UI.addDays(String(t.at).slice(0, 10), UI.SLA[t.priority] || 4); }
    function isLate(t) { return t.status !== 'Resolved' && t.status !== 'Closed' && UI.daysTo(tkEta(t)) < 0; }
    function agentName(id) { var u = Q.user(id); return u ? Q.name(u.personId) : 'Unassigned'; }
    function render() {
      var all = DB.tickets;
      var active = all.filter(function (t) { return t.status !== 'Resolved' && t.status !== 'Closed'; });
      var done = all.filter(function (t) { return t.status === 'Resolved' || t.status === 'Closed'; });
      var late = active.filter(isLate);
      var rated = done.filter(function (t) { return t.rating; });
      var avgRating = rated.length ? (rated.reduce(function (a, t) { return a + t.rating.stars; }, 0) / rated.length).toFixed(1) : '—';
      var pool = filter === 'Active' ? active : filter === 'Resolved' ? done : all;
      var shown = pool.filter(function (t) {
        return !query || (t.no + ' ' + t.title + ' ' + t.category + ' ' + t.desc + ' ' + agentName(t.assignee)).toLowerCase().indexOf(query) >= 0;
      });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Help Tickets</h1><div class="sub">Service desk — assignment, expected resolution and SLA tracking</div></div>' +
        '<div class="actions">' + UI.expBtn('deskExp', 'Export log') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'r', icon: 'alert', value: active.filter(function (t) { return t.priority === 'Critical' || t.priority === 'High'; }).length, label: 'High / critical' }) +
        UI.stat({ tone: 'y', icon: 'clock', value: late.length, label: 'Past expected date', sub: 'SLA attention needed' }) +
        UI.stat({ tone: 'b', icon: 'wrench', value: active.filter(function (t) { return t.assignee; }).length, label: 'Assigned & in hand' }) +
        UI.stat({ tone: 'g', icon: 'checkc', value: done.length, label: 'Resolved', sub: 'avg rating ' + avgRating + '/5' }) +
        '</div>' +
        '<div class="chiprow">' + UI.chiprow([
          { v: 'Active', l: 'Active', c: active.length }, { v: 'Resolved', l: 'Resolved', c: done.length }, { v: 'All', l: 'All', c: all.length }
        ], filter) + '<span class="sp"></span>' + UI.srch('deskQ', 'Search tickets…') + '</div>' +
        UI.card('Queue — ' + (filter === 'Active' ? 'active tickets' : filter === 'Resolved' ? 'resolved archive' : 'all tickets'), 'ticket', UI.table([
          { h: 'Ticket', render: function (r) { return '<b>' + r.no + '</b> — ' + UI.esc(r.title) + '<div style="font-size:11.5px;color:var(--text-2)">' + r.category + ' · ' + UI.esc(r.at) + (r.files && r.files.length ? ' · ' + r.files.length + ' attachment' + (r.files.length > 1 ? 's' : '') : '') + '</div>'; } },
          { h: 'Raised by', render: function (r) { var u = Q.user(r.by); var s = u && u.personType === 'student' ? Q.studentById(u.personId) : null; return s ? UI.esc(s.name) + '<div style="font-size:11px;color:var(--text-2)">' + s.reg + ' · ' + s.classId + '</div>' : UI.esc(u ? Q.name(u.personId) : r.by); } },
          { h: 'Priority', render: function (r) { return UI.pbadge(r.priority); } },
          { h: 'Expected', render: function (r) { return UI.etaChip(tkEta(r), r.status === 'Resolved' || r.status === 'Closed') + (isLate(r) ? '<div class="mt8">' + UI.badge('Overdue') + '</div>' : ''); } },
          { h: 'Handler', render: function (r) { return r.assignee ? UI.esc(agentName(r.assignee)) : '<span style="color:var(--text-3)">Unassigned</span>'; } },
          { h: 'Status', render: function (r) { return UI.badge(r.status) + (r.rating ? '<div class="mt8">' + UI.starsRO(r.rating.stars) + '</div>' : ''); } },
          { h: 'Action', render: function (r) { return '<button class="btn sm pri" data-tk="' + r.id + '">' + UI.icon('message') + (r.status === 'Resolved' || r.status === 'Closed' ? 'Review' : 'Handle') + '</button>'; } }
        ], shown)) +
        '<div class="split">' +
        UI.card('Service levels', 'clock', UI.kv([
          ['Critical', 'Expected within 4 working hours'],
          ['High', 'Expected within 2 working days'],
          ['Medium', 'Expected within 4 working days'],
          ['Low', 'Expected within a week']
        ]) + UI.hint('Every ticket carries an expected resolution date — students are notified whenever it moves.', '', 'info')) +
        UI.card('Desk health', 'chart', UI.barsChart([
          { l: 'Open', v: all.length ? active.filter(function (t) { return t.status === 'Open'; }).length / all.length * 100 : 0, n: active.filter(function (t) { return t.status === 'Open'; }).length, tone: 'y' },
          { l: 'In progress', v: all.length ? active.filter(function (t) { return t.status === 'In Progress'; }).length / all.length * 100 : 0, n: active.filter(function (t) { return t.status === 'In Progress'; }).length, tone: 'b' },
          { l: 'Resolved', v: all.length ? done.length / all.length * 100 : 0, n: done.length, tone: 'g' },
          { l: 'Past SLA', v: all.length ? late.length / all.length * 100 : 0, n: late.length, tone: 'r' }
        ])) +
        '</div>';
      view.querySelectorAll('[data-f]').forEach(function (c) { c.addEventListener('click', function () {
        filter = c.getAttribute('data-f'); render();
      }); });
      var q = document.getElementById('deskQ');
      if (q) q.addEventListener('input', function () { query = q.value.trim().toLowerCase(); render();
        var q2 = document.getElementById('deskQ'); if (q2) { q2.focus(); q2.setSelectionRange(q2.value.length, q2.value.length); } });
      var dex = document.getElementById('deskExp');
      if (dex) dex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'SERVICE DESK LOG'],
          ['Generated', Q.today()],
          [],
          ['Ticket', 'Title', 'Category', 'Priority', 'Status', 'Opened', 'Expected resolution', 'Handler', 'Resolved at', 'Rating', 'Replies', 'Attachments']
        ];
        all.forEach(function (t) {
          rows.push([t.no, t.title, t.category, t.priority, t.status, t.at, tkEta(t), t.assignee ? agentName(t.assignee) : 'Unassigned', t.resolvedAt || '—', t.rating ? t.rating.stars + '/5' : '—', (t.thread || []).length, (t.files || []).length]);
        });
        UI.downloadCSV('ServiceDesk-Log.csv', rows);
      });
      view.querySelectorAll('[data-tk]').forEach(function (b) { b.addEventListener('click', function () {
        var t = DB.tickets.filter(function (x) { return x.id === b.getAttribute('data-tk'); })[0];
        openTicket(t);
      }); });
    }
    function openTicket(t) {
      var raiser = Q.user(t.by);
      var rs = raiser && raiser.personType === 'student' ? Q.studentById(raiser.personId) : null;
      var resolved = t.status === 'Resolved' || t.status === 'Closed';
      var body = UI.kv([['Raised by', raiser ? UI.esc(Q.name(raiser.personId)) + (rs ? ' (' + UI.esc(rs.reg) + ' · ' + rs.classId + ')' : '') : t.by],
        ['Category', t.category], ['Priority', UI.pbadge(t.priority)], ['Status', UI.badge(t.status)], ['Opened', UI.esc(t.at)],
        ['Handler', t.assignee ? UI.esc(agentName(t.assignee)) : 'Unassigned']]) +
        '<div class="tk-meta">' + UI.etaChip(tkEta(t), resolved) + (isLate(t) ? UI.badge('Overdue') : '') + '</div>' +
        '<p>' + UI.esc(t.desc) + '</p>' +
        (t.files && t.files.length ? '<div class="fld"><label>Attachments from student</label>' + UI.attachChips(t.files) + '</div>' : '') +
        '<div class="divider"></div>' +
        '<div class="fld"><label>Tracking</label>' + UI.timeline(t.timeline || []) + '</div>' +
        (t.rating ? '<div class="rating-wrap"><span class="rt">' + UI.icon('star') + 'Student feedback</span>' + UI.starsRO(t.rating.stars) +
          '<span style="font-size:12.5px;color:var(--text-2)">' + UI.esc(t.rating.remark || '') + '</span></div>' : '') +
        '<div class="divider"></div>' +
        '<div class="fld"><label>Conversation</label>' +
        (t.thread.length ? t.thread.map(function (m) {
          var mu = Q.user(m.by); var mine = m.by === ctx.user.id;
          return '<div class="lrow" style="cursor:default"><span class="ic" style="color:' + (mine ? 'var(--g-green)' : 'var(--g-blue)') + '">' + UI.icon(mine ? 'wrench' : 'user') + '</span>' +
            '<span class="lmain"><b>' + (mine ? 'Service desk (you)' : UI.esc(mu ? Q.name(mu.personId) : 'Student')) + '</b><span>' + UI.esc(m.text) + '</span></span><span class="ltime">' + UI.esc(m.at) + '</span></div>';
        }).join('') : UI.empty('No replies yet', 'message')) + '</div>' +
        '<div class="divider"></div>' +
        '<div class="fgrid mt8">' +
        UI.field('tk-assign', 'Assign to', UI.select('tk-assign', [{ v: '', l: '— keep ' + (t.assignee ? agentName(t.assignee) : 'unassigned') + ' —' }].concat(AGENTS.map(function (u) { return { v: u.id, l: Q.name(u.personId) + ' · ' + ({ office: 'Office', admin: 'Admin', warden: 'Warden' }[u.role] || u.role) }; })), t.assignee || '')) +
        UI.field('tk-eta', 'Expected resolution', '<input class="input" id="tk-eta" type="date" value="' + tkEta(t) + '" min="' + Q.today() + '">') +
        '</div>' +
        '<div class="fld mt8"><label>Reply / resolution note</label><textarea class="input" id="tk-r"></textarea></div>';
      var actions = '<button class="btn pri" id="tk-send">' + UI.icon('send') + 'Send reply</button>' +
        (resolved ? '' : '<button class="btn ok" id="tk-res">' + UI.icon('check') + 'Reply & resolve</button>') +
        '<button class="btn" onclick="UI.closeModal()">Close</button>';
      UI.modal({ title: t.no + ' — ' + t.title, lg: true, body: body, actions: actions });
      UI.bindAttach(document.getElementById('ui-mask'), t.files || []);
      document.getElementById('tk-send').addEventListener('click', function () {
        var v = document.getElementById('tk-r').value.trim();
        if (!v) { UI.toast('Write a reply first', '', 'red'); return; }
        WF.replyTicket(t.id, ctx.user.id, v);
        applyAssignEta(t);
        UI.closeModal(); UI.toast('Reply sent', 'Student notified.', 'green'); render();
      });
      var rs2 = document.getElementById('tk-res');
      if (rs2) rs2.addEventListener('click', function () {
        var v = document.getElementById('tk-r').value.trim();
        if (!v) { UI.toast('Add a resolution note', '', 'red'); return; }
        WF.replyTicket(t.id, ctx.user.id, v);
        applyAssignEta(t);
        WF.resolveTicket(t.id, ctx.user.id, v);
        UI.closeModal(); UI.toast('Ticket resolved', 'Student asked to confirm and rate the service.', 'green'); render();
      });
      function applyAssignEta(t2) {
        var asg = document.getElementById('tk-assign').value;
        if (asg && asg !== t2.assignee) WF.assignTicket(t2.id, ctx.user.id, asg);
        var eta = document.getElementById('tk-eta').value;
        if (eta && eta !== tkEta(t2)) WF.setTicketETA(t2.id, ctx.user.id, eta);
      }
    }
    render();

  }
});
})();

/* ── admin/calendar .............................. ── */
(function () {
MDTPAGE({
  role: 'admin',
  folder: 'admin',
  id: 'calendar',
  render: function (view, ctx) {

    var y = 2026, m = 8;
    var MONN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    function render() {
      var monthEvents = DB.calendarEvents.filter(function (e) { return e.date.slice(0, 7) === y + '-' + String(m + 1).padStart(2, '0'); });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Academic Calendar</h1><div class="sub">Institution-wide events — visible on every student dashboard</div></div>' +
        '<div class="actions">' + UI.expBtn('calExp', 'Export events') + '</div></div>' +
        '<div class="actions"><button class="btn pri" id="addEv">' + UI.icon('plus') + 'Add event</button></div></div>' +
        '<div class="rowflex" style="margin-bottom:16px;justify-content:center">' +
        '<button class="btn ghost" id="pm">' + UI.icon('chevR') + '</button><b style="min-width:150px;text-align:center">' + MONN[m] + ' ' + y + '</b><button class="btn ghost" id="nm">Next ' + UI.icon('arrowR') + '</button></div>' +
        UI.card(MONN[m] + ' ' + y + ' — ' + monthEvents.length + ' events', 'calendar', UI.monthCal(y, m, DB.calendarEvents, Q.today()) +
          '<div class="legend"><span><i style="background:var(--g-red)"></i>Exams</span><span><i style="background:var(--g-green)"></i>Holidays</span><span><i style="background:var(--g-yellow)"></i>Fee dates</span><span><i style="background:var(--g-blue)"></i>Events</span><span><i style="background:var(--border-2)"></i>Academics</span></div>') +
        UI.card('Event register', 'list', UI.table([
          { h: 'Date', render: function (r) { return UI.fmtDate(r.date); } },
          { h: 'Event', render: function (r) { return '<b>' + UI.esc(r.title) + '</b>'; } },
          { h: 'Type', render: function (r) { return '<span class="tag ' + { Exam: 'r', Holiday: 'g', Fee: 'y', Event: 'b', Academic: 'n' }[r.type] + '">' + r.type + '</span>'; } },
          { h: 'Audience', render: function (r) { return UI.esc(r.audience); } },
          { h: 'Action', render: function (r) { return '<span class="dl" style="color:var(--red-ink)" data-dev="' + r.id + '">Remove</span>'; } }
        ], DB.calendarEvents));
      document.getElementById('pm').addEventListener('click', function () { m--; if (m < 0) { m = 11; y--; } render(); });
      document.getElementById('nm').addEventListener('click', function () { m++; if (m > 11) { m = 0; y++; } render(); });
      view.querySelectorAll('[data-dev]').forEach(function (el) { el.addEventListener('click', function () {
        WF.removeCalendarEvent(ctx.person.id, el.getAttribute('data-dev'));
        UI.toast('Event removed', 'Calendar updated for everyone.', 'yellow'); render();
      }); });
      document.getElementById('addEv').addEventListener('click', function () {
        UI.modal({ title: 'Add calendar event', body:
          '<div class="fgrid">' +
          UI.field('ev-date', 'Date', '<input class="input" id="ev-date" type="date" value="' + Q.today() + '">', true) +
          UI.field('ev-type', 'Type', UI.select('ev-type', ['Academic', 'Exam', 'Holiday', 'Fee', 'Event']), true) +
          '</div>' +
          UI.field('ev-title', 'Title', '<input class="input" id="ev-title" placeholder="e.g. Science Day exhibition">', true) +
          UI.field('ev-aud', 'Audience', UI.select('ev-aud', ['All', 'Students', 'Staff', 'Hostellers'])),
          actions: '<button class="btn ok" id="ev-go">' + UI.icon('check') + 'Add to calendar</button>' });
        document.getElementById('ev-go').addEventListener('click', function () {
          var f = { date: document.getElementById('ev-date').value, type: document.getElementById('ev-type').value, title: document.getElementById('ev-title').value.trim(), audience: document.getElementById('ev-aud').value };
          if (!f.title || !f.date) { UI.toast('Date and title are required', '', 'red'); return; }
          WF.addCalendarEvent(ctx.person.id, f);
          UI.closeModal(); UI.toast('Event added', 'Everyone sees it on their calendar page.', 'green'); render();
        });
      });
    }
    render();

    /* v5-export:cal handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#calExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'ACADEMIC CALENDAR'],
        ['Generated', Q.today()],
        [],
        ['Date', 'Type', 'Title', 'Audience']
      ];
      DB.calendarEvents.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; }).forEach(function (ev) {
        rows.push([ev.date, ev.type, ev.title, ev.audience || 'All']);
      });
      UI.downloadCSV('AcademicCalendar.csv', rows);
    });

  }
});
})();

/* ── admin/dashboard ............................. ── */
(function () {
MDTPAGE({
  role: 'admin',
  folder: 'admin',
  id: 'dashboard',
  render: function (view, ctx) {


    var me = ctx.person;
    var roleCounts = {};
    DB.users.forEach(function (u) { roleCounts[u.role] = (roleCounts[u.role] || 0) + 1; });
    var intg = (DB.settings && DB.settings.integrations) || { gsheet: {}, drive: {} };
    var live = !!(intg.gsheet && intg.gsheet.url);
    view.innerHTML =
      '<div class="pagehead"><span style="display:flex;gap:14px;align-items:center">' + UI.avatar(me, 44) +
      '<span><h1>Platform Overview</h1><div class="sub">Access, roles and institutional activity</div></span></span></div>' +
      '<div class="statrow">' +
      UI.stat({ tone: 'b', icon: 'users', value: DB.users.length, label: 'User accounts', sub: 'students, faculty, wardens, office & admin', href: 'users.html' }) +
      UI.stat({ tone: 'g', icon: 'shield', value: 7, label: 'Role portals', sub: 'fully wired together', href: 'roles.html' }) +
      UI.stat({ tone: 'y', icon: 'send', value: DB.notifications.length, label: 'Notifications routed' }) +
      UI.stat({ tone: live ? 'g' : 'r', icon: 'key', value: live ? 'Live' : 'Demo', label: 'Data source', sub: live ? 'Google Sheets channel' : 'built-in dataset', href: 'settings.html' }) +
      '</div>' +
      '<div class="split">' +
      '<div>' + UI.card('Accounts by role', 'chart', UI.barsChart([
        { l: 'Students', v: roleCounts.student / DB.users.length * 100, n: roleCounts.student || 0, tone: 'b' },
        { l: 'Faculty', v: (roleCounts.teacher || 0) / DB.users.length * 100, n: roleCounts.teacher || 0, tone: 'g' },
        { l: 'Academic director', v: (roleCounts.academic || 0) / DB.users.length * 100, n: roleCounts.academic || 0, tone: 'y' },
        { l: 'Principal', v: (roleCounts.principal || 0) / DB.users.length * 100, n: roleCounts.principal || 0, tone: 'r' },
        { l: 'Wardens', v: (roleCounts.warden || 0) / DB.users.length * 100, n: roleCounts.warden || 0, tone: 'b' },
        { l: 'Office', v: (roleCounts.office || 0) / DB.users.length * 100, n: roleCounts.office || 0, tone: 'g' },
        { l: 'Admins', v: (roleCounts.admin || 0) / DB.users.length * 100, n: roleCounts.admin || 0, tone: 'y' }
      ])) +
      UI.card('Platform health', 'grid', UI.kv([
        ['Data layer', UI.badge('Approved', live ? 'Live channel' : 'Operational') + ' <span class="intg-status ' + (live ? 'live' : 'demo') + '" style="margin-left:6px;font-size:10px;padding:2px 8px"><span class="bdot"></span>' + (live ? 'Google Sheets' : 'Demo dataset') + '</span>'],
        ['Approval chains', UI.badge('Approved', 'All wired')],
        ['Notification routing', UI.badge('Approved', 'Live')],
        ['Theme engine', UI.badge('Approved', 'Light & dark')],
        ['Access guard', UI.badge('Approved', 'Role-scoped')]
      ])) + '</div>' +
      '<div>' + UI.card('Latest institutional activity', 'list', DB.activity.slice(0, 8).map(function (a) {
        return '<div class="lrow" style="cursor:default"><span class="ic" style="color:var(--g-blue)">' + UI.icon('chevR') + '</span>' +
          '<span class="lmain"><b>' + UI.esc(a.action) + '</b><span>' + UI.esc(Q.name(a.actor)) + ' · ' + UI.esc(a.detail) + '</span></span><span class="ltime">' + UI.esc(a.at) + '</span></div>';
      }).join(''), null, { href: 'logs.html', label: 'Full log' }) +
      UI.card('Admin quick actions', 'grid', '<div class="quickgrid">' +
        '<a class="bigbtn-tile" href="users.html">' + UI.icon('users') + '<b>User accounts</b></a>' +
        '<a class="bigbtn-tile" href="roles.html">' + UI.icon('shield') + '<b>Permissions</b></a>' +
        '<a class="bigbtn-tile" href="calendar.html">' + UI.icon('calendar') + '<b>Calendar</b></a>' +
        '<a class="bigbtn-tile" href="settings.html">' + UI.icon('gear') + '<b>Settings</b></a>' +
        '</div>') + '</div></div>';
  }
});
})();

/* ── admin/logs .................................. ── */
(function () {
MDTPAGE({
  role: 'admin',
  folder: 'admin',
  id: 'logs',
  render: function (view, ctx) {

    var state = { q: '' };
    function render() {
      var list = DB.activity.filter(function (a) { return !state.q || (a.action + a.detail + Q.name(a.actor)).toLowerCase().indexOf(state.q.toLowerCase()) >= 0; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Activity Log</h1><div class="sub">' + DB.activity.length + ' events · who did what, when</div></div>' +
        '<div class="actions"><button class="btn ghost" id="dlLog">' + UI.icon('download') + 'Export log</button></div></div>' +
        '<div class="rowflex" style="margin-bottom:16px"><span class="qsearch" style="max-width:320px">' + UI.icon('search') + '<input class="input" id="lg-q" placeholder="Filter by action, person or detail" value="' + UI.esc(state.q) + '"></span></div>' +
        UI.card('Event stream', 'list', UI.table([
          { h: 'When', render: function (r) { return '<span class="mono" style="font-size:11.5px">' + UI.esc(r.at) + '</span>'; } },
          { h: 'Actor', render: function (r) { var p = Q.person(r.actor); return UI.avatar(p, 26) + ' ' + UI.esc(Q.name(r.actor)); } },
          { h: 'Action', render: function (r) { return '<b>' + UI.esc(r.action) + '</b>'; } },
          { h: 'Detail', render: function (r) { return '<span style="color:var(--text-2)">' + UI.esc(r.detail) + '</span>'; } }
        ], list));
      var q = document.getElementById('lg-q');
      q.addEventListener('input', function () { state.q = q.value; var pos = q.selectionStart; render(); var q2 = document.getElementById('lg-q'); q2.focus(); q2.setSelectionRange(pos, pos); });
      document.getElementById('dlLog').addEventListener('click', function () {
        var rows = [['Timestamp', 'Actor', 'Action', 'Detail']];
        DB.activity.forEach(function (a) { rows.push([a.at, Q.name(a.actor), a.action, a.detail]); });
        UI.downloadCSV('CampusOne-Activity-' + Q.today() + '.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── admin/news .................................. ── */
(function () {
MDTPAGE({
  role: 'admin',
  folder: 'admin',
  id: 'news',
  render: function (view, ctx) {

    function render() {
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Circulars & Flash News</h1><div class="sub">Platform-managed announcements (the Principal and Academic Director also publish)</div></div>' +
        '<div class="actions">' + UI.expBtn('nwExp', 'Export circulars') + '</div></div>' +
        '<div class="actions"><button class="btn pri" id="newCir">' + UI.icon('send') + 'New circular</button></div></div>' +
        UI.card('All circulars', 'send', UI.table([
          { h: 'Circular', render: function (r) { return '<b>' + UI.esc(r.title) + '</b>' + (r.urgent ? ' <span class="tag r">URGENT</span>' : '') + '<div style="font-size:11.5px;color:var(--text-2)">' + UI.esc(r.body.slice(0, 80)) + '…</div>'; } },
          { h: 'Audience', render: function (r) { return '<span class="tag n">' + r.audience + '</span>'; } },
          { h: 'By', render: function (r) { return UI.esc(Q.name(r.by)); } },
          { h: 'Date', render: function (r) { return UI.fmtDate(r.at); } }
        ], DB.circulars)) +
        UI.card('Flash news ticker', 'alert', DB.flashNews.map(function (f) {
          return '<div class="lrow" style="cursor:default"><span class="ic" style="color:var(--g-yellow)">' + UI.icon('bell') + '</span><span class="lmain"><span>' + UI.esc(f) + '</span></span></div>';
        }).join(''));
      document.getElementById('newCir').addEventListener('click', function () {
        UI.modal({ title: 'Publish a circular', body:
          '<div class="fgrid">' +
          UI.field('nc-aud', 'Audience', UI.select('nc-aud', ['All', 'Students', 'Staff', 'Hostellers'])) +
          UI.field('nc-urg', 'Urgent (ticker)', '<label class="switch"><input type="checkbox" id="nc-urg"><span class="tr"></span> Flash news</label>') +
          '</div>' +
          UI.field('nc-title', 'Title', '<input class="input" id="nc-title">', true) +
          UI.field('nc-body', 'Message', '<textarea class="input" id="nc-body"></textarea>', true),
          actions: '<button class="btn ok" id="nc-go">' + UI.icon('send') + 'Publish</button>' });
        document.getElementById('nc-go').addEventListener('click', function () {
          var f = { audience: document.getElementById('nc-aud').value, urgent: document.getElementById('nc-urg').checked, title: document.getElementById('nc-title').value.trim(), body: document.getElementById('nc-body').value.trim() };
          if (!f.title || !f.body) { UI.toast('Title and message are required', '', 'red'); return; }
          WF.publishCircular(ctx.person.id, f);
          UI.closeModal(); UI.toast('Circular published', 'Audience dashboards updated.', 'green'); render();
        });
      });
    }
    render();

    /* v5-export:nw handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#nwExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'CIRCULARS & FLASH NEWS'],
        ['Generated', Q.today()],
        [],
        ['Date', 'Audience', 'Urgent', 'Title', 'Body']
      ];
      DB.circulars.slice().sort(function (a, b) { return a.at < b.at ? 1 : -1; }).forEach(function (c) {
        rows.push([c.at, c.audience, c.urgent ? 'Yes' : 'No', c.title, c.body]);
      });
      UI.downloadCSV('Circulars.csv', rows);
    });

  }
});
})();

/* ── admin/profile ............................... ── */
(function () {
MDTPAGE({
  role: 'admin',
  folder: 'admin',
  id: 'profile',
  render: function (view, ctx) {

    var me = ctx.person;
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>My Profile</h1><div class="sub">System administration · platform &amp; access</div></div></div>' +
      '<div class="split-eq">' +
      '<div>' +
        '<div class="card glow glow-y accent-y">' + UI.photoBox(me, 'Your photo appears on the platform team directory.') + '</div>' +
        UI.card('Platform office', 'cap', UI.kv([
          ['Employee code', '<b class="mono">' + me.id + '</b>'],
          ['Designation', UI.esc(me.designation)],
          ['Experience', me.exp + ' years'],
          ['Accounts', '<b>' + DB.users.length + '</b> users · ' + Object.keys(DB.users.reduce(function (a, u) { a[u.role] = 1; return a; }, {})).length + ' roles']
        ])) +
        UI.card('Platform scope', 'shield', '<ul style="margin:4px 0 0 16px;padding:0;font-size:12.5px;color:var(--text-2);line-height:1.9">' +
          '<li><b>User accounts</b> — create, suspend and restore any campus account.</li>' +
          '<li><b>Roles &amp; permissions</b> — the matrix that scopes every portal view.</li>' +
          '<li><b>Academic calendar</b> — the single source for exams, holidays and events.</li>' +
          '<li><b>Circulars &amp; news</b> — institutional announcements and flash news.</li>' +
          '<li><b>Activity log</b> — the full audit trail, exportable as CSV.</li></ul>') +
      '</div>' +
      '<div>' +
        UI.card('Contact', 'idcard', UI.kv([
          ['Email', UI.esc(me.email)],
          ['Phone', UI.esc(me.phone)],
          ['Campus', DB.settings.institute + ', ' + DB.settings.city]
        ])) +
        UI.card('Account', 'shield', UI.kv([
          ['Role', '<b>' + UI.esc(ctx.role) + '</b> — Administrator'],
          ['Access', 'Platform-wide configuration and audit'],
          ['Sign-in', UI.esc(ctx.user.lastLogin)]
        ])) +
        UI.card('Working note', 'info', UI.hint('Configuration changes apply across every role portal immediately — the workflow gates, fee grace limits and approval chains read from the settings you maintain.', '', 'info')) +
      '</div></div>';

  }
});
})();

/* ── admin/roles ................................. ── */
(function () {
MDTPAGE({
  role: 'admin',
  folder: 'admin',
  id: 'roles',
  render: function (view, ctx) {

    var ROLES = ['Student', 'Class Advisor', 'Faculty', 'Academic Director', 'Hostel Warden (Boys/Girls)', 'Principal', 'Office', 'Administrator'];
    var M = [
      { m: 'View own academics / attendance / fees', p: ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'] },
      { m: 'Apply OD / leave / outing', p: ['Y', '—', '—', '—', '—', '—', '—', '—'] },
      { m: 'Recommend OD / leave (class)', p: ['—', 'Y', '—', '—', '—', '—', '—', '—'] },
      { m: 'Approve OD (final)', p: ['—', '—', '—', 'Y', '—', '—', '—', '—'] },
      { m: 'Approve leave (final)', p: ['—', '—', '—', 'Y', '—', '—', '—', '—'] },
      { m: 'Countersign long leave (≥ 5 days)', p: ['—', '—', '—', '—', '—', 'Y', '—', '—'] },
      { m: 'Approve day outing (own block)', p: ['—', '—', '—', '—', 'Y', '—', '—', '—'] },
      { m: 'Approve night outing (stage 2)', p: ['—', '—', '—', 'Y', '—', '—', '—', '—'] },
      { m: 'Mark / edit attendance', p: ['—', 'Y', 'Y', '—', '—', '—', '—', '—'] },
      { m: 'Update course schedule / lesson plan', p: ['—', 'Y', 'Y', '—', '—', '—', '—', '—'] },
      { m: 'Approve timetable reschedule', p: ['—', '—', '—', 'Y', '—', '—', '—', '—'] },
      { m: 'Assign courses to faculty', p: ['—', '—', '—', 'Y', '—', '—', '—', '—'] },
      { m: 'Enter & publish marks', p: ['—', 'Y', 'Y', 'Y', '—', '—', '—', '—'] },
      { m: 'Collect fees / issue receipts', p: ['—', '—', '—', '—', '—', '—', 'Y', '—'] },
      { m: 'Publish hall tickets (fee check)', p: ['—', '—', '—', '—', '—', '—', 'Y', '—'] },
      { m: 'Issue certificates', p: ['—', '—', '—', '—', '—', '—', 'Y', '—'] },
      { m: 'Allocate hostel rooms (own block, gender-locked)', p: ['—', '—', '—', '—', 'Y', '—', '—', '—'] },
      { m: 'Mess menu & complaints (own block)', p: ['—', '—', '—', '—', 'Y', '—', '—', '—'] },
      { m: 'Library issue / return / fines', p: ['—', '—', '—', '—', '—', '—', 'Y', '—'] },
      { m: 'Post placement drives', p: ['—', '—', '—', '—', '—', '—', 'Y', '—'] },
      { m: 'Verify scholarships', p: ['—', '—', '—', '—', '—', '—', 'Y', '—'] },
      { m: 'Sanction scholarships (final)', p: ['—', '—', '—', '—', '—', 'Y', '—', '—'] },
      { m: 'Publish circulars / flash news', p: ['—', '—', '—', 'Y', '—', 'Y', '—', 'Y'] },
      { m: 'Institution-wide oversight dashboard', p: ['—', '—', '—', '—', '—', 'Y', '—', '—'] },
      { m: 'Manage users, roles & settings', p: ['—', '—', '—', '—', '—', '—', '—', 'Y'] },
      { m: 'Activity log access', p: ['—', '—', '—', '—', '—', '—', '—', 'Y'] }
    ];
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>Roles & Permissions</h1><div class="sub">The permission matrix behind every page, button and approval chain</div></div></div>' +
      UI.hint('Gender governance: the warden\u2019s block lock (Boys Block A / Girls Block B) is enforced by the platform itself — room allocation, outing requests and complaints are filtered to the warden\u2019s own block.', '', 'info') +
      UI.card('Permission matrix', 'shield', UI.table(
        [{ h: 'Capability', render: function (r) { return '<b style="font-size:12.5px">' + r.m + '</b>'; } }].concat(
          ROLES.map(function (rl, i) { return { h: rl, render: function (r) { var v = r.p[i]; return v === 'Y' ? '<span style="color:var(--green-ink);font-weight:700">✓</span>' : '<span style="color:var(--text-3)">—</span>'; } }; })
        ), M)) +
      '<div class="mt16"></div>' +
      UI.card('v8 — extended role portals', 'grid',
        '<div class="grid g3">' + [
        { t: 'Library', d: 'Circulation, catalogue/OPAC, journals, e-resources, fines, procurement & inventory · requisitions from departments', tone: 'g', ic: 'book' },
        { t: 'Examination Cell', d: 'Scheduling & seating, exam attendance & malpractice, online valuation with remuneration verification, results, revaluation, transcripts', tone: 'y', ic: 'cap' },
        { t: 'Placement Cell', d: 'Recruiters & MoUs, drives with round tracking, training batches, internships, batch register', tone: 'b', ic: 'briefcase' },
        { t: 'Accounts', d: 'Collections day book, expense vouchers (verify → Principal), payroll, budgets, vendors & POs', tone: 'r', ic: 'rupee' },
        { t: 'IQAC', d: 'Surveys, CO-PO attainment, feedback reports, audit calendar, NAAC criteria readiness', tone: 'y', ic: 'medal' },
        { t: 'v8 chains', d: 'Expense: raiser → Accounts → Principal → pay · Requisition: dept → Librarian → Principal → PO · Achievement: student → mentor', tone: 'g', ic: 'shield' }
      ].map(function (c) {
        return '<div class="card glow glow-' + c.tone + ' accent-' + c.tone + '"><div class="card-t">' + UI.icon(c.ic) + '<h3>' + c.t + '</h3></div>' +
          '<div style="font-size:12.5px;color:var(--text-2);line-height:1.6">' + c.d + '</div></div>';
      }).join('') + '</div>') +
      '<div class="grid g3">' + [
        { t: 'OD chain', d: 'Student → Class Advisor → Academic Director → (Warden informed if hosteller)', tone: 'b', ic: 'door' },
        { t: 'Leave chain', d: 'Student → Advisor → Academic Director → Principal (≥ 5 days)', tone: 'y', ic: 'key' },
        { t: 'Outing chain', d: 'Student → Warden (block) → Academic Director (overnight only)', tone: 'g', ic: 'bed' },
        { t: 'Scholarship chain', d: 'Student → Office verification → Principal sanction', tone: 'y', ic: 'medal' },
        { t: 'Hall ticket gate', d: 'Office generates → fee clearance auto-check → students notified', tone: 'r', ic: 'idcard' },
        { t: 'Course flow', d: 'Academic Director allots → faculty plans & marks → students see everything', tone: 'b', ic: 'layers' }
      ].map(function (c) {
        return '<div class="card glow glow-' + c.tone + ' accent-' + c.tone + '"><div class="card-t">' + UI.icon(c.ic) + '<h3>' + c.t + '</h3></div>' +
          '<div style="font-size:12.5px;color:var(--text-2);line-height:1.6">' + c.d + '</div></div>';
      }).join('') + '</div>';

  }
});
})();

/* ── admin/settings .............................. ── */
(function () {
MDTPAGE({
  role: 'admin',
  folder: 'admin',
  id: 'settings',
  render: function (view, ctx) {


    var S1 = DB.settings;
    function intg() { return S1.integrations || { gsheet: {}, drive: {} }; }
    function intgStatus() {
      var i = intg();
      var live = !!(i.gsheet && i.gsheet.url);
      return '<span class="intg-status ' + (live ? 'live' : 'demo') + '"><span class="bdot"></span>' +
        (live ? 'Live channel — Google Sheets' : 'Demo mode — built-in dataset') + '</span>';
    }
    function render() {
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Settings</h1><div class="sub">Institution profile and workflow policy</div></div></div>' +
        '<div class="split-eq">' +
        '<div>' + UI.card('Institution profile', 'building', UI.kv([
          ['Institution', UI.esc(S1.institute)],
          ['Organisation', UI.esc(S1.org) + ' · CampusOne'],
          ['Location', UI.esc(S1.city) + ', ' + UI.esc(S1.state)],
          ['Contact', UI.esc(S1.email) + ' · ' + UI.esc(S1.phone)],
          ['Academic year', S1.academicYear + ' · Semester ' + S1.currentSem]
        ])) +
        UI.card('Workflow policy', 'gear',
          UI.kv([
            ['OD needs Academic Director', wfSwitch('odNeedsAD', S1.wf.odNeedsAD)],
            ['Night outing needs Academic Director', wfSwitch('outingOvernightNeedsAD', S1.wf.outingOvernightNeedsAD)],
            ['Long-leave threshold (Principal)', '<span class="num">' + S1.wf.longLeaveDays + ' days</span>'],
            ['Minimum attendance', '<span class="num">' + S1.wf.attMin + '%</span>'],
            ['Fee grace for hall tickets', UI.money(S1.wf.feeGrace)]
          ]) + '<div class="fhint" style="margin-top:8px">These values drive the live approval chains across all portals.</div>') + '</div>' +
        '<div>' + UI.card('Appearance default', 'sun',
          UI.hint('Every login starts in the <b>light</b> theme. Users can switch to dark from the profile area — the choice lasts for their session and carries across pages.', '', 'info')) +
        UI.card('Database & integrations (maintenance)', 'key',
          '<div class="spread mb8"><span class="fhint">External data sources this portal runs on. Paste the keys once — the background source used by every page reflects the change immediately.</span>' + intgStatus() + '</div>' +
          '<div class="fld"><label>Google Sheets data channel — Apps Script endpoint URL</label>' +
            '<input class="input mono" id="ig-url" placeholder="https://script.google.com/macros/s/YOUR-DEPLOYMENT-ID/exec" value="' + UI.esc(intg().gsheet.url || '') + '">' +
            '<div class="fhint">Deployed from the seed spreadsheet (backend/Code.gs) — one sheet per table, exactly as generated.</div></div>' +
          '<div class="fgrid mt16">' +
            '<div class="fld"><label>Google Sheets API key</label><input class="input mono" id="ig-key" placeholder="YOUR-GSHEET-API-KEY-HERE" value="' + UI.esc(intg().gsheet.key || '') + '"></div>' +
            '<div class="fld"><label>Spreadsheet ID</label><input class="input mono" id="ig-sheet" placeholder="YOUR-SPREADSHEET-ID-HERE" value="' + UI.esc(intg().gsheet.sheetId || '') + '"></div>' +
          '</div>' +
          '<div class="fgrid mt16">' +
            '<div class="fld"><label>Google Drive file database — API key</label><input class="input mono" id="ig-dkey" placeholder="YOUR-DRIVE-API-KEY-HERE" value="' + UI.esc(intg().drive.key || '') + '"></div>' +
            '<div class="fld"><label>Drive folder ID (portal files)</label><input class="input mono" id="ig-dfld" placeholder="YOUR-DRIVE-FOLDER-ID-HERE" value="' + UI.esc(intg().drive.folder || '') + '"></div>' +
          '</div>' +
          '<div class="frow" style="justify-content:flex-start">' +
            '<button class="btn ok" id="ig-save">' + UI.icon('check') + 'Save & apply now</button>' +
            '<button class="btn ghost" id="ig-test">' + UI.icon('wifi') + 'Test connection</button>' +
            '<button class="btn ghost-r" id="ig-clear">' + UI.icon('x') + 'Reset to demo source</button></div>' +
          (intg().updatedAt ? '<div class="fhint mt8">Last maintained by ' + UI.esc(Q.name(intg().updatedBy || '')) + ' · ' + UI.esc(intg().updatedAt) + '</div>' : '<div class="fhint mt8">Not configured yet — placeholders shown. When the administrator saves real keys, every portal page switches its background source live.</div>')) +
        UI.card('Data management', 'refresh',
          UI.hint('Restoring the reference dataset returns every record, request and approval chain to the institutional baseline. Use it to re-run a demo day from scratch.', 'warn', 'alert') +
          '<div class="frow" style="justify-content:flex-start"><button class="btn danger" id="resetData">' + UI.icon('refresh') + 'Restore reference dataset</button>' +
          '<button class="btn ghost" id="bkData">' + UI.icon('download') + 'Download data backup</button></div>' +
          UI.hint('The backup captures every working record as a document file — useful before a demo run or a policy change.', '', 'info')) +
        '</div></div>';
      view.querySelectorAll('[data-wf]').forEach(function (sw) { sw.addEventListener('change', function () {
        var k = sw.getAttribute('data-wf');
        S1.wf[k] = sw.checked;
        WF.saveSettings(ctx.person.id, { wf: S1.wf });
        UI.toast('Policy updated', k + ' → ' + sw.checked, 'green');
      }); });
      document.getElementById('resetData').addEventListener('click', function () {
        UI.modal({ title: 'Restore reference dataset?', body: '<p>All working changes — approvals, marks, fee receipts, tickets — will be replaced by the institutional baseline records.</p>',
          actions: '<button class="btn danger" id="rd-go">Yes, restore</button><button class="btn" onclick="UI.closeModal()">Cancel</button>' });
        document.getElementById('rd-go').addEventListener('click', function () {
          WF.restoreReferenceData(ctx.person.id);
          UI.closeModal(); UI.toast('Reference data restored', 'Reloading…', 'green');
          setTimeout(function () { SPA.refresh(); }, 900);
        });
      });
    }
    function wfSwitch(key, val) {
      return '<label class="switch"><input type="checkbox" data-wf="' + key + '"' + (val ? ' checked' : '') + '><span class="tr"></span></label>';
    }
    render();

    /* v5-export:bk handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#bkData')) return;
      var data = JSON.stringify(DB, null, 2);
      var blob = new Blob([data], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'CampusOne-DataBackup-' + Q.today() + '.json';
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
      UI.toast('Backup downloaded', 'CampusOne-DataBackup-' + Q.today() + '.json', 'green');
    });

    /* v6: integrations handlers (delegated — survive re-renders) */
    SPA.doc('click', function (e) {
      var el;
      if ((el = e.target.closest('#ig-save'))) {
        var vals = {
          gsheet: { url: document.getElementById('ig-url').value.trim(), key: document.getElementById('ig-key').value.trim(), sheetId: document.getElementById('ig-sheet').value.trim() },
          drive:  { key: document.getElementById('ig-dkey').value.trim(), folder: document.getElementById('ig-dfld').value.trim() }
        };
        var live = WF.saveIntegrations(ctx.person.id, vals);
        UI.toast('Data source applied', live ? 'The Google Sheets channel is now the background source for every page — reflected immediately.' : 'Portal is running on the built-in demo dataset.', live ? 'green' : 'yellow');
        render();
        return;
      }
      if ((el = e.target.closest('#ig-clear'))) {
        UI.modal({ title: 'Reset to the demo data source?', body: '<p>The saved Google Sheets / Drive keys are cleared and the portal returns to the built-in dataset everywhere.</p>',
          actions: '<button class="btn danger" id="igc-go">Yes, reset</button><button class="btn" onclick="UI.closeModal()">Cancel</button>' });
        document.getElementById('igc-go').addEventListener('click', function () {
          try { localStorage.removeItem('MDT_INTEGRATIONS'); } catch (err) {}
          WF.saveIntegrations(ctx.person.id, { gsheet: { url: '', key: '', sheetId: '' }, drive: { key: '', folder: '' } });
          UI.closeModal(); UI.toast('Demo source restored', 'Every page now uses the built-in dataset.', 'yellow');
          render();
        });
        return;
      }
      if ((el = e.target.closest('#ig-test'))) {
        if (!Api.active()) { UI.toast('No live channel configured', 'Save the Google Sheets endpoint URL first — until then the portal runs on the demo dataset.', 'yellow'); return; }
        el.innerHTML = '<span class="spin"></span> Testing…';
        var u = Api.url();
        fetch(u, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ action: 'ping' }) })
          .then(function (r) { return r.json(); })
          .then(function (j) { el.innerHTML = UI.icon('wifi') + 'Test connection'; UI.toast(j && j.ok ? 'Channel reachable' : 'Channel responded with an error', j && j.ok ? ('Service: ' + (j.service || 'CampusOne') + ' · v' + (j.version || '?')) : String((j && j.error) || 'Unknown error'), j && j.ok ? 'green' : 'red'); })
          .catch(function () { el.innerHTML = UI.icon('wifi') + 'Test connection'; UI.toast('Channel unreachable', 'Check the endpoint URL and deployment access settings.', 'red'); });
        return;
      }
    });
  }
});
})();

/* ── admin/users ................................. ── */
(function () {
MDTPAGE({
  role: 'admin',
  folder: 'admin',
  id: 'users',
  render: function (view, ctx) {

    var state = { role: '', q: '' };
    function render() {
      var list = DB.users.filter(function (u) {
        return (!state.role || u.role === state.role) && (!state.q || (u.email + (Q.name(u.personId) || '')).toLowerCase().indexOf(state.q.toLowerCase()) >= 0);
      }).slice(0, 40);
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>User Accounts</h1><div class="sub">' + DB.users.length + ' accounts · provisioning, activation and password resets</div></div>' +
        '<div class="actions">' + UI.expBtn('usExp', 'Export accounts') + '</div></div>' +
        '<div class="actions"><button class="btn pri" id="newUser">' + UI.icon('plus') + 'Create account</button></div></div>' +
        '<div class="rowflex" style="margin-bottom:16px">' +
        '<span class="chip' + (!state.role ? ' on' : '') + '" data-ur="">All</span>' +
        ['student', 'teacher', 'academic', 'principal', 'warden', 'office', 'admin'].map(function (r) {
          return '<span class="chip' + (state.role === r ? ' on' : '') + '" data-ur="' + r + '">' + r + ' (' + DB.users.filter(function (u) { return u.role === r; }).length + ')</span>';
        }).join('') +
        '<span class="qsearch" style="margin-left:auto;max-width:280px">' + UI.icon('search') + '<input class="input" id="us-q" placeholder="Search name or email" value="' + UI.esc(state.q) + '"></span></div>' +
        UI.card('Account register', 'users', UI.table([
          { h: 'Account', render: function (r) { var p = Q.person(r.personId); return UI.avatar(p, 28) + ' <b>' + UI.esc(p ? p.name : r.email) + '</b><div style="font-size:11px;color:var(--text-2)">' + UI.esc(r.email) + '</div>'; } },
          { h: 'Role', render: function (r) { return '<span class="tag ' + { student: 'b', teacher: 'g', academic: 'y', principal: 'r', warden: 'g', office: 'g', admin: 'y' }[r.role] + '">' + r.role + '</span>'; } },
          { h: 'Kind', render: function (r) { return r.personType; } },
          { h: 'Last login', render: function (r) { return r.lastLogin ? UI.esc(r.lastLogin) : '<span style="color:var(--text-3)">never</span>'; } },
          { h: 'Status', render: function (r) { return r.active ? UI.badge('Active', 'Enabled') : UI.badge('Blocked', 'Disabled'); } },
          { h: 'Actions', render: function (r) {
              return (r.role !== 'admin' ? '<span class="dl" data-tgl="' + r.id + '">' + (r.active ? 'Disable' : 'Enable') + '</span> ' : '') +
                     '<span class="dl" data-rst="' + r.id + '">Reset password</span>';
          } }
        ], list)) +
        UI.hint('Showing first 40 matches of ' + DB.users.length + ' accounts.', '', 'info');
      view.querySelectorAll('[data-ur]').forEach(function (c) { c.addEventListener('click', function () { state.role = c.getAttribute('data-ur'); render(); }); });
      var q = document.getElementById('us-q');
      q.addEventListener('input', function () { state.q = q.value; var pos = q.selectionStart; render(); var q2 = document.getElementById('us-q'); q2.focus(); q2.setSelectionRange(pos, pos); });
      view.querySelectorAll('[data-tgl]').forEach(function (el) { el.addEventListener('click', function () {
        WF.toggleUser(ctx.person.id, el.getAttribute('data-tgl'));
        UI.toast('Account updated', 'Activation toggled.', 'yellow'); render();
      }); });
      view.querySelectorAll('[data-rst]').forEach(function (el) { el.addEventListener('click', function () {
        WF.resetPassword(ctx.person.id, el.getAttribute('data-rst'));
        UI.toast('Password reset', 'Temporary password issued — user notified.', 'green');
      }); });
      document.getElementById('newUser').addEventListener('click', function () {
        UI.modal({ title: 'Create an account', body:
          '<div class="fgrid">' +
          UI.field('nu-role', 'Role', UI.select('nu-role', [{ v: 'student', l: 'Student' }, { v: 'teacher', l: 'Faculty' }, { v: 'office', l: 'Office' }, { v: 'warden', l: 'Warden' }]), true) +
          UI.field('nu-email', 'Email', '<input class="input" id="nu-email" type="email" placeholder="name@mdt.ac.in">', true) +
          '</div>' +
          UI.field('nu-pass', 'Initial password', '<input class="input" id="nu-pass" value="demo123">') +
          UI.hint('The account activates immediately with the chosen role\u2019s permissions.', '', 'info'),
          actions: '<button class="btn ok" id="nu-go">' + UI.icon('check') + 'Create account</button>' });
        document.getElementById('nu-go').addEventListener('click', function () {
          var em = document.getElementById('nu-email').value.trim();
          if (!em) { UI.toast('Email is required', '', 'red'); return; }
          WF.createUser(ctx.person.id, { personType: 'staff', personId: 'NEW' + Date.now().toString(36).slice(-5).toUpperCase(), role: document.getElementById('nu-role').value, email: em, pass: document.getElementById('nu-pass').value || 'demo123' });
          UI.closeModal(); UI.toast('Account created', em + ' is active.', 'green'); render();
        });
      });
    }
    render();

    /* v5-export:us handler (delegated — survives re-renders) */

    SPA.doc('click', function (e) {
      if (!e.target.closest('#usExp')) return;
      var rows = [
        ['My Desktop Tech — CampusOne', ''],
        ['Document', 'USER ACCOUNTS REGISTER'],
        ['Generated', Q.today()],
        [],
        ['User ID', 'Email', 'Role', 'Person type', 'Person ID', 'Active', 'Last login']
      ];
      DB.users.forEach(function (u) {
        rows.push([u.id, u.email, u.role, u.personType, u.personId, u.active ? 'Yes' : 'No', u.lastLogin || '—']);
      });
      UI.downloadCSV('UserAccounts.csv', rows);
    });

  }
});
})();

/* ── library/catalog ............................. ── */
(function () {
MDTPAGE({
  role: 'library',
  folder: 'library',
  id: 'catalog',
  render: function (view, ctx) {

    var me = ctx.person;
    var state = { q: '', dept: '', type: '' };
    function render() {
      var books = DB.libraryBooks.filter(function (b) {
        return (!state.q || (b.title + ' ' + b.author + ' ' + b.subject + ' ' + b.acc).toLowerCase().indexOf(state.q.toLowerCase()) >= 0) &&
               (!state.dept || b.dept === state.dept) && (!state.type || b.type === state.type);
      });
      var depts = DB.libraryBooks.map(function (b) { return b.dept; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort();
      var types = DB.libraryBooks.map(function (b) { return b.type; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort();
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Catalogue — OPAC</h1><div class="sub">' + DB.libraryBooks.length + ' titles · accession, rack and shelf control · add &amp; edit records</div></div>' +
        '<div class="actions"><button class="btn pri" id="newBook">' + UI.icon('plus') + 'Add title</button>' + UI.expBtn('catExp', 'Export catalogue') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'book', value: DB.libraryBooks.length, label: 'Titles' }) +
        UI.stat({ tone: 'g', icon: 'grid', value: DB.libraryBooks.reduce(function (a, b) { return a + b.copies; }, 0), label: 'Copies' }) +
        UI.stat({ tone: 'y', icon: 'checkc', value: DB.libraryBooks.reduce(function (a, b) { return a + b.available; }, 0), label: 'On shelf' }) +
        UI.stat({ tone: 'r', icon: 'alert', value: DB.libraryBooks.filter(function (b) { return b.rack === 'NEW' || b.rack === 'INTAKE'; }).length, label: 'Awaiting shelving' }) +
        '</div>' +
        '<div class="rowflex mb16" style="gap:8px">' +
        '<div class="qsearch" style="flex:1;min-width:200px">' + UI.icon('search') + '<input class="input" id="cat-q" placeholder="Search title, author, subject or accession no" value="' + UI.esc(state.q) + '"></div>' +
        UI.select('cat-dept', depts.map(function (d) { return { v: d, l: d }; }), state.dept, 'All departments') +
        UI.select('cat-type', types.map(function (d) { return { v: d, l: d }; }), state.type, 'All types') +
        '</div>' +
        UI.card('Search results — ' + books.length + ' of ' + DB.libraryBooks.length, 'search', UI.table([
          { h: 'Acc No', render: function (b) { return '<span class="mono">' + b.acc + '</span>'; } },
          { h: 'Title', render: function (b) { return '<b>' + UI.esc(b.title) + '</b><div style="font-size:10.5px;color:var(--text-2)">' + UI.esc(b.author) + ' · ' + b.edition + ' · ' + b.year + '</div>'; } },
          { h: 'Subject', render: function (b) { return '<span class="tag n">' + UI.esc(b.subject) + '</span>'; } },
          { h: 'Dept', render: function (b) { return b.dept; } },
          { h: 'Location', render: function (b) { return '<span class="mono" style="font-size:11px">Rack ' + b.rack + ' · Shelf ' + b.shelf + '</span>'; } },
          { h: 'Copies', render: function (b) { return '<b class="num">' + b.available + '/' + b.copies + '</b>'; } },
          { h: 'Type', render: function (b) { return UI.esc(b.type); } },
          { h: 'Action', render: function (b) { return '<span class="dl" data-ed="' + b.acc + '">Edit</span> <span class="dl" data-det="' + b.acc + '" style="color:var(--blue-ink)">Details</span>'; } }
        ], books, { empty: 'No titles match this search' }));
      var q = document.getElementById('cat-q');
      q.addEventListener('input', function () { state.q = q.value; render(); var q2 = document.getElementById('cat-q'); q2.focus(); q2.setSelectionRange(q.value.length, q.value.length); });
      document.getElementById('cat-dept').addEventListener('change', function (e) { state.dept = e.target.value; render(); });
      document.getElementById('cat-type').addEventListener('change', function (e) { state.type = e.target.value; render(); });
      view.querySelectorAll('[data-det]').forEach(function (el) { el.addEventListener('click', function () {
        var b = Q.bookByAcc(el.getAttribute('data-det'));
        UI.modal({ title: b.title, body:
          UI.kv([['Accession no', '<b class="mono">' + b.acc + '</b>'], ['Author', UI.esc(b.author)], ['Publisher', UI.esc(b.publisher)], ['Edition / Year', b.edition + ' · ' + b.year],
            ['Subject', UI.esc(b.subject)], ['Department', b.dept], ['Type', UI.esc(b.type)], ['Location', 'Rack ' + b.rack + ' · Shelf ' + b.shelf],
            ['Copies', b.available + ' available of ' + b.copies], ['Replacement price', UI.money(b.price)]]) +
          UI.hint('Members see this record in their Library page search; reservations queue when every copy is out.', '', 'info'),
          actions: '<button class="btn pri" onclick="UI.closeModal()">Close</button>' });
      }); });
      view.querySelectorAll('[data-ed]').forEach(function (el) { el.addEventListener('click', function () {
        var b = Q.bookByAcc(el.getAttribute('data-ed'));
        UI.modal({ title: 'Edit — ' + b.acc, body:
          UI.field('eb-title', 'Title', '<input class="input" id="eb-title" value="' + UI.esc(b.title) + '">', true) +
          '<div class="fgrid">' + UI.field('eb-subj', 'Subject', '<input class="input" id="eb-subj" value="' + UI.esc(b.subject) + '">') +
          UI.field('eb-rack', 'Rack', '<input class="input" id="eb-rack" value="' + UI.esc(b.rack) + '">') +
          UI.field('eb-shelf', 'Shelf', '<input class="input" id="eb-shelf" value="' + UI.esc(b.shelf) + '">') +
          UI.field('eb-copies', 'Copies', '<input class="input" id="eb-copies" type="number" min="1" value="' + b.copies + '">') + '</div>',
          actions: '<button class="btn pri" id="eb-go">' + UI.icon('check') + 'Save record</button>' });
        document.getElementById('eb-go').addEventListener('click', function () {
          WF.updateBook(me.id, b.acc, { title: document.getElementById('eb-title').value, subject: document.getElementById('eb-subj').value,
            rack: document.getElementById('eb-rack').value, shelf: document.getElementById('eb-shelf').value, copies: document.getElementById('eb-copies').value });
          UI.closeModal(); UI.toast('Record updated', 'Catalogue reflects instantly for members.', 'green'); render();
        });
      }); });
      document.getElementById('newBook').addEventListener('click', function () {
        UI.modal({ title: 'Accession a new title', body:
          UI.field('nb-title', 'Title', '<input class="input" id="nb-title" placeholder="Book title">', true) +
          '<div class="fgrid">' +
          UI.field('nb-author', 'Author', '<input class="input" id="nb-author" placeholder="Author(s)">', true) +
          UI.field('nb-pub', 'Publisher', '<input class="input" id="nb-pub" placeholder="Publisher">') +
          UI.field('nb-subj', 'Subject', '<input class="input" id="nb-subj" placeholder="Subject heading">', true) +
          UI.field('nb-dept', 'Department', UI.select('nb-dept', [{ v: 'CSE', l: 'CSE' }, { v: 'ECE', l: 'ECE' }, { v: 'GEN', l: 'General' }]), true) +
          UI.field('nb-copies', 'Copies', '<input class="input" id="nb-copies" type="number" min="1" value="2">', true) +
          UI.field('nb-price', 'Price (₹)', '<input class="input" id="nb-price" type="number" min="0" placeholder="e.g. 850">') +
          UI.field('nb-year', 'Year', '<input class="input" id="nb-year" type="number" placeholder="2026">') + '</div>' +
          '<div class="fgrid">' +
          UI.field('nb-rack', 'Rack', '<input class="input" id="nb-rack" placeholder="e.g. A2">') +
          UI.field('nb-shelf', 'Shelf', '<input class="input" id="nb-shelf" placeholder="e.g. S3">') + '</div>' +
          UI.field('nb-type', 'Type', UI.select('nb-type', ['Text Book', 'Reference', 'Rare']), false),
          actions: '<button class="btn pri" id="nb-go">' + UI.icon('check') + 'Accession now</button>' });
        document.getElementById('nb-go').addEventListener('click', function () {
          var t = document.getElementById('nb-title').value;
          if (!t) { UI.toast('Title required', 'Enter the title of the work.', 'red'); return; }
          var acc = WF.addBook(me.id, { title: t, author: document.getElementById('nb-author').value, subject: document.getElementById('nb-subj').value,
            dept: document.getElementById('nb-dept').value, copies: document.getElementById('nb-copies').value, publisher: document.getElementById('nb-pub').value,
            rack: document.getElementById('nb-rack').value, shelf: document.getElementById('nb-shelf').value, price: document.getElementById('nb-price').value,
            year: document.getElementById('nb-year').value, type: document.getElementById('nb-type').value });
          UI.closeModal(); UI.toast('Accessioned as ' + acc, 'Title is live in OPAC for every member.', 'green'); render();
        });
      });
      var ex = document.getElementById('catExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'CATALOGUE EXPORT (OPAC)'],
          ['Generated', Q.today()],
          [],
          ['Acc No', 'Title', 'Author', 'Publisher', 'Subject', 'Dept', 'Type', 'Rack', 'Shelf', 'Year', 'Copies', 'Available', 'Price (Rs)']
        ];
        DB.libraryBooks.forEach(function (b) { rows.push([b.acc, b.title, b.author, b.publisher, b.subject, b.dept, b.type, b.rack, b.shelf, b.year, b.copies, b.available, b.price]); });
        UI.downloadCSV('Library-Catalogue.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── library/dashboard ........................... ── */
(function () {
MDTPAGE({
  role: 'library',
  folder: 'library',
  id: 'dashboard',
  render: function (view, ctx) {

    var me = ctx.person;
    var titles = DB.libraryBooks.length;
    var copies = DB.libraryBooks.reduce(function (a, b) { return a + b.copies; }, 0);
    var available = DB.libraryBooks.reduce(function (a, b) { return a + b.available; }, 0);
    var activeLoans = DB.borrowRecords.filter(function (r) { return !r.returned; }) .length + DB.staffLoans.filter(function (r) { return !r.returned; }).length;
    var overdue = DB.borrowRecords.filter(function (r) { return r.status === 'Overdue'; }).length + DB.staffLoans.filter(function (r) { return r.status === 'Overdue'; }).length;
    var todayDue = DB.borrowRecords.filter(function (r) { return !r.returned && r.due === Q.today(); });
    var fineCollected = DB.fineLedger.filter(function (f) { return f.type === 'Collected'; }).reduce(function (a, f) { return a + f.amount; }, 0);
    var fineOutstanding = DB.fineLedger.filter(function (f) { return f.type === 'Outstanding'; }).reduce(function (a, f) { return a + f.amount; }, 0);
    var resWaiting = DB.bookReservations.filter(function (r) { return r.status === 'Waiting'; }).length;
    var depts = {};
    DB.libraryBooks.forEach(function (b) { depts[b.dept] = (depts[b.dept] || 0) + b.copies; });
    var topBorrowers = DB.borrowRecords.concat(DB.staffLoans).reduce(function (m, r) {
      var key = r.studentId || r.staffId;
      m[key] = (m[key] || 0) + 1;
      return m;
    }, {});
    var topList = Object.keys(topBorrowers).sort(function (a, b) { return topBorrowers[b] - topBorrowers[a]; }).slice(0, 6);
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>' + UI.esc(me.name) + '</h1><div class="sub">' + UI.esc(me.designation) + '</div></div></div>' +
      '<div class="statrow">' +
      UI.stat({ tone: 'b', icon: 'book', value: titles, label: 'Titles catalogued', sub: copies + ' copies · ' + available + ' on shelf', href: 'catalog.html' }) +
      UI.stat({ tone: 'g', icon: 'key', value: activeLoans, label: 'Active loans', sub: 'students + staff', href: 'transactions.html' }) +
      UI.stat({ tone: 'r', icon: 'alert', value: overdue, label: 'Overdue', sub: 'follow-up due', href: 'transactions.html' }) +
      UI.stat({ tone: 'y', icon: 'rupee', value: UI.money(fineCollected), label: 'Fines collected', sub: UI.money(fineOutstanding) + ' outstanding', href: 'fines.html' }) +
      '</div>' +
      '<div class="split">' +
      '<div>' +
      UI.card('Due back today — ' + Q.today(), 'calendar',
        (todayDue.length ? UI.table([
          { h: 'Member', render: function (r) { var s = r.studentId ? Q.studentById(r.studentId) : Q.person(r.staffId); return UI.avatar(s, 26) + ' ' + UI.esc(s ? s.name : '—'); } },
          { h: 'Book', render: function (r) { var b = Q.bookByAcc(r.acc); return UI.esc(b ? b.title : r.acc); } },
          { h: 'Action', render: function (r) { return '<button class="btn sm ok" data-ret="' + r.id + (r.studentId ? '' : '|staff') + '">' + UI.icon('check') + 'Return</button>'; } }
        ], todayDue) : UI.empty('Nothing due back today', 'checkc'))) +
      UI.card('Reservations queue', 'list', UI.table([
          { h: 'Book', render: function (r) { var b = Q.bookByAcc(r.acc); return UI.esc(b ? b.title : r.acc); } },
          { h: 'Member', render: function (r) { return UI.esc(Q.name(r.studentId)); } },
          { h: 'Status', render: function (r) { return UI.badge(r.status); } },
          { h: 'Action', render: function (r) { return r.status === 'Waiting' ? '<span class="dl" data-rsv="' + r.id + '">Mark ready</span>' : '<span class="dl" data-rsvx="' + r.id + '">Close</span>'; } }
        ], DB.bookReservations)) +
      '</div><div>' +
      UI.card('Collection by department', 'chart', UI.barsChart(Object.keys(depts).map(function (d) { return { l: d, v: Math.round(depts[d] / copies * 100), n: depts[d] + ' copies' }; }))) +
      UI.card('Most active borrowers', 'users', UI.table([
          { h: 'Member', render: function (id) { var p = Q.person(id); return UI.avatar(p, 26) + ' ' + UI.esc(p ? p.name : id); } },
          { h: 'Loans', k: null, render: function (id) { return '<b class="num">' + topBorrowers[id] + '</b>'; } }
        ].map(function (c) { return { h: c.h, render: c.render }; }), topList)) +
      '<div class="card glow glow-g accent-g"><div class="card-t">' + UI.icon('grid') + '<h3>Quick actions</h3></div><div class="quickgrid">' +
      '<a class="bigbtn-tile" href="transactions.html">' + UI.icon('key') + '<b>Issue desk</b></a>' +
      '<a class="bigbtn-tile" href="catalog.html">' + UI.icon('book') + '<b>Add title</b></a>' +
      '<a class="bigbtn-tile" href="fines.html">' + UI.icon('rupee') + '<b>Fine desk</b></a>' +
      '<a class="bigbtn-tile" href="procurement.html">' + UI.icon('clipboard') + '<b>Requisitions</b></a>' +
      '</div></div>' +
      '</div></div>';
    view.querySelectorAll('[data-ret]').forEach(function (b) { b.addEventListener('click', function () {
      var v = b.getAttribute('data-ret').split('|');
      if (v[1] === 'staff') { WF.returnStaffBook(v[0], me.id); } else { WF.returnBook(v[0], me.id); }
      UI.toast('Returned', 'Shelf copy count updated.', 'green'); render();
    }); });
    view.querySelectorAll('[data-rsv]').forEach(function (b) { b.addEventListener('click', function () {
      WF.markReservation(me.id, b.getAttribute('data-rsv'), 'Ready'); UI.toast('Marked ready', 'Student notified to collect.', 'green'); render();
    }); });
    view.querySelectorAll('[data-rsvx]').forEach(function (b) { b.addEventListener('click', function () {
      WF.markReservation(me.id, b.getAttribute('data-rsvx'), 'Closed'); render();
    }); });

  }
});
})();

/* ── library/digital ............................. ── */
(function () {
MDTPAGE({
  role: 'library',
  folder: 'library',
  id: 'digital',
  render: function (view, ctx) {

    var me = ctx.person;
    function render() {
      var byUsage = DB.digitalResources.slice().sort(function (a, b) { return b.usage - a.usage; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Digital Resources &amp; e-Infrastructure</h1><div class="sub">Consoratial databases, e-book platforms, video libraries and e-newspapers with campus access rules</div></div>' +
        '<div class="actions"><button class="btn pri" id="newDR">' + UI.icon('plus') + 'Add resource</button>' + UI.expBtn('drExp', 'Export resources') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'globe', value: DB.digitalResources.length, label: 'Subscribed resources' }) +
        UI.stat({ tone: 'g', icon: 'chart', value: DB.digitalResources.reduce(function (a, d) { return a + d.usage; }, 0), label: 'Sessions this term' }) +
        UI.stat({ tone: 'y', icon: 'key', value: DB.digitalResources.filter(function (d) { return d.access.indexOf('IP') >= 0; }).length, label: 'IP-authenticated' }) +
        UI.stat({ tone: 'r', icon: 'alert', value: DB.digitalResources.filter(function (d) { return d.status !== 'Active'; }).length, label: 'Trials &amp; lapses' }) +
        '</div>' +
        UI.card('Resource directory', 'globe', UI.table([
          { h: 'Resource', render: function (d) { return '<b>' + UI.esc(d.name) + '</b><div style="font-size:10.5px;color:var(--text-2)">' + UI.esc(d.provider) + '</div>'; } },
          { h: 'Type', render: function (d) { return '<span class="tag n">' + UI.esc(d.type) + '</span>'; } },
          { h: 'Access', render: function (d) { return UI.esc(d.access); } },
          { h: 'Usage', render: function (d) { return '<b class="num">' + d.usage + '</b>'; } },
          { h: 'Status', render: function (d) { return UI.badge(d.status); } },
          { h: 'Action', render: function (d) { return '<span class="dl" data-dr="' + d.id + '">Open</span>'; } }
        ], byUsage)) +
        UI.card('Usage this term', 'chart', UI.barsChart(byUsage.slice(0, 7).map(function (d) { return { l: d.name.split(' ')[0], v: Math.round(d.usage / 9), n: d.usage + ' sessions' }; }))) +
        '<div class="fhint">Access modes: IP-authenticated sources work anywhere on campus Wi-Fi; member-login sources extend to hostel and home through the single portal sign-in.</div>';
      view.querySelectorAll('[data-dr]').forEach(function (el) { el.addEventListener('click', function () {
        var d = DB.digitalResources.filter(function (x) { return x.id === el.getAttribute('data-dr'); })[0];
        UI.modal({ title: d.name, body: UI.kv([['Provider', UI.esc(d.provider)], ['Type', UI.esc(d.type)], ['Access', UI.esc(d.access)], ['Portal', UI.esc(d.url)], ['Sessions this term', d.usage], ['Status', d.status]]) +
          UI.hint('The campus reader wraps this resource with single sign-on; usage counters feed the library dashboard.', '', 'info'),
          actions: '<button class="btn pri" onclick="UI.closeModal()">Close</button>' });
      }); });
      document.getElementById('newDR').addEventListener('click', function () {
        UI.modal({ title: 'Add a digital resource', body:
          UI.field('dr-n', 'Resource name', '<input class="input" id="dr-n" placeholder="e.g. JSTOR — Arts & Sciences">', true) +
          '<div class="fgrid">' +
          UI.field('dr-t', 'Type', UI.select('dr-t', ['e-Journal Database', 'e-Book Platform', 'Video Library', 'e-Newspaper', 'e-Thesis Repository']), true) +
          UI.field('dr-p', 'Provider', '<input class="input" id="dr-p" placeholder="Publisher / agency">') +
          UI.field('dr-a', 'Access', UI.select('dr-a', ['Open (campus + remote)', 'IP authenticated', 'Login (member)', 'Campus Wi-Fi']), true) +
          UI.field('dr-u', 'Portal URL', '<input class="input" id="dr-u" placeholder="domain only, e.g. jstor.org">') + '</div>',
          actions: '<button class="btn pri" id="dr-go">' + UI.icon('check') + 'Add resource</button>' });
        document.getElementById('dr-go').addEventListener('click', function () {
          var n = document.getElementById('dr-n').value;
          if (!n) { UI.toast('Name required', '', 'red'); return; }
          WF.addDigitalResource(me.id, { name: n, type: document.getElementById('dr-t').value, provider: document.getElementById('dr-p').value, access: document.getElementById('dr-a').value, url: document.getElementById('dr-u').value });
          UI.closeModal(); UI.toast('Resource added', 'Announced to every member.', 'green'); render();
        });
      });
      var ex = document.getElementById('drExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'DIGITAL RESOURCES REGISTER'],
          ['Generated', Q.today()],
          [],
          ['Name', 'Type', 'Provider', 'Access', 'Portal', 'Usage', 'Status']
        ];
        DB.digitalResources.forEach(function (d) { rows.push([d.name, d.type, d.provider, d.access, d.url, d.usage, d.status]); });
        UI.downloadCSV('Library-DigitalResources.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── library/ebooks .............................. ── */
(function () {
MDTPAGE({
  role: 'library',
  folder: 'library',
  id: 'ebooks',
  render: function (view, ctx) {

    var me = ctx.person;
    function render() {
      var checkouts = (DB.ebookCheckouts || []).filter(function (c) { return !c.returned; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>eBooks &amp; Digital Shelf</h1><div class="sub">Digital titles served to students and staff · 7-day checkout window · usage analytics</div></div>' +
        '<div class="actions">' + UI.expBtn('ebExp', 'Export eBooks') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'play', value: DB.ebooks.length, label: 'Digital titles' }) +
        UI.stat({ tone: 'g', icon: 'key', value: checkouts.length, label: 'Checked out now' }) +
        UI.stat({ tone: 'y', icon: 'chart', value: (DB.ebooks.reduce(function (a, e) { return a + (e.views || 0); }, 0)) + 341, label: 'Views this term' }) +
        UI.stat({ tone: 'r', icon: 'alert', value: DB.digitalResources.filter(function (d) { return d.status !== 'Active'; }).length, label: 'Subscriptions needing attention' }) +
        '</div>' +
        '<div class="grid g2">' + DB.ebooks.map(function (e) {
          return '<div class="card glow glow-b accent-b"><div class="spread">' +
            '<div style="display:flex;gap:11px;align-items:center"><span class="sicon tb" style="width:42px;height:42px;border-radius:11px;display:flex;align-items:center;justify-content:center;background:var(--blue-tint);color:var(--g-blue)">' + UI.icon('book') + '</span>' +
            '<span><b style="font-size:13.5px">' + UI.esc(e.title) + '</b><div style="font-size:11px;color:var(--text-2)">' + UI.esc(e.author) + ' · ' + UI.esc(e.subject) + ' · ' + e.size + '</div></span></div></div>' +
            '<div class="mt8">' + UI.kv([['Platform', 'Campus reader (online + offline)'], ['Access', 'All members · IP + login'], ['Licence', 'Concurrent — unlimited']]) + '</div>' +
            '<div class="frow" style="justify-content:flex-start"><button class="btn sm ghost" data-eb="' + e.id + '">' + UI.icon('eye') + 'Preview</button></div></div>';
        }).join('') + '</div>' +
        UI.card('Checked-out digital copies', 'list', UI.table([
          { h: 'Member', render: function (c) { return UI.esc(Q.name(c.memberId)); } },
          { h: 'Title', render: function (c) { var e = DB.ebooks.filter(function (x) { return x.id === c.ebookId; })[0]; return UI.esc(e ? e.title : c.ebookId); } },
          { h: 'Out', render: function (c) { return UI.fmtDate(c.out); } },
          { h: 'Access until', render: function (c) { return UI.fmtDate(c.due); } },
          { h: 'Status', render: function (c) { return UI.badge('Issued'); } }
        ], checkouts.length ? checkouts : [], { empty: 'No digital checkouts pending' }));
      view.querySelectorAll('[data-eb]').forEach(function (b) { b.addEventListener('click', function () {
        var e = DB.ebooks.filter(function (x) { return x.id === b.getAttribute('data-eb'); })[0];
        UI.download(e.title.replace(/\s+/g, '-') + '.txt', e.title + '\n' + e.author + '\n' + e.subject + ' — digital desk preview (demo file).\n');
      }); });
      var ex = document.getElementById('ebExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'EBOOK COLLECTION'],
          ['Generated', Q.today()],
          [],
          ['ID', 'Title', 'Author', 'Subject', 'Size']
        ];
        DB.ebooks.forEach(function (e) { rows.push([e.id, e.title, e.author, e.subject, e.size]); });
        UI.downloadCSV('Library-eBooks.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── library/fines ............................... ── */
(function () {
MDTPAGE({
  role: 'library',
  folder: 'library',
  id: 'fines',
  render: function (view, ctx) {

    var me = ctx.person;
    var state = { tab: 'outstanding' };
    function render() {
      var list = DB.fineLedger.filter(function (f) { return state.tab === 'all' || f.type.toLowerCase() === state.tab; });
      var collected = DB.fineLedger.filter(function (f) { return f.type === 'Collected'; }).reduce(function (a, f) { return a + f.amount; }, 0);
      var outstanding = DB.fineLedger.filter(function (f) { return f.type === 'Outstanding'; }).reduce(function (a, f) { return a + f.amount; }, 0);
      var waived = DB.fineLedger.filter(function (f) { return f.type === 'Waived'; }).length;
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Fines &amp; Payments</h1><div class="sub">Overdue ₹5/day · damage &amp; loss recovery · collect, waive or record at the counter</div></div>' +
        '<div class="actions"><button class="btn pri" id="newFine">' + UI.icon('plus') + 'Record a fine</button>' + UI.expBtn('fnExp', 'Export fine ledger') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'g', icon: 'rupee', value: UI.money(collected), label: 'Collected (all time)' }) +
        UI.stat({ tone: 'r', icon: 'alert', value: UI.money(outstanding), label: 'Outstanding', sub: DB.fineLedger.filter(function (f) { return f.type === 'Outstanding'; }).length + ' members' }) +
        UI.stat({ tone: 'y', icon: 'checkc', value: waived, label: 'Waived (reviewed)' }) +
        UI.stat({ tone: 'b', icon: 'chart', value: Math.round(collected / (collected + outstanding || 1) * 100) + '%', label: 'Recovery rate' }) +
        '</div>' +
        '<div class="rowflex mb16">' + UI.chiprow([
          { v: 'outstanding', l: 'Outstanding', c: DB.fineLedger.filter(function (f) { return f.type === 'Outstanding'; }).length },
          { v: 'collected', l: 'Collected', c: DB.fineLedger.filter(function (f) { return f.type === 'Collected'; }).length },
          { v: 'waived', l: 'Waived', c: waived }, { v: 'all', l: 'All entries', c: DB.fineLedger.length }
        ], state.tab) + '</div>' +
        UI.card('Fine ledger', 'rupee', UI.table([
          { h: 'Member', render: function (f) { return UI.avatar(Q.person(f.memberId), 26) + ' ' + UI.esc(Q.name(f.memberId)); } },
          { h: 'Type', render: function (f) { return f.memberType === 'student' ? 'Student' : 'Staff'; } },
          { h: 'Amount', render: function (f) { return '<b class="num">' + UI.money(f.amount) + '</b>'; } },
          { h: 'Reason', render: function (f) { return UI.esc(f.reason); } },
          { h: 'Status', render: function (f) { return UI.badge(f.type); } },
          { h: 'Mode', render: function (f) { return UI.esc(f.mode); } },
          { h: 'Recorded', render: function (f) { return UI.esc(f.at); } },
          { h: 'Action', render: function (f) { return f.type === 'Outstanding' ?
            '<button class="btn sm ok" data-col="' + f.id + '">' + UI.icon('rupee') + 'Collect</button> <span class="dl" data-wav="' + f.id + '" style="color:var(--red-ink)">Waive</span>' : '<span style="color:var(--text-3)">' + UI.esc(f.by ? Q.name(f.by) : '—') + '</span>'; } }
        ], list)) +
        UI.hint('Waivers are reviewable in the audit trail — each entry carries the member, reason and the desk officer who handled it.', '', 'info');
      view.querySelectorAll('.chip[data-f]').forEach(function (c) { c.addEventListener('click', function () { state.tab = c.getAttribute('data-f'); render(); }); });
      view.querySelectorAll('[data-col]').forEach(function (b) { b.addEventListener('click', function () {
        var id = b.getAttribute('data-col');
        UI.modal({ title: 'Collect fine', body:
          UI.kv([['Member', UI.esc(Q.name((DB.fineLedger.filter(function (x) { return x.id === id; })[0] || {}).memberId))], ['Reason', UI.esc((DB.fineLedger.filter(function (x) { return x.id === id; })[0] || {}).reason)]]) +
          UI.field('cf-mode', 'Payment mode', UI.select('cf-mode', ['Cash', 'UPI', 'Card']), true),
          actions: '<button class="btn pri" id="cf-go">' + UI.icon('check') + 'Confirm collection</button>' });
        document.getElementById('cf-go').addEventListener('click', function () {
          WF.collectFine(me.id, id, document.getElementById('cf-mode').value);
          UI.closeModal(); UI.toast('Fine collected', 'Receipt available for the member.', 'green'); render();
        });
      }); });
      view.querySelectorAll('[data-wav]').forEach(function (el) { el.addEventListener('click', function () {
        UI.modal({ title: 'Waive fine', body: UI.field('wv-r', 'Reason for waiver', '<input class="input" id="wv-r" placeholder="e.g. medical proof verified">', true) +
          UI.hint('Waivers appear in the audit trail with your name against the entry.', 'warn', 'alert'),
          actions: '<button class="btn pri" id="wv-go">' + UI.icon('check') + 'Waive</button>' });
        document.getElementById('wv-go').addEventListener('click', function () {
          WF.waiveFine(me.id, el.getAttribute('data-wav'), document.getElementById('wv-r').value);
          UI.closeModal(); UI.toast('Fine waived', 'Entry recorded for audit.', 'yellow'); render();
        });
      }); });
      document.getElementById('newFine').addEventListener('click', function () {
        var memberOpts = DB.students.slice(0, 40).map(function (s) { return { v: 'ST|' + s.id, l: s.name + ' · ' + s.reg }; })
          .concat(DB.staff.map(function (t) { return { v: 'STF|' + t.id, l: t.name + ' · staff' }; }));
        UI.modal({ title: 'Record a fine', body:
          UI.field('nf-m', 'Member', UI.select('nf-m', memberOpts, '', 'Select member'), true) +
          '<div class="fgrid">' + UI.field('nf-a', 'Amount (₹)', '<input class="input" id="nf-a" type="number" min="1" placeholder="e.g. 50">', true) +
          UI.field('nf-r', 'Reason', '<input class="input" id="nf-r" placeholder="e.g. damaged binding">', true) + '</div>',
          actions: '<button class="btn pri" id="nf-go">' + UI.icon('check') + 'Record</button>' });
        document.getElementById('nf-go').addEventListener('click', function () {
          var v = document.getElementById('nf-m').value.split('|');
          if (!v[1] || !document.getElementById('nf-a').value) { UI.toast('Incomplete', 'Fill the member, amount and reason.', 'red'); return; }
          WF.addFineEntry(me.id, v[1], v[0] === 'ST' ? 'student' : 'staff', document.getElementById('nf-a').value, document.getElementById('nf-r').value);
          UI.closeModal(); UI.toast('Fine recorded', 'Member notified with the reason.', 'yellow'); render();
        });
      });
      var ex = document.getElementById('fnExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'FINE LEDGER'],
          ['Generated', Q.today()],
          [],
          ['Member', 'Category', 'Amount (Rs)', 'Reason', 'Status', 'Mode', 'Handled by', 'At']
        ];
        DB.fineLedger.forEach(function (f) { rows.push([Q.name(f.memberId), f.memberType, f.amount, f.reason, f.type, f.mode, f.by ? Q.name(f.by) : '—', f.at]); });
        UI.downloadCSV('Library-FineLedger.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── library/inventory ........................... ── */
(function () {
MDTPAGE({
  role: 'library',
  folder: 'library',
  id: 'inventory',
  render: function (view, ctx) {

    var me = ctx.person;
    function render() {
      var racks = {};
      DB.libraryBooks.forEach(function (b) { racks[b.rack] = (racks[b.rack] || 0) + b.copies; });
      var expected = DB.libraryBooks.reduce(function (a, b) { return a + b.copies; }, 0);
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Inventory &amp; Stock Verification</h1><div class="sub">Rack-wise holding, scheduled verification blocks and the weeding / write-off register</div></div>' +
        '<div class="actions"><button class="btn pri" id="newSV">' + UI.icon('plus') + 'Schedule verification</button>' + UI.expBtn('ivExp', 'Export inventory') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'grid', value: Object.keys(racks).length, label: 'Racks in service' }) +
        UI.stat({ tone: 'g', icon: 'book', value: expected, label: 'Copies on record' }) +
        UI.stat({ tone: 'y', icon: 'checkc', value: DB.stockVerification.filter(function (s) { return s.status === 'Completed'; }).length, label: 'Verifications done' }) +
        UI.stat({ tone: 'r', icon: 'alert', value: DB.weeded.length, label: 'Weeded / written off' }) +
        '</div>' +
        '<div class="split">' +
        '<div>' + UI.card('Copies per rack', 'chart', UI.barsChart(Object.keys(racks).sort().map(function (r) { return { l: 'Rack ' + r, v: Math.round(racks[r] / expected * 100), n: racks[r] + ' copies' }; }))) +
        UI.card('Verification blocks', 'checkc', UI.table([
          { h: 'Section', render: function (s) { return '<b>' + UI.esc(s.section) + '</b>'; } },
          { h: 'Date', render: function (s) { return s.date ? UI.fmtDate(s.date) : UI.badge('Scheduled'); } },
          { h: 'Expected', render: function (s) { return s.expected; } },
          { h: 'Found', render: function (s) { return s.date ? '<b class="num">' + s.found + '</b>' : '—'; } },
          { h: 'Status', render: function (s) { return UI.badge(s.status); } },
          { h: 'Note', render: function (s) { return UI.esc(s.note || '—'); } }
        ], DB.stockVerification)) + '</div>' +
        '<div>' + UI.card('Weeding & write-off register', 'alert', UI.table([
          { h: 'Acc No', render: function (w) { return '<span class="mono">' + w.acc + '</span>'; } },
          { h: 'Reason', render: function (w) { return UI.esc(w.reason); } },
          { h: 'Mode', render: function (w) { return UI.esc(w.mode); } },
          { h: 'Date', render: function (w) { return UI.fmtDate(w.date); } },
          { h: 'By', render: function (w) { return UI.esc(Q.name(w.by)); } }
        ], DB.weeded)) +
        UI.card('Weed a copy', 'edit', '<div class="fld"><label>Mark a copy as damaged / lost</label><div class="rowflex" style="gap:8px">' +
          UI.select('wv-acc', DB.libraryBooks.slice(0, 30).map(function (b) { return { v: b.acc, l: b.acc + ' · ' + b.title.slice(0, 28) }; }), '', 'Select accession') +
          UI.select('wv-mode', ['Weeded', 'Write-off', 'Recovered']) +
          '<button class="btn pri" id="wv-go">' + UI.icon('check') + 'Record</button></div>' +
          UI.field('wv-r', 'Reason', '<input class="input" id="wv-r" placeholder="e.g. binding beyond repair">') +
          '</div>') + '</div>' +
        '</div>';
      document.getElementById('wv-go').addEventListener('click', function () {
        var acc = document.getElementById('wv-acc').value;
        var r = document.getElementById('wv-r').value || 'Condition unusable';
        if (!acc) { UI.toast('Select a copy', '', 'red'); return; }
        WF.weedBook(me.id, acc, r, document.getElementById('wv-mode').value);
        UI.toast('Recorded', 'Weeding register updated.', 'yellow'); render();
      });
      document.getElementById('newSV').addEventListener('click', function () {
        UI.modal({ title: 'Schedule a verification block', body:
          UI.field('sv-s', 'Section', '<input class="input" id="sv-s" placeholder="e.g. B2 — ECE Reference">', true) +
          '<div class="fgrid">' + UI.field('sv-d', 'Planned date', '<input class="input" id="sv-d" type="date" min="' + Q.today() + '">', true) +
          UI.field('sv-n', 'Expected copies', '<input class="input" id="sv-n" type="number" placeholder="e.g. 64">', true) + '</div>',
          actions: '<button class="btn pri" id="sv-go">' + UI.icon('check') + 'Schedule</button>' });
        document.getElementById('sv-go').addEventListener('click', function () {
          DB.stockVerification.push({ id: 'SV' + (DB.stockVerification.length + 1), section: document.getElementById('sv-s').value, date: null, expected: +document.getElementById('sv-n').value || 0, found: 0, status: 'Scheduled', note: '' });
          WF.commit(me.id, 'Scheduled stock verification', document.getElementById('sv-s').value);
          UI.closeModal(); UI.toast('Verification scheduled', '', 'green'); render();
        });
      });
      var ex = document.getElementById('ivExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'STOCK VERIFICATION & WEEDING REGISTER'],
          ['Generated', Q.today()],
          [],
          ['Type', 'Section / Acc', 'Expected', 'Found', 'Status', 'Note']
        ];
        DB.stockVerification.forEach(function (s) { rows.push(['Verification', s.section, s.expected, s.found, s.status, s.note]); });
        DB.weeded.forEach(function (w) { rows.push(['Weeded', w.acc, '', '', w.mode, w.reason]); });
        UI.downloadCSV('Library-Inventory.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── library/journals ............................ ── */
(function () {
MDTPAGE({
  role: 'library',
  folder: 'library',
  id: 'journals',
  render: function (view, ctx) {

    var me = ctx.person;
    var state = { j: 'JN1' };
    function render() {
      var j = DB.journals.filter(function (x) { return x.id === state.j; })[0] || DB.journals[0];
      var issues = DB.journalIssues.filter(function (i) { return i.journalId === j.id; });
      var missing = DB.journalIssues.filter(function (i) { return i.flag; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Journals &amp; Periodicals</h1><div class="sub">' + DB.journals.length + ' subscriptions · issue tracking, renewal alerts and vendor claims</div></div>' +
        '<div class="actions">' + UI.expBtn('jnExp', 'Export subscriptions') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'list', value: DB.journals.filter(function (x) { return x.type === 'Journal'; }).length, label: 'Journals' }) +
        UI.stat({ tone: 'g', icon: 'file', value: DB.journals.filter(function (x) { return x.type === 'Magazine' || x.type === 'Newspaper'; }).length, label: 'Magazines &amp; press' }) +
        UI.stat({ tone: 'r', icon: 'alert', value: missing.length, label: 'Missing issues', sub: 'vendor claims open' }) +
        UI.stat({ tone: 'y', icon: 'calendar', value: DB.journals.filter(function (x) { return x.status !== 'Active'; }).length, label: 'Renewals / lapsed' }) +
        '</div>' +
        '<div class="split">' +
        '<div>' + UI.card('Subscriptions', 'list', UI.table([
          { h: 'Title', render: function (x) { return '<b>' + UI.esc(x.title) + '</b><div style="font-size:10.5px;color:var(--text-2)">' + UI.esc(x.publisher) + ' · ' + x.freq + '</div>'; } },
          { h: 'Type', render: function (x) { return x.type; } },
          { h: 'Cost/yr', render: function (x) { return UI.money(x.cost); } },
          { h: 'Renewal', render: function (x) { return UI.fmtDate(x.renewal); } },
          { h: 'Status', render: function (x) { return UI.badge(x.status); } },
          { h: '', render: function (x) { return '<span class="dl" data-j="' + x.id + '">Issues</span>'; } }
        ], DB.journals)) + '</div>' +
        '<div>' + UI.card('Issue register — ' + j.title, 'calendar', UI.table([
          { h: 'Vol / Issue', render: function (i) { return '<b>' + i.vol + ' / ' + i.issue + '</b>'; } },
          { h: 'Expected', render: function (i) { return UI.fmtDate(i.expected); } },
          { h: 'Received', render: function (i) { return i.received ? UI.fmtDate(i.received) : UI.badge('Pending'); } },
          { h: 'Flag', render: function (i) { return i.flag ? '<span style="color:var(--red-ink);font-size:11.5px">' + UI.esc(i.flag) + '</span>' : '—'; } },
          { h: 'Action', render: function (i) { return !i.received ? '<span class="dl" data-rcv="' + i.id + '">Mark received</span> <span class="dl" data-ms="' + i.id + '" style="color:var(--red-ink)">Claim</span>' : ''; } }
        ], issues)) +
        UI.hint('Claims notify the vendor and feed the missing-issue stat — renewals due within 60 days show amber.', '', 'info') + '</div>' +
        '</div>';
      view.querySelectorAll('[data-j]').forEach(function (el) { el.addEventListener('click', function () { state.j = el.getAttribute('data-j'); render(); }); });
      view.querySelectorAll('[data-rcv]').forEach(function (el) { el.addEventListener('click', function () {
        WF.receiveJournal(me.id, el.getAttribute('data-rcv')); UI.toast('Issue received', 'Register updated.', 'green'); render();
      }); });
      view.querySelectorAll('[data-ms]').forEach(function (el) { el.addEventListener('click', function () {
        WF.flagJournalMissing(me.id, el.getAttribute('data-ms')); UI.toast('Claim filed', 'Vendor notified for the missing issue.', 'yellow'); render();
      }); });
      var ex = document.getElementById('jnExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'PERIODICAL SUBSCRIPTIONS'],
          ['Generated', Q.today()],
          [],
          ['Title', 'Publisher', 'Type', 'Frequency', 'Vendor', 'Cost (Rs)', 'From', 'To', 'Renewal', 'Status']
        ];
        DB.journals.forEach(function (x) { rows.push([x.title, x.publisher, x.type, x.freq, x.vendor, x.cost, x.from, x.to, x.renewal, x.status]); });
        UI.downloadCSV('Library-Journals.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── library/members ............................. ── */
(function () {
MDTPAGE({
  role: 'library',
  folder: 'library',
  id: 'members',
  render: function (view, ctx) {

    var state = { q: '', tab: 'all' };
    function render() {
      var studentMembers = DB.students.map(function (s) {
        var loans = DB.borrowRecords.filter(function (r) { return r.studentId === s.id && !r.returned; });
        var fines = DB.fineLedger.filter(function (f) { return f.memberId === s.id && f.type === 'Outstanding'; }).reduce(function (a, f) { return a + f.amount; }, 0);
        return { id: s.id, p: s, type: 'Student', loans: loans.length, fines: fines, since: s.admissionDate, limit: 3 };
      });
      var staffMembers = DB.staff.map(function (t) {
        var loans = DB.staffLoans.filter(function (r) { return r.staffId === t.id && !r.returned; });
        var fines = DB.fineLedger.filter(function (f) { return f.memberId === t.id && f.type === 'Outstanding'; }).reduce(function (a, f) { return a + f.amount; }, 0);
        return { id: t.id, p: t, type: 'Staff', loans: loans.length, fines: fines, since: '2024-06-01', limit: 6 };
      });
      var all = studentMembers.concat(staffMembers);
      var list = all.filter(function (m) {
        var hay = (m.p.name + ' ' + (m.p.reg || '') + ' ' + m.id).toLowerCase();
        return (!state.q || hay.indexOf(state.q.toLowerCase()) >= 0) &&
          (state.tab === 'all' || (state.tab === 'active' && m.loans > 0) || (state.tab === 'dues' && m.fines > 0));
      });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Library Members</h1><div class="sub">' + all.length + ' members — students and staff · limits 3 (student) / 6 (staff) · membership auto-provisions with admission or joining</div></div>' +
        '<div class="actions">' + UI.expBtn('mbExp', 'Export members') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'users', value: all.length, label: 'Members' }) +
        UI.stat({ tone: 'g', icon: 'key', value: all.filter(function (m) { return m.loans > 0; }).length, label: 'With active loans' }) +
        UI.stat({ tone: 'r', icon: 'rupee', value: all.filter(function (m) { return m.fines > 0; }).length, label: 'With dues' }) +
        UI.stat({ tone: 'y', icon: 'alert', value: all.filter(function (m) { return m.loans >= m.limit; }).length, label: 'At borrowing limit' }) +
        '</div>' +
        '<div class="rowflex mb16" style="gap:8px">' +
        '<div class="qsearch" style="flex:1;min-width:220px">' + UI.icon('search') + '<input class="input" id="mb-q" placeholder="Search name, register no or member id" value="' + UI.esc(state.q) + '"></div>' +
        UI.chiprow([{ v: 'all', l: 'All', c: all.length }, { v: 'active', l: 'Active loans', c: all.filter(function (m) { return m.loans > 0; }).length }, { v: 'dues', l: 'With dues', c: all.filter(function (m) { return m.fines > 0; }).length }], state.tab) + '</div>' +
        UI.card('Membership register — ' + list.length + ' shown', 'users', UI.table([
          { h: 'Member', render: function (m) { return UI.avatar(m.p, 26) + ' <b>' + UI.esc(m.p.name) + '</b><div style="font-size:10.5px;color:var(--text-2)">' + (m.p.reg ? m.p.reg + ' · ' + m.p.classId : UI.esc(m.p.designation)) + '</div>'; } },
          { h: 'Card', render: function (m) { return '<span class="mono" style="font-size:11px">LIB-' + m.id + '</span>'; } },
          { h: 'Type', render: function (m) { return m.type; } },
          { h: 'Loans', render: function (m) { return '<b class="num">' + m.loans + '/' + m.limit + '</b>'; } },
          { h: 'Dues', render: function (m) { return m.fines ? '<b class="num" style="color:var(--red-ink)">' + UI.money(m.fines) + '</b>' : '—'; } },
          { h: 'Member since', render: function (m) { return UI.fmtDate(m.since); } },
          { h: 'Action', render: function (m) { return '<span class="dl" data-hist="' + m.id + '">History</span>'; } }
        ], list));
      var q = document.getElementById('mb-q');
      q.addEventListener('input', function () { state.q = q.value; render(); var q2 = document.getElementById('mb-q'); q2.focus(); q2.setSelectionRange(q.value.length, q.value.length); });
      view.querySelectorAll('.chip[data-f]').forEach(function (c) { c.addEventListener('click', function () { state.tab = c.getAttribute('data-f'); render(); }); });
      view.querySelectorAll('[data-hist]').forEach(function (el) { el.addEventListener('click', function () {
        var id = el.getAttribute('data-hist');
        var hist = DB.borrowRecords.filter(function (r) { return r.studentId === id; }).concat(DB.staffLoans.filter(function (r) { return r.staffId === id; }));
        UI.modal({ title: 'Loan history — ' + Q.name(id), body: hist.length ? UI.table([
          { h: 'Acc', render: function (r) { return '<span class="mono">' + r.acc + '</span>'; } },
          { h: 'Out', render: function (r) { return UI.fmtDate(r.out); } },
          { h: 'Due', render: function (r) { return UI.fmtDate(r.due); } },
          { h: 'Returned', render: function (r) { return r.returned ? UI.fmtDate(r.returned) : UI.badge(r.status); } },
          { h: 'Fine', render: function (r) { return r.fine ? UI.money(r.fine) : '—'; } }
        ], hist) : UI.empty('No loans yet', 'book'),
          actions: '<button class="btn pri" onclick="UI.closeModal()">Close</button>' });
      }); });
      var ex = document.getElementById('mbExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'LIBRARY MEMBERSHIP REGISTER'],
          ['Generated', Q.today()],
          [],
          ['Member ID', 'Name', 'Category', 'Class/Designation', 'Active loans', 'Limit', 'Dues (Rs)', 'Member since']
        ];
        all.forEach(function (m) { rows.push([m.id, m.p.name, m.type, m.p.reg ? m.p.classId : m.p.designation, m.loans, m.limit, m.fines, m.since]); });
        UI.downloadCSV('Library-Members.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── library/procurement ......................... ── */
(function () {
MDTPAGE({
  role: 'library',
  folder: 'library',
  id: 'procurement',
  render: function (view, ctx) {

    var me = ctx.person;
    function render() {
      var open = DB.requisitions.filter(function (r) { return r.status === 'Submitted' || r.status === 'With Librarian'; });
      var approved = DB.requisitions.filter(function (r) { return r.status === 'Approved'; });
      var spend = DB.requisitions.reduce(function (a, r) { return a + (r.status === 'Approved' || r.status === 'Ordered' || r.status === 'Received' ? r.total : 0); }, 0);
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Procurement</h1><div class="sub">Department requisitions → librarian review → principal approval → purchase order → accession</div></div>' +
        '<div class="actions">' + UI.expBtn('pqExp', 'Export procurement log') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'y', icon: 'door', value: open.length, label: 'In review', sub: 'your desk next' }) +
        UI.stat({ tone: 'g', icon: 'checkc', value: approved.length, label: 'Approved — order due' }) +
        UI.stat({ tone: 'b', icon: 'clipboard', value: DB.requisitions.length, label: 'Requisitions (all)' }) +
        UI.stat({ tone: 'r', icon: 'rupee', value: UI.money(spend), label: 'Committed spend', sub: 'budget: ' + UI.money(DB.budgets.filter(function (b) { return b.section.indexOf('Library') >= 0; })[0] ? DB.budgets.filter(function (b) { return b.section.indexOf('Library') >= 0; })[0].allocated : 0) }) +
        '</div>' +
        '<div class="grid g2">' +
        (open.length ? open.map(function (r) {
          return '<div class="card glow glow-y accent-y"><div class="spread"><div><b>' + r.id + ' · ' + r.dept + '</b>' +
            '<div style="font-size:11px;color:var(--text-2)">' + UI.esc(Q.name(r.by)) + ' · ' + UI.fmtDate(r.at) + '</div></div>' + UI.badge(r.status) + '</div>' +
            '<div class="mt8">' + UI.table([
              { h: 'Title', render: function (i) { return UI.esc(i.title); } },
              { h: 'Publisher', render: function (i) { return UI.esc(i.publisher); } },
              { h: 'Copies', render: function (i) { return i.copies; } },
              { h: '₹', render: function (i) { return UI.money(i.copies * i.price); } }
            ], r.items) + '</div>' +
            '<div class="mt8">' + UI.timeline(r.timeline) + '</div>' +
            '<div class="frow" style="justify-content:flex-start">' +
            (r.status === 'Submitted' ? '<button class="btn ok" data-rec="' + r.id + '">' + UI.icon('check') + 'Recommend to Principal</button><button class="btn ghost-r" data-rqj="' + r.id + '">' + UI.icon('x') + 'Return</button>' : '') +
            '</div></div>';
        }).join('') : '<div class="card">' + UI.empty('No requisitions awaiting your review', 'checkc') + '</div>') +
        '</div>' +
        UI.card('Approved — place purchase orders', 'clipboard', UI.table([
          { h: 'Req', render: function (r) { return '<b class="mono">' + r.id + '</b> · ' + r.dept; } },
          { h: 'Titles', render: function (r) { return r.items.length + ' · ' + UI.esc(r.items[0].title.slice(0, 26)) + (r.items.length > 1 ? ' +' + (r.items.length - 1) : ''); } },
          { h: 'Total', render: function (r) { return UI.money(r.total); } },
          { h: 'Status', render: function (r) { return UI.badge(r.status); } },
          { h: 'Action', render: function (r) { return r.status === 'Approved' ? '<button class="btn sm pri" data-po="' + r.id + '">' + UI.icon('cart') + 'Place PO</button>' : (r.status === 'Ordered' ? '<button class="btn sm ok" data-rcvord="' + r.id + '">' + UI.icon('check') + 'Receive &amp; accession</button>' : ''); } }
        ], DB.requisitions.filter(function (r) { return r.status === 'Approved' || r.status === 'Ordered' || r.status === 'Received'; }))) +
        UI.card('Full requisition log', 'list', UI.table([
          { h: 'Req', render: function (r) { return '<span class="mono">' + r.id + '</span>'; } },
          { h: 'Dept', render: function (r) { return r.dept + ' · ' + UI.esc(Q.name(r.by)); } },
          { h: 'Titles', k: null, render: function (r) { return r.items.length; } },
          { h: 'Total', render: function (r) { return UI.money(r.total); } },
          { h: 'Status', render: function (r) { return UI.badge(r.status); } }
        ], DB.requisitions)) +
        '<div class="fhint" style="margin-top:12px">Approved requisitions become purchase orders against empanelled vendors; receiving accessions titles into the live catalogue automatically.</div>';
      view.querySelectorAll('[data-rec]').forEach(function (b) { b.addEventListener('click', function () {
        WF.decideRequisition(b.getAttribute('data-rec'), 'librarian', true); UI.toast('Recommended', 'Principal notified for approval.', 'green'); render();
      }); });
      view.querySelectorAll('[data-rqj]').forEach(function (b) { b.addEventListener('click', function () {
        WF.decideRequisition(b.getAttribute('data-rqj'), 'librarian', false, 'Duplicate / budget note'); UI.toast('Returned', 'Requester notified.', 'red'); render();
      }); });
      view.querySelectorAll('[data-po]').forEach(function (b) { b.addEventListener('click', function () {
        UI.modal({ title: 'Place purchase order', body:
          UI.field('po-v', 'Vendor', UI.select('po-v', DB.vendors.filter(function (v) { return v.category === 'Books & Periodicals' || v.category === 'Journals & Databases'; }).map(function (v) { return { v: v.id, l: v.name }; }), '', 'Select vendor'), true),
          actions: '<button class="btn pri" id="po-go">' + UI.icon('check') + 'Confirm order</button>' });
        document.getElementById('po-go').addEventListener('click', function () {
          var v = document.getElementById('po-v').value || 'V-1001';
          WF.orderRequisition(me.id, b.getAttribute('data-po'), v);
          UI.closeModal(); UI.toast('Order placed', 'PO logged against the vendor.', 'green'); render();
        });
      }); });
      view.querySelectorAll('[data-rcvord]').forEach(function (b) { b.addEventListener('click', function () {
        WF.receiveOrder(me.id, b.getAttribute('data-rcvord')); UI.toast('Accessioned', 'Titles are now live in the catalogue.', 'green'); render();
      }); });
      var ex = document.getElementById('pqExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'PROCUREMENT LOG'],
          ['Generated', Q.today()],
          [],
          ['Req ID', 'Department', 'Requester', 'Titles', 'Total (Rs)', 'Status', 'Timeline']
        ];
        DB.requisitions.forEach(function (r) {
          rows.push([r.id, r.dept, Q.name(r.by), r.items.length, r.total, r.status, r.timeline.map(function (t) { return t.s + (t.at ? ' @ ' + t.at : ''); }).join(' | ')]);
        });
        UI.downloadCSV('Library-Procurement.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── library/profile ............................. ── */
(function () {
MDTPAGE({
  role: 'library',
  folder: 'library',
  id: 'profile',
  render: function (view, ctx) {

    var me = ctx.person;
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>My Profile</h1><div class="sub">Knowledge Resource Centre</div></div></div>' +
      '<div class="split-eq">' +
      '<div>' +
        '<div class="card glow glow-g accent-g">' + UI.photoBox(me, 'Your photo appears on notices, issue slips and the staff directory.') + '</div>' +
        UI.card('Office', 'cap', UI.kv([
          ['Employee code', '<b class="mono">' + me.id + '</b>'],
          ['Designation', UI.esc(me.designation)],
          ['Experience', me.exp + ' years'],
          ['Expertise', UI.esc(me.expertise)]
        ])) +
        UI.card('Scope of this portal', 'grid', '<ul style="margin:4px 0 0 16px;padding:0;font-size:12.5px;color:var(--text-2);line-height:1.9">' +
          '<li><b>Circulation</b> — issue, return, renew, reservations for students and staff.</li>' +
          '<li><b>Catalogue</b> — OPAC records with rack, shelf, publisher and price control.</li>' +
          '<li><b>Collection development</b> — journals, e-books, digital databases and procurement.</li>' +
          '<li><b>Compliance</b> — fine ledger, stock verification and the weeding register.</li>' +
        '</ul>') +
      '</div>' +
      '<div>' +
        UI.card('Contact', 'idcard', UI.kv([
          ['Email', UI.esc(me.email)],
          ['Phone', UI.esc(me.phone)],
          ['Campus', DB.settings.institute + ', ' + DB.settings.city]
        ])) +
        UI.card('Connected approvals', 'shield', '<ul style="margin:4px 0 0 16px;padding:0;font-size:12.5px;color:var(--text-2);line-height:1.9">' +
          '<li>Department <b>book requisitions</b> arrive here for review before the Principal approves.</li>' +
          '<li>Overdue reminders reach students through notifications raised at this desk.</li>' +
          '<li>Journal claims feed vendor ratings maintained by the accounts office.</li>' +
        '</ul>') +
        UI.card('Account', 'shield', UI.kv([
          ['Role', '<b>' + UI.esc(ctx.role) + '</b> — Library'],
          ['Access', 'Library, circulation, collection, procurement, inventory'],
          ['Sign-in', UI.esc(ctx.user.lastLogin)]
        ])) +
      '</div></div>';

  }
});
})();

/* ── library/transactions ........................ ── */
(function () {
MDTPAGE({
  role: 'library',
  folder: 'library',
  id: 'transactions',
  render: function (view, ctx) {

    var me = ctx.person;
    var state = { tab: 'active', q: '' };
    function render() {
      var loans = DB.borrowRecords.filter(function (r) { return !r.returned; }).map(function (r) { return { r: r, who: Q.studentById(r.studentId), mtype: 'student' }; })
        .concat(DB.staffLoans.filter(function (r) { return !r.returned; }).map(function (r) { return { r: r, who: Q.person(r.staffId), mtype: 'staff' }; }));
      var returned = DB.borrowRecords.filter(function (r) { return r.returned; }).concat(DB.staffLoans.filter(function (r) { return r.returned; }));
      var list = state.tab === 'active'
        ? loans.filter(function (x) { return !state.q || (x.who ? x.who.name : '').toLowerCase().indexOf(state.q.toLowerCase()) >= 0 || x.r.acc.toLowerCase().indexOf(state.q.toLowerCase()) >= 0; })
        : (state.tab === 'overdue' ? loans.filter(function (x) { return x.r.status === 'Overdue'; }) : returned);
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Issue · Return · Renew</h1><div class="sub">One desk for every member — students and staff · loan 14 days (staff 21) · renewal +14 · fine ₹5/day</div></div>' +
        '<div class="actions"><button class="btn pri" id="newLoan">' + UI.icon('plus') + 'Issue a book</button>' +
        UI.expBtn('txExp', 'Export circulation') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'g', icon: 'key', value: loans.length, label: 'On loan' }) +
        UI.stat({ tone: 'r', icon: 'alert', value: loans.filter(function (x) { return x.r.status === 'Overdue'; }).length, label: 'Overdue' }) +
        UI.stat({ tone: 'b', icon: 'list', value: returned.length, label: 'Returned (all time)' }) +
        UI.stat({ tone: 'y', icon: 'users', value: DB.bookReservations.filter(function (r) { return r.status !== 'Closed'; }).length, label: 'Reservations' }) +
        '</div>' +
        '<div class="rowflex mb16" style="gap:8px">' + UI.chiprow([
          { v: 'active', l: 'Active', c: loans.length }, { v: 'overdue', l: 'Overdue', c: loans.filter(function (x) { return x.r.status === 'Overdue'; }).length },
          { v: 'returned', l: 'Returned', c: returned.length }, { v: 'res', l: 'Reservations', c: DB.bookReservations.length }
        ], state.tab) + '</div>' +
        (state.tab === 'res' ? UI.card('Reservations', 'list', UI.table([
          { h: 'Book', render: function (r) { var b = Q.bookByAcc(r.acc); return '<b>' + UI.esc(b ? b.title : r.acc) + '</b>'; } },
          { h: 'Member', render: function (r) { return UI.avatar(Q.person(r.studentId), 26) + ' ' + UI.esc(Q.name(r.studentId)); } },
          { h: 'Placed', render: function (r) { return UI.esc(r.at); } },
          { h: 'Status', render: function (r) { return UI.badge(r.status); } },
          { h: 'Note', render: function (r) { return UI.esc(r.note || '—'); } },
          { h: 'Action', render: function (r) { return r.status !== 'Closed' ? '<span class="dl" data-rsv="' + r.id + '">' + (r.status === 'Waiting' ? 'Mark ready' : 'Close') + '</span>' : ''; } }
        ], DB.bookReservations)) :
        UI.card(state.tab === 'active' ? 'Active loans' : state.tab === 'overdue' ? 'Overdue follow-up list' : 'Return history', 'key',
          UI.table([
            { h: 'Member', render: function (x) { return UI.avatar(x.who, 26) + ' <b>' + UI.esc(x.who ? x.who.name : '—') + '</b><div style="font-size:10.5px;color:var(--text-2)">' + (x.mtype === 'student' && x.who ? x.who.reg + ' · ' + x.who.classId : 'staff') + '</div>'; } },
            { h: 'Book', render: function (x) { var b = Q.bookByAcc(x.r.acc); return '<b>' + UI.esc(b ? b.title : x.r.acc) + '</b><div style="font-size:10.5px;color:var(--text-2)">' + x.r.acc + ' · ' + (b ? UI.esc(b.author) : '') + '</div>'; } },
            { h: 'Out', render: function (x) { return UI.fmtDate(x.r.out); } },
            { h: 'Due', render: function (x) { return (x.r.status === 'Overdue' ? '<b style="color:var(--red-ink)">' : '') + UI.fmtDate(x.r.due) + (x.r.status === 'Overdue' ? '</b>' : ''); } },
            { h: 'Fine', render: function (x) { return x.r.fine ? '<b class="num" style="color:var(--red-ink)">' + UI.money(x.r.fine) + '</b>' : '—'; } },
            { h: 'Status', render: function (x) { return UI.badge(x.r.status); } },
            { h: 'Action', render: function (x) {
                if (x.r.returned) return '<span style="color:var(--text-3)">—</span>';
                var isStaff = x.mtype === 'staff';
                return '<span class="dl" data-ren="' + x.r.id + (isStaff ? '|staff' : '') + '">Renew</span> ' +
                  '<button class="btn sm ok" data-ret="' + x.r.id + (isStaff ? '|staff' : '') + '">' + UI.icon('check') + 'Return</button>';
              } }
          ], state.tab === 'returned' ? returned.map(function (r) { return { r: r, who: r.studentId ? Q.studentById(r.studentId) : Q.person(r.staffId), mtype: r.studentId ? 'student' : 'staff' }; }) : list))) +
        '<div class="fhint" style="margin-top:12px">Returning an overdue loan records the fine on the member\u2019s account automatically — collect or waive it from Fines &amp; Payments.</div>';
      var ch = view.querySelectorAll('.chip[data-f]');
      ch.forEach(function (c) { c.addEventListener('click', function () { state.tab = c.getAttribute('data-f'); render(); }); });
      view.querySelectorAll('[data-ret]').forEach(function (b) { b.addEventListener('click', function () {
        var v = b.getAttribute('data-ret').split('|');
        var fine = v[1] === 'staff' ? WF.returnStaffBook(v[0], me.id) : WF.returnBook(v[0], me.id);
        UI.toast(fine ? 'Returned — fine ₹' + fine : 'Returned clean', fine ? 'Fine recorded on the member account.' : 'No fine this time.', fine ? 'yellow' : 'green'); render();
      }); });
      view.querySelectorAll('[data-ren]').forEach(function (el) { el.addEventListener('click', function () {
        var v = el.getAttribute('data-ren').split('|');
        var r = (v[1] === 'staff' ? DB.staffLoans : DB.borrowRecords).filter(function (x) { return x.id === v[0]; })[0];
        if (r) { r.due = new Date(new Date(r.due).getTime() + 14 * 86400000).toISOString().slice(0, 10); WF.commit(me.id, 'Book renewed at desk', r.acc + ' → ' + r.due); }
        UI.toast('Renewed +14 days', 'Due date updated.', 'green'); render();
      }); });
      view.querySelectorAll('[data-rsv]').forEach(function (b) { b.addEventListener('click', function () {
        var r = DB.bookReservations.filter(function (x) { return x.id === b.getAttribute('data-rsv'); })[0];
        WF.markReservation(me.id, r.id, r.status === 'Waiting' ? 'Ready' : 'Closed'); render();
      }); });
      document.getElementById('newLoan').addEventListener('click', function () {
        var bookOpts = DB.libraryBooks.filter(function (b) { return b.available > 0; }).map(function (b) { return { v: b.acc, l: b.acc + ' · ' + b.title.slice(0, 34) }; });
        var memberOpts = DB.students.slice(0, 40).map(function (s) { return { v: 'ST|' + s.id, l: s.name + ' · ' + s.reg + ' · ' + s.classId }; })
          .concat(DB.staff.map(function (t) { return { v: 'STF|' + t.id, l: t.name + ' · ' + t.designation + ' · staff' }; }));
        UI.modal({ title: 'Issue a book', body:
          UI.field('il-book', 'Book (available copies)', UI.select('il-book', bookOpts, '', 'Select title'), true) +
          UI.field('il-member', 'Member', UI.select('il-member', memberOpts, '', 'Select member'), true) +
          UI.field('il-days', 'Loan period', UI.select('il-days', [{ v: '14', l: '14 days — student' }, { v: '21', l: '21 days — staff' }], '14'), true),
          actions: '<button class="btn pri" id="il-go">' + UI.icon('check') + 'Issue now</button>' });
        document.getElementById('il-go').addEventListener('click', function () {
          var acc = document.getElementById('il-book').value;
          var mv = document.getElementById('il-member').value;
          var days = +document.getElementById('il-days').value || 14;
          if (!acc || !mv) { UI.toast('Incomplete', 'Choose the book and the member.', 'red'); return; }
          if (mv.indexOf('ST|') === 0) WF.issueBook(acc, mv.slice(3), me.id, days);
          else WF.issueBookStaff(acc, mv.slice(4), me.id, days);
          UI.closeModal(); UI.toast('Book issued', 'Due in ' + days + ' days — member notified.', 'green'); render();
        });
      });
      var ex = document.getElementById('txExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'CIRCULATION REGISTER — ALL MEMBERS'],
          ['Generated', Q.today()],
          [],
          ['Acc No', 'Title', 'Member', 'Type', 'Out', 'Due', 'Returned', 'Fine (Rs)', 'Status']
        ];
        DB.borrowRecords.forEach(function (r) { var b = Q.bookByAcc(r.acc); rows.push([r.acc, b ? b.title : '', Q.name(r.studentId), 'Student', r.out, r.due, r.returned || '—', r.fine || 0, r.status]); });
        DB.staffLoans.forEach(function (r) { var b = Q.bookByAcc(r.acc); rows.push([r.acc, b ? b.title : '', Q.name(r.staffId), 'Staff', r.out, r.due, r.returned || '—', r.fine || 0, r.status]); });
        UI.downloadCSV('Library-CirculationRegister.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── examcell/attendance ......................... ── */
(function () {
MDTPAGE({
  role: 'examcell',
  folder: 'examcell',
  id: 'attendance',
  render: function (view, ctx) {

    var me = ctx.person;
    var state = { q: '' };
    function render() {
      var marked = Object.keys(DB.examAttendance).map(function (k) {
        var s = DB.examSessions.filter(function (x) { return x.id === k; })[0];
        var att = DB.examAttendance[k];
        var absent = Object.keys(att).filter(function (x) { return att[x] === 'A'; });
        return { s: s, absent: absent, total: Object.keys(att).length, pct: Math.round((Object.keys(att).length - absent.length) / Object.keys(att).length * 100) };
      }).filter(function (x) { return x.s; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Exam Attendance</h1><div class="sub">Session-wise presence, absentee follow-up and the malpractice register</div></div>' +
        '<div class="actions">' + UI.expBtn('eaExp', 'Export attendance') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'g', icon: 'checkc', value: marked.length, label: 'Sessions marked' }) +
        UI.stat({ tone: 'y', icon: 'users', value: marked.reduce(function (a, x) { return a + x.absent.length; }, 0), label: 'Absentees (all)' }) +
        UI.stat({ tone: 'b', icon: 'chart', value: (marked.length ? Math.round(marked.reduce(function (a, x) { return a + x.pct; }, 0) / marked.length) : 0) + '%', label: 'Average presence' }) +
        UI.stat({ tone: 'r', icon: 'alert', value: DB.malpractice.length, label: 'Malpractice cases' }) +
        '</div>' +
        UI.card('Session-wise attendance — completed exams', 'checkc', UI.table([
          { h: 'Session', render: function (x) { return '<b>' + UI.esc(x.s.courseId) + '</b> · ' + x.s.classId + '<div style="font-size:10.5px;color:var(--text-2)">' + UI.fmtDate(x.s.date) + ' · ' + UI.esc(x.s.session) + '</div>'; } },
          { h: 'Room', render: function (x) { return UI.esc(x.s.room); } },
          { h: 'Present', render: function (x) { return '<b class="num" style="color:var(--green-ink)">' + (x.total - x.absent.length) + '/' + x.total + '</b>'; } },
          { h: 'Presence', render: function (x) { return UI.bar(x.pct, x.pct < 85 ? 'r' : 'g'); } },
          { h: 'Absentees', render: function (x) { return x.absent.length ? x.absent.map(function (id) { return UI.esc(Q.name(id).split(' ')[0]); }).join(', ') : '—'; } },
          { h: 'Action', render: function (x) { return '<span class="dl" data-view="' + x.s.id + '">Roster</span>'; } }
        ], marked)) +
        '<div class="split-eq">' +
        UI.card('Malpractice register', 'alert', UI.table([
          { h: 'Student', render: function (m) { var st = Q.studentById(m.studentId); return st ? UI.avatar(st, 26) + ' ' + UI.esc(st.name) : m.studentId; } },
          { h: 'Session', render: function (m) { return '<span class="mono" style="font-size:11px">' + m.session + '</span>'; } },
          { h: 'Nature', render: function (m) { return UI.esc(m.nature); } },
          { h: 'Action taken', render: function (m) { return UI.esc(m.action); } },
          { h: 'Date', render: function (m) { return UI.fmtDate(m.at); } }
        ], DB.malpractice)) +
        UI.card('Record a malpractice case', 'edit',
          UI.field('mp-s', 'Session', UI.select('mp-s', DB.examSessions.filter(function (s) { return s.date < Q.today(); }).map(function (s) { return { v: s.id, l: s.courseId + ' · ' + s.classId + ' · ' + s.date }; }), '', 'Select session'), true) +
          '<div class="fgrid">' +
          UI.field('mp-st', 'Student', UI.select('mp-st', Q.studentsOf('CSE-A').concat(Q.studentsOf('ECE-B')).slice(0, 30).map(function (s) { return { v: s.id, l: s.name + ' · ' + s.reg }; }), '', 'Select student'), true) +
          UI.field('mp-n', 'Nature', '<input class="input" id="mp-n" placeholder="e.g. unauthorised material">', true) + '</div>' +
          UI.field('mp-a', 'Action', '<input class="input" id="mp-a" placeholder="e.g. answer sheet cancelled · parents informed">', true) +
          '<div class="frow" style="justify-content:flex-start"><button class="btn pri" id="mp-go">' + UI.icon('alert') + 'Record case</button></div>') +
        '</div>';
      view.querySelectorAll('[data-view]').forEach(function (el) { el.addEventListener('click', function () {
        var sid = el.getAttribute('data-view');
        var sess = DB.examSessions.filter(function (x) { return x.id === sid; })[0];
        var att = DB.examAttendance[sid] || {};
        UI.modal({ title: 'Roster — ' + sess.courseId + ' · ' + sess.classId, body: UI.table([
          { h: 'Student', render: function (st) { return UI.esc(st.name) + '<div style="font-size:10px;color:var(--text-2)">' + st.reg + '</div>'; } },
          { h: 'Status', render: function (st) { return att[st.id] === 'A' ? UI.badge('Absent') : UI.badge('Present'); } }
        ], Q.studentsOf(sess.classId)), actions: '<button class="btn pri" onclick="UI.closeModal()">Close</button>' });
      }); });
      document.getElementById('mp-go').addEventListener('click', function () {
        var sid = document.getElementById('mp-s').value, st = document.getElementById('mp-st').value;
        var n = document.getElementById('mp-n').value, a = document.getElementById('mp-a').value;
        if (!sid || !st || !n) { UI.toast('Incomplete', 'Session, student and nature are required.', 'red'); return; }
        WF.logMalpractice(me.id, sid, st, n, a || 'Under committee review');
        UI.toast('Case recorded', 'Principal and student notified.', 'red'); render();
      });
      var ex = document.getElementById('eaExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'INTERNAL EXAM ATTENDANCE REGISTER'],
          ['Generated', Q.today()],
          [],
          ['Exam', 'Date', 'Course', 'Class', 'Room', 'Present', 'Absent', 'Presence %']
        ];
        marked.forEach(function (x) { rows.push([DB.exams.filter(function (e) { return e.id === x.s.examId; })[0].name, x.s.date, x.s.courseId, x.s.classId, x.s.room, x.total - x.absent.length, x.absent.length, x.pct + '%']); });
        UI.downloadCSV('ExamCell-Attendance.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── examcell/dashboard .......................... ── */
(function () {
MDTPAGE({
  role: 'examcell',
  folder: 'examcell',
  id: 'dashboard',
  render: function (view, ctx) {

    var me = ctx.person;
    var upcoming = DB.exams.filter(function (e) { return e.from >= Q.today(); });
    var sessions = DB.examSessions.filter(function (s) { return s.date >= Q.today(); }).length;
    var vb = DB.valuationBatches;
    var valDone = vb.reduce(function (a, x) { return a + x.evaluated; }, 0);
    var valTotal = vb.reduce(function (a, x) { return a + x.scripts; }, 0);
    var revalPending = DB.revalRequests.filter(function (r) { return r.status === 'Applied' || r.status === 'Under Review'; }).length;
    var absTotal = 0, absCount = 0;
    Object.keys(DB.examAttendance).forEach(function (k) { Object.keys(DB.examAttendance[k]).forEach(function (sid) { absCount++; if (DB.examAttendance[k][sid] === 'A') absTotal++; }); });
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>' + UI.esc(me.name) + '</h1><div class="sub">' + UI.esc(me.designation) + '</div></div></div>' +
      '<div class="statrow">' +
      UI.stat({ tone: 'b', icon: 'calendar', value: upcoming.length, label: 'Upcoming exams', sub: 'Model 8 Sep · Internal-II 15 Sep', href: 'exams.html' }) +
      UI.stat({ tone: 'g', icon: 'grid', value: sessions, label: 'Sessions scheduled', href: 'exams.html' }) +
      UI.stat({ tone: 'y', icon: 'chart', value: Math.round(valDone / valTotal * 100) + '%', label: 'Valuation progress', sub: valDone + ' of ' + valTotal + ' scripts', href: 'valuation.html' }) +
      UI.stat({ tone: 'r', icon: 'target', value: revalPending, label: 'Revaluation pending', href: 'revaluation.html' }) +
      '</div>' +
      '<div class="split">' +
      '<div>' +
      UI.card('Examination calendar', 'calendar', UI.table([
          { h: 'Exam', render: function (e) { return '<b>' + UI.esc(e.name) + '</b><div style="font-size:10.5px;color:var(--text-2)">sem ' + e.sem + ' · ' + e.classes.length + ' classes</div>'; } },
          { h: 'Window', render: function (e) { return UI.fmtDate(e.from) + ' → ' + UI.fmtDate(e.to); } },
          { h: 'Status', render: function (e) { return UI.badge(e.status); } },
          { h: 'Hall tickets', render: function (e) { return e.status === 'Hall Tickets Issued' ? '<span class="tag g">issued</span>' : '—'; } }
        ], DB.exams)) +
      UI.card('Valuation batches — Internal I', 'chart', UI.table([
          { h: 'Course', render: function (x) { return '<span class="mono" style="color:var(--blue-ink)">' + x.courseId + '</span> · ' + UI.esc(Q.name(x.teacherId)); } },
          { h: 'Progress', render: function (x) { return UI.bar(Math.round(x.evaluated / x.scripts * 100), x.status === 'Completed' ? 'g' : 'y'); } },
          { h: 'Scripts', render: function (x) { return x.evaluated + '/' + x.scripts; } },
          { h: 'Remuneration', render: function (x) { var ok = x.remuneration.bank === 'Verified' && x.remuneration.pan === 'Verified' && x.remuneration.signature === 'Verified'; return ok ? '<span class="tag g">verified</span>' : '<span class="tag y">' + [x.remuneration.bank, x.remuneration.pan, x.remuneration.signature].filter(function (v) { return v === 'Pending'; }).length + ' pending</span>'; } }
        ], DB.valuationBatches)) +
      '</div><div>' +
      UI.card('Attendance health — completed exams', 'checkc',
        UI.donut(Math.round((absCount - absTotal) / (absCount || 1) * 100), 'green', 116, 'present') +
        '<div class="mt8">' + UI.kv([['Sessions marked', absCount ? Object.keys(DB.examAttendance).length : 0], ['Absentees recorded', absTotal], ['Malpractice cases', DB.malpractice.length]]) + '</div>', null, { href: 'attendance.html', label: 'Exam attendance' }) +
      UI.card('Quick actions', 'grid', '<div class="quickgrid">' +
        '<a class="bigbtn-tile" href="exams.html">' + UI.icon('calendar') + '<b>Schedule</b></a>' +
        '<a class="bigbtn-tile" href="valuation.html">' + UI.icon('chart') + '<b>Valuation</b></a>' +
        '<a class="bigbtn-tile" href="results.html">' + UI.icon('cap') + '<b>Results</b></a>' +
        '<a class="bigbtn-tile" href="revaluation.html">' + UI.icon('target') + '<b>Revaluation</b></a>' +
        '</div>') +
      UI.card('Circulars for the exam cell', 'send', DB.circulars.filter(function (c) { return c.audience === 'All' || c.audience === 'Staff'; }).slice(0, 3).map(function (c) {
        return '<div class="lrow" style="cursor:default"><span class="ic" style="color:var(--g-blue)">' + UI.icon('file') + '</span><span class="lmain"><b>' + UI.esc(c.title) + '</b><span>' + UI.esc(c.body.slice(0, 80)) + '…</span></span><span class="ltime">' + UI.fmtDate(c.at) + '</span></div>';
      }).join('')) +
      '</div></div>';

  }
});
})();

/* ── examcell/exams .............................. ── */
(function () {
MDTPAGE({
  role: 'examcell',
  folder: 'examcell',
  id: 'exams',
  render: function (view, ctx) {

    var me = ctx.person;
    var state = { ex: 'EX2' };
    function render() {
      var ex = DB.exams.filter(function (e) { return e.id === state.ex; })[0] || DB.exams[0];
      var sessions = DB.examSessions.filter(function (s) { return s.examId === ex.id; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Exam Schedule &amp; Seating</h1><div class="sub">Frame exams, allot rooms and invigilators, and publish the timetable to every student page</div></div>' +
        '<div class="actions"><button class="btn pri" id="newEx">' + UI.icon('plus') + 'Schedule an exam</button>' + UI.expBtn('exExp', 'Export schedule') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'calendar', value: DB.exams.length, label: 'Exams on record' }) +
        UI.stat({ tone: 'g', icon: 'grid', value: DB.examSessions.length, label: 'Sessions framed' }) +
        UI.stat({ tone: 'y', icon: 'door', value: DB.examSessions.length, label: 'Invigilation duties', sub: 'staff-wise below' }) +
        UI.stat({ tone: 'r', icon: 'users', value: 144, label: 'Registered candidates' }) +
        '</div>' +
        '<div class="rowflex mb16">' + UI.chiprow(DB.exams.map(function (e) { return { v: e.id, l: e.name.split('—')[0].trim(), c: DB.examSessions.filter(function (s) { return s.examId === e.id; }).length || null }; }), state.ex) + '</div>' +
        UI.card((ex ? ex.name : 'Exam') + ' — ' + (ex ? UI.fmtDate(ex.from) + ' → ' + UI.fmtDate(ex.to) : ''), 'calendar', UI.table([
          { h: 'Date', render: function (s) { return UI.fmtDate(s.date); } },
          { h: 'Course', render: function (s) { return '<span class="mono" style="color:var(--blue-ink)">' + s.courseId + '</span> · ' + UI.esc(Q.courseById(s.courseId) ? Q.courseById(s.courseId).title.slice(0, 26) : ''); } },
          { h: 'Class', render: function (s) { return s.classId; } },
          { h: 'Session', render: function (s) { return UI.esc(s.session); } },
          { h: 'Room', render: function (s) { return UI.esc(s.room); } },
          { h: 'Invigilator', render: function (s) { return UI.avatar(Q.person(s.invigilator), 26) + ' ' + UI.esc(Q.name(s.invigilator)); } },
          { h: 'Strength', render: function (s) { return '<b class="num">' + s.strength + '</b>'; } },
          { h: 'Attendance', render: function (s) { return DB.examAttendance[s.id] ? '<span class="tag g">marked · ' + Object.keys(DB.examAttendance[s.id]).filter(function (k) { return DB.examAttendance[s.id][k] === 'A'; }).length + ' absent</span>' : (s.date < Q.today() ? '<span class="dl" data-mk="' + s.id + '">Mark now</span>' : '<span class="tag n">due ' + UI.fmtDate(s.date) + '</span>'); } }
        ], sessions, { empty: 'Announced only — sessions are framed after the timetable is finalised' })) +
        '<div class="split-eq mt16">' +
        UI.card('Invigilation duty load', 'users', UI.barsChart((function () {
          var load = {};
          DB.examSessions.forEach(function (s) { load[s.invigilator] = (load[s.invigilator] || 0) + 1; });
          return Object.keys(load).map(function (t) { return { l: Q.name(t).split(' ')[0], v: load[t] * 14, n: load[t] + ' duties' }; });
        })())) +
        UI.card('Hall ticket status', 'idcard', UI.table([
          { h: 'Exam', render: function (e) { return UI.esc(e.name); } },
          { h: 'Status', render: function (e) { return UI.badge(e.status); } },
          { h: 'Fee gate', render: function (e) { return e.status === 'Hall Tickets Issued' ? '<span class="tag r">defaulters held</span>' : '—'; } }
        ], DB.exams.filter(function (e) { return e.status === 'Hall Tickets Issued' || e.published; }))) +
        '</div>';
      view.querySelectorAll('.chip[data-f]').forEach(function (c) { c.addEventListener('click', function () { state.ex = c.getAttribute('data-f'); render(); }); });
      view.querySelectorAll('[data-mk]').forEach(function (el) { el.addEventListener('click', function () {
        var sid = el.getAttribute('data-mk');
        var sess = DB.examSessions.filter(function (x) { return x.id === sid; })[0];
        var studs = Q.studentsOf(sess.classId);
        var marks = {};
        studs.forEach(function (st) { marks[st.id] = 'P'; });
        var body = '<div class="fhint" style="margin-bottom:10px">' + sess.courseId + ' · ' + sess.classId + ' · ' + UI.fmtDate(sess.date) + ' — tap to toggle A/P.</div><div class="grid g2" style="gap:6px">' +
          studs.map(function (st) { return '<label class="lrow" style="cursor:pointer"><input type="checkbox" data-mkst="' + st.id + '" checked> <span class="lmain"><b>' + UI.esc(st.name) + '</b><span>' + st.reg + '</span></span></label>'; }).join('') + '</div>';
        UI.modal({ title: 'Mark exam attendance', body: body, actions: '<button class="btn pri" id="mk-go">' + UI.icon('check') + 'Save attendance</button>' });
        document.getElementById('mk-go').addEventListener('click', function () {
          document.querySelectorAll('[data-mkst]').forEach(function (cb) { marks[cb.getAttribute('data-mkst')] = cb.checked ? 'P' : 'A'; });
          WF.markExamAttendance(me.id, sid, marks);
          UI.closeModal(); UI.toast('Attendance saved', 'Absentees recorded for follow-up.', 'green'); render();
        });
      }); });
      document.getElementById('newEx').addEventListener('click', function () {
        UI.modal({ title: 'Schedule an exam', body:
          UI.field('ne-n', 'Exam name', '<input class="input" id="ne-n" placeholder="e.g. Internal Assessment — III">', true) +
          '<div class="fgrid">' +
          UI.field('ne-c', 'Class', UI.select('ne-c', DB.classes.map(function (c) { return { v: c.id, l: c.id + ' · sem ' + c.sem }; })), true) +
          UI.field('ne-f', 'From', '<input class="input" id="ne-f" type="date" min="' + Q.today() + '">', true) +
          UI.field('ne-t', 'To', '<input class="input" id="ne-t" type="date" min="' + Q.today() + '">', true) + '</div>',
          actions: '<button class="btn pri" id="ne-go">' + UI.icon('check') + 'Publish schedule</button>' });
        document.getElementById('ne-go').addEventListener('click', function () {
          var n = document.getElementById('ne-n').value;
          if (!n || !document.getElementById('ne-f').value) { UI.toast('Incomplete', 'Name and dates are required.', 'red'); return; }
          WF.createExam(me.id, { name: n, classId: document.getElementById('ne-c').value, from: document.getElementById('ne-f').value, to: document.getElementById('ne-t').value || document.getElementById('ne-f').value });
          UI.closeModal(); UI.toast('Exam scheduled', 'Calendar and student pages notified.', 'green'); render();
        });
      });
      var exx = document.getElementById('exExp');
      if (exx) exx.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'EXAMINATION SCHEDULE'],
          ['Generated', Q.today()],
          [],
          ['Exam', 'Date', 'Session', 'Course', 'Class', 'Room', 'Invigilator', 'Strength']
        ];
        DB.examSessions.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; }).forEach(function (s) {
          rows.push([DB.exams.filter(function (e) { return e.id === s.examId; })[0].name, s.date, s.session, s.courseId, s.classId, s.room, Q.name(s.invigilator), s.strength]);
        });
        UI.downloadCSV('ExamCell-Schedule.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── examcell/profile ............................ ── */
(function () {
MDTPAGE({
  role: 'examcell',
  folder: 'examcell',
  id: 'profile',
  render: function (view, ctx) {

    var me = ctx.person;
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>My Profile</h1><div class="sub">Controller of Examinations · examination cell</div></div></div>' +
      '<div class="split-eq">' +
      '<div>' +
        '<div class="card glow glow-y accent-y">' + UI.photoBox(me, 'Your photo appears on hall tickets, results notices and exam-cell correspondence.') + '</div>' +
        UI.card('Office', 'cap', UI.kv([
          ['Employee code', '<b class="mono">' + me.id + '</b>'],
          ['Designation', UI.esc(me.designation)],
          ['Experience', me.exp + ' years'],
          ['Expertise', UI.esc(me.expertise)]
        ])) +
        UI.card('Scope of this portal', 'grid', '<ul style="margin:4px 0 0 16px;padding:0;font-size:12.5px;color:var(--text-2);line-height:1.9">' +
          '<li><b>Exam scheduling</b> — calendar, sessions, rooms and invigilation duties.</li>' +
          '<li><b>Conduct</b> — exam attendance rosters and the malpractice register.</li>' +
          '<li><b>Valuation</b> — ESE-style batch progress with remuneration verification.</li>' +
          '<li><b>Results</b> — consolidated sheets, publication control, revaluation and transcripts.</li>' +
        '</ul>') +
      '</div>' +
      '<div>' +
        UI.card('Contact', 'idcard', UI.kv([
          ['Email', UI.esc(me.email)],
          ['Phone', UI.esc(me.phone)],
          ['Campus', DB.settings.institute + ', ' + DB.settings.city]
        ])) +
        UI.card('Connected approvals', 'shield', '<ul style="margin:4px 0 0 16px;padding:0;font-size:12.5px;color:var(--text-2);line-height:1.9">' +
          '<li>Hall tickets publish from the <b>office desk</b> with the fee gate enforced.</li>' +
          '<li>Faculty <b>marks entry</b> feeds the results engine directly.</li>' +
          '<li>Malpractice cases reach the <b>principal</b> instantly for committee action.</li>' +
          '<li>Exam stationery indents flow to <b>accounts</b> as expense vouchers.</li>' +
        '</ul>') +
        UI.card('Account', 'shield', UI.kv([
          ['Role', '<b>' + UI.esc(ctx.role) + '</b> — Examination Cell'],
          ['Access', 'Exams, valuation, results, revaluation, transcripts'],
          ['Sign-in', UI.esc(ctx.user.lastLogin)]
        ])) +
      '</div></div>';

  }
});
})();

/* ── examcell/results ............................ ── */
(function () {
MDTPAGE({
  role: 'examcell',
  folder: 'examcell',
  id: 'results',
  render: function (view, ctx) {

    var me = ctx.person;
    var state = { cls: 'CSE-A' };
    function render() {
      var st = Q.studentsOf(state.cls);
      var rows = st.map(function (s) {
        var m = Q.marksOf(s.id);
        var total = 0, n = 0, pass = true;
        Object.keys(m).forEach(function (c) { total += (m[c].I1 || 0) + (m[c].Q1 || 0); n++; if ((m[c].I1 || 0) < 8) pass = false; });
        return { s: s, total: total, avg: n ? (total / n).toFixed(1) : 0, pass: pass, rank: Q.rankOf(s.id).rank };
      }).sort(function (a, b) { return b.total - a.total; });
      var passPct = Math.round(rows.filter(function (r) { return r.pass; }).length / (rows.length || 1) * 100);
      var ex1 = DB.exams.filter(function (e) { return e.id === 'EX1'; })[0];
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Results &amp; Publishing</h1><div class="sub">Internal Assessment I — consolidated class results, pass analysis and publication control</div></div>' +
        '<div class="actions"><button class="btn pri" id="pubRes">' + UI.icon('send') + (ex1 && ex1.published ? 'Re-notify class' : 'Publish results') + '</button>' + UI.expBtn('rsExp', 'Export class results') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'cap', value: state.cls, label: 'Class under review', sub: rows.length + ' students' }) +
        UI.stat({ tone: 'g', icon: 'checkc', value: passPct + '%', label: 'Pass percentage', sub: '(internal threshold 8/20)' }) +
        UI.stat({ tone: 'y', icon: 'chart', value: (rows.length ? (rows.reduce(function (a, r) { return a + r.total; }, 0) / rows.length / 1).toFixed(0) : 0), label: 'Class average total' }) +
        UI.stat({ tone: 'r', icon: 'alert', value: rows.filter(function (r) { return !r.pass; }).length, label: 'Below threshold', sub: 'mentoring follow-up' }) +
        '</div>' +
        '<div class="rowflex mb16">' + UI.chiprow(DB.classes.map(function (c) { return { v: c.id, l: c.id }; }), state.cls) + '</div>' +
        UI.card('Consolidated result sheet — ' + state.cls + ' (Internal I + Quiz I)', 'cap', UI.table([
          { h: 'Rank', render: function (r) { return r.rank <= 3 ? '<span class="pill y">' + r.rank + '</span>' : '<b class="num">' + r.rank + '</b>'; } },
          { h: 'Student', render: function (r) { return UI.avatar(r.s, 26) + ' <b>' + UI.esc(r.s.name) + '</b><div style="font-size:10px;color:var(--text-2)">' + r.s.reg + '</div>'; } },
          { h: 'Total', render: function (r) { return '<b class="num">' + r.total + '</b>'; } },
          { h: 'Average', render: function (r) { return r.avg; } },
          { h: 'CGPA', render: function (r) { return r.s.cgpa; } },
          { h: 'Outcome', render: function (r) { return r.pass ? UI.badge('Pass') : UI.badge('Condone'); } },
          { h: 'Action', render: function (r) { return '<span class="dl" data-psheet="' + r.s.id + '">Marks sheet</span>'; } }
        ], rows)) +
        '<div class="fhint">Publication pushes a notification to every student of the class; the Exams &amp; Scores page unlocks their marks view instantly.</div>';
      view.querySelectorAll('.chip[data-f]').forEach(function (c) { c.addEventListener('click', function () { state.cls = c.getAttribute('data-f'); render(); }); });
      view.querySelectorAll('[data-psheet]').forEach(function (el) { el.addEventListener('click', function () {
        var s = Q.studentById(el.getAttribute('data-psheet'));
        var m = Q.marksOf(s.id);
        var body = UI.table([
          { h: 'Course', render: function (c) { return '<span class="mono">' + c + '</span>'; } },
          { h: 'Internal I (20)', render: function (c) { return m[c].I1 + (m[c].I1 < 8 ? ' ⚠' : ''); } },
          { h: 'Quiz I (10)', render: function (c) { return m[c].Q1; } },
          { h: 'Total', render: function (c) { return '<b>' + ((m[c].I1 || 0) + (m[c].Q1 || 0)) + '</b>'; } }
        ], Object.keys(m));
        UI.modal({ title: 'Marks sheet — ' + s.name + ' (' + s.reg + ')', body: body, actions: '<button class="btn pri" onclick="UI.closeModal()">Close</button>' });
      }); });
      document.getElementById('pubRes').addEventListener('click', function () {
        WF.publishResults(me.id, state.cls);
        UI.toast('Results published', 'Class ' + state.cls + ' notified — marks visible on student pages.', 'green'); render();
      });
      var ex = document.getElementById('rsExp');
      if (ex) ex.addEventListener('click', function () {
        var rows2 = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'CONSOLIDATED RESULTS — INTERNAL ASSESSMENT I'],
          ['Class', state.cls],
          ['Generated', Q.today()],
          [],
          ['Rank', 'Register No', 'Student', 'Total', 'Average', 'CGPA', 'Outcome']
        ];
        rows.forEach(function (r) { rows2.push([r.rank, r.s.reg, r.s.name, r.total, r.avg, r.s.cgpa, r.pass ? 'Pass' : 'Condone']); });
        UI.downloadCSV('ExamCell-Results-' + state.cls + '.csv', rows2);
      });
    }
    render();

  }
});
})();

/* ── examcell/revaluation ........................ ── */
(function () {
MDTPAGE({
  role: 'examcell',
  folder: 'examcell',
  id: 'revaluation',
  render: function (view, ctx) {

    var me = ctx.person;
    function render() {
      var pending = DB.revalRequests.filter(function (r) { return r.status === 'Applied' || r.status === 'Under Review'; });
      var closed = DB.revalRequests.filter(function (r) { return r.status === 'Completed' || r.status === 'Rejected'; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Revaluation &amp; Recount</h1><div class="sub">Student requests · fee ₹500 (revaluation) / ₹100 (recount) · marks update the student record on completion</div></div>' +
        '<div class="actions">' + UI.expBtn('rvExp', 'Export requests') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'y', icon: 'door', value: pending.length, label: 'Pending requests' }) +
        UI.stat({ tone: 'g', icon: 'checkc', value: closed.length, label: 'Closed requests', sub: DB.revalRequests.filter(function (r) { return r.status === 'Completed'; }).length + ' completed' }) +
        UI.stat({ tone: 'b', icon: 'rupee', value: UI.money(DB.revalRequests.reduce(function (a, r) { return a + r.fee; }, 0)), label: 'Fees collected (register)' }) +
        UI.stat({ tone: 'r', icon: 'alert', value: DB.revalRequests.filter(function (r) { return r.status === 'Rejected'; }).length, label: 'Rejected (tolerance)' }) +
        '</div>' +
        '<div class="grid g2">' +
        (pending.length ? pending.map(function (r) {
          var s = Q.studentById(r.studentId);
          return '<div class="card glow glow-y accent-y"><div class="spread"><div style="display:flex;gap:10px;align-items:center">' + UI.avatar(s, 38) +
            '<span><b>' + UI.esc(s.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + s.reg + ' · ' + s.classId + '</div></span></div>' + UI.badge(r.status) + '</div>' +
            '<div class="mt8">' + UI.kv([['Course', '<span class="mono" style="color:var(--blue-ink)">' + r.courseId + '</span>'], ['Type', r.type], ['Fee', UI.money(r.fee)], ['Current mark', r.oldMark + ' / 20']]) + '</div>' +
            '<div class="frow" style="justify-content:flex-start">' +
            '<button class="btn ok" data-rvok="' + r.id + '">' + UI.icon('check') + 'Process</button>' +
            '<button class="btn ghost-r" data-rvno="' + r.id + '">' + UI.icon('x') + 'Reject (no change)</button></div></div>';
        }).join('') : '<div class="card">' + UI.empty('No revaluation requests pending', 'checkc') + '</div>') +
        '</div>' +
        UI.card('Request history', 'list', UI.table([
          { h: 'Student', render: function (r) { var s = Q.studentById(r.studentId); return s ? UI.esc(s.name) + '<div style="font-size:10px;color:var(--text-2)">' + s.reg + '</div>' : r.studentId; } },
          { h: 'Course', render: function (r) { return '<span class="mono">' + r.courseId + '</span>'; } },
          { h: 'Type', render: function (r) { return r.type; } },
          { h: 'Fee', render: function (r) { return UI.money(r.fee); } },
          { h: 'Applied', render: function (r) { return UI.fmtDate(r.appliedAt); } },
          { h: 'Mark change', render: function (r) { return r.newMark != null ? '<b>' + r.oldMark + ' → ' + r.newMark + '</b>' : '—'; } },
          { h: 'Status', render: function (r) { return UI.badge(r.status); } },
          { h: 'Remark', render: function (r) { return UI.esc(r.remark || '—'); } }
        ], DB.revalRequests));
      view.querySelectorAll('[data-rvok]').forEach(function (b) { b.addEventListener('click', function () {
        var r = DB.revalRequests.filter(function (x) { return x.id === b.getAttribute('data-rvok'); })[0];
        UI.modal({ title: 'Process — ' + r.type, body:
          UI.field('rv-nm', 'Revised mark (after review)', '<input class="input" id="rv-nm" type="number" min="0" max="20" value="' + r.oldMark + '">', true) +
          UI.field('rv-rem', 'Remark', '<input class="input" id="rv-rem" placeholder="e.g. step marks awarded for unit-3 derivation">', true) +
          UI.hint('Saving updates the student\u2019s internal mark record and notifies them instantly.', '', 'info'),
          actions: '<button class="btn pri" id="rv-go">' + UI.icon('check') + 'Complete revaluation</button>' });
        document.getElementById('rv-go').addEventListener('click', function () {
          WF.decideRevaluation(me.id, r.id, true, document.getElementById('rv-nm').value, document.getElementById('rv-rem').value);
          UI.closeModal(); UI.toast('Revaluation completed', 'Student record updated and notified.', 'green'); render();
        });
      }); });
      view.querySelectorAll('[data-rvno]').forEach(function (b) { b.addEventListener('click', function () {
        WF.decideRevaluation(me.id, b.getAttribute('data-rvno'), false, null, 'Marks within tolerance — no change');
        UI.toast('Request rejected', 'Student notified with the tolerance note.', 'red'); render();
      }); });
      var ex = document.getElementById('rvExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'REVALUATION REGISTER'],
          ['Generated', Q.today()],
          [],
          ['Student', 'Register No', 'Course', 'Type', 'Fee (Rs)', 'Applied', 'Old Mark', 'New Mark', 'Status', 'Remark']
        ];
        DB.revalRequests.forEach(function (r) { var s = Q.studentById(r.studentId); rows.push([s ? s.name : r.studentId, s ? s.reg : '', r.courseId, r.type, r.fee, r.appliedAt, r.oldMark, r.newMark != null ? r.newMark : '—', r.status, r.remark || '']); });
        UI.downloadCSV('ExamCell-Revaluation.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── examcell/transcripts ........................ ── */
(function () {
MDTPAGE({
  role: 'examcell',
  folder: 'examcell',
  id: 'transcripts',
  render: function (view, ctx) {

    var me = ctx.person;
    function render() {
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Transcripts &amp; Consolidated Marksheets</h1><div class="sub">Semester-wise consolidated statements generated from the live marks record — issued with the exam-cell counter stamp</div></div>' +
        '<div class="actions"><button class="btn pri" id="newTr">' + UI.icon('plus') + 'Issue to a student</button>' + UI.expBtn('trExp', 'Export issue log') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'file', value: DB.transcripts.length, label: 'Statements issued' }) +
        UI.stat({ tone: 'g', icon: 'cap', value: 144, label: 'Students on record', sub: 'sem I–V history available' }) +
        UI.stat({ tone: 'y', icon: 'chart', value: 2, label: 'Statement types', sub: 'consolidated · bonafide with CGPA' }) +
        UI.stat({ tone: 'r', icon: 'clock', value: '24h', label: 'Typical turnaround', sub: 'from request to counter' }) +
        '</div>' +
        '<div class="split-eq">' +
        '<div>' + UI.card('Issue log', 'list', UI.table([
          { h: 'Student', render: function (t) { var s = Q.studentById(t.studentId); return s ? UI.avatar(s, 26) + ' ' + UI.esc(s.name) : t.studentId; } },
          { h: 'Statement', render: function (t) { return UI.esc(t.type); } },
          { h: 'Issued', render: function (t) { return UI.fmtDate(t.issuedAt); } },
          { h: 'Purpose', render: function (t) { return UI.esc(t.purpose); } }
        ], DB.transcripts)) + '</div>' +
        '<div>' + UI.card('Generate — any student, any time', 'cap',
          UI.field('tr-s', 'Student', UI.select('tr-s', DB.students.slice(0, 48).map(function (s) { return { v: s.id, l: s.name + ' · ' + s.reg + ' · ' + s.classId }; }), '', 'Select student'), true) +
          UI.field('tr-t', 'Statement type', UI.select('tr-t', ['Consolidated Marksheet (Sem I–IV)', 'Bonafide with CGPA', 'Current Semester Statement']), true) +
          '<div class="frow" style="justify-content:flex-start"><button class="btn pri" id="tr-go">' + UI.icon('check') + 'Issue statement</button></div>' +
          UI.hint('Consolidated statements carry semester CGPA history with the exam-cell stamp; bonafide letters carry the current CGPA.', '', 'info')) +
        UI.card('Semester record preview', 'chart', UI.hint('Select a student above and issue — the statement is generated from the live marks and CGPA history in one click.', '', 'info')) +
        '</div></div>';
      document.getElementById('tr-go').addEventListener('click', function () {
        var sid = document.getElementById('tr-s').value;
        if (!sid) { UI.toast('Select a student', '', 'red'); return; }
        var t = document.getElementById('tr-t').value;
        WF.issueTranscript(me.id, sid, t);
        UI.toast('Statement issued', 'Student notified to collect from the counter.', 'green'); render();
      });
      document.getElementById('newTr').addEventListener('click', function () {
        UI.modal({ title: 'Issue a statement', body:
          UI.field('nt-s', 'Student', UI.select('nt-s', DB.students.slice(0, 48).map(function (s) { return { v: s.id, l: s.name + ' · ' + s.reg + ' · ' + s.classId }; }), '', 'Select student'), true) +
          UI.field('nt-t', 'Statement', UI.select('nt-t', ['Consolidated Marksheet (Sem I–IV)', 'Bonafide with CGPA']), true),
          actions: '<button class="btn pri" id="nt-go">' + UI.icon('check') + 'Issue</button>' });
        document.getElementById('nt-go').addEventListener('click', function () {
          WF.issueTranscript(me.id, document.getElementById('nt-s').value, document.getElementById('nt-t').value);
          UI.closeModal(); UI.toast('Statement issued', '', 'green'); render();
        });
      });
      var ex = document.getElementById('trExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'TRANSCRIPT / MARKSHEET ISSUE LOG'],
          ['Generated', Q.today()],
          [],
          ['Student', 'Register No', 'Statement', 'Pages', 'Issued', 'Purpose', 'By']
        ];
        DB.transcripts.forEach(function (t) { var s = Q.studentById(t.studentId); rows.push([s ? s.name : t.studentId, s ? s.reg : '', t.type, t.pages, t.issuedAt, t.purpose, Q.name(t.by)]); });
        UI.downloadCSV('ExamCell-Transcripts.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── examcell/valuation .......................... ── */
(function () {
MDTPAGE({
  role: 'examcell',
  folder: 'examcell',
  id: 'valuation',
  render: function (view, ctx) {

    var me = ctx.person;
    function render() {
      var vb = DB.valuationBatches;
      var done = vb.reduce(function (a, x) { return a + x.evaluated; }, 0);
      var total = vb.reduce(function (a, x) { return a + x.scripts; }, 0);
      var remuPending = vb.filter(function (x) { return x.remuneration.bank !== 'Verified' || x.remuneration.pan !== 'Verified' || x.remuneration.signature !== 'Verified'; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Online Valuation Workspace</h1><div class="sub">ESE-style script batches, progress tracking and remuneration verification (bank · PAN · signature)</div></div>' +
        '<div class="actions">' + UI.expBtn('vlExp', 'Export valuation status') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'chart', value: vb.length, label: 'Valuation batches', sub: 'Internal Assessment I' }) +
        UI.stat({ tone: 'g', icon: 'checkc', value: done + '/' + total, label: 'Scripts evaluated', sub: Math.round(done / total * 100) + '% complete' }) +
        UI.stat({ tone: 'y', icon: 'rupee', value: remuPending.length, label: 'Remuneration pending verification', href: '#', sub: 'bank / PAN / signature' }) +
        UI.stat({ tone: 'r', icon: 'users', value: vb.filter(function (x) { return x.status !== 'Completed'; }).length, label: 'Evaluators still working' }) +
        '</div>' +
        '<div class="split-eq">' +
        '<div>' +
        UI.card('Overall progress', 'chart', UI.donut(Math.round(done / total * 100), 'blue', 150, 'evaluated')) +
        UI.card('Remuneration verification queue', 'shield', UI.table([
          { h: 'Course', render: function (x) { return '<span class="mono" style="color:var(--blue-ink)">' + x.courseId + '</span>'; } },
          { h: 'Bank', render: function (x) { return UI.pbadge(x.remuneration.bank); } },
          { h: 'PAN', render: function (x) { return UI.pbadge(x.remuneration.pan); } },
          { h: 'Signature', render: function (x) { return UI.pbadge(x.remuneration.signature); } },
          { h: 'Pay', render: function (x) { return UI.esc(x.remuneration.paid); } },
          { h: 'Action', render: function (x) { return (x.remuneration.paid.indexOf('Paid') === 0 ? '' :
            '<span class="dl" data-vf="bank|' + x.id + '">Bank</span> <span class="dl" data-vf="pan|' + x.id + '">PAN</span> <span class="dl" data-vf="signature|' + x.id + '">Sign</span>' +
            (x.status === 'Completed' && x.remuneration.bank === 'Verified' && x.remuneration.pan === 'Verified' && x.remuneration.signature === 'Verified' ? ' <button class="btn sm ok" data-pay="' + x.id + '">' + UI.icon('rupee') + 'Pay</button>' : '')); } }
        ], vb)) +
        '</div><div>' +
        UI.card('Batches & progress', 'list', UI.table([
          { h: 'Batch', render: function (x) { return '<b>' + x.id + '</b> · ' + x.courseId + '<div style="font-size:10.5px;color:var(--text-2)">' + UI.esc(Q.name(x.teacherId)) + '</div>'; } },
          { h: 'Progress', render: function (x) { return UI.bar(Math.round(x.evaluated / x.scripts * 100), x.status === 'Completed' ? 'g' : 'y'); } },
          { h: 'Scripts', render: function (x) { return x.evaluated + '/' + x.scripts; } },
          { h: 'Status', render: function (x) { return UI.badge(x.status); } },
          { h: 'Action', render: function (x) { return x.status === 'Completed' ? '' : '<button class="btn sm pri" data-sub="' + x.id + '">' + UI.icon('edit') + 'Log scripts</button>'; } }
        ], vb)) +
        UI.hint('Faculty enter marks from their portal; the workspace verifies remuneration compliance before payment is queued — exactly like the institutional evaluation flow.', '', 'info') +
        '</div></div>';
      view.querySelectorAll('[data-vf]').forEach(function (el) { el.addEventListener('click', function () {
        var v = el.getAttribute('data-vf').split('|');
        WF.verifyRemuneration(me.id, v[1], v[0], true);
        UI.toast('Verified', 'Faculty notified of the ' + v[0] + ' verification.', 'green'); render();
      }); });
      view.querySelectorAll('[data-pay]').forEach(function (b) { b.addEventListener('click', function () {
        WF.payRemuneration(me.id, b.getAttribute('data-pay'));
        UI.toast('Payment queued', 'Faculty notified of the remuneration credit.', 'green'); render();
      }); });
      view.querySelectorAll('[data-sub]').forEach(function (b) { b.addEventListener('click', function () {
        var id = b.getAttribute('data-sub');
        var x = DB.valuationBatches.filter(function (y) { return y.id === id; })[0];
        UI.modal({ title: 'Log evaluated scripts — ' + x.courseId, body:
          UI.field('sv-n', 'Scripts evaluated this sitting', '<input class="input" id="sv-n" type="number" min="1" max="' + (x.scripts - x.evaluated) + '" placeholder="e.g. 6">', true) +
          UI.hint('Remaining after this entry: ' + (x.scripts - x.evaluated) + ' scripts. The batch auto-completes at ' + x.scripts + '.', '', 'info'),
          actions: '<button class="btn pri" id="sv-go">' + UI.icon('check') + 'Save progress</button>' });
        document.getElementById('sv-go').addEventListener('click', function () {
          WF.submitValuation(me.id, id, document.getElementById('sv-n').value);
          UI.closeModal(); UI.toast('Progress saved', 'Batch status updated.', 'green'); render();
        });
      }); });
      var ex = document.getElementById('vlExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'VALUATION STATUS & REMUNERATION REGISTER'],
          ['Generated', Q.today()],
          [],
          ['Batch', 'Course', 'Evaluator', 'Scripts', 'Evaluated', 'Status', 'Bank', 'PAN', 'Signature', 'Amount (Rs)', 'Payment']
        ];
        vb.forEach(function (x) { rows.push([x.id, x.courseId, Q.name(x.teacherId), x.scripts, x.evaluated, x.status, x.remuneration.bank, x.remuneration.pan, x.remuneration.signature, x.remuneration.amount, x.remuneration.paid]); });
        UI.downloadCSV('ExamCell-Valuation.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── placement/dashboard ......................... ── */
(function () {
MDTPAGE({
  role: 'placement',
  folder: 'placement',
  id: 'dashboard',
  render: function (view, ctx) {

    var me = ctx.person;
    var stats = DB.placementStats;
    var openDrives = DB.placementDrives.filter(function (d) { return d.status === 'Open'; });
    var registered = DB.placementApps.length;
    var offered = DB.placementApps.filter(function (a) { return a.status === 'Offered'; }).length;
    var trainingOn = DB.trainingBatches.filter(function (t) { return t.status === 'Ongoing'; });
    var interns = DB.internships.filter(function (i) { return i.status === 'Approved' || i.status === 'Faculty Approved' || i.status === 'Ongoing'; }).length;
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>' + UI.esc(me.name) + '</h1><div class="sub">' + UI.esc(me.designation) + ' · season ' + DB.settings.academicYear + '</div></div></div>' +
      '<div class="statrow">' +
      UI.stat({ tone: 'b', icon: 'briefcase', value: stats.percentage + '%', label: 'Last season placement', sub: stats.placed + ' of ' + stats.eligible + ' graduates', href: 'students.html' }) +
      UI.stat({ tone: 'g', icon: 'calendar', value: openDrives.length, label: 'Drives open', sub: 'next: ' + (openDrives[0] ? openDrives[0].company : '—'), href: 'drives.html' }) +
      UI.stat({ tone: 'y', icon: 'users', value: registered, label: 'Applications this season', href: 'drives.html' }) +
      UI.stat({ tone: 'r', icon: 'medal', value: offered, label: 'Offers confirmed', sub: 'highest ' + stats.highest, href: 'students.html' }) +
      '</div>' +
      '<div class="split">' +
      '<div>' +
      UI.card('Upcoming drives', 'calendar', UI.table([
          { h: 'Company · Role', render: function (d) { return '<b>' + UI.esc(d.company) + '</b><div style="font-size:10.5px;color:var(--text-2)">' + UI.esc(d.role) + '</div>'; } },
          { h: 'CTC', render: function (d) { return d.ctc; } },
          { h: 'Drive on', render: function (d) { return UI.fmtDate(d.date); } },
          { h: 'Register by', render: function (d) { return UI.fmtDate(d.regBy); } },
          { h: 'Registered', render: function (d) { return '<b class="num">' + d.applied + '</b>'; } },
          { h: 'Action', render: function (d) { return '<a class="btn sm pri" href="drives.html">' + UI.icon('eye') + 'Manage</a>'; } }
        ], DB.placementDrives, { empty: 'No drives posted yet' })) +
      UI.card('Training running now', 'target', UI.table([
          { h: 'Programme', render: function (t) { return '<b>' + UI.esc(t.name) + '</b><div style="font-size:10.5px;color:var(--text-2)">' + UI.esc(t.trainer) + '</div>'; } },
          { h: 'Type', render: function (t) { return t.type; } },
          { h: 'Batch', render: function (t) { return t.classes.join(', '); } },
          { h: 'Attendance', render: function (t) { return t.avgAttendance ? t.avgAttendance + '%' : '—'; } }
        ], trainingOn, { empty: 'No batches running' })) +
      '</div><div>' +
      UI.card('Season snapshot — outgoing batch', 'chart', UI.kv([
        ['Graduates', stats.graduates],
        ['Eligible', stats.eligible],
        ['Placed', '<b style="color:var(--green-ink)">' + stats.placed + '</b> (' + stats.percentage + '%)'],
        ['Average package', stats.average],
        ['Highest package', '<b>' + stats.highest + '</b>'],
        ['Recruiting companies', stats.companies],
        ['Top recruiters', UI.esc(stats.top)]
      ])) +
      UI.card('Quick actions', 'grid', '<div class="quickgrid">' +
        '<a class="bigbtn-tile" href="drives.html">' + UI.icon('calendar') + '<b>Post drive</b></a>' +
        '<a class="bigbtn-tile" href="recruiters.html">' + UI.icon('briefcase') + '<b>Recruiter</b></a>' +
        '<a class="bigbtn-tile" href="training.html">' + UI.icon('target') + '<b>Training</b></a>' +
        '<a class="bigbtn-tile" href="internships.html">' + UI.icon('door') + '<b>Internship</b></a>' +
        '</div>') +
      UI.card('Internships in motion', 'door', UI.table([
          { h: 'Student', render: function (i) { return UI.esc(Q.name(i.studentId)); } },
          { h: 'Company', render: function (i) { return UI.esc(i.company); } },
          { h: 'Stipend', render: function (i) { return UI.money(i.stipend) + '/mo'; } },
          { h: 'Status', render: function (i) { return UI.badge(i.status); } }
        ], DB.internships.filter(function (i) { return i.status !== 'Completed'; }).slice(0, 4))) +
      '</div></div>';

  }
});
})();

/* ── placement/drives ............................ ── */
(function () {
MDTPAGE({
  role: 'placement',
  folder: 'placement',
  id: 'drives',
  render: function (view, ctx) {

    var me = ctx.person;
    var state = { d: 'PD1' };
    function render() {
      var drive = DB.placementDrives.filter(function (x) { return x.id === state.d; })[0] || DB.placementDrives[0];
      var apps = DB.placementApps.filter(function (a) { return a.driveId === drive.id; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Placement Drives</h1><div class="sub">Post drives, track registrations, move students through rounds and confirm offers</div></div>' +
        '<div class="actions"><button class="btn pri" id="newPD">' + UI.icon('plus') + 'Post a drive</button>' + UI.expBtn('pdExp', 'Export drive register') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'calendar', value: DB.placementDrives.length, label: 'Drives this season' }) +
        UI.stat({ tone: 'g', icon: 'users', value: DB.placementDrives.reduce(function (a, d) { return a + d.applied; }, 0), label: 'Registrations' }) +
        UI.stat({ tone: 'y', icon: 'door', value: DB.placementApps.filter(function (a) { return a.status === 'Applied' || a.status === 'Shortlisted'; }).length, label: 'In process' }) +
        UI.stat({ tone: 'r', icon: 'medal', value: DB.placementApps.filter(function (a) { return a.status === 'Offered'; }).length, label: 'Offers' }) +
        '</div>' +
        '<div class="rowflex mb16">' + UI.chiprow(DB.placementDrives.map(function (d) { return { v: d.id, l: d.company.split(' ')[0], c: d.applied }; }), state.d) + '</div>' +
        '<div class="split">' +
        '<div>' + UI.card((drive ? drive.company : 'Drive') + ' — ' + (drive ? UI.esc(drive.role) : ''), 'briefcase',
          drive ? UI.kv([
            ['CTC', drive.ctc], ['Location', UI.esc(drive.location)], ['Drive date', UI.fmtDate(drive.date)],
            ['Registration closes', UI.fmtDate(drive.regBy)], ['Eligibility', UI.esc(drive.eligibility)],
            ['Registered', '<b class="num">' + drive.applied + '</b> students'], ['Status', UI.badge(drive.status)]
          ]) : UI.empty('No drives', 'briefcase')) +
        UI.card('Registrations & rounds — ' + (drive ? drive.company : ''), 'users', UI.table([
          { h: 'Student', render: function (a) { var s = Q.studentById(a.studentId); return s ? UI.avatar(s, 26) + ' <b>' + UI.esc(s.name) + '</b><div style="font-size:10px;color:var(--text-2)">' + s.reg + ' · CGPA ' + s.cgpa + '</div>' : a.studentId; } },
          { h: 'Applied', render: function (a) { return UI.fmtDate(a.at); } },
          { h: 'Round status', render: function (a) { return UI.esc(a.rounds); } },
          { h: 'Status', render: function (a) { return UI.badge(a.status); } },
          { h: 'Offer', render: function (a) { return a.offer ? '<b style="color:var(--green-ink)">' + UI.esc(a.offer) + '</b>' : '—'; } },
          { h: 'Action', render: function (a) { return '<span class="dl" data-round="' + a.id + '">Update round</span>'; } }
        ], apps, { empty: 'No registrations yet — the student page registers directly' })) + '</div>' +
        '<div>' + UI.card('Eligible pool — ' + (drive ? drive.company.split(' ')[0] : ''), 'grid',
          UI.table([
            { h: 'Student', render: function (s) { return UI.esc(s.name) + '<div style="font-size:10px;color:var(--text-2)">' + s.reg + '</div>'; } },
            { h: 'CGPA', render: function (s) { return '<b class="num">' + s.cgpa + '</b>'; } },
            { h: 'Arrears', render: function (s) { return s.arrears ? UI.badge('Blocked') : '<span class="tag g">clear</span>'; } },
            { h: 'Registered', render: function (s) { return apps.filter(function (a) { return a.studentId === s.id; }).length ? '<span class="tag g">yes</span>' : '<span class="dl" data-reg="' + s.id + '">Register</span>'; } }
          ], DB.students.filter(function (s) { return s.sem === 5 && s.cgpa >= 7.5; }).slice(0, 12))) +
        UI.hint('Rounds update in real time — every status change notifies the student on their placement page.', '', 'info') +
        '</div></div>';
      view.querySelectorAll('.chip[data-f]').forEach(function (c) { c.addEventListener('click', function () { state.d = c.getAttribute('data-f'); render(); }); });
      view.querySelectorAll('[data-reg]').forEach(function (el) { el.addEventListener('click', function () {
        WF.applyDrive(state.d, el.getAttribute('data-reg'));
        UI.toast('Registered', 'Student notified with the drive brief.', 'green'); render();
      }); });
      view.querySelectorAll('[data-round]').forEach(function (el) { el.addEventListener('click', function () {
        var a = DB.placementApps.filter(function (x) { return x.id === el.getAttribute('data-round'); })[0];
        UI.modal({ title: 'Round update — ' + Q.name(a.studentId), body:
          UI.field('ru-st', 'Status', UI.select('ru-st', ['Applied', 'Shortlisted', 'Offered', 'Not Selected'], a.status), true) +
          UI.field('ru-note', 'Round note', '<input class="input" id="ru-note" value="' + UI.esc(a.rounds) + '">', true),
          actions: '<button class="btn pri" id="ru-go">' + UI.icon('check') + 'Notify student</button>' });
        document.getElementById('ru-go').addEventListener('click', function () {
          WF.updateDriveRound(me.id, a.id, document.getElementById('ru-note').value, document.getElementById('ru-st').value);
          UI.closeModal(); UI.toast('Round updated', 'Student notified.', 'green'); render();
        });
      }); });
      document.getElementById('newPD').addEventListener('click', function () {
        UI.modal({ title: 'Post a placement drive', body:
          '<div class="fgrid">' +
          UI.field('pd-c', 'Company', UI.select('pd-c', DB.recruiters.map(function (r) { return { v: r.name, l: r.name }; }), '', 'Select recruiter'), true) +
          UI.field('pd-r', 'Role', '<input class="input" id="pd-r" placeholder="e.g. Software Engineer">', true) +
          UI.field('pd-ctc', 'CTC', '<input class="input" id="pd-ctc" placeholder="e.g. ₹7.5 LPA">', true) +
          UI.field('pd-l', 'Location', '<input class="input" id="pd-l" placeholder="e.g. Chennai / Hybrid">') +
          UI.field('pd-d', 'Drive date', '<input class="input" id="pd-d" type="date" min="' + Q.today() + '">', true) +
          UI.field('pd-reg', 'Registration by', '<input class="input" id="pd-reg" type="date" min="' + Q.today() + '">', true) + '</div>' +
          UI.field('pd-el', 'Eligibility', '<input class="input" id="pd-el" placeholder="e.g. CGPA ≥ 7.5 · No standing arrears">'),
          actions: '<button class="btn pri" id="pd-go">' + UI.icon('check') + 'Publish drive</button>' });
        document.getElementById('pd-go').addEventListener('click', function () {
          var c = document.getElementById('pd-c').value, d = document.getElementById('pd-d').value;
          if (!c || !d) { UI.toast('Company and date required', '', 'red'); return; }
          WF.postDrive(me.id, { company: c, role: document.getElementById('pd-r').value || 'Engineer', ctc: document.getElementById('pd-ctc').value || '—', location: document.getElementById('pd-l').value || '—', date: d, regBy: document.getElementById('pd-reg').value || d, eligibility: document.getElementById('pd-el').value || 'CGPA ≥ 7.0' });
          UI.closeModal(); UI.toast('Drive published', 'Every student notified on their placement page.', 'green'); render();
        });
      });
      var ex = document.getElementById('pdExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'PLACEMENT DRIVE REGISTER'],
          ['Generated', Q.today()],
          [],
          ['Drive', 'Company', 'Role', 'CTC', 'Date', 'Registered', 'Status', 'Student', 'Student Status', 'Rounds', 'Offer']
        ];
        DB.placementDrives.forEach(function (d) {
          var apps = DB.placementApps.filter(function (a) { return a.driveId === d.id; });
          if (!apps.length) rows.push([d.id, d.company, d.role, d.ctc, d.date, d.applied, d.status, '—', '—', '—', '—']);
          apps.forEach(function (a) {
            rows.push([d.id, d.company, d.role, d.ctc, d.date, d.applied, d.status, Q.name(a.studentId), a.status, a.rounds, a.offer || '—']);
          });
        });
        UI.downloadCSV('Placement-Drives.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── placement/internships ....................... ── */
(function () {
MDTPAGE({
  role: 'placement',
  folder: 'placement',
  id: 'internships',
  render: function (view, ctx) {

    var me = ctx.person;
    function render() {
      var pending = DB.internships.filter(function (i) { return i.status === 'Applied'; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Internships</h1><div class="sub">Industry immersion with faculty mentoring — applied, approved, completed with outcomes</div></div>' +
        '<div class="actions">' + UI.expBtn('inExp', 'Export internships') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'door', value: DB.internships.length, label: 'Records' }) +
        UI.stat({ tone: 'y', icon: 'door', value: pending.length, label: 'Awaiting faculty approval' }) +
        UI.stat({ tone: 'g', icon: 'checkc', value: DB.internships.filter(function (i) { return i.status === 'Completed'; }).length, label: 'Completed', sub: 'with outcomes' }) +
        UI.stat({ tone: 'r', icon: 'rupee', value: UI.money(DB.internships.reduce(function (a, i) { return a + i.stipend; }, 0)), label: 'Stipend value (record)' }) +
        '</div>' +
        '<div class="grid g2">' + DB.internships.map(function (i) {
          var s = Q.studentById(i.studentId);
          var tone = i.status === 'Completed' ? 'g' : (i.status === 'Applied' ? 'y' : 'b');
          return '<div class="card glow glow-' + tone + ' accent-' + tone + '"><div class="spread">' +
            '<div style="display:flex;gap:10px;align-items:center">' + UI.avatar(s, 38) +
            '<span><b>' + UI.esc(s ? s.name : i.studentId) + '</b><div style="font-size:11px;color:var(--text-2)">' + (s ? s.reg : '') + ' · mentor ' + UI.esc(Q.name(i.mentorId)) + '</div></span></div>' + UI.badge(i.status) + '</div>' +
            '<div class="mt8"><b>' + UI.esc(i.company) + '</b><div style="font-size:12px;color:var(--text-2)">' + UI.esc(i.role) + ' · ' + UI.money(i.stipend) + '/month · ' + UI.fmtDate(i.from) + ' → ' + UI.fmtDate(i.to) + '</div></div>' +
            '<div class="mt8" style="font-size:12.5px;color:var(--text-2)">' + UI.esc(i.outcome && i.outcome !== '—' ? i.outcome : 'In progress — mid-review pending from the faculty mentor.') + '</div>' +
            (i.status === 'Applied' || i.status === 'Faculty Approved' ? '<div class="frow" style="justify-content:flex-start">' +
              (i.status === 'Applied' ? '<button class="btn ok" data-ia="' + i.id + '">' + UI.icon('check') + 'Approve</button><button class="btn ghost-r" data-ir="' + i.id + '">' + UI.icon('x') + 'Decline</button>' : '<span class="tag g">faculty cleared</span>') +
              '</div>' : '') +
            '</div>';
        }).join('') + '</div>';
      view.querySelectorAll('[data-ia]').forEach(function (b) { b.addEventListener('click', function () {
        WF.decideInternship(me.id, b.getAttribute('data-ia'), true, 'Cleared by placement cell — NOC issued');
        UI.toast('Internship approved', 'Student and mentor notified.', 'green'); render();
      }); });
      view.querySelectorAll('[data-ir]').forEach(function (b) { b.addEventListener('click', function () {
        WF.decideInternship(me.id, b.getAttribute('data-ir'), false, 'Overlap with internal exam window — reapply for the next slot');
        UI.toast('Internship declined', 'Student notified with the reason.', 'red'); render();
      }); });
      var ex = document.getElementById('inExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'INTERNSHIP REGISTER'],
          ['Generated', Q.today()],
          [],
          ['Student', 'Register No', 'Company', 'Role', 'Stipend (Rs/mo)', 'From', 'To', 'Faculty Mentor', 'Status', 'Outcome']
        ];
        DB.internships.forEach(function (i) { var s = Q.studentById(i.studentId); rows.push([s ? s.name : i.studentId, s ? s.reg : '', i.company, i.role, i.stipend, i.from, i.to, Q.name(i.mentorId), i.status, i.outcome || '']); });
        UI.downloadCSV('Placement-Internships.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── placement/profile ........................... ── */
(function () {
MDTPAGE({
  role: 'placement',
  folder: 'placement',
  id: 'profile',
  render: function (view, ctx) {

    var me = ctx.person;
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>My Profile</h1><div class="sub">Training &amp; placement · corporate relations</div></div></div>' +
      '<div class="split-eq">' +
      '<div>' +
        '<div class="card glow glow-b accent-b">' + UI.photoBox(me, 'Your photo appears on drive notices, MoU letters and recruiter communication.') + '</div>' +
        UI.card('Office', 'cap', UI.kv([
          ['Employee code', '<b class="mono">' + me.id + '</b>'],
          ['Designation', UI.esc(me.designation)],
          ['Experience', me.exp + ' years'],
          ['Expertise', UI.esc(me.expertise)]
        ])) +
        UI.card('Scope of this portal', 'grid', '<ul style="margin:4px 0 0 16px;padding:0;font-size:12.5px;color:var(--text-2);line-height:1.9">' +
          '<li><b>Recruiters</b> — empanelment, HR contacts, MoU tracking and invites.</li>' +
          '<li><b>Drives</b> — posting, eligibility, round-by-round progress and offers.</li>' +
          '<li><b>Preparedness</b> — training batches and internship approvals.</li>' +
          '<li><b>Register</b> — batch-wise placement status with offers and outcomes.</li>' +
        '</ul>') +
      '</div>' +
      '<div>' +
        UI.card('Contact', 'idcard', UI.kv([
          ['Email', UI.esc(me.email)],
          ['Phone', UI.esc(me.phone)],
          ['Campus', DB.settings.institute + ', ' + DB.settings.city]
        ])) +
        UI.card('Connected approvals', 'shield', '<ul style="margin:4px 0 0 16px;padding:0;font-size:12.5px;color:var(--text-2);line-height:1.9">' +
          '<li>Drive postings reach <b>every student</b> instantly on their placement page.</li>' +
          '<li>Internships clear with the <b>faculty mentor</b> named on the record.</li>' +
          '<li>Drive logistics flow to <b>accounts</b> as expense vouchers.</li>' +
          '<li>Verified <b>achievements</b> from the mentor desk enrich the register.</li>' +
        '</ul>') +
        UI.card('Account', 'shield', UI.kv([
          ['Role', '<b>' + UI.esc(ctx.role) + '</b> — Placement Cell'],
          ['Access', 'Recruiters, drives, training, internships, register'],
          ['Sign-in', UI.esc(ctx.user.lastLogin)]
        ])) +
      '</div></div>';

  }
});
})();

/* ── placement/recruiters ........................ ── */
(function () {
MDTPAGE({
  role: 'placement',
  folder: 'placement',
  id: 'recruiters',
  render: function (view, ctx) {

    var me = ctx.person;
    var state = { q: '' };
    function render() {
      var list = DB.recruiters.filter(function (r) { return !state.q || (r.name + r.industry + (r.hr || '')).toLowerCase().indexOf(state.q.toLowerCase()) >= 0; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Recruiters &amp; MoUs</h1><div class="sub">Empanelled companies, HR contacts, MoU status and visit history</div></div>' +
        '<div class="actions"><button class="btn pri" id="newRC">' + UI.icon('plus') + 'Add recruiter</button>' + UI.expBtn('rcExp', 'Export directory') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'briefcase', value: DB.recruiters.length, label: 'Companies empanelled' }) +
        UI.stat({ tone: 'g', icon: 'checkc', value: DB.recruiters.filter(function (r) { return r.mou.indexOf('MoU') === 0; }).length, label: 'Active MoUs' }) +
        UI.stat({ tone: 'y', icon: 'calendar', value: DB.recruiters.filter(function (r) { return r.status === 'In Discussion'; }).length, label: 'In discussion' }) +
        UI.stat({ tone: 'r', icon: 'chart', value: DB.recruiters.reduce(function (a, r) { return a + (r.offers || 0); }, 0), label: 'Offers (history)' }) +
        '</div>' +
        '<div class="rowflex mb16"><div class="qsearch" style="flex:1;min-width:220px">' + UI.icon('search') + '<input class="input" id="rc-q" placeholder="Search company, industry or HR contact" value="' + UI.esc(state.q) + '"></div></div>' +
        '<div class="grid g2">' + list.map(function (r) {
          return '<div class="card glow glow-b accent-b"><div class="spread">' +
            '<div style="display:flex;gap:11px;align-items:center"><span class="sicon tb" style="width:42px;height:42px;border-radius:11px;display:flex;align-items:center;justify-content:center;background:var(--blue-tint);color:var(--g-blue)">' + UI.icon('briefcase') + '</span>' +
            '<span><b style="font-size:13.5px">' + UI.esc(r.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + UI.esc(r.industry) + (r.lastVisit ? ' · last visit ' + UI.fmtDate(r.lastVisit) : '') + '</div></span></div>' +
            UI.badge(r.status) + '</div>' +
            '<div class="mt8">' + UI.kv([
              ['HR contact', UI.esc(r.hr || '—') + (r.phone ? ' · ' + UI.esc(r.phone) : '')],
              ['MoU', UI.esc(r.mou)],
              ['Eligibility ask', UI.esc(r.eligibility)],
              ['Offers to date', r.offers]
            ]) + '</div>' +
            (r.email ? '<div class="frow" style="justify-content:flex-start"><span class="dl" data-mail="' + r.id + '">' + UI.icon('send') + 'Draft invite</span></div>' : '') +
            '</div>';
        }).join('') + '</div>' +
        (list.length ? '' : UI.empty('No recruiters match this search', 'briefcase'));
      var q = document.getElementById('rc-q');
      q.addEventListener('input', function () { state.q = q.value; render(); var q2 = document.getElementById('rc-q'); q2.focus(); q2.setSelectionRange(q.value.length, q.value.length); });
      view.querySelectorAll('[data-mail]').forEach(function (el) { el.addEventListener('click', function () {
        var r = DB.recruiters.filter(function (x) { return x.id === el.getAttribute('data-mail'); })[0];
        UI.modal({ title: 'Campus invite — ' + r.name, body:
          UI.kv([['To', UI.esc(r.email)], ['Subject', 'Campus recruitment — ' + DB.settings.academicYear + ' season']]) +
          '<p style="margin-top:12px;font-size:12.5px;color:var(--text-2)">Dear ' + UI.esc(r.hr || 'HR Team') + ',\nWe would be glad to host ' + UI.esc(r.name) + ' for the ' + DB.settings.academicYear + ' campus season. Our eligibility pool of 144 students across CSE and ECE is placement-ready with prior training. Could we schedule a brief call this week?</p>' +
          UI.hint('The office desk can co-ordinate logistics once a date is confirmed — an event appears on the calendar automatically.', '', 'info'),
          actions: '<button class="btn pri" id="mi-go">' + UI.icon('send') + 'Send invite</button>' });
        document.getElementById('mi-go').addEventListener('click', function () {
          UI.closeModal();
          WF.commit(me.id, 'Invited recruiter', r.name + ' — ' + r.email);
          UI.toast('Invite drafted & logged', 'Follow-up set for ' + r.name + '.', 'green');
        });
      }); });
      document.getElementById('newRC').addEventListener('click', function () {
        UI.modal({ title: 'Add a recruiter', body:
          UI.field('rc-n', 'Company', '<input class="input" id="rc-n" placeholder="e.g. Payoda Technologies">', true) +
          '<div class="fgrid">' +
          UI.field('rc-i', 'Industry', UI.select('rc-i', ['IT Services', 'Product SaaS', 'Engineering R&D', 'Cloud', 'Analytics', 'Banking', 'Core'], ), true) +
          UI.field('rc-h', 'HR contact', '<input class="input" id="rc-h" placeholder="Name">') +
          UI.field('rc-e', 'Email', '<input class="input" id="rc-e" type="email" placeholder="campus@company.example">', true) +
          UI.field('rc-p', 'Phone', '<input class="input" id="rc-p" placeholder="+91 …">') + '</div>' +
          UI.field('rc-m', 'MoU status', UI.select('rc-m', ['In Discussion', 'MoU — 2026', 'MoU — 2025'])),
          actions: '<button class="btn pri" id="rc-go">' + UI.icon('check') + 'Empanel</button>' });
        document.getElementById('rc-go').addEventListener('click', function () {
          var n = document.getElementById('rc-n').value;
          if (!n || !document.getElementById('rc-e').value) { UI.toast('Company & email required', '', 'red'); return; }
          WF.addRecruiter(me.id, { name: n, industry: document.getElementById('rc-i').value, hr: document.getElementById('rc-h').value, email: document.getElementById('rc-e').value, phone: document.getElementById('rc-p').value, mou: document.getElementById('rc-m').value });
          UI.closeModal(); UI.toast('Recruiter empanelled', 'MoU tracking started.', 'green'); render();
        });
      });
      var ex = document.getElementById('rcExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'RECRUITER DIRECTORY & MoU REGISTER'],
          ['Generated', Q.today()],
          [],
          ['Company', 'Industry', 'HR', 'Email', 'Phone', 'MoU', 'Last Visit', 'Offers', 'Status']
        ];
        DB.recruiters.forEach(function (r) { rows.push([r.name, r.industry, r.hr, r.email, r.phone, r.mou, r.lastVisit || '—', r.offers, r.status]); });
        UI.downloadCSV('Placement-Recruiters.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── placement/students .......................... ── */
(function () {
MDTPAGE({
  role: 'placement',
  folder: 'placement',
  id: 'students',
  render: function (view, ctx) {

    var state = { cls: 'all', status: 'all', q: '' };
    function render() {
      var rows = DB.students.filter(function (s) { return s.sem === 5; }).map(function (s) {
        var apps = DB.placementApps.filter(function (a) { return a.studentId === s.id; });
        var offered = apps.filter(function (a) { return a.status === 'Offered'; });
        var inProcess = apps.filter(function (a) { return a.status === 'Applied' || a.status === 'Shortlisted'; });
        var intern = DB.internships.filter(function (i) { return i.studentId === s.id && i.status === 'Completed'; })[0];
        var status = offered.length ? 'Placed' : (inProcess.length ? 'In Process' : (apps.length ? 'Attempted' : 'Not Started'));
        var ach = DB.achievements.filter(function (a) { return a.studentId === s.id && a.status === 'Verified'; }).length;
        return { s: s, apps: apps, status: status, offer: offered.length ? offered[0].offer : null, intern: intern, ach: ach };
      });
      var list = rows.filter(function (r) {
        return (state.cls === 'all' || r.s.classId === state.cls) &&
          (state.status === 'all' || r.status.toLowerCase() === state.status.toLowerCase()) &&
          (!state.q || (r.s.name + r.s.reg).toLowerCase().indexOf(state.q.toLowerCase()) >= 0);
      });
      var placed = rows.filter(function (r) { return r.status === 'Placed'; }).length;
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Placement Register</h1><div class="sub">Student-wise readiness, attempts and outcomes for the current batch</div></div>' +
        '<div class="actions">' + UI.expBtn('psExp', 'Export register') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'g', icon: 'medal', value: placed + '/' + rows.length, label: 'Placed (this season so far)', sub: Math.round(placed / rows.length * 100) + '%' }) +
        UI.stat({ tone: 'y', icon: 'door', value: rows.filter(function (r) { return r.status === 'In Process'; }).length, label: 'In process' }) +
        UI.stat({ tone: 'b', icon: 'briefcase', value: DB.internships.length, label: 'Internships (record)' }) +
        UI.stat({ tone: 'r', icon: 'users', value: rows.filter(function (r) { return r.status === 'Not Started'; }).length, label: 'Not yet started', sub: 'push training invites' }) +
        '</div>' +
        '<div class="rowflex mb16" style="gap:8px;flex-wrap:wrap">' +
        '<div class="qsearch" style="flex:1;min-width:200px">' + UI.icon('search') + '<input class="input" id="pr-q" placeholder="Search name or register no" value="' + UI.esc(state.q) + '"></div>' +
        UI.chiprow([{ v: 'all', l: 'All classes' }].concat(DB.classes.filter(function (c) { return c.sem === 5; }).map(function (c) { return { v: c.id, l: c.id }; })), state.cls) +
        UI.chiprow([{ v: 'all', l: 'Any status' }, { v: 'placed', l: 'Placed' }, { v: 'in process', l: 'In process' }, { v: 'not started', l: 'Not started' }], state.status) + '</div>' +
        UI.card('Batch register — ' + list.length + ' shown', 'users', UI.table([
          { h: 'Student', render: function (r) { return UI.avatar(r.s, 26) + ' <b>' + UI.esc(r.s.name) + '</b><div style="font-size:10px;color:var(--text-2)">' + r.s.reg + ' · ' + r.s.classId + '</div>'; } },
          { h: 'CGPA', render: function (r) { return '<b class="num">' + r.s.cgpa + '</b>'; } },
          { h: 'Attempts', render: function (r) { return r.apps.length; } },
          { h: 'Achievements', render: function (r) { return r.ach ? '<span class="tag y">' + r.ach + ' verified</span>' : '—'; } },
          { h: 'Internship', render: function (r) { return r.intern ? '<span class="tag g">' + UI.esc(r.intern.company) + '</span>' : '—'; } },
          { h: 'Placement', render: function (r) { return UI.badge(r.status); } },
          { h: 'Offer', render: function (r) { return r.offer ? '<b style="color:var(--green-ink)">' + UI.esc(r.offer) + '</b>' : '—'; } },
          { h: 'Action', render: function (r) { return '<span class="dl" data-prof="' + r.s.id + '">Profile</span>'; } }
        ], list));
      var q = document.getElementById('pr-q');
      q.addEventListener('input', function () { state.q = q.value; render(); var q2 = document.getElementById('pr-q'); q2.focus(); q2.setSelectionRange(q.value.length, q.value.length); });
      var chips = view.querySelectorAll('.chip[data-f]');
      chips.forEach(function (c) {
        c.addEventListener('click', function () {
          var v = c.getAttribute('data-f');
          if (['all', 'CSE-A', 'CSE-B', 'ECE-A', 'ECE-B'].indexOf(v) >= 0) state.cls = v; else state.status = v;
          render();
        });
      });
      view.querySelectorAll('[data-prof]').forEach(function (el) { el.addEventListener('click', function () {
        var r = rows.filter(function (x) { return x.s.id === el.getAttribute('data-prof'); })[0];
        UI.modal({ title: r.s.name + ' — ' + r.s.reg, body:
          UI.kv([['Class', r.s.classId], ['CGPA', r.s.cgpa], ['Arrears', r.s.arrears ? '1' : 'none'], ['Placement', r.status], ['Offer', r.offer || '—'], ['Verified achievements', r.ach]]) +
          (r.apps.length ? UI.table([
            { h: 'Drive', render: function (a) { var d = DB.placementDrives.filter(function (x) { return x.id === a.driveId; })[0]; return d ? UI.esc(d.company) : a.driveId; } },
            { h: 'Status', render: function (a) { return UI.badge(a.status); } },
            { h: 'Rounds', render: function (a) { return UI.esc(a.rounds); } }
          ], r.apps) : UI.empty('No drive applications yet', 'briefcase')),
          actions: '<button class="btn pri" onclick="UI.closeModal()">Close</button>' });
      }); });
      var ex = document.getElementById('psExp');
      if (ex) ex.addEventListener('click', function () {
        var rows2 = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'PLACEMENT REGISTER — CURRENT BATCH'],
          ['Generated', Q.today()],
          [],
          ['Register No', 'Student', 'Class', 'CGPA', 'Arrears', 'Attempts', 'Verified Achievements', 'Internship', 'Placement Status', 'Offer']
        ];
        rows.forEach(function (r) { rows2.push([r.s.reg, r.s.name, r.s.classId, r.s.cgpa, r.s.arrears || 0, r.apps.length, r.ach, r.intern ? r.intern.company : '—', r.status, r.offer || '—']); });
        UI.downloadCSV('Placement-Register.csv', rows2);
      });
    }
    render();

  }
});
})();

/* ── placement/training .......................... ── */
(function () {
MDTPAGE({
  role: 'placement',
  folder: 'placement',
  id: 'training',
  render: function (view, ctx) {

    var me = ctx.person;
    function render() {
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Training &amp; Employability Batches</h1><div class="sub">Aptitude, soft skills, group discussion, technical and mock-interview tracks with attendance analytics</div></div>' +
        '<div class="actions"><button class="btn pri" id="newTB">' + UI.icon('plus') + 'Schedule a batch</button>' + UI.expBtn('tbExp', 'Export batches') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'target', value: DB.trainingBatches.length, label: 'Batches' }) +
        UI.stat({ tone: 'g', icon: 'play', value: DB.trainingBatches.filter(function (t) { return t.status === 'Ongoing'; }).length, label: 'Running now' }) +
        UI.stat({ tone: 'y', icon: 'calendar', value: DB.trainingBatches.filter(function (t) { return t.status === 'Upcoming'; }).length, label: 'Upcoming' }) +
        UI.stat({ tone: 'r', icon: 'users', value: DB.trainingBatches.reduce(function (a, t) { return a + t.students; }, 0), label: 'Seats (all batches)' }) +
        '</div>' +
        '<div class="grid g2">' + DB.trainingBatches.map(function (t) {
          var tone = t.status === 'Completed' ? 'g' : t.status === 'Ongoing' ? 'y' : 'b';
          return '<div class="card glow glow-' + tone + ' accent-' + tone + '"><div class="spread">' +
            '<div style="display:flex;gap:11px;align-items:center"><span class="sicon t' + tone + '" style="width:42px;height:42px;border-radius:11px;display:flex;align-items:center;justify-content:center;background:var(--' + tone + '-tint);color:var(--g-' + tone + ')">' + UI.icon('target') + '</span>' +
            '<span><b style="font-size:13.5px">' + UI.esc(t.name) + '</b><div style="font-size:11px;color:var(--text-2)">' + UI.esc(t.trainer) + ' · ' + t.type + '</div></span></div>' +
            UI.badge(t.status) + '</div>' +
            '<div class="mt8">' + UI.kv([
              ['Batch', t.classes.join(', ')],
              ['Window', UI.fmtDate(t.from) + ' → ' + UI.fmtDate(t.to)],
              ['Students', '<b class="num">' + t.students + '</b> · ' + t.sessions + ' sessions'],
              ['Attendance', t.avgAttendance ? UI.bar(t.avgAttendance, t.avgAttendance < 80 ? 'r' : 'g') + ' ' + t.avgAttendance + '%' : 'starts with the batch'],
              ['Average score', t.avgScore != null ? t.avgScore : '—']
            ]) + '</div>' +
            (t.status === 'Ongoing' ? '<div class="frow" style="justify-content:flex-start"><button class="btn sm pri" data-att="' + t.id + '">' + UI.icon('checkc') + 'Log a session</button></div>' : '') +
            '</div>';
        }).join('') + '</div>';
      view.querySelectorAll('[data-att]').forEach(function (b) { b.addEventListener('click', function () {
        var t = DB.trainingBatches.filter(function (x) { return x.id === b.getAttribute('data-att'); })[0];
        UI.modal({ title: 'Log attendance — ' + t.name, body:
          UI.field('ta-n', 'Students attended', '<input class="input" id="ta-n" type="number" min="0" max="' + t.students + '" value="' + Math.round(t.students * 0.9) + '">', true),
          actions: '<button class="btn pri" id="ta-go">' + UI.icon('check') + 'Save</button>' });
        document.getElementById('ta-go').addEventListener('click', function () {
          WF.logTrainingSession(me.id, t.id, +document.getElementById('ta-n').value);
          UI.closeModal(); UI.toast('Session logged', 'Running average updated.', 'green'); render();
        });
      }); });
      document.getElementById('newTB').addEventListener('click', function () {
        UI.modal({ title: 'Schedule a training batch', body:
          UI.field('tb-n', 'Programme name', '<input class="input" id="tb-n" placeholder="e.g. Verbal Ability Sprint">', true) +
          '<div class="fgrid">' +
          UI.field('tb-t', 'Track', UI.select('tb-t', ['Aptitude', 'Soft Skills', 'Group Discussion', 'Technical', 'Mock Interview']), true) +
          UI.field('tb-tr', 'Trainer', '<input class="input" id="tb-tr" placeholder="Name (internal or external)">', true) +
          UI.field('tb-c', 'Class', UI.select('tb-c', DB.classes.filter(function (c) { return c.sem === 5; }).map(function (c) { return { v: c.id, l: c.id }; })), true) +
          UI.field('tb-s', 'Sessions', '<input class="input" id="tb-s" type="number" min="1" value="8">') +
          UI.field('tb-f', 'From', '<input class="input" id="tb-f" type="date" min="' + Q.today() + '">', true) +
          UI.field('tb-tt', 'To', '<input class="input" id="tb-tt" type="date" min="' + Q.today() + '">', true) + '</div>',
          actions: '<button class="btn pri" id="tb-go">' + UI.icon('check') + 'Publish batch</button>' });
        document.getElementById('tb-go').addEventListener('click', function () {
          var n = document.getElementById('tb-n').value, f = document.getElementById('tb-f').value;
          if (!n || !f) { UI.toast('Name and start date required', '', 'red'); return; }
          WF.addTrainingBatch(me.id, { name: n, type: document.getElementById('tb-t').value, trainer: document.getElementById('tb-tr').value, from: f, to: document.getElementById('tb-tt').value || f, classId: document.getElementById('tb-c').value, sessions: document.getElementById('tb-s').value });
          UI.closeModal(); UI.toast('Batch scheduled', 'Class notified on their placement page.', 'green'); render();
        });
      });
      var ex = document.getElementById('tbExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'TRAINING BATCHES'],
          ['Generated', Q.today()],
          [],
          ['Programme', 'Track', 'Trainer', 'Class', 'Students', 'Sessions', 'From', 'To', 'Attendance %', 'Avg Score', 'Status']
        ];
        DB.trainingBatches.forEach(function (t) { rows.push([t.name, t.type, t.trainer, t.classes.join(' '), t.students, t.sessions, t.from, t.to, t.avgAttendance != null ? t.avgAttendance : '', t.avgScore != null ? t.avgScore : '', t.status]); });
        UI.downloadCSV('Placement-Training.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── accounts/budgets ............................ ── */
(function () {
MDTPAGE({
  role: 'accounts',
  folder: 'accounts',
  id: 'budgets',
  render: function (view, ctx) {

    var me = ctx.person;
    function render() {
      var alloc = DB.budgets.reduce(function (a, b) { return a + b.allocated; }, 0);
      var spent = DB.budgets.reduce(function (a, b) { return a + b.spent; }, 0);
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Budgets — ' + DB.settings.academicYear + '</h1><div class="sub">Section-wise allocation, utilisation and variance control</div></div>' +
        '<div class="actions"><button class="btn pri" id="newBU">' + UI.icon('edit') + 'Revise an allocation</button>' + UI.expBtn('buExp', 'Export budgets') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'chart', value: UI.money(alloc), label: 'Total allocated' }) +
        UI.stat({ tone: 'g', icon: 'rupee', value: UI.money(spent), label: 'Utilised', sub: Math.round(spent / alloc * 100) + '%' }) +
        UI.stat({ tone: 'y', icon: 'alert', value: DB.budgets.filter(function (b) { return b.spent / b.allocated > 0.8; }).length, label: 'Heads above 80% used' }) +
        UI.stat({ tone: 'r', icon: 'grid', value: DB.budgets.length, label: 'Budget heads' }) +
        '</div>' +
        UI.card('Utilisation by section', 'chart', UI.barsChart(DB.budgets.map(function (b) {
          var pct = Math.round(b.spent / b.allocated * 100);
          return { l: b.section.split(' ')[0], v: pct, n: UI.money(b.spent) + ' / ' + UI.money(b.allocated), tone: pct > 80 ? 'r' : pct > 60 ? 'y' : 'g' };
        }))) +
        UI.card('Allocation register', 'grid', UI.table([
          { h: 'Section', render: function (b) { return '<b>' + UI.esc(b.section) + '</b><div style="font-size:10.5px;color:var(--text-2)">' + UI.esc(b.note) + '</div>'; } },
          { h: 'Allocated', render: function (b) { return UI.money(b.allocated); } },
          { h: 'Utilised', render: function (b) { return UI.money(b.spent); } },
          { h: 'Balance', render: function (b) { return '<b class="num" style="color:' + (b.allocated - b.spent < 50000 ? 'var(--red-ink)' : 'var(--green-ink)') + '">' + UI.money(b.allocated - b.spent) + '</b>'; } },
          { h: 'Utilisation', render: function (b) { return UI.bar(Math.round(b.spent / b.allocated * 100), b.spent / b.allocated > 0.8 ? 'r' : 'g'); } },
          { h: 'Action', render: function (b) { return '<span class="dl" data-bu="' + b.section + '">Revise</span>'; } }
        ], DB.budgets));
      view.querySelectorAll('[data-bu]').forEach(function (el) { el.addEventListener('click', function () {
        var b = DB.budgets.filter(function (x) { return x.section === el.getAttribute('data-bu'); })[0];
        UI.modal({ title: 'Revise — ' + b.section, body:
          UI.field('bu-a', 'Revised allocation (₹)', '<input class="input" id="bu-a" type="number" value="' + b.allocated + '">', true) +
          UI.field('bu-n', 'Note', '<input class="input" id="bu-n" value="' + UI.esc(b.note) + '">'),
          actions: '<button class="btn pri" id="bu-go">' + UI.icon('check') + 'Save revision</button>' });
        document.getElementById('bu-go').addEventListener('click', function () {
          WF.allocateBudget(me.id, b.section, document.getElementById('bu-a').value, document.getElementById('bu-n').value);
          UI.closeModal(); UI.toast('Allocation revised', 'Register updated.', 'green'); render();
        });
      }); });
      document.getElementById('newBU').addEventListener('click', function () {
        UI.modal({ title: 'Revise an allocation', body:
          UI.field('nb-s', 'Section', UI.select('nb-s', DB.budgets.map(function (b) { return { v: b.section, l: b.section }; })), true) +
          '<div class="fgrid">' +
          UI.field('nb-a', 'Allocation (₹)', '<input class="input" id="nb-a" type="number" placeholder="e.g. 620000">', true) +
          UI.field('nb-n', 'Note', '<input class="input" id="nb-n" placeholder="Purpose / remark">') + '</div>',
          actions: '<button class="btn pri" id="nb-go">' + UI.icon('check') + 'Save</button>' });
        document.getElementById('nb-go').addEventListener('click', function () {
          WF.allocateBudget(me.id, document.getElementById('nb-s').value, document.getElementById('nb-a').value, document.getElementById('nb-n').value);
          UI.closeModal(); UI.toast('Allocation saved', '', 'green'); render();
        });
      });
      var ex = document.getElementById('buExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'BUDGET REGISTER — ' + DB.settings.academicYear],
          ['Generated', Q.today()],
          [],
          ['Section', 'Allocated (Rs)', 'Utilised (Rs)', 'Balance (Rs)', 'Utilisation %', 'Note']
        ];
        DB.budgets.forEach(function (b) { rows.push([b.section, b.allocated, b.spent, b.allocated - b.spent, Math.round(b.spent / b.allocated * 100) + '%', b.note]); });
        UI.downloadCSV('Accounts-Budgets.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── accounts/collections ........................ ── */
(function () {
MDTPAGE({
  role: 'accounts',
  folder: 'accounts',
  id: 'collections',
  render: function (view, ctx) {

    var state = { mode: 'all', day: Q.today() };
    function render() {
      var tx = DB.feeTransactions.filter(function (t) {
        return (state.mode === 'all' || (t.mode || 'Counter') === state.mode) && (state.day === 'all' || t.date === state.day);
      });
      var total = tx.reduce(function (a, t) { return a + t.amount; }, 0);
      var modes = {};
      DB.feeTransactions.forEach(function (t) { modes[t.mode || 'Counter'] = (modes[t.mode || 'Counter'] || 0) + t.amount; });
      var defaulters = DB.students.filter(function (s) { return Q.duesOf(s.id).total > DB.settings.wf.feeGrace; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Collections &amp; Day Book</h1><div class="sub">Every receipt on record — counter, UPI, net-banking and DD · reconciliation and defaulters</div></div>' +
        '<div class="actions">' + UI.expBtn('dbExp', 'Export day book') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'g', icon: 'rupee', value: UI.money(Q.collectionToday()), label: 'Today\u2019s collection', sub: DB.feeTransactions.filter(function (t) { return t.date === Q.today(); }).length + ' receipts' }) +
        UI.stat({ tone: 'b', icon: 'chart', value: UI.money(DB.feeTransactions.reduce(function (a, t) { return a + t.amount; }, 0)), label: 'Overall (register)' }) +
        UI.stat({ tone: 'y', icon: 'grid', value: Object.keys(modes).length, label: 'Payment modes in use' }) +
        UI.stat({ tone: 'r', icon: 'alert', value: defaulters.length, label: 'Defaulters (above grace)', href: '#', sub: 'grace ₹' + DB.settings.wf.feeGrace }) +
        '</div>' +
        '<div class="rowflex mb16" style="gap:8px;flex-wrap:wrap">' +
        UI.select('db-day', [{ v: 'all', l: 'All dates' }].concat(Array.from(new Set(DB.feeTransactions.map(function (t) { return t.date; }))).sort().reverse().slice(0, 12).map(function (d) { return { v: d, l: d }; })), state.day) +
        UI.chiprow([{ v: 'all', l: 'All modes' }].concat(Object.keys(modes).map(function (m) { return { v: m, l: m }; })), state.mode) + '</div>' +
        UI.card('Receipts — ' + tx.length + ' shown · total ' + UI.money(total), 'rupee', UI.table([
          { h: 'Receipt', render: function (t) { return '<span class="mono">' + UI.esc(t.id) + '</span>'; } },
          { h: 'Student', render: function (t) { var s = Q.studentById(t.studentId); return s ? UI.avatar(s, 26) + ' ' + UI.esc(s.name) + '<div style="font-size:10px;color:var(--text-2)">' + s.reg + '</div>' : t.studentId; } },
          { h: 'Date', render: function (t) { return UI.fmtDate(t.date); } },
          { h: 'Head', render: function (t) { return UI.esc(t.head || '—'); } },
          { h: 'Mode', render: function (t) { return UI.esc(t.mode || 'Counter'); } },
          { h: 'Amount', render: function (t) { return '<b class="num">' + UI.money(t.amount) + '</b>'; } }
        ], tx)) +
        '<div class="split-eq mt16">' +
        UI.card('Mode-wise split (register)', 'chart', UI.barsChart(Object.keys(modes).map(function (m) {
          var tot = DB.feeTransactions.reduce(function (a, t) { return a + t.amount; }, 0);
          return { l: m, v: Math.round(modes[m] / (tot || 1) * 100), n: UI.money(modes[m]) };
        }))) +
        UI.card('Defaulters — above grace limit', 'alert', UI.table([
          { h: 'Student', render: function (s) { return UI.esc(s.name) + '<div style="font-size:10px;color:var(--text-2)">' + s.reg + ' · ' + s.classId + '</div>'; } },
          { h: 'Dues', render: function (s) { var d = Q.duesOf(s.id); return '<b class="num" style="color:var(--red-ink)">' + UI.money(d.total) + '</b><div style="font-size:10px;color:var(--text-2)">' + d.heads.length + ' head(s)</div>'; } },
          { h: 'Block', render: function (s) { return s.hostel ? 'Hall ticket held' : 'Reminder'; } }
        ], defaulters.slice(0, 8)), null, { href: '#', label: 'Full list' }) +
        '</div>';
      document.getElementById('db-day').addEventListener('change', function (e) { state.day = e.target.value; render(); });
      view.querySelectorAll('.chip[data-f]').forEach(function (c) { c.addEventListener('click', function () { state.mode = c.getAttribute('data-f'); render(); }); });
      var ex = document.getElementById('dbExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'COLLECTIONS DAY BOOK'],
          ['Generated', Q.today()],
          ['Filter', (state.day === 'all' ? 'All dates' : state.day) + ' · ' + (state.mode === 'all' ? 'All modes' : state.mode)],
          [],
          ['Receipt', 'Register No', 'Student', 'Date', 'Head', 'Mode', 'Amount (Rs)']
        ];
        tx.forEach(function (t) { var s = Q.studentById(t.studentId); rows.push([t.id, s ? s.reg : '', s ? s.name : '', t.date, t.head || '', t.mode || 'Counter', t.amount]); });
        UI.downloadCSV('Accounts-DayBook.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── accounts/dashboard .......................... ── */
(function () {
MDTPAGE({
  role: 'accounts',
  folder: 'accounts',
  id: 'dashboard',
  render: function (view, ctx) {

    var me = ctx.person;
    var todayCol = Q.collectionToday();
    var monthTx = DB.feeTransactions.filter(function (t) { return t.date.slice(0, 7) === Q.today().slice(0, 7); });
    var monthCol = monthTx.reduce(function (a, t) { return a + t.amount; }, 0);
    var pendingV = DB.expenses.filter(function (e) { return e.status === 'Submitted'; });
    var paidTotal = DB.expenses.filter(function (e) { return e.status === 'Paid'; }).reduce(function (a, e) { return a + e.amount; }, 0);
    var bud = DB.budgets;
    var budAlloc = bud.reduce(function (a, b) { return a + b.allocated; }, 0);
    var budSpent = bud.reduce(function (a, b) { return a + b.spent; }, 0);
    var duetotal = 0;
  DB.students.forEach(function (s) { duetotal += Q.duesOf(s.id).total; });
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>' + UI.esc(me.name) + '</h1><div class="sub">' + UI.esc(me.designation) + '</div></div></div>' +
      '<div class="statrow">' +
      UI.stat({ tone: 'g', icon: 'rupee', value: UI.money(todayCol), label: 'Collected today', sub: monthTx.length + ' receipts this month', href: 'collections.html' }) +
      UI.stat({ tone: 'b', icon: 'chart', value: UI.money(monthCol), label: 'This month', href: 'collections.html' }) +
      UI.stat({ tone: 'y', icon: 'door', value: pendingV.length, label: 'Vouchers to verify', sub: 'then principal approval', href: 'expenses.html' }) +
      UI.stat({ tone: 'r', icon: 'alert', value: UI.money(duetotal), label: 'Student dues (all heads)', href: 'collections.html' }) +
      '</div>' +
      '<div class="split">' +
      '<div>' +
      UI.card('Collections — mode split (this month)', 'chart', (function () {
        var modes = {};
        monthTx.forEach(function (t) { modes[t.mode || 'Counter'] = (modes[t.mode || 'Counter'] || 0) + t.amount; });
        return UI.barsChart(Object.keys(modes).map(function (m) { return { l: m, v: Math.round(modes[m] / (monthCol || 1) * 100), n: UI.money(modes[m]) }; }));
      })()) +
      UI.card('Expense vouchers — latest first', 'file', UI.table([
          { h: 'Voucher', render: function (e) { return '<b class="mono">' + e.id + '</b> · ' + e.category; } },
          { h: 'Raised by', render: function (e) { return UI.esc(Q.name(e.by)); } },
          { h: 'Amount', render: function (e) { return UI.money(e.amount); } },
          { h: 'Status', render: function (e) { return UI.badge(e.status); } },
          { h: 'Action', render: function (e) { return e.status === 'Submitted' ? '<span class="dl" data-ver="' + e.id + '">Verify now</span>' : ''; } }
        ], DB.expenses.slice(0, 6)), null, { href: 'expenses.html', label: 'All vouchers' }) +
      '</div><div>' +
      UI.card('Budget utilisation', 'chart', UI.barsChart(bud.map(function (b) {
          return { l: b.section.split(' ')[0], v: Math.round(b.spent / b.allocated * 100), n: Math.round(b.spent / b.allocated * 100) + '%', tone: b.spent / b.allocated > 0.8 ? 'r' : b.spent / b.allocated > 0.6 ? 'y' : 'g' };
        })), null, { href: 'budgets.html', label: 'Budgets' }) +
      UI.card('Quick actions', 'grid', '<div class="quickgrid">' +
        '<a class="bigbtn-tile" href="collections.html">' + UI.icon('rupee') + '<b>Day book</b></a>' +
        '<a class="bigbtn-tile" href="expenses.html">' + UI.icon('file') + '<b>Vouchers</b></a>' +
        '<a class="bigbtn-tile" href="payroll.html">' + UI.icon('users') + '<b>Payroll</b></a>' +
        '<a class="bigbtn-tile" href="vendors.html">' + UI.icon('grid') + '<b>Vendor / PO</b></a>' +
        '</div>') +
      UI.card('Payroll snapshot', 'users', UI.kv([
        ['Staff on roll', DB.staff.length],
        ['Last run', (DB.payrollRuns.filter(function (r) { return r.status === 'Disbursed'; })[0] || {}).month || '—'],
        ['Net disbursed', UI.money((DB.payrollRuns.filter(function (r) { return r.status === 'Disbursed'; })[0] || { net: 0 }).net)],
        ['Next run', 'September 2026 — draft on 30 Sep']
      ]), null, { href: 'payroll.html', label: 'Payroll' }) +
      '</div></div>';
      view.querySelectorAll('[data-ver]').forEach(function (b) { b.addEventListener('click', function () {
        WF.verifyExpense(me.id, b.getAttribute('data-ver'), true);
        UI.toast('Verified', 'Sent to the principal for approval.', 'green'); render();
      }); });

  }
});
})();

/* ── accounts/expenses ........................... ── */
(function () {
MDTPAGE({
  role: 'accounts',
  folder: 'accounts',
  id: 'expenses',
  render: function (view, ctx) {

    var me = ctx.person;
    var state = { tab: 'queue' };
    function render() {
      var queue = DB.expenses.filter(function (e) { return e.status === 'Submitted'; });
      var verified = DB.expenses.filter(function (e) { return e.status === 'Accounts Verified' || e.status === 'Principal Approved'; });
      var paid = DB.expenses.filter(function (e) { return e.status === 'Paid'; });
      var rejected = DB.expenses.filter(function (e) { return e.status === 'Returned' || e.status === 'Rejected'; });
      var list = state.tab === 'queue' ? queue : state.tab === 'flow' ? verified : state.tab === 'paid' ? paid : rejected;
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Expense Vouchers</h1><div class="sub">Raised by any office — verified here, approved by the Principal, then paid</div></div>' +
        '<div class="actions"><button class="btn pri" id="newEV">' + UI.icon('plus') + 'Raise a voucher</button>' + UI.expBtn('evExp', 'Export vouchers') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'y', icon: 'door', value: queue.length, label: 'Awaiting your verification' }) +
        UI.stat({ tone: 'b', icon: 'send', value: verified.length, label: 'With the Principal' }) +
        UI.stat({ tone: 'g', icon: 'checkc', value: paid.length, label: 'Paid', sub: UI.money(paid.reduce(function (a, e) { return a + e.amount; }, 0)) }) +
        UI.stat({ tone: 'r', icon: 'x', value: rejected.length, label: 'Returned / rejected' }) +
        '</div>' +
        '<div class="rowflex mb16">' + UI.chiprow([
          { v: 'queue', l: 'Verification queue', c: queue.length },
          { v: 'flow', l: 'In flow', c: verified.length },
          { v: 'paid', l: 'Paid', c: paid.length },
          { v: 'rej', l: 'Returned', c: rejected.length }
        ], state.tab) + '</div>' +
        '<div class="grid g2">' + (list.length ? list.map(function (e) {
          var tone = e.status === 'Paid' ? 'g' : e.status === 'Submitted' ? 'y' : 'b';
          return '<div class="card glow glow-' + tone + ' accent-' + tone + '"><div class="spread">' +
            '<div><b class="mono">' + e.id + '</b> · ' + UI.esc(e.category) + '<div style="font-size:11px;color:var(--text-2)">' + UI.esc(Q.name(e.by)) + ' · raised ' + UI.fmtDate(e.raisedAt) + '</div></div>' +
            '<b class="num" style="font-size:15px">' + UI.money(e.amount) + '</b></div>' +
            '<div class="mt8" style="font-size:12.5px;color:var(--text-2)">' + UI.esc(e.desc) + '</div>' +
            '<div class="mt8">' + UI.timeline(e.timeline) + '</div>' +
            '<div class="frow" style="justify-content:flex-start">' +
            (e.status === 'Submitted' ? '<button class="btn ok" data-evv="' + e.id + '">' + UI.icon('check') + 'Verify</button><button class="btn ghost-r" data-evr="' + e.id + '">' + UI.icon('x') + 'Return</button>' : '') +
            (e.status === 'Principal Approved' ? '<button class="btn ok" data-evp="' + e.id + '">' + UI.icon('rupee') + 'Pay now</button>' : '') +
            (e.status === 'Paid' ? '<span class="tag g">' + UI.esc(e.mode) + '</span>' : '') +
            '</div></div>';
        }).join('') : '<div class="card">' + UI.empty('Nothing in this filter', 'checkc') + '</div>') + '</div>';
      view.querySelectorAll('.chip[data-f]').forEach(function (c) { c.addEventListener('click', function () { state.tab = c.getAttribute('data-f'); render(); }); });
      view.querySelectorAll('[data-evv]').forEach(function (b) { b.addEventListener('click', function () {
        WF.verifyExpense(me.id, b.getAttribute('data-evv'), true);
        UI.toast('Verified', 'Routed to the Principal for approval.', 'green'); render();
      }); });
      view.querySelectorAll('[data-evr]').forEach(function (b) { b.addEventListener('click', function () {
        WF.verifyExpense(me.id, b.getAttribute('data-evr'), false, 'Supporting documents incomplete');
        UI.toast('Returned', 'Raiser notified to resubmit.', 'red'); render();
      }); });
      view.querySelectorAll('[data-evp]').forEach(function (b) { b.addEventListener('click', function () {
        var id = b.getAttribute('data-evp');
        UI.modal({ title: 'Pay voucher', body: UI.field('pv-m', 'Payment mode', UI.select('pv-m', ['NEFT — vendor', 'UPI — vendor', 'Cash', 'Card — campus']), true),
          actions: '<button class="btn pri" id="pv-go">' + UI.icon('rupee') + 'Confirm payment</button>' });
        document.getElementById('pv-go').addEventListener('click', function () {
          WF.payExpense(me.id, id, document.getElementById('pv-m').value);
          UI.closeModal(); UI.toast('Paid', 'Raiser notified with the mode.', 'green'); render();
        });
      }); });
      document.getElementById('newEV').addEventListener('click', function () {
        UI.modal({ title: 'Raise an expense voucher', body:
          UI.field('ne-c', 'Category', UI.select('ne-c', ['Mess & Hostel', 'Library', 'Maintenance', 'Lab & Equipment', 'Placement & Events', 'Examinations', 'Quality & Accreditation', 'Utilities', 'IT Infrastructure']), true) +
          UI.field('ne-d', 'Description', '<input class="input" id="ne-d" placeholder="e.g. Lab consumables — sem V labs">', true) +
          UI.field('ne-a', 'Amount (₹)', '<input class="input" id="ne-a" type="number" min="1">', true),
          actions: '<button class="btn pri" id="ne-go">' + UI.icon('check') + 'Submit voucher</button>' });
        document.getElementById('ne-go').addEventListener('click', function () {
          var a = document.getElementById('ne-a').value, d = document.getElementById('ne-d').value;
          if (!a || !d) { UI.toast('Amount and description required', '', 'red'); return; }
          WF.submitExpense(me.id, 'accounts', { category: document.getElementById('ne-c').value, desc: d, amount: a });
          UI.closeModal(); UI.toast('Voucher raised', 'Queued at your own verification desk.', 'green'); render();
        });
      });
      var ex = document.getElementById('evExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'EXPENSE VOUCHER REGISTER'],
          ['Generated', Q.today()],
          [],
          ['Voucher', 'Category', 'Description', 'Raised By', 'Amount (Rs)', 'Raised', 'Status', 'Mode', 'Timeline']
        ];
        DB.expenses.forEach(function (e) { rows.push([e.id, e.category, e.desc, Q.name(e.by), e.amount, e.raisedAt, e.status, e.mode, e.timeline.map(function (t) { return t.s + (t.at ? ' @ ' + t.at : ''); }).join(' | ')]); });
        UI.downloadCSV('Accounts-Expenses.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── accounts/payroll ............................ ── */
(function () {
MDTPAGE({
  role: 'accounts',
  folder: 'accounts',
  id: 'payroll',
  render: function (view, ctx) {

    var me = ctx.person;
    var state = { run: 'PR-AUG' };
    function render() {
      var run = DB.payrollRuns.filter(function (r) { return r.id === state.run; })[0] || DB.payrollRuns[0];
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Payroll</h1><div class="sub">' + DB.staff.length + ' staff on roll · structure: basic + DA 42% + HRA 16% + other − statutory deductions</div></div>' +
        '<div class="actions"><button class="btn pri" id="runPR">' + UI.icon('play') + 'Process September 2026</button>' + UI.expBtn('prExp', 'Export payroll') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'g', icon: 'users', value: DB.staff.length, label: 'Staff on roll' }) +
        UI.stat({ tone: 'b', icon: 'rupee', value: UI.money(DB.payrollRuns.filter(function (r) { return r.status === 'Disbursed'; }).reduce(function (a, r) { return a + r.net; }, 0)), label: 'Disbursed (register)' }) +
        UI.stat({ tone: 'y', icon: 'chart', value: run.month, label: 'Selected run', sub: run.status }) +
        UI.stat({ tone: 'r', icon: 'clock', value: '30 Sep', label: 'Next draft date' }) +
        '</div>' +
        '<div class="rowflex mb16">' + UI.chiprow(DB.payrollRuns.map(function (r) { return { v: r.id, l: r.month.split(' ')[0] }; }), state.run) + '</div>' +
        UI.card('Run — ' + run.month, 'chart', UI.kv([
          ['Processed by', UI.esc(Q.name(run.runBy))],
          ['Run at', UI.esc(run.runAt || 'pending')],
          ['Staff covered', run.staff],
          ['Gross', UI.money(run.gross)],
          ['Net', '<b>' + UI.money(run.net) + '</b>'],
          ['Status', UI.badge(run.status)]
        ]) + (run.status !== 'Disbursed' ? '<div class="frow" style="justify-content:flex-start"><button class="btn ok" data-dis="' + run.id + '">' + UI.icon('rupee') + 'Disburse now</button></div>' : '')) +
        UI.card('Payroll structure — all staff', 'users', UI.table([
          { h: 'Staff', render: function (s) { return UI.avatar(s, 26) + ' <b>' + UI.esc(s.name) + '</b><div style="font-size:10px;color:var(--text-2)">' + UI.esc(s.designation) + '</div>'; } },
          { h: 'Basic', render: function (s) { return UI.money(DB.payroll[s.id].basic); } },
          { h: 'DA', render: function (s) { return UI.money(DB.payroll[s.id].da); } },
          { h: 'HRA', render: function (s) { return UI.money(DB.payroll[s.id].hra); } },
          { h: 'Deductions', render: function (s) { return '<span style="color:var(--red-ink)">' + UI.money(DB.payroll[s.id].deductions) + '</span>'; } },
          { h: 'Net / month', render: function (s) { return '<b class="num" style="color:var(--green-ink)">' + UI.money(DB.payroll[s.id].net) + '</b>'; } },
          { h: 'Payslip', render: function (s) { return '<span class="dl" data-ps="' + s.id + '">Generate</span>'; } }
        ], DB.staff)) +
        UI.hint('Payslips download as CSV documents with the full structure; the disbursement notification reaches every staff portal at once.', '', 'info');
      view.querySelectorAll('.chip[data-f]').forEach(function (c) { c.addEventListener('click', function () { state.run = c.getAttribute('data-f'); render(); }); });
      view.querySelectorAll('[data-dis]').forEach(function (b) { b.addEventListener('click', function () {
        WF.disbursePayroll(me.id, b.getAttribute('data-dis'));
        UI.toast('Payroll disbursed', 'All staff notified.', 'green'); render();
      }); });
      view.querySelectorAll('[data-ps]').forEach(function (el) { el.addEventListener('click', function () {
        var s = Q.person(el.getAttribute('data-ps'));
        var p = DB.payroll[s.id];
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'PAYSLIP — ' + run.month],
          ['Employee', s.name + ' (' + s.id + ')'],
          ['Designation', s.designation],
          [],
          ['Component', 'Amount (Rs)'],
          ['Basic', p.basic], ['Dearness Allowance', p.da], ['House Rent Allowance', p.hra], ['Other Allowances', p.other],
          ['Gross', p.basic + p.da + p.hra + p.other],
          ['Statutory Deductions', p.deductions],
          ['Net Pay', p.net],
          ['Bank', p.bank]
        ];
        UI.downloadCSV('Payslip-' + s.id + '-' + run.month.replace(' ', '-') + '.csv', rows);
        UI.toast('Payslip generated', s.name + ' · ' + run.month, 'green');
      }); });
      document.getElementById('runPR').addEventListener('click', function () {
        WF.runPayroll(me.id, 'September 2026');
        UI.toast('Payroll processed', 'Draft created — principal notified for disbursement.', 'green'); render();
      });
      var ex = document.getElementById('prExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'PAYROLL REGISTER — ' + run.month],
          ['Generated', Q.today()],
          [],
          ['Employee Code', 'Name', 'Designation', 'Basic', 'DA', 'HRA', 'Other', 'Deductions', 'Net', 'Bank']
        ];
        DB.staff.forEach(function (s) { var p = DB.payroll[s.id]; rows.push([s.id, s.name, s.designation, p.basic, p.da, p.hra, p.other, p.deductions, p.net, p.bank]); });
        UI.downloadCSV('Accounts-Payroll-' + run.month.replace(' ', '-') + '.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── accounts/profile ............................ ── */
(function () {
MDTPAGE({
  role: 'accounts',
  folder: 'accounts',
  id: 'profile',
  render: function (view, ctx) {

    var me = ctx.person;
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>My Profile</h1><div class="sub">Accounts &amp; finance office</div></div></div>' +
      '<div class="split-eq">' +
      '<div>' +
        '<div class="card glow glow-r accent-r">' + UI.photoBox(me, 'Your photo appears on receipts, payslips and vouchers passed by the accounts desk.') + '</div>' +
        UI.card('Office', 'cap', UI.kv([
          ['Employee code', '<b class="mono">' + me.id + '</b>'],
          ['Designation', UI.esc(me.designation)],
          ['Experience', me.exp + ' years'],
          ['Expertise', UI.esc(me.expertise)]
        ])) +
        UI.card('Scope of this portal', 'grid', '<ul style="margin:4px 0 0 16px;padding:0;font-size:12.5px;color:var(--text-2);line-height:1.9">' +
          '<li><b>Collections</b> — day book, mode split, reconciliation and defaulters.</li>' +
          '<li><b>Vouchers</b> — verify any office\u2019s expenses before the Principal approves.</li>' +
          '<li><b>Payroll</b> — monthly processing, payslips and disbursement.</li>' +
          '<li><b>Planning</b> — budget heads and the vendor / PO book.</li>' +
        '</ul>') +
      '</div>' +
      '<div>' +
        UI.card('Contact', 'idcard', UI.kv([
          ['Email', UI.esc(me.email)],
          ['Phone', UI.esc(me.phone)],
          ['Campus', DB.settings.institute + ', ' + DB.settings.city]
        ])) +
        UI.card('Connected approvals', 'shield', '<ul style="margin:4px 0 0 16px;padding:0;font-size:12.5px;color:var(--text-2);line-height:1.9">' +
          '<li>Warden <b>mess indents</b> and library <b>subscription bills</b> land here as vouchers.</li>' +
          '<li>Fee collections recorded by the <b>office desk</b> reconcile in the day book.</li>' +
          '<li>The <b>Principal</b> countersigns every voucher after your verification.</li>' +
          '<li>Payroll disbursement notifies <b>every staff member</b> at once.</li>' +
        '</ul>') +
        UI.card('Account', 'shield', UI.kv([
          ['Role', '<b>' + UI.esc(ctx.role) + '</b> — Accounts'],
          ['Access', 'Collections, vouchers, payroll, budgets, vendors'],
          ['Sign-in', UI.esc(ctx.user.lastLogin)]
        ])) +
      '</div></div>';

  }
});
})();

/* ── accounts/vendors ............................ ── */
(function () {
MDTPAGE({
  role: 'accounts',
  folder: 'accounts',
  id: 'vendors',
  render: function (view, ctx) {

    var me = ctx.person;
    function render() {
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Vendors &amp; Purchase Orders</h1><div class="sub">Empanelled suppliers, ratings from claim history and the live PO book</div></div>' +
        '<div class="actions"><button class="btn pri" id="newVN">' + UI.icon('plus') + 'Empanel a vendor</button>' + UI.expBtn('vnExp', 'Export vendors & POs') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'grid', value: DB.vendors.length, label: 'Vendors empanelled' }) +
        UI.stat({ tone: 'g', icon: 'file', value: DB.purchaseOrders.length, label: 'Purchase orders' }) +
        UI.stat({ tone: 'y', icon: 'clock', value: DB.purchaseOrders.filter(function (p) { return p.status !== 'Paid' && p.status.indexOf('Closed') < 0; }).length, label: 'Open POs' }) +
        UI.stat({ tone: 'r', icon: 'chart', value: UI.money(DB.purchaseOrders.reduce(function (a, p) { return a + p.amount; }, 0)), label: 'PO value (book)' }) +
        '</div>' +
        '<div class="split-eq">' +
        '<div>' + UI.card('Vendor register', 'grid', UI.table([
          { h: 'Vendor', render: function (v) { return '<b>' + UI.esc(v.name) + '</b><div style="font-size:10.5px;color:var(--text-2)">' + UI.esc(v.category) + ' · GSTIN ' + UI.esc(v.gstin) + '</div>'; } },
          { h: 'Phone', render: function (v) { return UI.esc(v.phone); } },
          { h: 'Rating', render: function (v) { return v.rating ? UI.starsRO(v.rating) : '<span class="tag n">new</span>'; } },
          { h: 'POs', render: function (v) { return '<b class="num">' + v.pos + '</b>'; } },
          { h: 'Status', render: function (v) { return UI.badge(v.status); } }
        ], DB.vendors)) + '</div>' +
        '<div>' + UI.card('Purchase order book', 'file', UI.table([
          { h: 'PO', render: function (p) { return '<span class="mono">' + UI.esc(p.id) + '</span>'; } },
          { h: 'Item', render: function (p) { return UI.esc(p.item) + '<div style="font-size:10px;color:var(--text-2">' + DB.vendors.filter(function (v) { return v.id === p.vendor; }).map(function (v) { return UI.esc(v.name); })[0] + ' · linked to ' + UI.esc(p.linked) + '</div>'; } },
          { h: 'Qty', render: function (p) { return p.qty; } },
          { h: 'Value', render: function (p) { return UI.money(p.amount); } },
          { h: 'Date', render: function (p) { return UI.fmtDate(p.date); } },
          { h: 'Status', render: function (p) { return UI.badge(p.status); } }
        ], DB.purchaseOrders)) +
        UI.card('Raise a purchase order', 'edit',
          UI.field('po-i', 'Item / description', '<input class="input" id="po-i" placeholder="e.g. Lab stools — 24 nos">', true) +
          '<div class="fgrid">' +
          UI.field('po-v', 'Vendor', UI.select('po-v', DB.vendors.map(function (v) { return { v: v.id, l: v.name }; }), '', 'Select vendor'), true) +
          UI.field('po-q', 'Quantity', '<input class="input" id="po-q" type="number" min="1" value="1">') +
          UI.field('po-a', 'Value (₹)', '<input class="input" id="po-a" type="number" min="1" placeholder="e.g. 48000">', true) + '</div>' +
          '<div class="frow" style="justify-content:flex-start"><button class="btn pri" id="po-go">' + UI.icon('check') + 'Raise PO</button></div>') + '</div>' +
        '</div>';
      document.getElementById('po-go').addEventListener('click', function () {
        var i = document.getElementById('po-i').value, a = document.getElementById('po-a').value, v = document.getElementById('po-v').value;
        if (!i || !a || !v) { UI.toast('Item, vendor and value required', '', 'red'); return; }
        WF.createPO(me.id, { item: i, vendor: v, qty: document.getElementById('po-q').value, amount: a });
        UI.toast('PO raised', 'Logged in the book.', 'green'); render();
      });
      document.getElementById('newVN').addEventListener('click', function () {
        UI.modal({ title: 'Empanel a vendor', body:
          UI.field('vn-n', 'Vendor name', '<input class="input" id="vn-n" placeholder="e.g. Sri Balaji Stationery">', true) +
          '<div class="fgrid">' +
          UI.field('vn-c', 'Category', UI.select('vn-c', ['Books & Periodicals', 'Journals & Databases', 'Mess Provisions', 'Lab & Equipment', 'IT & Networking', 'Utilities', 'Housekeeping', 'Transport']), true) +
          UI.field('vn-g', 'GSTIN', '<input class="input" id="vn-g" placeholder="33ABCDE1234F1Z5">') +
          UI.field('vn-p', 'Phone', '<input class="input" id="vn-p" placeholder="+91 …">') + '</div>',
          actions: '<button class="btn pri" id="vn-go">' + UI.icon('check') + 'Empanel</button>' });
        document.getElementById('vn-go').addEventListener('click', function () {
          var n = document.getElementById('vn-n').value;
          if (!n) { UI.toast('Name required', '', 'red'); return; }
          WF.addVendor(me.id, { name: n, category: document.getElementById('vn-c').value, gstin: document.getElementById('vn-g').value, phone: document.getElementById('vn-p').value });
          UI.closeModal(); UI.toast('Vendor empanelled', 'Register updated.', 'green'); render();
        });
      });
      var ex = document.getElementById('vnExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'VENDOR & PURCHASE ORDER REGISTER'],
          ['Generated', Q.today()],
          [],
          ['Vendor', 'Category', 'GSTIN', 'Phone', 'Rating', 'POs', 'Status'],
          []
        ];
        DB.vendors.forEach(function (v) { rows.push([v.name, v.category, v.gstin, v.phone, v.rating || '', v.pos, v.status]); });
        rows.push([], ['PO', 'Vendor', 'Item', 'Qty', 'Value (Rs)', 'Date', 'Linked', 'Status']);
        DB.purchaseOrders.forEach(function (p) { rows.push([p.id, DB.vendors.filter(function (v) { return v.id === p.vendor; }).map(function (v) { return v.name; })[0] || p.vendor, p.item, p.qty, p.amount, p.date, p.linked, p.status]); });
        UI.downloadCSV('Accounts-Vendors-POs.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── iqac/audits ................................. ── */
(function () {
MDTPAGE({
  role: 'iqac',
  folder: 'iqac',
  id: 'audits',
  render: function (view, ctx) {

    var me = ctx.person;
    function render() {
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Audit Calendar</h1><div class="sub">Internal, departmental, administrative and compliance audits with findings and closure tracking</div></div>' +
        '<div class="actions"><button class="btn pri" id="newAU">' + UI.icon('plus') + 'Schedule an audit</button>' + UI.expBtn('auExp', 'Export audit register') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'checkc', value: DB.audits.length, label: 'Audits on record' }) +
        UI.stat({ tone: 'g', icon: 'lock', value: DB.audits.filter(function (a) { return a.status === 'Closed'; }).length, label: 'Closed cleanly' }) +
        UI.stat({ tone: 'y', icon: 'door', value: DB.audits.filter(function (a) { return a.status === 'Follow-up Pending'; }).length, label: 'Follow-up pending' }) +
        UI.stat({ tone: 'r', icon: 'calendar', value: DB.audits.filter(function (a) { return a.status === 'Scheduled'; }).length, label: 'Scheduled ahead' }) +
        '</div>' +
        '<div class="grid g2">' + DB.audits.map(function (a) {
          var tone = a.status === 'Closed' ? 'g' : a.status === 'Scheduled' ? 'b' : 'y';
          return '<div class="card glow glow-' + tone + ' accent-' + tone + '"><div class="spread">' +
            '<div><b>' + UI.esc(a.type) + '</b><div style="font-size:11px;color:var(--text-2)">' + UI.esc(a.scope) + '</div></div>' + UI.badge(a.status) + '</div>' +
            '<div class="mt8">' + UI.kv([
              ['Date', a.date ? UI.fmtDate(a.date) : 'to be fixed'],
              ['Team', UI.esc(a.team)],
              ['Findings', a.findings ? '<b style="color:var(--red-ink)">' + a.findings + '</b>' : '0'],
              ['Actions closed', a.actions + (a.findings ? ' of ' + a.findings : '')],
              ['Note', UI.esc(a.note || '—')]
            ]) + '</div>' +
            (a.status === 'Follow-up Pending' ? '<div class="frow" style="justify-content:flex-start"><button class="btn sm ok" data-acl="' + a.id + '">' + UI.icon('check') + 'Close follow-up</button></div>' : '') +
            '</div>';
        }).join('') + '</div>';
      view.querySelectorAll('[data-acl]').forEach(function (b) { b.addEventListener('click', function () {
        var a = DB.audits.filter(function (x) { return x.id === b.getAttribute('data-acl'); })[0];
        a.status = 'Closed'; a.actions = a.findings;
        WF.commit(me.id, 'Closed audit follow-up', a.type + ' — ' + a.scope);
        UI.toast('Follow-up closed', 'Audit register updated.', 'green'); render();
      }); });
      document.getElementById('newAU').addEventListener('click', function () {
        UI.modal({ title: 'Schedule an audit', body:
          UI.field('na-t', 'Type', UI.select('na-t', ['Internal Academic Audit', 'Departmental Audit', 'Administrative Audit', 'Compliance Review', 'Internal Quality Audit']), true) +
          UI.field('na-s', 'Scope', '<input class="input" id="na-s" placeholder="e.g. ECE — lab registers & safety">', true) +
          '<div class="fgrid">' +
          UI.field('na-d', 'Date', '<input class="input" id="na-d" type="date" min="' + Q.today() + '">', true) +
          UI.field('na-tm', 'Team', '<input class="input" id="na-tm" placeholder="e.g. IQ1, AD1">') + '</div>' +
          UI.field('na-n', 'Note', '<input class="input" id="na-n" placeholder="Focus areas / checklist">'),
          actions: '<button class="btn pri" id="na-go">' + UI.icon('check') + 'Schedule</button>' });
        document.getElementById('na-go').addEventListener('click', function () {
          var t = document.getElementById('na-t').value, s = document.getElementById('na-s').value, d = document.getElementById('na-d').value;
          if (!t || !s || !d) { UI.toast('Type, scope and date required', '', 'red'); return; }
          WF.scheduleAudit(me.id, { type: t, scope: s, date: d, team: document.getElementById('na-tm').value || 'IQAC team', note: document.getElementById('na-n').value });
          UI.closeModal(); UI.toast('Audit scheduled', 'Principal notified.', 'green'); render();
        });
      });
      var ex = document.getElementById('auExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'AUDIT REGISTER'],
          ['Generated', Q.today()],
          [],
          ['Type', 'Scope', 'Date', 'Team', 'Findings', 'Actions', 'Status', 'Note']
        ];
        DB.audits.forEach(function (a) { rows.push([a.type, a.scope, a.date, a.team, a.findings, a.actions, a.status, a.note]); });
        UI.downloadCSV('IQAC-Audits.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── iqac/copo ................................... ── */
(function () {
MDTPAGE({
  role: 'iqac',
  folder: 'iqac',
  id: 'copo',
  render: function (view, ctx) {

    var state = { dept: 'all', course: DB.courses[0].id };
    function render() {
      var courses = DB.courses.filter(function (c) { return state.dept === 'all' || c.dept === state.dept; });
      if (!courses.filter(function (c) { return c.id === state.course; }).length) state.course = courses[0].id;
      var c = Q.courseById(state.course);
      var cos = DB.courseCOs[state.course] || [];
      var pmap = DB.poMaps[state.course] || {};
      var poCols = DB.programOutcomes.map(function (p) { return p.po; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>CO-PO Attainment</h1><div class="sub">Direct attainment from course outcomes to programme outcomes · levels 1–3 · all courses mapped</div></div>' +
        '<div class="actions">' + UI.expBtn('cpExp', 'Export attainment') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'chart', value: DB.courses.length, label: 'Courses mapped' }) +
        UI.stat({ tone: 'g', icon: 'grid', value: DB.courses.length * 5, label: 'Course outcomes' }) +
        UI.stat({ tone: 'y', icon: 'layers', value: DB.programOutcomes.length, label: 'Programme outcomes' }) +
        UI.stat({ tone: 'r', icon: 'medal', value: Math.round(cos.reduce(function (a, co) { return a + co.att; }, 0) / (cos.length || 1)) + '%', label: 'This course — avg attainment' }) +
        '</div>' +
        '<div class="rowflex mb16" style="gap:8px;flex-wrap:wrap">' +
        UI.chiprow([{ v: 'all', l: 'All departments' }, { v: 'CSE', l: 'CSE' }, { v: 'ECE', l: 'ECE' }], state.dept) +
        UI.select('cp-course', courses.map(function (x) { return { v: x.id, l: x.id + ' · ' + x.title.slice(0, 30) }; }), state.course) + '</div>' +
        '<div class="split">' +
        '<div>' +
        UI.card(c.id + ' — course outcomes', 'layers', UI.table([
          { h: 'CO', render: function (co) { return '<b class="mono">' + co.co + '</b>'; } },
          { h: 'Statement', render: function (co) { return UI.esc(co.stmt); } },
          { h: 'Attainment', render: function (co) { return UI.bar(co.att, co.att >= 70 ? 'g' : co.att >= 55 ? 'y' : 'r'); } },
          { h: 'Level', render: function (co) { return co.att >= 70 ? UI.badge('High') : co.att >= 55 ? UI.badge('Moderate') : UI.badge('Low'); } }
        ], cos)) +
        UI.hint('Direct attainment derives from the internal assessment record of every enrolled student; levels follow the institutional rubric (70+ high · 55–69 moderate · below 55 low).', '', 'info') +
        '</div><div>' +
        UI.card('CO × PO mapping matrix — ' + c.id, 'grid', (function () {
          var h = '<div class="tblwrap"><table class="tbl"><thead><tr><th>CO \\ PO</th>' + poCols.map(function (p) { return '<th>' + p.replace('PO', '') + '</th>'; }).join('') + '</tr></thead><tbody>';
          cos.forEach(function (co) {
            h += '<tr><td data-lbl="CO"><b>' + co.co + '</b></td>';
            poCols.forEach(function (po) {
              var link = (pmap[co.co] || []).filter(function (m) { return m.po === po; })[0];
              h += '<td data-lbl="' + po + '">' + (link ? '<span class="tag ' + (link.lvl === 3 ? 'g' : link.lvl === 2 ? 'y' : 'b') + '">' + link.lvl + '</span>' : '<span style="color:var(--text-3)">—</span>') + '</td>';
            });
            h += '</tr>';
          });
          return h + '</tbody></table></div>';
        })()) +
        UI.card('Programme outcomes', 'list', UI.table([
          { h: 'PO', render: function (p) { return '<b class="mono">' + p.po + '</b>'; } },
          { h: 'Statement', render: function (p) { return UI.esc(p.stmt); } }
        ], DB.programOutcomes), null, null) +
        '</div></div>';
      view.querySelectorAll('.chip[data-f]').forEach(function (ch) { ch.addEventListener('click', function () { state.dept = ch.getAttribute('data-f'); render(); }); });
      document.getElementById('cp-course').addEventListener('change', function (e) { state.course = e.target.value; render(); });
      var ex = document.getElementById('cpExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'CO-PO ATTAINMENT REGISTER — ALL COURSES'],
          ['Generated', Q.today()],
          [],
          ['Course', 'CO', 'Statement', 'Direct Attainment %', 'Level']
        ];
        Object.keys(DB.courseCOs).forEach(function (cid) {
          DB.courseCOs[cid].forEach(function (co) {
            rows.push([cid, co.co, co.stmt, co.att, co.att >= 70 ? 'High' : co.att >= 55 ? 'Moderate' : 'Low']);
          });
        });
        rows.push([], ['CO-PO MAPPING (correlation levels 1-3)']);
        rows.push(['Course', 'CO', 'PO', 'Level']);
        Object.keys(DB.poMaps).forEach(function (cid) {
          Object.keys(DB.poMaps[cid]).forEach(function (co) {
            DB.poMaps[cid][co].forEach(function (m) { rows.push([cid, co, m.po, m.lvl]); });
          });
        });
        UI.downloadCSV('IQAC-COPO-Attainment.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── iqac/criteria ............................... ── */
(function () {
MDTPAGE({
  role: 'iqac',
  folder: 'iqac',
  id: 'criteria',
  render: function (view, ctx) {

    var me = ctx.person;
    function render() {
      var total = DB.naacCriteria.reduce(function (a, c) { return a + c.weight; }, 0);
      var weighted = DB.naacCriteria.reduce(function (a, c) { return a + c.readiness * c.weight; }, 0) / total;
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Accreditation Criteria Readiness</h1><div class="sub">Seven-criteria framework · data points, evidence status and weighted readiness for the self-study report</div></div>' +
        '<div class="actions">' + UI.expBtn('crExp', 'Export readiness') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'g', icon: 'medal', value: Math.round(weighted) + '%', label: 'Weighted readiness', sub: 'weighted by criteria marks' }) +
        UI.stat({ tone: 'b', icon: 'grid', value: DB.naacCriteria.reduce(function (a, c) { return a + c.dataPoints; }, 0), label: 'Data points collected' }) +
        UI.stat({ tone: 'y', icon: 'file', value: DB.naacCriteria.filter(function (c) { return c.evidence === 'In Progress'; }).length, label: 'Evidence in progress' }) +
        UI.stat({ tone: 'r', icon: 'calendar', value: 'Q1 2027', label: 'Visit window (planned)' }) +
        '</div>' +
        UI.donut(Math.round(weighted), 'green', 150, 'ready') +
        '<div class="mt16"></div>' +
        UI.card('Criteria register', 'medal', UI.table([
          { h: 'Criteria', render: function (c) { return '<b>' + c.c + ' · ' + UI.esc(c.name) + '</b>'; } },
          { h: 'Weight', render: function (c) { return c.weight + '%'; } },
          { h: 'Data points', render: function (c) { return '<b class="num">' + c.dataPoints + '</b>'; } },
          { h: 'Evidence', render: function (c) { return UI.badge(c.evidence); } },
          { h: 'Readiness', render: function (c) { return UI.bar(c.readiness, c.readiness > 85 ? 'g' : c.readiness > 75 ? 'y' : 'r'); } },
          { h: 'Action', render: function (c) { return '<span class="dl" data-cr="' + c.c + '">Update</span>'; } }
        ], DB.naacCriteria)) +
        UI.hint('Readiness updates log to the activity trail and appear on the Principal\u2019s quality overview instantly.', '', 'info');
      view.querySelectorAll('[data-cr]').forEach(function (el) { el.addEventListener('click', function () {
        var c = DB.naacCriteria.filter(function (x) { return x.c === el.getAttribute('data-cr'); })[0];
        UI.modal({ title: c.c + ' — ' + c.name, body:
          UI.field('uc-r', 'Readiness %', '<input class="input" id="uc-r" type="number" min="0" max="100" value="' + c.readiness + '">', true) +
          UI.field('uc-e', 'Evidence status', UI.select('uc-e', ['Complete', 'In Progress', 'Not Started'], c.evidence), true),
          actions: '<button class="btn pri" id="uc-go">' + UI.icon('check') + 'Save</button>' });
        document.getElementById('uc-go').addEventListener('click', function () {
          WF.updateCriteria(me.id, c.c, document.getElementById('uc-r').value, document.getElementById('uc-e').value);
          UI.closeModal(); UI.toast('Criteria updated', 'Register and principal view refreshed.', 'green'); render();
        });
      }); });
      var ex = document.getElementById('crExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'NAAC CRITERIA READINESS'],
          ['Generated', Q.today()],
          [],
          ['Criteria', 'Name', 'Weight %', 'Data Points', 'Evidence', 'Readiness %']
        ];
        DB.naacCriteria.forEach(function (c) { rows.push([c.c, c.name, c.weight, c.dataPoints, c.evidence, c.readiness]); });
        UI.downloadCSV('IQAC-NAAC-Criteria.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── iqac/dashboard .............................. ── */
(function () {
MDTPAGE({
  role: 'iqac',
  folder: 'iqac',
  id: 'dashboard',
  render: function (view, ctx) {

    var me = ctx.person;
    var ongoing = DB.surveys.filter(function (s) { return s.status === 'Ongoing'; });
    var upcoming = DB.surveys.filter(function (s) { return s.status === 'Upcoming'; });
    var completed = DB.surveys.filter(function (s) { return s.status === 'Completed'; });
    var readiness = DB.naacCriteria.reduce(function (a, c) { return a + c.readiness; }, 0) / DB.naacCriteria.length;
    var copoAvg = {};
    Object.keys(DB.courseCOs).forEach(function (cid) { DB.courseCOs[cid].forEach(function (co) { copoAvg[cid] = (copoAvg[cid] || 0) + co.att; }); });
    var avgAtt = Math.round(Object.keys(copoAvg).reduce(function (a, cid) { return a + copoAvg[cid] / 5; }, 0) / Object.keys(copoAvg).length);
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>' + UI.esc(me.name) + '</h1><div class="sub">' + UI.esc(me.designation) + '</div></div></div>' +
      '<div class="statrow">' +
      UI.stat({ tone: 'b', icon: 'list', value: ongoing.length, label: 'Surveys running', sub: upcoming.length + ' upcoming', href: 'surveys.html' }) +
      UI.stat({ tone: 'g', icon: 'chart', value: avgAtt + '%', label: 'Avg CO attainment', sub: 'direct, all courses', href: 'copo.html' }) +
      UI.stat({ tone: 'y', icon: 'medal', value: Math.round(readiness) + '%', label: 'NAAC readiness', sub: DB.naacCriteria.length + ' criteria', href: 'criteria.html' }) +
      UI.stat({ tone: 'r', icon: 'checkc', value: DB.audits.filter(function (a) { return a.status === 'Scheduled'; }).length, label: 'Audits scheduled', href: 'audits.html' }) +
      '</div>' +
      '<div class="split">' +
      '<div>' +
      UI.card('Survey cycles', 'list', UI.table([
          { h: 'Survey', render: function (s) { return '<b>' + UI.esc(s.title) + '</b><div style="font-size:10.5px;color:var(--text-2)">' + s.type + ' · ' + s.questions.length + ' questions</div>'; } },
          { h: 'Responses', render: function (s) { return '<b class="num">' + s.submitted + '/' + s.assigned + '</b>'; } },
          { h: 'Completion', render: function (s) { return UI.bar(Math.round(s.submitted / (s.assigned || 1) * 100), 'y'); } },
          { h: 'Window', render: function (s) { return UI.fmtDate(s.from) + ' → ' + UI.fmtDate(s.to); } },
          { h: 'Status', render: function (s) { return UI.badge(s.status); } }
        ], DB.surveys), null, { href: 'surveys.html', label: 'Administer' }) +
      UI.card('Audit calendar', 'checkc', UI.table([
          { h: 'Audit', render: function (a) { return '<b>' + UI.esc(a.type) + '</b><div style="font-size:10.5px;color:var(--text-2)">' + UI.esc(a.scope) + '</div>'; } },
          { h: 'Date', render: function (a) { return UI.fmtDate(a.date); } },
          { h: 'Findings', render: function (a) { return a.findings ? UI.badge('Follow-up') : '—'; } },
          { h: 'Status', render: function (a) { return UI.badge(a.status); } }
        ], DB.audits), null, { href: 'audits.html', label: 'Audits' }) +
      '</div><div>' +
      UI.card('NAAC criteria readiness', 'chart', UI.barsChart(DB.naacCriteria.map(function (c) {
          return { l: c.c + ' ' + c.name.split(' ')[0], v: c.readiness, n: c.readiness + '%', tone: c.readiness > 85 ? 'g' : c.readiness > 75 ? 'y' : 'r' };
        })), null, { href: 'criteria.html', label: 'Criteria' }) +
      UI.card('Quick actions', 'grid', '<div class="quickgrid">' +
        '<a class="bigbtn-tile" href="surveys.html">' + UI.icon('list') + '<b>Surveys</b></a>' +
        '<a class="bigbtn-tile" href="copo.html">' + UI.icon('chart') + '<b>CO-PO</b></a>' +
        '<a class="bigbtn-tile" href="reports.html">' + UI.icon('file') + '<b>Reports</b></a>' +
        '<a class="bigbtn-tile" href="audits.html">' + UI.icon('checkc') + '<b>Audit</b></a>' +
        '</div>') +
      UI.card('Completed cycles (archive)', 'checkc', completed.length ? UI.table([
          { h: 'Survey', render: function (s) { return UI.esc(s.title); } },
          { h: 'Responses', render: function (s) { return s.submitted + '/' + s.assigned; } },
          { h: 'Closed', render: function (s) { return UI.fmtDate(s.to); } }
        ], completed) : UI.empty('No completed cycles yet this term', 'checkc')) +
      '</div></div>';

  }
});
})();

/* ── iqac/profile ................................ ── */
(function () {
MDTPAGE({
  role: 'iqac',
  folder: 'iqac',
  id: 'profile',
  render: function (view, ctx) {

    var me = ctx.person;
    view.innerHTML =
      '<div class="pagehead"><div class="ph-t"><h1>My Profile</h1><div class="sub">Internal Quality Assurance Cell &amp; accreditation</div></div></div>' +
      '<div class="split-eq">' +
      '<div>' +
        '<div class="card glow glow-y accent-y">' + UI.photoBox(me, 'Your photo appears on audit notices, survey communications and accreditation letters.') + '</div>' +
        UI.card('Office', 'cap', UI.kv([
          ['Employee code', '<b class="mono">' + me.id + '</b>'],
          ['Designation', UI.esc(me.designation)],
          ['Experience', me.exp + ' years'],
          ['Expertise', UI.esc(me.expertise)]
        ])) +
        UI.card('Scope of this portal', 'grid', '<ul style="margin:4px 0 0 16px;padding:0;font-size:12.5px;color:var(--text-2);line-height:1.9">' +
          '<li><b>Surveys</b> — create, assign, monitor and close feedback cycles.</li>' +
          '<li><b>Attainment</b> — CO-PO mapping and direct attainment analytics.</li>' +
          '<li><b>Reports</b> — question averages, individual feedback statements.</li>' +
          '<li><b>Accreditation</b> — audit calendar and criteria readiness.</li>' +
        '</ul>') +
      '</div>' +
      '<div>' +
        UI.card('Contact', 'idcard', UI.kv([
          ['Email', UI.esc(me.email)],
          ['Phone', UI.esc(me.phone)],
          ['Campus', DB.settings.institute + ', ' + DB.settings.city]
        ])) +
        UI.card('Connected approvals', 'shield', '<ul style="margin:4px 0 0 16px;padding:0;font-size:12.5px;color:var(--text-2);line-height:1.9">' +
          '<li>Survey assignment reaches <b>every student</b>\u2019s feedback page instantly.</li>' +
          '<li>Audit schedules notify the <b>Principal</b> and the teams involved.</li>' +
          '<li>Faculty <b>marks entry</b> feeds the direct-attainment pipeline.</li>' +
          '<li>The <b>Principal</b>\u2019s quality overview mirrors this cell\u2019s registers.</li>' +
        '</ul>') +
        UI.card('Account', 'shield', UI.kv([
          ['Role', '<b>' + UI.esc(ctx.role) + '</b> — IQAC'],
          ['Access', 'Surveys, CO-PO, reports, audits, criteria'],
          ['Sign-in', UI.esc(ctx.user.lastLogin)]
        ])) +
      '</div></div>';

  }
});
})();

/* ── iqac/reports ................................ ── */
(function () {
MDTPAGE({
  role: 'iqac',
  folder: 'iqac',
  id: 'reports',
  render: function (view, ctx) {

    var me = ctx.person;
    function render() {
      var sv01 = DB.surveys.filter(function (s) { return s.id === 'SV01'; })[0];
      var sv02 = DB.surveys.filter(function (s) { return s.id === 'SV02'; })[0];
      var sv03 = DB.surveys.filter(function (s) { return s.id === 'SV03'; })[0];
      function qAvg(svId, q) {
        var rs = DB.surveyResponses[svId] || {};
        var sum = 0, n = 0;
        Object.keys(rs).forEach(function (sid) { if (rs[sid][q]) { sum += rs[sid][q]; n++; } });
        return n ? +(sum / n).toFixed(2) : 0;
      }
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Feedback Reports</h1><div class="sub">Course feedback analytics, facility feedback, and the outgoing-batch placement report</div></div>' +
        '<div class="actions">' + UI.expBtn('frExp', 'Export report set') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'b', icon: 'chart', value: '3', label: 'Report lines ready' }) +
        UI.stat({ tone: 'g', icon: 'checkc', value: (sv03 ? sv03.submitted : 0) + (sv01 ? sv01.submitted : 0) + (sv02 ? sv02.submitted : 0), label: 'Responses analysed' }) +
        UI.stat({ tone: 'y', icon: 'list', value: (sv01 ? sv01.questions.length : 0) + (sv02 ? sv02.questions.length : 0), label: 'Question constructs' }) +
        UI.stat({ tone: 'r', icon: 'calendar', value: 'Oct', label: 'Next SSR cut', sub: 'self-study report' }) +
        '</div>' +
        '<div class="split">' +
        '<div>' +
        UI.card('Course feedback — question averages (Sep cycle)', 'chart', (function () {
          var sv = DB.surveys.filter(function (s) { return s.id === 'SV01'; })[0];
          return UI.barsChart(sv.questions.map(function (q, i) {
            var v = qAvg('SV01', i + 1);
            return { l: 'Q' + (i + 1), v: v / 5 * 100, n: v + ' / 5', tone: v >= 4 ? 'g' : v >= 3 ? 'y' : 'r' };
          }));
        })()) +
        UI.card('Individual student feedback — lookup', 'users',
          UI.field('fs-s', 'Student', UI.select('fs-s', DB.students.slice(0, 48).map(function (s) { return { v: s.id, l: s.name + ' · ' + s.reg }; }), '', 'Select student'), true) +
          '<div class="frow" style="justify-content:flex-start"><button class="btn pri" id="fs-go">' + UI.icon('file') + 'Generate report</button></div>' +
          UI.hint('Generates the per-student feedback statement with their own ratings against class averages.', '', 'info')) +
        '</div><div>' +
        UI.card('Library services survey — averages', 'chart', (function () {
          var sv = DB.surveys.filter(function (s) { return s.id === 'SV02'; })[0];
          return UI.barsChart(sv.questions.map(function (q, i) {
            var v = qAvg('SV02', i + 1);
            return { l: 'Q' + (i + 1), v: v / 5 * 100, n: v + ' / 5', tone: v >= 4 ? 'g' : v >= 3 ? 'y' : 'r' };
          }));
        })()) +
        UI.card('Placement feedback — outgoing batch (completed)', 'briefcase', UI.kv([
          ['Responses', sv03 ? sv03.submitted + ' of ' + sv03.assigned : '—'],
          ['Training adequacy', qAvg('SV03', 1) + ' / 5'],
          ['Process & communication', qAvg('SV03', 2) + ' / 5'],
          ['Interview fairness', qAvg('SV03', 3) + ' / 5'],
          ['Offer experience', qAvg('SV03', 4) + ' / 5']
        ])) +
        '</div></div>';
      document.getElementById('fs-go').addEventListener('click', function () {
        var sid = document.getElementById('fs-s').value;
        if (!sid) { UI.toast('Select a student', '', 'red'); return; }
        var s = Q.studentById(sid);
        var rs = (DB.surveyResponses['SV01'] || {})[sid];
        var sv = DB.surveys.filter(function (x) { return x.id === 'SV01'; })[0];
        var body = UI.kv([['Student', UI.esc(s.name) + ' (' + s.reg + ')'], ['Class', s.classId], ['Cycle', sv.title]]) +
          UI.table([
            { h: 'Question', render: function (q, i) { return UI.esc(q); } },
            { h: 'Student rating', render: function (q, i) { return rs && rs[i + 1] ? '<b>' + rs[i + 1] + ' / 5</b>' : UI.badge('Not submitted'); } },
            { h: 'Class average', render: function (q, i) { return qAvg('SV01', i + 1) + ' / 5'; } }
          ], sv.questions);
        UI.modal({ title: 'Individual feedback report', body: body, actions: '<button class="btn pri" onclick="UI.closeModal()">Close</button>' });
        WF.commit(me.id, 'Generated individual feedback report', s.name + ' — ' + s.reg);
      });
      var ex = document.getElementById('frExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'FEEDBACK REPORT SET — SURVEY AVERAGES'],
          ['Generated', Q.today()],
          [],
          ['Survey', 'Type', 'Status', 'Assigned', 'Submitted', 'Completion %']
        ];
        DB.surveys.forEach(function (s) { rows.push([s.title, s.type, s.status, s.assigned, s.submitted, Math.round(s.submitted / (s.assigned || 1) * 100) + '%']); });
        rows.push([], ['QUESTION AVERAGES']);
        rows.push(['Survey', 'Question', 'Average (of 5)']);
        DB.surveys.forEach(function (s) {
          s.questions.forEach(function (q, i) {
            var rs = DB.surveyResponses[s.id] || {};
            var sum = 0, n = 0;
            Object.keys(rs).forEach(function (sid) { if (rs[sid][i + 1]) { sum += rs[sid][i + 1]; n++; } });
            if (n) rows.push([s.title, q, +(sum / n).toFixed(2)]);
          });
        });
        UI.downloadCSV('IQAC-FeedbackReports.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── iqac/surveys ................................ ── */
(function () {
MDTPAGE({
  role: 'iqac',
  folder: 'iqac',
  id: 'surveys',
  render: function (view, ctx) {

    var me = ctx.person;
    var state = { tab: 'Ongoing' };
    function render() {
      var list = DB.surveys.filter(function (s) { return state.tab === 'All' || s.status === state.tab; });
      view.innerHTML =
        '<div class="pagehead"><div class="ph-t"><h1>Survey Administration</h1><div class="sub">Course feedback, facility feedback, exit, placement and alumni cycles — created, assigned and monitored here</div></div>' +
        '<div class="actions"><button class="btn pri" id="newSV">' + UI.icon('plus') + 'Create a survey</button>' + UI.expBtn('svExp', 'Export surveys') + '</div></div>' +
        '<div class="statrow">' +
        UI.stat({ tone: 'g', icon: 'play', value: DB.surveys.filter(function (s) { return s.status === 'Ongoing'; }).length, label: 'Ongoing' }) +
        UI.stat({ tone: 'b', icon: 'calendar', value: DB.surveys.filter(function (s) { return s.status === 'Upcoming'; }).length, label: 'Upcoming' }) +
        UI.stat({ tone: 'y', icon: 'checkc', value: DB.surveys.filter(function (s) { return s.status === 'Completed'; }).length, label: 'Completed' }) +
        UI.stat({ tone: 'r', icon: 'chart', value: DB.surveys.reduce(function (a, s) { return a + s.submitted; }, 0), label: 'Responses collected' }) +
        '</div>' +
        '<div class="rowflex mb16">' + UI.chiprow([
          { v: 'Ongoing', l: 'Ongoing', c: DB.surveys.filter(function (s) { return s.status === 'Ongoing'; }).length },
          { v: 'Upcoming', l: 'Upcoming', c: DB.surveys.filter(function (s) { return s.status === 'Upcoming'; }).length },
          { v: 'Completed', l: 'Completed', c: DB.surveys.filter(function (s) { return s.status === 'Completed'; }).length },
          { v: 'All', l: 'All', c: DB.surveys.length }
        ], state.tab) + '</div>' +
        UI.card('Cycles — ' + state.tab, 'list', UI.table([
          { h: 'Survey', render: function (s) { return '<b>' + UI.esc(s.title) + '</b><div style="font-size:10.5px;color:var(--text-2)">' + s.type + ' · template ' + UI.esc(s.template) + ' · ' + s.questions.length + ' questions</div>'; } },
          { h: 'Audience', render: function (s) { return UI.esc(s.audience); } },
          { h: 'Assigned', render: function (s) { return '<b class="num">' + s.assigned + '</b>'; } },
          { h: 'Submitted', render: function (s) { return '<b class="num" style="color:var(--green-ink)">' + s.submitted + '</b>' + (s.assigned - s.submitted > 0 ? '<div style="font-size:10px;color:var(--text-3)">' + (s.assigned - s.submitted) + ' pending</div>' : ''); } },
          { h: 'Completion', render: function (s) { return UI.bar(Math.round(s.submitted / (s.assigned || 1) * 100), 'y'); } },
          { h: 'Window', render: function (s) { return UI.fmtDate(s.from) + '<div style="font-size:10px;color:var(--text-2)">to ' + UI.fmtDate(s.to) + '</div>'; } },
          { h: 'Status', render: function (s) { return UI.badge(s.status); } },
          { h: 'Action', render: function (s) {
              var acts = [];
              if (!s.assigned && s.status !== 'Completed') acts.push('<span class="dl" data-asg="' + s.id + '">Assign</span>');
              if (s.status === 'Ongoing') acts.push('<span class="dl" data-close="' + s.id + '" style="color:var(--red-ink)">Close</span>');
              acts.push('<span class="dl" data-qs="' + s.id + '" style="color:var(--blue-ink)">Questions</span>');
              return acts.join(' ');
            } }
        ], list)) +
        UI.hint('Assignment pushes the survey to every student\u2019s Feedback Surveys page; closing freezes responses and reports become final.', '', 'info');
      view.querySelectorAll('.chip[data-f]').forEach(function (c) { c.addEventListener('click', function () { state.tab = c.getAttribute('data-f'); render(); }); });
      view.querySelectorAll('[data-asg]').forEach(function (el) { el.addEventListener('click', function () {
        var s = DB.surveys.filter(function (x) { return x.id === el.getAttribute('data-asg'); })[0];
        UI.modal({ title: 'Assign — ' + s.title, body:
          UI.field('as-s', 'Respondents', UI.select('as-s', [{ v: 'all', l: 'All students (144)' }, { v: 'hostellers', l: 'Hostellers only' }, { v: 'sem5', l: 'Sem V students (96)' }]), true) +
          UI.hint('Students see the survey instantly on their portal with the response window.', '', 'info'),
          actions: '<button class="btn pri" id="as-go">' + UI.icon('check') + 'Assign & open</button>' });
        document.getElementById('as-go').addEventListener('click', function () {
          var scope = document.getElementById('as-s').value;
          WF.assignSurvey(me.id, s.id, scope);
          UI.closeModal(); UI.toast('Survey assigned', 'Students notified.', 'green'); render();
        });
      }); });
      view.querySelectorAll('[data-close]').forEach(function (el) { el.addEventListener('click', function () {
        WF.closeSurvey(me.id, el.getAttribute('data-close'));
        UI.toast('Survey closed', 'Responses frozen; reports final.', 'green'); render();
      }); });
      view.querySelectorAll('[data-qs]').forEach(function (el) { el.addEventListener('click', function () {
        var s = DB.surveys.filter(function (x) { return x.id === el.getAttribute('data-qs'); })[0];
        UI.modal({ title: s.title, body: UI.kv([['Type', s.type], ['Template', UI.esc(s.template)], ['Audience', UI.esc(s.audience)], ['Window', UI.fmtDate(s.from) + ' → ' + UI.fmtDate(s.to)]]) +
          '<div style="margin-top:10px;font-size:12.5px;color:var(--text-2);line-height:1.8"><b>Questions</b><ol style="margin:4px 0 0 18px">' + s.questions.map(function (q) { return '<li>' + UI.esc(q) + '</li>'; }).join('') + '</ol></div>',
          actions: '<button class="btn pri" onclick="UI.closeModal()">Close</button>' });
      }); });
      document.getElementById('newSV').addEventListener('click', function () {
        UI.modal({ title: 'Create a survey', body:
          UI.field('ns-t', 'Title', '<input class="input" id="ns-t" placeholder="e.g. Laboratory Experience Survey">', true) +
          '<div class="fgrid">' +
          UI.field('ns-ty', 'Type', UI.select('ns-ty', ['Course Feedback', 'Facility Feedback', 'Exit Survey', 'Placement Feedback', 'Alumni Feedback', 'Parent Feedback']), true) +
          UI.field('ns-a', 'Audience', UI.select('ns-a', ['Students', 'All Students', 'Graduated Batch', 'Alumni 2023–2025', 'Parents']), true) +
          UI.field('ns-f', 'Opens', '<input class="input" id="ns-f" type="date" min="' + Q.today() + '">', true) +
          UI.field('ns-tt', 'Closes', '<input class="input" id="ns-tt" type="date" min="' + Q.today() + '">', true) + '</div>' +
          UI.field('ns-q', 'Questions (one per line, max 8)', '<textarea class="input" id="ns-q" rows="4" placeholder="Clarity of delivery&#10;Material quality&#10;Fairness of assessment"></textarea>', true),
          actions: '<button class="btn pri" id="ns-go">' + UI.icon('check') + 'Create cycle</button>' });
        document.getElementById('ns-go').addEventListener('click', function () {
          var t = document.getElementById('ns-t').value, f = document.getElementById('ns-f').value;
          if (!t || !f || !document.getElementById('ns-q').value) { UI.toast('Title, window and questions required', '', 'red'); return; }
          WF.createSurvey(me.id, { title: t, type: document.getElementById('ns-ty').value, audience: document.getElementById('ns-a').value, from: f, to: document.getElementById('ns-tt').value || f, questions: document.getElementById('ns-q').value });
          UI.closeModal(); UI.toast('Survey created', 'Assign it to respondents next.', 'green'); render();
        });
      });
      var ex = document.getElementById('svExp');
      if (ex) ex.addEventListener('click', function () {
        var rows = [
          ['My Desktop Tech — CampusOne', ''],
          ['Document', 'SURVEY ADMINISTRATION REGISTER'],
          ['Generated', Q.today()],
          [],
          ['Title', 'Type', 'Template', 'Questions', 'Audience', 'Assigned', 'Submitted', 'Pending', 'Completion %', 'From', 'To', 'Status']
        ];
        DB.surveys.forEach(function (s) { rows.push([s.title, s.type, s.template, s.questions.length, s.audience, s.assigned, s.submitted, s.assigned - s.submitted, Math.round(s.submitted / (s.assigned || 1) * 100) + '%', s.from, s.to, s.status]); });
        UI.downloadCSV('IQAC-Surveys.csv', rows);
      });
    }
    render();

  }
});
})();

/* ── sign-in ........................................ ── */
(function () {
MDTLOGIN({
  role: '',
  folder: '',
  id: 'login',
  render: function (view, ctx) {

    var denied = SPA.denied;
    var ROLE_DIR = { student: 'student', teacher: 'teacher', academic: 'academic', principal: 'principal', warden: 'warden', office: 'office', admin: 'admin', library: 'library', examcell: 'examcell', placement: 'placement', accounts: 'accounts', iqac: 'iqac' };

    var demo = [
      { uid: 'U-ST001', name: 'Aarav Menon', sub: 'CSE-A · Sem V · Hosteller', tag: 'Student', tint: 't-b' },
      { uid: 'U-ST049', name: 'Priya Krishnan', sub: 'ECE-A · Sem V · Hosteller', tag: 'Student', tint: 't-b' },
      { uid: 'U-T01', name: 'Karthikeyan R', sub: 'Professor · Class Advisor, CSE-A', tag: 'Faculty', tint: 't-g' },
      { uid: 'U-OF2', name: 'Sundaram P', sub: 'Chief Librarian · Knowledge Resource Centre', tag: 'Library', tint: 't-g' },
      { uid: 'U-EX1', name: 'Dr. Nirmala Raghavan', sub: 'Controller of Examinations', tag: 'Exam Cell', tint: 't-y' },
      { uid: 'U-OF3', name: 'Balaji R', sub: 'Training & Placement Officer', tag: 'Placement', tint: 't-b' },
      { uid: 'U-AC1', name: 'Gomathi Priya', sub: 'Senior Accounts Officer', tag: 'Accounts', tint: 't-r' },
      { uid: 'U-IQ1', name: 'Dr. Vasanthi Priyadharshini', sub: 'IQAC & Accreditation Director', tag: 'IQAC', tint: 't-y' },
      { uid: 'U-AD1', name: 'Dr. Meera Krishnan', sub: 'Academic Director & HoD — CSE', tag: 'Academic', tint: 't-y' },
      { uid: 'U-PR1', name: 'Dr. Suresh Chandran', sub: 'Principal', tag: 'Principal', tint: 't-r' },
      { uid: 'U-WB1', name: 'Ravi Shankar B', sub: 'Warden — Boys Block A', tag: 'Warden', tint: 't-b' },
      { uid: 'U-WG1', name: 'Lakshmi Narayanan', sub: 'Warden — Girls Block B', tag: 'Warden', tint: 't-b' },
      { uid: 'U-OF1', name: 'Devi Raj', sub: 'Office Administrator', tag: 'Office', tint: 't-g' },
      { uid: 'U-SYS1', name: 'Arjun M', sub: 'System Administrator', tag: 'Admin', tint: 't-y' }
    ];

    function signIn(uid) {
      var u = Auth.login(uid);
      if (u) { SPA.go((ROLE_DIR[u.role] || 'student') + '/dashboard'); }
      else { UI.toast('Access unavailable', 'This account is not active. Contact the office.', 'red'); }
    }

    view.innerHTML =
      '<div class="login-v3">' +
        '<div class="lv-logo"><img src="assets/img/logo-full.png" alt="My Desktop Tech"></div>' +
        '<div class="lv-hero">' +
          '<h1>One campus. Every role. Connected.</h1>' +
          '<p>CampusOne brings academics, attendance, examinations, fees, hostel life, placements, quality and accreditation into a single governed flow — with the right approval in the right hands at every step.</p>' +
          '<div class="lv-stats">' +
            '<span class="hs"><b>144</b><span>students</span></span>' +
            '<span class="hs"><b>25</b><span>faculty &amp; staff</span></span>' +
            '<span class="hs"><b>12</b><span>role portals</span></span>' +
            '<span class="hs"><b>60+</b><span>connected modules</span></span>' +
            '<span class="hs"><b>' + UI.esc(DB.settings.academicYear) + '</b><span>academic year</span></span>' +
          '</div>' +
          '<div class="lv-chips">' +
            '<span class="chip">' + UI.icon('checkc') + 'Advisor → Director approval chains</span>' +
            '<span class="chip">' + UI.icon('key') + 'Gender-split hostel governance</span>' +
            '<span class="chip">' + UI.icon('book') + 'Library · Exams · Placement · Accounts · IQAC</span>' +
            '<span class="chip">' + UI.icon('moon') + 'Light &amp; dark themes</span>' +
            '<span class="chip">' + UI.icon('shield') + 'Role-scoped access</span>' +
          '</div>' +
        '</div>' +
        '<div class="card glow glow-b accent-b lv-signin">' +
          '<div class="spread" style="margin-bottom:2px"><b style="font-size:14.5px">Sign in to CampusOne</b>' +
          '<span class="tag y">DEMO</span></div>' +
          '<div class="fhint">Use your institutional email and password.</div>' +
          '<div class="lv-form">' +
            '<div class="fld"><label class="req">Institutional email</label><input class="input" id="li-email" type="email" placeholder="name@mdt.ac.in" autocomplete="username"></div>' +
            '<div class="fld"><label class="req">Password</label><input class="input" id="li-pass" type="password" placeholder="••••••••" autocomplete="current-password"></div>' +
            '<button class="btn pri" id="li-go" style="padding:10px 22px">' + UI.icon('lock') + 'Sign in</button>' +
          '</div>' +
          '<div class="spread" style="margin-top:10px;font-size:12.5px"><span class="dl" id="li-forgot">Forgot password?</span>' +
          '<span style="color:var(--text-3)">' + UI.icon('shield') + ' Secured access</span></div>' +
        '</div>' +
        (denied ? '<div class="lv-signin">' + UI.hint('Please sign in with an account that has access to that area.', 'warn', 'alert') + '</div>' : '') +
        '<div class="card glow glow-g accent-g lv-demo">' +
          '<div class="spread"><div><b style="font-size:14.5px">Demo access profiles</b>' +
          '<div class="fhint" style="margin-top:2px">One-tap sign-in for evaluation — every portal is fully explorable.</div></div>' +
          '<span class="tag g">12 ROLES</span></div>' +
          '<div class="demo-grid">' + demo.map(function (d) {
            var person = Q.user(d.uid) && Q.person(Q.user(d.uid).personId);
            return '<div class="democard" data-uid="' + d.uid + '" title="Sign in as ' + UI.esc(d.name) + '">' + UI.avatar(person, 38) +
              '<span class="dmain"><b>' + UI.esc(d.name) + '</b><span>' + UI.esc(d.sub) + '</span></span>' +
              '<span class="role-tag ' + d.tint + '">' + d.tag + '</span></div>';
          }).join('') + '</div>' +
        '</div>' +
        '<div class="card glow glow-y accent-y creator-card">' +
          '<div class="cc-av"><img src="assets/img/creator.png" alt="Magesh Kanna S"></div>' +
          '<div class="cc-main"><span class="cc-k">Creator &amp; Designer</span><b>Magesh Kanna S</b>' +
          '<div class="cc-links">' +
            '<a href="https://www.linkedin.com/in/magesh-kanna-s/" target="_blank" rel="noopener noreferrer">' + UI.icon('linkedin') + 'LinkedIn</a>' +
            '<a href="https://magesh-kanna-s.github.io/portfolio/" target="_blank" rel="noopener noreferrer">' + UI.icon('globe') + 'Portfolio</a>' +
          '</div></div>' +
          '<div class="cc-note">Concept, system architecture &amp; interface design of CampusOne.</div>' +
        '</div>' +
        '<div class="lv-foot">Runs on the institution\u2019s unified multi-tier campus architecture · ' + UI.esc(DB.settings.institute) + ', ' + UI.esc(DB.settings.city) + '<br>© 2026 My Desktop Tech · CampusOne</div>' +
      '</div>';

    function tryForm() {
      var em = document.getElementById('li-email').value.trim().toLowerCase();
      var pw = document.getElementById('li-pass').value;
      var u = DB.users.filter(function (x) { return x.email.toLowerCase() === em || x.username.toLowerCase() === em; })[0];
      if (!u) { UI.toast('Account not found', 'Check the email or use a demo profile.', 'red'); return; }
      if (!u.active) { UI.toast('Account unavailable', 'Contact the office to restore access.', 'red'); return; }
      if (pw && pw !== u.pass) { UI.toast('Incorrect password', 'Try again.', 'red'); return; }
      signIn(u.id);
    }
    document.getElementById('li-go').addEventListener('click', tryForm);
    document.getElementById('li-pass').addEventListener('keydown', function (e) { if (e.key === 'Enter') tryForm(); });
    document.getElementById('li-forgot').addEventListener('click', function () {
      UI.modal({ title: 'Reset password', body: UI.hint('Contact the campus office (' + DB.settings.email + ') or raise a help ticket from the portal to reset your password.', '', 'info'), actions: '<button class="btn pri" onclick="UI.closeModal()">Got it</button>' });
    });
    document.querySelectorAll('.democard').forEach(function (el) {
      el.addEventListener('click', function () { signIn(el.getAttribute('data-uid')); });
    });

  }
});
})();
