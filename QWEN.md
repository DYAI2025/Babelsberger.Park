# Park Babelsberg Information Website

## Project Overview

This is a sophisticated, SEO-optimized website for Park Babelsberg in Potsdam, Germany, featuring an interactive location finder for WCs, restaurants, parking, and public transportation. The project is designed as a multipage pillar site with location-based services, monetization capabilities, and comprehensive visitor information.

## Architecture

### Core Structure
- **Main site**: `park-babelsberg/` directory with `index.html` as the main entry point
- **Data sources**: GeoJSON files in `data/` directory (WCs, gastronomy, parking, public transport)
- **Modules**: Reusable components in `modules/` directory
- **Assets**: CSS, JavaScript, and images in respective folders
- **Scripts**: Python and Bash scripts for SEO enhancement and data updates

### Key Features
1. **Interactive Location Finder** (V4 Unified Map):
   - WC locations with access and fee information
   - Gastronomy finder (restaurants, cafes, bars, ice cream, etc.)
   - Parking locations (public, private, bicycle, multi-story)
   - Public transportation with live departure data (VBB API)

2. **SEO Optimization**:
   - Schema.org JSON-LD markup
   - Open Graph and Twitter Card meta tags
   - Geolocation meta tags
   - Keyword-rich content for "park babelsberg toiletten", "wc park babelsberg", etc.

3. **Mobile-First Responsive Design**:
   - Adaptive layouts for all screen sizes
   - Platform-aware navigation (Google Maps on Android, Apple Maps on iOS)
   - Performance optimized for mobile networks

4. **Data Management**:
   - Automated data fetching from OpenStreetMap via Overpass API
   - Live public transport data from VBB API
   - Update scripts for maintaining location data

## Building and Running

### Local Development
```bash
# Using Python's built-in server
cd park-babelsberg
python3 -m http.server 8000
# Then visit http://localhost:8000/

# Or using PHP
php -S localhost:8000

# Or using Node.js http-server
npx http-server
```

### Data Updates
The site uses multiple data sources that can be updated with scripts:

```bash
# Update WC data from OpenStreetMap
./update-wc-data.sh

# Update gastronomy data
./update-gastronomie-data.sh

# Update parking data
./update-parking-data.sh

# Update public transport data
./update-oepnv-data.sh

# Update all location data
./update-all-locations.sh
```

### SEO Enhancements
```bash
# Add SEO meta tags and Schema.org markup
python3 add-seo-enhancements.py
```

## Deployment

### Platform Options
1. **Vercel (recommended)**: Automatic deployment with password protection
2. **Netlify**: Static site hosting with password protection
3. **GitHub Pages**: For public hosting (requires GitHub Pro for private)

### Production Requirements
- HTTPS (required for geolocation API)
- Static file hosting (HTML/CSS/JS/assets)
- CDN for Leaflet library (loaded from unpkg.com)
- Map tiles from OpenStreetMap (tile.openstreetmap.org)

## Development Conventions

### Code Structure
- HTML files follow semantic markup with proper accessibility attributes
- CSS variables used for consistent theming
- JavaScript modules use IIFE pattern to avoid global scope pollution
- All external resources (Leaflet, CDN assets) are properly referenced

### Data Handling
- GeoJSON files stored statically in `data/` directory
- Client-side JavaScript fetches and renders location data
- Live data (public transport) fetched via VBB API with caching
- All location data sourced from OpenStreetMap via Overpass API

### Privacy & Consent
- Geolocation access only with user permission
- Cookie consent management (CMP) integrated
- No tracking by default (Google Analytics disabled in dev)
- GDPR-compliant data handling

## File Structure

```
├── park-babelsberg/                    # Main website directory
│   ├── index.html                     # Main page with unified location finder
│   ├── modules/                       # Reusable components
│   │   └── unified-map.html           # Interactive map module
│   ├── data/                          # GeoJSON location data
│   │   ├── wc.geojson                 # WC locations
│   │   ├── gastronomie.geojson        # Restaurant/cafe locations
│   │   ├── parking.geojson            # Parking locations
│   │   └── oepnv.geojson              # Public transport stops
│   ├── assets/                        # CSS and JS assets
│   ├── images/                        # Image assets
│   └── *.html                         # Additional pages (legal, etc.)
├── scripts/                           # Update and utility scripts
│   ├── update-wc-data.sh              # Update WC data from OSM
│   ├── update-gastronomie-data.sh     # Update restaurant data
│   ├── update-parking-data.sh         # Update parking data
│   └── update-all-locations.sh        # Update all location data
├── add-seo-enhancements.py            # SEO optimization script
├── integrate-unified-map.py           # Map integration script
├── vercel.json                        # Vercel deployment config
└── DEPLOYMENT.md                      # Deployment documentation
```

## Special Features

### Location Finder V4
The unified map module combines four location types with live public transport data:
- **WC Finder**: Public toilets with access type (public/customer-only/paid)
- **Gastronomy Finder**: Restaurants, cafes, bars with cuisine info and hours
- **Parking Finder**: Various parking types (public/private/bicycle)
- **Public Transport**: Live departure data via VBB API with refresh functionality

### Performance Optimizations
- Preloaded hero images for LCP optimization
- Reserved ad heights to prevent CLS
- Mobile-optimized map rendering
- Caching strategy for live transport data
- Efficient marker clustering for large datasets

## Maintenance

### Regular Tasks
- Update location data monthly (or as needed) using update scripts
- Monitor live transport API for availability
- Check for broken links in location data
- Verify map tile and CDN asset availability

### Content Strategy
- Regular updates to location data via OpenStreetMap
- Add new attractions and amenities as they become available
- Update seasonal information and opening hours
- Maintain SEO keyword optimization for local search

## Future Enhancements
- Multi-category map views (combined WC/restaurant/parking)
- Route planning with multiple stops
- User contributions for location data
- Offline capability with service workers
- Real-time parking availability
- Enhanced accessibility features