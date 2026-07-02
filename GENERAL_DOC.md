# Media Congo — Documentation générale

Résumé
- Media Congo Admin est une interface d'administration React + TypeScript pour gérer des publications, rapports et paramètres d'un système média. Destiné aux administrateurs/éditeurs du site média afin de créer/modifier des publications, consulter des statistiques et gérer les paramètres.

Fonctionnalités principales
- Authentification (page de connexion)
- Tableau de bord avec statistiques (StatCard, ViewsList)
- Création / modification de publications (PublicationForm)
- Pages de rapports et de paramètres
- Composants UI réutilisables (src/app/components/ui)
- Client API centralisé (src/services/api.ts)
- Thèmes et styles (Tailwind + CSS)

Stack
- Langage : TypeScript
- Framework UI : React (Vite)
- Styles : Tailwind CSS + fichiers CSS personnalisés
- Icônes : Font Awesome
- Outils : Vite (dev server + build)

Prérequis
- Node.js (version LTS recommandée)
- npm (ou pnpm/yarn)
- Backend API disponible (les endpoints attendus sont des scripts PHP sous /api)

Installation (chemin court)
1. Cloner :
   ```
   git clone https://github.com/ndombeelie/media_congo_admin.git
   cd media_congo_admin
   ```
2. Installer dépendances :
   ```
   npm install
   ```
3. Lancer le serveur de développement :
   ```
   npm run dev
   ```
4. Ouvrir l'URL indiquée par Vite (typiquement http://localhost:5173)

Build & Déploiement
- Générer la build :
  ```
  npm run build
  ```
  La sortie est généralement dans `dist/`.
- Servir `dist/` via un serveur statique (serve, Netlify, Vercel, S3, etc.).

Configuration & variables d'environnement
- Actuellement, l'URL de l'API est codée en dur dans `src/services/api.ts` :
  ```
  const API_BASE_URL = 'http://localhost:8080/api';
  ```
- Recommandation : utiliser une variable d'environnement (ex. `VITE_API_BASE_URL`) pour distinguer dev/prod.

API attendue (extrait)
- GET/POST `/posts.php`        — liste / création de publications
- GET `/stats.php?period=...` — récupération de statistiques
- POST `/auth/login.php`      — authentification
- GET `/views.php`            — vues / métriques

Token
- Le front lit un token depuis `localStorage.getItem('token')` et l'envoie dans le header :
  ```
  Authorization: Bearer <token>
  ```

Contribuer
- Ouvrir une issue pour changements majeurs.
- Créer une branche : `git checkout -b feat/ma-fonctionnalite`
- Soumettre une PR avec description et captures d'écran si nécessaire.
- Respecter les guidelines dans le dossier `guidelines/`.

Points d'amélioration recommandés
- Externaliser l'URL de l'API (VITE_API_BASE_URL).
- Documenter formellement les endpoints (contrats, schémas JSON, codes d'erreur).
- Ajouter tests unitaires et e2e, lint/format et CI.
- Ajouter LICENSE si nécessaire.

Contacts
- Propriétaire : ndombeelie (https://github.com/ndombeelie)
