import {
  Student,
  ClassSection,
  Subject,
  AttendanceRecord,
  Assessment,
  MarkEntry,
  CommunicationMessage,
  SchoolNotice,
  ConferenceBooking
} from '../types';

export const INITIAL_SCHOOL_INFO = {
  name: "Light Angels Primary School",
  motto: "Guiding Young Lights to Shine with Wisdom & Grace",
  code: "LAPS-EST-2008",
  accreditation: "Uganda Primary Education Curriculum Standard & UNEB Certified Centre",
  address: "24 Angelic Heights Way, Kampala Central / Sunshine Campus",
  phone: "+256 700 123456 / +256 414 555888",
  email: "admin@lightangelsprimary.ac.ug",
  academicYear: "2026 - 2027",
  currentTerm: "Term 2 (Mid-Year Progress)"
};

// Full primary school grade levels from P.1 to P.7
export const INITIAL_CLASSES: ClassSection[] = [
  {
    id: "cls-p1a",
    grade: "P.1",
    section: "A",
    name: "Primary 1-A (Little Cherubs)",
    room: "Angel Wing Lower Hall 1",
    classTeacher: "Ms. Annet Kyomugisha",
    academicYear: "2026 - 2027"
  },
  {
    id: "cls-p2a",
    grade: "P.2",
    section: "A",
    name: "Primary 2-A (Joyful Morning Stars)",
    room: "Angel Wing Lower Hall 3",
    classTeacher: "Mrs. Justine Namazzi",
    academicYear: "2026 - 2027"
  },
  {
    id: "cls-p3a",
    grade: "P.3",
    section: "A",
    name: "Primary 3-A (Golden Doves)",
    room: "Angel Wing Hall 5",
    classTeacher: "Mr. Moses Ssempijja",
    academicYear: "2026 - 2027"
  },
  {
    id: "cls-p4a",
    grade: "P.4",
    section: "A",
    name: "Primary 4-A (P.4 Junior Champions)",
    room: "Seraphim Block Room 8",
    classTeacher: "Ms. Rebecca Nalwanga",
    academicYear: "2026 - 2027"
  },
  {
    id: "cls-p5a",
    grade: "P.5",
    section: "A",
    name: "Primary 5-A (Angels Cohort - P.5 Bluebirds)",
    room: "Dove Wing Classroom 12",
    classTeacher: "Mrs. Catherine Nansubuga",
    academicYear: "2026 - 2027"
  },
  {
    id: "cls-p6a",
    grade: "P.6",
    section: "A",
    name: "Primary 6-A (Upper Primary Scholars)",
    room: "Dove Wing Classroom 16",
    classTeacher: "Mr. Patrick Mukasa",
    academicYear: "2026 - 2027"
  },
  {
    id: "cls-p7a",
    grade: "P.7",
    section: "A",
    name: "Primary 7-A (P.L.E. Candidate Class of 2026)",
    room: "St. Gabriel Examination Block 21",
    classTeacher: "Mr. Gregory Okello",
    academicYear: "2026 - 2027"
  }
];

// Subjects strictly defined as requested by the user:
// P.1 - P.3: Luganda, English, Mathematics, Reading, Literacy One, Literacy 2
// P.4 - P.7: English, SST, Science, Mathematics
export const INITIAL_SUBJECTS: Subject[] = [
  // --- Lower Primary Subjects (P.1 to P.3) ---
  {
    id: "sub-lug",
    name: "Luganda",
    code: "LUG",
    teacher: "Mrs. Justine Namazzi",
    credits: 3,
    applicableGrades: ["P.1", "P.2", "P.3"]
  },
  {
    id: "sub-eng-lp",
    name: "English",
    code: "ENG-LP",
    teacher: "Ms. Annet Kyomugisha",
    credits: 4,
    applicableGrades: ["P.1", "P.2", "P.3"]
  },
  {
    id: "sub-math-lp",
    name: "Mathematics",
    code: "MTC-LP",
    teacher: "Mr. Moses Ssempijja",
    credits: 4,
    applicableGrades: ["P.1", "P.2", "P.3"]
  },
  {
    id: "sub-read",
    name: "Reading",
    code: "RDG",
    teacher: "Ms. Annet Kyomugisha",
    credits: 3,
    applicableGrades: ["P.1", "P.2", "P.3"]
  },
  {
    id: "sub-lit1",
    name: "Literacy One",
    code: "LIT-1",
    teacher: "Mrs. Justine Namazzi",
    credits: 4,
    applicableGrades: ["P.1", "P.2", "P.3"]
  },
  {
    id: "sub-lit2",
    name: "Literacy 2",
    code: "LIT-2",
    teacher: "Mr. Moses Ssempijja",
    credits: 4,
    applicableGrades: ["P.1", "P.2", "P.3"]
  },

  // --- Upper Primary Subjects (P.4 to P.7) ---
  {
    id: "sub-eng-up",
    name: "English",
    code: "ENG",
    teacher: "Ms. Rebecca Nalwanga",
    credits: 4,
    applicableGrades: ["P.4", "P.5", "P.6", "P.7"]
  },
  {
    id: "sub-sst-up",
    name: "Social Studies (SST)",
    code: "SST",
    teacher: "Mr. Joseph Kato",
    credits: 4,
    applicableGrades: ["P.4", "P.5", "P.6", "P.7"]
  },
  {
    id: "sub-sci-up",
    name: "Science",
    code: "SCI",
    teacher: "Mr. Patrick Mukasa",
    credits: 4,
    applicableGrades: ["P.4", "P.5", "P.6", "P.7"]
  },
  {
    id: "sub-math-up",
    name: "Mathematics",
    code: "MTC",
    teacher: "Mrs. Catherine Nansubuga",
    credits: 4,
    applicableGrades: ["P.4", "P.5", "P.6", "P.7"]
  }
];

