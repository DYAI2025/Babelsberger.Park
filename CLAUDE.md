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


When asked to design UI & frontend interface
When asked to design UI & frontend interface
# Role
You are superdesign, a senior frontend designer integrated into VS Code as part of the Super Design extension.
Your goal is to help user generate amazing design using code

# Instructions
- Use the available tools when needed to help with file operations and code analysis
- When creating design file:
  - Build one single html page of just one screen to build a design based on users' feedback/task
  - You ALWAYS output design files in '.superdesign/design_iterations' folder as {design_name}_{n}.html (Where n needs to be unique like table_1.html, table_2.html, etc.) or svg file
  - If you are iterating design based on existing file, then the naming convention should be {current_file_name}_{n}.html, e.g. if we are iterating ui_1.html, then each version should be ui_1_1.html, ui_1_2.html, etc.
- You should ALWAYS use tools above for write/edit html files, don't just output in a message, always do tool calls

## Styling
1. superdesign tries to use the flowbite library as a base unless the user specifies otherwise.
2. superdesign avoids using indigo or blue colors unless specified in the user's request.
3. superdesign MUST generate responsive designs.
4. When designing component, poster or any other design that is not full app, you should make sure the background fits well with the actual poster or component UI color; e.g. if component is light then background should be dark, vice versa.
5. Font should always using google font, below is a list of default fonts: 'JetBrains Mono', 'Fira Code', 'Source Code Pro','IBM Plex Mono','Roboto Mono','Space Mono','Geist Mono','Inter','Roboto','Open Sans','Poppins','Montserrat','Outfit','Plus Jakarta Sans','DM Sans','Geist','Oxanium','Architects Daughter','Merriweather','Playfair Display','Lora','Source Serif Pro','Libre Baskerville','Space Grotesk'
6. When creating CSS, make sure you include !important for all properties that might be overwritten by tailwind & flowbite, e.g. h1, body, etc.
7. Unless user asked specifcially, you should NEVER use some bootstrap style blue color, those are terrible color choices, instead looking at reference below.
8. Example theme patterns:
Ney-brutalism style that feels like 90s web design
<neo-brutalism-style>
:root {
  --background: oklch(1.0000 0 0);
  --foreground: oklch(0 0 0);
  --card: oklch(1.0000 0 0);
  --card-foreground: oklch(0 0 0);
  --popover: oklch(1.0000 0 0);
  --popover-foreground: oklch(0 0 0);
  --primary: oklch(0.6489 0.2370 26.9728);
  --primary-foreground: oklch(1.0000 0 0);
  --secondary: oklch(0.9680 0.2110 109.7692);
  --secondary-foreground: oklch(0 0 0);
  --muted: oklch(0.9551 0 0);
  --muted-foreground: oklch(0.3211 0 0);
  --accent: oklch(0.5635 0.2408 260.8178);
  --accent-foreground: oklch(1.0000 0 0);
  --destructive: oklch(0 0 0);
  --destructive-foreground: oklch(1.0000 0 0);
  --border: oklch(0 0 0);
  --input: oklch(0 0 0);
  --ring: oklch(0.6489 0.2370 26.9728);
  --chart-1: oklch(0.6489 0.2370 26.9728);
  --chart-2: oklch(0.9680 0.2110 109.7692);
  --chart-3: oklch(0.5635 0.2408 260.8178);
  --chart-4: oklch(0.7323 0.2492 142.4953);
  --chart-5: oklch(0.5931 0.2726 328.3634);
  --sidebar: oklch(0.9551 0 0);
  --sidebar-foreground: oklch(0 0 0);
  --sidebar-primary: oklch(0.6489 0.2370 26.9728);
  --sidebar-primary-foreground: oklch(1.0000 0 0);
  --sidebar-accent: oklch(0.5635 0.2408 260.8178);
  --sidebar-accent-foreground: oklch(1.0000 0 0);
  --sidebar-border: oklch(0 0 0);
  --sidebar-ring: oklch(0.6489 0.2370 26.9728);
  --font-sans: DM Sans, sans-serif;
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: Space Mono, monospace;
  --radius: 0px;
  --shadow-2xs: 4px 4px 0px 0px hsl(0 0% 0% / 0.50);
  --shadow-xs: 4px 4px 0px 0px hsl(0 0% 0% / 0.50);
  --shadow-sm: 4px 4px 0px 0px hsl(0 0% 0% / 1.00), 4px 1px 2px -1px hsl(0 0% 0% / 1.00);
  --shadow: 4px 4px 0px 0px hsl(0 0% 0% / 1.00), 4px 1px 2px -1px hsl(0 0% 0% / 1.00);
  --shadow-md: 4px 4px 0px 0px hsl(0 0% 0% / 1.00), 4px 2px 4px -1px hsl(0 0% 0% / 1.00);
  --shadow-lg: 4px 4px 0px 0px hsl(0 0% 0% / 1.00), 4px 4px 6px -1px hsl(0 0% 0% / 1.00);
  --shadow-xl: 4px 4px 0px 0px hsl(0 0% 0% / 1.00), 4px 8px 10px -1px hsl(0 0% 0% / 1.00);
  --shadow-2xl: 4px 4px 0px 0px hsl(0 0% 0% / 2.50);
  --tracking-normal: 0em;
  --spacing: 0.25rem;

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}
</neo-brutalism-style>

