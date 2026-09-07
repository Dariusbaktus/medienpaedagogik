# Rennstrecke (Klassenhaustier Kart)

Browserbasiertes Lernspiel für Kinder (Medienpädagogik & Computational Thinking), das das Prinzip von **Entscheidungsbäumen (Binärbäumen)**, **Pfad-Adressierung** und **Präzision** vermittelt.

---

## 🏎️ Pädagogische Kernidee

Im Spiel lenken Kinder ein 3D-Kart mit ihrem Klassentier durch eine sich verzweigende Rennstrecke ($1 \rightarrow 2 \rightarrow 4 \rightarrow 8$ Enden).

- **Stufe 1 ($1 \rightarrow 2$):** An einer einzelnen Gabelung reicht ein einfaches `Links` oder `Rechts` (1 Bit Information).
- **Stufe 2 ($2 \rightarrow 4$):** Die Straße gabelt sich erneut. Wenn das Ziel z. B. der Pokal halblinks ist, führt ein einfaches "Fahr links" nicht zwingend zum Ziel – denn zwei Wege biegen nach links ab! Kinder erkennen, dass sie eine **2er-Sequenz** (z. B. `Links ➔ Rechts`) angeben müssen.
- **Stufe 3 ($4 \rightarrow 8$):** Voller 3-Stufen-Binärbaum mit 8 individuellen Zielen (Möhre 🥕, Pokal 🏆, Apfel 🍎, Knochen 🦴, Stern ⭐ etc.).

---

## 🚀 Starten

Kein Build-Schritt oder `npm install` nötig!

1. Öffne die `index.html` direkt im Webbrowser (z. B. Chrome, Safari, Firefox, Edge) oder
2. Starte einen einfachen Webserver im Ordner:

```bash
python3 -m http.server 8124
```

Danach im Browser aufrufen: `http://localhost:8124`

---

## 📁 Dateistruktur

```
Medienpädagogik/Rennstrecke/
├── KONZEPT.md      # Ausführliches pädagogisches Konzept
├── README.md       # Projektübersicht & Startanleitung
├── index.html      # 3D-Canvas, Benutzeroberfläche & HUD
├── css/
│   └── style.css   # Touch-Layout, Farbschema & Karten-Animationen
└── js/
    ├── app.js      # Hauptanwendung, Web Audio Synthesizer & Missionen
    ├── track.js    # Prozedurale Generierung von Binärbaum-Straßen & 3D-Items
    └── car.js      # Low-Poly Kart, Klassentier-Modell & Spline-Wegfindung
```

---

## 🎮 Steuerung

- **Touch / Maus:** Große Buttons für `⬅️ Links`, `Rechts ➡️`, `🗑️ Löschen` und `🚀 LOS!`
- **Tastatur:**
  - `A` oder `Pfeil Links` = Links-Karte hinzufügen
  - `D` oder `Pfeil Rechts` = Rechts-Karte hinzufügen
  - `Leertaste` oder `Enter` = Kart starten
- **Kamera-Button:** Wechsel zwischen dynamischer 3D-Verfolgerperspektive und übersichtlicher Vogelperspektive.
