# TV-Cast: Einrichtung

Ersatz für die TVCast-App. Die Cast-Seite schickt eine Video-URL an den Chromecast im Fernseher (Google Default Media Receiver). Das Bookmarklet holt den Video-Link von der aktuell offenen Seite und öffnet damit die Cast-Seite.

Dateien in diesem Ordner:

| Datei | Zweck |
|---|---|
| `index.html` | Die Cast-Seite (kommt auf GitHub Pages) |
| `bookmarklet.js` | Lesbare Quelle des Bookmarklets (nur zur Info, der fertige Code steht auf der Cast-Seite) |
| `_build/` | Vorlage + Build-Skript, falls die Seite später angepasst wird |

## 1. GitHub Pages einrichten (einmalig, am PC, ca. 5 Min.)

1. **Anmelden:** <https://github.com/login> (ohne Konto: <https://github.com/signup>).
2. **Neues Repository:** <https://github.com/new> öffnen.
   Repository name: `tv-cast` · Sichtbarkeit: **Public** (GitHub Pages ist nur für öffentliche Repos gratis) · Rest leer lassen · **Create repository**.
3. **Datei hochladen:** Auf der neuen Repo-Seite den Link **uploading an existing file** anklicken. `index.html` aus `Cowork\Projekte\tv-cast\` ins Fenster ziehen. Unten **Commit changes**.
4. **Pages einschalten:** Im Repo oben **Settings** → links **Pages**.
   Source: `Deploy from a branch` · Branch: `main` · Ordner: `/ (root)` · **Save**.
5. **1 bis 2 Minuten warten**, Seite neu laden. Oben erscheint „Your site is live at“:
   ```
   https://BENUTZERNAME.github.io/tv-cast/
   ```

Die Seite enthält keine persönlichen Daten. Der Verlauf der letzten 10 URLs liegt nur lokal im Chrome des Tablets.

## 2. Tablet einrichten (Chrome Android)

1. **Cast-Seite öffnen:** `https://BENUTZERNAME.github.io/tv-cast/` in Chrome.
2. **Optional aufs Startbildschirm:** **⋮ → Zum Startbildschirm hinzufügen**.
3. **Bookmarklet anlegen:** Auf der Cast-Seite ganz unten **Bookmarklet einrichten** aufklappen, **Code kopieren** tippen.
4. **Lesezeichen setzen:** **⋮ → ☆** (speichert die Cast-Seite als Lesezeichen).
5. **Lesezeichen umbauen:** **⋮ → Lesezeichen** → beim Eintrag „TV-Cast“ **⋮ → Bearbeiten**.
   Name: `TVCast` · URL: komplett löschen, kopierten Code einfügen (beginnt mit `javascript:`) · zurück = gespeichert.

Der Code enthält die Adresse deiner Cast-Seite schon automatisch.

## 3. Benutzen

**Mit Bookmarklet:**
1. **Video-Seite öffnen** und das Video kurz anspielen (damit der Stream-Link geladen ist).
2. **Adressleiste antippen**, `TVCast` tippen, den **Lesezeichen-Vorschlag mit ★** antippen (nicht die Google-Suche). Aus der Lesezeichen-Liste heraus startet Chrome Android Bookmarklets nicht.
3. Bei mehreren Treffern erscheint eine Auswahl. Meist ist der oberste Eintrag richtig.
4. Die Cast-Seite öffnet sich mit der URL. **Auf TV abspielen** → Fernseher wählen. Ist der TV schon verbunden, startet das Video direkt.

**Ohne Bookmarklet:** Video-Link kopieren, Cast-Seite öffnen, **Einfügen** → **Auf TV abspielen**.

**Direktlink:** `https://BENUTZERNAME.github.io/tv-cast/?url=<Video-URL>` (optional `&title=Name`, `&t=Startsekunde`, `&type=hls-fmp4`).

Steuerung auf der Cast-Seite: Play/Pause, ±10 s / ±30 s, Fortschrittsbalken (ziehen = spulen), Lautstärke, Stumm, Stopp, Verbindung trennen. Die letzten 10 URLs stehen unter „Zuletzt verwendet“ (▶ = direkt abspielen).

## 4. Wenn es nicht klappt

| Problem | Lösung |
|---|---|
| „Kein Fernseher gefunden“ | TV einschalten, Tablet im selben WLAN, Chromecast/Google Cast am TV aktiv |
| Kein Cast-Symbol oben rechts | Erscheint nur, wenn ein TV gefunden wurde. „Auf TV abspielen“ geht trotzdem |
| m3u8 lädt nicht am TV | Format auf **HLS / m3u8 (fMP4)** stellen und nochmal |
| Stream lädt am TV nie (CORS) | Der Videoserver erlaubt keine Wiedergabe auf fremden Geräten. Mit dieser Methode nicht lösbar |
| Link funktioniert nur kurz | Signierte Links laufen ab. Bookmarklet direkt vor dem Abspielen nochmal starten |
| „Kein Video-Link gefunden“ | Video erst abspielen, dann Bookmarklet. Steckt der Player in einem fremden Rahmen: „Player-Seite öffnen“ wählen und dort erneut starten |
| Netflix, Disney+, Prime, YouTube | DRM-geschützt bzw. eigenes Protokoll: geht nicht über den Default Media Receiver. Dort den Cast-Button der jeweiligen App nutzen |
| „Hier testen“ spielt ab, TV nicht | Seite verlangt Cookies/Referer. Der TV schickt diese nicht mit, daher nicht lösbar |

## 5. Später ändern

Neue `index.html` im Repo hochladen (**Add file → Upload files**, gleicher Name überschreibt). Das Bookmarklet muss nur neu kopiert werden, wenn sich `bookmarklet.js` geändert hat.
