import React, { useState, useRef, useEffect } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Assessment, AssessmentType, Subject, Student } from '../types';
import { 
  getUgandanGrade, 
  calculateUgandanDivision, 
  getLowerPrimaryCompetence,
  getLowerPrimaryTotalGrade,
  UPPER_PRIMARY_GRADING_SCALE,
  LOWER_PRIMARY_TOTAL_GRADING_SCALE,
  isUpperPrimary as checkIsUpper,
  isLowerPrimary as checkIsLower
} from '../utils/grading';
import { ProgressReportModal } from './ProgressReportModal';
import { 
  Plus, 
  Download, 
  BarChart3, 
  Check, 
  Layers, 
  ArrowUpDown, 
  BookOpen, 
  CheckCircle2, 
  Award, 
  FileSpreadsheet, 
  Edit3, 
  UserPlus, 
  Printer, 
  Sparkles, 
  AlertCircle, 
  HelpCircle,
  TrendingUp,
  RefreshCw,
  Search,
  Filter,
  Info,
  X
} from 'lucide-react';

export const GradebookView: React.FC = () => {
  const {
    classes,
    selectedClassId,
    setSelectedClassId,
    subjects,
    assessments,
    marks,
    students,
    updateMark,
    bulkUpdateMarks,
    addAssessment,
    deleteAssessment,
    addStudent,
    getStudentMarkForAssessment,
    getSubjectAverage,
    academicSummaries,
    getStudentProgressReport
  } = useSchool();

  // Active view tab inside Marks Portal: 'entry' | 'broadsheet' | 'assessments'
  const [viewMode, setViewMode] = useState<'entry' | 'broadsheet' | 'assessments'>('entry');

  // Currently selected class
  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[4]; // Default to P.5
  const isLowerPrimary = ['P.1', 'P.2', 'P.3'].includes(currentClass.grade);

  // Filter subjects strictly according to the curriculum for the selected class:
  // P.1 - P.3: Luganda, English, Mathematics, Reading, Literacy One, Literacy 2
  // P.4 - P.7: English, Social Studies (SST), Science, Mathematics
  const classSubjects = subjects.filter((s) =>
    s.applicableGrades.includes(currentClass.grade as any)
  );

  // Selected subject (default to first applicable subject for this class)
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(() => {
    return classSubjects[0]?.id || 'sub-math-up';
  });

  // Keep selectedSubjectId valid when class changes
  useEffect(() => {
    if (!classSubjects.some((s) => s.id === selectedSubjectId)) {
      if (classSubjects.length > 0) {
        setSelectedSubjectId(classSubjects[0].id);
      }
    }
  }, [selectedClassId, classSubjects, selectedSubjectId]);

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId) || classSubjects[0] || subjects[0];

  // Filter students in the selected class
  const classStudents = students.filter((s) => s.grade === currentClass.grade);

  // Selected Term
  const [selectedTerm, setSelectedTerm] = useState<'Term 1' | 'Term 2' | 'Final Term' | 'All'>('Term 2');

  // Search filter
  const [searchStudent, setSearchStudent] = useState('');

  // Modals state
  const [isAddAssessmentModalOpen, setIsAddAssessmentModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isGradingPolicyModalOpen, setIsGradingPolicyModalOpen] = useState(false);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<any | null>(null);

  // Save feedback state
  const [lastSavedStudentId, setLastSavedStudentId] = useState<string | null>(null);

  // Quick fill value modal/state
  const [showQuickFillPrompt, setShowQuickFillPrompt] = useState(false);
  const [quickFillScore, setQuickFillScore] = useState<number>(75);

  // Form state for creating assessment
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<AssessmentType>('midterm');
  const [newMaxMarks, setNewMaxMarks] = useState<number>(100);
  const [newWeight, setNewWeight] = useState<number>(50);
  const [newDate, setNewDate] = useState<string>('2026-09-28');
  const [newAssessmentSubjectId, setNewAssessmentSubjectId] = useState<string>(selectedSubject.id);

  // Form state for adding new pupil
  const [newPupilName, setNewPupilName] = useState('');
  const [newPupilRoll, setNewPupilRoll] = useState('');
  const [newPupilGuardian, setNewPupilGuardian] = useState('');
  const [newPupilPhone, setNewPupilPhone] = useState('');

  // Assessments for the current class & selected subject
  const availableAssessments = assessments.filter(
    (a) => a.subjectId === selectedSubject.id &&
           a.classSectionId === currentClass.id &&
           (selectedTerm === 'All' || a.term === selectedTerm)
  );

  // Selected assessment for single-exam entry sheet
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('');

  // Ensure an active assessment is selected
  useEffect(() => {
    if (availableAssessments.length > 0) {
      if (!availableAssessments.some((a) => a.id === selectedAssessmentId)) {
        setSelectedAssessmentId(availableAssessments[0].id);
      }
    } else {
      setSelectedAssessmentId('');
    }
  }, [availableAssessments, selectedAssessmentId]);

  const activeAssessment = assessments.find((a) => a.id === selectedAssessmentId) || availableAssessments[0];

  // Map rows for Single Assessment Marks Entry
  const marksEntryRows = classStudents
    .filter((s) => s.name.toLowerCase().includes(searchStudent.toLowerCase()) || s.rollNumber.toLowerCase().includes(searchStudent.toLowerCase()))
    .map((student) => {
      const entry = activeAssessment ? getStudentMarkForAssessment(student.id, activeAssessment.id) : undefined;
      const marksObtained = entry ? entry.marksObtained : 0;
      const maxMarks = activeAssessment ? activeAssessment.maxMarks : 100;
      const pct = maxMarks > 0 ? (marksObtained / maxMarks) * 100 : 0;
      const uneb = getUgandanGrade(pct);
      const lpComp = getLowerPrimaryCompetence(pct);

      return {
        student,
        marksObtained,
        maxMarks,
        pct: Math.round(pct),
        uneb,
        lpComp,
        teacherComment: entry?.teacherComment || '',
        updatedAt: entry?.updatedAt
      };
    });

  // Calculate statistics for the active assessment
  const totalInSheet = marksEntryRows.length || 1;
  const avgMarks = marksEntryRows.length > 0
    ? Math.round(marksEntryRows.reduce((acc, curr) => acc + curr.pct, 0) / totalInSheet)
    : 0;
  const highMarks = marksEntryRows.length > 0
    ? Math.max(...marksEntryRows.map((r) => r.pct))
    : 0;
  const lowMarks = marksEntryRows.length > 0
    ? Math.min(...marksEntryRows.map((r) => r.pct))
    : 0;
  const passCount = marksEntryRows.filter((r) => r.pct >= 40).length;
  const passRate = marksEntryRows.length > 0 ? Math.round((passCount / totalInSheet) * 100) : 100;

  // Handle Mark Update with instant feedback
  const handleScoreChange = (studentId: string, val: number) => {
    if (!activeAssessment) return;
    const validated = Math.max(0, Math.min(activeAssessment.maxMarks, Number(val) || 0));
    updateMark(activeAssessment.id, studentId, validated);
    setLastSavedStudentId(studentId);
    setTimeout(() => {
      setLastSavedStudentId((prev) => (prev === studentId ? null : prev));
    }, 1800);
  };

  const handleCommentChange = (studentId: string, comment: string) => {
    if (!activeAssessment) return;
    const entry = getStudentMarkForAssessment(studentId, activeAssessment.id);
    const currScore = entry ? entry.marksObtained : 0;
    updateMark(activeAssessment.id, studentId, currScore, comment);
    setLastSavedStudentId(studentId);
    setTimeout(() => {
      setLastSavedStudentId((prev) => (prev === studentId ? null : prev));
    }, 1800);
  };

  // Quick Action: Fill default score
  const handleApplyQuickFill = () => {
    if (!activeAssessment) return;
    const entries = classStudents.map((s) => ({
      assessmentId: activeAssessment.id,
      studentId: s.id,
      marksObtained: Math.min(activeAssessment.maxMarks, Math.max(0, quickFillScore)),
      teacherComment: "Regular term progress."
    }));
    bulkUpdateMarks(entries);
    setShowQuickFillPrompt(false);
  };

  // Handle Assessment Creation
  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created = addAssessment({
      title: newTitle.trim(),
      subjectId: newAssessmentSubjectId || selectedSubject.id,
      classSectionId: currentClass.id,
      type: newType,
      maxMarks: Number(newMaxMarks),
      weightPercentage: Number(newWeight),
      date: newDate,
      term: selectedTerm === 'All' ? 'Term 2' : (selectedTerm as any)
    });

    setNewTitle('');
    setIsAddAssessmentModalOpen(false);
    setSelectedAssessmentId(created.id);
  };

  // Handle Add New Pupil
  const handleCreatePupil = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPupilName.trim()) return;

    const roll = newPupilRoll.trim() || `LAP-${Math.floor(1000 + Math.random() * 9000)}`;
    addStudent({
      name: newPupilName.trim(),
      rollNumber: roll,
      grade: currentClass.grade,
      section: currentClass.section,
      avatarUrl: "",
      guardianName: newPupilGuardian.trim() || "Parent / Guardian",
      guardianEmail: `${newPupilName.toLowerCase().replace(/\s+/g, '.')}@family.ug`,
      guardianPhone: newPupilPhone.trim() || "+256 700 000000",
      dateOfBirth: "2016-01-01",
      address: "Kampala Central",
      enrollmentDate: new Date().toISOString().slice(0, 10)
    });

    setNewPupilName('');
    setNewPupilRoll('');
    setNewPupilGuardian('');
    setNewPupilPhone('');
    setIsAddStudentModalOpen(false);
  };

  // CSV Export for Single Assessment
  const handleExportAssessmentCsv = () => {
    if (!activeAssessment) return;
    const headers = [
      'Class',
      'Roll Number',
      'Pupil Name',
      `Score (Max ${activeAssessment.maxMarks})`,
      'Percentage (%)',
      'UNEB Grade',
      'Competence / Remarks',
      'Teacher Notes'
    ];

    const rows = marksEntryRows.map((r) => [
      `"${currentClass.name}"`,
      `"${r.student.rollNumber}"`,
      `"${r.student.name}"`,
      r.marksObtained,
      `${r.pct}%`,
      r.uneb.grade,
      `"${isLowerPrimary ? r.lpComp.descriptor : r.uneb.descriptor}"`,
      `"${r.teacherComment}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LightAngels_${currentClass.grade}_${selectedSubject.code}_${activeAssessment.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Export for Class Broadsheet (All Subjects)
  const handleExportBroadsheetCsv = () => {
    const subjectHeaders = classSubjects.map((s) => `"${s.name} (${s.code})"`);
    const headers = [
      isLowerPrimary ? 'Rank (By Total Marks)' : 'Rank',
      'Roll Number',
      'Pupil Name',
      ...subjectHeaders,
      isLowerPrimary ? 'Total Marks (Max 600)' : 'Total Marks (Max 400)',
      'Average (%)',
      ...(isLowerPrimary 
        ? ['Lower Primary Grade (By Total)', 'Competence Descriptor'] 
        : ['Aggregates (Sum of Subject Grades)', 'Grade Points Breakdown', 'PLE Division'])
    ];

    const rows = classStudents.map((student) => {
      const summary = academicSummaries.find((s) => s.student.id === student.id);
      const subScores = classSubjects.map((sub) => {
        const sc = summary?.subjectScores.find((s) => s.subjectId === sub.id);
        return sc ? sc.scorePercentage : 0;
      });
      const totalScore = summary?.totalMarksScored ?? subScores.reduce((a, b) => a + b, 0);
      const avg = summary ? summary.overallPercentage : 0;
      const rank = summary ? summary.classRank : '-';

      const row = [
        `"#${rank}"`,
        `"${student.rollNumber}"`,
        `"${student.name}"`,
        ...subScores,
        totalScore,
        `${avg}%`,
        ...(isLowerPrimary 
          ? [
              `"${summary?.lowerPrimaryGrade || 'Grade I'} (${summary?.lowerPrimaryGradeLabel || 'First Grade'})"`,
              `"${summary?.lowerPrimaryDescriptor || getLowerPrimaryCompetence(avg).descriptor}"`
            ]
          : [
              summary?.aggregates || '-', 
              `"${summary?.aggregateBreakdown || '-'}"`, 
              `"${summary?.division || '-'}"`
            ]
        )
      ];
      return row.join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LightAngels_Broadsheet_${currentClass.grade}_Term2.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">

      {/* Top Banner: Teacher Marks Entry Hub Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wide">
                Teacher Marks Entry & Grading
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Light Angels Primary School
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
              Class Marks Ledger & Academic Record Book
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter and update term marks for classes <strong className="text-slate-800 font-semibold">P.1 through P.7</strong> with automatic UNEB aggregates, divisions, and progress reports.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsGradingPolicyModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors shadow-2xs"
            >
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              Grading Scales & Policy Guide
            </button>

            <button
              onClick={() => setIsAddAssessmentModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              New Assessment / Exam
            </button>

            <button
              onClick={() => setIsAddStudentModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs"
            >
              <UserPlus className="w-3.5 h-3.5 text-slate-600" />
              Add Pupil
            </button>
          </div>
        </div>

        {/* Primary Class Selector: P.1 to P.7 */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Class:
              </span>
              <span className="text-[11px] text-slate-500">
                (Click to switch class cohort)
              </span>
            </div>

            {/* Curriculum & Grading Policy Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-[11px] font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/80">
                {isLowerPrimary ? (
                  <span>
                    🌱 <strong className="text-indigo-900 font-bold">Lower Primary (P.1 - P.3):</strong> Graded & Ranked by <strong className="text-indigo-700 underline font-bold">Total Marks (Max: 600)</strong> · 6 Subjects
                  </span>
                ) : (
                  <span>
                    🎓 <strong className="text-emerald-900 font-bold">Upper Primary (P.4 - P.7):</strong> Graded by <strong className="text-emerald-700 underline font-bold">UNEB 9-Point Scale (D1 - F9)</strong> · 4 Core Subjects & PLE Divisions
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsGradingPolicyModalOpen(true)}
                className="text-[10px] text-indigo-600 hover:text-indigo-900 font-bold underline cursor-pointer"
              >
                View Scale
              </button>
            </div>
          </div>

          {/* Big Class Buttons: P.1 - P.7 */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mt-3">
            {classes.map((cls) => {
              const isSelected = cls.id === selectedClassId;
              const isLower = ['P.1', 'P.2', 'P.3'].includes(cls.grade);
              const pupilCount = students.filter((s) => s.grade === cls.grade).length;

              return (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : isLower
                      ? 'bg-indigo-50/50 hover:bg-indigo-50 border-indigo-100 text-slate-800'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <span className={`text-sm sm:text-base font-black tracking-tight ${isSelected ? 'text-amber-300' : 'text-slate-900'}`}>
                    {cls.grade}
                  </span>
                  <span className={`text-[10px] hidden sm:block truncate w-full ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {cls.section ? `Sec ${cls.section}` : cls.name}
                  </span>
                  <span className={`text-[9px] font-mono mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                    {pupilCount} pupils
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Class Metadata Strip */}
          <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-lg border border-slate-200/60">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900">{currentClass.name}</span>
              <span aria-hidden="true">·</span>
              <span>Room: <strong className="text-slate-800 font-semibold">{currentClass.room}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Class Teacher: <strong className="text-slate-800 font-semibold">{currentClass.classTeacher}</strong></span>
            </div>

            <div className="flex items-center gap-3 mt-1 sm:mt-0 font-mono text-[11px]">
              <span>Enrolled: <strong>{classStudents.length}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Year: <strong>{currentClass.academicYear}</strong></span>
            </div>
          </div>
        </div>

        {/* View Mode Switcher: Entry Sheet vs Broadsheet vs Assessments */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('entry')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                viewMode === 'entry'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
              Subject Marks Entry Sheet
            </button>

            <button
              onClick={() => setViewMode('broadsheet')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                viewMode === 'broadsheet'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Master Class Broadsheet (All Subjects)
            </button>

            <button
              onClick={() => setViewMode('assessments')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                viewMode === 'assessments'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              Assessments Schedule ({availableAssessments.length})
            </button>
          </div>

          {/* Quick search input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pupil..."
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 w-44"
            />
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* VIEW MODE 1: SUBJECT MARKS ENTRY SHEET */}
      {/* ========================================================================= */}
      {viewMode === 'entry' && (
        <div className="space-y-4">
          
          {/* Subject Filter Bar - Filtered strictly to selected class's curriculum */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Curriculum Subject for {currentClass.grade}:
                </span>
                <p className="text-xs text-slate-500">
                  {isLowerPrimary
                    ? "Lower Primary Curriculum: Luganda, English, Mathematics, Reading, Literacy One, Literacy 2"
                    : "Upper Primary Curriculum: English, Social Studies (SST), Science, Mathematics"}
                </p>
              </div>

              {/* Term Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-600">Term:</span>
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value as any)}
                  className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded px-2.5 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="Term 2">Term 2 (Mid-Year Progress)</option>
                  <option value="Term 1">Term 1 (Opening Term)</option>
                  <option value="Final Term">Final Term (Promotional)</option>
                  <option value="All">All Terms</option>
                </select>
              </div>
            </div>

            {/* Subject Selector Buttons (Dynamic according to P.1-P.3 or P.4-P.7) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {classSubjects.map((sub) => {
                const isSelected = sub.id === selectedSubject.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubjectId(sub.id)}
                    className={`flex flex-col p-2.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-900 border-indigo-900 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.2 rounded ${
                        isSelected ? 'bg-indigo-800 text-amber-300' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {sub.code}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                    </div>
                    <span className="text-xs font-bold mt-1.5 truncate">
                      {sub.name}
                    </span>
                    <span className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {sub.teacher}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Assessment Selection Bar for this subject */}
            <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-700">Exam / Paper:</span>
                {availableAssessments.length > 0 ? (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {availableAssessments.map((asm) => (
                      <button
                        key={asm.id}
                        onClick={() => setSelectedAssessmentId(asm.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${
                          asm.id === activeAssessment?.id
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        {asm.title} (Max {asm.maxMarks})
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    No assessments recorded for {selectedSubject.name} in {selectedTerm}. Click "New Assessment" to add one!
                  </div>
                )}
              </div>

              {/* Assessment Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowQuickFillPrompt(!showQuickFillPrompt)}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors"
                  title="Bulk enter a default mark for remaining pupils"
                >
                  ⚡ Quick Fill Marks
                </button>

                <button
                  onClick={handleExportAssessmentCsv}
                  disabled={!activeAssessment}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Quick Fill Dropdown Panel */}
            {showQuickFillPrompt && activeAssessment && (
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg flex items-center justify-between flex-wrap gap-3">
                <div className="text-xs text-indigo-950">
                  <span className="font-bold">⚡ Quick Fill Marks for {activeAssessment.title}:</span> Enter a default mark to assign to all pupils in this class:
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max={activeAssessment.maxMarks}
                    value={quickFillScore}
                    onChange={(e) => setQuickFillScore(Number(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-xs font-mono font-bold text-center bg-white border border-indigo-300 rounded focus:outline-none"
                  />
                  <span className="text-xs font-mono text-slate-500">/ {activeAssessment.maxMarks}</span>
                  <button
                    onClick={handleApplyQuickFill}
                    className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors"
                  >
                    Apply to All
                  </button>
                  <button
                    onClick={() => setShowQuickFillPrompt(false)}
                    className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Performance Pulse Ribbon */}
          {activeAssessment && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Class Average</span>
                <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                  {avgMarks}%
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Out of {activeAssessment.maxMarks} Marks</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Highest Score</span>
                <div className="text-xl font-bold font-mono text-emerald-700 mt-1">
                  {highMarks}%
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">Distinction Level</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Lowest Score</span>
                <div className="text-xl font-bold font-mono text-rose-700 mt-1">
                  {lowMarks}%
                </div>
                <span className="text-[10px] text-slate-500">Passing Mark: 40%</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pass Rate</span>
                <div className="text-xl font-bold font-mono text-indigo-700 mt-1">
                  {passRate}%
                </div>
                <span className="text-[10px] text-slate-500">{passCount}/{totalInSheet} Passed</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Weight & Date</span>
                <div className="text-sm font-bold font-mono text-slate-800 mt-1">
                  Wt: {activeAssessment.weightPercentage}%
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{activeAssessment.date}</span>
              </div>
            </div>
          )}

          {/* Interactive Marks Entry Table */}
          {activeAssessment ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Marks Entry Ledger: {activeAssessment.title}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    (Type score directly — changes save automatically in real time)
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  Subject: <strong className="text-slate-800">{selectedSubject.name}</strong> · Max: <strong>{activeAssessment.maxMarks}</strong>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">#</th>
                      <th className="py-3 px-4 min-w-[200px]">Pupil Name & Roll</th>
                      <th className="py-3 px-4 text-center min-w-[140px] bg-indigo-50/50 border-x border-indigo-100">
                        Mark Obtained (Max {activeAssessment.maxMarks})
                      </th>
                      <th className="py-3 px-4 text-center min-w-[90px]">Percentage</th>
                      <th className="py-3 px-4 text-center min-w-[130px]">
                        {isLowerPrimary ? 'Total Mark Impact (P.1 - P.3)' : 'UNEB Primary Grade (D1 - F9)'}
                      </th>
                      <th className="py-3 px-4 min-w-[240px]">Teacher Remark / Pedagogical Note</th>
                      <th className="py-3 px-4 text-center min-w-[100px]">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {marksEntryRows.map((row, idx) => {
                      const isRecentlySaved = lastSavedStudentId === row.student.id;

                      return (
                        <tr key={row.student.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Index */}
                          <td className="py-3 px-4 text-center font-mono font-bold text-slate-400">
                            {idx + 1}
                          </td>

                          {/* Pupil details */}
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900 text-sm">
                              {row.student.name}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {row.student.rollNumber} · {row.student.guardianName}
                            </div>
                          </td>

                          {/* Editable Mark Input Cell */}
                          <td className="py-3 px-4 text-center bg-indigo-50/20 border-x border-indigo-100">
                            <div className="inline-flex items-center gap-1.5 justify-center">
                              <input
                                type="number"
                                min="0"
                                max={activeAssessment.maxMarks}
                                defaultValue={row.marksObtained}
                                key={`${activeAssessment.id}-${row.student.id}-${row.marksObtained}`}
                                onBlur={(e) => {
                                  const val = Number(e.target.value);
                                  handleScoreChange(row.student.id, val);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    (e.target as HTMLInputElement).blur();
                                  }
                                }}
                                className={`w-16 text-center font-mono font-bold text-sm py-1.5 px-2 rounded-md border shadow-2xs focus:outline-none focus:ring-2 ${
                                  row.pct >= 80
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 focus:ring-emerald-500'
                                    : row.pct >= 60
                                    ? 'bg-blue-50 border-blue-300 text-blue-950 focus:ring-blue-500'
                                    : row.pct >= 40
                                    ? 'bg-amber-50 border-amber-300 text-amber-950 focus:ring-amber-500'
                                    : 'bg-rose-50 border-rose-300 text-rose-950 focus:ring-rose-500'
                                }`}
                              />
                              <span className="text-xs font-mono text-slate-400 font-medium">
                                / {activeAssessment.maxMarks}
                              </span>
                            </div>

                            {/* Saved Feedback Tag */}
                            {isRecentlySaved && (
                              <div className="text-[10px] text-emerald-600 font-semibold flex items-center justify-center gap-1 mt-0.5">
                                <CheckCircle2 className="w-3 h-3" /> Saved
                              </div>
                            )}
                          </td>

                          {/* Percentage */}
                          <td className="py-3 px-4 text-center">
                            <span className="font-mono font-black text-slate-900 text-sm">
                              {row.pct}%
                            </span>
                          </td>

                          {/* UNEB Primary Grade (P.4 - P.7) or Lower Primary Total Mark Contribution (P.1 - P.3) */}
                          <td className="py-3 px-4 text-center">
                            {isLowerPrimary ? (
                              <div className="inline-flex flex-col items-center">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border font-mono bg-indigo-50 text-indigo-800 border-indigo-200">
                                  +{row.marksObtained} to Total / 600
                                </span>
                                <span className="text-[10px] text-slate-500 mt-0.5 font-medium">
                                  {row.lpComp.level}
                                </span>
                              </div>
                            ) : (
                              <div className="inline-flex flex-col items-center">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border font-mono ${row.uneb.badgeClass}`}>
                                  {row.uneb.grade} ({row.uneb.label})
                                </span>
                                <span className="text-[10px] text-emerald-700 mt-0.5 font-mono font-semibold">
                                  +{row.uneb.points} {row.uneb.points === 1 ? 'pt' : 'pts'} to Aggregate
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Teacher Remarks / Comments */}
                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-1">
                              <input
                                type="text"
                                defaultValue={row.teacherComment}
                                key={`cmt-${row.student.id}-${row.teacherComment}`}
                                placeholder="Add qualitative note or remark..."
                                onBlur={(e) => handleCommentChange(row.student.id, e.target.value)}
                                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded px-2.5 py-1 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                              />

                              {/* Suggestion Chips */}
                              <div className="flex items-center gap-1 overflow-x-auto text-[10px] text-slate-500 py-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleCommentChange(row.student.id, "Excellent work and neat presentation.")}
                                  className="hover:text-indigo-600 hover:underline shrink-0"
                                >
                                  + Excellent
                                </button>
                                <span>·</span>
                                <button
                                  type="button"
                                  onClick={() => handleCommentChange(row.student.id, "Good progress, keep practicing daily.")}
                                  className="hover:text-indigo-600 hover:underline shrink-0"
                                >
                                  + Good effort
                                </button>
                                <span>·</span>
                                <button
                                  type="button"
                                  onClick={() => handleCommentChange(row.student.id, "Needs extra revision on tricky questions.")}
                                  className="hover:text-amber-600 hover:underline shrink-0"
                                >
                                  + Needs revision
                                </button>
                              </div>
                            </div>
                          </td>

                          {/* Actions: View Report Card */}
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => {
                                const report = getStudentProgressReport(row.student.id);
                                setSelectedStudentForReport(report);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 transition-colors"
                            >
                              Report
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200 shadow-xs space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No Assessment Found for {selectedSubject.name} in {currentClass.grade}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Create an examination or continuous assessment paper to start entering marks for this cohort.
              </p>
              <button
                onClick={() => setIsAddAssessmentModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Create New Assessment Paper
              </button>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 2: MASTER CLASS BROADSHEET (ALL SUBJECTS) */}
      {/* ========================================================================= */}
      {viewMode === 'broadsheet' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Master Broadsheet Marks Register · {currentClass.name}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Composite cross-subject mark sheet for all enrolled pupils in {currentClass.grade}.
                {isLowerPrimary 
                  ? " · In Lower Primary (P.1 - P.3), ranking and grading are determined strictly by Total Marks (out of 600)." 
                  : " · In Upper Primary (P.4 - P.7), grading uses the UNEB 9-point scale (D1-F9) and PLE core aggregates & divisions."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportBroadsheetCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                Export Broadsheet CSV
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3 w-12 text-center">
                      {isLowerPrimary ? 'Rank (Total)' : 'Rank'}
                    </th>
                    <th className="py-3 px-4 min-w-[180px]">Pupil Name & Roll</th>

                    {/* Columns for each applicable subject */}
                    {classSubjects.map((sub) => (
                      <th key={sub.id} className="py-2.5 px-3 text-center border-l border-slate-200 min-w-[100px]">
                        <div className="font-bold text-slate-900">{sub.name}</div>
                        <div className="text-[10px] font-mono text-slate-500">{sub.code}</div>
                      </th>
                    ))}

                    <th className={`py-3 px-3 text-center border-l-2 min-w-[95px] ${
                      isLowerPrimary ? 'border-indigo-300 bg-indigo-50/90 text-indigo-950 font-bold' : 'border-slate-300 bg-slate-50'
                    }`}>
                      {isLowerPrimary ? 'Total Marks (Ranked)' : 'Total Marks'}
                    </th>
                    <th className="py-3 px-3 text-center bg-slate-50 min-w-[80px]">
                      Average %
                    </th>

                    {isLowerPrimary ? (
                      <th className="py-3 px-4 text-center bg-indigo-50/70 border-l border-indigo-200 min-w-[140px]">
                        Lower Primary Grade (By Total)
                      </th>
                    ) : (
                      <>
                        <th className="py-3 px-3 text-center bg-emerald-50/60 border-l border-emerald-100 min-w-[110px]">
                          <div className="font-bold text-emerald-950">Aggregate</div>
                          <div className="text-[9px] text-emerald-700 font-normal">Sum of Grades</div>
                        </th>
                        <th className="py-3 px-4 text-center bg-emerald-50/60 min-w-[110px]">
                          PLE Division
                        </th>
                      </>
                    )}

                    <th className="py-3 px-3 text-center min-w-[90px]">
                      Report
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {classStudents.map((student) => {
                    const summary = academicSummaries.find((s) => s.student.id === student.id);
                    const subScores = classSubjects.map((sub) => {
                      const sc = summary?.subjectScores.find((s) => s.subjectId === sub.id);
                      return {
                        subject: sub,
                        score: sc ? sc.scorePercentage : 0,
                        unebGrade: sc?.unebGrade || 'C4'
                      };
                    });

                    const totalScore = summary?.totalMarksScored ?? subScores.reduce((acc, curr) => acc + curr.score, 0);
                    const maxTotal = summary?.maxPossibleTotal ?? (classSubjects.length * 100);
                    const avg = summary ? summary.overallPercentage : 0;
                    const rank = summary ? summary.classRank : 1;

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Rank */}
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-500">
                          #{rank}
                        </td>

                        {/* Pupil */}
                        <td className="py-2.5 px-4">
                          <div className="font-semibold text-slate-900 text-sm">
                            {student.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {student.rollNumber}
                          </div>
                        </td>

                        {/* Subject Marks Columns */}
                        {subScores.map(({ subject, score, unebGrade }) => {
                          const ug = getUgandanGrade(score);
                          return (
                            <td key={subject.id} className="py-2.5 px-3 text-center border-l border-slate-200">
                              <span className="font-mono font-bold text-slate-900 text-sm">
                                {score}%
                              </span>
                              <div className="text-[10px] font-mono mt-0.5">
                                {isLowerPrimary ? (
                                  <span className="text-[9px] text-slate-400 font-mono">
                                    out of 100
                                  </span>
                                ) : (
                                  <span className={`inline-block px-1.5 py-0.5 rounded font-bold ${ug.badgeClass}`}>
                                    {ug.grade} <span className="text-[9px] font-normal">({ug.points}pt)</span>
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })}

                        {/* Total Marks (Grading basis in lower primary) */}
                        <td className={`py-2.5 px-3 text-center border-l-2 font-mono font-bold ${
                          isLowerPrimary ? 'border-indigo-300 bg-indigo-50/50 text-indigo-950 font-black' : 'border-slate-300 bg-slate-50/80 text-slate-900'
                        }`}>
                          <span className="text-sm font-black">{totalScore}</span>
                          <span className="text-[9px] text-slate-400 block font-normal">
                            / {maxTotal}
                          </span>
                        </td>

                        {/* Average % */}
                        <td className="py-2.5 px-3 text-center bg-slate-50/80 font-mono font-black text-slate-900 text-sm">
                          {avg}%
                        </td>

                        {/* Lower Primary Grade by Total OR Upper Primary UNEB Division */}
                        {isLowerPrimary ? (
                          <td className="py-2.5 px-4 text-center bg-indigo-50/30 border-l border-indigo-100">
                            <div className="inline-flex flex-col items-center">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border font-mono bg-emerald-100 text-emerald-800 border-emerald-300">
                                {summary?.lowerPrimaryGrade || 'Grade I'}
                              </span>
                              <span className="text-[10px] text-slate-500 mt-0.5 font-medium">
                                {summary?.lowerPrimaryGradeLabel || 'First Grade (Total)'}
                              </span>
                            </div>
                          </td>
                        ) : (
                          <>
                            <td className="py-2.5 px-3 text-center bg-emerald-50/30 border-l border-emerald-100">
                              <span className="font-mono font-black text-emerald-950 text-sm">
                                {summary?.aggregates ?? '-'}
                              </span>
                              {summary?.aggregateBreakdown && (
                                <span className="block text-[9px] text-emerald-700 font-mono mt-0.5 font-medium" title={summary.aggregateBreakdown}>
                                  {summary.aggregateBreakdown.split('=')[0].trim()}
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-4 text-center bg-emerald-50/30">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border font-mono ${
                                summary?.division === 'Division 1'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : summary?.division === 'Division 2'
                                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                                  : 'bg-amber-100 text-amber-800 border-amber-300'
                              }`}>
                                {summary?.division || 'Division 1'}
                              </span>
                            </td>
                          </>
                        )}

                        {/* Report Action */}
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => {
                              const report = getStudentProgressReport(student.id);
                              setSelectedStudentForReport(report);
                            }}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-900 hover:underline"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 3: ASSESSMENTS SCHEDULE & MANAGEMENT */}
      {/* ========================================================================= */}
      {viewMode === 'assessments' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Continuous Assessment & Examination Schedule · {currentClass.grade}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage test papers, mid-terms, end-of-term exams, and weight percentages.
              </p>
            </div>

            <button
              onClick={() => setIsAddAssessmentModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Paper
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableAssessments.map((asm) => {
              const sub = subjects.find((s) => s.id === asm.subjectId);
              const assessmentMarks = marks.filter((m) => m.assessmentId === asm.id);
              const enteredCount = classStudents.filter((s) => assessmentMarks.some((m) => m.studentId === s.id)).length;

              return (
                <div key={asm.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold font-mono uppercase px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                        {sub?.name || 'Subject'}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mt-1.5">
                        {asm.title}
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                      Max: {asm.maxMarks}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Term:</span>
                      <span className="font-semibold text-slate-800">{asm.term}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Weight:</span>
                      <span className="font-semibold text-slate-800">{asm.weightPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Exam Date:</span>
                      <span className="text-slate-700">{asm.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Entries Recorded:</span>
                      <span className="font-bold text-emerald-700">{enteredCount} / {classStudents.length} pupils</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedSubjectId(asm.subjectId);
                        setSelectedAssessmentId(asm.id);
                        setViewMode('entry');
                      }}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-900"
                    >
                      Enter Marks →
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete assessment "${asm.title}" and its marks?`)) {
                          deleteAssessment(asm.id);
                        }
                      }}
                      className="text-xs text-rose-500 hover:text-rose-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD ASSESSMENT */}
      {/* ========================================================================= */}
      {isAddAssessmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  New Assessment Specification
                </h3>
                <span className="text-xs text-slate-500">
                  {currentClass.name} · {selectedTerm}
                </span>
              </div>
              <button
                onClick={() => setIsAddAssessmentModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateAssessment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assessment / Examination Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End of Term Examination, Fractions Test"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Curriculum Subject
                </label>
                <select
                  value={newAssessmentSubjectId}
                  onChange={(e) => setNewAssessmentSubjectId(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
                >
                  {classSubjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} ({sub.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Assessment Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as AssessmentType)}
                    className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
                  >
                    <option value="midterm">Mid-Term (M.O.T) Exam</option>
                    <option value="final_exam">End of Term (E.O.T) Exam</option>
                    <option value="quiz">Topical Test / Quiz</option>
                    <option value="homework">Homework / Classwork</option>
                    <option value="project">Practical Project</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Maximum Marks
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    required
                    value={newMaxMarks}
                    onChange={(e) => setNewMaxMarks(Number(e.target.value))}
                    className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Weightage (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={newWeight}
                    onChange={(e) => setNewWeight(Number(e.target.value))}
                    className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Examination Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddAssessmentModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                >
                  Create Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD PUPIL */}
      {/* ========================================================================= */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Register New Pupil
                </h3>
                <span className="text-xs text-slate-500">
                  Enrolling into {currentClass.name}
                </span>
              </div>
              <button
                onClick={() => setIsAddStudentModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreatePupil} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Pupil Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Martha Namusoke"
                  value={newPupilName}
                  onChange={(e) => setNewPupilName(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pupil Admission / Roll Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. LAP-2680"
                  value={newPupilRoll}
                  onChange={(e) => setNewPupilRoll(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Parent / Guardian Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mr. & Mrs. Namusoke"
                  value={newPupilGuardian}
                  onChange={(e) => setNewPupilGuardian(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Guardian Phone Contact
                </label>
                <input
                  type="text"
                  placeholder="e.g. +256 701 000000"
                  value={newPupilPhone}
                  onChange={(e) => setNewPupilPhone(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddStudentModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                >
                  Enroll Pupil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: GRADING POLICY & SYSTEM REFERENCE */}
      {/* ========================================================================= */}
      {isGradingPolicyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm">Light Angels Primary School Grading Framework</h3>
                  <p className="text-xs text-slate-300">UNEB Upper Primary Standard & Lower Primary Total Marks System</p>
                </div>
              </div>
              <button
                onClick={() => setIsGradingPolicyModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
              
              {/* Section 1: Upper Primary P.4 to P.7 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <h4 className="font-bold text-slate-900 text-sm">
                      Upper Primary (P.4 to P.7): UNEB 9-Point Scale & Aggregates
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    4 Core Subjects (Max: 400)
                  </span>
                </div>

                <p className="text-slate-600 text-xs">
                  Students in P.4, P.5, P.6, and P.7 are graded on the official UNEB 9-point scale across 4 core subjects (English, Social Studies / SST, Science, Mathematics). Terminal performance and PLE candidacy are measured using best 4 aggregates and divisions.
                </p>

                {/* 9-Point Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Score Range</th>
                        <th className="py-2 px-3">Grade</th>
                        <th className="py-2 px-3">Classification</th>
                        <th className="py-2 px-3 text-center">Points</th>
                        <th className="py-2 px-3">Descriptor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {UPPER_PRIMARY_GRADING_SCALE.map((g) => (
                        <tr key={g.grade} className="hover:bg-slate-50/70">
                          <td className="py-1.5 px-3 font-mono font-bold text-slate-800">
                            {g.minMark}% – {g.maxMark}%
                          </td>
                          <td className="py-1.5 px-3">
                            <span className={`inline-block font-mono font-black px-2 py-0.5 rounded border ${g.badgeClass}`}>
                              {g.grade}
                            </span>
                          </td>
                          <td className="py-1.5 px-3 font-semibold text-slate-700">{g.label}</td>
                          <td className="py-1.5 px-3 text-center font-mono font-bold text-slate-900">{g.points}</td>
                          <td className="py-1.5 px-3 text-slate-600 italic text-[11px]">{g.descriptor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* UNEB PLE Division Thresholds */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-800 uppercase tracking-wide text-[10px] block mb-1.5">
                    PLE Division Aggregate Benchmarks (Core 4 Subjects):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded">
                      <div className="font-bold text-emerald-900">Division 1</div>
                      <div className="font-mono text-[11px] text-emerald-700">4 – 12 Aggregates</div>
                      <div className="text-[9px] text-emerald-600 mt-0.5">No F9 permitted</div>
                    </div>
                    <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                      <div className="font-bold text-blue-900">Division 2</div>
                      <div className="font-mono text-[11px] text-blue-700">13 – 23 Aggregates</div>
                      <div className="text-[9px] text-blue-600 mt-0.5">Credit standard</div>
                    </div>
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded">
                      <div className="font-bold text-amber-900">Division 3</div>
                      <div className="font-mono text-[11px] text-amber-700">24 – 29 Aggregates</div>
                      <div className="text-[9px] text-amber-600 mt-0.5">Pass standard</div>
                    </div>
                    <div className="p-2 bg-orange-50 border border-orange-200 rounded">
                      <div className="font-bold text-orange-900">Division 4</div>
                      <div className="font-mono text-[11px] text-orange-700">30 – 34 Aggregates</div>
                      <div className="text-[9px] text-orange-600 mt-0.5">Marginal pass</div>
                    </div>
                    <div className="p-2 bg-rose-50 border border-rose-200 rounded">
                      <div className="font-bold text-rose-900">Division U</div>
                      <div className="font-mono text-[11px] text-rose-700">35 – 36 Aggregates</div>
                      <div className="text-[9px] text-rose-600 mt-0.5">Ungraded remedial</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Lower Primary P.1 to P.3 */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    <h4 className="font-bold text-slate-900 text-sm">
                      Lower Primary (P.1 to P.3): Grading by Total Marks
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                    6 Learning Areas (Max: 600)
                  </span>
                </div>

                <div className="bg-indigo-50/60 p-3 rounded-lg border border-indigo-200/80 text-xs text-indigo-950">
                  <p className="font-semibold">
                    ⭐ Institutional Policy Note:
                  </p>
                  <p className="mt-0.5 text-indigo-900">
                    In Lower Primary classes (P.1, P.2, P.3), UNEB 9-point aggregates are not used. Pupils are graded and ranked directly by their <strong>Total Marks</strong> scored across the 6 foundational disciplines (Luganda, English, Mathematics, Reading, Literacy One, Literacy 2; Total Max: 600).
                  </p>
                </div>

                {/* Total Marks Grading Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Total Marks (Out of 600)</th>
                        <th className="py-2 px-3">Percentage</th>
                        <th className="py-2 px-3">Lower Primary Grade</th>
                        <th className="py-2 px-3">Classification</th>
                        <th className="py-2 px-3">Evaluation Descriptor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {LOWER_PRIMARY_TOTAL_GRADING_SCALE.map((lg) => (
                        <tr key={lg.grade} className="hover:bg-slate-50/70">
                          <td className="py-2 px-3 font-mono font-bold text-slate-900">
                            {lg.minTotalFor600} – {lg.maxTotalFor600} marks
                          </td>
                          <td className="py-2 px-3 font-mono text-slate-600">
                            {lg.minPct}% – {lg.maxPct}%
                          </td>
                          <td className="py-2 px-3">
                            <span className={`inline-block font-mono font-bold px-2 py-0.5 rounded border ${lg.badgeClass}`}>
                              {lg.grade}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-semibold text-slate-800">{lg.label}</td>
                          <td className="py-2 px-3 text-slate-600 italic text-[11px]">{lg.descriptor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                UNEB Examination Standard · Light Angels Primary Academic Office
              </span>
              <button
                onClick={() => setIsGradingPolicyModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PROGRESS REPORT CARD */}
      {/* ========================================================================= */}
      {selectedStudentForReport && (
        <ProgressReportModal
          report={selectedStudentForReport}
          onClose={() => setSelectedStudentForReport(null)}
        />
      )}

    </div>
  );
};
