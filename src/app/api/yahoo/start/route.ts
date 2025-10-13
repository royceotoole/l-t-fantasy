// One-time OAuth start - redirects to Yahoo for authorization

import { NextResponse } from 'next/server';

export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.YAHOO_CLIENT_ID!,
    redirect_uri: process.env.YAHOO_REDIRECT_URI!,
    response_type: 'code',
    scope: 'fspt-r', // Fantasy Sports Read permission
  });

  return NextResponse.redirect(
    `https://api.login.yahoo.com/oauth2/request_auth?${params.toString()}`
  );
}

