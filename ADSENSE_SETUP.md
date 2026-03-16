# Babelsberger.info AdSense Setup

## Aktueller Status (März 2026)
Die Seite ist für Produktion bereit.
- Publisher ID: `ca-pub-1712273263687132`
- CMP (Cookie Consent) integriert und steuert AdSense-Ladung.
- Ad-Block-Layout-Shifts durch CSS min-height minimiert.
- Legal Pages (DE/EN) vollständig konform.

## AdSense Slots
Alle Slots werden dynamisch über `assets/ad-config.js` verwaltet. In den HTML-Dateien werden nur noch logische Namen verwendet:

- `BABELSB_TOP_1`
- `BABELSB_MIDDLE_2`
- `BABELSB_PARKS_3`
- `BABELSB_PLANEN_4`
- `BABELSB_FAQ_5`
- `BABELSB_STICKY_MOBILE`
- `BABELSB_IN_ARTICLE`
- `BABELSB_INFEED`

## Compliance-Checkliste
1. [x] **ads.txt** im Root vorhanden.
2. [x] **CMP** blockiert AdSense bis zur Einwilligung.
3. [x] **Datenschutz** erklärt AdSense-Nutzung (DE & EN).
4. [x] **Keine hardcodierten Skripte** in den HTML-Dateien (Ladung nur via JS).
5. [x] **Slot-IDs** sind numerisch in `ad-config.js` hinterlegt.
