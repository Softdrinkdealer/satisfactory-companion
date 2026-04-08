import { Router } from 'express';
import { queryAll } from '../database.js';

const router = Router();

// GET /api/calculator/items — list all producible items
router.get('/items', (req, res) => {
  const rows = queryAll('SELECT DISTINCT output_item FROM recipes ORDER BY output_item');
  res.json(rows.map(r => r.output_item));
});

// POST /api/calculator — calculate production chain
router.post('/', (req, res) => {
  const { item, rate } = req.body;
  if (!item || !rate || rate <= 0) {
    return res.status(400).json({ error: 'Item und Rate (>0) erforderlich' });
  }

  // Load all recipes indexed by output_item
  const allRecipes = queryAll('SELECT * FROM recipes ORDER BY is_alternative ASC');
  const recipesByOutput = {};
  for (const r of allRecipes) {
    r.inputs = JSON.parse(r.inputs_json);
    r.is_alternative = !!r.is_alternative;
    if (!recipesByOutput[r.output_item]) recipesByOutput[r.output_item] = [];
    recipesByOutput[r.output_item].push(r);
  }

  // Check if target item exists
  if (!recipesByOutput[item]) {
    return res.status(404).json({ error: `Kein Rezept für "${item}" gefunden` });
  }

  // Use preferred recipes (user can override via body.overrides: { "Item": recipeId })
  const overrides = req.body.overrides || {};

  // Resolve the production chain recursively
  const machines = [];       // { recipe, count, rate_needed }
  const rawMaterials = {};   // items with no recipe = raw
  const alternatives = {};   // alternative recipes per item
  const visited = new Set(); // prevent infinite loops

  function getPreferredRecipe(itemName) {
    const recipes = recipesByOutput[itemName];
    if (!recipes) return null;

    // Check user override
    if (overrides[itemName]) {
      const override = recipes.find(r => r.id === overrides[itemName]);
      if (override) return override;
    }

    // Default: first standard recipe
    return recipes.find(r => !r.is_alternative) || recipes[0];
  }

  function resolve(itemName, rateNeeded) {
    const recipe = getPreferredRecipe(itemName);

    if (!recipe) {
      // Raw material (no recipe exists)
      rawMaterials[itemName] = (rawMaterials[itemName] || 0) + rateNeeded;
      return;
    }

    // Collect alternatives for this item
    const altRecipes = (recipesByOutput[itemName] || []).filter(r => r.is_alternative);
    if (altRecipes.length > 0 && !alternatives[itemName]) {
      alternatives[itemName] = altRecipes.map(r => ({
        id: r.id,
        name: r.name,
        output_rate: r.output_rate,
        machine: r.machine,
        power_adjusted_mw: r.power_adjusted_mw,
        inputs: r.inputs
      }));
    }

    // How many machines needed (each produces output_rate per minute)
    const machineCount = rateNeeded / recipe.output_rate;
    const powerTotal = recipe.power_adjusted_mw ? recipe.power_adjusted_mw * machineCount : 0;

    machines.push({
      item: itemName,
      recipe_name: recipe.name,
      recipe_id: recipe.id,
      machine: recipe.machine,
      machine_count: Math.ceil(machineCount),
      machine_count_exact: Math.round(machineCount * 1000) / 1000,
      rate_needed: Math.round(rateNeeded * 1000) / 1000,
      rate_produced: recipe.output_rate,
      power_per_machine: recipe.power_adjusted_mw,
      power_total: Math.round(powerTotal * 100) / 100,
      is_alternative: recipe.is_alternative
    });

    // Resolve inputs recursively
    for (const input of recipe.inputs) {
      const inputRate = (input.rate / recipe.output_rate) * rateNeeded;

      // Prevent infinite loops for circular recipes
      const key = `${itemName}->${input.item}`;
      if (visited.has(key)) {
        rawMaterials[input.item] = (rawMaterials[input.item] || 0) + inputRate;
        continue;
      }
      visited.add(key);
      resolve(input.item, inputRate);
      visited.delete(key);
    }
  }

  resolve(item, Number(rate));

  // Calculate totals
  const totalPower = Math.round(machines.reduce((s, m) => s + m.power_total, 0) * 100) / 100;
  const totalMachines = machines.reduce((s, m) => s + m.machine_count, 0);

  // Round raw materials
  const rawList = Object.entries(rawMaterials)
    .map(([name, r]) => ({ item: name, rate: Math.round(r * 1000) / 1000 }))
    .sort((a, b) => a.item.localeCompare(b.item));

  res.json({
    target: { item, rate: Number(rate) },
    machines,
    raw_materials: rawList,
    alternatives,
    totals: {
      power_mw: totalPower,
      machine_count: totalMachines
    }
  });
});

export default router;
