import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Student,
  ClassSection,
  Subject,
  AttendanceRecord,
  AttendanceStatus,
  Assessment,
  MarkEntry,
  CommunicationMessage,
  SchoolNotice,
  ConferenceBooking,
  Role,
  StudentProgressReportData
} from '../types';
import {
  INITIAL_SCHOOL_INFO,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_STUDENTS,
  INITIAL_ASSESSMENTS,
  INITIAL_MARKS,
  generateInitialAttendance,
  INITIAL_MESSAGES,
  INITIAL_NOTICES,
  INITIAL_CONFERENCES
} from '../data/mockData';
import { 
  getUgandanGrade, 
  calculateUgandanDivision, 
  getLowerPrimaryCompetence,
  getLowerPrimaryTotalGrade,
  isUpperPrimary,
  isLowerPrimary
} from '../utils/grading';

export interface AttendanceSummary {
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  ratePercentage: number;
  statusLevel: 'Exemplary' | 'Good' | 'At Risk' | 'Critical';
}

export interface StudentAcademicSummary {
  student: Student;
  subjectScores: {
    subjectId: string;
    subjectName: string;
    scorePercentage: number;
    letterGrade: string;
    unebGrade: 'D1' | 'D2' | 'C3' | 'C4' | 'C5' | 'C6' | 'P7' | 'P8' | 'F9';
    points: number;
    gpaPoint: number;
    assessmentsCount: number;
  }[];
  overallPercentage: number;
  totalMarksScored: number;
  maxPossibleTotal: number;
  gradingMethod: 'uneb_scale' | 'total_marks';
  lowerPrimaryGrade?: 'Grade I' | 'Grade II' | 'Grade III' | 'Grade IV' | 'Grade U';
  lowerPrimaryGradeLabel?: string;
  lowerPrimaryDescriptor?: string;
  gpa: number;
  classRank: number;
  totalInCohort: number;
  aggregates?: number;
  aggregateBreakdown?: string;
  division?: string;
  attendanceSummary: AttendanceSummary;
  riskStatus: 'Honors' | 'Good Standing' | 'Academic Warning' | 'Attendance Warning';
}

interface SchoolContextType {
  schoolInfo: typeof INITIAL_SCHOOL_INFO;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  classes: ClassSection[];
  selectedClassId: string;
  setSelectedClassId: (id: string) => void;
  subjects: Subject[];
  students: Student[];
  assessments: Assessment[];
  marks: MarkEntry[];
  attendance: AttendanceRecord[];
  messages: CommunicationMessage[];
  notices: SchoolNotice[];
  conferences: ConferenceBooking[];

  // Student management
  addStudent: (student: Omit<Student, 'id'>) => void;
  deleteStudent: (studentId: string) => void;

  // Attendance actions
  setStudentAttendance: (studentId: string, date: string, status: AttendanceStatus, note?: string) => void;
  markAllAttendance: (date: string, status: AttendanceStatus) => void;
  getStudentAttendanceSummary: (studentId: string) => AttendanceSummary;
  getStudentAttendanceForDate: (studentId: string, date: string) => AttendanceRecord | undefined;

  // Gradebook actions
  updateMark: (assessmentId: string, studentId: string, marksObtained: number, teacherComment?: string) => void;
  bulkUpdateMarks: (entries: { assessmentId: string; studentId: string; marksObtained: number; teacherComment?: string }[]) => void;
  addAssessment: (assessment: Omit<Assessment, 'id'>) => Assessment;
  deleteAssessment: (assessmentId: string) => void;
  getStudentMarkForAssessment: (studentId: string, assessmentId: string) => MarkEntry | undefined;
  getSubjectAverage: (subjectId: string) => number;
  
  // Computed analytics
  academicSummaries: StudentAcademicSummary[];
  getStudentProgressReport: (studentId: string) => StudentProgressReportData | null;

  // Messaging & notices
  sendMessage: (msg: Omit<CommunicationMessage, 'id' | 'timestamp' | 'read'>) => void;
  markMessageRead: (messageId: string) => void;
  addNotice: (notice: Omit<SchoolNotice, 'id'>) => void;
  bookConference: (booking: Omit<ConferenceBooking, 'id'>) => void;

  // Reset or quick seed
  resetToDefault: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'light_angels_primary_v3_';

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<Role>('teacher');
  const [selectedClassId, setSelectedClassId] = useState<string>('cls-p5a');

