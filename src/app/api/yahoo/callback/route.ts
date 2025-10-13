// OAuth callback - exchanges authorization code for tokens

import { NextRequest, NextResponse } from 'next/server';

async function tokenFromCode(code: string) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    redirect_uri: process.env.YAHOO_REDIRECT_URI!,
    code,
  });

  const res = await fetch('https://api.login.yahoo.com/oauth2/get_token', {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(
          `${process.env.YAHOO_CLIENT_ID}:${process.env.YAHOO_CLIENT_SECRET}`
        ).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }

  return res.json();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  try {
    const token = await tokenFromCode(code);

    // Return HTML page with the refresh token
    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head>
  <title>✅ OAuth Success</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 900px;
      margin: 50px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .success {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #28a745;
    }
    .token {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      word-break: break-all;
      font-family: monospace;
      margin: 10px 0;
      font-size: 14px;
    }
    .button {
      background: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      margin: 10px 5px;
      font-size: 14px;
    }
    .button:hover {
      background: #0056b3;
    }
    .next-steps {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      padding: 20px;
      border-radius: 5px;
      margin-top: 30px;
    }
    .next-steps ol {
      margin: 10px 0;
      padding-left: 20px;
    }
    .next-steps li {
      margin: 8px 0;
    }
    code {
      background: #f8f9fa;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div class="success">
    <h1>✅ Authorization Successful!</h1>
    
    <h3>Your Refresh Token:</h3>
    <div class="token" id="refreshToken">${token.refresh_token}</div>
    <button class="button" onclick="copyToken('refreshToken')">📋 Copy Refresh Token</button>
    
    <div class="next-steps">
      <h3>🎯 Next Steps:</h3>
      <ol>
        <li>Copy the <strong>Refresh Token</strong> above (click the button)</li>
        <li>Go to your <a href="https://vercel.com/royces-projects-66d90198/l-t-fantasy/settings/environment-variables" target="_blank">Vercel Environment Variables</a></li>
        <li>Add a new variable: <code>YAHOO_REFRESH_TOKEN</code> = (paste the token)</li>
        <li>Also add: <code>YAHOO_REDIRECT_URI</code> = <code>https://l-t-fantasy.vercel.app/api/yahoo/callback</code></li>
        <li><strong>Important:</strong> Make sure to also update your Yahoo App redirect URI to match!</li>
        <li>Redeploy your app</li>
        <li>Visit <a href="https://l-t-fantasy.vercel.app/api/yahoo/league">/api/yahoo/league</a> to test the connection!</li>
      </ol>
    </div>
    
    <p style="margin-top: 20px; color: #666;">
      <strong>Note:</strong> The refresh token doesn't expire, so you only need to do this once.
      Store it securely in your Vercel environment variables.
    </p>
  </div>
  
  <script>
    function copyToken(elementId) {
      const tokenElement = document.getElementById(elementId);
      navigator.clipboard.writeText(tokenElement.textContent);
      alert('✅ Token copied to clipboard!');
    }
  </script>
</body>
</html>`,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

