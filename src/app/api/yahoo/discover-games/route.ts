// Discovers all fantasy games for the logged-in user

import { NextResponse } from 'next/server';
import { yahooFetch } from '@/lib/yahoo-oauth-new';

interface YahooGame {
  game: Array<{
    game_key: string;
    game_id: string;
    name: string;
    code: string;
    type: string;
    url: string;
    season: string;
  }>;
}

export async function GET() {
  try {
    const data = await yahooFetch('/fantasy/v2/users;use_login=1/games');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gamesData = data as any;
    const user = gamesData?.fantasy_content?.users?.[0]?.user;
    const gameArr = (user?.[1]?.games?.[0]?.game || []) as YahooGame[];

    const games = gameArr.map((g) => ({
      game_key: g.game?.[0]?.game_key || '',
      code: g.game?.[0]?.code || '',
      name: g.game?.[0]?.name || '',
      season: g.game?.[0]?.season || '',
    }));

    console.log('Discovered games:', games);

    return NextResponse.json({
      success: true,
      games,
    });
  } catch (error) {
    console.error('Error discovering games:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

