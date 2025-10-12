'use client';

import { useState } from 'react';
import { TeamScore } from '@/types';

interface TotalScoreProps {
  teamScores: { lily: TeamScore; teagan: TeamScore } | null;
}

export default function TotalScore({ teamScores }: TotalScoreProps) {
  const [isLoading, setIsLoading] = useState(false);

  const refreshScores = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/update-scores', { method: 'POST' });
      if (response.ok) {
        // Trigger a page refresh or update state
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to refresh scores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!teamScores) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Total Score</h2>
          <button
            onClick={refreshScores}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {isLoading ? 'Updating...' : 'Refresh'}
          </button>
        </div>
        <div className="text-center text-gray-500">Loading scores&hellip;</div>
      </div>
    );
  }

  const { lily, teagan } = teamScores;
  const totalGames = lily.totalWins + lily.totalLosses;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Total Score</h2>
        <button
          onClick={refreshScores}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {isLoading ? 'Updating...' : 'Refresh'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lily Team */}
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6 border-2 border-pink-200">
          <div className="text-center">
            <h3 className="text-xl font-bold text-pink-800 mb-2">Team Lily</h3>
            <div className="text-4xl font-bold text-pink-600 mb-2">
              {lily.totalWins}
            </div>
            <div className="text-sm text-pink-700">
              {lily.totalWins} wins, {lily.totalLosses} losses
            </div>
            <div className="text-sm text-pink-600 font-medium">
              {totalGames > 0 ? (lily.winPercentage * 100).toFixed(1) : 0}% win rate
            </div>
          </div>
        </div>

        {/* Teagan Team */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-200">
          <div className="text-center">
            <h3 className="text-xl font-bold text-blue-800 mb-2">Team Teagan</h3>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {teagan.totalWins}
            </div>
            <div className="text-sm text-blue-700">
              {teagan.totalWins} wins, {teagan.totalLosses} losses
            </div>
            <div className="text-sm text-blue-600 font-medium">
              {totalGames > 0 ? (teagan.winPercentage * 100).toFixed(1) : 0}% win rate
            </div>
          </div>
        </div>
      </div>

      {/* Overall Status */}
      <div className="mt-6 text-center">
        <div className="text-lg font-semibold text-gray-700">
          {lily.totalWins > teagan.totalWins ? (
            <span className="text-pink-600">🏆 Team Lily is winning!</span>
          ) : teagan.totalWins > lily.totalWins ? (
            <span className="text-blue-600">🏆 Team Teagan is winning!</span>
          ) : (
            <span className="text-gray-600">🤝 It's a tie!</span>
          )}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Total games played: {totalGames}
        </div>
      </div>
    </div>
  );
}
