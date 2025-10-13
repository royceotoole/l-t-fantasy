// Test endpoint to debug matchup parsing

import { NextResponse } from 'next/server';
import { yahooFetch, ensureNhlLeagueKey } from '@/lib/yahoo-oauth-new';

export async function GET() {
  try {
    const leagueKey = await ensureNhlLeagueKey();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scoreboardData = await yahooFetch(`/fantasy/v2/league/${leagueKey}/scoreboard`) as any;

    const league = scoreboardData.fantasy_content.league[0];
    const scoreboardObj = league[1]?.scoreboard;

    const debugInfo: string[] = [];
    
    debugInfo.push('=== SCOREBOARD STRUCTURE ===');
    debugInfo.push(`scoreboardObj exists: ${!!scoreboardObj}`);
    debugInfo.push(`scoreboardObj[0] exists: ${!!scoreboardObj?.[0]}`);
    debugInfo.push(`scoreboardObj[0].matchups exists: ${!!scoreboardObj?.[0]?.matchups}`);
    
    if (scoreboardObj?.[0]?.matchups) {
      const matchupsObj = scoreboardObj[0].matchups;
      debugInfo.push(`\nMatchups keys: ${Object.keys(matchupsObj).join(', ')}`);
      
      // Try to parse first matchup
      const firstMatchup = matchupsObj['0'];
      debugInfo.push(`\n=== FIRST MATCHUP (key "0") ===`);
      debugInfo.push(`firstMatchup exists: ${!!firstMatchup}`);
      debugInfo.push(`firstMatchup.matchup exists: ${!!firstMatchup?.matchup}`);
      debugInfo.push(`firstMatchup.matchup[0] exists: ${!!firstMatchup?.matchup?.[0]}`);
      
      if (firstMatchup?.matchup?.[0]) {
        const matchupArray = firstMatchup.matchup[0];
        debugInfo.push(`matchupArray type: ${typeof matchupArray}`);
        debugInfo.push(`matchupArray is array: ${Array.isArray(matchupArray)}`);
        debugInfo.push(`matchupArray keys: ${Object.keys(matchupArray).join(', ')}`);
        debugInfo.push(`matchupArray.teams exists: ${!!matchupArray.teams}`);
        
        if (matchupArray.teams) {
          const teamsObj = matchupArray.teams;
          debugInfo.push(`\n=== TEAMS ===`);
          debugInfo.push(`teams['0'] exists: ${!!teamsObj['0']}`);
          debugInfo.push(`teams['1'] exists: ${!!teamsObj['1']}`);
          debugInfo.push(`teams['0'].team exists: ${!!teamsObj['0']?.team}`);
          debugInfo.push(`teams['1'].team exists: ${!!teamsObj['1']?.team}`);
          
          if (teamsObj['0']?.team) {
            const team1Wrapper = teamsObj['0'].team;
            debugInfo.push(`\n=== TEAM 1 ===`);
            debugInfo.push(`team1Wrapper is array: ${Array.isArray(team1Wrapper)}`);
            debugInfo.push(`team1Wrapper length: ${team1Wrapper.length}`);
            debugInfo.push(`team1Wrapper[0] is array: ${Array.isArray(team1Wrapper[0])}`);
            
            if (Array.isArray(team1Wrapper[0])) {
              const metadata = team1Wrapper[0];
              debugInfo.push(`metadata length: ${metadata.length}`);
              
              // Try to find team_id
              const teamIdObj = metadata.find((item: { team_id?: string }) => item.team_id);
              const nameObj = metadata.find((item: { name?: string }) => item.name);
              
              debugInfo.push(`Found team_id: ${teamIdObj?.team_id}`);
              debugInfo.push(`Found name: ${nameObj?.name}`);
            }
            
            debugInfo.push(`team1Wrapper[1] exists: ${!!team1Wrapper[1]}`);
            debugInfo.push(`team1Wrapper[1].team_points exists: ${!!team1Wrapper[1]?.team_points}`);
            debugInfo.push(`team1Wrapper[1].team_points.total: ${team1Wrapper[1]?.team_points?.total}`);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      debugInfo,
      rawFirstMatchup: scoreboardObj?.[0]?.matchups?.['0'],
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

