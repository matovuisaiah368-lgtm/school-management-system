import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { CommunicationMessage, SchoolNotice, ConferenceBooking } from '../types';
import { 
  MessageSquare, 
  Send, 
  Bell, 
  Calendar, 
  AlertCircle, 
  CheckCheck, 
  Plus, 
  FileText, 
  Clock, 
  User, 
  ShieldCheck,
  Video,
  Sparkles
} from 'lucide-react';

export const CommunicationPortal: React.FC = () => {
  const {
    students,
    messages,
    sendMessage,
    markMessageRead,
    notices,
    addNotice,
    conferences,
    bookConference,
    currentRole
  } = useSchool();

  const [activeSubTab, setActiveSubTab] = useState<'messages' | 'notices' | 'conferences'>('messages');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('std-001');

  // Message composer state
  const [replyText, setReplyText] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [category, setCategory] = useState<CommunicationMessage['category']>('academic');

  // Notice composer state
  const [isNewNoticeOpen, setIsNewNoticeOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticePriority, setNoticePriority] = useState<SchoolNotice['priority']>('normal');

  // Conference booking state
  const [isBookConfOpen, setIsBookConfOpen] = useState(false);
  const [confDate, setConfDate] = useState('2026-10-08');
  const [confTime, setConfTime] = useState('14:00 - 14:20');
  const [confMode, setConfMode] = useState<'In-person' | 'Virtual Video'>('In-person');
  const [confNotes, setConfNotes] = useState('');

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Messages for this student
  const studentMessages = messages
    .filter((m) => m.studentId === selectedStudentId)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  // Quick reply templates
  const quickTemplates = [
    {
      title: "Exam Commendation",
      text: `Hello, we would like to commend ${selectedStudent.name} for remarkable diligence and academic mastery in recent assessments. Keep up the wonderful work!`
    },
    {
      title: "Attendance Check-in",
      text: `Dear guardian, please note that an absence was recorded for ${selectedStudent.name}. Kindly submit an authorized medical slip or note to ensure records remain accurate.`
    },
    {
      title: "Schedule Consultation",
      text: `Dear ${selectedStudent.guardianName}, I would like to schedule a 15-minute conference regarding ${selectedStudent.name}'s progress and upcoming term goals.`
    }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const senderName = currentRole === 'parent' ? selectedStudent.guardianName : 'Mrs. Catherine Nansubuga';
    const recipientName = currentRole === 'parent' ? 'Mrs. Catherine Nansubuga' : selectedStudent.guardianName;

    sendMessage({
      studentId: selectedStudent.id,
      senderId: currentRole === 'parent' ? `par-${selectedStudent.id}` : 'tch-catherine',
      senderName,
      senderRole: currentRole,
      recipientId: currentRole === 'parent' ? 'tch-catherine' : `par-${selectedStudent.id}`,
      recipientName,
      subject: `Academic & Progress Discussion: ${selectedStudent.name}`,
      message: replyText.trim(),
      isUrgent,
      category
    });

    setReplyText('');
    setIsUrgent(false);
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    addNotice({
      title: noticeTitle.trim(),
      content: noticeContent.trim(),
      date: new Date().toISOString().slice(0, 10),
      author: currentRole === 'teacher' ? 'Faculty Academic Board' : 'School Administration',
      priority: noticePriority,
      targetAudience: 'all'
    });

    setNoticeTitle('');
    setNoticeContent('');
    setIsNewNoticeOpen(false);
  };

  const handleBookConference = (e: React.FormEvent) => {
    e.preventDefault();
    bookConference({
      teacherName: 'Mrs. Catherine Nansubuga',
      parentName: selectedStudent.guardianName,
      studentName: selectedStudent.name,
      date: confDate,
      timeSlot: confTime,
      mode: confMode,
      status: 'confirmed',
      notes: confNotes || 'Primary 5 pupil progress & enrichment consultation.'
    });

    setIsBookConfOpen(false);
    setConfNotes('');
  };

  return (
    <div className="space-y-6">
      
      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('messages')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'messages'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Direct Messages & Threads
          </button>

          <button
            onClick={() => setActiveSubTab('notices')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'notices'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Official Bulletins & Notices ({notices.length})
          </button>

          <button
            onClick={() => setActiveSubTab('conferences')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'conferences'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Conference Scheduler ({conferences.length})
          </button>
        </div>

        {activeSubTab === 'notices' && (
          <button
            onClick={() => setIsNewNoticeOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Publish Notice
          </button>
        )}

        {activeSubTab === 'conferences' && (
          <button
            onClick={() => setIsBookConfOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-2xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            Schedule Conference
          </button>
        )}
      </div>

      {/* VIEW 1: Direct Messaging Hub */}
      {activeSubTab === 'messages' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
          
          {/* Left Student / Parent Thread Selector */}
          <div className="md:col-span-4 border-r border-slate-200 bg-slate-50/50 flex flex-col">
            <div className="p-3.5 border-b border-slate-200 bg-slate-100/60 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Parent & Student Channels
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {students.length} Channels
              </span>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-auto max-h-[540px]">
              {students.map((student) => {
                const sMsgs = messages.filter((m) => m.studentId === student.id);
                const lastMsg = sMsgs[0];
                const unread = sMsgs.filter((m) => !m.read && m.senderRole !== currentRole).length;
                const isSelected = student.id === selectedStudentId;

                return (
                  <button
                    key={student.id}
                    onClick={() => {
                      setSelectedStudentId(student.id);
                      sMsgs.forEach((m) => markMessageRead(m.id));
                    }}
                    className={`w-full p-3 text-left transition-colors flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-white border-l-4 border-slate-900 shadow-2xs'
                        : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {student.name}
                        </span>
                        {unread > 0 && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {student.guardianName}
                      </div>
                      {lastMsg && (
                        <p className="text-[11px] text-slate-600 truncate mt-1 italic">
                          "{lastMsg.message}"
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Active Message Thread */}
          <div className="md:col-span-8 flex flex-col justify-between bg-white">
            
            {/* Thread Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {selectedStudent.name} · Parent Thread
                </h3>
                <span className="text-[11px] text-slate-500">
                  Primary Guardian: <strong className="text-slate-800">{selectedStudent.guardianName}</strong> ({selectedStudent.guardianEmail})
                </span>
              </div>
              <div className="text-right">
                <span className="inline-block text-[11px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                  Cohort {selectedStudent.grade}-{selectedStudent.section}
                </span>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="p-4 space-y-4 overflow-y-auto max-h-[380px] min-h-[280px]">
              {studentMessages.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No previous messages in this channel. Send an introductory note or progress reminder below.
                </div>
              ) : (
                studentMessages.map((msg) => {
                  const isCurrentRole = msg.senderRole === currentRole;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isCurrentRole ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                        <span className="font-semibold text-slate-600">{msg.senderName}</span>
                        <span>·</span>
                        <span className="font-mono">{msg.timestamp}</span>
                        {msg.isUrgent && (
                          <span className="text-rose-600 font-bold ml-1">● Urgent Notice</span>
                        )}
                      </div>

                      <div
                        className={`p-3.5 rounded-xl max-w-lg text-xs leading-relaxed ${
                          isCurrentRole
                            ? 'bg-slate-900 text-white rounded-tr-none'
                            : 'bg-slate-100 text-slate-900 rounded-tl-none border border-slate-200'
                        }`}
                      >
                        <div className="font-semibold text-[11px] mb-1 opacity-90 border-b border-white/20 pb-0.5">
                          {msg.subject}
                        </div>
                        <p className="whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Templates Bar */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="text-slate-400 shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                Quick Templates:
              </span>
              {quickTemplates.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => setReplyText(tmpl.text)}
                  className="px-2 py-1 bg-white hover:bg-slate-200/70 border border-slate-200 rounded text-slate-700 whitespace-nowrap transition-colors"
                >
                  {tmpl.title}
                </button>
              ))}
            </div>

            {/* Reply Composer Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span className="font-medium text-[11px]">Mark as Urgent Alert</span>
                  </label>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="text-[11px] bg-slate-50 border border-slate-200 rounded px-2 py-0.5"
                  >
                    <option value="academic">Academic Progress</option>
                    <option value="attendance">Attendance Audit</option>
                    <option value="conduct">Conduct & Engagement</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>

                <span className="text-[10px] text-slate-400 font-mono">
                  Role: {currentRole}
                </span>
              </div>

              <div className="flex items-end gap-2">
                <textarea
                  rows={2}
                  placeholder={`Write a message to ${currentRole === 'parent' ? 'Mr. Clark' : selectedStudent.guardianName}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 p-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none"
                />

                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs h-full"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send
                </button>
              </div>
            </form>

          </div>

        </div>
      )}

      {/* VIEW 2: Official Bulletins & Notices Board */}
      {activeSubTab === 'notices' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      notice.priority === 'urgent' ? 'bg-rose-600' :
                      notice.priority === 'important' ? 'bg-amber-500' :
                      'bg-indigo-600'
                    }`} />
                    <h3 className="text-sm font-bold text-slate-900">
                      {notice.title}
                    </h3>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {notice.date}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {notice.content}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Authorized by: <strong>{notice.author}</strong></span>
                  <span className="capitalize font-mono">Audience: {notice.targetAudience}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: Parent-Teacher Conference Scheduler */}
      {activeSubTab === 'conferences' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Scheduled Consultations & Academic Conferences
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                Term 2 Consultation Block
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {conferences.map((conf) => (
                <div key={conf.id} className="p-4 hover:bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{conf.studentName}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-700 font-medium">Guardian: {conf.parentName}</span>
                    </div>
                    <div className="text-slate-500 flex items-center gap-3">
                      <span>Faculty: {conf.teacherName}</span>
                      <span>·</span>
                      <span className="font-mono text-slate-800">{conf.date} at {conf.timeSlot}</span>
                    </div>
                    <div className="text-slate-600 italic text-[11px]">
                      Notes: {conf.notes}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium">
                      {conf.mode === 'Virtual Video' ? <Video className="w-3 h-3 text-indigo-600" /> : <User className="w-3 h-3 text-slate-600" />}
                      {conf.mode}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 font-semibold uppercase text-[10px]">
                      {conf.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Publish Notice */}
      {isNewNoticeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Publish School Bulletin Notice</h3>
              <button onClick={() => setIsNewNoticeOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-3">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-slate-600 mb-1">Notice Title</label>
                <input
                  type="text"
                  placeholder="e.g. Science Fair Registration Open"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-slate-600 mb-1">Priority</label>
                <select
                  value={noticePriority}
                  onChange={(e) => setNoticePriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                >
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-slate-600 mb-1">Notice Body</label>
                <textarea
                  rows={4}
                  placeholder="Enter full notice announcement details..."
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsNewNoticeOpen(false)} className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded font-medium hover:bg-slate-800">Publish Notice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Schedule Conference */}
      {isBookConfOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Schedule Parent-Teacher Conference</h3>
              <button onClick={() => setIsBookConfOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleBookConference} className="space-y-3">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-slate-600 mb-1">Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.guardianName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-slate-600 mb-1">Date</label>
                  <input
                    type="date"
                    value={confDate}
                    onChange={(e) => setConfDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-md font-mono"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-slate-600 mb-1">Time Slot</label>
                  <select
                    value={confTime}
                    onChange={(e) => setConfTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md bg-white font-mono"
                  >
                    <option value="14:00 - 14:20">14:00 - 14:20</option>
                    <option value="14:30 - 14:50">14:30 - 14:50</option>
                    <option value="15:00 - 15:20">15:00 - 15:20</option>
                    <option value="15:30 - 15:50">15:30 - 15:50</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-slate-600 mb-1">Meeting Mode</label>
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="mode"
                      checked={confMode === 'In-person'}
                      onChange={() => setConfMode('In-person')}
                    />
                    <span>In-person (Room 204)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="mode"
                      checked={confMode === 'Virtual Video'}
                      onChange={() => setConfMode('Virtual Video')}
                    />
                    <span>Virtual Video Conference</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-slate-600 mb-1">Consultation Agenda</label>
                <input
                  type="text"
                  placeholder="e.g. Midterm exam review and honors tract planning"
                  value={confNotes}
                  onChange={(e) => setConfNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsBookConfOpen(false)} className="px-3 py-1.5 text-slate-600 font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded font-medium hover:bg-slate-800">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
