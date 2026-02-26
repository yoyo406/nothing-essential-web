🌟 Mind Space (DISCLAIMER: THIS IS A BETA VERSION OF MY WEBSITE/APP SO IF THERE IS A BUG PLEASE REPORT IT!!)

Mind Space is a personal note-taking Progressive Web App (PWA), fully client-side — no server, no account, no data leaving your device.

> Glassmorphism design · Orange pill navigation · Bento grid · Works offline




---

✨ Features

📝 Written notes — title + content, with preview in the grid

🖼️ Image notes — photo from the gallery or camera, full-width display

🎙️ Voice notes — microphone recording, built-in playback, waveform visualization

📌 Pin — pinned notes automatically move to the top of the list

🔍 Search — real-time filtering by title and content

🏷️ Filter chips — All · Pinned · Images · Voice

🌗 Theme — System / Light / Dark, saved between sessions

📤 JSON Export — full backup of all notes

📥 JSON Import — restore from a backup

📲 Installable PWA — works offline thanks to the Service Worker, installable on Android and iOS

📳 Pixel-style vibrations — haptic feedback on every interaction (tap, confirm, warning)

🗑️ Context menu — long press on a card → Open / Pin / Duplicate / Delete



---

📸 Preview

Empty Home	Notes & Bento Grid	Speed Dial Open

(screenshot)	(screenshot)	(screenshot)



---

🚀 Deployment

Option 1 — Netlify Drop (the easiest)

1. Download and unzip mindspace_pwa.zip


2. Go to https://app.netlify.com/drop


3. Drag and drop the mindspace/ folder


4. Your app is live in HTTPS in 30 seconds ✅



Option 2 — GitHub Pages

# Clone or create your repo
git init && git add . && git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mind-space.git
git push -u origin main

Then go to Settings → Pages → Source: main / / (root) → Save.

Option 3 — Local test

npx serve ./mindspace
# or
python3 -m http.server 8080 --directory mindspace

> ⚠️ The Service Worker requires HTTPS (or localhost) to register.




---

📁 Project Structure

mindspace/
├── index.html        # Full app (HTML + CSS + JS in a single file)
├── manifest.json     # PWA manifest (name, icons, colors, orientation)
├── sw.js             # Service Worker — offline cache
├── icon-512.png      # PWA icon 512×512
├── icon-192.png      # PWA icon 192×192
├── icon-180.png      # Apple Touch icon
└── icon-64.png       # Favicon


---

🛠️ Tech Stack

Layer	Technology

UI	HTML5 + CSS3 (variables, backdrop-filter, grid)
Logic	Vanilla JavaScript ES6 (IIFE, no framework)
Persistence	localStorage (key essential_space_v2)
Offline	Service Worker + Cache API
Fonts	Google Fonts — Google Sans + Google Sans Display
Icons	Material Icons Round
Installation	Web App Manifest (PWA)



---

🎨 Design System

Accent color: #F5A623 (warm orange)

Active navbar item: #3D1F00 (deep brown)

Light background: #EEEEF8 · Dark background: #0D0E18

Cards: glassmorphism — backdrop-filter: blur(20px) + semi-transparent borders

Grid: CSS Grid bento layout, 2 columns → 3 (≥600px) → 4 (≥900px)

Navigation: floating orange pill with elongated active item + label



---

🔒 Privacy

All data (notes, base64 images, audio recordings) is stored only in the browser’s localStorage. No data is sent to any server. The application works fully offline after the first visit.


---

📄 License

MIT — free to use, modify, and distribute.


---

<p align="center">Made with ☕ and a lot of <code>backdrop-filter</code></p>
---
