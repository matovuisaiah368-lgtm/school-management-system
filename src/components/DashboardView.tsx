import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  Award, 
  Clock, 
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

interface DashboardViewProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab }) => {
  const {
    schoolInfo,
    classes,
    setSelectedClassId,
    students,
    attendance,
    messages,
    notices,
    academicSummaries,
    getStudentAttendanceForDate,
    setStudentAttendance
  } = useSchool();

  const todayStr = '2026-09-27';
  const totalStudents = students.length;

  // Today's attendance stats
  const todayRecords = students.map((s) => {
    const rec = getStudentAttendanceForDate(s.id, todayStr);
    return {
      student: s,
      status: rec?.status || 'present',
      note: rec?.note
    };
  });

  const presentCount = todayRecords.filter((r) => r.status === 'present').length;
  const absentCount = todayRecords.filter((r) => r.status === 'absent').length;
  const lateCount = todayRecords.filter((r) => r.status === 'late').length;
  const excusedCount = todayRecords.filter((r) => r.status === 'excused').length;
  const dailyAttendancePct = Math.round(((presentCount + excusedCount + lateCount * 0.8) / (totalStudents || 1)) * 100);

  // Unread messages
  const unreadCount = messages.filter((m) => !m.read).length;

  // Academic stats
  const classAvgGpa = (academicSummaries.reduce((a, b) => a + b.gpa, 0) / (totalStudents || 1)).toFixed(2);
  const topStudents = [...academicSummaries].sort((a, b) => b.overallPercentage - a.overallPercentage).slice(0, 4);
  const interventionStudents = academicSummaries.filter((s) => s.riskStatus !== 'Honors' && s.riskStatus !== 'Good Standing');

