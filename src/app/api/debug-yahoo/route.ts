import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const YAHOO_BASE_URL = 'https://fantasysports.yahooapis.com/fantasy/v2';

export async function POST(request: NextRequest) {
  try {
    const { accessToken, leagueId, gameKey } = await request.json();

    if (!accessToken || !leagueId) {
      return NextResponse.json({
        success: false,
        error: 'Missing accessToken or leagueId'
      }, { status: 400 });
    }

    const targetGameKey = gameKey || '422'; // Default to 2024 Hockey

    const endpoint = `/league/${targetGameKey}.l.${leagueId}`;
    console.log(`Debugging Yahoo API: ${YAHOO_BASE_URL}${endpoint}`);

    const response = await axios.get(`${YAHOO_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    return NextResponse.json({
      success: true,
      data: response.data,
      statusCode: response.status,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorResponse = error && typeof error === 'object' && 'response' in error ? (error as { response?: { data?: unknown; status?: number } }).response : null;
    console.error('Yahoo API debug failed:', errorResponse?.data || errorMessage);
    return NextResponse.json({
      success: false,
      error: errorResponse?.data || errorMessage,
      statusCode: errorResponse?.status || 500,
    }, { status: errorResponse?.status || 500 });
  }
}