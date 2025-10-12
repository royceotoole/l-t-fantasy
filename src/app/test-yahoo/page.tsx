'use client';

import { useState } from 'react';

export default function TestYahooPage() {
  const [accessToken, setAccessToken] = useState('');
  const [leagueId, setLeagueId] = useState('');
  const [result, setResult] = useState<{ success: boolean; data?: { leagueName: string; currentWeek: number; managersCount: number; matchupsCount: number; managers: Array<{ name: string; yahooTeamName: string }>; matchups: Array<{ manager1: string; manager2: string; manager1Score: number; manager2Score: number; isComplete: boolean }> }; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    if (!accessToken || !leagueId) {
      alert('Please enter both Access Token and League ID');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/test-yahoo', {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Yahoo Fantasy API</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Enter Your Yahoo API Credentials</h2>
          
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
              onClick={testConnection}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-md font-medium"
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
        </div>

        {result && (
          <div className={`rounded-lg shadow p-6 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
              {result.success ? '✅ Connection Successful!' : '❌ Connection Failed'}
            </h3>
            
            {result.success ? (
              <div className="space-y-4">
                <div>
                  <strong>League Name:</strong> {result.data.leagueName}
                </div>
                <div>
                  <strong>Current Week:</strong> {result.data.currentWeek}
                </div>
                <div>
                  <strong>Managers:</strong> {result.data.managersCount}
                </div>
                <div>
                  <strong>Matchups:</strong> {result.data.matchupsCount}
                </div>
                
                <div>
                  <strong>Managers:</strong>
                  <ul className="list-disc list-inside mt-2">
                    {result.data.managers.map((manager: { name: string; yahooTeamName: string }, index: number) => (
                      <li key={index}>{manager.name} ({manager.yahooTeamName})</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <strong>Current Week Matchups:</strong>
                  <ul className="list-disc list-inside mt-2">
                    {result.data.matchups.map((matchup: { manager1: string; manager2: string; manager1Score: number; manager2Score: number; isComplete: boolean }, index: number) => (
                      <li key={index}>
                        {matchup.manager1} vs {matchup.manager2} 
                        ({matchup.manager1Score} - {matchup.manager2Score})
                        {matchup.isComplete ? ' ✅' : ' ⏳'}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-red-700">
                <strong>Error:</strong> {result.error}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">How to Get Your Credentials:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Go to <a href="https://developer.yahoo.com/" target="_blank" rel="noopener noreferrer" className="underline">Yahoo Developer Network</a></li>
            <li>Create a new app and select &quot;Fantasy Sports&quot;</li>
            <li>Get your Client ID and Client Secret</li>
            <li>Use the OAuth flow to get an access token (or use a tool like Postman)</li>
            <li>Find your League ID in your Yahoo Fantasy league URL</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
