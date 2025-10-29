# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website deployment for **Park Babelsberg** visitor information in Potsdam, Germany. The site provides an overview, highlights, rules, and directions for park visitors in German.

## Architecture

### Directory Structure

```
/
├── park-babelsberg/          # Main content directory
│   ├── index.html            # Main landing page (German) with integrated finders
│   ├── assets/
│   │   └── style.css         # CSS variables & component styles
│   ├── data/                 # GeoJSON data files
│   │   ├── wc.geojson        # WC locations (23 features)
│   │   ├── gastronomie.geojson  # Restaurant/café locations (303 features)
│   │   └── parking.geojson   # Parking locations (1254 features)
│   ├── modules/              # Standalone HTML modules
│   │   ├── wc-map.html       # WC-Finder module
│   │   ├── gastronomie-map.html  # Gastronomie-Finder module
│   │   └── parking-map.html  # Parkplatz-Finder module
│   └── images/
│       └── park-babelsberg/
│           ├── hero.webp                    # Hero image (1600x900)
│           └── attractions/                 # Attraction images (1200x900)
│               ├── uferweg-nord.webp
│               ├── schloss-blick.webp
│               └── liegewiese.webp
├── cmp/
│   └── stub.js               # CMP (Consent Management Platform) stub
├── update-wc-data.sh         # WC data update script
├── update-gastronomie-data.sh  # Gastronomie data update script
├── update-parking-data.sh    # Parking data update script
├── update-all-locations.sh   # Master update script (runs all three)
├── ads.txt                   # Google AdSense authorization
├── robots.txt                # Search engine directives
├── sitemap.xml               # Site structure for search engines
├── spec.md                   # Feature specification (reference)
├── requirements.md           # Requirements checklist (reference)
├── plan.md                   # Implementation plan (reference)
├── tasks.md                  # Task tracking (reference)
├── execute-log.md            # Build/execution log (reference)
├── IMPLEMENTATION-PLAN.md    # Location finder implementation plan
├── WC-MAP-INTEGRATION.md     # WC-Finder documentation
├── GASTRONOMIE-MAP-INTEGRATION.md  # Gastronomie-Finder documentation
└── PARKING-MAP-INTEGRATION.md     # Parkplatz-Finder documentation
```

**Note**: Root-level HTML files (e.g., `uferweg-nord.html`) may be drafts or experiments - the canonical structure is inside `park-babelsberg/`.

### Technology Stack

- **Pure HTML5/CSS3** - No build system, framework, or bundler
- **Semantic HTML** with Schema.org JSON-LD structured data
- **WebP images** with lazy loading for performance
- **CSS custom properties** for theming (`--bg`, `--ink`, `--accent`, etc.)
- **Leaflet.js 1.9.4** - Interactive maps with OpenStreetMap tiles
- **GeoJSON** - Geographic data format for location finders
- **Google Analytics 4** (GA4) tracking
- **Google AdSense** with auto-ads

### Design System

The site uses a **component-based CSS design** defined in `assets/style.css`:

- **CSS Variables**: Colors, spacing grid (12px), border radius (16px)
- **Components**: `.hero`, `.badges`, `.cards`, `.kv` (key-value grid), `.section`
- **Responsive**: Grid layouts with `auto-fill` and mobile breakpoints at 720px
- **Sticky Navigation**: `.nav` with blur backdrop filter

### Image Standards

- **Hero images**: 1600x900px WebP, 16:9 aspect ratio
- **Attraction images**: 1200x900px WebP, 4:3 aspect ratio
- **Optimization**: All images are WebP format for performance
- **Loading**: Hero uses preload; attractions use lazy loading

### SEO & Analytics

- **Schema.org**: JSON-LD structured data for `Place` and `ItemList`
- **Open Graph**: Meta tags for social sharing (currently basic)
- **Analytics**: GA4 tracking ID `G-K409QD2YSJ`
- **AdSense**: Publisher ID `pub-1712273263687132`
- **Sitemap**: XML sitemap at `/sitemap.xml` with lastmod dates

## Location Finders

The site includes three interactive location finder modules integrated into the main page:

### WC-Finder

