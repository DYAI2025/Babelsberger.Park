# Bilder-Vorbereitung für neue Spots

## Übersicht

Basierend auf den GPS-Clustern und EXIF-Daten haben wir folgende neue Spots identifiziert:

### 1. Uferweg Nord (Tiefer See Blick)
**Anzahl Bilder:** 17
**GPS-Zentrum:** 52.419706, 13.068494
**Hero-Bild:** `park-babelsberg-img-3731.webp`

**Zusätzliche Bilder:**
- park-babelsberg-img-3766.webp
- park-babelsberg-img-3770.webp
- park-babelsberg-img-3648.webp
- park-babelsberg-img-3936.webp
- park-babelsberg-img-3940.webp
- park-babelsberg-img-3742.webp
- park-babelsberg-img-3774.webp
- park-babelsberg-img-3735.webp
- park-babelsberg-img-3939.webp
- park-babelsberg-img-3772.webp
- park-babelsberg-img-3733.webp
- park-babelsberg-img-3929.webp
- park-babelsberg-img-3769.webp
- park-babelsberg-img-3925.webp
- park-babelsberg-img-3732.webp
- park-babelsberg-img-3773.webp

### 2. Schloss-Areal (Fotomotiv)
**Anzahl Bilder:** 9
**GPS-Zentrum:** 52.407669, 13.101294
**Hero-Bild:** `park-babelsberg-img-4263.webp`

**Zusätzliche Bilder:**
- park-babelsberg-img-4349.webp
- park-babelsberg-img-4406.webp
- park-babelsberg-img-4325.webp
- park-babelsberg-img-4394.webp
- park-babelsberg-img-4361.webp
- park-babelsberg-img-4272.webp
- park-babelsberg-img-4264.webp
- park-babelsberg-img-4275.webp

## Schritt 1: ZIP-Dateien entpacken

```bash
cd /home/dyai/Downloads

# Bilder Babelsberger entpacken
unzip "Bilder Babelsberger.zip" -d /tmp/park-images

# BilderBabelsbergSchloss entpacken
unzip "BilderBabelsbergSchloss.zip" -d /tmp/park-images
```

## Schritt 2: JPEG → WebP Konvertierung

### Option A: Mit ImageMagick (empfohlen)

```bash
# ImageMagick installieren (falls nicht vorhanden)
sudo apt install imagemagick

# Konvertierung für Uferweg Nord (Hero-Bild)
convert /tmp/park-images/Bilder\ Babelsberger/IMG_3731.jpeg \
  -resize 1600x900 \
  -quality 85 \
  park-babelsberg/images/park-babelsberg/spots/park-babelsberg-img-3731.webp

# Batch-Konvertierung aller Bilder
for img in /tmp/park-images/Bilder\ Babelsberger/IMG_*.jpeg; do
  filename=$(basename "$img" .jpeg)
  convert "$img" \
    -resize 1600x900^ \
    -gravity center \
    -extent 1600x900 \
    -quality 85 \
    "park-babelsberg/images/park-babelsberg/spots/park-babelsberg-$(echo $filename | tr '[:upper:]' '[:lower:]').webp"
done

# Batch-Konvertierung Schloss-Bilder
for img in /tmp/park-images/BilderBabelsbergSchloss/IMG_*.jpeg; do
  filename=$(basename "$img" .jpeg)
  convert "$img" \
    -resize 1600x900^ \
    -gravity center \
    -extent 1600x900 \
    -quality 85 \
    "park-babelsberg/images/park-babelsberg/spots/park-babelsberg-$(echo $filename | tr '[:upper:]' '[:lower:]').webp"
done
```

### Option B: Mit cwebp (Google WebP Tools)

```bash
# cwebp installieren
sudo apt install webp

# Einzelne Konvertierung
cwebp -q 85 -resize 1600 900 \
  /tmp/park-images/Bilder\ Babelsberger/IMG_3731.jpeg \
  -o park-babelsberg/images/park-babelsberg/spots/park-babelsberg-img-3731.webp
```

### Option C: Online-Converter

Falls Kommandozeilen-Tools nicht verfügbar:
1. https://cloudconvert.com/jpeg-to-webp
2. Bilder hochladen
3. WebP-Qualität auf 85% setzen
4. Größe auf 1600x900 px anpassen
5. Herunterladen und in `park-babelsberg/images/park-babelsberg/spots/` ablegen

## Schritt 3: Bilder umbenennen

Falls die Dateinamen Großbuchstaben enthalten (IMG_3731.jpeg):

```bash
cd park-babelsberg/images/park-babelsberg/spots/

# Alle zu Kleinbuchstaben
for file in *; do
  mv "$file" "$(echo $file | tr '[:upper:]' '[:lower:]')"
done

# Oder einzeln:
mv park-babelsberg-IMG-3731.webp park-babelsberg-img-3731.webp
```

## Schritt 4: Bildoptimierung (optional)

```bash
# WebP weiter komprimieren (falls Dateien zu groß)
find park-babelsberg/images/park-babelsberg/spots/ -name "*.webp" -exec \
  cwebp -q 80 {} -o {}.tmp \; -exec mv {}.tmp {} \;
```

## Schritt 5: Verifizierung

```bash
# Alle Spot-Bilder auflisten
ls -lh park-babelsberg/images/park-babelsberg/spots/

# Bildgrößen prüfen
file park-babelsberg/images/park-babelsberg/spots/*.webp
```

**Erwartetes Ergebnis:**
- 26 WebP-Dateien (17 Uferweg + 9 Schloss)
- Dateigröße: 50-200 KB pro Bild
- Format: 1600x900 px (16:9)

## Schritt 6: Cleanup

```bash
# Temporäre Ordner entfernen
rm -rf /tmp/park-images
```

## Fertig!

Alle Bilder sind jetzt im korrekten Format und bereit für die Website.

### Nächste Schritte

1. Lokalen Server starten: `python3 -m http.server 8000`
2. Browser öffnen: `http://localhost:8000/park-babelsberg/index.html`
3. Neue Uferweg-Nord-Seite prüfen: `http://localhost:8000/park-babelsberg/uferweg-nord.html`
4. Visuell checken, ob alle Bilder korrekt laden

---

**Hinweis:** Die Dateinamen müssen EXAKT mit den in der HTML verwendeten Namen übereinstimmen:
- `park-babelsberg-img-3731.webp` (nicht `IMG_3731.webp` oder `Park-babelsberg-img-3731.webp`)
