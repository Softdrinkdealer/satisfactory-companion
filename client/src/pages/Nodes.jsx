import { useState, useEffect, useCallback } from 'react';
import { nodesApi } from '../api';

const RESOURCE_TYPES = [
  'Eisenerz', 'Kupfererz', 'Kalkstein', 'Kohle', 'Katerium', 'Schwefel',
  'Rohquarz', 'Bauxit', 'Uran', 'SAM-Erz', 'Rohöl', 'Stickstoffgas', 'Wasser', 'Geysir',
];

const PURITIES = [
  { value: 'rein', label: 'Rein', color: 'text-green-400', bg: 'bg-green-900/30' },
  { value: 'normal', label: 'Normal', color: 'text-yellow-400', bg: 'bg-yellow-900/30' },
  { value: 'unrein', label: 'Unrein', color: 'text-red-400', bg: 'bg-red-900/30' },
];

export default function Nodes({ player }) {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterPurity, setFilterPurity] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchNodes = useCallback(async () => {
    try {
      const params = {};
      if (filterType) params.resource_type = filterType;
      if (filterPurity) params.purity = filterPurity;
      const data = await nodesApi.getAll(params);
      setNodes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterType, filterPurity]);

  useEffect(() => {
    setLoading(true);
    fetchNodes();
  }, [fetchNodes]);

  // Group by resource type
  const grouped = nodes.reduce((acc, n) => {
    if (!acc[n.resource_type]) acc[n.resource_type] = [];
    acc[n.resource_type].push(n);
    return acc;
  }, {});

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-1">Node-Entdeckungs-Log</h2>
      <p className="text-gray-400 text-sm mb-6">Gemeinsame Notizliste aller entdeckten Ressourcen-Nodes</p>

      {/* Filters + Add */}
      <div className="bg-surface rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1 flex gap-3">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-surface-light border border-surface-lighter text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-satisfactory"
          >
            <option value="">Alle Ressourcen</option>
            {RESOURCE_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            value={filterPurity}
            onChange={e => setFilterPurity(e.target.value)}
            className="bg-surface-light border border-surface-lighter text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-satisfactory"
          >
            <option value="">Alle Reinheiten</option>
            {PURITIES.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-satisfactory text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-satisfactory-dark transition-colors"
        >
          + Node eintragen
        </button>
      </div>

      {showAdd && (
        <AddNodeForm
          playerId={player.id}
          onAdded={() => { setShowAdd(false); fetchNodes(); }}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {loading ? (
        <div className="text-center text-gray-400 animate-pulse py-8">Nodes werden geladen...</div>
      ) : nodes.length === 0 ? (
        <div className="bg-surface rounded-xl p-8 text-center text-gray-500">
          Noch keine Nodes entdeckt. Erkunde die Welt und trage Fundorte ein!
        </div>
      ) : (
        Object.entries(grouped).map(([type, items]) => (
          <div key={type} className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
              {type} ({items.length})
            </h3>
            <div className="space-y-1.5">
              {items.map(node => (
                editingId === node.id ? (
                  <EditNodeForm
                    key={node.id}
                    node={node}
                    onSaved={() => { setEditingId(null); fetchNodes(); }}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <NodeCard
                    key={node.id}
                    node={node}
                    onEdit={() => setEditingId(node.id)}
                    onDelete={async () => {
                      await nodesApi.delete(node.id);
                      fetchNodes();
                    }}
                  />
                )
              ))}
            </div>
          </div>
        ))
      )}

      <div className="mt-4 text-center text-xs text-gray-600">
        {nodes.length} Node{nodes.length !== 1 ? 's' : ''} eingetragen
      </div>
    </div>
  );
}

function NodeCard({ node, onEdit, onDelete }) {
  const purity = PURITIES.find(p => p.value === node.purity) || PURITIES[1];

  return (
    <div className="bg-surface rounded-lg px-3 py-2.5 flex items-center gap-3">
      <span className={`text-xs font-medium px-2 py-0.5 rounded ${purity.bg} ${purity.color}`}>
        {purity.label}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-white truncate">{node.location_description}</div>
        {node.discovered_by_name && (
          <div className="text-xs text-gray-500 mt-0.5">Entdeckt von {node.discovered_by_name}</div>
        )}
      </div>
      <button
        onClick={onEdit}
        className="text-gray-500 hover:text-satisfactory transition-colors text-xs"
      >
        Bearbeiten
      </button>
      <button
        onClick={onDelete}
        className="text-gray-600 hover:text-red-400 transition-colors text-xs"
      >
        x
      </button>
    </div>
  );
}

function AddNodeForm({ playerId, onAdded, onCancel }) {
  const [resourceType, setResourceType] = useState(RESOURCE_TYPES[0]);
  const [customType, setCustomType] = useState('');
  const [purity, setPurity] = useState('normal');
  const [location, setLocation] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const type = useCustom ? customType.trim() : resourceType;
    if (!type || !location.trim()) return;
    await nodesApi.create({
      resource_type: type,
      purity,
      location_description: location.trim(),
      discovered_by_player_id: playerId,
    });
    onAdded();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-xl p-4 mb-6 space-y-3">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-xs text-gray-400 uppercase tracking-wide mb-1 block">Ressourcentyp</label>
          {useCustom ? (
            <input
              type="text"
              placeholder="Eigener Typ..."
              value={customType}
              onChange={e => setCustomType(e.target.value)}
              className="w-full bg-surface-light border border-surface-lighter rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-satisfactory"
              autoFocus
            />
          ) : (
            <select
              value={resourceType}
              onChange={e => setResourceType(e.target.value)}
              className="w-full bg-surface-light border border-surface-lighter text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-satisfactory"
            >
              {RESOURCE_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={() => setUseCustom(!useCustom)}
            className="text-xs text-gray-500 hover:text-satisfactory mt-1 transition-colors"
          >
            {useCustom ? 'Aus Liste wählen' : 'Eigenen Typ eingeben'}
          </button>
        </div>
        <div className="w-32">
          <label className="text-xs text-gray-400 uppercase tracking-wide mb-1 block">Reinheit</label>
          <select
            value={purity}
            onChange={e => setPurity(e.target.value)}
            className="w-full bg-surface-light border border-surface-lighter text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-satisfactory"
          >
            {PURITIES.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-wide mb-1 block">Ortsbeschreibung</label>
        <input
          type="text"
          placeholder="z.B. Nördlich vom Startbereich, neben dem Wasserfall"
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="w-full bg-surface-light border border-surface-lighter rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-satisfactory"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="text-sm text-gray-400 hover:text-white px-3 py-1.5 transition-colors">
          Abbrechen
        </button>
        <button type="submit" className="bg-satisfactory text-black text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-satisfactory-dark transition-colors">
          Eintragen
        </button>
      </div>
    </form>
  );
}

function EditNodeForm({ node, onSaved, onCancel }) {
  const [resourceType, setResourceType] = useState(node.resource_type);
  const [purity, setPurity] = useState(node.purity);
  const [location, setLocation] = useState(node.location_description);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!resourceType.trim() || !location.trim()) return;
    await nodesApi.update(node.id, {
      resource_type: resourceType.trim(),
      purity,
      location_description: location.trim(),
    });
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-light rounded-lg p-3 flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={resourceType}
          onChange={e => setResourceType(e.target.value)}
          className="flex-1 bg-surface border border-surface-lighter rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-satisfactory"
        />
        <select
          value={purity}
          onChange={e => setPurity(e.target.value)}
          className="bg-surface border border-surface-lighter text-white text-sm rounded px-2 py-1 focus:outline-none focus:border-satisfactory"
        >
          {PURITIES.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>
      <input
        type="text"
        value={location}
        onChange={e => setLocation(e.target.value)}
        className="w-full bg-surface border border-surface-lighter rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-satisfactory"
      />
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="text-xs text-gray-400 hover:text-white px-2 py-1 transition-colors">
          Abbrechen
        </button>
        <button type="submit" className="bg-satisfactory text-black text-xs font-medium px-3 py-1 rounded hover:bg-satisfactory-dark transition-colors">
          Speichern
        </button>
      </div>
    </form>
  );
}
