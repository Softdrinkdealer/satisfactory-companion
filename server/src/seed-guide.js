import { execute, queryAll } from './database.js';

export function seedGuide() {
  const existing = queryAll('SELECT COUNT(*) as cnt FROM guide_phases');
  if (existing[0]?.cnt > 0) return;

  const phases = [
    // Folge 1
    {
      folge: 1, title: 'Eisen-Grundlage', tier: 'Tier 2', color: '#22c55e',
      youtube_url: null,
      productions: [
        {
          name: 'Dwight D. Eisentower',
          power_original: 436, power_adjusted: 436,
          prerequisites: 'Tier 2 freigeschaltet',
          outputs: JSON.stringify([
            { item: 'Rotoren', rate: '10/min' },
            { item: 'Verstärkte Eisenplatten', rate: '5/min' },
            { item: 'Modulare Rahmen', rate: '4/min' },
            { item: 'Intelligente Beschichtung', rate: '2/min' }
          ]),
          forwards_to: JSON.stringify([]),
          somersloops: 0,
          requirements: JSON.stringify({
            research: ['Tier 2 – Teile & Bau freigeschaltet'],
            resources: [
              { item: 'Eisenerz', rate: '120/min', note: 'Reiner Node empfohlen' }
            ],
            productions: [],
            note: null
          })
        }
      ]
    },
    // Folge 2
    {
      folge: 2, title: 'Kupfer & Stahl', tier: 'Tier 3–4', color: '#22c55e',
      youtube_url: null,
      productions: [
        {
          name: 'Copterium Starter',
          power_original: 78, power_adjusted: 78,
          prerequisites: 'Tier 3 freigeschaltet',
          outputs: JSON.stringify([
            { item: 'KI-Begrenzer', rate: '5/min' },
            { item: 'Turbodraht', rate: '10/min' },
            { item: 'Kabel', rate: '30/min' }
          ]),
          forwards_to: JSON.stringify(['Copterium City Final']),
          somersloops: 0,
          requirements: JSON.stringify({
            research: ['Tier 3 – Grundlegende Stahlproduktion freigeschaltet'],
            resources: [
              { item: 'Kupfererz', rate: '60/min', note: 'Normaler Node reicht' },
              { item: 'Eisenerz', rate: '30/min', note: 'Für Stahlrohre' }
            ],
            productions: [],
            note: null
          })
        },
        {
          name: 'Steelworks Starter',
          power_original: 52, power_adjusted: 52,
          prerequisites: 'Tier 3–4 freigeschaltet, Kohle verfügbar',
          outputs: JSON.stringify([
            { item: 'Stahlrohr', rate: '20/min' },
            { item: 'Stahlträger', rate: '15/min' }
          ]),
          forwards_to: JSON.stringify(['Steelworks Endgame']),
          somersloops: 0,
          requirements: JSON.stringify({
            research: ['Tier 3 – Stahlproduktion freigeschaltet'],
            resources: [
              { item: 'Eisenerz', rate: '45/min', note: null },
              { item: 'Kohle', rate: '45/min', note: 'Kohle-Node erschließen' }
            ],
            productions: [],
            note: null
          })
        },
        {
          name: 'Steelworks Endgame',
          power_original: 650, power_adjusted: 650,
          prerequisites: 'Steelworks Starter läuft, Tier 4 freigeschaltet',
          outputs: JSON.stringify([
            { item: 'Stator', rate: '10/min' },
            { item: 'Mehrzweckgerüst', rate: '5/min' },
            { item: 'Automatische Verkabelung', rate: '5/min' }
          ]),
          forwards_to: JSON.stringify([]),
          somersloops: 0,
          requirements: JSON.stringify({
            research: ['Tier 4 – Erweiterte Stahlproduktion freigeschaltet'],
            resources: [
              { item: 'Kupfererz', rate: '30/min', note: 'Für Draht & Kabel' }
            ],
            productions: [
              { name: 'Steelworks Starter', reason: 'Liefert Stahlrohr (20/min)' },
              { name: 'Copterium Starter', reason: 'Liefert Kabel (30/min)' }
            ],
            note: null
          })
        }
      ]
    },
    // Folge 3
    {
      folge: 3, title: 'Motoren & Öl', tier: 'Tier 4–5', color: '#eab308',
      youtube_url: null,
      productions: [
        {
          name: 'General Motors Starter',
          power_original: 278, power_adjusted: 278,
          prerequisites: 'Tier 4 freigeschaltet, Stator-Produktion läuft',
          outputs: JSON.stringify([
            { item: 'Motor', rate: '10/min' }
          ]),
          forwards_to: JSON.stringify(['General Motors Final']),
          somersloops: 0,
          requirements: JSON.stringify({
            research: ['Tier 4 – Motoren freigeschaltet'],
            resources: [],
            productions: [
              { name: 'Dwight D. Eisentower', reason: 'Liefert Rotoren (10/min)' },
              { name: 'Steelworks Endgame', reason: 'Liefert Statoren (10/min)' }
            ],
            note: null
          })
        },
        {
          name: 'Oil of Olaz Starter',
          power_original: 292, power_adjusted: 292,
          prerequisites: 'Tier 5 freigeschaltet, Ölquelle erschlossen',
          outputs: JSON.stringify([
            { item: 'Kunststoff', rate: '30/min' },
            { item: 'Gummi', rate: '30/min' },
            { item: 'Petrolkoks', rate: '60/min' }
          ]),
          forwards_to: JSON.stringify(['Oil of Olaz Final']),
          somersloops: 0,
          requirements: JSON.stringify({
            research: ['Tier 5 – Ölverarbeitung freigeschaltet'],
            resources: [
              { item: 'Rohöl', rate: '120/min', note: 'Öl-Node erschließen, Pipeline bauen' },
              { item: 'Wasser', rate: '60/min', note: 'Wasserextraktoren benötigt' }
            ],
            productions: [],
            note: 'Pipelines statt Förderbänder – Patrick kann das erklären!'
          })
        },
        {
          name: 'Copterium City Final',
          power_original: 416, power_adjusted: 416,
          prerequisites: 'Copterium Starter läuft, Kunststoff verfügbar',
          outputs: JSON.stringify([
            { item: 'KI-Begrenzer', rate: '10/min' },
            { item: 'Turbodraht', rate: '25/min' },
            { item: 'Kupferblech', rate: '30/min' }
          ]),
          forwards_to: JSON.stringify([]),
          somersloops: 0,
          requirements: JSON.stringify({
            research: ['Tier 5 – Industrieproduktion freigeschaltet'],
            resources: [
              { item: 'Kupfererz', rate: '60/min', note: null }
            ],
            productions: [
              { name: 'Copterium Starter', reason: 'Liefert Turbodraht & KI-Begrenzer als Basis' },
              { name: 'Oil of Olaz Starter', reason: 'Liefert Kunststoff (30/min)' }
            ],
            note: null
          })
        },
        {
          name: 'General Motors Final',
          power_original: 972, power_adjusted: 972,
          prerequisites: 'General Motors Starter läuft, Öl-Produkte verfügbar',
          outputs: JSON.stringify([
            { item: 'Modularer Motor', rate: '2/min' },
            { item: 'Motor', rate: '10/min' }
          ]),
          forwards_to: JSON.stringify([]),
          somersloops: 0,
          requirements: JSON.stringify({
            research: ['Tier 5 – Industrielle Produktion freigeschaltet'],
            resources: [],
            productions: [
              { name: 'General Motors Starter', reason: 'Liefert Motoren (10/min)' },
              { name: 'Oil of Olaz Starter', reason: 'Liefert Gummi (15/min)' },
              { name: 'Steelworks Endgame', reason: 'Liefert Intelligente Beschichtung (2/min)' }
            ],
            note: null
          })
        }
      ]
    },
    // Folge 4
    {
      folge: 4, title: 'Schwere Teile & Quarz', tier: 'Tier 6', color: '#eab308',
      youtube_url: null,
      productions: [
        {
          name: 'HeavyRames Endgame',
          power_original: 672, power_adjusted: 672,
          prerequisites: 'Tier 6 freigeschaltet, Modulare Rahmen & Stahlproduktion',
          outputs: JSON.stringify([
            { item: 'Schwerer Modularer Rahmen', rate: '4/min' }
          ]),
          forwards_to: JSON.stringify([]),
          somersloops: 1,
          requirements: JSON.stringify({
            research: ['Tier 6 – Schwere Modularproduktion freigeschaltet'],
            resources: [
              { item: 'Eisenerz', rate: '60/min', note: 'Zusätzlich zu Folge 1' }
            ],
            productions: [
              { name: 'Dwight D. Eisentower', reason: 'Liefert Modulare Rahmen (4/min) & Verstärkte Eisenplatten' },
              { name: 'Steelworks Starter', reason: 'Liefert Stahlrohre (30/min)' }
            ],
            note: '🔮 Somersloops erforderlich für volle Effizienz'
          })
        },
        {
          name: 'Oil of Olaz Final',
          power_original: 1194, power_adjusted: 1194,
          prerequisites: 'Oil of Olaz Starter läuft, erweiterte Ölverarbeitung',
          outputs: JSON.stringify([
            { item: 'Treibstoff', rate: '40/min' },
            { item: 'Gummi', rate: '60/min' },
            { item: 'Gewebe', rate: '15/min' },
            { item: 'Petrolkoks', rate: '120/min' }
          ]),
          forwards_to: JSON.stringify([]),
          somersloops: 0,
          requirements: JSON.stringify({
            research: ['Tier 5 – Ölverarbeitung', 'Alternativrezept: Diluted Packaged Fuel (empfohlen)'],
            resources: [
              { item: 'Rohöl', rate: '240/min', note: 'Mehrere Öl-Nodes nötig' },
              { item: 'Wasser', rate: '120/min', note: 'Wasserextraktoren' }
            ],
            productions: [
              { name: 'Oil of Olaz Starter', reason: 'Basis-Ölverarbeitung muss laufen' }
            ],
            note: null
          })
        },
        {
          name: 'Kwartz Endgame',
          power_original: 932, power_adjusted: 932,
          prerequisites: 'Tier 6, Quarz-Nodes erschlossen',
          outputs: JSON.stringify([
            { item: 'Quarzoszillator', rate: '10/min' },
            { item: 'Quarzsand', rate: '60/min' }
          ]),
          forwards_to: JSON.stringify([]),
          somersloops: 0,
          requirements: JSON.stringify({
            research: ['Tier 6 – Quarzverarbeitung freigeschaltet'],
            resources: [
              { item: 'Rohquarz', rate: '120/min', note: 'Quarz-Nodes erkunden & erschließen' },
              { item: 'Kupfererz', rate: '30/min', note: 'Für Kabel in Quarzoszillatoren' },
              { item: 'Eisenerz', rate: '15/min', note: 'Für Verstärkte Eisenplatten' }
            ],
            productions: [
              { name: 'Dwight D. Eisentower', reason: 'Liefert Verstärkte Eisenplatten (5/min)' },
              { name: 'Copterium Starter', reason: 'Liefert Kabel (28/min)' }
            ],
            note: 'Quarz-Nodes sind oft weiter entfernt – Zug oder langes Förderband einplanen'
          })
        }
      ]
    },
    // Folge 5
    {
      folge: 5, title: 'Computer & Aluminium', tier: 'Tier 6–7', color: '#ef4444',
      youtube_url: null,
      productions: [
        {
          name: 'Maxi IBM',
          power_original: null, power_adjusted: null,
          prerequisites: 'Tier 6–7, Quarzoszillator & Kunststoff verfügbar',
          outputs: JSON.stringify([
            { item: 'Computer', rate: '5/min' },
            { item: 'Adaptive Steuereinheit', rate: '2/min' }
          ]),
          forwards_to: JSON.stringify([]),
          somersloops: 1,
          requirements: JSON.stringify({
            research: ['Tier 6 – Computer freigeschaltet'],
            resources: [
              { item: 'Kupfererz', rate: '60/min', note: 'Für Kupferblech & Platinen' }
            ],
            productions: [
              { name: 'Oil of Olaz Starter', reason: 'Liefert Kunststoff (45/min)' },
              { name: 'Kwartz Endgame', reason: 'Liefert Quarzoszillatoren (nicht direkt, über Platinen)' },
              { name: 'Steelworks Endgame', reason: 'Liefert Automatische Verkabelung (15/min)' }
            ],
            note: '🔮 Somersloops für Adaptive Steuereinheiten empfohlen'
          })
        },
        {
          name: 'ALU Starter',
          power_original: null, power_adjusted: null,
          prerequisites: 'Tier 7 freigeschaltet, Bauxit-Node erschlossen',
          outputs: JSON.stringify([
            { item: 'Aluminiumprodukte', rate: null }
          ]),
          forwards_to: JSON.stringify(['Alu Area 3']),
          somersloops: 0,
          requirements: JSON.stringify({
            research: ['Tier 7 – Aluminiumproduktion freigeschaltet'],
            resources: [
              { item: 'Bauxit', rate: '120/min', note: 'Bauxit-Nodes erkunden – oft im Norden der Map' },
              { item: 'Wasser', rate: '180/min', note: 'Viele Wasserextraktoren nötig' },
              { item: 'Rohquarz', rate: '75/min', note: 'Für Quarzsand im Aluminiumprozess' }
            ],
            productions: [],
            note: 'Bau idealerweise in der Nähe eines Gewässers – viel Wasser nötig!'
          })
        },
        {
          name: 'Alu Area 3',
          power_original: null, power_adjusted: null,
          prerequisites: 'ALU Starter läuft',
          outputs: JSON.stringify([
            { item: 'Funksteuereinheit', rate: '5/min' },
            { item: 'Alclad-Platten', rate: '30/min' }
          ]),
          forwards_to: JSON.stringify([]),
          somersloops: 0,
          requirements: JSON.stringify({
            research: ['Tier 7 – Aluminiumverarbeitung freigeschaltet'],
            resources: [
              { item: 'Kupfererz', rate: '20/min', note: 'Für Kupferbarren in Alclad-Platten' }
            ],
            productions: [
              { name: 'ALU Starter', reason: 'Liefert Aluminiumbarren & Aluminiumgehäuse' },
              { name: 'Kwartz Endgame', reason: 'Liefert Quarzoszillatoren (1.25/min)' },
              { name: 'Maxi IBM', reason: 'Liefert Computer (1.25/min)' }
            ],
            note: null
          })
        },
        {
          name: 'Cool Runnings',
          power_original: null, power_adjusted: null,
          prerequisites: 'Stickstoff verfügbar, Aluminium-Produktion',
          outputs: JSON.stringify([
            { item: 'Kühlsysteme', rate: '3/min' },
            { item: 'Verschmolzener Modularer Rahmen', rate: '1/min' }
          ]),
          forwards_to: JSON.stringify([]),
          somersloops: 0,
          requirements: JSON.stringify({
            research: ['Tier 7 – Kühlsysteme freigeschaltet'],
            resources: [
              { item: 'Stickstoff', rate: '150/min', note: 'Stickstoff-Brunnen (Resource Well) erschließen – oft in Höhlen oder an Klippen' }
            ],
            productions: [
              { name: 'Oil of Olaz Starter', reason: 'Liefert Gummi (30/min) & Kühlmittel-Basis' },
              { name: 'ALU Starter', reason: 'Liefert Aluminiumgehäuse für Verschmolzene Rahmen' },
              { name: 'HeavyRames Endgame', reason: 'Liefert Schwere Modulare Rahmen (1.5/min)' }
            ],
            note: 'Stickstoff-Brunnen mit Patrick zusammen suchen!'
          })
        }
      ]
    },
    // Folge 6
    {
      folge: 6, title: 'Supercomputer & Turbomotoren', tier: 'Tier 7–8', color: '#ef4444',
      youtube_url: null,
      productions: [
        {
          name: 'TurboSuper',
          power_original: 324, power_adjusted: 324,
          prerequisites: 'Tier 7–8, Computer & Motor-Produktion, Kühlsysteme',
          outputs: JSON.stringify([
            { item: 'Turbomotor', rate: '2/min' },
            { item: 'Supercomputer', rate: '2/min' }
          ]),
          forwards_to: JSON.stringify([]),
          somersloops: 1,
          requirements: JSON.stringify({
            research: ['Tier 8 – Turbomotoren & Supercomputer freigeschaltet'],
            resources: [],
            productions: [
              { name: 'Cool Runnings', reason: 'Liefert Kühlsysteme (7.5/min)' },
              { name: 'Alu Area 3', reason: 'Liefert Funksteuereinheiten (3.75/min)' },
              { name: 'General Motors Starter', reason: 'Liefert Motoren (7.5/min)' },
              { name: 'Oil of Olaz Final', reason: 'Liefert Gummi (45/min)' },
              { name: 'Maxi IBM', reason: 'Liefert Computer (3.75/min) & KI-Begrenzer (3.75/min)' },
              { name: 'Copterium City Final', reason: 'Liefert Turbodraht (56.25/min)' }
            ],
            note: '🔮 Somersloops hier einsetzen spart enorm – Inputs sind sehr teuer'
          })
        }
      ]
    },
    // Folge 7
    {
      folge: 7, title: 'Endgame', tier: 'Tier 8–9', color: '#6b7280',
      youtube_url: null,
      productions: [
        {
          name: 'SpaceParts Endgame',
          power_original: 87400, power_adjusted: 87400,
          prerequisites: 'Tier 8–9, alle vorherigen Produktionen',
          outputs: JSON.stringify([
            { item: 'Thermaler Raketenantrieb', rate: null },
            { item: 'Montage-Leitsystem', rate: null },
            { item: 'Magnetfeld-Generator', rate: null }
          ]),
          forwards_to: JSON.stringify([]),
          somersloops: 0,
          requirements: JSON.stringify({
            research: ['Tier 8 & 9 vollständig freigeschaltet'],
            resources: [],
            productions: [
              { name: 'General Motors Final', reason: 'Liefert Modulare Motoren (4/min)' },
              { name: 'TurboSuper', reason: 'Liefert Turbomotoren (2/min)' },
              { name: 'Cool Runnings', reason: 'Liefert Kühlsysteme (12/min) & Verschmolzene Rahmen (2/min)' },
              { name: 'Maxi IBM', reason: 'Liefert Adaptive Steuereinheiten (2/min) & Computer (1/min)' },
              { name: 'TurboSuper', reason: 'Liefert Supercomputer (1/min)' }
            ],
            note: '~87.400 MW Bedarf – Nuclear Power ist ab hier Pflicht. Gemeinsam planen!'
          })
        },
        {
          name: 'Quanto',
          power_original: 97634, power_adjusted: 97634,
          prerequisites: 'Tier 9, Dunkle Materie verfügbar',
          outputs: JSON.stringify([
            { item: 'Neural-Quantenprozessor', rate: null },
            { item: 'Singularitätszelle', rate: null },
            { item: 'Dunkle-Materie-Produkte', rate: null }
          ]),
          forwards_to: JSON.stringify(['SpaceFarts']),
          somersloops: 0,
          requirements: JSON.stringify({
            research: ['Tier 9 – Quantentechnologie freigeschaltet'],
            resources: [],
            productions: [
              { name: 'SpaceParts Endgame', reason: 'Liefert alle Space-Teile als Voraussetzung' }
            ],
            note: 'Dunkle-Materie-Kristalle müssen zuerst entdeckt & erschlossen werden'
          })
        },
        {
          name: 'SpaceFarts',
          power_original: 2680, power_adjusted: 2680,
          prerequisites: 'Quanto läuft, Dunkle-Materie-Überrest',
          outputs: JSON.stringify([
            { item: 'Rückführung Dunkle-Materie-Überrest', rate: null }
          ]),
          forwards_to: JSON.stringify(['Quanto']),
          somersloops: 0,
          requirements: JSON.stringify({
            research: ['Tier 9 – Quantentechnologie freigeschaltet'],
            resources: [],
            productions: [
              { name: 'Quanto', reason: 'Liefert Dunkle-Materie-Überrest als Nebenprodukt' }
            ],
            note: 'Diese Produktion recycelt Überreste zurück in Quanto – Kreislauf schließen!'
          })
        }
      ]
    }
  ];

  for (const phase of phases) {
    execute(
      `INSERT INTO guide_phases (folge_number, title, tier_requirement, youtube_url, color)
       VALUES (?, ?, ?, ?, ?)`,
      [phase.folge, phase.title, phase.tier, phase.youtube_url, phase.color]
    );
    const phaseRow = queryAll('SELECT id FROM guide_phases WHERE folge_number = ? AND title = ?', [phase.folge, phase.title]);
    const phaseId = phaseRow[0].id;

    for (const prod of phase.productions) {
      execute(
        `INSERT INTO productions (phase_id, name, power_original_mw, power_adjusted_mw, prerequisites_text, outputs_json, forwards_to_json, somersloops_needed, requirements_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [phaseId, prod.name, prod.power_original, prod.power_adjusted, prod.prerequisites, prod.outputs, prod.forwards_to, prod.somersloops, prod.requirements || null]
      );
    }
  }

  seedTips();
}

function seedTips() {
  // Map production names to IDs
  const prods = queryAll('SELECT id, name FROM productions');
  const prodId = (name) => prods.find(p => p.name === name)?.id;

  const tips = [
    // Folge 1 – Dwight D. Eisentower
    { prod: 'Dwight D. Eisentower', text: 'Eisenerz ist die Basis für fast alles im Spiel. Diese Produktion versorgt viele spätere Fabriken – nimm dir Zeit, sie sauber aufzubauen.', type: 'einsteiger', min_level: 'neuling' },
    { prod: 'Dwight D. Eisentower', text: 'Baue die Produktion modular auf: Jede Fertigungslinie als eigenen Block. So kannst du später leichter erweitern.', type: 'pro', min_level: 'neuling' },
    { prod: 'Dwight D. Eisentower', text: 'Lass zwischen den Maschinen genug Platz für spätere Förderbänder und Walkways – das spart später viel Umbau.', type: 'einsteiger', min_level: 'neuling' },
    { prod: 'Dwight D. Eisentower', text: 'Diese Produktion zieht ~436 MW. Achte darauf, dass dein Kohlekraftwerk das abdeckt bevor du startest.', type: 'server', min_level: 'neuling' },

    // Folge 2 – Copterium Starter
    { prod: 'Copterium Starter', text: 'Kupfererz findest du oft in der Nähe von Eisenvorkommen. Schau dich in der Umgebung deiner Basis um.', type: 'einsteiger', min_level: 'neuling' },
    { prod: 'Copterium Starter', text: 'KI-Begrenzer werden später in großen Mengen gebraucht. Plane von Anfang an genug Kapazität ein.', type: 'pro', min_level: 'neuling' },

    // Folge 2 – Steelworks Starter
    { prod: 'Steelworks Starter', text: 'Für Stahl brauchst du Kohle UND Eisenerz. Stelle sicher, dass beide Ressourcen per Förderband ankommen.', type: 'einsteiger', min_level: 'neuling' },
    { prod: 'Steelworks Starter', text: 'Patrick kann erklären, wie die Gießerei funktioniert – sie nimmt zwei Inputs gleichzeitig auf.', type: 'einsteiger', min_level: 'neuling' },

    // Folge 2 – Steelworks Endgame
    { prod: 'Steelworks Endgame', text: 'Statoren sind eine Schlüsselkomponente für Motoren. Die Produktion hier ist die Grundlage für Folge 3.', type: 'pro', min_level: 'neuling' },
    { prod: 'Steelworks Endgame', text: 'Nutze Manifold-Verteilung für die Stahlrohr-Zufuhr – einfacher als perfekte Splitter-Ketten.', type: 'pro', min_level: 'neuling' },

    // Folge 3 – General Motors Starter
    { prod: 'General Motors Starter', text: 'Motoren sind komplex: Sie brauchen Statoren UND Rotoren als Input. Stelle sicher, dass beide Zulieferungen stabil laufen.', type: 'einsteiger', min_level: 'neuling' },
    { prod: 'General Motors Starter', text: 'Wenn die Motorproduktion stockt: Prüfe zuerst die Stator-Zufuhr, das ist meist der Engpass.', type: 'pro', min_level: 'neuling' },

    // Folge 3 – Oil of Olaz Starter
    { prod: 'Oil of Olaz Starter', text: 'Öl funktioniert anders als feste Ressourcen: Du brauchst Pipelines statt Förderbänder. Patrick kann das erklären!', type: 'einsteiger', min_level: 'neuling' },
    { prod: 'Oil of Olaz Starter', text: 'Petrolkoks ist ein guter Ersatz für Kohle in Stahlproduktion – spart einen Kohle-Node.', type: 'pro', min_level: 'neuling' },
    { prod: 'Oil of Olaz Starter', text: 'Baue eine AWESOME Sink für überschüssigen Kunststoff/Gummi, bis die Weiterverarbeitung steht.', type: 'spass', min_level: 'neuling' },
    { prod: 'Oil of Olaz Starter', text: 'Treibstoff-Generatoren lohnen sich schon früh – pro Generator 150 MW Output bei nur 40 Treibstoff/min Verbrauch.', type: 'server', min_level: 'neuling' },

    // Folge 3 – Copterium City Final
    { prod: 'Copterium City Final', text: 'Kupferblech wird erst ab Folge 5 richtig wichtig, aber die Produktion hier bereitet alles vor.', type: 'pro', min_level: 'neuling' },

    // Folge 3 – General Motors Final
    { prod: 'General Motors Final', text: 'Der Modulare Motor ist eines der komplexesten Zwischenprodukte. Lass dir Zeit und bau sauber.', type: 'einsteiger', min_level: 'neuling' },

    // Folge 4 – HeavyRames Endgame
    { prod: 'HeavyRames Endgame', text: 'Somersloops verdoppeln den Output einzelner Maschinen. Platziere sie strategisch bei Engpass-Maschinen.', type: 'einsteiger', min_level: 'neuling' },
    { prod: 'HeavyRames Endgame', text: 'Schwere Modulare Rahmen sind DER Engpass im Midgame. Überdimensioniere lieber.', type: 'pro', min_level: 'neuling' },

    // Folge 4 – Oil of Olaz Final
    { prod: 'Oil of Olaz Final', text: 'Gewebe wird für Gasmasken und Filter gebraucht – nützlich bei Erkundungstouren in giftige Gebiete.', type: 'spass', min_level: 'neuling' },
    { prod: 'Oil of Olaz Final', text: 'Die ~1.194 MW hier sind gut durch Treibstoff-Generatoren abzudecken – ihr habt genug Output aus dieser Produktion.', type: 'server', min_level: 'neuling' },

    // Folge 4 – Kwartz Endgame
    { prod: 'Kwartz Endgame', text: 'Quarz-Nodes sind oft weiter entfernt. Plane eine Zug- oder Förderband-Verbindung ein.', type: 'einsteiger', min_level: 'neuling' },
    { prod: 'Kwartz Endgame', text: 'Quarzoszillatoren werden für Computer und spätere High-Tech-Produkte gebraucht – wichtiger als man denkt!', type: 'pro', min_level: 'neuling' },

    // Folge 5 – Maxi IBM
    { prod: 'Maxi IBM', text: 'Computer sind ein Meilenstein! Ab hier wird das Spiel richtig komplex – aber auch richtig spannend.', type: 'einsteiger', min_level: 'neuling' },
    { prod: 'Maxi IBM', text: 'Adaptive Steuereinheiten mit Somersloops produzieren lohnt sich extrem – der Output verdoppelt sich.', type: 'pro', min_level: 'neuling' },

    // Folge 5 – ALU Starter
    { prod: 'ALU Starter', text: 'Aluminium braucht Wasser UND Bauxit. Bau die Fabrik idealerweise in der Nähe eines Gewässers.', type: 'einsteiger', min_level: 'neuling' },
    { prod: 'ALU Starter', text: 'Die Aluminium-Verarbeitung hat Nebenprodukte (Silica). Plane eine Entsorgung oder Weiterverarbeitung ein.', type: 'pro', min_level: 'neuling' },

    // Folge 5 – Cool Runnings
    { prod: 'Cool Runnings', text: 'Kühlsysteme sind essentiell für Turbomotoren. Ohne sie geht ab Folge 6 nichts mehr.', type: 'pro', min_level: 'neuling' },
    { prod: 'Cool Runnings', text: 'Stickstoff kommt aus Ressourcen-Brunnen – diese findest du oft in Höhlen oder an Klippen.', type: 'einsteiger', min_level: 'neuling' },

    // Folge 6 – TurboSuper
    { prod: 'TurboSuper', text: 'Turbomotoren und Supercomputer sind die letzten großen Zwischenprodukte vor dem Endgame. Fast geschafft!', type: 'einsteiger', min_level: 'neuling' },
    { prod: 'TurboSuper', text: 'Somersloops hier einsetzen spart enorm Ressourcen – die Inputs für Turbomotoren sind extrem teuer.', type: 'pro', min_level: 'neuling' },
    { prod: 'TurboSuper', text: 'Nur ~324 MW für diese Produktion – sehr effizient im Vergleich zum Wert der Outputs.', type: 'server', min_level: 'neuling' },

    // Folge 7 – SpaceParts Endgame
    { prod: 'SpaceParts Endgame', text: 'Willkommen im Endgame! Hier kommen ALLE vorherigen Produktionen zusammen. Stelle sicher, dass alles stabil läuft.', type: 'einsteiger', min_level: 'neuling' },
    { prod: 'SpaceParts Endgame', text: '~87.400 MW sind kein Spaß. Plant gemeinsam die Stromversorgung – das ist ein Teamprojekt.', type: 'server', min_level: 'neuling' },
    { prod: 'SpaceParts Endgame', text: 'Züge sind ab hier fast Pflicht für den Ressourcentransport über lange Distanzen.', type: 'spass', min_level: 'neuling' },

    // Folge 7 – Quanto
    { prod: 'Quanto', text: 'Dunkle Materie ist das exotischste Material im Spiel. Die Produktion ist komplex aber faszinierend.', type: 'einsteiger', min_level: 'neuling' },
    { prod: 'Quanto', text: '~97.634 MW – zusammen mit SpaceParts braucht ihr fast 200 GW. Nuclear Power ist hier der Weg.', type: 'server', min_level: 'neuling' },
    { prod: 'Quanto', text: 'Der Neural-Quantenprozessor ist das teuerste Item im Spiel. Jedes einzelne zählt!', type: 'pro', min_level: 'neuling' },

    // Folge 7 – SpaceFarts
    { prod: 'SpaceFarts', text: 'Der Name ist Programm. 😄 Diese Rückführung recycelt Dunkle-Materie-Überrest zurück in Quanto.', type: 'spass', min_level: 'neuling' },
  ];

  for (const tip of tips) {
    const pid = prodId(tip.prod);
    if (pid) {
      execute(
        'INSERT INTO tips (production_id, text, type, min_level) VALUES (?, ?, ?, ?)',
        [pid, tip.text, tip.type, tip.min_level]
      );
    }
  }
}
