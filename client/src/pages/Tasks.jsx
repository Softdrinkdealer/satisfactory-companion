import { useState, useEffect, useCallback } from 'react';
import { tasksApi, activityApi, playersApi } from '../api';

const CATEGORIES = [
  { value: 'bauen', emoji: '🏗️', label: 'Bauen' },
  { value: 'forschen', emoji: '🔬', label: 'Forschen' },
  { value: 'erkunden', emoji: '🗺️', label: 'Erkunden' },
  { value: 'versorgen', emoji: '⚡', label: 'Versorgen' },
];

const STATUS_CONFIG = {
  offen: { emoji: '🟢', label: 'Offen', next: 'in_arbeit', nextLabel: 'Starten' },
  in_arbeit: { emoji: '🔄', label: 'In Arbeit', next: 'fertig', nextLabel: 'Fertig' },
  fertig: { emoji: '✅', label: 'Fertig', next: null, nextLabel: null },
};

const HANDOVER_REASONS = ['Zu komplex', 'Keine Zeit', 'Kein Bock 😄'];

export default function Tasks({ player }) {
  const [tasks, setTasks] = useState([]);
  const [players, setPlayers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'mine', 'offen', 'in_arbeit', 'fertig'
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [t, p, a] = await Promise.all([
        tasksApi.getAll(),
        playersApi.getAll(),
        activityApi.getRecent(15),
      ]);
      setTasks(t);
      setPlayers(p);
      setActivity(a);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredTasks = tasks.filter(t => {
    if (filter === 'mine') return t.assigned_to_player_id === player.id;
    if (filter === 'offen' || filter === 'in_arbeit' || filter === 'fertig') return t.status === filter;
    return true;
  });

  const myOpenCount = tasks.filter(t => t.assigned_to_player_id === player.id && t.status !== 'fertig').length;

  if (loading) {
    return <div className="p-6 text-center text-gray-400 animate-pulse">Aufgaben werden geladen...</div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Aufgaben</h2>
          <p className="text-gray-400 text-sm">
            {myOpenCount > 0
              ? `Du hast ${myOpenCount} offene Aufgabe${myOpenCount !== 1 ? 'n' : ''}`
              : 'Keine offenen Aufgaben'}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-satisfactory text-black font-medium px-4 py-2 rounded-lg hover:bg-satisfactory-dark transition-colors text-sm"
        >
          + Neue Aufgabe
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-1.5 bg-surface rounded-lg p-1 mb-6 overflow-x-auto">
        {[
          { value: 'all', label: 'Alle' },
          { value: 'mine', label: `Meine (${tasks.filter(t => t.assigned_to_player_id === player.id).length})` },
          { value: 'offen', label: '🟢 Offen' },
          { value: 'in_arbeit', label: '🔄 In Arbeit' },
          { value: 'fertig', label: '✅ Fertig' },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 text-xs rounded font-medium transition-colors whitespace-nowrap ${
              filter === f.value
                ? 'bg-satisfactory text-black'
                : 'text-gray-400 hover:text-white hover:bg-surface-lighter'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Create Form */}
      {showCreate && (
        <CreateTaskForm
          player={player}
          players={players}
          onCreated={() => { setShowCreate(false); fetchData(); }}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {/* Task List */}
      <div className="space-y-2 mb-8">
        {filteredTasks.length === 0 ? (
          <div className="bg-surface rounded-xl p-8 text-center text-gray-500">
            Keine Aufgaben gefunden.
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              player={player}
              players={players}
              onUpdate={fetchData}
            />
          ))
        )}
      </div>

      {/* Activity Log */}
      {activity.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Aktivitäts-Log
          </h3>
          <div className="bg-surface rounded-xl divide-y divide-surface-lighter">
            {activity.map(log => (
              <div key={log.id} className="px-4 py-2.5 flex items-start gap-3">
                <span className="text-xs text-gray-500 whitespace-nowrap mt-0.5">
                  {formatTime(log.created_at)}
                </span>
                <span className="text-sm text-gray-300">{log.action_text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CreateTaskForm({ player, players, onCreated, onCancel }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('bauen');
  const [assignTo, setAssignTo] = useState(player.id);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return setError('Titel darf nicht leer sein');
    try {
      await tasksApi.create({
        title: title.trim(),
        category,
        assigned_to_player_id: assignTo,
        created_by_player_id: player.id,
      });
      onCreated();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-xl p-5 mb-6 space-y-4">
      <h3 className="font-semibold text-white">Neue Aufgabe</h3>
      <input
        type="text"
        placeholder="Was muss getan werden?"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full bg-surface-light border border-surface-lighter rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-satisfactory"
        autoFocus
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {CATEGORIES.map(c => (
          <button
            key={c.value}
            type="button"
            onClick={() => setCategory(c.value)}
            className={`p-2 rounded-lg text-center text-sm border transition-colors ${
              category === c.value
                ? 'border-satisfactory bg-satisfactory/10 text-satisfactory'
                : 'border-surface-lighter bg-surface-light text-gray-300 hover:border-gray-500'
            }`}
          >
            <span className="mr-1">{c.emoji}</span> {c.label}
          </button>
        ))}
      </div>
      <div>
        <label className="text-xs text-gray-400 block mb-1">Zuweisen an</label>
        <select
          value={assignTo}
          onChange={e => setAssignTo(Number(e.target.value))}
          className="bg-surface-light border border-surface-lighter text-white text-sm rounded-lg px-3 py-2 w-full focus:outline-none focus:border-satisfactory"
        >
          {players.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-satisfactory text-black font-medium py-2 rounded-lg hover:bg-satisfactory-dark transition-colors"
        >
          Erstellen
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}

function TaskCard({ task, player, players, onUpdate }) {
  const [showAssign, setShowAssign] = useState(false);
  const [assignTo, setAssignTo] = useState('');
  const [reason, setReason] = useState('');

  const status = STATUS_CONFIG[task.status];
  const cat = CATEGORIES.find(c => c.value === task.category);
  const isMine = task.assigned_to_player_id === player.id;

  async function handleStatusChange() {
    if (!status.next) return;
    await tasksApi.updateStatus(task.id, status.next, player.id);
    onUpdate();
  }

  async function handleAssign() {
    if (!assignTo) return;
    await tasksApi.assign(task.id, {
      assigned_to_player_id: Number(assignTo),
      player_id: player.id,
      reason: reason || null,
    });
    setShowAssign(false);
    setAssignTo('');
    setReason('');
    onUpdate();
  }

  return (
    <div className={`bg-surface rounded-xl overflow-hidden ${isMine ? 'border-l-4 border-satisfactory' : ''}`}>
      <div className="px-4 py-3 flex items-center gap-3">
        {/* Status */}
        <span className="text-lg" title={status.label}>{status.emoji}</span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-medium ${task.status === 'fertig' ? 'text-gray-500 line-through' : 'text-white'}`}>
              {task.title}
            </span>
            <span className="text-xs bg-surface-lighter text-gray-400 px-1.5 py-0.5 rounded">
              {cat?.emoji} {cat?.label}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {task.assigned_to_name ? `→ ${task.assigned_to_name}` : 'Nicht zugewiesen'}
            {task.handover_reason && <span className="ml-1 italic">({task.handover_reason})</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {status.next && (
            <button
              onClick={handleStatusChange}
              className="text-xs bg-surface-lighter hover:bg-satisfactory hover:text-black text-gray-300 px-2.5 py-1 rounded-lg transition-colors font-medium"
            >
              {status.nextLabel}
            </button>
          )}
          <button
            onClick={() => setShowAssign(!showAssign)}
            className="text-xs text-gray-500 hover:text-satisfactory px-1.5 py-1 transition-colors"
            title="Weitergeben"
          >
            ↗
          </button>
        </div>
      </div>

      {/* Assign Panel */}
      {showAssign && (
        <div className="px-4 py-3 bg-surface-light border-t border-surface-lighter space-y-2">
          <div className="flex gap-2">
            <select
              value={assignTo}
              onChange={e => setAssignTo(e.target.value)}
              className="bg-surface border border-surface-lighter text-white text-sm rounded px-2 py-1 flex-1"
            >
              <option value="">Spieler wählen...</option>
              {players.filter(p => p.id !== task.assigned_to_player_id).map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <button
              onClick={handleAssign}
              disabled={!assignTo}
              className="bg-satisfactory text-black text-sm font-medium px-3 py-1 rounded hover:bg-satisfactory-dark transition-colors disabled:opacity-50"
            >
              Übergeben
            </button>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {HANDOVER_REASONS.map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setReason(reason === r ? '' : r)}
                className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                  reason === r
                    ? 'border-satisfactory text-satisfactory'
                    : 'border-surface-lighter text-gray-500 hover:text-gray-300'
                }`}
              >
                {r}
              </button>
            ))}
            <input
              type="text"
              placeholder="Anderer Grund..."
              value={HANDOVER_REASONS.includes(reason) ? '' : reason}
              onChange={e => setReason(e.target.value)}
              className="text-xs bg-surface border border-surface-lighter rounded-full px-2 py-0.5 text-white placeholder-gray-600 w-32"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(dateStr) {
  const date = new Date(dateStr + 'Z');
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);

  if (diffMin < 1) return 'gerade eben';
  if (diffMin < 60) return `vor ${diffMin}min`;
  if (diffH < 24) return `vor ${diffH}h`;
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
}
