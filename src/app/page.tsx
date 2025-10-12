'use client';

import { useEffect, useState } from 'react';
import Standings from '@/components/Standings';
import WeeklyMatchups from '@/components/WeeklyMatchups';
import { dataManager } from '@/lib/data-manager';
import { Standings as StandingsType, Matchup } from '@/types';

export default function Home() {
  const [standings, setStandings] = useState<StandingsType>(dataManager.getStandings());
  const [matchups, setMatchups] = useState<Matchup[]>(dataManager.getMatchups());

  useEffect(() => {
    // Update data every minute for real-time updates
    const interval = setInterval(() => {
      setStandings(dataManager.getStandings());
      setMatchups(dataManager.getMatchups());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl text-blue-900 font-light mb-2">
            Lily and Teagan's
          </h1>
          <h2 className="text-4xl text-blue-900 font-bold">
            Fantasy League
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <Standings standings={standings} />
        <WeeklyMatchups matchups={matchups} />
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto px-4 py-4 text-center">
        <p className="text-sm text-gray-500">
          Updated every hour • Standings reset Mondays at 5 AM CT
        </p>
      </div>
    </main>
  );
}