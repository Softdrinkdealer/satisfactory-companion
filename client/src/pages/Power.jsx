import { useState, useEffect, useCallback } from 'react';
import { powerApi } from '../api';

const POWER_TYPES = [
  { value: 'biomasse', label: 'Biomasse' },
  { value: 'kohle', label: 'Kohle' },
  { value: 'treibstoff', label: 'Treibstoff' },
  { value: 'nuclear', label: 'Nuklear' },
  { value: 'geothermal', label: 'Geothermal' },
  { value: 'sonstige', label: 'Sonstige' },
];

export default function Power() {
  const [data, setData] = useState({ consumers: [], producers: [], summary: { consumption: 0, production: 0, buffer: 0 } });
  const [loading, setLoading] = useState(true);
  const [showAddConsumer, setShowAddConsumer] = useState(false);
  const [showAddProducer, setShowAddProducer] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const d = await powerApi.get();
      setData(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return <div className="p-6 text-center text-gray-400 animate-pulse">Strom-Tracker wird geladen...</div>;
  }

  const { consumers, producers, summary } = data;
  const bufferPercent = summary.production > 0
    ? Math.round((summary.consumption / summary.production) * 100)
    : 0;
  const isOverloaded = summary.buffer < 0;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-1">Strom-Tracker</h2>
      <p className="text-gray-400 text-sm mb-6">Verbrauch vs. Produktion</p>

      {/* Summary Bar */}
      <div className="bg-surface rounded-xl p-5 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Verbrauch</div>
            <div className="text-2xl font-bold text-red-400">{summary.consumption.toLocaleString('de-DE')} MW</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Produktion</div>
            <div className="text-2xl font-bold text-green-400">{summary.production.toLocaleString('de-DE')} MW</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Puffer</div>
            <div className={`text-2xl font-bold ${isOverloaded ? 'text-red-500' : 'text-satisfactory'}`}>
              {isOverloaded ? '' : '+'}{summary.buffer.toLocaleString('de-DE')} MW
            </div>
          </div>
        </div>

        {/* Visual bar */}
        <div className="relative h-6 bg-surface-lighter rounded-full overflow-hidden">
          {summary.production > 0 && (
            <div
              className={`h-full rounded-full transition-all ${isOverloaded ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(bufferPercent, 100)}%` }}
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
            {summary.production > 0 ? `${bufferPercent}% Auslastung` : 'Keine Stromproduktion eingetragen'}
          </div>
        </div>

        {isOverloaded && (
          <div className="mt-3 bg-red-900/20 border border-red-800/30 rounded-lg p-3 text-sm text-red-300">
            ⚠️ Stromverbrauch übersteigt Produktion um {Math.abs(summary.buffer).toLocaleString('de-DE')} MW!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Consumers */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
              Verbraucher ({consumers.length})
            </h3>
            <button
              onClick={() => setShowAddConsumer(!showAddConsumer)}
              className="text-xs text-satisfactory hover:text-satisfactory-dark transition-colors"
            >
              + Hinzufügen
            </button>
          </div>

          {showAddConsumer && (
            <AddConsumerForm onAdded={() => { setShowAddConsumer(false); fetchData(); }} />
          )}

          <div className="space-y-1.5">
            {consumers.map(c => (
              <PowerItem
                key={c.id}
                name={c.production_name}
                value={c.power_consumption_mw}
                isActive={!!c.is_active}
                onToggle={() => powerApi.toggleConsumer(c.id).then(fetchData)}
                onDelete={() => powerApi.deleteConsumer(c.id).then(fetchData)}
                color="text-red-400"
              />
            ))}
            {consumers.length === 0 && !showAddConsumer && (
              <p className="text-sm text-gray-500 bg-surface rounded-lg p-3">Noch keine Verbraucher eingetragen.</p>
            )}
          </div>
        </div>

        {/* Producers */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
              Stromquellen ({producers.length})
            </h3>
            <button
              onClick={() => setShowAddProducer(!showAddProducer)}
              className="text-xs text-satisfactory hover:text-satisfactory-dark transition-colors"
            >
              + Hinzufügen
            </button>
          </div>

          {showAddProducer && (
            <AddProducerForm onAdded={() => { setShowAddProducer(false); fetchData(); }} />
          )}

          <div className="space-y-1.5">
            {producers.map(p => (
              <PowerItem
                key={p.id}
                name={p.name}
                value={p.power_output_mw}
                isActive={!!p.is_active}
                badge={p.type !== 'sonstige' ? POWER_TYPES.find(t => t.value === p.type)?.label : null}
                onToggle={() => powerApi.toggleProducer(p.id).then(fetchData)}
                onDelete={() => powerApi.deleteProducer(p.id).then(fetchData)}
                color="text-green-400"
              />
            ))}
            {producers.length === 0 && !showAddProducer && (
              <p className="text-sm text-gray-500 bg-surface rounded-lg p-3">Noch keine Stromquellen eingetragen.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PowerItem({ name, value, isActive, badge, onToggle, onDelete, color }) {
  return (
    <div className={`bg-surface rounded-lg px-3 py-2 flex items-center gap-2 ${!isActive ? 'opacity-40' : ''}`}>
      <button
        onClick={onToggle}
        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
          isActive ? 'bg-satisfactory border-satisfactory text-black' : 'border-gray-600'
        }`}
      >
        {isActive && <span className="text-xs">✓</span>}
      </button>
      <span className={`flex-1 text-sm ${isActive ? 'text-white' : 'text-gray-500 line-through'}`}>{name}</span>
      {badge && <span className="text-xs bg-surface-lighter text-gray-400 px-1.5 py-0.5 rounded">{badge}</span>}
      <span className={`text-sm font-medium ${isActive ? color : 'text-gray-500'}`}>
        {value.toLocaleString('de-DE')} MW
      </span>
      <button onClick={onDelete} className="text-gray-600 hover:text-red-400 transition-colors text-xs ml-1">×</button>
    </div>
  );
}

function AddConsumerForm({ onAdded }) {
  const [name, setName] = useState('');
  const [mw, setMw] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !mw) return;
    await powerApi.addConsumer({ production_name: name.trim(), power_consumption_mw: Number(mw) });
    onAdded();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-lg p-3 mb-3 flex gap-2">
      <input
        type="text"
        placeholder="Produktionsname"
        value={name}
        onChange={e => setName(e.target.value)}
        className="flex-1 bg-surface-light border border-surface-lighter rounded px-2 py-1 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-satisfactory"
        autoFocus
      />
      <input
        type="number"
        placeholder="MW"
        value={mw}
        onChange={e => setMw(e.target.value)}
        className="w-20 bg-surface-light border border-surface-lighter rounded px-2 py-1 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-satisfactory"
      />
      <button type="submit" className="bg-satisfactory text-black text-sm font-medium px-3 py-1 rounded hover:bg-satisfactory-dark transition-colors">
        +
      </button>
    </form>
  );
}

function AddProducerForm({ onAdded }) {
  const [name, setName] = useState('');
  const [mw, setMw] = useState('');
  const [type, setType] = useState('kohle');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !mw) return;
    await powerApi.addProducer({ name: name.trim(), power_output_mw: Number(mw), type });
    onAdded();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-lg p-3 mb-3 space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Name (z.B. Kohlekraftwerk Nord)"
          value={name}
          onChange={e => setName(e.target.value)}
          className="flex-1 bg-surface-light border border-surface-lighter rounded px-2 py-1 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-satisfactory"
          autoFocus
        />
        <input
          type="number"
          placeholder="MW"
          value={mw}
          onChange={e => setMw(e.target.value)}
          className="w-20 bg-surface-light border border-surface-lighter rounded px-2 py-1 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-satisfactory"
        />
      </div>
      <div className="flex gap-2 items-center">
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="bg-surface-light border border-surface-lighter text-white text-sm rounded px-2 py-1 flex-1 focus:outline-none focus:border-satisfactory"
        >
          {POWER_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <button type="submit" className="bg-satisfactory text-black text-sm font-medium px-3 py-1 rounded hover:bg-satisfactory-dark transition-colors">
          +
        </button>
      </div>
    </form>
  );
}
