# Repository Guidelines

## Project Structure & Module Organization
- Core pages live in `park-babelsberg/`; `index.html` is the hub and detail pages sit beside it.
- Map partials reside under `park-babelsberg/modules/` (`unified-map-*.html`), while GeoJSON lives in `park-babelsberg/data/` with stable property schemas.
- Global styles belong in `park-babelsberg/assets/style.css`; stash imagery inside `park-babelsberg/images/` using descriptive WebP names.
- Leave the CMP stub untouched in `cmp/stub.js`; update `DEPLOYMENT.md` when adding new map templates.

## Build, Test, and Development Commands
- `python3 -m http.server 8000` (run from repo root) serves the site at `http://localhost:8000/park-babelsberg/index.html`.
- `./update-all-locations.sh` refreshes map data via the chained `update-*.sh` scripts; requires `curl` and `jq`.
- `python3 upgrade-to-v4.py` swaps map generations and emits `index-v3.html.backup` for rollback.

## Coding Style & Naming Conventions
- HTML uses two-space indentation, lowercase tags, double-quoted attributes, and kebab-case IDs for anchors.
- CSS classes follow hyphenated names; extend design tokens via `:root` custom properties instead of ad-hoc values.
- Copy is German-first, alt texts remain human-readable, and supplementary images include `loading="lazy"`.

## Testing Guidelines
- After data refreshes, validate counts with `jq '.features | length' park-babelsberg/data/<file>.geojson` and smoke-test filters in the browser.
- Recheck hero layout, sticky nav, CMP stub logging, and ad placeholders on mobile breakpoints.
- For structural changes, revalidate JSON-LD and confirm sitemap plus robots still reference every HTML file.

## Commit & Pull Request Guidelines
- Follow the short German commit style, optionally adding detail after a colon (e.g., `Aktualisiere ÖPNV-Daten: Live-Abfahrten V4`).
- Keep PRs focused, link relevant issues or tasks, and list manual checks (server run, data validation, screenshots for UI changes).
- Share before/after captures for visual updates and note any scripts invoked so reviewers can reproduce the state.

## Data & Map Maintenance
- Add new POI types by extending the matching `update-*.sh` script and the map legend before committing.
- Maintain GeoJSON in EPSG:4326, drop unused keys, and document new modules or data flows in `DEPLOYMENT.md`.
