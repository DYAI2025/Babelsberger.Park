# Repository Guidelines

## Project Structure & Module Organization
- Core site lives in `park-babelsberg/`: `index.html` handles the pillar page, detail views sit alongside it, and `modules/unified-map-*.html` store map partials.
- Global styling stays in `park-babelsberg/assets/style.css`; reuse CSS custom properties instead of adding ad-hoc colors or spacing.
- GeoJSON sources (`data/*.geojson`) drive the location finder—keep schemas stable because `properties` keys feed the modules.
- Media assets belong under `park-babelsberg/images/…`; prefer WebP names that describe the subject. Keep the CMP stub in `cmp/stub.js` untouched and lightweight.

## Build, Test & Development Commands
- Serve locally with `python3 -m http.server 8000` from the repo root, then open `http://localhost:8000/park-babelsberg/index.html`.
- Refresh map data via `./update-all-locations.sh`; it chains the individual `update-*.sh` helpers and needs `curl` plus `jq`.
- Switch map generations with `python3 upgrade-to-v4.py` (creates `index-v3.html.backup`) and re-test in the browser.

## Coding Style & Naming Conventions
- HTML uses two-space indentation, lowercase tags, and double-quoted attributes; anchor sections with kebab-case IDs for the jump navigation.
- CSS classes follow hyphenated names and grouped rules; extend the design system by reusing or adding `:root` tokens instead of hard-coding values.
- Copy is German-first; keep alt texts human-readable and add `loading="lazy"` to supplementary imagery.

## Testing Guidelines
- After data updates, validate feature counts with `jq '.features | length' park-babelsberg/data/<file>.geojson` and smoke-test map filters.
- Exercise critical flows on mobile breakpoints (hero layout, sticky nav, ad placeholders, CMP stub log). For structural edits, revalidate JSON-LD and confirm sitemap/robots still list every HTML file.

## Commit & Pull Request Guidelines
- Follow the existing Git history: short German summaries with optional detail after a colon (e.g. `Aktualisiere ÖPNV-Daten: Live-Abfahrten V4`).
- Scope PRs narrowly, link issues or tasks, and list manual checks (server run, data validation, screenshots for visual tweaks).
- Include before/after captures for UI changes and mention any scripts executed so reviewers can reproduce the state.

## Data & Map Maintenance
- Add new POI types by extending the relevant `update-*.sh` script and the map legend before committing the data.
- Keep GeoJSON coordinates in EPSG:4326, strip unused keys, and place new map templates in `modules/` with follow-up notes in `DEPLOYMENT.md`.
