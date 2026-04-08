const EXTRAS = [
  {
    icon: '🚁',
    name: 'Jetpack',
    timing: 'Tier 2 – Feldforschung (MAM)',
    reason: 'Unverzichtbar für Erkundung',
    priority: 'hoch',
  },
  {
    icon: '⛽',
    name: 'Flüssiger Treibstoff',
    timing: 'Vor/nach Folge 3',
    reason: 'Effizienter als Kohle-Kraftwerke',
    priority: 'hoch',
  },
  {
    icon: '🚂',
    name: 'Züge',
    timing: 'Ab Tier 6',
    reason: 'Beste Logistiklösung für lange Distanzen',
    priority: 'mittel',
  },
  {
    icon: '🌿',
    name: 'AWESOME Sink',
    timing: 'Sobald gebaut',
    reason: 'Überschuss-Items in Punkte umwandeln',
    priority: 'mittel',
  },
  {
    icon: '🏎️',
    name: 'Explorer / Fahrzeuge',
    timing: 'Früh',
    reason: 'Ressourcen-Erkundung, Spaßfaktor',
    priority: 'niedrig',
  },
  {
    icon: '💡',
    name: 'Power Augmenter',
    timing: 'Spätmittel-/Endgame',
    reason: 'Freie Energie durch Mercer Spheres',
    priority: 'niedrig',
  },
];

const PRIORITY_STYLES = {
  hoch: 'bg-red-900/30 text-red-400',
  mittel: 'bg-yellow-900/30 text-yellow-400',
  niedrig: 'bg-green-900/30 text-green-400',
};

export default function Extras() {
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-1">Cool aber nicht nötig</h2>
      <p className="text-gray-400 text-sm mb-6">
        Extras die nicht in der Masterclass sind, aber das Spiel bereichern
      </p>

      <div className="space-y-3">
        {EXTRAS.map(extra => (
          <div key={extra.name} className="bg-surface rounded-xl p-4 flex items-start gap-4">
            <span className="text-3xl shrink-0">{extra.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-white">{extra.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded ${PRIORITY_STYLES[extra.priority]}`}>
                  {extra.priority}
                </span>
              </div>
              <p className="text-sm text-gray-300">{extra.reason}</p>
              <p className="text-xs text-gray-500 mt-1">Empfohlen: {extra.timing}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-surface rounded-xl p-4 text-sm text-gray-500">
        <strong className="text-gray-400">Hinweis:</strong> Diese Features sind optional und nicht Teil
        der Tschuki Masterclass. Sie machen das Spiel aber deutlich angenehmer — baut sie ein, wenn
        ihr Luft habt!
      </div>
    </div>
  );
}
