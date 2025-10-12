import { NextResponse } from 'next/server';
import { dataManager } from '@/lib/data-manager';

export async function GET() {
  try {
    // This would normally fetch from Yahoo API
    // For now, we'll simulate score updates
    const currentWeek = 1; // This would come from Yahoo API
    
    // Simulate some score changes
    const newScores = [
      { lilyScore: 58, teaganScore: 52 }, // rice vs Myles
      { lilyScore: 67, teaganScore: 41 }, // microsoft pp vs Scheif Happens
    ];
    
    dataManager.updateMatchupScores(currentWeek, newScores);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Scores updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating scores:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update scores' },
      { status: 500 }
    );
  }
}

// For Vercel Cron Jobs
export async function POST() {
  return GET();
}
