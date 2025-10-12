import { NextRequest, NextResponse } from 'next/server';
import { YahooFantasyAPI } from '@/lib/yahoo-api';

export async function POST(request: NextRequest) {
  try {
    const { accessToken, leagueId } = await request.json();

    if (!accessToken || !leagueId) {
      return NextResponse.json({
        success: false,
        error: 'Missing accessToken or leagueId'
      }, { status: 400 });
    }

    console.log('Debug: Testing Yahoo API with league ID:', leagueId);
    
    const yahooAPI = new YahooFantasyAPI(accessToken, leagueId);
    
    // Test basic league info first
    try {
      const leagueData = await yahooAPI.getLeagueInfo();
      return NextResponse.json({
        success: true,
        message: 'Yahoo API connection successful!',
        data: {
          leagueName: leagueData.leagueName,
          currentWeek: leagueData.currentWeek,
          managersCount: leagueData.managers.length,
          matchupsCount: leagueData.matchups.length
        }
      });
    } catch (apiError) {
      console.error('Yahoo API error:', apiError);
      return NextResponse.json({
        success: false,
        error: `Yahoo API Error: ${apiError instanceof Error ? apiError.message : 'Unknown error'}`,
        details: {
          leagueId,
          hasAccessToken: !!accessToken,
          tokenLength: accessToken.length
        }
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: `Debug Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}
