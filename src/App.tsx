/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { TopNav } from './components/TopNav';
import { DashboardView } from './components/DashboardView';
import { AttendanceTracker } from './components/AttendanceTracker';
import { GradebookView } from './components/GradebookView';
import { ProgressMonitoringView } from './components/ProgressMonitoringView';
import { CommunicationPortal } from './components/CommunicationPortal';
import { ParentPortalView } from './components/ParentPortalView';
import { StudentPortalView } from './components/StudentPortalView';

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const { schoolInfo } = useSchool();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Bar Contract Navigation */}
      <TopNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && <DashboardView setActiveTab={setActiveTab} />}
        {activeTab === 'attendance' && <AttendanceTracker />}
        {activeTab === 'gradebook' && <GradebookView />}
        {activeTab === 'reports' && <ProgressMonitoringView />}
        {activeTab === 'communication' && <CommunicationPortal />}
        {activeTab === 'parent_portal' && <ParentPortalView />}
        {activeTab === 'student_portal' && <StudentPortalView />}
      </main>

      {/* Quiet Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-slate-500 text-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">{schoolInfo.name}</span>
            <span aria-hidden="true">·</span>
            <span>Accredited Academic Information System</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Session: {schoolInfo.academicYear}</span>
            <span aria-hidden="true">·</span>
            <span>{schoolInfo.currentTerm}</span>
            <span aria-hidden="true">·</span>
            <span>Registrar's Office</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <SchoolProvider>
      <AppContent />
    </SchoolProvider>
  );
}
