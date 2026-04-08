import { Router } from 'express';
import { queryAll, queryOne, execute } from '../database.js';

const router = Router();

// GET /api/nodes — list all nodes, optionally filter by resource_type or purity
router.get('/', (req, res) => {
  const { resource_type, purity } = req.query;
  let sql = `
    SELECT n.*, p.name as discovered_by_name
    FROM nodes n
    LEFT JOIN players p ON p.id = n.discovered_by_player_id
    WHERE 1=1
  `;
  const params = [];

  if (resource_type) {
    sql += ' AND n.resource_type = ?';
    params.push(resource_type);
  }
  if (purity) {
    sql += ' AND n.purity = ?';
    params.push(purity);
  }

  sql += ' ORDER BY n.resource_type ASC, n.purity DESC, n.created_at DESC';
  res.json(queryAll(sql, params));
});

// GET /api/nodes/resource-types — distinct resource types
router.get('/resource-types', (req, res) => {
  const rows = queryAll('SELECT DISTINCT resource_type FROM nodes ORDER BY resource_type');
  res.json(rows.map(r => r.resource_type));
});

// POST /api/nodes — create a new node entry
router.post('/', (req, res) => {
  const { resource_type, purity, location_description, discovered_by_player_id } = req.body;
  if (!resource_type || !purity || !location_description) {
    return res.status(400).json({ error: 'Ressourcentyp, Reinheit und Ortsbeschreibung erforderlich' });
  }
  if (!['rein', 'normal', 'unrein'].includes(purity)) {
    return res.status(400).json({ error: 'Reinheit muss rein, normal oder unrein sein' });
  }

  const result = execute(
    'INSERT INTO nodes (resource_type, purity, location_description, discovered_by_player_id) VALUES (?, ?, ?, ?)',
    [resource_type.trim(), purity, location_description.trim(), discovered_by_player_id || null]
  );

  const id = Number(result.lastInsertRowid);
  const node = queryOne('SELECT n.*, p.name as discovered_by_name FROM nodes n LEFT JOIN players p ON p.id = n.discovered_by_player_id WHERE n.id = ?', [id]);
  res.status(201).json(node);
});

// PATCH /api/nodes/:id — update a node
router.patch('/:id', (req, res) => {
  const { resource_type, purity, location_description } = req.body;
  const existing = queryOne('SELECT * FROM nodes WHERE id = ?', [req.params.id]);
  if (!existing) return res.status(404).json({ error: 'Node nicht gefunden' });

  if (purity && !['rein', 'normal', 'unrein'].includes(purity)) {
    return res.status(400).json({ error: 'Reinheit muss rein, normal oder unrein sein' });
  }

  execute(
    'UPDATE nodes SET resource_type = ?, purity = ?, location_description = ? WHERE id = ?',
    [
      (resource_type || existing.resource_type).trim(),
      purity || existing.purity,
      (location_description || existing.location_description).trim(),
      req.params.id
    ]
  );

  const node = queryOne('SELECT n.*, p.name as discovered_by_name FROM nodes n LEFT JOIN players p ON p.id = n.discovered_by_player_id WHERE n.id = ?', [req.params.id]);
  res.json(node);
});

// DELETE /api/nodes/:id
router.delete('/:id', (req, res) => {
  const existing = queryOne('SELECT * FROM nodes WHERE id = ?', [req.params.id]);
  if (!existing) return res.status(404).json({ error: 'Node nicht gefunden' });
  execute('DELETE FROM nodes WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

export default router;
