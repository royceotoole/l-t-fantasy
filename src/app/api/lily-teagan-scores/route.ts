// API endpoint to get Lily vs Teagan scores from Yahoo Fantasy data

import { NextResponse } from 'next/server';
import { yahooFetch, ensureNhlLeagueKey } from '@/lib/yahoo-oauth-new';
import { calculateMatchupWinner, calculateTotalScores, calculateWeeklyScores, calculateManagerRecords, MatchupResult } from '@/lib/lily-teagan-scoring';

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

    // Fetch standings to get official W-L-T records from Yahoo
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const standingsData = await yahooFetch(`/fantasy/v2/league/${leagueKey}/standings`) as any;
    
    // Fetch current week scoreboard for matchup display
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scoreboardData = await yahooFetch(`/fantasy/v2/league/${leagueKey}/scoreboard`) as any;

    console.log('Standings data received:', JSON.stringify(standingsData, null, 2));
    console.log('Scoreboard data received:', JSON.stringify(scoreboardData, null, 2));

    // Parse standings to get official Yahoo records for each team
    const standingsLeagueArray = standingsData.fantasy_content.league;
    const standingsTeamsWrapper = standingsLeagueArray[1];
    const standingsTeamsObj = standingsTeamsWrapper?.standings?.[0]?.teams;
    
    const officialRecords: Record<string, { wins: number; losses: number; ties: number }> = {};
    
    if (standingsTeamsObj) {
      // Teams are in an object with numeric keys
      for (const key in standingsTeamsObj) {
        if (key === 'count') continue;
        
        const teamWrapper = standingsTeamsObj[key];
        const teamArray = teamWrapper?.team;
        
        if (!teamArray || !Array.isArray(teamArray)) continue;
        
        // teamArray[0] is metadata array, teamArray[1] is standings stats
        const teamMetadata = teamArray[0];
        const teamStats = teamArray[1];
        
        const teamId = teamMetadata?.find((item: { team_id?: string }) => item.team_id)?.team_id;
        const outcomeTotals = teamStats?.team_standings?.outcome_totals;
        
        if (teamId && outcomeTotals) {
          officialRecords[teamId] = {
            wins: parseInt(outcomeTotals.wins || '0'),
            losses: parseInt(outcomeTotals.losses || '0'),
            ties: parseInt(outcomeTotals.ties || '0'),
          };
        }
      }
    }
    
    console.log('Official records from Yahoo:', officialRecords);

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
      
      // Use official Yahoo records instead of calculating them
      const managerRecords: Record<string, { yahooTeamId: string; wins: number; losses: number; ties: number }> = {};
      for (const teamId in officialRecords) {
        managerRecords[teamId] = {
          yahooTeamId: teamId,
          ...officialRecords[teamId],
        };
      }

      return NextResponse.json({
        success: true,
        currentWeek,
        totalScores,
        weeklyScores,
        managerRecords,
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

