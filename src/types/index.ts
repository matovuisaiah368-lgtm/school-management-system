export type Role = 'teacher' | 'parent' | 'admin' | 'student';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  grade: string;
  section: string;
  avatarUrl: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  dateOfBirth: string;
  address: string;
  enrollmentDate: string;
}

export interface ClassSection {
  id: string;
  grade: string;
  section: string;
  name: string;
  room: string;
  classTeacher: string;
  academicYear: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacher: string;
  credits: number;
  applicableGrades: ('P.1' | 'P.2' | 'P.3' | 'P.4' | 'P.5' | 'P.6' | 'P.7')[];
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  note?: string;
  recordedBy: string;
}

export type AssessmentType = 'quiz' | 'homework' | 'midterm' | 'project' | 'final_exam';

export interface Assessment {
  id: string;
  title: string;
  subjectId: string;
  classSectionId: string;
  type: AssessmentType;
  maxMarks: number;
  weightPercentage: number;
  date: string;
  term: 'Term 1' | 'Term 2' | 'Final Term';
}

export interface MarkEntry {
  id: string;
  assessmentId: string;
  studentId: string;
  marksObtained: number;
  teacherComment?: string;
  updatedAt: string;
}

export interface CommunicationMessage {
  id: string;
  studentId: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  recipientId: string;
  recipientName: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
  isUrgent?: boolean;
  category: 'attendance' | 'academic' | 'conduct' | 'general';
}

export interface SchoolNotice {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  priority: 'normal' | 'important' | 'urgent';
  targetAudience: 'all' | 'parents' | 'teachers' | 'students';
}

export interface ConferenceBooking {
  id: string;
  teacherName: string;
  parentName: string;
  studentName: string;
  date: string;
  timeSlot: string;
  mode: 'In-person' | 'Virtual Video';
  status: 'confirmed' | 'requested' | 'completed';
  notes: string;
}

export interface StudentProgressReportData {
  student: Student;
  term: string;
  academicYear: string;
  attendanceRate: number;
  totalSchoolDays: number;
  daysPresent: number;
  daysAbsent: number;
  daysLate: number;
  gpa: number;
  overallPercentage: number;
  totalMarksScored: number;
  maxPossibleTotal: number;
  gradingMethod: 'uneb_scale' | 'total_marks';
  lowerPrimaryGrade?: 'Grade I' | 'Grade II' | 'Grade III' | 'Grade IV' | 'Grade U';
  lowerPrimaryGradeLabel?: string;
  lowerPrimaryDescriptor?: string;
  classRank: number;
  totalStudentsInClass: number;
  aggregates?: number;
  aggregateBreakdown?: string;
  division?: string;
  subjectReports: {
    subject: Subject;
    score: number;
    letterGrade: string;
    unebGrade?: 'D1' | 'D2' | 'C3' | 'C4' | 'C5' | 'C6' | 'P7' | 'P8' | 'F9';
    gpaPoint: number;
    classAverage: number;
    teacherComment: string;
  }[];
  automatedSummary: string;
  strengths: string[];
  growthAreas: string[];
  behavioralEvaluation: {
    punctuality: 'Exemplary' | 'Proficient' | 'Developing' | 'Needs Improvement';
    classroomEngagement: 'Exemplary' | 'Proficient' | 'Developing' | 'Needs Improvement';
    peerCollaboration: 'Exemplary' | 'Proficient' | 'Developing' | 'Needs Improvement';
    assignmentDiscipline: 'Exemplary' | 'Proficient' | 'Developing' | 'Needs Improvement';
  };
  homeroomRemarks: string;
  principalRemarks: string;
}
