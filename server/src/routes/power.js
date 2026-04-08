import { Router } from 'express';
import { queryAll, queryOne, execute } from '../database.js';

const router = Router();

// GET power overview (all consumers + producers + summary)
router.get('/', (req, res) => {
  const consumers = queryAll('SELECT * FROM power_tracker WHERE is_active = 1 ORDER BY id');
  const allConsumers = queryAll('SELECT * FROM power_tracker ORDER BY is_active DESC, id');
  const producers = queryAll('SELECT * FROM power_production ORDER BY id');

  const totalConsumption = consumers.reduce((sum, c) => sum + c.power_consumption_mw, 0);
  const totalProduction = producers.reduce((sum, p) => sum + (p.is_active ? p.power_output_mw : 0), 0);

  res.json({
    consumers: allConsumers,
    producers,
    summary: {
      consumption: totalConsumption,
      production: totalProduction,
      buffer: totalProduction - totalConsumption,
    }
  });
});

// POST add consumer (power drain)
router.post('/consumers', (req, res) => {
  const { production_name, power_consumption_mw } = req.body;
  if (!production_name || power_consumption_mw == null) {
    return res.status(400).json({ error: 'Name und Verbrauch sind erforderlich' });
  }
  const result = execute(
    'INSERT INTO power_tracker (production_name, power_consumption_mw) VALUES (?, ?)',
    [production_name, Number(power_consumption_mw)]
  );
  const item = queryOne('SELECT * FROM power_tracker WHERE id = ?', [result.lastInsertRowid]);
  res.status(201).json(item);
});

// PATCH toggle consumer active
router.patch('/consumers/:id', (req, res) => {
  const item = queryOne('SELECT * FROM power_tracker WHERE id = ?', [Number(req.params.id)]);
  if (!item) return res.status(404).json({ error: 'Nicht gefunden' });

  const newActive = item.is_active ? 0 : 1;
  execute('UPDATE power_tracker SET is_active = ?, updated_at = datetime("now") WHERE id = ?',
    [newActive, Number(req.params.id)]);

  const updated = queryOne('SELECT * FROM power_tracker WHERE id = ?', [Number(req.params.id)]);
  res.json(updated);
});

// DELETE consumer
router.delete('/consumers/:id', (req, res) => {
  const item = queryOne('SELECT * FROM power_tracker WHERE id = ?', [Number(req.params.id)]);
  if (!item) return res.status(404).json({ error: 'Nicht gefunden' });
  execute('DELETE FROM power_tracker WHERE id = ?', [Number(req.params.id)]);
  res.json({ message: 'Gelöscht' });
});

// POST add producer (power source)
router.post('/producers', (req, res) => {
  const { name, power_output_mw, type } = req.body;
  if (!name || power_output_mw == null) {
    return res.status(400).json({ error: 'Name und Leistung sind erforderlich' });
  }
  const result = execute(
    'INSERT INTO power_production (name, power_output_mw, type, is_active) VALUES (?, ?, ?, 1)',
    [name, Number(power_output_mw), type || 'sonstige']
  );
  const item = queryOne('SELECT * FROM power_production WHERE id = ?', [result.lastInsertRowid]);
  res.status(201).json(item);
});

// PATCH toggle producer active
router.patch('/producers/:id', (req, res) => {
  const item = queryOne('SELECT * FROM power_production WHERE id = ?', [Number(req.params.id)]);
  if (!item) return res.status(404).json({ error: 'Nicht gefunden' });

  const newActive = item.is_active ? 0 : 1;
  execute('UPDATE power_production SET is_active = ? WHERE id = ?',
    [newActive, Number(req.params.id)]);

  const updated = queryOne('SELECT * FROM power_production WHERE id = ?', [Number(req.params.id)]);
  res.json(updated);
});

// DELETE producer
router.delete('/producers/:id', (req, res) => {
  const item = queryOne('SELECT * FROM power_production WHERE id = ?', [Number(req.params.id)]);
  if (!item) return res.status(404).json({ error: 'Nicht gefunden' });
  execute('DELETE FROM power_production WHERE id = ?', [Number(req.params.id)]);
  res.json({ message: 'Gelöscht' });
});

export default router;
