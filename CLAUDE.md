# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for **Potsdam Parks** visitor information, covering Park Babelsberg, Neuer Garten, and Park Glienicke. The site provides interactive location finders (WCs, restaurants, parking, ÖPNV), detailed park information, and practical visitor guidance in both German and English.

## Architecture

### Directory Structure

```
/
├── park-babelsberg/          # Main content directory
│   ├── index.html            # Main landing page (DE/EN bilingual)
│   ├── park-babelsberg.html  # Park Babelsberg detail page
│   ├── neuer-garten.html     # Neuer Garten detail page
│   ├── park-glienicke.html   # Park Glienicke detail page
│   ├── uferweg-nord.html     # Uferweg Nord spot page
│   ├── liegewiesen.html      # Liegewiesen spot page
│   ├── schloss-babelsberg.html # Schloss Babelsberg page
│   ├── flatowturm.html       # Flatowturm page
│   ├── matrosenhaus.html     # Matrosenhaus page
│   ├── gastronomie.html      # Gastronomie overview page
│   ├── impressum.html        # Legal notice
│   ├── datenschutz.html      # Privacy policy
│   ├── parkordnung-vergleich.html # Park rules comparison
│   ├── assets/
│   │   ├── style.css         # CSS variables & component styles
│   │   ├── dark-mode.js      # Dark mode toggle logic
│   │   ├── i18n.js           # Internationalization system
│   │   ├── cookie-consent.js # GDPR cookie consent
│   │   └── translations/
│   │       ├── de.json       # German translations (280 keys)
│   │       └── en.json       # English translations (280 keys)
│   ├── data/                 # GeoJSON data files
│   │   ├── wc.geojson        # WC locations (23 features)
│   │   ├── gastronomie.geojson  # Restaurant/café (303 features)
│   │   ├── parking.geojson   # Parking locations (1254 features)
│   │   └── oepnv.geojson     # Public transport stops
│   ├── modules/              # Location finder modules
│   │   ├── unified-map-v4.html  # Unified location finder (PRODUCTION)
│   │   └── archive/          # Legacy finder versions
│   │       ├── wc-map.html
│   │       ├── gastronomie-map.html
│   │       └── parking-map.html
│   └── images/
│       └── park-babelsberg/
│           ├── *.jpeg        # Hero & detail images (WebP/JPEG)
│           └── attractions/  # Attraction images
├── update-wc-data.sh         # WC data update script
├── update-gastronomie-data.sh  # Gastronomie data update script
├── update-parking-data.sh    # Parking data update script
├── update-oepnv-data.sh      # ÖPNV data update script
├── update-all-locations.sh   # Master update script (runs all)
├── vercel.json               # Vercel deployment config
├── ads.txt                   # Google AdSense authorization
├── robots.txt                # Search engine directives
├── sitemap.xml               # Site structure for search engines
├── I18N-QUICK-START.md       # i18n usage guide
├── I18N-IMPLEMENTATION.md    # i18n technical documentation
├── DARK-MODE-COMPLETE.md     # Dark mode implementation docs
├── LOCATION-FINDER-V2-DOCUMENTATION.md  # Unified map V2 docs
├── DEPLOYMENT.md             # Deployment instructions
└── QUICK-DEPLOY.md           # Quick deployment checklist
```

**Note**: Root-level HTML files (e.g., `uferweg-nord.html`) may be drafts or experiments - the canonical structure is inside `park-babelsberg/`.

### Technology Stack

- **Pure HTML5/CSS3/Vanilla JS** - No build system, framework, or bundler
- **Semantic HTML** with Schema.org JSON-LD structured data
- **WebP/JPEG images** with lazy loading for performance
- **CSS custom properties** for theming (`--bg`, `--ink`, `--accent`, etc.)
- **Dark mode** with system preference detection and LocalStorage persistence
- **i18n system** - JSON-based translations (DE/EN) with automatic browser detection
- **Leaflet.js 1.9.4** - Interactive maps with OpenStreetMap tiles
- **Leaflet.markercluster 1.5.3** - Marker clustering for performance
- **GeoJSON** - Geographic data format for location finders
- **Google Analytics 4** (GA4) tracking with GDPR-compliant cookie consent
- **Google AdSense** with auto-ads

