/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NiveauEtude } from '../../types';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Layers,
  Plus,
  Clock,
  User,
  CheckCircle,
  X,
  Building,
} from 'lucide-react';

export const ProgrammesView: React.FC = () => {
  const { faculties, addCourse } = useApp();

  const [selectedFacId, setSelectedFacId] = useState<string>(faculties[0]?.id || '');
  const [selectedNiveau, setSelectedNiveau] = useState<NiveauEtude>('L1 LMD');
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [selectedUEId, setSelectedUEId] = useState<string>('');

  // Course Form
  const [courseForm, setCourseForm] = useState({
    code: '',
    nom: '',
    credits: 4,
    heuresCM: 30,
    heuresTD: 15,
    heuresTP: 10,
    enseignant: '',
    titreEnseignant: 'Chef de Travaux' as 'Professeur' | 'Chef de Travaux' | 'Assistant',
  });

  const activeFac = faculties.find(f => f.id === selectedFacId) || faculties[0];
  const uesForNiveau = activeFac?.unitesEnseignement[selectedNiveau] || [];

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUEId || !courseForm.code || !courseForm.nom || !courseForm.enseignant) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    addCourse(activeFac.id, selectedNiveau, selectedUEId, {
      code: courseForm.code.toUpperCase(),
      nom: courseForm.nom,
      credits: Number(courseForm.credits),
      heuresCM: Number(courseForm.heuresCM),
      heuresTD: Number(courseForm.heuresTD),
      heuresTP: Number(courseForm.heuresTP),
      enseignant: courseForm.enseignant,
      titreEnseignant: courseForm.titreEnseignant,
    });

    setIsAddCourseModalOpen(false);
    setCourseForm({
      code: '',
      nom: '',
      credits: 4,
      heuresCM: 30,
      heuresTD: 15,
      heuresTP: 10,
      enseignant: '',
      titreEnseignant: 'Chef de Travaux',
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto h-full overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Programmes Académiques & Maquettes LMD
            </h2>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-purple-300 border border-slate-700 font-mono">
              Système LMD (Licence · Master)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Organisation pédagogique par Unités d'Enseignement (UE), Éléments Constitutifs (EC) et crédits académiques
          </p>
        </div>
      </div>

      {/* Faculty Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {faculties.map(fac => {
          const isSelected = fac.id === activeFac.id;
          return (
            <button
              key={fac.id}
              onClick={() => setSelectedFacId(fac.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>{fac.sigle} · {fac.nom}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Faculty Details */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">
              {activeFac.nom} ({activeFac.sigle})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Doyen de la Faculté : <strong className="text-slate-200">{activeFac.doyen}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Niveau d'études :</span>
            {(['L1 LMD', 'L2 LMD', 'L3 LMD', 'Master 1'] as NiveauEtude[]).map(niv => (
              <button
                key={niv}
                onClick={() => setSelectedNiveau(niv)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedNiveau === niv
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {niv}
              </button>
            ))}
          </div>
        </div>

        {/* Departements / Filières de la faculté */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Départements & Filières de Formation
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {activeFac.filieres.map(fil => (
              <div
                key={fil.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5"
              >
                <div className="font-bold text-amber-300">{fil.nom}</div>
                <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                  {fil.description}
                </p>
                <div className="text-[10px] text-slate-300 pt-1 border-t border-slate-800/60 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>Chef de Dép. : {fil.chefDepartement}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Curriculum Maquette Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Maquette Pédagogique · {selectedNiveau}</span>
            </h4>
            <p className="text-xs text-slate-400">
              Unités d'Enseignement et volume d'heures (CM: Magistral, TD: Dirigé, TP: Pratique)
            </p>
          </div>
        </div>

        {uesForNiveau.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
            <BookOpen className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="font-medium text-slate-300">
              Maquette pour {selectedNiveau} en cours de synchronisation par le Conseil Décanat.
            </p>
            <p className="text-slate-400 mt-1">
              Les UEs de L1 LMD sont déjà configurées pour les Sciences Économiques et l'Informatique.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {uesForNiveau.map(ue => (
              <div
                key={ue.id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm"
              >
                <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                        {ue.code}
                      </span>
                      <h5 className="font-bold text-white text-sm">{ue.nom}</h5>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      {ue.semestre} · Total {ue.creditsTotal} Crédits LMD
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedUEId(ue.id);
                      setIsAddCourseModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter Matière (EC)</span>
                  </button>
                </div>

                {/* Table of Elements / Subjects */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px] font-semibold bg-slate-900/40">
                        <th className="py-2.5 px-4">Code EC</th>
                        <th className="py-2.5 px-3">Intitulé du Cours</th>
                        <th className="py-2.5 px-3 text-center">Crédits</th>
                        <th className="py-2.5 px-3">Volume Horaire</th>
                        <th className="py-2.5 px-4">Enseignant Titulaire</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {ue.elements.map(ec => (
                        <tr key={ec.id} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-4 font-mono font-bold text-amber-300">
                            {ec.code}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-200">
                            {ec.nom}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-purple-400">
                            {ec.credits} ECTS
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-400 tabular-nums">
                            {ec.heuresCM}h CM · {ec.heuresTD}h TD · {ec.heuresTP}h TP
                          </td>
                          <td className="py-2.5 px-4">
                            <span className="font-semibold text-slate-200">
                              {ec.enseignant}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {ec.titreEnseignant}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Academic Calendar strip for Gemena */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>Calendrier Académique Officiel · Campus de Gemena</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Semestre 1 (Cours)</span>
            <div className="font-bold text-white">Octobre - Février</div>
            <p className="text-[11px] text-emerald-400">Examens mi-session en cours</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Session Ordinaire S1</span>
            <div className="font-bold text-white">15 Fév - 28 Fév</div>
            <p className="text-[11px] text-slate-400">Délibérations & Affichages</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Semestre 2 (Cours)</span>
            <div className="font-bold text-white">Mars - Juin</div>
            <p className="text-[11px] text-slate-400">Stages pratiques & Laboratoire</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Deuxième Session</span>
            <div className="font-bold text-white">Juillet - Août</div>
            <p className="text-[11px] text-purple-400">Soutenances TFC / Mémoires</p>
          </div>
        </div>
      </div>

      {/* Add Course Modal */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Ajouter un Élément Constitutif (EC)
                </h3>
                <p className="text-xs text-slate-400">
                  Maquette LMD {selectedNiveau} · {activeFac.sigle}
                </p>
              </div>
              <button
                onClick={() => setIsAddCourseModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCourseSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Code EC *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: GL201"
                    value={courseForm.code}
                    onChange={e => setCourseForm({ ...courseForm, code: e.target.value })}
                    className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700 uppercase font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-400 mb-1 font-medium">Intitulé du Cours *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Conception UML & Patrons"
                    value={courseForm.nom}
                    onChange={e => setCourseForm({ ...courseForm, nom: e.target.value })}
                    className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Crédits</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={courseForm.credits}
                    onChange={e => setCourseForm({ ...courseForm, credits: Number(e.target.value) })}
                    className="w-full bg-slate-800 text-slate-100 px-2 py-1.5 rounded-lg border border-slate-700 font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Heures CM</label>
                  <input
                    type="number"
                    min="0"
                    value={courseForm.heuresCM}
                    onChange={e => setCourseForm({ ...courseForm, heuresCM: Number(e.target.value) })}
                    className="w-full bg-slate-800 text-slate-100 px-2 py-1.5 rounded-lg border border-slate-700 font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Heures TD</label>
                  <input
                    type="number"
                    min="0"
                    value={courseForm.heuresTD}
                    onChange={e => setCourseForm({ ...courseForm, heuresTD: Number(e.target.value) })}
                    className="w-full bg-slate-800 text-slate-100 px-2 py-1.5 rounded-lg border border-slate-700 font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Heures TP</label>
                  <input
                    type="number"
                    min="0"
                    value={courseForm.heuresTP}
                    onChange={e => setCourseForm({ ...courseForm, heuresTP: Number(e.target.value) })}
                    className="w-full bg-slate-800 text-slate-100 px-2 py-1.5 rounded-lg border border-slate-700 font-mono text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Enseignant Titulaire *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nom du professeur / CT"
                    value={courseForm.enseignant}
                    onChange={e => setCourseForm({ ...courseForm, enseignant: e.target.value })}
                    className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Grade Académique</label>
                  <select
                    value={courseForm.titreEnseignant}
                    onChange={e => setCourseForm({ ...courseForm, titreEnseignant: e.target.value as any })}
                    className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700"
                  >
                    <option value="Professeur">Professeur (Ordinaire / Associé)</option>
                    <option value="Chef de Travaux">Chef de Travaux (CT)</option>
                    <option value="Assistant">Assistant (Ass.)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg cursor-pointer"
                >
                  Enregistrer dans la Maquette
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
