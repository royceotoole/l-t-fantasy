'use client';

import { Standings as StandingsType } from '@/types';

interface StandingsProps {
  standings: StandingsType;
}

export default function Standings({ standings }: StandingsProps) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3">
        <h2 className="text-lg font-bold">STANDINGS</h2>
      </div>
      
      {/* Standings Content */}
      <div className="bg-white">
        {/* Team Lily */}
        <div className="flex justify-between items-center px-4 py-4 border-b border-blue-200">
          <span className="text-blue-900 font-medium">Team Lily</span>
          <span className="text-2xl font-bold text-blue-900">
            {standings.lily.wins}
          </span>
        </div>
        
        {/* Team Teagan */}
        <div className="flex justify-between items-center px-4 py-4">
          <span className="text-blue-900 font-medium">Team Teagan</span>
          <span className="text-2xl font-bold text-blue-900">
            {standings.teagan.wins}
          </span>
        </div>
      </div>
    </div>
  );
}