- **Module**: `park-babelsberg/modules/wc-map.html`
- **Data**: `park-babelsberg/data/wc.geojson` (23 WC locations)
- **Update Script**: `update-wc-data.sh`
- **BBox**: 52.380,13.060,52.405,13.120 (focused on park areas)
- **Features**: Interactive Leaflet map, geolocation, platform-aware navigation (walking mode)
- **Documentation**: See `WC-MAP-INTEGRATION.md`

### Gastronomie-Finder

- **Module**: `park-babelsberg/modules/gastronomie-map.html`
- **Data**: `park-babelsberg/data/gastronomie.geojson` (303 locations)
- **Update Script**: `update-gastronomie-data.sh`
- **BBox**: 52.380,13.050,52.420,13.100 (Park Babelsberg, Neuer Garten, Schloss Babelsberg area)
- **Categories**: Restaurant, Café, Imbiss, Bar, Pub, Eiscafé, Biergarten (6 color-coded categories)
- **Features**: Category-specific markers, walking navigation
- **Documentation**: See `GASTRONOMIE-MAP-INTEGRATION.md`

### Parkplatz-Finder

- **Module**: `park-babelsberg/modules/parking-map.html`
- **Data**: `park-babelsberg/data/parking.geojson` (1254 locations)
- **Update Script**: `update-parking-data.sh`
- **BBox**: 52.370,13.040,52.430,13.110 (wider area for parking coverage)
- **Categories**: Public free, Public paid, Private/customers, Multi-storey, Bicycle (5 categories)
- **Features**: Car parking prioritized, driving mode navigation, capacity info
- **Documentation**: See `PARKING-MAP-INTEGRATION.md`

### Updating Location Data

**Update all finders** (recommended):
```bash
./update-all-locations.sh
```

**Update individual finders**:
```bash
./update-wc-data.sh
./update-gastronomie-data.sh
./update-parking-data.sh
```

**Dependencies**: Requires `curl` and `jq` installed

**Data Source**: OpenStreetMap via Overpass API

**Update Frequency**: Monthly recommended, or before major content updates

### Technical Architecture

All three finder modules use identical technical architecture:

- **Leaflet.js 1.9.4**: Interactive map library
- **OpenStreetMap**: Tile provider (no API key required)
- **IIFE Pattern**: Scope isolation to prevent conflicts
- **Platform Detection**: iOS→Apple Maps app, Android→default maps app (geo: URI), Desktop→Google Maps (new tab)
- **Haversine Distance**: Great-circle distance calculation for "nearest" feature
- **Privacy-First**: Map loads without consent, geolocation requires explicit user action
- **CMP Stub**: `checkGeolocationConsent()` function for future CMP integration
- **Responsive Design**: Mobile-optimized with 768px breakpoint

### Navigation Modes

- **WC-Finder**: Walking mode (`dirflg=w`, `travelmode=walking`)
- **Gastronomie-Finder**: Walking mode
- **Parkplatz-Finder**: Driving mode (`dirflg=d`, `travelmode=driving`)

### Integration in index.html

All three finders are integrated into `park-babelsberg/index.html` with:
- Dedicated `<section>` elements with unique IDs
- Navigation badges in sticky nav: "WC-Finder", "Gastronomie", "Parkplätze"
- Unique DOM element IDs to prevent conflicts (`wc-map`, `gastro-map`, `parking-map`)

## Content Management

### Site Architecture Pattern

The site uses a **pillar page + detail spots** architecture:
- **Pillar page** (`park-babelsberg/index.html`): Overview with highlight cards and integrated location finders
- **Spot pages** (future): Detail pages for individual attractions/locations

Each highlight card in the pillar page can link to a dedicated spot page with:
- Detailed description, photos, rules, and tips specific to that location
- Breadcrumb navigation back to the pillar page
- Schema.org JSON-LD for the specific spot

### Adding New Park Pages

To add a new park (e.g., "Park Sanssouci"):

1. Create directory: `park-sanssouci/`
2. Copy structure from `park-babelsberg/` (index.html, assets/, images/)
3. Update `index.html`:
   - Change `<title>` and `<meta name="description">`
   - Update `data-page` attribute on `<main>`
   - Replace hero image path in inline style
   - Update section content, highlights, FAQ
   - Update Schema.org JSON-LD data
4. Add images to `park-sanssouci/images/park-sanssouci/`
5. Update `/sitemap.xml` with new URL and lastmod date

