/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Sexe = 'M' | 'F';

export type StatutDossier = 'Validé' | 'En attente' | 'Dossier incomplet' | 'Rejeté';

export type NiveauEtude = 'L1 LMD' | 'L2 LMD' | 'L3 LMD' | 'Master 1' | 'Master 2';

export type StatutPaiement = 'En règle' | 'Partiellement payé' | 'Insolvable';

export type ModePaiement = 'Caisse Centrale' | 'Rawbank' | 'EquityBCDC' | 'TMB' | 'Airtel Money / M-Pesa';

export type TypeFrais = 
  | 'Tranche 1 (Minerval)'
  | 'Tranche 2 (Minerval)'
  | 'Tranche 3 (Minerval)'
  | 'Enrôlement Examens Mi-Session'
  | 'Enrôlement Examens Session Ordinaire'
  | 'Carte d\'Étudiant & Assurance'
  | 'Frais de Laboratoire & Informatique'
  | 'Dépôt Mémoire / TFC';

export interface Student {
  id: string; // e.g., 'CEPRO-GEM-2024-001'
  nom: string;
  postnom: string;
  prenom: string;
  sexe: Sexe;
  dateNaissance: string;
  lieuNaissance: string;
  nationalite: string;
  telephone: string;
  email: string;
  adresse: string; // Gemena quartier
  photoUrl?: string;

  // Cursus
  faculteId: string;
  filiereId: string;
  niveau: NiveauEtude;
  anneeAcademique: string; // '2024-2025'

  // Scolarité antérieure
  ecoleProvenance: string;
  sectionDiplomeEtat: string;
  pourcentageDiplomeEtat: number;
  anneeObtentionDiplome: number;

  // Documents
  dossierPieces: {
    bulletins5et6: boolean;
    diplomeEtatOuAttestation: boolean;
    certificatNationalite: boolean;
    certificatAptitudePhysique: boolean;
    photosPasseport: boolean;
    acteNaissance: boolean;
  };

  typeEtudiant: 'Nouveau' | 'Réinscrit';
  statutDossier: StatutDossier;
  dateInscription: string;
  remarques?: string;
}

export interface Payment {
  id: string;
  numeroRecu: string;
  etudiantId: string;
  montantUSD: number;
  montantCDF: number;
  tauxChange: number;
  typeFrais: TypeFrais;
  modePaiement: ModePaiement;
  numeroBordereau?: string;
  banque?: string;
  datePaiement: string;
  anneeAcademique: string;
  percepteur: string;
  statut: 'Validé' | 'Annulé';
  motif?: string;
}

export interface ReinscriptionRecord {
  id: string;
  etudiantId: string;
  anneePrecedente: string; // '2023-2024'
  niveauPrecedent: NiveauEtude;
  anneeNouvelle: string; // '2024-2025'
  niveauNouveau: NiveauEtude;
  dateValidation: string;
  quitusFinancierN1: boolean;
  quitusAcademiqueN1: boolean;
  decisionJury: 'Admis' | 'Ajourné' | 'Redoublant';
  observation?: string;
}

export interface ElementConstitutif {
  id: string;
  code: string;
  nom: string;
  credits: number;
  heuresCM: number; // Cours magistral
  heuresTD: number; // Travaux dirigés
  heuresTP: number; // Travaux pratiques
  enseignant: string;
  titreEnseignant: 'Professeur' | 'Chef de Travaux' | 'Assistant';
}

export interface UniteEnseignement {
  id: string;
  code: string;
  nom: string;
  semestre: 'Semestre 1' | 'Semestre 2' | 'Semestre 3' | 'Semestre 4' | 'Semestre 5' | 'Semestre 6';
  creditsTotal: number;
  elements: ElementConstitutif[];
}

export interface Filiere {
  id: string;
  nom: string;
  description: string;
  faculteId: string;
  chefDepartement: string;
}

export interface Faculte {
  id: string;
  nom: string;
  sigle: string;
  doyen: string;
  filieres: Filiere[];
  unitesEnseignement: {
    [niveau in NiveauEtude]?: UniteEnseignement[];
  };
}

export interface TarifGrille {
  niveau: NiveauEtude;
  fraisEtudesTotalUSD: number;
  tranches: {
    tranche1USD: number;
    tranche2USD: number;
    tranche3USD: number;
  };
  enrolementMiSessionUSD: number;
  enrolementSessionOrdinaireUSD: number;
  carteEtudiantUSD: number;
  laboratoireUSD: number;
  depotMemoireTFCUSD: number;
}

export interface AppSettings {
  nomEtablissement: string;
  ville: string;
  province: string;
  devisePrincipale: 'USD' | 'CDF';
  tauxChangeUSD_CDF: number;
  anneeAcademiqueActive: string;
  rectoratContact: string;
  directeurApparitorat: string;
  administrateurBudget: string;
  grilleTarifaire: Record<NiveauEtude, TarifGrille>;
}
