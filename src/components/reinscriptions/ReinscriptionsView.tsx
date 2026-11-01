/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NiveauEtude, Student } from '../../types';
import {
  UserCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Printer,
  GraduationCap,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles,
} from 'lucide-react';

export const ReinscriptionsView: React.FC = () => {
  const {
    students,
    reinscriptions,
    settings,
    processReinscription,
    getStudentFinancialSummary,
    getFacultyById,
    getFiliereById,
    openPrintModal,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForRe, setSelectedStudentForRe] = useState<Student | null>(null);

  // Form states for re-enrollment
  const [decisionJury, setDecisionJury] = useState<'Admis' | 'Ajourné' | 'Redoublant'>('Admis');
  const [quitusAcademique, setQuitusAcademique] = useState(true);
  const [quitusFinancier, setQuitusFinancier] = useState(true);
  const [cibleNiveau, setCibleNiveau] = useState<NiveauEtude>('L2 LMD');
  const [observation, setObservation] = useState('');

  // Eligible students for re-enrollment
  const eligibleCandidates = students.filter(st => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      st.id.toLowerCase().includes(q) ||
      st.nom.toLowerCase().includes(q) ||
      st.postnom.toLowerCase().includes(q) ||
      st.prenom.toLowerCase().includes(q)
    );
  });

  const handleSelectStudent = (st: Student) => {
    setSelectedStudentForRe(st);
    // Suggest next level
    let next: NiveauEtude = 'L2 LMD';
    if (st.niveau === 'L1 LMD') next = 'L2 LMD';
    else if (st.niveau === 'L2 LMD') next = 'L3 LMD';
    else if (st.niveau === 'L3 LMD') next = 'Master 1';
    else if (st.niveau === 'Master 1') next = 'Master 2';
    else next = 'Master 2';

    setCibleNiveau(next);
    setObservation(`Admis en délibération officielle. Quitus financier N-1 en ordre.`);
  };

  const handleProcessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForRe) return;

    processReinscription({
      etudiantId: selectedStudentForRe.id,
      anneePrecedente: '2023-2024',
      niveauPrecedent: selectedStudentForRe.niveau,
      anneeNouvelle: settings.anneeAcademiqueActive,
      niveauNouveau: cibleNiveau,
      quitusFinancierN1: quitusFinancier,
      quitusAcademiqueN1: quitusAcademique,
      decisionJury: decisionJury,
      observation: observation,
    });

    alert(`Réinscription de l'étudiant ${selectedStudentForRe.nom} ${selectedStudentForRe.postnom} validée pour ${cibleNiveau} !`);
    setSelectedStudentForRe(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto h-full overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Gestion des Réinscriptions (Anciens Étudiants)
            </h2>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 font-mono">
              {reinscriptions.length} validées
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Contrôle du quitus financier N-1, délibération de passage de promotion et basculement d'année
          </p>
        </div>
      </div>

      {/* Main 2-Column Split: Search/Process on Left, Validated Records on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Process New Re-registration */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>1. Recherche & Sélection de l'Étudiant</span>
            </h3>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Entrez le matricule ou le nom de l'ancien étudiant..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 text-slate-100 placeholder-slate-400 pl-9 pr-3 py-2 rounded-lg border border-slate-700 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Candidate List preview */}
            <div className="space-y-2 max-h-56 overflow-y-auto divide-y divide-slate-800/80 pr-1">
              {eligibleCandidates.map(st => {
                const fin = getStudentFinancialSummary(st.id);
                const isSelected = selectedStudentForRe?.id === st.id;
                return (
                  <div
                    key={st.id}
                    onClick={() => handleSelectStudent(st)}
                    className={`pt-2.5 pb-2.5 px-3 rounded-lg flex items-center justify-between text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-amber-500/15 border border-amber-500/30 text-white'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-100">
                        {st.nom} {st.postnom} {st.prenom}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {st.id} · Actuel : {st.niveau} ({getFacultyById(st.faculteId)?.sigle})
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                          fin.statut === 'En règle'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {fin.statut}
                      </span>
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
                      >
                        Sélectionner
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Processing Box */}
          {selectedStudentForRe && (
            <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-5 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-sm border border-amber-500/30">
                    {selectedStudentForRe.nom[0]}
                    {selectedStudentForRe.postnom[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {selectedStudentForRe.nom} {selectedStudentForRe.postnom} {selectedStudentForRe.prenom}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      {selectedStudentForRe.id} · Promo N-1 : {selectedStudentForRe.niveau}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudentForRe(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
              </div>

              <form onSubmit={handleProcessSubmit} className="space-y-4 text-xs">
                {/* Quitus Checks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={quitusFinancier}
                      onChange={e => setQuitusFinancier(e.target.checked)}
                      className="rounded text-amber-500"
                    />
                    <div>
                      <span className="font-semibold text-slate-200 block">Quitus Financier N-1</span>
                      <span className="text-[11px] text-slate-400">
                        Totalité des frais de l'année précédente acquittée
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={quitusAcademique}
                      onChange={e => setQuitusAcademique(e.target.checked)}
                      className="rounded text-amber-500"
                    />
                    <div>
                      <span className="font-semibold text-slate-200 block">Quitus Académique N-1</span>
                      <span className="text-[11px] text-slate-400">
                        60 crédits LMD validés en délibération
                      </span>
                    </div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Décision du Jury</label>
                    <select
                      value={decisionJury}
                      onChange={e => setDecisionJury(e.target.value as any)}
                      className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700"
                    >
                      <option value="Admis">Admis en promotion supérieure</option>
                      <option value="Ajourné">Ajourné (Session de rattrapage)</option>
                      <option value="Redoublant">Autorisé à bisser / redoubler</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">
                      Nouvelle Promotion Cible ({settings.anneeAcademiqueActive})
                    </label>
                    <select
                      value={cibleNiveau}
                      onChange={e => setCibleNiveau(e.target.value as NiveauEtude)}
                      className="w-full bg-slate-800 text-amber-300 font-semibold px-3 py-2 rounded-lg border border-slate-700"
                    >
                      <option value="L1 LMD">L1 LMD (Redoublement)</option>
                      <option value="L2 LMD">L2 LMD</option>
                      <option value="L3 LMD">L3 LMD (Classe terminale Licence)</option>
                      <option value="Master 1">Master 1</option>
                      <option value="Master 2">Master 2</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Observations de l'Apparitorat</label>
                  <input
                    type="text"
                    value={observation}
                    onChange={e => setObservation(e.target.value)}
                    className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Valider la Réinscription {settings.anneeAcademiqueActive}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Historical List of Validated Reinscriptions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Bordereaux de Réinscription Validés
                </h3>
                <p className="text-xs text-slate-400">
                  Registre officiel de promotion pour {settings.anneeAcademiqueActive}
                </p>
              </div>
              <span className="font-mono text-xs text-amber-400 font-bold">
                {reinscriptions.length} enregistrements
              </span>
            </div>

            <div className="space-y-3">
              {reinscriptions.map(r => {
                const st = students.find(s => s.id === r.etudiantId);
                return (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-100">
                        {st ? `${st.nom} ${st.postnom} ${st.prenom}` : r.etudiantId}
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{r.decisionJury}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span className="font-mono">{r.etudiantId}</span>
                      <span className="text-amber-400 font-medium">
                        {r.niveauPrecedent} → {r.niveauNouveau}
                      </span>
                      <span className="font-mono tabular-nums">{r.dateValidation}</span>
                    </div>

                    {r.observation && (
                      <p className="text-[11px] text-slate-400 italic bg-slate-900/80 p-2 rounded border border-slate-800">
                        "{r.observation}"
                      </p>
                    )}

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => st && openPrintModal('fiche', st)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Fiche réinscription</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
