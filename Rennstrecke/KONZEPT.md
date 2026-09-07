# Konzept: Rennstrecke (Klassenhaustier Kart)

> **Lernspiel für Medienpädagogik & Computational Thinking**  
> *Erweiterung zum Klassenhaustier-Projekt*  
> *Stand: September 2026*

---

## 1. Pädagogische Grundidee & Didaktik

### 1.1 Das Kernproblem: "Welches Links meinst du?"
Im ersten Spiel (*Klassenhaustier*) lernen Kinder:
1. **Sequenz** (Reihenfolge bestimmt den Ablauf)
2. **Präzision** (Ungenaue/falsche Anweisung führt nicht zum Ziel)

Das Spiel **Rennstrecke** baut darauf auf und führt Kinder spielerisch an **Entscheidungsbäume (Binärbäume)**, **Pfad-Adressierung** und **relative vs. absolute Navigation** heran.

### 1.2 Das Aha-Erlebnis im Spielverlauf
1. **Start auf gerader Straße:** Das Kart mit dem Klassentier fährt los.
2. **1. Abzweigung (1 → 2 Wege):**  
   - Einfache Entscheidung: `Links` oder `Rechts` (1 Bit Information).
   - Das Tier biegt brav ab.
3. **2. Abzweigung (2 → 4 Wege) – Der kognitive Konflikt:**  
   - Die Straße spaltet sich erneut auf.
   - Das Kind möchte zu einem bestimmten Ziel (z. B. der goldenen Möhre ganz links außen oder dem Pokal halblinks).
   - **Das Problem:** Ein einfacher Befehl `Links` ist plötzlich **mehrdeutig**!
     - *Meinst du "scharf links" oder "leicht links"?*
     - *Oder meinst du "zuerst links, dann nochmal links" (L → L vs. L → R)?*
4. **Einsicht & Problemlösung:**  
   Kinder erkennen aus eigener Anschauung, dass mit wachsender Verzweigung **präzisere Adressierungs- und Steuerungskonzepte** nötig sind (z. B. Sequenzen L-R, Winkel/Spuren, Baum-Koordinaten oder Farbleitsysteme).

---

## 2. Spielmodi & Altersstufen

### Modus A: Vorab-Streckenplaner (Turn-based / Programmiermodus)
*Vor allem für jüngere Kinder (4–7 Jahre) und ruhige Gruppenarbeit:*
- Die Kamera zeigt die Strecke in einer leicht erhöhten Iso- oder 3D-Verfolgerperspektive.
- Am Ende jedes Zweigs liegt ein Ziel (z. B. Napf, Reifenstapel, Pokal, Möhre, Waschstraße).
- Kinder legen eine Befehlskette (z. B. Karten `[Links]` → `[Rechts]` → `[Scharf Links]`).
- Auf "Start!" fährt das Kart die programmierte Route ab. Bei Fehlern landet man im Heuballen.

### Modus B: Live-Rennen / Reaktionsfahrt ("Mario Kart"-Gefühl)
*Für Kinder ab 6–10 Jahren:*
- Das Kart fährt kontinuierlich vorwärts (angepasste, kindgerechte Geschwindigkeit).
- An jeder Kreuzung nähert sich der Entscheidungspunkt.
- Das Kind muss rechtzeitig die Weiche stellen oder das Lenkrad/Buttons im richtigen Moment betätigen.

---

## 3. Die 4 Progressions-Stufen (Levels)

| Stufe | Verzweigung | Mögliche Pfade | Benötigtes Konzept / Steuerung | Lernziel |
|---|---|---|---|---|
| **Stufe 1** | 1 → 2 | 2 Enden | `Links` / `Rechts` | Binäre Grundentscheidung |
| **Stufe 2** | 2 → 4 | 4 Enden | Sequenz (`L → L`, `L → R`, `R → L`, `R → R`) oder Spur-Wahl (`Ganz links`, `Mitte-Links`, ...) | Erkennen von Mehrdeutigkeit; Zusammengesetzte Anweisungen |
| **Stufe 3** | 4 → 8 | 8 Enden | 3-Schritt-Pfad oder Binärcode / Farbleitsystem | Binärbaum-Verständnis, hierarchische Strukturen |
| **Stufe 4 (Bonus)** | Labyrinth / Weichennetz | Rückführungen & Schleifen | Schleifen / Wiederholungen & Bedingungen | Fortgeschrittenes Computational Thinking |

---

## 4. Visuelles & Spielerisches Design

1. **Protagonisten:**
   - Die Klassentiere (Hund, Katze, Hase, Fuchs) sitzen in kleinen bunten Renn-Karts.
2. **Grafikstil:**
   - Farbenfroh, kontrastreich, "Low-Poly 3D" (Three.js) oder Retro-Arcade Canvas.
   - Klare, gut lesbare Streckenmarkierungen (z. B. farbige Pfeile auf dem Asphalt, Schilderbrücken an den Gabelungen).
3. **Audio / Feedback:**
   - Fröhlicher Motor-Sound (Web Audio API / Synthesizer, keine schweren MP3s).
   - Klares akustisches Feedback beim Abbiegen ("Wusch!"), Jubel beim Erreichen des richtigen Ziels, lustiges "Boing!" bei Sackgassen/Heuballen.

---

## 5. Technische Architektur & Vorgaben

- **Zero-Setup / No-Build:** Reine Web-Technologien (`index.html`, `css/style.css`, `js/app.js`, `js/track.js`, `js/car.js`).
- **Lauffähig ohne Server/Installation:** Direkt mit Doppelklick auf `index.html` oder via einfachem Python-Webserver auf Schulgeräten / Tablets (iPad, Android, Chromebooks).
- **Engine:** Three.js (r128 CDN) mit flüssiger 60 FPS Performance auf schwacher Schulhardware (Low-Tier Heuristik).
- **Eingabemethoden:**
  - Große Touch-Buttons für Tablets
  - Tastatursteuerung (Pfeiltasten, A/D, Leertaste)
  - Kartenleiste für den Programmiermodus

---

## 6. Nächste Schritte zur Umsetzung

1. **Feedback & Abstimmung des Konzepts**
2. **Prototyp-Architektur anlegen** in `Medienpädagogik/Rennstrecke/`
3. **Strecken-Generator für Binärbäume** (mathematische Erzeugung von Straßen mit $2^n$ Verzweigungen)
4. **Steuerungs- und Kameralogik** implementieren
5. **Ziel-Items & Belohnungssystem** integrieren
