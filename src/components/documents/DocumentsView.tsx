/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  IdCard,
  Receipt,
  FileText,
  BadgeCheck,
  AlertTriangle,
  Printer,
  Search,
  CheckCircle2,
  Download,
} from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { students, payments, openPrintModal, exportToCSV, settings } = useApp();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>(payments[0]?.id || '');

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];
  const currentPayment = payments.find(p => p.id === selectedPaymentId) || payments[0];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto h-full overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Centre des Documents Officiels & Éditions
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Génération et impression des cartes d'étudiants, reçus de caisse, fiches individuelles et quitus
          </p>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
          <label className="font-semibold text-slate-300 block">
            Sélectionner l'étudiant pour la carte ou la fiche :
          </label>
          <select
            value={selectedStudentId}
            onChange={e => setSelectedStudentId(e.target.value)}
            className="w-full bg-slate-800 text-slate-100 p-2.5 rounded-lg border border-slate-700 font-semibold"
          >
            {students.map(st => (
              <option key={st.id} value={st.id}>
                {st.id} - {st.nom} {st.postnom} {st.prenom} ({st.niveau})
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
          <label className="font-semibold text-slate-300 block">
            Sélectionner la quittance pour l'impression du reçu :
          </label>
          <select
            value={selectedPaymentId}
            onChange={e => setSelectedPaymentId(e.target.value)}
            className="w-full bg-slate-800 text-slate-100 p-2.5 rounded-lg border border-slate-700 font-semibold font-mono"
          >
            {payments.map(p => {
              const st = students.find(s => s.id === p.etudiantId);
              return (
                <option key={p.id} value={p.id}>
                  {p.numeroRecu} - {p.montantUSD}$ - {st ? `${st.nom} ${st.postnom}` : p.etudiantId}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Document Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Template 1: Carte d'étudiant */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-colors">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <IdCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">
              Carte d'Étudiant Biométrique
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Format badge PVC avec recto/verso, sceau officiel de l'Université CEPROMAD Gemena,
              code-barres et signature rectorale.
            </p>
          </div>
          <button
            onClick={() => currentStudent && openPrintModal('carte', currentStudent)}
            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer Carte PVC</span>
          </button>
        </div>

        {/* Template 2: Reçu officiel */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-colors">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">
              Reçu Officiel de Caisse / Bordereau
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Quittance certifiée avec montant en chiffres et en lettres, conversion CDF au taux du jour,
              numéro de bordereau bancaire et cachet payé.
            </p>
          </div>
          <button
            onClick={() => currentPayment && openPrintModal('recu', currentPayment)}
            className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer le Reçu Officiel</span>
          </button>
        </div>

        {/* Template 3: Fiche d'inscription */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-colors">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">
              Fiche Individuelle d'Inscription
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dossier complet d'admission reprenant l'état civil, l'origine scolaire, les pièces physiques
              déposées et la validation de l'Apparitorat.
            </p>
          </div>
          <button
            onClick={() => currentStudent && openPrintModal('fiche', currentStudent)}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer Fiche Dossier</span>
          </button>
        </div>

        {/* Template 4: Quitus & Billet d'Examen */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-colors">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <BadgeCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">
              Billet d'Examen & Quitus Financier
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Certificat autorisant l'accès de l'étudiant aux épreuves d'évaluation mi-session et session ordinaire
              attestant de l'apurement des frais.
            </p>
          </div>
          <button
            onClick={() => currentStudent && openPrintModal('quitus', currentStudent)}
            className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Générer Billet d'Examen</span>
          </button>
        </div>

        {/* Template 5: Liste des Insolvables */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-rose-500/40 transition-colors">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">
              Registre des Étudiants Insolvables
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tableau exhaustif récapitulant les dettes des étudiants pour la surveillance des examens
              et le recouvrement forcé.
            </p>
          </div>
          <button
            onClick={() => openPrintModal('liste_insolvables')}
            className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer Liste Débiteurs</span>
          </button>
        </div>

        {/* Template 6: Export CSV / Excel */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-colors">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">
              Exportations Tabulaires Excel / CSV
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extraction immédiate des bases d'inscriptions et de paiements au format compatible Microsoft Excel.
            </p>
          </div>
          <button
            onClick={() => exportToCSV('etudiants')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Télécharger Base Étudiants (.csv)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
