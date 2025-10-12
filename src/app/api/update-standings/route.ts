import { NextResponse } from 'next/server';
import { dataManager } from '@/lib/data-manager';

export async function GET() {
  try {
    // This runs every Monday at 5 AM Central (10 AM UTC)
    const currentWeek = 2; // This would be calculated from current date
    
    // Reset weekly matchups and update standings
    dataManager.resetWeeklyMatchups(currentWeek);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Standings updated and matchups reset',
      week: currentWeek,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating standings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update standings' },
      { status: 500 }
    );
  }
}

// For Vercel Cron Jobs
export async function POST() {
  return GET();
}
