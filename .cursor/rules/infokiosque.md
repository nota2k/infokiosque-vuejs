# Cursor Rules - Infokiosque Vue

## Contexte
- Stack : Vue 3 + Vite + Pinia + Vue Router.
- Préprocesseur : SCSS (`sass` installé).
- Lint/format : `npm run lint`, `npm run format`.
- Git : branches par fonctionnalité, commits en français, pas de secrets en dépôt.

## Structure projet
- `src/components/` : composants réutilisables.
- `src/views/` : pages (routes).
- `src/stores/` : stores Pinia.
- `src/styles/` : styles globaux (`_variables.scss`, `_fonts.scss`).
- `src/services/` : appels API (à créer si besoin).
- `public/` : ressources statiques (polices, etc.).

## Bonnes pratiques
- Utiliser `<script setup>` et Composition API par défaut.
- Importer SCSS global via `@use "@/styles/_variables.scss" as *`.
- Typage TypeScript pour props/émissions.
- Composants accessibles (clavier/ARIA).
- Pas de secret en dur : passer par `.env` (non versionné).

## Flux de travail Cursor
1. Créer TODO list (≥2 items) avant modifications.
2. Après édits : `read_lints`, lancer tests/lint si changes notables (`npm run lint`, `npm run test`).
3. Résumé final concis en français avec impacts + tests.

## Paperless API
- Variables requises : `VITE_PAPERLESS_API_URL`, `VITE_PAPERLESS_TOKEN`.
- Stockage : `.env` ignoré (à créer manuellement).
- Store : `usePaperlessStore` centralise appels (erreurs/chargement).

## Revue de code
- Focus régressions, accessibilité, sécurité (jetons, .env).
- Mentionner couverture de tests manquante si applicable.
- Ton factuel, en français, avec références précises (`src/...`).