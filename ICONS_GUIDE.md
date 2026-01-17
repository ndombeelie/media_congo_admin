# Guide d'Utilisation des Icônes Font Awesome

## Introduction
Ce projet utilise **Font Awesome 7** pour toutes les icônes. Les icônes sont configurées globalement et prêtes à l'emploi.

## Installation
Les packages suivants sont déjà installés :
- `@fortawesome/fontawesome-svg-core`
- `@fortawesome/free-solid-svg-icons`
- `@fortawesome/react-fontawesome`

## Configuration Globale
La configuration globale se trouve dans `/src/app/components/fontawesome-config.ts`. Toutes les icônes utilisées dans l'application y sont importées et ajoutées à la bibliothèque.

## Utilisation dans les Composants

### Import Basique
```tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

function MyComponent() {
  return <FontAwesomeIcon icon={faHeart} />;
}
```

### Avec Classes CSS
```tsx
<FontAwesomeIcon icon={faUser} className="text-blue-500 text-xl mr-2" />
```

### Dans les Boutons
```tsx
<Button>
  <FontAwesomeIcon icon={faSave} className="mr-2" />
  Enregistrer
</Button>
```

## Icônes Disponibles dans le Projet

### Navigation
- `faChartLine` - Dashboard
- `faFileAlt` - Publications
- `faEye` - Vues
- `faFileDownload` - Rapports
- `faCog` - Paramètres

### Statistiques
- `faChartBar` - Graphiques
- `faPercentage` - Pourcentage
- `faServer` - Serveur/IP
- `faClock` - Temps/Durée

### Actions
- `faSave` - Sauvegarder
- `faEdit` - Éditer
- `faTrash` - Supprimer
- `faPlus` - Ajouter
- `faMinus` - Réduire
- `faCheck` - Valider
- `faTimes` - Fermer/Annuler

### Utilisateur
- `faUser` - Profil utilisateur
- `faUserPlus` - Ajouter utilisateur
- `faUserShield` - Administrateur
- `faLock` - Sécurité/Mot de passe
- `faSignOutAlt` - Déconnexion

### Médias
- `faImage` - Images
- `faFilePdf` - PDF
- `faFileCsv` - CSV
- `faDownload` - Télécharger
- `faUpload` - Upload

### Réseaux Sociaux
- `faLink` - Liens
- `faShare` - Partager
- `faHeart` - J'aime
- `faComment` - Commentaire
- `faThumbsUp` - Like

### Interface
- `faSearch` - Recherche
- `faFilter` - Filtrer
- `faBars` - Menu
- `faHome` - Accueil
- `faCalendar` - Calendrier
- `faEnvelope` - Email
- `faPhone` - Téléphone

### Navigation/Flèches
- `faArrowLeft` / `faArrowRight` - Flèches
- `faChevronLeft` / `faChevronRight` - Chevrons horizontaux
- `faChevronDown` / `faChevronUp` - Chevrons verticaux

### Divers
- `faExclamationTriangle` - Avertissement
- `faTrophy` - Succès/Top
- `faHistory` - Historique
- `faRotateLeft` - Réinitialiser
- `faPaperPlane` - Envoyer
- `faAd` - Publicité

## Personnalisation

### Taille
Utilisez les classes Tailwind CSS :
```tsx
<FontAwesomeIcon icon={faHeart} className="text-xl" />   // 1.25rem
<FontAwesomeIcon icon={faHeart} className="text-2xl" />  // 1.5rem
<FontAwesomeIcon icon={faHeart} className="text-3xl" />  // 1.875rem
```

### Couleur
```tsx
<FontAwesomeIcon icon={faHeart} className="text-red-500" />
<FontAwesomeIcon icon={faCheck} className="text-green-600" />
<FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500" />
```

### Rotation et Animation
```tsx
// Rotation
<FontAwesomeIcon icon={faCog} className="animate-spin" />

// Avec Tailwind
<FontAwesomeIcon icon={faHeart} className="hover:scale-110 transition-transform" />
```

## Composant StatCard
Un composant personnalisé a été créé pour afficher des statistiques avec icônes :

```tsx
import StatCard from './StatCard';
import { faEye } from '@fortawesome/free-solid-svg-icons';

<StatCard
  title="Total Vues"
  value={1234}
  description="Cette semaine"
  icon={faEye}
  iconColor="text-blue-500"
/>
```

## Ajouter de Nouvelles Icônes

1. Importer l'icône depuis `@fortawesome/free-solid-svg-icons`
2. L'ajouter à la bibliothèque dans `fontawesome-config.ts`

```tsx
// Dans fontawesome-config.ts
import { faNewIcon } from '@fortawesome/free-solid-svg-icons';

library.add(
  // ... autres icônes
  faNewIcon
);

// Dans votre composant
import { faNewIcon } from '@fortawesome/free-solid-svg-icons';
<FontAwesomeIcon icon={faNewIcon} />
```

## Ressources
- [Documentation Font Awesome](https://fontawesome.com/docs)
- [Recherche d'icônes](https://fontawesome.com/icons)
- [Font Awesome React](https://fontawesome.com/docs/web/use-with/react)

## Notes
- Toutes les icônes utilisées proviennent de `free-solid-svg-icons`
- Pour des icônes Pro ou d'autres styles (regular, brands), installer les packages correspondants
- Les icônes sont optimisées pour le tree-shaking (seules les icônes utilisées sont incluses dans le bundle)
