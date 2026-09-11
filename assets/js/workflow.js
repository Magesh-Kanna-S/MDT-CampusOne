/* My Desktop Tech — CampusOne · workflow engine — every cross-role action lives here */
(function (g) {
'use strict';
var WF = {};
function db() { return g.DB; }
function sid() { return 'S' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36); }
function nowStr() { var d = new Date(); return g.DB.meta.today + ' ' + d.toTimeString().slice(0, 5); }

WF.notify = function (o) {
  db().notifications.unshift({ id: sid(), at: nowStr(), aud: o.aud, title: o.title, body: o.body || '', link: o.link || '', read: false, tone: o.tone || 'blue' });
};
WF.log = function (actor, action, detail) {
  db().activity.unshift({ id: sid(), at: nowStr(), actor: actor, action: action, detail: detail || '' });
  if (db().activity.length > 400) db().activity.length = 400;
};
WF.commit = function (actor, action, detail, notif) {
  WF.log(actor, action, detail);
  if (notif) WF.notify(notif);
  g.Store.save();
  if (g.MDT_CONFIG.API_URL) { /* live channel — silent */ try { g.Api && g.Api.sync(actor, action); } catch (e) {} }
};

/* ---------------- OD (On Duty) chain: Student → Class Advisor → Academic Director ---------------- */
WF.submitOd = function (studentId, f) {
  var s = Q.studentById(studentId);
  var od = { id: sid(), studentId: studentId, event: f.event, venue: f.venue, date: f.date, session: f.session,
    reason: f.reason, proof: f.proof || '—', appliedAt: nowStr(), status: 'Submitted', advisorId: s.advisorId,
    adId: null, hosteller: !!s.hostel,
    timeline: [ { s: 'Submitted', at: nowStr(), by: studentId }, { s: 'Class Advisor Recommendation', at: null, by: s.advisorId }, { s: 'Academic Director Approval', at: null, by: 'AD1' } ] };
  if (s.hostel) od.timeline.push({ s: 'Warden informed (hosteller)', at: null, by: s.block === 'B' ? 'WG1' : 'WB1' });
  db().odRequests.unshift(od);
  WF.commit(studentId, 'Submitted OD request', f.event + ' — ' + f.date,
    { aud: 'role:teacher', title: 'OD awaiting your recommendation', body: s.name + ' (' + s.reg + ') submitted an OD request for ' + f.date + '.', link: 'advisor-requests.html', tone: 'yellow' });
  WF.notify({ aud: 'uid:' + studentId, title: 'OD request received', body: 'Your on-duty request is with your class advisor.', link: 'od.html', tone: 'blue' });
  g.Store.save();
  return od;
};
WF.recommendOd = function (odId, advisorId, note, ok) {
  var od = db().odRequests.filter(function (r) { return r.id === odId; })[0];
  if (!od) return;
  var st = Q.studentById(od.studentId);
  od.status = ok ? 'Recommended' : 'Returned';
  var step = od.timeline.filter(function (t) { return t.by === advisorId; })[0];
  if (step) { step.at = nowStr(); step.s = ok ? 'Recommended by Class Advisor' : 'Returned by Class Advisor'; if (note) step.note = note; }
  if (ok) { od.adId = 'AD1'; var ad = od.timeline.filter(function (t) { return t.by === 'AD1'; })[0]; if (ad) ad.s = 'Academic Director Approval'; }
  WF.commit(advisorId, ok ? 'Recommended OD request' : 'Returned OD request', od.event + ' — ' + st.name,
    ok ? { aud: 'role:academic', title: 'OD awaiting approval', body: st.name + ' (' + st.reg + ') — ' + od.event + ', recommended by advisor.', link: 'od.html', tone: 'yellow' }
       : { aud: 'uid:' + od.studentId, title: 'OD request returned', body: 'Your class advisor returned the request. ' + (note || ''), link: 'od.html', tone: 'red' });
  if (ok) WF.notify({ aud: 'uid:' + od.studentId, title: 'OD recommended', body: 'Your advisor recommended the request — awaiting Academic Director.', link: 'od.html', tone: 'green' });
  g.Store.save();
};
WF.decideOd = function (odId, approve, note) {
  var od = db().odRequests.filter(function (r) { return r.id === odId; })[0];
  if (!od) return;
  var st = Q.studentById(od.studentId);
  od.status = approve ? 'Approved' : 'Rejected';
  var step = od.timeline.filter(function (t) { return t.by === 'AD1'; })[0];
  if (step) { step.at = nowStr(); step.s = (approve ? 'Approved' : 'Rejected') + ' by Academic Director'; if (note) step.note = note; }
  if (approve && od.hosteller) {
    var wId = st.block === 'B' ? 'WG1' : 'WB1';
    var wStep = od.timeline.filter(function (t) { return t.by === wId; })[0];
    if (wStep) { wStep.at = nowStr(); wStep.s = 'Warden informed (hosteller)'; wStep.note = 'OD on ' + od.date + ' — gate entry noted.'; }
    WF.notify({ aud: 'role:warden', title: 'OD approved — hosteller', body: st.name + ' (' + Q.roomOf(st.id).id + ') has approved OD on ' + od.date + '.', link: 'outings.html', tone: 'blue' });
  }
  WF.commit('AD1', (approve ? 'Approved' : 'Rejected') + ' OD request', od.event + ' — ' + st.name,
    { aud: 'uid:' + od.studentId, title: 'OD ' + (approve ? 'approved' : 'rejected'), body: od.event + ' — ' + (note || (approve ? 'Approved by the Academic Director.' : 'Please review the remarks and re-apply if eligible.')), link: 'od.html', tone: approve ? 'green' : 'red' });
};

/* ---------------- Leave chain: Student → Advisor → AD (→ Principal if ≥ N days) ---------------- */
WF.submitLeave = function (studentId, f) {
  var s = Q.studentById(studentId);
  var days = Math.max(1, Math.round((new Date(f.to) - new Date(f.from)) / 86400000) + 1);
  var wf = db().settings.wf;
  var lv = { id: sid(), studentId: studentId, type: f.type, from: f.from, to: f.to, days: days, reason: f.reason,
    proof: f.proof || '—', appliedAt: nowStr(), status: 'Submitted', advisorId: s.advisorId, adId: null, principalId: null,
    timeline: [ { s: 'Submitted', at: nowStr(), by: studentId }, { s: 'Class Advisor Recommendation', at: null, by: s.advisorId }, { s: 'Academic Director Approval', at: null, by: 'AD1' } ] };
  if (days > wf.longLeaveDays) { lv.principalId = 'PR1'; lv.timeline.push({ s: 'Principal Countersignature', at: null, by: 'PR1', note: 'Beyond ' + wf.longLeaveDays + ' working days — routed to Principal.' }); }
  db().leaveRequests.unshift(lv);
  WF.commit(studentId, 'Submitted leave request', f.type + ' ' + f.from + '→' + f.to,
    { aud: 'role:teacher', title: 'Leave awaiting your recommendation', body: s.name + ' (' + s.reg + ') — ' + f.type + ', ' + days + ' day(s).', link: 'advisor-requests.html', tone: 'yellow' });
  g.Store.save();
  return lv;
};
WF.recommendLeave = function (lvId, advisorId, note, ok) {
  var lv = db().leaveRequests.filter(function (r) { return r.id === lvId; })[0];
  if (!lv) return;
  var st = Q.studentById(lv.studentId);
  lv.status = ok ? 'Recommended' : 'Returned';
  var step = lv.timeline.filter(function (t) { return t.by === advisorId; })[0];
  if (step) { step.at = nowStr(); step.s = (ok ? 'Recommended' : 'Returned') + ' by Class Advisor'; if (note) step.note = note; }
  if (ok) lv.adId = 'AD1';
  WF.commit(advisorId, (ok ? 'Recommended' : 'Returned') + ' leave request', st.name + ' — ' + lv.type,
    ok ? { aud: 'role:academic', title: 'Leave awaiting approval', body: st.name + ' — ' + lv.type + ' (' + lv.days + 'd).', link: 'leaves.html', tone: 'yellow' }
       : { aud: 'uid:' + lv.studentId, title: 'Leave request returned', body: note || 'Please review and re-apply.', link: 'leave.html', tone: 'red' });
};
WF.decideLeave = function (lvId, byId, approve, note) {
  var lv = db().leaveRequests.filter(function (r) { return r.id === lvId; })[0];
  if (!lv) return;
  var st = Q.studentById(lv.studentId);
  var isPrincipal = byId === 'PR1';
  var step = lv.timeline.filter(function (t) { return t.by === byId; })[0];
  if (isPrincipal) {
    lv.status = approve ? 'Approved' : 'Rejected';
    if (step) { step.at = nowStr(); step.s = (approve ? 'Countersigned' : 'Rejected') + ' by Principal'; if (note) step.note = note; }
  } else {
    lv.status = approve ? 'AD Approved' : 'Rejected';
    if (step) { step.at = nowStr(); step.s = (approve ? 'Approved' : 'Rejected') + ' by Academic Director'; if (note) step.note = note; }
    if (approve && lv.principalId) {
      WF.notify({ aud: 'role:principal', title: 'Long leave countersignature pending', body: st.name + ' — ' + lv.days + '-day leave approved by AD.', link: 'approvals.html', tone: 'yellow' });
    }
  }
  WF.commit(byId, (approve ? 'Approved' : 'Rejected') + ' leave request', st.name + ' — ' + lv.type,
    { aud: 'uid:' + lv.studentId, title: 'Leave ' + (approve ? (isPrincipal ? 'countersigned' : 'approved') : 'rejected'), body: note || '', link: 'leave.html', tone: approve ? 'green' : 'red' });
};

/* ---------------- Outing chain: Student → Warden (gender-matched) (+ AD if overnight) ---------------- */
WF.submitOuting = function (studentId, f) {
  var s = Q.studentById(studentId);
  if (!s.hostel) return null;
  var wId = s.block === 'B' ? 'WG1' : 'WB1';
  var overnight = f.type === 'Night';
  var ou = { id: sid(), studentId: studentId, type: f.type, out: f.out, in: f.in, place: f.place, reason: f.reason,
    deadline: f.deadline || null,   /* v6: raiser-requested deadline */
    appliedAt: nowStr(), wardenId: wId, status: 'Pending', adStatus: overnight ? 'Pending' : null,
    timeline: [ { s: 'Submitted', at: nowStr(), by: studentId }, { s: 'Warden Review (' + Q.genderLabel(s.gender) + ' Block)', at: null, by: wId } ] };
  if (overnight) ou.timeline.push({ s: 'Academic Director Approval', at: null, by: 'AD1', note: 'Overnight outing — dual approval.' });
  if (f.deadline) ou.timeline[0].note = 'Requested deadline ' + f.deadline + ' — reason stated by the student.';
  db().outingRequests.unshift(ou);
  WF.notify({ aud: 'role:warden', title: 'New outing request', body: s.name + ' (' + (Q.roomOf(s.id) || {}).id + ') — ' + f.type + ' outing ' + f.out + '.' + (f.deadline ? ' Student requests a decision by ' + f.deadline + '.' : ''), link: 'outings.html', tone: 'blue' });
  if (overnight) WF.notify({ aud: 'role:academic', title: 'Overnight outing in approval chain', body: s.name + ' — night outing ' + f.out + ' (warden review first).', link: 'outing.html', tone: 'yellow' });
  WF.commit(studentId, 'Submitted outing request', f.type + ' — ' + f.place);
  return ou;
};
WF.decideOuting = function (ouId, wardenId, approve, note) {
  var ou = db().outingRequests.filter(function (r) { return r.id === ouId; })[0];
  if (!ou) return;
  var st = Q.studentById(ou.studentId);
  var step = ou.timeline.filter(function (t) { return t.by === wardenId; })[0];
  if (step) { step.at = nowStr(); step.s = (approve ? 'Approved' : 'Rejected') + ' by Warden'; if (note) step.note = note; }
  if (!approve) {
    ou.status = 'Rejected';
    WF.commit(wardenId, 'Rejected outing request', st.name + ' — ' + ou.place, { aud: 'uid:' + ou.studentId, title: 'Outing rejected', body: note || 'Contact your warden for details.', link: 'outing.html', tone: 'red' });
    return;
  }
  if (ou.adStatus === 'Pending') { ou.status = 'Warden Approved'; WF.commit(wardenId, 'Approved outing (warden stage)', st.name, { aud: 'uid:' + ou.studentId, title: 'Outing approved by warden', body: 'Awaiting Academic Director (overnight).', link: 'outing.html', tone: 'green' }); }
  else { ou.status = 'Approved'; WF.commit(wardenId, 'Approved outing request', st.name + ' — ' + ou.place, { aud: 'uid:' + ou.studentId, title: 'Outing approved', body: 'Remember to sign the gate register.', link: 'outing.html', tone: 'green' }); }
};
WF.decideOutingAD = function (ouId, approve, note) {
  var ou = db().outingRequests.filter(function (r) { return r.id === ouId; })[0];
  if (!ou) return;
  var st = Q.studentById(ou.studentId);
  ou.adStatus = approve ? 'Approved' : 'Rejected';
  ou.status = approve ? 'Approved' : 'Rejected';
  var step = ou.timeline.filter(function (t) { return t.by === 'AD1'; })[0];
  if (step) { step.at = nowStr(); step.s = (approve ? 'Approved' : 'Rejected') + ' by Academic Director'; if (note) step.note = note; }
  WF.commit('AD1', (approve ? 'Approved' : 'Rejected') + ' overnight outing', st.name,
    { aud: 'uid:' + ou.studentId, title: 'Overnight outing ' + (approve ? 'fully approved' : 'rejected by AD'), body: note || '', link: 'outing.html', tone: approve ? 'green' : 'red' });
};

/* ---------------- Attendance (teacher → advisor/student) ---------------- */
WF.markAttendance = function (teacherId, classId, courseId, date, period, marks) {
  var sess = { id: 'AS-' + courseId + '-' + date, classId: classId, courseId: courseId, teacherId: teacherId, date: date, period: period, marks: marks };
  var existing = db().attendanceSessions.filter(function (s) { return s.id === sess.id; })[0];
  if (existing) { existing.marks = marks; } else { db().attendanceSessions.push(sess); }
  /* update aggregates */
  var min = db().settings.wf.attMin;
  Object.keys(marks).forEach(function (sidX) {
    var a = db().attendanceAgg[sidX] && db().attendanceAgg[sidX][courseId];
    if (!a) { db().attendanceAgg[sidX] = db().attendanceAgg[sidX] || {}; a = db().attendanceAgg[sidX][courseId] = { p: 0, t: 0, l: 0 }; }
    var m = marks[sidX];
    if (m === 'P') a.p++; else if (m === 'L') a.l++; 
    a.t++;
    var s = Q.studentById(sidX);
    if (s && m === 'A') WF.notify({ aud: 'uid:' + sidX, title: 'Marked absent — ' + Q.courseById(courseId).code, body: 'Session on ' + date + '. Raise a correction with your advisor if this is wrong.', link: 'attendance.html', tone: 'red' });
    if (s && Q.attPctOverall(sidX) < min) WF.notify({ aud: 'role:teacher', title: 'Attendance below threshold', body: s.name + ' (' + s.reg + ') dropped below ' + min + '% — advisor follow-up needed.', link: 'advisor-class.html', tone: 'red' });
  });
  WF.commit(teacherId, 'Marked attendance', Q.courseById(courseId).code + ' · ' + classId + ' · ' + date);
};

/* ---------------- Assignments / quizzes / marks ---------------- */
WF.createAssignment = function (teacherId, f) {
  var id = sid();
  db().assignments.unshift({ id: id, courseId: f.courseId, classId: f.classId, teacherId: teacherId, title: f.title, desc: f.desc, assignedAt: db().meta.today, dueAt: f.due, max: f.max || 15 });
  db().submissions[id] = {};
  var cls = Q.classById(f.classId);
  WF.commit(teacherId, 'Created assignment', f.title + ' — ' + Q.courseById(f.courseId).code,
    { aud: 'class:' + f.classId, title: 'New assignment — ' + Q.courseById(f.courseId).code, body: f.title + ' · due ' + f.due, link: 'assignments.html', tone: 'yellow' });
  return id;
};
WF.submitAssignment = function (assignmentId, studentId, text, files) {
  var map = db().submissions[assignmentId] = db().submissions[assignmentId] || {};
  map[studentId] = { st: 'Submitted', at: nowStr(), text: text || '', files: files || [] };
  var a = db().assignments.filter(function (x) { return x.id === assignmentId; })[0];
  var s = Q.studentById(studentId);
  WF.commit(studentId, 'Submitted assignment', (a ? a.title : '') + ' — ' + s.name + ((files && files.length) ? ' · ' + files.length + ' file(s)' : ''),
    { aud: 'uid:' + studentId, title: 'Assignment submitted', body: (a ? a.title : '') + ' — awaiting evaluation.', link: 'assignments.html', tone: 'green' });
};
WF.gradeAssignment = function (assignmentId, studentId, marks, teacherId) {
  var map = db().submissions[assignmentId] = db().submissions[assignmentId] || {};
  var cur = map[studentId] || { st: 'Submitted', at: nowStr() };
  cur.st = 'Graded'; cur.marks = marks;
  map[studentId] = cur;
  var a = db().assignments.filter(function (x) { return x.id === assignmentId; })[0];
  WF.commit(teacherId, 'Graded submission', (a ? a.title : '') + ' — ' + Q.studentById(studentId).name + ' · ' + marks + '/' + a.max,
    { aud: 'uid:' + studentId, title: 'Assignment graded', body: (a ? a.title : '') + ' — ' + marks + '/' + a.max, link: 'assignments.html', tone: 'green' });
};
WF.attemptQuiz = function (quizId, studentId, score) {
  var map = db().quizAttempts[quizId] = db().quizAttempts[quizId] || {};
  map[studentId] = { score: score, at: nowStr() };
  var qz = db().quizzes.filter(function (x) { return x.id === quizId; })[0];
  WF.commit(studentId, 'Attempted quiz', (qz ? qz.title : '') + ' — score ' + score,
    { aud: 'uid:' + studentId, title: 'Quiz recorded', body: (qz ? qz.title : '') + ' — ' + score + '/' + qz.max, link: 'quizzes.html', tone: 'green' });
};
WF.saveMarks = function (teacherId, courseId, classId, assess, entries) {
  entries.forEach(function (e) {
    var m = db().marks[e.sid] = db().marks[e.sid] || {};
    var cm = m[courseId] = m[courseId] || {};
    cm[assess] = e.val; cm[assess + 'pub'] = true;
  });
  WF.commit(teacherId, 'Saved ' + assess + ' marks', Q.courseById(courseId).code + ' · ' + classId,
    { aud: 'class:' + classId, title: assess + ' marks published — ' + Q.courseById(courseId).code, body: 'Check your examination page.', link: 'exams.html', tone: 'green' });
};

/* ---------------- Course / schedule (AD assigns, teacher plans) ---------------- */
WF.allocateCourse = function (adId, classId, courseId, teacherId) {
  var id = sid();
  var ex = db().courseAllocations.filter(function (a) { return a.classId === classId && a.courseId === courseId && a.status === 'Active'; })[0];
  if (ex) { ex.teacherId = teacherId; ex.assignedBy = adId; ex.assignedAt = db().meta.today; }
  else db().courseAllocations.push({ id: id, classId: classId, courseId: courseId, teacherId: teacherId, sem: Q.classById(classId).sem, year: '2026–27', assignedBy: adId, assignedAt: db().meta.today, periods: 4, status: 'Active' });
  /* mirror into timetable teacher mapping */
  db().timetable.forEach(function (t) { if (t.classId === classId && t.courseId === courseId) t.teacherId = teacherId; });
  WF.commit(adId, ex ? 'Reassigned course allocation' : 'Assigned course allocation', Q.courseById(courseId).code + ' → ' + Q.name(teacherId) + ' (' + classId + ')',
    { aud: 'uid:' + teacherId, title: 'Course ' + (ex ? 're' : '') + 'assigned to you', body: Q.courseById(courseId).code + ' — ' + Q.courseById(courseId).title + ' · ' + classId, link: 'courses.html', tone: 'blue' });
  WF.notify({ aud: 'class:' + classId, title: 'Faculty update — ' + Q.courseById(courseId).code, body: 'Now handled by ' + Q.name(teacherId) + '.', link: 'timetable.html', tone: 'blue' });
};
WF.updateCoursePlan = function (teacherId, classId, courseId, unit, status) {
  var p = db().coursePlan.filter(function (x) { return x.classId === classId && x.courseId === courseId && x.unit === unit; })[0];
  if (p) { p.status = status; p.updatedBy = teacherId; p.updatedAt = db().meta.today; }
  WF.commit(teacherId, 'Updated course plan', Q.courseById(courseId).code + ' Unit ' + unit + ' → ' + status + ' (' + classId + ')',
    { aud: 'class:' + classId, title: 'Course plan updated — ' + Q.courseById(courseId).code, body: 'Unit ' + unit + ' is now ' + status.toLowerCase() + '.', link: 'courses.html', tone: 'blue' });
};
WF.postMaterial = function (teacherId, classId, courseId, m) {
  db().materials.unshift({ id: sid(), courseId: courseId, classId: classId, type: m.type, title: m.title, desc: m.desc, postedBy: teacherId, postedAt: db().meta.today });
  WF.commit(teacherId, 'Posted course material', m.title + ' — ' + Q.courseById(courseId).code,
    { aud: 'class:' + classId, title: 'New material — ' + Q.courseById(courseId).code, body: m.title, link: 'elearning.html', tone: 'blue' });
};
WF.rescheduleClass = function (teacherId, classId, courseId, f) {
  var rs = { id: sid(), classId: classId, courseId: courseId, teacherId: teacherId, from: f.from, to: f.to, reason: f.reason, status: 'Pending', at: nowStr() };
  db().reschedules = db().reschedules || [];
  db().reschedules.unshift(rs);
  WF.commit(teacherId, 'Requested class reschedule', Q.courseById(courseId).code + ' · ' + classId + ' — ' + f.from + ' → ' + f.to,
    { aud: 'role:academic', title: 'Reschedule awaiting approval', body: Q.courseById(courseId).code + ' (' + classId + ') — ' + f.reason + '.', link: 'timetable.html', tone: 'yellow' });
  return rs;
};
WF.decideReschedule = function (adId, rsId, approve) {
  var rs = (db().reschedules || []).filter(function (r) { return r.id === rsId; })[0];
  if (!rs) return;
  rs.status = approve ? 'Approved' : 'Rejected';
  if (approve) {
    var dayNames = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
    db().timetable.forEach(function (t) { if (t.classId === rs.classId && t.courseId === rs.courseId && !t.break) { t.rescheduledNote = rs.to; } });
    WF.notify({ aud: 'class:' + rs.classId, title: 'Timetable change approved — ' + Q.courseById(rs.courseId).code, body: rs.from + ' → ' + rs.to + '. ' + rs.reason, link: 'timetable.html', tone: 'green' });
  }
  WF.commit(adId, (approve ? 'Approved' : 'Rejected') + ' reschedule', Q.courseById(rs.courseId).code + ' · ' + rs.classId);
};

/* ---------------- Fees / hall tickets / certificates (office) ---------------- */
WF.collectFee = function (studentId, headId, amount, mode, byId) {
  var s = Q.studentById(studentId);
  var h = db().feeHeads.filter(function (x) { return x.id === headId; })[0];
  var no = 'RCP-' + (26300 + db().feeTransactions.length);
  db().feeTransactions.unshift({ id: sid(), studentId: studentId, head: headId, amount: amount, mode: mode, date: db().meta.today, receipt: no, status: 'Paid' });
  s.feePaid = s.feePaid || {};
  s.feePaid[headId] = (s.feePaid[headId] || 0) + amount;
  WF.commit(byId, 'Fee collection', s.name + ' — ₹' + amount + ' (' + h.name + ') · ' + no,
    { aud: 'uid:' + studentId, title: 'Payment received — ₹' + amount, body: h.name + ' · Receipt ' + no + '.', link: 'fees.html', tone: 'green' });
  return no;
};
WF.payFeeSelf = function (studentId, headId, amount) {
  return WF.collectFee(studentId, headId, amount, 'UPI', studentId);
};
WF.publishHallTicket = function (exam, classId, byId) {
  var st = Q.studentsOf(classId), eligible = 0, blocked = 0, grace = db().settings.wf.feeGrace;
  st.forEach(function (s) { var d = Q.duesOf(s.id).total; if (d <= grace) eligible++; else blocked++; });
  var ht = { id: sid(), exam: exam, classId: classId, published: true, publishedAt: db().meta.today, eligible: eligible, blocked: blocked };
  db().hallTickets.unshift(ht);
  WF.commit(byId, 'Published hall tickets', exam + ' — ' + classId + ' (' + eligible + ' eligible, ' + blocked + ' blocked)',
    { aud: 'class:' + classId, title: 'Hall tickets published — ' + exam, body: 'Download from your examination page. Blocked entries: clear fee dues at the office.', link: 'exams.html', tone: blocked ? 'yellow' : 'green' });
  return ht;
};
WF.requestCertificate = function (studentId, type, reason) {
  var c = { id: sid(), studentId: studentId, type: type, reason: reason, requestedAt: db().meta.today, status: 'Pending', issuedBy: null, refNo: null, issuedAt: null };
  db().certificates.unshift(c);
  var s = Q.studentById(studentId);
  WF.commit(studentId, 'Requested certificate', type + ' — ' + reason,
    { aud: 'role:office', title: 'Certificate request pending', body: s.name + ' — ' + type + '.', link: 'certificates.html', tone: 'blue' });
  WF.notify({ aud: 'uid:' + studentId, title: 'Certificate requested', body: type + ' — you will be notified when issued.', link: 'profile.html', tone: 'blue' });
  return c;
};
WF.issueCertificate = function (certId, byId) {
  var c = db().certificates.filter(function (x) { return x.id === certId; })[0];
  if (!c) return;
  c.status = 'Issued'; c.issuedBy = byId; c.issuedAt = db().meta.today;
  c.refNo = 'MDT/CERT/2026/' + pad4(db().certificates.length + 200);
  var s = Q.studentById(c.studentId);
  WF.commit(byId, 'Issued certificate', c.type + ' — ' + s.name + ' (' + c.refNo + ')',
    { aud: 'uid:' + c.studentId, title: 'Certificate issued', body: c.type + ' · Ref ' + c.refNo + ' — download from your profile.', link: 'profile.html', tone: 'green' });
};
function pad4(n) { var x = String(n); while (x.length < 4) x = '0' + x; return x; }

/* ---------------- Hostel (warden) ---------------- */
WF.allocateRoom = function (studentId, roomId, byId) {
  var s = Q.studentById(studentId);
  var room = db().hostelRooms.filter(function (r) { return r.id === roomId; })[0];
  if (!room || (room.occupants || []).length >= room.capacity) return false;
  if (room.gender !== s.gender) { WF.notify({ aud: 'uid:' + byId, title: 'Allocation blocked', body: 'Room gender does not match student.', tone: 'red' }); return false; }
  if (s.roomId) { var old = db().hostelRooms.filter(function (r) { return r.id === s.roomId; })[0]; if (old) old.occupants = old.occupants.filter(function (x) { return x !== studentId; }); }
  room.occupants.push(studentId);
  s.hostel = true; s.block = room.block; s.roomId = room.id;
  WF.commit(byId, 'Room allocation', s.name + ' → ' + room.id,
    { aud: 'uid:' + studentId, title: 'Hostel room allocated', body: 'You are allocated to ' + room.id + ' (' + Q.wardenOf(room.block).blockName + ').', link: 'hostel.html', tone: 'green' });
  return true;
};
WF.vacateRoom = function (studentId, byId) {
  var s = Q.studentById(studentId);
  if (!s.roomId) return;
  var room = db().hostelRooms.filter(function (r) { return r.id === s.roomId; })[0];
  if (room) room.occupants = room.occupants.filter(function (x) { return x !== studentId; });
  WF.commit(byId, 'Room vacated', s.name + ' — ' + s.roomId, { aud: 'uid:' + studentId, title: 'Room vacated', body: 'Your allocation for ' + s.roomId + ' has been withdrawn.', tone: 'yellow' });
  s.hostel = false; s.block = null; s.roomId = null;
};
WF.updateMessMenu = function (day, meal, value, byId) {
  var m = db().messMenu.filter(function (x) { return x.day === day; })[0];
  if (m) m[meal] = value;
  WF.commit(byId, 'Updated mess menu', day + ' · ' + meal,
    { aud: 'all', title: 'Mess menu updated', body: day + ' — ' + meal + ' revised.', link: 'mess.html', tone: 'green' });
};
WF.submitComplaint = function (studentId, f) {
  var s = Q.studentById(studentId);
  var c = { id: sid(), by: studentId, block: s.block || 'A', category: f.category, title: f.title, desc: f.desc, status: 'Open', at: nowStr(), resolvedBy: null, resolution: null };
  db().complaints.unshift(c);
  var wid = (s.block === 'B' ? 'WG1' : 'WB1');
  WF.notify({ aud: 'role:warden', title: 'New hostel complaint', body: s.name + ' — ' + f.title, link: 'complaints.html', tone: 'yellow' });
  WF.commit(studentId, 'Raised hostel complaint', f.title);
  return c;
};
WF.resolveComplaint = function (cid, byId, resolution) {
  var c = db().complaints.filter(function (x) { return x.id === cid; })[0];
  if (!c) return;
  c.status = 'Resolved'; c.resolvedBy = byId; c.resolution = resolution;
  WF.commit(byId, 'Resolved hostel complaint', c.title,
    { aud: 'uid:' + c.by, title: 'Complaint resolved', body: c.title + ' — ' + resolution, link: 'hostel.html', tone: 'green' });
};

/* ---------------- Library ---------------- */
WF.issueBook = function (acc, studentId, byId, days) {
  var b = Q.bookByAcc(acc), s = Q.studentById(studentId);
  if (!b || b.available <= 0) return null;
  var due = new Date(db().meta.today); due.setDate(due.getDate() + (days || 14));
  var iso = due.toISOString().slice(0, 10);
  b.available--;
  var rec = { id: sid(), acc: acc, studentId: studentId, out: db().meta.today, due: iso, returned: null, fine: 0, status: 'Active' };
  db().borrowRecords.unshift(rec);
  WF.commit(byId, 'Book issued', b.title + ' → ' + s.name,
    { aud: 'uid:' + studentId, title: 'Book issued', body: b.title + ' · due ' + iso, link: 'library.html', tone: 'green' });
  return rec;
};
WF.returnBook = function (borrowId, byId) {
  var r = db().borrowRecords.filter(function (x) { return x.id === borrowId; })[0];
  if (!r || r.returned) return 0;
  var b = Q.bookByAcc(r.acc);
  var late = Math.max(0, Math.round((new Date(db().meta.today) - new Date(r.due)) / 86400000));
  var fine = late * 5;
  r.returned = db().meta.today; r.status = 'Returned'; r.fine = fine;
  if (b) b.available++;
  WF.commit(byId, 'Book returned', (b ? b.title : r.acc) + ' — fine ₹' + fine,
    { aud: 'uid:' + r.studentId, title: 'Book returned', body: (b ? b.title : '') + ' — fine ₹' + fine, link: 'library.html', tone: fine ? 'yellow' : 'green' });
  return fine;
};
WF.renewBook = function (borrowId) {
  var r = db().borrowRecords.filter(function (x) { return x.id === borrowId; })[0];
  if (!r || r.returned) return;
  var d = new Date(r.due); d.setDate(d.getDate() + 14);
  r.due = d.toISOString().slice(0, 10);
  WF.commit(r.studentId, 'Book renewed', r.acc + ' → ' + r.due, { aud: 'uid:' + r.studentId, title: 'Book renewed', body: 'New due date ' + r.due, link: 'library.html', tone: 'green' });
};

/* ---------------- Mentor ---------------- */
WF.requestMentorMeeting = function (studentId, topic) {
  var mg = Q.mentorGroupOf(studentId);
  var s = Q.studentById(studentId);
  WF.notify({ aud: 'uid:' + (mg ? mg.mentorId : 'T01'), title: 'Mentor meeting requested', body: s.name + ' — ' + topic, link: 'mentor.html', tone: 'blue' });
  WF.commit(studentId, 'Requested mentor meeting', topic);
};
WF.logMentorMeeting = function (mentorId, notes) {
  var mg = Q.mentorGroupsOf(mentorId)[0];
  db().mentorMeetings.push({ id: sid(), groupId: mg ? mg.id : 'MG1', date: db().meta.today, agenda: 'Mentor session', notes: notes, attended: mg ? mg.students.length : 0 });
  WF.commit(mentorId, 'Logged mentor meeting', notes.slice(0, 60));
  if (mg) WF.notify({ aud: 'class:' + (mg ? mg.classId : 'CSE-A'), title: 'Mentor meeting logged', body: 'New mentor notes available.', link: 'mentor.html', tone: 'green' });
};

/* ---------------- Placement / scholarship ---------------- */
WF.postDrive = function (byId, f) {
  var d = { id: sid(), company: f.company, role: f.role, ctc: f.ctc, location: f.location, date: f.date, regBy: f.regBy, eligibility: f.eligibility, status: 'Open', by: byId, applied: 0 };
  db().placementDrives.unshift(d);
  WF.commit(byId, 'Posted placement drive', f.company + ' — ' + f.role + ' (' + f.ctc + ')',
    { aud: 'all', title: 'New placement drive — ' + f.company, body: f.role + ' · ' + f.ctc + ' · drive on ' + f.date, link: 'placement.html', tone: 'green' });
  return d;
};
WF.applyDrive = function (driveId, studentId) {
  var ex = db().placementApps.filter(function (a) { return a.driveId === driveId && a.studentId === studentId; })[0];
  if (ex) return ex;
  var app = { id: sid(), driveId: driveId, studentId: studentId, status: 'Applied', at: db().meta.today, rounds: 'Awaiting shortlist', offer: null };
  db().placementApps.push(app);
  var dr = db().placementDrives.filter(function (x) { return x.id === driveId; })[0];
  if (dr) dr.applied++;
  WF.commit(studentId, 'Applied to drive', dr.company + ' — ' + dr.role, { aud: 'uid:' + studentId, title: 'Application submitted', body: dr.company + ' — ' + dr.role + '. Watch for shortlist updates.', link: 'placement.html', tone: 'green' });
  return app;
};
WF.updatePlacementApp = function (appId, status, note, byId) {
  var a = db().placementApps.filter(function (x) { return x.id === appId; })[0];
  if (!a) return;
  a.status = status; if (note) a.rounds = note;
  var dr = db().placementDrives.filter(function (x) { return x.id === a.driveId; })[0];
  WF.commit(byId, 'Placement application update', dr.company + ' — ' + Q.studentById(a.studentId).name + ' → ' + status,
    { aud: 'uid:' + a.studentId, title: 'Drive update — ' + dr.company, body: 'Your application is now ' + status + '. ' + (note || ''), link: 'placement.html', tone: status === 'Offered' ? 'green' : (status === 'Not Selected' ? 'red' : 'blue') });
};
WF.applyScholarship = function (studentId, schemeId, docs) {
  var s = Q.studentById(studentId);
  var app = { id: sid(), studentId: studentId, schemeId: schemeId, appliedAt: db().meta.today, docs: docs || [], status: 'Applied', verifiedBy: null, approvedBy: null,
    timeline: [ { s: 'Applied', at: db().meta.today, by: studentId }, { s: 'Office Verification', at: null, by: 'OF1' }, { s: 'Principal Approval', at: null, by: 'PR1' } ] };
  db().scholarshipApps.unshift(app);
  WF.commit(studentId, 'Applied for scholarship', Q.schemeName(schemeId),
    { aud: 'role:office', title: 'Scholarship application received', body: s.name + ' — ' + Q.schemeName(schemeId), link: 'scholarships.html', tone: 'blue' });
  return app;
};
Q.schemeName = function (id) { var x = (g.DB || {}).scholarshipSchemes || []; for (var i = 0; i < x.length; i++) if (x[i].id === id) return x[i].name; return id; };
WF.verifyScholarship = function (appId, byId, ok, note) {
  var a = db().scholarshipApps.filter(function (x) { return x.id === appId; })[0];
  if (!a) return;
  a.status = ok ? 'Verified' : 'Rejected'; a.verifiedBy = byId;
  var step = a.timeline.filter(function (t) { return t.by === 'OF1'; })[0];
  if (step) { step.at = db().meta.today; step.s = (ok ? 'Documents verified' : 'Rejected') + ' by Office'; if (note) step.note = note; }
  WF.commit(byId, (ok ? 'Verified' : 'Rejected') + ' scholarship application', Q.studentById(a.studentId).name,
    ok ? { aud: 'role:principal', title: 'Scholarship awaiting your approval', body: Q.studentById(a.studentId).name + ' — ' + Q.schemeName(a.schemeId) + ', verified by office.', link: 'approvals.html', tone: 'yellow' }
       : { aud: 'uid:' + a.studentId, title: 'Scholarship rejected at verification', body: note || '', link: 'scholarship.html', tone: 'red' });
};
WF.decideScholarship = function (appId, approve, note) {
  var a = db().scholarshipApps.filter(function (x) { return x.id === appId; })[0];
  if (!a) return;
  a.status = approve ? 'Approved' : 'Rejected'; a.approvedBy = 'PR1';
  var step = a.timeline.filter(function (t) { return t.by === 'PR1'; })[0];
  if (step) { step.at = db().meta.today; step.s = (approve ? 'Approved' : 'Rejected') + ' by Principal'; if (note) step.note = note; }
  WF.commit('PR1', (approve ? 'Approved' : 'Rejected') + ' scholarship', Q.studentById(a.studentId).name + ' — ' + Q.schemeName(a.schemeId),
    { aud: 'uid:' + a.studentId, title: 'Scholarship ' + (approve ? 'approved' : 'rejected'), body: note || (approve ? 'Disbursement will reflect in your fee account.' : ''), link: 'scholarship.html', tone: approve ? 'green' : 'red' });
};

/* ---------------- Circulars / calendar / tickets / users / settings ---------------- */
WF.publishCircular = function (byId, f) {
  var c = { id: sid(), title: f.title, body: f.body, audience: f.audience, urgent: !!f.urgent, by: byId, at: db().meta.today };
  db().circulars.unshift(c);
  if (f.urgent) db().flashNews.unshift(f.title);
  var audMap = { 'All': 'all', 'Students': 'role:student', 'Staff': 'role:teacher', 'Hostellers': 'all' };
  WF.commit(byId, 'Published circular', f.title, { aud: audMap[f.audience] || 'all', title: f.title, body: f.body.slice(0, 90) + (f.body.length > 90 ? '…' : ''), link: 'dashboard.html', tone: f.urgent ? 'red' : 'blue' });
  WF.notify({ aud: 'role:academic', title: 'Circular published', body: f.title, tone: 'blue' });
  WF.notify({ aud: 'role:principal', title: 'Circular published', body: f.title, tone: 'blue' });
  return c;
};
WF.addCalendarEvent = function (byId, f) {
  db().calendarEvents.push({ id: sid(), date: f.date, title: f.title, type: f.type, audience: f.audience });
  db().calendarEvents.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
  WF.commit(byId, 'Added calendar event', f.title + ' — ' + f.date, { aud: 'all', title: 'Calendar: ' + f.title, body: f.date, link: 'calendar.html', tone: 'blue' });
};
WF.removeCalendarEvent = function (byId, evId) {
  db().calendarEvents = db().calendarEvents.filter(function (e) { return e.id !== evId; });
  WF.commit(byId, 'Removed calendar event', evId);
};
WF.createTicket = function (userId, f, person) {
  var no = 'TK-' + (100 + db().tickets.length + 1);
  var eta = UI.addDays(nowStr().slice(0, 10), UI.SLA[f.priority] || 4);
  var t = { id: sid(), no: no, by: userId, category: f.category, title: f.title, desc: f.desc, priority: f.priority, status: 'Open',
    at: nowStr(), eta: eta, assignee: null, files: f.files || [], thread: [], rating: null,
    timeline: [ { s: 'Opened', at: nowStr(), by: userId, note: f.files && f.files.length ? f.files.length + ' attachment(s) included' : '' } ] };
  db().tickets.unshift(t);
  WF.notify({ aud: 'role:office', title: 'New ' + f.priority.toLowerCase() + ' ticket', body: no + ' — ' + f.title + ' · expected by ' + eta, link: 'tickets.html', tone: f.priority === 'Critical' ? 'red' : 'yellow' });
  WF.notify({ aud: 'role:admin', title: 'Ticket ' + no + ' raised', body: f.category + ' — ' + f.title, link: 'tickets.html', tone: 'yellow' });
  WF.commit(person ? person.id : userId, 'Raised ticket', no + ' — ' + f.title);
  return t;
};
WF.replyTicket = function (ticketId, userId, text) {
  var t = db().tickets.filter(function (x) { return x.id === ticketId; })[0];
  if (!t) return;
  t.thread.push({ by: userId, at: nowStr(), text: text });
  if (t.status === 'Open' || t.status === 'Resolved') t.status = 'In Progress';
  var user = Q.user(t.by);
  if (userId === t.by) {
    WF.notify({ aud: 'role:office', title: 'Reply on ' + t.no, body: text.slice(0, 80), link: 'tickets.html', tone: 'blue' });
  } else if (user) {
    WF.notify({ aud: 'uid:' + user.personId, title: 'Reply on ' + t.no, body: text.slice(0, 80), link: 'tickets.html', tone: 'blue' });
  }
  g.Store.save();
};
WF.assignTicket = function (ticketId, byId, assigneeId) {
  var t = db().tickets.filter(function (x) { return x.id === ticketId; })[0];
  if (!t) return;
  t.assignee = assigneeId;
  if (t.status === 'Open') t.status = 'In Progress';
  t.timeline.push({ s: 'Assigned', at: nowStr(), by: byId, note: 'Handled by ' + (Q.user(assigneeId) ? Q.name(Q.user(assigneeId).personId) : assigneeId) });
  var user = Q.user(t.by);
  if (user) WF.notify({ aud: 'uid:' + user.personId, title: t.no + ' assigned', body: 'Your ticket is now with ' + (Q.user(assigneeId) ? Q.name(Q.user(assigneeId).personId) : 'the service desk') + '.', link: 'tickets.html', tone: 'blue' });
  if (assigneeId !== byId) WF.notify({ aud: 'uid:' + Q.user(assigneeId).personId, title: 'Ticket assigned to you', body: t.no + ' — ' + t.title, link: 'tickets.html', tone: 'yellow' });
  WF.commit(byId, 'Assigned ticket', t.no + ' → ' + (Q.user(assigneeId) ? Q.name(Q.user(assigneeId).personId) : assigneeId));
};
WF.setTicketETA = function (ticketId, byId, iso) {
  var t = db().tickets.filter(function (x) { return x.id === ticketId; })[0];
  if (!t) return;
  t.eta = iso;
  t.timeline.push({ s: 'Expected resolution updated', at: nowStr(), by: byId, note: UI.fmtDate(iso) });
  var user = Q.user(t.by);
  if (user) WF.notify({ aud: 'uid:' + user.personId, title: 'Expected resolution — ' + t.no, body: 'The service desk expects to close this by ' + UI.fmtDate(iso) + '.', link: 'tickets.html', tone: 'yellow' });
  WF.commit(byId, 'Updated expected resolution', t.no + ' → ' + iso);
};
WF.updateTicketStatus = function (ticketId, byId, status, note) {
  var t = db().tickets.filter(function (x) { return x.id === ticketId; })[0];
  if (!t) return;
  t.status = status;
  t.timeline.push({ s: status, at: nowStr(), by: byId, note: note || '' });
  var user = Q.user(t.by);
  if (user) WF.notify({ aud: 'uid:' + user.personId, title: t.no + ' — ' + status, body: note || t.title, link: 'tickets.html', tone: status === 'Resolved' ? 'green' : 'blue' });
  WF.commit(byId, 'Ticket ' + status.toLowerCase(), t.no + ' — ' + t.title);
};
WF.resolveTicket = function (ticketId, byId, note) {
  var t = db().tickets.filter(function (x) { return x.id === ticketId; })[0];
  if (!t) return;
  t.status = 'Resolved'; t.resolvedBy = byId; t.resolvedAt = nowStr();
  t.timeline.push({ s: 'Resolved', at: nowStr(), by: byId, note: note || '' });
  if (note) t.thread.push({ by: byId, at: nowStr(), text: note });
  var user = Q.user(t.by);
  if (user) WF.notify({ aud: 'uid:' + user.personId, title: t.no + ' resolved', body: t.title + (note ? ' — ' + note : '') + ' · please confirm and rate the service.', link: 'tickets.html', tone: 'green' });
  WF.commit(byId, 'Resolved ticket', t.no + ' — ' + t.title);
};
WF.reopenTicket = function (ticketId, userId, reason) {
  var t = db().tickets.filter(function (x) { return x.id === ticketId; })[0];
  if (!t) return;
  t.status = 'In Progress'; t.resolvedAt = null;
  t.timeline.push({ s: 'Reopened', at: nowStr(), by: userId, note: reason || 'Issue persists' });
  WF.notify({ aud: 'role:office', title: t.no + ' reopened', body: reason || 'Issue persists', link: 'tickets.html', tone: 'red' });
  WF.commit(userId, 'Reopened ticket', t.no + ' — ' + t.title);
};
WF.closeTicket = function (ticketId, userId) {
  var t = db().tickets.filter(function (x) { return x.id === ticketId; })[0];
  if (!t) return;
  t.status = 'Closed';
  t.timeline.push({ s: 'Closed', at: nowStr(), by: userId, note: 'Resolution confirmed by the student' });
  WF.notify({ aud: 'role:office', title: t.no + ' closed', body: 'The student confirmed the resolution.', link: 'tickets.html', tone: 'green' });
  WF.commit(userId, 'Closed ticket', t.no + ' — ' + t.title);
};
WF.rateTicket = function (ticketId, userId, stars, remark) {
  var t = db().tickets.filter(function (x) { return x.id === ticketId; })[0];
  if (!t) return;
  t.rating = { stars: stars, remark: remark || '', at: nowStr() };
  t.timeline.push({ s: 'Rated ' + stars + '/5', at: nowStr(), by: userId, note: remark || '' });
  WF.notify({ aud: 'role:office', title: 'Feedback on ' + t.no, body: stars + '/5' + (remark ? ' — ' + remark : ''), link: 'tickets.html', tone: 'green' });
  WF.commit(userId, 'Rated ticket service', t.no + ' — ' + stars + '/5');
};
WF.createUser = function (byId, f) {
  var id = f.personId || sid();
  db().users.push({ id: 'U-' + id, personType: f.personType, personId: id, role: f.role, username: f.email, email: f.email, pass: f.pass || 'demo123', active: true, lastLogin: null });
  WF.commit(byId, 'Created user account', f.email + ' (' + f.role + ')', { aud: 'uid:' + id, title: 'Welcome to CampusOne', body: 'Your access is active.', tone: 'green' });
};
WF.toggleUser = function (byId, userId) {
  var u = Q.user(userId);
  if (!u || u.role === 'admin') return;
  u.active = !u.active;
  WF.commit(byId, u.active ? 'Activated user' : 'Deactivated user', u.email);
};
WF.resetPassword = function (byId, userId) {
  var u = Q.user(userId);
  if (!u) return;
  u.pass = 'demo123';
  WF.commit(byId, 'Reset password', u.email, { aud: 'uid:' + u.personId, title: 'Password reset', body: 'A temporary password has been issued. Change it after signing in.', tone: 'yellow' });
};
WF.updatePhoto = function (personId, dataUrl) {
  db().photos = db().photos || {};
  db().photos[personId] = dataUrl;
  var p = Q.person(personId);
  if (p) { p.photo = dataUrl ? 'set' : null; p.photoSync = dataUrl ? 'Synced' : 'Pending'; }
  g.Store.save();
};
WF.saveSettings = function (byId, f) {
  Object.assign(db().settings, f);
  WF.commit(byId, 'Updated settings', JSON.stringify(f).slice(0, 80));
};
/* v6: administrator maintains the external data sources (Google Sheets data
   grid + Google Drive file storage). Saving updates the live channel config,
   persists an independent copy, and the background source reflects on every
   page immediately — no redeploy, no reload. */
WF.saveIntegrations = function (byId, vals) {
  db().settings.integrations = {
    gsheet: { url: (vals.gsheet && vals.gsheet.url) || '', key: (vals.gsheet && vals.gsheet.key) || '', sheetId: (vals.gsheet && vals.gsheet.sheetId) || '' },
    drive:  { key: (vals.drive && vals.drive.key) || '', folder: (vals.drive && vals.drive.folder) || '' },
    updatedBy: byId, updatedAt: nowStr()
  };
  try { g.localStorage.setItem('MDT_INTEGRATIONS', JSON.stringify(db().settings.integrations)); } catch (e) {}
  g.Api.apply(db().settings.integrations);
  var live = g.Api.active();
  WF.commit(byId, 'Updated data-source integration', live ? 'Live channel bound: ' + String(db().settings.integrations.gsheet.url).slice(0, 60) : 'Returned to the built-in demo data source',
    { aud: 'uid:' + byId, title: 'Data source updated', body: live ? 'The portal now reads and writes through the Google Sheets channel you configured.' : 'The portal is back on the built-in demo data source.', link: 'settings.html', tone: live ? 'green' : 'yellow' });
  return live;
};
WF.restoreReferenceData = function (byId) {
  g.Store.reset();
  WF.log(byId || 'SYS1', 'Reference dataset restored', 'Portal data reset to the institutional baseline');
};

/* ═══════════════════════════════════════════════════════════════════════
   v8 · LIBRARY — circulation desk, catalogue, fines, procurement, inventory
   ═══════════════════════════════════════════════════════════════════════ */
WF.addBook = function (byId, f) {
  var n = db().libraryBooks.length + 1;
  var acc = 'LB-' + (n < 10 ? '0' + n : n);
  db().libraryBooks.push({ acc: acc, title: f.title, author: f.author, subject: f.subject, dept: f.dept, copies: +f.copies || 1, available: +f.copies || 1,
    publisher: f.publisher, rack: f.rack, shelf: f.shelf, year: +f.year || new Date().getFullYear(), edition: f.edition || '1e', price: +f.price || 0, type: f.type || 'Text Book', status: 'Available' });
  WF.commit(byId, 'Accessioned new title', f.title + ' — ' + f.copies + ' copies (' + acc + ')');
  return acc;
};
WF.updateBook = function (byId, acc, f) {
  var b = Q.bookByAcc(acc); if (!b) return;
  ['title','author','subject','dept','publisher','rack','shelf','type','status'].forEach(function (k) { if (f[k] != null && f[k] !== '') b[k] = f[k]; });
  if (f.copies) { var diff = +f.copies - b.copies; b.copies = +f.copies; b.available = Math.max(0, b.available + diff); }
  WF.commit(byId, 'Updated catalogue record', acc + ' — ' + b.title);
};
WF.reserveBook = function (acc, studentId) {
  var ex = db().bookReservations.filter(function (r) { return r.acc === acc && r.studentId === studentId && r.status !== 'Closed'; })[0];
  if (ex) return ex;
  var r = { id: sid(), acc: acc, studentId: studentId, at: nowStr(), status: 'Waiting', note: 'Queue position updated by the desk' };
  db().bookReservations.unshift(r);
  WF.commit(studentId, 'Reserved a book', Q.bookByAcc(acc).title,
    { aud: 'role:library', title: 'New reservation', body: Q.studentById(studentId).name + ' — ' + Q.bookByAcc(acc).title, link: 'transactions.html', tone: 'blue' });
  return r;
};
WF.markReservation = function (byId, rsvId, status) {
  var r = db().bookReservations.filter(function (x) { return x.id === rsvId; })[0]; if (!r) return;
  r.status = status;
  WF.commit(byId, 'Reservation ' + status.toLowerCase(), r.acc + ' — ' + Q.name(r.studentId),
    status === 'Ready' ? { aud: 'uid:' + r.studentId, title: 'Reserved book ready', body: Q.bookByAcc(r.acc).title + ' is held for you until 3 days from now.', link: 'library.html', tone: 'green' } : null);
};
WF.issueBookStaff = function (acc, staffId, byId, days) {
  var b = Q.bookByAcc(acc); if (!b || b.available <= 0) return null;
  var due = new Date(db().meta.today); due.setDate(due.getDate() + (days || 21));
  var iso = due.toISOString().slice(0, 10);
  b.available--;
  var rec = { id: sid(), acc: acc, staffId: staffId, out: db().meta.today, due: iso, returned: null, fine: 0, status: 'Active' };
  db().staffLoans.unshift(rec);
  WF.commit(byId, 'Book issued (staff)', b.title + ' → ' + Q.name(staffId),
    { aud: 'uid:' + staffId, title: 'Book issued', body: b.title + ' · due ' + iso, tone: 'green' });
  return rec;
};
WF.returnStaffBook = function (loanId, byId) {
  var r = db().staffLoans.filter(function (x) { return x.id === loanId; })[0]; if (!r || r.returned) return 0;
  var b = Q.bookByAcc(r.acc);
  var late = Math.max(0, Math.round((new Date(db().meta.today) - new Date(r.due)) / 86400000));
  var fine = late * 5;
  r.returned = db().meta.today; r.status = 'Returned'; r.fine = fine;
  if (b) b.available++;
  WF.commit(byId, 'Staff book returned', (b ? b.title : r.acc) + ' — fine ₹' + fine,
    { aud: 'uid:' + r.staffId, title: 'Book returned', body: (b ? b.title : '') + ' — fine ₹' + fine, tone: fine ? 'yellow' : 'green' });
  return fine;
};
WF.collectFine = function (byId, entryId, mode) {
  var fl = db().fineLedger.filter(function (x) { return x.id === entryId; })[0]; if (!fl) return;
  fl.type = 'Collected'; fl.mode = mode || 'Cash'; fl.by = byId; fl.at = nowStr();
  WF.commit(byId, 'Fine collected', '₹' + fl.amount + ' — ' + Q.name(fl.memberId) + ' (' + fl.reason + ')',
    fl.memberType === 'student' ? { aud: 'uid:' + fl.memberId, title: 'Library fine collected', body: '₹' + fl.amount + ' towards ' + fl.reason + '. Receipt available at the desk.', link: 'library.html', tone: 'green' } : null);
};
WF.waiveFine = function (byId, entryId, reason) {
  var fl = db().fineLedger.filter(function (x) { return x.id === entryId; })[0]; if (!fl) return;
  fl.type = 'Waived'; fl.reason = fl.reason + ' · waived: ' + (reason || 'reviewed'); fl.by = byId; fl.at = nowStr();
  WF.commit(byId, 'Fine waived', '₹' + fl.amount + ' — ' + Q.name(fl.memberId), null);
};
WF.addFineEntry = function (byId, memberId, memberType, amount, reason) {
  var e = { id: sid(), memberId: memberId, memberType: memberType, borrow: null, amount: +amount, type: 'Outstanding', mode: '—', reason: reason, by: null, at: nowStr() };
  db().fineLedger.unshift(e);
  WF.commit(byId, 'Fine recorded', '₹' + amount + ' — ' + Q.name(memberId) + ' (' + reason + ')',
    memberType === 'student' ? { aud: 'uid:' + memberId, title: 'Library fine recorded', body: '₹' + amount + ' — ' + reason, link: 'library.html', tone: 'yellow' } : null);
  return e;
};
WF.receiveJournal = function (byId, issueId) {
  var j = db().journalIssues.filter(function (x) { return x.id === issueId; })[0]; if (!j) return;
  j.received = db().meta.today; j.flag = '';
  WF.commit(byId, 'Journal issue received', j.journalId + ' vol ' + j.vol + ' issue ' + j.issue);
};
WF.flagJournalMissing = function (byId, issueId) {
  var j = db().journalIssues.filter(function (x) { return x.id === issueId; })[0]; if (!j) return;
  j.flag = 'Missing — vendor notified (' + db().meta.today + ')';
  WF.commit(byId, 'Flagged missing issue', j.journalId + ' issue ' + j.issue);
};
WF.addDigitalResource = function (byId, f) {
  var d = { id: sid(), name: f.name, type: f.type, provider: f.provider, access: f.access, url: f.url, usage: 0, status: 'Active' };
  db().digitalResources.unshift(d);
  WF.commit(byId, 'Added digital resource', f.name,
    { aud: 'role:student', title: 'New e-resource — ' + f.name, body: f.provider + ' · ' + f.access + '. Open the Library page to explore.', link: 'library.html', tone: 'green' });
  return d;
};
WF.submitRequisition = function (byId, dept, items) {
  var total = items.reduce(function (a, i) { return a + i.copies * i.price; }, 0);
  var rq = { id: sid(), dept: dept, by: byId, at: db().meta.today, items: items, total: total, status: 'Submitted',
    timeline: [ { s: 'Submitted by Department', at: nowStr(), by: byId }, { s: 'Librarian Review', at: null, by: 'OF2' }, { s: 'Principal Approval', at: null, by: 'PR1' } ] };
  db().requisitions.unshift(rq);
  WF.commit(byId, 'Submitted book requisition', dept + ' — ' + items.length + ' titles · ₹' + total,
    { aud: 'role:library', title: 'Requisition received', body: dept + ' — ' + items.length + ' titles · ₹' + total, link: 'procurement.html', tone: 'blue' });
  return rq;
};
WF.decideRequisition = function (rqId, stage, ok, note) {
  var rq = db().requisitions.filter(function (x) { return x.id === rqId; })[0]; if (!rq) return;
  var step = rq.timeline.filter(function (t) { return t.by === (stage === 'librarian' ? 'OF2' : 'PR1'); })[0];
  if (stage === 'librarian') {
    rq.status = ok ? 'With Principal' : 'Returned';
    if (step) { step.at = nowStr(); step.s = ok ? 'Librarian Reviewed & Recommended' : 'Returned by Librarian'; if (note) step.note = note; }
    WF.commit('OF2', ok ? 'Recommended requisition' : 'Returned requisition', rq.dept + ' — ₹' + rq.total,
      ok ? { aud: 'role:principal', title: 'Book purchase approval pending', body: rq.dept + ' — ' + rq.items.length + ' titles · ₹' + rq.total, link: 'approvals.html', tone: 'yellow' }
         : { aud: 'uid:' + rq.by, title: 'Requisition returned', body: note || 'Review the librarian\u2019s note.', tone: 'red' });
  } else {
    rq.status = ok ? 'Approved' : 'Rejected';
    if (step) { step.at = nowStr(); step.s = (ok ? 'Principal Approved' : 'Rejected') + (note ? ' — ' + note : ''); }
    WF.commit('PR1', ok ? 'Approved requisition' : 'Rejected requisition', rq.dept + ' — ₹' + rq.total,
      { aud: 'role:library', title: 'Requisition ' + (ok ? 'approved' : 'rejected'), body: rq.dept + ' — ' + rq.items.length + ' titles · ₹' + rq.total + (note ? ' — ' + note : ''), link: 'procurement.html', tone: ok ? 'green' : 'red' });
  }
  g.Store.save();
};
WF.orderRequisition = function (byId, rqId, vendor) {
  var rq = db().requisitions.filter(function (x) { return x.id === rqId; })[0]; if (!rq) return;
  rq.status = 'Ordered';
  rq.timeline.push({ s: 'Purchase Order Placed', at: nowStr(), by: byId, note: 'Vendor ' + vendor });
  db().purchaseOrders.unshift({ id: 'PO-2026-0' + (23 + db().purchaseOrders.length), vendor: vendor, item: rq.items.map(function (i) { return i.title; }).join(' + '), qty: rq.items.reduce(function (a, i) { return a + (+i.copies); }, 0), amount: rq.total, date: db().meta.today, linked: rq.id, status: 'Ordered' });
  WF.commit(byId, 'Purchase order placed', rq.id + ' → ' + vendor + ' · ₹' + rq.total);
};
WF.receiveOrder = function (byId, rqId) {
  var rq = db().requisitions.filter(function (x) { return x.id === rqId; })[0]; if (!rq) return;
  rq.status = 'Received';
  rq.timeline.push({ s: 'Accessioned to Catalogue', at: nowStr(), by: byId });
  rq.items.forEach(function (it) {
    var n = db().libraryBooks.length + 1;
    db().libraryBooks.push({ acc: 'LB-' + pad3(n), title: it.title, author: it.author, subject: 'Procured — ' + rq.dept, dept: rq.dept, copies: +it.copies, available: +it.copies,
      publisher: it.publisher, rack: 'NEW', shelf: 'INTAKE', year: new Date().getFullYear(), edition: '1e', price: +it.price, type: 'Text Book', status: 'Available' });
  });
  WF.commit(byId, 'Order received & accessioned', rq.id + ' — ' + rq.items.length + ' titles');
};
WF.weedBook = function (byId, acc, reason, mode) {
  var b = Q.bookByAcc(acc); if (!b) return;
  db().weeded.unshift({ acc: acc, reason: reason, mode: mode || 'Weeded', date: db().meta.today, by: byId });
  WF.commit(byId, 'Weeded record', acc + ' — ' + reason);
};
function pad3(n) { return (n < 10 ? '00' : n < 100 ? '0' : '') + n; }

/* ═══════════════════════════════════════════════════════════════════════
   v8 · EXAMINATION CELL — scheduling, attendance, valuation, results, reval
   ═══════════════════════════════════════════════════════════════════════ */
WF.createExam = function (byId, f) {
  var ex = { id: sid().slice(0, 5), name: f.name, sem: +f.sem || 5, classes: [f.classId], from: f.from, to: f.to, status: 'Scheduled', published: false };
  db().exams.unshift(ex);
  WF.commit(byId, 'Created exam schedule', f.name + ' — ' + f.from + ' → ' + f.to,
    { aud: 'all', title: 'Exam scheduled — ' + f.name, body: f.from + ' to ' + f.to + ' · timetable follows from the examination cell.', link: 'calendar.html', tone: 'blue' });
  return ex;
};
WF.markExamAttendance = function (byId, sessionId, marks) {
  var sess = db().examSessions.filter(function (x) { return x.id === sessionId; })[0]; if (!sess) return;
  db().examAttendance[sessionId] = marks;
  var abs = Object.keys(marks).filter(function (k) { return marks[k] === 'A'; }).length;
  WF.commit(byId, 'Exam attendance saved', sess.courseId + ' · ' + sess.classId + ' — ' + abs + ' absent');
};
WF.logMalpractice = function (byId, sessionId, studentId, nature, action) {
  var s = Q.studentById(studentId); if (!s) return;
  db().malpractice.unshift({ id: sid(), session: sessionId, studentId: studentId, nature: nature, action: action, at: db().meta.today, by: byId });
  WF.commit(byId, 'Malpractice recorded', s.name + ' — ' + nature,
    [{ aud: 'uid:' + studentId, title: 'Exam malpractice record', body: nature + ' — ' + action, tone: 'red' },
     { aud: 'role:principal', title: 'Malpractice reported', body: s.name + ' (' + s.reg + ') — ' + nature, tone: 'red' }]);
};
WF.submitValuation = function (byId, batchId, count) {
  var vb = db().valuationBatches.filter(function (x) { return x.id === batchId; })[0]; if (!vb) return;
  vb.evaluated = Math.min(vb.scripts, vb.evaluated + (+count || 0));
  if (vb.evaluated >= vb.scripts) vb.status = 'Completed';
  else vb.status = 'In Progress';
  WF.commit(byId, 'Valuation progress saved', vb.courseId + ' — ' + vb.evaluated + '/' + vb.scripts + ' scripts',
    vb.status === 'Completed' ? { aud: 'role:examcell', title: 'Valuation batch completed', body: vb.courseId + ' — all ' + vb.scripts + ' scripts done.', link: 'valuation.html', tone: 'green' } : null);
};
WF.verifyRemuneration = function (byId, batchId, field, ok) {
  var vb = db().valuationBatches.filter(function (x) { return x.id === batchId; })[0]; if (!vb) return;
  var map = { bank: 'bank', pan: 'pan', signature: 'signature' };
  var k = map[field] || field;
  vb.remuneration[k] = ok ? 'Verified' : 'Pending';
  if (vb.remuneration.bank === 'Verified' && vb.remuneration.pan === 'Verified' && vb.remuneration.signature === 'Verified' && vb.status === 'Completed') vb.remuneration.paid = 'Payment queued';
  WF.commit(byId, 'Remuneration ' + (ok ? 'verified' : 'reset'), vb.courseId + ' — ' + k,
    { aud: 'uid:' + vb.teacherId, title: 'Valuation remuneration — ' + (ok ? k + ' verified' : k + ' pending'), body: 'Internal Assessment valuation · ₹' + vb.remuneration.amount, tone: ok ? 'green' : 'yellow' });
};
WF.payRemuneration = function (byId, batchId) {
  var vb = db().valuationBatches.filter(function (x) { return x.id === batchId; })[0]; if (!vb) return;
  vb.remuneration.paid = 'Paid ' + db().meta.today.slice(5);
  WF.commit(byId, 'Valuation remuneration paid', vb.courseId + ' — ₹' + vb.remuneration.amount + ' → ' + Q.name(vb.teacherId),
    { aud: 'uid:' + vb.teacherId, title: 'Valuation remuneration paid', body: '₹' + vb.remuneration.amount + ' credited for ' + vb.courseId + ' valuation.', tone: 'green' });
};
WF.publishResults = function (byId, classId) {
  var ex = db().exams.filter(function (x) { return x.id === 'EX1'; })[0];
  if (ex) { ex.published = true; }
  WF.commit(byId, 'Published internal results', classId + ' — Internal Assessment I',
    { aud: 'class:' + classId, title: 'Internal results published', body: 'Internal Assessment I marks are now visible on your Exams & Scores page.', link: 'exams.html', tone: 'green' });
};
WF.submitRevaluation = function (studentId, courseId, type) {
  var s = Q.studentById(studentId);
  var rv = { id: sid(), studentId: studentId, courseId: courseId, exam: 'Internal Assessment — I', type: type, fee: type === 'Recount' ? 100 : 500, appliedAt: db().meta.today, status: 'Applied', oldMark: (Q.marksOf(studentId)[courseId] || {}).I1 || 0, newMark: null, evaluator: null, remark: null };
  db().revalRequests.unshift(rv);
  WF.commit(studentId, 'Applied for ' + type.toLowerCase(), courseId + ' — ' + s.reg,
    { aud: 'role:examcell', title: type + ' request received', body: s.name + ' (' + s.reg + ') — ' + courseId + ' · fee ₹' + rv.fee, link: 'revaluation.html', tone: 'blue' });
  return rv;
};
WF.decideRevaluation = function (byId, rvId, approve, newMark, remark) {
  var rv = db().revalRequests.filter(function (x) { return x.id === rvId; })[0]; if (!rv) return;
  var s = Q.studentById(rv.studentId);
  if (approve) {
    rv.status = 'Completed'; rv.newMark = newMark != null ? +newMark : rv.oldMark; rv.remark = remark || 'Revalued';
    var m = db().marks[rv.studentId]; if (m && m[rv.courseId]) m[rv.courseId].I1 = rv.newMark;
  } else { rv.status = 'Rejected'; rv.remark = remark || 'No change after review'; }
  WF.commit(byId, (approve ? 'Completed' : 'Rejected') + ' revaluation', s.name + ' — ' + rv.courseId,
    { aud: 'uid:' + rv.studentId, title: 'Revaluation ' + (approve ? 'completed' : 'rejected'), body: rv.courseId + ' — ' + rv.oldMark + ' → ' + (approve ? rv.newMark : rv.oldMark) + (remark ? ' · ' + remark : ''), link: 'exams.html', tone: approve ? 'green' : 'red' });
  g.Store.save();
};
WF.issueTranscript = function (byId, studentId, type) {
  var s = Q.studentById(studentId);
  db().transcripts.unshift({ id: sid(), studentId: studentId, type: type, pages: type.indexOf('Consolidated') === 0 ? 4 : 1, issuedAt: db().meta.today, by: byId, purpose: 'Issued from exam cell' });
  WF.commit(byId, 'Issued ' + type.toLowerCase(), s.name + ' (' + s.reg + ')',
    { aud: 'uid:' + studentId, title: type + ' issued', body: 'Collect the attested copy from the examination cell counter.', tone: 'green' });
};

/* ═══════════════════════════════════════════════════════════════════════
   v8 · PLACEMENT CELL — recruiters, drives, training, internships
   ═══════════════════════════════════════════════════════════════════════ */
WF.addRecruiter = function (byId, f) {
  var rc = { id: sid(), name: f.name, industry: f.industry, hr: f.hr, email: f.email, phone: f.phone, mou: f.mou || 'In Discussion', lastVisit: null, offers: 0, eligibility: f.eligibility || 'CGPA ≥ 7.0', status: 'Active' };
  db().recruiters.unshift(rc);
  WF.commit(byId, 'Added recruiter', f.name + ' — ' + f.industry);
  return rc;
};
WF.updateDriveRound = function (byId, appId, roundNote, status) {
  var a = db().placementApps.filter(function (x) { return x.id === appId; })[0]; if (!a) return;
  if (status) a.status = status;
  if (roundNote) a.rounds = roundNote;
  if (status === 'Offered') a.offer = '₹ CTC — joining details by email';
  var dr = db().placementDrives.filter(function (x) { return x.id === a.driveId; })[0];
  WF.commit(byId, 'Drive round updated', (dr ? dr.company : '') + ' — ' + Q.name(a.studentId) + ' → ' + (status || 'progress'),
    { aud: 'uid:' + a.studentId, title: 'Drive update — ' + (dr ? dr.company : ''), body: (roundNote || '') + (status ? ' · Status: ' + status : ''), link: 'placement.html', tone: status === 'Offered' ? 'green' : 'blue' });
};
WF.addTrainingBatch = function (byId, f) {
  var tb = { id: sid(), name: f.name, type: f.type, trainer: f.trainer, from: f.from, to: f.to, classes: [f.classId], students: Q.studentsOf(f.classId).length, sessions: +f.sessions || 8, avgAttendance: null, avgScore: null, status: 'Upcoming' };
  db().trainingBatches.unshift(tb);
  WF.commit(byId, 'Scheduled training batch', f.name + ' — ' + f.classId,
    { aud: 'class:' + f.classId, title: 'New training programme — ' + f.name, body: f.trainer + ' · ' + f.from + ' to ' + f.to, link: 'placement.html', tone: 'green' });
  return tb;
};
WF.logTrainingSession = function (byId, batchId, attended) {
  var tb = db().trainingBatches.filter(function (x) { return x.id === batchId; })[0]; if (!tb) return;
  var pct = Math.round(attended / tb.students * 100);
  tb.avgAttendance = tb.avgAttendance == null ? pct : Math.round((tb.avgAttendance + pct) / 2);
  WF.commit(byId, 'Training attendance logged', tb.name + ' — ' + attended + '/' + tb.students);
};
WF.decideInternship = function (byId, inId, ok, note) {
  var i = db().internships.filter(function (x) { return x.id === inId; })[0]; if (!i) return;
  i.status = ok ? 'Approved' : 'Rejected';
  if (note) i.outcome = note;
  WF.commit(byId, (ok ? 'Approved' : 'Rejected') + ' internship', Q.name(i.studentId) + ' — ' + i.company,
    { aud: 'uid:' + i.studentId, title: 'Internship ' + (ok ? 'approved' : 'rejected'), body: i.company + ' · ' + i.role + (note ? ' — ' + note : ''), link: 'placement.html', tone: ok ? 'green' : 'red' });
};

/* ═══════════════════════════════════════════════════════════════════════
   v8 · ACCOUNTS — payroll, expenses, budgets, vendors
   ═══════════════════════════════════════════════════════════════════════ */
WF.runPayroll = function (byId, month) {
  var staff = db().staff.length;
  var gross = 0, net = 0;
  db().staff.forEach(function (s) { var p = db().payroll[s.id]; if (p) { gross += p.basic + p.da + p.hra + p.other; net += p.net; } });
  var run = { id: 'PR-' + sid().slice(0, 4).toUpperCase(), month: month, runBy: byId, runAt: nowStr(), staff: staff, gross: gross, net: net, status: 'Draft — pending disbursement' };
  db().payrollRuns.unshift(run);
  WF.commit(byId, 'Payroll processed', month + ' — ₹' + net + ' net for ' + staff + ' staff',
    { aud: 'role:principal', title: 'Payroll ready for disbursement', body: month + ' — net ₹' + net + ' for ' + staff + ' staff members.', link: 'finance.html', tone: 'yellow' });
  return run;
};
WF.disbursePayroll = function (byId, runId) {
  var run = db().payrollRuns.filter(function (x) { return x.id === runId; })[0]; if (!run) return;
  run.status = 'Disbursed';
  WF.commit(byId, 'Payroll disbursed', run.month + ' — ₹' + run.net + ' net',
    { aud: 'role:teacher', title: 'Salary credited — ' + run.month, body: 'Payslips are available in the portal records.', tone: 'green' });
};
WF.submitExpense = function (byId, role, f) {
  var ev = { id: sid(), by: byId, role: role, category: f.category, desc: f.desc, amount: +f.amount, raisedAt: db().meta.today, status: 'Submitted', mode: 'Pending',
    timeline: [ { s: 'Submitted', at: nowStr(), by: byId }, { s: 'Accounts Verification', at: null, by: 'AC1' }, { s: 'Principal Approval', at: null, by: 'PR1' }, { s: 'Payment', at: null, by: 'AC1' } ] };
  db().expenses.unshift(ev);
  WF.commit(byId, 'Submitted expense voucher', f.category + ' — ₹' + f.amount,
    { aud: 'role:accounts', title: 'Expense voucher received', body: f.category + ' — ₹' + f.amount + ' · ' + f.desc.slice(0, 60), link: 'expenses.html', tone: 'blue' });
  return ev;
};
WF.verifyExpense = function (byId, evId, ok, note) {
  var ev = db().expenses.filter(function (x) { return x.id === evId; })[0]; if (!ev) return;
  ev.status = ok ? 'Accounts Verified' : 'Returned';
  var step = ev.timeline.filter(function (t) { return t.by === 'AC1'; })[0];
  if (step) { step.at = nowStr(); step.s = ok ? 'Accounts Verified' : 'Returned by Accounts'; if (note) step.note = note; }
  WF.commit(byId, ok ? 'Verified expense voucher' : 'Returned expense voucher', ev.category + ' — ₹' + ev.amount,
    ok ? { aud: 'role:principal', title: 'Expense approval pending', body: ev.category + ' — ₹' + ev.amount + ' · ' + ev.desc.slice(0, 60), link: 'approvals.html', tone: 'yellow' }
       : { aud: 'uid:' + ev.by, title: 'Expense voucher returned', body: note || 'Attach supporting documents and resubmit.', tone: 'red' });
  g.Store.save();
};
WF.decideExpense = function (evId, approve, note) {
  var ev = db().expenses.filter(function (x) { return x.id === evId; })[0]; if (!ev) return;
  ev.status = approve ? 'Principal Approved' : 'Rejected';
  var step = ev.timeline.filter(function (t) { return t.by === 'PR1'; })[0];
  if (step) { step.at = nowStr(); step.s = approve ? 'Principal Approved' : 'Rejected by Principal'; if (note) step.note = note; }
  WF.commit('PR1', (approve ? 'Approved' : 'Rejected') + ' expense voucher', ev.category + ' — ₹' + ev.amount,
    { aud: 'role:accounts', title: 'Expense ' + (approve ? 'approved — payment due' : 'rejected'), body: ev.category + ' — ₹' + ev.amount, link: 'expenses.html', tone: approve ? 'green' : 'red' });
  g.Store.save();
};
WF.payExpense = function (byId, evId, mode) {
  var ev = db().expenses.filter(function (x) { return x.id === evId; })[0]; if (!ev) return;
  ev.status = 'Paid'; ev.mode = mode;
  var step = ev.timeline.filter(function (t) { return t.by === 'AC1' && String(t.s).indexOf('Payment') === 0; })[0];
  var last = ev.timeline[ev.timeline.length - 1];
  if (step) { step.at = nowStr(); step.s = 'Paid'; step.note = mode; } else if (last) { last.at = nowStr(); last.s = 'Paid — ' + mode; }
  WF.commit(byId, 'Paid expense voucher', ev.category + ' — ₹' + ev.amount + ' (' + mode + ')',
    { aud: 'uid:' + ev.by, title: 'Expense paid', body: ev.category + ' — ₹' + ev.amount + ' via ' + mode, tone: 'green' });
};
WF.allocateBudget = function (byId, section, amount, note) {
  var b = db().budgets.filter(function (x) { return x.section === section; })[0];
  if (!b) { b = { id: sid(), section: section, allocated: +amount, spent: 0, year: db().settings.academicYear, note: note || '' }; db().budgets.unshift(b); }
  else { b.allocated = +amount; if (note) b.note = note; }
  WF.commit(byId, 'Budget allocation updated', section + ' — ₹' + amount);
};
WF.addVendor = function (byId, f) {
  var v = { id: 'V-' + (1009 + db().vendors.length), name: f.name, category: f.category, gstin: f.gstin, phone: f.phone, rating: null, pos: 0, status: 'Active' };
  db().vendors.unshift(v);
  WF.commit(byId, 'Empanelled vendor', f.name + ' — ' + f.category);
  return v;
};
WF.createPO = function (byId, f) {
  var po = { id: 'PO-2026-0' + (23 + db().purchaseOrders.length), vendor: f.vendor, item: f.item, qty: +f.qty || 1, amount: +f.amount, date: db().meta.today, linked: f.linked || '—', status: 'Approved' };
  db().purchaseOrders.unshift(po);
  WF.commit(byId, 'Purchase order raised', po.id + ' — ' + f.item + ' · ₹' + f.amount);
  return po;
};

/* ═══════════════════════════════════════════════════════════════════════
   v8 · IQAC — surveys, audits, criteria · EVENTS · ACHIEVEMENTS
   ═══════════════════════════════════════════════════════════════════════ */
WF.createSurvey = function (byId, f) {
  var sv = { id: sid(), title: f.title, type: f.type, template: f.template || 'Custom', questions: f.questions.split('\n').filter(Boolean).slice(0, 8), courses: +f.courses || 0, audience: f.audience, assigned: 0, submitted: 0, from: f.from, to: f.to, status: new Date(f.from) > new Date(db().meta.today) ? 'Upcoming' : 'Ongoing' };
  db().surveys.unshift(sv);
  WF.commit(byId, 'Created survey', f.title + ' — ' + f.type);
  return sv;
};
WF.assignSurvey = function (byId, svId, scope) {
  var sv = db().surveys.filter(function (x) { return x.id === svId; })[0]; if (!sv) return;
  var students = scope === 'hostellers' ? db().students.filter(function (s) { return s.hostel; }) : db().students;
  sv.assigned = students.length;
  if (new Date(sv.from) <= new Date(db().meta.today)) sv.status = 'Ongoing';
  WF.commit(byId, 'Survey assigned', sv.title + ' — ' + students.length + ' students',
    { aud: 'all', title: 'Survey open — ' + sv.title, body: 'Respond by ' + sv.to + ' (' + sv.questions.length + ' questions).', link: 'survey.html', tone: 'blue' });
  return sv;
};
WF.closeSurvey = function (byId, svId) {
  var sv = db().surveys.filter(function (x) { return x.id === svId; })[0]; if (!sv) return;
  sv.status = 'Completed';
  WF.commit(byId, 'Closed survey', sv.title + ' — ' + sv.submitted + '/' + sv.assigned + ' responses',
    { aud: 'role:principal', title: 'Survey closed — ' + sv.title, body: sv.submitted + ' of ' + sv.assigned + ' responded.', link: 'quality.html', tone: 'green' });
};
WF.submitSurveyResponse = function (studentId, svId, answers) {
  var sv = db().surveys.filter(function (x) { return x.id === svId; })[0]; if (!sv) return;
  db().surveyResponses[svId] = db().surveyResponses[svId] || {};
  if (!db().surveyResponses[svId][studentId]) { sv.submitted++; }
  db().surveyResponses[svId][studentId] = answers;
  WF.commit(studentId, 'Submitted survey response', sv.title, null);
};
WF.scheduleAudit = function (byId, f) {
  var au = { id: sid(), type: f.type, scope: f.scope, date: f.date, team: f.team, findings: 0, actions: 0, status: 'Scheduled', note: f.note || '' };
  db().audits.unshift(au);
  WF.commit(byId, 'Scheduled audit', f.type + ' — ' + f.scope + ' (' + f.date + ')',
    { aud: 'role:principal', title: 'Audit scheduled', body: f.type + ' — ' + f.scope + ' on ' + f.date, tone: 'blue' });
  return au;
};
WF.updateCriteria = function (byId, cId, readiness, evidence) {
  var c = db().naacCriteria.filter(function (x) { return x.c === cId; })[0]; if (!c) return;
  c.readiness = +readiness; if (evidence) c.evidence = evidence;
  WF.commit(byId, 'Criteria readiness updated', c.name + ' → ' + readiness + '%');
};
WF.postEvent = function (byId, f) {
  var ev = { id: sid(), category: f.category, internal: f.internal, org: f.org, type: f.type, title: f.title, venue: f.venue, posted: db().meta.today, from: f.from, to: f.to, areas: f.areas, status: 'Published', archive: false };
  db().events.unshift(ev);
  WF.commit(byId, 'Posted event', f.title + ' — ' + f.from + ' → ' + f.to,
    { aud: 'all', title: f.title, body: f.category + ' · ' + f.venue + ' · ' + f.from + ' to ' + f.to, link: 'calendar.html', tone: 'green' });
  return ev;
};
WF.archiveEvent = function (byId, evId) {
  var ev = db().events.filter(function (x) { return x.id === evId; })[0]; if (!ev) return;
  ev.archive = true; ev.status = 'Archived';
  WF.commit(byId, 'Archived event', ev.title);
};
WF.submitAchievement = function (studentId, f) {
  var a = { id: sid(), studentId: studentId, name: f.name, category: f.category, level: f.level, date: f.date, prize: f.prize, place: f.place, desc: f.desc, attachment: f.attachment || null, status: 'Pending', verifiedBy: null };
  db().achievements.unshift(a);
  var mg = Q.mentorGroupOf(studentId);
  var mentor = mg ? mg.mentorId : 'T01';
  WF.commit(studentId, 'Submitted achievement', f.name + ' — ' + f.level,
    { aud: 'uid:' + mentor, title: 'Achievement verification pending', body: Q.name(studentId) + ' — ' + f.name + ' (' + f.level + ')', link: 'mentor.html', tone: 'yellow' });
  return a;
};
WF.verifyAchievement = function (mentorId, achId, ok, reason) {
  var a = db().achievements.filter(function (x) { return x.id === achId; })[0]; if (!a) return;
  a.status = ok ? 'Verified' : 'Rejected'; a.verifiedBy = mentorId; if (reason) a.reason = reason;
  WF.commit(mentorId, ok ? 'Verified achievement' : 'Rejected achievement', Q.name(a.studentId) + ' — ' + a.name,
    { aud: 'uid:' + a.studentId, title: 'Achievement ' + (ok ? 'verified' : 'not accepted'), body: a.name + (ok ? ' — added to your profile record.' : ' — ' + (reason || 'insufficient proof')), link: 'achievements.html', tone: ok ? 'green' : 'red' });
};

/* ═══════════════════════════════════════════════════════════════════════
   v8 · FACULTY — HRMS leave & faculty swap, appraisal
   ═══════════════════════════════════════════════════════════════════════ */
WF.submitStaffLeave = function (staffId, f) {
  var lv = { id: sid(), staffId: staffId, type: f.type, mode: f.mode, from: f.from, to: f.to, days: f.mode === 'Days' ? Math.max(1, Math.round((new Date(f.to) - new Date(f.from)) / 86400000) + 1) : 0, hours: f.mode === 'Hours' ? f.hours : null, reason: f.reason, proof: f.proof || null,
    swapTo: f.swapTo || null, swapStatus: f.swapTo ? 'Pending' : null, status: 'Submitted',
    history: [ { s: 'Submitted', at: nowStr(), by: staffId } ] };
  if (f.swapTo) lv.history.push({ s: 'Faculty swap requested — awaiting ' + Q.name(f.swapTo) + '\u2019s response', at: null, by: f.swapTo });
  db().staffLeaves.unshift(lv);
  if (f.swapTo) WF.notify({ aud: 'uid:' + f.swapTo, title: 'Faculty swap request', body: Q.name(staffId) + ' requested you to cover ' + f.from + ' to ' + f.to + ' — respond in My Leave & Swap.', link: 'leaves.html', tone: 'blue' });
  WF.commit(staffId, 'Submitted ' + f.type.toLowerCase() + ' request', f.from + ' → ' + f.to,
    { aud: 'role:academic', title: 'Staff leave request received', body: Q.name(staffId) + ' — ' + f.type + ', ' + f.from + ' to ' + f.to + (f.swapTo ? ' · swap proposed with ' + Q.name(f.swapTo) : ''), link: 'leaves.html', tone: 'blue' });
  return lv;
};
WF.respondSwap = function (staffId, lvId, ok) {
  var lv = db().staffLeaves.filter(function (x) { return x.id === lvId; })[0]; if (!lv) return;
  lv.swapStatus = ok ? 'Accepted' : 'Declined';
  var step = lv.history.filter(function (t) { return t.by === staffId; })[0];
  if (step) { step.at = nowStr(); step.s = 'Faculty swap ' + (ok ? 'accepted' : 'declined') + ' — ' + Q.name(staffId); }
  if (!ok) lv.status = 'Swap Declined';
  WF.commit(staffId, ok ? 'Accepted faculty swap' : 'Declined faculty swap', Q.name(lv.staffId) + ' — ' + lv.from + ' → ' + lv.to,
    { aud: 'uid:' + lv.staffId, title: 'Swap ' + (ok ? 'accepted' : 'declined'), body: Q.name(staffId) + (ok ? ' will cover your classes during the leave window.' : ' declined the swap — propose another colleague.'), link: 'leaves.html', tone: ok ? 'green' : 'red' });
  g.Store.save();
};
WF.decideStaffLeave = function (lvId, approve, note) {
  var lv = db().staffLeaves.filter(function (x) { return x.id === lvId; })[0]; if (!lv) return;
  lv.status = approve ? 'Approved' : 'Rejected';
  lv.history.push({ s: (approve ? 'Approved' : 'Rejected') + ' by Academic Director' + (note ? ' — ' + note : ''), at: nowStr(), by: 'AD1' });
  WF.commit('AD1', (approve ? 'Approved' : 'Rejected') + ' staff leave', Q.name(lv.staffId) + ' — ' + lv.from + ' → ' + lv.to,
    { aud: 'uid:' + lv.staffId, title: 'Leave ' + (approve ? 'approved' : 'rejected'), body: lv.type + ' — ' + lv.from + ' to ' + lv.to + (note ? ' · ' + note : ''), link: 'leaves.html', tone: approve ? 'green' : 'red' });
  g.Store.save();
};
WF.submitAppraisal = function (staffId, f) {
  var ap = { id: sid(), staffId: staffId, cycle: db().settings.academicYear, self: { teaching: +f.teaching || 0, publications: +f.publications || 0, fdp: +f.fdp || 0, events: +f.events || 0, feedback: +f.feedback || 0 },
    kpis: { attAvg: f.attAvg, results: f.results, menteeMeetings: f.menteeMeetings }, score: null, status: 'Submitted', reviewer: null, remark: null, at: db().meta.today };
  db().appraisals.unshift(ap);
  WF.commit(staffId, 'Submitted self-appraisal', 'Cycle ' + db().settings.academicYear,
    { aud: 'role:academic', title: 'Self-appraisal received', body: Q.name(staffId) + ' — ' + db().settings.academicYear + ' cycle ready for review.', link: 'staff.html', tone: 'blue' });
  return ap;
};
WF.reviewAppraisal = function (byId, apId, score, remark) {
  var ap = db().appraisals.filter(function (x) { return x.id === apId; })[0]; if (!ap) return;
  ap.status = 'Reviewed'; ap.reviewer = byId; ap.score = +score; ap.remark = remark || '';
  WF.commit(byId, 'Reviewed appraisal', Q.name(ap.staffId) + ' — score ' + score,
    { aud: 'uid:' + ap.staffId, title: 'Appraisal reviewed', body: 'Score ' + score + '/100 — ' + (remark || 'see the review note from the academic director.'), tone: 'green' });
};

g.WF = WF;
})(window);
