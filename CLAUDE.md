# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for **Potsdam Parks** visitor info (Park Babelsberg, Neuer Garten, Park Glienicke). Bilingual DE/EN with interactive location finders, blog, and detailed park/attraction pages. Deployed on Vercel at `park.babelsberger.info`.

## Commands

```bash
# Local development (no build system)
python3 -m http.server 8000
# Then visit http://localhost:8000/park-babelsberg/index.html

# Tests (Playwright e2e, auto-starts local server)
npm install                    # First time only
npm test                       # All tests (chromium, firefox, webkit, mobile)
npm run test:links             # Link validation only
npm run test:performance       # Core Web Vitals only
npm run test:headed            # Watch tests in browser
npm run test:debug             # Interactive debugger

# Update location data from OpenStreetMap (requires curl + jq)
./update-all-locations.sh      # All categories
./update-wc-data.sh            # WC only
./update-gastronomie-data.sh   # Restaurants only
./update-parking-data.sh       # Parking only
./update-oepnv-data.sh         # Public transport only

# Deploy
vercel --prod
```

## Architecture

**Pure HTML5/CSS3/Vanilla JS** — no framework, no bundler, no build step.

### Hub-and-Spoke Page Structure

All content lives in `park-babelsberg/`. Vercel routes (`vercel.json`) map clean URLs like `/flatowturm/` to `park-babelsberg/flatowturm.html`.

- **Hub**: `index.html` — landing page with unified location finder, park overviews, blog teasers
- **Park pages**: `park-babelsberg.html`, `neuer-garten.html`, `park-glienicke.html`
- **Attraction pages**: ~20 pages (schloss-babelsberg, flatowturm, matrosenhaus, schloss-cecilienhof, marmorpalais, jagdschloss-glienicke, etc.)
- **Activity pages**: fotografie, yoga, laufen, geocaching, wasseraktivitaeten, etc.
- **Practical pages**: anreise-parken, oeffnungszeiten-tickets, uebernachten, gastronomie, heiraten-feiern
- **Blog**: `blog/` — 13 articles with own `blog.css` stylesheet
- **Legal**: impressum, datenschutz, parkordnung-vergleich

### Key JS Modules

- `assets/i18n.js` — i18n system with `data-i18n` attributes and JSON translations
- `assets/parks-renderer.js` — Component-driven rendering for park cards/attractions
- `assets/enthusiasts-renderer.js` — Renders photography spots, geocaches, routes from JSON data
- `assets/weather.js` — Weather widget
- `assets/cookie-consent.js` — GDPR-compliant consent management
- Dark mode logic is **inline in index.html** (not a separate file)

### Data Files (`park-babelsberg/data/`)

- **GeoJSON** (from OpenStreetMap): `wc.geojson`, `gastronomie.geojson`, `parking.geojson`, `oepnv.geojson`
- **JSON** (curated): `fotografie-spots.json`, `geocaches.json`, `routes.json`

### Unified Location Finder

Production module: `modules/unified-map-v4.html` (embedded in index.html). Uses Leaflet.js 1.9.4 + markercluster for 1500+ locations. Legacy finders in `modules/archive/` — **do not use**.

## Key Conventions

### CSS Design System (`assets/style.css`)

Uses a modern variable system (NOT the legacy `--bg`/`--ink`/`--grid` names):

```
Light:  --bg-primary, --bg-secondary, --text-primary, --text-secondary, --accent-primary
Dark:   [data-theme="dark"] overrides the same variables
Space:  --space-1 (8px) through --space-10 (80px)
Radius: --radius-xs through --radius-full
Shadow: --shadow-xs through --shadow-xl
```

Note: `index.html` has a `<style>` block with **legacy variables** (`--grid`, `--bg`, `--ink`, `--accent`) for backward compatibility with older components. New code should use the `--bg-primary`/`--text-primary`/`--space-*` system.

### Bilingual Content (DE/EN)

- HTML elements use `data-i18n="dotted.key"` attributes
- Translations in `assets/translations/de.json` and `en.json` (must stay in sync)
- Default language: German. Fallback: German
- `window.i18n.setLanguage('en')` / `window.i18n.t('key')` API
- Meta tags (`<title>`, description) update dynamically on language switch

### Adding New Pages

1. Copy an existing page as template (spot page → copy `flatowturm.html`)
2. Update meta tags, Schema.org JSON-LD, content
3. Add route in `vercel.json`
4. Add translations to both `de.json` and `en.json`
5. Update `sitemap.xml` with `<lastmod>` date
6. Link from parent page

### Date Synchronization

When content changes, update dates in ALL locations:
- `<main data-date="YYYY-MM-DD">`
- "Stand: [date]" in content
- `<lastmod>` in `sitemap.xml`

### SEO

- Schema.org JSON-LD on every page (`Place`, `ItemList` types)
- GA4: `G-K409QD2YSJ` / AdSense: `pub-1712273263687132`
- Analytics load only after cookie consent

### Images

- Hero: 1600x900 WebP (16:9), preloaded
- Attractions: 1200x900 WebP (4:3), lazy-loaded
- DSGVO-compliant: system fonts only, no Google Fonts

## Testing

Playwright config: `playwright.config.ts`. Tests run against `http://localhost:8000` (auto-started). Projects: Chromium, Firefox, WebKit, Mobile Chrome (Pixel 5), Mobile Safari (iPhone 12). Only `links.spec.ts` and `performance.spec.ts` exist — other test scripts in package.json reference specs not yet created.

## Project Documentation

Historical planning/implementation docs in root: `spec.md`, `plan.md`, `tasks.md`, `requirements.md`, `execute-log.md`. Consult when making architectural changes. Feature-specific docs: `I18N-QUICK-START.md`, `DARK-MODE-COMPLETE.md`, `LOCATION-FINDER-V2-DOCUMENTATION.md`, `DEPLOYMENT.md`.
