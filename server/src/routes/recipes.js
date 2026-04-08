import { Router } from 'express';
import { queryAll, queryOne } from '../database.js';

const router = Router();

// GET /api/recipes — list all recipes with optional search/filter
router.get('/', (req, res) => {
  const { q, category, machine, tier, alternative } = req.query;

  let sql = 'SELECT * FROM recipes WHERE 1=1';
  const params = [];

  if (q) {
    sql += ' AND (name LIKE ? OR output_item LIKE ?)';
    params.push(`%${q}%`, `%${q}%`);
  }

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }

  if (machine) {
    sql += ' AND machine = ?';
    params.push(machine);
  }

  if (tier) {
    sql += ' AND tier = ?';
    params.push(tier);
  }

  if (alternative !== undefined) {
    sql += ' AND is_alternative = ?';
    params.push(alternative === 'true' ? 1 : 0);
  }

  sql += ' ORDER BY folge_number ASC, is_alternative ASC, name ASC';

  const recipes = queryAll(sql, params).map(r => ({
    ...r,
    inputs: JSON.parse(r.inputs_json),
    is_alternative: !!r.is_alternative
  }));

  res.json(recipes);
});

// GET /api/recipes/categories — distinct categories
router.get('/categories', (req, res) => {
  const rows = queryAll('SELECT DISTINCT category FROM recipes WHERE category IS NOT NULL ORDER BY category');
  res.json(rows.map(r => r.category));
});

// GET /api/recipes/machines — distinct machines
router.get('/machines', (req, res) => {
  const rows = queryAll('SELECT DISTINCT machine FROM recipes ORDER BY machine');
  res.json(rows.map(r => r.machine));
});

// GET /api/recipes/:id — single recipe
router.get('/:id', (req, res) => {
  const recipe = queryOne('SELECT * FROM recipes WHERE id = ?', [req.params.id]);
  if (!recipe) return res.status(404).json({ error: 'Rezept nicht gefunden' });

  recipe.inputs = JSON.parse(recipe.inputs_json);
  recipe.is_alternative = !!recipe.is_alternative;

  res.json(recipe);
});

export default router;
