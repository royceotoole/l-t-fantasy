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

    const leagueArray = scoreboardData.fantasy_content.league;
    const leagueInfo = leagueArray[0];
    const currentWeek = parseInt(leagueInfo.current_week || '1');
    
    // The scoreboard is in league[1], not league[0]
    const scoreboardWrapper = leagueArray[1];
    const scoreboardObj = scoreboardWrapper?.scoreboard;

    console.log('League info:', leagueInfo);
    console.log('Current week:', currentWeek);
    console.log('Scoreboard wrapper:', scoreboardWrapper);
    console.log('Scoreboard object:', scoreboardObj);

    const allMatchups: MatchupResult[] = [];
    const matchupsByWeek: Record<number, MatchupResult[]> = {};

    // Process current week matchups
    // The scoreboard has matchups in an object with numeric keys
    if (scoreboardObj && scoreboardObj[0]?.matchups) {
      const matchupsObj = scoreboardObj[0].matchups;
      const week = parseInt(scoreboardObj[0].week || currentWeek.toString());

      console.log('Matchups object keys:', Object.keys(matchupsObj));
      console.log('Matchups object:', JSON.stringify(matchupsObj, null, 2));

      // Yahoo API returns matchups as an object with numeric keys
      for (const key in matchupsObj) {
        if (key === 'count') continue;

        const matchupWrapper = matchupsObj[key];
        console.log(`Processing matchup key: ${key}`);
        
        if (!matchupWrapper?.matchup) {
          console.log('No matchup property found');
          continue;
        }

        // matchup is an object with key "0" containing an array
        const matchupArray = matchupWrapper.matchup[0];
        console.log('Matchup array:', matchupArray);
        
        if (!matchupArray) {
          console.log('No matchup array');
          continue;
        }

        // Extract team data from the complex nested structure
        // matchupArray[0] contains teams object
        const teamsObj = matchupArray.teams;
        console.log('Teams object found:', !!teamsObj);
        
        if (!teamsObj) {
          console.log('No teams object found');
          continue;
        }

        const team1Wrapper = teamsObj['0']?.team;
        const team2Wrapper = teamsObj['1']?.team;

        if (!team1Wrapper || !team2Wrapper) {
          console.log('Missing team wrappers');
          continue;
        }

        // Team wrapper is an array: [0] contains metadata array, [1] contains stats
        const team1MetadataArray = team1Wrapper[0];
        const team2MetadataArray = team2Wrapper[0];
        
        // Find the team_id and name in the metadata array
        const team1Id = team1MetadataArray.find((item: { team_id?: string }) => item.team_id)?.team_id;
        const team1Name = team1MetadataArray.find((item: { name?: string }) => item.name)?.name;
        const team2Id = team2MetadataArray.find((item: { team_id?: string }) => item.team_id)?.team_id;
        const team2Name = team2MetadataArray.find((item: { name?: string }) => item.name)?.name;

        console.log('Team IDs:', team1Id, team2Id);
        console.log('Team names:', team1Name, team2Name);

        if (!team1Id || !team2Id) {
          console.log('Missing team IDs');
          continue;
        }

        const team1Points = team1Wrapper[1]?.team_points?.total || '0';
        const team2Points = team2Wrapper[1]?.team_points?.total || '0';
        
        console.log('Team points:', team1Points, team2Points);

        const matchupResult = calculateMatchupWinner({
          teams: [
            {
              team_id: team1Id,
              name: team1Name || '',
              team_points: { total: team1Points },
            },
            {
              team_id: team2Id,
              name: team2Name || '',
              team_points: { total: team2Points },
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

