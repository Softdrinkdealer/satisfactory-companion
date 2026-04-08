import { useState, useEffect, useCallback } from 'react';
import { recipesApi } from '../api';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAlt, setFilterAlt] = useState('');
  const [expanded, setExpanded] = useState(null);

  const fetchRecipes = useCallback(async () => {
    try {
      const params = {};
      if (search.trim()) params.q = search.trim();
      if (filterCategory) params.category = filterCategory;
      if (filterAlt) params.alternative = filterAlt;
      const data = await recipesApi.getAll(params);
      setRecipes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, filterCategory, filterAlt]);

  useEffect(() => {
    recipesApi.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(fetchRecipes, 300);
    return () => clearTimeout(timer);
  }, [fetchRecipes]);

  // Group recipes by category
  const grouped = recipes.reduce((acc, r) => {
    const cat = r.category || 'Sonstige';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(r);
    return acc;
  }, {});

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-1">Rezept-Nachschlagewerk</h2>
      <p className="text-gray-400 text-sm mb-6">Alle Rezepte mit Inputs, Maschinen und Stromverbrauch (50% Modifier)</p>

      {/* Search & Filters */}
      <div className="bg-surface rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Rezept oder Item suchen..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-surface-light border border-surface-lighter rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-satisfactory"
        />
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="bg-surface-light border border-surface-lighter text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-satisfactory"
        >
          <option value="">Alle Kategorien</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={filterAlt}
          onChange={e => setFilterAlt(e.target.value)}
          className="bg-surface-light border border-surface-lighter text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-satisfactory"
        >
          <option value="">Standard & Alternativ</option>
          <option value="false">Nur Standard</option>
          <option value="true">Nur Alternativ</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 animate-pulse py-8">Rezepte werden geladen...</div>
      ) : recipes.length === 0 ? (
        <div className="bg-surface rounded-xl p-8 text-center text-gray-500">
          Keine Rezepte gefunden. Versuche einen anderen Suchbegriff.
        </div>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
              {cat} ({items.length})
            </h3>
            <div className="space-y-1.5">
              {items.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isExpanded={expanded === recipe.id}
                  onToggle={() => setExpanded(expanded === recipe.id ? null : recipe.id)}
                />
              ))}
            </div>
          </div>
        ))
      )}

      <div className="mt-4 text-center text-xs text-gray-600">
        {recipes.length} Rezept{recipes.length !== 1 ? 'e' : ''} gefunden
      </div>
    </div>
  );
}

function RecipeCard({ recipe, isExpanded, onToggle }) {
  return (
    <div
      className={`bg-surface rounded-lg overflow-hidden transition-colors ${
        recipe.is_alternative ? 'border-l-2 border-yellow-500' : ''
      }`}
    >
      {/* Collapsed row */}
      <button
        onClick={onToggle}
        className="w-full px-3 py-2.5 flex items-center gap-3 text-left hover:bg-surface-light transition-colors"
      >
        <span className={`text-sm font-medium flex-1 ${recipe.is_alternative ? 'text-yellow-300' : 'text-white'}`}>
          {recipe.name}
        </span>
        <span className="text-xs text-gray-400 hidden sm:block">{recipe.machine}</span>
        <span className="text-xs text-gray-500">
          {recipe.output_rate} {recipe.output_unit}
        </span>
        {recipe.is_alternative && (
          <span className="text-xs bg-yellow-900/40 text-yellow-400 px-1.5 py-0.5 rounded">ALT</span>
        )}
        {recipe.power_adjusted_mw != null && (
          <span className="text-xs text-red-400 w-16 text-right">{recipe.power_adjusted_mw} MW</span>
        )}
        <span className={`text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-3 pb-3 border-t border-surface-lighter">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
            {/* Output */}
            <div>
              <div className="text-xs text-gray-500 uppercase mb-1">Output</div>
              <div className="text-sm text-green-400 font-medium">
                {recipe.output_item} — {recipe.output_rate}{recipe.output_unit}
              </div>
            </div>

            {/* Machine & Power */}
            <div>
              <div className="text-xs text-gray-500 uppercase mb-1">Maschine & Strom</div>
              <div className="text-sm text-white">{recipe.machine}</div>
              {recipe.power_original_mw != null && (
                <div className="text-xs text-gray-400 mt-0.5">
                  {recipe.power_original_mw} MW original / <span className="text-red-400">{recipe.power_adjusted_mw} MW (50%)</span>
                </div>
              )}
            </div>

            {/* Inputs */}
            <div className="sm:col-span-2">
              <div className="text-xs text-gray-500 uppercase mb-1">Inputs</div>
              <div className="flex flex-wrap gap-2">
                {recipe.inputs.map((input, i) => (
                  <span key={i} className="bg-surface-lighter text-sm text-gray-300 px-2 py-1 rounded">
                    {input.item}: {input.rate}{recipe.output_unit}
                  </span>
                ))}
              </div>
            </div>

            {/* Meta */}
            <div className="sm:col-span-2 flex flex-wrap gap-3 text-xs text-gray-500">
              {recipe.tier && <span>Tier: {recipe.tier}</span>}
              {recipe.folge_number && <span>Folge: {recipe.folge_number}</span>}
              {recipe.unlock_method && (
                <span className="text-yellow-500">
                  Freischaltung: {recipe.unlock_method}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
