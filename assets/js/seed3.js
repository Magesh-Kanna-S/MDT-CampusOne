/* My Desktop Tech — CampusOne · Reference dataset, part 3 (v8 — library, examination
   cell, placement cell, accounts, IQAC, events, achievements, staff leave & appraisal).
   Every record here is synthetic demo data created for the CampusOne showcase —
   no personal or institutional data from any external system is included. */
(function (g) {
'use strict';
var S = g.SEED;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
var R = mulberry32(0x56383837);
function ri(a,b){return a+Math.floor(R()*(b-a+1));}
function pick(arr){return arr[Math.floor(R()*arr.length)];}
function pad(n,l){n=String(n);while(n.length<l)n='0'+n;return n;}
function findSt(id){ return S.students.filter(function(s){return s.id===id;})[0]; }

/* ══════════════════════════════════════════════════════════
   1 · LIBRARY — full staff portal dataset
   ══════════════════════════════════════════════════════════ */

/* enrich the existing catalogue with full OPAC fields (nothing removed) */
var PUBS = ['McGraw Hill','Pearson Education','Wiley India','Oxford University Press','Springer','PHI Learning','Cambridge University Press','Tata McGraw-Hill','Elsevier','S. Chand'];
var RACKS = ['A1','A2','A3','B1','B2','B4','C1','C3','D2','D5'];
var TYPES = ['Text Book','Reference','Text Book','Reference','Text Book','Rare'];
S.libraryBooks.forEach(function (b, i) {
  b.publisher = PUBS[i % PUBS.length];
  b.rack = RACKS[i % RACKS.length];
  b.shelf = 'S' + (1 + (i % 5));
  b.year = 2005 + ((i * 3) % 20);
  b.edition = (1 + (i % 9)) + (b.edition || 'e');
  b.price = 300 + ((i * 137) % 2400);
  b.type = TYPES[i % TYPES.length];
  b.status = 'Available';
});
/* additional titles — v8 knowledge resource centre */
var NEWBOOKS = [
  ['Designing Data-Intensive Applications','Martin Kleppmann','Distributed Systems','O\u2019Reilly Media'],
  ['Artificial Intelligence: A Modern Approach','Russell & Norvig','AI & ML','Pearson Education'],
  ['Computer Architecture: A Quantitative Approach','Hennessy & Patterson','COA','Morgan Kaufmann'],
  ['Introduction to Algorithms (4th Ed.)','Cormen, Leiserson, Rivest, Stein','Algorithms','MIT Press'],
  ['Data Communications and Networking','Behrouz Forouzan','Networks','McGraw Hill'],
  ['Operating Systems: Three Easy Pieces','Arpaci-Dusseau','Operating Systems','Arpaci-Dusseau'],
  ['Digital Signal Processing (5th Ed.)','Proakis & Manolakis','DSP','Pearson Education'],
  ['CMOS Vlsi Design','Weste & Harris','VLSI','Pearson Education'],
  ['Wireless Communications','Andrea Goldsmith','Wireless Comm.','Cambridge University Press'],
  ['Signals and Systems','Oppenheim & Willsky','Signals','Pearson Education'],
  ['The C Programming Language','Kernighan & Ritchie','Programming','PHI Learning'],
  ['Clean Code','Robert C. Martin','Software Craft','Prentice Hall'],
  ['Software Engineering (10th Ed.)','Ian Sommerville','Software Eng.','Pearson Education'],
  ['Microelectronic Circuits','Sedra & Smith','Linear ICs','Oxford University Press'],
  ['Probability and Statistics for Engineers','Johnson & Miller','Mathematics','Pearson Education'],
  ['Principles of Marketing (17th Ed.)','Kotler & Armstrong','Management','Pearson Education'],
  ['Financial Accounting for Managers','Narayanaswamy','Accounting','Taylor & Francis'],
  ['Human Resource Management','Dessler','Management','Pearson Education'],
  ['Emotional Intelligence','Daniel Goleman','Soft Skills','Bantam Books'],
  ['The Lean Startup','Eric Ries','Entrepreneurship','Penguin Books'],
  ['Research Methodology (5th Ed.)','C. R. Kothari','Research','New Age International'],
  ['Entrepreneurship Development','S. S. Khanka','Entrepreneurship','S. Chand'],
  ['Business Analytics','U. Dinesh Kumar','Analytics','Pearson Education'],
  ['Data Science for Business','Provost & Fawcett','Analytics','O\u2019Reilly Media']
];
NEWBOOKS.forEach(function (n, i) {
  var acc = 'LB-' + pad(27 + i, 3);
  S.libraryBooks.push({ acc: acc, title: n[0] + ' (' + ri(2, 9) + 'th Ed.)', author: n[1], subject: n[2], dept: /VLSI|DSP|Wireless|Signals|Linear|Micro/.test(n[2]) ? 'ECE' : 'CSE', copies: ri(2, 5), available: ri(1, 4),
    publisher: n[3], rack: RACKS[(i + 3) % RACKS.length], shelf: 'S' + (1 + (i % 5)), year: 2008 + ((i * 2) % 17), edition: ri(2, 10) + 'e', price: 350 + ri(0, 2200), type: i % 3 === 2 ? 'Reference' : 'Text Book', status: 'Available' });
});

/* staff loans (the desk serves students and staff alike) */
S.staffLoans = [
  { id: 'SL1', acc: 'LB-004', staffId: 'T02', out: '2026-08-20', due: '2026-09-03', returned: null, fine: 5, status: 'Overdue' },
  { id: 'SL2', acc: 'LB-009', staffId: 'T05', out: '2026-08-28', due: '2026-09-11', returned: null, fine: 0, status: 'Active' },
  { id: 'SL3', acc: 'LB-031', staffId: 'AD1', out: '2026-08-30', due: '2026-09-13', returned: null, fine: 0, status: 'Active' },
  { id: 'SL4', acc: 'LB-014', staffId: 'T10', out: '2026-08-12', due: '2026-08-26', returned: '2026-08-25', fine: 0, status: 'Returned' },
  { id: 'SL5', acc: 'LB-037', staffId: 'T13', out: '2026-08-25', due: '2026-09-08', returned: null, fine: 0, status: 'Active' }
];

/* reservations placed from the student portal */
S.bookReservations = [
  { id: 'RSV1', acc: 'LB-002', studentId: 'ST001', at: '2026-09-02 10:20', status: 'Waiting', note: 'Next available copy' },
  { id: 'RSV2', acc: 'LB-006', studentId: 'ST049', at: '2026-09-03 14:05', status: 'Ready', note: 'Held until 7 Sep' },
  { id: 'RSV3', acc: 'LB-028', studentId: 'ST061', at: '2026-09-01 09:12', status: 'Waiting', note: '2 in queue' }
];

/* fine ledger — collections and waivers at the counter */
S.fineLedger = [
  { id: 'FL1', memberId: 'ST058', memberType: 'student', borrow: 'BR12', amount: 15, type: 'Collected', mode: 'Cash', reason: 'Overdue 3 days', by: 'LB2', at: '2026-09-04 10:05' },
  { id: 'FL2', memberId: 'ST023', memberType: 'student', borrow: null, amount: 40, type: 'Collected', mode: 'UPI', reason: 'Late return — book LB-018', by: 'LB2', at: '2026-08-30 15:40' },
  { id: 'FL3', memberId: 'ST040', memberType: 'student', borrow: null, amount: 0, type: 'Waived', mode: '—', reason: 'Medical leave proof produced', by: 'OF2', at: '2026-08-28 11:15' },
  { id: 'FL4', memberId: 'T02', memberType: 'staff', borrow: 'SL1', amount: 5, type: 'Outstanding', mode: '—', reason: 'Overdue 1 day', by: null, at: '2026-09-04 09:30' },
  { id: 'FL5', memberId: 'ST055', memberType: 'student', borrow: 'BR6', amount: 25, type: 'Outstanding', mode: '—', reason: 'Overdue 5 days', by: null, at: '2026-09-04 09:30' },
  { id: 'FL6', memberId: 'ST071', memberType: 'student', borrow: null, amount: 10, type: 'Collected', mode: 'Cash', reason: 'Damaged spine — LB-021', by: 'LB2', at: '2026-08-21 16:00' },
  { id: 'FL7', memberId: 'ST004', memberType: 'student', borrow: 'BR5', amount: 5, type: 'Outstanding', mode: '—', reason: 'Overdue 1 day', by: null, at: '2026-09-04 09:30' }
];

/* print journals, magazines and newspapers on subscription */
S.journals = [
  { id: 'JN1', title: 'IEEE Transactions on Computers', type: 'Journal', publisher: 'IEEE', freq: 'Monthly', vendor: 'V-1002', cost: 18500, from: '2026-01', to: '2026-12', renewal: '2026-12-15', status: 'Active' },
  { id: 'JN2', title: 'Journal of Systems and Software', type: 'Journal', publisher: 'Elsevier', freq: 'Monthly', vendor: 'V-1002', cost: 22400, from: '2026-01', to: '2026-12', renewal: '2026-12-15', status: 'Active' },
  { id: 'JN3', title: 'Data Science and Engineering', type: 'Journal', publisher: 'Springer', freq: 'Quarterly', vendor: 'V-1005', cost: 9800, from: '2026-01', to: '2026-12', renewal: '2026-12-01', status: 'Active' },
  { id: 'JN4', title: 'Electronics for You', type: 'Magazine', publisher: 'EFY Group', freq: 'Monthly', vendor: 'V-1001', cost: 1800, from: '2026-01', to: '2026-12', renewal: '2026-12-20', status: 'Active' },
  { id: 'JN5', title: 'The Hindu — Education Plus', type: 'Newspaper', publisher: 'The Hindu', freq: 'Daily', vendor: 'V-1007', cost: 5200, from: '2026-01', to: '2026-12', renewal: '2026-12-28', status: 'Active' },
  { id: 'JN6', title: ' Digit', type: 'Magazine', publisher: '9.9 Media', freq: 'Monthly', vendor: 'V-1001', cost: 1500, from: '2026-01', to: '2026-12', renewal: '2026-11-30', status: 'Renewal Due' },
  { id: 'JN7', title: 'Communications of the ACM', type: 'Journal', publisher: 'ACM', freq: 'Monthly', vendor: 'V-1002', cost: 14200, from: '2025-01', to: '2025-12', renewal: '2026-01-10', status: 'Lapsed' }
];
S.journalIssues = [];
S.journals.filter(function (j) { return j.type === 'Journal' || j.type === 'Magazine'; }).forEach(function (j, ji) {
  for (var m = 1; m <= 8; m++) {
    var missing = ji === 0 && m === 7;
    S.journalIssues.push({ id: 'JI' + ji + '-' + m, journalId: j.id, vol: 2026, issue: m, expected: '2026-0' + m + '-' + pad(ri(3, 27), 2), received: missing ? null : '2026-0' + m + '-' + pad(ri(28, 31), 2), flag: missing ? 'Missing — vendor notified' : '' });
  }
});

/* digital resources & e-databases */
S.digitalResources = [
  { id: 'DR1', name: 'National Digital Library of India', type: 'e-Book Platform', provider: 'NDLI / IIT Kharagpur', access: 'Open (campus + remote)', url: 'ndl.iitkgp.ac.in', usage: 642, status: 'Active' },
  { id: 'DR2', name: 'DELNET — Developing Library Network', type: 'e-Journal Database', provider: 'DELNET', access: 'IP authenticated', url: 'delnet.in', usage: 288, status: 'Active' },
  { id: 'DR3', name: 'e-ShodhSindhu (N-LIST Consortia)', type: 'e-Journal Database', provider: 'INFLIBNET', access: 'Login (member)', url: 'nlist.inflibnet.ac.in', usage: 351, status: 'Active' },
  { id: 'DR4', name: 'SWAYAM — NPTEL Video Courses', type: 'Video Library', provider: 'NPTEL / MHRD', access: 'Open', url: 'swayam.gov.in', usage: 890, status: 'Active' },
  { id: 'DR5', name: 'PressReader — e-Newspapers', type: 'e-Newspaper', provider: 'PressReader', access: 'Campus Wi-Fi', url: 'pressreader.com', usage: 174, status: 'Trial' },
  { id: 'DR6', name: 'Vidya-Mitra — Virtual Learning', type: 'Video Library', provider: 'UGC CEC', access: 'Open', url: 'vidyamitra.ac.in', usage: 96, status: 'Active' },
  { id: 'DR7', name: 'Shodhganga — Indian Theses', type: 'e-Thesis Repository', provider: 'INFLIBNET', access: 'Open', url: 'shodhganga.inflibnet.ac.in', usage: 210, status: 'Active' }
];

/* procurement — department requisitions → library → principal → purchase order */
S.requisitions = [
  { id: 'RQ1', dept: 'CSE', by: 'T02', at: '2026-08-20', items: [ { title: 'Graph Database Systems', author: 'Angles & Gutierrez', publisher: 'Morgan & Claypool', copies: 3, price: 1450 }, { title: 'Data Mining — Concepts and Techniques', author: 'Han, Kamber, Pei', publisher: 'Elsevier', copies: 4, price: 1250 } ], total: 9700, status: 'Approved', timeline: [ { s: 'Submitted by Department', at: '2026-08-20', by: 'T02' }, { s: 'Librarian Reviewed & Recommended', at: '2026-08-22', by: 'OF2' }, { s: 'Principal Approved', at: '2026-08-25', by: 'PR1' } ] },
  { id: 'RQ2', dept: 'ECE', by: 'T05', at: '2026-08-26', items: [ { title: 'Internet of Things — A Hands-On Approach', author: 'Bahga & Madisetti', publisher: 'V Krishna Books', copies: 5, price: 950 } ], total: 4750, status: 'With Librarian', timeline: [ { s: 'Submitted by Department', at: '2026-08-26', by: 'T05' }, { s: 'Librarian Review', at: null, by: 'OF2' }, { s: 'Principal Approval', at: null, by: 'PR1' } ] },
  { id: 'RQ3', dept: 'CSE', by: 'T10', at: '2026-09-01', items: [ { title: 'Deep Learning (Adaptive Computation)', author: 'Goodfellow, Bengio, Courville', publisher: 'MIT Press', copies: 6, price: 2100 }, { title: 'Neural Network Design', author: 'Hagan et al.', publisher: 'Martin Hagan', copies: 2, price: 1800 } ], total: 16200, status: 'Submitted', timeline: [ { s: 'Submitted by Department', at: '2026-09-01', by: 'T10' }, { s: 'Librarian Review', at: null, by: 'OF2' }, { s: 'Principal Approval', at: null, by: 'PR1' } ] },
  { id: 'RQ4', dept: 'ECE', by: 'T06', at: '2026-07-14', items: [ { title: 'Practical Electronics for Inventors', author: 'Scherz & Monk', publisher: 'McGraw Hill', copies: 3, price: 1600 } ], total: 4800, status: 'Received', timeline: [ { s: 'Submitted by Department', at: '2026-07-14', by: 'T06' }, { s: 'Librarian Reviewed & Recommended', at: '2026-07-16', by: 'OF2' }, { s: 'Principal Approved', at: '2026-07-18', by: 'PR1' }, { s: 'Purchase Order Placed', at: '2026-07-20', by: 'LB2' }, { s: 'Accessioned to Catalogue', at: '2026-07-28', by: 'LB2' } ] },
  { id: 'RQ5', dept: 'CSE', by: 'T13', at: '2026-07-02', items: [ { title: 'Discrete Mathematics with Ducks', author: 'Sarah-Marie Belcastro', publisher: 'CRC Press', copies: 4, price: 1100 } ], total: 4400, status: 'Rejected', timeline: [ { s: 'Submitted by Department', at: '2026-07-02', by: 'T13' }, { s: 'Returned by Librarian', at: '2026-07-05', by: 'OF2' }, { s: 'Rejected — duplicate of LB-012 set', at: '2026-07-06', by: 'PR1' } ] }
];

/* stock verification + weeding register */
S.stockVerification = [
  { id: 'SV1', section: 'A1 — CSE Text Books', date: '2026-08-15', expected: 148, found: 146, status: 'Completed', note: '2 copies on loan mislabelled — corrected' },
  { id: 'SV2', section: 'B1 — CSE Reference', date: '2026-08-15', expected: 64, found: 64, status: 'Completed', note: '' },
  { id: 'SV3', section: 'C1 — ECE Text Books', date: '2026-08-22', expected: 96, found: 95, status: 'Completed', note: '1 copy marked missing — follow-up issued' },
  { id: 'SV4', section: 'D2 — Management & Soft Skills', date: '2026-09-01', expected: 52, found: 52, status: 'Completed', note: '' },
  { id: 'SV5', section: 'A3 — Journals Bound Volumes', date: null, expected: 210, found: 0, status: 'Scheduled', note: 'Planned with semester break' }
];
S.weeded = [
  { acc: 'LB-017', reason: 'Damaged — water seepage', mode: 'Write-off', date: '2026-08-11', by: 'LB2' },
  { acc: 'LB-021', reason: 'Binding beyond repair', mode: 'Weeded', date: '2026-08-11', by: 'LB2' },
  { acc: 'LB-009', reason: 'Lost by borrower — recovered in cash', mode: 'Recovered', date: '2026-07-19', by: 'LB2' }
];

/* ══════════════════════════════════════════════════════════
   2 · EXAMINATION CELL
   ══════════════════════════════════════════════════════════ */

S.exams = [
  { id: 'EX1', name: 'Internal Assessment — I', sem: 5, classes: ['CSE-A','CSE-B','ECE-A','ECE-B','CSE-C','ECE-C'], from: '2026-08-10', to: '2026-08-12', status: 'Completed', published: true },
  { id: 'EX2', name: 'Internal Assessment — II', sem: 5, classes: ['CSE-A','CSE-B','ECE-A','ECE-B','CSE-C','ECE-C'], from: '2026-09-15', to: '2026-09-17', status: 'Hall Tickets Issued', published: false },
  { id: 'EX3', name: 'Model Examination', sem: 5, classes: ['CSE-A','CSE-B','ECE-A','ECE-B'], from: '2026-09-08', to: '2026-09-10', status: 'Scheduled', published: false },
  { id: 'EX4', name: 'Practical Examinations', sem: 5, classes: ['CSE-A','CSE-B','ECE-A','ECE-B','CSE-C','ECE-C'], from: '2026-09-22', to: '2026-09-26', status: 'Scheduled', published: false },
  { id: 'EX5', name: 'End Semester Examination — Oct 2026', sem: 5, classes: ['CSE-A','CSE-B','ECE-A','ECE-B','CSE-C','ECE-C'], from: '2026-10-12', to: '2026-10-24', status: 'Announced', published: false }
];

/* sessions per completed / current exam — course × class × date */
S.examSessions = [];
var EXROOMS = ['Exam Hall 1 (Block A)','Exam Hall 2 (Block A)','Exam Hall 3 (Block B)','Seminar Hall'];
var INVIG = ['T04','T08','T11','T13','T12','T03'];
S.exams.forEach(function (ex) {
  if (ex.id === 'EX5') return;                     /* announced only — no sessions yet */
  ex.classes.forEach(function (cid, ci) {
    var al = S.courseAllocations.filter(function (a) { return a.classId === cid; }).slice(0, 3);
    al.forEach(function (a, ai) {
      var day = new Date(ex.from); day.setDate(day.getDate() + ai);
      S.examSessions.push({ id: ex.id + '-' + cid + '-' + a.courseId, examId: ex.id, courseId: a.courseId, classId: cid,
        date: day.toISOString().slice(0, 10), session: ai % 2 === 0 ? 'FN (09:30–11:00)' : 'AN (02:00–03:30)',
        room: EXROOMS[(ci + ai) % EXROOMS.length], invigilator: INVIG[(ci * 3 + ai) % INVIG.length], strength: S.classes.filter(function (c) { return c.id === cid; })[0].strength });
    });
  });
});

/* attendance for completed sessions (Internal-I) + malpractice log */
S.examAttendance = {};
S.examSessions.filter(function (s) { return s.examId === 'EX1'; }).forEach(function (s) {
  var m = {};
  Q_mark(S, s.classId).forEach(function (st) {
    m[st.id] = R() < 0.94 ? 'P' : 'A';
  });
  S.examAttendance[s.id] = m;
});
function Q_mark(S, cid) { return S.students.filter(function (s) { return s.classId === cid; }); }
S.malpractice = [
  { id: 'MP1', session: 'EX1-CSE-B-CS502', studentId: 'ST033', nature: 'Unauthorised material in desk', action: 'Answer sheet cancelled · re-exam on 20 Aug', at: '2026-08-11', by: 'EX1' },
  { id: 'MP2', session: 'EX1-ECE-B-EC502', studentId: 'ST090', nature: 'Copying — verbal warning first instance', action: 'Warned · parents informed by office', at: '2026-08-12', by: 'EX1' }
];

/* ESE-style online valuation batches with remuneration verification */
S.valuationBatches = [
  { id: 'VB1', examId: 'EX1', courseId: 'CS501', teacherId: 'T01', scripts: 48, evaluated: 48, status: 'Completed', remuneration: { amount: 4800, bank: 'Verified', pan: 'Verified', signature: 'Verified', paid: 'Paid 25 Aug' } },
  { id: 'VB2', examId: 'EX1', courseId: 'CS502', teacherId: 'T02', scripts: 48, evaluated: 44, status: 'In Progress', remuneration: { amount: 4800, bank: 'Verified', pan: 'Verified', signature: 'Pending', paid: 'On completion' } },
  { id: 'VB3', examId: 'EX1', courseId: 'EC501', teacherId: 'T05', scripts: 48, evaluated: 48, status: 'Completed', remuneration: { amount: 4800, bank: 'Verified', pan: 'Pending', signature: 'Pending', paid: 'Held — PAN pending' } },
  { id: 'VB4', examId: 'EX1', courseId: 'CS503', teacherId: 'T01', scripts: 48, evaluated: 12, status: 'In Progress', remuneration: { amount: 4800, bank: 'Pending', pan: 'Pending', signature: 'Pending', paid: 'On completion' } },
  { id: 'VB5', examId: 'EX1', courseId: 'EC502', teacherId: 'T06', scripts: 48, evaluated: 48, status: 'Completed', remuneration: { amount: 4800, bank: 'Verified', pan: 'Verified', signature: 'Verified', paid: 'Paid 27 Aug' } }
];

/* revaluation / recount requests */
S.revalRequests = [
  { id: 'RV1', studentId: 'ST006', courseId: 'CS501', exam: 'Internal Assessment — I', type: 'Revaluation', fee: 500, appliedAt: '2026-08-25', status: 'Under Review', oldMark: 11, newMark: null, evaluator: 'T09', remark: null },
  { id: 'RV2', studentId: 'ST052', courseId: 'EC502', exam: 'Internal Assessment — I', type: 'Recount', fee: 100, appliedAt: '2026-08-26', status: 'Completed', oldMark: 13, newMark: 14, evaluator: 'T06', remark: 'One answer uncounted — corrected' },
  { id: 'RV3', studentId: 'ST077', courseId: 'CS502', exam: 'Internal Assessment — I', type: 'Revaluation', fee: 500, appliedAt: '2026-09-01', status: 'Applied', oldMark: 9, newMark: null, evaluator: null, remark: null },
  { id: 'RV4', studentId: 'ST013', courseId: 'EC501', exam: 'Internal Assessment — I', type: 'Revaluation', fee: 500, appliedAt: '2026-08-28', status: 'Rejected', oldMark: 14, newMark: null, evaluator: 'T05', remark: 'Marks within tolerance — no change' }
];

/* transcripts & consolidated statements issued */
S.transcripts = [
  { id: 'TR1', studentId: 'ST001', type: 'Consolidated Marksheet (Sem I–IV)', pages: 4, issuedAt: '2026-08-18', by: 'EX1', purpose: 'Internship application' },
  { id: 'TR2', studentId: 'ST049', type: 'Bonafide with CGPA', pages: 1, issuedAt: '2026-08-22', by: 'EX1', purpose: 'Higher studies proof' },
  { id: 'TR3', studentId: 'ST055', type: 'Consolidated Marksheet (Sem I–IV)', pages: 4, issuedAt: '2026-09-02', by: 'EX1', purpose: 'Placement verification' }
];

/* ══════════════════════════════════════════════════════════
   3 · PLACEMENT CELL
   ══════════════════════════════════════════════════════════ */

S.recruiters = [
  { id: 'RC1', name: 'TCS Digital', industry: 'IT Services', hr: 'Nandini Rao', email: 'campus.tcs@tcs.example', phone: '+91 98400 12340', mou: 'MoU — 2026 Renewed', lastVisit: '2026-09-24', offers: 12, eligibility: 'CGPA ≥ 8.0 · No standing arrears', status: 'Active' },
  { id: 'RC2', name: 'Infosys Springboard', industry: 'IT Services', hr: 'Suresh Menon', email: 'campus.infy@infy.example', phone: '+91 98400 12341', mou: 'MoU — 2025', lastVisit: '2025-10-12', offers: 19, eligibility: 'CGPA ≥ 7.0', status: 'Active' },
  { id: 'RC3', name: 'Zoho Corporation', industry: 'Product SaaS', hr: 'Deepa Krishnan', email: 'campus@zoho.example', phone: '+91 98400 12342', mou: 'MoU — 2026', lastVisit: '2026-10-22', offers: 8, eligibility: 'CGPA ≥ 7.5 · Strong problem solving', status: 'Active' },
  { id: 'RC4', name: 'Freshworks', industry: 'Product SaaS', hr: 'Arun Bala', email: 'campus@freshworks.example', phone: '+91 98400 12343', mou: 'MoU — 2026', lastVisit: '2025-11-04', offers: 6, eligibility: 'CGPA ≥ 8.0 · Full-stack portfolio', status: 'Active' },
  { id: 'RC5', name: 'Bosch Global Software', industry: 'Engineering R&D', hr: 'Ravi Chandran', email: 'campus@bosch.example', phone: '+91 98400 12344', mou: 'MoU — 2025', lastVisit: '2025-09-18', offers: 5, eligibility: 'CGPA ≥ 7.5 · ECE preferred', status: 'Active' },
  { id: 'RC6', name: 'Cognizant — GenC Next', industry: 'IT Services', hr: 'Priya Shankar', email: 'campus@cognizant.example', phone: '+91 98400 12345', mou: 'In Discussion', lastVisit: null, offers: 0, eligibility: 'CGPA ≥ 7.0', status: 'In Discussion' },
  { id: 'RC7', name: 'Amazon — Support Engineering', industry: 'Cloud', hr: 'Vikram Iyer', email: 'campus@amazon.example', phone: '+91 98400 12346', mou: 'MoU — 2024', lastVisit: '2024-08-30', offers: 2, eligibility: 'CGPA ≥ 8.5', status: 'Paused' }
];

/* training & internship-readiness programmes */
S.trainingBatches = [
  { id: 'TB1', name: 'Aptitude Sprint — Round 2', type: 'Aptitude', trainer: 'Vetri Selvan (External)', from: '2026-08-03', to: '2026-08-28', classes: ['CSE-A','CSE-B'], students: 48, sessions: 16, avgAttendance: 87, avgScore: 71, status: 'Completed' },
  { id: 'TB2', name: 'Group Discussion Lab', type: 'Group Discussion', trainer: 'Ramya Krishnan (T04)', from: '2026-09-02', to: '2026-09-25', classes: ['CSE-A'], students: 24, sessions: 8, avgAttendance: 92, avgScore: null, status: 'Ongoing' },
  { id: 'TB3', name: 'Soft Skills & Corporate Etiquette', type: 'Soft Skills', trainer: 'Hema Creative Studio (External)', from: '2026-09-07', to: '2026-10-02', classes: ['ECE-A','ECE-B'], students: 48, sessions: 12, avgAttendance: null, avgScore: null, status: 'Upcoming' },
  { id: 'TB4', name: 'Full-Stack Technical Bootcamp', type: 'Technical', trainer: 'Mohanraj K (T10)', from: '2026-08-10', to: '2026-10-09', classes: ['CSE-A','CSE-B'], students: 36, sessions: 24, avgAttendance: 78, avgScore: 65, status: 'Ongoing' },
  { id: 'TB5', name: 'Mock Interview Marathon', type: 'Mock Interview', trainer: 'Panel — Industry Mentors', from: '2026-09-14', to: '2026-09-19', classes: ['CSE-A','ECE-A'], students: 40, sessions: 6, avgAttendance: null, avgScore: null, status: 'Upcoming' }
];

S.internships = [
  { id: 'IN1', studentId: 'ST001', company: 'Zoho Corporation', role: 'SDE Intern — CRM Squad', stipend: 25000, from: '2026-06-01', to: '2026-07-15', mentorId: 'T01', status: 'Completed', outcome: 'Pre-Placement Offer discussion opened' },
  { id: 'IN2', studentId: 'ST004', company: 'Freshworks', role: 'QA Automation Intern', stipend: 15000, from: '2026-09-21', to: '2026-11-06', mentorId: 'T02', status: 'Approved', outcome: '—' },
  { id: 'IN3', studentId: 'ST055', company: 'Bosch Global Software', role: 'Embedded R&D Intern', stipend: 20000, from: '2026-10-05', to: '2026-11-20', mentorId: 'T07', status: 'Faculty Approved', outcome: '—' },
  { id: 'IN4', studentId: 'ST061', company: 'Cognizant', role: 'Digital Nurture Intern', stipend: 10000, from: '2026-10-19', to: '2026-12-04', mentorId: 'T09', status: 'Applied', outcome: '—' },
  { id: 'IN5', studentId: 'ST049', company: 'TCS Digital', role: 'Research Intern — AI', stipend: 18000, from: '2026-05-11', to: '2026-06-30', mentorId: 'T05', status: 'Completed', outcome: 'Certificate + LOR received' },
  { id: 'IN6', studentId: 'ST077', company: 'Amazon — Support Engineering', role: 'Cloud Ops Intern', stipend: 30000, from: '2026-08-01', to: '2026-08-28', mentorId: 'T10', status: 'Completed', outcome: 'Performance letter — Excellent' }
];

/* ══════════════════════════════════════════════════════════
   4 · ACCOUNTS & FINANCE
   ══════════════════════════════════════════════════════════ */

/* payroll — deterministic structure per staff, monthly runs */
S.payroll = {};
S.staff.forEach(function (st) {
  var base = 28000 + (st.exp * 1800) + (st.designation.indexOf('Professor') >= 0 && st.designation.indexOf('Assistant') < 0 ? 22000 : 0);
  if (st.id === 'PR1') base = 165000; if (st.id === 'AD1') base = 132000;
  var da = Math.round(base * 0.42), hra = Math.round(base * 0.16);
  var deductions = Math.round(base * 0.12) + 1800;
  S.payroll[st.id] = { basic: base, da: da, hra: hra, other: 2500, deductions: deductions, net: base + da + hra + 2500 - deductions, bank: 'HDFC ••' + pad(ri(1000, 9999), 4) };
});
S.payrollRuns = [
  { id: 'PR-AUG', month: 'August 2026', runBy: 'AC1', runAt: '2026-08-30 16:40', staff: 25, gross: 1598500, net: 1395240, status: 'Disbursed' },
  { id: 'PR-JUL', month: 'July 2026', runBy: 'AC1', runAt: '2026-07-31 15:10', staff: 25, gross: 1598500, net: 1395240, status: 'Disbursed' },
  { id: 'PR-JUN', month: 'June 2026', runBy: 'AC1', runAt: '2026-06-30 17:25', staff: 25, gross: 1576200, net: 1375900, status: 'Disbursed' },
  { id: 'PR-SEP', month: 'September 2026', runBy: 'AC1', runAt: null, staff: 25, gross: 1598500, net: 1395240, status: 'Draft — 30 Sep' }
];

/* expense vouchers with the accounts → principal chain */
S.expenses = [
  { id: 'EV1', by: 'WG1', role: 'warden', category: 'Mess & Hostel', desc: 'Mess provisions — fortnight indent (Block B)', amount: 68400, raisedAt: '2026-09-02', status: 'Paid', mode: 'NEFT — vendor V-1003', timeline: [ { s: 'Submitted', at: '2026-09-02 10:00', by: 'WG1' }, { s: 'Accounts Verified', at: '2026-09-02 15:30', by: 'AC1' }, { s: 'Principal Approved', at: '2026-09-03 10:15', by: 'PR1' }, { s: 'Paid', at: '2026-09-03 14:00', by: 'AC1' } ] },
  { id: 'EV2', by: 'OF2', role: 'library', category: 'Library', desc: 'Elsevier journal subscription — 2026 renewal (RQ linked)', amount: 22400, raisedAt: '2026-08-26', status: 'Paid', mode: 'NEFT — vendor V-1002', timeline: [ { s: 'Submitted', at: '2026-08-26 09:40', by: 'OF2' }, { s: 'Accounts Verified', at: '2026-08-26 12:10', by: 'AC1' }, { s: 'Principal Approved', at: '2026-08-27 09:30', by: 'PR1' }, { s: 'Paid', at: '2026-08-27 16:45', by: 'AC1' } ] },
  { id: 'EV3', by: 'WB1', role: 'warden', category: 'Maintenance', desc: 'Geysers repair — Block A bathrooms (8 units)', amount: 18600, raisedAt: '2026-09-03', status: 'Principal Approved', mode: 'Pending', timeline: [ { s: 'Submitted', at: '2026-09-03 08:50', by: 'WB1' }, { s: 'Accounts Verified', at: '2026-09-03 11:20', by: 'AC1' }, { s: 'Principal Approved', at: '2026-09-04 09:05', by: 'PR1' }, { s: 'Payment', at: null, by: 'AC1' } ] },
  { id: 'EV4', by: 'T05', role: 'teacher', category: 'Lab & Equipment', desc: 'ECE lab — signal generator probes (12 nos)', amount: 27600, raisedAt: '2026-09-03', status: 'Accounts Verified', mode: 'Pending', timeline: [ { s: 'Submitted', at: '2026-09-03 14:15', by: 'T05' }, { s: 'Accounts Verified', at: '2026-09-04 10:40', by: 'AC1' }, { s: 'Principal Approval', at: null, by: 'PR1' }, { s: 'Payment', at: null, by: 'AC1' } ] },
  { id: 'EV5', by: 'OF3', role: 'placement', category: 'Placement & Events', desc: 'Placement drive logistics — travel + hall setup', amount: 34200, raisedAt: '2026-09-04', status: 'Submitted', mode: 'Pending', timeline: [ { s: 'Submitted', at: '2026-09-04 11:30', by: 'OF3' }, { s: 'Accounts Verification', at: null, by: 'AC1' }, { s: 'Principal Approval', at: null, by: 'PR1' }, { s: 'Payment', at: null, by: 'AC1' } ] },
  { id: 'EV6', by: 'IQ1', role: 'iqac', category: 'Quality & Accreditation', desc: 'NAAC pre-visit documentation & printing', amount: 15600, raisedAt: '2026-08-29', status: 'Paid', mode: 'Card — campus', timeline: [ { s: 'Submitted', at: '2026-08-29 10:00', by: 'IQ1' }, { s: 'Accounts Verified', at: '2026-08-29 14:20', by: 'AC1' }, { s: 'Principal Approved', at: '2026-08-30 09:00', by: 'PR1' }, { s: 'Paid', at: '2026-08-30 12:30', by: 'AC1' } ] },
  { id: 'EV7', by: 'OF1', role: 'office', category: 'Utilities', desc: 'Diesel — standby generator (Aug top-up)', amount: 41500, raisedAt: '2026-08-31', status: 'Paid', mode: 'NEFT — vendor V-1006', timeline: [ { s: 'Submitted', at: '2026-08-31 09:15', by: 'OF1' }, { s: 'Accounts Verified', at: '2026-08-31 11:00', by: 'AC1' }, { s: 'Principal Approved', at: '2026-09-01 10:20', by: 'PR1' }, { s: 'Paid', at: '2026-09-01 15:45', by: 'AC1' } ] },
  { id: 'EV8', by: 'EX1', role: 'examcell', category: 'Examinations', desc: 'Internal-II stationery, OMR & seal kits', amount: 8900, raisedAt: '2026-09-04', status: 'Accounts Verified', mode: 'Pending', timeline: [ { s: 'Submitted', at: '2026-09-04 09:50', by: 'EX1' }, { s: 'Accounts Verified', at: '2026-09-04 12:05', by: 'AC1' }, { s: 'Principal Approval', at: null, by: 'PR1' }, { s: 'Payment', at: null, by: 'AC1' } ] }
];

/* budget heads with allocation vs actuals */
S.budgets = [
  { id: 'BU1', section: 'CSE Department', allocated: 850000, spent: 512000, year: '2026–27', note: 'Lab upgrades + FDP' },
  { id: 'BU2', section: 'ECE Department', allocated: 780000, spent: 448000, year: '2026–27', note: 'Equipment maintenance' },
  { id: 'BU3', section: 'Library & e-Resources', allocated: 620000, spent: 401500, year: '2026–27', note: 'Journals, DBs, print titles' },
  { id: 'BU4', section: 'Hostel & Mess', allocated: 1250000, spent: 918000, year: '2026–27', note: 'Provisions + maintenance' },
  { id: 'BU5', section: 'Placement & Training', allocated: 380000, spent: 168400, year: '2026–27', note: 'Drives, trainers, travel' },
  { id: 'BU6', section: 'Examinations', allocated: 240000, spent: 96200, year: '2026–27', note: 'Internal + semester conduct' },
  { id: 'BU7', section: 'IQAC & Accreditation', allocated: 195000, spent: 121000, year: '2026–27', note: 'NAAC visit preparation' },
  { id: 'BU8', section: 'Sports & Culture', allocated: 210000, spent: 84500, year: '2026–27', note: 'Tournaments, kits, fest' }
];

/* vendors & purchase orders */
S.vendors = [
  { id: 'V-1001', name: 'Knowledge Books & Magazines', category: 'Books & Periodicals', gstin: '33ABCDE1234F1Z5', phone: '+91 98430 20101', rating: 4.2, pos: 7, status: 'Active' },
  { id: 'V-1002', name: 'Elsevier India — Subscriptions', category: 'Journals & Databases', gstin: '33AAACe1234F1Z2', phone: '+91 98430 20102', rating: 4.6, pos: 3, status: 'Active' },
  { id: 'V-1003', name: 'Sri Annamalai Provisions', category: 'Mess Provisions', gstin: '33AABCS5678K1Z9', phone: '+91 98430 20103', rating: 4.0, pos: 14, status: 'Active' },
  { id: 'V-1004', name: 'TechnoLab Instruments', category: 'Lab & Equipment', gstin: '33AACCT9012M1Z7', phone: '+91 98430 20104', rating: 4.4, pos: 5, status: 'Active' },
  { id: 'V-1005', name: 'Springer Distribution India', category: 'Journals & Databases', gstin: '33AAACS3456N1Z4', phone: '+91 98430 20105', rating: 4.5, pos: 2, status: 'Active' },
  { id: 'V-1006', name: 'Coimbatore Fuels & Power', category: 'Utilities', gstin: '33AAGCV7890P1Z3', phone: '+91 98430 20106', rating: 3.8, pos: 9, status: 'Active' },
  { id: 'V-1007', name: 'Daily Newspaper Agency', category: 'Press & Media', gstin: '33AAHCD4567Q1Z1', phone: '+91 98430 20107', rating: 4.1, pos: 22, status: 'Active' },
  { id: 'V-1008', name: 'Zenith IT Hardware', category: 'IT & Networking', gstin: '33AAICZ6789R1Z8', phone: '+91 98430 20108', rating: 4.3, pos: 4, status: 'Active' }
];
S.purchaseOrders = [
  { id: 'PO-2026-011', vendor: 'V-1001', item: 'Magazine subscriptions — 2026 set', qty: 12, amount: 3300, date: '2026-01-05', linked: 'Library', status: 'Closed' },
  { id: 'PO-2026-018', vendor: 'V-1004', item: 'Signal generator probes + leads', qty: 12, amount: 27600, date: '2026-09-04', linked: 'EV4', status: 'Awaiting Approval' },
  { id: 'PO-2026-019', vendor: 'V-1002', item: 'Elsevier JSS — renewal 2026', qty: 1, amount: 22400, date: '2026-08-27', linked: 'EV2', status: 'Paid' },
  { id: 'PO-2026-020', vendor: 'V-1003', item: 'Mess provisions — Sep fortnight 1', qty: 1, amount: 68400, date: '2026-09-03', linked: 'EV1', status: 'Paid' },
  { id: 'PO-2026-021', vendor: 'V-1008', item: 'Wi-Fi access points — Block B', qty: 8, amount: 96000, date: '2026-09-02', linked: 'IT Infrastructure', status: 'Approved' },
  { id: 'PO-2026-022', vendor: 'V-1001', item: 'RQ4 titles — Practical Electronics', qty: 3, amount: 4800, date: '2026-07-20', linked: 'RQ4', status: 'Closed & Accessioned' }
];

/* ══════════════════════════════════════════════════════════
   5 · IQAC — surveys, CO-PO, audits, criteria
   ══════════════════════════════════════════════════════════ */

var FBQ = ['Clarity of course delivery and pace', 'Course material & references quality', 'Fairness of internal assessments', 'Availability for doubts & mentoring', 'Overall course experience this term'];
S.surveys = [
  { id: 'SV01', title: 'Course Feedback — Sep 2026 Cycle', type: 'Course Feedback', template: 'Standard 5-Question v3', questions: FBQ, courses: 6, audience: 'Students (Sem V)', assigned: 144, submitted: 67, from: '2026-09-01', to: '2026-09-10', status: 'Ongoing' },
  { id: 'SV02', title: 'Library Services Survey', type: 'Facility Feedback', template: 'Library v2', questions: ['Ease of search & OPAC', 'Availability of titles', 'e-Resource experience', 'Reading room & ambience', 'Staff support'], courses: 0, audience: 'All Students', assigned: 144, submitted: 116, from: '2026-08-25', to: '2026-09-05', status: 'Ongoing' },
  { id: 'SV03', title: 'Placement Experience — Outgoing Batch', type: 'Placement Feedback', template: 'Placement Exit v1', questions: ['Training adequacy', 'Drive process & communication', 'Interview fairness', 'Offer & support experience'], courses: 0, audience: 'Graduated Batch 2025', assigned: 186, submitted: 171, from: '2026-06-01', to: '2026-06-20', status: 'Completed' },
  { id: 'SV04', title: 'Alumni Connect — 2-Year Feedback', type: 'Alumni Feedback', template: 'Alumni v1', questions: ['Curriculum relevance at work', 'Skill gaps observed', 'Willingness to mentor'], courses: 0, audience: 'Alumni 2023–2025', assigned: 240, submitted: 0, from: '2026-09-20', to: '2026-10-05', status: 'Upcoming' },
  { id: 'SV05', title: 'Exit Survey — Sem V & III', type: 'Exit Survey', template: 'Exit v4', questions: ['Overall institutional experience', 'Hostel & mess experience', 'Grievance redressal', 'Suggestions'], courses: 0, audience: 'Students', assigned: 144, submitted: 0, from: '2026-10-25', to: '2026-11-10', status: 'Upcoming' }
];

/* per-student responses: surveyId -> studentId -> { q: 1..5 } */
S.surveyResponses = {};
(function () {
  var fill = function (sv, ids, ratio) {
    S.surveyResponses[sv] = S.surveyResponses[sv] || {};
    ids.forEach(function (sid, i) {
      if ((i * 7) % 10 < ratio * 10) {
        var ans = {};
        var nq = S.surveys.filter(function (x) { return x.id === sv; })[0].questions.length;
        for (var q = 1; q <= nq; q++) ans[q] = 3 + ((i + q) % 3);
        S.surveyResponses[sv][sid] = ans;
      }
    });
  };
  var semV = S.students.filter(function (s) { return s.sem === 5; }).map(function (s) { return s.id; });
  fill('SV01', semV, 0.66);
  fill('SV02', S.students.map(function (s) { return s.id; }), 0.8);
})();

/* program outcomes (PO1–PO10) */
S.programOutcomes = [
  { po: 'PO1', stmt: 'Apply engineering knowledge to solve computational problems' },
  { po: 'PO2', stmt: 'Analyse a problem, identify and define computing requirements' },
  { po: 'PO3', stmt: 'Design solutions meeting specified needs with appropriate considerations' },
  { po: 'PO4', stmt: 'Conduct investigations of complex computing problems' },
  { po: 'PO5', stmt: 'Use modern tools and techniques for engineering practice' },
  { po: 'PO6', stmt: 'Apply reasoning informed by contextual knowledge' },
  { po: 'PO7', stmt: 'Understand impact of engineering solutions in societal contexts' },
  { po: 'PO8', stmt: 'Apply ethical principles and professional responsibilities' },
  { po: 'PO9', stmt: 'Function effectively in teams and multidisciplinary settings' },
  { po: 'PO10', stmt: 'Communicate effectively with the community at large' }
];

/* course outcomes + attainment per course (5 COs each) + PO mapping levels 1–3 */
S.courseCOs = {};
S.poMaps = {};
S.courses.forEach(function (c, ci) {
  var cos = [];
  var stems = ['Remember and explain', 'Apply the concepts of', 'Analyse and evaluate', 'Design and develop', 'Integrate with modern practice'];
  var topics = (c.title || c.id).split(' ');
  for (var k = 1; k <= 5; k++) {
    cos.push({ co: 'CO' + k, stmt: stems[k - 1] + ' — ' + c.title + ' (unit ' + k + ' scope)', att: 58 + ((ci * 7 + k * 11) % 34) });
  }
  S.courseCOs[c.id] = cos;
  var m = {};
  cos.forEach(function (co, k) {
    m[co.co] = [ { po: 'PO' + (1 + (k % 3)), lvl: 3 }, { po: 'PO' + (4 + ((k + 1) % 3)), lvl: k % 2 === 0 ? 2 : 3 }, { po: 'PO' + (7 + (k % 4)), lvl: 2 } ];
  });
  S.poMaps[c.id] = m;
});

/* audits */
S.audits = [
  { id: 'AU1', type: 'Internal Academic Audit', scope: 'CSE — Sem V lesson plans & rubrics', date: '2026-08-18', team: 'AD1, IQ1, T09', findings: 3, actions: 2, status: 'Follow-up Pending', note: 'Rubric drift in CS504; two units behind plan in CSE-B' },
  { id: 'AU2', type: 'Departmental Audit', scope: 'ECE — lab registers & safety', date: '2026-08-25', team: 'IQ1, EX1', findings: 2, actions: 2, status: 'Closed', note: 'Both closed — register format aligned' },
  { id: 'AU3', type: 'Administrative Audit', scope: 'Hostel mess — stock & indent', date: '2026-08-30', team: 'AC1, IQ1', findings: 1, actions: 1, status: 'Closed', note: 'Indent timing corrected' },
  { id: 'AU4', type: 'Compliance Review', scope: 'Library — subscription records', date: '2026-09-08', team: 'IQ1, OF2', findings: 0, actions: 0, status: 'Scheduled', note: 'Renewal registers + GST invoices' },
  { id: 'AU5', type: 'Internal Quality Audit', scope: 'CO-PO data pipeline readiness', date: '2026-09-15', team: 'IQ1, AD1', findings: 0, actions: 0, status: 'Scheduled', note: 'Pre-NAAC data validation' }
];

/* accreditation criteria readiness */
S.naacCriteria = [
  { c: 'C1', name: 'Curricular Aspects', weight: 10, dataPoints: 42, evidence: 'Complete', readiness: 88 },
  { c: 'C2', name: 'Teaching-Learning & Evaluation', weight: 30, dataPoints: 116, evidence: 'Complete', readiness: 84 },
  { c: 'C3', name: 'Research, Innovations & Extension', weight: 15, dataPoints: 61, evidence: 'In Progress', readiness: 71 },
  { c: 'C4', name: 'Infrastructure & Learning Resources', weight: 10, dataPoints: 48, evidence: 'Complete', readiness: 82 },
  { c: 'C5', name: 'Student Support & Progression', weight: 10, dataPoints: 73, evidence: 'In Progress', readiness: 79 },
  { c: 'C6', name: 'Governance, Leadership & Management', weight: 10, dataPoints: 39, evidence: 'Complete', readiness: 86 },
  { c: 'C7', name: 'Institutional Values & Best Practices', weight: 15, dataPoints: 55, evidence: 'In Progress', readiness: 74 }
];

/* ══════════════════════════════════════════════════════════
   6 · EVENTS · ACHIEVEMENTS · STAFF LEAVE · APPRAISAL · e-LEARNING · CURRICULUM
   ══════════════════════════════════════════════════════════ */

S.events = [
  { id: 'EV01', category: 'Technical', internal: 'External', org: 'PSG College of Technology', type: 'Symposium', title: 'Yuva Tech \u201926 — National Symposium', venue: 'PSG Tech, Coimbatore', posted: '2026-08-28', from: '2026-09-09', to: '2026-09-10', areas: 'Students · Faculty', status: 'Published', archive: false },
  { id: 'EV02', category: 'Cultural', internal: 'Internal', org: 'Student Affairs', type: 'Fest', title: 'Kalai Utsav — Annual Cultural Fest', venue: 'Main Auditorium', posted: '2026-08-20', from: '2026-09-19', to: '2026-09-21', areas: 'All', status: 'Published', archive: false },
  { id: 'EV03', category: 'Workshop', internal: 'Internal', org: 'CSE Department', type: 'Workshop', title: 'Applied Machine Learning — 3-Day Bootcamp', venue: 'Lab 2, Block A', posted: '2026-09-01', from: '2026-09-12', to: '2026-09-14', areas: 'CSE · ECE', status: 'Published', archive: false },
  { id: 'EV04', category: 'Seminar', internal: 'External', org: 'Bosch Global Software', type: 'Industry Talk', title: 'Career Paths in Embedded R&D', venue: 'Seminar Hall', posted: '2026-09-02', from: '2026-09-16', to: '2026-09-16', areas: 'ECE', status: 'Published', archive: false },
  { id: 'EV05', category: 'Sports', internal: 'Internal', org: 'Physical Education', type: 'Tournament', title: 'Inter-Class Cricket League — Finals', venue: 'Main Ground', posted: '2026-08-30', from: '2026-09-13', to: '2026-09-13', areas: 'All', status: 'Published', archive: false },
  { id: 'EV06', category: 'Academic', internal: 'Internal', org: 'Examination Cell', type: 'Exam Notice', title: 'Internal Assessment — II : Timetable & Instructions', venue: 'Exam Halls', posted: '2026-09-03', from: '2026-09-15', to: '2026-09-17', areas: 'Students', status: 'Published', archive: false },
  { id: 'EV07', category: 'Academic', internal: 'External', org: 'SWAYAM / NPTEL', type: 'Enrollment Drive', title: 'NPTEL Local Chapter — Jan 2027 Courses', venue: 'Online', posted: '2026-08-25', from: '2026-08-25', to: '2026-09-25', areas: 'Students · Faculty', status: 'Published', archive: false },
  { id: 'EV08', category: 'Technical', internal: 'Internal', org: 'Placement Cell', type: 'Drive', title: 'TCS Digital — Campus Drive Briefing', venue: 'Placement Hall', posted: '2026-09-04', from: '2026-09-18', to: '2026-09-18', areas: 'Sem V Students', status: 'Published', archive: false },
  { id: 'EV09', category: 'Cultural', internal: 'Internal', org: 'Fine Arts Club', type: 'Competition', title: 'Independence Day Cultural Evening', venue: 'Open Air Stage', posted: '2026-08-10', from: '2026-08-15', to: '2026-08-15', areas: 'All', status: 'Archived', archive: true },
  { id: 'EV10', category: 'Workshop', internal: 'External', org: 'IIT Madras — Shaastra', type: 'Workshop', title: 'Design Thinking Sprint (Co-hosted)', venue: 'MDT Campus + Online', posted: '2026-07-18', from: '2026-07-26', to: '2026-07-27', areas: 'All', status: 'Archived', archive: true }
];

S.achievements = [
  { id: 'ACH1', studentId: 'ST001', name: 'Yuva Tech \u201926 — Best Paper Award', category: 'Academic', level: 'National', date: '2026-09-09', prize: 'Prize — 1st', place: 'Federated Learning paper, PSG Tech', desc: 'Best Paper Award in the national symposium track (selected from 84 papers).', attachment: 'best-paper-cert.pdf', status: 'Pending', verifiedBy: null },
  { id: 'ACH2', studentId: 'ST049', name: 'Smart India Hackathon — Finalist', category: 'Technical', level: 'National', date: '2026-08-22', prize: 'Prize — 2nd', place: 'Chennai Grand Finale', desc: 'Led a team of four to second place in the agri-drone problem statement.', attachment: 'sih-finalist.pdf', status: 'Verified', verifiedBy: 'T05' },
  { id: 'ACH3', studentId: 'ST061', name: 'Inter-Zone Volleyball — Winner', category: 'Sports', level: 'State', date: '2026-08-18', prize: 'Prize — Winner', place: 'Anna University Zone Meet', desc: 'Captain of the winning zone team.', attachment: null, status: 'Verified', verifiedBy: 'T09' },
  { id: 'ACH4', studentId: 'ST052', name: 'Kalai Utsav — Classical Solo (2nd)', category: 'Cultural', level: 'College', date: '2026-09-21', prize: 'Prize — 2nd', place: 'Main Auditorium', desc: 'Second place in Bharatanatyam solo category.', attachment: null, status: 'Pending', verifiedBy: null },
  { id: 'ACH5', studentId: 'ST077', name: 'AWS Cloud Quest Certification', category: 'Technical', level: 'National', date: '2026-08-05', prize: 'Certification', place: 'Online proctored', desc: 'Completed the Cloud Quest practitioner path with labs portfolio.', attachment: 'aws-cert.pdf', status: 'Verified', verifiedBy: 'T10' },
  { id: 'ACH6', studentId: 'ST013', name: 'ECE Association — Secretary (Elected)', category: 'Leadership', level: 'College', date: '2026-08-30', prize: 'Position', place: 'MDT Campus', desc: 'Elected unopposed to lead the department student association.', attachment: null, status: 'Verified', verifiedBy: 'T11' },
  { id: 'ACH7', studentId: 'ST033', name: 'Paper Presentation — SRM TechFest', category: 'Academic', level: 'State', date: '2026-07-24', prize: 'Participation', place: 'SRM Institute', desc: 'Presented on VLSI low-power design approaches.', attachment: null, status: 'Rejected', verifiedBy: 'T06', reason: 'Participation-only certificates are recorded in the co-curricular log instead.' }
];

/* staff leave & faculty swap (HRMS) */
S.staffLeaves = [
  { id: 'SLV1', staffId: 'T03', type: 'On Duty', mode: 'Days', from: '2026-09-09', to: '2026-09-10', days: 2, reason: 'Paper presentation at Yuva Tech \u201926, PSG Tech (with OD proof attached)', proof: 'invitation-yuva.pdf', swapTo: null, swapStatus: null, status: 'Recommended', history: [ { s: 'Submitted', at: '2026-09-02 09:10', by: 'T03' }, { s: 'Class loads rearranged by Academic Director', at: '2026-09-03 11:00', by: 'AD1' } ] },
  { id: 'SLV2', staffId: 'T10', type: 'Leave', mode: 'Days', from: '2026-09-18', to: '2026-09-19', days: 2, reason: 'Family function out of station', proof: null, swapTo: 'T12', swapStatus: 'Accepted', status: 'Submitted', history: [ { s: 'Submitted', at: '2026-09-03 10:40', by: 'T10' }, { s: 'Faculty swap requested — T12 accepted (19 Sep P3, P6)', at: '2026-09-03 15:20', by: 'T12' } ] },
  { id: 'SLV3', staffId: 'T06', type: 'Permission', mode: 'Hours', from: '2026-09-05', to: '2026-09-05', days: 0, hours: '2hr', reason: 'Bank work — passport renewal appointment', proof: null, swapTo: null, swapStatus: null, status: 'Approved', history: [ { s: 'Submitted', at: '2026-09-01 08:55', by: 'T06' }, { s: 'Approved by Academic Director — first two hours', at: '2026-09-01 13:30', by: 'AD1' } ] },
  { id: 'SLV4', staffId: 'T02', type: 'Leave', mode: 'Days', from: '2026-09-24', to: '2026-09-25', days: 2, reason: 'Medical rest — advised after dental surgery', proof: 'medical-cert.pdf', swapTo: 'T13', swapStatus: 'Pending', status: 'Submitted', history: [ { s: 'Submitted', at: '2026-09-04 09:25', by: 'T02' }, { s: 'Faculty swap requested — awaiting T13\u2019s response', at: null, by: 'T13' } ] },
  { id: 'SLV5', staffId: 'WB1', type: 'Leave', mode: 'Days', from: '2026-08-13', to: '2026-08-14', days: 2, reason: 'Personal — travel to hometown', proof: null, swapTo: null, swapStatus: null, status: 'Approved', history: [ { s: 'Submitted', at: '2026-08-11 18:40', by: 'WB1' }, { s: 'Approved by Academic Director — warden duty delegated to WG1', at: '2026-08-12 09:15', by: 'AD1' } ] }
];

/* annual performance appraisals (self → academic review) */
S.appraisals = [
  { id: 'AP1', staffId: 'T01', cycle: '2025–26', self: { teaching: 210, publications: 1, fdp: 2, events: 4, feedback: 4.6 }, kpis: { attAvg: 92, results: 88, menteeMeetings: 8 }, score: 91, status: 'Reviewed', reviewer: 'AD1', remark: 'Consistent performer; mentoring record exemplary.', at: '2026-06-12' },
  { id: 'AP2', staffId: 'T02', cycle: '2025–26', self: { teaching: 195, publications: 2, fdp: 1, events: 3, feedback: 4.4 }, kpis: { attAvg: 89, results: 84, menteeMeetings: 5 }, score: 87, status: 'Reviewed', reviewer: 'AD1', remark: 'Research output good; increase FDP participation.', at: '2026-06-13' },
  { id: 'AP3', staffId: 'T05', cycle: '2025–26', self: { teaching: 198, publications: 3, fdp: 2, events: 6, feedback: 4.7 }, kpis: { attAvg: 90, results: 90, menteeMeetings: 7 }, score: 93, status: 'Reviewed', reviewer: 'AD1', remark: 'Top of the department — recommended for HoD track.', at: '2026-06-14' },
  { id: 'AP4', staffId: 'T10', cycle: '2025–26', self: { teaching: 180, publications: 0, fdp: 1, events: 2, feedback: 4.1 }, kpis: { attAvg: 86, results: 79, menteeMeetings: 3 }, score: 78, status: 'Submitted', reviewer: null, remark: null, at: '2026-06-10' },
  { id: 'AP5', staffId: 'T01', cycle: '2026–27', self: { teaching: 108, publications: 0, fdp: 1, events: 2, feedback: 4.5 }, kpis: { attAvg: 91, results: 0, menteeMeetings: 4 }, score: null, status: 'Draft', reviewer: null, remark: null, at: '2026-09-01' }
];

/* e-learning content progress per student × course */
S.elearnProgress = {};
S.students.forEach(function (s, si) {
  S.elearnProgress[s.id] = S.elearnProgress[s.id] || {};
  var al = S.courseAllocations.filter(function (a) { return a.classId === s.classId; });
  al.forEach(function (a, ai) {
    var units = 12;
    var done = 2 + ((si * 3 + ai * 5) % 9);
    S.elearnProgress[s.id][a.courseId] = { done: done, total: units, score: done ? 55 + ((si + ai) % 40) : null };
  });
});

/* curriculum / syllabus mapping register */
S.curriculum = [
  { id: 'CU1', dept: 'CSE', programme: 'B.Tech — Computer Science & Engineering', regulation: 'R2024', batches: ['2024–2028','2025–2029'], sems: 8, courses: 42, status: 'Current', review: '2026-11-30', syllabusVersion: 'v3.2 (Apr 2026)', notes: 'AICTE model curriculum + industry electives track' },
  { id: 'CU2', dept: 'CSE', programme: 'B.Tech — Computer Science & Engineering', regulation: 'R2021', batches: ['2021–2025'], sems: 8, courses: 40, status: 'Phasing Out', review: '—', syllabusVersion: 'v2.1 (final)', notes: 'Only backlog exams remain for the outgoing batch' },
  { id: 'CU3', dept: 'ECE', programme: 'B.Tech — Electronics & Communication Engineering', regulation: 'R2024', batches: ['2024–2028','2025–2029'], sems: 8, courses: 44, status: 'Current', review: '2026-12-15', syllabusVersion: 'v2.8 (Jul 2026)', notes: 'VLSI specialisation electives added from 2026 intake' },
  { id: 'CU4', dept: 'ECE', programme: 'B.Tech — Electronics & Communication Engineering', regulation: 'R2021', batches: ['2021–2025'], sems: 8, courses: 41, status: 'Phasing Out', review: '—', syllabusVersion: 'v1.9 (final)', notes: 'Archived syllabus retained for reference' },
  { id: 'CU5', dept: 'GEN', programme: 'Value-Added & Certification Tracks', regulation: 'VAT-2026', batches: ['All'], sems: 0, courses: 12, status: 'Current', review: '2027-01-10', syllabusVersion: 'v1.4', notes: 'NPTEL mirror + cloud + soft skills certification paths' }
];

/* v8 notifications for the new portals */
S.notifications.unshift(
  { id: 'N16', at: '2026-09-04 10:10', aud: 'role:library', title: '3 reservations waiting', body: '2 waiting + 1 ready for pickup — LB-002, LB-006, LB-028.', link: 'transactions.html', read: false, tone: 'blue' },
  { id: 'N17', at: '2026-09-04 09:50', aud: 'role:examcell', title: 'Model exam seating due', body: 'Room-wise seating for 8–10 Sep model examination is pending finalisation.', link: 'exams.html', read: false, tone: 'yellow' },
  { id: 'N18', at: '2026-09-04 09:40', aud: 'role:placement', title: 'TCS Digital registration closes 15 Sep', body: '34 of 48 eligible students registered so far.', link: 'drives.html', read: false, tone: 'blue' },
  { id: 'N19', at: '2026-09-04 09:05', aud: 'role:accounts', title: '2 vouchers awaiting your verification', body: 'EV4 lab probes ₹27,600 · EV5 placement logistics ₹34,200.', link: 'expenses.html', read: false, tone: 'yellow' },
  { id: 'N20', at: '2026-09-03 16:30', aud: 'role:iqac', title: 'Course feedback 67% done', body: 'SV01 closes 10 Sep — 48 students yet to respond.', link: 'surveys.html', read: false, tone: 'blue' },
  { id: 'N21', at: '2026-09-04 08:45', aud: 'role:teacher', title: 'Achievement verification pending', body: 'ACH1 (Aarav Menon) and ACH4 (R. Keerthana\u2019s) await mentor verification.', link: 'mentor.html', read: false, tone: 'yellow' },
  { id: 'N22', at: '2026-09-03 15:00', aud: 'role:teacher', title: 'Faculty swap request from Anitha S', body: 'T02 requested you (T13) to cover 24–25 Sep — respond in My Leave & Swap.', link: 'leaves.html', read: false, tone: 'blue' }
);

S.activity.unshift(
  { id: 'A13', at: '2026-09-04 10:10', actor: 'OF2', action: 'Flagged reservations', detail: 'LB-006 ready for Priya Krishnan' },
  { id: 'A14', at: '2026-09-04 09:30', actor: 'EX1', action: 'Published exam notice', detail: 'Internal Assessment II — 15 to 17 Sep' },
  { id: 'A15', at: '2026-09-03 17:15', actor: 'AC1', action: 'Verified expense voucher', detail: 'EV3 — geyser repairs ₹18,600' },
  { id: 'A16', at: '2026-09-03 12:40', actor: 'IQ1', action: 'Opened course feedback cycle', detail: 'SV01 — 144 students assigned' },
  { id: 'A17', at: '2026-09-03 09:20', actor: 'OF3', action: 'Posted placement drive', detail: 'TCS Digital — 24 Sep, 34 registered' },
  { id: 'A18', at: '2026-09-02 16:05', actor: 'LB2', action: 'Stock verification completed', detail: 'D2 — Management & Soft Skills section' }
);

if (typeof module !== 'undefined' && module.exports) module.exports = S;
})(typeof window !== 'undefined' ? window : globalThis);
