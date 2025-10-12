import { NextResponse } from 'next/server';
import { YahooFantasyAPI, getMockData } from '@/lib/yahoo-api';
import { DataManager } from '@/lib/data-manager';

export async function POST() {
  try {
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

    // Get updated standings
    const teamScores = dataManager.calculateTeamScores();
    const weeklyStandings = dataManager.getWeeklyStandings(yahooData.currentWeek);

    return NextResponse.json({
      success: true,
      message: 'Standings updated successfully',
      data: {
        currentWeek: yahooData.currentWeek,
        teamScores,
        weeklyStandings,
        allMatchups: dataManager.getAllMatchups(),
      },
    });
  } catch (error) {
    console.error('Error updating standings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update standings' },
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
        teamScores: dataManager.calculateTeamScores(),
        weeklyStandings: dataManager.getWeeklyStandings(dataManager.getCurrentWeek()),
        allMatchups: dataManager.getAllMatchups(),
      },
    });
  } catch (error) {
    console.error('Error fetching standings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch standings' },
      { status: 500 }
    );
  }
}
