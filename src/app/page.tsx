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
            THIS WEEK'S MATCHUPS
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
            (() => {
              // Separate cross-team and same-team matchups
              const crossTeamMatchups: MatchupResult[] = [];
              const lilyManagersOnly: MatchupResult[] = [];
              const teaganManagersOnly: MatchupResult[] = [];
              
              currentWeekMatchups.forEach((matchup) => {
                const isSameTeam = matchup.manager1.team === matchup.manager2.team;
                if (isSameTeam) {
                  // Both managers on same team
                  if (matchup.manager1.team === 'lily') {
                    lilyManagersOnly.push(matchup);
                  } else {
                    teaganManagersOnly.push(matchup);
                  }
                } else {
                  crossTeamMatchups.push(matchup);
                }
              });
              
              // Convert same-team matchups into individual managers
              const lilyIndividuals: Array<{ yahooTeamId: string; name: string; points: number }> = [];
              const teaganIndividuals: Array<{ yahooTeamId: string; name: string; points: number }> = [];
              
              lilyManagersOnly.forEach((matchup) => {
                lilyIndividuals.push({
                  yahooTeamId: matchup.manager1.yahooTeamId,
                  name: getManagerName(matchup.manager1.yahooTeamId),
                  points: matchup.manager1.points,
                });
                lilyIndividuals.push({
                  yahooTeamId: matchup.manager2.yahooTeamId,
                  name: getManagerName(matchup.manager2.yahooTeamId),
                  points: matchup.manager2.points,
                });
              });
              
              teaganManagersOnly.forEach((matchup) => {
                teaganIndividuals.push({
                  yahooTeamId: matchup.manager1.yahooTeamId,
                  name: getManagerName(matchup.manager1.yahooTeamId),
                  points: matchup.manager1.points,
                });
                teaganIndividuals.push({
                  yahooTeamId: matchup.manager2.yahooTeamId,
                  name: getManagerName(matchup.manager2.yahooTeamId),
                  points: matchup.manager2.points,
                });
              });
              
              // Pair up individual managers from opposite teams
              const maxIndividuals = Math.max(lilyIndividuals.length, teaganIndividuals.length);
              const pairedRows: React.ReactElement[] = [];
              
              for (let i = 0; i < maxIndividuals; i++) {
                const lilyIndividual = lilyIndividuals[i] || null;
                const teaganIndividual = teaganIndividuals[i] || null;
                
                pairedRows.push(
                  <div key={`paired-${i}`} className="flex justify-between items-center gap-2 py-1" style={{ borderBottom: '1.5px solid #027FCD' }}>
                    <span 
                      className="truncate flex-1 text-left"
                      style={{ 
                        color: '#027FCD', 
                        fontFamily: 'Unica Regular', 
                        fontSize: '15px',
                        minWidth: 0
                      }}
                      title={lilyIndividual?.name || ''}
                    >
                      {lilyIndividual && (
                        <>
                          <span style={{ opacity: 0.5 }}>{lilyIndividual.name}</span>
                          <span style={{ opacity: 0.25 }}> {getManagerRecord(lilyIndividual.yahooTeamId)}</span>
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
                        minWidth: 0
                      }}
                      title={teaganIndividual?.name || ''}
                    >
                      {teaganIndividual && (
                        <>
                          <span style={{ opacity: 0.5 }}>{teaganIndividual.name}</span>
                          <span style={{ opacity: 0.25 }}> {getManagerRecord(teaganIndividual.yahooTeamId)}</span>
                        </>
                      )}
                    </span>
                  </div>
                );
              }
              
              // Render cross-team matchups first, then paired same-team rows
              return [
                ...crossTeamMatchups.map((matchup: MatchupResult, index: number) => {
                  let lilyManager;
                  let teaganManager;
                  
                  if (matchup.manager1.team === 'lily') {
                    lilyManager = matchup.manager1;
                    teaganManager = matchup.manager2;
                  } else {
                    lilyManager = matchup.manager2;
                    teaganManager = matchup.manager1;
                  }
                  
                  const lilyName = getManagerName(lilyManager.yahooTeamId);
                  const teaganName = getManagerName(teaganManager.yahooTeamId);
                  const lilyScore = lilyManager.points;
                  const teaganScore = teaganManager.points;
                  const lilyWon = lilyScore > teaganScore;
                  const teaganWon = teaganScore > lilyScore;
                  
                  return (
                    <div key={`cross-${index}`} className="flex justify-between items-center gap-2 py-1" style={{ borderBottom: '1.5px solid #027FCD' }}>
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
                        <span>{lilyName}</span>
                        <span style={{ opacity: 0.5 }}> {getManagerRecord(lilyManager.yahooTeamId)}</span>
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
                        <span>{teaganName}</span>
                        <span style={{ opacity: 0.5 }}> {getManagerRecord(teaganManager.yahooTeamId)}</span>
                      </span>
                    </div>
                  );
                }),
                ...pairedRows,
              ];
            })()
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
