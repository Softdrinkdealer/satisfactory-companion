import { useState, useEffect, useCallback } from 'react';
import { somersloopsApi } from '../api';

export default function Somersloops() {
  const [data, setData] = useState({ productions: [], total_needed: 0, collected: 0, remaining: 0 });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [collectedInput, setCollectedInput] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const d = await somersloopsApi.get();
      setData(d);
      setCollectedInput(String(d.collected));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleSaveCollected() {
    const val = Number(collectedInput);
    if (isNaN(val) || val < 0) return;
    await somersloopsApi.updateCollected(val);
    setEditing(false);
    fetchData();
  }

  if (loading) {
    return <div className="p-6 text-center text-gray-400 animate-pulse">Somersloop-Planer wird geladen...</div>;
  }

  const { productions, total_needed, collected, remaining } = data;
  const progressPercent = total_needed > 0 ? Math.round((collected / total_needed) * 100) : 0;

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-1">Somersloop-Planer</h2>
      <p className="text-gray-400 text-sm mb-6">Übersicht welche Produktionen Somersloops benötigen</p>

      {/* Summary */}
      <div className="bg-surface rounded-xl p-5 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Gesammelt</div>
            {editing ? (
              <div className="flex items-center justify-center gap-2 mt-1">
                <input
                  type="number"
                  min="0"
                  value={collectedInput}
                  onChange={e => setCollectedInput(e.target.value)}
                  className="w-16 bg-surface-light border border-surface-lighter rounded px-2 py-1 text-center text-lg font-bold text-purple-400 focus:outline-none focus:border-satisfactory"
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleSaveCollected()}
                />
                <button
                  onClick={handleSaveCollected}
                  className="text-xs bg-satisfactory text-black px-2 py-1 rounded hover:bg-satisfactory-dark transition-colors"
                >
                  OK
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="text-2xl font-bold text-purple-400 hover:text-purple-300 transition-colors"
                title="Klicken zum Bearbeiten"
              >
                {collected}
              </button>
            )}
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Benötigt</div>
            <div className="text-2xl font-bold text-white">{total_needed}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Fehlen noch</div>
            <div className={`text-2xl font-bold ${remaining > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
              {remaining}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-6 bg-surface-lighter rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${remaining <= 0 ? 'bg-green-500' : 'bg-purple-500'}`}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
            {collected}/{total_needed} gesammelt ({Math.min(progressPercent, 100)}%)
          </div>
        </div>

        {remaining <= 0 && total_needed > 0 && (
          <div className="mt-3 bg-green-900/20 border border-green-800/30 rounded-lg p-3 text-sm text-green-300 text-center">
            Alle Somersloops gesammelt!
          </div>
        )}
      </div>

      {/* Productions needing Somersloops */}
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Produktionen mit Somersloop-Bedarf
      </h3>

      {productions.length === 0 ? (
        <div className="bg-surface rounded-xl p-8 text-center text-gray-500">
          Keine Produktionen benötigen Somersloops.
        </div>
      ) : (
        <div className="space-y-2">
          {productions.map(p => (
            <div key={p.id} className="bg-surface rounded-lg px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">{p.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Folge {p.folge_number} — {p.phase_title}
                    {p.tier_requirement && ` — ${p.tier_requirement}`}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold text-purple-400">
                    {p.somersloops_needed}x
                  </div>
                  {p.power_adjusted_mw && (
                    <div className="text-xs text-gray-500">{p.power_adjusted_mw} MW</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 bg-surface rounded-xl p-4 text-sm text-gray-500">
        <strong className="text-gray-400">Tipp:</strong> Somersloops findet ihr in Mercer-Kugeln,
        die über die gesamte Karte verteilt sind. Klickt auf die gesammelte Anzahl oben, um sie zu aktualisieren.
      </div>
    </div>
  );
}
