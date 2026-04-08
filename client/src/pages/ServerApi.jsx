import { useState, useEffect } from 'react';
import { serverStatusApi } from '../api';

export default function ServerApi() {
  const [config, setConfig] = useState({ server_url: '' });
  const [status, setStatus] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [editingUrl, setEditingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    Promise.all([
      serverStatusApi.getConfig(),
      serverStatusApi.check(),
    ]).then(([c, s]) => {
      setConfig(c);
      setUrlInput(c.server_url);
      setStatus(s);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function handleCheck() {
    setChecking(true);
    try {
      const [s, gs] = await Promise.all([
        serverStatusApi.check(),
        serverStatusApi.getGameState(),
      ]);
      setStatus(s);
      setGameState(gs);
    } catch {
      // ignore
    } finally {
      setChecking(false);
    }
  }

  async function handleSaveUrl() {
    if (!urlInput.trim()) return;
    try {
      const result = await serverStatusApi.updateConfig(urlInput.trim());
      setConfig(result);
      setEditingUrl(false);
      setSaveMsg('Gespeichert!');
      setTimeout(() => setSaveMsg(''), 2000);
    } catch (err) {
      setSaveMsg('Fehler: ' + err.message);
    }
  }

  if (loading) {
    return <div className="p-6 text-center text-gray-400 animate-pulse">Wird geladen...</div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-1">Server-API</h2>
      <p className="text-gray-400 text-sm mb-6">
        Anbindung an den Satisfactory Dedicated Server für automatisches Auslesen von Spieldaten
      </p>

      {/* Connection Config */}
      <div className="bg-surface rounded-xl p-5 mb-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Verbindung</h3>

        <div className="flex items-center gap-3 mb-4">
          <div className={`w-3 h-3 rounded-full shrink-0 ${
            status?.online ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`} />
          <span className={`text-sm font-medium ${status?.online ? 'text-green-400' : 'text-red-400'}`}>
            {status?.online ? 'Online' : 'Offline'}
          </span>
          {status?.error && <span className="text-xs text-gray-500">({status.error})</span>}
        </div>

        {editingUrl ? (
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="http://server:7777/api/v1"
              className="flex-1 bg-surface-light border border-surface-lighter rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-satisfactory"
              onKeyDown={e => e.key === 'Enter' && handleSaveUrl()}
            />
            <button
              onClick={handleSaveUrl}
              className="bg-satisfactory text-black text-sm font-medium px-3 py-2 rounded-lg hover:bg-satisfactory-dark transition-colors"
            >
              Speichern
            </button>
            <button
              onClick={() => { setEditingUrl(false); setUrlInput(config.server_url); }}
              className="text-sm text-gray-400 hover:text-white px-2 transition-colors"
            >
              Abbrechen
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-3">
            <code className="text-sm text-gray-300 bg-surface-light px-3 py-1.5 rounded-lg flex-1 truncate">
              {config.server_url}
            </code>
            <button
              onClick={() => setEditingUrl(true)}
              className="text-xs text-gray-500 hover:text-satisfactory transition-colors shrink-0"
            >
              Ändern
            </button>
          </div>
        )}

        {saveMsg && <div className="text-xs text-satisfactory mb-2">{saveMsg}</div>}

        <button
          onClick={handleCheck}
          disabled={checking}
          className="bg-surface-light hover:bg-surface-lighter text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {checking ? 'Prüfe Verbindung...' : 'Verbindung testen & Daten abrufen'}
        </button>
      </div>

      {/* Game State */}
      {gameState && (
        <div className="bg-surface rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Server-Daten
          </h3>

          {gameState.health === 'offline' ? (
            <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4 text-sm text-red-300">
              Server ist nicht erreichbar. Stelle sicher, dass der Dedicated Server läuft und die URL korrekt ist.
            </div>
          ) : (
            <div className="space-y-4">
              {gameState.QueryServerState && (
                <ServerStateDisplay data={gameState.QueryServerState} />
              )}
              {gameState.GetServerOptions && (
                <ServerOptionsDisplay data={gameState.GetServerOptions} />
              )}
              {!gameState.QueryServerState && !gameState.GetServerOptions && (
                <div className="text-sm text-gray-500">
                  Server erreichbar, aber keine Spieldaten verfügbar.
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-gray-600 mt-3">
            Zuletzt geprüft: {new Date(gameState.checked_at).toLocaleString('de-DE')}
          </div>
        </div>
      )}

      {/* API Reference */}
      <div className="bg-surface rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Verfügbare API-Funktionen
        </h3>
        <div className="space-y-2">
          {[
            { fn: 'HealthCheck', desc: 'Prüft ob der Server läuft' },
            { fn: 'QueryServerState', desc: 'Aktueller Server-Status (Spieler, Spielzeit, Tier)' },
            { fn: 'GetServerOptions', desc: 'Server-Einstellungen und -Konfiguration' },
            { fn: 'GetAdvancedGameSettings', desc: 'Erweiterte Spieleinstellungen' },
            { fn: 'EnumerateSessions', desc: 'Verfügbare Spielsitzungen' },
          ].map(item => (
            <ApiFunction key={item.fn} fn={item.fn} desc={item.desc} onQuery={handleCheck} />
          ))}
        </div>

        <div className="mt-4 text-xs text-gray-600">
          Die Satisfactory Dedicated Server API nutzt POST-Requests mit einer "function"-Property.
          Dokumentation: <code className="text-gray-500">http://server:7777/api/v1</code>
        </div>
      </div>
    </div>
  );
}

function ServerStateDisplay({ data }) {
  const state = data?.serverGameState || data;
  if (!state) return null;

  return (
    <div>
      <div className="text-xs text-gray-500 uppercase mb-2">Server State</div>
      <div className="grid grid-cols-2 gap-2">
        {state.activeSessionName && (
          <InfoField label="Session" value={state.activeSessionName} />
        )}
        {state.numConnectedPlayers != null && (
          <InfoField label="Spieler online" value={state.numConnectedPlayers} />
        )}
        {state.playerLimit != null && (
          <InfoField label="Spieler-Limit" value={state.playerLimit} />
        )}
        {state.techTier != null && (
          <InfoField label="Tech-Tier" value={state.techTier} />
        )}
        {state.totalGameDuration != null && (
          <InfoField label="Spielzeit" value={`${Math.round(state.totalGameDuration / 3600)}h`} />
        )}
        {state.isGameRunning != null && (
          <InfoField label="Spiel läuft" value={state.isGameRunning ? 'Ja' : 'Nein'} />
        )}
      </div>
    </div>
  );
}

function ServerOptionsDisplay({ data }) {
  const options = data?.serverOptions || data;
  if (!options || typeof options !== 'object') return null;

  const entries = Object.entries(options).filter(([, v]) => v != null && typeof v !== 'object');
  if (entries.length === 0) return null;

  return (
    <div>
      <div className="text-xs text-gray-500 uppercase mb-2">Server-Optionen</div>
      <div className="grid grid-cols-2 gap-2">
        {entries.slice(0, 8).map(([key, value]) => (
          <InfoField key={key} label={key} value={String(value)} />
        ))}
      </div>
    </div>
  );
}

function InfoField({ label, value }) {
  return (
    <div className="bg-surface-light rounded-lg px-3 py-2">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm text-white font-medium">{value}</div>
    </div>
  );
}

function ApiFunction({ fn, desc }) {
  return (
    <div className="bg-surface-light rounded-lg px-3 py-2 flex items-center gap-3">
      <code className="text-xs text-satisfactory shrink-0">{fn}</code>
      <span className="text-xs text-gray-400 flex-1">{desc}</span>
    </div>
  );
}