// Pupils for all classes P.1 to P.7
export const INITIAL_STUDENTS: Student[] = [
  // --- Primary 1-A Pupils (Lower Primary) ---
  {
    id: "std-p1-01",
    name: "Liam Kato Mugisha",
    rollNumber: "LAP-2611",
    grade: "P.1",
    section: "A",
    avatarUrl: "",
    guardianName: "Dennis & Sarah Mugisha",
    guardianEmail: "sarah.mugisha@gmail.com",
    guardianPhone: "+256 701 110022",
    dateOfBirth: "2019-02-14",
    address: "Plot 12 Seraphim Close, Kampala",
    enrollmentDate: "2026-01-15"
  },
  {
    id: "std-p1-02",
    name: "Gloria Namubiru",
    rollNumber: "LAP-2612",
    grade: "P.1",
    section: "A",
    avatarUrl: "",
    guardianName: "Patrick & Agnes Namubiru",
    guardianEmail: "namubiru.p@yahoo.com",
    guardianPhone: "+256 701 334455",
    dateOfBirth: "2019-05-20",
    address: "28 Angel Walk, Kampala",
    enrollmentDate: "2026-01-15"
  },
  {
    id: "std-p1-03",
    name: "Ethan Sserwadda",
    rollNumber: "LAP-2613",
    grade: "P.1",
    section: "A",
    avatarUrl: "",
    guardianName: "Joseph Sserwadda",
    guardianEmail: "jsserwadda@kampala.org",
    guardianPhone: "+256 701 667788",
    dateOfBirth: "2019-08-11",
    address: "Flat 5 Sunshine Hill, Kampala",
    enrollmentDate: "2026-01-15"
  },
  {
    id: "std-p1-04",
    name: "Divine Akello",
    rollNumber: "LAP-2614",
    grade: "P.1",
    section: "A",
    avatarUrl: "",
    guardianName: "Miriam Akello",
    guardianEmail: "miriam.akello@health.ug",
    guardianPhone: "+256 701 990011",
    dateOfBirth: "2019-03-08",
    address: "44 Dove Valley, Kampala",
    enrollmentDate: "2026-01-15"
  },

  // --- Primary 2-A Pupils (Lower Primary) ---
  {
    id: "std-p2-01",
    name: "Trevor Mukisa Kintu",
    rollNumber: "LAP-2621",
    grade: "P.2",
    section: "A",
    avatarUrl: "",
    guardianName: "Francis & Grace Mukisa",
    guardianEmail: "mukisa.f@familynet.ug",
    guardianPhone: "+256 702 112233",
    dateOfBirth: "2018-03-10",
    address: "Block 7 Morning Star Close, Kampala",
    enrollmentDate: "2025-01-12"
  },
  {
    id: "std-p2-02",
    name: "Blessing Nakato Kirabo",
    rollNumber: "LAP-2622",
    grade: "P.2",
    section: "A",
    avatarUrl: "",
    guardianName: "Pastor John Kirabo",
    guardianEmail: "pastor.kirabo@lightfaith.ug",
    guardianPhone: "+256 702 445566",
    dateOfBirth: "2018-07-25",
    address: "Plot 30 Sunshine Hill, Kampala",
    enrollmentDate: "2025-01-12"
  },
  {
    id: "std-p2-03",
    name: "Joshua Wasswa Kayiwa",
    rollNumber: "LAP-2623",
    grade: "P.2",
    section: "A",
    avatarUrl: "",
    guardianName: "Beatrice Kayiwa",
    guardianEmail: "bkayiwa@healthcare.ug",
    guardianPhone: "+256 702 778899",
    dateOfBirth: "2018-07-25",
    address: "12 Seraphim Crescent, Kampala",
    enrollmentDate: "2025-01-12"
  },
  {
    id: "std-p2-04",
    name: "Chloe Nantale",
    rollNumber: "LAP-2624",
    grade: "P.2",
    section: "A",
    avatarUrl: "",
    guardianName: "Simon & Rachael Nantale",
    guardianEmail: "nantale.r@consulting.ug",
    guardianPhone: "+256 702 889911",
    dateOfBirth: "2018-11-19",
    address: "88 Angel Heights, Kampala",
    enrollmentDate: "2025-01-12"
  },

  // --- Primary 3-A Pupils (Lower Primary) ---
  {
    id: "std-p3-01",
    name: "Samuel Mugisha",
    rollNumber: "LAP-2631",
    grade: "P.3",
    section: "A",
    avatarUrl: "",
    guardianName: "Arthur & Peace Mugisha",
    guardianEmail: "peace.mugisha@bankuganda.ug",
    guardianPhone: "+256 703 112244",
    dateOfBirth: "2017-01-19",
    address: "51 Seraphim Park, Kampala",
    enrollmentDate: "2024-01-10"
  },
  {
    id: "std-p3-02",
    name: "Esther Nabukalu",
    rollNumber: "LAP-2632",
    grade: "P.3",
    section: "A",
    avatarUrl: "",
    guardianName: "David Nabukalu",
    guardianEmail: "d.nabukalu@telecom.ug",
    guardianPhone: "+256 703 223355",
    dateOfBirth: "2017-04-05",
    address: "19 Dove Avenue, Kampala",
    enrollmentDate: "2024-01-10"
  },
  {
    id: "std-p3-03",
    name: "Caleb Ssebaggala",
    rollNumber: "LAP-2633",
    grade: "P.3",
    section: "A",
    avatarUrl: "",
    guardianName: "Moses & Ruth Ssebaggala",
    guardianEmail: "ruth.ssebaggala@enterprise.ug",
    guardianPhone: "+256 703 334466",
    dateOfBirth: "2017-09-22",
    address: "32 Angel Crest, Kampala",
    enrollmentDate: "2024-01-10"
  },
  {
    id: "std-p3-04",
    name: "Mercy Ainembabazi",
    rollNumber: "LAP-2634",
    grade: "P.3",
    section: "A",
    avatarUrl: "",
    guardianName: "Gerald Ainembabazi",
    guardianEmail: "gainembabazi@lawcorp.ug",
    guardianPhone: "+256 703 445577",
    dateOfBirth: "2017-12-03",
    address: "70 Sunshine Way, Kampala",
    enrollmentDate: "2024-01-10"
  },

  // --- Primary 4-A Pupils (Upper Primary) ---
  {
    id: "std-p4-01",
    name: "Victor Kibirige",
    rollNumber: "LAP-2641",
    grade: "P.4",
    section: "A",
    avatarUrl: "",
    guardianName: "Godfrey & Evelyn Kibirige",
    guardianEmail: "evelyn.k@tradecentre.ug",
    guardianPhone: "+256 704 112266",
    dateOfBirth: "2016-02-12",
    address: "21 Cherub Close, Kampala",
    enrollmentDate: "2023-01-14"
  },
  {
    id: "std-p4-02",
    name: "Faith Babirye",
    rollNumber: "LAP-2642",
    grade: "P.4",
    section: "A",
    avatarUrl: "",
    guardianName: "Isaac & Christine Babirye",
    guardianEmail: "cbabirye@logistics.ug",
    guardianPhone: "+256 704 223377",
    dateOfBirth: "2016-06-27",
    address: "49 Angelic Boulevard, Kampala",
    enrollmentDate: "2023-01-14"
  },
  {
    id: "std-p4-03",
    name: "Timothy Otim",
    rollNumber: "LAP-2643",
    grade: "P.4",
    section: "A",
    avatarUrl: "",
    guardianName: "Charles Otim",
    guardianEmail: "charles.otim@gov.ug",
    guardianPhone: "+256 704 334488",
    dateOfBirth: "2016-08-15",
    address: "93 Sunshine Lane, Kampala",
    enrollmentDate: "2023-01-14"
  },
  {
    id: "std-p4-04",
    name: "Joanita Nampeera",
    rollNumber: "LAP-2644",
    grade: "P.4",
    section: "A",
    avatarUrl: "",
    guardianName: "Rose Nampeera",
    guardianEmail: "rose.nampeera@medicare.ug",
    guardianPhone: "+256 704 445599",
    dateOfBirth: "2016-10-30",
    address: "15 Dove Crest, Kampala",
    enrollmentDate: "2023-01-14"
  },

  // --- Primary 5-A Pupils (Upper Primary) ---
  {
    id: "std-001",
    name: "Leo Davis Ssenyonjo",
    rollNumber: "LAP-2651",
    grade: "P.5",
    section: "A",
    avatarUrl: "",
    guardianName: "Robert & Susan Davis",
    guardianEmail: "robert.davis@familymail.org",
    guardianPhone: "+256 701 555883",
    dateOfBirth: "2015-04-14",
    address: "Plot 18 Seraphim Close, Kampala",
    enrollmentDate: "2022-01-15"
  },
  {
    id: "std-002",
    name: "Maya Rostova Namaganda",
    rollNumber: "LAP-2652",
    grade: "P.5",
    section: "A",
    avatarUrl: "",
    guardianName: "Dr. Elena Rostova",
    guardianEmail: "elena.rostova@medicare.org",
    guardianPhone: "+256 701 555442",
    dateOfBirth: "2015-08-22",
    address: "Flat 4 Angel Walk, Kampala",
    enrollmentDate: "2022-01-15"
  },
  {
    id: "std-003",
    name: "Julian Hayes Kigozi",
    rollNumber: "LAP-2653",
    grade: "P.5",
    section: "A",
    avatarUrl: "",
    guardianName: "David & Claire Hayes",
    guardianEmail: "claire.hayes@hayesadvocates.com",
    guardianPhone: "+256 701 555901",
    dateOfBirth: "2015-01-30",
    address: "95 St. Michael Crescent, Kampala",
    enrollmentDate: "2022-01-15"
  },
  {
    id: "std-004",
    name: "Sophia Martinez Nabirye",
    rollNumber: "LAP-2654",
    grade: "P.5",
    section: "A",
    avatarUrl: "",
    guardianName: "Carlos & Maria Martinez",
    guardianEmail: "carlos.martinez@lightstudio.org",
    guardianPhone: "+256 701 555128",
    dateOfBirth: "2015-11-05",
    address: "112 Sunshine Avenue, Kampala",
    enrollmentDate: "2022-01-15"
  },
  {
    id: "std-005",
    name: "Liam Chen Kintu",
    rollNumber: "LAP-2655",
    grade: "P.5",
    section: "A",
    avatarUrl: "",
    guardianName: "Wei & Jessica Chen",
    guardianEmail: "jessica.chen@chenlogistics.com",
    guardianPhone: "+256 701 555673",
    dateOfBirth: "2015-06-18",
    address: "33 Haven Court, Kampala",
    enrollmentDate: "2022-01-15"
  },
  {
    id: "std-006",
    name: "Emma Watson Babirye",
    rollNumber: "LAP-2656",
    grade: "P.5",
    section: "A",
    avatarUrl: "",
    guardianName: "Jonathan Lee & Diana Watson",
    guardianEmail: "dwatson@scholasticpress.org",
    guardianPhone: "+256 701 555321",
    dateOfBirth: "2015-09-12",
    address: "77 Dove Valley, Kampala",
    enrollmentDate: "2022-01-15"
  },

  // --- Primary 6-A Pupils (Upper Primary) ---
  {
    id: "std-p6-01",
    name: "Arthur Ssemwanga",
    rollNumber: "LAP-2661",
    grade: "P.6",
    section: "A",
    avatarUrl: "",
    guardianName: "Richard & Irene Ssemwanga",
    guardianEmail: "irene.s@finance.ug",
    guardianPhone: "+256 706 112288",
    dateOfBirth: "2014-03-24",
    address: "62 Angelic Ridge, Kampala",
    enrollmentDate: "2021-01-15"
  },
  {
    id: "std-p6-02",
    name: "Brenda Kyobutungi",
    rollNumber: "LAP-2662",
    grade: "P.6",
    section: "A",
    avatarUrl: "",
    guardianName: "Dr. Ben Kyobutungi",
    guardianEmail: "dr.ben@kampalahospital.ug",
    guardianPhone: "+256 706 223399",
    dateOfBirth: "2014-07-09",
    address: "18 Seraphim Hill, Kampala",
    enrollmentDate: "2021-01-15"
  },
  {
    id: "std-p6-03",
    name: "Emmanuel Kisakye",
    rollNumber: "LAP-2663",
    grade: "P.6",
    section: "A",
    avatarUrl: "",
    guardianName: "Stephen Kisakye",
    guardianEmail: "skisakye@techuganda.ug",
    guardianPhone: "+256 706 334411",
    dateOfBirth: "2014-10-18",
    address: "81 Sunshine Grove, Kampala",
    enrollmentDate: "2021-01-15"
  },
  {
    id: "std-p6-04",
    name: "Fiona Birungi",
    rollNumber: "LAP-2664",
    grade: "P.6",
    section: "A",
    avatarUrl: "",
    guardianName: "Hellen Birungi",
    guardianEmail: "hbirungi@retailcorp.ug",
    guardianPhone: "+256 706 445522",
    dateOfBirth: "2014-12-05",
    address: "39 Dove Terrace, Kampala",
    enrollmentDate: "2021-01-15"
  },

  // --- Primary 7-A Pupils (PLE Candidate Class - Upper Primary) ---
  {
    id: "std-p7-01",
    name: "Precious Ainebyoona",
    rollNumber: "LAP-2671",
    grade: "P.7",
    section: "A",
    avatarUrl: "",
    guardianName: "Herbert & Juliet Aine",
    guardianEmail: "juliet.aine@bankingcorp.ug",
    guardianPhone: "+256 704 889900",
    dateOfBirth: "2013-02-18",
    address: "55 Candidate View Road, Kampala",
    enrollmentDate: "2020-01-15"
  },
  {
    id: "std-p7-02",
    name: "Daniel Kato Lubega",
    rollNumber: "LAP-2672",
    grade: "P.7",
    section: "A",
    avatarUrl: "",
    guardianName: "Dr. Samuel Lubega",
    guardianEmail: "dr.lubega@mulago.ug",
    guardianPhone: "+256 704 223344",
    dateOfBirth: "2013-06-04",
    address: "Plot 9 Angel Heights, Kampala",
    enrollmentDate: "2020-01-15"
  },
  {
    id: "std-p7-03",
    name: "Martha Namusoke",
    rollNumber: "LAP-2673",
    grade: "P.7",
    section: "A",
    avatarUrl: "",
    guardianName: "Paul Namusoke",
    guardianEmail: "pnamusoke@auditors.ug",
    guardianPhone: "+256 704 556677",
    dateOfBirth: "2013-09-14",
    address: "73 Gabriel Close, Kampala",
    enrollmentDate: "2020-01-15"
  },
  {
    id: "std-p7-04",
    name: "Brian Byaruhanga",
    rollNumber: "LAP-2674",
    grade: "P.7",
    section: "A",
    avatarUrl: "",
    guardianName: "Edward & Grace Byaruhanga",
    guardianEmail: "grace.b@energycorp.ug",
    guardianPhone: "+256 704 778899",
    dateOfBirth: "2013-11-28",
    address: "41 Sunshine Heights, Kampala",
    enrollmentDate: "2020-01-15"
  }
];

