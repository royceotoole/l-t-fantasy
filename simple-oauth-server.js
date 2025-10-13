// Simple OAuth server - no dependencies needed except what's already installed

const http = require('http');
const https = require('https');
const url = require('url');

// You'll paste these when you run the script
let CLIENT_ID = '';
let CLIENT_SECRET = '';

const PORT = 3030;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Step 1: Start page
  if (pathname === '/' || pathname === '') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Yahoo OAuth</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
          .card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }
          input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin: 10px 0; box-sizing: border-box; }
          button { background: #007bff; color: white; border: none; padding: 15px 30px; border-radius: 5px; font-size: 16px; cursor: pointer; }
          button:hover { background: #0056b3; }
          .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 15px 0; color: #856404; }
          ol { padding-left: 20px; }
          ol li { margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🏒 Yahoo OAuth Token Generator</h1>
          <p>Enter your Yahoo app credentials:</p>
          <form action="/start" method="GET">
            <label><strong>Client ID:</strong></label>
            <input type="text" name="client_id" required placeholder="Your Yahoo Client ID">
            
            <label><strong>Client Secret:</strong></label>
            <input type="text" name="client_secret" required placeholder="Your Yahoo Client Secret">
            
            <div class="warning">
              <strong>⚠️ IMPORTANT - Do this BEFORE clicking the button:</strong>
              <ol>
                <li>Open <a href="https://hockey.fantasysports.yahoo.com/hockey/37256" target="_blank">your Hockey league</a> in another tab</li>
                <li>Make sure you're logged in as <strong>royceotoole@gmail.com</strong></li>
                <li>Keep that tab open</li>
                <li>Then come back here and click "Get Token"</li>
              </ol>
            </div>
            
            <button type="submit">🔑 Get Token</button>
          </form>
        </div>
      </body>
      </html>
    `);
    return;
  }

  // Step 2: Start OAuth flow
  if (pathname === '/start') {
    CLIENT_ID = parsedUrl.query.client_id;
    CLIENT_SECRET = parsedUrl.query.client_secret;

    if (!CLIENT_ID || !CLIENT_SECRET) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing credentials');
      return;
    }

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: 'fspt-r',
    });

    const authUrl = `https://api.login.yahoo.com/oauth2/request_auth?${params.toString()}`;
    res.writeHead(302, { Location: authUrl });
    res.end();
    return;
  }

  // Step 3: Handle callback and exchange code for token
  if (pathname === '/callback') {
    const code = parsedUrl.query.code;

    if (!code) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing authorization code');
      return;
    }

    // Exchange code for tokens
    const postData = new URLSearchParams({
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
      code: code,
    }).toString();

    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

    const options = {
      hostname: 'api.login.yahoo.com',
      port: 443,
      path: '/oauth2/get_token',
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length,
      },
    };

    const tokenReq = https.request(options, (tokenRes) => {
      let data = '';

      tokenRes.on('data', (chunk) => {
        data += chunk;
      });

      tokenRes.on('end', () => {
        if (tokenRes.statusCode !== 200) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end(`Error from Yahoo: ${data}`);
          return;
        }

        const tokens = JSON.parse(data);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>✅ Success!</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 900px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
              .card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              h1 { color: #28a745; }
              .token { background: #f8f9fa; padding: 15px; border-radius: 5px; word-break: break-all; font-family: monospace; margin: 10px 0; font-size: 12px; }
              button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 10px 5px; }
              button:hover { background: #0056b3; }
              .next-steps { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 5px; margin-top: 30px; }
              code { background: #f8f9fa; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
              ol { padding-left: 20px; }
              ol li { margin: 8px 0; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>✅ Success! Here's Your Refresh Token</h1>
              
              <h3>Refresh Token:</h3>
              <div class="token" id="refreshToken">${tokens.refresh_token}</div>
              <button onclick="copyToken()">📋 Copy Token</button>
              
              <div class="next-steps">
                <h3>🎯 Next Steps:</h3>
                <ol>
                  <li>Copy the refresh token above</li>
                  <li>Go to <a href="https://vercel.com/royces-projects-66d90198/l-t-fantasy/settings/environment-variables" target="_blank">Vercel Environment Variables</a></li>
                  <li>Update <code>YAHOO_REFRESH_TOKEN</code> with this value</li>
                  <li>Redeploy your app</li>
                  <li>Visit <a href="https://l-t-fantasy.vercel.app/discover-nhl" target="_blank">/discover-nhl</a> to find your NHL league key</li>
                  <li>Add <code>NHL_LEAGUE_KEY</code> to Vercel and redeploy again</li>
                </ol>
              </div>
            </div>
            
            <script>
              function copyToken() {
                const token = document.getElementById('refreshToken').textContent;
                navigator.clipboard.writeText(token);
                alert('✅ Token copied to clipboard!');
              }
            </script>
          </body>
          </html>
        `);
      });
    });

    tokenReq.on('error', (e) => {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Request failed: ${e.message}`);
    });

    tokenReq.write(postData);
    tokenReq.end();
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          🏒 Yahoo OAuth Token Generator                   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

Server running at: http://localhost:${PORT}

📋 Instructions:
1. Open: http://localhost:${PORT} in your browser
2. Enter your Yahoo Client ID and Secret
3. IMPORTANT: Open your Hockey league BEFORE authorizing!
4. Follow the on-screen instructions

Press Ctrl+C to stop the server when done.
  `);
});