### Design System

The site uses a **component-based CSS design** defined in `assets/style.css`:

- **CSS Variables**: Colors, spacing grid (12px), border radius (16px)
- **Dark Mode Variables**: Complete dark mode color palette with `[data-theme="dark"]` selector
- **Components**: `.hero`, `.badges`, `.cards`, `.kv` (key-value grid), `.section`, `.faq`
- **Responsive**: Grid layouts with `auto-fill` and mobile breakpoints at 768px
- **Sticky Navigation**: `.nav` with blur backdrop filter
- **Fixed UI Controls**: Dark mode toggle (bottom-right), language toggle (above dark mode)
- **Smooth Transitions**: 0.3s ease on theme changes, hover states, and interactions

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

### Unified Location Finder V4 (PRODUCTION)

**Current Architecture**: The site uses a **unified map** with hierarchical filters instead of separate finder modules.

- **Module**: `park-babelsberg/modules/unified-map-v4.html` (integrated into `index.html`)
- **Documentation**: See `LOCATION-FINDER-V2-DOCUMENTATION.md` and `OEPNV-V4-FINAL.md`
- **Performance**: Marker clustering (Leaflet.markercluster 1.5.3) for 1500+ locations
- **Mobile-First**: Responsive design with touch-optimized controls

#### Data Sources

- **WC**: `park-babelsberg/data/wc.geojson` (23 locations)
- **Gastronomie**: `park-babelsberg/data/gastronomie.geojson` (303 locations)
- **Parking**: `park-babelsberg/data/parking.geojson` (1254 locations)
- **ÖPNV**: `park-babelsberg/data/oepnv.geojson` (public transport stops)

#### Features

1. **Main Filters**: WC (ON by default), Gastronomie (ON by default), Parkplätze (OFF), ÖPNV (OFF)
2. **Gastronomie Sub-Filters**: Restaurant, Café, Imbiss, Bar, Pub, Eiscafé, Biergarten
3. **Navigation Integration**:
   - Walking mode for WC & Gastronomie
   - Driving mode for Parkplätze
   - Platform-aware (iOS→Apple Maps, Android→default, Desktop→Google Maps)
4. **Marker Clustering**: Automatic grouping at low zoom levels
5. **Color-Coded Categories**: Distinct colors for each location type

### Legacy Finders (Archived)

The original separate finder modules are archived in `park-babelsberg/modules/archive/`:
- `wc-map.html`
- `gastronomie-map.html`
- `parking-map.html`

**Do not use these** - they are kept for reference only. Use `unified-map-v4.html` instead.

### Updating Location Data

**Update all location data** (recommended):
```bash
./update-all-locations.sh
```

**Update individual categories**:
```bash
./update-wc-data.sh          # Update WC locations
./update-gastronomie-data.sh # Update restaurant/café data
./update-parking-data.sh     # Update parking data
./update-oepnv-data.sh       # Update public transport stops
```

**Dependencies**: Requires `curl` and `jq` installed

**Data Source**: OpenStreetMap via Overpass API

**Update Frequency**: Monthly recommended, or before major content updates

**Quality Checks**:
- Verify feature counts are reasonable (not empty or excessive)
- Check for duplicate entries in GeoJSON files
- Review map in browser to ensure markers display correctly
- Test geolocation and navigation on mobile devices

## Internationalization (i18n)

The site supports **German (DE)** and **English (EN)** with a custom i18n system.

### i18n System Architecture

- **Files**:
  - `assets/i18n.js` - Core i18n system (320 lines)
  - `assets/translations/de.json` - German translations (280 keys)
  - `assets/translations/en.json` - English translations (280 keys)
- **Features**:
  - Automatic browser language detection (`navigator.language`)
  - LocalStorage persistence (`preferred_language`)
  - Fallback to German if browser language is not EN
  - Dynamic DOM updates using `data-i18n` attributes
  - Meta tag updates for SEO (`<title>`, `<meta name="description">`)
- **UI**: Fixed language toggle button (bottom-right, above dark mode toggle)
- **Documentation**: See `I18N-QUICK-START.md` and `I18N-IMPLEMENTATION.md`

### Adding New Translations

