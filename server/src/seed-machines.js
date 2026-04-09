import { execute, queryAll } from './database.js';

/**
 * Setzt die Maschinendaten (Produktionsplan) für jede Produktion.
 * Basiert auf Tschukis Masterclass 1.0 Calculator-Screenshots.
 * Wird bei jedem Start ausgeführt, überschreibt aber nur leere Einträge (machines_json IS NULL).
 */
export function seedMachines() {
  const prods = queryAll('SELECT id, name, machines_json FROM productions');

  const data = {

    // ─── FOLGE 1 ────────────────────────────────────────────────────────────
    'Dwight D. Eisentower': {
      raw_inputs: [
        { item: 'Eisenerz', rate: 510 }
      ],
      steps: [
        {
          machine: 'Schmelze', count_display: '17', recipe: 'Eisenbarren', is_alternate: false,
          inputs:  [{ item: 'Eisenerz',   rate: 510 }],
          outputs: [{ item: 'Eisenbarren', rate: 510 }]
        },
        {
          machine: 'Konstrukteur', count_display: '8', recipe: 'Eisenplatte', is_alternate: false,
          inputs:  [{ item: 'Eisenbarren', rate: 240 }],
          outputs: [{ item: 'Eisenplatte', rate: 160 }]
        },
        {
          machine: 'Konstrukteur', count_display: '8', recipe: 'Eisenstange', is_alternate: false,
          inputs:  [{ item: 'Eisenbarren', rate: 150 }],
          outputs: [{ item: 'Eisenstange', rate: 120 }]
        },
        {
          machine: 'Konstrukteur', count_display: '12', recipe: 'Alt: Gegossene Schraube', is_alternate: true,
          inputs:  [{ item: 'Eisenbarren', rate: 120 }],
          outputs: [{ item: 'Schraube', rate: 600 }]
        },
        {
          machine: 'Monteur', count_display: '5', recipe: 'Verstärkte Eisenplatte', is_alternate: false,
          inputs:  [{ item: 'Eisenplatte', rate: 150 }, { item: 'Schraube', rate: 300 }],
          outputs: [{ item: 'Verstärkte Eisenplatte', rate: 25 }]
        },
        {
          machine: 'Monteur', count_display: '3', recipe: 'Rotor', is_alternate: false,
          inputs:  [{ item: 'Eisenstange', rate: 60 }, { item: 'Schraube', rate: 300 }],
          outputs: [{ item: 'Rotor', rate: 12 }]
        },
        {
          machine: 'Monteur', count_display: '5', recipe: 'Intelligente Beschichtung', is_alternate: false,
          inputs:  [{ item: 'Verstärkte Eisenplatte', rate: 10 }, { item: 'Rotor', rate: 10 }],
          outputs: [{ item: 'Intelligente Beschichtung', rate: 10 }]
        },
        {
          machine: 'Monteur', count_display: '4', recipe: 'Modularer Rahmen', is_alternate: false,
          inputs:  [{ item: 'Verstärkte Eisenplatte', rate: 12 }, { item: 'Eisenstange', rate: 60 }],
          outputs: [{ item: 'Modularer Rahmen', rate: 8 }]
        }
      ],
      final_outputs: [
        { item: 'Eisenplatte',            rate: 10 },
        { item: 'Verstärkte Eisenplatte', rate: 3  },
        { item: 'Rotor',                  rate: 2  },
        { item: 'Intelligente Beschichtung', rate: 10 },
        { item: 'Modularer Rahmen',       rate: 8  }
      ]
    },

    // ─── FOLGE 2 ────────────────────────────────────────────────────────────
    'Copterium Starter': {
      raw_inputs: [
        { item: 'Kupfererz',    rate: 120 },
        { item: 'Caterium-Erz', rate: 84  }
      ],
      steps: [
        {
          machine: 'Schmelze', count_display: '4', recipe: 'Kupferbarren', is_alternate: false,
          inputs:  [{ item: 'Kupfererz',    rate: 120 }],
          outputs: [{ item: 'Kupferbarren', rate: 120 }]
        },
        {
          machine: 'Konstrukteur', count_display: '2.667', recipe: 'Draht', is_alternate: false,
          inputs:  [{ item: 'Kupferbarren', rate: 40 }],
          outputs: [{ item: 'Draht', rate: 80 }]
        },
        {
          machine: 'Konstrukteur', count_display: '4', recipe: 'Kupferblech', is_alternate: false,
          inputs:  [{ item: 'Kupferbarren', rate: 80 }],
          outputs: [{ item: 'Kupferblech', rate: 40 }]
        },
        {
          machine: 'Konstrukteur', count_display: '1', recipe: 'Kabel', is_alternate: false,
          inputs:  [{ item: 'Draht', rate: 60 }],
          outputs: [{ item: 'Kabel', rate: 30 }]
        },
        {
          machine: 'Schmelze', count_display: '1.867', recipe: 'Caterium-Barren', is_alternate: false,
          inputs:  [{ item: 'Caterium-Erz',   rate: 84 }],
          outputs: [{ item: 'Caterium-Barren', rate: 28 }]
        },
        {
          machine: 'Konstrukteur', count_display: '2.333', recipe: 'Turbodraht', is_alternate: false,
          inputs:  [{ item: 'Caterium-Barren', rate: 28  }],
          outputs: [{ item: 'Turbodraht',       rate: 140 }]
        },
        {
          machine: 'Monteur', count_display: '1', recipe: 'KI-Begrenzer', is_alternate: false,
          inputs:  [{ item: 'Kupferblech', rate: 25 }, { item: 'Turbodraht', rate: 100 }],
          outputs: [{ item: 'KI-Begrenzer', rate: 5 }]
        }
      ],
      final_outputs: [
        { item: 'Draht',        rate: 20 },
        { item: 'Kabel',        rate: 30 },
        { item: 'Kupferblech',  rate: 15 },
        { item: 'Turbodraht',   rate: 40 },
        { item: 'KI-Begrenzer', rate: 5  }
      ]
    },

    'Steelworks Starter': {
      raw_inputs: [
        { item: 'Eisenerz', rate: 120 },
        { item: 'Kohle',    rate: 120 }
      ],
      steps: [
        {
          machine: 'Gießerei', count_display: '2.667', recipe: 'Stahlbarren', is_alternate: false,
          inputs:  [{ item: 'Eisenerz', rate: 120 }, { item: 'Kohle', rate: 120 }],
          outputs: [{ item: 'Stahlbarren', rate: 120 }]
        },
        {
          machine: 'Konstrukteur', count_display: '1.5', recipe: 'Stahlträger', is_alternate: false,
          inputs:  [{ item: 'Stahlbarren', rate: 90 }],
          outputs: [{ item: 'Stahlträger', rate: 22.5 }]
        },
        {
          machine: 'Konstrukteur', count_display: '1', recipe: 'Stahlrohr', is_alternate: false,
          inputs:  [{ item: 'Stahlbarren', rate: 30 }],
          outputs: [{ item: 'Stahlrohr', rate: 20 }]
        }
      ],
      final_outputs: [
        { item: 'Stahlträger', rate: 22.5 },
        { item: 'Stahlrohr',   rate: 20   }
      ]
    },

    'Steelworks Endgame': {
      raw_inputs: [
        { item: 'Eisenerz',     rate: 400 },
        { item: 'Kohle',        rate: 400 },
        { item: 'Kupfererz',    rate: 330 },
        { item: 'Kalkstein',    rate: 270 },
        { item: 'Modularer Rahmen', rate: 6.25, note: 'von Dwight D. Eisentower' }
      ],
      steps: [
        {
          machine: 'Schmelze', count_display: '13.333', recipe: 'Eisenbarren', is_alternate: false,
          inputs:  [{ item: 'Eisenerz',    rate: 400 }],
          outputs: [{ item: 'Eisenbarren', rate: 400 }]
        },
        {
          machine: 'Gießerei', count_display: '10', recipe: 'Alt: Massiver Stahlbarren', is_alternate: true,
          inputs:  [{ item: 'Eisenbarren', rate: 400 }, { item: 'Kohle', rate: 400 }],
          outputs: [{ item: 'Stahlbarren', rate: 502.5 }]
        },
        {
          machine: 'Konstrukteur', count_display: '6', recipe: 'Beton', is_alternate: false,
          inputs:  [{ item: 'Kalkstein', rate: 270 }],
          outputs: [{ item: 'Beton', rate: 90 }]
        },
        {
          machine: 'Konstrukteur', count_display: '8.375', recipe: 'Stahlträger', is_alternate: false,
          inputs:  [{ item: 'Stahlbarren', rate: 251.25 }],
          outputs: [{ item: 'Stahlträger', rate: 125.625 }]
        },
        {
          machine: 'Monteur', count_display: '2', recipe: 'Ummantelte Industrieträger', is_alternate: false,
          inputs:  [{ item: 'Stahlträger', rate: 36 }, { item: 'Beton', rate: 72 }],
          outputs: [{ item: 'Ummantelte Industrieträger', rate: 12 }]
        },
        {
          machine: 'Monteur', count_display: '2.5', recipe: 'Mehrzweckgerüst', is_alternate: false,
          inputs:  [{ item: 'Modularer Rahmen', rate: 6.25 }, { item: 'Stahlträger', rate: 75 }],
          outputs: [{ item: 'Mehrzweckgerüst', rate: 12.5 }]
        },
        {
          machine: 'Konstrukteur', count_display: '3.25', recipe: 'Stahlrohr', is_alternate: false,
          inputs:  [{ item: 'Stahlbarren', rate: 97.5 }],
          outputs: [{ item: 'Stahlrohr', rate: 65 }]
        },
        {
          machine: 'Schmelze', count_display: '11', recipe: 'Kupferbarren', is_alternate: false,
          inputs:  [{ item: 'Kupfererz',    rate: 330 }],
          outputs: [{ item: 'Kupferbarren', rate: 330 }]
        },
        {
          machine: 'Konstrukteur', count_display: '22', recipe: 'Draht', is_alternate: false,
          inputs:  [{ item: 'Kupferbarren', rate: 330 }],
          outputs: [{ item: 'Draht', rate: 660 }]
        },
        {
          machine: 'Konstrukteur', count_display: '8.333', recipe: 'Kabel', is_alternate: false,
          inputs:  [{ item: 'Draht', rate: 500 }],
          outputs: [{ item: 'Kabel', rate: 250 }]
        },
        {
          machine: 'Monteur', count_display: '4', recipe: 'Stator', is_alternate: false,
          inputs:  [{ item: 'Stahlrohr', rate: 60 }, { item: 'Draht', rate: 160 }],
          outputs: [{ item: 'Stator', rate: 20 }]
        },
        {
          machine: 'Monteur', count_display: '5', recipe: 'Automatische Verkabelung', is_alternate: false,
          inputs:  [{ item: 'Kabel', rate: 250 }, { item: 'Stator', rate: 12.5 }],
          outputs: [{ item: 'Automatische Verkabelung', rate: 12.5 }]
        }
      ],
      final_outputs: [
        { item: 'Beton',                      rate: 18    },
        { item: 'Ummantelte Industrieträger', rate: 12    },
        { item: 'Stahlträger',                rate: 14.625},
        { item: 'Mehrzweckgerüst',            rate: 12.5  },
        { item: 'Stahlrohr',                  rate: 5     },
        { item: 'Stator',                     rate: 7.5   },
        { item: 'Automatische Verkabelung',   rate: 12.5  }
      ]
    },

    // ─── FOLGE 3 ────────────────────────────────────────────────────────────
    'General Motors Starter': {
      raw_inputs: [
        { item: 'Eisenerz', rate: 255.556 },
        { item: 'Kohle',    rate: 100     }
      ],
      steps: [
        {
          machine: 'Schmelze', count_display: '8.519', recipe: 'Eisenbarren', is_alternate: false,
          inputs:  [{ item: 'Eisenerz',    rate: 255.556 }],
          outputs: [{ item: 'Eisenbarren', rate: 255.556 }]
        },
        {
          machine: 'Gießerei', count_display: '2.5', recipe: 'Alt: Massiver Stahlbarren', is_alternate: true,
          inputs:  [{ item: 'Eisenbarren', rate: 100 }, { item: 'Kohle', rate: 100 }],
          outputs: [{ item: 'Stahlbarren', rate: 150 }]
        },
        {
          machine: 'Konstrukteur', count_display: '12.444', recipe: 'Alt: Eisendraht', is_alternate: true,
          inputs:  [{ item: 'Eisenbarren', rate: 155.556 }],
          outputs: [{ item: 'Draht', rate: 120 }]
        },
        {
          machine: 'Konstrukteur', count_display: '5', recipe: 'Stahlrohr', is_alternate: false,
          inputs:  [{ item: 'Stahlbarren', rate: 150 }],
          outputs: [{ item: 'Stahlrohr', rate: 100 }]
        },
        {
          machine: 'Monteur', count_display: '4', recipe: 'Stator', is_alternate: false,
          inputs:  [{ item: 'Stahlrohr', rate: 60 }, { item: 'Draht', rate: 120 }],
          outputs: [{ item: 'Stator', rate: 20 }]
        },
        {
          machine: 'Monteur', count_display: '4', recipe: 'Alt: Stahl-Rotor', is_alternate: true,
          inputs:  [{ item: 'Stahlrohr', rate: 40 }, { item: 'Draht', rate: 120 }],
          outputs: [{ item: 'Rotor', rate: 20 }]
        },
        {
          machine: 'Monteur', count_display: '2', recipe: 'Motor', is_alternate: false,
          inputs:  [{ item: 'Rotor', rate: 20 }, { item: 'Stator', rate: 20 }],
          outputs: [{ item: 'Motor', rate: 10 }]
        }
      ],
      final_outputs: [
        { item: 'Motor', rate: 10 }
      ]
    },

    'Oil of Olaz Starter': {
      raw_inputs: [
        { item: 'Rohöl', rate: 210 }
      ],
      steps: [
        {
          machine: 'Raffinerie', count_display: '4', recipe: 'Gummi', is_alternate: false,
          inputs:  [{ item: 'Rohöl', rate: 120 }],
          outputs: [{ item: 'Gummi', rate: 80 }, { item: 'Schweres Ölrückstand', rate: 80 }]
        },
        {
          machine: 'Raffinerie', count_display: '3', recipe: 'Kunststoff', is_alternate: false,
          inputs:  [{ item: 'Rohöl', rate: 90 }],
          outputs: [{ item: 'Kunststoff', rate: 60 }, { item: 'Schweres Ölrückstand', rate: 30 }]
        },
        {
          machine: 'Raffinerie', count_display: '2.75', recipe: 'Petrolkoks', is_alternate: false,
          inputs:  [{ item: 'Schweres Ölrückstand', rate: 110 }],
          outputs: [{ item: 'Petrolkoks', rate: 330 }]
        }
      ],
      final_outputs: [
        { item: 'Gummi',      rate: 80  },
        { item: 'Kunststoff', rate: 60  },
        { item: 'Petrolkoks', rate: 330 }
      ]
    }

    // Weitere Produktionen werden nach Screenshot-Lieferung ergänzt
  };

  for (const [name, machines] of Object.entries(data)) {
    const prod = prods.find(p => p.name === name);
    if (prod && !prod.machines_json) {
      execute(
        'UPDATE productions SET machines_json = ? WHERE id = ?',
        [JSON.stringify(machines), prod.id]
      );
    }
  }
}
