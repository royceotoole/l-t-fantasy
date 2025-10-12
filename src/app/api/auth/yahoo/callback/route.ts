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
    
    // Return an HTML page with the token
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Yahoo API Token</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
          .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 20px; border-radius: 5px; }
          .token { background: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; border-radius: 5px; margin: 10px 0; font-family: monospace; word-break: break-all; }
          .copy-btn { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
          .instructions { background: #e2e3e5; border: 1px solid #d6d8db; padding: 20px; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="success">
          <h2>✅ Yahoo API Token Generated Successfully!</h2>
        </div>
        
        <h3>Your Access Token:</h3>
        <div class="token" id="accessToken">${tokens.access_token}</div>
        <button class="copy-btn" onclick="copyToken()">Copy Access Token</button>
        
        <h3>Your Refresh Token:</h3>
        <div class="token" id="refreshToken">${tokens.refresh_token}</div>
        <button class="copy-btn" onclick="copyRefreshToken()">Copy Refresh Token</button>
        
        <div class="instructions">
          <h3>Next Steps:</h3>
          <ol>
            <li>Copy the Access Token above</li>
            <li>Go to your Vercel dashboard</li>
            <li>Go to Settings → Environment Variables</li>
            <li>Add: <strong>YAHOO_ACCESS_TOKEN</strong> = (paste the token)</li>
            <li>Redeploy your app</li>
            <li>Visit: <a href="/test-yahoo">/test-yahoo</a> to test the connection</li>
          </ol>
        </div>
        
        <script>
          function copyToken() {
            navigator.clipboard.writeText(document.getElementById('accessToken').textContent);
            alert('Access Token copied to clipboard!');
          }
          function copyRefreshToken() {
            navigator.clipboard.writeText(document.getElementById('refreshToken').textContent);
            alert('Refresh Token copied to clipboard!');
          }
        </script>
      </body>
      </html>
    `;
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    const errorHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Yahoo API Error</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
          .error { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 20px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="error">
          <h2>❌ Error Getting Yahoo API Token</h2>
          <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
          <p>Please try again or check your credentials.</p>
        </div>
      </body>
      </html>
    `;
    
    return new NextResponse(errorHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
}