1. Add translation keys to `assets/translations/de.json` and `en.json`:
   ```json
   {
     "section": {
       "title": "Titel" / "Title"
     }
   }
   ```
2. Add `data-i18n` attribute to HTML elements:
   ```html
   <h2 data-i18n="section.title">Titel</h2>
   ```
3. Language will switch automatically when user changes language

### i18n API

```javascript
// Change language programmatically
window.i18n.setLanguage('en');

// Get translation
window.i18n.t('hero.title');

// Current language
window.i18n.currentLang; // 'de' or 'en'
```

## Dark Mode

The site has a **complete dark mode implementation** with system preference detection.

### Dark Mode Architecture

- **File**: `assets/dark-mode.js` - Dark mode toggle logic
- **CSS**: Dark mode variables in `assets/style.css` using `[data-theme="dark"]` selector
- **Features**:
  - System preference detection (`prefers-color-scheme: dark`)
  - LocalStorage persistence (`theme` key)
  - FOUC prevention (theme applied before DOM load)
  - Smooth transitions (0.3s ease)
  - WCAG AAA contrast ratios (16.3:1 for primary text)
- **UI**: Fixed toggle button (bottom-right corner)
- **Documentation**: See `DARK-MODE-COMPLETE.md` and `DARK-MODE-ANALYSIS.md`

### Dark Mode Components

All components support dark mode:
- Hero images (stronger overlay in dark mode)
- Cards (adjusted backgrounds and borders)
- FAQ accordions (dark mode styling)
- Badges (dark mode colors)
- Location finder map (inverted tile colors)

### Dark Mode API

```javascript
// Check current theme
document.documentElement.dataset.theme; // 'light' or 'dark'

// Toggle programmatically (via button click)
document.getElementById('theme-toggle').click();
```

## Content Management

### Site Architecture Pattern

The site uses a **hub-and-spoke architecture**:
- **Hub page** (`park-babelsberg/index.html`): Main landing page with overview of all parks and unified location finder
- **Park pages**: Dedicated pages for each major park (Park Babelsberg, Neuer Garten, Park Glienicke)
- **Spot pages**: Detail pages for specific attractions (Uferweg Nord, Schloss Babelsberg, Flatowturm, etc.)
- **Utility pages**: Gastronomie overview, park rules comparison, legal pages (Impressum, Datenschutz)

### Existing Pages

**Main pages**:
- `index.html` - Main hub with unified location finder
- `park-babelsberg.html` - Park Babelsberg details
- `neuer-garten.html` - Neuer Garten details
- `park-glienicke.html` - Park Glienicke details
- `gastronomie.html` - Gastronomie overview

**Spot pages**:
- `uferweg-nord.html` - Uferweg Nord details
- `liegewiesen.html` - Liegewiesen spots
- `schloss-babelsberg.html` - Schloss Babelsberg
- `flatowturm.html` - Flatowturm tower
- `matrosenhaus.html` - Matrosenhaus

**Utility pages**:
- `parkordnung-vergleich.html` - Park rules comparison
- `impressum.html` - Legal notice (required by German law)
- `datenschutz.html` - Privacy policy (GDPR compliance)

### Adding New Pages

**New park page**:
1. Copy `park-babelsberg.html` as template
2. Update meta tags, hero image, content sections
3. Update Schema.org JSON-LD with park-specific data
4. Add to navigation in `index.html` if needed
5. Update `sitemap.xml`

**New spot page**:
1. Copy existing spot page as template (e.g., `uferweg-nord.html`)
2. Update hero image, title, description, practical info
3. Add breadcrumb navigation if needed
4. Link from parent park page
5. Update `sitemap.xml`

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

### Deployment Configuration

- **Platform**: Vercel (configured via `vercel.json`)
- **Domain**: `park.babelsberger.info`
- **Build System**: None required (static HTML/CSS/JS)
- **Deployment Docs**: See `DEPLOYMENT.md` and `QUICK-DEPLOY.md`

### Vercel Configuration

The `vercel.json` file configures:
- Clean URLs (`.html` extension removal)
- Redirects and rewrites
- Headers for caching and security
- Static file serving

### Quick Deployment

```bash
# Using Vercel CLI
vercel --prod

# Or push to main branch (if Vercel GitHub integration is set up)
git push origin main
```

### Pre-deployment Checklist

