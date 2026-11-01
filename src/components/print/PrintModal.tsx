/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { UNIVERSITY_EMBLEM } from '../../data/initialData';
import { Payment, Student } from '../../types';
import {
  Printer,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Download,
} from 'lucide-react';

export const PrintModal: React.FC = () => {
  const {
    printModal,
    closePrintModal,
    settings,
    students,
    payments,
    getFacultyById,
    getFiliereById,
    getStudentFinancialSummary,
    formatUSD,
    formatCDF,
  } = useApp();

  if (!printModal.isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Convert numbers to French words representation for receipts
  const numberToFrenchWords = (n: number): string => {
    // Simple helper for academic fee values
    if (n === 15) return 'Quinze';
    if (n === 25) return 'Vingt-cinq';
    if (n === 30) return 'Trente';
    if (n === 35) return 'Trente-cinq';
    if (n === 40) return 'Quarante';
    if (n === 50) return 'Cinquante';
    if (n === 80) return 'Quatre-vingts';
    if (n === 100) return 'Cent';
    if (n === 120) return 'Cent vingt';
    if (n === 140) return 'Cent quarante';
    if (n === 160) return 'Cent soixante';
    if (n === 180) return 'Cent quatre-vingts';
    if (n === 190) return 'Cent quatre-vingt-dix';
    if (n === 200) return 'Deux cents';
    if (n === 250) return 'Deux cent cinquante';
    if (n === 280) return 'Deux cent quatre-vingts';
    if (n === 420) return 'Quatre cent vingt';
    if (n === 440) return 'Quatre cent quarante';
    if (n === 480) return 'Quatre cent quatre-vingts';
    return `${n}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Top Bar (Hidden during print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Aperçu Avant Impression Document Officiel
              </h3>
              <p className="text-xs text-slate-400">
                Université CEPROMAD · Établissement de Gemena (RDC)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / Exporter PDF</span>
            </button>
            <button
              onClick={closePrintModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Content Viewport */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-800/50 flex justify-center">
          {/* Printable Container */}
          <div className="printable-area bg-white text-slate-900 shadow-2xl rounded-xl p-8 max-w-2xl w-full text-xs font-sans print:p-0 print:shadow-none print:rounded-none">
            
            {/* ==================== 1. CARTE D'ÉTUDIANT BIOMÉTRIQUE ==================== */}
            {printModal.type === 'carte' && (() => {
              const student = (printModal.data as Student) || students[0];
              const fac = getFacultyById(student.faculteId);
              const fil = getFiliereById(student.filiereId);

              return (
                <div className="space-y-6">
                  {/* RECTO */}
                  <div className="relative w-full max-w-[500px] mx-auto aspect-[1.586/1] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-5 shadow-xl border border-amber-400/40 overflow-hidden flex flex-col justify-between">
                    {/* Background guilloche watermark */}
                    <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
                      <img src={UNIVERSITY_EMBLEM} alt="" className="w-80 h-80 object-contain" />
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-amber-400/30 pb-2 relative z-10">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={UNIVERSITY_EMBLEM}
                          alt="Sceau"
                          className="w-12 h-12 rounded-full border border-amber-400 object-cover"
                        />
                        <div>
                          <div className="text-[10px] tracking-widest uppercase text-slate-300 font-semibold">
                            Rép. Démocratique du Congo · Min. ESU
                          </div>
                          <div className="text-sm font-extrabold text-amber-400 uppercase tracking-tight">
                            Université CEPROMAD
                          </div>
                          <div className="text-[10px] font-bold text-slate-200 uppercase tracking-wider">
                            Campus de Gemena
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase font-bold">
                          CARTE D'ÉTUDIANT
                        </span>
                        <div className="text-[9px] text-slate-300 font-mono mt-1">
                          {settings.anneeAcademiqueActive}
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex items-center gap-4 my-auto relative z-10">
                      {/* Photo */}
                      <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-amber-400 shrink-0 bg-slate-800 shadow-md">
                        {student.photoUrl ? (
                          <img
                            src={student.photoUrl}
                            alt={student.nom}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-slate-400">
                            {student.nom[0]}
                          </div>
                        )}
                      </div>

                      {/* Information */}
                      <div className="space-y-1 flex-1">
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase block font-semibold">
                            Nom, Post-nom & Prénom
                          </span>
                          <span className="text-sm font-extrabold text-white tracking-tight">
                            {student.nom} {student.postnom} {student.prenom}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <div>
                            <span className="text-[8px] text-slate-400 uppercase font-semibold block">
                              Matricule
                            </span>
                            <span className="font-mono font-bold text-amber-300">
                              {student.id}
                            </span>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-400 uppercase font-semibold block">
                              Promotion LMD
                            </span>
                            <span className="font-bold text-white">
                              {student.niveau}
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[8px] text-slate-400 uppercase font-semibold block">
                            Faculté & Filière
                          </span>
                          <span className="text-[10px] text-slate-200 font-medium block truncate">
                            {fac?.sigle} · {fil?.filiereNom || student.filiereId}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-amber-400/30 pt-2 text-[8px] text-slate-300 relative z-10">
                      <div>
                        <span>Sexe : <strong>{student.sexe}</strong></span> · 
                        <span> Né(e) le : <strong>{student.dateNaissance}</strong></span>
                      </div>
                      <div className="text-right italic">
                        Le Directeur Général du Campus
                      </div>
                    </div>
                  </div>

                  {/* VERSO */}
                  <div className="w-full max-w-[500px] mx-auto aspect-[1.586/1] bg-slate-900 text-white rounded-2xl p-5 shadow-xl border border-slate-700 flex flex-col justify-between text-[9px] space-y-3">
                    <div className="text-center space-y-0.5 border-b border-slate-800 pb-2">
                      <span className="font-bold uppercase tracking-wider text-amber-400 block">
                        CONDITIONS GÉNÉRALES DE VALIDITÉ
                      </span>
                      <p className="text-slate-400 text-[8px]">
                        Cette carte est strictement personnelle et demeure la propriété de l'Université CEPROMAD Gemena.
                      </p>
                    </div>

                    <div className="space-y-1 text-slate-300 text-[8px] leading-relaxed">
                      <p>• Tout titulaire est tenu de la présenter lors des examens, accès à la bibliothèque et aux laboratoires.</p>
                      <p>• En cas de perte, aviser immédiatement l'Apparitorat Central du Campus de Gemena.</p>
                      <p>• Contact Rectorat : {settings.rectoratContact}</p>
                    </div>

                    {/* Barcode / QR Simulation */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <div className="font-mono text-[9px] tracking-widest text-slate-400">
                        * {student.id} *
                      </div>
                      <div className="h-6 w-44 bg-slate-200 rounded flex items-center justify-center text-slate-900 font-mono text-[9px] tracking-tighter">
                        ||| | |||| || ||| |||| | ||||| ||
                      </div>
                      <div className="text-[8px] text-amber-400 font-semibold">
                        Sceau Sécurisé
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ==================== 2. REÇU OFFICIEL DE CAISSE ==================== */}
            {printModal.type === 'recu' && (() => {
              const payment = (printModal.data as Payment) || payments[0];
              const student = students.find(s => s.id === payment?.etudiantId);
              const fac = student ? getFacultyById(student.faculteId) : undefined;

              return (
                <div className="border-2 border-slate-800 p-6 space-y-5 rounded-lg">
                  {/* Official Letterhead */}
                  <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={UNIVERSITY_EMBLEM}
                        alt="Sceau"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                          République Démocratique du Congo
                        </div>
                        <div className="text-base font-extrabold uppercase text-slate-900 tracking-tight">
                          Université CEPROMAD
                        </div>
                        <div className="text-xs font-bold text-amber-800 uppercase">
                          Établissement de Gemena · Province du Sud-Ubangi
                        </div>
                        <div className="text-[9px] text-slate-500">
                          Direction des Affaires Financières & Caisse Centrale
                        </div>
                      </div>
                    </div>

                    <div className="text-right border-l-2 border-slate-300 pl-4">
                      <div className="font-mono font-bold text-sm text-slate-900">
                        {payment.numeroRecu}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Date : <strong className="text-slate-800 font-mono">{payment.datePaiement}</strong>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Année : <strong className="text-slate-800">{payment.anneeAcademique}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-center py-1 bg-slate-100 rounded border border-slate-200">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                      BORDEREAU OFFICIEL DE VERSEMENT DE FRAIS ACADÉMIQUES
                    </h4>
                  </div>

                  {/* Student Details */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
                    <div className="space-y-1">
                      <p><strong>Nom de l'Étudiant :</strong> {student ? `${student.nom} ${student.postnom} ${student.prenom}` : payment.etudiantId}</p>
                      <p><strong>Numéro Matricule :</strong> <span className="font-mono font-bold">{payment.etudiantId}</span></p>
                      <p><strong>Faculté :</strong> {fac?.nom || 'FSEG'} ({fac?.sigle || 'FSEG'})</p>
                    </div>
                    <div className="space-y-1">
                      <p><strong>Promotion :</strong> {student?.niveau || 'L1 LMD'}</p>
                      <p><strong>Canal de Paiement :</strong> {payment.modePaiement}</p>
                      {payment.numeroBordereau && (
                        <p><strong>N° Bordereau Banque :</strong> <span className="font-mono">{payment.numeroBordereau}</span></p>
                      )}
                    </div>
                  </div>

                  {/* Payment Table */}
                  <table className="w-full text-left border-collapse border border-slate-300 text-xs">
                    <thead>
                      <tr className="bg-slate-200 text-slate-800 font-bold">
                        <th className="p-2 border border-slate-300">Libellé des Frais</th>
                        <th className="p-2 border border-slate-300">Observation</th>
                        <th className="p-2 border border-slate-300 text-right">Montant (USD)</th>
                        <th className="p-2 border border-slate-300 text-right">Équivalent (CDF)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2.5 border border-slate-300 font-bold">{payment.typeFrais}</td>
                        <td className="p-2.5 border border-slate-300 text-slate-600">{payment.motif || 'Frais académiques'}</td>
                        <td className="p-2.5 border border-slate-300 text-right font-mono font-bold text-sm">{formatUSD(payment.montantUSD)}</td>
                        <td className="p-2.5 border border-slate-300 text-right font-mono text-slate-700">{formatCDF(payment.montantCDF)}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-100 font-bold">
                        <td colSpan={2} className="p-2 border border-slate-300">TOTAL VERSÉ :</td>
                        <td className="p-2 border border-slate-300 text-right font-mono text-sm">{formatUSD(payment.montantUSD)}</td>
                        <td className="p-2 border border-slate-300 text-right font-mono text-sm">{formatCDF(payment.montantCDF)}</td>
                      </tr>
                    </tfoot>
                  </table>

                  <div className="p-3 bg-amber-50 rounded border border-amber-200 text-xs">
                    <p>
                      <strong>Montant en lettres :</strong> Somme de <em>{numberToFrenchWords(payment.montantUSD)} dollars américains</em> (taux officiel appliqué de 1 USD = {payment.tauxChange} CDF).
                    </p>
                  </div>

                  {/* Signatures & Seal */}
                  <div className="grid grid-cols-2 gap-8 pt-6">
                    <div className="text-center space-y-12">
                      <p className="font-semibold text-slate-700">L'Étudiant Versant</p>
                      <p className="text-[10px] text-slate-400">(Signature pour acquit)</p>
                    </div>

                    <div className="text-center space-y-12">
                      <div>
                        <p className="font-semibold text-slate-700">Pour la Direction Financière / Caisse</p>
                        <p className="text-[10px] text-slate-500 font-bold">{settings.administrateurBudget}</p>
                      </div>
                      <div className="text-[10px] font-mono text-emerald-700 border-2 border-emerald-600 rounded px-2 py-1 inline-block uppercase font-bold tracking-wider transform -rotate-3">
                        ✓ CAISSE CENTRALE PAYÉ · GEMENA
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ==================== 3. FICHE D'INSCRIPTION INDIVIDUELLE ==================== */}
            {printModal.type === 'fiche' && (() => {
              const student = (printModal.data as Student) || students[0];
              const fac = getFacultyById(student.faculteId);
              const fil = getFiliereById(student.filiereId);

              return (
                <div className="border-2 border-slate-800 p-6 space-y-5 rounded-lg">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <img src={UNIVERSITY_EMBLEM} alt="" className="w-16 h-16 rounded-full object-cover" />
                      <div>
                        <div className="text-[9px] font-bold uppercase text-slate-600">République Démocratique du Congo · ESU</div>
                        <div className="text-base font-extrabold uppercase text-slate-900">Université CEPROMAD</div>
                        <div className="text-xs font-bold text-amber-800 uppercase">Campus de Gemena · Apparitorat Central</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold px-2 py-1 bg-slate-100 rounded border border-slate-300 block">
                        Matricule : {student.id}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Année : {student.anneeAcademique}
                      </span>
                    </div>
                  </div>

                  <div className="text-center py-1.5 bg-slate-100 rounded border border-slate-300">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                      DOSSIER INDIVIDUEL D'INSCRIPTION ACADÉMIQUE
                    </h4>
                  </div>

                  {/* Identité */}
                  <div className="space-y-2 border border-slate-200 p-3.5 rounded-lg">
                    <h5 className="font-bold text-xs uppercase text-slate-700 border-b border-slate-200 pb-1">
                      1. Identité de l'Étudiant(e)
                    </h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <p><strong>Nom complet :</strong> {student.nom} {student.postnom} {student.prenom}</p>
                      <p><strong>Genre :</strong> {student.sexe === 'M' ? 'Masculin' : 'Féminin'}</p>
                      <p><strong>Né(e) le :</strong> {student.dateNaissance} à {student.lieuNaissance}</p>
                      <p><strong>Nationalité :</strong> {student.nationalite}</p>
                      <p><strong>Téléphone :</strong> {student.telephone}</p>
                      <p><strong>Email :</strong> {student.email}</p>
                      <p className="col-span-2"><strong>Adresse à Gemena :</strong> {student.adresse}</p>
                    </div>
                  </div>

                  {/* Orientation */}
                  <div className="space-y-2 border border-slate-200 p-3.5 rounded-lg">
                    <h5 className="font-bold text-xs uppercase text-slate-700 border-b border-slate-200 pb-1">
                      2. Faculté & Orientation LMD
                    </h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <p><strong>Faculté :</strong> {fac?.nom}</p>
                      <p><strong>Filière / Département :</strong> {fil?.filiereNom}</p>
                      <p><strong>Promotion d'admission :</strong> {student.niveau}</p>
                      <p><strong>Statut du candidat :</strong> {student.typeEtudiant}</p>
                    </div>
                  </div>

                  {/* Antécédents */}
                  <div className="space-y-2 border border-slate-200 p-3.5 rounded-lg">
                    <h5 className="font-bold text-xs uppercase text-slate-700 border-b border-slate-200 pb-1">
                      3. Diplôme d'État & Origine Scolaire
                    </h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <p><strong>École secondaire :</strong> {student.ecoleProvenance}</p>
                      <p><strong>Section d'État :</strong> {student.sectionDiplomeEtat}</p>
                      <p><strong>Pourcentage :</strong> {student.pourcentageDiplomeEtat}%</p>
                      <p><strong>Session de réussite :</strong> {student.anneeObtentionDiplome}</p>
                    </div>
                  </div>

                  {/* Pièces physiques */}
                  <div className="border border-slate-200 p-3.5 rounded-lg space-y-2">
                    <h5 className="font-bold text-xs uppercase text-slate-700 border-b border-slate-200 pb-1">
                      4. Contrôle des Pièces Physiques Déposées
                    </h5>
                    <div className="grid grid-cols-3 gap-2 text-[11px]">
                      <span className={student.dossierPieces.bulletins5et6 ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                        [ {student.dossierPieces.bulletins5et6 ? 'X' : ' '} ] Bulletins 5e & 6e
                      </span>
                      <span className={student.dossierPieces.diplomeEtatOuAttestation ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                        [ {student.dossierPieces.diplomeEtatOuAttestation ? 'X' : ' '} ] Diplôme d'État / Bac
                      </span>
                      <span className={student.dossierPieces.certificatNationalite ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                        [ {student.dossierPieces.certificatNationalite ? 'X' : ' '} ] Certif. Nationalité
                      </span>
                      <span className={student.dossierPieces.certificatAptitudePhysique ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                        [ {student.dossierPieces.certificatAptitudePhysique ? 'X' : ' '} ] Aptitude Physique
                      </span>
                      <span className={student.dossierPieces.photosPasseport ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                        [ {student.dossierPieces.photosPasseport ? 'X' : ' '} ] 4 Photos Passeport
                      </span>
                      <span className={student.dossierPieces.acteNaissance ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                        [ {student.dossierPieces.acteNaissance ? 'X' : ' '} ] Acte de Naissance
                      </span>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="grid grid-cols-2 gap-8 pt-6">
                    <div className="text-center space-y-10">
                      <p className="font-semibold text-slate-700">Signature de l'Étudiant</p>
                    </div>
                    <div className="text-center space-y-10">
                      <div>
                        <p className="font-semibold text-slate-700">L'Appariteur Central de Gemena</p>
                        <p className="text-[10px] text-slate-500 font-bold">{settings.directeurApparitorat}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ==================== 4. QUITUS ACADÉMIQUE / BILLET EXAMEN ==================== */}
            {printModal.type === 'quitus' && (() => {
              const student = (printModal.data as Student) || students[0];
              const fin = getStudentFinancialSummary(student.id);

              return (
                <div className="border-2 border-slate-800 p-6 space-y-5 rounded-lg">
                  <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <img src={UNIVERSITY_EMBLEM} alt="" className="w-14 h-14 rounded-full object-cover" />
                      <div>
                        <div className="text-xs font-extrabold uppercase text-slate-900">Université CEPROMAD · Gemena</div>
                        <div className="text-[10px] text-slate-600">Direction des Affaires Académiques & Financières</div>
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs font-bold">
                      <div>ANNÉE {settings.anneeAcademiqueActive}</div>
                      <div className="text-emerald-600">RÉGULARITÉ VALIDÉE</div>
                    </div>
                  </div>

                  <div className="text-center py-2 bg-emerald-50 rounded border border-emerald-200">
                    <h4 className="text-sm font-bold uppercase text-emerald-900">
                      QUITUS FINANCIER & BILLET D'ACCÈS AUX EXAMENS DE SESSION
                    </h4>
                  </div>

                  <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2 text-xs">
                    <p>Le Secrétariat Général Académique et la Direction Financière certifient par la présente que :</p>
                    <p className="text-sm font-bold text-slate-900">
                      L'étudiant(e) : {student.nom} {student.postnom} {student.prenom}
                    </p>
                    <p>Porteur du matricule officiel : <strong className="font-mono">{student.id}</strong></p>
                    <p>Inscrit(e) en promotion : <strong>{student.niveau}</strong> ({getFacultyById(student.faculteId)?.sigle})</p>
                    <p>
                      A apuré le montant requis de : <strong className="font-mono">{formatUSD(fin.totalPayeUSD)}</strong> sur un total exigé de {formatUSD(fin.totalDuUSD)}.
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-900 font-semibold">
                    ✓ Autorisation d'accès formelle aux auditoires et aux épreuves de Mi-session et Session Ordinaire.
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-300">
                    <div className="font-mono text-[9px] text-slate-500">
                      Gemena, le {new Date().toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-center">
                      <span className="font-bold text-slate-800 text-xs block">Le Directeur Financier</span>
                      <span className="text-[10px] text-slate-500">{settings.administrateurBudget}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ==================== 5. LISTE DES INSOLVABLES ==================== */}
            {printModal.type === 'liste_insolvables' && (() => {
              const insolvables = students
                .map(st => ({ student: st, summary: getStudentFinancialSummary(st.id) }))
                .filter(i => i.summary.statut !== 'En règle');

              return (
                <div className="space-y-4">
                  <div className="text-center space-y-1 border-b-2 border-slate-800 pb-3">
                    <div className="text-[10px] uppercase font-bold text-slate-600">République Démocratique du Congo · ESU</div>
                    <h3 className="text-base font-extrabold uppercase text-slate-900">
                      Université CEPROMAD · Campus de Gemena
                    </h3>
                    <h4 className="text-xs font-bold text-rose-800 uppercase">
                      LISTE OFFICIELLE DES ÉTUDIANTS DÉBITEURS / INSOLVABLES
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Contrôle aux portes des salles d'examens · Année Académique {settings.anneeAcademiqueActive}
                    </p>
                  </div>

                  <table className="w-full text-left border-collapse border border-slate-300 text-[11px]">
                    <thead>
                      <tr className="bg-slate-200 text-slate-800 font-bold">
                        <th className="p-1.5 border border-slate-300">N°</th>
                        <th className="p-1.5 border border-slate-300">Matricule</th>
                        <th className="p-1.5 border border-slate-300">Nom & Post-nom</th>
                        <th className="p-1.5 border border-slate-300">Niveau</th>
                        <th className="p-1.5 border border-slate-300 text-right">Dû</th>
                        <th className="p-1.5 border border-slate-300 text-right">Payé</th>
                        <th className="p-1.5 border border-slate-300 text-right">Reste</th>
                      </tr>
                    </thead>
                    <tbody>
                      {insolvables.map((item, idx) => (
                        <tr key={item.student.id} className="hover:bg-slate-50">
                          <td className="p-1.5 border border-slate-300">{idx + 1}</td>
                          <td className="p-1.5 border border-slate-300 font-mono font-bold">{item.student.id}</td>
                          <td className="p-1.5 border border-slate-300 font-semibold">{item.student.nom} {item.student.postnom} {item.student.prenom}</td>
                          <td className="p-1.5 border border-slate-300">{item.student.niveau}</td>
                          <td className="p-1.5 border border-slate-300 text-right font-mono">{item.summary.totalDuUSD} $</td>
                          <td className="p-1.5 border border-slate-300 text-right font-mono text-emerald-700">{item.summary.totalPayeUSD} $</td>
                          <td className="p-1.5 border border-slate-300 text-right font-mono font-bold text-rose-700">{item.summary.soldeUSD} $</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="pt-4 flex justify-between text-[10px] text-slate-500">
                    <span>Fait à Gemena, le {new Date().toLocaleDateString('fr-FR')}</span>
                    <span className="font-bold text-slate-800">Pour le Collège Décanat & Commission des Examens</span>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      </div>
    </div>
  );
};
