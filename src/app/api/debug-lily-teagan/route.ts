// Debug endpoint to test Lily vs Teagan scoring

import { NextResponse } from 'next/server';
import { yahooFetch, ensureNhlLeagueKey } from '@/lib/yahoo-oauth-new';

export async function GET() {
  try {
    const leagueKey = await ensureNhlLeagueKey();
    console.log('League key:', leagueKey);

    // Fetch scoreboard
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scoreboardData = await yahooFetch(`/fantasy/v2/league/${leagueKey}/scoreboard`) as any;

    // Return the raw data so we can see what we're getting
    return NextResponse.json({
      success: true,
      leagueKey,
      rawScoreboard: scoreboardData,
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

