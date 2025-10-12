import { NextResponse } from 'next/server';
import { YahooFantasyAPI, getMockData } from '@/lib/yahoo-api';
import { DataManager } from '@/lib/data-manager';

export async function POST() {
  try {
    // In production, you would get these from environment variables or request body
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

    return NextResponse.json({
      success: true,
      message: 'Scores updated successfully',
      data: {
        currentWeek: yahooData.currentWeek,
        matchups: yahooData.matchups,
        teamScores: dataManager.calculateTeamScores(),
      },
    });
  } catch (error) {
    console.error('Error updating scores:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update scores' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const dataManager = new DataManager();
    
    return NextResponse.json({
      success: true,
      data: {
        currentWeek: dataManager.getCurrentWeek(),
        matchups: dataManager.getCurrentWeekMatchups(),
        teamScores: dataManager.calculateTeamScores(),
        weeklyStandings: dataManager.getWeeklyStandings(dataManager.getCurrentWeek()),
      },
    });
  } catch (error) {
    console.error('Error fetching scores:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch scores' },
      { status: 500 }
    );
  }
}
