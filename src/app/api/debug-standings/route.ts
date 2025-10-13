import { NextResponse } from 'next/server';
import { yahooFetch, ensureNhlLeagueKey } from '@/lib/yahoo-oauth-new';

export async function GET() {
  try {
    const leagueKey = await ensureNhlLeagueKey();
    const standingsData = await yahooFetch(`/fantasy/v2/league/${leagueKey}/standings`);

    return NextResponse.json({
      success: true,
      leagueKey,
      standingsData,
    });
  } catch (error) {
    console.error('Error fetching standings:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