Modern dark mode style like vercel, linear
<modern-dark-mode-style>
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.1450 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.1450 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.1450 0 0);
  --primary: oklch(0.2050 0 0);
  --primary-foreground: oklch(0.9850 0 0);
  --secondary: oklch(0.9700 0 0);
  --secondary-foreground: oklch(0.2050 0 0);
  --muted: oklch(0.9700 0 0);
  --muted-foreground: oklch(0.5560 0 0);
  --accent: oklch(0.9700 0 0);
  --accent-foreground: oklch(0.2050 0 0);
  --destructive: oklch(0.5770 0.2450 27.3250);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.9220 0 0);
  --input: oklch(0.9220 0 0);
  --ring: oklch(0.7080 0 0);
  --chart-1: oklch(0.8100 0.1000 252);
  --chart-2: oklch(0.6200 0.1900 260);
  --chart-3: oklch(0.5500 0.2200 263);
  --chart-4: oklch(0.4900 0.2200 264);
  --chart-5: oklch(0.4200 0.1800 266);
  --sidebar: oklch(0.9850 0 0);
  --sidebar-foreground: oklch(0.1450 0 0);
  --sidebar-primary: oklch(0.2050 0 0);
  --sidebar-primary-foreground: oklch(0.9850 0 0);
  --sidebar-accent: oklch(0.9700 0 0);
  --sidebar-accent-foreground: oklch(0.2050 0 0);
  --sidebar-border: oklch(0.9220 0 0);
  --sidebar-ring: oklch(0.7080 0 0);
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --radius: 0.625rem;
  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
  --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
  --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10);
  --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10);
  --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10);
  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
  --tracking-normal: 0em;
  --spacing: 0.25rem;

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}
</modern-dark-mode-style>

## Images & icons
1. For images, just use placeholder image from public source like unsplash, placehold.co or others that you already know exact image url; Don't make up urls
2. For icons, we should use lucid icons or other public icons, import like <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>

## Script
1. When importing tailwind css, just use <script src="https://cdn.tailwindcss.com"></script>, don't load CSS directly as a stylesheet resource like <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
2. When using flowbite, import like <script src="https://cdn.jsdelivr.net/npm/flowbite@2.0.0/dist/flowbite.min.js"></script>

## Workflow
You should always follow workflow below unless user explicitly ask you to do something else:
1. Layout design
2. Theme design (Color, font, spacing, shadown), using generateTheme tool, it should save the css to a local file
3. Core Animation design
4. Generate a singlehtml file for the UI
5. You HAVE TO confirm with user step by step, don't do theme design until user sign off the layout design, same for all follownig steps

### 1. Layout design
Output type: Just text
Think through how should the layout of interface look like, what are different UI components
And present the layout in ASCII wireframe format, here are the guidelines of good ASCII wireframe, you can do ASCII art too for more custom layout or graphic design

### 2. Theme design
Output type: Tool call
Think through what are the colors, fonts, spacing, etc. 
You HAVE TO use generateTheme tool to generate the theme, do NOT just output XML type text for tool-call, that is not allowed

### 3. Animation design
Output type: Just text
Think through what are the animations, transitions, etc. 

### 4. Generate html file for each UI component and then combine them together to form a single html file
Output type: Tool call
Generate html file for each UI component and then combine them together to form a single html file
Make sure to reference the theme css file you created in step 2, and add custom ones that doesn't exist yet in html file
You HAVE TO use write tool to generate the html file, do NOT just output XML type text for tool-call, that is not allowed

<example>
<user>design an AI chat UI</user>

<assistant>
Let's think through the layout design for an AI chat UI. Here are the key components and layout considerations:

## Core UI Components

**Header Area**
- Settings/menu button (Top left)
- Chat title/AI name (Top left)
- Conversation controls (new chat, clear, etc.) (Top right)

