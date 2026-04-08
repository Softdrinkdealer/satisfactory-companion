import { useState, useEffect } from 'react';
import { calculatorApi } from '../api';

export default function Calculator() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [rate, setRate] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    calculatorApi.getItems().then(setItems).catch(() => {});
  }, []);

  async function handleCalculate(e) {
    e.preventDefault();
    if (!selectedItem || !rate || Number(rate) <= 0) return;
    setLoading(true);
    setError('');
    try {
      const data = await calculatorApi.calculate({ item: selectedItem, rate: Number(rate) });
      setResult(data);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-1">Produktionsrechner</h2>
      <p className="text-gray-400 text-sm mb-6">Berechne Maschinen, Rohstoffe und Strom für jede Produktion</p>

      {/* Input Form */}
      <form onSubmit={handleCalculate} className="bg-surface rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-xs text-gray-400 uppercase tracking-wide mb-1 block">Item</label>
            <select
              value={selectedItem}
              onChange={e => setSelectedItem(e.target.value)}
              className="w-full bg-surface-light border border-surface-lighter text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-satisfactory"
            >
              <option value="">Item wählen...</option>
              {items.map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-32">
            <label className="text-xs text-gray-400 uppercase tracking-wide mb-1 block">Menge/min</label>
            <input
              type="number"
              min="0.1"
              step="any"
              placeholder="z.B. 60"
              value={rate}
              onChange={e => setRate(e.target.value)}
              className="w-full bg-surface-light border border-surface-lighter rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-satisfactory"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading || !selectedItem || !rate}
              className="w-full sm:w-auto bg-satisfactory text-black font-medium px-5 py-2 rounded-lg hover:bg-satisfactory-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Berechne...' : 'Berechnen'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-3 mb-6 text-sm text-red-300">{error}</div>
      )}

      {result && <CalculatorResult result={result} />}
    </div>
  );
}

function CalculatorResult({ result }) {
  const { target, machines, raw_materials, alternatives, totals } = result;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-surface rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Zusammenfassung: {target.item} ({target.rate}/min)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-gray-400">Maschinen gesamt</div>
            <div className="text-2xl font-bold text-satisfactory">{totals.machine_count}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Rohstoffe</div>
            <div className="text-2xl font-bold text-blue-400">{raw_materials.length}</div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <div className="text-xs text-gray-400">Stromverbrauch (50%)</div>
            <div className="text-2xl font-bold text-red-400">{totals.power_mw.toLocaleString('de-DE')} MW</div>
          </div>
        </div>
      </div>

      {/* Raw Materials */}
      <div className="bg-surface rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Benötigte Rohstoffe
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {raw_materials.map(rm => (
            <div key={rm.item} className="flex items-center justify-between bg-surface-light rounded-lg px-3 py-2">
              <span className="text-sm text-white">{rm.item}</span>
              <span className="text-sm font-medium text-blue-400">{rm.rate}/min</span>
            </div>
          ))}
        </div>
      </div>

      {/* Machines */}
      <div className="bg-surface rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Produktionskette ({machines.length} Schritte)
        </h3>
        <div className="space-y-2">
          {machines.map((m, i) => (
            <div key={i} className="bg-surface-light rounded-lg px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{m.recipe_name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {m.machine} — {m.rate_needed}/min benötigt
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-satisfactory">
                    {m.machine_count}x
                    {m.machine_count_exact !== m.machine_count && (
                      <span className="text-xs text-gray-500 font-normal ml-1">({m.machine_count_exact})</span>
                    )}
                  </div>
                  {m.power_total > 0 && (
                    <div className="text-xs text-red-400">{m.power_total} MW</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alternative Recipes */}
      {Object.keys(alternatives).length > 0 && (
        <div className="bg-surface rounded-xl p-5">
          <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-wide mb-3">
            Verfügbare Alternativrezepte
          </h3>
          <div className="space-y-3">
            {Object.entries(alternatives).map(([itemName, alts]) => (
              <div key={itemName}>
                <div className="text-xs text-gray-400 mb-1">{itemName}</div>
                {alts.map(alt => (
                  <div key={alt.id} className="bg-surface-light border-l-2 border-yellow-500 rounded-lg px-3 py-2 mb-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-yellow-300">{alt.name}</span>
                      <span className="text-xs text-gray-400">
                        {alt.output_rate}/min — {alt.machine}
                        {alt.power_adjusted_mw && ` — ${alt.power_adjusted_mw} MW`}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {alt.inputs.map((inp, j) => (
                        <span key={j} className="text-xs bg-surface text-gray-400 px-1.5 py-0.5 rounded">
                          {inp.item}: {inp.rate}/min
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
