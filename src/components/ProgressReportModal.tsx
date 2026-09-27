import React, { useState } from 'react';
import { StudentProgressReportData } from '../types';
import { useSchool } from '../context/SchoolContext';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  Award, 
  Calendar, 
  User, 
  Building2, 
  Sparkles,
  TrendingUp,
  FileCheck
} from 'lucide-react';

interface ProgressReportModalProps {
  report: StudentProgressReportData | null;
  onClose: () => void;
}

export const ProgressReportModal: React.FC<ProgressReportModalProps> = ({ report, onClose }) => {
  const { schoolInfo, currentRole } = useSchool();
  const [parentAcknowledged, setParentAcknowledged] = useState(false);
  const [ackTimestamp, setAckTimestamp] = useState<string | null>(null);

  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleParentAcknowledge = () => {
    setParentAcknowledged(true);
    const now = new Date();
    setAckTimestamp(`${now.toLocaleDateString()} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white">
      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden print:shadow-none print:border-none print:w-full">
        
        {/* Action Top Bar (Hidden on print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-sm">Official Academic Progress Report</span>
            <span className="text-slate-400 text-xs hidden sm:inline">· {report.student.name} ({report.student.rollNumber})</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-10 space-y-8 bg-white print:p-4 text-slate-900">
          
          {/* Header & Crest */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b-2 border-slate-900">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-slate-200 shadow-xs flex items-center justify-center bg-white p-1">
                <img
                  src="/src/assets/images/light_angels_emblem_1790498287638.jpg"
                  alt="Light Angels Primary School Emblem"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">
                  {schoolInfo.name}
                </h1>
                <p className="text-xs italic text-slate-600 font-serif">
                  "{schoolInfo.motto}"
                </p>
                <div className="text-[11px] text-slate-500 mt-1 font-mono">
                  {schoolInfo.address} · {schoolInfo.phone}
                </div>
              </div>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <div className="inline-block px-3 py-1 bg-slate-100 text-slate-900 text-xs font-bold tracking-wider uppercase rounded">
                Official Progress Audit
              </div>
              <div className="text-xs text-slate-600 mt-1 font-medium">
                Academic Session: <span className="font-semibold text-slate-900">{report.academicYear}</span>
              </div>
              <div className="text-xs text-slate-600 font-medium">
                Reporting Term: <span className="font-semibold text-slate-900">{report.term}</span>
              </div>
            </div>
          </div>

          {/* Student Dossier Matrix */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block uppercase tracking-wider text-[10px] font-semibold">Student Name</span>
              <span className="font-bold text-slate-900 text-sm">{report.student.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase tracking-wider text-[10px] font-semibold">Student ID / Roll</span>
              <span className="font-mono font-semibold text-slate-900 text-sm">{report.student.rollNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase tracking-wider text-[10px] font-semibold">Cohort & Grade</span>
              <span className="font-semibold text-slate-900">{report.student.grade} - Sec {report.student.section}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase tracking-wider text-[10px] font-semibold">Guardian Contact</span>
              <span className="font-medium text-slate-800 truncate block">{report.student.guardianName}</span>
            </div>
          </div>

          {/* Cumulative Performance Scorecards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['P.1', 'P.2', 'P.3'].includes(report.student.grade) ? (
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[11px] font-medium text-slate-500 uppercase">
                  Total Marks (Grading Basis)
                </span>
                <div className="text-xl font-black font-mono text-indigo-900 mt-1">
                  {report.totalMarksScored} <span className="text-xs font-normal text-slate-400">/ {report.maxPossibleTotal || 600}</span>
                </div>
                <div className="mt-1">
                  <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {report.lowerPrimaryGrade || 'Grade I'} · {report.lowerPrimaryGradeLabel || 'First Grade'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[11px] font-medium text-slate-500 uppercase">
                  PLE Candidate Division
                </span>
                <div className="text-xl font-bold font-mono text-emerald-800 mt-1">
                  {report.division || 'Division 1'}
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                  Aggregates: {report.aggregates ?? 8} (Core 4 Subjects)
                </span>
              </div>
            )}

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-[11px] font-medium text-slate-500 uppercase">Composite Average</span>
              <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                {report.overallPercentage}%
              </div>
              <span className="text-[10px] text-slate-500">
                {['P.1', 'P.2', 'P.3'].includes(report.student.grade) 
                  ? 'Across 6 Learning Areas' 
                  : `Total: ${report.totalMarksScored} / ${report.maxPossibleTotal || 400}`}
              </span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-[11px] font-medium text-slate-500 uppercase">Class Cohort Rank</span>
              <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                #{report.classRank}
                <span className="text-xs font-normal text-slate-400"> of {report.totalStudentsInClass}</span>
              </div>
              <span className="text-[10px] text-indigo-600 font-semibold">
                {['P.1', 'P.2', 'P.3'].includes(report.student.grade) 
                  ? 'Ranked by Total Marks' 
                  : `${report.student.grade} Cohort Standings`}
              </span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-[11px] font-medium text-slate-500 uppercase">Attendance Integrity</span>
              <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                {report.attendanceRate}%
              </div>
              <span className="text-[10px] text-slate-600 font-mono">
                {report.daysPresent} Present · {report.daysAbsent} Absent
              </span>
            </div>
          </div>

          {/* Subject by Subject Marks Ledger */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Subject Academic Evaluation & Marks Record
              </h2>
              <span className="text-[11px] text-slate-600 font-medium">
                {['P.1', 'P.2', 'P.3'].includes(report.student.grade) 
                  ? 'Lower Primary Policy: Graded & Ranked by Total Marks (600 Max)' 
                  : 'UNEB Standards (P.4 - P.7): 90-100 D1, 80-89 D2, 70-79 C3, 60-69 C4, 55-59 C5, 50-54 C6, 45-49 P7, 40-44 P8, 0-39 F9'}
              </span>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Subject & Code</th>
                    <th className="py-2.5 px-3">Subject Teacher</th>
                    <th className="py-2.5 px-3 text-right">Student Mark</th>
                    <th className="py-2.5 px-3 text-center">
                      {['P.1', 'P.2', 'P.3'].includes(report.student.grade) 
                        ? 'Total Contribution' 
                        : 'UNEB Grade (D1 - F9)'}
                    </th>
                    <th className="py-2.5 px-3 text-right">Class Avg</th>
                    <th className="py-2.5 px-3">Faculty Qualitative Observation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-normal">
                  {report.subjectReports.map((sr) => {
                    const isLower = ['P.1', 'P.2', 'P.3'].includes(report.student.grade);
                    return (
                      <tr key={sr.subject.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {sr.subject.name}
                          <span className="block text-[10px] font-mono text-slate-500 font-normal">{sr.subject.code}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{sr.subject.teacher}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 text-sm">
                          {sr.score}%
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {isLower ? (
                            <span className="inline-block font-mono font-bold text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                              +{sr.score} to Total
                            </span>
                          ) : (
                            <span className={`inline-block font-mono font-bold text-xs px-2 py-0.5 rounded border ${
                              sr.score >= 90 ? 'text-emerald-800 bg-emerald-100 border-emerald-300' :
                              sr.score >= 80 ? 'text-emerald-800 bg-emerald-50 border-emerald-200' :
                              sr.score >= 70 ? 'text-blue-800 bg-blue-50 border-blue-200' :
                              sr.score >= 60 ? 'text-blue-700 bg-blue-50 border-blue-200' :
                              sr.score >= 55 ? 'text-sky-800 bg-sky-50 border-sky-200' :
                              sr.score >= 50 ? 'text-sky-700 bg-sky-50 border-sky-200' :
                              sr.score >= 45 ? 'text-amber-800 bg-amber-50 border-amber-200' :
                              sr.score >= 40 ? 'text-amber-900 bg-amber-100 border-amber-300' :
                              'text-rose-800 bg-rose-50 border-rose-200'
                            }`}>
                              {sr.unebGrade || sr.letterGrade}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                          {sr.classAverage}%
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 text-[11px] italic">
                          "{sr.teacherComment}"
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Automated Diagnostic Progress Monitoring Summary */}
          <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Automated Progress & Development Diagnostic Synthesis
            </div>
            
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              {report.automatedSummary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-3 rounded border border-slate-200">
                <span className="text-[11px] font-bold text-emerald-800 uppercase block mb-1">
                  Demonstrated Core Strengths
                </span>
                <ul className="text-xs text-slate-600 space-y-1">
                  {report.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-3 rounded border border-slate-200">
                <span className="text-[11px] font-bold text-amber-800 uppercase block mb-1">
                  Targeted Growth & Action Steps
                </span>
                <ul className="text-xs text-slate-600 space-y-1">
                  {report.growthAreas.map((ga, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">→</span>
                      <span>{ga}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Behavioral Dispositions & Work Habits */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              Behavioral Dispositions & Work Habit Assessment
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="border border-slate-200 p-2.5 rounded bg-white">
                <span className="text-slate-500 text-[10px] uppercase font-semibold block">Punctuality</span>
                <span className="font-semibold text-slate-900">{report.behavioralEvaluation.punctuality}</span>
              </div>
              <div className="border border-slate-200 p-2.5 rounded bg-white">
                <span className="text-slate-500 text-[10px] uppercase font-semibold block">Class Engagement</span>
                <span className="font-semibold text-slate-900">{report.behavioralEvaluation.classroomEngagement}</span>
              </div>
              <div className="border border-slate-200 p-2.5 rounded bg-white">
                <span className="text-slate-500 text-[10px] uppercase font-semibold block">Collaboration</span>
                <span className="font-semibold text-slate-900">{report.behavioralEvaluation.peerCollaboration}</span>
              </div>
              <div className="border border-slate-200 p-2.5 rounded bg-white">
                <span className="text-slate-500 text-[10px] uppercase font-semibold block">Assignment Discipline</span>
                <span className="font-semibold text-slate-900">{report.behavioralEvaluation.assignmentDiscipline}</span>
              </div>
            </div>
          </div>

          {/* Official Academic Grading Key / Legend */}
          <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 text-slate-800 text-[11px] space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
                {['P.1', 'P.2', 'P.3'].includes(report.student.grade) 
                  ? 'Official Lower Primary Grading Standard (Graded by Total Marks)' 
                  : 'Official UNEB Upper Primary Grading Standard (P.4 - P.7 Scale & Divisions)'}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Light Angels Primary Assessment Policy
              </span>
            </div>

            {['P.1', 'P.2', 'P.3'].includes(report.student.grade) ? (
              <div className="space-y-1.5">
                <div className="text-[10px] text-slate-600">
                  Pupils in Lower Primary (P.1 - P.3) are assessed across 6 learning areas (Luganda, English, Math, Reading, Lit 1, Lit 2) and graded directly on their <strong>Total Marks</strong> (Max: 600):
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 font-mono text-[10px] text-center">
                  <div className="p-1 bg-white border border-emerald-200 rounded text-emerald-900">
                    <span className="font-bold block">Grade I</span> 480 – 600 (80-100%)
                  </div>
                  <div className="p-1 bg-white border border-blue-200 rounded text-blue-900">
                    <span className="font-bold block">Grade II</span> 360 – 479 (60-79%)
                  </div>
                  <div className="p-1 bg-white border border-amber-200 rounded text-amber-900">
                    <span className="font-bold block">Grade III</span> 300 – 359 (50-59%)
                  </div>
                  <div className="p-1 bg-white border border-orange-200 rounded text-orange-900">
                    <span className="font-bold block">Grade IV</span> 240 – 299 (40-49%)
                  </div>
                  <div className="p-1 bg-white border border-rose-200 rounded text-rose-900">
                    <span className="font-bold block">Grade U</span> 0 – 239 (0-39%)
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="grid grid-cols-3 sm:grid-cols-9 gap-1 font-mono text-[10px] text-center">
                  <div className="p-1 bg-white border border-emerald-200 rounded text-emerald-900">
                    <span className="font-bold block">D1</span> 90-100%
                  </div>
                  <div className="p-1 bg-white border border-emerald-200 rounded text-emerald-800">
                    <span className="font-bold block">D2</span> 80-89%
                  </div>
                  <div className="p-1 bg-white border border-blue-200 rounded text-blue-900">
                    <span className="font-bold block">C3</span> 70-79%
                  </div>
                  <div className="p-1 bg-white border border-blue-200 rounded text-blue-800">
                    <span className="font-bold block">C4</span> 60-69%
                  </div>
                  <div className="p-1 bg-white border border-sky-200 rounded text-sky-900">
                    <span className="font-bold block">C5</span> 55-59%
                  </div>
                  <div className="p-1 bg-white border border-sky-200 rounded text-sky-800">
                    <span className="font-bold block">C6</span> 50-54%
                  </div>
                  <div className="p-1 bg-white border border-amber-200 rounded text-amber-900">
                    <span className="font-bold block">P7</span> 45-49%
                  </div>
                  <div className="p-1 bg-white border border-amber-200 rounded text-amber-950">
                    <span className="font-bold block">P8</span> 40-44%
                  </div>
                  <div className="p-1 bg-white border border-rose-200 rounded text-rose-900">
                    <span className="font-bold block">F9</span> 0-39%
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono text-center">
                  Divisions (Best 4 Core Aggregates): Div 1 (4-12, No F9) · Div 2 (13-23) · Div 3 (24-29) · Div 4 (30-34) · Div U (35-36)
                </div>
              </div>
            )}
          </div>

          {/* Institutional Endorsements & Signatures */}
          <div className="pt-6 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            {/* Homeroom Teacher */}
            <div className="space-y-2">
              <span className="text-slate-500 text-[10px] uppercase font-semibold block">Class Teacher (P5-A)</span>
              <div className="font-serif italic text-base text-slate-800 border-b border-slate-400 pb-1">
                Mrs. Catherine Nansubuga, B.Ed.
              </div>
              <span className="text-[10px] text-slate-500 block font-mono">Date: 2026-09-27</span>
            </div>

            {/* Principal */}
            <div className="space-y-2">
              <span className="text-slate-500 text-[10px] uppercase font-semibold block">Head Teacher</span>
              <div className="font-serif italic text-base text-slate-800 border-b border-slate-400 pb-1">
                Sister Mary Goretti, Ph.D.
              </div>
              <span className="text-[10px] text-slate-500 block font-mono">Light Angels Primary School Official Seal</span>
            </div>

            {/* Parent Acknowledgment */}
            <div className="space-y-2">
              <span className="text-slate-500 text-[10px] uppercase font-semibold block">Parent / Guardian Signature</span>
              {parentAcknowledged ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded p-2 text-emerald-800 text-xs">
                  <div className="flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Digitally Signed by Guardian
                  </div>
                  <div className="text-[10px] font-mono text-emerald-700 mt-0.5">
                    {ackTimestamp}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="border-b border-slate-400 pb-1 text-slate-400 italic">
                    Awaiting parent digital sign-off
                  </div>
                  {(currentRole === 'parent' || currentRole === 'admin') && (
                    <button
                      onClick={handleParentAcknowledge}
                      className="no-print mt-2 w-full px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-medium transition-colors"
                    >
                      Sign & Acknowledge Report
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer note */}
          <div className="text-[10px] text-slate-400 text-center font-mono border-t border-slate-100 pt-3">
            Primary Academic Record ID: {report.student.rollNumber}-T2-2026 · Light Angels Primary School Registry
          </div>

        </div>

      </div>
    </div>
  );
};