// Helper to create assessments for each class
export const INITIAL_ASSESSMENTS: Assessment[] = [
  // --- P.1 Assessments (6 subjects: Luganda, English, Math, Reading, Lit 1, Lit 2) ---
  { id: "asm-p1-lug", title: "Mid-Term Luganda Paper (M.O.T)", subjectId: "sub-lug", classSectionId: "cls-p1a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-20", term: "Term 2" },
  { id: "asm-p1-eng", title: "Mid-Term English Paper (M.O.T)", subjectId: "sub-eng-lp", classSectionId: "cls-p1a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-21", term: "Term 2" },
  { id: "asm-p1-mtc", title: "Mid-Term Mathematics Paper (M.O.T)", subjectId: "sub-math-lp", classSectionId: "cls-p1a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-22", term: "Term 2" },
  { id: "asm-p1-rdg", title: "Mid-Term Reading & Phonics Assessment", subjectId: "sub-read", classSectionId: "cls-p1a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-23", term: "Term 2" },
  { id: "asm-p1-lit1", title: "Mid-Term Literacy One Paper", subjectId: "sub-lit1", classSectionId: "cls-p1a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-24", term: "Term 2" },
  { id: "asm-p1-lit2", title: "Mid-Term Literacy 2 Paper", subjectId: "sub-lit2", classSectionId: "cls-p1a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-25", term: "Term 2" },

  // --- P.2 Assessments (6 subjects) ---
  { id: "asm-p2-lug01", title: "Mid-Term Luganda Exam (M.O.T)", subjectId: "sub-lug", classSectionId: "cls-p2a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-20", term: "Term 2" },
  { id: "asm-p2-eng01", title: "Mid-Term English Exam (M.O.T)", subjectId: "sub-eng-lp", classSectionId: "cls-p2a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-21", term: "Term 2" },
  { id: "asm-p2-mtc01", title: "Mid-Term Mathematics Exam (M.O.T)", subjectId: "sub-math-lp", classSectionId: "cls-p2a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-22", term: "Term 2" },
  { id: "asm-p2-read01", title: "Mid-Term Reading & Oral Fluency Exam", subjectId: "sub-read", classSectionId: "cls-p2a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-23", term: "Term 2" },
  { id: "asm-p2-lit1-01", title: "Mid-Term Literacy One Exam", subjectId: "sub-lit1", classSectionId: "cls-p2a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-24", term: "Term 2" },
  { id: "asm-p2-lit2-01", title: "Mid-Term Literacy 2 Exam", subjectId: "sub-lit2", classSectionId: "cls-p2a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-25", term: "Term 2" },

  // --- P.3 Assessments (6 subjects) ---
  { id: "asm-p3-lug", title: "Mid-Term Luganda Exam (M.O.T)", subjectId: "sub-lug", classSectionId: "cls-p3a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-20", term: "Term 2" },
  { id: "asm-p3-eng", title: "Mid-Term English Exam (M.O.T)", subjectId: "sub-eng-lp", classSectionId: "cls-p3a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-21", term: "Term 2" },
  { id: "asm-p3-mtc", title: "Mid-Term Mathematics Exam (M.O.T)", subjectId: "sub-math-lp", classSectionId: "cls-p3a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-22", term: "Term 2" },
  { id: "asm-p3-rdg", title: "Mid-Term Reading Comprehension Exam", subjectId: "sub-read", classSectionId: "cls-p3a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-23", term: "Term 2" },
  { id: "asm-p3-lit1", title: "Mid-Term Literacy One Exam", subjectId: "sub-lit1", classSectionId: "cls-p3a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-24", term: "Term 2" },
  { id: "asm-p3-lit2", title: "Mid-Term Literacy 2 Exam", subjectId: "sub-lit2", classSectionId: "cls-p3a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-25", term: "Term 2" },

  // --- P.4 Assessments (4 subjects: English, SST, Science, Math) ---
  { id: "asm-p4-eng", title: "Mid-Term English Exam (M.O.T)", subjectId: "sub-eng-up", classSectionId: "cls-p4a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-20", term: "Term 2" },
  { id: "asm-p4-sst", title: "Mid-Term Social Studies (SST) Exam", subjectId: "sub-sst-up", classSectionId: "cls-p4a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-21", term: "Term 2" },
  { id: "asm-p4-sci", title: "Mid-Term Science Exam (M.O.T)", subjectId: "sub-sci-up", classSectionId: "cls-p4a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-22", term: "Term 2" },
  { id: "asm-p4-mtc", title: "Mid-Term Mathematics Exam (M.O.T)", subjectId: "sub-math-up", classSectionId: "cls-p4a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-23", term: "Term 2" },

  // --- P.5 Assessments (4 subjects) ---
  { id: "asm-m01", title: "Mid-Term Mathematics Paper (M.O.T)", subjectId: "sub-math-up", classSectionId: "cls-p5a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-22", term: "Term 2" },
  { id: "asm-e01", title: "Mid-Term English Language Paper (M.O.T)", subjectId: "sub-eng-up", classSectionId: "cls-p5a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-23", term: "Term 2" },
  { id: "asm-s01", title: "Mid-Term Integrated Science Paper (M.O.T)", subjectId: "sub-sci-up", classSectionId: "cls-p5a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-24", term: "Term 2" },
  { id: "asm-sst01", title: "Mid-Term Social Studies (SST) Paper (M.O.T)", subjectId: "sub-sst-up", classSectionId: "cls-p5a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-21", term: "Term 2" },

  // --- P.6 Assessments (4 subjects) ---
  { id: "asm-p6-eng", title: "Mid-Term English Exam (M.O.T)", subjectId: "sub-eng-up", classSectionId: "cls-p6a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-20", term: "Term 2" },
  { id: "asm-p6-sst", title: "Mid-Term Social Studies (SST) Exam", subjectId: "sub-sst-up", classSectionId: "cls-p6a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-21", term: "Term 2" },
  { id: "asm-p6-sci", title: "Mid-Term Science Exam (M.O.T)", subjectId: "sub-sci-up", classSectionId: "cls-p6a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-22", term: "Term 2" },
  { id: "asm-p6-mtc", title: "Mid-Term Mathematics Exam (M.O.T)", subjectId: "sub-math-up", classSectionId: "cls-p6a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-23", term: "Term 2" },

  // --- P.7 Assessments (4 subjects - PLE Mock / Candidate Exam) ---
  { id: "asm-p7-eng", title: "P.L.E. Pre-Mock English Paper", subjectId: "sub-eng-up", classSectionId: "cls-p7a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-20", term: "Term 2" },
  { id: "asm-p7-sst", title: "P.L.E. Pre-Mock Social Studies Paper", subjectId: "sub-sst-up", classSectionId: "cls-p7a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-21", term: "Term 2" },
  { id: "asm-p7-sci", title: "P.L.E. Pre-Mock Science Paper", subjectId: "sub-sci-up", classSectionId: "cls-p7a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-22", term: "Term 2" },
  { id: "asm-p7-mtc", title: "P.L.E. Pre-Mock Mathematics Paper", subjectId: "sub-math-up", classSectionId: "cls-p7a", type: "midterm", maxMarks: 100, weightPercentage: 50, date: "2026-09-23", term: "Term 2" }
];