**Content & Data**:
- [ ] Update location data: Run `./update-all-locations.sh`
- [ ] Verify all images are optimized (WebP format, correct dimensions)
- [ ] Check all internal links work correctly
- [ ] Update `sitemap.xml` with current dates and pages

**i18n & Translations**:
- [ ] Verify all new content has translations in both `de.json` and `en.json`
- [ ] Test language toggle works on all pages
- [ ] Check meta tags update correctly when switching languages

**Features**:
- [ ] Test unified location finder on mobile and desktop
- [ ] Test dark mode toggle and theme persistence
- [ ] Verify geolocation works on HTTPS
- [ ] Test navigation links (Google Maps, Apple Maps) on different devices

**SEO & Analytics**:
- [ ] Verify GA4 tracking ID: `G-K409QD2YSJ`
- [ ] Verify AdSense publisher ID: `pub-1712273263687132`
- [ ] Test Schema.org structured data (Google Rich Results Test)
- [ ] Check Open Graph meta tags for social sharing

**Legal & Privacy**:
- [ ] Cookie consent banner works correctly
- [ ] Privacy policy (`datenschutz.html`) is up to date
- [ ] Legal notice (`impressum.html`) has correct contact info
- [ ] Test that analytics only load after consent

**Performance**:
- [ ] Test Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] Verify hero image preload works
- [ ] Check lazy loading on attraction images
- [ ] Test on slow 3G connection

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

- **Bilingual content**: All updates must be reflected in both `de.json` and `en.json`
- **Date stamps** appear in multiple places:
  - `data-date` attribute on `<main>` element
  - "Stand: [date]" in content sections
  - `<lastmod>` in sitemap.xml
- Update dates when content changes materially
- Remember to update Schema.org JSON-LD when adding/changing content

### Location Data Updates

**Monthly Maintenance**:
```bash
./update-all-locations.sh
git add park-babelsberg/data/*.geojson
git commit -m "chore: Update location data from OpenStreetMap"
```

**Data Sources**: All location data comes from OpenStreetMap via Overpass API
**License**: Data © OpenStreetMap contributors, ODbL

**Quality Checks**:
- Verify feature counts are reasonable (not empty or excessive)
- Check for duplicate entries in GeoJSON files
- Review map in browser to ensure markers display correctly
- Test geolocation and navigation on mobile devices

### Styling & Theming

**CSS Architecture**:
- Global styles use CSS custom properties in `:root`
- Dark mode uses `[data-theme="dark"]` selector
- Components are mobile-first with `min-width` media queries
- Responsive breakpoints: 768px (tablet), 480px (mobile)

**Color Changes**:
- Light mode: modify `:root` variables (`--bg`, `--ink`, `--accent`, etc.)
- Dark mode: modify `[data-theme="dark"]` variables
- Maintain WCAG AAA contrast ratios (7:1 minimum, 16:1+ preferred)

**Spacing Changes**:
- Modify `--grid` variable (default: 12px)
- All spacing uses multiples of `--grid` (e.g., `padding: calc(var(--grid) * 2)`)

### i18n Maintenance

**Adding new translation keys**:
1. Add to both `assets/translations/de.json` and `en.json`
2. Use nested structure for organization (e.g., `hero.title`)
3. Keep key names descriptive and consistent
4. Test both languages after adding new keys

**Updating existing translations**:
1. Update in both JSON files
2. Check that HTML elements have correct `data-i18n` attributes
3. Test that meta tags update correctly (title, description)

### Analytics & Privacy

- **GA4**: Tracking ID `G-K409QD2YSJ` - inline script in `<head>`
- **AdSense**: Publisher ID `pub-1712273263687132` - auto-ads enabled
- **Cookie Consent**: GDPR-compliant via `assets/cookie-consent.js`
- **Privacy-First**: Analytics only load after user consent
- **Geolocation**: Requires explicit user action (button click)

### Performance Monitoring

**Core Web Vitals Targets**:
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**Optimization Checklist**:
- Hero image preload for LCP
- Lazy loading for below-fold images
- Minify CSS/JS if bundle size grows
- Monitor bundle size (currently ~50KB total for CSS/JS)
- Use WebP format for all images
- Optimize GeoJSON files if feature count grows significantly
