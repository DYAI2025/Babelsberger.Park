# Babelsberger.info AdSense Setup

## Aktueller Status
Die Seite hat bereits AdSense aktiviert mit Publisher ID: `ca-pub-1712273263687132`

## Offene AdSense Slots
Momentan sind folgende Platzhalter in der index.html vorhanden:
- `BABELSB_TOP_1` (obere Anzeige)
- `BABELSB_MIDDLE_2` (mittlere Anzeige)

## Anleitung für echte AdSlots

1. **Gehe zu AdSense:**
   https://www.google.com/adsense/new/u/0/sites

2. **Erstelle neue AdUnits für:**
   - `babelsb-top-1` (Banner oben)
   - `babelsb-middle-2` (In-feed unten)

3. **Kopiere die Slot IDs und ersetze die Platzhalter:**

```bash
# Ersetze die Platzhalter mit den echten Slot IDs:
sed -i 's/BABELSB_TOP_1/[DEINE_SLOT_ID_1]/g' /home/moltbot/Babelsberger.Park/park-babelsberg/index.html
sed -i 's/BABELSB_MIDDLE_2/[DEINE_SLOT_ID_2]/g' /home/moltbot/Babelsberger.Park/park-babelsberg/index.html
```

4. **Deploye die aktualisierte Seite:**
```bash
cd /home/moltbot/Babelsberger.Park
git add .
git commit -m "feat: AdSense Slots mit echten IDs ersetzt"
git push origin main
```

## Automatisierung
Wenn du die Slot IDs hast, kann ich sie direkt ersetzen.