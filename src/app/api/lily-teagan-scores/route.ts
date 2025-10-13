// API endpoint to get Lily vs Teagan scores from Yahoo Fantasy data

import { NextResponse } from 'next/server';
import { yahooFetch, ensureNhlLeagueKey } from '@/lib/yahoo-oauth-new';
import { calculateMatchupWinner, calculateTotalScores, calculateWeeklyScores, MatchupResult } from '@/lib/lily-teagan-scoring';

interface YahooMatchup {
  week: string;
  teams: {
    0: {
      team: Array<{
        team_id?: string;
        name?: string;
        team_points?: {
          total?: string;
        };
      }>;
    };
    1: {
      team: Array<{
        team_id?: string;
        name?: string;
        team_points?: {
          total?: string;
        };
      }>;
    };
  };
}

export async function GET() {
  try {
    const leagueKey = await ensureNhlLeagueKey();

    // Fetch scoreboard (current week matchups)
    const scoreboardData = await yahooFetch(`/fantasy/v2/league/${leagueKey}/scoreboard`) as {
      fantasy_content: {
        league: Array<{
          current_week?: string;
          scoreboard?: {
            0?: {
              matchups?: {
                0?: {
                  matchup: YahooMatchup[];
                };
              };
              week?: string;
            };
          };
        }>;
      };
    };

    const league = scoreboardData.fantasy_content.league[0];
    const currentWeek = parseInt(league.current_week || '1');
    const scoreboardObj = league.scoreboard;

    const allMatchups: MatchupResult[] = [];
    const matchupsByWeek: Record<number, MatchupResult[]> = {};

    // Process current week matchups
    if (scoreboardObj && scoreboardObj[0]?.matchups) {
      const matchups = scoreboardObj[0].matchups[0]?.matchup || [];
      const week = parseInt(scoreboardObj[0].week || currentWeek.toString());

      for (const yahooMatchup of matchups) {
        const team1Data = yahooMatchup.teams[0]?.team?.[0];
        const team2Data = yahooMatchup.teams[1]?.team?.[0];

        if (!team1Data || !team2Data) continue;

        const matchupResult = calculateMatchupWinner({
          teams: [
            {
              team_id: team1Data.team_id || '',
              name: team1Data.name || '',
              team_points: { total: team1Data.team_points?.total || '0' },
            },
            {
              team_id: team2Data.team_id || '',
              name: team2Data.name || '',
              team_points: { total: team2Data.team_points?.total || '0' },
            },
          ],
        });

        if (matchupResult) {
          matchupResult.week = week;
          allMatchups.push(matchupResult);
          
          if (!matchupsByWeek[week]) {
            matchupsByWeek[week] = [];
          }
          matchupsByWeek[week].push(matchupResult);
        }
      }
    }

    // Calculate scores
    const totalScores = calculateTotalScores(allMatchups);
    const weeklyScores = calculateWeeklyScores(matchupsByWeek);

    return NextResponse.json({
      success: true,
      currentWeek,
      totalScores,
      weeklyScores,
    });
  } catch (error) {
    console.error('Error calculating Lily vs Teagan scores:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

