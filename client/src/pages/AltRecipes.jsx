import { useState, useEffect, useCallback } from 'react';
import { altRecipesApi } from '../api';

export default function AltRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [summary, setSummary] = useState({ total: 0, unlocked: 0, remaining: 0, by_method: [] });
  const [loading, setLoading] = useState(true);
  const [filterMethod, setFilterMethod] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const params = {};
      if (filterMethod) params.unlock_method = filterMethod;
      if (filterStatus) params.unlocked = filterStatus;
      const [r, s] = await Promise.all([
        altRecipesApi.getAll(params),
        altRecipesApi.getSummary(),
      ]);
      setRecipes(r);
      setSummary(s);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterMethod, filterStatus]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  async function handleToggle(recipeName) {
    await altRecipesApi.toggle(recipeName);
    fetchData();
  }

  // Group by category
  const grouped = recipes.reduce((acc, r) => {
    const cat = r.category || 'Sonstige';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(r);
    return acc;
  }, {});

  const progressPercent = summary.total > 0
    ? Math.round((summary.unlocked / summary.total) * 100)
    : 0;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-1">Alternativrezept-Tracker</h2>
      <p className="text-gray-400 text-sm mb-6">Verfolge welche Alternativrezepte ihr bereits freigeschaltet habt</p>

      {/* Progress Summary */}
      <div className="bg-surface rounded-xl p-5 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Freigeschaltet</div>
            <div className="text-2xl font-bold text-green-400">{summary.unlocked}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Ausstehend</div>
            <div className="text-2xl font-bold text-yellow-400">{summary.remaining}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Gesamt</div>
            <div className="text-2xl font-bold text-white">{summary.total}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-6 bg-surface-lighter rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
            {progressPercent}% freigeschaltet
          </div>
        </div>

        {/* By method */}
        {summary.by_method.length > 0 && (
          <div className="flex gap-4 mt-3 justify-center">
            {summary.by_method.map(m => (
              <div key={m.unlock_method} className="text-xs text-gray-400">
                <span className={m.unlock_method === 'HDD' ? 'text-blue-400' : 'text-purple-400'}>
                  {m.unlock_method}
                </span>
                : {m.unlocked || 0}/{m.total}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={filterMethod}
          onChange={e => setFilterMethod(e.target.value)}
          className="bg-surface border border-surface-lighter text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-satisfactory"
        >
          <option value="">Alle Methoden</option>
          <option value="HDD">Festplatte (HDD)</option>
          <option value="MAM">MAM-Forschung</option>
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="bg-surface border border-surface-lighter text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-satisfactory"
        >
          <option value="">Alle Status</option>
          <option value="true">Freigeschaltet</option>
          <option value="false">Ausstehend</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 animate-pulse py-8">Wird geladen...</div>
      ) : recipes.length === 0 ? (
        <div className="bg-surface rounded-xl p-8 text-center text-gray-500">
          Keine Alternativrezepte gefunden.
        </div>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
              {cat} ({items.filter(r => r.is_unlocked).length}/{items.length})
            </h3>
            <div className="space-y-1.5">
              {items.map(recipe => (
                <div
                  key={recipe.id}
                  className={`bg-surface rounded-lg px-3 py-2.5 flex items-center gap-3 ${
                    recipe.is_unlocked ? 'opacity-60' : ''
                  }`}
                >
                  <button
                    onClick={() => handleToggle(recipe.name)}
                    className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      recipe.is_unlocked
                        ? 'bg-green-500 border-green-500 text-black'
                        : 'border-gray-600 hover:border-satisfactory'
                    }`}
                  >
                    {recipe.is_unlocked && <span className="text-xs font-bold">✓</span>}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${recipe.is_unlocked ? 'text-gray-400 line-through' : 'text-yellow-300'}`}>
                      {recipe.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {recipe.output_item} — {recipe.output_rate}{recipe.output_unit} — {recipe.machine}
                    </div>
                  </div>

                  {recipe.unlock_method && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded shrink-0 ${
                      recipe.unlock_method === 'HDD'
                        ? 'bg-blue-900/30 text-blue-400'
                        : 'bg-purple-900/30 text-purple-400'
                    }`}>
                      {recipe.unlock_method}
                    </span>
                  )}

                  {recipe.power_adjusted_mw != null && (
                    <span className="text-xs text-red-400 shrink-0">{recipe.power_adjusted_mw} MW</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
