# 🌟 Mind Space

**Mind Space** est une application de prise de notes personnelle, progressive (PWA), entièrement côté client — aucun serveur, aucun compte, aucune donnée quittant ton appareil.

> Design glassmorphisme · Navigation pill orange · Bento grid · Fonctionne hors-ligne

---

## ✨ Fonctionnalités

- 📝 **Notes écrites** — titre + contenu, avec aperçu dans la grille
- 🖼️ **Notes image** — photo depuis la galerie ou l'appareil photo, affichage pleine largeur
- 🎙️ **Notes vocales** — enregistrement microphone, lecture intégrée, visualisation de forme d'onde
- 📌 **Épingler** — les notes épinglées remontent automatiquement en tête de liste
- 🔍 **Recherche** — filtre en temps réel sur le titre et le contenu
- 🏷️ **Chips de filtre** — Tout · Épinglées · Images · Vocales
- 🌗 **Thème** — Système / Clair / Sombre, mémorisé entre les sessions
- 📤 **Export JSON** — sauvegarde complète de toutes les notes
- 📥 **Import JSON** — restauration depuis une sauvegarde
- 📲 **PWA installable** — fonctionne hors-ligne grâce au Service Worker, installable sur Android et iOS
- 📳 **Vibrations Pixel-style** — retour haptique sur chaque interaction (tap, confirm, warning)
- 🗑️ **Menu contextuel** — appui long sur une carte → Ouvrir / Épingler / Dupliquer / Supprimer

---

## 📸 Aperçu

| Accueil vide | Notes & bento grid | Speed dial ouvert |
|:---:|:---:|:---:|
| *(capture)* | *(capture)* | *(capture)* |

---

## 🚀 Déploiement

### Option 1 — Netlify Drop *(le plus simple)*

1. Télécharge et dézippe `mindspace_pwa.zip`
2. Va sur [app.netlify.com/drop](https://app.netlify.com/drop)
3. Glisse-dépose le dossier `mindspace/`
4. Ton app est en ligne en HTTPS en 30 secondes ✅

### Option 2 — GitHub Pages

```bash
# Clone ou crée ton repo
git init && git add . && git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TON_PSEUDO/mind-space.git
git push -u origin main
```

Puis dans **Settings → Pages** → Source : `main` / `/ (root)` → Save.

### Option 3 — Test local

```bash
npx serve ./mindspace
# ou
python3 -m http.server 8080 --directory mindspace
```

> ⚠️ Le Service Worker nécessite HTTPS (ou `localhost`) pour s'enregistrer.

---

## 📁 Structure du projet

```
mindspace/
├── index.html        # App complète (HTML + CSS + JS en un seul fichier)
├── manifest.json     # Manifeste PWA (nom, icônes, couleurs, orientation)
├── sw.js             # Service Worker — cache hors-ligne
├── icon-512.png      # Icône PWA 512×512
├── icon-192.png      # Icône PWA 192×192
├── icon-180.png      # Icône Apple Touch
└── icon-64.png       # Favicon
```

---

## 🛠️ Stack technique

| Couche | Technologie |
|--------|-------------|
| UI | HTML5 + CSS3 (variables, backdrop-filter, grid) |
| Logique | JavaScript vanilla ES6 (IIFE, pas de framework) |
| Persistance | `localStorage` (clé `essential_space_v2`) |
| Offline | Service Worker + Cache API |
| Fonts | Google Fonts — Google Sans + Google Sans Display |
| Icônes | Material Icons Round |
| Installation | Web App Manifest (PWA) |

---

## 🎨 Design system

- **Couleur d'accent** : `#F5A623` (orange chaud)
- **Item actif navbar** : `#3D1F00` (brun profond)
- **Fond clair** : `#EEEEF8` · **Fond sombre** : `#0D0E18`
- **Cartes** : glassmorphisme — `backdrop-filter: blur(20px)` + bordures semi-transparentes
- **Grille** : bento CSS Grid, 2 colonnes → 3 (≥600px) → 4 (≥900px)
- **Navigation** : pill flottante orange avec item actif allongé + label

---

## 🔒 Vie privée

Toutes les données (notes, images en base64, enregistrements audio) sont stockées **uniquement dans le `localStorage` du navigateur**. Aucune donnée n'est envoyée à un serveur. L'application fonctionne entièrement hors-ligne après la première visite.

---

## 📄 Licence

MIT — libre d'utilisation, modification et distribution.

---

<p align="center">Fait avec ☕ et beaucoup de <code>backdrop-filter</code></p>