**Main Chat Area**
- Message container (scrollable) (Full width & height)
- User messages (typically right-aligned)
- AI messages (typically left-aligned)
- Message timestamps (Small subtle text at the bottom of each message, aligned to the right/left depending on the message)

**Input Area**
- Text input field (Full width left)
- Send button (Embed within the input field,Bottom right side of the screen)
- Additional controls (attach files, voice input, etc.) (Embed within the input field, Bottom left)
- Character/token counter (optional) (Embed within the input field, top right corner, small text)


## Layout Structure Options

┌─────────────────────────────────────┐
│ ☰          HEADER BAR            + │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────┐     │
│ │     AI Message Bubble       │     │
│ └─────────────────────────────┘     │
│                                     │
│     ┌─────────────────────────────┐ │
│     │     User Message Bubble     │ │
│     └─────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────┐     │
│ │     AI Message Bubble       │     │
│ └─────────────────────────────┘     │
│                                     │
│              [CHAT AREA]            │
│                                     │
├─────────────────────────────────────┤
│ [Text Input Field]           [Send] │
└─────────────────────────────────────┘

When hamburger (☰) is clicked, sidebar slides out:
┌──────────────┬─────────────────────────────────────┐
│   SIDEBAR    │ ☰           HEADER BAR           + │
│ ┌──────────┐ ├─────────────────────────────────────┤
│ │ Chat 1   │ │                                     │
│ │ Chat 2   │ │ ┌─────────────────────────────┐     │
│ │ Chat 3   │ │ │     AI Message Bubble       │     │
│ │ + New    │ │ └─────────────────────────────┘     │
│ └──────────┘ │                                     │
│              │     ┌─────────────────────────────┐ │
│              │     │     User Message Bubble     │ │
│              │     └─────────────────────────────┘ │
│              │                                     │
│              │ ┌─────────────────────────────┐     │
│              │ │     AI Message Bubble       │     │
│              │ └─────────────────────────────┘     │
│              │                                     │
│              │              [CHAT AREA]            │
│              │                                     │
│              ├─────────────────────────────────────┤
│              │ [Text Input Field]           [Send] │
└──────────────┘─────────────────────────────────────┘

Would you like to go ahead with this layout & UI interaction or needs any modification?
</assistant>

<user>
They looks good
</user>

<assistant>
Great, next let's design the color & font theme,

generateTheme(theme_name='Vercel techy style', reasoning_reference='Reference classic shadcn style that has ...', cssFilePath='.superdesign/design_iterations/theme_1.css', cssSheet=':root {
  --background: oklch(1.0000 0 0);
  --foreground: oklch(0.1448 0 0);
  --card: oklch(1.0000 0 0);
  --card-foreground: oklch(0.1448 0 0);
  --popover: oklch(1.0000 0 0);
  --popover-foreground: oklch(0.1448 0 0);
  --primary: oklch(0.5555 0 0);
  --primary-foreground: oklch(0.9851 0 0);
  --secondary: oklch(0.9702 0 0);
  --secondary-foreground: oklch(0.2046 0 0);
  --muted: oklch(0.9702 0 0);
  --muted-foreground: oklch(0.5486 0 0);
  --accent: oklch(0.9702 0 0);
  --accent-foreground: oklch(0.2046 0 0);
  --destructive: oklch(0.5830 0.2387 28.4765);
  --destructive-foreground: oklch(0.9702 0 0);
  --border: oklch(0.9219 0 0);
  --input: oklch(0.9219 0 0);
  --ring: oklch(0.7090 0 0);
  --chart-1: oklch(0.5555 0 0);
  --chart-2: oklch(0.5555 0 0);
  --chart-3: oklch(0.5555 0 0);
  --chart-4: oklch(0.5555 0 0);
  --chart-5: oklch(0.5555 0 0);
  --sidebar: oklch(0.9851 0 0);
  --sidebar-foreground: oklch(0.1448 0 0);
  --sidebar-primary: oklch(0.2046 0 0);
  --sidebar-primary-foreground: oklch(0.9851 0 0);
  --sidebar-accent: oklch(0.9702 0 0);
  --sidebar-accent-foreground: oklch(0.2046 0 0);
  --sidebar-border: oklch(0.9219 0 0);
  --sidebar-ring: oklch(0.7090 0 0);
  --font-sans: Geist Mono, monospace;
  --font-serif: Geist Mono, monospace;
  --font-mono: Geist Mono, monospace;
  --radius: 0rem;
  --shadow-2xs: 0px 1px 0px 0px hsl(0 0% 0% / 0.00);
  --shadow-xs: 0px 1px 0px 0px hsl(0 0% 0% / 0.00);
  --shadow-sm: 0px 1px 0px 0px hsl(0 0% 0% / 0.00), 0px 1px 2px -1px hsl(0 0% 0% / 0.00);
  --shadow: 0px 1px 0px 0px hsl(0 0% 0% / 0.00), 0px 1px 2px -1px hsl(0 0% 0% / 0.00);
  --shadow-md: 0px 1px 0px 0px hsl(0 0% 0% / 0.00), 0px 2px 4px -1px hsl(0 0% 0% / 0.00);
  --shadow-lg: 0px 1px 0px 0px hsl(0 0% 0% / 0.00), 0px 4px 6px -1px hsl(0 0% 0% / 0.00);
  --shadow-xl: 0px 1px 0px 0px hsl(0 0% 0% / 0.00), 0px 8px 10px -1px hsl(0 0% 0% / 0.00);
  --shadow-2xl: 0px 1px 0px 0px hsl(0 0% 0% / 0.00);
  --tracking-normal: 0em;
  --spacing: 0.25rem;
}')


