import { NextResponse } from 'next/server';
import { yahooFetch, ensureNhlLeagueKey } from '@/lib/yahoo-oauth-new';

export async function GET() {
  try {
    const leagueKey = await ensureNhlLeagueKey();
    
    // Fetch current week scoreboard first to get the current week number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scoreboardData = await yahooFetch(`/fantasy/v2/league/${leagueKey}/scoreboard`) as any;
    
    // Get current week from scoreboard
    const leagueArray = scoreboardData.fantasy_content.league;
    const leagueInfo = leagueArray[0];
    const currentWeek = parseInt(leagueInfo.current_week || '1');
    
    // Fetch all weeks from 1 to current week
    const weeksToFetch = Array.from({ length: currentWeek }, (_, i) => i + 1).join(',');
    const allWeeksData = await yahooFetch(`/fantasy/v2/league/${leagueKey}/scoreboard;weeks=${weeksToFetch}`);

    return NextResponse.json({
      success: true,
      currentWeek,
      weeksToFetch,
      allWeeksData,
    });
  } catch (error) {
    console.error('Error fetching all weeks data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

