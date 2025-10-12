import { NextRequest, NextResponse } from 'next/server';
import { YahooOAuth } from '@/lib/yahoo-oauth';

export async function GET(request: NextRequest) {
  const oauth = new YahooOAuth();
  const authUrl = oauth.getAuthUrl();
  
  return NextResponse.redirect(authUrl);
}
