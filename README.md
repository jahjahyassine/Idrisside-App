# ⚜ Les Idrissides — Parcours Historique Interactif

> **An interactive map tracing the founding of Morocco's first Islamic dynasty — entirely vibe coded with Claude AI.**

---

## 🗺️ About the Project

This is a single-file interactive web application (HTML + CSS + JavaScript) that tells the story of **Idris I** and **Idris II**, the founders of the Idrissid dynasty and the first Islamic state in Morocco (786–828 CE).

Built entirely in French for students and history enthusiasts, the app lets you explore 15 key historical events on an interactive map — from Idris I's flight after the Battle of Fakhkh, all the way to the founding of Fez and the eventual fragmentation of the dynasty.

**No frameworks. No build tools. Just open the HTML file and go.**

---

## ✨ Features

- **Interactive map** powered by [Leaflet.js](https://leafletjs.com/) with custom color-coded markers for each event type (flight, founding, expansion, death, culture...)
- **Clickable popups** on each marker with the place name, year, and a 4–5 line historical description
- **Animated journey mode** — step through all 15 events automatically, with the map flying to each location every 2.8 seconds
- **Timeline sidebar** listing all events chronologically, clickable to jump to any location
- **Filters** by historical figure (Idris I / Idris II) and by date range (786–828)
- **Prev / Next navigation** inside the detail popup panel
- **Responsive design** — works on desktop and mobile
- Styled with a warm beige & navy palette using **Playfair Display** and **Crimson Text** fonts

---

## 🚀 How to Run

**Zero setup required.** Just download `idrissides-historique.html` and open it in any modern browser:

```bash
# Option 1 — double-click the file in your file manager

# Option 2 — open from terminal
open idrissides-historique.html       # macOS
xdg-open idrissides-historique.html  # Linux
start idrissides-historique.html      # Windows
```

The app loads Leaflet from a CDN, so an internet connection is needed on first load for the map tiles and fonts.

---

## 📁 Files

| File | Description |
|------|-------------|
| `idrissides-historique.html` | **The app** — open this in your browser |
| `idrisside-app.jsx` | React + React-Leaflet version (requires Node.js setup) |
| `README.md` | This file |

### Running the React version

```bash
npm create vite@latest idrissides-app -- --template react
cd idrissides-app
npm install leaflet react-leaflet

# Add to index.html <head>:
# <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

# Replace src/App.jsx with idrisside-app.jsx content, then:
npm run dev
# → http://localhost:5173
```

---

## 🏛️ Historical Content

The app covers 15 events across the Idrissid dynasty (786–828 CE):

| Year | Event | Figure |
|------|-------|--------|
| 786 | Battle of Fakhkh — Idris flees the Abbasids | Idris I |
| 787 | Crossing Egypt and Tripolitania | Idris I |
| 788 | Arrival at Volubilis, welcomed by the Awraba tribe | Idris I |
| 788 | **Foundation of the Idrissid State** | Idris I |
| 791 | Assassination of Idris I by Abbasid agents | Idris I |
| 793 | Idris II recognized as imam at age 11 | Idris II |
| 808 | **Founding of Fez** (Andalusian quarter) | Idris II |
| 810 | Control of Tangier | Idris II |
| 812 | Expansion to Sijilmassa (trans-Saharan routes) | Idris II |
| 818 | Arrival of Kairouanese families in Fez | Idris II |
| 820 | Fez becomes the cultural capital | Idris II |
| 828 | Death of Idris II — the state fragments | Idris II |

---

## 🤖 Vibe Coded

This project was **100% vibe coded** — conceived, designed, and written entirely through a conversation with [Claude](https://claude.ai) (Anthropic's AI assistant), with no manual coding by the author.

The prompts described the desired features in plain language (interactive map, animated journey, timeline filters, historical content in French), and Claude generated all the HTML, CSS, JavaScript, historical text, and this README in one session.

> *"Vibe coding"* refers to the practice of building software by describing what you want to an AI in natural language, iterating through conversation, and shipping the result — without writing code yourself.

If it works, the vibes were right. 🤙

---

## 🛠️ Tech Stack

| Technology | Role |
|------------|------|
| HTML / CSS / JavaScript | Core app (no framework in HTML version) |
| [Leaflet.js 1.9.4](https://leafletjs.com/) | Interactive map |
| [CARTO Light](https://carto.com/basemaps/) | Map tile layer |
| [Google Fonts](https://fonts.google.com/) | Playfair Display + Crimson Text |
| React + React-Leaflet | Alternative JSX version |

---

## 📜 License

Free to use, share, and adapt for educational purposes.  
Historical content is sourced from general knowledge about the Idrissid dynasty.

---

*Built with ✨ and prompts. No keyboards were harmed in the making of this app.*