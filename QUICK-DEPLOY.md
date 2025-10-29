# Quick Deployment zu Vercel (Dev-Server)

## 1. Git Commit & Push

```bash
# Alle Änderungen stagen
git add .

# Commit erstellen
git commit -m "Add detailed Parkordnung section and attraction pages

- Added Flatowturm detail page
- Added Schloss Babelsberg detail page
- Added Highlights section to main page
- Added detailed Parkordnung with bike paths, drones, swimming rules
- Added interactive links to location finder
- Added Gastronomie, Parking, ÖPNV cards
- Configured Vercel deployment"

# Zu GitHub pushen
git push origin main
```

## 2. Vercel Deployment

### A) Über Vercel Website (einfachste Methode)

1. **Account erstellen:**
   - Gehe zu https://vercel.com
   - Klicke "Sign Up"
   - Wähle "Continue with GitHub"
   - Erlaube Vercel Zugriff auf deine Repositories

2. **Projekt importieren:**
   - Dashboard → "Add New..." → "Project"
   - Finde dein Repository in der Liste
   - Klicke "Import"

3. **Build Settings:**
   ```
   Framework Preset: Other
   Root Directory: ./
   Build Command: (leer lassen)
   Output Directory: park-babelsberg
   Install Command: (leer lassen)
   ```

4. **Deploy klicken** → Fertig in ~30 Sekunden!

5. **Password-Protection aktivieren:**
   - Project Settings → "Deployment Protection"
   - Aktiviere "Password Protection"
   - Setze ein Passwort (z.B. `dev2025`)
   - Alle Besucher müssen jetzt das Passwort eingeben

### B) Über Vercel CLI (für Fortgeschrittene)

```bash
# Vercel CLI installieren
npm install -g vercel

# Deployment starten
cd /home/dyai/Dokumente/DYAI_home/Web/Babelsberger.info/park-babelsberg_deploy_2025-10-24
vercel

# Beim ersten Mal:
# - Login mit GitHub
# - Setup new project? Yes
# - Which scope? (dein GitHub Username)
# - Link to existing project? No
# - Project name? park-babelsberg-dev
# - Directory: ./park-babelsberg
# - Override settings? No

# Danach bei jedem Update:
vercel --prod
```

## 3. Deine Dev-URL

Nach dem Deployment bekommst du eine URL:
```
https://park-babelsberg-dev.vercel.app
```

### Features:
- ✅ HTTPS automatisch aktiviert
- ✅ Automatisches Deployment bei Git Push
- ✅ Preview-URLs für jeden Commit
- ✅ Password-geschützt (nach Aktivierung)
- ✅ Rollback zu früheren Versionen möglich
- ✅ Analytics & Performance-Monitoring

## 4. Automatische Updates

Nach dem ersten Deployment:
1. Mache Änderungen in deinem Code
2. `git add .`
3. `git commit -m "deine Änderungen"`
4. `git push origin main`
5. Vercel deployed automatisch in ~30 Sekunden

## 5. Team-Zugriff

Andere Entwickler einladen:
1. Vercel Dashboard → Settings → Team
2. "Invite Members"
3. E-Mail eingeben → Role wählen (Developer/Viewer)

## Troubleshooting

### Seite wird nicht gefunden (404)
- Prüfe, ob `vercel.json` korrekt ist
- Prüfe, ob `park-babelsberg/index.html` existiert
- Deployment-Logs in Vercel anschauen

### Bilder laden nicht
- Prüfe Bildpfade (relativ zu `park-babelsberg/`)
- Platzhalter-Bilder ersetzen:
  - `park-babelsberg/info/cafe-placeholder.webp`
  - `park-babelsberg/info/parking-placeholder.webp`
  - `park-babelsberg/info/bus-placeholder.webp`

### Map funktioniert nicht
- HTTPS ist erforderlich für Geolocation
- Vercel bietet automatisch HTTPS
- Prüfe Browser Console auf Fehler (F12)

## Alternative: Netlify

Falls du Netlify bevorzugst:
1. https://netlify.com → Sign Up with GitHub
2. "Add new site" → "Import an existing project"
3. Repository auswählen
4. Build settings:
   ```
   Build command: (leer)
   Publish directory: park-babelsberg
   ```
5. Deploy → Password Protection unter Site Settings

## Nächste Schritte

Nach erfolgreichem Dev-Deployment:
- [ ] Team testen lassen
- [ ] Placeholder-Bilder ersetzen
- [ ] Mobile Geräte testen
- [ ] Performance optimieren
- [ ] Für Production vorbereiten (Domain, Analytics, CMP)

---

**Fragen?** Siehe DEPLOYMENT.md für ausführliche Dokumentation.
