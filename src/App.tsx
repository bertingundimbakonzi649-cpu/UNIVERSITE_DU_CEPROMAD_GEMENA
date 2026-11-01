/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DesktopHeader } from './components/DesktopHeader';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { InscriptionsView } from './components/inscriptions/InscriptionsView';
import { ReinscriptionsView } from './components/reinscriptions/ReinscriptionsView';
import { FinancesView } from './components/finances/FinancesView';
import { ProgrammesView } from './components/programmes/ProgrammesView';
import { DocumentsView } from './components/documents/DocumentsView';
import { SettingsView } from './components/settings/SettingsView';
import { PrintModal } from './components/print/PrintModal';
import { DownloadModal } from './components/download/DownloadModal';

const AppContent: React.FC = () => {
  const { activeTab, closePrintModal, printModal } = useApp();
  const [isDownloadOpen, setIsDownloadOpen] = React.useState(false);

  // Keyboard shortcut support for desktop feel (Escape to close print modal or download modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (printModal.isOpen) closePrintModal();
        if (isDownloadOpen) setIsDownloadOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [printModal.isOpen, closePrintModal, isDownloadOpen]);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Desktop Window Titlebar & Header */}
      <DesktopHeader onOpenDownload={() => setIsDownloadOpen(true)} />

      {/* Main Workspace Frame */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar onOpenDownload={() => setIsDownloadOpen(true)} />

        {/* Dynamic Center Work Area */}
        <main className="flex-1 overflow-hidden bg-slate-950 relative">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'inscriptions' && <InscriptionsView />}
          {activeTab === 'reinscriptions' && <ReinscriptionsView />}
          {activeTab === 'finances' && <FinancesView />}
          {activeTab === 'programmes' && <ProgrammesView />}
          {activeTab === 'documents' && <DocumentsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Print Overlays & Printable Modal */}
      <PrintModal />

      {/* Download & Desktop Installation Modal */}
      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
