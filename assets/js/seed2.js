/* My Desktop Tech — CampusOne · Reference dataset, part 2 (activity data) */
(function (g) {
'use strict';
var S = g.SEED;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
var R = mulberry32(0x53454544);
function ri(a,b){return a+Math.floor(R()*(b-a+1));}
function pad(n,l){n=String(n);while(n.length<l)n='0'+n;return n;}
function findSt(id){ return S.students.filter(function(s){return s.id===id;})[0]; }

/* ---------------- assignments ---------------- */
S.assignments = [];
S.submissions = {};
var ATITLES = { A1: ['Unit Assessment — Units 1 & 2','Problem Set — Core Concepts','Case Study Write-up'], A2: ['Mini Project — Proposal','Take-home Problem Set','Design Assignment'] };
S.courseAllocations.forEach(function (al, ai) {
  ['A1','A2'].forEach(function (k) {
    var id = 'AS-' + al.id + '-' + k;
    S.assignments.push({ id: id, courseId: al.courseId, classId: al.classId, teacherId: al.teacherId,
      title: ATITLES[k][ai % 3], desc: k === 'A1' ? 'Written assessment covering the completed units. Submit the scanned answer sheet.' : 'Prepare the deliverable as per the class brief and upload before the deadline.',
      assignedAt: k === 'A1' ? '2026-08-05' : '2026-08-28', dueAt: k === 'A1' ? '2026-08-14' : '2026-09-12', max: 15 });
    var subs = {};
    S.students.filter(function (s) { return s.classId === al.classId; }).forEach(function (s) {
      if (k === 'A1') { subs[s.id] = { st: 'Graded', at: '2026-08-13 21:' + pad(ri(10, 55), 2), marks: Math.max(6, Math.round(15 * (s.cgpa / 10) * (0.85 + R() * 0.2))) }; }
      else { var r = R(); subs[s.id] = r < 0.55 ? { st: 'Submitted', at: '2026-09-0' + ri(1, 3) + ' 2' + ri(0, 3) + ':' + pad(ri(10, 55), 2) } : { st: 'Pending' }; }
    });
    /* demo accents */
    if (al.classId === 'CSE-A' && al.courseId === 'CS503' && k === 'A2') { if (subs.ST001) { subs.ST001 = { st: 'Submitted', at: '2026-09-01 22:40' }; } }
    S.submissions[id] = subs;
  });
});

/* ---------------- quizzes ---------------- */
S.quizzes = [];
S.quizAttempts = {};
var QBANK = [
  { q: 'Which scheduling algorithm gives the provably optimal average waiting time for a fixed set of burst times?', o: ['Round Robin','Shortest Job First','First Come First Served','Priority with aging'], a: 1 },
  { q: 'A relation is in 3NF when every non-prime attribute is:', o: ['Fully functionally dependent on the key','Only transitively dependent','Mutually independent','Multivalued dependent'], a: 0 },
  { q: 'The primary function of the subnet mask in IPv4 addressing is to:', o: ['Compress headers','Separate network and host portions','Encrypt payloads','Assign MAC addresses'], a: 1 },
  { q: 'Master theorem Case 2 with T(n)=2T(n/2)+n yields complexity:', o: ['O(n)','O(n log n)','O(n²)','O(log n)'], a: 1 },
  { q: 'Which technique mitigates overfitting in a trained model?', o: ['Increasing learning rate','Regularisation','Removing validation data','Doubling epochs'], a: 1 },
  { q: 'In CMOS design, dynamic power dissipation is proportional to:', o: ['V² · f · C','V / f','I² / R','f / C'], a: 0 },
  { q: 'The DFT of an N-point sequence can be computed efficiently using:', o: ['Bilinear transform','FFT algorithms','Newton–Raphson','Gram–Schmidt'], a: 1 },
  { q: 'Which interrupt structure best suits deterministic real-time tasks?', o: ['Polling loop','Vectored interrupts with priorities','Software delay loops','Cache prefetch'], a: 1 },
  { q: 'Shannon capacity for a band-limited AWGN channel increases with:', o: ['Bandwidth and SNR','Symbol size','Parity bits','Sampling hold time'], a: 0 },
  { q: 'Astable operation of the 555 timer produces:', o: ['A single pulse','A continuous square wave','A DC level','A triangular ramp only'], a: 1 },
  { q: 'Which structure enforces LIFO ordering?', o: ['Queue','Stack','Heap','Graph adjacency list'], a: 1 },
  { q: 'Virtual function tables in C++ primarily enable:', o: ['Compile-time overloading','Runtime polymorphism','Manual memory management','Operator precedence'], a: 1 }
];
S.courseAllocations.forEach(function (al) {
  ['Q1','Q2'].forEach(function (k) {
    var id = 'QZ-' + al.id + '-' + k;
    S.quizzes.push({ id: id, courseId: al.courseId, classId: al.classId, teacherId: al.teacherId,
      title: k === 'Q1' ? 'Quiz 1 — Units 1 & 2' : 'Quiz 2 — Units 3 & 4',
      status: k === 'Q1' ? 'Open' : 'Scheduled', opensAt: k === 'Q1' ? '2026-08-25' : '2026-09-18', closesAt: k === 'Q1' ? '2026-08-28' : '2026-09-21',
      duration: 15, max: 10,
      qs: [QBANK[(al.id.charCodeAt(3) + 1) % 12], QBANK[(al.id.charCodeAt(4) + 4) % 12], QBANK[(al.id.charCodeAt(5) + 7) % 12]] });
    var att = {};
    if (k === 'Q1') {
      S.students.filter(function (s) { return s.classId === al.classId; }).forEach(function (s) {
        att[s.id] = { score: S.marks[s.id][al.courseId].Q1, at: '2026-08-26 1' + ri(0, 9) + ':' + pad(ri(10, 55), 2) };
      });
    }
    S.quizAttempts[id] = att;
  });
});

/* ---------------- fees ---------------- */
S.feeHeads = [
  { id: 'TU', name: 'Tuition — Semester V', amount: 28500, due: '2026-08-15', applies: 'all' },
  { id: 'HB', name: 'Hostel — Semester V', amount: 30000, due: '2026-08-15', applies: 'hostellers' },
  { id: 'MS', name: 'Mess — Sep–Nov 2026', amount: 18000, due: '2026-09-10', applies: 'hostellers' },
  { id: 'EX', name: 'Model & Semester Exam', amount: 1500, due: '2026-10-10', applies: 'all' }
];
S.feeTransactions = [];
var rcp = 26100;
var MODES = ['UPI','Net Banking','Cash','DD'];
S.students.forEach(function (s, i) {
  var owe = R() < 0.12;
  s.feePaid = s.feePaid || {};
  s.feePaid.TU = owe && i % 3 === 0 ? 0 : 28500;
  if (s.feePaid.TU > 0) S.feeTransactions.push({ id: 'FT' + pad(rcp - 26000, 4), studentId: s.id, head: 'TU', amount: 28500, mode: pick(), date: ri(5, 20) <= 14 ? '2026-08-' + pad(ri(1, 14), 2) : '2026-08-' + pad(ri(15, 20), 2), receipt: 'RCP-' + (rcp++), status: 'Paid' });
  if (s.hostel) {
    var hb = (s.id === 'ST001') ? 18000 : (owe && i % 5 === 1 ? 0 : 30000);
    s.feePaid.HB = hb;
    if (hb > 0) S.feeTransactions.push({ id: 'FT' + pad(rcp - 26000, 4), studentId: s.id, head: 'HB', amount: hb, mode: pick(), date: '2026-08-' + pad(ri(1, 18), 2), receipt: 'RCP-' + (rcp++), status: 'Paid' });
    var ms = R() < 0.25 ? 0 : 18000;
    s.feePaid.MS = ms;
    if (ms > 0) S.feeTransactions.push({ id: 'FT' + pad(rcp - 26000, 4), studentId: s.id, head: 'MS', amount: ms, mode: pick(), date: '2026-09-0' + ri(1, 3), receipt: 'RCP-' + (rcp++), status: 'Paid' });
    s.feePaid.EX = 0;
  } else { s.feePaid.EX = 0; s.feePaid.HB = 0; s.feePaid.MS = 0; }
});
function pick(){ return MODES[ri(0, 3)]; }

S.hallTickets = [
  { id: 'HT1', exam: 'Internal Assessment II — Sep 2026', classId: 'CSE-B', published: true, publishedAt: '2026-09-01', eligible: 24, blocked: 0 },
  { id: 'HT2', exam: 'Model Examination — Nov 2026', classId: null, published: false, publishedAt: null, eligible: 0, blocked: 0 }
];

S.certificates = [
  { id: 'CT1', studentId: 'ST030', type: 'Bonafide Certificate', reason: 'Bank education loan — Canara Bank', requestedAt: '2026-09-02', status: 'Pending', issuedBy: null, refNo: null, issuedAt: null },
  { id: 'CT2', studentId: 'ST055', type: 'Bonafide Certificate', reason: 'Passport application', requestedAt: '2026-08-24', status: 'Issued', issuedBy: 'OF1', refNo: 'MDT/BON/2026/0211', issuedAt: '2026-08-26' },
  { id: 'CT3', studentId: 'ST070', type: 'Transcript (Sem I–IV)', reason: 'Higher studies application', requestedAt: '2026-08-30', status: 'Pending', issuedBy: null, refNo: null, issuedAt: null }
];

/* ---------------- mess menu ---------------- */
S.messMenu = [
  { day: 'Mon', breakfast: 'Idli + sambar + coconut chutney', lunch: 'Sambar rice, poriyal, appalam, curd', snacks: 'Sundal + tea', dinner: 'Chapathi, paneer masala, dal' },
  { day: 'Tue', breakfast: 'Pongal + vadai', lunch: 'Kara kuzhambu, beans poriyal, rasam, curd', snacks: 'Bonda + coffee', dinner: 'Veg fried rice, gobhi Manchurian' },
  { day: 'Wed', breakfast: 'Dosa + tomato chutney', lunch: 'Curd rice, kathirikai kuzhambu, appalam', snacks: 'Biscuits + milk', dinner: 'Chapathi, channa masala, rice' },
  { day: 'Thu', breakfast: 'Upma + kesari', lunch: 'Sambar, avial, rice, curd', snacks: 'Cutlet + tea', dinner: 'Chicken curry / veg korma, chapathi, rice' },
  { day: 'Fri', breakfast: 'Idiyappam + veg kurma', lunch: 'Lemon rice, vadai, pachadi, curd', snacks: 'Samosa + tea', dinner: 'Kichdi, raita, papad' },
  { day: 'Sat', breakfast: 'Poori + masala', lunch: 'Non-veg meals (chicken) / veg meals', snacks: 'Noodles + juice', dinner: 'Parotta, salna, raita' },
  { day: 'Sun', breakfast: 'Aappam + stew', lunch: 'Biriyani (veg/chicken), brinjal curry, payasam', snacks: 'Puffs + tea', dinner: 'Dosa, sambar, chutney' }
];

/* ---------------- hostel requests ---------------- */
S.outingRequests = [
  { id: 'OUT1', studentId: 'ST001', type: 'Day', out: '2026-09-05 09:00', in: '2026-09-05 18:00', place: 'Crosscut Road, Gandhipuram', reason: 'Family visit — lunch with uncle; requested deadline because the family fixed the lunch for the 5th and travel needs booking tonight', appliedAt: '2026-09-03 20:15',
    deadline: '2026-09-04',
    wardenId: 'WB1', status: 'Pending', adStatus: null,
    timeline: [ { s: 'Submitted', at: '2026-09-03 20:15', by: 'ST001', note: 'Requested deadline 2026-09-04 — reason stated by the student.' }, { s: 'Warden Review', at: null, by: 'WB1' } ] },
  { id: 'OUT2', studentId: 'ST049', type: 'Night', out: '2026-09-06 09:00', in: '2026-09-07 09:00', place: 'Grand home, R.S. Puram', reason: 'Cousin\u2019s engagement — staying overnight with parents; deadline requested as the function is on the 6th and tickets need advance booking', appliedAt: '2026-09-02 11:40',
    deadline: '2026-09-04',
    wardenId: 'WG1', status: 'Pending', adStatus: 'Pending',
    timeline: [ { s: 'Submitted', at: '2026-09-02 11:40', by: 'ST049', note: 'Requested deadline 2026-09-04 — reason stated by the student.' }, { s: 'Warden Review (Girls Block)', at: null, by: 'WG1' }, { s: 'Academic Director Approval', at: null, by: 'AD1' } ] },
  { id: 'OUT3', studentId: 'ST003', type: 'Day', out: '2026-08-22 10:00', in: '2026-08-22 19:30', place: 'Brookefields Mall', reason: 'Movie with parents', appliedAt: '2026-08-21 18:00',
    wardenId: 'WB1', status: 'Completed', adStatus: null,
    timeline: [ { s: 'Submitted', at: '2026-08-21 18:00', by: 'ST003' }, { s: 'Approved by Warden', at: '2026-08-21 19:10', by: 'WB1', note: 'Return before 8 PM.' }, { s: 'Completed', at: '2026-08-22 19:20', by: 'System' } ] },
  { id: 'OUT4', studentId: 'ST052', type: 'Day', out: '2026-08-12 13:00', in: '2026-08-12 18:00', place: 'Race Course', reason: 'Personal', appliedAt: '2026-08-11 22:00',
    wardenId: 'WG1', status: 'Rejected', adStatus: null,
    timeline: [ { s: 'Submitted', at: '2026-08-11 22:00', by: 'ST052' }, { s: 'Rejected by Warden', at: '2026-08-12 08:30', by: 'WG1', note: 'Applied after gate cut-off time.' } ] }
];

S.odRequests = [
  { id: 'OD1', studentId: 'ST001', event: 'Yuva Tech \u201926 — National Symposium', venue: 'PSG College of Technology', date: '2026-09-09', session: 'FN', reason: 'Presenting paper on Federated Learning (team lead)', proof: 'invitation-letter.pdf', appliedAt: '2026-09-04 09:30',
    status: 'Submitted', advisorId: 'T01', adId: null, hosteller: true,
    timeline: [ { s: 'Submitted', at: '2026-09-04 09:30', by: 'ST001' }, { s: 'Class Advisor Recommendation', at: null, by: 'T01' }, { s: 'Academic Director Approval', at: null, by: 'AD1' } ] },
  { id: 'OD2', studentId: 'ST004', event: 'Inter-Zone Athletics — 400m hurdles', venue: 'Anna Stadium, Coimbatore', date: '2026-09-07', session: 'Full Day', reason: 'College team participant ( athletics squad )', proof: 'district-sports-letter.pdf', appliedAt: '2026-09-01 10:00',
    status: 'Recommended', advisorId: 'T01', adId: 'AD1', hosteller: false,
    timeline: [ { s: 'Submitted', at: '2026-09-01 10:00', by: 'ST004' }, { s: 'Recommended by Class Advisor', at: '2026-09-02 14:20', by: 'T01', note: 'Confirmed with physical director. Medal prospect.' }, { s: 'Academic Director Approval', at: null, by: 'AD1' } ] },
  { id: 'OD3', studentId: 'ST001', event: 'District-level Chess Championship', venue: 'Coimbatore Chess Academy', date: '2026-08-12', session: 'AN', reason: 'Finals round', proof: 'chess-federation-letter.pdf', appliedAt: '2026-08-10 09:00',
    status: 'Approved', advisorId: 'T01', adId: 'AD1', hosteller: true,
    timeline: [ { s: 'Submitted', at: '2026-08-10 09:00', by: 'ST001' }, { s: 'Recommended by Class Advisor', at: '2026-08-10 15:00', by: 'T01' }, { s: 'Approved by Academic Director', at: '2026-08-11 10:30', by: 'AD1' }, { s: 'Warden informed (hosteller)', at: '2026-08-11 10:31', by: 'WB1' } ] },
  { id: 'OD4', studentId: 'ST050', event: 'Robotics Workshop', venue: 'Amrita University', date: '2026-08-20', session: 'FN', reason: 'Workshop participation', proof: '', appliedAt: '2026-08-17 12:00',
    status: 'Rejected', advisorId: 'T05', adId: 'AD1', hosteller: true,
    timeline: [ { s: 'Submitted', at: '2026-08-17 12:00', by: 'ST050' }, { s: 'Recommended by Class Advisor', at: '2026-08-18 09:00', by: 'T05' }, { s: 'Rejected by Academic Director', at: '2026-08-18 16:45', by: 'AD1', note: 'No valid invitation attached. Re-apply with proof.' } ] },
  { id: 'OD5', studentId: 'ST058', event: 'Paper Presentation — ICACCT 2026', venue: 'Sri Krishna College', date: '2026-08-25', session: 'Full Day', reason: 'Presenting research paper', proof: 'acceptance-mail.pdf', appliedAt: '2026-08-21 09:00',
    status: 'Approved', advisorId: 'T07', adId: 'AD1', hosteller: false,
    timeline: [ { s: 'Submitted', at: '2026-08-21 09:00', by: 'ST058' }, { s: 'Recommended by Class Advisor', at: '2026-08-22 10:00', by: 'T07' }, { s: 'Approved by Academic Director', at: '2026-08-23 11:15', by: 'AD1' } ] }
];

S.leaveRequests = [
  { id: 'LE1', studentId: 'ST009', type: 'Sick Leave', from: '2026-08-20', to: '2026-08-21', days: 2, reason: 'Viral fever with medical certificate from R.S. Puram clinic', proof: 'medical-cert.pdf', appliedAt: '2026-08-20 07:45',
    status: 'Approved', advisorId: 'T01', adId: 'AD1', principalId: null,
    timeline: [ { s: 'Submitted', at: '2026-08-20 07:45', by: 'ST009' }, { s: 'Recommended by Class Advisor', at: '2026-08-20 09:00', by: 'T01' }, { s: 'Approved by Academic Director', at: '2026-08-20 12:00', by: 'AD1' } ] },
  { id: 'LE2', studentId: 'ST007', type: 'Casual Leave', from: '2026-09-21', to: '2026-09-26', days: 6, reason: 'Family function at native place — Madurai (with parents)', proof: 'parent-note.jpg', appliedAt: '2026-09-01 10:00',
    status: 'AD Approved', advisorId: 'T01', adId: 'AD1', principalId: 'PR1',
    timeline: [ { s: 'Submitted', at: '2026-09-01 10:00', by: 'ST007' }, { s: 'Recommended by Class Advisor', at: '2026-09-02 09:30', by: 'T01' }, { s: 'Approved by Academic Director', at: '2026-09-03 11:00', by: 'AD1', note: 'Beyond 5 working days — routed to Principal for countersignature.' }, { s: 'Principal Countersignature', at: null, by: 'PR1' } ] },
  { id: 'LE3', studentId: 'ST061', type: 'Sick Leave', from: '2026-09-08', to: '2026-09-09', days: 2, reason: 'Dental surgery — consultation confirmed at Gangothri dental', proof: 'appointment-slip.pdf', appliedAt: '2026-09-04 08:10',
    status: 'Submitted', advisorId: 'T09', adId: null, principalId: null,
    timeline: [ { s: 'Submitted', at: '2026-09-04 08:10', by: 'ST061' }, { s: 'Class Advisor Recommendation', at: null, by: 'T09' } ] }
];

S.complaints = [
  { id: 'HC1', by: 'ST001', block: 'A', category: 'Maintenance', title: 'Room A-104 geyser not heating', desc: 'The bathroom geyser stopped working since Tuesday morning.', status: 'Open', at: '2026-09-02 08:30', resolvedBy: null, resolution: null },
  { id: 'HC2', by: 'ST049', block: 'B', category: 'Housekeeping', title: '2nd floor corridor dustbins overflow', desc: 'Bins on the 2nd floor are not cleared after dinner.', status: 'In Progress', at: '2026-09-01 19:00', resolvedBy: null, resolution: null },
  { id: 'HC3', by: 'ST003', block: 'A', category: 'Mess', title: 'Request for evening milk for gym members', desc: 'Post-workout milk would help sports hostel residents.', status: 'Resolved', at: '2026-08-25 18:00', resolvedBy: 'WB1', resolution: 'Approved with mess committee — served from Sep 1.' },
  { id: 'HC4', by: 'ST052', block: 'B', category: 'Maintenance', title: 'Study room tube light flickering', desc: 'Second tube from the window flickers constantly.', status: 'Resolved', at: '2026-08-20 20:15', resolvedBy: 'WG1', resolution: 'Replaced by electrician on Aug 22.' }
];

/* ---------------- library ---------------- */
S.libraryBooks = [
  { acc: 'LB-001', title: 'Operating System Concepts (10th Ed.)', author: 'Silberschatz, Galvin, Gagne', subject: 'Operating Systems', dept: 'CSE', copies: 4, available: 2 },
  { acc: 'LB-002', title: 'Database System Concepts (7th Ed.)', author: 'Silberschatz, Korth, Sudarshan', subject: 'DBMS', dept: 'CSE', copies: 4, available: 1 },
  { acc: 'LB-003', title: 'Computer Networking: A Top-Down Approach (8th Ed.)', author: 'Kurose & Ross', subject: 'Networks', dept: 'CSE', copies: 3, available: 1 },
  { acc: 'LB-004', title: 'Introduction to Algorithms (4th Ed.)', author: 'Cormen et al.', subject: 'Algorithms', dept: 'CSE', copies: 3, available: 2 },
  { acc: 'LB-005', title: 'Artificial Intelligence: A Modern Approach (4th Ed.)', author: 'Russell & Norvig', subject: 'AI & ML', dept: 'CSE', copies: 2, available: 1 },
  { acc: 'LB-006', title: 'Clean Code', author: 'Robert C. Martin', subject: 'Software Craft', dept: 'CSE', copies: 2, available: 0 },
  { acc: 'LB-007', title: 'Head First Java (3rd Ed.)', author: 'Sierra & Bates', subject: 'Programming', dept: 'CSE', copies: 3, available: 3 },
  { acc: 'LB-008', title: 'Design Patterns (GoF)', author: 'Gamma et al.', subject: 'Software Design', dept: 'CSE', copies: 2, available: 1 },
  { acc: 'LB-009', title: 'Data Structures Using C', author: 'Tanenbaum', subject: 'Data Structures', dept: 'CSE', copies: 3, available: 2 },
  { acc: 'LB-010', title: 'Computer Organization and Architecture (11th Ed.)', author: 'Stallings', subject: 'COA', dept: 'CSE', copies: 2, available: 2 },
  { acc: 'LB-011', title: 'Discrete Mathematics and Its Applications (8th Ed.)', author: 'Kenneth Rosen', subject: 'Mathematics', dept: 'CSE', copies: 4, available: 3 },
  { acc: 'LB-012', title: 'Python Crash Course (3rd Ed.)', author: 'Eric Matthes', subject: 'Programming', dept: 'CSE', copies: 3, available: 1 },
  { acc: 'LB-013', title: 'Digital Signal Processing (4th Ed.)', author: 'Proakis & Manolakis', subject: 'DSP', dept: 'ECE', copies: 3, available: 1 },
  { acc: 'LB-014', title: 'Signals and Systems (2nd Ed.)', author: 'Oppenheim & Willsky', subject: 'Signals', dept: 'ECE', copies: 3, available: 2 },
  { acc: 'LB-015', title: 'CMOS VLSI Design (4th Ed.)', author: 'Weste & Harris', subject: 'VLSI', dept: 'ECE', copies: 2, available: 1 },
  { acc: 'LB-016', title: 'Microprocessor Architecture, Programming & Applications', author: 'Ramesh Gaonkar', subject: 'Microprocessors', dept: 'ECE', copies: 3, available: 2 },
  { acc: 'LB-017', title: 'Modern Digital and Analog Communication (5th Ed.)', author: 'Lathi & Ding', subject: 'Communication', dept: 'ECE', copies: 2, available: 2 },
  { acc: 'LB-018', title: 'Wireless Communications (2nd Ed.)', author: 'Molisch', subject: 'Wireless', dept: 'ECE', copies: 2, available: 1 },
  { acc: 'LB-019', title: 'Op-Amps and Linear Integrated Circuits', author: 'Ramakant Gayakwad', subject: 'Linear ICs', dept: 'ECE', copies: 3, available: 3 },
  { acc: 'LB-020', title: 'Optical Fiber Communications (5th Ed.)', author: 'Keiser', subject: 'Optical Comm.', dept: 'ECE', copies: 2, available: 2 },
  { acc: 'LB-021', title: 'Embedded Systems: Architecture & Design', author: 'Raj Kamal', subject: 'Embedded', dept: 'ECE', copies: 3, available: 2 },
  { acc: 'LB-022', title: 'Electromagnetic Waves & Radiating Systems', author: 'Jordan & Balmain', subject: 'EMF', dept: 'ECE', copies: 2, available: 1 },
  { acc: 'LB-023', title: 'Digital Electronics', author: 'Morris Mano', subject: 'Digital', dept: 'ECE', copies: 4, available: 2 },
  { acc: 'LB-024', title: 'Cracking the Coding Interview (6th Ed.)', author: 'Gayle McDowell', subject: 'Placement', dept: 'CSE', copies: 5, available: 1 },
  { acc: 'LB-025', title: 'Effective Public Speaking', author: 'Dale Carnegie', subject: 'Soft Skills', dept: 'GEN', copies: 3, available: 3 },
  { acc: 'LB-026', title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', subject: 'Biography', dept: 'GEN', copies: 4, available: 2 }
];
S.borrowRecords = [
  { id: 'BR1', acc: 'LB-003', studentId: 'ST001', out: '2026-08-25', due: '2026-09-10', returned: null, fine: 0, status: 'Active' },
  { id: 'BR2', acc: 'LB-006', studentId: 'ST001', out: '2026-08-18', due: '2026-09-02', returned: null, fine: 10, status: 'Overdue' },
  { id: 'BR3', acc: 'LB-013', studentId: 'ST049', out: '2026-08-29', due: '2026-09-12', returned: null, fine: 0, status: 'Active' },
  { id: 'BR4', acc: 'LB-001', studentId: 'ST002', out: '2026-08-30', due: '2026-09-13', returned: null, fine: 0, status: 'Active' },
  { id: 'BR5', acc: 'LB-005', studentId: 'ST004', out: '2026-08-20', due: '2026-09-03', returned: null, fine: 5, status: 'Overdue' },
  { id: 'BR6', acc: 'LB-024', studentId: 'ST055', out: '2026-08-15', due: '2026-08-29', returned: null, fine: 25, status: 'Overdue' },
  { id: 'BR7', acc: 'LB-011', studentId: 'ST009', out: '2026-08-22', due: '2026-09-05', returned: null, fine: 0, status: 'Active' },
  { id: 'BR8', acc: 'LB-019', studentId: 'ST052', out: '2026-08-10', due: '2026-08-24', returned: '2026-08-23', fine: 0, status: 'Returned' },
  { id: 'BR9', acc: 'LB-007', studentId: 'ST061', out: '2026-08-28', due: '2026-09-11', returned: null, fine: 0, status: 'Active' },
  { id: 'BR10', acc: 'LB-026', studentId: 'ST003', out: '2026-08-05', due: '2026-08-19', returned: '2026-08-19', fine: 0, status: 'Returned' },
  { id: 'BR11', acc: 'LB-016', studentId: 'ST070', out: '2026-08-27', due: '2026-09-10', returned: null, fine: 0, status: 'Active' },
  { id: 'BR12', acc: 'LB-002', studentId: 'ST058', out: '2026-08-21', due: '2026-09-04', returned: null, fine: 0, status: 'Active' }
];
S.ebooks = [
  { id: 'EB1', title: 'Operating Systems — Complete Notes', author: 'MDT Faculty Compilation', subject: 'CSE', size: '4.2 MB' },
  { id: 'EB2', title: 'DBMS — Normalisation Handbook', author: 'MDT Faculty Compilation', subject: 'CSE', size: '2.8 MB' },
  { id: 'EB3', title: 'Computer Networks — Routing Cheat Sheet', author: 'MDT Faculty Compilation', subject: 'CSE', size: '1.1 MB' },
  { id: 'EB4', title: 'Algorithms — Visual Guide', author: 'MDT Faculty Compilation', subject: 'CSE', size: '5.6 MB' },
  { id: 'EB5', title: 'AI & ML — Practical Labs', author: 'MDT Faculty Compilation', subject: 'CSE', size: '3.3 MB' },
  { id: 'EB6', title: 'Python for Engineers', author: 'MDT Faculty Compilation', subject: 'CSE', size: '6.0 MB' },
  { id: 'EB7', title: 'VLSI Design Workbook', author: 'MDT Faculty Compilation', subject: 'ECE', size: '4.4 MB' },
  { id: 'EB8', title: 'DSP — Solved Problems', author: 'MDT Faculty Compilation', subject: 'ECE', size: '3.9 MB' },
  { id: 'EB9', title: 'Embedded C Primer', author: 'MDT Faculty Compilation', subject: 'ECE', size: '2.2 MB' },
  { id: 'EB10', title: 'Communication Systems — Formulae', author: 'MDT Faculty Compilation', subject: 'ECE', size: '0.9 MB' },
  { id: 'EB11', title: 'Aptitude & Reasoning Prep', author: 'MDT Faculty Compilation', subject: 'GEN', size: '5.1 MB' },
  { id: 'EB12', title: 'Interview Readiness Playbook', author: 'MDT Faculty Compilation', subject: 'GEN', size: '1.7 MB' }
];

/* ---------------- mentor ---------------- */
S.mentorGroups = [];
var cseA12 = S.students.filter(function (s) { return s.classId === 'CSE-A'; }).slice(0, 12).map(function (s) { return s.id; });
S.mentorGroups.push({ id: 'MG1', mentorId: 'T01', classId: 'CSE-A', students: cseA12 });
S.mentorMeetings = [
  { id: 'MM1', groupId: 'MG1', date: '2026-07-14', agenda: 'Semester goal setting', notes: 'Discussed CGPA targets, electives and certification plans. Aarav to lead the symposium team.', attended: 11 },
  { id: 'MM2', groupId: 'MG1', date: '2026-07-28', agenda: 'Internal-1 preparation', notes: 'Shared study timetable. Vikram to coordinate doubt-clearing sessions before internals.', attended: 12 },
  { id: 'MM3', groupId: 'MG1', date: '2026-08-11', agenda: 'Career mapping & internships', notes: 'Explored internship tracks. Priya moved to ECE mentor group (dept policy) — replaced by Naveen.', attended: 10 },
  { id: 'MM4', groupId: 'MG1', date: '2026-08-25', agenda: 'Mid-semester wellness check', notes: 'Attendance reviewed; Deepak counselled on 75% requirement. Two mentees flagged for follow-up.', attended: 12 },
  { id: 'MM5', groupId: 'MG1', date: '2026-09-08', agenda: 'Pre-placement readiness review', notes: '', attended: 0 }
];
S.mentorRemarks = [
  { studentId: 'ST001', date: '2026-08-25', by: 'T01', remark: 'Consistent performer. Encourage paper presentations — strong analytical aptitude.' },
  { studentId: 'ST009', date: '2026-08-25', by: 'T01', remark: 'Attendance dipped after medical leave. Attendance recovery plan shared with advisor.' },
  { studentId: 'ST004', date: '2026-08-11', by: 'T01', remark: 'Excellent sports-college balance. Recommend sports scholarship nomination.' }
];

/* ---------------- e-learning materials ---------------- */
S.materials = [];
(function () {
  var M = {
    'CS503': [ ['Slides','Unit 3 — Network Layer & Routing','Slides covering IPv4 addressing, subnetting and routing algorithms.','T01'], ['Video','Subnetting worked examples','Walkthrough of 10 practice problems with CIDR blocks.','T01'], ['Worksheet','Wireshark lab — TCP handshake','Capture and analyse the three-way handshake on campus network.','T01'], ['PDF','Previous year question bank','Solved university papers 2022–2025.','T01'] ],
    'CS501': [ ['Slides','Unit 2 — Synchronisation & Deadlocks','Classic problems: producer-consumer, readers-writers, bankers algorithm.','T01'], ['PDF','Lab manual — Shell scripting','Twelve graded exercises for the OS lab.','T01'] ],
    'CS502': [ ['Slides','Normalisation — 1NF to BCNF','Step-by-step decomposition examples with functional dependency diagrams.','T02'], ['Video','ER modelling live session','Recorded live class on university ER modelling case study.','T02'], ['PDF','SQL practice set','50 queries with expected outputs.','T02'] ],
    'CS504': [ ['Slides','Dynamic programming patterns','Knapsack, LCS, matrix chain with complexity tables.','T03'], ['Worksheet','Greedy vs DP — 20 problems','Classify and justify the approach for each problem.','T03'] ],
    'CS505': [ ['Slides','Neural network fundamentals','Perceptron to MLP with backpropagation derivation.','T02'], ['Notebook','Colab — sklearn exercises','Hands-on classification pipeline walkthrough.','T02'] ],
    'CS506': [ ['PDF','Interview Q&A booklet','Curated 120 HR & technical interview questions.','T04'] ]
  };
  var seqm = 0;
  S.courseAllocations.forEach(function (al) {
    var items = (al.classId === 'CSE-A') ? (M[al.courseId] || []) : (M[al.courseId] || []).slice(0, 1);
    items.forEach(function (it) {
      seqm++;
      S.materials.push({ id: 'MT' + pad(seqm, 3), courseId: al.courseId, classId: al.classId, type: it[0], title: it[1], desc: it[2], postedBy: it[3], postedAt: '2026-08-' + pad(ri(1, 28), 2) });
    });
  });
})();

/* ---------------- circulars / news / calendar ---------------- */
S.circulars = [
  { id: 'CIR1', title: 'Internal Assessment II — Timetable released', body: 'Internal Assessment II will be held from 5–7 October 2026. The detailed timetable is available in the academic calendar. Hall tickets must be carried for all examinations.', audience: 'Students', urgent: false, by: 'AD1', at: '2026-09-01' },
  { id: 'CIR2', title: 'Model examination fee — last date 10 October', body: 'Students are informed that the model examination fee of ₹1,500 must be settled on or before 10 October 2026 to receive hall tickets without penalty.', audience: 'Students', urgent: true, by: 'OF1', at: '2026-09-02' },
  { id: 'CIR3', title: 'Library hours extended during examination season', body: 'The central library will remain open from 8:00 AM to 9:00 PM on all working days from 20 September until the end of the semester examinations.', audience: 'All', urgent: false, by: 'OF2', at: '2026-08-28' },
  { id: 'CIR4', title: 'Blood donation camp — 18 September', body: 'The NSS unit in association with Government Hospital Coimbatore organises a blood donation camp in the main auditorium. Volunteers may register with the NSS coordinator.', audience: 'All', urgent: false, by: 'PR1', at: '2026-09-01' },
  { id: 'CIR5', title: 'Scholarship document verification drive', body: 'Students who applied for government and merit scholarships must submit original documents at the office on 12 September between 10 AM and 3 PM.', audience: 'Students', urgent: true, by: 'OF1', at: '2026-09-03' },
  { id: 'CIR6', title: 'Faculty — semester course plan review meeting', body: 'All faculty members are requested to update their course plan progress on the portal before the review meeting scheduled on 11 September at 2 PM in the board room.', audience: 'Staff', urgent: false, by: 'AD1', at: '2026-08-30' }
];
S.flashNews = [
  'Model exam fee ₹1,500 — pay before 10 Oct to avoid hall-ticket hold.',
  'Yuva Tech \u201926 paper presentations — registrations close 6 Sep.',
  'Overnight hostel outings require prior Academic Director approval.',
  'Career readiness bootcamp for pre-final years — Saturday, 12 Sep.',
  'Library open till 9 PM from 20 Sep for exam preparation.'
];
S.calendarEvents = [
  { id: 'EV1', date: '2026-09-05', title: 'Last date: assignment submissions (A2)', type: 'Academic', audience: 'Students' },
  { id: 'EV2', date: '2026-09-06', title: 'Clubs & chapters — enrolment closes', type: 'Event', audience: 'Students' },
  { id: 'EV3', date: '2026-09-07', title: 'Inter-Zone Athletics — Anna Stadium', type: 'Event', audience: 'All' },
  { id: 'EV4', date: '2026-09-08', title: 'Mentor meeting — pre-placement readiness', type: 'Academic', audience: 'CSE-A' },
  { id: 'EV5', date: '2026-09-09', title: 'Yuva Tech \u201926 Symposium @ PSG Tech', type: 'Event', audience: 'All' },
  { id: 'EV6', date: '2026-09-10', title: 'Mess fee — last date', type: 'Fee', audience: 'Hostellers' },
  { id: 'EV7', date: '2026-09-12', title: 'Blood donation camp', type: 'Event', audience: 'All' },
  { id: 'EV8', date: '2026-09-12', title: 'Career readiness bootcamp', type: 'Academic', audience: 'Students' },
  { id: 'EV9', date: '2026-09-18', title: 'Quiz 2 window opens', type: 'Academic', audience: 'Students' },
  { id: 'EV10', date: '2026-09-20', title: 'Library extended hours begin', type: 'Academic', audience: 'All' },
  { id: 'EV11', date: '2026-10-05', title: 'Internal Assessment II begins', type: 'Exam', audience: 'Students' },
  { id: 'EV12', date: '2026-10-10', title: 'Model exam fee — last date', type: 'Fee', audience: 'Students' },
  { id: 'EV13', date: '2026-10-18', title: 'Ayudha Poojai — holiday', type: 'Holiday', audience: 'All' },
  { id: 'EV14', date: '2026-11-02', title: 'Model examination begins', type: 'Exam', audience: 'Students' },
  { id: 'EV15', date: '2026-11-08', title: 'Deepavali — holiday', type: 'Holiday', audience: 'All' },
  { id: 'EV16', date: '2026-11-16', title: 'End-semester examination begins', type: 'Exam', audience: 'Students' },
  { id: 'EV17', date: '2026-09-11', title: 'Faculty course-plan review meeting', type: 'Academic', audience: 'Staff' }
];

/* ---------------- placement ---------------- */
S.placementDrives = [
  { id: 'PD1', company: 'TCS Digital', role: 'Digital Software Developer', ctc: '₹7.0 LPA', location: 'Chennai / Bengaluru', date: '2026-09-24', regBy: '2026-09-15', eligibility: 'CGPA ≥ 8.0 · No standing arrears', status: 'Open', by: 'OF3', applied: 0 },
  { id: 'PD2', company: 'Infosys Springboard', role: 'Systems Engineer', ctc: '₹4.50 LPA', location: 'Mysuru / Pune', date: '2026-10-08', regBy: '2026-09-30', eligibility: 'CGPA ≥ 7.0', status: 'Open', by: 'OF3', applied: 0 },
  { id: 'PD3', company: 'Zoho Corporation', role: 'Member Technical Staff', ctc: '₹9.0 LPA', location: 'Chennai', date: '2026-10-22', regBy: '2026-10-10', eligibility: 'CGPA ≥ 7.5 · Strong problem solving', status: 'Open', by: 'OF3', applied: 0 },
  { id: 'PD4', company: 'Freshworks', role: 'Software Engineer — Campus', ctc: '₹8.0 LPA', location: 'Chennai', date: '2026-11-05', regBy: '2026-10-24', eligibility: 'CGPA ≥ 8.0 · Full-stack portfolio', status: 'Open', by: 'OF3', applied: 0 }
];
S.placementApps = [
  { id: 'PA1', driveId: 'PD1', studentId: 'ST001', status: 'Applied', at: '2026-09-02', rounds: 'Awaiting shortlist', offer: null },
  { id: 'PA2', driveId: 'PD1', studentId: 'ST004', status: 'Shortlisted', at: '2026-09-01', rounds: 'Cleared aptitude — awaiting tech round', offer: null },
  { id: 'PA3', driveId: 'PD2', studentId: 'ST002', status: 'Applied', at: '2026-09-03', rounds: '—', offer: null },
  { id: 'PA4', driveId: 'PD1', studentId: 'ST055', status: 'Offered', at: '2026-09-01', rounds: 'Aptitude + Tech + HR cleared', offer: '₹7.0 LPA — joining June 2027' },
  { id: 'PA5', driveId: 'PD1', studentId: 'ST070', status: 'Not Selected', at: '2026-09-01', rounds: 'Rejected at tech round', offer: null },
  { id: 'PA6', driveId: 'PD3', studentId: 'ST004', status: 'Applied', at: '2026-09-03', rounds: '—', offer: null }
];
S.placementStats = { batch: '2025 (graduated)', graduates: 186, eligible: 171, placed: 157, percentage: 92, highest: '₹12.5 LPA', average: '₹5.4 LPA', companies: 28, top: 'Amazon, Zoho, Cognizant, TCS, Bosch' };

/* ---------------- scholarships ---------------- */
S.scholarshipSchemes = [
  { id: 'SC1', name: 'Merit Scholarship (Top 10% of class)', amount: 25000, criteria: 'CGPA ≥ 8.5 with no arrears', by: 'Institution' },
  { id: 'SC2', name: 'Government First Graduate Scholarship', amount: 15000, criteria: 'First graduate in family — certificate required', by: 'Government' },
  { id: 'SC3', name: 'Sports Excellence Scholarship', amount: 10000, criteria: 'State/national level participation', by: 'Institution' },
  { id: 'SC4', name: 'Minority Community Scholarship', amount: 20000, criteria: 'Community certificate + income proof', by: 'Government' }
];
S.scholarshipApps = [
  { id: 'SA1', studentId: 'ST049', schemeId: 'SC1', appliedAt: '2026-08-20', docs: ['bonafide.pdf','marksheet-sem4.pdf'], status: 'Verified', verifiedBy: 'OF1', approvedBy: null,
    timeline: [ { s: 'Applied', at: '2026-08-20', by: 'ST049' }, { s: 'Documents verified by Office', at: '2026-08-27', by: 'OF1', note: 'Academic records in order.' }, { s: 'Principal Approval', at: null, by: 'PR1' } ] },
  { id: 'SA2', studentId: 'ST001', schemeId: 'SC2', appliedAt: '2026-09-03', docs: ['first-graduate-cert.pdf'], status: 'Applied', verifiedBy: null, approvedBy: null,
    timeline: [ { s: 'Applied', at: '2026-09-03', by: 'ST001' }, { s: 'Office Verification', at: null, by: 'OF1' } ] },
  { id: 'SA3', studentId: 'ST070', schemeId: 'SC4', appliedAt: '2026-08-10', docs: ['community-cert.pdf','income-cert.pdf'], status: 'Approved', verifiedBy: 'OF1', approvedBy: 'PR1',
    timeline: [ { s: 'Applied', at: '2026-08-10', by: 'ST070' }, { s: 'Documents verified by Office', at: '2026-08-15', by: 'OF1' }, { s: 'Approved by Principal', at: '2026-08-22', by: 'PR1', note: 'Disbursed with semester fee account.' } ] },
  { id: 'SA4', studentId: 'ST011', schemeId: 'SC1', appliedAt: '2026-08-18', docs: ['marksheet-sem4.pdf'], status: 'Rejected', verifiedBy: 'OF1', approvedBy: 'PR1',
    timeline: [ { s: 'Applied', at: '2026-08-18', by: 'ST011' }, { s: 'Documents verified by Office', at: '2026-08-24', by: 'OF1' }, { s: 'Rejected by Principal', at: '2026-08-29', by: 'PR1', note: 'CGPA below cut-off for merit bracket (7.9 vs 8.5).' } ] }
];

/* ---------------- tickets (v5: tracking timeline · expected resolution · attachments · rating) ---------------- */
S.tickets = [
  { id: 'TK1', no: 'TK-101', by: 'U-ST005', category: 'IT & Access', title: 'Unable to download e-resources off campus', desc: 'Ebook links open an error page when I am on mobile data. Works fine on the campus network.', priority: 'Medium', status: 'Open', at: '2026-09-03 10:20', eta: '2026-09-07', assignee: null,
    files: [ { name: 'ebook-error-screenshot.png', size: 148520, type: 'image/png', data: null }, { name: 'error-log.txt', size: 2431, type: 'text/plain', data: null } ],
    thread: [ { by: 'U-ST005', at: '2026-09-03 10:20', text: 'Facing this since yesterday evening.' } ],
    timeline: [ { s: 'Opened', at: '2026-09-03 10:20', by: 'U-ST005', note: '2 attachment(s) included' } ] },
  { id: 'TK2', no: 'TK-102', by: 'U-ST001', category: 'Library', title: 'Renewal not reflecting for LB-006', desc: 'I renewed the book online but the due date still shows 2 Sep.', priority: 'Low', status: 'Closed', at: '2026-08-30 09:00', eta: '2026-09-04', resolvedBy: 'U-OF2', resolvedAt: '2026-08-31 08:45',
    rating: { stars: 5, remark: 'Quick and clear reply — thank you!', at: '2026-08-31 09:10' }, files: [],
    thread: [ { by: 'U-OF2', at: '2026-08-30 11:30', text: 'The renewal was logged after the due date — a fine of ₹10 applies. Cleared the record, kindly settle at the counter.' }, { by: 'U-ST001', at: '2026-08-31 08:45', text: 'Understood, paid at the counter. Thank you!' } ],
    timeline: [ { s: 'Opened', at: '2026-08-30 09:00', by: 'U-ST001' }, { s: 'Assigned', at: '2026-08-30 10:05', by: 'U-OF1', note: 'Handled by Sundaram P' }, { s: 'Resolved', at: '2026-08-30 11:30', by: 'U-OF2', note: 'Fine cleared, record corrected.' }, { s: 'Rated 5/5', at: '2026-08-31 09:10', by: 'U-ST001', note: 'Quick and clear reply — thank you!' }, { s: 'Closed', at: '2026-08-31 09:12', by: 'U-ST001', note: 'Resolution confirmed by the student' } ] },
  { id: 'TK3', no: 'TK-103', by: 'U-ST049', category: 'Hostel', title: 'Girls block — hot water timing request', desc: 'Requesting an earlier hot water window during period days. Currently 6:30–7:30 AM only.', priority: 'Medium', status: 'In Progress', at: '2026-09-02 18:40', eta: '2026-09-06', assignee: 'U-WG1', files: [],
    thread: [ { by: 'U-WG1', at: '2026-09-03 09:15', text: 'Taken up with the warden matron — extended window 5:45–7:30 AM from Monday.' } ],
    timeline: [ { s: 'Opened', at: '2026-09-02 18:40', by: 'U-ST049' }, { s: 'Assigned', at: '2026-09-02 19:05', by: 'U-OF1', note: 'Handled by Lakshmi Narayanan (Girls Block warden)' }, { s: 'In Progress', at: '2026-09-03 09:15', by: 'U-WG1', note: 'Coordinating with the hostel maintenance team.' } ] },
  { id: 'TK4', no: 'TK-104', by: 'U-ST060', category: 'Fees', title: 'Receipt shows wrong head for tuition payment', desc: 'My August tuition payment is recorded under exam fee head.', priority: 'High', status: 'In Progress', at: '2026-09-04 09:05', eta: '2026-09-08', assignee: 'U-OF1',
    files: [ { name: 'august-receipt.pdf', size: 86210, type: 'application/pdf', data: null } ],
    thread: [ { by: 'U-OF1', at: '2026-09-04 09:40', text: 'Verified — the head will be corrected today and a fresh receipt issued to your downloads.' } ],
    timeline: [ { s: 'Opened', at: '2026-09-04 09:05', by: 'U-ST060', note: '1 attachment(s) included' }, { s: 'Assigned', at: '2026-09-04 09:25', by: 'U-OF1', note: 'Handled by Devi Raj' }, { s: 'In Progress', at: '2026-09-04 09:40', by: 'U-OF1' } ] },
  { id: 'TK5', no: 'TK-105', by: 'U-ST002', category: 'Examination', title: 'Internal-2 hall ticket missing one subject', desc: 'The hall ticket generated for CSE-B lists only five subjects — CS506 is missing.', priority: 'Critical', status: 'Open', at: '2026-09-04 11:30', eta: '2026-09-05', assignee: null, files: [],
    thread: [], timeline: [ { s: 'Opened', at: '2026-09-04 11:30', by: 'U-ST002' } ] },
  { id: 'TK6', no: 'TK-106', by: 'U-ST003', category: 'Other', title: 'Requesting bonafide for train pass', desc: 'Need a bonafide certificate for the monthly student train pass renewal.', priority: 'Low', status: 'Resolved', at: '2026-08-20 14:00', eta: '2026-08-25', resolvedBy: 'U-OF1', resolvedAt: '2026-08-21 10:00',
    rating: { stars: 4, remark: 'Collected the same day.', at: '2026-08-21 15:40' }, files: [],
    thread: [ { by: 'U-OF1', at: '2026-08-21 10:00', text: 'Certificate issued — collect from the office counter (ref MDT/BON/2026/0188).' } ],
    timeline: [ { s: 'Opened', at: '2026-08-20 14:00', by: 'U-ST003' }, { s: 'Resolved', at: '2026-08-21 10:00', by: 'U-OF1', note: 'Certificate issued (ref MDT/BON/2026/0188).' }, { s: 'Rated 4/5', at: '2026-08-21 15:40', by: 'U-ST003', note: 'Collected the same day.' } ] }
];

/* ---------------- notifications & activity ---------------- */
S.notifications = [
  { id: 'N1', at: '2026-09-04 09:35', aud: 'uid:ST001', title: 'OD request received', body: 'Your on-duty request for Yuva Tech \u201926 (9 Sep, FN) is with your class advisor.', link: 'od.html', read: false, tone: 'blue' },
  { id: 'N2', at: '2026-09-04 08:00', aud: 'uid:ST001', title: 'Assignment due tomorrow', body: 'CS503 — Mini Project proposal closes 5 Sep, 11:59 PM.', link: 'assignments.html', read: false, tone: 'yellow' },
  { id: 'N3', at: '2026-09-03 16:10', aud: 'uid:ST001', title: 'Library overdue reminder', body: 'Clean Code (LB-006) crossed its due date — fine accruing ₹5/day.', link: 'library.html', read: true, tone: 'red' },
  { id: 'N4', at: '2026-09-04 09:00', aud: 'role:teacher', title: 'OD awaiting your recommendation', body: 'Aarav Menon (24CS001) submitted an OD request for 9 Sep.', link: 'advisor-requests.html', read: false, tone: 'yellow' },
  { id: 'N5', at: '2026-09-04 07:45', aud: 'role:teacher', title: 'Attendance below threshold', body: 'Deepak (CSE-A) attendance is at 71% — below the 75% requirement.', link: 'advisor-class.html', read: true, tone: 'red' },
  { id: 'N6', at: '2026-09-03 15:20', aud: 'role:academic', title: 'OD awaiting approval', body: 'Vikram (CSE-A) — Inter-Zone Athletics, recommended by advisor.', link: 'od.html', read: false, tone: 'yellow' },
  { id: 'N7', at: '2026-09-03 18:00', aud: 'role:academic', title: 'Overnight outing requires approval', body: 'Priya Krishnan (ECE-A) — night outing 6–7 Sep, pending warden review.', link: 'outing.html', read: false, tone: 'yellow' },
  { id: 'N8', at: '2026-09-04 10:05', aud: 'role:principal', title: 'Scholarship awaiting your approval', body: 'Merit scholarship — Priya Krishnan, verified by office.', link: 'approvals.html', read: false, tone: 'yellow' },
  { id: 'N9', at: '2026-09-04 10:10', aud: 'role:principal', title: 'Long leave countersignature pending', body: 'Ananya (CSE-A) — 6-day casual leave, approved by AD.', link: 'approvals.html', read: false, tone: 'yellow' },
  { id: 'N10', at: '2026-09-04 09:40', aud: 'role:warden', title: 'New outing request', body: 'Aarav Menon (Block A) — day outing 5 Sep, 9 AM–6 PM.', link: 'outings.html', read: false, tone: 'blue' },
  { id: 'N11', at: '2026-09-03 20:30', aud: 'role:warden', title: 'Night outing pending', body: 'Priya Krishnan (Block B) — overnight outing with AD approval chain.', link: 'outings.html', read: true, tone: 'yellow' },
  { id: 'N12', at: '2026-09-04 09:15', aud: 'role:office', title: 'Certificate requests pending', body: '2 bonafide/transcript requests in the office queue.', link: 'certificates.html', read: false, tone: 'blue' },
  { id: 'N13', at: '2026-09-04 09:20', aud: 'role:office', title: 'Critical ticket open', body: 'TK-105 — Internal-2 hall ticket missing subject (CSE-B).', link: 'tickets.html', read: false, tone: 'red' },
  { id: 'N14', at: '2026-09-04 08:30', aud: 'role:admin', title: '3 tickets open across categories', body: 'IT, Fees and Examination queues need triage.', link: 'tickets.html', read: false, tone: 'yellow' },
  { id: 'N15', at: '2026-09-02 12:00', aud: 'all', title: 'Scholarship verification drive — 12 Sep', body: 'Original documents at the office, 10 AM–3 PM.', link: 'calendar.html', read: true, tone: 'green' }
];
S.activity = [
  { id: 'A1', at: '2026-09-04 09:35', actor: 'ST001', action: 'Submitted OD request', detail: 'Yuva Tech \u201926 — 9 Sep FN' },
  { id: 'A2', at: '2026-09-04 09:30', actor: 'OF1', action: 'Published circular', detail: 'Scholarship document verification drive' },
  { id: 'A3', at: '2026-09-03 21:40', actor: 'ST049', action: 'Applied for scholarship', detail: 'Merit Scholarship (Top 10%) — documents attached' },
  { id: 'A4', at: '2026-09-03 18:20', actor: 'T01', action: 'Updated course plan', detail: 'CS503 Unit 3 → In Progress (CSE-A)' },
  { id: 'A5', at: '2026-09-03 16:10', actor: 'OF2', action: 'Issued ebook access', detail: 'Communication Systems — Formulae (ECE)' },
  { id: 'A6', at: '2026-09-03 12:05', actor: 'AD1', action: 'Assigned course allocation', detail: 'CS505 → T10 (CSE-B), 4 periods/week' },
  { id: 'A7', at: '2026-09-02 14:20', actor: 'T01', action: 'Recommended OD request', detail: 'OD2 — Vikram, athletics' },
  { id: 'A8', at: '2026-09-02 11:40', actor: 'ST049', action: 'Submitted outing request', detail: 'Night outing 6–7 Sep' },
  { id: 'A9', at: '2026-09-01 09:00', actor: 'OF1', action: 'Published hall tickets', detail: 'Internal Assessment II — CSE-B' },
  { id: 'A10', at: '2026-08-31 15:45', actor: 'WG1', action: 'Resolved hostel complaint', detail: 'Study room lighting (Block B)' },
  { id: 'A11', at: '2026-08-29 10:15', actor: 'PR1', action: 'Scholarship decision', detail: 'SA4 rejected — below merit cut-off' },
  { id: 'A12', at: '2026-08-27 09:30', actor: 'OF1', action: 'Fee collection', detail: 'RCP-26142 — ₹18,000 (mess)' }
];

S.photos = {};
if (typeof module !== 'undefined' && module.exports) module.exports = S;
})(typeof window !== 'undefined' ? window : globalThis);
