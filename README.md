# GnosticOS 👁️⚡
### *The Living Grimoire & Nightside Operating System*

[![Stack](https://img.shields.io/badge/Stack-Tauri_v2_%7C_Rust_%7C_React_19_%7C_TypeScript-blueviolet)](https://github.com/CardoneZ/GnosticOS)
[![Styling](https://img.shields.io/badge/CSS-Tailwind_CSS_v4-06b6d4)](https://tailwindcss.com/)
[![Graphics](https://img.shields.io/badge/Graphics-Three.js_%2F_GLSL_Shaders-black)](https://threejs.org/)
[![Audio](https://img.shields.io/badge/Audio-Web_Audio_Binaural_Engine-red)](https://webaudio.github.io/web-audio-api/)
[![Security](https://img.shields.io/badge/Security-Zero--Knowledge_SQLCipher_%2B_Argon2id-emerald)](https://www.zetetic.net/sqlcipher/)

---

## 🌌 Overview

**GnosticOS** is an esoteric sanctum application designed for practitioners of left-hand path philosophy, chaos magick, demonolatry, and hermetic qabalah. Engineered as a high-performance desktop application using **Tauri v2** and **React 19**, it fuses ceremonial magick systems with modern software architecture, real-time mathematical shaders, dynamic psychoacoustic drones, and zero-knowledge local cryptography.

---

## 🏛️ Core Sanctum Systems

### 1. 🕳️ The Gazing Portal (`/portal`)
* **Real-Time GLSL Shaders**: Full-bleed scrying mirror rendering mathematical textures (Ouroboros, Algol Star, Adversary Circle, Sentinels, Black Mirror).
* **Psychoacoustic Sonic Engine**: Real-time Web Audio graph synthesizing carrier tones, customizable binaural beats (Theta/Delta trance induction), planetary frequencies, and demonic enn loops.
* **Cadenced Breathwork Guide**: Visual rhythmic pacing (`sampleBreath`) for Death Posture and gnosis attainment.
* **Immersive Trance Mode**: Fullscreen scrying HUD with quick dictation and sensory isolation.

### 2. 🌳 The Dual Tree (`/tree`)
* **Sephiroth & Qliphoth Navigation**: Seamless transition between the Day Tree (Lightside Sephiroth) and the Nightside Tree of Death (Sitrans/Qliphoth).
* **The 22 Tunnels of Set**: Interactive tunnel drawer featuring Sentinel spirits, Atu Tarot attributions, gematria values, and one-click portal frequency tuning.
* **Daath Abyss Pylon**: Visualized crossing point bridging Malkuth to Kether and Thaumiel.

### 3. 📜 Tablet Forge & V.B.R.K. Vault (`/tablets`)
* **Gematria Calculators**: Multi-system reductions (Hebrew, Greek, English, Luciferian, V.B.R.K.).
* **Kamea & Tablet Grids**: 9×9 planetary and spirit tables with animated SVG sigil tracing across numerical matrix lines.
* **Sigil Vector Export**: Clean SVG and PNG export pipelines.

### 4. 🪬 Chaos Magic & Sigil Engine (`/chaos`)
* **Spare Sigilization Engine**: Automated intent distillation (vowel removal, duplicate consonant stripping, and algorithmic geometric path generation).
* **Servitor Lifecycle Registry**: Track servitor entities, feeding schedules with recurring reminders, energy reserves, and programmed dissolution countdowns.

### 5. ⚔️ The Power Crucible (`/crucible`)
* **11 Points of Power**: Implementation of Michael W. Ford's Luciferean philosophy.
* **Ritual Habit Cycles**: 21–30 day mastery tracking, streak heatmaps, and discipline metrics.

### 6. 📖 Alchemical Journal (`/journal`)
* **Ephemeris Astrological Capture**: Live calculation of moon phase percentage, planetary hours, and zodiacal placements pinned automatically to each entry.
* **Somatic & Trance Tracking**: Pre- and post-ritual resonance dials, offering records, and spirit communion logs.
* **Encrypted Storage**: Persistent zero-knowledge storage.

### 7. 👹 Grimoire Library (`/grimoire`)
* **Comprehensive Spirits Database**: Complete 72 Goetic entities, Dukanté demonic families, and Nightside Sentinels.
* **Direct Audio/Visual Tuning**: One-click resonance lock — tune the Gazing Portal and sonic engine directly to the spirit's elemental key and frequency.

### 8. 📊 Sanctum Analytics (`/insights`)
* On-device analytics correlating moon phases, planetary hours, and entity invocations with ritual gnosis scores.

### 9. ⚡ Sanctum Command Palette (`Ctrl + K`)
* Global modal launcher across the entire OS.
* Instant navigation, spirit search, tunnel tuning, and **Emergency Grounding** audio cutoff.

---

## 🛡️ Security Architecture

* **Zero-Knowledge Vault**: Passphrase-derived master encryption via **Argon2id**.
* **Storage**: Local encrypted SQLite/SQLCipher (`rusqlite` bundled) database on desktop with fallback browser encryption.
* **Data Sovereignty**: Completely local, telemetry-free, offline-first.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Desktop Shell** | [Tauri v2](https://v2.tauri.app/) (Rust 2021) |
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 6](https://vite.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **3D & Shaders** | [Three.js](https://threejs.org/) & React Three Fiber |
| **Audio** | Native Web Audio API Synthesizer Graph |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database** | SQLite / SQLCipher (AES-256) |

---

## 🚀 Quick Start & Installation

### Prerequisites
1. **Node.js**: `v20.x` or later.
2. **Rust & Cargo**: Latest stable (via [rustup.rs](https://rustup.rs/)).
3. **C++ Build Tools**: Visual Studio Build Tools with C++ (on Windows) or `build-essential` (on Linux).

### 1. Clone the Repository
```bash
git clone https://github.com/CardoneZ/GnosticOS.git
cd GnosticOS
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Run in Development Mode

**Web Browser Mode (Fast UI Iteration):**
```bash
npm run dev
```

**Full Desktop App (Tauri + Rust Backend):**
```bash
npm run tauri dev
```

### 4. Build for Production

**Frontend Bundle:**
```bash
npm run build
```

**Tauri Standalone Installer / Binary:**
```bash
npm run tauri build
```

---

## 📁 Repository Structure

```
GnosticOs/
├── db/                       # Schema definitions & database seeds
│   ├── schema.sql            # SQLite/SQLCipher schema
│   └── grimoireSeeds.ts      # Spirits & entity seeds
├── docs/                     # Architecture & design documentation
│   └── ARCHITECTURE.md       # High-level architecture and blueprint
├── src/                      # Frontend Application (React 19 + TypeScript)
│   ├── app/                  # Main entry and shell
│   ├── features/
│   │   ├── audio/            # Psychoacoustic drone synthesizer & enn player
│   │   ├── chaos/            # Sigil forge engine & servitor manager
│   │   ├── crucible/         # 11 Points of Power tracker & habit streaks
│   │   ├── ephemeris/        # Astrological & planetary hour calculations
│   │   ├── gazing/           # Scrying portal canvas & GLSL shaders
│   │   ├── grimoire/         # 72 Goetia, Dukanté & entity registry
│   │   ├── insights/         # Analytics & correlation dashboard
│   │   ├── journal/          # Alchemical journal & ritual logging
│   │   ├── navigation/       # Sidebar & Ctrl+K Command Palette
│   │   ├── portal/           # Sanctum Portal scrying workspace
│   │   ├── session/          # Immersive trance session HUD
│   │   ├── tablets/          # Gematria calculators & Kamea grid forge
│   │   └── tree/             # Dual Tree (Sephiroth & Qliphoth 22 Tunnels)
│   ├── platform/             # Tauri IPC & Web-mode adapters (Vault)
│   └── styles/               # Tailwind CSS v4 stylesheets
├── src-tauri/                # Rust Desktop Backend
│   ├── Cargo.toml            # Rust dependencies (tauri, rusqlite, argon2, etc.)
│   ├── tauri.conf.json       # Tauri v2 configuration
│   └── src/
│       ├── main.rs           # Tauri entry point
│       ├── lib.rs            # Application commands & setup
│       └── vault/            # Encrypted database management
└── package.json              # NPM dependencies and scripts
```

---

## 🔮 Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + K` / `Cmd + K` | Open Sanctum Command Palette |
| `Escape` | Dismiss Modals / Trance View |

---

## 📜 License & Acknowledgments

Crafted for esoteric practitioners, occult scholars, and nightside explorers.
Private and Zero-Knowledge by design.
