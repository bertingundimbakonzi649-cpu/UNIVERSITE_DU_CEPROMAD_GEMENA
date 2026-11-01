/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  AppSettings,
  ElementConstitutif,
  Faculte,
  NiveauEtude,
  Payment,
  ReinscriptionRecord,
  StatutPaiement,
  Student,
} from '../types';
import {
  initialFaculties,
  initialPayments,
  initialReinscriptions,
  initialSettings,
  initialStudents,
} from '../data/initialData';

export type NavigationTab =
  | 'dashboard'
  | 'inscriptions'
  | 'reinscriptions'
  | 'finances'
  | 'programmes'
  | 'documents'
  | 'settings';

export interface PrintModalState {
  isOpen: boolean;
  type: 'carte' | 'recu' | 'fiche' | 'quitus' | 'billet' | 'liste_insolvables';
  data?: any;
}

export interface StudentFinancialSummary {
  totalPayeUSD: number;
  totalPayeCDF: number;
  totalDuUSD: number;
  soldeUSD: number;
  statut: StatutPaiement;
  paiements: Payment[];
}

export interface AppFinancialStats {
  totalRecouvreUSD: number;
  totalPrevuUSD: number;
  tauxRecouvrement: number;
  totalInscrits: number;
  totalReinscrits: number;
  totalEtudiants: number;
  totalSolvables: number;
  totalPartiels: number;
  totalInsolvables: number;
}

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  students: Student[];
  payments: Payment[];
  reinscriptions: ReinscriptionRecord[];
  faculties: Faculte[];
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  printModal: PrintModalState;
  openPrintModal: (type: PrintModalState['type'], data?: any) => void;
  closePrintModal: () => void;

  // Actions
  addStudent: (data: Omit<Student, 'id' | 'dateInscription'>) => Student;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addPayment: (data: Omit<Payment, 'id' | 'numeroRecu'>) => Payment;
  cancelPayment: (id: string) => void;
  processReinscription: (data: Omit<ReinscriptionRecord, 'id' | 'dateValidation'>) => ReinscriptionRecord;
  addCourse: (faculteId: string, niveau: NiveauEtude, ueId: string, ec: Omit<ElementConstitutif, 'id'>) => void;

  // Helpers
  getStudentFinancialSummary: (studentId: string) => StudentFinancialSummary;
  financialStats: AppFinancialStats;
  getFacultyById: (facId: string) => Faculte | undefined;
  getFiliereById: (filId: string) => { filiereNom: string; faculteNom: string } | undefined;
  formatUSD: (amount: number) => string;
  formatCDF: (amount: number) => string;
  exportBackupJSON: () => void;
  importBackupJSON: (jsonString: string) => boolean;
  resetToDefaultData: () => void;
  exportToCSV: (type: 'etudiants' | 'paiements' | 'insolvables') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'cepromad_gemena_students_v1',
  PAYMENTS: 'cepromad_gemena_payments_v1',
  REINSCRIPTIONS: 'cepromad_gemena_reinscriptions_v1',
  FACULTIES: 'cepromad_gemena_faculties_v1',
  SETTINGS: 'cepromad_gemena_settings_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [printModal, setPrintModal] = useState<PrintModalState>({
    isOpen: false,
    type: 'carte',
  });

  // Persistent States
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [reinscriptions, setReinscriptions] = useState<ReinscriptionRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REINSCRIPTIONS);
    return saved ? JSON.parse(saved) : initialReinscriptions;
  });

  const [faculties, setFaculties] = useState<Faculte[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FACULTIES);
    return saved ? JSON.parse(saved) : initialFaculties;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : initialSettings;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REINSCRIPTIONS, JSON.stringify(reinscriptions));
  }, [reinscriptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FACULTIES, JSON.stringify(faculties));
  }, [faculties]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  const openPrintModal = (type: PrintModalState['type'], data?: any) => {
    setPrintModal({ isOpen: true, type, data });
  };

  const closePrintModal = () => {
    setPrintModal(prev => ({ ...prev, isOpen: false }));
  };

  const formatUSD = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCDF = (amount: number) => {
    return new Intl.NumberFormat('fr-CD', {
      maximumFractionDigits: 0,
    }).format(amount) + ' FC';
  };

  const getFacultyById = (facId: string) => {
    return faculties.find(f => f.id === facId);
  };

  const getFiliereById = (filId: string) => {
    for (const fac of faculties) {
      const fil = fac.filieres.find(f => f.id === filId);
      if (fil) {
        return { filiereNom: fil.nom, faculteNom: fac.nom };
      }
    }
    return undefined;
  };

  // Helper to compute individual student fee summary
  const getStudentFinancialSummary = (studentId: string): StudentFinancialSummary => {
    const student = students.find(s => s.id === studentId);
    if (!student) {
      return {
        totalPayeUSD: 0,
        totalPayeCDF: 0,
        totalDuUSD: 0,
        soldeUSD: 0,
        statut: 'Insolvable',
        paiements: [],
      };
    }

    const tarif = settings.grilleTarifaire[student.niveau] || settings.grilleTarifaire['L1 LMD'];
    const totalDuUSD = tarif.fraisEtudesTotalUSD + tarif.carteEtudiantUSD + tarif.laboratoireUSD;

    const studentPayments = payments.filter(p => p.etudiantId === studentId && p.statut === 'Validé');
    const totalPayeUSD = studentPayments.reduce((sum, p) => sum + p.montantUSD, 0);
    const totalPayeCDF = studentPayments.reduce((sum, p) => sum + p.montantCDF, 0);
    const soldeUSD = totalDuUSD - totalPayeUSD;

    let statut: StatutPaiement = 'Insolvable';
    if (totalPayeUSD >= totalDuUSD) {
      statut = 'En règle';
    } else if (totalPayeUSD > 0) {
      statut = 'Partiellement payé';
    }

    return {
      totalPayeUSD,
      totalPayeCDF,
      totalDuUSD,
      soldeUSD,
      statut,
      paiements: studentPayments,
    };
  };

  // Overall Financial & Academic Statistics
  const financialStats: AppFinancialStats = useMemo(() => {
    const totalInscrits = students.filter(s => s.typeEtudiant === 'Nouveau').length;
    const totalReinscrits = students.filter(s => s.typeEtudiant === 'Réinscrit').length;
    const totalEtudiants = students.length;

    let totalRecouvreUSD = 0;
    let totalPrevuUSD = 0;
    let totalSolvables = 0;
    let totalPartiels = 0;
    let totalInsolvables = 0;

    for (const st of students) {
      const tarif = settings.grilleTarifaire[st.niveau] || settings.grilleTarifaire['L1 LMD'];
      const du = tarif.fraisEtudesTotalUSD + tarif.carteEtudiantUSD + tarif.laboratoireUSD;
      totalPrevuUSD += du;

      const sumPay = payments
        .filter(p => p.etudiantId === st.id && p.statut === 'Validé')
        .reduce((sum, p) => sum + p.montantUSD, 0);

      totalRecouvreUSD += sumPay;

      if (sumPay >= du) {
        totalSolvables++;
      } else if (sumPay > 0) {
        totalPartiels++;
      } else {
        totalInsolvables++;
      }
    }

    const tauxRecouvrement = totalPrevuUSD > 0 ? (totalRecouvreUSD / totalPrevuUSD) * 100 : 0;

    return {
      totalRecouvreUSD,
      totalPrevuUSD,
      tauxRecouvrement,
      totalInscrits,
      totalReinscrits,
      totalEtudiants,
      totalSolvables,
      totalPartiels,
      totalInsolvables,
    };
  }, [students, payments, settings]);

  // Actions
  const addStudent = (data: Omit<Student, 'id' | 'dateInscription'>): Student => {
    const currentYear = settings.anneeAcademiqueActive.split('-')[0];
    const seq = String(students.length + 1).padStart(3, '0');
    const newId = `CEPRO-GEM-${currentYear}-${seq}`;
    const today = new Date().toISOString().split('T')[0];

    const newStudent: Student = {
      ...data,
      id: newId,
      dateInscription: today,
    };

    setStudents(prev => [newStudent, ...prev]);
    return newStudent;
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setPayments(prev => prev.filter(p => p.etudiantId !== id));
    setReinscriptions(prev => prev.filter(r => r.etudiantId !== id));
  };

  const addPayment = (data: Omit<Payment, 'id' | 'numeroRecu'>): Payment => {
    const currentYear = settings.anneeAcademiqueActive.split('-')[0];
    const seq = String(payments.length + 143).padStart(5, '0');
    const numRecu = `REC-${currentYear}-${seq}`;
    const newId = `PAY-${Date.now()}`;

    const newPayment: Payment = {
      ...data,
      id: newId,
      numeroRecu: numRecu,
    };

    setPayments(prev => [newPayment, ...prev]);
    return newPayment;
  };

  const cancelPayment = (id: string) => {
    setPayments(prev =>
      prev.map(p => (p.id === id ? { ...p, statut: 'Annulé' } : p))
    );
  };

  const processReinscription = (
    data: Omit<ReinscriptionRecord, 'id' | 'dateValidation'>
  ): ReinscriptionRecord => {
    const newId = `REINSC-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];

    const record: ReinscriptionRecord = {
      ...data,
      id: newId,
      dateValidation: today,
    };

    setReinscriptions(prev => [record, ...prev]);

    // Update student's level and academic year
    updateStudent(data.etudiantId, {
      niveau: data.niveauNouveau,
      anneeAcademique: data.anneeNouvelle,
      typeEtudiant: 'Réinscrit',
      statutDossier: 'Validé',
    });

    return record;
  };

  const addCourse = (
    faculteId: string,
    niveau: NiveauEtude,
    ueId: string,
    ec: Omit<ElementConstitutif, 'id'>
  ) => {
    setFaculties(prev =>
      prev.map(fac => {
        if (fac.id !== faculteId) return fac;
        const currentNiveauUEs = fac.unitesEnseignement[niveau] || [];
        const updatedUEs = currentNiveauUEs.map(ue => {
          if (ue.id !== ueId) return ue;
          const newEc: ElementConstitutif = {
            ...ec,
            id: `ec-${Date.now()}`,
          };
          return {
            ...ue,
            elements: [...ue.elements, newEc],
            creditsTotal: ue.creditsTotal + newEc.credits,
          };
        });

        return {
          ...fac,
          unitesEnseignement: {
            ...fac.unitesEnseignement,
            [niveau]: updatedUEs,
          },
        };
      })
    );
  };

  const exportBackupJSON = () => {
    const data = {
      timestamp: new Date().toISOString(),
      institution: settings.nomEtablissement,
      students,
      payments,
      reinscriptions,
      faculties,
      settings,
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CEPROMAD_Gemena_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackupJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.students && Array.isArray(data.students)) {
        setStudents(data.students);
      }
      if (data.payments && Array.isArray(data.payments)) {
        setPayments(data.payments);
      }
      if (data.reinscriptions && Array.isArray(data.reinscriptions)) {
        setReinscriptions(data.reinscriptions);
      }
      if (data.faculties && Array.isArray(data.faculties)) {
        setFaculties(data.faculties);
      }
      if (data.settings) {
        setSettings(data.settings);
      }
      return true;
    } catch {
      return false;
    }
  };

  const resetToDefaultData = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser toutes les données aux valeurs par défaut de l'Université CEPROMAD Gemena ?")) {
      setStudents(initialStudents);
      setPayments(initialPayments);
      setReinscriptions(initialReinscriptions);
      setFaculties(initialFaculties);
      setSettings(initialSettings);
      localStorage.removeItem(STORAGE_KEYS.STUDENTS);
      localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
      localStorage.removeItem(STORAGE_KEYS.REINSCRIPTIONS);
      localStorage.removeItem(STORAGE_KEYS.FACULTIES);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    }
  };

  const exportToCSV = (type: 'etudiants' | 'paiements' | 'insolvables') => {
    let rows: string[][] = [];
    let filename = '';

    if (type === 'etudiants') {
      filename = `Etudiants_CEPROMAD_Gemena_${settings.anneeAcademiqueActive}.csv`;
      rows.push(['Matricule', 'Nom', 'Post-nom', 'Prénom', 'Sexe', 'Faculté', 'Niveau', 'Téléphone', 'Statut Dossier']);
      students.forEach(s => {
        const fac = getFacultyById(s.faculteId);
        rows.push([
          s.id,
          s.nom,
          s.postnom,
          s.prenom,
          s.sexe,
          fac?.sigle || s.faculteId,
          s.niveau,
          s.telephone,
          s.statutDossier,
        ]);
      });
    } else if (type === 'paiements') {
      filename = `Paiements_Frais_CEPROMAD_Gemena_${settings.anneeAcademiqueActive}.csv`;
      rows.push(['N° Reçu', 'Matricule', 'Étudiant', 'Type Frais', 'Montant USD', 'Montant CDF', 'Mode', 'Bordereau', 'Date']);
      payments.forEach(p => {
        const st = students.find(s => s.id === p.etudiantId);
        rows.push([
          p.numeroRecu,
          p.etudiantId,
          st ? `${st.nom} ${st.postnom} ${st.prenom}` : 'Inconnu',
          p.typeFrais,
          p.montantUSD.toString(),
          p.montantCDF.toString(),
          p.modePaiement,
          p.numeroBordereau || '-',
          p.datePaiement,
        ]);
      });
    } else if (type === 'insolvables') {
      filename = `Liste_Etudiants_Insolvables_${settings.anneeAcademiqueActive}.csv`;
      rows.push(['Matricule', 'Nom & Post-nom', 'Faculté', 'Niveau', 'Total Dû USD', 'Total Payé USD', 'Solde Restant USD', 'Statut']);
      students.forEach(s => {
        const sum = getStudentFinancialSummary(s.id);
        if (sum.statut !== 'En règle') {
          const fac = getFacultyById(s.faculteId);
          rows.push([
            s.id,
            `${s.nom} ${s.postnom} ${s.prenom}`,
            fac?.sigle || s.faculteId,
            s.niveau,
            sum.totalDuUSD.toString(),
            sum.totalPayeUSD.toString(),
            sum.soldeUSD.toString(),
            sum.statut,
          ]);
        }
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(e => e.map(item => `"${(item || '').replace(/"/g, '""')}"`).join(';')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        students,
        payments,
        reinscriptions,
        faculties,
        settings,
        setSettings,
        selectedStudent,
        setSelectedStudent,
        searchQuery,
        setSearchQuery,
        printModal,
        openPrintModal,
        closePrintModal,
        addStudent,
        updateStudent,
        deleteStudent,
        addPayment,
        cancelPayment,
        processReinscription,
        addCourse,
        getStudentFinancialSummary,
        financialStats,
        getFacultyById,
        getFiliereById,
        formatUSD,
        formatCDF,
        exportBackupJSON,
        importBackupJSON,
        resetToDefaultData,
        exportToCSV,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