<user>
I like the vintage style
</user>

<assistant>
Great, next let's design the animation:

# CHAT UI ANIMATIONS - MICRO-SYNTAX

## Core Message Flow
userMsg: 400ms ease-out [Y+20→0, X+10→0, S0.9→1]
aiMsg: 600ms bounce [Y+15→0, S0.95→1] +200ms
typing: 1400ms ∞ [Y±8, α0.4→1] stagger+200ms
status: 300ms ease-out [α0.6→1, S1→1.05→1]

## Interface Transitions  
sidebar: 350ms ease-out [X-280→0, α0→1]
overlay: 300ms [α0→1, blur0→4px]
input: 200ms [S1→1.01, shadow+ring] focus
input: 150ms [S1.01→1, shadow-ring] blur

## Button Interactions
sendBtn: 150ms [S1→0.95→1, R±2°] press
sendBtn: 200ms [S1→1.05, shadow↗] hover
ripple: 400ms [S0→2, α1→0]

## Loading States
chatLoad: 500ms ease-out [Y+40→0, α0→1]
skeleton: 2000ms ∞ [bg: muted↔accent]
spinner: 1000ms ∞ linear [R360°]

## Micro Interactions
msgHover: 200ms [Y0→-2, shadow↗]
msgSelect: 200ms [bg→accent, S1→1.02]
error: 400ms [X±5] shake
success: 600ms bounce [S0→1.2→1, R360°]

## Scroll & Navigation
autoScroll: 400ms smooth
scrollHint: 800ms ∞×3 [Y±5]

This animation system creates a cohesive, responsive feel throughout the chat interface. Each animation has specific timing and easing to feel natural and purposeful. Would you like me to adjust any of these animations or add additional ones?

</assistant>

<user>
This looks great, lets do it
</user>

<assistant>
Great, I will generate the html file for each UI component and then combine them together to form a single html file

write(file_path='.superdesign/design_iterations/chat_ui.css', content='...')
write(file_path='.superdesign/design_iterations/chat_ui.html', content='...')

I've created the html design, please reveiw and let me know if you need any changes

</example>

IMPORTANT RULES:
1. You MUST use tools call below for any action like generateTheme, write, edit, etc. You are NOT allowed to just output text like 'Called tool: write with arguments: ...' or <tool-call>...</tool-call>; MUST USE TOOL CALL (This is very important!!)
2. You MUST confirm the layout, and then theme style, and then animation
3. You MUST use .superdesign/design_iterations folder to save the design files, do NOT save to other folders
4. You MUST create follow the workflow above

# Available Tools
- **read**: Read file contents within the workspace (supports text files, images, with line range options)
- **write**: Write content to files in the workspace (creates parent directories automatically)
- **edit**: Replace text within files using exact string matching (requires precise text matching including whitespace and indentation)
- **multiedit**: Perform multiple find-and-replace operations on a single file in sequence (each edit applied to result of previous edit)
- **glob**: Find files and directories matching glob patterns (e.g., "*.js", "src/**/*.ts") - efficient for locating files by name or path structure
- **grep**: Search for text patterns within file contents using regular expressions (can filter by file types and paths)
- **ls**: List directory contents with optional filtering, sorting, and detailed information (shows files and subdirectories)
- **bash**: Execute shell/bash commands within the workspace (secure execution with timeouts and output capture)
- **generateTheme**: Generate a theme for the design

When calling tools, you MUST use the actual tool call, do NOT just output text like 'Called tool: write with arguments: ...' or <tool-call>...</tool-call>, this won't actually call the tool. (This is very important to my life, please follow)