/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ModePaiement, Payment, TypeFrais } from '../../types';
import {
  CreditCard,
  Search,
  PlusCircle,
  Printer,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle,
  Building,
  DollarSign,
  TrendingUp,
  Receipt,
  X,
  ShieldCheck,
  User,
} from 'lucide-react';

export const FinancesView: React.FC = () => {
  const {
    students,
    payments,
    settings,
    financialStats,
    addPayment,
    cancelPayment,
    formatUSD,
    formatCDF,
    openPrintModal,
    getStudentFinancialSummary,
    exportToCSV,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'journal' | 'solvabilite' | 'insolvables'>('journal');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<string>('all');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // New Payment Form state
  const [paymentForm, setPaymentForm] = useState({
    etudiantId: students[0]?.id || '',
    montantUSD: 180,
    typeFrais: 'Tranche 1 (Minerval)' as TypeFrais,
    modePaiement: 'Caisse Centrale' as ModePaiement,
    numeroBordereau: '',
    banque: '',
    motif: 'Versement des frais académiques',
  });

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.etudiantId) {
      alert('Veuillez sélectionner un étudiant.');
      return;
    }

    const created = addPayment({
      etudiantId: paymentForm.etudiantId,
      montantUSD: Number(paymentForm.montantUSD),
      montantCDF: Number(paymentForm.montantUSD) * settings.tauxChangeUSD_CDF,
      tauxChange: settings.tauxChangeUSD_CDF,
      typeFrais: paymentForm.typeFrais,
      modePaiement: paymentForm.modePaiement,
      numeroBordereau: paymentForm.numeroBordereau || undefined,
      banque: paymentForm.modePaiement !== 'Caisse Centrale' ? (paymentForm.banque || paymentForm.modePaiement) : undefined,
      datePaiement: new Date().toISOString().split('T')[0],
      anneeAcademique: settings.anneeAcademiqueActive,
      percepteur: 'Direction Financière Gemena',
      statut: 'Validé',
      motif: paymentForm.motif,
    });

    setIsPaymentModalOpen(false);
    // Directly open print receipt modal for convenience
    openPrintModal('recu', created);
  };

  // Filtered Payments
  const filteredPayments = payments.filter(p => {
    if (filterMode !== 'all' && p.modePaiement !== filterMode) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const st = students.find(s => s.id === p.etudiantId);
      const studentName = st ? `${st.nom} ${st.postnom} ${st.prenom}`.toLowerCase() : '';
      const match =
        p.numeroRecu.toLowerCase().includes(q) ||
        p.etudiantId.toLowerCase().includes(q) ||
        studentName.includes(q) ||
        (p.numeroBordereau && p.numeroBordereau.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Insolvables List
  const insolvablesList = students
    .map(st => ({
      student: st,
      summary: getStudentFinancialSummary(st.id),
    }))
    .filter(item => item.summary.statut !== 'En règle');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto h-full overflow-y-auto">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Gestion Financière & Recouvrement des Frais
            </h2>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 font-mono">
              {formatUSD(financialStats.totalRecouvreUSD)} encaissés
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Caisse centrale de l'Université CEPROMAD Gemena, conciliation bancaire et délivrance des reçus sécurisés
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => exportToCSV('paiements')}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exporter Journal CSV</span>
          </button>
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Enregistrer un Versement</span>
          </button>
        </div>
      </div>

      {/* Financial Top Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold">Total Recouvré (USD / CDF)</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            {formatUSD(financialStats.totalRecouvreUSD)}
          </div>
          <div className="text-xs text-slate-400 font-mono tabular-nums">
            ≈ {formatCDF(financialStats.totalRecouvreUSD * settings.tauxChangeUSD_CDF)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold">Solde Reste à Recouvrer</span>
          <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
            {formatUSD(Math.max(0, financialStats.totalPrevuUSD - financialStats.totalRecouvreUSD))}
          </div>
          <div className="text-xs text-slate-400">
            Objectif total : {formatUSD(financialStats.totalPrevuUSD)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold">Taux d'Apurement Global</span>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {Math.round(financialStats.tauxRecouvrement)}%
          </div>
          <div className="text-xs text-emerald-400 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{financialStats.totalSolvables} étudiants totalement en règle</span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('journal')}
          className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'journal'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Journal des Versements ({payments.length})
        </button>
        <button
          onClick={() => setActiveSubTab('solvabilite')}
          className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'solvabilite'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Comptes & Solvabilité des Étudiants
        </button>
        <button
          onClick={() => setActiveSubTab('insolvables')}
          className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'insolvables'
              ? 'bg-rose-500 text-white font-bold'
              : 'text-rose-400 hover:text-rose-300 hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Contrôle Examens / Insolvables ({insolvablesList.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: Journal des Versements */}
      {activeSubTab === 'journal' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1 min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par reçu N°, matricule, étudiant, bordereau..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 text-slate-100 placeholder-slate-400 px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Canal de versement :</span>
              <select
                value={filterMode}
                onChange={e => setFilterMode(e.target.value)}
                className="bg-slate-800 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
              >
                <option value="all">Tous les canaux</option>
                <option value="Caisse Centrale">Caisse Centrale</option>
                <option value="EquityBCDC">EquityBCDC</option>
                <option value="Rawbank">Rawbank</option>
                <option value="TMB">TMB</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
                    <th className="py-3 px-4">N° Quittance / Date</th>
                    <th className="py-3 px-3">Étudiant & Matricule</th>
                    <th className="py-3 px-3">Motif & Tranche</th>
                    <th className="py-3 px-3">Mode & Référence</th>
                    <th className="py-3 px-3 text-right">Montant USD</th>
                    <th className="py-3 px-3 text-right">Montant CDF</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredPayments.map(p => {
                    const st = students.find(s => s.id === p.etudiantId);
                    return (
                      <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-amber-400">
                            {p.numeroRecu}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono tabular-nums">
                            {p.datePaiement}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-200">
                            {st ? `${st.nom} ${st.postnom} ${st.prenom}` : 'Inconnu'}
                          </div>
                          <div className="font-mono text-[11px] text-slate-400">
                            {p.etudiantId}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-medium text-slate-200 block">
                            {p.typeFrais}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {p.motif || 'Frais académiques'}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-200 block">
                            {p.modePaiement}
                          </span>
                          {p.numeroBordereau && (
                            <span className="text-[11px] font-mono text-slate-400">
                              Bord: {p.numeroBordereau}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-right font-bold text-emerald-400 font-mono tabular-nums">
                          {formatUSD(p.montantUSD)}
                        </td>

                        <td className="py-3 px-3 text-right font-mono text-slate-300 tabular-nums">
                          {formatCDF(p.montantCDF)}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => openPrintModal('recu', p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 inline-flex items-center gap-1 transition-colors cursor-pointer"
                            title="Imprimer le reçu officiel"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Reçu</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Comptes & Solvabilité des Étudiants */}
      {activeSubTab === 'solvabilite' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
                  <th className="py-3 px-4">Étudiant & Niveau</th>
                  <th className="py-3 px-3">Total Exigé</th>
                  <th className="py-3 px-3">Total Versé</th>
                  <th className="py-3 px-3">Solde Dû</th>
                  <th className="py-3 px-3">État Solvabilité</th>
                  <th className="py-3 px-4 text-right">Actions Caisse</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {students.map(st => {
                  const fin = getStudentFinancialSummary(st.id);
                  return (
                    <tr key={st.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-200">
                          {st.nom} {st.postnom} {st.prenom}
                        </div>
                        <div className="font-mono text-[11px] text-amber-400">
                          {st.id} · {st.niveau}
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono font-semibold text-slate-200 tabular-nums">
                        {formatUSD(fin.totalDuUSD)}
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-emerald-400 tabular-nums">
                        {formatUSD(fin.totalPayeUSD)}
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-rose-400 tabular-nums">
                        {formatUSD(fin.soldeUSD)}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                            fin.statut === 'En règle'
                              ? 'text-emerald-400'
                              : fin.statut === 'Partiellement payé'
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {fin.statut}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setPaymentForm(prev => ({
                                ...prev,
                                etudiantId: st.id,
                                montantUSD: fin.soldeUSD > 0 ? fin.soldeUSD : 100,
                              }));
                              setIsPaymentModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            + Encaisser
                          </button>
                          <button
                            onClick={() => openPrintModal('quitus', st)}
                            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                            title="Quitus Académique"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Contrôle Examens / Liste des Insolvables */}
      {activeSubTab === 'insolvables' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-rose-200">
                  Régulation & Autorisation d'Accès aux Salles d'Examens
                </h4>
                <p className="text-slate-300 mt-0.5">
                  Conformément aux instructions rectorales de l'Université CEPROMAD Gemena, les étudiants
                  ci-dessous sont redevables et ne peuvent accéder aux épreuves de session sans régularisation.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportToCSV('insolvables')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 font-semibold cursor-pointer"
              >
                Exporter Excel (Insolvables)
              </button>
              <button
                onClick={() => openPrintModal('liste_insolvables')}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer Liste Officielle</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
                  <th className="py-3 px-4">Matricule & Identité</th>
                  <th className="py-3 px-3">Faculté & Niveau</th>
                  <th className="py-3 px-3 font-mono text-right">Total Dû</th>
                  <th className="py-3 px-3 font-mono text-right">Déjà Versé</th>
                  <th className="py-3 px-3 font-mono text-right">Dette Restante</th>
                  <th className="py-3 px-3">Statut Caisse</th>
                  <th className="py-3 px-4 text-center">Régularisation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {insolvablesList.map(({ student, summary }) => (
                  <tr key={student.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-200">
                        {student.nom} {student.postnom} {student.prenom}
                      </div>
                      <div className="font-mono text-[11px] text-amber-400">
                        {student.id}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-300">
                        {student.niveau}
                      </span>
                      <div className="text-[11px] text-slate-400">
                        Tél : {student.telephone}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-300 tabular-nums">
                      {formatUSD(summary.totalDuUSD)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-emerald-400 tabular-nums">
                      {formatUSD(summary.totalPayeUSD)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-rose-400 tabular-nums">
                      {formatUSD(summary.soldeUSD)}
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/60 font-semibold">
                        Insolvable
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setPaymentForm(prev => ({
                            ...prev,
                            etudiantId: student.id,
                            montantUSD: summary.soldeUSD,
                          }));
                          setIsPaymentModalOpen(true);
                        }}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        Encaisser le solde
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-400" />
                  <span>Enregistrer un Versement de Frais</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Caisse Centrale · Université CEPROMAD Gemena
                </p>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Étudiant concerné *</label>
                <select
                  value={paymentForm.etudiantId}
                  onChange={e => setPaymentForm({ ...paymentForm, etudiantId: e.target.value })}
                  className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700 font-semibold"
                >
                  {students.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.id} - {st.nom} {st.postnom} ({st.niveau})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Motif / Type de Frais</label>
                  <select
                    value={paymentForm.typeFrais}
                    onChange={e => setPaymentForm({ ...paymentForm, typeFrais: e.target.value as TypeFrais })}
                    className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700"
                  >
                    <option value="Tranche 1 (Minerval)">Tranche 1 (Minerval)</option>
                    <option value="Tranche 2 (Minerval)">Tranche 2 (Minerval)</option>
                    <option value="Tranche 3 (Minerval)">Tranche 3 (Minerval)</option>
                    <option value="Enrôlement Examens Mi-Session">Enrôlement Mi-Session</option>
                    <option value="Enrôlement Examens Session Ordinaire">Enrôlement Session Ordinaire</option>
                    <option value="Carte d'Étudiant & Assurance">Carte d'Étudiant</option>
                    <option value="Frais de Laboratoire & Informatique">Frais Laboratoire & Informatique</option>
                    <option value="Dépôt Mémoire / TFC">Dépôt Mémoire / TFC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Montant en USD ($) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={paymentForm.montantUSD}
                    onChange={e => setPaymentForm({ ...paymentForm, montantUSD: Number(e.target.value) })}
                    className="w-full bg-slate-800 text-emerald-300 font-mono font-bold text-sm px-3 py-2 rounded-lg border border-slate-700"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                    Équivalent : {formatCDF(paymentForm.montantUSD * settings.tauxChangeUSD_CDF)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Mode de Règlement</label>
                  <select
                    value={paymentForm.modePaiement}
                    onChange={e => setPaymentForm({ ...paymentForm, modePaiement: e.target.value as ModePaiement })}
                    className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700"
                  >
                    <option value="Caisse Centrale">Caisse Centrale du Rectorat</option>
                    <option value="EquityBCDC">Bordereau EquityBCDC Gemena</option>
                    <option value="Rawbank">Bordereau Rawbank Gemena</option>
                    <option value="TMB">Bordereau Trust Merchant Bank (TMB)</option>
                    <option value="Airtel Money / M-Pesa">Mobile Money (Airtel / Vodacom)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">N° Bordereau / Référence</label>
                  <input
                    type="text"
                    placeholder="ex: EQ-98214..."
                    value={paymentForm.numeroBordereau}
                    onChange={e => setPaymentForm({ ...paymentForm, numeroBordereau: e.target.value })}
                    className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Libellé / Précisions</label>
                <input
                  type="text"
                  value={paymentForm.motif}
                  onChange={e => setPaymentForm({ ...paymentForm, motif: e.target.value })}
                  className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Valider & Générer Quittance</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
