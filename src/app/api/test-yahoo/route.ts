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

    console.log('Testing Yahoo API with league ID:', leagueId);
    
    const yahooAPI = new YahooFantasyAPI(accessToken, leagueId);
    const leagueData = await yahooAPI.getLeagueInfo();
    
    return NextResponse.json({
      success: true,
      data: {
        leagueName: leagueData.leagueName,
        currentWeek: leagueData.currentWeek,
        managersCount: leagueData.managers.length,
        matchupsCount: leagueData.matchups.length,
        managers: leagueData.managers.map(m => ({
          id: m.id,
          name: m.name,
          yahooTeamName: m.yahooTeamName
        })),
        matchups: leagueData.matchups.map(m => ({
          id: m.id,
          week: m.week,
          manager1: m.manager1.yahooTeamName,
          manager2: m.manager2.yahooTeamName,
          manager1Score: m.manager1Score,
          manager2Score: m.manager2Score,
          isComplete: m.isComplete
        }))
      }
    });
  } catch (error) {
    console.error('Yahoo API test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
