/**
 * TikTok-Detektiv: Alibi-Check
 * Fälle-Datenbank (Didaktisch geprüfte Fälle mit logischen Hinweisen & Beweisketten)
 */

window.TIKTOK_CASES = [
  {
    id: "case-farbstreich",
    title: "Der Farb-Streich im Lehrerzimmer",
    category: "Schulalltag & OSINT-Grundlagen",
    difficulty: "Einfach",
    badge: "🕵️‍♂️ Schul-Detektiv",
    summary: "Am Dienstag um 15:30 Uhr wurde das Lehrerzimmer mit Konfetti und gelber Kreidespray-Farbe dekoriert. Die Überwachungskamera zeigte eine Person im auffälligen gelben Hoodie mit Skater-Patch und weiß-roten Sneakern.",
    suspect: {
      name: "Leo Weber",
      handle: "@leo.vibez",
      avatar: "🦁",
      avatarColor: "#ff9f43",
      bio: "📍 Berlin | Skate & Chillen 🛹 | No DMs | Daily Vlogs & Outfits",
      followers: "3.4K",
      following: "284",
      likes: "48.2K",
      verified: false
    },
    incidentTime: "Dienstag, 24. Oktober, 15:30 Uhr",
    incidentLocation: "Schulgebäude, Flur B / Lehrerzimmer",
    statements: [
      {
        id: "stmt-1",
        claim: "„Ich war gestern ab 14:00 Uhr bis abends bei meiner Oma in Hamburg-Bergedorf und hatte dort im Keller kein Internet.“",
        isLie: true,
        contradictionReason: "Die gelbe Berliner Straßenbahn M10 in der Fensterspiegelung, die Berliner U-Bahn-Ansage (Eberswalder Str.), der Sonnenschein statt Hamburger Dauerregen und das aktive Schul-WLAN im Screenshot beweisen zweifelsfrei, dass Leo in Berlin an der Schule war.",
        requiredClues: ["clue-tram-reflection", "clue-audio-subway", "clue-wifi-screenshot", "clue-sun-weather"]
      },
      {
        id: "stmt-2",
        claim: "„Meinen gelben Hoodie habe ich schon vor zwei Wochen verloren und trage seitdem nur noch schwarze Jacken.“",
        isLie: true,
        contradictionReason: "In seinem Spiegelselfie-Video von vor nur 2 Tagen trägt er stolz genau diesen gelben Hoodie mit dem rot-blauen Skater-Patch am Ärmel.",
        requiredClues: ["clue-hoodie-patch"]
      }
    ],
    videos: [
      {
        id: "vid-1",
        title: "Tee & Chillout am Fenster ☕️",
        postedAt: "Gestern, ca. 16:15 Uhr",
        views: "1.2K",
        likes: "342",
        commentsCount: "3",
        shares: "14",
        music: "Lofi Beats - Autumn Vibe 🍂",
        caption: "Grüße aus dem Norden bei Oma 🍵 #chill #hamburg #vibe #cozy #teatime",
        sceneType: "window_berlin",
        audioTrack: {
          type: "subway",
          label: "🎧 U-Bahn-Ansage im Hintergrund",
          text: "🔊 Tonspur: Im Hintergrund ertönt der Berliner BVG-Gong: „Nächste Station: Eberswalder Straße – Übergang zur U2“. Das beweist eindeutig den Standort Berlin!"
        },
        hotspots: [
          {
            id: "clue-tram-reflection",
            x: 70,
            y: 36,
            width: 26,
            height: 25,
            label: "Fensterspiegelung (BVG M10)",
            description: "🔍 Reflexion im Fenster: In der Glasscheibe spiegelt sich die gelbe Straßenbahn der Linie ‚M10 Warschauer Straße‘ – eine Berliner Tram-Linie!",
            category: "Reflexion & Landmarke",
            relevance: "Widerlegt Aussage 1 (Ort: Berlin statt Hamburg)"
          },
          {
            id: "clue-sun-weather",
            x: 20,
            y: 15,
            width: 32,
            height: 22,
            label: "Sonnenschein & Schatten",
            description: "☀️ Wetter-Abgleich: Durchs Fenster fällt tief stehende Herbstsonne aus Westen. Der amtliche Wetterbericht für Hamburg meldete an diesem Nachmittag Dauerregen und dichten Nebel.",
            category: "Wetter & Licht",
            relevance: "Widerlegt Aussage 1 (Wetter passt nicht zu Hamburg)"
          }
        ],
        comments: [
          { user: "sammy_030", text: "Bro warum bist du nicht ans Handy gegangen als du um 15:20 Uhr am Schultor vorbeigerannt bist? 😂", time: "Gestern 16:30 Uhr", isSus: true },
          { user: "leo.vibez", text: "@sammy_030 war doch gar nicht da bro 🤫 war bei oma haha", time: "Gestern 16:35 Uhr", isAuthor: true },
          { user: "mia_dance", text: "Schöne Tasse! Wo gibt's die?", time: "Gestern 17:00 Uhr" }
        ]
      },
      {
        id: "vid-2",
        title: "Story-Screenshot: Angeblich kein Empfang",
        postedAt: "Gestern, 14:45 Uhr",
        views: "890",
        likes: "120",
        commentsCount: "1",
        shares: "2",
        music: "Originalton - @leo.vibez",
        caption: "Wenn man bei Oma im Funkloch sitzt 💀 #nophone #offline #bored",
        sceneType: "phone_screenshot",
        hotspots: [
          {
            id: "clue-wifi-screenshot",
            x: 58,
            y: 2,
            width: 40,
            height: 12,
            label: "WLAN-Statusleiste (Schule_Gast_5G)",
            description: "📶 Statusleiste: Oben rechts ist volles 5G-Signal und das verbundene WLAN ‚Schule_Gast_5G‘ zu sehen. Leo war zur Tatzeit im Schul-Netzwerk eingeloggt!",
            category: "Metadaten & Netzwerke",
            relevance: "Widerlegt Aussage 1 (Funkloch & Standort)"
          }
        ],
        comments: [
          { user: "felix_k", text: "Bro du bist doch buchstäblich im Schul-WLAN eingeloggt oben rechts 💀💀💀", time: "Gestern 15:00 Uhr", isSus: true }
        ]
      },
      {
        id: "vid-3",
        title: "OOTD Spiegel-Selfie 🪞",
        postedAt: "Vor 2 Tagen",
        views: "2.8K",
        likes: "780",
        commentsCount: "1",
        shares: "35",
        music: "Bass Boosted Skate Vibe",
        caption: "Lieblings-Hoodie sitzt immer noch 🔥 #outfit #skate #yellow #ootd",
        sceneType: "mirror_selfie",
        hotspots: [
          {
            id: "clue-hoodie-patch",
            x: 26,
            y: 42,
            width: 35,
            height: 30,
            label: "Gelber Hoodie mit Skater-Patch",
            description: "🧥 Kleidung: Leo trägt den gelben Hoodie mit dem rot-blauen Skater-Patch am linken Ärmel vor 2 Tagen – er hat ihn also keineswegs vor 2 Wochen verloren!",
            category: "Kontinuität & Kleidung",
            relevance: "Widerlegt Aussage 2 (Hoodie angeblich verloren)"
          }
        ],
        comments: [
          { user: "skate_jonas", text: "Der Patch am Ärmel ist so fresh man 🔥", time: "Vor 2 Tagen" }
        ]
      }
    ],
    educationalTakeaways: [
      "🔍 **Reflexionen & Spiegelungen:** Fenster, Sonnenbrillen oder Rückspiegel verraten oft die reale Umgebung.",
      "📶 **Screenshots & Statusleisten:** Uhrzeit, Akkustand, WLAN-Namen und Bluetooth-Verbindungen liefern digitale Beweise.",
      "🌦️ **Wetter- & Licht-Abgleich:** Sonnenstand, Schattenwinkel und Wolken lassen sich mit amtlichen Wetterdaten vergleichen.",
      "🔒 **Privatsphäre-Tipp:** Wer vermeintlich 'private' Fotos hochlädt, sollte vor dem Posten prüfen, welche Standorte und Metadaten sichtbar sind!"
    ]
  },
  {
    id: "case-dubai-fake",
    title: "Das gefälschte Dubai-Luxus-Giveaway",
    category: "Influencer-Fakes & Fake-Gewinnspiele",
    difficulty: "Mittel",
    badge: "💎 Scam-Buster",
    summary: "Influencerin Luna behauptet, exklusiv aus einem Luxus-Penthouse in Dubai zu streamen und dort ein 10.000€ Uhren-Giveaway frisch eingekauft zu haben. Fans wittern einen Betrug.",
    suspect: {
      name: "Luna Bergmann",
      handle: "@luna.luxury.official",
      avatar: "✨",
      avatarColor: "#e056fd",
      bio: "Living my best life in Dubai 🌴🇦🇪 | Fashion & Luxury | Daily Giveaways 🎁",
      followers: "148.5K",
      following: "112",
      likes: "1.8M",
      verified: true
    },
    incidentTime: "Freitag, 15. September",
    incidentLocation: "Angeblich Dubai Palm Jumeirah (Real: Frankfurt am Main)",
    statements: [
      {
        id: "stmt-1",
        claim: "„Ich befinde mich seit 3 Tagen exklusiv im Luxus-Penthouse am Palm Jumeirah in Dubai und filme alle Videos live vor Ort!“",
        isLie: true,
        contradictionReason: "Deutsche Schuko-Steckdose (Typ F statt britischem Typ G), mitteleuropäische Eichenblätter im Wind, deutsches Polizei-Martinshorn und blauer Himmel trotz historischem Sandsturm in Dubai widerlegen den Standort.",
        requiredClues: ["clue-schuko-plug", "clue-oak-leaves", "clue-audio-siren"]
      },
      {
        id: "stmt-2",
        claim: "„Das 10.000€ Luxus-Uhren-Giveaway ist 100% echt und wurde heute frisch in der Dubai Mall Bar bezahlt!“",
        isLie: true,
        contradictionReason: "Auf der Quittung steht 'inkl. 19% deutsche MwSt.' von vor 6 Monaten aus Frankfurt, und in der Uhrenspiegelung ist das Logo eines Frankfurter Flughafen-Hotels zu sehen.",
        requiredClues: ["clue-receipt-tax", "clue-hotel-reflection"]
      }
    ],
    videos: [
      {
        id: "vid-1",
        title: "Good Morning Dubai 🌴☕️",
        postedAt: "Heute, 09:30 Uhr",
        views: "45.2K",
        likes: "6.8K",
        commentsCount: "3",
        shares: "189",
        music: "Luxury Lifestyle Lounge Vibe",
        caption: "Beste Aussicht über die Palm Jumeirah ☀️ Kein Ort der Welt ist schöner! #dubai #luxury #penthouse #palm #lifestyle",
        sceneType: "dubai_balcony_fake",
        audioTrack: {
          type: "siren",
          label: "🎧 Sirene im Hintergrund anhören",
          text: "🔊 Tonspur: Im Hintergrund heult unverkennbar das typisch deutsche Polizei-Martinshorn (Tatü-Tata nach DIN 14610) im Stadtverkehr – dieses Signal existiert in Dubai nicht!"
        },
        hotspots: [
          {
            id: "clue-schuko-plug",
            x: 10,
            y: 70,
            width: 22,
            height: 18,
            label: "Deutsche Wandsteckdose (Typ F)",
            description: "🔌 Steckdosentyp: An der Wand ist eine Standard-Schukosteckdose (Typ F, Deutschland/EU) installiert. In den VAE/Dubai sind gesetzlich ausschließlich britische 3-Pin-Steckdosen (Typ G) verbaut!",
            category: "Infrastruktur & Technik",
            relevance: "Widerlegt Aussage 1 (Standort ist in Deutschland)"
          },
          {
            id: "clue-oak-leaves",
            x: 76,
            y: 18,
            width: 22,
            height: 25,
            label: "Mitteleuropäische Eichenblätter",
            description: "🍃 Vegetation: Am Fensterrand wehen Zweige einer heimischen Stieleiche mit gezackten grünen Blättern. Eichen wachsen nicht frei im Wüstenklima von Dubai!",
            category: "Geografie & Umwelt",
            relevance: "Widerlegt Aussage 1 (Vegetation)"
          }
        ],
        comments: [
          { user: "dubai_resident_99", text: "Bro in Dubai ist heute der heftigste Sandsturm seit Jahren, der Himmel ist komplett gelb-braun... warum ist bei dir blauer Himmel mit Schäfchenwolken? 🤨", time: "Vor 2 Std.", isSus: true },
          { user: "luna.luxury.official", text: "Liegt am Filter ihr Lieben 🥰✨", time: "Vor 1 Std.", isAuthor: true },
          { user: "sarah_travels", text: "Die Aussicht sieht verdächtig nach Frankfurt Mainhattan aus haha", time: "Vor 45 Min." }
        ]
      },
      {
        id: "vid-2",
        title: "10.000€ GIVEAWAY UNBOXING 🎁⌚️",
        postedAt: "Heute, 14:00 Uhr",
        views: "88.1K",
        likes: "15.4K",
        commentsCount: "2",
        shares: "940",
        music: "Hype Trap Beats 2026",
        caption: "Für meine treuesten Follower! Frisch eingekauft 💎 Schreibt 'LUXUS' in die Kommentare um teilzunehmen! #giveaway #rolex #dubaimall",
        sceneType: "watch_unboxing",
        hotspots: [
          {
            id: "clue-receipt-tax",
            x: 12,
            y: 55,
            width: 36,
            height: 25,
            label: "Kassenbon mit 19% deutscher MwSt.",
            description: "🧾 Quittungsdetails: Auf dem Beleg steht 'inkl. 19% MwSt. EUR' und ein Kaufdatum von vor 6 Monaten (März) aus einem Juwelier in Frankfurt am Main!",
            category: "Dokumente & Rechnungen",
            relevance: "Widerlegt Aussage 2 (Weder heute noch in Dubai gekauft)"
          },
          {
            id: "clue-hotel-reflection",
            x: 50,
            y: 32,
            width: 28,
            height: 28,
            label: "Spiegelung im Uhrenglas",
            description: "🏨 Spiegelung: Im gewölbten Uhrenglas spiegelt sich die Konferenzmappe mit dem Logo des 'Airport Hotel Regent Frankfurt am Main'.",
            category: "Reflexion & Branding",
            relevance: "Widerlegt Aussage 1 & 2 (Echter Standort)"
          }
        ],
        comments: [
          { user: "watch_expert_de", text: "Kassenbon mit 19% deutscher Mehrwertsteuer in Dubai? Guter Witz 😂", time: "Vor 30 Min.", isSus: true },
          { user: "kevin_99", text: "LUXUS LUXUS bitte ich will gewinnen!!", time: "Vor 10 Min." }
        ]
      }
    ],
    educationalTakeaways: [
      "🔌 **Weltweite Standards:** Steckdosen, Verkehrszeichen, Strommasten und Baustile verraten oft das wahre Land.",
      "💶 **Rechnungen & Währungen:** Fake-Giveaways nutzen oft alte Quittungen mit falschen Steuer- und Währungsangaben.",
      "🌪️ **Wetter- & Umweltrealität:** Satellitenbilder und aktuelle Wetterberichte entlarven Greenscreen- und Stock-Material.",
      "⚠️ **Vorsicht bei Social-Media-Gewinnspielen:** Niemals Gebühren zahlen oder dubiosen Verlosungen von 'Luxusgütern' blind vertrauen."
    ]
  },
  {
    id: "case-scooter-crash",
    title: "Der Drohnen-Vorfall im Vogelschutzgebiet",
    category: "Umwelt, Technik & Geodaten",
    difficulty: "Knifflig",
    badge: "🚁 Flug-Ermittler",
    summary: "Am Sonntag um 11:30 Uhr stürzte eine FPV-Renndrohne in eine geschützte Brutzone im Naturschutzgebiet 'Moosbruch'. Drohnen-Pilot Finn behauptet, seine Drohne sei seit Wochen defekt.",
    suspect: {
      name: "Finn Kramer",
      handle: "@finn_fpv_drones",
      avatar: "⚡️",
      avatarColor: "#10ac84",
      bio: "FPV Freestyle & Cinelifter 🎥 | Drone Racing | No illegal flights 🛑",
      followers: "19.4K",
      following: "340",
      likes: "125K",
      verified: false
    },
    incidentTime: "Sonntag, 12. Mai, ca. 11:30 Uhr",
    incidentLocation: "Naturschutzgebiet Moosbruch, Sektor Süd",
    statements: [
      {
        id: "stmt-1",
        claim: "„Meine Renndrohne ist seit über einem Monat komplett zerlegt und lag den ganzen Sonntag sicher im Schrank.“",
        isLie: true,
        contradictionReason: "Am Sonntagmittag hing die voll flugbereite Drohne mit frischen Schlammspuren und feuchtem Gras an seinem Rucksack.",
        requiredClues: ["clue-drone-backpack", "clue-audio-telemetry"]
      },
      {
        id: "stmt-2",
        claim: "„Ich war am Sonntagvormittag auf dem offiziellen Modellflugplatz 40 km entfernt und habe nur anderen Piloten zugeschaut.“",
        isLie: true,
        contradictionReason: "Im Hintergrund seines Videos steht der denkmalgeschützte achteckige Wasserturm des Moosbruchs, und der kurze Nord-Schatten beweist exakt 11:30 Uhr Sonnenhöchststand direkt im Naturschutzgebiet.",
        requiredClues: ["clue-watertower-landmark", "clue-sundial-shadow"]
      }
    ],
    videos: [
      {
        id: "vid-1",
        title: "Sunday Vibe & Sunshine ☀️",
        postedAt: "Sonntag, 12:15 Uhr",
        views: "5.4K",
        likes: "890",
        commentsCount: "2",
        shares: "22",
        music: "Electronic Chillstep Beat",
        caption: "Bester Flugtag heute! Chille noch kurz in der Sonne 🌲 #fpv #nature #sunday #flying",
        sceneType: "park_watertower",
        audioTrack: {
          type: "telemetry",
          label: "🎧 Drohnen-Funk abspielen",
          text: "🔊 Tonspur: Die Telemetrie-Stimme der Fernsteuerung piept: „GPS 3D Fix: 14 Satelliten. Zone: Moosbruch Süd – Höhe 45 Meter“. Das beweist den genauen Flugort!"
        },
        hotspots: [
          {
            id: "clue-watertower-landmark",
            x: 74,
            y: 16,
            width: 24,
            height: 35,
            label: "Historischer Wasserturm Moosbruch",
            description: "🏰 Landmarke: Im Hintergrund ragt der markante achteckige Ziegel-Wasserturm von 'Moosbruch 1898' empor – mitten im Naturschutzgebiet und nicht auf dem 40 km entfernten Flugplatz!",
            category: "Geodaten & Landmarken",
            relevance: "Widerlegt Aussage 2 (Standort Moosbruch statt Flugplatz)"
          },
          {
            id: "clue-sundial-shadow",
            x: 35,
            y: 65,
            width: 25,
            height: 20,
            label: "Schattenwurf der Parkbank",
            description: "🧭 Sonnenstand & Schatten: Der Schatten der Bank fällt exakt kurz nach Norden – im Mai auf der Nordhalbkugel entspricht das genau dem Sonnenhöchststand um ca. 11:30–12:00 Uhr!",
            category: "Sonnenstand & Chronologie",
            relevance: "Widerlegt Aussage 2 (Zeitpunkt ca. 11:30 Uhr)"
          },
          {
            id: "clue-drone-backpack",
            x: 8,
            y: 48,
            width: 28,
            height: 30,
            label: "Drohne am Rucksack",
            description: "🚁 Ausrüstung: An Finns Rucksack ist die montierte FPV-Drohne festgegurtet – mit frischen Schlammspritzern und Gras an den Propellern!",
            category: "Gegenstände & Spuren",
            relevance: "Widerlegt Aussage 1 (Drohne nicht zerlegt im Schrank)"
          }
        ],
        comments: [
          { user: "ranger_tom", text: "Interessanter Wasserturm im Hintergrund... steht der jetzt auch schon auf eurem Vereinsflugplatz? 🤔", time: "Sonntag 13:00 Uhr", isSus: true },
          { user: "fpv_tim", text: "Nice Drohne bro, dachte die wäre gecrasht?", time: "Sonntag 13:15 Uhr" }
        ]
      }
    ],
    educationalTakeaways: [
      "🧭 **Sonnen- & Schatten-Analyse:** Schattenlänge und -richtung verraten Himmelsrichtung und ungefähre Tageszeit (wie bei SunCalc).",
      "📡 **Audio-Metadaten & Sensorstimmen:** Sprachausgaben von Drohnen, Smartwatches oder Navis enthalten oft Ortsnamen und Telemetriedaten.",
      "🗺️ **Markante Landmarken:** Türme, Bergsilhouetten oder Brücken lassen sich per Bildersuche und Kartendiensten sekundenschnell lokalisieren.",
      "🦅 **Medienethik & Umweltschutz:** Drohnenflüge in Schutzzonen sind nicht nur illegal, sondern stören bedrohte Tierarten empfindlich."
    ]
  }
];