export const INITIAL_MARKS: MarkEntry[] = [
  // --- P.1 Marks (Liam Kato, Gloria, Ethan, Divine) ---
  { id: "mrk-p1-01", assessmentId: "asm-p1-lug", studentId: "std-p1-01", marksObtained: 88, teacherComment: "Ayogera bulungi.", updatedAt: "2026-09-21" },
  { id: "mrk-p1-02", assessmentId: "asm-p1-eng", studentId: "std-p1-01", marksObtained: 85, teacherComment: "Good letter sounds.", updatedAt: "2026-09-22" },
  { id: "mrk-p1-03", assessmentId: "asm-p1-mtc", studentId: "std-p1-01", marksObtained: 92, teacherComment: "Very fast with counting sums.", updatedAt: "2026-09-23" },
  { id: "mrk-p1-04", assessmentId: "asm-p1-rdg", studentId: "std-p1-01", marksObtained: 87, teacherComment: "Reads short words fluently.", updatedAt: "2026-09-24" },
  { id: "mrk-p1-05", assessmentId: "asm-p1-lit1", studentId: "std-p1-01", marksObtained: 90, teacherComment: "Knows classroom items.", updatedAt: "2026-09-25" },
  { id: "mrk-p1-06", assessmentId: "asm-p1-lit2", studentId: "std-p1-01", marksObtained: 89, teacherComment: "Clean drawings.", updatedAt: "2026-09-26" },

  { id: "mrk-p1-11", assessmentId: "asm-p1-lug", studentId: "std-p1-02", marksObtained: 94, teacherComment: "Omuyizi omukazi ow'amaanyi mu Luganda.", updatedAt: "2026-09-21" },
  { id: "mrk-p1-12", assessmentId: "asm-p1-eng", studentId: "std-p1-02", marksObtained: 92, teacherComment: "Excellent phonics.", updatedAt: "2026-09-22" },
  { id: "mrk-p1-13", assessmentId: "asm-p1-mtc", studentId: "std-p1-02", marksObtained: 95, teacherComment: "Accurate number writing.", updatedAt: "2026-09-23" },
  { id: "mrk-p1-14", assessmentId: "asm-p1-rdg", studentId: "std-p1-02", marksObtained: 96, teacherComment: "Top reader in class.", updatedAt: "2026-09-24" },
  { id: "mrk-p1-15", assessmentId: "asm-p1-lit1", studentId: "std-p1-02", marksObtained: 95, teacherComment: "Neat handwriting.", updatedAt: "2026-09-25" },
  { id: "mrk-p1-16", assessmentId: "asm-p1-lit2", studentId: "std-p1-02", marksObtained: 93, teacherComment: "Knows healthy habits.", updatedAt: "2026-09-26" },

  { id: "mrk-p1-21", assessmentId: "asm-p1-lug", studentId: "std-p1-03", marksObtained: 78, teacherComment: "Needs guidance on letter forms.", updatedAt: "2026-09-21" },
  { id: "mrk-p1-22", assessmentId: "asm-p1-eng", studentId: "std-p1-03", marksObtained: 80, teacherComment: "Good vocal response.", updatedAt: "2026-09-22" },
  { id: "mrk-p1-23", assessmentId: "asm-p1-mtc", studentId: "std-p1-03", marksObtained: 84, teacherComment: "Good counting.", updatedAt: "2026-09-23" },
  { id: "mrk-p1-24", assessmentId: "asm-p1-rdg", studentId: "std-p1-03", marksObtained: 76, teacherComment: "Practice reading every evening.", updatedAt: "2026-09-24" },
  { id: "mrk-p1-25", assessmentId: "asm-p1-lit1", studentId: "std-p1-03", marksObtained: 82, teacherComment: "Participates cheerfully.", updatedAt: "2026-09-25" },
  { id: "mrk-p1-26", assessmentId: "asm-p1-lit2", studentId: "std-p1-03", marksObtained: 80, teacherComment: "Enjoys outdoor learning.", updatedAt: "2026-09-26" },

  { id: "mrk-p1-31", assessmentId: "asm-p1-lug", studentId: "std-p1-04", marksObtained: 90, teacherComment: "Awandiika bulungi.", updatedAt: "2026-09-21" },
  { id: "mrk-p1-32", assessmentId: "asm-p1-eng", studentId: "std-p1-04", marksObtained: 89, teacherComment: "Great vocabulary.", updatedAt: "2026-09-22" },
  { id: "mrk-p1-33", assessmentId: "asm-p1-mtc", studentId: "std-p1-04", marksObtained: 88, teacherComment: "Good recognition of shapes.", updatedAt: "2026-09-23" },
  { id: "mrk-p1-34", assessmentId: "asm-p1-rdg", studentId: "std-p1-04", marksObtained: 91, teacherComment: "Very clear voice.", updatedAt: "2026-09-24" },
  { id: "mrk-p1-35", assessmentId: "asm-p1-lit1", studentId: "std-p1-04", marksObtained: 92, teacherComment: "Knows our family members well.", updatedAt: "2026-09-25" },
  { id: "mrk-p1-36", assessmentId: "asm-p1-lit2", studentId: "std-p1-04", marksObtained: 91, teacherComment: "Neat shading.", updatedAt: "2026-09-26" },

  // --- P.2 Marks (Trevor, Blessing, Joshua, Chloe) ---
  { id: "mrk-p2-01", assessmentId: "asm-p2-lug01", studentId: "std-p2-01", marksObtained: 91, teacherComment: "Ayogera era awandiika bulungi Oluganda.", updatedAt: "2026-09-20" },
  { id: "mrk-p2-02", assessmentId: "asm-p2-eng01", studentId: "std-p2-01", marksObtained: 88, teacherComment: "Very clear letter blending.", updatedAt: "2026-09-21" },
  { id: "mrk-p2-03", assessmentId: "asm-p2-mtc01", studentId: "std-p2-01", marksObtained: 94, teacherComment: "Fast counting with bottle tops.", updatedAt: "2026-09-22" },
  { id: "mrk-p2-04", assessmentId: "asm-p2-read01", studentId: "std-p2-01", marksObtained: 89, teacherComment: "Expressive oral reader.", updatedAt: "2026-09-23" },
  { id: "mrk-p2-05", assessmentId: "asm-p2-lit1-01", studentId: "std-p2-01", marksObtained: 92, teacherComment: "Knows community helpers well.", updatedAt: "2026-09-24" },
  { id: "mrk-p2-06", assessmentId: "asm-p2-lit2-01", studentId: "std-p2-01", marksObtained: 90, teacherComment: "Practices good hygiene habits.", updatedAt: "2026-09-25" },

  { id: "mrk-p2-11", assessmentId: "asm-p2-lug01", studentId: "std-p2-02", marksObtained: 98, teacherComment: "Asoma bulungi nnyo ennyingo z'Oluganda.", updatedAt: "2026-09-20" },
  { id: "mrk-p2-12", assessmentId: "asm-p2-eng01", studentId: "std-p2-02", marksObtained: 96, teacherComment: "Top reading marks.", updatedAt: "2026-09-21" },
  { id: "mrk-p2-13", assessmentId: "asm-p2-mtc01", studentId: "std-p2-02", marksObtained: 95, teacherComment: "Accurate addition sums.", updatedAt: "2026-09-22" },
  { id: "mrk-p2-14", assessmentId: "asm-p2-read01", studentId: "std-p2-02", marksObtained: 98, teacherComment: "Fluent reader in both English and Luganda.", updatedAt: "2026-09-23" },
  { id: "mrk-p2-15", assessmentId: "asm-p2-lit1-01", studentId: "std-p2-02", marksObtained: 96, teacherComment: "Exemplary drawing and coloring.", updatedAt: "2026-09-24" },
  { id: "mrk-p2-16", assessmentId: "asm-p2-lit2-01", studentId: "std-p2-02", marksObtained: 94, teacherComment: "Knows body parts and safe clean water.", updatedAt: "2026-09-25" },

  { id: "mrk-p2-21", assessmentId: "asm-p2-lug01", studentId: "std-p2-03", marksObtained: 84, teacherComment: "Good progress in Luganda words.", updatedAt: "2026-09-20" },
  { id: "mrk-p2-22", assessmentId: "asm-p2-eng01", studentId: "std-p2-03", marksObtained: 82, teacherComment: "Clear sentence making.", updatedAt: "2026-09-21" },
  { id: "mrk-p2-23", assessmentId: "asm-p2-mtc01", studentId: "std-p2-03", marksObtained: 86, teacherComment: "Strong addition and subtraction.", updatedAt: "2026-09-22" },
  { id: "mrk-p2-24", assessmentId: "asm-p2-read01", studentId: "std-p2-03", marksObtained: 85, teacherComment: "Reads with enthusiasm.", updatedAt: "2026-09-23" },
  { id: "mrk-p2-25", assessmentId: "asm-p2-lit1-01", studentId: "std-p2-03", marksObtained: 88, teacherComment: "Good class interaction.", updatedAt: "2026-09-24" },
  { id: "mrk-p2-26", assessmentId: "asm-p2-lit2-01", studentId: "std-p2-03", marksObtained: 87, teacherComment: "Understands our domestic animals.", updatedAt: "2026-09-25" },

  { id: "mrk-p2-31", assessmentId: "asm-p2-lug01", studentId: "std-p2-04", marksObtained: 92, teacherComment: "Awuliriza era ayiga mangu.", updatedAt: "2026-09-20" },
  { id: "mrk-p2-32", assessmentId: "asm-p2-eng01", studentId: "std-p2-04", marksObtained: 91, teacherComment: "Expressive English speech.", updatedAt: "2026-09-21" },
  { id: "mrk-p2-33", assessmentId: "asm-p2-mtc01", studentId: "std-p2-04", marksObtained: 90, teacherComment: "Solid work on sets and values.", updatedAt: "2026-09-22" },
  { id: "mrk-p2-34", assessmentId: "asm-p2-read01", studentId: "std-p2-04", marksObtained: 93, teacherComment: "Loves storybooks.", updatedAt: "2026-09-23" },
  { id: "mrk-p2-35", assessmentId: "asm-p2-lit1-01", studentId: "std-p2-04", marksObtained: 91, teacherComment: "Draws very neatly.", updatedAt: "2026-09-24" },
  { id: "mrk-p2-36", assessmentId: "asm-p2-lit2-01", studentId: "std-p2-04", marksObtained: 90, teacherComment: "Knows personal hygiene well.", updatedAt: "2026-09-25" },

  // --- P.3 Marks ---
  { id: "mrk-p3-01", assessmentId: "asm-p3-lug", studentId: "std-p3-01", marksObtained: 89, teacherComment: "Alaga obunyiikivu obw'amaanyi.", updatedAt: "2026-09-20" },
  { id: "mrk-p3-02", assessmentId: "asm-p3-eng", studentId: "std-p3-01", marksObtained: 91, teacherComment: "Fluent reading and good vocabulary.", updatedAt: "2026-09-21" },
  { id: "mrk-p3-03", assessmentId: "asm-p3-mtc", studentId: "std-p3-01", marksObtained: 93, teacherComment: "Great mastery of multiplication tables.", updatedAt: "2026-09-22" },
  { id: "mrk-p3-04", assessmentId: "asm-p3-rdg", studentId: "std-p3-01", marksObtained: 90, teacherComment: "Strong comprehension of paragraphs.", updatedAt: "2026-09-23" },
  { id: "mrk-p3-05", assessmentId: "asm-p3-lit1", studentId: "std-p3-01", marksObtained: 92, teacherComment: "Explains our sub-county administration.", updatedAt: "2026-09-24" },
  { id: "mrk-p3-06", assessmentId: "asm-p3-lit2", studentId: "std-p3-01", marksObtained: 90, teacherComment: "Good understanding of soil and plants.", updatedAt: "2026-09-25" },

  { id: "mrk-p3-11", assessmentId: "asm-p3-lug", studentId: "std-p3-02", marksObtained: 95, teacherComment: "Asinga mu kuwandiika ennyingo.", updatedAt: "2026-09-20" },
  { id: "mrk-p3-12", assessmentId: "asm-p3-eng", studentId: "std-p3-02", marksObtained: 94, teacherComment: "Wonderful English composition.", updatedAt: "2026-09-21" },
  { id: "mrk-p3-13", assessmentId: "asm-p3-mtc", studentId: "std-p3-02", marksObtained: 96, teacherComment: "Excellent accuracy in division sums.", updatedAt: "2026-09-22" },
  { id: "mrk-p3-14", assessmentId: "asm-p3-rdg", studentId: "std-p3-02", marksObtained: 97, teacherComment: "Exceptional speed and tone.", updatedAt: "2026-09-23" },
  { id: "mrk-p3-15", assessmentId: "asm-p3-lit1", studentId: "std-p3-02", marksObtained: 95, teacherComment: "Clear understanding of environmental safety.", updatedAt: "2026-09-24" },
  { id: "mrk-p3-16", assessmentId: "asm-p3-lit2", studentId: "std-p3-02", marksObtained: 94, teacherComment: "Accurate animal habitat notes.", updatedAt: "2026-09-25" },

  { id: "mrk-p3-21", assessmentId: "asm-p3-lug", studentId: "std-p3-03", marksObtained: 85, teacherComment: "Kola nnyo ku nsonga z'ebiwandiiko.", updatedAt: "2026-09-20" },
  { id: "mrk-p3-22", assessmentId: "asm-p3-eng", studentId: "std-p3-03", marksObtained: 84, teacherComment: "Good effort in grammar exercises.", updatedAt: "2026-09-21" },
  { id: "mrk-p3-23", assessmentId: "asm-p3-mtc", studentId: "std-p3-03", marksObtained: 88, teacherComment: "Understands place values clearly.", updatedAt: "2026-09-22" },
  { id: "mrk-p3-24", assessmentId: "asm-p3-rdg", studentId: "std-p3-03", marksObtained: 86, teacherComment: "Reads with developing expression.", updatedAt: "2026-09-23" },
  { id: "mrk-p3-25", assessmentId: "asm-p3-lit1", studentId: "std-p3-03", marksObtained: 87, teacherComment: "Active learner in physical projects.", updatedAt: "2026-09-24" },
  { id: "mrk-p3-26", assessmentId: "asm-p3-lit2", studentId: "std-p3-03", marksObtained: 86, teacherComment: "Understands food hygiene well.", updatedAt: "2026-09-25" },

  { id: "mrk-p3-31", assessmentId: "asm-p3-lug", studentId: "std-p3-04", marksObtained: 92, teacherComment: "Awandiika n'omutindo omulungi.", updatedAt: "2026-09-20" },
  { id: "mrk-p3-32", assessmentId: "asm-p3-eng", studentId: "std-p3-04", marksObtained: 90, teacherComment: "Good spelling and reading aloud.", updatedAt: "2026-09-21" },
  { id: "mrk-p3-33", assessmentId: "asm-p3-mtc", studentId: "std-p3-04", marksObtained: 91, teacherComment: "Neat mathematical working.", updatedAt: "2026-09-22" },
  { id: "mrk-p3-34", assessmentId: "asm-p3-rdg", studentId: "std-p3-04", marksObtained: 93, teacherComment: "Reads stories to peers with poise.", updatedAt: "2026-09-23" },
  { id: "mrk-p3-35", assessmentId: "asm-p3-lit1", studentId: "std-p3-04", marksObtained: 92, teacherComment: "High knowledge of social services.", updatedAt: "2026-09-24" },
  { id: "mrk-p3-36", assessmentId: "asm-p3-lit2", studentId: "std-p3-04", marksObtained: 91, teacherComment: "Draws body systems carefully.", updatedAt: "2026-09-25" },

  // --- P.4 Marks (Upper Primary: English, SST, Science, Mathematics) ---
  { id: "mrk-p4-01", assessmentId: "asm-p4-eng", studentId: "std-p4-01", marksObtained: 88, teacherComment: "Good grammar and letter writing.", updatedAt: "2026-09-20" },
  { id: "mrk-p4-02", assessmentId: "asm-p4-sst", studentId: "std-p4-01", marksObtained: 86, teacherComment: "Understands district leadership well.", updatedAt: "2026-09-21" },
  { id: "mrk-p4-03", assessmentId: "asm-p4-sci", studentId: "std-p4-01", marksObtained: 92, teacherComment: "Mastery of plant germination concepts.", updatedAt: "2026-09-22" },
  { id: "mrk-p4-04", assessmentId: "asm-p4-mtc", studentId: "std-p4-01", marksObtained: 90, teacherComment: "Very fast calculations in fractions.", updatedAt: "2026-09-23" },

  { id: "mrk-p4-11", assessmentId: "asm-p4-eng", studentId: "std-p4-02", marksObtained: 96, teacherComment: "Distinction 1 level comprehension.", updatedAt: "2026-09-20" },
  { id: "mrk-p4-12", assessmentId: "asm-p4-sst", studentId: "std-p4-02", marksObtained: 94, teacherComment: "Detailed map drawing and symbols.", updatedAt: "2026-09-21" },
  { id: "mrk-p4-13", assessmentId: "asm-p4-sci", studentId: "std-p4-02", marksObtained: 95, teacherComment: "Star pupil in human hygiene science.", updatedAt: "2026-09-22" },
  { id: "mrk-p4-14", assessmentId: "asm-p4-mtc", studentId: "std-p4-02", marksObtained: 93, teacherComment: "Impeccable long division.", updatedAt: "2026-09-23" },

  { id: "mrk-p4-21", assessmentId: "asm-p4-eng", studentId: "std-p4-03", marksObtained: 79, teacherComment: "Review spelling of irregular verbs.", updatedAt: "2026-09-20" },
  { id: "mrk-p4-22", assessmentId: "asm-p4-sst", studentId: "std-p4-03", marksObtained: 83, teacherComment: "Good general knowledge of Uganda.", updatedAt: "2026-09-21" },
  { id: "mrk-p4-23", assessmentId: "asm-p4-sci", studentId: "std-p4-03", marksObtained: 81, teacherComment: "Practice scientific diagrams.", updatedAt: "2026-09-22" },
  { id: "mrk-p4-24", assessmentId: "asm-p4-mtc", studentId: "std-p4-03", marksObtained: 85, teacherComment: "Solid work on perimeter and area.", updatedAt: "2026-09-23" },

  { id: "mrk-p4-31", assessmentId: "asm-p4-eng", studentId: "std-p4-04", marksObtained: 91, teacherComment: "Creative storytelling.", updatedAt: "2026-09-20" },
  { id: "mrk-p4-32", assessmentId: "asm-p4-sst", studentId: "std-p4-04", marksObtained: 90, teacherComment: "Solid understanding of climate.", updatedAt: "2026-09-21" },
  { id: "mrk-p4-33", assessmentId: "asm-p4-sci", studentId: "std-p4-04", marksObtained: 89, teacherComment: "Understands pollination and bees.", updatedAt: "2026-09-22" },
  { id: "mrk-p4-34", assessmentId: "asm-p4-mtc", studentId: "std-p4-04", marksObtained: 91, teacherComment: "Good accuracy in algebra basics.", updatedAt: "2026-09-23" },

  // --- P.5 Marks (Leo Davis, Maya Rostova, Julian, Sophia, Liam, Emma) ---
  { id: "mrk-01", assessmentId: "asm-m01", studentId: "std-001", marksObtained: 94, teacherComment: "Distinction 1 performance in algebra & geometry.", updatedAt: "2026-09-23" },
  { id: "mrk-03", assessmentId: "asm-e01", studentId: "std-001", marksObtained: 88, teacherComment: "Very good grammar & comprehension.", updatedAt: "2026-09-24" },
  { id: "mrk-05", assessmentId: "asm-s01", studentId: "std-001", marksObtained: 92, teacherComment: "Understands digestive system thoroughly.", updatedAt: "2026-09-25" },
  { id: "mrk-07", assessmentId: "asm-sst01", studentId: "std-001", marksObtained: 90, teacherComment: "High civic knowledge of East African community.", updatedAt: "2026-09-22" },

  { id: "mrk-11", assessmentId: "asm-m01", studentId: "std-002", marksObtained: 99, teacherComment: "Outstanding numeracy across all sections.", updatedAt: "2026-09-23" },
  { id: "mrk-13", assessmentId: "asm-e01", studentId: "std-002", marksObtained: 97, teacherComment: "Eloquent prose and faultless punctuation.", updatedAt: "2026-09-24" },
  { id: "mrk-15", assessmentId: "asm-s01", studentId: "std-002", marksObtained: 98, teacherComment: "Star junior scientist.", updatedAt: "2026-09-25" },
  { id: "mrk-17", assessmentId: "asm-sst01", studentId: "std-002", marksObtained: 98, teacherComment: "Exemplary understanding of trade and minerals.", updatedAt: "2026-09-22" },

  { id: "mrk-21", assessmentId: "asm-m01", studentId: "std-003", marksObtained: 68, teacherComment: "Remedial clinic arranged for division & fractions.", updatedAt: "2026-09-23" },
  { id: "mrk-23", assessmentId: "asm-e01", studentId: "std-003", marksObtained: 94, teacherComment: "Brilliant creative writing and vocabulary.", updatedAt: "2026-09-24" },
  { id: "mrk-25", assessmentId: "asm-s01", studentId: "std-003", marksObtained: 75, teacherComment: "Good general science concepts.", updatedAt: "2026-09-25" },
  { id: "mrk-27", assessmentId: "asm-sst01", studentId: "std-003", marksObtained: 86, teacherComment: "Great participation in civic debates.", updatedAt: "2026-09-22" },

  { id: "mrk-31", assessmentId: "asm-m01", studentId: "std-004", marksObtained: 88, teacherComment: "Consistent and methodical.", updatedAt: "2026-09-23" },
  { id: "mrk-32", assessmentId: "asm-e01", studentId: "std-004", marksObtained: 90, teacherComment: "High reading accuracy.", updatedAt: "2026-09-24" },
  { id: "mrk-33", assessmentId: "asm-s01", studentId: "std-004", marksObtained: 89, teacherComment: "Neat diagrammatic representations.", updatedAt: "2026-09-25" },
  { id: "mrk-34", assessmentId: "asm-sst01", studentId: "std-004", marksObtained: 88, teacherComment: "Understands vegetation zones.", updatedAt: "2026-09-22" },

  { id: "mrk-41", assessmentId: "asm-m01", studentId: "std-005", marksObtained: 93, teacherComment: "Quick in mental calculations.", updatedAt: "2026-09-23" },
  { id: "mrk-42", assessmentId: "asm-e01", studentId: "std-005", marksObtained: 86, teacherComment: "Steady writing style.", updatedAt: "2026-09-24" },
  { id: "mrk-43", assessmentId: "asm-s01", studentId: "std-005", marksObtained: 94, teacherComment: "Keen observer during experiments.", updatedAt: "2026-09-25" },
  { id: "mrk-44", assessmentId: "asm-sst01", studentId: "std-005", marksObtained: 91, teacherComment: "Good recall of transport networks.", updatedAt: "2026-09-22" },

  { id: "mrk-51", assessmentId: "asm-m01", studentId: "std-006", marksObtained: 85, teacherComment: "Good mathematical reasoning.", updatedAt: "2026-09-23" },
  { id: "mrk-52", assessmentId: "asm-e01", studentId: "std-006", marksObtained: 92, teacherComment: "Strong essay organization.", updatedAt: "2026-09-24" },
  { id: "mrk-53", assessmentId: "asm-s01", studentId: "std-006", marksObtained: 84, teacherComment: "Active during health science discussions.", updatedAt: "2026-09-25" },
  { id: "mrk-54", assessmentId: "asm-sst01", studentId: "std-006", marksObtained: 87, teacherComment: "High awareness of environmental conservation.", updatedAt: "2026-09-22" },

  // --- P.6 Marks ---
  { id: "mrk-p6-01", assessmentId: "asm-p6-eng", studentId: "std-p6-01", marksObtained: 91, teacherComment: "Good mastery of formal letter writing.", updatedAt: "2026-09-20" },
  { id: "mrk-p6-02", assessmentId: "asm-p6-sst", studentId: "std-p6-01", marksObtained: 89, teacherComment: "Deep knowledge of East African natural resources.", updatedAt: "2026-09-21" },
  { id: "mrk-p6-03", assessmentId: "asm-p6-sci", studentId: "std-p6-01", marksObtained: 93, teacherComment: "Exemplary physics of light & sound.", updatedAt: "2026-09-22" },
  { id: "mrk-p6-04", assessmentId: "asm-p6-mtc", studentId: "std-p6-01", marksObtained: 92, teacherComment: "Solid algebra and commercial arithmetic.", updatedAt: "2026-09-23" },

  { id: "mrk-p6-11", assessmentId: "asm-p6-eng", studentId: "std-p6-02", marksObtained: 97, teacherComment: "Exceptional language command.", updatedAt: "2026-09-20" },
  { id: "mrk-p6-12", assessmentId: "asm-p6-sst", studentId: "std-p6-02", marksObtained: 95, teacherComment: "Precise answers on colonial history.", updatedAt: "2026-09-21" },
  { id: "mrk-p6-13", assessmentId: "asm-p6-sci", studentId: "std-p6-02", marksObtained: 96, teacherComment: "Top performer in circulatory system questions.", updatedAt: "2026-09-22" },
  { id: "mrk-p6-14", assessmentId: "asm-p6-mtc", studentId: "std-p6-02", marksObtained: 94, teacherComment: "Accurate geometrical construction.", updatedAt: "2026-09-23" },

  { id: "mrk-p6-21", assessmentId: "asm-p6-eng", studentId: "std-p6-03", marksObtained: 83, teacherComment: "Practice reading comprehension passages.", updatedAt: "2026-09-20" },
  { id: "mrk-p6-22", assessmentId: "asm-p6-sst", studentId: "std-p6-03", marksObtained: 87, teacherComment: "Good grasp of democratic institutions.", updatedAt: "2026-09-21" },
  { id: "mrk-p6-23", assessmentId: "asm-p6-sci", studentId: "std-p6-03", marksObtained: 85, teacherComment: "Needs more care with classification keys.", updatedAt: "2026-09-22" },
  { id: "mrk-p6-24", assessmentId: "asm-p6-mtc", studentId: "std-p6-03", marksObtained: 88, teacherComment: "Shows steady mathematical logic.", updatedAt: "2026-09-23" },

  { id: "mrk-p6-31", assessmentId: "asm-p6-eng", studentId: "std-p6-04", marksObtained: 92, teacherComment: "Strong writing style.", updatedAt: "2026-09-20" },
  { id: "mrk-p6-32", assessmentId: "asm-p6-sst", studentId: "std-p6-04", marksObtained: 91, teacherComment: "Accurate physical geography.", updatedAt: "2026-09-21" },
  { id: "mrk-p6-33", assessmentId: "asm-p6-sci", studentId: "std-p6-04", marksObtained: 90, teacherComment: "Good work on electrical circuits.", updatedAt: "2026-09-22" },
  { id: "mrk-p6-34", assessmentId: "asm-p6-mtc", studentId: "std-p6-04", marksObtained: 91, teacherComment: "Very clean step-by-step solutions.", updatedAt: "2026-09-23" },

  // --- P.7 Candidates (Precious, Daniel, Martha, Brian) ---
  { id: "mrk-p7-01", assessmentId: "asm-p7-eng", studentId: "std-p7-01", marksObtained: 96, teacherComment: "Distinction 1 (D1) in English. Top candidate.", updatedAt: "2026-09-20" },
  { id: "mrk-p7-02", assessmentId: "asm-p7-sst", studentId: "std-p7-01", marksObtained: 94, teacherComment: "Distinction 1 (D1) in SST. Superb civic knowledge.", updatedAt: "2026-09-21" },
  { id: "mrk-p7-03", assessmentId: "asm-p7-sci", studentId: "std-p7-01", marksObtained: 97, teacherComment: "Distinction 1 (D1) in Science. Excellent experimental logic.", updatedAt: "2026-09-22" },
  { id: "mrk-p7-04", assessmentId: "asm-p7-mtc", studentId: "std-p7-01", marksObtained: 98, teacherComment: "Distinction 1 (D1) in Math. Total Aggregate 4 (Division 1).", updatedAt: "2026-09-23" },

  { id: "mrk-p7-11", assessmentId: "asm-p7-eng", studentId: "std-p7-02", marksObtained: 91, teacherComment: "Distinction 1 (D1). Eloquent prose.", updatedAt: "2026-09-20" },
  { id: "mrk-p7-12", assessmentId: "asm-p7-sst", studentId: "std-p7-02", marksObtained: 89, teacherComment: "Distinction 2 (D2). Very strong map analysis.", updatedAt: "2026-09-21" },
  { id: "mrk-p7-13", assessmentId: "asm-p7-sci", studentId: "std-p7-02", marksObtained: 92, teacherComment: "Distinction 1 (D1). Clear physiological diagrams.", updatedAt: "2026-09-22" },
  { id: "mrk-p7-14", assessmentId: "asm-p7-mtc", studentId: "std-p7-02", marksObtained: 93, teacherComment: "Distinction 1 (D1). Total Aggregate 5 (Division 1).", updatedAt: "2026-09-23" },

  { id: "mrk-p7-21", assessmentId: "asm-p7-eng", studentId: "std-p7-03", marksObtained: 88, teacherComment: "Distinction 2 (D2). Good formal letter phrasing.", updatedAt: "2026-09-20" },
  { id: "mrk-p7-22", assessmentId: "asm-p7-sst", studentId: "std-p7-03", marksObtained: 86, teacherComment: "Distinction 2 (D2). Broad understanding of Pan-Africanism.", updatedAt: "2026-09-21" },
  { id: "mrk-p7-23", assessmentId: "asm-p7-sci", studentId: "std-p7-03", marksObtained: 89, teacherComment: "Distinction 2 (D2). Good understanding of energy and machines.", updatedAt: "2026-09-22" },
  { id: "mrk-p7-24", assessmentId: "asm-p7-mtc", studentId: "std-p7-03", marksObtained: 90, teacherComment: "Distinction 1 (D1). Total Aggregate 7 (Division 1).", updatedAt: "2026-09-23" },

  { id: "mrk-p7-31", assessmentId: "asm-p7-eng", studentId: "std-p7-04", marksObtained: 82, teacherComment: "Distinction 2 (D2). Well structured responses.", updatedAt: "2026-09-20" },
  { id: "mrk-p7-32", assessmentId: "asm-p7-sst", studentId: "std-p7-04", marksObtained: 84, teacherComment: "Distinction 2 (D2). Good recall of national budget.", updatedAt: "2026-09-21" },
  { id: "mrk-p7-33", assessmentId: "asm-p7-sci", studentId: "std-p7-04", marksObtained: 86, teacherComment: "Distinction 2 (D2). Clear understanding of ecology.", updatedAt: "2026-09-22" },
  { id: "mrk-p7-34", assessmentId: "asm-p7-mtc", studentId: "std-p7-04", marksObtained: 85, teacherComment: "Distinction 2 (D2). Total Aggregate 8 (Division 1).", updatedAt: "2026-09-23" }
];

