import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { AttendanceStatus, Student } from '../types';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Search, 
  Download, 
  Mail, 
  Info,
  Check,
  History,
  FileSpreadsheet
} from 'lucide-react';

export const AttendanceTracker: React.FC = () => {
  const {
    students,
    classes,
    selectedClassId,
    setSelectedClassId,
    attendance,
    setStudentAttendance,
    markAllAttendance,
    getStudentAttendanceSummary,
    getStudentAttendanceForDate,
    sendMessage
  } = useSchool();

  // Selected date state (defaults to today 2026-09-27)
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-27');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<Student | null>(null);
  const [notificationSentMessage, setNotificationSentMessage] = useState<string | null>(null);

  // Navigate date
  const handleShiftDate = (days: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    const newDateStr = current.toISOString().slice(0, 10);
    setSelectedDate(newDateStr);
  };

  // Currently selected class
  const activeClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  // Filter students by selected cohort class & search query
  const filteredStudents = students.filter((s) => {
    const inClass = s.grade === activeClass.grade;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return inClass && matchesSearch;
  });

  // Calculate stats for current selected date
  const recordsForDate = filteredStudents.map((s) => {
    const rec = getStudentAttendanceForDate(s.id, selectedDate);
    return {
      student: s,
      status: rec?.status || 'present',
      note: rec?.note || ''
    };
  });

  const total = recordsForDate.length;
  const presentCount = recordsForDate.filter((r) => r.status === 'present').length;
  const absentCount = recordsForDate.filter((r) => r.status === 'absent').length;
  const lateCount = recordsForDate.filter((r) => r.status === 'late').length;
  const excusedCount = recordsForDate.filter((r) => r.status === 'excused').length;
  const dailyAttendanceRate = total > 0 ? Math.round(((presentCount + excusedCount + lateCount * 0.8) / total) * 100) : 100;

  // Bulk action: Notify absent parents
  const handleNotifyAbsentParents = () => {
    const absents = recordsForDate.filter((r) => r.status === 'absent');
    if (absents.length === 0) {
      alert("No students marked absent for this date.");
      return;
    }

    absents.forEach((item) => {
      sendMessage({
        studentId: item.student.id,
        senderId: 'tch-catherine',
        senderName: 'Mrs. Catherine Nansubuga',
        senderRole: 'teacher',
        recipientId: `par-${item.student.id}`,
        recipientName: item.student.guardianName,
        subject: `Light Angels Attendance Notice: Absence on ${selectedDate}`,
        message: `Good day, this is an automated attendance notice informing you that ${item.student.name} was marked absent today (${selectedDate}). If this is an authorized absence or due to illness, please submit a written excuse note or call the school office at your earliest convenience.`,
        isUrgent: true,
        category: 'attendance'
      });
    });

    setNotificationSentMessage(`Sent attendance absence notifications to parents of ${absents.length} pupils.`);
    setTimeout(() => setNotificationSentMessage(null), 4000);
  };

  // CSV Export
  const handleExportCsv = () => {
    const headers = ['Pupil Name', 'Roll Number', 'Class', 'Date', 'Status', 'Notes', 'Term Attendance Rate'];
    const rows = filteredStudents.map((s) => {
      const rec = getStudentAttendanceForDate(s.id, selectedDate);
      const summary = getStudentAttendanceSummary(s.id);
      return [
        `"${s.name}"`,
        `"${s.rollNumber}"`,
        `"${s.grade}-${s.section}"`,
        `"${selectedDate}"`,
        `"${rec?.status || 'present'}"`,
        `"${rec?.note || ''}"`,
        `"${summary.ratePercentage}%"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LightAngels_Attendance_${selectedDate}_Primary5A.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        
        {/* Class & Date Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-0.5">Cohort Class</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.room})
                </option>
              ))}
            </select>
          </div>

          <div className="h-7 w-[1px] bg-slate-200 hidden sm:block self-end mb-1" />

          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-0.5">Attendance Date</label>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleShiftDate(-1)}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                title="Previous Day"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs font-mono font-medium text-slate-800">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent focus:outline-none text-xs font-mono cursor-pointer"
                />
              </div>

              <button
                onClick={() => handleShiftDate(1)}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                title="Next Day"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setSelectedDate('2026-09-27')}
                className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
              >
                Today
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => markAllAttendance(selectedDate, 'present')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Mark All Present
          </button>

          <button
            onClick={handleNotifyAbsentParents}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-slate-600" />
            Notify Absent Parents ({absentCount})
          </button>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Export CSV
          </button>
        </div>

      </div>

      {/* Notification Banner */}
      {notificationSentMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-lg flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notificationSentMessage}</span>
          </div>
          <button onClick={() => setNotificationSentMessage(null)} className="text-emerald-700 hover:text-emerald-950">
            ✕
          </button>
        </div>
      )}

      {/* Daily Pulse Scorecards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Daily Rate</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {dailyAttendanceRate}%
          </div>
          <span className="text-[10px] text-slate-500">
            {presentCount + excusedCount} of {total} accounted
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">Present</span>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
            {presentCount}
          </div>
          <span className="text-[10px] text-slate-500">In class on time</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wide">Absent</span>
          <div className="text-2xl font-bold font-mono text-rose-700 mt-1">
            {absentCount}
          </div>
          <span className="text-[10px] text-slate-500">Requires follow-up</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">Late</span>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-1">
            {lateCount}
          </div>
          <span className="text-[10px] text-slate-500">Delayed arrival</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-sky-700 uppercase tracking-wide">Excused</span>
          <div className="text-2xl font-bold font-mono text-sky-700 mt-1">
            {excusedCount}
          </div>
          <span className="text-[10px] text-slate-500">Medical / Authorized</span>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Table Filter Header */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">
              Student Attendance Ledger
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              · {selectedDate} · {currentClass.name}
            </span>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Student & Roll No.</th>
                <th className="py-3 px-4 text-center">Status Action</th>
                <th className="py-3 px-4">Session Notes / Excuse Reason</th>
                <th className="py-3 px-4 text-center">Term Audit</th>
                <th className="py-3 px-4 text-right">Records</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => {
                const rec = getStudentAttendanceForDate(student.id, selectedDate);
                const currentStatus: AttendanceStatus = rec?.status || 'present';
                const summary = getStudentAttendanceSummary(student.id);

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 text-sm">{student.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {student.rollNumber} · Guardian: {student.guardianName}
                      </div>
                    </td>

                    {/* Interactive 4-State Toggle Segment */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                        <button
                          onClick={() => setStudentAttendance(student.id, selectedDate, 'present')}
                          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                              : 'text-slate-600 hover:text-emerald-700'
                          }`}
                          title="Mark Present"
                        >
                          Present
                        </button>

                        <button
                          onClick={() => setStudentAttendance(student.id, selectedDate, 'absent')}
                          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                            currentStatus === 'absent'
                              ? 'bg-rose-600 text-white font-semibold shadow-xs'
                              : 'text-slate-600 hover:text-rose-700'
                          }`}
                          title="Mark Absent"
                        >
                          Absent
                        </button>

                        <button
                          onClick={() => setStudentAttendance(student.id, selectedDate, 'late')}
                          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                            currentStatus === 'late'
                              ? 'bg-amber-600 text-white font-semibold shadow-xs'
                              : 'text-slate-600 hover:text-amber-700'
                          }`}
                          title="Mark Late"
                        >
                          Late
                        </button>

                        <button
                          onClick={() => setStudentAttendance(student.id, selectedDate, 'excused')}
                          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                            currentStatus === 'excused'
                              ? 'bg-sky-600 text-white font-semibold shadow-xs'
                              : 'text-slate-600 hover:text-sky-700'
                          }`}
                          title="Mark Excused"
                        >
                          Excused
                        </button>
                      </div>
                    </td>

                    {/* Inline Session Notes */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="Add note (e.g. excused doctor slip)..."
                        defaultValue={rec?.note || ''}
                        onBlur={(e) => {
                          if (e.target.value !== (rec?.note || '')) {
                            setStudentAttendance(student.id, selectedDate, currentStatus, e.target.value);
                          }
                        }}
                        className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
                      />
                    </td>

                    {/* Term Attendance Rate & Status */}
                    <td className="py-3 px-4 text-center">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {summary.ratePercentage}%
                      </span>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {summary.present}P · {summary.absent}A · {summary.late}L
                      </div>
                    </td>

                    {/* History Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedStudentForHistory(student)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                        title="View Full Attendance History"
                      >
                        <History className="w-3 h-3 text-slate-500" />
                        Log
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Attendance History Drawer / Modal for single student */}
      {selectedStudentForHistory && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedStudentForHistory.name} - Attendance Audit
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  Roll: {selectedStudentForHistory.rollNumber} · Guardian: {selectedStudentForHistory.guardianName}
                </span>
              </div>
              <button
                onClick={() => setSelectedStudentForHistory(null)}
                className="text-slate-400 hover:text-slate-700 text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics */}
            {(() => {
              const summary = getStudentAttendanceSummary(selectedStudentForHistory.id);
              const historyRecords = attendance
                .filter((r) => r.studentId === selectedStudentForHistory.id)
                .sort((a, b) => b.date.localeCompare(a.date));

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase block">Rate</span>
                      <span className="font-mono font-bold text-slate-900 text-base">{summary.ratePercentage}%</span>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded border border-emerald-100">
                      <span className="text-[10px] text-emerald-700 uppercase block">Present</span>
                      <span className="font-mono font-bold text-emerald-800 text-base">{summary.present}</span>
                    </div>
                    <div className="p-2 bg-rose-50 rounded border border-rose-100">
                      <span className="text-[10px] text-rose-700 uppercase block">Absent</span>
                      <span className="font-mono font-bold text-rose-800 text-base">{summary.absent}</span>
                    </div>
                    <div className="p-2 bg-amber-50 rounded border border-amber-100">
                      <span className="text-[10px] text-amber-700 uppercase block">Late/Exc</span>
                      <span className="font-mono font-bold text-amber-800 text-base">{summary.late + summary.excused}</span>
                    </div>
                  </div>

                  {/* Historical Log */}
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-lg">
                    {historyRecords.map((r) => (
                      <div key={r.id} className="p-2.5 flex items-center justify-between text-xs hover:bg-slate-50">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-700 font-medium">{r.date}</span>
                          {r.note && (
                            <span className="text-slate-500 italic text-[11px] truncate max-w-[200px]">
                              - {r.note}
                            </span>
                          )}
                        </div>
                        <span className={`font-mono text-xs font-semibold capitalize ${
                          r.status === 'present' ? 'text-emerald-700' :
                          r.status === 'absent' ? 'text-rose-700' :
                          r.status === 'late' ? 'text-amber-700' : 'text-sky-700'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setSelectedStudentForHistory(null)}
                      className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800"
                    >
                      Close
                    </button>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      )}

    </div>
  );
};
