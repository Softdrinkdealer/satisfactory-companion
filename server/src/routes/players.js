import { Router } from 'express';
import { queryAll, queryOne, execute } from '../database.js';

const router = Router();

// GET all players
router.get('/', (req, res) => {
  const players = queryAll('SELECT * FROM players ORDER BY id');
  res.json(players);
});

// GET single player
router.get('/:id', (req, res) => {
  const player = queryOne('SELECT * FROM players WHERE id = ?', [Number(req.params.id)]);
  if (!player) return res.status(404).json({ error: 'Spieler nicht gefunden' });
  res.json(player);
});

// POST create player
router.post('/', (req, res) => {
  const { name, experience_level } = req.body;
  if (!name || !experience_level) {
    return res.status(400).json({ error: 'Name und Erfahrungsgrad sind erforderlich' });
  }
  if (!['neuling', 'kenner', 'veteran'].includes(experience_level)) {
    return res.status(400).json({ error: 'Ungültiger Erfahrungsgrad' });
  }
  try {
    const result = execute('INSERT INTO players (name, experience_level) VALUES (?, ?)', [name, experience_level]);
    const player = queryOne('SELECT * FROM players WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json(player);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Spielername existiert bereits' });
    }
    throw err;
  }
});

// PATCH update player
router.patch('/:id', (req, res) => {
  const { experience_level, name } = req.body;
  const player = queryOne('SELECT * FROM players WHERE id = ?', [Number(req.params.id)]);
  if (!player) return res.status(404).json({ error: 'Spieler nicht gefunden' });

  if (experience_level) {
    if (!['neuling', 'kenner', 'veteran'].includes(experience_level)) {
      return res.status(400).json({ error: 'Ungültiger Erfahrungsgrad' });
    }
    execute('UPDATE players SET experience_level = ?, last_active = datetime("now") WHERE id = ?',
      [experience_level, Number(req.params.id)]);
  }
  if (name) {
    try {
      execute('UPDATE players SET name = ?, last_active = datetime("now") WHERE id = ?',
        [name, Number(req.params.id)]);
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(409).json({ error: 'Spielername existiert bereits' });
      }
      throw err;
    }
  }

  const updated = queryOne('SELECT * FROM players WHERE id = ?', [Number(req.params.id)]);
  res.json(updated);
});

// DELETE player
router.delete('/:id', (req, res) => {
  const player = queryOne('SELECT * FROM players WHERE id = ?', [Number(req.params.id)]);
  if (!player) return res.status(404).json({ error: 'Spieler nicht gefunden' });
  execute('DELETE FROM players WHERE id = ?', [Number(req.params.id)]);
  res.json({ message: 'Spieler gelöscht' });
});

export default router;
