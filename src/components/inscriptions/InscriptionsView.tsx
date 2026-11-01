/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NiveauEtude, Sexe, StatutDossier, Student } from '../../types';
import {
  Search,
  UserPlus,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  Printer,
  CreditCard,
  Eye,
  Trash2,
  FileText,
  BadgeCheck,
  IdCard,
  X,
  FileSpreadsheet,
} from 'lucide-react';

export const InscriptionsView: React.FC = () => {
  const {
    students,
    faculties,
    settings,
    addStudent,
    updateStudent,
    deleteStudent,
    openPrintModal,
    getFacultyById,
    getFiliereById,
    getStudentFinancialSummary,
    exportToCSV,
    selectedStudent,
    setSelectedStudent,
  } = useApp();

  // Filters
  const [filterFaculte, setFilterFaculte] = useState<string>('all');
  const [filterNiveau, setFilterNiveau] = useState<string>('all');
  const [filterStatut, setFilterStatut] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // New Student Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [formStep, setFormStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [formData, setFormData] = useState({
    nom: '',
    postnom: '',
    prenom: '',
    sexe: 'M' as Sexe,
    dateNaissance: '2004-01-15',
    lieuNaissance: 'Gemena',
    nationalite: 'Congolaise (RDC)',
    telephone: '+243 ',
    email: '',
    adresse: 'Quartier Castor, Gemena',
    faculteId: faculties[0]?.id || 'fac-eco',
    filiereId: faculties[0]?.filieres[0]?.id || 'fil-eco-mgmt',
    niveau: 'L1 LMD' as NiveauEtude,
    ecoleProvenance: 'Institut du 24 Novembre, Gemena',
    sectionDiplomeEtat: 'Scientifique',
    pourcentageDiplomeEtat: 65,
    anneeObtentionDiplome: 2024,
    dossierPieces: {
      bulletins5et6: true,
      diplomeEtatOuAttestation: true,
      certificatNationalite: true,
      certificatAptitudePhysique: true,
      photosPasseport: true,
      acteNaissance: true,
    },
    statutDossier: 'Validé' as StatutDossier,
    remarques: '',
  });

  // Filtered Students
  const filteredStudents = students.filter(st => {
    if (filterFaculte !== 'all' && st.faculteId !== filterFaculte) return false;
    if (filterNiveau !== 'all' && st.niveau !== filterNiveau) return false;
    if (filterStatut !== 'all' && st.statutDossier !== filterStatut) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const match =
        st.nom.toLowerCase().includes(term) ||
        st.postnom.toLowerCase().includes(term) ||
        st.prenom.toLowerCase().includes(term) ||
        st.id.toLowerCase().includes(term) ||
        st.telephone.includes(term);
      if (!match) return false;
    }
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom || !formData.postnom || !formData.prenom) {
      alert('Veuillez renseigner le nom, post-nom et prénom de l\'étudiant.');
      return;
    }

    const created = addStudent({
      nom: formData.nom.toUpperCase(),
      postnom: formData.postnom.toUpperCase(),
      prenom: formData.prenom,
      sexe: formData.sexe,
      dateNaissance: formData.dateNaissance,
      lieuNaissance: formData.lieuNaissance,
      nationalite: formData.nationalite,
      telephone: formData.telephone,
      email: formData.email || `${formData.prenom.toLowerCase()}.${formData.nom.toLowerCase()}@student.cepromad.cd`,
      adresse: formData.adresse,
      faculteId: formData.faculteId,
      filiereId: formData.filiereId,
      niveau: formData.niveau,
      anneeAcademique: settings.anneeAcademiqueActive,
      ecoleProvenance: formData.ecoleProvenance,
      sectionDiplomeEtat: formData.sectionDiplomeEtat,
      pourcentageDiplomeEtat: Number(formData.pourcentageDiplomeEtat),
      anneeObtentionDiplome: Number(formData.anneeObtentionDiplome),
      dossierPieces: formData.dossierPieces,
      typeEtudiant: 'Nouveau',
      statutDossier: formData.statutDossier,
      remarques: formData.remarques,
    });

    setIsNewModalOpen(false);
    setSelectedStudent(created);
  };

  const handleFaculteChange = (facId: string) => {
    const fac = faculties.find(f => f.id === facId);
    setFormData(prev => ({
      ...prev,
      faculteId: facId,
      filiereId: fac?.filieres[0]?.id || '',
    }));
  };

  const currentFaculty = faculties.find(f => f.id === formData.faculteId);

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto h-full overflow-y-auto">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Gestion des Inscriptions Académiques
            </h2>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 font-mono">
              {filteredStudents.length} étudiants
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enrôlement des nouveaux bacheliers, constitution des dossiers et délivrance des pièces officielles
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => exportToCSV('etudiants')}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exporter CSV</span>
          </button>
          <button
            onClick={() => {
              setFormStep(1);
              setIsNewModalOpen(true);
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nouvelle Inscription</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filtrer par nom, prénom, matricule ou téléphone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 text-slate-100 placeholder-slate-400 px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Faculté :</span>
            <select
              value={filterFaculte}
              onChange={e => setFilterFaculte(e.target.value)}
              className="bg-slate-800 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
            >
              <option value="all">Toutes les facultés</option>
              {faculties.map(f => (
                <option key={f.id} value={f.id}>
                  {f.sigle} - {f.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Niveau :</span>
            <select
              value={filterNiveau}
              onChange={e => setFilterNiveau(e.target.value)}
              className="bg-slate-800 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
            >
              <option value="all">Tous niveaux</option>
              <option value="L1 LMD">L1 LMD</option>
              <option value="L2 LMD">L2 LMD</option>
              <option value="L3 LMD">L3 LMD</option>
              <option value="Master 1">Master 1</option>
              <option value="Master 2">Master 2</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Dossier :</span>
            <select
              value={filterStatut}
              onChange={e => setFilterStatut(e.target.value)}
              className="bg-slate-800 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
            >
              <option value="all">Tous statuts</option>
              <option value="Validé">Validé</option>
              <option value="En attente">En attente</option>
              <option value="Dossier incomplet">Incomplet</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Students Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
                <th className="py-3 px-4">Matricule & Identité</th>
                <th className="py-3 px-3">Faculté & Filière</th>
                <th className="py-3 px-3">Niveau LMD</th>
                <th className="py-3 px-3">Contact & Ville</th>
                <th className="py-3 px-3">Statut Dossier</th>
                <th className="py-3 px-3">Frais Solvabilité</th>
                <th className="py-3 px-4 text-right">Actions Bureau</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Aucun étudiant ne correspond aux critères de recherche.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(st => {
                  const fac = getFacultyById(st.faculteId);
                  const fin = getStudentFinancialSummary(st.id);

                  return (
                    <tr
                      key={st.id}
                      className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                      onClick={() => setSelectedStudent(st)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {st.photoUrl ? (
                            <img
                              src={st.photoUrl}
                              alt={st.nom}
                              className="w-9 h-9 rounded-full object-cover border border-amber-400/40 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 shrink-0">
                              {st.nom[0]}
                              {st.postnom[0]}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-100 flex items-center gap-1.5">
                              <span>
                                {st.nom} {st.postnom} {st.prenom}
                              </span>
                              <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                {st.sexe}
                              </span>
                            </div>
                            <div className="font-mono text-[11px] text-amber-400 font-medium">
                              {st.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-200">
                          {fac?.sigle || st.faculteId}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          {getFiliereById(st.filiereId)?.filiereNom || st.filiereId}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-200">
                          {st.niveau}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {st.typeEtudiant}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-mono text-slate-300 tabular-nums">
                          {st.telephone}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                          {st.adresse}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                            st.statutDossier === 'Validé'
                              ? 'text-emerald-400'
                              : st.statutDossier === 'En attente'
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {st.statutDossier === 'Validé' ? (
                            <CheckCircle className="w-3.5 h-3.5" />
                          ) : (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                          <span>{st.statutDossier}</span>
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div
                          className={`font-semibold font-mono tabular-nums ${
                            fin.statut === 'En règle'
                              ? 'text-emerald-400'
                              : fin.statut === 'Partiellement payé'
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {fin.statut}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono tabular-nums">
                          Payé : {fin.totalPayeUSD} $ / {fin.totalDuUSD} $
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openPrintModal('carte', st)}
                            title="Imprimer Carte d'Étudiant Biométrique"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 transition-colors"
                          >
                            <IdCard className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openPrintModal('fiche', st)}
                            title="Imprimer Fiche d'Inscription"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedStudent(st)}
                            title="Afficher Dossier Complet"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Student Details Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                {selectedStudent.photoUrl ? (
                  <img
                    src={selectedStudent.photoUrl}
                    alt={selectedStudent.nom}
                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-bold text-lg text-slate-300">
                    {selectedStudent.nom[0]}
                    {selectedStudent.postnom[0]}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {selectedStudent.nom} {selectedStudent.postnom} {selectedStudent.prenom}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                    <span className="text-amber-400 font-semibold">{selectedStudent.id}</span>
                    <span>·</span>
                    <span>{selectedStudent.niveau}</span>
                    <span>·</span>
                    <span>{getFacultyById(selectedStudent.faculteId)?.sigle}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Tabs / Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  État Civil & Coordonnées
                </span>
                <div className="space-y-1 text-slate-300">
                  <p><strong className="text-slate-400">Sexe :</strong> {selectedStudent.sexe === 'M' ? 'Masculin' : 'Féminin'}</p>
                  <p><strong className="text-slate-400">Né(e) le :</strong> {selectedStudent.dateNaissance} à {selectedStudent.lieuNaissance}</p>
                  <p><strong className="text-slate-400">Nationalité :</strong> {selectedStudent.nationalite}</p>
                  <p><strong className="text-slate-400">Téléphone :</strong> {selectedStudent.telephone}</p>
                  <p><strong className="text-slate-400">Email :</strong> {selectedStudent.email}</p>
                  <p><strong className="text-slate-400">Résidence :</strong> {selectedStudent.adresse}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  Scolarité d'Origine & Bac
                </span>
                <div className="space-y-1 text-slate-300">
                  <p><strong className="text-slate-400">École :</strong> {selectedStudent.ecoleProvenance}</p>
                  <p><strong className="text-slate-400">Section Bac :</strong> {selectedStudent.sectionDiplomeEtat}</p>
                  <p><strong className="text-slate-400">Pourcentage :</strong> {selectedStudent.pourcentageDiplomeEtat}% (Session {selectedStudent.anneeObtentionDiplome})</p>
                  <p><strong className="text-slate-400">Année académique :</strong> {selectedStudent.anneeAcademique}</p>
                  <p><strong className="text-slate-400">Date inscription :</strong> {selectedStudent.dateInscription}</p>
                </div>
              </div>
            </div>

            {/* Documents Physiques Déposés */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2.5">
              <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] block">
                Pièces Justificatives Déposées à l'Apparitorat
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {Object.entries(selectedStudent.dossierPieces).map(([key, value]) => {
                  const labels: Record<string, string> = {
                    bulletins5et6: 'Bulletins 5e & 6e',
                    diplomeEtatOuAttestation: "Diplôme d'État / Bac",
                    certificatNationalite: 'Certificat Nationalité',
                    certificatAptitudePhysique: 'Aptitude Physique',
                    photosPasseport: '4 Photos Passeport',
                    acteNaissance: 'Acte de Naissance',
                  };
                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-1.5 p-2 rounded-lg border ${
                        value
                          ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                          : 'bg-rose-950/30 border-rose-800/40 text-rose-300'
                      }`}
                    >
                      {value ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      <span className="truncate">{labels[key] || key}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial Status Box */}
            {(() => {
              const fin = getStudentFinancialSummary(selectedStudent.id);
              return (
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">
                      Situation Financière de l'Étudiant
                    </span>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span className="text-white font-bold font-mono">
                        Payé : {fin.totalPayeUSD} $
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-300 font-mono">
                        Reste : {fin.soldeUSD} $
                      </span>
                      <span className="text-slate-400">·</span>
                      <span
                        className={`font-semibold ${
                          fin.statut === 'En règle'
                            ? 'text-emerald-400'
                            : fin.statut === 'Partiellement payé'
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {fin.statut}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openPrintModal('quitus', selectedStudent)}
                      className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Quitus Académique</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Quick Action Buttons for Documents */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  if (window.confirm(`Supprimer définitivement l'inscription de ${selectedStudent.nom} ?`)) {
                    deleteStudent(selectedStudent.id);
                    setSelectedStudent(null);
                  }
                }}
                className="px-3 py-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer le dossier</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openPrintModal('fiche', selectedStudent)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Fiche Inscription</span>
                </button>
                <button
                  onClick={() => openPrintModal('carte', selectedStudent)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <IdCard className="w-4 h-4" />
                  <span>Carte d'Étudiant</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Inscription Form Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-amber-400" />
                  <span>Formulaire d'Inscription - Nouveaux Étudiants</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Université CEPROMAD Gemena · Année Académique {settings.anneeAcademiqueActive}
                </p>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-center gap-2 border-b border-slate-800 pb-4 text-xs font-semibold">
              <button
                onClick={() => setFormStep(1)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                  formStep === 1
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <span>1. État Civil & Contact</span>
              </button>
              <span className="text-slate-600">→</span>
              <button
                onClick={() => setFormStep(2)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                  formStep === 2
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <span>2. Filière & Cursus</span>
              </button>
              <span className="text-slate-600">→</span>
              <button
                onClick={() => setFormStep(3)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                  formStep === 3
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <span>3. Pièces & Validation</span>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Step 1: Civil State */}
              {formStep === 1 && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Nom de famille *</label>
                      <input
                        type="text"
                        required
                        placeholder="ex: KABEYA"
                        value={formData.nom}
                        onChange={e => setFormData({ ...formData, nom: e.target.value })}
                        className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700 uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Post-nom *</label>
                      <input
                        type="text"
                        required
                        placeholder="ex: MPOYI"
                        value={formData.postnom}
                        onChange={e => setFormData({ ...formData, postnom: e.target.value })}
                        className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700 uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Prénom *</label>
                      <input
                        type="text"
                        required
                        placeholder="ex: Joseph"
                        value={formData.prenom}
                        onChange={e => setFormData({ ...formData, prenom: e.target.value })}
                        className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Genre / Sexe</label>
                      <select
                        value={formData.sexe}
                        onChange={e => setFormData({ ...formData, sexe: e.target.value as Sexe })}
                        className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700"
                      >
                        <option value="M">Masculin (M)</option>
                        <option value="F">Féminin (F)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Date de naissance</label>
                      <input
                        type="date"
                        value={formData.dateNaissance}
                        onChange={e => setFormData({ ...formData, dateNaissance: e.target.value })}
                        className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Lieu de naissance</label>
                      <input
                        type="text"
                        value={formData.lieuNaissance}
                        onChange={e => setFormData({ ...formData, lieuNaissance: e.target.value })}
                        className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Téléphone (WhatsApp / SMS)</label>
                      <input
                        type="text"
                        placeholder="+243 ..."
                        value={formData.telephone}
                        onChange={e => setFormData({ ...formData, telephone: e.target.value })}
                        className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Adresse de résidence (Gemena)</label>
                      <input
                        type="text"
                        placeholder="Quartier, Avenue, N°"
                        value={formData.adresse}
                        onChange={e => setFormData({ ...formData, adresse: e.target.value })}
                        className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="button"
                      onClick={() => setFormStep(2)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg cursor-pointer"
                    >
                      Suivant : Filière & Cursus →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Faculty & School */}
              {formStep === 2 && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Faculté sollicitée</label>
                      <select
                        value={formData.faculteId}
                        onChange={e => handleFaculteChange(e.target.value)}
                        className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700"
                      >
                        {faculties.map(f => (
                          <option key={f.id} value={f.id}>
                            {f.nom} ({f.sigle})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Filière / Département</label>
                      <select
                        value={formData.filiereId}
                        onChange={e => setFormData({ ...formData, filiereId: e.target.value })}
                        className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700"
                      >
                        {currentFaculty?.filieres.map(fil => (
                          <option key={fil.id} value={fil.id}>
                            {fil.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Niveau d'admission</label>
                      <select
                        value={formData.niveau}
                        onChange={e => setFormData({ ...formData, niveau: e.target.value as NiveauEtude })}
                        className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700 font-semibold text-amber-300"
                      >
                        <option value="L1 LMD">L1 LMD (Nouveaux bacheliers)</option>
                        <option value="L2 LMD">L2 LMD (Passerelle)</option>
                        <option value="L3 LMD">L3 LMD (Passerelle)</option>
                        <option value="Master 1">Master 1</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">École secondaire de provenance</label>
                      <input
                        type="text"
                        placeholder="ex: Institut du 24 Novembre"
                        value={formData.ecoleProvenance}
                        onChange={e => setFormData({ ...formData, ecoleProvenance: e.target.value })}
                        className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Section Diplôme d'État</label>
                      <input
                        type="text"
                        placeholder="Scientifique, Commerciale..."
                        value={formData.sectionDiplomeEtat}
                        onChange={e => setFormData({ ...formData, sectionDiplomeEtat: e.target.value })}
                        className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Pourcentage obtenu (%)</label>
                      <input
                        type="number"
                        min="50"
                        max="100"
                        value={formData.pourcentageDiplomeEtat}
                        onChange={e => setFormData({ ...formData, pourcentageDiplomeEtat: Number(e.target.value) })}
                        className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Année du Bac</label>
                      <input
                        type="number"
                        value={formData.anneeObtentionDiplome}
                        onChange={e => setFormData({ ...formData, anneeObtentionDiplome: Number(e.target.value) })}
                        className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-3">
                    <button
                      type="button"
                      onClick={() => setFormStep(1)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                    >
                      ← Retour
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormStep(3)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg cursor-pointer"
                    >
                      Suivant : Documents physiques →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Physical Documents & Submit */}
              {formStep === 3 && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
                    <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] block">
                      Cocher les pièces physiques remises par le candidat
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.dossierPieces.bulletins5et6}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              dossierPieces: { ...formData.dossierPieces, bulletins5et6: e.target.checked },
                            })
                          }
                          className="rounded text-amber-500"
                        />
                        <span className="text-slate-200">Bulletins de 5ème et 6ème des humanités</span>
                      </label>

                      <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.dossierPieces.diplomeEtatOuAttestation}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              dossierPieces: {
                                ...formData.dossierPieces,
                                diplomeEtatOuAttestation: e.target.checked,
                              },
                            })
                          }
                          className="rounded text-amber-500"
                        />
                        <span className="text-slate-200">Diplôme d'État ou Attestation de réussite</span>
                      </label>

                      <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.dossierPieces.certificatNationalite}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              dossierPieces: {
                                ...formData.dossierPieces,
                                certificatNationalite: e.target.checked,
                              },
                            })
                          }
                          className="rounded text-amber-500"
                        />
                        <span className="text-slate-200">Certificat de Nationalité Congolaise</span>
                      </label>

                      <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.dossierPieces.certificatAptitudePhysique}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              dossierPieces: {
                                ...formData.dossierPieces,
                                certificatAptitudePhysique: e.target.checked,
                              },
                            })
                          }
                          className="rounded text-amber-500"
                        />
                        <span className="text-slate-200">Certificat médical d'Aptitude Physique</span>
                      </label>

                      <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.dossierPieces.photosPasseport}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              dossierPieces: { ...formData.dossierPieces, photosPasseport: e.target.checked },
                            })
                          }
                          className="rounded text-amber-500"
                        />
                        <span className="text-slate-200">4 Photos passeport récentes (Format identité)</span>
                      </label>

                      <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.dossierPieces.acteNaissance}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              dossierPieces: { ...formData.dossierPieces, acteNaissance: e.target.checked },
                            })
                          }
                          className="rounded text-amber-500"
                        />
                        <span className="text-slate-200">Acte de naissance ou Volet d'état civil</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Décision Apparitorat</label>
                      <select
                        value={formData.statutDossier}
                        onChange={e => setFormData({ ...formData, statutDossier: e.target.value as StatutDossier })}
                        className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700 font-semibold"
                      >
                        <option value="Validé">Dossier Complet & Validé</option>
                        <option value="En attente">En attente de pièces</option>
                        <option value="Dossier incomplet">Dossier Incomplet</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Remarques éventuelles</label>
                      <input
                        type="text"
                        placeholder="Observations sur le candidat..."
                        value={formData.remarques}
                        onChange={e => setFormData({ ...formData, remarques: e.target.value })}
                        className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-3">
                    <button
                      type="button"
                      onClick={() => setFormStep(2)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                    >
                      ← Retour
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Valider & Générer Matricule</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
