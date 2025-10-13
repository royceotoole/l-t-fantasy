'use client';

import { useState } from 'react';

export default function DebugTeamsPage() {
  const [accessToken, setAccessToken] = useState('');
  const [leagueId, setLeagueId] = useState('37256');
  const [result, setResult] = useState<{ success: boolean; rawXML?: string; error?: string; statusCode?: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const debugTeams = async () => {
    if (!accessToken || !leagueId) {
      alert('Please enter Access Token');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/debug-teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken, leagueId }),
      });

      const data = await response.json();
      setResult(data);
    } catch {
      setResult({ success: false, error: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🔍 Debug Teams XML Response</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Get Raw Teams XML</h2>
          
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
              onClick={debugTeams}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-6 py-2 rounded-md font-medium"
            >
              {loading ? 'Debugging...' : '🔍 Get Teams XML'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4">🔍 Raw XML Response:</h3>
            <div className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
              <pre>{result.success ? result.rawXML : `Error: ${result.error}`}</pre>
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Paste your Yahoo Access Token above</li>
            <li>Click &quot;Get Teams XML&quot;</li>
            <li>Copy the entire XML response and share it with me</li>
            <li>This will help me fix the teams parsing issue</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
