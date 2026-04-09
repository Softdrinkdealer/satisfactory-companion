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
          machine: 'Schmelzofen', count_display: '17', recipe: 'Eisenbarren', is_alternate: false,
          inputs:  [{ item: 'Eisenerz',   rate: 510 }],
          outputs: [{ item: 'Eisenbarren', rate: 510 }]
        },
        {
          machine: 'Konstruktor', count_display: '8', recipe: 'Eisenplatte', is_alternate: false,
          inputs:  [{ item: 'Eisenbarren', rate: 240 }],
          outputs: [{ item: 'Eisenplatte', rate: 160 }]
        },
        {
          machine: 'Konstruktor', count_display: '8', recipe: 'Eisenstange', is_alternate: false,
          inputs:  [{ item: 'Eisenbarren', rate: 150 }],
          outputs: [{ item: 'Eisenstange', rate: 120 }]
        },
        {
          machine: 'Konstruktor', count_display: '12', recipe: 'Alt: Gegossene Schraube', is_alternate: true,
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
          machine: 'Schmelzofen', count_display: '4', recipe: 'Kupferbarren', is_alternate: false,
          inputs:  [{ item: 'Kupfererz',    rate: 120 }],
          outputs: [{ item: 'Kupferbarren', rate: 120 }]
        },
        {
          machine: 'Konstruktor', count_display: '2.667', recipe: 'Draht', is_alternate: false,
          inputs:  [{ item: 'Kupferbarren', rate: 40 }],
          outputs: [{ item: 'Draht', rate: 80 }]
        },
        {
          machine: 'Konstruktor', count_display: '4', recipe: 'Kupferblech', is_alternate: false,
          inputs:  [{ item: 'Kupferbarren', rate: 80 }],
          outputs: [{ item: 'Kupferblech', rate: 40 }]
        },
        {
          machine: 'Konstruktor', count_display: '1', recipe: 'Kabel', is_alternate: false,
          inputs:  [{ item: 'Draht', rate: 60 }],
          outputs: [{ item: 'Kabel', rate: 30 }]
        },
        {
          machine: 'Schmelzofen', count_display: '1.867', recipe: 'Caterium-Barren', is_alternate: false,
          inputs:  [{ item: 'Caterium-Erz',   rate: 84 }],
          outputs: [{ item: 'Caterium-Barren', rate: 28 }]
        },
        {
          machine: 'Konstruktor', count_display: '2.333', recipe: 'Turbodraht', is_alternate: false,
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
          machine: 'Konstruktor', count_display: '1.5', recipe: 'Stahlträger', is_alternate: false,
          inputs:  [{ item: 'Stahlbarren', rate: 90 }],
          outputs: [{ item: 'Stahlträger', rate: 22.5 }]
        },
        {
          machine: 'Konstruktor', count_display: '1', recipe: 'Stahlrohr', is_alternate: false,
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
          machine: 'Schmelzofen', count_display: '13.333', recipe: 'Eisenbarren', is_alternate: false,
          inputs:  [{ item: 'Eisenerz',    rate: 400 }],
          outputs: [{ item: 'Eisenbarren', rate: 400 }]
        },
        {
          machine: 'Gießerei', count_display: '10', recipe: 'Alt: Massiver Stahlbarren', is_alternate: true,
          inputs:  [{ item: 'Eisenbarren', rate: 400 }, { item: 'Kohle', rate: 400 }],
          outputs: [{ item: 'Stahlbarren', rate: 502.5 }]
        },
        {
          machine: 'Konstruktor', count_display: '6', recipe: 'Beton', is_alternate: false,
          inputs:  [{ item: 'Kalkstein', rate: 270 }],
          outputs: [{ item: 'Beton', rate: 90 }]
        },
        {
          machine: 'Konstruktor', count_display: '8.375', recipe: 'Stahlträger', is_alternate: false,
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
          machine: 'Konstruktor', count_display: '3.25', recipe: 'Stahlrohr', is_alternate: false,
          inputs:  [{ item: 'Stahlbarren', rate: 97.5 }],
          outputs: [{ item: 'Stahlrohr', rate: 65 }]
        },
        {
          machine: 'Schmelzofen', count_display: '11', recipe: 'Kupferbarren', is_alternate: false,
          inputs:  [{ item: 'Kupfererz',    rate: 330 }],
          outputs: [{ item: 'Kupferbarren', rate: 330 }]
        },
        {
          machine: 'Konstruktor', count_display: '22', recipe: 'Draht', is_alternate: false,
          inputs:  [{ item: 'Kupferbarren', rate: 330 }],
          outputs: [{ item: 'Draht', rate: 660 }]
        },
        {
          machine: 'Konstruktor', count_display: '8.333', recipe: 'Kabel', is_alternate: false,
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
          machine: 'Schmelzofen', count_display: '8.519', recipe: 'Eisenbarren', is_alternate: false,
          inputs:  [{ item: 'Eisenerz',    rate: 255.556 }],
          outputs: [{ item: 'Eisenbarren', rate: 255.556 }]
        },
        {
          machine: 'Gießerei', count_display: '2.5', recipe: 'Alt: Massiver Stahlbarren', is_alternate: true,
          inputs:  [{ item: 'Eisenbarren', rate: 100 }, { item: 'Kohle', rate: 100 }],
          outputs: [{ item: 'Stahlbarren', rate: 150 }]
        },
        {
          machine: 'Konstruktor', count_display: '12.444', recipe: 'Alt: Eisendraht', is_alternate: true,
          inputs:  [{ item: 'Eisenbarren', rate: 155.556 }],
          outputs: [{ item: 'Draht', rate: 120 }]
        },
        {
          machine: 'Konstruktor', count_display: '5', recipe: 'Stahlrohr', is_alternate: false,
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
    },

    // ─── FOLGE 3 (Endgame) ──────────────────────────────────────────────────
    'Copterium City Final': {
      raw_inputs: [
        { item: 'Kupfererz',    rate: 580 },
        { item: 'Caterium-Erz', rate: 552 }
      ],
      steps: [
        {
          machine: 'Schmelzofen', count_display: '19.333', recipe: 'Kupferbarren', is_alternate: false,
          inputs:  [{ item: 'Kupfererz',    rate: 580 }],
          outputs: [{ item: 'Kupferbarren', rate: 580 }]
        },
        {
          machine: 'Schmelzofen', count_display: '12.267', recipe: 'Caterium-Barren', is_alternate: false,
          inputs:  [{ item: 'Caterium-Erz',   rate: 552 }],
          outputs: [{ item: 'Caterium-Barren', rate: 184 }]
        },
        {
          machine: 'Konstruktor', count_display: '4', recipe: 'Draht', is_alternate: false,
          inputs:  [{ item: 'Kupferbarren', rate: 60 }],
          outputs: [{ item: 'Draht', rate: 120 }]
        },
        {
          machine: 'Konstruktor', count_display: '26', recipe: 'Kupferblech', is_alternate: false,
          inputs:  [{ item: 'Kupferbarren', rate: 520 }],
          outputs: [{ item: 'Kupferblech', rate: 260 }]
        },
        {
          machine: 'Konstruktor', count_display: '1', recipe: 'Kabel', is_alternate: false,
          inputs:  [{ item: 'Draht', rate: 60 }],
          outputs: [{ item: 'Kabel', rate: 30 }]
        },
        {
          machine: 'Konstruktor', count_display: '15.333', recipe: 'Turbodraht', is_alternate: false,
          inputs:  [{ item: 'Caterium-Barren', rate: 184 }],
          outputs: [{ item: 'Turbodraht', rate: 920 }]
        },
        {
          machine: 'Monteur', count_display: '7', recipe: 'KI-Begrenzer', is_alternate: false,
          inputs:  [{ item: 'Kupferblech', rate: 175 }, { item: 'Turbodraht', rate: 700 }],
          outputs: [{ item: 'KI-Begrenzer', rate: 35 }]
        }
      ],
      final_outputs: [
        { item: 'Draht',        rate: 60  },
        { item: 'Kabel',        rate: 30  },
        { item: 'Kupferblech',  rate: 85  },
        { item: 'Turbodraht',   rate: 220 },
        { item: 'KI-Begrenzer', rate: 35  }
      ]
    },

    'General Motors Final': {
      raw_inputs: [
        { item: 'Eisenerz',  rate: 250 },
        { item: 'Kohle',     rate: 250 },
        { item: 'Kupfererz', rate: 350 },
        { item: 'Gummi',     rate: 75,  note: 'von Oil of Olaz' },
        { item: 'Intelligente Beschichtung', rate: 10, note: 'von Dwight D. Eisentower' }
      ],
      steps: [
        {
          machine: 'Schmelzofen', count_display: '8.333', recipe: 'Eisenbarren', is_alternate: false,
          inputs:  [{ item: 'Eisenerz',    rate: 250 }],
          outputs: [{ item: 'Eisenbarren', rate: 250 }]
        },
        {
          machine: 'Gießerei', count_display: '6.25', recipe: 'Alt: Massiver Stahlbarren', is_alternate: true,
          inputs:  [{ item: 'Eisenbarren', rate: 250 }, { item: 'Kohle', rate: 250 }],
          outputs: [{ item: 'Stahlbarren', rate: 375 }]
        },
        {
          machine: 'Schmelzofen', count_display: '11.667', recipe: 'Kupferbarren', is_alternate: false,
          inputs:  [{ item: 'Kupfererz',    rate: 350 }],
          outputs: [{ item: 'Kupferbarren', rate: 350 }]
        },
        {
          machine: 'Konstruktor', count_display: '23.333', recipe: 'Draht', is_alternate: false,
          inputs:  [{ item: 'Kupferbarren', rate: 350 }],
          outputs: [{ item: 'Draht', rate: 700 }]
        },
        {
          machine: 'Konstruktor', count_display: '12.5', recipe: 'Stahlrohr', is_alternate: false,
          inputs:  [{ item: 'Stahlbarren', rate: 375 }],
          outputs: [{ item: 'Stahlrohr', rate: 250 }]
        },
        {
          machine: 'Monteur', count_display: '10', recipe: 'Stator', is_alternate: false,
          inputs:  [{ item: 'Stahlrohr', rate: 150 }, { item: 'Draht', rate: 400 }],
          outputs: [{ item: 'Stator', rate: 50 }]
        },
        {
          machine: 'Monteur', count_display: '10', recipe: 'Alt: Stahl-Rotor', is_alternate: true,
          inputs:  [{ item: 'Stahlrohr', rate: 100 }, { item: 'Draht', rate: 300 }],
          outputs: [{ item: 'Rotor', rate: 50 }]
        },
        {
          machine: 'Monteur', count_display: '5', recipe: 'Motor', is_alternate: false,
          inputs:  [{ item: 'Rotor', rate: 50 }, { item: 'Stator', rate: 50 }],
          outputs: [{ item: 'Motor', rate: 25 }]
        },
        {
          machine: 'Manufaktor', count_display: '5', recipe: 'Modulare Maschine', is_alternate: false,
          inputs:  [{ item: 'Motor', rate: 10 }, { item: 'Gummi', rate: 75 }, { item: 'Intelligente Beschichtung', rate: 10 }],
          outputs: [{ item: 'Modulare Maschine', rate: 5 }]
        }
      ],
      final_outputs: [
        { item: 'Motor',             rate: 15 },
        { item: 'Modulare Maschine', rate: 5  }
      ]
    },

    // ─── FOLGE 4 ────────────────────────────────────────────────────────────
    'HeavyRames Endgame': {
      raw_inputs: [
        { item: 'Eisenerz',  rate: 237.778 },
        { item: 'Kohle',     rate: 172.5   },
        { item: 'Kalkstein', rate: 303.75  }
      ],
      steps: [
        {
          machine: 'Schmelzofen', count_display: '7.926', recipe: 'Eisenbarren', is_alternate: false,
          inputs:  [{ item: 'Eisenerz',    rate: 237.778 }],
          outputs: [{ item: 'Eisenbarren', rate: 237.778 }]
        },
        {
          machine: 'Gießerei', count_display: '4.313', recipe: 'Alt: Massiver Stahlbarren', is_alternate: true,
          inputs:  [{ item: 'Eisenbarren', rate: 172.5 }, { item: 'Kohle', rate: 172.5 }],
          outputs: [{ item: 'Stahlbarren', rate: 258.75 }]
        },
        {
          machine: 'Konstruktor', count_display: '1.25', recipe: 'Eisenplatte', is_alternate: false,
          inputs:  [{ item: 'Eisenbarren', rate: 37.5 }],
          outputs: [{ item: 'Eisenplatte', rate: 25 }]
        },
        {
          machine: 'Konstruktor', count_display: '2.222', recipe: 'Alt: Eisendraht', is_alternate: true,
          inputs:  [{ item: 'Eisenbarren', rate: 27.778 }],
          outputs: [{ item: 'Draht', rate: 55.556 }]
        },
        {
          machine: 'Konstruktor', count_display: '8.625', recipe: 'Stahlrohr', is_alternate: false,
          inputs:  [{ item: 'Stahlbarren', rate: 258.75 }],
          outputs: [{ item: 'Stahlrohr', rate: 172.5 }]
        },
        {
          machine: 'Konstruktor', count_display: '6.75', recipe: 'Beton', is_alternate: false,
          inputs:  [{ item: 'Kalkstein', rate: 303.75 }],
          outputs: [{ item: 'Beton', rate: 101.25 }]
        },
        {
          machine: 'Monteur', count_display: '1.333', recipe: 'Alt: Genähte Eisenplatte', is_alternate: true,
          inputs:  [{ item: 'Eisenplatte', rate: 13.333 }, { item: 'Draht', rate: 55.556 }],
          outputs: [{ item: 'Verstärkte Eisenplatte', rate: 4 }]
        },
        {
          machine: 'Monteur', count_display: '3.516', recipe: 'Alt: Ummanteltes Industrierohr', is_alternate: true,
          inputs:  [{ item: 'Stahlrohr', rate: 98.448 }, { item: 'Beton', rate: 70.32 }],
          outputs: [{ item: 'Ummantelter Industrieträger', rate: 14.063 }]
        },
        {
          machine: 'Monteur', count_display: '3.75', recipe: 'Alt: Verstählter Rahmen', is_alternate: true,
          inputs:  [{ item: 'Verstärkte Eisenplatte', rate: 7.5 }, { item: 'Stahlrohr', rate: 37.5 }],
          outputs: [{ item: 'Modularer Rahmen', rate: 11.25 }]
        },
        {
          machine: 'Manufaktor', count_display: '1.5', recipe: 'Alt: Schwerer ummantelter Rahmen', is_alternate: true,
          inputs:  [{ item: 'Modularer Rahmen', rate: 12 }, { item: 'Ummantelter Industrieträger', rate: 15 }, { item: 'Stahlrohr', rate: 36 }, { item: 'Beton', rate: 33 }],
          outputs: [{ item: 'Schwerer Modularer Rahmen', rate: 4.5 }]
        }
      ],
      final_outputs: [
        { item: 'Schwerer Modularer Rahmen', rate: 8.438, note: 'inkl. Somersloop-Boost, 4.219/min als Loop' }
      ]
    },

    'Oil of Olaz Final': {
      raw_inputs: [
        { item: 'Rohöl',  rate: 600 },
        { item: 'Wasser', rate: 600 }
      ],
      steps: [
        {
          machine: 'Raffinerie', count_display: '16', recipe: 'Gummi', is_alternate: false,
          inputs:  [{ item: 'Rohöl', rate: 480 }],
          outputs: [{ item: 'Gummi', rate: 320 }, { item: 'Schweres Ölrückstand', rate: 320 }]
        },
        {
          machine: 'Raffinerie', count_display: '2.5', recipe: 'Kunststoff', is_alternate: false,
          inputs:  [{ item: 'Rohöl', rate: 75 }],
          outputs: [{ item: 'Kunststoff', rate: 50 }, { item: 'Schweres Ölrückstand', rate: 25 }]
        },
        {
          machine: 'Raffinerie', count_display: '1.5', recipe: 'Alt: Schweres Ölrückstand', is_alternate: true,
          inputs:  [{ item: 'Rohöl', rate: 45 }],
          outputs: [{ item: 'Schweres Ölrückstand', rate: 60 }]
        },
        {
          machine: 'Raffinerie', count_display: '3', recipe: 'Petrolkoks', is_alternate: false,
          inputs:  [{ item: 'Schweres Ölrückstand', rate: 120 }],
          outputs: [{ item: 'Petrolkoks', rate: 360 }]
        },
        {
          machine: 'Raffinerie', count_display: '9.5', recipe: 'Alt: Verdünnter verpackter Kraftstoff', is_alternate: true,
          inputs:  [{ item: 'Schweres Ölrückstand', rate: 285 }, { item: 'Verpacktes Wasser', rate: 570 }],
          outputs: [{ item: 'Verpackter Kraftstoff', rate: 570 }]
        },
        {
          machine: 'Konstruktor', count_display: '0.5', recipe: 'Leerer Behälter', is_alternate: false,
          inputs:  [{ item: 'Kunststoff', rate: 15 }],
          outputs: [{ item: 'Leerer Behälter', rate: 30 }]
        },
        {
          machine: 'Abfüllanlage', count_display: '9.5', recipe: 'Verpacktes Wasser', is_alternate: false,
          inputs:  [{ item: 'Wasser', rate: 570 }, { item: 'Leerer Behälter', rate: 570 }],
          outputs: [{ item: 'Verpacktes Wasser', rate: 570 }]
        },
        {
          machine: 'Abfüllanlage', count_display: '9', recipe: 'Kraftstoff entpacken', is_alternate: false,
          inputs:  [{ item: 'Verpackter Kraftstoff', rate: 540 }],
          outputs: [{ item: 'Kraftstoff', rate: 540 }, { item: 'Leerer Behälter', rate: 540 }]
        },
        {
          machine: 'Raffinerie', count_display: '1', recipe: 'Alt: Polyester-Gewebe', is_alternate: true,
          inputs:  [{ item: 'Gummi', rate: 30 }, { item: 'Wasser', rate: 30 }],
          outputs: [{ item: 'Gewebe', rate: 30 }]
        }
      ],
      final_outputs: [
        { item: 'Gummi',               rate: 320 },
        { item: 'Kunststoff',          rate: 50  },
        { item: 'Petrolkoks',          rate: 360 },
        { item: 'Kraftstoff',          rate: 540 },
        { item: 'Verpackter Kraftstoff', rate: 30 },
        { item: 'Gewebe',              rate: 30  }
      ]
    },

    // ─── FOLGE 5 ────────────────────────────────────────────────────────────
    'Maxi IBM': {
      raw_inputs: [
        { item: 'Kupfererz',                 rate: 241 },
        { item: 'Siliziumdioxid',            rate: 101.75, note: 'von Kwartz Endgame' },
        { item: 'Kristalloszillator',        rate: 10,     note: 'von Kwartz Endgame' },
        { item: 'Automatisiertes Kabel',     rate: 12.5 },
        { item: 'Schwerer Modularer Rahmen', rate: 2.5 },
        { item: 'Schnelldraht',              rate: 210 }
      ],
      steps: [
        {
          machine: 'Schmelzofen', count_display: '8.033', recipe: 'Kupferbarren', is_alternate: false,
          inputs:  [{ item: 'Kupfererz',    rate: 241 }],
          outputs: [{ item: 'Kupferbarren', rate: 241 }]
        },
        {
          machine: 'Konstruktor', count_display: '10.175', recipe: 'Kupferblech', is_alternate: false,
          inputs:  [{ item: 'Kupferbarren', rate: 101.75 }],
          outputs: [{ item: 'Kupferblech',  rate: 101.75 }]
        },
        {
          machine: 'Konstruktor', count_display: '2.5', recipe: 'Draht', is_alternate: false,
          inputs:  [{ item: 'Kupferbarren', rate: 37.5 }],
          outputs: [{ item: 'Draht', rate: 75 }]
        },
        {
          machine: 'Konstruktor', count_display: '1.25', recipe: 'Kabel', is_alternate: false,
          inputs:  [{ item: 'Draht', rate: 75 }],
          outputs: [{ item: 'Kabel', rate: 37.5 }]
        },
        {
          machine: 'Monteur', count_display: '3.7', recipe: 'Alt: Silizium-Leiterplatine', is_alternate: true,
          inputs:  [{ item: 'Kupferblech', rate: 101.75 }, { item: 'Siliziumdioxid', rate: 101.75 }],
          outputs: [{ item: 'Leiterplatine', rate: 33.75 }]
        },
        {
          machine: 'Monteur', count_display: '6', recipe: 'Alt: Kristallcomputer', is_alternate: true,
          inputs:  [{ item: 'Leiterplatine', rate: 30 }, { item: 'Kristalloszillator', rate: 10 }],
          outputs: [{ item: 'Computer', rate: 15 }]
        },
        {
          machine: 'Manufaktor', count_display: '1', recipe: 'Hochgeschwindigkeitsverbinder', is_alternate: false,
          inputs:  [{ item: 'Leiterplatine', rate: 3.75 }, { item: 'Kabel', rate: 37.5 }, { item: 'Schnelldraht', rate: 210 }],
          outputs: [{ item: 'Hochgeschwindigkeitsverbinder', rate: 3.75 }]
        },
        {
          machine: 'Manufaktor', count_display: '2.5', recipe: 'Adaptive Steuereinheit', is_alternate: false,
          inputs:  [
            { item: 'Automatisiertes Kabel',          rate: 12.5 },
            { item: 'Hochgeschwindigkeitsverbinder',   rate: 2.5 },
            { item: 'Computer',                        rate: 2.5 },
            { item: 'Schwerer Modularer Rahmen',       rate: 2.5 }
          ],
          outputs: [{ item: 'Adaptive Steuereinheit', rate: 2.5 }]
        }
      ],
      final_outputs: [
        { item: 'Computer',                     rate: 15   },
        { item: 'Hochgeschwindigkeitsverbinder', rate: 3.75 },
        { item: 'Adaptive Steuereinheit',       rate: 5    }
      ]
    },

    'ALU Starter': {
      raw_inputs: [
        { item: 'Bauxit',      rate: 60 },
        { item: 'Wasser',      rate: 60, note: '30/min Nebenprodukt aus Aluminiumschrott-Raffinerie recycled' },
        { item: 'Kohle',       rate: 30 },
        { item: 'Roher Quarz', rate: 30 },
        { item: 'Kupfererz',   rate: 10 }
      ],
      steps: [
        {
          machine: 'Konstruktor', count_display: '1.333', recipe: 'Siliziumdioxid', is_alternate: false,
          inputs:  [{ item: 'Roher Quarz',    rate: 30 }],
          outputs: [{ item: 'Siliziumdioxid', rate: 50 }]
        },
        {
          machine: 'Raffinerie', count_display: '0.5', recipe: 'Aluminiumlösung', is_alternate: false,
          inputs:  [{ item: 'Bauxit', rate: 60 }, { item: 'Wasser', rate: 90 }],
          outputs: [{ item: 'Aluminiumlösung', rate: 60 }]
        },
        {
          machine: 'Raffinerie', count_display: '0.25', recipe: 'Aluminiumschrott', is_alternate: false,
          inputs:  [{ item: 'Aluminiumlösung', rate: 60 }, { item: 'Kohle', rate: 30 }],
          outputs: [{ item: 'Aluminiumschrott', rate: 90 }, { item: 'Wasser', rate: 30 }]
        },
        {
          machine: 'Gießerei', count_display: '1', recipe: 'Aluminiumbarren', is_alternate: false,
          inputs:  [{ item: 'Aluminiumschrott', rate: 90 }, { item: 'Siliziumdioxid', rate: 50 }],
          outputs: [{ item: 'Aluminiumbarren', rate: 60 }]
        },
        {
          machine: 'Konstruktor', count_display: '0.333', recipe: 'Aluminiumgehäuse', is_alternate: false,
          inputs:  [{ item: 'Aluminiumbarren', rate: 30 }],
          outputs: [{ item: 'Aluminiumgehäuse', rate: 20 }]
        },
        {
          machine: 'Schmelzofen', count_display: '0.333', recipe: 'Kupferbarren', is_alternate: false,
          inputs:  [{ item: 'Kupfererz',    rate: 10 }],
          outputs: [{ item: 'Kupferbarren', rate: 10 }]
        },
        {
          machine: 'Monteur', count_display: '1', recipe: 'Alclad-Aluminiumblech', is_alternate: false,
          inputs:  [{ item: 'Aluminiumbarren', rate: 30 }, { item: 'Kupferbarren', rate: 10 }],
          outputs: [{ item: 'Alclad-Aluminiumblech', rate: 30 }]
        }
      ],
      final_outputs: [
        { item: 'Aluminiumgehäuse',    rate: 20 },
        { item: 'Alclad-Aluminiumblech', rate: 30 }
      ]
    },

    'Kwartz Endgame': {
      raw_inputs: [
        { item: 'Roher Quarz', rate: 405   },
        { item: 'Wasser',      rate: 187.5 },
        { item: 'KI-Begrenzer', rate: 26.25,  note: 'von Copterium' },
        { item: 'Gummi',        rate: 183.75, note: 'von Oil of Olaz' }
      ],
      steps: [
        {
          machine: 'Raffinerie', count_display: '5', recipe: 'Alt: Reiner Quarzkristall', is_alternate: true,
          inputs:  [{ item: 'Roher Quarz', rate: 337.5 }, { item: 'Wasser', rate: 187.5 }],
          outputs: [{ item: 'Quarzkristall', rate: 262.5 }]
        },
        {
          machine: 'Konstruktor', count_display: '3', recipe: 'Quarzsand', is_alternate: false,
          inputs:  [{ item: 'Roher Quarz', rate: 67.5 }],
          outputs: [{ item: 'Quarzsand', rate: 112.5 }]
        },
        {
          machine: 'Manufaktor', count_display: '14', recipe: 'Alt: Isolierter Kristalloszillator', is_alternate: true,
          inputs:  [{ item: 'Quarzkristall', rate: 262.5 }, { item: 'Gummi', rate: 183.75 }, { item: 'KI-Begrenzer', rate: 26.25 }],
          outputs: [{ item: 'Kristalloszillator', rate: 26.25 }]
        }
      ],
      final_outputs: [
        { item: 'Kristalloszillator', rate: 26.25 },
        { item: 'Quarzsand',          rate: 112.5 }
      ]
    }

    // Weitere Produktionen werden nach Screenshot-Lieferung ergänzt
  };

  for (const [name, machines] of Object.entries(data)) {
    const prod = prods.find(p => p.name === name);
    if (prod) {
      execute(
        'UPDATE productions SET machines_json = ? WHERE id = ?',
        [JSON.stringify(machines), prod.id]
      );
    }
  }
}
