import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { Role } from '../types';
import { 
  GraduationCap, 
  Users, 
  UserCheck, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  RotateCcw,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';

interface TopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({ activeTab, setActiveTab }) => {
  const { currentRole, setCurrentRole, schoolInfo, messages, resetToDefault } = useSchool();

  const unreadMessagesCount = messages.filter((m) => !m.read).length;

  const roles: { role: Role; label: string; desc: string }[] = [
    { role: 'teacher', label: 'Teacher View', desc: 'Mrs. Catherine Nansubuga (P5-A)' },
    { role: 'parent', label: 'Parent Portal', desc: 'Mr. & Mrs. Davis (Leo\'s Parents)' },
    { role: 'student', label: 'Pupil Portal', desc: 'Leo Davis Ssenyonjo' },
    { role: 'admin', label: 'Head Teacher View', desc: 'Sister Mary Goretti, Ph.D.' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs no-print">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Single text element wordmark / Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-900 text-amber-300 flex items-center justify-center font-bold text-lg shadow-xs overflow-hidden border border-amber-300/30">
              <img
                src="/src/assets/images/light_angels_emblem_1790498287638.jpg"
                alt="Light Angels Crest"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <a 
                href="#dashboard" 
                onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }} 
                className="text-base font-bold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors"
              >
                Light Angels Primary
              </a>
              <span className="text-[11px] text-slate-500 font-medium">
                Attendance, Marks & Communication
              </span>
            </div>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'attendance'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Attendance
            </button>

            <button
              onClick={() => setActiveTab('gradebook')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'gradebook'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Enter Marks (P.1 - P.7)
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'reports'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Progress Reports
            </button>

            <button
              onClick={() => setActiveTab('communication')}
              className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'communication'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Communication
              {unreadMessagesCount > 0 && (
                <span className="ml-1.5 inline-flex items-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-indigo-600 text-white font-mono">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {currentRole === 'parent' && (
              <button
                onClick={() => setActiveTab('parent_portal')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === 'parent_portal'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50/50'
                }`}
              >
                My Child Portal
              </button>
            )}

            {currentRole === 'student' && (
              <button
                onClick={() => setActiveTab('student_portal')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === 'student_portal'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50/50'
                }`}
              >
                My Student View
              </button>
            )}
          </nav>

          {/* Zone 3: 1-2 primary actions & Role Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Role Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200/80">
              <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-500 px-1.5">
                Role:
              </span>
              <select
                value={currentRole}
                onChange={(e) => {
                  const newRole = e.target.value as Role;
                  setCurrentRole(newRole);
                  if (newRole === 'parent') setActiveTab('parent_portal');
                  else if (newRole === 'student') setActiveTab('student_portal');
                  else if (activeTab === 'parent_portal' || activeTab === 'student_portal') setActiveTab('dashboard');
                }}
                className="text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
                title="Switch perspective between Teacher, Parent, Student, and Administrator"
              >
                {roles.map((r) => (
                  <option key={r.role} value={r.role}>
                    {r.label} ({r.desc})
                  </option>
                ))}
              </select>
            </div>

            {/* Reset / Demo seed */}
            <button
              onClick={() => {
                if (window.confirm("Reset all marks, attendance, and messages to initial sample data?")) {
                  resetToDefault();
                }
              }}
              title="Reset to fresh demo sample data"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap ${
              activeTab === 'attendance' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Attendance
          </button>
          <button
            onClick={() => setActiveTab('gradebook')}
            className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap ${
              activeTab === 'gradebook' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Enter Marks
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap ${
              activeTab === 'reports' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => setActiveTab('communication')}
            className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap ${
              activeTab === 'communication' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Messages {unreadMessagesCount > 0 && `(${unreadMessagesCount})`}
          </button>
          {currentRole === 'parent' && (
            <button
              onClick={() => setActiveTab('parent_portal')}
              className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap ${
                activeTab === 'parent_portal' ? 'bg-indigo-600 text-white' : 'text-indigo-600'
              }`}
            >
              Parent Portal
            </button>
          )}
          {currentRole === 'student' && (
            <button
              onClick={() => setActiveTab('student_portal')}
              className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap ${
                activeTab === 'student_portal' ? 'bg-indigo-600 text-white' : 'text-indigo-600'
              }`}
            >
              Student Portal
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
