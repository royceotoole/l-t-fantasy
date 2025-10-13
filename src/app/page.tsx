'use client';

import { useState, useEffect } from 'react';
import { TeamScore } from '@/lib/lily-teagan-scoring';
import type { WeeklyScore, MatchupResult } from '@/lib/lily-teagan-scoring';
import { MANAGER_ASSIGNMENTS } from '@/lib/manager-assignments';

export default function Home() {
  const [teamScores, setTeamScores] = useState<{ lily: TeamScore; teagan: TeamScore } | null>(null);
  const [weeklyScores, setWeeklyScores] = useState<WeeklyScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get manager name from Yahoo team ID
  const getManagerName = (yahooTeamId: string): string => {
    const allManagers = [...MANAGER_ASSIGNMENTS.lily, ...MANAGER_ASSIGNMENTS.teagan];
    const manager = allManagers.find(m => m.yahooTeamId === yahooTeamId);
    return manager?.name || 'Unknown';
  };

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
                  // Lily vs Teagan matchup - show Lily on left, Teagan on right
                  const lilyManager = matchup.manager1.team === 'lily' ? matchup.manager1 : matchup.manager2;
                  const teaganManager = matchup.manager1.team === 'lily' ? matchup.manager2 : matchup.manager1;
                  const lilyScore = lilyManager.points;
                  const teaganScore = teaganManager.points;
                  const lilyWon = lilyScore > teaganScore;
                  const teaganWon = teaganScore > lilyScore;
                  const lilyManagerName = getManagerName(lilyManager.yahooTeamId);
                  const teaganManagerName = getManagerName(teaganManager.yahooTeamId);

                  return (
                    <div key={`${matchup.week}-${index}`} className="flex justify-between items-center gap-2 py-1 px-1" style={{ borderBottom: '1.5px solid #027FCD' }}>
                      <span 
                        className="truncate flex-1 text-left"
                        style={{ 
                          color: '#027FCD', 
                          fontFamily: 'Unica Regular', 
                          fontSize: '15px',
                          minWidth: 0
                        }}
                        title={lilyManagerName}
                      >
                        {lilyManagerName}
                      </span>
                      <span 
                        className="whitespace-nowrap flex-shrink-0"
                        style={{ 
                          color: '#027FCD', 
                          fontSize: '15px'
                        }}
                      >
                        <span style={{ fontFamily: lilyWon ? 'Unica Bold' : 'Unica Regular' }}>
                          {Math.round(lilyScore)}
                        </span>
                        {' - '}
                        <span style={{ fontFamily: teaganWon ? 'Unica Bold' : 'Unica Regular' }}>
                          {Math.round(teaganScore)}
                        </span>
                      </span>
                      <span 
                        className="truncate flex-1 text-right"
                        style={{ 
                          color: '#027FCD', 
                          fontFamily: 'Unica Regular', 
                          fontSize: '15px',
                          minWidth: 0
                        }}
                        title={teaganManagerName}
                      >
                        {teaganManagerName}
                      </span>
                    </div>
                  );
                })
                .concat(
                  // Add same-team matchups as faded "ghost" matchups
                  // For each same-team matchup, create TWO rows (one for each manager)
                  weeklyScores[0].matchups
                    .filter((matchup: MatchupResult) => 
                      (matchup.manager1.team === matchup.manager2.team)
                    )
                    .flatMap((matchup: MatchupResult, index: number) => {
                      const team = matchup.manager1.team;
                      const manager1Name = getManagerName(matchup.manager1.yahooTeamId);
                      const manager2Name = getManagerName(matchup.manager2.yahooTeamId);

                      // Both managers are on the same team, so both should be faded (60% opacity)
                      if (team === 'lily') {
                        // Show BOTH Lily managers faded (one on left, one on right)
                        return [
                          // Manager 1 on left, Manager 2 on right (both faded)
                          <div key={`same-${matchup.week}-${index}-m1`} className="flex justify-between items-center gap-2 py-1 px-1" style={{ borderBottom: '1.5px solid #027FCD' }}>
                            <span 
                              className="truncate flex-1 text-left"
                              style={{ 
                                color: '#027FCD', 
                                opacity: 0.6,
                                fontFamily: 'Unica Regular', 
                                fontSize: '15px',
                                minWidth: 0
                              }}
                              title={manager1Name}
                            >
                              {manager1Name}
                            </span>
                            <span 
                              className="whitespace-nowrap flex-shrink-0"
                              style={{ 
                                color: 'transparent',
                                fontSize: '15px',
                                fontFamily: 'Unica Regular'
                              }}
                            >
                              &nbsp;
                            </span>
                            <span 
                              className="truncate flex-1 text-right"
                              style={{ 
                                color: '#027FCD', 
                                opacity: 0.6,
                                fontFamily: 'Unica Regular', 
                                fontSize: '15px',
                                minWidth: 0
                              }}
                              title={manager2Name}
                            >
                              {manager2Name}
                            </span>
                          </div>
                        ];
                      } else {
                        // team === 'teagan', show BOTH Teagan managers faded (one on left, one on right)
                        return [
                          // Manager 1 on left, Manager 2 on right (both faded)
                          <div key={`same-${matchup.week}-${index}-m1`} className="flex justify-between items-center gap-2 py-1 px-1" style={{ borderBottom: '1.5px solid #027FCD' }}>
                            <span 
                              className="truncate flex-1 text-left"
                              style={{ 
                                color: '#027FCD', 
                                opacity: 0.6,
                                fontFamily: 'Unica Regular', 
                                fontSize: '15px',
                                minWidth: 0
                              }}
                              title={manager1Name}
                            >
                              {manager1Name}
                            </span>
                            <span 
                              className="whitespace-nowrap flex-shrink-0"
                              style={{ 
                                color: 'transparent',
                                fontSize: '15px',
                                fontFamily: 'Unica Regular'
                              }}
                            >
                              &nbsp;
                            </span>
                            <span 
                              className="truncate flex-1 text-right"
                              style={{ 
                                color: '#027FCD', 
                                opacity: 0.6,
                                fontFamily: 'Unica Regular', 
                                fontSize: '15px',
                                minWidth: 0
                              }}
                              title={manager2Name}
                            >
                              {manager2Name}
                            </span>
                          </div>
                        ];
                      }
                    })
                )
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
