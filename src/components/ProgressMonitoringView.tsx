import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { StudentProgressReportData } from '../types';
import { ProgressReportModal } from './ProgressReportModal';
import { 
  FileText, 
  Award, 
  AlertTriangle, 
  Sparkles, 
  Search, 
  Printer, 
  CheckCircle2, 
  TrendingUp, 
  ShieldAlert, 
  UserCheck, 
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export const ProgressMonitoringView: React.FC = () => {
  const { academicSummaries, getStudentProgressReport, schoolInfo } = useSchool();
  const [selectedStudentReport, setSelectedStudentReport] = useState<StudentProgressReportData | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'honors' | 'academic_warning' | 'attendance_warning'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const gradeOptions = ['all', 'P.1', 'P.2', 'P.3', 'P.4', 'P.5', 'P.6', 'P.7'];

  // Filtered list
  const filteredList = academicSummaries.filter((item) => {
    if (selectedGrade !== 'all' && item.student.grade !== selectedGrade) {
      return false;
    }

    const matchesSearch = item.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterCategory === 'honors') return item.riskStatus === 'Honors';
    if (filterCategory === 'academic_warning') return item.riskStatus === 'Academic Warning';
    if (filterCategory === 'attendance_warning') return item.riskStatus === 'Attendance Warning';
    return true;
  });

  // Metrics based on filtered list
  const totalStudents = filteredList.length || 1;
  const avgGpa = (filteredList.reduce((a, b) => a + b.gpa, 0) / totalStudents).toFixed(2);
  const avgAttendance = Math.round(filteredList.reduce((a, b) => a + b.attendanceSummary.ratePercentage, 0) / totalStudents);
  const honorsCount = filteredList.filter((s) => s.riskStatus === 'Honors').length;
  const atRiskCount = filteredList.filter((s) => s.riskStatus === 'Academic Warning' || s.riskStatus === 'Attendance Warning').length;

  const handleOpenReport = (studentId: string) => {
    const report = getStudentProgressReport(studentId);
    setSelectedStudentReport(report);
  };

  const handleBatchPrint = () => {
    if (filteredList.length > 0) {
      handleOpenReport(filteredList[0].student.id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Automated Progress Monitoring & Report Card Generator
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time algorithmic synthesis of student grades, attendance compliance, behavioral dispositions, and automated transcript generation.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleBatchPrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-300" />
            Generate Sample Report Card
          </button>
        </div>
      </div>

      {/* Cohort Performance Pulse Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Cohort GPA Avg</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {avgGpa}
            <span className="text-xs font-normal text-slate-400 font-sans"> / 4.0</span>
          </div>
          <span className="text-[10px] text-slate-500">Primary 5-A Benchmark</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Cohort Attendance</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {avgAttendance}%
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Exceeds 92% mandate</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">Honors Standing</span>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
            {honorsCount}
            <span className="text-xs font-normal text-slate-400 font-sans"> / {totalStudents}</span>
          </div>
          <span className="text-[10px] text-slate-500">≥ 92% + 95% attendance</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wide">Interventions Needed</span>
          <div className="text-2xl font-bold font-mono text-rose-700 mt-1">
            {atRiskCount}
          </div>
          <span className="text-[10px] text-rose-600 font-medium">Targeted tutoring flagged</span>
        </div>
      </div>

      {/* Roster & Controls */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Class Cohort Switcher Strip */}
        <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mr-1">
              Class Cohort:
            </span>
            {gradeOptions.map((grd) => (
              <button
                key={grd}
                onClick={() => setSelectedGrade(grd)}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                  selectedGrade === grd
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200/60 border border-slate-200'
                }`}
              >
                {grd === 'all' ? 'All Classes (P.1 - P.7)' : grd}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono text-slate-500">
            Showing {filteredList.length} Pupils
          </span>
        </div>

        {/* Filter Tab Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
          
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterCategory === 'all'
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              All Standings ({filteredList.length})
            </button>

            <button
              onClick={() => setFilterCategory('honors')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterCategory === 'honors'
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              Honors Roll ({honorsCount})
            </button>

            <button
              onClick={() => setFilterCategory('academic_warning')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterCategory === 'academic_warning'
                  ? 'bg-rose-700 text-white font-semibold'
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              Academic Intervention
            </button>

            <button
              onClick={() => setFilterCategory('attendance_warning')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterCategory === 'attendance_warning'
                  ? 'bg-amber-700 text-white font-semibold'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              Attendance Alert
            </button>
          </div>

          <div className="relative w-full md:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student or roll #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

        </div>

        {/* Student Cards List */}
        <div className="divide-y divide-slate-100">
          {filteredList.map((item) => {
            const report = getStudentProgressReport(item.student.id);
            const topSubject = item.subjectScores.reduce((prev, curr) => (curr.scorePercentage > prev.scorePercentage ? curr : prev));
            const weakSubject = item.subjectScores.reduce((prev, curr) => (curr.scorePercentage < prev.scorePercentage ? curr : prev));

            return (
              <div
                key={item.student.id}
                className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left: Bio & Rank */}
                <div className="flex items-start gap-3.5 min-w-[240px]">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-sm font-mono shrink-0">
                    #{item.classRank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{item.student.name}</span>
                      <span className="text-[11px] text-slate-500 font-mono">({item.student.rollNumber})</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Guardian: {item.student.guardianName} · {item.student.guardianPhone}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] flex-wrap">
                      <span className="font-semibold text-slate-700">
                        {item.student.grade} - Sec {item.student.section}
                      </span>
                      {['P.1', 'P.2', 'P.3'].includes(item.student.grade) ? (
                        <span className="inline-flex items-center px-1.5 py-0.2 rounded font-bold font-mono text-[10px] bg-indigo-50 text-indigo-800 border border-indigo-200">
                          {item.lowerPrimaryGrade || 'Grade I'} · Total: {item.totalMarksScored}/600
                        </span>
                      ) : (
                        item.division && (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded font-bold font-mono text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {item.division} (Agg: {item.aggregates})
                          </span>
                        )
                      )}
                      <span className={`font-semibold ${
                        item.riskStatus === 'Honors' ? 'text-emerald-700' :
                        item.riskStatus === 'Good Standing' ? 'text-indigo-700' :
                        'text-rose-700 font-bold'
                      }`}>
                        · {item.riskStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle: Metrics and Diagnostic Preview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs flex-1 max-w-xl">
                  <div className="bg-slate-50 p-2 rounded border border-slate-150">
                    <span className="text-[10px] text-slate-500 uppercase block font-medium">
                      {['P.1', 'P.2', 'P.3'].includes(item.student.grade) ? 'Total Marks' : 'Total Score'}
                    </span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {item.totalMarksScored} <span className="text-[10px] text-slate-400 font-normal">/ {item.maxPossibleTotal}</span>
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2 rounded border border-slate-150">
                    <span className="text-[10px] text-slate-500 uppercase block font-medium">Composite %</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{item.overallPercentage}%</span>
                  </div>

                  <div className="bg-slate-50 p-2 rounded border border-slate-150">
                    <span className="text-[10px] text-slate-500 uppercase block font-medium">
                      {['P.1', 'P.2', 'P.3'].includes(item.student.grade) ? 'Grading Basis' : 'GPA Scale'}
                    </span>
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {['P.1', 'P.2', 'P.3'].includes(item.student.grade) ? item.lowerPrimaryGrade || 'Grade I' : `${item.gpa.toFixed(2)} / 4.0`}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2 rounded border border-slate-150">
                    <span className="text-[10px] text-slate-500 uppercase block font-medium">Attendance</span>
                    <span className={`font-mono font-bold text-sm ${
                      item.attendanceSummary.ratePercentage >= 95 ? 'text-emerald-700' :
                      item.attendanceSummary.ratePercentage >= 90 ? 'text-slate-900' :
                      'text-rose-700'
                    }`}>
                      {item.attendanceSummary.ratePercentage}%
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2 rounded border border-slate-150">
                    <span className="text-[10px] text-slate-500 uppercase block font-medium">Strongest Area</span>
                    <span className="font-medium text-slate-900 truncate block text-[11px]">
                      {topSubject.subjectName.split(' ')[0]} ({topSubject.scorePercentage}%)
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenReport(item.student.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    Official Report Card
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Progress Report Modal */}
      <ProgressReportModal
        report={selectedStudentReport}
        onClose={() => setSelectedStudentReport(null)}
      />

    </div>
  );
};
