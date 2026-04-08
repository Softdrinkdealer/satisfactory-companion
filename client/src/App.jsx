import { useState, useEffect, useCallback } from 'react';
import { playersApi } from './api';
import Header from './components/Header';
import PlayerSelect from './pages/PlayerSelect';
import Dashboard from './pages/Dashboard';
import Guide from './pages/Guide';
import Tasks from './pages/Tasks';
import Power from './pages/Power';
import Recipes from './pages/Recipes';
import Calculator from './pages/Calculator';
import Nodes from './pages/Nodes';
import AltRecipes from './pages/AltRecipes';
import Somersloops from './pages/Somersloops';
import Extras from './pages/Extras';
import ServerApi from './pages/ServerApi';

function App() {
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('dashboard');

  const fetchPlayers = useCallback(async () => {
    try {
      const data = await playersApi.getAll();
      setPlayers(data);
    } catch (err) {
      console.error('Fehler beim Laden der Spieler:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlayers();
    const savedId = localStorage.getItem('currentPlayerId');
    if (savedId) {
      playersApi.get(savedId).then(setCurrentPlayer).catch(() => {});
    }
  }, [fetchPlayers]);

  function handleSelectPlayer(player) {
    setCurrentPlayer(player);
    localStorage.setItem('currentPlayerId', player.id);
  }

  function handleSwitchPlayer() {
    setCurrentPlayer(null);
    setPage('dashboard');
    localStorage.removeItem('currentPlayerId');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-satisfactory text-xl animate-pulse">Laden...</div>
      </div>
    );
  }

  if (!currentPlayer) {
    return (
      <PlayerSelect
        players={players}
        onSelect={handleSelectPlayer}
        onRefresh={fetchPlayers}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        currentPlayer={currentPlayer}
        onSwitchPlayer={handleSwitchPlayer}
        page={page}
        setPage={setPage}
      />
      <main className="flex-1">
        {page === 'dashboard' && <Dashboard player={currentPlayer} setPage={setPage} />}
        {page === 'guide' && <Guide player={currentPlayer} />}
        {page === 'tasks' && <Tasks player={currentPlayer} />}
        {page === 'power' && <Power />}
        {page === 'recipes' && <Recipes />}
        {page === 'calculator' && <Calculator />}
        {page === 'nodes' && <Nodes player={currentPlayer} />}
        {page === 'alt-recipes' && <AltRecipes />}
        {page === 'somersloops' && <Somersloops />}
        {page === 'extras' && <Extras />}
        {page === 'server' && <ServerApi />}
      </main>
    </div>
  );
}

export default App;
