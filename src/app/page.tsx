'use client';

import { useState, useEffect } from 'react';
import { TeamScore } from '@/lib/lily-teagan-scoring';
import type { WeeklyScore, MatchupResult, ManagerRecord } from '@/lib/lily-teagan-scoring';
import { MANAGER_ASSIGNMENTS } from '@/lib/manager-assignments';

export default function Home() {
  const [teamScores, setTeamScores] = useState<{ lily: TeamScore; teagan: TeamScore } | null>(null);
  const [weeklyScores, setWeeklyScores] = useState<WeeklyScore[]>([]);
  const [currentWeekMatchups, setCurrentWeekMatchups] = useState<MatchupResult[]>([]);
  const [managerRecords, setManagerRecords] = useState<Record<string, ManagerRecord>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get manager name from Yahoo team ID
  const getManagerName = (yahooTeamId: string): string => {
    const allManagers = [...MANAGER_ASSIGNMENTS.lily, ...MANAGER_ASSIGNMENTS.teagan];
    const manager = allManagers.find(m => m.yahooTeamId === yahooTeamId);
    return manager?.name || 'Unknown';
  };

  // Helper function to get manager record string
  const getManagerRecord = (yahooTeamId: string): string => {
    const record = managerRecords[yahooTeamId];
    if (!record) return '(0-0-0)';
    return `(${record.wins}-${record.losses}-${record.ties})`;
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
        setCurrentWeekMatchups(data.currentWeekMatchups || []);
        setManagerRecords(data.managerRecords || {});
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
            {currentWeekMatchups.length > 0 ? (
              currentWeekMatchups
                // Sort: cross-team matchups first, then same-team matchups
                .sort((a, b) => {
                  const aIsSameTeam = a.manager1.team === a.manager2.team;
                  const bIsSameTeam = b.manager1.team === b.manager2.team;
                  if (aIsSameTeam === bIsSameTeam) return 0;
                  return aIsSameTeam ? 1 : -1; // Same-team goes to bottom
                })
                .flatMap((matchup: MatchupResult, index: number) => {
                  const manager1 = matchup.manager1;
                  const manager2 = matchup.manager2;
                  const manager1Name = getManagerName(manager1.yahooTeamId);
                  const manager2Name = getManagerName(manager2.yahooTeamId);
                  
                  // Determine if this is a same-team matchup
                  const isSameTeam = manager1.team === manager2.team;
                  
                  // Determine which manager goes on which side
                  let lilyManager = null;
                  let teaganManager = null;
                  let lilyName = '';
                  let teaganName = '';
                  let lilyScore = 0;
                  let teaganScore = 0;
                  
                  if (isSameTeam) {
                    // Same team matchup - return TWO rows, one for each manager on their side
                    const team = manager1.team;
                    
                    return [
                      // Manager 1 row
                      <div key={`${matchup.week}-${index}-m1`} className="flex justify-between items-center gap-2 py-1" style={{ borderBottom: '1.5px solid #027FCD' }}>
                        <span 
                          className="truncate flex-1 text-left"
                          style={{ 
                            color: '#027FCD', 
                            fontFamily: 'Unica Regular', 
                            fontSize: '15px',
                            minWidth: 0,
                            visibility: team === 'lily' ? 'visible' : 'hidden'
                          }}
                          title={team === 'lily' ? manager1Name : ''}
                        >
                          {team === 'lily' && (
                            <>
                              <span style={{ opacity: 0.5 }}>{manager1Name}</span>
                              <span style={{ opacity: 0.25 }}> {getManagerRecord(manager1.yahooTeamId)}</span>
                            </>
                          )}
                        </span>
                        <span 
                          className="whitespace-nowrap flex-shrink-0"
                          style={{ 
                            color: 'transparent',
                            fontSize: '15px'
                          }}
                        >
                          &nbsp;
                        </span>
                        <span 
                          className="truncate flex-1 text-right"
                          style={{ 
                            color: '#027FCD', 
                            fontFamily: 'Unica Regular', 
                            fontSize: '15px',
                            minWidth: 0,
                            visibility: team === 'teagan' ? 'visible' : 'hidden'
                          }}
                          title={team === 'teagan' ? manager1Name : ''}
                        >
                          {team === 'teagan' && (
                            <>
                              <span style={{ opacity: 0.5 }}>{manager1Name}</span>
                              <span style={{ opacity: 0.25 }}> {getManagerRecord(manager1.yahooTeamId)}</span>
                            </>
                          )}
                        </span>
                      </div>,
                      // Manager 2 row
                      <div key={`${matchup.week}-${index}-m2`} className="flex justify-between items-center gap-2 py-1" style={{ borderBottom: '1.5px solid #027FCD' }}>
                        <span 
                          className="truncate flex-1 text-left"
                          style={{ 
                            color: '#027FCD', 
                            fontFamily: 'Unica Regular', 
                            fontSize: '15px',
                            minWidth: 0,
                            visibility: team === 'lily' ? 'visible' : 'hidden'
                          }}
                          title={team === 'lily' ? manager2Name : ''}
                        >
                          {team === 'lily' && (
                            <>
                              <span style={{ opacity: 0.5 }}>{manager2Name}</span>
                              <span style={{ opacity: 0.25 }}> {getManagerRecord(manager2.yahooTeamId)}</span>
                            </>
                          )}
                        </span>
                        <span 
                          className="whitespace-nowrap flex-shrink-0"
                          style={{ 
                            color: 'transparent',
                            fontSize: '15px'
                          }}
                        >
                          &nbsp;
                        </span>
                        <span 
                          className="truncate flex-1 text-right"
                          style={{ 
                            color: '#027FCD', 
                            fontFamily: 'Unica Regular', 
                            fontSize: '15px',
                            minWidth: 0,
                            visibility: team === 'teagan' ? 'visible' : 'hidden'
                          }}
                          title={team === 'teagan' ? manager2Name : ''}
                        >
                          {team === 'teagan' && (
                            <>
                              <span style={{ opacity: 0.5 }}>{manager2Name}</span>
                              <span style={{ opacity: 0.25 }}> {getManagerRecord(manager2.yahooTeamId)}</span>
                            </>
                          )}
                        </span>
                      </div>
                    ];
                  } else {
                    // Cross-team matchup - show Lily on left, Teagan on right
                    if (manager1.team === 'lily') {
                      lilyManager = manager1;
                      teaganManager = manager2;
                    } else {
                      lilyManager = manager2;
                      teaganManager = manager1;
                    }
                    lilyName = getManagerName(lilyManager.yahooTeamId);
                    teaganName = getManagerName(teaganManager.yahooTeamId);
                    lilyScore = lilyManager.points;
                    teaganScore = teaganManager.points;
                  }
                  
                  const lilyWon = lilyScore > teaganScore;
                  const teaganWon = teaganScore > lilyScore;

                  return [
                    <div key={`${matchup.week}-${index}`} className="flex justify-between items-center gap-2 py-1" style={{ borderBottom: '1.5px solid #027FCD' }}>
                      <span 
                        className="truncate flex-1 text-left"
                        style={{ 
                          color: '#027FCD', 
                          fontFamily: 'Unica Regular', 
                          fontSize: '15px',
                          minWidth: 0
                        }}
                        title={lilyName}
                      >
                        {lilyName && (
                          <>
                            <span>{lilyName}</span>
                            <span style={{ opacity: 0.75 }}> {getManagerRecord(lilyManager?.yahooTeamId || '')}</span>
                          </>
                        )}
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
                        title={teaganName}
                      >
                        {teaganName && (
                          <>
                            <span>{teaganName}</span>
                            <span style={{ opacity: 0.75 }}> {getManagerRecord(teaganManager?.yahooTeamId || '')}</span>
                          </>
                        )}
                      </span>
                    </div>
                  ];
                }
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
