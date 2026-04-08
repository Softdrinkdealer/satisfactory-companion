import { Router } from 'express';
import { queryAll, queryOne, execute } from '../database.js';

const router = Router();

// GET /api/alt-recipes — all alternative recipes with unlock status
router.get('/', (req, res) => {
  const { unlock_method, unlocked } = req.query;

  // Get all alternative recipes from the recipes table
  let sql = 'SELECT * FROM recipes WHERE is_alternative = 1';
  const params = [];

  if (unlock_method) {
    sql += ' AND unlock_method = ?';
    params.push(unlock_method);
  }

  sql += ' ORDER BY category ASC, name ASC';
  const altRecipes = queryAll(sql, params).map(r => ({
    ...r,
    inputs: JSON.parse(r.inputs_json),
    is_alternative: true,
  }));

  // Get unlock status from recipes_unlocked
  const unlockRows = queryAll('SELECT * FROM recipes_unlocked');
  const unlockMap = {};
  for (const row of unlockRows) {
    unlockMap[row.recipe_name] = row;
  }

  // Merge
  const result = altRecipes.map(r => ({
    ...r,
    is_unlocked: unlockMap[r.name]?.is_unlocked === 1,
    unlock_id: unlockMap[r.name]?.id || null,
  }));

  // Filter by unlocked status if requested
  if (unlocked === 'true') {
    res.json(result.filter(r => r.is_unlocked));
  } else if (unlocked === 'false') {
    res.json(result.filter(r => !r.is_unlocked));
  } else {
    res.json(result);
  }
});

// PATCH /api/alt-recipes/:recipeName/toggle — toggle unlock status
router.patch('/:recipeName/toggle', (req, res) => {
  const recipeName = decodeURIComponent(req.params.recipeName);

  // Check recipe exists
  const recipe = queryOne('SELECT * FROM recipes WHERE name = ? AND is_alternative = 1', [recipeName]);
  if (!recipe) return res.status(404).json({ error: 'Alternativrezept nicht gefunden' });

  const existing = queryOne('SELECT * FROM recipes_unlocked WHERE recipe_name = ?', [recipeName]);

  if (existing) {
    execute('UPDATE recipes_unlocked SET is_unlocked = ? WHERE id = ?', [
      existing.is_unlocked ? 0 : 1,
      existing.id,
    ]);
  } else {
    execute(
      'INSERT INTO recipes_unlocked (recipe_name, is_unlocked, unlock_method) VALUES (?, 1, ?)',
      [recipeName, recipe.unlock_method ? recipe.unlock_method.toLowerCase() : null]
    );
  }

  const updated = queryOne('SELECT * FROM recipes_unlocked WHERE recipe_name = ?', [recipeName]);
  res.json({ recipe_name: recipeName, is_unlocked: updated.is_unlocked === 1 });
});

// GET /api/alt-recipes/summary — stats
router.get('/summary', (req, res) => {
  const total = queryAll('SELECT COUNT(*) as cnt FROM recipes WHERE is_alternative = 1')[0]?.cnt || 0;
  const unlocked = queryAll(
    'SELECT COUNT(*) as cnt FROM recipes_unlocked WHERE is_unlocked = 1'
  )[0]?.cnt || 0;

  const byMethod = queryAll(`
    SELECT r.unlock_method, COUNT(*) as total,
      SUM(CASE WHEN ru.is_unlocked = 1 THEN 1 ELSE 0 END) as unlocked
    FROM recipes r
    LEFT JOIN recipes_unlocked ru ON ru.recipe_name = r.name
    WHERE r.is_alternative = 1 AND r.unlock_method IS NOT NULL
    GROUP BY r.unlock_method
  `);

  res.json({ total, unlocked, remaining: total - unlocked, by_method: byMethod });
});

export default router;
