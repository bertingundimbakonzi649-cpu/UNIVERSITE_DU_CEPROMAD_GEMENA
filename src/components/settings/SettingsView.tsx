/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NiveauEtude } from '../../types';
import {
  Settings,
  DollarSign,
  Building,
  Save,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    settings,
    setSettings,
    exportBackupJSON,
    importBackupJSON,
    resetToDefaultData,
    formatUSD,
    formatCDF,
  } = useApp();

  const [formData, setFormData] = useState(settings);
  const [selectedNiveauTarif, setSelectedNiveauTarif] = useState<NiveauEtude>('L1 LMD');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const success = importBackupJSON(content);
        if (success) {
          alert('Sauvegarde restaurée avec succès ! Les données ont été actualisées.');
        } else {
          alert('Fichier de sauvegarde invalide ou corrompu.');
        }
      }
    };
    reader.readAsText(file);
  };

  const activeTarif = formData.grilleTarifaire[selectedNiveauTarif];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto h-full overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Configuration Générale & Sauvegardes
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Grille tarifaire des frais d'études, taux de change, identité du campus de Gemena et archivage local
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>Paramètres enregistrés avec succès</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Établissement & Taux */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-400" />
            <span>Identité Institutionnelle & Taux de Change</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Nom de l'Établissement</label>
              <input
                type="text"
                value={formData.nomEtablissement}
                onChange={e => setFormData({ ...formData, nomEtablissement: e.target.value })}
                className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Ville & Province</label>
              <input
                type="text"
                value={`${formData.ville} · ${formData.province}`}
                onChange={e => {
                  const parts = e.target.value.split('·');
                  setFormData({
                    ...formData,
                    ville: parts[0]?.trim() || 'Gemena',
                    province: parts[1]?.trim() || 'Sud-Ubangi (RDC)',
                  });
                }}
                className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Année Académique Active</label>
              <input
                type="text"
                value={formData.anneeAcademiqueActive}
                onChange={e => setFormData({ ...formData, anneeAcademiqueActive: e.target.value })}
                className="w-full bg-slate-800 text-amber-300 font-mono font-bold px-3 py-2 rounded-lg border border-slate-700"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Taux de Change Officiel (1 USD en CDF)</label>
              <div className="relative">
                <input
                  type="number"
                  min="1000"
                  max="5000"
                  value={formData.tauxChangeUSD_CDF}
                  onChange={e => setFormData({ ...formData, tauxChangeUSD_CDF: Number(e.target.value) })}
                  className="w-full bg-slate-800 text-emerald-400 font-mono font-bold px-3 py-2 rounded-lg border border-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Directeur de l'Apparitorat</label>
              <input
                type="text"
                value={formData.directeurApparitorat}
                onChange={e => setFormData({ ...formData, directeurApparitorat: e.target.value })}
                className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Administrateur du Budget (Finances)</label>
              <input
                type="text"
                value={formData.administrateurBudget}
                onChange={e => setFormData({ ...formData, administrateurBudget: e.target.value })}
                className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg border border-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Grille Tarifaire par Promotion */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Grille Tarifaire des Frais Académiques</span>
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Sélectionner la promotion :</span>
              {(['L1 LMD', 'L2 LMD', 'L3 LMD', 'Master 1', 'Master 2'] as NiveauEtude[]).map(niv => (
                <button
                  type="button"
                  key={niv}
                  onClick={() => setSelectedNiveauTarif(niv)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    selectedNiveauTarif === niv
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {niv}
                </button>
              ))}
            </div>
          </div>

          {activeTarif && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <label className="block text-slate-400 font-medium">Total Minerval (USD)</label>
                  <input
                    type="number"
                    value={activeTarif.fraisEtudesTotalUSD}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setFormData({
                        ...formData,
                        grilleTarifaire: {
                          ...formData.grilleTarifaire,
                          [selectedNiveauTarif]: { ...activeTarif, fraisEtudesTotalUSD: val },
                        },
                      });
                    }}
                    className="w-full bg-slate-800 text-white font-mono font-bold px-2 py-1.5 rounded border border-slate-700"
                  />
                  <span className="text-[10px] text-slate-400 block font-mono">
                    ≈ {formatCDF(activeTarif.fraisEtudesTotalUSD * formData.tauxChangeUSD_CDF)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <label className="block text-slate-400 font-medium">1ère Tranche (USD)</label>
                  <input
                    type="number"
                    value={activeTarif.tranches.tranche1USD}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setFormData({
                        ...formData,
                        grilleTarifaire: {
                          ...formData.grilleTarifaire,
                          [selectedNiveauTarif]: {
                            ...activeTarif,
                            tranches: { ...activeTarif.tranches, tranche1USD: val },
                          },
                        },
                      });
                    }}
                    className="w-full bg-slate-800 text-emerald-400 font-mono font-bold px-2 py-1.5 rounded border border-slate-700"
                  />
                  <span className="text-[10px] text-slate-400 block">Exigible à l'inscription</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <label className="block text-slate-400 font-medium">2ème Tranche (USD)</label>
                  <input
                    type="number"
                    value={activeTarif.tranches.tranche2USD}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setFormData({
                        ...formData,
                        grilleTarifaire: {
                          ...formData.grilleTarifaire,
                          [selectedNiveauTarif]: {
                            ...activeTarif,
                            tranches: { ...activeTarif.tranches, tranche2USD: val },
                          },
                        },
                      });
                    }}
                    className="w-full bg-slate-800 text-emerald-400 font-mono font-bold px-2 py-1.5 rounded border border-slate-700"
                  />
                  <span className="text-[10px] text-slate-400 block">Avant mi-session S1</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <label className="block text-slate-400 font-medium">3ème Tranche (USD)</label>
                  <input
                    type="number"
                    value={activeTarif.tranches.tranche3USD}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setFormData({
                        ...formData,
                        grilleTarifaire: {
                          ...formData.grilleTarifaire,
                          [selectedNiveauTarif]: {
                            ...activeTarif,
                            tranches: { ...activeTarif.tranches, tranche3USD: val },
                          },
                        },
                      });
                    }}
                    className="w-full bg-slate-800 text-emerald-400 font-mono font-bold px-2 py-1.5 rounded border border-slate-700"
                  />
                  <span className="text-[10px] text-slate-400 block">Avant session ordinaire S2</span>
                </div>
              </div>

              {/* Frais annexes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 space-y-1">
                  <label className="block text-slate-400 font-medium">Carte d'Étudiant (USD)</label>
                  <input
                    type="number"
                    value={activeTarif.carteEtudiantUSD}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setFormData({
                        ...formData,
                        grilleTarifaire: {
                          ...formData.grilleTarifaire,
                          [selectedNiveauTarif]: { ...activeTarif, carteEtudiantUSD: val },
                        },
                      });
                    }}
                    className="w-full bg-slate-800 text-white font-mono px-2 py-1.5 rounded border border-slate-700"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 space-y-1">
                  <label className="block text-slate-400 font-medium">Frais Laboratoire / Info (USD)</label>
                  <input
                    type="number"
                    value={activeTarif.laboratoireUSD}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setFormData({
                        ...formData,
                        grilleTarifaire: {
                          ...formData.grilleTarifaire,
                          [selectedNiveauTarif]: { ...activeTarif, laboratoireUSD: val },
                        },
                      });
                    }}
                    className="w-full bg-slate-800 text-white font-mono px-2 py-1.5 rounded border border-slate-700"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 space-y-1">
                  <label className="block text-slate-400 font-medium">Enrôlement Session (USD)</label>
                  <input
                    type="number"
                    value={activeTarif.enrolementSessionOrdinaireUSD}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setFormData({
                        ...formData,
                        grilleTarifaire: {
                          ...formData.grilleTarifaire,
                          [selectedNiveauTarif]: { ...activeTarif, enrolementSessionOrdinaireUSD: val },
                        },
                      });
                    }}
                    className="w-full bg-slate-800 text-white font-mono px-2 py-1.5 rounded border border-slate-700"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 space-y-1">
                  <label className="block text-slate-400 font-medium">Dépôt TFC / Mémoire (USD)</label>
                  <input
                    type="number"
                    value={activeTarif.depotMemoireTFCUSD}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setFormData({
                        ...formData,
                        grilleTarifaire: {
                          ...formData.grilleTarifaire,
                          [selectedNiveauTarif]: { ...activeTarif, depotMemoireTFCUSD: val },
                        },
                      });
                    }}
                    className="w-full bg-slate-800 text-white font-mono px-2 py-1.5 rounded border border-slate-700"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les Modifications</span>
            </button>
          </div>
        </div>
      </form>

      {/* Section 3: Sauvegarde & Restauration (Crucial Desktop ERP features) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>Gestion de la Base de Données Locale & Sauvegardes</span>
        </h3>
        <p className="text-xs text-slate-400">
          Cette application desktop conserve toutes les inscriptions, réinscriptions et transactions financières
          dans le stockage local sécurisé. Vous pouvez créer des sauvegardes JSON à tout moment.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={exportBackupJSON}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger Sauvegarde Complète (.json)</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Restaurer depuis un Fichier (.json)</span>
          </button>

          <button
            type="button"
            onClick={resetToDefaultData}
            className="px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-semibold text-xs border border-rose-800/60 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Réinitialiser Données Démo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
