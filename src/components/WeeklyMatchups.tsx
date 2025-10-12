'use client';

import { useState, useEffect } from 'react';
import { Matchup, WeeklyStandings } from '@/types';

interface WeeklyMatchupsProps {
  weeklyStandings: WeeklyStandings | null;
  currentWeek: number;
}

export default function WeeklyMatchups({ weeklyStandings, currentWeek }: WeeklyMatchupsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const refreshMatchups = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/update-scores', { method: 'POST' });
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to refresh matchups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!weeklyStandings) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Week {currentWeek} Matchups</h2>
          <button
            onClick={refreshMatchups}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {isLoading ? 'Updating...' : 'Refresh'}
          </button>
        </div>
        <div className="text-center text-gray-500">Loading matchups...</div>
      </div>
    );
  }

  const { lilyWins, teaganWins, matchups } = weeklyStandings;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Week {currentWeek} Matchups</h2>
        <button
          onClick={refreshMatchups}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {isLoading ? 'Updating...' : 'Refresh'}
        </button>
      </div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">{lilyWins}</div>
            <div className="text-sm text-pink-700">Team Lily Wins</div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{teaganWins}</div>
            <div className="text-sm text-blue-700">Team Teagan Wins</div>
          </div>
        </div>
      </div>

      {/* Individual Matchups */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Individual Matchups</h3>
        {matchups.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No matchups found for this week.
          </div>
        ) : (
          matchups.map((matchup) => {
            const lilyManager = matchup.manager1.team === 'lily' ? matchup.manager1 : matchup.manager2;
            const teaganManager = matchup.manager1.team === 'lily' ? matchup.manager2 : matchup.manager1;
            const lilyScore = matchup.manager1.team === 'lily' ? matchup.manager1Score : matchup.manager2Score;
            const teaganScore = matchup.manager1.team === 'lily' ? matchup.manager2Score : matchup.manager1Score;
            const lilyWon = lilyScore > teaganScore;

            return (
              <div
                key={matchup.id}
                className={`border rounded-lg p-4 ${
                  matchup.isComplete
                    ? lilyWon
                      ? 'border-pink-200 bg-pink-50'
                      : 'border-blue-200 bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  {/* Lily Manager */}
                  <div className="text-center md:text-left">
                    <div className="font-semibold text-pink-700">{lilyManager.yahooTeamName}</div>
                    <div className="text-sm text-pink-600">Team Lily</div>
                  </div>

                  {/* Score */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {lilyScore.toFixed(1)} - {teaganScore.toFixed(1)}
                    </div>
                    {matchup.isComplete && (
                      <div className={`text-sm font-medium ${
                        lilyWon ? 'text-pink-600' : 'text-blue-600'
                      }`}>
                        {lilyWon ? 'Lily Wins!' : 'Teagan Wins!'}
                      </div>
                    )}
                    {!matchup.isComplete && (
                      <div className="text-sm text-gray-500">In Progress</div>
                    )}
                  </div>

                  {/* Teagan Manager */}
                  <div className="text-center md:text-right">
                    <div className="font-semibold text-blue-700">{teaganManager.yahooTeamName}</div>
                    <div className="text-sm text-blue-600">Team Teagan</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Weekly Winner */}
      <div className="mt-6 text-center">
        <div className="text-lg font-semibold text-gray-700">
          {lilyWins > teaganWins ? (
            <span className="text-pink-600">🏆 Team Lily wins this week!</span>
          ) : teaganWins > lilyWins ? (
            <span className="text-blue-600">🏆 Team Teagan wins this week!</span>
          ) : (
            <span className="text-gray-600">🤝 This week is tied!</span>
          )}
        </div>
      </div>
    </div>
  );
}
