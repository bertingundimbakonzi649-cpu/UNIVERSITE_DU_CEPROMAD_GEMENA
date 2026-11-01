/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useApp } from '../../context/AppContext';
import {
  Download,
  Laptop,
  CheckCircle2,
  FileSpreadsheet,
  FileJson,
  FileText,
  Printer,
  X,
  ExternalLink,
  ShieldCheck,
  HardDrive,
  Monitor,
  Code2,
  Terminal,
  Copy,
  Check,
} from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { exportBackupJSON, exportToCSV, settings, students, payments } = useApp();
  const [activeTab, setActiveTab] = useState<'app' | 'data' | 'pdf' | 'source'>('app');
  const [installSuccess, setInstallSuccess] = useState(false);
  const [copiedCommands, setCopiedCommands] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Centre de Téléchargement & Installation
              </h3>
              <p className="text-xs text-slate-400">
                Université CEPROMAD · Établissement de Gemena
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 pt-2 text-xs font-semibold gap-2">
          <button
            onClick={() => setActiveTab('app')}
            className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'app'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>1. Installer l'Application PC (Desktop)</span>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'data'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>2. Télécharger les Données (Excel/JSON)</span>
          </button>

          <button
            onClick={() => setActiveTab('pdf')}
            className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'pdf'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>3. Télécharger les Documents (PDF)</span>
          </button>

          <button
            onClick={() => setActiveTab('source')}
            className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'source'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>4. Code Source & GitHub</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* TAB 1: INSTALL AS DESKTOP APPLICATION */}
          {activeTab === 'app' && (
            <div className="space-y-5">
              {/* Status Box */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-amber-400" />
                    <span>Application de Bureau Autonome (Desktop)</span>
                  </h4>
                  <p className="text-slate-400 text-xs mt-1">
                    Installez l'application directement sur votre PC (Windows, Mac ou Linux).
                    Elle fonctionnera dans une fenêtre dédiée avec icône sur votre bureau et sera accessible même hors connexion Internet !
                  </p>
                </div>

                {isInstalled || installSuccess ? (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold flex items-center gap-1.5 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Installée</span>
                  </span>
                ) : isInstallable ? (
                  <button
                    onClick={handleInstallClick}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Installer sur ce PC</span>
                  </button>
                ) : (
                  <span className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    Prêt pour installation
                  </span>
                )}
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-3">
                <span className="font-bold text-white uppercase tracking-wider text-[11px] block">
                  Comment installer sur votre navigateur :
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Chrome / Edge / Brave */}
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <span>Google Chrome & Microsoft Edge</span>
                    </div>
                    <ol className="space-y-1.5 text-slate-300 list-decimal list-inside leading-relaxed text-[11px]">
                      <li>
                        Regardez tout en haut à droite de votre barre d'adresse du navigateur.
                      </li>
                      <li>
                        Cliquez sur la petite icône <strong>d'ordinateur avec une flèche</strong> ou le bouton <strong>« Installer »</strong>.
                      </li>
                      <li>
                        Ou cliquez sur les <strong>3 petits points verticaux ⋮</strong> $\rightarrow$ <em>« Enregistrer et partager »</em> ou <em>« Installer l'application Université CEPROMAD »</em>.
                      </li>
                      <li>
                        L'icône officielle s'ajoute immédiatement à votre Bureau et barre des tâches Windows !
                      </li>
                    </ol>
                  </div>

                  {/* Offline & Data Security */}
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Avantages de l'Installation Desktop</span>
                    </div>
                    <ul className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                      <li>
                        ✓ <strong>100% Hors-Ligne (Offline) :</strong> La base de données locale continue de fonctionner même en cas de coupure Internet à Gemena.
                      </li>
                      <li>
                        ✓ <strong>Fenêtre dédiée :</strong> Pas de barre d'onglets de navigateur distrayante.
                      </li>
                      <li>
                        ✓ <strong>Démarrage ultra-rapide :</strong> S'ouvre comme un logiciel Windows natif (.exe).
                      </li>
                      <li>
                        ✓ <strong>Impression directe :</strong> Cartes PVC et reçus reliés aux imprimantes locales.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXPORT & DOWNLOAD DATA */}
          {activeTab === 'data' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-white text-sm">
                  Télécharger les Données & Sauvegardes Locales
                </h4>
                <p className="text-slate-400 text-xs mt-0.5">
                  Exportez l'ensemble des dossiers de scolarité et de comptabilité pour conservation sécurisée ou exploitation sur tableur.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Backup JSON */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-blue-400 font-bold">
                      <FileJson className="w-4 h-4" />
                      <span>Sauvegarde Complète (.JSON)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Contient tous les étudiants, paiements, réinscriptions, cours LMD et paramètres du campus.
                    </p>
                  </div>
                  <button
                    onClick={exportBackupJSON}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger Sauvegarde (.json)</span>
                  </button>
                </div>

                {/* CSV Students */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Liste des Étudiants (.CSV / Excel)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Fichier compatible Microsoft Excel reprenant les matricules, identités, promotions et contacts ({students.length} étudiants).
                    </p>
                  </div>
                  <button
                    onClick={() => exportToCSV('etudiants')}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger Étudiants (.csv)</span>
                  </button>
                </div>

                {/* CSV Payments */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Journal des Paiements & Caisse (.CSV)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Registre complet de toutes les quittances de frais académiques émises ({payments.length} transactions).
                    </p>
                  </div>
                  <button
                    onClick={() => exportToCSV('paiements')}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Télécharger Journal Caisse (.csv)</span>
                  </button>
                </div>

                {/* CSV Debtors */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-rose-400 font-bold">
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Registre des Insolvables (.CSV)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Liste des étudiants débiteurs avec montants dûs et soldes pour le contrôle d'accès aux épreuves.
                    </p>
                  </div>
                  <button
                    onClick={() => exportToCSV('insolvables')}
                    className="w-full py-2 bg-rose-950 hover:bg-rose-900 text-rose-200 font-semibold rounded-lg border border-rose-800 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download className="w-4 h-4 text-rose-400" />
                    <span>Télécharger Débiteurs (.csv)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOWNLOAD OFFICIAL DOCUMENTS IN PDF */}
          {activeTab === 'pdf' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-white text-sm">
                  Comment télécharger et enregistrer les documents en PDF ?
                </h4>
                <p className="text-slate-400 text-xs mt-0.5">
                  Toutes les pièces (Carte d'étudiant, quittance de paiement, dossier d'inscription, billet d'examen)
                  peuvent être enregistrées directement en fichier PDF haute résolution.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <span className="font-bold text-amber-300 text-xs block">
                  Procédure d'enregistrement en PDF :
                </span>
                <ol className="space-y-2 text-slate-300 text-[11px] list-decimal list-inside leading-relaxed">
                  <li>
                    Rendez-vous dans l'onglet <strong>« Cartes & Documents »</strong> (ou cliquez sur le bouton <strong>« Reçu »</strong> ou <strong>« Carte »</strong> sur n'importe quel étudiant).
                  </li>
                  <li>
                    Cliquez sur le bouton <strong>« Imprimer / Exporter PDF »</strong> en haut à droite du document.
                  </li>
                  <li>
                    Dans la fenêtre qui apparaît, choisissez comme imprimante de destination : <strong>« Enregistrer au format PDF »</strong> (ou <em>« Microsoft Print to PDF »</em> sur Windows).
                  </li>
                  <li>
                    Cliquez sur <strong>« Enregistrer »</strong> et choisissez le dossier sur votre ordinateur (ex: <em>Bureau</em> ou <em>Documents</em>).
                  </li>
                  <li>
                    Le fichier PDF est créé et peut être envoyé par email, WhatsApp ou copié sur clé USB pour tirage papier ou plastification !
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 4: SOURCE CODE & GITHUB */}
          {activeTab === 'source' && (
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-amber-400" />
                  <span>Obtenir et Télécharger le Code Source Complet</span>
                </h4>
                <p className="text-slate-400 text-xs mt-0.5">
                  L'intégralité du code source de cette application (React 19, TypeScript, Tailwind CSS, Vite) vous appartient.
                </p>
              </div>

              {/* Method 1: Export in Google AI Studio */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <span>Méthode 1 : Télécharger l'archive ZIP depuis Google AI Studio</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Dans l'interface de Google AI Studio (tout en haut à droite de votre écran) :
                </p>
                <ol className="space-y-1.5 text-slate-300 text-[11px] list-decimal list-inside leading-relaxed">
                  <li>
                    Repérez le bouton <strong>« Export »</strong> ou <strong>« Download Code / Télécharger »</strong> (ou l'icône de partage/téléchargement).
                  </li>
                  <li>
                    Cliquez sur <strong>« Download ZIP »</strong> pour enregistrer immédiatement l'archive complète de tous les fichiers du projet sur votre disque dur.
                  </li>
                  <li>
                    Vous pouvez également choisir <strong>« Export to GitHub »</strong> pour synchroniser automatiquement le code sur votre compte GitHub.
                  </li>
                </ol>
              </div>

              {/* Method 2: Local Installation Commands */}
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Lancer le code source sur votre ordinateur (Terminal)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`npm install\nnpm run dev`);
                      setCopiedCommands(true);
                      setTimeout(() => setCopiedCommands(false), 2000);
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedCommands ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCommands ? 'Copié !' : 'Copier commandes'}</span>
                  </button>
                </div>

                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto">
{`# 1. Décompresser le fichier ZIP téléchargé
cd cepromad-gemena

# 2. Installer les modules Node.js
npm install

# 3. Démarrer le serveur de gestion local
npm run dev`}
                </pre>
                <p className="text-[10px] text-slate-400">
                  L'application sera lancée sur <code className="text-amber-300 font-mono">http://localhost:3000</code>.
                </p>
              </div>

              {/* Architecture overview */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                <span className="font-bold text-white uppercase text-[10px] tracking-wider block">
                  Organisation des fichiers sources dans le projet :
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <strong className="text-amber-300">src/components/</strong> : Inscriptions, Caisse, LMD, Cartes
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <strong className="text-amber-300">src/context/AppContext.tsx</strong> : Base de données locale & calculs
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <strong className="text-amber-300">src/types/index.ts</strong> : Modèles de données universitaires
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <strong className="text-amber-300">README.md</strong> : Guide complet de compilation Electron Desktop
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Université CEPROMAD Gemena · Système v2.6 Desktop</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
