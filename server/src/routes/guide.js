import { Router } from 'express';
import { queryAll, queryOne } from '../database.js';

const router = Router();

function enrichProduction(p) {
  const tips = queryAll('SELECT * FROM tips WHERE production_id = ? ORDER BY id', [p.id]);
  return {
    ...p,
    outputs: JSON.parse(p.outputs_json || '[]'),
    forwards_to: JSON.parse(p.forwards_to_json || '[]'),
    requirements: p.requirements_json ? JSON.parse(p.requirements_json) : null,
    tips,
  };
}

// GET all phases with their productions and tips
router.get('/phases', (req, res) => {
  const phases = queryAll('SELECT * FROM guide_phases ORDER BY folge_number');
  const productions = queryAll('SELECT * FROM productions ORDER BY id');

  const result = phases.map(phase => ({
    ...phase,
    productions: productions.filter(p => p.phase_id === phase.id).map(enrichProduction)
  }));

  res.json(result);
});

// GET single phase with productions and tips
router.get('/phases/:folge', (req, res) => {
  const phase = queryOne('SELECT * FROM guide_phases WHERE folge_number = ?', [Number(req.params.folge)]);
  if (!phase) return res.status(404).json({ error: 'Folge nicht gefunden' });

  const productions = queryAll('SELECT * FROM productions WHERE phase_id = ? ORDER BY id', [phase.id]);
  res.json({
    ...phase,
    productions: productions.map(enrichProduction)
  });
});

// GET single production with tips
router.get('/productions/:id', (req, res) => {
  const prod = queryOne('SELECT * FROM productions WHERE id = ?', [Number(req.params.id)]);
  if (!prod) return res.status(404).json({ error: 'Produktion nicht gefunden' });
  res.json(enrichProduction(prod));
});

export default router;
