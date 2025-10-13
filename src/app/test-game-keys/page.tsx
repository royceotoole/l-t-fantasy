'use client';

import { useState } from 'react';

export default function TestGameKeysPage() {
  const [accessToken, setAccessToken] = useState('');
  const [leagueId, setLeagueId] = useState('37256');
  const [results, setResults] = useState<Array<{ gameKey: string; name: string; success: boolean; leagueName?: string; gameCode?: string; season?: string; currentWeek?: string; numTeams?: string; error?: string | number }>>([]);
  const [loading, setLoading] = useState(false);

  const testGameKeys = async () => {
    if (!accessToken || !leagueId) {
      alert('Please enter Access Token');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/test-game-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken, leagueId }),
      });

      const data = await response.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🔍 Test Game Keys for Your League</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Find the Correct Game Key</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Token
              </label>
              <input
                type="text"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Yahoo API access token"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                League ID
              </label>
              <input
                type="text"
                value={leagueId}
                onChange={(e) => setLeagueId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Yahoo Fantasy league ID"
              />
            </div>
            
            <button
              onClick={testGameKeys}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-md font-medium"
            >
              {loading ? 'Testing...' : '🔍 Test All Game Keys'}
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Game Key Test Results:</h3>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className={`p-4 rounded-lg border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">
                        Game Key {result.gameKey} - {result.name}
                      </h4>
                      {result.success ? (
                        <div className="mt-2 text-sm">
                          <p><strong>League:</strong> {result.leagueName}</p>
                          <p><strong>Game Code:</strong> {result.gameCode}</p>
                          <p><strong>Season:</strong> {result.season}</p>
                          <p><strong>Current Week:</strong> {result.currentWeek}</p>
                          <p><strong>Teams:</strong> {result.numTeams}</p>
                        </div>
                      ) : (
                        <p className="text-red-600 mt-2">Error: {result.error}</p>
                      )}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {result.success ? '✅ Success' : '❌ Failed'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Paste your Yahoo Access Token above</li>
            <li>Click &quot;Test All Game Keys&quot;</li>
            <li>Look for the result that shows your 2024-25 Hockey league</li>
            <li>Note the correct game key (should be 422 for 2024-25 Hockey)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
