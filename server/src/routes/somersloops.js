import { Router } from 'express';
import { queryAll, queryOne, execute, getDb } from '../database.js';
import { save } from '../database.js';

const router = Router();

// GET /api/somersloops — overview of all somersloop needs
router.get('/', (req, res) => {
  // Productions that need somersloops
  const productions = queryAll(`
    SELECT p.id, p.name, p.somersloops_needed, p.power_adjusted_mw,
           gp.folge_number, gp.title as phase_title, gp.tier_requirement
    FROM productions p
    JOIN guide_phases gp ON gp.id = p.phase_id
    WHERE p.somersloops_needed > 0
    ORDER BY gp.folge_number ASC
  `);

  const totalNeeded = productions.reduce((sum, p) => sum + p.somersloops_needed, 0);

  // Get collected count from a simple key-value approach
  // We'll store it in a small config-like way
  const db = getDb();
  let collected = 0;
  try {
    const result = db.exec("SELECT value FROM app_config WHERE key = 'somersloops_collected'");
    if (result.length > 0 && result[0].values.length > 0) {
      collected = Number(result[0].values[0][0]);
    }
  } catch {
    // Table might not exist yet
  }

  res.json({
    productions,
    total_needed: totalNeeded,
    collected,
    remaining: Math.max(0, totalNeeded - collected),
  });
});

// PATCH /api/somersloops/collected — update collected count
router.patch('/collected', (req, res) => {
  const { collected } = req.body;
  if (collected == null || collected < 0) {
    return res.status(400).json({ error: 'Anzahl gesammelte Somersloops erforderlich (>= 0)' });
  }

  const db = getDb();

  // Ensure table exists
  db.run(`
    CREATE TABLE IF NOT EXISTS app_config (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);

  db.run(
    "INSERT OR REPLACE INTO app_config (key, value) VALUES ('somersloops_collected', ?)",
    [String(collected)]
  );
  save();

  res.json({ collected: Number(collected) });
});

export default router;
