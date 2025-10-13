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
    const gamesObj = user?.[1]?.games;
    
    if (!gamesObj) {
      return NextResponse.json({
        success: true,
        games: [],
      });
    }

    // Yahoo returns games as an object with numeric keys
    // Extract all game objects (skip the 'count' property)
    const games = [];
    for (const key in gamesObj) {
      if (key !== 'count' && gamesObj[key]?.game?.[0]) {
        const game = gamesObj[key].game[0];
        games.push({
          game_key: game.game_key || '',
          code: game.code || '',
          name: game.name || '',
          season: game.season || '',
          is_offseason: game.is_offseason,
          is_game_over: game.is_game_over,
        });
      }
    }

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

