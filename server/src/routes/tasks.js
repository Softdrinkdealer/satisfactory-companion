import { Router } from 'express';
import { queryAll, queryOne, execute } from '../database.js';

const router = Router();

function logActivity(playerId, text) {
  execute('INSERT INTO activity_log (player_id, action_text) VALUES (?, ?)', [playerId, text]);
}

// GET all tasks (optionally filter by ?player_id= or ?status=)
router.get('/', (req, res) => {
  let sql = `SELECT t.*, p.name as assigned_to_name, c.name as created_by_name
    FROM tasks t
    LEFT JOIN players p ON t.assigned_to_player_id = p.id
    LEFT JOIN players c ON t.created_by_player_id = c.id`;
  const conditions = [];
  const params = [];

  if (req.query.player_id) {
    conditions.push('t.assigned_to_player_id = ?');
    params.push(Number(req.query.player_id));
  }
  if (req.query.status) {
    conditions.push('t.status = ?');
    params.push(req.query.status);
  }

  if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
  sql += ' ORDER BY t.status = "fertig" ASC, t.updated_at DESC';

  res.json(queryAll(sql, params));
});

// POST create task
router.post('/', (req, res) => {
  const { title, category, assigned_to_player_id, created_by_player_id, source, production_id } = req.body;

  if (!title || !category || !created_by_player_id) {
    return res.status(400).json({ error: 'Titel, Kategorie und Ersteller sind erforderlich' });
  }
  if (!['bauen', 'forschen', 'erkunden', 'versorgen'].includes(category)) {
    return res.status(400).json({ error: 'Ungültige Kategorie' });
  }

  const result = execute(
    `INSERT INTO tasks (title, category, source, production_id, assigned_to_player_id, created_by_player_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, category, source || 'manuell', production_id || null, assigned_to_player_id || null, created_by_player_id]
  );

  const task = queryOne('SELECT * FROM tasks WHERE id = ?', [result.lastInsertRowid]);
  const creator = queryOne('SELECT name FROM players WHERE id = ?', [created_by_player_id]);
  logActivity(created_by_player_id, `${creator.name} hat "${title}" erstellt`);

  res.status(201).json(task);
});

// PATCH update task status
router.patch('/:id/status', (req, res) => {
  const { status, player_id } = req.body;
  if (!['offen', 'in_arbeit', 'fertig'].includes(status)) {
    return res.status(400).json({ error: 'Ungültiger Status' });
  }

  const task = queryOne('SELECT * FROM tasks WHERE id = ?', [Number(req.params.id)]);
  if (!task) return res.status(404).json({ error: 'Aufgabe nicht gefunden' });

  execute('UPDATE tasks SET status = ?, updated_at = datetime("now") WHERE id = ?',
    [status, Number(req.params.id)]);

  const player = queryOne('SELECT name FROM players WHERE id = ?', [player_id]);
  const statusLabel = { offen: 'offen', in_arbeit: 'in Arbeit', fertig: 'fertig' };
  logActivity(player_id, `${player.name} hat "${task.title}" als ${statusLabel[status]} markiert`);

  const updated = queryOne(`SELECT t.*, p.name as assigned_to_name, c.name as created_by_name
    FROM tasks t
    LEFT JOIN players p ON t.assigned_to_player_id = p.id
    LEFT JOIN players c ON t.created_by_player_id = c.id
    WHERE t.id = ?`, [Number(req.params.id)]);
  res.json(updated);
});

// PATCH reassign task
router.patch('/:id/assign', (req, res) => {
  const { assigned_to_player_id, player_id, reason } = req.body;

  const task = queryOne('SELECT * FROM tasks WHERE id = ?', [Number(req.params.id)]);
  if (!task) return res.status(404).json({ error: 'Aufgabe nicht gefunden' });

  execute(
    'UPDATE tasks SET assigned_to_player_id = ?, handover_reason = ?, updated_at = datetime("now") WHERE id = ?',
    [assigned_to_player_id || null, reason || null, Number(req.params.id)]
  );

  const actor = queryOne('SELECT name FROM players WHERE id = ?', [player_id]);
  const target = assigned_to_player_id
    ? queryOne('SELECT name FROM players WHERE id = ?', [assigned_to_player_id])
    : null;
  const reasonText = reason ? ` (${reason})` : '';
  logActivity(player_id,
    `${actor.name} hat "${task.title}" an ${target ? target.name : 'niemanden'} übergeben${reasonText}`
  );

  const updated = queryOne(`SELECT t.*, p.name as assigned_to_name, c.name as created_by_name
    FROM tasks t
    LEFT JOIN players p ON t.assigned_to_player_id = p.id
    LEFT JOIN players c ON t.created_by_player_id = c.id
    WHERE t.id = ?`, [Number(req.params.id)]);
  res.json(updated);
});

// DELETE task
router.delete('/:id', (req, res) => {
  const task = queryOne('SELECT * FROM tasks WHERE id = ?', [Number(req.params.id)]);
  if (!task) return res.status(404).json({ error: 'Aufgabe nicht gefunden' });
  execute('DELETE FROM tasks WHERE id = ?', [Number(req.params.id)]);
  res.json({ message: 'Aufgabe gelöscht' });
});

export default router;
