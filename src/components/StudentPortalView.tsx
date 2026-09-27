import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { ProgressReportModal } from './ProgressReportModal';
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Clock, 
  FileText,
  AlertCircle,
  Users
} from 'lucide-react';

export const StudentPortalView: React.FC = () => {
  const { students, getStudentProgressReport, getStudentAttendanceSummary } = useSchool();
  const [selectedStudentId, setSelectedStudentId] = useState<string>('std-001');
  const [isReportOpen, setIsReportOpen] = useState(false);

  const student = students.find((s) => s.id === selectedStudentId) || students[0];
  const isLower = ['P.1', 'P.2', 'P.3'].includes(student.grade);
  const report = getStudentProgressReport(student.id);
  const attendanceSummary = getStudentAttendanceSummary(student.id);

  return (
    <div className="space-y-6">
      
      {/* Student Welcome Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Light Angels Primary · Pupil Learning Portal</span>
            <span className={`px-2 py-0.2 rounded text-[10px] font-bold border font-mono ${
              isLower ? 'bg-indigo-50 text-indigo-800 border-indigo-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              {isLower ? 'Lower Primary (Total Marks Grading)' : 'Upper Primary (UNEB D1-F9 Scale)'}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
            Welcome back, {student.name} ⭐
          </h1>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-mono">
            <span>Pupil ID: {student.rollNumber}</span>
            <span>·</span>
            <span>{student.grade} - Section {student.section}</span>
            <span>·</span>
            <span>Term 2 (2026 - 2027)</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Pupil Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1">
            <Users className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
            <select
              value={student.id}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-transparent pr-2 py-1 focus:outline-none cursor-pointer"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.grade} - {s.name} ({s.rollNumber})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsReportOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            Official Report Card
          </button>
        </div>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {isLower ? (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Marks</span>
            <div className="text-2xl font-black font-mono text-indigo-900 mt-1">
              {report?.totalMarksScored}
              <span className="text-xs font-normal text-slate-400"> / {report?.maxPossibleTotal || 600}</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">
              {report?.lowerPrimaryGrade || 'Grade I'} · {report?.lowerPrimaryGradeLabel || 'First Grade'}
            </span>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">PLE Division</span>
            <div className="text-2xl font-bold font-mono text-emerald-800 mt-1">
              {report?.division || 'Division 1'}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              Aggregates: {report?.aggregates ?? 8} (Core 4)
            </span>
          </div>
        )}

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Overall Average</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {report?.overallPercentage}%
          </div>
          <span className="text-[10px] text-indigo-600 font-medium">
            Class Rank #{report?.classRank} of {report?.totalStudentsInClass}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Attendance Record</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {attendanceSummary.ratePercentage}%
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{attendanceSummary.present} days present</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Grading Method</span>
          <div className="text-sm font-bold text-slate-900 mt-1 truncate">
            {isLower ? 'Total Marks (Lower)' : 'UNEB D1-F9 (Upper)'}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {isLower ? '6 Learning Areas' : '4 Core Subjects'}
          </span>
        </div>
      </div>

      {/* Subject Courses & Grades */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              My Enrolled Subjects & Current Grades
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isLower 
                ? 'Lower primary learning areas contribute directly to your Total Marks score (out of 600).' 
                : 'Upper primary subjects are graded using the standard UNEB 9-point scale (D1, D2, C3, C4, C5, C6, P7, P8, F9).'}
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {report?.subjectReports.length || (isLower ? 6 : 4)} Subjects Active ({student.grade} Curriculum)
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {report?.subjectReports.map((sr) => (
            <div key={sr.subject.id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-bold text-slate-900 text-sm">{sr.subject.name}</div>
                <div className="text-slate-500 text-[11px]">Instructor: {sr.subject.teacher} · Credits: {sr.subject.credits}</div>
                <div className="text-slate-600 italic mt-1 text-[11px]">"{sr.teacherComment}"</div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="text-right">
                  <div className="font-mono font-bold text-slate-900 text-base">{sr.score}%</div>
                  <div className="text-[10px] text-slate-400 font-mono">Cohort Avg: {sr.classAverage}%</div>
                </div>
                {isLower ? (
                  <div className="px-2 py-1 rounded bg-indigo-50 text-indigo-900 border border-indigo-200 font-mono font-bold text-xs">
                    +{sr.score}
                  </div>
                ) : (
                  <div className={`px-2 py-1 rounded border font-bold text-xs font-mono ${
                    sr.score >= 90 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                    sr.score >= 80 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                    sr.score >= 70 ? 'bg-blue-50 text-blue-800 border-blue-200' :
                    sr.score >= 60 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    sr.score >= 55 ? 'bg-sky-50 text-sky-800 border-sky-200' :
                    sr.score >= 50 ? 'bg-sky-50 text-sky-700 border-sky-200' :
                    sr.score >= 45 ? 'text-amber-800 bg-amber-50 border-amber-200' :
                    sr.score >= 40 ? 'text-amber-900 bg-amber-100 border-amber-300' :
                    'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    {sr.unebGrade || sr.letterGrade}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Report Modal */}
      <ProgressReportModal
        report={report}
        onClose={() => setIsReportOpen(false)}
      />

    </div>
  );
};
