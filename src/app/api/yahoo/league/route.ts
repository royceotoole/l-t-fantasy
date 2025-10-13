// Main endpoint to fetch NHL league data

import { NextResponse } from 'next/server';
import { yahooFetch, ensureNhlLeagueKey } from '@/lib/yahoo-oauth-new';

export async function GET() {
  try {
    const leagueKey = await ensureNhlLeagueKey();

    console.log('Fetching data for league key:', leagueKey);

    // Fetch standings and scoreboard for the NHL league
    const [standings, scoreboard] = await Promise.all([
      yahooFetch(`/fantasy/v2/league/${leagueKey}/standings`),
      yahooFetch(`/fantasy/v2/league/${leagueKey}/scoreboard`),
    ]);

    return NextResponse.json({
      success: true,
      leagueKey,
      standings,
      scoreboard,
    });
  } catch (error) {
    console.error('Error fetching league data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