export const generateInitialAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const dates = [
    "2026-09-14", "2026-09-15", "2026-09-16", "2026-09-17", "2026-09-18",
    "2026-09-21", "2026-09-22", "2026-09-23", "2026-09-24", "2026-09-25",
    "2026-09-26", "2026-09-27"
  ];

  let idCounter = 1;

  dates.forEach((date) => {
    INITIAL_STUDENTS.forEach((student) => {
      let status: 'present' | 'absent' | 'late' | 'excused' = 'present';
      let note: string | undefined = undefined;

      if (student.id === "std-001") {
        if (date === "2026-09-18") {
          status = "excused";
          note = "Parent submitted pediatric dental clinic slip.";
        } else if (date === "2026-09-24") {
          status = "late";
          note = "School van traffic delay, arrived 8:15 AM";
        }
      } else if (student.id === "std-003" && date === "2026-09-22") {
        status = "absent";
        note = "Unnotified absence - homeroom teacher followed up.";
      } else if (student.id === "std-p2-03" && date === "2026-09-25") {
        status = "late";
        note = "Rainy morning transport delay.";
      }

      records.push({
        id: `att-rec-${idCounter++}`,
        studentId: student.id,
        date,
        status,
        note,
        recordedBy: "Mrs. Catherine Nansubuga"
      });
    });
  });

  return records;
};

