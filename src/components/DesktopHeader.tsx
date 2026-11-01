/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { UNIVERSITY_EMBLEM } from '../data/initialData';
import { Search, ShieldCheck, RefreshCw, Minus, Square, X, Calendar, DollarSign, Download } from 'lucide-react';

interface DesktopHeaderProps {
  onOpenDownload?: () => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({ onOpenDownload }) => {
  const {
    settings,
    searchQuery,
    setSearchQuery,
    setActiveTab,
    students,
    setSelectedStudent,
  } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setCurrentDate(
        now.toLocaleDateString('fr-FR', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Quick filtered students for top search
  const searchResults = searchQuery.trim()
    ? students
        .filter(
          s =>
            s.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.postnom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.telephone.includes(searchQuery)
        )
        .slice(0, 5)
    : [];

  return (
    <header className="no-print bg-slate-900 border-b border-slate-800 text-slate-200 select-none shrink-0 z-40">
      {/* Topmost OS Window Titlebar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 text-xs border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 hover:bg-rose-500 inline-block cursor-pointer transition-colors" title="Fermer la session" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 hover:bg-amber-500 inline-block cursor-pointer transition-colors" title="Réduire" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 hover:bg-emerald-500 inline-block cursor-pointer transition-colors" title="Agrandir" />
          </div>
          <span className="text-slate-400 font-medium">CEPROMAD DESKTOP ERP · GEMENA</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            Mode Local Sécurisé
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px] tabular-nums">
          <span className="hidden sm:inline">Province du Sud-Ubangi (RDC)</span>
          <span className="text-slate-600">·</span>
          <span>{currentDate}</span>
          <span className="text-slate-300 font-semibold">{currentTime} (UTC+1)</span>
        </div>
      </div>

      {/* Main Desktop Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src={UNIVERSITY_EMBLEM}
            alt="Sceau Université CEPROMAD Gemena"
            className="w-10 h-10 rounded-full border border-amber-400/40 object-cover shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white uppercase">
                Université CEPROMAD
              </h1>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold uppercase tracking-wider border border-amber-500/30">
                Gemena
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Système Intégré de Gestion Académique & Financière
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Recherche rapide (Matricule, Nom, Téléphone)..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full bg-slate-800/90 text-sm text-slate-100 placeholder-slate-400 pl-9 pr-8 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Search Floating Results */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/60 border-b border-slate-800">
                Résultats Étudiants ({searchResults.length})
              </div>
              <div className="divide-y divide-slate-800/80 max-h-64 overflow-y-auto">
                {searchResults.map(st => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setSelectedStudent(st);
                      setActiveTab('inscriptions');
                      setShowSearchResults(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800 flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-slate-100">
                        {st.nom} {st.postnom} {st.prenom}
                      </p>
                      <p className="text-slate-400 font-mono text-[11px]">
                        {st.id} · {st.niveau}
                      </p>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                      Ouvrir la fiche
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status Indicators & Institutional Badges */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/80 text-xs">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Année :</span>
            <span className="font-semibold text-slate-200">
              {settings.anneeAcademiqueActive}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/80 text-xs font-mono tabular-nums">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Taux :</span>
            <span className="font-semibold text-emerald-300">
              1 $ = {settings.tauxChangeUSD_CDF.toLocaleString('fr-FR')} CDF
            </span>
          </div>

          <button
            onClick={onOpenDownload}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            title="Installer l'application sur ce PC ou télécharger les données"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger / Installer PC</span>
          </button>

          <button
            onClick={() => setActiveTab('inscriptions')}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-semibold text-xs rounded-lg transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <span>+ Inscription</span>
          </button>
        </div>
      </div>
    </header>
  );
};
