'use client';

import { Matchup } from '@/types';

interface WeeklyMatchupsProps {
  matchups: Matchup[];
}

export default function WeeklyMatchups({ matchups }: WeeklyMatchupsProps) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3">
        <h2 className="text-lg font-semibold">WEEKLY MATCHUPS</h2>
      </div>
      
      {/* Matchups Content */}
      <div className="bg-white">
        {/* Column Headers */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-blue-200 bg-gray-50">
          <span className="text-blue-900 font-medium">Team Lily</span>
          <span className="text-blue-900 font-medium">Team Teagan</span>
        </div>
        
        {/* Individual Matchups */}
        {matchups.map((matchup, index) => (
          <div key={matchup.id} className="flex justify-between items-center px-4 py-4 border-b border-blue-200 last:border-b-0">
            <div className="flex flex-col items-start">
              <span className="text-blue-900 font-medium">{matchup.lilyManager.name}</span>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-blue-900">
                {matchup.lilyScore} - {matchup.teaganScore}
              </span>
              {matchup.winner && (
                <span className="text-xs text-blue-600 mt-1">
                  {matchup.winner === 'lily' ? 'Lily wins' : 'Teagan wins'}
                </span>
              )}
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-blue-900 font-medium">{matchup.teaganManager.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
