// Discovers all leagues for a specific game

import { NextRequest, NextResponse } from 'next/server';
import { yahooFetch } from '@/lib/yahoo-oauth-new';

interface YahooLeague {
  league: Array<{
    league_key: string;
    league_id: string;
    name: string;
    url: string;
    num_teams: string;
    current_week: string;
    season: string;
  }>;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gameKey = searchParams.get('gameKey');

    if (!gameKey) {
      return NextResponse.json(
        { success: false, error: 'Missing gameKey parameter' },
        { status: 400 }
      );
    }

    const data = await yahooFetch(
      `/fantasy/v2/users;use_login=1/games;game_keys=${gameKey}/leagues`
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const leaguesData = data as any;
    const user = leaguesData?.fantasy_content?.users?.[0]?.user;
    const game = user?.[1]?.games?.[0]?.game;
    
    // Check if leagues exist
    if (!game?.[1]?.leagues) {
      return NextResponse.json({
        success: true,
        leagues: [],
        message: 'No leagues found for this game',
      });
    }

    const leagueArr = (game[1].leagues[0]?.league || []) as YahooLeague[];

    const leagues = leagueArr.map((l) => ({
      league_key: l.league?.[0]?.league_key || '',
      name: l.league?.[0]?.name || '',
      num_teams: l.league?.[0]?.num_teams || '',
      current_week: l.league?.[0]?.current_week || '',
      season: l.league?.[0]?.season || '',
    }));

    console.log('Discovered leagues for game', gameKey, ':', leagues);

    return NextResponse.json({
      success: true,
      leagues,
    });
  } catch (error) {
    console.error('Error discovering leagues:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

