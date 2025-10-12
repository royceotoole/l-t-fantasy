'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Standings from '@/components/Standings';
import WeeklyMatchups from '@/components/WeeklyMatchups';
import { DataManagerReal } from '@/lib/data-manager-real';
import { Standings as StandingsType, Matchup } from '@/types';

export default function ClientWrapper() {
  const { data: session, status } = useSession();
  const [standings, setStandings] = useState<StandingsType>({ 
    lily: { wins: 0, losses: 0, totalPoints: 0 }, 
    teagan: { wins: 0, losses: 0, totalPoints: 0 } 
  });
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [dataManager, setDataManager] = useState<DataManagerReal | null>(null);

  useEffect(() => {
    if (session?.accessToken) {
      const manager = new DataManagerReal(session.accessToken as string);
      setDataManager(manager);
      manager.initializeData().then(() => {
        setStandings(manager.getStandings());
        setMatchups(manager.getMatchups());
      });
    }
  }, [session]);

  useEffect(() => {
    if (dataManager) {
      // Update data every minute for real-time updates
      const interval = setInterval(() => {
        dataManager.refreshData().then(() => {
          setStandings(dataManager.getStandings());
          setMatchups(dataManager.getMatchups());
        });
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [dataManager]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-blue-900 mb-2">
              Connect to Yahoo Fantasy
            </h1>
            <p className="text-gray-600">
              Sign in with your Yahoo account to access your fantasy league data
            </p>
          </div>

          <button
            onClick={() => window.location.href = '/auth/signin'}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            Sign in with Yahoo
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-8 text-center">
          <h1 className="text-xl text-blue-900 font-normal mb-1">
            Lily and Teagan&apos;s
          </h1>
          <h2 
            className="text-5xl text-blue-900 font-bold mb-1"
            style={{ fontFamily: 'var(--font-playfair), "Times New Roman", Times, serif' }}
          >
            Fantasy League
          </h2>
          <h3 className="text-xl text-blue-900 font-normal">
            Fantasy League
          </h3>
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
