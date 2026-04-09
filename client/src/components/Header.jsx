const NAV_ITEMS = [
  { id: 'dashboard', label: 'Start', icon: '🏠' },
  { id: 'guide', label: 'Leitfaden', icon: '📋' },
  { id: 'tasks', label: 'Aufgaben', icon: '👥' },
  { id: 'power', label: 'Strom', icon: '⚡' },
  { id: 'recipes', label: 'Rezepte', icon: '📖' },
  { id: 'calculator', label: 'Rechner', icon: '🔧' },
  { id: 'nodes', label: 'Erze', icon: '🗺️' },
  { id: 'alt-recipes', label: 'Alt-Rezepte', icon: '🔬' },
  { id: 'somersloops', label: 'Somersloops', icon: '🔮' },
  { id: 'extras', label: 'Extras', icon: '🎮' },
  { id: 'server', label: 'Server', icon: '🖥️' },
];

export default function Header({ currentPlayer, onSwitchPlayer, page, setPage }) {
  return (
    <header className="bg-surface border-b border-surface-lighter">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setPage('dashboard')} className="flex items-center gap-2">
            <span className="text-2xl">🏭</span>
            <h1 className="text-xl font-bold text-satisfactory hidden sm:block">Satisfactory Companion</h1>
          </button>
        </div>
        {currentPlayer && (
          <button
            onClick={onSwitchPlayer}
            className="flex items-center gap-2 bg-surface-light hover:bg-surface-lighter px-3 py-1.5 rounded-lg transition-colors"
          >
            <span className="text-sm">
              {currentPlayer.experience_level === 'veteran' && '🔴'}
              {currentPlayer.experience_level === 'kenner' && '🟡'}
              {currentPlayer.experience_level === 'neuling' && '🟢'}
            </span>
            <span className="text-sm font-medium">{currentPlayer.name}</span>
          </button>
        )}
      </div>
      <nav className="px-4 flex gap-1 -mb-px">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              page === item.id
                ? 'border-satisfactory text-satisfactory'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <span className="mr-1.5">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
