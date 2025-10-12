import { NextResponse } from 'next/server';
import { YahooOAuth } from '@/lib/yahoo-oauth';

export async function GET() {
  const oauth = new YahooOAuth();
  const authUrl = oauth.getAuthUrl();
  
  return NextResponse.redirect(authUrl);
}
