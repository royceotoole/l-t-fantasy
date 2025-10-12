'use client';

import { useState, useEffect } from 'react';
import { TeamScore, WeeklyStandings, Manager } from '@/types';

export default function Home() {
  const [teamScores, setTeamScores] = useState<{ lily: TeamScore; teagan: TeamScore } | null>(null);
  const [weeklyStandings, setWeeklyStandings] = useState<WeeklyStandings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [scoresResponse, standingsResponse] = await Promise.all([
        fetch('/api/update-scores'),
        fetch('/api/update-standings')
      ]);

      if (scoresResponse.ok) {
        const scoresData = await scoresResponse.json();
        setTeamScores(scoresData.data.teamScores);
      }

      if (standingsResponse.ok) {
        const standingsData = await standingsResponse.json();
        setWeeklyStandings(standingsData.data.weeklyStandings);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
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
            {weeklyStandings?.matchups && weeklyStandings.matchups.length > 0 ? (
              weeklyStandings.matchups.map((matchup) => {
                const lilyManager = matchup.manager1.team === 'lily' ? matchup.manager1 : matchup.manager2;
                const teaganManager = matchup.manager1.team === 'lily' ? matchup.manager2 : matchup.manager1;
                const lilyScore = matchup.manager1.team === 'lily' ? matchup.manager1Score : matchup.manager2Score;
                const teaganScore = matchup.manager1.team === 'lily' ? matchup.manager2Score : matchup.manager1Score;
                const lilyWon = lilyScore > teaganScore;

                return (
                  <div key={matchup.id} className="flex justify-between items-center py-1" style={{ borderBottom: '1.5px solid #027FCD' }}>
                    <span 
                      style={{ 
                        color: '#027FCD', 
                        fontFamily: 'Unica Regular', 
                        fontSize: '15px' // 20px - 25% = 15px
                      }}
                    >
                      {lilyManager.yahooTeamName}
                    </span>
                    <span 
                      style={{ 
                        color: '#027FCD', 
                        fontFamily: lilyWon ? 'Unica Bold' : 'Unica Regular', 
                        fontSize: '15px' // 20px - 25% = 15px
                      }}
                    >
                      {lilyScore.toFixed(0)} - {teaganScore.toFixed(0)}
                    </span>
                    <span 
                      style={{ 
                        color: '#027FCD', 
                        fontFamily: 'Unica Regular', 
                        fontSize: '15px' // 20px - 25% = 15px
                      }}
                    >
                      {teaganManager.yahooTeamName}
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
