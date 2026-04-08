import { useState } from 'react';
import { playersApi } from '../api';

const LEVELS = [
  { value: 'neuling', label: 'Neuling', emoji: '🟢', desc: 'Spielt Satisfactory zum ersten Mal' },
  { value: 'kenner', label: 'Kenner', emoji: '🟡', desc: 'Hat schon gespielt, aber nie sehr weit' },
  { value: 'veteran', label: 'Veteran', emoji: '🔴', desc: 'Kennt sich aus, braucht keine Grundlagen' },
];

export default function PlayerSelect({ players, onSelect, onRefresh }) {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLevel, setNewLevel] = useState('kenner');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editLevel, setEditLevel] = useState('');

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    if (!newName.trim()) return setError('Name darf nicht leer sein');
    try {
      await playersApi.create({ name: newName.trim(), experience_level: newLevel });
      setNewName('');
      setShowCreate(false);
      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdateLevel(id) {
    try {
      await playersApi.update(id, { experience_level: editLevel });
      setEditingId(null);
      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">🏭</span>
          <h1 className="text-3xl font-bold text-satisfactory mb-2">Satisfactory Companion</h1>
          <p className="text-gray-400">Wer bist du?</p>
        </div>

        <div className="space-y-3">
          {players.map(player => {
            const level = LEVELS.find(l => l.value === player.experience_level);
            return (
              <div key={player.id} className="bg-surface rounded-xl overflow-hidden">
                <button
                  onClick={() => onSelect(player)}
                  className="w-full px-5 py-4 flex items-center gap-4 hover:bg-surface-light transition-colors text-left"
                >
                  <span className="text-2xl">{level?.emoji}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-lg text-white">{player.name}</div>
                    <div className="text-sm text-gray-400">{level?.label} – {level?.desc}</div>
                  </div>
                </button>

                {editingId === player.id ? (
                  <div className="px-5 py-3 bg-surface-light border-t border-surface-lighter flex items-center gap-2">
                    <select
                      value={editLevel}
                      onChange={e => setEditLevel(e.target.value)}
                      className="bg-surface-lighter text-white text-sm rounded px-2 py-1 border border-surface-lighter"
                    >
                      {LEVELS.map(l => (
                        <option key={l.value} value={l.value}>{l.emoji} {l.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleUpdateLevel(player.id)}
                      className="bg-satisfactory text-black text-sm font-medium px-3 py-1 rounded hover:bg-satisfactory-dark transition-colors"
                    >
                      Speichern
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-400 text-sm px-2 py-1 hover:text-white transition-colors"
                    >
                      Abbrechen
                    </button>
                  </div>
                ) : (
                  <div className="px-5 py-1.5 border-t border-surface-lighter">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(player.id);
                        setEditLevel(player.experience_level);
                      }}
                      className="text-xs text-gray-500 hover:text-satisfactory transition-colors"
                    >
                      Erfahrungsgrad ändern
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {showCreate ? (
          <form onSubmit={handleCreate} className="mt-4 bg-surface rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-white">Neuer Spieler</h3>
            <input
              type="text"
              placeholder="Name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="w-full bg-surface-light border border-surface-lighter rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-satisfactory"
              autoFocus
            />
            <div className="grid grid-cols-3 gap-2">
              {LEVELS.map(l => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setNewLevel(l.value)}
                  className={`p-2 rounded-lg text-center text-sm border transition-colors ${
                    newLevel === l.value
                      ? 'border-satisfactory bg-satisfactory/10 text-satisfactory'
                      : 'border-surface-lighter bg-surface-light text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="text-lg">{l.emoji}</div>
                  <div>{l.label}</div>
                </button>
              ))}
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
                onClick={() => { setShowCreate(false); setError(''); }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowCreate(true)}
            className="mt-4 w-full py-3 border-2 border-dashed border-surface-lighter rounded-xl text-gray-400 hover:border-satisfactory hover:text-satisfactory transition-colors"
          >
            + Neuen Spieler anlegen
          </button>
        )}
      </div>
    </div>
  );
}
