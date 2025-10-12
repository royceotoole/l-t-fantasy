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
        <h2 className="text-lg font-semibold">STANDINGS</h2>
      </div>
      
      {/* Standings Content */}
      <div className="bg-white">
        {/* Team Lily */}
        <div className="flex justify-between items-center px-4 py-4 border-b border-blue-200">
          <div className="flex flex-col">
            <span className="text-blue-900 font-medium">Team Lily</span>
            <span className="text-sm text-blue-600">
              {standings.lily.wins}W - {standings.lily.losses}L
            </span>
          </div>
          <span className="text-2xl font-bold text-blue-900">
            {standings.lily.wins}
          </span>
        </div>
        
        {/* Team Teagan */}
        <div className="flex justify-between items-center px-4 py-4">
          <div className="flex flex-col">
            <span className="text-blue-900 font-medium">Team Teagan</span>
            <span className="text-sm text-blue-600">
              {standings.teagan.wins}W - {standings.teagan.losses}L
            </span>
          </div>
          <span className="text-2xl font-bold text-blue-900">
            {standings.teagan.wins}
          </span>
        </div>
      </div>
    </div>
  );
}
