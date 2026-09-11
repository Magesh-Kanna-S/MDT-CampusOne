/* My Desktop Tech — CampusOne · Reference dataset (deterministic seed) */
(function (g) {
'use strict';
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
var R = mulberry32(0x4D445432);
function ri(a,b){return a+Math.floor(R()*(b-a+1));}
function pick(arr){return arr[Math.floor(R()*arr.length)];}
function pad(n,l){n=String(n);while(n.length<l)n='0'+n;return n;}
function d(s){return s;} /* dates as ISO strings */

var TODAY = '2026-09-04'; /* demo anchor — Friday */

/* ---------------- static reference ---------------- */
var S = {};
S.meta = { today: TODAY, version: 2, seededAt: '2026-09-01T08:00:00', year: '2026–27', term: 'Odd Semester' };

S.settings = {
  institute: 'MDT Institute of Technology',
  short: 'MDT',
  portal: 'CampusOne',
  org: 'My Desktop Tech',
  city: 'Coimbatore', state: 'Tamil Nadu',
  email: 'office@mdt.ac.in', phone: '+91 422 456 7800',
  academicYear: '2026–2027', currentSem: 'V (Odd)',
  principal: 'PR1', academicDirector: 'AD1',
  wf: { odNeedsAD: true, outingOvernightNeedsAD: true, longLeaveDays: 5, attMin: 75, feeGrace: 2000, hallTicketBlock: true },
  /* v6: external data-source placeholders — maintained by the administrator.
     Paste the real Google Sheets channel endpoint / key and the Drive storage
     key in Admin → Settings; every page's background source follows live. */
  integrations: {
    gsheet: { url: '', key: '', sheetId: '' },   /* Google Sheets data grid (one sheet = one table) */
    drive:  { key: '', folder: '' },             /* Google Drive file storage (portal photos & uploads) */
    updatedBy: null, updatedAt: null
  }
};

S.departments = [
  { id: 'CSE', name: 'Computer Science & Engineering', hod: 'AD1' },
  { id: 'ECE', name: 'Electronics & Communication Engineering', hod: 'T05' }
];

S.classes = [
  { id: 'CSE-A', dept: 'CSE', sem: 5, batch: '2024–2028', advisor: 'T01', room: 'B-204', strength: 24 },
  { id: 'CSE-B', dept: 'CSE', sem: 5, batch: '2024–2028', advisor: 'T09', room: 'B-206', strength: 24 },
  { id: 'ECE-A', dept: 'ECE', sem: 5, batch: '2024–2028', advisor: 'T05', room: 'C-102', strength: 24 },
  { id: 'ECE-B', dept: 'ECE', sem: 5, batch: '2024–2028', advisor: 'T07', room: 'C-104', strength: 24 },
  { id: 'CSE-C', dept: 'CSE', sem: 3, batch: '2025–2029', advisor: 'T04', room: 'A-101', strength: 24 },
  { id: 'ECE-C', dept: 'ECE', sem: 3, batch: '2025–2029', advisor: 'T08', room: 'C-201', strength: 24 }
];

/* staff — teachers + leadership + wardens + office + admin */
S.staff = [
  { id:'T01', name:'Karthikeyan R', gender:'M', dept:'CSE', designation:'Professor', email:'karthikeyan@mdt.ac.in', phone:'+91 98430 11001', role:'teacher', advisorClass:'CSE-A', expertise:'Computer Networks, Operating Systems', exp:14, photo:null },
  { id:'T02', name:'Anitha S', gender:'F', dept:'CSE', designation:'Associate Professor', email:'anitha@mdt.ac.in', phone:'+91 98430 11002', role:'teacher', advisorClass:null, expertise:'DBMS, AI & ML', exp:11, photo:null },
  { id:'T03', name:'Vijay Prakash', gender:'M', dept:'CSE', designation:'Assistant Professor', email:'vijayp@mdt.ac.in', phone:'+91 98430 11003', role:'teacher', advisorClass:null, expertise:'Algorithms, OOPJ', exp:6, photo:null },
  { id:'T04', name:'Ramya Krishnan', gender:'F', dept:'CSE', designation:'Assistant Professor', email:'ramya@mdt.ac.in', phone:'+91 98430 11004', role:'teacher', advisorClass:'CSE-C', expertise:'Data Structures, Soft Skills', exp:5, photo:null },
  { id:'T05', name:'Surya Moorthy', gender:'M', dept:'ECE', designation:'Professor', email:'surya@mdt.ac.in', phone:'+91 98430 11005', role:'teacher', advisorClass:'ECE-A', expertise:'VLSI, Wireless Comm.', exp:16, photo:null },
  { id:'T06', name:'Divya Bharathi', gender:'F', dept:'ECE', designation:'Associate Professor', email:'divya@mdt.ac.in', phone:'+91 98430 11006', role:'teacher', advisorClass:null, expertise:'DSP, Linear ICs', exp:10, photo:null },
  { id:'T07', name:'Prakash Raj', gender:'M', dept:'ECE', designation:'Assistant Professor', email:'prakashraj@mdt.ac.in', phone:'+91 98430 11007', role:'teacher', advisorClass:'ECE-B', expertise:'Embedded Systems', exp:7, photo:null },
  { id:'T08', name:'Harini V', gender:'F', dept:'ECE', designation:'Assistant Professor', email:'harini@mdt.ac.in', phone:'+91 98430 11008', role:'teacher', advisorClass:'ECE-C', expertise:'Digital Electronics, Signals', exp:5, photo:null },
  { id:'T09', name:'Gopal Krishnan', gender:'M', dept:'CSE', designation:'Professor', email:'gopal@mdt.ac.in', phone:'+91 98430 11009', role:'teacher', advisorClass:'CSE-B', expertise:'Operating Systems, COA', exp:15, photo:null },
  { id:'T10', name:'Mohanraj K', gender:'M', dept:'CSE', designation:'Assistant Professor', email:'mohanraj@mdt.ac.in', phone:'+91 98430 11010', role:'teacher', advisorClass:null, expertise:'AI & ML, Python', exp:4, photo:null },
  { id:'T11', name:'Bhuvaneswari R', gender:'F', dept:'ECE', designation:'Associate Professor', email:'bhuvana@mdt.ac.in', phone:'+91 98430 11011', role:'teacher', advisorClass:null, expertise:'DSP, EMF', exp:9, photo:null },
  { id:'T12', name:'Arun Kumar S', gender:'M', dept:'ECE', designation:'Assistant Professor', email:'arunkumar@mdt.ac.in', phone:'+91 98430 11012', role:'teacher', advisorClass:null, expertise:'Embedded, Networks', exp:6, photo:null },
  { id:'T13', name:'Sadhana M', gender:'F', dept:'CSE', designation:'Assistant Professor', email:'sadhana@mdt.ac.in', phone:'+91 98430 11013', role:'teacher', advisorClass:null, expertise:'Discrete Maths', exp:8, photo:null },
  { id:'AD1', name:'Dr. Meera Krishnan', gender:'F', dept:'CSE', designation:'Academic Director & HoD — CSE', email:'meera@mdt.ac.in', phone:'+91 98430 11020', role:'academic', advisorClass:null, expertise:'Academics, Curriculum', exp:18, photo:null },
  { id:'PR1', name:'Dr. Suresh Chandran', gender:'M', dept:'GEN', designation:'Principal', email:'principal@mdt.ac.in', phone:'+91 98430 11021', role:'principal', advisorClass:null, expertise:'Institutional Leadership', exp:24, photo:null },
  { id:'WB1', name:'Ravi Shankar B', gender:'M', dept:'GEN', designation:'Hostel Warden — Boys Block A', email:'warden.boys@mdt.ac.in', phone:'+91 98430 11031', role:'warden', block:'A', blockName:'Block A (Boys)', genderLock:'M', advisorClass:null, expertise:'Hostel Administration', exp:12, photo:null },
  { id:'WG1', name:'Lakshmi Narayanan', gender:'F', dept:'GEN', designation:'Hostel Warden — Girls Block B', email:'warden.girls@mdt.ac.in', phone:'+91 98430 11032', role:'warden', block:'B', blockName:'Block B (Girls)', genderLock:'F', advisorClass:null, expertise:'Hostel Administration', exp:14, photo:null },
  { id:'OF1', name:'Devi Raj', gender:'F', dept:'GEN', designation:'Office Administrator', email:'office@mdt.ac.in', phone:'+91 98430 11040', role:'office', advisorClass:null, expertise:'Records, Fees, Certificates', exp:15, photo:null },
  /* v8: the Chief Librarian and the Training & Placement Officer now run
     their own dedicated staff portals (role 'library' / 'placement') — their
     office memberships simply became full profiles, nothing was removed. */
  { id:'OF2', name:'Sundaram P', gender:'M', dept:'GEN', designation:'Chief Librarian — Knowledge Resource Centre', email:'library@mdt.ac.in', phone:'+91 98430 11041', role:'library', advisorClass:null, expertise:'Library & e-Resources', exp:17, photo:null },
  { id:'LB2', name:'Meenakshi Sundaresan', gender:'F', dept:'GEN', designation:'Assistant Librarian — Circulation & e-Resources', email:'library.desk@mdt.ac.in', phone:'+91 98430 11043', role:'library', advisorClass:null, expertise:'Cataloguing, Reference Service', exp:8, photo:null },
  { id:'OF3', name:'Balaji R', gender:'M', dept:'GEN', designation:'Training & Placement Officer', email:'placement@mdt.ac.in', phone:'+91 98430 11042', role:'placement', advisorClass:null, expertise:'Corporate Relations', exp:11, photo:null },
  { id:'EX1', name:'Dr. Nirmala Raghavan', gender:'F', dept:'GEN', designation:'Controller of Examinations', email:'coe@mdt.ac.in', phone:'+91 98430 11044', role:'examcell', advisorClass:null, expertise:'Examinations & Valuation', exp:15, photo:null },
  { id:'AC1', name:'Gomathi Priya', gender:'F', dept:'GEN', designation:'Senior Accounts Officer', email:'accounts@mdt.ac.in', phone:'+91 98430 11045', role:'accounts', advisorClass:null, expertise:'Finance, Payroll & Audit', exp:13, photo:null },
  { id:'IQ1', name:'Dr. Vasanthi Priyadharshini', gender:'F', dept:'GEN', designation:'IQAC & Accreditation Director', email:'iqac@mdt.ac.in', phone:'+91 98430 11046', role:'iqac', advisorClass:null, expertise:'Quality Assurance, CO-PO, NAAC', exp:16, photo:null },
  { id:'SYS1', name:'Arjun M', gender:'M', dept:'GEN', designation:'System Administrator', email:'sysadmin@mdt.ac.in', phone:'+91 98430 11050', role:'admin', advisorClass:null, expertise:'Platform & Access', exp:9, photo:null }
];

/* ---------------- students ---------------- */
var MALE = ['Aarav','Karthik','Vikram','Sanjay','Deepak','Hariharan','Arun','Praveen','Naveen','Rahul','Surya','Vishnu','Manoj','Bala','Dinesh','Gokul','Harish','Ilango','Kishore','Lokesh','Madhavan','Nithish','Yogesh','Aditya'];
var FEMALE = ['Priya','Divya','Kavya','Sneha','Revathi','Nandhini','Swathi','Harini','Yamuna','Deepa','Gayathri','Ishwarya','Janani','Keerthana','Malini','Nivetha','Oviya','Pavithra','Ramya','Shalini','Tharani','Uma','Vidhya','Yazhini'];
var LAST = ['Menon','Sharma','Iyer','Nair','Krishnan','Subramani','Rajan','Palanisamy','Selvam','Kumar','Rao','Reddy','Prakash','Chandran','Vijay','Sundar','Babu','Murugan','Pillai','Gopal','Raman','Sekar'];
var BLOOD = ['A+','B+','O+','AB+','A-','B-','O-'];
var COMM = ['BC','MBC','OC','SC','ST'];
var RELIGION = ['Hindu','Christian','Islam'];
var CITY = ['Coimbatore','Pollachi','Tirupur','Erode','Salem','Madurai','Chennai','Palakkad'];
var CLASSES_ORDER = ['CSE-A','CSE-B','ECE-A','ECE-B','CSE-C','ECE-C'];
var BLOOD_POOL = BLOOD.concat(['A+','B+','O+','O+']);

S.students = [];
var seq = 0, emailSeen = {};
CLASSES_ORDER.forEach(function (cid, ci) {
  var cls = S.classes[ci];
  var deptCode = cls.dept === 'CSE' ? 'CS' : 'EC';
  var yr = cls.sem >= 5 ? '24' : '25';
  var maleN = ci % 2 === 0 ? 14 : 13;
  for (var i = 0; i < 24; i++) {
    seq++;
    var isF = i >= maleN;
    var name;
    if (ci === 0 && i === 0) name = 'Aarav Menon';
    else if (ci === 2 && i === 0) name = 'Priya Krishnan';
    else {
      var first = isF ? FEMALE[(seq * 7 + i) % FEMALE.length] : MALE[(seq * 5 + i * 3) % MALE.length];
      name = first + ' ' + LAST[(seq * 3 + i) % LAST.length];
    }
    var reg = yr + deptCode + pad(i + 1, 3);
    var cg = +(7.2 + R() * 2.2).toFixed(2);
    if (ci === 0 && i === 0) cg = 8.62;           /* Aarav */
    if (ci === 2 && i === 0) cg = 9.28;            /* Priya */
    var semC = [ +(cg - 0.5 + R() * 0.6).toFixed(2), +(cg - 0.3 + R() * 0.5).toFixed(2), +(cg - 0.2 + R() * 0.4).toFixed(2), cg ];
    var base = (ci*24 + i);
    var st = {
      id: 'ST' + pad(seq, 3), reg: reg, name: name, gender: isF ? 'F' : 'M',
      dob: '200' + (isF ? 6 : 5) + '-' + pad(ri(1, 12), 2) + '-' + pad(ri(1, 28), 2),
      blood: BLOOD_POOL[base % BLOOD_POOL.length], community: COMM[base % COMM.length], religion: RELIGION[base % 3],
      email: name.toLowerCase().replace(/[^a-z ]/g, '').trim().replace(/ /g, '.') + '.' + reg.toLowerCase() + '@students.mdt.ac.in',
      phone: '+91 9' + pad(ri(600000000, 899999999), 9), address: ri(1, 88) + ', ' + pick(['Gandhipuram','RS Puram','Ukkadam','Singanallur','Saibaba Colony','Kuniyamuthur']) + ', ' + pick(CITY),
      parentName: (isF ? pick(MALE) : pick(FEMALE)) + ' ' + name.split(' ')[1],
      parentPhone: '+91 9' + pad(ri(600000000, 899999999), 9),
      dept: cls.dept, classId: cid, sem: cls.sem, batch: cls.batch,
      hostel: false, block: null, roomId: null,
      advisorId: cls.advisor, mentorId: null,
      cgpa: cg, semCgpa: semC, arrears: (R() < 0.06 ? 1 : 0),
      photo: null, photoSync: 'Pending', admissionDate: (cls.sem >= 5 ? '2024-08-01' : '2025-08-01')
    };
    if (emailSeen[st.email]) st.email = st.email.replace('@', ri(1, 99) + '@');
    emailSeen[st.email] = 1;
    S.students.push(st);
  }
});

/* hostel residency — Block A boys / Block B girls */
S.hostelRooms = [];
function mkRooms(block, gender, wardenId, from, to, capacity) {
  for (var n = from; n <= to; n++) {
    S.hostelRooms.push({ id: block + '-' + n, block: block, gender: gender, wardenId: wardenId, floor: Math.floor(n / 100), capacity: capacity, occupants: [] });
  }
}
mkRooms('A', 'M', 'WB1', 101, 112, 3);
mkRooms('B', 'F', 'WG1', 201, 212, 3);

var boys = S.students.filter(function (s) { return s.gender === 'M' && s.sem === 5; });
var girls = S.students.filter(function (s) { return s.gender === 'F' && s.sem === 5; });
/* guarantee demo residents */
var aarav = S.students[0], priya = S.students[48];
if (boys[0] !== aarav) boys.unshift(aarav);
if (girls[0] !== priya) girls.unshift(priya);
boys = boys.slice(0, 27); girls = girls.slice(0, 24);
var roomA = S.hostelRooms.filter(function (r) { return r.block === 'A'; });
var roomB = S.hostelRooms.filter(function (r) { return r.block === 'B'; });
boys.forEach(function (s, i) { var r = roomA[Math.floor(i / 3)]; r.occupants.push(s.id); s.hostel = true; s.block = 'A'; s.roomId = r.id; });
girls.forEach(function (s, i) { var r = roomB[Math.floor(i / 3)]; r.occupants.push(s.id); s.hostel = true; s.block = 'B'; s.roomId = r.id; });

/* ---------------- users (auth) ---------------- */
S.users = [];
S.staff.forEach(function (st) {
  S.users.push({ id: 'U-' + st.id, personType: 'staff', personId: st.id, role: st.role, username: st.email, email: st.email, pass: 'demo123', active: true, lastLogin: '2026-09-03 09:' + pad(ri(10, 55), 2) });
});
S.students.forEach(function (st) {
  S.users.push({ id: 'U-' + st.id, personType: 'student', personId: st.id, role: 'student', username: st.email, email: st.email, pass: 'demo123', active: true, lastLogin: '2026-09-0' + ri(1, 3) + ' ' + pad(ri(8, 21), 2) + ':' + pad(ri(10, 55), 2) });
});

/* ---------------- courses ---------------- */
function C(id, code, title, dept, sem, credits, type) { return { id: id, code: code, title: title, dept: dept, sem: sem, credits: credits, type: type || 'Theory' }; }
S.courses = [
  C('CS501','CS501','Operating Systems','CSE',5,4), C('CS502','CS502','Database Management Systems','CSE',5,4),
  C('CS503','CS503','Computer Networks','CSE',5,4), C('CS504','CS504','Design & Analysis of Algorithms','CSE',5,3),
  C('CS505','CS505','Artificial Intelligence & Machine Learning','CSE',5,3), C('CS506','CS506','Professional Communication','CSE',5,2),
  C('EC501','EC501','VLSI Design','ECE',5,4), C('EC502','EC502','Digital Signal Processing','ECE',5,4),
  C('EC503','EC503','Embedded Systems','ECE',5,4), C('EC504','EC504','Wireless Communication','ECE',5,3),
  C('EC505','EC505','Linear Integrated Circuits','ECE',5,3), C('EC506','EC506','Optical Communication (Elective)','ECE',5,3),
  C('CS301','CS301','Data Structures','CSE',3,4), C('CS302','CS302','Object Oriented Programming with Java','CSE',3,4),
  C('CS303','CS303','Computer Organization & Architecture','CSE',3,3), C('CS304','CS304','Digital Logic Design','CSE',3,3),
  C('CS305','CS305','Discrete Mathematics','CSE',3,4), C('CS306','CS306','Python Programming','CSE',3,2),
  C('EC301','EC301','Signals & Systems','ECE',3,4), C('EC302','EC302','Digital Electronics','ECE',3,4),
  C('EC303','EC303','Electromagnetic Fields','ECE',3,3), C('EC304','EC304','Computer Networks','ECE',3,3),
  C('EC305','EC305','Transforms & Partial Differential Equations','ECE',3,4), C('EC306','EC306','Electronic Measurement','ECE',3,2)
];
var COURSE_MAP = {}; S.courses.forEach(function (c) { COURSE_MAP[c.id] = c; });

/* ---------------- course allocations (assigned by Academic Director) ---------------- */
S.courseAllocations = [];
var ALLOC = {
  'CSE-A': [['CS501','T01'],['CS502','T02'],['CS503','T01'],['CS504','T03'],['CS505','T02'],['CS506','T04']],
  'CSE-B': [['CS501','T09'],['CS502','T02'],['CS503','T01'],['CS504','T03'],['CS505','T10'],['CS506','T04']],
  'ECE-A': [['EC501','T05'],['EC502','T06'],['EC503','T07'],['EC504','T07'],['EC505','T06'],['EC506','T05']],
  'ECE-B': [['EC501','T05'],['EC502','T11'],['EC503','T12'],['EC504','T12'],['EC505','T06'],['EC506','T05']],
  'CSE-C': [['CS301','T04'],['CS302','T03'],['CS303','T09'],['CS304','T10'],['CS305','T13'],['CS306','T02']],
  'ECE-C': [['EC301','T08'],['EC302','T08'],['EC303','T11'],['EC304','T12'],['EC305','T13'],['EC306','T06']]
};
var allocSeq = 0;
Object.keys(ALLOC).forEach(function (cid) {
  var cls = S.classes.filter(function (c) { return c.id === cid; })[0];
  ALLOC[cid].forEach(function (pair, pi) {
    allocSeq++;
    S.courseAllocations.push({ id: 'AL' + pad(allocSeq, 3), classId: cid, courseId: pair[0], teacherId: pair[1],
      sem: cls.sem, year: '2026–27', assignedBy: 'AD1', assignedAt: '2026-07-01', periods: pi === 0 ? 6 : (pi < 3 ? 5 : 4), status: 'Active' });
  });
});

/* ---------------- timetable (Mon–Fri, 8 periods, lunch @5) ---------------- */
S.timetable = [];
var ROOMS = { 'CSE-A': 'B-204', 'CSE-B': 'B-206', 'ECE-A': 'C-102', 'ECE-B': 'C-104', 'CSE-C': 'A-101', 'ECE-C': 'C-201' };
CLASSES_ORDER.forEach(function (cid, ci) {
  var cids = ALLOC[cid].map(function (p) { return p[0]; });
  var pattern = [0,1,2,3,4,5,0,2, 1,3,0,4,5,2,1, 2,0,5,1,4,3,2,0, 3,4,1,2,0,5,3,4, 5,2,3,0,4,1,5,2]; /* 40 usable slots */
  var room = ROOMS[cid], lab = 'Lab-' + (ci % 2 === 0 ? '1' : '2');
  var k = 0;
  for (var day = 0; day < 5; day++) {
    for (var per = 1; per <= 8; per++) {
      if (per === 5) { S.timetable.push({ classId: cid, day: day, period: 5, break: true }); continue; }
      var cId = cids[pattern[k % pattern.length]]; k++;
      var isLab = (per === 6) && (cId === cids[2]); /* 3rd course gets a weekly lab */
      S.timetable.push({ classId: cid, day: day, period: per, courseId: cId,
        teacherId: (ALLOC[cid].filter(function (p) { return p[0] === cId; })[0] || [])[1] || null,
        room: isLab ? lab : room, lab: isLab });
    }
  }
});

/* ---------------- course plan (lesson progress) ---------------- */
S.coursePlan = [];
var UNITS = {
  'CS501': ['Process Management & Scheduling','Synchronisation & Deadlocks','Memory Management','File Systems & I/O','Virtualisation & Case Studies'],
  'CS502': ['ER Modelling & Relational Model','SQL & Integrity','Normalisation','Transactions & Concurrency','Indexing & Query Processing'],
  'CS503': ['Network Fundamentals & Layers','Data Link & MAC','Network Layer & Routing','Transport Layer','Application Layer & Security'],
  'CS504': ['Asymptotic Analysis','Divide & Conquer','Greedy & Dynamic Programming','Graph Algorithms','NP-Completeness'],
  'CS505': ['Search & Knowledge Representation','Machine Learning Basics','Neural Networks','Classification & Regression','Applications & Ethics'],
  'CS506': ['Professional Writing','Group Discussion & Interviews','Presentation Skills','Corporate Etiquette','Career Readiness'],
  'CS301': ['Arrays & Complexity','Stacks & Queues','Trees & BST','Graphs','Hashing'],
  'CS302': ['OOP Concepts','Classes & Objects','Inheritance & Polymorphism','Collections & Generics','File I/O & Threads'],
  'CS303': ['Data Representation','CPU Organisation','Instruction Pipelining','Memory Hierarchy','I/O Organisation'],
  'CS304': ['Boolean Algebra','Combinational Circuits','Sequential Circuits','Registers & Counters','Memory & Logic Families'],
  'CS305': ['Logic & Proof','Set Theory','Relations & Functions','Graph Theory','Counting & Recurrence'],
  'CS306': ['Python Basics','Control & Functions','Data Structures in Python','Modules & Files','Libraries & Projects'],
  'EC501': ['MOS Transistor Theory','CMOS Inverter Design','Combinational CMOS','Sequential CMOS','Testing & Verification'],
  'EC502': ['Discrete Time Signals','Z-Transform','DFT & FFT','IIR Filter Design','FIR Filter Design'],
  'EC503': ['Embedded System Design','8051 Architecture','Interfacing & Devices','RTOS Concepts','IoT & Applications'],
  'EC504': ['Wireless Channel','Modulation Techniques','Multiple Access','Cellular Systems','5G & Beyond'],
  'EC505': ['Op-Amp Fundamentals','Active Filters','Comparators & Oscillators','PLL & Timers','Specialised ICs'],
  'EC506': ['Optical Fibre Principles','Fibre Characteristics','Sources & Detectors','Optical Link Design','WDM Networks'],
  'EC301': ['Signal Classification','LTI Systems','Convolution & Fourier Series','Fourier Transform','Sampling Theorem'],
  'EC302': ['Number Systems','Boolean Simplification','Combinational Design','Flip-Flops','Registers & Counters'],
  'EC303': ['Electrostatics','Magnetostatics','Maxwell Equations','Plane Waves','Transmission Lines'],
  'EC304': ['OSI & TCP/IP','Data Link Layer','Network Layer','Transport Layer','Network Security'],
  'EC305': ['Fourier Series','Z & Laplace','PDE Methods','Applications','Transform Pairs'],
  'EC306': ['Measurement Basics','Bridges & Q-Meters','Oscilloscopes','Transducers','Digital Instruments']
};
S.courseAllocations.forEach(function (al) {
  var units = UNITS[al.courseId] || ['Unit 1','Unit 2','Unit 3','Unit 4','Unit 5'];
  var doneU = al.classId === 'CSE-A' ? 3 : 2; /* demo class slightly ahead */
  units.forEach(function (u, ui) {
    var st = ui < doneU ? 'Completed' : (ui === doneU ? 'In Progress' : 'Scheduled');
    S.coursePlan.push({ allocId: al.id, courseId: al.courseId, classId: al.classId, unit: ui + 1, topic: u,
      status: st, week: 'W' + (ui * 2 + 1) + '–W' + (ui * 2 + 2), updatedBy: al.teacherId, updatedAt: '2026-08-2' + ri(0, 8) });
  });
});

/* ---------------- attendance ---------------- */
S.attendanceAgg = {};
S.students.forEach(function (s, idx) {
  var m = {};
  ALLOC[s.classId].forEach(function (pair) {
    var t = 22 + ri(0, 2);
    var ratio = 0.78 + R() * 0.19;
    if (s.id === 'ST001') ratio = 0.90;          /* Aarav */
    if (s.id === 'ST049') ratio = 0.94;          /* Priya */
    if (s.id === 'ST009') ratio = 0.70;          /* at-risk */
    if (s.id === 'ST007') ratio = 0.74;          /* at-risk */
    var p = Math.round(t * Math.min(0.985, ratio));
    m[pair[0]] = { p: p, t: t, l: Math.max(0, Math.min(2, t - p - ri(0, 1))) };
  });
  S.attendanceAgg[s.id] = m;
});

/* marked sessions exist for the class-advisor demo teacher's CSE-A courses */
S.attendanceSessions = [];
var sessDates = ['2026-07-13','2026-07-15','2026-07-17','2026-07-20','2026-07-22','2026-07-27','2026-07-29','2026-07-31','2026-08-03','2026-08-05','2026-08-07','2026-08-10','2026-08-12','2026-08-14','2026-08-19','2026-08-21','2026-08-26','2026-08-28','2026-09-02','2026-09-03'];
var cseA = S.students.filter(function (s) { return s.classId === 'CSE-A'; });
[['CS501', 1], ['CS503', 3]].forEach(function (pair) {
  sessDates.forEach(function (dt, di) {
    var marks = {};
    cseA.forEach(function (s) {
      var a = S.attendanceAgg[s.id][pair[0]];
      var r = R();
      marks[s.id] = r < (a.p / a.t) ? 'P' : (r < (a.p / a.t) + 0.03 ? 'L' : 'A');
    });
    S.attendanceSessions.push({ id: 'AS-' + pair[0] + '-' + pad(di + 1, 2), classId: 'CSE-A', courseId: pair[0],
      teacherId: pair[1] === 1 ? 'T01' : 'T01', date: dt, period: pair[1], marks: marks });
  });
});

/* ---------------- marks: Internal-1 (20) & Quiz-1 (10) ---------------- */
S.marks = {};
S.students.forEach(function (s) {
  var m = {};
  ALLOC[s.classId].forEach(function (pair) {
    var factor = (s.cgpa / 10) * (0.82 + R() * 0.2);
    var i1 = Math.max(6, Math.min(20, Math.round(20 * factor)));
    var q1 = Math.max(3, Math.min(10, Math.round(10 * (factor + 0.06))));
    m[pair[0]] = { I1: i1, Q1: q1, I1pub: true, Q1pub: true };
  });
  if (s.id === 'ST001') { m.CS501 = { I1: 18, Q1: 9, I1pub: true, Q1pub: true }; m.CS503 = { I1: 17, Q1: 8, I1pub: true, Q1pub: true }; }
  if (s.id === 'ST049') { m.EC501 = { I1: 19, Q1: 10, I1pub: true, Q1pub: true }; }
  S.marks[s.id] = m;
});

g.SEED = S;
if (typeof module !== 'undefined' && module.exports) module.exports = S;
})(typeof window !== 'undefined' ? window : globalThis);
