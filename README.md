# Mohamed Reda Boxing Academy: site multipage

Site statique bilingue (EN / AR avec RTL), sans outil de build à installer.

## Structure

| Page | Contenu |
|---|---|
| `index.html` | Accueil : hero, présentation courte, programmes, trouver son club, appel à l'action |
| `about.html` | L'Académie : histoire, fondateur, coachs, palmarès |
| `programs.html` | Programmes + "comment commencer" |
| `schedule.html` | Planning type + formules d'abonnement |
| `gallery.html` | Galerie, témoignages, actualités |
| `branches.html` | Les 8 clubs (adresses, téléphones, itinéraire, WhatsApp) |
| `contact.html` | Formulaire : ouvre WhatsApp pré-rempli vers le club choisi |
| `assets/` | `style.css`, `main.js`, `data.js` (données des clubs), logo et icônes |

## Modifier le contenu

- **Clubs (adresses, téléphones)** : un seul endroit, `assets/data.js`. Les cartes des pages Accueil, Clubs et le formulaire se mettent à jour seuls.
- **Textes** : chaque texte existe en deux versions, `lang-en` et `lang-ar`. Modifier les deux.
- **Couleurs / polices** : variables en haut de `assets/style.css` (`--ink`, `--red`).
- Les zones marquées "placeholder" (planning, tarifs, horaires, photos, témoignages, actualités) sont à remplacer par les vraies informations.

## Mise en ligne sur GitHub Pages

1. Dans le dépôt, "Add file" puis "Upload files".
2. Glisser **le contenu** de ce dossier (les 7 fichiers `.html` et le dossier `assets`) à la racine du dépôt. Remplacer l'ancien `index.html`.
3. "Commit changes". Le site se met à jour en une à deux minutes.

Tous les liens sont relatifs : le site fonctionne aussi dans un sous-dossier (`/boxing-academy/`).