  return (
    <div className="space-y-6">
      
      {/* Hero Banner with Campus Image */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900 text-white min-h-[200px] flex flex-col justify-end p-6 sm:p-8">
        {/* Background Image with Dark Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/primary_school_campus_1790498302279.jpg"
            alt="Light Angels Primary School Campus Courtyard"
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-amber-300">
              <span>{schoolInfo.currentTerm}</span>
              <span>·</span>
              <span>Academic Year {schoolInfo.academicYear}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {schoolInfo.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Official school management portal for tracking pupil daily attendance, continuous grading markbooks, parent-teacher messaging, and automated terminal progress monitoring reports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('attendance')}
              className="px-4 py-2 bg-white text-slate-950 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              Take Today's Attendance
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              Generate Progress Reports
            </button>
          </div>
        </div>
      </div>

      {/* Institutional Vital Signals */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Daily Attendance */}
        <div 
          onClick={() => setActiveTab('attendance')} 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Today's Attendance</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {dailyAttendancePct}%
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            {presentCount} Present · {absentCount} Absent · {lateCount} Late
          </div>
        </div>

        {/* Cohort GPA */}
        <div 
          onClick={() => setActiveTab('gradebook')} 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Cohort GPA</span>
            <span className="text-xs font-mono text-indigo-600 font-bold">Primary 5-A</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {classAvgGpa}
            <span className="text-xs font-normal text-slate-400 font-sans"> / 4.0</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
            Grade average: 88% Composite
          </div>
        </div>

        {/* Parent Communication */}
        <div 
          onClick={() => setActiveTab('communication')} 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Communication</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-indigo-600 text-white font-mono">
                {unreadCount} New
              </span>
            )}
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {messages.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Active parent-teacher channels
          </div>
        </div>

        {/* Action Alerts */}
        <div 
          onClick={() => setActiveTab('reports')} 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wide">Interventions</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-700 mt-1">
            {interventionStudents.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Students needing academic action
          </div>
        </div>
      </div>

      {/* Teacher Marks Entry Quick Access Portal (P.1 to P.7) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wide">
                Teacher Marks Entry
              </span>
              <h2 className="text-sm font-bold text-slate-900">
                Enter & Manage Student Marks by Class (P.1 - P.7)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select any class cohort below to immediately open its marks entry ledger or master broadsheet.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('gradebook')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors shadow-2xs shrink-0"
          >
            Open Marks Workspace <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 7 Class Quick Jump Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {classes.map((cls) => {
            const isLower = ['P.1', 'P.2', 'P.3'].includes(cls.grade);
            const pupilCount = students.filter((s) => s.grade === cls.grade).length;
            return (
              <button
                key={cls.id}
                onClick={() => {
                  setSelectedClassId(cls.id);
                  setActiveTab('gradebook');
                }}
                className={`p-3 rounded-lg border text-left transition-all hover:shadow-xs group ${
                  isLower
                    ? 'bg-indigo-50/40 hover:bg-indigo-50 border-indigo-100'
                    : 'bg-emerald-50/30 hover:bg-emerald-50/60 border-emerald-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {cls.grade}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Sec {cls.section}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-slate-700 mt-1 truncate">
                  {cls.name.split('(')[0]}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {pupilCount} pupils · {isLower ? '6 subjects' : '4 subjects'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Curriculum & Grading Footnote */}
        <div className="text-[11px] text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <span>
            🌱 <strong className="text-slate-800">P.1 - P.3 (Lower Primary):</strong> Graded & ranked by <strong className="text-indigo-700 font-bold">Total Marks (Max: 600)</strong> · Grade I (480-600), Grade II, Grade III, Grade IV, Grade U
          </span>
          <span>
            🎓 <strong className="text-slate-800">P.4 - P.7 (Upper Primary):</strong> UNEB scale <strong className="text-emerald-700 font-bold">0-39 F9, 40-44 P8, 45-49 P7, 50-54 C6, 55-59 C5, 60-69 C4, 70-79 C3, 80-89 D2, 90-100 D1</strong> & PLE Divisions
          </span>
        </div>
      </div>

      {/* Main Grid: Today's Roll & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Quick Today Attendance Ticker */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Today's Attendance Roster Snapshot
              </h2>
              <span className="text-xs text-slate-500 font-mono">Date: {todayStr} · Primary 5-A</span>
            </div>
            <button
              onClick={() => setActiveTab('attendance')}
              className="text-xs text-indigo-600 hover:text-indigo-900 font-semibold flex items-center gap-1"
            >
              Open Full Tracker <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-[360px] overflow-y-auto">
            {todayRecords.slice(0, 8).map((item) => (
              <div
                key={item.student.id}
                className="p-3 hover:bg-slate-50/70 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900">{item.student.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {item.student.rollNumber} {item.note && `· ${item.note}`}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setStudentAttendance(item.student.id, todayStr, 'present')}
                    className={`px-2 py-0.5 text-[11px] font-medium rounded ${
                      item.status === 'present'
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    P
                  </button>
                  <button
                    onClick={() => setStudentAttendance(item.student.id, todayStr, 'absent')}
                    className={`px-2 py-0.5 text-[11px] font-medium rounded ${
                      item.status === 'absent'
                        ? 'bg-rose-600 text-white font-semibold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setStudentAttendance(item.student.id, todayStr, 'late')}
                    className={`px-2 py-0.5 text-[11px] font-medium rounded ${
                      item.status === 'late'
                        ? 'bg-amber-600 text-white font-semibold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    L
                  </button>
                  <button
                    onClick={() => setStudentAttendance(item.student.id, todayStr, 'excused')}
                    className={`px-2 py-0.5 text-[11px] font-medium rounded ${
                      item.status === 'excused'
                        ? 'bg-sky-600 text-white font-semibold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    E
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-500">
              {todayRecords.length} total pupils enrolled in this primary cohort.
            </span>
          </div>
        </div>

        {/* Right: Academic Radar & Top Performers */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Top Academic Rankers */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Pupils Honors Roll & Star Learners
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('reports')}
                className="text-xs text-indigo-600 hover:text-indigo-900 font-semibold flex items-center gap-0.5"
              >
                All Reports <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {topStudents.map((item) => {
                const isLower = ['P.1', 'P.2', 'P.3'].includes(item.student.grade);
                return (
                  <div key={item.student.id} className="p-3 hover:bg-slate-50/70 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-slate-100 font-mono font-bold text-slate-700 flex items-center justify-center text-[11px]">
                        #{item.classRank}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-900">{item.student.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {item.student.grade} · {isLower ? `Total: ${item.totalMarksScored}/600 (${item.lowerPrimaryGrade || 'Grade I'})` : `${item.division || 'Div 1'} (Agg: ${item.aggregates ?? 8})`}
                        </div>
                      </div>
                    </div>

                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {item.overallPercentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Intervention Alert Notice */}
          {interventionStudents.length > 0 && (
            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 text-rose-800 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Intervention Recommended: {interventionStudents[0].student.name}</span>
              </div>
              <p className="text-rose-700 text-[11px] leading-relaxed">
                Numeracy mid-term score of 68% and 2 unexcused morning absences flagged for review. A conference note has been initiated with the guardian for fun remedial math support.
              </p>
              <div className="pt-1">
                <button
                  onClick={() => setActiveTab('communication')}
                  className="text-xs font-semibold text-rose-900 underline hover:text-rose-950"
                >
                  Review Guardian Message Thread →
                </button>
              </div>
            </div>
          )}

          {/* Recent School Bulletins */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Latest Administrative Bulletins
              </h3>
              <button
                onClick={() => setActiveTab('communication')}
                className="text-[11px] text-indigo-600 font-semibold"
              >
                View Board
              </button>
            </div>

            <div className="space-y-2.5">
              {notices.slice(0, 2).map((notice) => (
                <div key={notice.id} className="text-xs space-y-0.5">
                  <div className="font-semibold text-slate-800">{notice.title}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{notice.date} · {notice.author}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
