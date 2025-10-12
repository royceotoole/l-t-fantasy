import { NextRequest, NextResponse } from 'next/server';
import { YahooOAuth } from '@/lib/yahoo-oauth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.json({ error: `OAuth error: ${error}` }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: 'No authorization code received' }, { status: 400 });
  }

  try {
    const oauth = new YahooOAuth();
    const tokens = await oauth.exchangeCodeForToken(code);
    
    // Store tokens securely (in production, use a database)
    // For now, we'll return them to be stored in localStorage
    return NextResponse.json({
      success: true,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.json({ 
      error: 'Failed to exchange code for token' 
    }, { status: 500 });
  }
}
