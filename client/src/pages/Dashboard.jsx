import { useState, useEffect } from 'react';
import { activityApi, serverStatusApi } from '../api';

export default function Dashboard({ player, setPage }) {
  const [activity, setActivity] = useState([]);
  const [serverStatus, setServerStatus] = useState(null);

  useEffect(() => {
    activityApi.getRecent(8).then(setActivity).catch(() => {});
    serverStatusApi.check().then(setServerStatus).catch(() => {});
  }, []);

  const levelInfo = {
    neuling: { emoji: '🟢', label: 'Neuling', tips: 'Alle Tipps' },
    kenner: { emoji: '🟡', label: 'Kenner', tips: 'Einsteiger + Pro + Extras' },
    veteran: { emoji: '🔴', label: 'Veteran', tips: 'Pro + Extras' },
  };

  const info = levelInfo[player.experience_level];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-surface rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">
          Willkommen, {player.name}! {info.emoji}
        </h2>
        <p className="text-gray-400">
          {info.label} – Tipps: {info.tips}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <FeatureCard
          icon="📋"
          title="Leitfaden"
          desc="Tschuki Masterclass Schritt für Schritt"
          onClick={() => setPage('guide')}
        />
        <FeatureCard
          icon="👥"
          title="Aufgaben"
          desc="Aufgaben verwalten und zuweisen"
          onClick={() => setPage('tasks')}
        />
        <FeatureCard
          icon="⚡"
          title="Strom-Tracker"
          desc="Verbrauch vs. Produktion"
          onClick={() => setPage('power')}
        />
        <FeatureCard
          icon="🔧"
          title="Tools"
          desc="Produktionsrechner, Rezepte & mehr"
          onClick={() => setPage('recipes')}
        />
      </div>

      {/* Server Status Widget */}
      {serverStatus && (
        <div className={`rounded-xl p-4 mb-6 flex items-center gap-3 ${
          serverStatus.online
            ? 'bg-green-900/20 border border-green-800/30'
            : 'bg-surface border border-surface-lighter'
        }`}>
          <div className={`w-3 h-3 rounded-full shrink-0 ${
            serverStatus.online ? 'bg-green-500 animate-pulse' : 'bg-gray-600'
          }`} />
          <div className="flex-1">
            <span className={`text-sm font-medium ${serverStatus.online ? 'text-green-300' : 'text-gray-400'}`}>
              Dedicated Server: {serverStatus.online ? 'Online' : 'Offline'}
            </span>
            {serverStatus.error && (
              <span className="text-xs text-gray-500 ml-2">({serverStatus.error})</span>
            )}
          </div>
          <button
            onClick={() => serverStatusApi.check().then(setServerStatus).catch(() => {})}
            className="text-xs text-gray-500 hover:text-satisfactory transition-colors"
          >
            Aktualisieren
          </button>
        </div>
      )}

      {/* Activity Log on Dashboard */}
      {activity.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Letzte Aktivitäten
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

function FeatureCard({ icon, title, desc, disabled, onClick }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`bg-surface rounded-xl p-5 text-left w-full ${
        disabled ? 'opacity-50 cursor-default' : 'hover:bg-surface-light cursor-pointer'
      } transition-colors`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{desc}</p>
      {disabled && (
        <span className="inline-block mt-2 text-xs bg-surface-lighter text-gray-400 px-2 py-0.5 rounded">
          Kommt bald
        </span>
      )}
    </button>
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
