/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { CAMPUS_BUILDING, UNIVERSITY_EMBLEM } from '../../data/initialData';
import {
  Users,
  CreditCard,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  Printer,
  ArrowRight,
  ShieldCheck,
  Receipt,
  UserPlus,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    students,
    payments,
    faculties,
    settings,
    financialStats,
    setActiveTab,
    formatUSD,
    formatCDF,
    openPrintModal,
    setSelectedStudent,
  } = useApp();

  const totalGarcons = students.filter(s => s.sexe === 'M').length;
  const totalFilles = students.filter(s => s.sexe === 'F').length;
  const pourcentageFilles = students.length > 0 ? Math.round((totalFilles / students.length) * 100) : 0;

  // Recent 5 payments
  const recentPayments = payments.slice(0, 5);

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Institutional Campus Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
        <div className="absolute inset-0">
          <img
            src={CAMPUS_BUILDING}
            alt="Campus Université CEPROMAD Gemena"
            className="w-full h-full object-cover opacity-20 filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-900/60" />
        </div>

        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Campus Principal de Gemena · Province du Sud-Ubangi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Tableau de Bord Rectoral & Académique
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Suivi centralisé des inscriptions 2024-2025, vérification des dossiers scolaires,
              encaissement des tranches de frais d'études et déploiement des maquettes LMD.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('inscriptions')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Nouvelle Inscription</span>
            </button>
            <button
              onClick={() => setActiveTab('finances')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Receipt className="w-4 h-4" />
              <span>Encaisser Frais</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row (Tabular Figures, Clean single-elevation depth) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Enrolled */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Effectifs Étudiants
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {financialStats.totalEtudiants}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>{financialStats.totalInscrits} Nouveaux</span>
              <span>·</span>
              <span>{financialStats.totalReinscrits} Réinscrits</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Parité : {totalGarcons} H / {totalFilles} F</span>
            <span className="text-amber-400 font-semibold">{pourcentageFilles}% femmes</span>
          </div>
        </div>

        {/* Card 2: Financial Recovery Total */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Recouvrement Frais
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
              {formatUSD(financialStats.totalRecouvreUSD)}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono tabular-nums">
              ≈ {formatCDF(financialStats.totalRecouvreUSD * settings.tauxChangeUSD_CDF)}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Prévisions : {formatUSD(financialStats.totalPrevuUSD)}</span>
            <span className="text-emerald-400 font-semibold font-mono tabular-nums">
              {Math.round(financialStats.tauxRecouvrement)}%
            </span>
          </div>
        </div>

        {/* Card 3: Solvency status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Statut Solvabilité
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {financialStats.totalSolvables} <span className="text-xs font-normal text-slate-400">en règle</span>
            </div>
            <div className="text-xs text-amber-400 mt-1 font-mono tabular-nums">
              {financialStats.totalPartiels} paiements partiels
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Insolvables complets :</span>
            <span className="text-rose-400 font-semibold font-mono tabular-nums">
              {financialStats.totalInsolvables}
            </span>
          </div>
        </div>

        {/* Card 4: Academic faculties */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Facultés & LMD
            </span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {faculties.length} <span className="text-xs font-normal text-slate-400">Facultés</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {faculties.reduce((acc, f) => acc + f.filieres.length, 0)} Départements & Filières
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Cycle Licence & Master</span>
            <span className="text-purple-400 font-semibold">Système LMD</span>
          </div>
        </div>
      </div>

      {/* Grid: Distribution by Faculty + Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Effectifs par Faculté */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Effectifs par Faculté
              </h3>
              <p className="text-xs text-slate-400">
                Répartition des étudiants inscrits et réinscrits au Campus de Gemena
              </p>
            </div>
            <button
              onClick={() => setActiveTab('programmes')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <span>Voir Maquettes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {faculties.map(fac => {
              const studentsInFac = students.filter(s => s.faculteId === fac.id);
              const count = studentsInFac.length;
              const percentage = students.length > 0 ? (count / students.length) * 100 : 0;
              return (
                <div key={fac.id} className="space-y-1.5 p-3 rounded-lg bg-slate-950/40 border border-slate-800/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">
                      {fac.nom} ({fac.sigle})
                    </span>
                    <span className="font-mono text-slate-300 font-semibold tabular-nums">
                      {count} {count > 1 ? 'étudiants' : 'étudiant'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Doyen : {fac.doyen}</span>
                    <span className="font-mono tabular-nums">{Math.round(percentage)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Derniers Paiements Enregistrés */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Derniers Versements Effectués
              </h3>
              <p className="text-xs text-slate-400">
                Journal de caisse & bordereaux bancaires récents
              </p>
            </div>
            <button
              onClick={() => setActiveTab('finances')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <span>Accéder à la Caisse</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {recentPayments.map(pay => {
              const student = students.find(s => s.id === pay.etudiantId);
              return (
                <div
                  key={pay.id}
                  className="py-3 flex items-center justify-between gap-3 text-xs hover:bg-slate-800/40 px-2 rounded-lg transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-100">
                        {student ? `${student.nom} ${student.postnom}` : pay.etudiantId}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {pay.numeroRecu}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>{pay.typeFrais}</span>
                      <span>·</span>
                      <span className="text-slate-300">{pay.modePaiement}</span>
                      <span>·</span>
                      <span className="font-mono tabular-nums">{pay.datePaiement}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-emerald-400 font-mono tabular-nums">
                        {formatUSD(pay.montantUSD)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono tabular-nums">
                        {formatCDF(pay.montantCDF)}
                      </div>
                    </div>
                    <button
                      onClick={() => openPrintModal('recu', pay)}
                      title="Imprimer le reçu de caisse"
                      className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
