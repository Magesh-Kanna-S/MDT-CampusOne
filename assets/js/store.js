/* My Desktop Tech — CampusOne · data store + query helpers */
window.MDT_CONFIG = window.MDT_CONFIG || { API_URL: '' };
(function (g) {
'use strict';
var Store = {
  VERSION: 8, KEY: 'MDT_CAMPUSONE_V8', db: null,
  load: function () {
    var raw = null;
    try { raw = g.localStorage.getItem(this.KEY); } catch (e) {}
    if (raw) {
      try { var d = JSON.parse(raw); if (d && d.__v === this.VERSION) { this.db = d; return this; } } catch (e) {}
    }
    /* v8: clean-up of older-version stores so new fields always appear */
    try { g.localStorage.removeItem('MDT_CAMPUSONE_V7'); g.localStorage.removeItem('MDT_CAMPUSONE_V6'); g.localStorage.removeItem('MDT_CAMPUSONE_V3'); g.localStorage.removeItem('MDT_CAMPUSONE_V2'); } catch (e) {}
    this.db = JSON.parse(JSON.stringify(g.SEED));
    this.db.__v = this.VERSION;
    /* keep any integration config an administrator saved earlier */
    try {
      var keep = g.localStorage.getItem('MDT_INTEGRATIONS');
      if (keep) { var ki = JSON.parse(keep); this.db.settings.integrations = ki; }
    } catch (e) {}
    this.save();
    return this;
  },
  save: function () { try { g.localStorage.setItem(this.KEY, JSON.stringify(this.db)); } catch (e) {} },
  tx: function (fn) { fn(this.db); this.save(); },
  reset: function () { try { g.localStorage.removeItem(this.KEY); } catch (e) {} this.load(); }
};
g.Store = Store;
g.DB = null;

/* ---------------- query helpers ---------------- */
var Q = {
  today: function () { return g.DB.meta.today; },
  person: function (id) {
    var d = g.DB;
    return d.students.filter(function (s) { return s.id === id; })[0] ||
           d.staff.filter(function (s) { return s.id === id; })[0] || null;
  },
  user: function (id) { return g.DB.users.filter(function (u) { return u.id === id; })[0] || null; },
  name: function (id) { var p = Q.person(id); return p ? p.name : id; },
  staffByRole: function (role) { return g.DB.staff.filter(function (s) { return s.role === role; }); },
  studentById: function (id) { return g.DB.students.filter(function (s) { return s.id === id; })[0] || null; },
  classById: function (cid) { return g.DB.classes.filter(function (c) { return c.id === cid; })[0] || null; },
  classAdvisor: function (cid) { var c = Q.classById(cid); return c ? Q.person(c.advisor) : null; },
  studentsOf: function (cid) { return g.DB.students.filter(function (s) { return s.classId === cid; }); },
  courseById: function (id) { return g.DB.courses.filter(function (c) { return c.id === id; })[0] || null; },
  allocationsOf: function (cid) { return g.DB.courseAllocations.filter(function (a) { return a.classId === cid; }); },
  allocationsOfTeacher: function (tid) { return g.DB.courseAllocations.filter(function (a) { return a.teacherId === tid; }); },
  timetableOf: function (cid, day) {
    return g.DB.timetable.filter(function (t) { return t.classId === cid && (day === undefined || t.day === day); });
  },
  coursePlan: function (classId, courseId) {
    return g.DB.coursePlan.filter(function (p) { return p.classId === classId && p.courseId === courseId; });
  },
  /* attendance */
  attOf: function (sid) { return g.DB.attendanceAgg[sid] || {}; },
  attPct: function (sid, courseId) {
    var a = Q.attOf(sid)[courseId];
    if (!a) return 100;
    return Math.round((a.p + (a.l || 0) * 0.5) / a.t * 100);
  },
  attPctOverall: function (sid) {
    var m = Q.attOf(sid), p = 0, t = 0;
    Object.keys(m).forEach(function (k) { p += m[k].p + (m[k].l || 0) * 0.5; t += m[k].t; });
    return t ? Math.round(p / t * 100) : 100;
  },
  classAttAvg: function (cid) {
    var st = Q.studentsOf(cid), sum = 0;
    st.forEach(function (s) { sum += Q.attPctOverall(s.id); });
    return st.length ? Math.round(sum / st.length) : 0;
  },
  atRisk: function (cid) {
    var min = g.DB.settings.wf.attMin;
    return Q.studentsOf(cid).filter(function (s) { return Q.attPctOverall(s.id) < min; });
  },
  sessionsOf: function (classId, courseId) {
    return g.DB.attendanceSessions.filter(function (s) { return s.classId === classId && (!courseId || s.courseId === courseId); });
  },
  /* marks & ranking */
  marksOf: function (sid) { return g.DB.marks[sid] || {}; },
  totalOf: function (sid) {
    var m = Q.marksOf(sid), t = 0;
    Object.keys(m).forEach(function (k) { t += (m[k].I1 || 0) + (m[k].Q1 || 0); });
    return t;
  },
  rankList: function (cid) {
    return Q.studentsOf(cid).slice().sort(function (a, b) {
      return Q.totalOf(b.id) - Q.totalOf(a.id) || (b.cgpa - a.cgpa);
    });
  },
  rankOf: function (sid) {
    var s = Q.studentById(sid);
    if (!s) return { rank: 0, of: 0 };
    var list = Q.rankList(s.classId);
    return { rank: list.map(function (x) { return x.id; }).indexOf(sid) + 1, of: list.length };
  },
  classAvgTotal: function (cid) {
    var st = Q.studentsOf(cid), sum = 0;
    st.forEach(function (s) { sum += Q.totalOf(s.id); });
    return st.length ? Math.round(sum / st.length) : 0;
  },
  /* fees */
  duesOf: function (sid) {
    var s = Q.studentById(sid); if (!s) return { total: 0, heads: [] };
    var paid = s.feePaid || {}, heads = [], total = 0;
    g.DB.feeHeads.forEach(function (h) {
      if (h.applies === 'hostellers' && !s.hostel) return;
      var p = paid[h.id] || 0, d = h.amount - p;
      if (d > 0) { heads.push({ head: h, due: d, paid: p }); total += d; }
    });
    return { total: total, heads: heads };
  },
  feeTxOf: function (sid) { return g.DB.feeTransactions.filter(function (t) { return t.studentId === sid; }); },
  collectionToday: function () {
    var t = g.DB.feeTransactions.filter(function (x) { return x.date === Q.today(); });
    return t.reduce(function (a, b) { return a + b.amount; }, 0);
  },
  /* hostel */
  roomsOf: function (block) { return g.DB.hostelRooms.filter(function (r) { return r.block === block; }); },
  residentsOf: function (block) {
    return g.DB.students.filter(function (s) { return s.hostel && s.block === block; });
  },
  roomOf: function (sid) {
    var s = Q.studentById(sid);
    if (!s || !s.roomId) return null;
    return g.DB.hostelRooms.filter(function (r) { return r.id === s.roomId; })[0] || null;
  },
  wardenOf: function (block) { return g.DB.staff.filter(function (w) { return w.role === 'warden' && w.block === block; })[0] || null; },
  occupancy: function (block) {
    var rooms = Q.roomsOf(block), cap = 0, occ = 0;
    rooms.forEach(function (r) { cap += r.capacity; occ += (r.occupants || []).length; });
    return { cap: cap, occ: occ, pct: cap ? Math.round(occ / cap * 100) : 0, rooms: rooms.length };
  },
  /* requests */
  odsOf: function (sid) { return g.DB.odRequests.filter(function (r) { return r.studentId === sid; }); },
  leavesOf: function (sid) { return g.DB.leaveRequests.filter(function (r) { return r.studentId === sid; }); },
  outingsOf: function (sid) { return g.DB.outingRequests.filter(function (r) { return r.studentId === sid; }); },
  /* library */
  borrowsOf: function (sid) { return g.DB.borrowRecords.filter(function (b) { return b.studentId === sid; }); },
  bookByAcc: function (acc) { return g.DB.libraryBooks.filter(function (b) { return b.acc === acc; })[0] || null; },
  /* mentor */
  mentorGroupOf: function (sid) {
    return g.DB.mentorGroups.filter(function (m) { return m.students.indexOf(sid) >= 0; })[0] || null;
  },
  mentorGroupsOf: function (tid) { return g.DB.mentorGroups.filter(function (m) { return m.mentorId === tid; }); },
  /* notifications */
  notifsFor: function (user, person) {
    if (!user) return [];
    return g.DB.notifications.filter(function (n) {
      if (n.aud === 'all') return true;
      if (n.aud === 'role:' + user.role) return true;
      if (n.aud === 'uid:' + user.personId) return true;
      if (person && person.classId && n.aud === 'class:' + person.classId) return true;
      return false;
    }).sort(function (a, b) { return a.at < b.at ? 1 : -1; });
  },
  /* assignments */
  assignmentsOfStudent: function (st) {
    return g.DB.assignments.filter(function (a) { return a.classId === st.classId; });
  },
  subOf: function (assignmentId, sid) {
    var m = g.DB.submissions[assignmentId] || {};
    return m[sid] || { st: 'Pending' };
  },
  quizzesOfStudent: function (st) {
    return g.DB.quizzes.filter(function (q) { return q.classId === st.classId; });
  },
  materialsOf: function (classId) { return g.DB.materials.filter(function (m) { return m.classId === classId; }); },
  /* misc */
  staffWorkload: function (tid) {
    var al = Q.allocationsOfTeacher(tid), p = 0;
    al.forEach(function (a) { p += a.periods; });
    return { courses: al.length, periods: p };
  },
  genderLabel: function (gd) { return gd === 'F' ? 'Girls' : 'Boys'; },
  age: function (dob) { return 20; }
};
g.Q = Q;
})(window);
