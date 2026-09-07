# Medienpädagogik

Sammlung browserbasierter Lernspiele und Unterrichtswerkzeuge für die **Medienpädagogik** –
von Computational Thinking im Grundschulalter bis zum Faktencheck in der Sekundarstufe.

**▶ Direkt im Browser spielen: https://dariusbaktus.github.io/medienpaedagogik/**
Ein Link für alle vier Spiele — zum Verschicken an Kolleginnen, Eltern oder die Klasse.

Alle Projekte laufen ohne Installation, ohne Backend und ohne Login direkt im Browser
(reines HTML/CSS/JavaScript) und sind damit für Klassenräume, Beamer und Tablets geeignet.

---

## Projekte

### 🏎️ [Rennstrecke](Rennstrecke/) — Entscheidungsbäume & Pfad-Adressierung
Kinder lenken ein 3D-Kart durch eine sich verzweigende Strecke (1 → 2 → 4 → 8 Enden).
Ab der zweiten Abzweigung wird der Befehl „links“ mehrdeutig – daraus entsteht die Einsicht,
dass wachsende Verzweigung präzisere Adressierung braucht.
Aufbauend auf *Klassenhaustier*. Siehe auch das [Konzeptpapier](Rennstrecke/KONZEPT.md).

### 🕵️ [Quellen-Detektiv](quellen-detektiv/) — KI-Faktencheck & Linktree
*7.–9. Klasse / 13–15 Jahre.* Jugendliche prüfen einen aufbereiteten Linktree zu einem
Jugendthema auf eingestreute Fehler in KI-Zusammenfassungen, Statistiken und Quellenangaben.
Zeigt, wie subtil generierte Texte danebenliegen können.

### 📱 [TikTok-Detektiv](tiktok-detektiv/) — Alibi-Check & OSINT
*7.–10. Klasse / 12–16 Jahre.* In einer nachgebauten TikTok-Oberfläche (Feed, Profil,
Kommentare, Soundspuren) überprüfen Schülerinnen und Schüler Aussagen und Alibis
von Verdächtigen auf ihren Wahrheitsgehalt.

### 🐹 Klassenhaustier — Präzision & Sequenz
*4–10 Jahre.* Kinder legen Symbolkarten in eine Reihe, das virtuelle Haustier führt die
Sequenz exakt so aus, wie sie gelegt wurde. Ungenaue Anweisung = sichtbar falsches Ergebnis.

> Dieses Projekt liegt in einem eigenen Repository:
> **[Dariusbaktus/klassenhaustier](https://github.com/Dariusbaktus/klassenhaustier)**

---

## Starten

Ein lokaler Webserver genügt – die Projekte greifen per `fetch`/Module auf eigene Dateien zu:

```bash
python3 -m http.server 8000
```

Danach im Browser `http://localhost:8000/quellen-detektiv/` (bzw. `Rennstrecke/`,
`tiktok-detektiv/`) öffnen.

---

## Struktur

```
Medienpädagogik/
├── Rennstrecke/         # 3D-Kart, Entscheidungsbäume (three.js)
├── quellen-detektiv/    # KI-Faktencheck, Linktree-Szenarien
└── tiktok-detektiv/     # OSINT-Faktencheck in TikTok-Optik
```

Jedes Projekt hat ein eigenes `README.md` mit didaktischem Ablauf und technischen Details.