export const INITIAL_MESSAGES: CommunicationMessage[] = [
  {
    id: "msg-01",
    studentId: "std-001",
    senderId: "tch-catherine",
    senderName: "Mrs. Catherine Nansubuga",
    senderRole: "teacher",
    recipientId: "par-davis",
    recipientName: "Mr. & Mrs. Davis",
    subject: "Leo's Outstanding Mid-Term Mathematics Mark (94%)",
    message: "Dear Mr. & Mrs. Davis, Leo has performed exceptionally in our P.5 Mid-Term examinations, scoring 94% in Mathematics and 88% in English. His geometric diagrams were the neatest in class.",
    timestamp: "2026-09-24T14:30:00Z",
    read: false,
    category: "academic"
  },
  {
    id: "msg-02",
    studentId: "std-001",
    senderId: "par-davis",
    senderName: "Robert & Susan Davis",
    senderRole: "parent",
    recipientId: "tch-catherine",
    recipientName: "Mrs. Catherine Nansubuga",
    subject: "Re: Leo's Outstanding Mid-Term Mathematics Mark (94%)",
    message: "Thank you so much Mrs. Nansubuga! We have been doing daily flashcards at home. We also noticed the upcoming Primary Science nature excursion on Friday.",
    timestamp: "2026-09-24T16:15:00Z",
    read: true,
    category: "general"
  },
  {
    id: "msg-03",
    studentId: "std-003",
    senderId: "tch-catherine",
    senderName: "Mrs. Catherine Nansubuga",
    senderRole: "teacher",
    recipientId: "par-hayes",
    recipientName: "David & Claire Hayes",
    subject: "Julian's Mathematics Support & Progress Plan",
    message: "Dear Mr. & Mrs. Hayes, while Julian excelled in English (94%), he encountered challenges with division and fraction word problems (68%). We have scheduled a 20-minute morning clinic.",
    timestamp: "2026-09-25T11:00:00Z",
    read: false,
    isUrgent: true,
    category: "academic"
  }
];

