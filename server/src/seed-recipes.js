import { execute, queryAll } from './database.js';

export function seedRecipes() {
  const existing = queryAll('SELECT COUNT(*) as cnt FROM recipes');
  if (existing[0]?.cnt > 0) return;

  const recipes = [
    // === EISENPRODUKTE ===
    { name: 'Eisenbarren', output_item: 'Eisenbarren', output_rate: 30, inputs: [{ item: 'Eisenerz', rate: 30 }], machine: 'Schmelze', power: 4, alt: false, tier: 'Tier 0', cat: 'Barren', folge: 1 },
    { name: 'Eisenplatte', output_item: 'Eisenplatte', output_rate: 20, inputs: [{ item: 'Eisenbarren', rate: 30 }], machine: 'Konstrukteur', power: 4, alt: false, tier: 'Tier 0', cat: 'Teile', folge: 1 },
    { name: 'Eisenstange', output_item: 'Eisenstange', output_rate: 15, inputs: [{ item: 'Eisenbarren', rate: 15 }], machine: 'Konstrukteur', power: 4, alt: false, tier: 'Tier 0', cat: 'Teile', folge: 1 },
    { name: 'Schraube', output_item: 'Schraube', output_rate: 40, inputs: [{ item: 'Eisenstange', rate: 10 }], machine: 'Konstrukteur', power: 4, alt: false, tier: 'Tier 0', cat: 'Teile', folge: 1 },
    { name: 'Verstärkte Eisenplatte', output_item: 'Verstärkte Eisenplatte', output_rate: 5, inputs: [{ item: 'Eisenplatte', rate: 30 }, { item: 'Schraube', rate: 60 }], machine: 'Monteur', power: 15, alt: false, tier: 'Tier 2', cat: 'Teile', folge: 1 },
    { name: 'Rotor', output_item: 'Rotor', output_rate: 4, inputs: [{ item: 'Eisenstange', rate: 20 }, { item: 'Schraube', rate: 100 }], machine: 'Monteur', power: 15, alt: false, tier: 'Tier 2', cat: 'Teile', folge: 1 },
    { name: 'Modularer Rahmen', output_item: 'Modularer Rahmen', output_rate: 2, inputs: [{ item: 'Verstärkte Eisenplatte', rate: 3 }, { item: 'Eisenstange', rate: 12 }], machine: 'Monteur', power: 15, alt: false, tier: 'Tier 2', cat: 'Teile', folge: 1 },

    // === KUPFERPRODUKTE ===
    { name: 'Kupferbarren', output_item: 'Kupferbarren', output_rate: 30, inputs: [{ item: 'Kupfererz', rate: 30 }], machine: 'Schmelze', power: 4, alt: false, tier: 'Tier 0', cat: 'Barren', folge: 2 },
    { name: 'Kupferblech', output_item: 'Kupferblech', output_rate: 10, inputs: [{ item: 'Kupferbarren', rate: 20 }], machine: 'Konstrukteur', power: 4, alt: false, tier: 'Tier 2', cat: 'Teile', folge: 2 },
    { name: 'Draht', output_item: 'Draht', output_rate: 30, inputs: [{ item: 'Kupferbarren', rate: 15 }], machine: 'Konstrukteur', power: 4, alt: false, tier: 'Tier 0', cat: 'Teile', folge: 2 },
    { name: 'Kabel', output_item: 'Kabel', output_rate: 30, inputs: [{ item: 'Draht', rate: 60 }], machine: 'Konstrukteur', power: 4, alt: false, tier: 'Tier 0', cat: 'Teile', folge: 2 },

    // === STAHLPRODUKTE ===
    { name: 'Stahlbarren', output_item: 'Stahlbarren', output_rate: 45, inputs: [{ item: 'Eisenerz', rate: 45 }, { item: 'Kohle', rate: 45 }], machine: 'Gießerei', power: 16, alt: false, tier: 'Tier 3', cat: 'Barren', folge: 2 },
    { name: 'Stahlrohr', output_item: 'Stahlrohr', output_rate: 20, inputs: [{ item: 'Stahlbarren', rate: 30 }], machine: 'Konstrukteur', power: 4, alt: false, tier: 'Tier 3', cat: 'Teile', folge: 2 },
    { name: 'Stahlträger', output_item: 'Stahlträger', output_rate: 15, inputs: [{ item: 'Stahlbarren', rate: 60 }], machine: 'Konstrukteur', power: 4, alt: false, tier: 'Tier 3', cat: 'Teile', folge: 2 },
    { name: 'Intelligente Beschichtung', output_item: 'Intelligente Beschichtung', output_rate: 2, inputs: [{ item: 'Verstärkte Eisenplatte', rate: 2 }, { item: 'Rotor', rate: 2 }], machine: 'Monteur', power: 15, alt: false, tier: 'Tier 2', cat: 'Teile', folge: 1 },

    // === ELEKTRONIK ===
    { name: 'KI-Begrenzer', output_item: 'KI-Begrenzer', output_rate: 5, inputs: [{ item: 'Kupferblech', rate: 25 }, { item: 'Turbodraht', rate: 10 }], machine: 'Monteur', power: 15, alt: false, tier: 'Tier 4', cat: 'Elektronik', folge: 2 },
    { name: 'Turbodraht', output_item: 'Turbodraht', output_rate: 5, inputs: [{ item: 'Stahlrohr', rate: 25 }, { item: 'Draht', rate: 50 }], machine: 'Monteur', power: 15, alt: false, tier: 'Tier 3', cat: 'Elektronik', folge: 2 },
    { name: 'Stator', output_item: 'Stator', output_rate: 5, inputs: [{ item: 'Stahlrohr', rate: 15 }, { item: 'Draht', rate: 40 }], machine: 'Monteur', power: 15, alt: false, tier: 'Tier 4', cat: 'Elektronik', folge: 2 },
    { name: 'Automatische Verkabelung', output_item: 'Automatische Verkabelung', output_rate: 2.5, inputs: [{ item: 'Stator', rate: 2.5 }, { item: 'Kabel', rate: 50 }], machine: 'Monteur', power: 15, alt: false, tier: 'Tier 4', cat: 'Elektronik', folge: 2 },

    // === MOTOREN ===
    { name: 'Motor', output_item: 'Motor', output_rate: 5, inputs: [{ item: 'Rotor', rate: 10 }, { item: 'Stator', rate: 10 }], machine: 'Monteur', power: 15, alt: false, tier: 'Tier 4', cat: 'Motoren', folge: 3 },
    { name: 'Modularer Motor', output_item: 'Modularer Motor', output_rate: 1, inputs: [{ item: 'Motor', rate: 2 }, { item: 'Gummi', rate: 15 }, { item: 'Intelligente Beschichtung', rate: 2 }], machine: 'Hersteller', power: 55, alt: false, tier: 'Tier 5', cat: 'Motoren', folge: 3 },
    { name: 'Mehrzweckgerüst', output_item: 'Mehrzweckgerüst', output_rate: 4, inputs: [{ item: 'Modularer Rahmen', rate: 2 }, { item: 'Stahlträger', rate: 24 }], machine: 'Monteur', power: 15, alt: false, tier: 'Tier 4', cat: 'Teile', folge: 2 },

    // === ÖLPRODUKTE ===
    { name: 'Kunststoff', output_item: 'Kunststoff', output_rate: 20, inputs: [{ item: 'Rohöl', rate: 30 }], machine: 'Raffinerie', power: 30, alt: false, tier: 'Tier 5', cat: 'Öl', folge: 3 },
    { name: 'Gummi', output_item: 'Gummi', output_rate: 20, inputs: [{ item: 'Rohöl', rate: 30 }], machine: 'Raffinerie', power: 30, alt: false, tier: 'Tier 5', cat: 'Öl', folge: 3 },
    { name: 'Petrolkoks', output_item: 'Petrolkoks', output_rate: 120, inputs: [{ item: 'Schweres Ölrückstand', rate: 40 }], machine: 'Raffinerie', power: 30, alt: false, tier: 'Tier 5', cat: 'Öl', folge: 3 },
    { name: 'Treibstoff', output_item: 'Treibstoff', output_rate: 40, inputs: [{ item: 'Rohöl', rate: 60 }], machine: 'Raffinerie', power: 30, alt: false, tier: 'Tier 5', cat: 'Öl', folge: 4 },
    { name: 'Gewebe', output_item: 'Gewebe', output_rate: 15, inputs: [{ item: 'Polymer-Harz', rate: 30 }, { item: 'Wasser', rate: 30 }], machine: 'Raffinerie', power: 30, alt: false, tier: 'Tier 5', cat: 'Öl', folge: 4 },

    // === SCHWERE TEILE ===
    { name: 'Schwerer Modularer Rahmen', output_item: 'Schwerer Modularer Rahmen', output_rate: 2, inputs: [{ item: 'Modularer Rahmen', rate: 10 }, { item: 'Stahlrohr', rate: 30 }, { item: 'Verstärkte Eisenplatte', rate: 10 }, { item: 'Schraube', rate: 200 }], machine: 'Hersteller', power: 55, alt: false, tier: 'Tier 6', cat: 'Teile', folge: 4 },

    // === QUARZ ===
    { name: 'Quarzkristall', output_item: 'Quarzkristall', output_rate: 22.5, inputs: [{ item: 'Rohquarz', rate: 37.5 }], machine: 'Konstrukteur', power: 4, alt: false, tier: 'Tier 3', cat: 'Quarz', folge: 4 },
    { name: 'Quarzsand (Quarz)', output_item: 'Quarzsand', output_rate: 75, inputs: [{ item: 'Rohquarz', rate: 25 }], machine: 'Konstrukteur', power: 4, alt: false, tier: 'Tier 3', cat: 'Quarz', folge: 4 },
    { name: 'Quarzoszillator', output_item: 'Quarzoszillator', output_rate: 1, inputs: [{ item: 'Quarzkristall', rate: 36 }, { item: 'Kabel', rate: 28 }, { item: 'Verstärkte Eisenplatte', rate: 5 }], machine: 'Hersteller', power: 55, alt: false, tier: 'Tier 6', cat: 'Quarz', folge: 4 },

    // === COMPUTER ===
    { name: 'Computer', output_item: 'Computer', output_rate: 2.5, inputs: [{ item: 'Platine', rate: 25 }, { item: 'Kabel', rate: 22.5 }, { item: 'Kunststoff', rate: 45 }, { item: 'Schraube', rate: 130 }], machine: 'Hersteller', power: 55, alt: false, tier: 'Tier 6', cat: 'Elektronik', folge: 5 },
    { name: 'Platine', output_item: 'Platine', output_rate: 7.5, inputs: [{ item: 'Kupferblech', rate: 15 }, { item: 'Kunststoff', rate: 30 }], machine: 'Monteur', power: 15, alt: false, tier: 'Tier 5', cat: 'Elektronik', folge: 5 },
    { name: 'Adaptive Steuereinheit', output_item: 'Adaptive Steuereinheit', output_rate: 2, inputs: [{ item: 'Automatische Verkabelung', rate: 15 }, { item: 'Platine', rate: 10 }, { item: 'Schwerer Modularer Rahmen', rate: 2 }, { item: 'Computer', rate: 2 }], machine: 'Hersteller', power: 55, alt: false, tier: 'Tier 7', cat: 'Elektronik', folge: 5 },

    // === ALUMINIUM ===
    { name: 'Aluminiumbarren', output_item: 'Aluminiumbarren', output_rate: 60, inputs: [{ item: 'Aluminiumschrott', rate: 90 }, { item: 'Quarzsand', rate: 75 }], machine: 'Schmelze', power: 4, alt: false, tier: 'Tier 7', cat: 'Barren', folge: 5 },
    { name: 'Alclad-Platte', output_item: 'Alclad-Platte', output_rate: 30, inputs: [{ item: 'Aluminiumbarren', rate: 30 }, { item: 'Kupferbarren', rate: 10 }], machine: 'Monteur', power: 15, alt: false, tier: 'Tier 7', cat: 'Teile', folge: 5 },
    { name: 'Funksteuereinheit', output_item: 'Funksteuereinheit', output_rate: 2.5, inputs: [{ item: 'Aluminiumgehäuse', rate: 40 }, { item: 'Quarzoszillator', rate: 1.25 }, { item: 'Computer', rate: 1.25 }], machine: 'Hersteller', power: 55, alt: false, tier: 'Tier 7', cat: 'Elektronik', folge: 5 },

    // === KÜHLSYSTEME ===
    { name: 'Kühlsystem', output_item: 'Kühlsystem', output_rate: 6, inputs: [{ item: 'Kühlmittel', rate: 30 }, { item: 'Gummi', rate: 30 }, { item: 'Wasser', rate: 45 }, { item: 'Stickstoff', rate: 150 }], machine: 'Mixer', power: 75, alt: false, tier: 'Tier 8', cat: 'Teile', folge: 5 },
    { name: 'Verschmolzener Modularer Rahmen', output_item: 'Verschmolzener Modularer Rahmen', output_rate: 1.5, inputs: [{ item: 'Schwerer Modularer Rahmen', rate: 1.5 }, { item: 'Aluminiumgehäuse', rate: 75 }, { item: 'Stickstoff', rate: 37.5 }], machine: 'Mixer', power: 75, alt: false, tier: 'Tier 8', cat: 'Teile', folge: 5 },

    // === HIGH-TECH ===
    { name: 'Supercomputer', output_item: 'Supercomputer', output_rate: 1.875, inputs: [{ item: 'Computer', rate: 3.75 }, { item: 'KI-Begrenzer', rate: 3.75 }, { item: 'Turbodraht', rate: 56.25 }, { item: 'Kühlsystem', rate: 3.75 }], machine: 'Hersteller', power: 55, alt: false, tier: 'Tier 8', cat: 'Elektronik', folge: 6 },
    { name: 'Turbomotor', output_item: 'Turbomotor', output_rate: 1.875, inputs: [{ item: 'Kühlsystem', rate: 7.5 }, { item: 'Funksteuereinheit', rate: 3.75 }, { item: 'Motor', rate: 7.5 }, { item: 'Gummi', rate: 45 }], machine: 'Hersteller', power: 55, alt: false, tier: 'Tier 8', cat: 'Motoren', folge: 6 },

    // === ENDGAME ===
    { name: 'Thermaler Raketenantrieb', output_item: 'Thermaler Raketenantrieb', output_rate: 2, inputs: [{ item: 'Modularer Motor', rate: 4 }, { item: 'Turbomotor', rate: 2 }, { item: 'Kühlsystem', rate: 12 }, { item: 'Verschmolzener Modularer Rahmen', rate: 2 }], machine: 'Hersteller', power: 55, alt: false, tier: 'Tier 8', cat: 'Raumfahrt', folge: 7 },
    { name: 'Montage-Leitsystem', output_item: 'Montage-Leitsystem', output_rate: 1, inputs: [{ item: 'Adaptive Steuereinheit', rate: 2 }, { item: 'Supercomputer', rate: 1 }], machine: 'Hersteller', power: 55, alt: false, tier: 'Tier 9', cat: 'Raumfahrt', folge: 7 },
    { name: 'Magnetfeld-Generator', output_item: 'Magnetfeld-Generator', output_rate: 2, inputs: [{ item: 'Mehrzweckgerüst', rate: 5 }, { item: 'Elektromagnetischer Steuerungsstab', rate: 2 }, { item: 'Batterie', rate: 10 }], machine: 'Hersteller', power: 55, alt: false, tier: 'Tier 9', cat: 'Raumfahrt', folge: 7 },

    // === ALTERNATIVREZEPTE ===
    { name: 'Stahlbarren (Petrolkoks)', output_item: 'Stahlbarren', output_rate: 60, inputs: [{ item: 'Eisenerz', rate: 45 }, { item: 'Petrolkoks', rate: 45 }], machine: 'Gießerei', power: 16, alt: true, unlock: 'HDD', tier: 'Tier 5', cat: 'Barren', folge: 3 },
    { name: 'Schrauben (Stahlstange)', output_item: 'Schraube', output_rate: 260, inputs: [{ item: 'Stahlträger', rate: 5 }], machine: 'Konstrukteur', power: 4, alt: true, unlock: 'HDD', tier: 'Tier 3', cat: 'Teile', folge: 2 },
    { name: 'Eisenbarren (Legierung)', output_item: 'Eisenbarren', output_rate: 50, inputs: [{ item: 'Eisenerz', rate: 20 }, { item: 'Kupfererz', rate: 20 }], machine: 'Gießerei', power: 16, alt: true, unlock: 'HDD', tier: 'Tier 1', cat: 'Barren', folge: 1 },
    { name: 'Verstärkte Eisenplatte (Geschweißt)', output_item: 'Verstärkte Eisenplatte', output_rate: 5.625, inputs: [{ item: 'Eisenplatte', rate: 90 }, { item: 'Schraube', rate: 37.5 }], machine: 'Monteur', power: 15, alt: true, unlock: 'HDD', tier: 'Tier 2', cat: 'Teile', folge: 1 },
    { name: 'Kupferdraht (Turbo)', output_item: 'Draht', output_rate: 67.5, inputs: [{ item: 'Kupferbarren', rate: 7.5 }, { item: 'Katekit', rate: 3.75 }], machine: 'Monteur', power: 15, alt: true, unlock: 'MAM', tier: 'Tier 2', cat: 'Teile', folge: 2 },
    { name: 'Motor (Gummi)', output_item: 'Motor', output_rate: 7.5, inputs: [{ item: 'Rotor', rate: 7.5 }, { item: 'Stator', rate: 7.5 }, { item: 'Gummi', rate: 45 }], machine: 'Monteur', power: 15, alt: true, unlock: 'HDD', tier: 'Tier 5', cat: 'Motoren', folge: 3 },
    { name: 'Schwerer Modularer Rahmen (Verschraubt)', output_item: 'Schwerer Modularer Rahmen', output_rate: 3, inputs: [{ item: 'Modularer Rahmen', rate: 18 }, { item: 'Verstärkte Eisenplatte', rate: 12 }, { item: 'Stahlrohr', rate: 36 }, { item: 'Schraube', rate: 300 }], machine: 'Hersteller', power: 55, alt: true, unlock: 'HDD', tier: 'Tier 6', cat: 'Teile', folge: 4 },
    { name: 'Computer (Quarz)', output_item: 'Computer', output_rate: 3.75, inputs: [{ item: 'Platine', rate: 18.75 }, { item: 'Quarzkristall', rate: 18.75 }], machine: 'Monteur', power: 15, alt: true, unlock: 'HDD', tier: 'Tier 6', cat: 'Elektronik', folge: 5 },
    { name: 'Kunststoff (Recycling)', output_item: 'Kunststoff', output_rate: 60, inputs: [{ item: 'Gummi', rate: 30 }, { item: 'Treibstoff', rate: 30 }], machine: 'Raffinerie', power: 30, alt: true, unlock: 'HDD', tier: 'Tier 5', cat: 'Öl', folge: 3 },
    { name: 'Gummi (Recycling)', output_item: 'Gummi', output_rate: 60, inputs: [{ item: 'Kunststoff', rate: 30 }, { item: 'Treibstoff', rate: 30 }], machine: 'Raffinerie', power: 30, alt: true, unlock: 'HDD', tier: 'Tier 5', cat: 'Öl', folge: 3 },
    { name: 'Turbomotor (Turbo-Elektro)', output_item: 'Turbomotor', output_rate: 2.8125, inputs: [{ item: 'Motor', rate: 6.5625 }, { item: 'Funksteuereinheit', rate: 4.6875 }, { item: 'Elektromagnetischer Steuerungsstab', rate: 4.6875 }, { item: 'Rotor', rate: 6.5625 }], machine: 'Hersteller', power: 55, alt: true, unlock: 'HDD', tier: 'Tier 8', cat: 'Motoren', folge: 6 },
  ];

  for (const r of recipes) {
    execute(
      `INSERT INTO recipes (name, output_item, output_rate, inputs_json, machine, power_original_mw, power_adjusted_mw, is_alternative, unlock_method, tier, folge_number, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [r.name, r.output_item, r.output_rate, JSON.stringify(r.inputs), r.machine, r.power, r.power, r.alt ? 1 : 0, r.unlock || null, r.tier, r.folge || null, r.cat]
    );
  }
}
