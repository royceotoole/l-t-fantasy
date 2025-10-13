'use client';

import { useState } from 'react';

interface GameInfo {
  game_key: string;
  code: string;
  name: string;
  season: string;
}

interface LeagueInfo {
  league_key: string;
  name: string;
  num_teams: string;
  current_week: string;
}

export default function DiscoverNHLPage() {
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState<GameInfo[]>([]);
  const [leagues, setLeagues] = useState<LeagueInfo[]>([]);
  const [selectedGameKey, setSelectedGameKey] = useState<string>('');
  const [error, setError] = useState<string>('');

  const discoverGames = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/yahoo/discover-games');
      const data = await response.json();
      
      if (data.success) {
        setGames(data.games);
        // Auto-select NHL game if found
        const nhlGame = data.games.find((g: GameInfo) => g.code === 'nhl');
        if (nhlGame) {
          setSelectedGameKey(nhlGame.game_key);
          await discoverLeagues(nhlGame.game_key);
        }
      } else {
        setError(data.error || 'Failed to discover games');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const discoverLeagues = async (gameKey: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/yahoo/discover-leagues?gameKey=${gameKey}`);
      const data = await response.json();
      
      if (data.success) {
        setLeagues(data.leagues);
      } else {
        setError(data.error || 'Failed to discover leagues');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🏒 Discover Your NHL League
        </h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Step 1: Discover Games</h2>
          <p className="text-gray-600 mb-4">
            First, we need to find your NHL game. Click the button below to see all your Yahoo Fantasy games.
          </p>
          <button
            onClick={discoverGames}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-md font-medium"
          >
            {loading ? 'Discovering...' : '🔍 Discover My Games'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {games.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Your Fantasy Games:</h3>
            <div className="space-y-3">
              {games.map((game) => (
                <div
                  key={game.game_key}
                  className={`p-4 rounded-lg border ${
                    game.code === 'nhl'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">
                        {game.code === 'nhl' && '🏒 '}
                        {game.name} ({game.season})
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Game Key:</strong> {game.game_key}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Sport Code:</strong> {game.code}
                      </p>
                    </div>
                    {game.code === 'nhl' && (
                      <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        ✅ NHL Game
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {leagues.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Your NHL Leagues:</h3>
            <div className="space-y-3">
              {leagues.map((league) => (
                <div
                  key={league.league_key}
                  className="p-4 rounded-lg border bg-blue-50 border-blue-200"
                >
                  <h4 className="font-semibold text-lg">{league.name}</h4>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <strong>League Key:</strong>{' '}
                      <code className="bg-white px-2 py-1 rounded">{league.league_key}</code>
                    </p>
                    <p className="text-sm">
                      <strong>Teams:</strong> {league.num_teams}
                    </p>
                    <p className="text-sm">
                      <strong>Current Week:</strong> {league.current_week}
                    </p>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm font-semibold text-yellow-800 mb-2">
                      📋 Copy this to Vercel:
                    </p>
                    <p className="text-xs">
                      <code className="bg-white px-2 py-1 rounded">
                        NHL_LEAGUE_KEY={league.league_key}
                      </code>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">📋 Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Click &quot;Discover My Games&quot; above</li>
            <li>Find your NHL game (should show as 🏒 NHL Game)</li>
            <li>The page will automatically show your NHL leagues</li>
            <li>Copy the <code>NHL_LEAGUE_KEY</code> value</li>
            <li>Add it to your Vercel environment variables</li>
            <li>Redeploy your app</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