  // Load from local storage or defaults
  const [classes] = useState<ClassSection[]>(INITIAL_CLASSES);
  const [subjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}students`);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [assessments, setAssessments] = useState<Assessment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}assessments`);
    return saved ? JSON.parse(saved) : INITIAL_ASSESSMENTS;
  });

  const [marks, setMarks] = useState<MarkEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}marks`);
    return saved ? JSON.parse(saved) : INITIAL_MARKS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}attendance`);
    return saved ? JSON.parse(saved) : generateInitialAttendance();
  });

  const [messages, setMessages] = useState<CommunicationMessage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}messages`);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [notices, setNotices] = useState<SchoolNotice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}notices`);
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [conferences, setConferences] = useState<ConferenceBooking[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}conferences`);
    return saved ? JSON.parse(saved) : INITIAL_CONFERENCES;
  });

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}students`, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}assessments`, JSON.stringify(assessments));
  }, [assessments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}marks`, JSON.stringify(marks));
  }, [marks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}attendance`, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}messages`, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}notices`, JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}conferences`, JSON.stringify(conferences));
  }, [conferences]);

  // Student management
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newId = `std-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newStudent: Student = {
      ...studentData,
      id: newId
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  const deleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    setMarks((prev) => prev.filter((m) => m.studentId !== studentId));
    setAttendance((prev) => prev.filter((a) => a.studentId !== studentId));
  };

  // Attendance helpers
  const getStudentAttendanceForDate = (studentId: string, date: string) => {
    return attendance.find((a) => a.studentId === studentId && a.date === date);
  };

  const getStudentAttendanceSummary = (studentId: string): AttendanceSummary => {
    const records = attendance.filter((a) => a.studentId === studentId);
    const totalDays = records.length || 1;
    const present = records.filter((r) => r.status === 'present').length;
    const absent = records.filter((r) => r.status === 'absent').length;
    const late = records.filter((r) => r.status === 'late').length;
    const excused = records.filter((r) => r.status === 'excused').length;

    const effectivePresent = present + excused + (late * 0.8);
    const ratePercentage = Math.round((effectivePresent / totalDays) * 100);

    let statusLevel: AttendanceSummary['statusLevel'] = 'Good';
    if (ratePercentage >= 95) statusLevel = 'Exemplary';
    else if (ratePercentage >= 88) statusLevel = 'Good';
    else if (ratePercentage >= 80) statusLevel = 'At Risk';
    else statusLevel = 'Critical';

    return {
      totalDays,
      present,
      absent,
      late,
      excused,
      ratePercentage,
      statusLevel
    };
  };

  const setStudentAttendance = (studentId: string, date: string, status: AttendanceStatus, note?: string) => {
    setAttendance((prev) => {
      const idx = prev.findIndex((a) => a.studentId === studentId && a.date === date);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          status,
          note: note !== undefined ? note : updated[idx].note,
          recordedBy: 'Mrs. Catherine Nansubuga'
        };
        return updated;
      } else {
        const newRecord: AttendanceRecord = {
          id: `att-manual-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          studentId,
          date,
          status,
          note,
          recordedBy: 'Mrs. Catherine Nansubuga'
        };
        return [...prev, newRecord];
      }
    });
  };

  const markAllAttendance = (date: string, status: AttendanceStatus) => {
    setAttendance((prev) => {
      const updated = [...prev];
      students.forEach((student) => {
        const idx = updated.findIndex((a) => a.studentId === student.id && a.date === date);
        if (idx >= 0) {
          updated[idx] = {
            ...updated[idx],
            status,
            recordedBy: 'Mrs. Catherine Nansubuga'
          };
        } else {
          updated.push({
            id: `att-bulk-${Date.now()}-${student.id}`,
            studentId: student.id,
            date,
            status,
            recordedBy: 'Mrs. Catherine Nansubuga'
          });
        }
      });
      return updated;
    });
  };

  // Grade helper
  const calculateLetterAndGpa = (percentage: number): { letter: string; gpa: number } => {
    if (percentage >= 97) return { letter: 'A+', gpa: 4.0 };
    if (percentage >= 93) return { letter: 'A', gpa: 4.0 };
    if (percentage >= 90) return { letter: 'A-', gpa: 3.7 };
    if (percentage >= 87) return { letter: 'B+', gpa: 3.3 };
    if (percentage >= 83) return { letter: 'B', gpa: 3.0 };
    if (percentage >= 80) return { letter: 'B-', gpa: 2.7 };
    if (percentage >= 77) return { letter: 'C+', gpa: 2.3 };
    if (percentage >= 73) return { letter: 'C', gpa: 2.0 };
    if (percentage >= 70) return { letter: 'C-', gpa: 1.7 };
    if (percentage >= 60) return { letter: 'D', gpa: 1.0 };
    return { letter: 'F', gpa: 0.0 };
  };

  const getStudentMarkForAssessment = (studentId: string, assessmentId: string) => {
    return marks.find((m) => m.studentId === studentId && m.assessmentId === assessmentId);
  };

  const updateMark = (assessmentId: string, studentId: string, marksObtained: number, teacherComment?: string) => {
    setMarks((prev) => {
      const idx = prev.findIndex((m) => m.assessmentId === assessmentId && m.studentId === studentId);
      const nowStr = new Date().toISOString().slice(0, 10);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          marksObtained,
          teacherComment: teacherComment !== undefined ? teacherComment : updated[idx].teacherComment,
          updatedAt: nowStr
        };
        return updated;
      } else {
        const newEntry: MarkEntry = {
          id: `mrk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          assessmentId,
          studentId,
          marksObtained,
          teacherComment,
          updatedAt: nowStr
        };
        return [...prev, newEntry];
      }
    });
  };

  const bulkUpdateMarks = (entries: { assessmentId: string; studentId: string; marksObtained: number; teacherComment?: string }[]) => {
    setMarks((prev) => {
      const updated = [...prev];
      const nowStr = new Date().toISOString().slice(0, 10);
      entries.forEach((item) => {
        const idx = updated.findIndex((m) => m.assessmentId === item.assessmentId && m.studentId === item.studentId);
        if (idx >= 0) {
          updated[idx] = {
            ...updated[idx],
            marksObtained: item.marksObtained,
            teacherComment: item.teacherComment !== undefined ? item.teacherComment : updated[idx].teacherComment,
            updatedAt: nowStr
          };
        } else {
          updated.push({
            id: `mrk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            assessmentId: item.assessmentId,
            studentId: item.studentId,
            marksObtained: item.marksObtained,
            teacherComment: item.teacherComment,
            updatedAt: nowStr
          });
        }
      });
      return updated;
    });
  };

  const addAssessment = (assessmentData: Omit<Assessment, 'id'>): Assessment => {
    const newId = `asm-${Date.now()}`;
    const newAsm: Assessment = { ...assessmentData, id: newId };
    setAssessments((prev) => [...prev, newAsm]);

    // Pre-populate mock default marks for all students in that class
    const classStudents = students.filter((std) => {
      const cls = classes.find((c) => c.id === assessmentData.classSectionId);
      return cls ? std.grade === cls.grade : true;
    });

    const initialMarkEntries: MarkEntry[] = classStudents.map((std) => ({
      id: `mrk-${Date.now()}-${std.id}`,
      assessmentId: newId,
      studentId: std.id,
      marksObtained: Math.round(newAsm.maxMarks * 0.8),
      teacherComment: "Satisfactory work.",
      updatedAt: new Date().toISOString().slice(0, 10)
    }));

    setMarks((prev) => [...prev, ...initialMarkEntries]);
    return newAsm;
  };

  const deleteAssessment = (assessmentId: string) => {
    setAssessments((prev) => prev.filter((a) => a.id !== assessmentId));
    setMarks((prev) => prev.filter((m) => m.assessmentId !== assessmentId));
  };

  const getSubjectAverage = (subjectId: string): number => {
    const subjectAssessments = assessments.filter((a) => a.subjectId === subjectId);
    if (subjectAssessments.length === 0) return 85;

    let totalPct = 0;
    let count = 0;

    subjectAssessments.forEach((asm) => {
      const assessmentMarks = marks.filter((m) => m.assessmentId === asm.id);
      assessmentMarks.forEach((m) => {
        totalPct += (m.marksObtained / asm.maxMarks) * 100;
        count++;
      });
    });

    return count > 0 ? Math.round(totalPct / count) : 85;
  };

  // Compute Academic Summaries for all students filtered STRICTLY by student's applicable curriculum
  const academicSummaries: StudentAcademicSummary[] = useMemo(() => {
    const rawList = students.map((student) => {
      const attendanceSummary = getStudentAttendanceSummary(student.id);

      // Applicable subjects for this specific student's grade:
      // P.1 - P.3: Luganda, English, Math, Reading, Literacy One, Literacy 2
      // P.4 - P.7: English, SST, Science, Math
      const applicableSubjects = subjects.filter((sub) =>
        sub.applicableGrades.includes(student.grade as any)
      );

      const subjectScores = applicableSubjects.map((sub) => {
        const subAsms = assessments.filter((a) => a.subjectId === sub.id);
        
        let scorePercentage = 80;
        let count = 0;

        if (subAsms.length > 0) {
          let totalWeightedScore = 0;
          let totalWeight = 0;

          subAsms.forEach((asm) => {
            const entry = marks.find((m) => m.studentId === student.id && m.assessmentId === asm.id);
            if (entry) {
              const pct = (entry.marksObtained / asm.maxMarks) * 100;
              totalWeightedScore += pct * asm.weightPercentage;
              totalWeight += asm.weightPercentage;
              count++;
            }
          });

          if (totalWeight > 0) {
            scorePercentage = Math.round(totalWeightedScore / totalWeight);
          }
        }

        const { letter, gpa } = calculateLetterAndGpa(scorePercentage);
        const uneb = getUgandanGrade(scorePercentage);

        return {
          subjectId: sub.id,
          subjectName: sub.name,
          scorePercentage,
          letterGrade: letter,
          unebGrade: uneb.grade,
          points: uneb.points,
          gpaPoint: gpa,
          assessmentsCount: count
        };
      });

      // Overall average percentage and total marks
      const totalScoreSum = subjectScores.reduce((acc, curr) => acc + curr.scorePercentage, 0);
      const totalMarksScored = totalScoreSum;
      const maxPossibleTotal = applicableSubjects.length * 100;
      
      const overallPercentage = subjectScores.length > 0 
        ? Math.round(totalScoreSum / subjectScores.length) 
        : 80;
      
      const totalGpaSum = subjectScores.reduce((acc, curr) => acc + curr.gpaPoint, 0);
      const gpa = subjectScores.length > 0 
        ? Number((totalGpaSum / subjectScores.length).toFixed(2)) 
        : 3.0;

      const isUpper = isUpperPrimary(student.grade);
      const isLower = isLowerPrimary(student.grade);
      const gradingMethod: 'uneb_scale' | 'total_marks' = isUpper ? 'uneb_scale' : 'total_marks';

      // UNEB Aggregate & Division calculation for Upper Primary (P.4 - P.7)
      // Rule: For upper classes we add total grading for each subject to get aggregate
      let aggregates: number | undefined = undefined;
      let aggregateBreakdown: string | undefined = undefined;
      let division: string | undefined = undefined;
      
      if (isUpper && subjectScores.length > 0) {
        const unebResult = calculateUgandanDivision(
          subjectScores.map((s) => ({
            points: s.points,
            grade: s.unebGrade,
            subjectName: s.subjectName,
            score: s.scorePercentage
          }))
        );
        aggregates = unebResult.aggregate;
        aggregateBreakdown = unebResult.breakdown;
        division = unebResult.division;
      }

      // Lower Primary Total-Based Grade calculation (P.1 - P.3)
      let lowerPrimaryGrade: 'Grade I' | 'Grade II' | 'Grade III' | 'Grade IV' | 'Grade U' | undefined = undefined;
      let lowerPrimaryGradeLabel: string | undefined = undefined;
      let lowerPrimaryDescriptor: string | undefined = undefined;

      if (isLower) {
        const lpInfo = getLowerPrimaryTotalGrade(totalMarksScored, maxPossibleTotal);
        lowerPrimaryGrade = lpInfo.grade;
        lowerPrimaryGradeLabel = lpInfo.label;
        lowerPrimaryDescriptor = lpInfo.descriptor;
      }

      // Risk status determination
      let riskStatus: StudentAcademicSummary['riskStatus'] = 'Good Standing';
      if (overallPercentage >= 90 && attendanceSummary.ratePercentage >= 95) {
        riskStatus = 'Honors';
      } else if (attendanceSummary.ratePercentage < 85) {
        riskStatus = 'Attendance Warning';
      } else if (overallPercentage < 70 || subjectScores.some((s) => s.scorePercentage < 60)) {
        riskStatus = 'Academic Warning';
      }

      return {
        student,
        subjectScores,
        overallPercentage,
        totalMarksScored,
        maxPossibleTotal,
        gradingMethod,
        lowerPrimaryGrade,
        lowerPrimaryGradeLabel,
        lowerPrimaryDescriptor,
        gpa,
        classRank: 1, // dynamically computed per class cohort below
        totalInCohort: 1,
        aggregates,
        aggregateBreakdown,
        division,
        attendanceSummary,
        riskStatus
      };
    });

    // Rank students WITHIN THEIR OWN CLASS COHORT (e.g. within P.5, within P.1)
    const gradeGroups: { [grade: string]: typeof rawList } = {};
    rawList.forEach((item) => {
      const g = item.student.grade;
      if (!gradeGroups[g]) gradeGroups[g] = [];
      gradeGroups[g].push(item);
    });

    Object.values(gradeGroups).forEach((group) => {
      const isLowerCohort = group.length > 0 && isLowerPrimary(group[0].student.grade);
      if (isLowerCohort) {
        // "we use total in lower classes for grading" -> Rank strictly by total marks scored (descending)
        group.sort((a, b) => b.totalMarksScored - a.totalMarksScored);
      } else {
        // Upper primary (P.4 - P.7): Rank by Aggregates (lowest aggregate is best), then overall percentage
        group.sort((a, b) => {
          if (a.aggregates && b.aggregates && a.aggregates !== b.aggregates) {
            return a.aggregates - b.aggregates;
          }
          return b.overallPercentage - a.overallPercentage;
        });
      }
      group.forEach((item, idx) => {
        item.classRank = idx + 1;
        item.totalInCohort = group.length;
      });
    });

    return rawList;
  }, [students, assessments, marks, subjects, attendance]);

  // Automated Progress Report generation
  const getStudentProgressReport = (studentId: string): StudentProgressReportData | null => {
    const summary = academicSummaries.find((s) => s.student.id === studentId);
    if (!summary) return null;

    const student = summary.student;
    const attendanceStats = summary.attendanceSummary;

    // Build subject reports strictly matching student's curriculum
    const subjectReports = summary.subjectScores.map((sc) => {
      const sub = subjects.find((s) => s.id === sc.subjectId)!;
      const classAvg = getSubjectAverage(sc.subjectId);
      
      let teacherComment = "Demonstrates steady conceptual grasp and polite classroom attitude.";
      if (sc.scorePercentage >= 90) {
        teacherComment = "Exemplary understanding, neat presentation, and sharp analytical problem solving.";
      } else if (sc.scorePercentage >= 80) {
        teacherComment = "Commendable mastery of foundational topics with active class participation.";
      } else if (sc.scorePercentage < 70) {
        teacherComment = "Requires regular homework guidance and targeted practice on exam questions.";
      }

      return {
        subject: sub,
        score: sc.scorePercentage,
        letterGrade: sc.letterGrade,
        unebGrade: sc.unebGrade,
        gpaPoint: sc.gpaPoint,
        classAverage: classAvg,
        teacherComment
      };
    });

    // Automated analytical synthesis
    const sortedSubjects = [...subjectReports].sort((a, b) => b.score - a.score);
    const topSubject = sortedSubjects[0];
    const lowestSubject = sortedSubjects[sortedSubjects.length - 1];

    const strengths: string[] = [
      `Superior academic mastery in ${topSubject.subject.name} (${topSubject.score}%, UNEB Grade ${topSubject.unebGrade || topSubject.letterGrade}).`,
      `Regular classroom attendance (${attendanceStats.ratePercentage}% compliance with school term schedule).`,
      `Active engagement in group discussions and respectful peer interaction.`
    ];

    const growthAreas: string[] = [
      `Focused practice on foundational exercises in ${lowestSubject.subject.name} (${lowestSubject.score}%).`,
      `Maintaining neat handwriting and methodical step-by-step layout in exercise books.`,
      `Encouraged to read storybooks and practice library research at home daily.`
    ];

    const isUpper = isUpperPrimary(student.grade);
    const gradingNote = isUpper
      ? (summary.division ? ` (UNEB ${summary.division}, Total Aggregate: ${summary.aggregates}${summary.aggregateBreakdown ? ` [${summary.aggregateBreakdown}]` : ''})` : '')
      : ` (Total Marks: ${summary.totalMarksScored}/${summary.maxPossibleTotal} - ${summary.lowerPrimaryGrade || 'Grade I'})`;

    const automatedSummary = `${student.name} is currently ranked #${summary.classRank} of ${summary.totalInCohort} in ${student.grade} - Section ${student.section} with an overall composite academic mark of ${summary.overallPercentage}%${gradingNote}. The pupil displays commendable diligence, cooperative spirit, and active participation in institutional school activities at Light Angels Primary School.`;

    const homeroomRemarks = `${student.name} has had an uplifting and productive term. Keep practicing daily to maintain this glowing performance!`;
    const principalRemarks = `Commended by the School Administration. Continues to reflect our Light Angels motto: 'Guiding Young Lights to Shine with Wisdom & Grace'.`;

    return {
      student,
      term: 'Term 2 (Mid-Year Progress)',
      academicYear: '2026 - 2027',
      attendanceRate: attendanceStats.ratePercentage,
      totalSchoolDays: attendanceStats.totalDays,
      daysPresent: attendanceStats.present,
      daysAbsent: attendanceStats.absent,
      daysLate: attendanceStats.late,
      gpa: summary.gpa,
      overallPercentage: summary.overallPercentage,
      totalMarksScored: summary.totalMarksScored,
      maxPossibleTotal: summary.maxPossibleTotal,
      gradingMethod: summary.gradingMethod,
      lowerPrimaryGrade: summary.lowerPrimaryGrade,
      lowerPrimaryGradeLabel: summary.lowerPrimaryGradeLabel,
      lowerPrimaryDescriptor: summary.lowerPrimaryDescriptor,
      classRank: summary.classRank,
      totalStudentsInClass: summary.totalInCohort,
      aggregates: summary.aggregates,
      aggregateBreakdown: summary.aggregateBreakdown,
      division: summary.division,
      subjectReports,
      automatedSummary,
      strengths,
      growthAreas,
      behavioralEvaluation: {
        punctuality: attendanceStats.late === 0 ? 'Exemplary' : 'Proficient',
        classroomEngagement: summary.overallPercentage >= 85 ? 'Exemplary' : 'Proficient',
        peerCollaboration: 'Exemplary',
        assignmentDiscipline: summary.overallPercentage >= 80 ? 'Exemplary' : 'Proficient'
      },
      homeroomRemarks,
      principalRemarks
    };
  };

  // Messaging & notices
  const sendMessage = (msgData: Omit<CommunicationMessage, 'id' | 'timestamp' | 'read'>) => {
    const newMsg: CommunicationMessage = {
      ...msgData,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setMessages((prev) => [newMsg, ...prev]);
  };

  const markMessageRead = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, read: true } : m))
    );
  };

  const addNotice = (noticeData: Omit<SchoolNotice, 'id'>) => {
    const newNotice: SchoolNotice = {
      ...noticeData,
      id: `not-${Date.now()}`
    };
    setNotices((prev) => [newNotice, ...prev]);
  };

  const bookConference = (bookingData: Omit<ConferenceBooking, 'id'>) => {
    const newBooking: ConferenceBooking = {
      ...bookingData,
      id: `cnf-${Date.now()}`
    };
    setConferences((prev) => [newBooking, ...prev]);
  };

  // Reset to default
  const resetToDefault = () => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}students`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}assessments`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}marks`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}attendance`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}messages`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}notices`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}conferences`);

    setStudents(INITIAL_STUDENTS);
    setAssessments(INITIAL_ASSESSMENTS);
    setMarks(INITIAL_MARKS);
    setAttendance(generateInitialAttendance());
    setMessages(INITIAL_MESSAGES);
    setNotices(INITIAL_NOTICES);
    setConferences(INITIAL_CONFERENCES);
    setSelectedClassId('cls-p5a');
  };

  return (
    <SchoolContext.Provider
      value={{
        schoolInfo: INITIAL_SCHOOL_INFO,
        currentRole,
        setCurrentRole,
        classes,
        selectedClassId,
        setSelectedClassId,
        subjects,
        students,
        assessments,
        marks,
        attendance,
        messages,
        notices,
        conferences,
        addStudent,
        deleteStudent,
        setStudentAttendance,
        markAllAttendance,
        getStudentAttendanceSummary,
        getStudentAttendanceForDate,
        updateMark,
        bulkUpdateMarks,
        addAssessment,
        deleteAssessment,
        getStudentMarkForAssessment,
        getSubjectAverage,
        academicSummaries,
        getStudentProgressReport,
        sendMessage,
        markMessageRead,
        addNotice,
        bookConference,
        resetToDefault
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
