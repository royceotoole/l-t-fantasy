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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scoreboardData = await yahooFetch(`/fantasy/v2/league/${leagueKey}/scoreboard`) as any;

    console.log('Scoreboard data received:', JSON.stringify(scoreboardData, null, 2));

    const league = scoreboardData.fantasy_content.league[0];
    const currentWeek = parseInt(league.current_week || '1');
    const scoreboardObj = league[1]?.scoreboard;

    console.log('League:', league);
    console.log('Current week:', currentWeek);
    console.log('Scoreboard object:', scoreboardObj);

    const allMatchups: MatchupResult[] = [];
    const matchupsByWeek: Record<number, MatchupResult[]> = {};

    // Process current week matchups
    // The scoreboard has matchups in an object with numeric keys
    if (scoreboardObj && scoreboardObj[0]?.matchups) {
      const matchupsObj = scoreboardObj[0].matchups;
      const week = parseInt(scoreboardObj[0].week || currentWeek.toString());

      console.log('Matchups object:', matchupsObj);

      // Yahoo API returns matchups as an object with numeric keys
      for (const key in matchupsObj) {
        if (key === 'count') continue;

        const matchupWrapper = matchupsObj[key];
        if (!matchupWrapper?.matchup) continue;

        const yahooMatchup = matchupWrapper.matchup[0];
        console.log('Processing matchup:', yahooMatchup);

        // Extract team data from the complex nested structure
        const teamsObj = yahooMatchup.teams;
        const team1Wrapper = teamsObj['0']?.team;
        const team2Wrapper = teamsObj['1']?.team;

        if (!team1Wrapper || !team2Wrapper) continue;

        // Team data is in array format: team[0] has metadata, team[1] has stats
        const team1Data = team1Wrapper[0];
        const team2Data = team2Wrapper[0];

        if (!team1Data || !team2Data) continue;

        const matchupResult = calculateMatchupWinner({
          teams: [
            {
              team_id: team1Data.team_id || '',
              name: team1Data.name || '',
              team_points: { total: team1Wrapper[1]?.team_points?.total || '0' },
            },
            {
              team_id: team2Data.team_id || '',
              name: team2Data.name || '',
              team_points: { total: team2Wrapper[1]?.team_points?.total || '0' },
            },
          ],
        });

        console.log('Matchup result:', matchupResult);

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

    console.log('All matchups:', allMatchups);
    console.log('Matchups by week:', matchupsByWeek);

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

