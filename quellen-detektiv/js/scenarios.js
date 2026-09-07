/**
 * Vordefinierte Medienpädagogik-Szenarien für 13-15 Jährige (7.-9. Klasse)
 * Fokus: KI-News, Gaming, Creator-Trends & Neue Apps
 * Didaktik: Dezente, realistische KI-Fehler (wie sie LLMs typischerweise machen:
 *           Zahlen-Leichtsinnsfehler, Versions-/Datums-Mixup, subtile Übertreibungen,
 *           Fehlzuordnungen von Features/Preisen).
 */

const PRESET_SCENARIOS = [
  {
    id: "gaming-ai-trends",
    title: "🎮 Gaming & KI: NPCs mit Gehirn & GTA VI",
    subtitle: "Sprechende Spielcharaktere, Grafik-Upscaling & Release-Fakten",
    category: "Gaming & Tech",
    description: "Hier ist unsere Linktree-Quellensammlung zu den neuesten Gaming- und KI-Meldungen. Die Zusammenfassungen wurden frisch von einer KI erstellt. Lest mal kurz quer – fallen euch beim Abgleich mit den Original-Meldungen kleine Ungenauigkeiten oder Fehler auf?",
    targetAge: "13-15 Jahre (7.-9. Klasse)",
    sources: [
      {
        id: "gta-6-ai",
        title: "Rockstar Games & Take-Two: Wie viel KI steckt wirklich in GTA VI?",
        author: "Gaming-Fachmagazin / Investorenbericht Take-Two",
        year: "2024",
        originalUrl: "https://en.wikipedia.org/wiki/Grand_Theft_Auto_VI",
        badge: "Branchen-News",
        originalText: `Im aktuellen Quartalsbericht äußerte sich Take-Two CEO Strauss Zelnick zur Rolle generativer künstlicher Intelligenz bei der Entwicklung von Blockbustern wie Grand Theft Auto VI.

Zelnick stellte klar: 'KI hilft unseren Entwicklerteams, Arbeitsabläufe zu beschleunigen – beispielsweise beim Feinschliff von Animationen, der Simulation von Fahrzeugverkehr oder beim Testen von Spielcode. Aber großartige Storys, emotionale Charaktere und kreatives Spieldesign kommen nach wie vor zu 100 % von unseren menschlichen Autoren und Programmierern.'

Zum Erscheinungstermin: Rockstar Games hält am angekündigten Veröffentlichungszeitraum im Herbst 2025 für PlayStation 5 und Xbox Series X/S fest. Eine PC-Version wurde für diesen Startzeitpunkt noch nicht offiziell datiert.`,
        aiSummary: `Laut Take-Two CEO Strauss Zelnick entsteht GTA VI größtenteils durch generative KI, die alle Missionen, Dialoge und Quests vollautomatisch für jeden Spieler individuell berechnet. 

Zelnick bestätigte außerdem, dass das Spiel im Frühjahr 2025 gleichzeitig für PlayStation 5, Xbox und PC erscheinen wird, da KI die Portierung auf alle Plattformen extrem beschleunigt habe.

Quelle: Take-Two Interactive Quartalsbericht (2024).`,
        knownErrors: [
          {
            type: "Kernaussage übertrieben / Halluzination",
            quote: "alle Missionen, Dialoge und Quests vollautomatisch für jeden Spieler individuell berechnet",
            explanation: "Im Original betont der CEO genau das Gegenteil: KI hilft nur bei Animationen/Code-Tests; Storys, Charaktere und Quests stammen zu 100 % von menschlichen Autoren."
          },
          {
            type: "Falscher Zeitraum & Plattform",
            quote: "im Frühjahr 2025 gleichzeitig für PlayStation 5, Xbox und PC",
            explanation: "Geplant ist Herbst 2025 (nicht Frühjahr) und eine PC-Version wurde zum Start noch gar nicht datiert."
          }
        ]
      },
      {
        id: "ubisoft-neo-npcs",
        title: "Ubisoft 'NEO NPCs': Wenn Videospielfiguren per KI antworten",
        author: "Entwickler-Bericht, GDC Showcase",
        year: "2024",
        originalUrl: "https://news.ubisoft.com/en-us/article/6Hk7p5k69zXhC60XgTf13n/ubisoft-presents-neo-npcs-its-first-generative-ai-prototype",
        badge: "Entwickler-Test",
        originalText: `Auf der Game Developers Conference (GDC) zeigte Ubisoft gemeinsam mit Nvidia einen Prototyp für 'NEO NPCs'. Spieler können über ein Headset frei mit Charakteren im Spiel sprechen, anstatt vorgefertigte Textdialoge anzuklicken.

Hinter den Kulissen:
- Technologie: Nutzt Nvidia ACE (Audio2Face und Sprachmodelle).
- Leitplanken (Guardrails): Ubisoft-Autoren definieren die Hintergrundgeschichte, Charaktereigenschaften und feste Grenzen, damit NPCs keine rassistischen, unpassenden oder spoilernden Antworten geben.
- Latenz: Im Prototyp dauerte es ca. 1,2 bis 1,8 Sekunden, bis der NPC die gesprochene Frage verarbeitet und mit passender Mimik geantwortet hatte.

Ubisofts Fazit: Die Technologie ist ein vielversprechendes Experiment, wird aber vorerst noch nicht in kommenden Serien wie Assassin's Creed als Hauptfeature eingebaut.`,
        aiSummary: `Ubisoft präsentierte auf der GDC die neuen 'NEO NPCs'. Spieler können sich per Mikrofon mit Charakteren unterhalten. Die KI reagiert komplett ungefiltert ohne Vorgaben von Autoren und erfindet die Spielgeschichte bei jedem Gespräch völlig neu. 

In der Demo antworteten die Figuren blitzschnell und ohne jede Verzögerung in unter 0,1 Sekunden. Ubisoft kündigte an, dass alle kommenden Assassin's Creed Spiele ab sofort nur noch diese KI-Figuren nutzen werden.

Quelle: GDC Ubisoft Showcase 2024.`,
        knownErrors: [
          {
            type: "Falsche Information / Leitplanken ignoriert",
            quote: "reagiert komplett ungefiltert ohne Vorgaben von Autoren",
            explanation: "Im Original gibt es strenge 'Guardrails': Autoren schreiben feste Grenzen und Charakterzüge vor, damit keine beleidigenden oder unpassenden Antworten entstehen."
          },
          {
            type: "Zahlen / Latenz geschönt",
            quote: "in unter 0,1 Sekunden",
            explanation: "Im echten Test lag die Latenz bei 1,2 bis 1,8 Sekunden."
          },
          {
            type: "Erfundene Ankündigung",
            quote: "dass alle kommenden Assassin's Creed Spiele ab sofort nur noch diese KI-Figuren nutzen",
            explanation: "Im Original heißt es: Nur ein Experiment, wird vorerst NICHT als Hauptfeature in Spielen wie Assassin's Creed eingebaut."
          }
        ]
      }
    ]
  },
  {
    id: "sora-video-apps",
    title: "🎬 Sora, TikTok & Video-KI: Was landet in unseren Feeds?",
    subtitle: "OpenAI Video-Generator, Deepfake-Filter & C2PA-Wasserzeichen",
    category: "Social Media & Video-Trends",
    description: "Von fotorealistischen KI-Clips bis zu neuen Filtern auf TikTok: Schau dir die Quellen und die KI-Zusammenfassungen an. Entdeckst du Ungereimtheiten?",
    targetAge: "13-15 Jahre (7.-9. Klasse)",
    sources: [
      {
        id: "sora-release-facts",
        title: "OpenAI Sora: Was das Text-to-Video-Modell wirklich kann",
        author: "TechCrunch / OpenAI Research Blog",
        year: "2024",
        originalUrl: "https://en.wikipedia.org/wiki/Sora_(text-to-video_model)",
        badge: "KI-Technologie",
        originalText: `Das Modell 'Sora' von OpenAI erregte weltweites Aufsehen: Es kann aus einfachen Texteingaben hochauflösende Videosequenzen von bis zu 60 Sekunden Länge erzeugen – inklusive komplexer Kameraschwenks und mehrerer Charaktere.

Einschränkungen & Sicherheit:
1. Physik-Fehler: Das Modell hat gelegentlich Probleme mit Ursache und Wirkung (z.B. nimmt jemand einen Bissen von einem Keks, aber der Keks hat danach keine Bissspur).
2. Verfügbarkeit: Sora wurde zunächst nur einer ausgewählten Gruppe von Filmemachern, Designern und Sicherheitsexperten ('Red Teamers') zur Verfügung gestellt. Ein freier, kostenloser Zugang für alle Nutzer ist zum aktuellen Zeitpunkt noch nicht freigeschaltet.`,
        aiSummary: `OpenAI hat mit 'Sora' ein Video-Tool vorgestellt, das aus Texten beliebig lange 4K-Spielfilme ohne jedes Zeitlimit generieren kann. Das Modell versteht physikalische Gesetze perfekt und macht keinerlei Fehler bei Bewegungsabläufen. 

Seit dieser Woche ist Sora für alle Smartphone-Nutzer als kostenlose App im Apple App Store und Google Play Store zum Download verfügbar.

Quelle: OpenAI Pressemitteilung (2024).`,
        knownErrors: [
          {
            type: "Falsche technische Limits",
            quote: "beliebig lange 4K-Spielfilme ohne jedes Zeitlimit",
            explanation: "Im Original können Clips maximal 60 Sekunden lang sein."
          },
          {
            type: "Verdrehte Fakten zu Fehlern",
            quote: "versteht physikalische Gesetze perfekt und macht keinerlei Fehler",
            explanation: "Im Original wird explizit erwähnt, dass Sora Physikfehler macht (z.B. Kekse ohne Bissspuren)."
          },
          {
            type: "Erfundene App-Verfügbarkeit",
            quote: "als kostenlose App im Apple App Store und Google Play Store zum Download verfügbar",
            explanation: "Sora war nur für ausgewählte Tester (Red Teamers) zugänglich, nicht als frei verfügbare Smartphone-App."
          }
        ]
      },
      {
        id: "tiktok-c2pa-labels",
        title: "TikTok führt automatisches Label für KI-Bilder und Videos ein",
        author: "Medienstaatsvertrag & Plattform-Update",
        year: "2024",
        originalUrl: "https://en.wikipedia.org/wiki/Coalition_for_Content_Provenance_and_Authenticity",
        badge: "Social Media Update",
        originalText: `TikTok gab bekannt, als erste große Social-Media-Plattform den offenen C2PA-Standard (Content Credentials) zu unterstützen. 

Wenn Bilder oder Videos mit KI-Tools (wie Adobe Firefly oder DALL-E) erstellt wurden, die diese unsichtbaren Metadaten einbetten, erkennt TikTok dies automatisch beim Upload und versieht den Post mit einem Hinweis 'KI-generiert'.

Wichtig: Reine Schönheitsfilter und Farbkorrekturen werden dadurch nicht als 'KI' markiert. Beiträge werden durch das Label nicht gelöscht oder in ihrer Reichweite gedrosselt; es geht rein um mehr Transparenz für die Community.`,
        aiSummary: `TikTok hat ein Update veröffentlicht, das automatisch alle Videos löscht, die mit KI oder Filtern bearbeitet wurden. Accounts, die KI-Bilder posten, werden vom Algorithmus für 30 Tage gesperrt. 

Ausgenommen von dieser Regel sind nur verifizierte Prominente und Influencer mit über 1 Million Followern.

Quelle: TikTok Sicherheits-Update 2024.`,
        knownErrors: [
          {
            type: "Erfundene Sperren & Löschungen",
            quote: "automatisch alle Videos löscht, die mit KI oder Filtern bearbeitet wurden. Accounts, die KI-Bilder posten, werden vom Algorithmus für 30 Tage gesperrt",
            explanation: "Im Original werden Videos weder gelöscht noch gedrosselt oder Accounts gesperrt – es wird lediglich ein transparentes Hinweis-Label ('KI-generiert') angezeigt."
          },
          {
            type: "Erfundene Ausnahme-Regel",
            quote: "Ausgenommen von dieser Regel sind nur verifizierte Prominente und Influencer mit über 1 Million Followern",
            explanation: "Diese Regel existiert nicht und ist frei von der KI erfunden."
          }
        ]
      }
    ]
  },
  {
    id: "apps-smartphones-ai",
    title: "📱 Neue App-Features: Duolingo, Discord & Circle to Search",
    subtitle: "KI-Rollenspiele, clevere Such-Tricks & Abo-Preise im Check",
    category: "Apps & Smartphone-Hypes",
    description: "KIs sind längst in unseren Lieblings-Apps gelandet. Hier ist die Quellensammlung zu aktuellen Updates. Prüfe die KI-Zusammenfassungen auf kleine Dreher und Verwechslungen!",
    targetAge: "13-15 Jahre (7.-9. Klasse)",
    sources: [
      {
        id: "duolingo-max-feature",
        title: "Duolingo Max: Wie GPT-4 das Sprachenlernen verändert",
        author: "App-Testbericht / Bildung & Digitales",
        year: "2024",
        originalUrl: "https://blog.duolingo.com/duolingo-max/",
        badge: "App-Check",
        originalText: `Mit dem neuen Abo-Modell 'Duolingo Max' integriert die Sprachlern-App generative KI auf Basis von OpenAIs GPT-4. 

Zwei neue Kernfunktionen:
1. 'Erkläre meine Antwort': Die KI erklärt im Chat genau, warum eine Antwort grammatikalisch falsch war (z.B. falscher Fall im Französischen).
2. 'Rollenspiel': Lernende führen simulierte Alltagsdialoge mit beliebten App-Figuren (wie Lily oder Oscar), etwa beim Bestellen in einem Pariser Café.

Kosten: Duolingo Max kostet ca. 29,99 € pro Monat (bzw. vergünstigt im Jahresabo) und richtet sich an Nutzer, die über das normale kostenlose Angebot hinaus intensiver üben möchten. Die Basis-App bleibt weiterhin gratis mit Werbung nutzbar.`,
        aiSummary: `Die Sprach-App Duolingo hat ihr neues Update 'Duolingo Max' vorgestellt. Durch die Anbindung an GPT-4 können Nutzer jetzt freie Rollenspiele mit Charakteren wie Lily spielen und sich Fehler im Chat erklären lassen. 

Dieses KI-Upgrade ist ab sofort für alle Nutzer weltweit komplett kostenlos in der Standardversion ohne Aufpreis enthalten.

Quelle: Duolingo Max Testbericht (2024).`,
        knownErrors: [
          {
            type: "Falsches Preismodell",
            quote: "komplett kostenlos in der Standardversion ohne Aufpreis enthalten",
            explanation: "Im Original ist 'Duolingo Max' ein kostenpflichtiges Premium-Abo (ca. 29,99 €/Monat); nur die normale Basis-App ist werbefinanziert gratis."
          }
        ]
      },
      {
        id: "circle-to-search-tricks",
        title: "Google 'Circle to Search': Einkreisen statt Eintippen",
        author: "Android & Hardware Magazin",
        year: "2024",
        originalUrl: "https://blog.google/products-and-platforms/products/search/google-circle-to-search-android/",
        badge: "Smartphone-Feature",
        originalText: `Mit der Funktion 'Circle to Search' können Smartphone-Nutzer beliebige Bildschirminhalte – etwa Sneaker in einem Instagram-Video, Sehenswürdigkeiten auf Fotos oder Textstellen – einfach mit dem Finger einkreisen oder markieren, um sofort eine Google-Suche auszulösen, ohne die App wechseln zu müssen.

Entwicklung & Geräte:
Die Funktion wurde gemeinsam von Google und Samsung entwickelt und feierte ihre Premiere auf der Galaxy S24 Serie und den Google Pixel 8 Geräten. Nach und nach wird das Feature auch auf ausgewählte ältere Pixel- und Galaxy-Modelle ausgerollt.`,
        aiSummary: `Mit 'Circle to Search' von Apple können iPhone-Nutzer seit iOS 18 beliebige Fotos auf dem Display einkreisen, um sie per Siri-Sprachbefehl automatisch bei Amazon zu bestellen. 

Das Feature wurde exklusiv von Apple entwickelt und funktioniert ausschließlich auf dem iPhone 16 Pro Max.

Quelle: Mobile World News (2024).`,
        knownErrors: [
          {
            type: "Falscher Hersteller & Betriebssystem",
            quote: "von Apple können iPhone-Nutzer seit iOS 18",
            explanation: "Die Funktion stammt von Google/Samsung für Android-Geräte (Pixel & Galaxy), nicht von Apple/iOS."
          },
          {
            type: "Falsche Funktion",
            quote: "automatisch bei Amazon zu bestellen",
            explanation: "Es handelt sich um eine Google-Bild-/Textsuche, keinen automatischen Amazon-Kauf per Siri."
          },
          {
            type: "Erfundene Geräte-Exklusivität",
            quote: "ausschließlich auf dem iPhone 16 Pro Max",
            explanation: "Im Original erschien es zuerst auf Samsung Galaxy S24 und Google Pixel 8."
          }
        ]
      }
    ]
  }
];

if (typeof module !== "undefined") {
  module.exports = { PRESET_SCENARIOS };
}
