import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { ProgressReportModal } from './ProgressReportModal';
import { 
  User, 
  Award, 
  Calendar, 
  CheckCircle2, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Clock, 
  ShieldCheck,
  Send,
  Sparkles,
  BookOpen,
  Users
} from 'lucide-react';

export const ParentPortalView: React.FC = () => {
  const {
    students,
    subjects,
    assessments,
    marks,
    attendance,
    messages,
    sendMessage,
    getStudentProgressReport,
    getStudentAttendanceSummary
  } = useSchool();

  // Child selection state (default std-001)
  const [selectedChildId, setSelectedChildId] = useState<string>('std-001');
  const child = students.find((s) => s.id === selectedChildId) || students[0];
  const isLower = ['P.1', 'P.2', 'P.3'].includes(child.grade);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [parentReply, setParentReply] = useState('');

  const report = getStudentProgressReport(child.id);
  const attendanceSummary = getStudentAttendanceSummary(child.id);

  // Today's attendance status (2026-09-27)
  const todayRecord = attendance.find((r) => r.studentId === child.id && r.date === '2026-09-27');
  const todayStatus = todayRecord?.status || 'present';

  // Parent message thread
  const parentMessages = messages
    .filter((m) => m.studentId === child.id)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  const handleSendParentReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentReply.trim()) return;

    sendMessage({
      studentId: child.id,
      senderId: 'par-davis',
      senderName: child.guardianName,
      senderRole: 'parent',
      recipientId: 'tch-catherine',
      recipientName: 'Mrs. Catherine Nansubuga',
      subject: `Parent Inquiry: ${child.name}`,
      message: parentReply.trim(),
      category: 'academic'
    });

    setParentReply('');
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-xl text-indigo-700 shrink-0 font-mono">
            {child.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {child.name}'s Guardian Dashboard
              </h1>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded border font-mono ${
                isLower ? 'bg-indigo-50 text-indigo-800 border-indigo-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {child.grade} - Section {child.section} ({isLower ? 'Lower Primary: Total Marks Grading' : 'Upper Primary: UNEB Scale'})
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Logged in as <strong>{child.guardianName}</strong> · Phone: <span className="font-mono">{child.guardianPhone}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Child Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1">
            <Users className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
            <select
              value={child.id}
              onChange={(e) => setSelectedChildId(e.target.value)}
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            Official Terminal Report
          </button>
        </div>
      </div>

      {/* Vital Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Today's Attendance */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Today's Presence</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xl font-bold text-slate-900 capitalize font-mono">{todayStatus}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {todayRecord?.note ? `Note: ${todayRecord.note}` : 'Checked in: 08:05 AM'}
          </span>
        </div>

        {/* Term Attendance */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Term Attendance</span>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
            {attendanceSummary.ratePercentage}%
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {attendanceSummary.present} Present · {attendanceSummary.excused} Excused
          </span>
        </div>

        {/* Total Marks or Division */}
        {isLower ? (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Marks Scored</span>
            <div className="text-2xl font-black font-mono text-indigo-900 mt-1">
              {report?.totalMarksScored || 0}
              <span className="text-xs font-normal text-slate-400 font-sans"> / {report?.maxPossibleTotal || 600}</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">
              {report?.lowerPrimaryGrade || 'Grade I'} · {report?.lowerPrimaryGradeLabel || 'First Grade'}
            </span>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">PLE Division</span>
            <div className="text-2xl font-bold font-mono text-emerald-800 mt-1">
              {report?.division || 'Division 1'}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold font-mono">
              Aggregates: {report?.aggregates ?? 8} (Core 4)
            </span>
          </div>
        )}

        {/* Composite Mark & Rank */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Composite Average</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {report?.overallPercentage || 92}%
          </div>
          <span className="text-[10px] text-indigo-600 font-medium">
            Class Rank #{report?.classRank || 1} of {report?.totalStudentsInClass || 4}
          </span>
        </div>
      </div>

      {/* Main Grid: Subject Marks & Teacher Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Real-Time Subject Marks */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Current Term Subject Marks & Teacher Remarks
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {isLower ? '6 Learning Areas (Max: 600)' : '4 UNEB Disciplines (D1-F9)'}
            </span>
          </div>

          <div className="divide-y divide-slate-100 p-2">
            {report?.subjectReports.map((sr) => (
              <div key={sr.subject.id} className="p-3.5 hover:bg-slate-50/60 rounded-lg transition-colors space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-xs">{sr.subject.name}</span>
                    <span className="text-[11px] text-slate-500 font-mono ml-2">({sr.subject.teacher})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">{sr.score}%</span>
                    {isLower ? (
                      <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                        +{sr.score}
                      </span>
                    ) : (
                      <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded border ${
                        sr.score >= 90 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        sr.score >= 80 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        sr.score >= 70 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        sr.score >= 60 ? 'bg-blue-50 text-blue-600 border-blue-200' :
                        sr.score >= 55 ? 'bg-sky-50 text-sky-700 border-sky-200' :
                        sr.score >= 50 ? 'bg-sky-50 text-sky-600 border-sky-200' :
                        sr.score >= 45 ? 'text-amber-800 bg-amber-50 border-amber-200' :
                        sr.score >= 40 ? 'text-amber-900 bg-amber-100 border-amber-300' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {sr.unebGrade || sr.letterGrade}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${sr.score}%` }}
                    className={`h-full ${
                      sr.score >= 80 ? 'bg-emerald-600' : sr.score >= 60 ? 'bg-indigo-600' : 'bg-amber-500'
                    }`}
                  />
                </div>

                <div className="text-[11px] text-slate-600 italic">
                  Teacher note: "{sr.teacherComment}"
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Direct Communication with Faculty */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Direct Teacher Communication
              </h2>
            </div>
            <span className="text-xs text-slate-500">Mrs. Catherine Nansubuga</span>
          </div>

          {/* Messages list */}
          <div className="p-4 space-y-3 overflow-y-auto max-h-[360px] min-h-[260px] text-xs">
            {parentMessages.map((msg) => {
              const isParent = msg.senderRole === 'parent';
              return (
                <div key={msg.id} className={`flex flex-col ${isParent ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-slate-400 mb-0.5 font-mono">
                    {msg.senderName} · {msg.timestamp}
                  </span>
                  <div
                    className={`p-3 rounded-xl max-w-xs leading-relaxed ${
                      isParent
                        ? 'bg-slate-900 text-white rounded-tr-none'
                        : 'bg-slate-100 text-slate-900 rounded-tl-none border border-slate-200'
                    }`}
                  >
                    <div className="font-semibold text-[10px] mb-1 opacity-80 border-b border-white/20 pb-0.5">
                      {msg.subject}
                    </div>
                    <p>{msg.message}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Parent Message Input */}
          <form onSubmit={handleSendParentReply} className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type message to Leo's class teacher..."
              value={parentReply}
              onChange={(e) => setParentReply(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <button
              type="submit"
              disabled={!parentReply.trim()}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Reply
            </button>
          </form>

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
