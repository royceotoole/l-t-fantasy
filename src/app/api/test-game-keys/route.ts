import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { parseString } from 'xml2js';

const YAHOO_BASE_URL = 'https://fantasysports.yahooapis.com/fantasy/v2';

export async function POST(request: NextRequest) {
  try {
    const { accessToken, leagueId } = await request.json();

    if (!accessToken || !leagueId) {
      return NextResponse.json({
        success: false,
        error: 'Missing accessToken or leagueId'
      }, { status: 400 });
    }

    // Test different game keys for 2024-25 Hockey
    const gameKeys = [
      { key: '422', name: '2024-25 Hockey' },
      { key: '421', name: '2023-24 Hockey' },
      { key: '420', name: '2022-23 Hockey' },
      { key: '414', name: '2024 Football' },
      { key: '412', name: '2023 Baseball' }
    ];

    const results = [];

    for (const gameKey of gameKeys) {
      try {
        const endpoint = `/league/${gameKey.key}.l.${leagueId}`;
        const response = await axios.get(`${YAHOO_BASE_URL}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/xml',
          },
        });

        // Parse XML response
        const data = await new Promise<{ fantasy_content: { league: Array<{ name: string[]; game_code: string[]; season: string[]; current_week: string[]; num_teams: string[] }> } }>((resolve, reject) => {
          parseString(response.data, (err, result) => {
            if (err) reject(err);
            else resolve(result as { fantasy_content: { league: Array<{ name: string[]; game_code: string[]; season: string[]; current_week: string[]; num_teams: string[] }> } });
          });
        });

        const league = data.fantasy_content.league[0];
        results.push({
          gameKey: gameKey.key,
          name: gameKey.name,
          success: true,
          leagueName: league.name[0],
          gameCode: league.game_code[0],
          season: league.season[0],
          currentWeek: league.current_week[0],
          numTeams: league.num_teams[0]
        });
      } catch (error: unknown) {
        const errorResponse = error && typeof error === 'object' && 'response' in error ? (error as { response?: { status?: number } }).response : null;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({
          gameKey: gameKey.key,
          name: gameKey.name,
          success: false,
          error: errorResponse?.status || errorMessage
        });
      }
    }

    return NextResponse.json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Game key test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