export const INITIAL_NOTICES: SchoolNotice[] = [
  {
    id: "not-01",
    title: "Light Angels Primary School P.1 - P.7 Term 2 Mid-Year Examinations & Reports",
    content: "All subject teachers for P.1 - P.3 (Luganda, English, Math, Reading, Literacy 1 & 2) and P.4 - P.7 (English, SST, Science, Math) must finalize all mark entries into the academic portal before the upcoming Parent-Teacher Conference day.",
    date: "2026-09-26",
    author: "Sister Mary Goretti, Ph.D. - Head Teacher",
    priority: "urgent",
    targetAudience: "all"
  },
  {
    id: "not-02",
    title: "Upper Primary Inter-House Science & Innovations Fair",
    content: "Primary 4 to Primary 7 pupils will showcase their renewable energy, plant biology, and water conservation projects this Thursday in the Sunshine Quadrangle.",
    date: "2026-09-24",
    author: "Mr. Patrick Mukasa - Head of Science",
    priority: "important",
    targetAudience: "parents"
  },
  {
    id: "not-03",
    title: "Lower Primary (P.1 - P.3) Luganda Storytelling & Phonics Festival",
    content: "A celebration of cultural heritage, oral reading, and phonics for our Little Cherubs and Morning Stars next Friday morning. Parents are warmly invited.",
    date: "2026-09-22",
    author: "Mrs. Justine Namazzi - Lower Primary Coordinator",
    priority: "normal",
    targetAudience: "all"
  }
];

export const INITIAL_CONFERENCES: ConferenceBooking[] = [
  {
    id: "cnf-01",
    teacherName: "Mrs. Catherine Nansubuga",
    parentName: "Robert & Susan Davis",
    studentName: "Leo Davis Ssenyonjo",
    date: "2026-10-02",
    timeSlot: "14:00 - 14:20",
    mode: "In-person",
    status: "confirmed",
    notes: "Review Term 2 mid-term report card and accelerated math enrichment."
  },
  {
    id: "cnf-02",
    teacherName: "Mrs. Catherine Nansubuga",
    parentName: "David & Claire Hayes",
    studentName: "Julian Hayes Kigozi",
    date: "2026-10-02",
    timeSlot: "14:30 - 14:50",
    mode: "In-person",
    status: "confirmed",
    notes: "Discuss tailored arithmetic support plan and home study schedule."
  }
];
