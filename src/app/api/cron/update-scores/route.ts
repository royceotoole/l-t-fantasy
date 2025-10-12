import { NextRequest, NextResponse } from 'next/server';
import { YahooFantasyAPI, getMockData } from '@/lib/yahoo-api';
import { DataManager } from '@/lib/data-manager';

export async function GET(request: NextRequest) {
  // Verify this is a legitimate cron request (in production, you'd want to verify the cron secret)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Starting hourly score update...');
    
    // In production, you would get these from environment variables
    const accessToken = process.env.YAHOO_ACCESS_TOKEN;
    const leagueId = process.env.YAHOO_LEAGUE_ID;

    let yahooData;

    if (accessToken && leagueId) {
      const yahooAPI = new YahooFantasyAPI(accessToken, leagueId);
      yahooData = await yahooAPI.getLeagueInfo();
    } else {
      // Use mock data for development
      yahooData = getMockData();
    }

    // Update the data manager
    const dataManager = new DataManager();
    dataManager.updateFromYahooData(yahooData);

    console.log('Hourly score update completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Scores updated successfully',
      timestamp: new Date().toISOString(),
      data: {
        currentWeek: yahooData.currentWeek,
        matchups: yahooData.matchups.length,
        teamScores: dataManager.calculateTeamScores(),
      },
    });
  } catch (error) {
    console.error('Error in hourly score update:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update scores',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
