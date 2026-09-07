# 🕵️‍♂️ TikTok-Detektiv: Alibi-Check & OSINT-Faktencheck

Ein interaktives Web-Tool für den **Medienpädagogik-Unterricht** (Schulstufe: 7.–10. Klasse / Alter 12–16 Jahre). 

Schülerinnen und Schüler schlüpfen in die Rolle von **Social-Media-Detektiven**: Anhand einer realistischen **TikTok-Benutzeroberfläche** (Smartphone-Frame, Feed, Profil, Kommentare, Soundspuren) überprüfen sie Aussagen und Alibis von Verdächtigen auf ihren Wahrheitsgehalt.

---

## 🎯 Pädagogisches Ziel & Konzept

Jugendliche verbringen viel Zeit auf Video-Plattformen wie TikTok, Instagram Reels oder YouTube Shorts. Häufig ist ihnen jedoch unbewusst:
1. **Digitale Fußspuren & OSINT (Open Source Intelligence):** Wie viele unbeabsichtigte Informationen in scheinbar harmlosen Videos stecken (z. B. Reflexionen in Brillen oder Fenstern, Schattenwinkel, Steckdosentypen, WLAN-SSIDs in Screenshots, Umgebungsgeräusche).
2. **Kritisches Hinterfragen von Social-Media-Inhalten:** Nicht jede Orts- oder Zeitangabe in Captions entspricht der Realität (Inszenierung, Fake-Urlaube, alte Aufnahmen).
3. **Privatsphäre & Selbstschutz:** Das Spiel sensibilisiert Jugendliche dafür, vor dem Posten eigener Videos darauf zu achten, welche sensiblen Daten über den eigenen Standort oder Tagesablauf sichtbar sind.

---

## 🚀 Schnelleinstieg & Nutzung

Das Spiel läuft **100% client-side im Webbrowser** (keine Installation, kein Node.js, keine Accounts oder Cookies nötig):

1. Öffne die `index.html` direkt im Browser (Chrome, Safari, Firefox, Edge).
2. Das Spiel funktioniert hervorragend auf:
   - **Schüler-iPads & Tablets**
   - **Laptops / Desktop-PCs**
   - **Smartboards & Beamer** im Plenum / Gruppenarbeit.

---

## 🎮 Spielablauf

1. **Fall-Akte lesen:** Der Vorfall und die 1–2 offiziellen Behauptungen der verdächtigen Person werden vorgestellt (z. B. *„Ich war bei meiner Oma in Hamburg und hatte kein Netz“*).
2. **TikTok-Kanal untersuchen:** 
   - Zwischen **Feed** und **Profil** wechseln.
   - Auf **Lupen-Pins 🔍** im Video klicken, um Hintergrunddetails, Steckdosen, Wetter oder Spiegelungen zu untersuchen.
   - Auf die **Vinyl-Platte 🎵** klicken, um Umgebungsgeräusche (z. B. Berliner U-Bahn-Ansage, Martinshorn, Drohnenfunk) anzuhören.
   - Auf die **Kommentare 💬** tippen, um Zeugenaussagen von Freunden zu lesen.
3. **Beweise anheften:** Wichtige Indizien per Klick an Aussage 1 oder Aussage 2 anheften.
4. **Urteil fällen:** Entscheiden, ob die Aussage eine Lüge oder die Wahrheit ist.
5. **Abschluss & Reflexion:** Sterne-Bewertung, Rang (*Meister-OSINT-Analyst*) und medienpädagogisches Debriefing.

---

## 📚 Enthaltene Beispielfälle

### 1. 🦁 Der Farb-Streich im Lehrerzimmer
- **Thema:** Schulstreich & Alibi-Widerlegung
- **OSINT-Elemente:** 
  - *Reflexion:* Gelbe Berliner Tram *M10* spiegelt sich im Fenster (trotz angeblichem Hamburg-Besuch).
  - *Wetter:* Sonnenschein & Westschatten statt Hamburger Dauerregen.
  - *Statusleiste:* Im Screenshot ist das Schul-WLAN *Schule_Gast_5G* aktiv.
  - *Audio:* Berliner U-Bahn-Gong (*Eberswalder Straße*).
  - *Kontinuität:* Der angeblich verlorene gelbe Hoodie wurde vor 2 Tagen noch getragen.

### 2. ✨ Das gefälschte Dubai-Luxus-Giveaway
- **Thema:** Influencer-Fakes & Fake-Gewinnspiele
- **OSINT-Elemente:**
  - *Infrastruktur:* Deutsche Schuko-Steckdose (Typ F) an der Wand statt britischem 3-Pin (Typ G in den VAE).
  - *Vegetation:* Mitteleuropäische Eichenblätter im Wind.
  - *Rechnung:* Quittung mit 19% deutscher MwSt. von vor 6 Monaten.
  - *Spiegelung:* Uhrenglas spiegelt Logo eines Frankfurter Flughafen-Hotels.
  - *Audio:* Deutsches Polizei-Martinshorn im Hintergrund.

### 3. ⚡️ Der Drohnen-Vorfall im Vogelschutzgebiet
- **Thema:** Umweltschutz, Geodaten & Technik
- **OSINT-Elemente:**
  - *Landmarke:* Historischer achteckiger Wasserturm des Naturschutzgebiets *Moosbruch*.
  - *Sonnenstand:* Kurzer Schattenwurf exakt nach Norden (11:30 Uhr Sonnenhöchststand).
  - *Spuren:* Drohne mit frischem Schlamm an Finns Rucksack befestigt.
  - *Audio:* Telemetrie-Stimme meldet GPS-Fix *Moosbruch Süd*.

---

## 🛠️ Fall-Editor & Eigene Szenarien

Lehrkräfte können bestehende Fälle als **JSON exportieren**, anpassen oder neue Fälle erstellen und per Klick auf **📂 Import** direkt im Unterricht einbinden.

---

## 📂 Dateistruktur

```
tiktok-detektiv/
├── index.html              # Haupt-Benutzeroberfläche (Smartphone-Feed + Detective-Desk)
├── css/
│   ├── style.css           # Layout, Detective-Board, Inspector-Modal & Feedback-Karten
│   └── tiktok-ui.css       # Pixel-genaue Nachbildung der TikTok-Smartphone-App
├── js/
│   ├── cases.js            # Fälle-Datenbank mit Hotspots, Audio-Cues & Lösungen
│   ├── video-renderer.js   # Interaktiver Canvas/SVG-Szenen-Renderer mit Lupen-Pins
│   ├── detective-board.js  # Beweis-Manager, Notizblock & Urteils-Auswertung
│   ├── editor.js           # JSON-Export & Import-System
│   └── app.js              # State-Management, Navigation & Web-Audio-Synthesizer
└── README.md               # Dokumentation & Unterrichts-Leitfaden
```
