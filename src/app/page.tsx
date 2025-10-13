'use client';

import { useState, useEffect } from 'react';
import { TeamScore } from '@/lib/lily-teagan-scoring';
import type { WeeklyScore, MatchupResult } from '@/lib/lily-teagan-scoring';

export default function Home() {
  const [teamScores, setTeamScores] = useState<{ lily: TeamScore; teagan: TeamScore } | null>(null);
  const [weeklyScores, setWeeklyScores] = useState<WeeklyScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      console.log('Fetching lily-teagan scores...');
      const response = await fetch('/api/lily-teagan-scores');
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Data received:', data);
        setTeamScores(data.totalScores);
        setWeeklyScores(data.weeklyScores);
      } else {
        const errorData = await response.json();
        console.error('API error:', errorData);
        setError(errorData.error || 'Failed to load data');
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading fantasy data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EFF4F1' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#EFF4F1' }}>
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="text-center">
            <div 
              className="mb-1" 
              style={{ 
                color: '#027FCD', 
                fontFamily: 'Unica Regular', 
                fontSize: '15px', // 20px - 25% = 15px
                lineHeight: '1.2'
              }}
            >
              Lily and Teagan&apos;s
            </div>
            <h1 
              className="mb-2" 
              style={{ 
                color: '#027FCD', 
                fontFamily: 'HAL Timezone', 
                fontSize: '38px', // 51px - 25% = 38px
                fontWeight: 'normal',
                lineHeight: '1.2'
              }}
            >
              Fantasy League
            </h1>
            <div 
              style={{ 
                color: '#027FCD', 
                fontFamily: 'Unica Regular', 
                fontSize: '15px', // 20px - 25% = 15px
                lineHeight: '1.2'
              }}
            >
              Fantasy League
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pb-8">
        {/* Standings Section */}
        <div className="mb-8">
          <div 
            className="py-1 uppercase"
            style={{ 
              backgroundColor: '#027FCD', 
              color: 'white',
              fontFamily: 'Unica Mono',
              fontSize: '12px', // 16px - 25% = 12px
              letterSpacing: '0.07em',
              paddingLeft: '11px' // 16px - 30% = 11px
            }}
          >
            STANDINGS
          </div>
          <div style={{ backgroundColor: '#EFF4F1' }}>
            <div className="flex justify-between items-center py-1" style={{ borderBottom: '1.5px solid #027FCD' }}>
              <span 
                style={{ 
                  color: '#027FCD', 
                  fontFamily: 'Unica Regular', 
                  fontSize: '15px' // 20px - 25% = 15px
                }}
              >
                Team Lily
              </span>
              <span 
                style={{ 
                  color: '#027FCD', 
                  fontFamily: 'Unica Bold', 
                  fontSize: '15px' // 20px - 25% = 15px
                }}
              >
                {teamScores?.lily.totalWins || 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-1" style={{ borderBottom: '1.5px solid #027FCD' }}>
              <span 
                style={{ 
                  color: '#027FCD', 
                  fontFamily: 'Unica Regular', 
                  fontSize: '15px' // 20px - 25% = 15px
                }}
              >
                Team Teagan
              </span>
              <span 
                style={{ 
                  color: '#027FCD', 
                  fontFamily: 'Unica Bold', 
                  fontSize: '15px' // 20px - 25% = 15px
                }}
              >
                {teamScores?.teagan.totalWins || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Weekly Matchups Section */}
        <div className="mb-8">
          <div 
            className="py-1 uppercase"
            style={{ 
              backgroundColor: '#027FCD', 
              color: 'white',
              fontFamily: 'Unica Mono',
              fontSize: '12px', // 16px - 25% = 12px
              letterSpacing: '0.07em',
              paddingLeft: '11px' // 16px - 30% = 11px
            }}
          >
            WEEKLY MATCHUPS
          </div>
          <div style={{ backgroundColor: '#EFF4F1' }}>
            <div className="flex justify-between items-center py-1" style={{ borderBottom: '1.5px solid #027FCD' }}>
              <span 
                style={{ 
                  color: '#027FCD', 
                  fontFamily: 'Unica Bold', 
                  fontSize: '15px' // 20px - 25% = 15px
                }}
              >
                Team Lily
              </span>
              <span 
                style={{ 
                  color: '#027FCD', 
                  fontFamily: 'Unica Bold', 
                  fontSize: '15px' // 20px - 25% = 15px
                }}
              >
                Team Teagan
              </span>
            </div>
            {weeklyScores.length > 0 && weeklyScores[0]?.matchups.length > 0 ? (
              weeklyScores[0].matchups
                .filter((matchup: MatchupResult) => 
                  // Only show matchups where one team is Lily and one is Teagan
                  (matchup.manager1.team === 'lily' && matchup.manager2.team === 'teagan') ||
                  (matchup.manager1.team === 'teagan' && matchup.manager2.team === 'lily')
                )
                .map((matchup: MatchupResult, index: number) => {
                  const lilyManager = matchup.manager1.team === 'lily' ? matchup.manager1 : matchup.manager2;
                  const teaganManager = matchup.manager1.team === 'lily' ? matchup.manager2 : matchup.manager1;
                  const lilyScore = lilyManager.points;
                  const teaganScore = teaganManager.points;
                  const lilyWon = matchup.winner === 'lily';

                  return (
                    <div key={`${matchup.week}-${index}`} className="flex justify-between items-center py-1" style={{ borderBottom: '1.5px solid #027FCD' }}>
                      <span 
                        style={{ 
                          color: '#027FCD', 
                          fontFamily: 'Unica Regular', 
                          fontSize: '15px' // 20px - 25% = 15px
                        }}
                      >
                        {lilyManager.name}
                      </span>
                      <span 
                        style={{ 
                          color: '#027FCD', 
                          fontFamily: lilyWon ? 'Unica Bold' : 'Unica Regular', 
                          fontSize: '15px' // 20px - 25% = 15px
                        }}
                      >
                        {lilyScore.toFixed(1)} - {teaganScore.toFixed(1)}
                      </span>
                      <span 
                        style={{ 
                          color: '#027FCD', 
                          fontFamily: 'Unica Regular', 
                          fontSize: '15px' // 20px - 25% = 15px
                        }}
                      >
                        {teaganManager.name}
                      </span>
                    </div>
                  );
                })
            ) : (
              <div className="px-4 py-8 text-center" style={{ color: '#999', fontSize: '12px' }}>
                No matchups available
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
// Force deployment trigger Sun Oct 12 15:28:02 CDT 2025
