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
        <h2 className="text-lg font-bold">WEEKLY MATCHUPS</h2>
      </div>
      
      {/* Matchups Content */}
      <div className="bg-white">
        {/* Column Headers */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-blue-200 bg-white">
          <span className="text-blue-900 font-bold">Team Lily</span>
          <span className="text-blue-900 font-bold">Team Teagan</span>
        </div>
        
        {/* Individual Matchups */}
        {matchups.map((matchup) => (
          <div key={matchup.id} className="flex justify-between items-center px-4 py-4 border-b border-blue-200 last:border-b-0">
            <span className="text-blue-900 font-medium">{matchup.lilyManager.name}</span>
            
            <span className="text-lg font-bold text-blue-900">
              {matchup.lilyScore} - {matchup.teaganScore}
            </span>
            
            <span className="text-blue-900 font-medium">{matchup.teaganManager.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
