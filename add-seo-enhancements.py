#!/usr/bin/env python3
"""
Add SEO enhancements for Location-Finder
"""

def main():
    index_file = 'park-babelsberg/index.html'

    with open(index_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Enhanced meta tags to add after viewport meta
    seo_meta_tags = '''
<!-- SEO Enhancements -->
<meta name="keywords" content="park babelsberg toiletten, wc park babelsberg, restaurants park babelsberg, parkplätze park babelsberg, neuer garten potsdam toiletten, schloss babelsberg gastronomie, potsdam park toiletten finden, park babelsberg karte">
<meta name="geo.region" content="DE-BB">
<meta name="geo.placename" content="Park Babelsberg, Potsdam">
<meta name="geo.position" content="52.400;13.085">
<link rel="canonical" href="https://example.com/park-babelsberg/index.html">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://example.com/park-babelsberg/index.html">
<meta property="og:title" content="Park Babelsberg Potsdam – Location-Finder für WCs & Restaurants">
<meta property="og:description" content="Interaktive Karte mit WCs, Restaurants und Parkplätzen im Park Babelsberg, Neuer Garten und Schloss Babelsberg. Mit Standort-Navigation.">
<meta property="og:image" content="https://example.com/park-babelsberg/images/park-babelsberg/jagdschloss.jpeg">
<meta property="og:locale" content="de_DE">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="https://example.com/park-babelsberg/index.html">
<meta name="twitter:title" content="Park Babelsberg Location-Finder">
<meta name="twitter:description" content="Finde WCs & Restaurants im Park Babelsberg mit unserer interaktiven Karte">
<meta name="twitter:image" content="https://example.com/park-babelsberg/images/park-babelsberg/jagdschloss.jpeg">
'''

    # Schema.org JSON-LD for the Location Finder
    schema_jsonld = '''
<!-- Schema.org JSON-LD for Location Finder -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  "name": "Park Babelsberg",
  "description": "Historischer Landschaftspark in Potsdam mit Location-Finder für WCs, Restaurants und Parkplätze",
  "url": "https://example.com/park-babelsberg/index.html",
  "image": "https://example.com/park-babelsberg/images/park-babelsberg/jagdschloss.jpeg",
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "52.400",
    "longitude": "13.085"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Potsdam",
    "addressRegion": "Brandenburg",
    "addressCountry": "DE"
  },
  "amenityFeature": [
    {
      "@type": "LocationFeatureSpecification",
      "name": "WC-Finder",
      "value": "Interaktive Karte mit allen öffentlichen Toiletten im Park"
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Gastronomie-Finder",
      "value": "Restaurants, Cafés und Imbisse in der Umgebung"
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Parkplatz-Finder",
      "value": "Parkplätze für PKW und Fahrräder"
    }
  ],
  "hasMap": {
    "@type": "Map",
    "name": "Park Babelsberg Location-Finder",
    "url": "https://example.com/park-babelsberg/index.html#location-finder",
    "mapType": "VenueMap"
  }
}
</script>
'''

    # Find insertion point (after <head> tag or before </head>)
    if '<link rel="stylesheet"' in content:
        # Insert before stylesheet
        content = content.replace(
            '<link rel="stylesheet" href="assets/style.css">',
            seo_meta_tags + '\n<link rel="stylesheet" href="assets/style.css">'
        )

    # Insert Schema.org before </head>
    if '</head>' in content:
        content = content.replace('</head>', schema_jsonld + '\n</head>')

    # Write back
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(content)

    print("✅ SEO Enhancements Added!")
    print("\n📊 Added SEO Elements:")
    print("  ✓ Keywords meta tag (toiletten, wc, restaurants, parkplätze)")
    print("  ✓ Geo-location meta tags (Park Babelsberg coordinates)")
    print("  ✓ Canonical URL")
    print("  ✓ Open Graph tags (Facebook, LinkedIn)")
    print("  ✓ Twitter Card tags")
    print("  ✓ Schema.org JSON-LD (TouristAttraction + Map)")
    print("\n🎯 Target Search Queries:")
    print("  • toiletten park babelsberg")
    print("  • wc park babelsberg potsdam")
    print("  • restaurants park babelsberg")
    print("  • parkplätze neuer garten potsdam")
    print("  • schloss babelsberg gastronomie")
    print("\n⚠️  Remember to update URLs:")
    print("  - Replace 'example.com' with your actual domain")
    print("  - Update image URLs to absolute paths")

if __name__ == '__main__':
    main()