### Adding Spot Detail Pages

To create a detail page for an attraction (e.g., "Uferweg Nord"):

1. Create `park-babelsberg/spots/uferweg-nord.html`
2. Include breadcrumb navigation: `<nav class="breadcrumbs"><a href="../index.html">← Übersicht</a></nav>`
3. Add hero image, description, category/tags, local rules, and tips
4. Link from the highlight card in `park-babelsberg/index.html`
5. Add to sitemap with updated lastmod date

### Image Replacement

The HTML includes a notice that images are placeholders:
```html
<p class="notice">Bilder sind Platzhalter (WebP, 4:3/16:9).
Ersetze sie mit deinen Fotos unter <code>images/park-babelsberg/…</code>.</p>
```

To replace placeholder images:
1. Prepare WebP images at correct dimensions
2. Replace files in `images/park-babelsberg/` or `images/park-babelsberg/attractions/`
3. Ensure filenames match HTML `src` attributes
4. Remove or update the placeholder notice in HTML

## Deployment

This appears to be a **deployment snapshot** (date: 2025-10-24 in directory name).

### No Build System

- Deploy directly - no compilation, bundling, or build steps required
- All files are production-ready static assets
- Simply upload to web server or CDN

### Pre-deployment Checklist

- [ ] Update `sitemap.xml` with correct domain (currently `example.com`)
- [ ] Update `robots.txt` sitemap URL
- [ ] Replace placeholder images with actual photos
- [ ] Verify GA4 tracking ID if using different property
- [ ] Replace CMP stub (`cmp/stub.js`) with real consent management solution
- [ ] Test responsive layout on mobile devices
- [ ] Validate HTML and structured data (Schema.org validator)
- [ ] Update location data: Run `./update-all-locations.sh`
- [ ] Test all three location finders (WC, Gastronomie, Parking) on mobile and desktop
- [ ] Verify Leaflet maps load correctly and don't conflict with each other
- [ ] Test geolocation permission flow on HTTPS (required for production)
- [ ] Test platform-aware navigation on iOS, Android, and Desktop browsers

## Testing Locally

Since this is static HTML:

```bash
# Option 1: Python HTTP server
python3 -m http.server 8000

# Option 2: PHP built-in server
php -S localhost:8000

# Option 3: Node.js http-server (requires npm install -g http-server)
http-server -p 8000
```

Then navigate to `http://localhost:8000/park-babelsberg/index.html`

## Project Context

This deployment snapshot includes planning/documentation files in the root directory:
- **spec.md**: Feature specification defining the pillar-page architecture
- **requirements.md**: Quality checklist for specification completeness
- **plan.md**: High-level implementation plan
- **tasks.md**: Task tracking with completion status
- **execute-log.md**: Build/execution log

These files provide historical context about the project's design goals (JSON-driven content, multipage structure, CMP integration, Core Web Vitals optimization) and should be consulted when making significant architectural changes.

## Maintenance Notes

### Content Updates

- All visible text is in German - maintain language consistency
- Date stamps appear in multiple places:
  - `data-date` attribute on `<main>` element
  - "Stand: 2025-10-24" in rules section
  - `<lastmod>` in sitemap.xml
- Update dates when content changes materially

### Location Data Updates

**Monthly Maintenance**:
```bash
./update-all-locations.sh
git add park-babelsberg/data/*.geojson
git commit -m "Update location data from OpenStreetMap"
```

**Data Sources**: All location data comes from OpenStreetMap via Overpass API
**License**: Data © OpenStreetMap contributors, ODbL

**Quality Checks**:
- Verify feature counts are reasonable (not empty or excessive)
- Check for duplicate entries in GeoJSON files
- Review map in browser to ensure markers display correctly
- Test geolocation and navigation on mobile devices

### CSS Modifications

- Global styles use CSS custom properties in `:root`
- To change colors: modify `--bg`, `--ink`, `--muted`, `--accent`, etc.
- To adjust spacing: modify `--grid` (default 12px)
- Components are mobile-first with min-width media queries

### Analytics & Ads

- **GA4**: Inline script in `<head>` - tracking config in gtag('config', ...)
- **AdSense**: Auto-ads script - no manual ad placement required
- **CMP**: Currently stub only - integrate real CMP provider before GDPR compliance needed
