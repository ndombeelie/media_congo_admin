# Media Congo — Admin Dashboard

Une interface d'administration (Admin Dashboard) React/TypeScript pour gérer des publications, rapports et paramètres d'un système média. Fournit des pages d'authentification, tableau de bord, formulaire de publication, rapports et une bibliothèque locale de composants UI réutilisables.

---

## Fonctionnalités principales

- Page d'authentification
- Tableau de bord avec statistiques (StatCard, ViewsList)
- Formulaire de création / édition de publication (PublicationForm)
- Pages de rapports et de paramètres
- Bibliothèque de composants UI réutilisables (src/app/components/ui)
- Client API centralisé (src/services/api.ts)
- Configuration UI (Font Awesome, thèmes CSS, Tailwind)

---

## Stack & dépendances clés

- Langage : TypeScript (principal)
- UI : React (Vite)
- Bundler / dev server : Vite
- Styles : Tailwind CSS + fichiers CSS de thème
- Icônes : Font Awesome (configuration dans src/app/components/fontawesome-config.ts)
- Notifications : sonner (utilisé dans les composants UI)

Consultez `package.json` pour la liste complète des dépendances.

---

## Arborescence importante

```
ATTRIBUTIONS.md
ICONS_GUIDE.md
README.md
index.html
package.json
postcss.config.mjs
tsconfig.json
vite.config.ts
guidelines/
src/
  main.tsx                        # point d'entrée React
  app/
    App.tsx                       # composant racine / routes
    components/
      AuthPage.tsx
      Dashboard.tsx
      PublicationForm.tsx
      Reports.tsx
      Settings.tsx
      SocialLinkInput.tsx
      StatCard.tsx
      ViewsList.tsx
      fontawesome-config.ts
      figma/                       # helpers UI (ex: ImageWithFallback.tsx)
      ui/                          # composants UI réutilisables (button, dialog, sidebar, chart, etc.)
  services/
    api.ts                         # client API centralisé
  styles/
    index.css
    tailwind.css
    theme.css
    fonts.css
```

---

## Comment ça fonctionne (côté client)

- `src/main.tsx` monte React et rend `App.tsx`.
- `App.tsx` assemble les routes/pages et utilise les composants de `src/app/components/` et la bibliothèque `src/app/components/ui`.
- Les appels réseau sont centralisés dans `src/services/api.ts` (fonctions : fetchPosts, createPost, fetchStats, login, fetchViews, ...). Les requêtes ajoutent un header Authorization avec le token stocké dans `localStorage` si présent.

Exemple important (comportement observé dans src/services/api.ts) :
- API_BASE_URL est défini dans le fichier :
  ```
  const API_BASE_URL = 'http://localhost:8080/api';
  ```
- Les requêtes utilisent des endpoints PHP comme `/posts.php`, `/stats.php`, `/auth/login.php`, `/views.php`.
- `createPost` accepte `FormData` ou JSON ; il détecte `instanceof FormData` et ajuste les headers et le corps en conséquence.
- Pour l'Authorization, le header envoyé est :
  ```
  Authorization: `Bearer ${localStorage.getItem('token')}`
  ```

Si vous déployez, adaptez `API_BASE_URL` vers l'URL de votre API (ou refactorez pour utiliser une variable d'environnement).

---

## Prérequis

- Node.js (version active LTS recommandée)
- npm (ou pnpm/yarn si vous préférez — package.json montre des paramètres pnpm possibles)
- Serveur API disponible (les endpoints attendus sont des scripts PHP sous /api)

---

## Installation (chemin le plus court)

1. Cloner le dépôt :
   ```
   git clone https://github.com/ndombeelie/media_congo_admin.git
   cd media_congo_admin
   ```

2. Installer les dépendances :
   ```
   npm install
   ```

3. Lancer le serveur de développement (Vite) :
   ```
   npm run dev
   ```

4. Ouvrir le site en local (URL affichée par Vite, typiquement http://localhost:5173).

---

## Variables d'environnement & configuration API

Actuellement, l'URL de base de l'API est codée en dur dans `src/services/api.ts` :
```ts
const API_BASE_URL = 'http://localhost:8080/api';
```
Actions recommandées :
- Pour le développement, gardez ou ajustez cette URL vers votre backend local.
- Pour la production, remplacez-la par une variable d'environnement (ex. `import.meta.env.VITE_API_BASE_URL`) et modifiez `src/services/api.ts` pour l'utiliser.
- Le front attend un token JWT (ou token similaire) dans localStorage sous la clé `token` et l'envoie en header `Authorization: Bearer <token>`.

---

## Scripts utiles (depuis package.json)

- Démarrer le serveur de développement :
  ```
  npm run dev
  ```
- Construire pour production :
  ```
  npm run build
  ```

(Vérifiez `package.json` pour d'autres scripts ou configurations spécifiques.)

---

## Build et déploiement

1. Générer la build optimisée :
   ```
   npm run build
   ```
   La sortie est typiquement dans `dist/` (configurable via `vite.config.ts`).

2. Servir les fichiers statiques (exemples) :
   - Avec un serveur statique simple :
     ```
     npx serve dist
     ```
   - Ou déployer `dist/` sur un hébergeur statique (Netlify, Vercel, Firebase Hosting, S3+CloudFront, etc.)

3. Assurez-vous que la configuration de l'API en production pointe vers votre backend réel et que les en-têtes CORS sont configurés côté backend.

---

## Tests

Aucun framework de tests n'a été détecté dans le dépôt (pas de dossier `tests/` ni de scripts de test dans `package.json`). Si vous voulez ajouter des tests, je peux proposer une configuration (Vitest + Testing Library) et des exemples de tests pour quelques composants.

---

## Contribuer

1. Ouvrez une issue pour discuter de changements majeurs.
2. Créez une branche de fonctionnalité : `git checkout -b feat/ma-fonctionnalite`
3. Soumettez une PR avec une description claire et captures d'écran si nécessaire.
4. Respectez les guidlines dans le dossier `guidelines/` (si présent).

---

## Fichiers utiles / documentation interne

- ICONS_GUIDE.md — guide d'utilisation des icônes
- ATTRIBUTIONS.md — crédits et attributions
- `src/app/components/fontawesome-config.ts` — configuration Font Awesome
- `src/services/api.ts` — client API centralisé (vérifier et adapter pour les environnements)

---

## Points d'attention / suggestions d'amélioration

- Externaliser l'URL de l'API dans une variable d'environnement (ex. `VITE_API_BASE_URL`) pour éviter d'éditer le code pour chaque environnement.
- Documenter les endpoints API attendus (format des réponses, codes d'erreur) afin de faciliter l'intégration backend/CI.
- Ajouter des scripts de vérification (lint, format, tests) et CI pour garder la qualité.
- Ajouter un fichier LICENSE si le projet doit être utilisé publiquement (aucune licence trouvée dans le dépôt).

---

## Auteurs & contact

- Propriétaire du dépôt : ndombeelie (https://github.com/ndombeelie)
- Voir `ICONS_GUIDE.md` et `ATTRIBUTIONS.md` pour plus de contexte visuel et licences d'assets.

---

Si vous voulez, je peux :
- Commiter ce README.md formaté directement dans le dépôt (création / mise à jour) — dites-moi si vous voulez que je le fasse et sur quelle branche.
- Modifier `src/services/api.ts` pour lire `import.meta.env.VITE_API_BASE_URL` et fournir un fallback, puis créer une PR.
- Ajouter une section "Déploiement" plus détaillée spécifique à votre cible (Vercel / Netlify / Docker).
