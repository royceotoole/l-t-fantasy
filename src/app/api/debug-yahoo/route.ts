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
  } catch (error: any) {
    console.error('Yahoo API debug failed:', error.response?.data || error.message);
    return NextResponse.json({
      success: false,
      error: error.response?.data || error.message,
      statusCode: error.response?.status || 500,
    }, { status: error.response?.status || 500 });
  }
}