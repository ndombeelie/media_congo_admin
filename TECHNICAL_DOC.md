# Media Congo — Documentation technique

But
- Fournir une vue technique pour les développeurs : architecture client, conventions, points d'intégration backend, et recommandations techniques.

Arborescence importante (top-level)
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
    App.tsx                       # routage / composant racine
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
      figma/
      ui/                          # composants UI réutilisables
  services/
    api.ts                         # client API centralisé
  styles/
    index.css
    tailwind.css
    theme.css
    fonts.css
```

Architecture front-end (commentaire)
- Single Page Application React buildée par Vite.
- `main.tsx` monte React et rend `App.tsx`.
- `App.tsx` orchestre routes/pages et utilise les composants dans `src/app/components/`.
- Les appels réseau passent par `src/services/api.ts` (abstraction centralisée qui gère headers, encodage FormData vs JSON, et erreurs basiques).

Détails de `src/services/api.ts`
- Base URL codée en dur :
  ```
  const API_BASE_URL = 'http://localhost:8080/api';
  ```
- Endpoints observés :
  - `${API_BASE_URL}/posts.php`    (GET pour lister, POST pour créer)
  - `${API_BASE_URL}/stats.php`    (GET with ?period=)
  - `${API_BASE_URL}/auth/login.php` (POST)
  - `${API_BASE_URL}/views.php`    (GET)
- Comportements notables :
  - Les fonctions ajoutent le header `Authorization: Bearer ${localStorage.getItem('token')}` si présent.
  - `createPost` détecte `FormData` et ajuste `Content-Type` (laisse browser définir la boundary pour FormData).
  - Les erreurs réseau sont loggées et la plupart des fonctions retournent une valeur par défaut (ex. [] ou null) sauf `createPost` et `login` qui rejettent/promptent l'erreur.

Recommandations techniques & améliorations
1. Externaliser API_BASE_URL
   - Utiliser `import.meta.env.VITE_API_BASE_URL` avec fallback. Exemple :
     ```ts
     const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';
     ```
   - Mettre à jour la doc et le pipeline de déploiement pour définir VITE_API_BASE_URL en production.

2. Contrats API (important)
   - Documenter pour chaque endpoint :
     - Méthode (GET/POST)
     - Schéma de la request (ex. champs de publication, types)
     - Schéma de la response (ex. liste d'objets post { id, title, content, author, created_at })
     - Codes d'erreur et format d'erreur (ex. { message: string, code?: number })
   - Exemple minimal pour `createPost` :
     - Accepté : FormData (fichier image) ou JSON { title, body, tags, social_links[] }
     - Réponse attendue : { success: true, post: { id, ... } } ou { success: false, message: '...' }

3. Gestion des erreurs
   - Unifier la stratégie : renvoyer un objet standard (ex. { ok: false, error: string }) ou rejeter l'exception pour que les UI affichent la notification.
   - Ajouter un wrapper `request()` pour factoriser fetch, retry (optionnel), timeout, parsing JSON et gestion des erreurs.

4. Sécurité
   - Ne jamais stocker des tokens sensibles sans expiration. Favoriser cookies HttpOnly pour tokens si possible (mais attention à CORS).
   - Valider côté serveur les entêtes Authorization et CORS.

5. Tests & CI
   - Ajouter tests unitaires pour fonctions utilitaires et mock fetch pour `apiService`.
   - Ajouter un pipeline CI (GitHub Actions) qui exécute lint, build, tests et éventuellement un build preview.

6. Logging & Monitoring
   - Centraliser erreurs côté front (ex. Sentry) pour tracer erreurs runtime.
   - Ajouter instrumentation minimale pour métriques (durée des requêtes, erreurs 5xx).

Exemples de code utiles

- Pattern de wrapper fetch (extrait)
```ts
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, init);
  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${errBody}`);
  }
  return res.json();
}
```

- Migration rapide pour API_BASE_URL (src/services/api.ts)
```ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';
```

Styling, thèmes et icônes
- Tailwind est utilisé : vérifiez `tailwind.css` et `postcss.config.mjs`.
- `src/app/components/fontawesome-config.ts` configure Font Awesome — suivre `ICONS_GUIDE.md` pour conventions d'usage.

Déploiement (checklist)
- Mettre la variable d'env `VITE_API_BASE_URL` dans l'environnement de build (Netlify/Vercel/CI).
- Configurer CORS côté backend pour autoriser l'origine du front en production.
- Vérifier que les assets (images, fonts) sont inclus dans /public ou bundlés.
- Ajouter un fichier LICENSE si le projet doit être redistribué publiquement.

Observations et points ouverts
- Pas de fichier LICENSE détecté : ajouter si nécessaire.
- Pas de tests automatisés détectés : prévoir un plan de tests.
- README déjà complet, mais il est utile d'ajouter un fichier TECHNICAL_DOC.md (ceux-ci) et un CONTRIBUTING.md plus formel.

Annexes — contacts & références
- Fichiers utiles :
  - `src/services/api.ts` — client API (vérifier et adapter avant prod)
  - `src/app/components/fontawesome-config.ts` — config icônes
  - `ICONS_GUIDE.md`, `ATTRIBUTIONS.md` — assets et licences
- Propriétaire : ndombeelie (https://github.com/ndombeelie)
