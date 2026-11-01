# Université CEPROMAD - Campus de Gemena
## Application Desktop de Gestion Académique et Financière

Système intégré de gestion universitaire développé pour l'**Université CEPROMAD (Centre Protestant pour le Management et le Développement)**, établissement de **Gemena**, Province du Sud-Ubangi, République Démocratique du Congo (RDC).

---

### 1. Fonctionnalités Principales

- **Gestion des Inscriptions (Nouveaux bacheliers)** : Formulaire d'enrôlement complet, contrôle des pièces physiques déposées à l'Apparitorat, génération automatique des matricules officiels (`CEPRO-GEM-2024-XXX`).
- **Gestion des Réinscriptions (Anciens étudiants)** : Vérification du quitus financier N-1 et du quitus académique, promotion vers la classe supérieure (L1 $\rightarrow$ L2 $\rightarrow$ L3 LMD, Master).
- **Caisse Centrale & Recouvrement des Frais** : Grille tarifaire officielle par promotion (Minerval en 3 tranches, enrôlement examens, laboratoire, carte d'étudiant), double conversion temps réel USD / Francs Congolais (CDF), conciliation bancaire (Rawbank, EquityBCDC, TMB, Caisse Centrale).
- **Programmes Académiques & Maquettes LMD** : Répertoire des 5 facultés (FSEG, Sciences Informatiques, Droit, Santé Publique, Agronomie) avec Unités d'Enseignement (UE), Éléments Constitutifs (EC), crédits ECTS et calendrier officiel de Gemena.
- **Centre d'Éditions & Impressions** :
  - Carte d'Étudiant Biométrique PVC avec code-barres et QR code.
  - Reçu officiel de caisse avec sommes en toutes lettres et cachet numérique.
  - Fiche d'inscription individuelle.
  - Quitus financier et billet d'accès aux épreuves de session.
  - Liste officielle des étudiants insolvables.
- **Stockage Local & Sauvegardes** : Sauvegarde JSON complète, restauration et exportations tabulaires CSV compatibles Microsoft Excel.
- **Support Desktop & Hors-Ligne (PWA)** : Installable sur Windows, macOS et Linux via le navigateur (Chrome / Edge), fonctionne 100% sans connexion Internet.

---

### 2. Comment installer et lancer le projet en local

#### Prérequis
- [Node.js](https://nodejs.org/) (version 18 ou supérieure)
- Gestionnaire de paquets `npm` ou `bun`

#### Installation
```bash
# 1. Cloner ou décompresser l'archive du projet
cd cepromad-gemena

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement local
npm run dev
```

L'application sera accessible immédiatement sur : `http://localhost:3000`

---

### 3. Comment compiler pour la production

```bash
# Compiler l'application pour le déploiement web ou bureau
npm run build

# Prévisualiser la version de production
npm run preview
```

---

### 4. Emballage en application Desktop native (.exe / .dmg) avec Electron

Pour transformer ce projet en exécutable Windows autonome (`.exe`) :

```bash
# 1. Installer Electron
npm install -D electron electron-builder concurrently

# 2. Compiler avec Vite et emballer l'exécutable
npm run build
npx electron-builder
```

---

### 5. Structure du Code Source

```
/
├── public/                     # Icônes PWA et graphismes vectoriels
│   └── icon.svg                # Emblème officiel de CEPROMAD Gemena
├── src/
│   ├── assets/images/          # Photos générées (campus, sceau, portraits d'étudiants)
│   ├── components/
│   │   ├── dashboard/          # Vue d'ensemble, KPIs, statistiques
│   │   ├── inscriptions/       # Enrôlement des nouveaux étudiants
│   │   ├── reinscriptions/     # Réinscriptions et délibérations
│   │   ├── finances/           # Caisse centrale, bordereaux bancaires, solvabilité
│   │   ├── programmes/         # Facultés, maquettes LMD et cours
│   │   ├── documents/          # Centre des documents officiels
│   │   ├── print/              # Moteur d'impression haute définition
│   │   ├── download/           # Modal de téléchargement PWA et code source
│   │   ├── settings/           # Grille tarifaire et sauvegardes JSON
│   │   ├── DesktopHeader.tsx   # Barre de titre système et recherche rapide
│   │   └── Sidebar.tsx         # Menu de navigation latérale
│   ├── context/
│   │   └── AppContext.tsx      # Gestionnaire d'état réactif et persistance locale
│   ├── data/
│   │   └── initialData.ts      # Base initiale des facultés, tarifs et étudiants
│   ├── types/
│   │   └── index.ts            # Définitions TypeScript complètes
│   ├── App.tsx                 # Assemblage de l'espace de travail
│   └── main.tsx                # Point d'entrée React 19
├── index.html                  # Page HTML avec police Plus Jakarta Sans et balises PWA
├── package.json                # Dépendances du projet
├── tsconfig.json               # Configuration du compilateur TypeScript
└── vite.config.ts              # Configuration Vite avec Tailwind v4 et VitePWA
```

---
*© Université CEPROMAD · Établissement de Gemena · Province du Sud-Ubangi, République Démocratique du Congo.*
