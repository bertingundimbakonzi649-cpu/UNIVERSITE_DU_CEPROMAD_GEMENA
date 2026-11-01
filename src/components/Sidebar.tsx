/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavigationTab, useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  UserPlus,
  UserCheck,
  CreditCard,
  GraduationCap,
  FileText,
  Settings,
  HardDriveDownload,
  Building2,
  Download,
} from 'lucide-react';

interface SidebarProps {
  onOpenDownload?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenDownload }) => {
  const { activeTab, setActiveTab, students, financialStats, formatUSD } = useApp();

  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }>; badge?: string | number }[] = [
    {
      id: 'dashboard',
      label: 'Tableau de Bord',
      icon: LayoutDashboard,
    },
    {
      id: 'inscriptions',
      label: 'Inscriptions (Nouveaux)',
      icon: UserPlus,
      badge: students.filter(s => s.typeEtudiant === 'Nouveau').length,
    },
    {
      id: 'reinscriptions',
      label: 'Réinscriptions (Anciens)',
      icon: UserCheck,
      badge: students.filter(s => s.typeEtudiant === 'Réinscrit').length,
    },
    {
      id: 'finances',
      label: 'Frais & Caisse',
      icon: CreditCard,
      badge: `${Math.round(financialStats.tauxRecouvrement)}%`,
    },
    {
      id: 'programmes',
      label: 'Programmes LMD',
      icon: GraduationCap,
    },
    {
      id: 'documents',
      label: 'Cartes & Documents',
      icon: FileText,
    },
    {
      id: 'settings',
      label: 'Paramètres & Sauvegarde',
      icon: Settings,
    },
  ];

  return (
    <aside className="no-print w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      {/* Navigation Section */}
      <div className="p-3">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Modules Universitaires
        </div>
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded font-mono ${
                      isActive
                        ? 'bg-slate-950/20 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Campus Context & Summary Box */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        {/* In-App Desktop Install Button */}
        <button
          onClick={onOpenDownload}
          className="w-full py-2 px-3 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Télécharger / Installer PC</span>
        </button>

        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">Campus de Gemena</span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-400">
            <div className="flex justify-between">
              <span>Effectif total :</span>
              <span className="font-mono font-semibold text-slate-200 tabular-nums">
                {financialStats.totalEtudiants} étudiants
              </span>
            </div>
            <div className="flex justify-between">
              <span>Recouvrement :</span>
              <span className="font-mono font-semibold text-emerald-400 tabular-nums">
                {formatUSD(financialStats.totalRecouvreUSD)}
              </span>
            </div>
          </div>
        </div>

        <div className="px-2 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Direction Générale Gemena</span>
          <span className="font-mono text-emerald-400">Base locale OK</span>
        </div>
      </div>
    </aside>
  );
};
