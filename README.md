## Nunjucks Templates, SCSS, JSON Hydration & Live Reload - Project Starter

A lightweight, zero‑framework static site starter that combines:

- **Nunjucks** for templating (layouts, partials, data hydration)  
- **SCSS** with partials and minification  
- **JSON**‑based content per page & global data  
- **Live‑reload** dev server with watch mode  
- **Static assets** support (images, SVGs, JS)

---

### 🚀 Features

- **Precompiled Nunjucks**  
  - Layout inheritance (`{% extends %}`)  
  - Partials (`{% include %}`)  
  - Data hydration from `src/data/*.json`  
  - Global and page‑specific JSON merges  
  - No template caching in dev mode  

- **SCSS Workflow**  
  - Modular SCSS partials in `src/scss/`  
  - Compile + minify to `dist/assets/css/style.css`  
  - Namespace support (`@use`)  

- **Live‑Reload Dev Server**  
  - `npm run dev` → builds, watches, serves `dist/`  
  - WebSocket reload script injected only in dev  
  - Instant browser refresh on source changes  

- **Static Assets**  
  - Images, SVGs, fonts, JS copied from `src/assets/` → `dist/assets/`  
  - CSS output excluded from watch to prevent infinite loops  

---

### 📂 Project Structure

```
├── src/
│   ├── layouts/
│   │   └── base.njk           # Root layout with dev live‑reload snippet
│   ├── partials/
│   │   ├── navbar.njk
│   │   └── footer.njk
│   ├── pages/
│   │   ├── index.njk
│   │   └── contact/contact.njk  # Nested page example
│   ├── data/
│   │   ├── index.json         # Page data for index.njk
│   ├── scss/
│   │   ├── _variables.scss
│   │   └── main.scss
│   └── assets/
│       ├── css/               # (generated)
│       ├── js/
│       └── images/
├── dist/                      # Built site (HTML, CSS, assets)
├── build.js                   # Build + watch + serve logic
└── package.json
```

---

### ⚙️ Installation

1. **Clone** the repo:
   ```bash
   git clone https://github.com/your‑username/nunjucks‑starter.git
   cd nunjucks‑starter
   ```

2. **Install** dependencies:
   ```bash
   npm install
   ```

---

### 🛠️ Usage

- **Build once** (production mode):
  ```bash
  npm run build
  ```
  - Compiles SCSS → minified CSS  
  - Renders Nunjucks → minified HTML in `dist/`  
  - Copies static assets

- **Dev mode** (watch + live‑reload):
  ```bash
  npm run dev
  ```
  - Runs initial build  
  - Starts HTTP server at `http://localhost:3000`  
  - Watches `src/` (excluding compiled CSS)  
  - Injects WebSocket reload script in dev  
  - Auto‑refreshes browser on changes

---

### 🔧 Customization

- **Add pages**: Drop `.njk` in `src/pages/`, create matching `src/data/<name>.json`.  
- **Global data**: Edit `src/data/site.json` for site‑wide variables (e.g. nav links).  
- **SCSS**: Create new partials in `src/scss/`, import them in `main.scss`.  
- **Layouts & Partials**: Use Nunjucks’ `{% extends %}` and `{% include %}`.

