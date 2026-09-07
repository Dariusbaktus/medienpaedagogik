# 🕵️‍♂️ Quellen-Detektiv: KI-FactCheck & Linktree

Ein interaktives Web-Tool für den **Medienpädagogik-Unterricht** (Schulstufe: 7.–9. Klasse / Alter 13–15 Jahre), das Jugendlichen spielerisch zeigt, warum man KI-Zusammenfassungen, Statistiken und Quellenangaben niemals blind vertrauen darf.

---

## 🎯 Pädagogisches Ziel & Konzept

KIs (wie ChatGPT, Perplexity oder Copilot) klingen fast immer extrem überzeugend und eloquent – erfinden jedoch regelmäßig Zahlen, zitieren falsche Studien oder verdrehen Aussagen (*Halluzinationen*).

In diesem Projekt schlüpfen Schülerinnen und Schüler in die Rolle von **KI-Detektiven**:
1. **Linktree-Übersicht**: Die Klasse erhält einen aufbereiteten Linktree zu einem spannenden Jugendthema (z.B. *TikTok & Dopamin*, *Gaming-Mythen*, *KI & Deepfakes*).
2. **Abgleich & Detektiv-Modus**: Zu jeder Quelle gibt es den echten Originaltext und die angebliche KI-Zusammenfassung mit Quellenangabe.
3. **Fehler-Jagd**: Schüler markieren verdächtige Textstellen direkt per Maus/Touchscreen, wählen die Art des Fehlers (z.B. *Zahlen verdreht*, *Erfundene Aussage*, *Falscher Autor*) und notieren die Richtigstellung.
4. **Auswertung & Klassengespräch**: Ob 3, 5 oder keine Fehler gefunden wurden – in der gemeinsamen Reflexion wird sichtbar, wie subtil KI Fehler einstreut und wie wichtig eigener Faktencheck ist.

---

## 🚀 Schnelleinstieg & Nutzung

Das Tool läuft **vollständig im Webbrowser** (client-side, keine Installation oder Server nötig):

1. Öffne die `index.html` direkt im Browser (z.B. Chrome, Safari, Firefox, Edge) oder hoste den Ordner auf Schulservern / GitHub Pages.
2. Wähle ein fertiges Unterrichts-Szenario oder nutze den **Lehrer-Editor**, um ein eigenes Thema anzulegen.

---

## 📚 Vordefinierte Unterrichts-Szenarien

- **📱 TikTok, Dopamin & Aufmerksamkeitsspanne**:
  - *Fehler:* Verdrehte Stundenzahlen (4 Std. statt 95 Min.), erfundene Hirnschäden (obwohl Studie dies verneint), falsche Co-Autoren & Gesetzes-Halluzinationen.
- **🎮 Gaming & E-Sports: Macht Zocken dumm oder schlau?**:
  - *Fehler:* Zehnfach verkleinerte Stichprobengröße (3.800 statt 38.935 Teilnehmer), erfundene Notenverbesserungen und umgedrehte Kernaussagen.
- **🤖 KI, Deepfakes & Wahrheit im Netz**:
  - *Fehler:* Gefährliche Falschtipps bei Stimmen-Klon-Anrufen (Spoofing) und erfundene Pauschal-Bußgelder von 50.000 €.

---

## 🛠️ Funktionen im Überblick

- **Modernes Linktree-Layout**: Kacheln, Badges und Statusanzeigen („Noch ungeprüft“ vs. „Fehler markiert“).
- **Side-by-Side Inspektor**: Echter Originaltext links, KI-Zusammenfassung rechts.
- **Interaktiver Text-Marker**: Schnelles Auswählen von Textpassagen mit Kategorien-Popover.
- **Protokoll & Druckansicht**: Zusammenfassung aller Funde für Hausaufgaben oder Referate.
- **Auflösungs-Modus**: Aufdecken der tatsächlich eingebauten KI-Fallen zum Unterrichtsabschluss.
- **Lehrer-Editor & JSON-Export**: Erstellen eigener Szenarien mit Import-/Export-Funktion.

---

## 📂 Dateistruktur

```
quellen-detektiv/
├── index.html          # Web-App Benutzeroberfläche
├── css/
│   └── style.css       # Responsives Dark/Modern-Design für Tablets & Desktop
├── js/
│   ├── scenarios.js    # Presets, Quellentexte und Musterlösungen
│   ├── detector.js     # Text-Highlighting & Fehler-Engine (LocalStorage)
│   ├── editor.js       # Editor für Lehrkräfte & JSON-Import/Export
│   └── app.js          # App-Logik, Routing & Events
└── README.md           # Handreichung & Dokumentation
```
