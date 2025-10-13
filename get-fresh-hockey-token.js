require('dotenv').config();
const express = require('express');
const axios = require('axios');

const CLIENT_ID = process.env.YAHOO_CLIENT_ID;
const CLIENT_SECRET = process.env.YAHOO_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3030/callback';

const app = express();

// Step 1: Authorization URL
app.get('/', (req, res) => {
  const authUrl = `https://api.login.yahoo.com/oauth2/request_auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&language=en-us`;
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Get Hockey League Token</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          background: #f5f5f5;
        }
        .card {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
          color: #333;
          margin-bottom: 20px;
        }
        .steps {
          background: #fff3cd;
          border: 1px solid #ffc107;
          padding: 20px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .steps ol {
          margin: 10px 0;
          padding-left: 20px;
        }
        .steps li {
          margin: 10px 0;
          line-height: 1.6;
        }
        .warning {
          color: #856404;
          font-weight: bold;
          font-size: 1.1em;
          margin-bottom: 15px;
        }
        .button {
          display: inline-block;
          background: #007bff;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 5px;
          font-size: 18px;
          margin-top: 20px;
        }
        .button:hover {
          background: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>🏒 Get Fresh Token for Your Hockey League</h1>
        
        <div class="steps">
          <p class="warning">⚠️ IMPORTANT: Follow these steps EXACTLY</p>
          <ol>
            <li><strong>First, open a new tab</strong> and go to: <a href="https://hockey.fantasysports.yahoo.com/hockey/37256" target="_blank">https://hockey.fantasysports.yahoo.com/hockey/37256</a></li>
            <li><strong>Make sure you're viewing YOUR HOCKEY LEAGUE</strong> (the 2024-25 season one, not baseball)</li>
            <li><strong>Stay on that tab</strong> and keep it open</li>
            <li><strong>Then click the button below</strong> (it will open in another tab)</li>
            <li>Authorize the app when prompted</li>
            <li>You'll be redirected back here with your token</li>
          </ol>
        </div>
        
        <a href="${authUrl}" class="button" target="_blank">🔑 Authorize for Hockey League</a>
        
        <p style="margin-top: 30px; color: #666;">
          <strong>Why this matters:</strong> Yahoo will associate your token with whatever league you were last viewing.
          By opening your Hockey league first, we ensure the token works for Hockey, not Baseball.
        </p>
      </div>
    </body>
    </html>
  `);
});

// Step 2: Handle callback and exchange code for token
app.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.send('❌ No authorization code received');
  }

  try {
    // Exchange code for token
    const tokenResponse = await axios.post(
      'https://api.login.yahoo.com/oauth2/get_token',
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code: code,
        grant_type: 'authorization_code',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>✅ Token Generated!</title>
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
          }
          .button {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 10px 5px;
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
        </style>
      </head>
      <body>
        <div class="success">
          <h1>✅ Yahoo API Token Generated Successfully!</h1>
          
          <h3>Your Access Token:</h3>
          <div class="token" id="accessToken">${access_token}</div>
          <button class="button" onclick="copyToken('accessToken')">📋 Copy Access Token</button>
          
          <h3>Your Refresh Token:</h3>
          <div class="token" id="refreshToken">${refresh_token}</div>
          <button class="button" onclick="copyToken('refreshToken')">📋 Copy Refresh Token</button>
          
          <div class="next-steps">
            <h3>🎯 Next Steps:</h3>
            <ol>
              <li>Copy the <strong>Access Token</strong> above</li>
              <li>Go to your <a href="https://vercel.com/royces-projects-66d90198/l-t-fantasy/settings/environment-variables" target="_blank">Vercel dashboard</a></li>
              <li>Go to Settings → Environment Variables</li>
              <li>Find <code>YAHOO_ACCESS_TOKEN</code> and update it with the new token</li>
              <li>Save and redeploy your app</li>
              <li>Visit: <a href="https://l-t-fantasy.vercel.app/test-game-keys" target="_blank">/test-game-keys</a> to verify it works for Hockey!</li>
            </ol>
          </div>
        </div>
        
        <script>
          function copyToken(elementId) {
            const tokenElement = document.getElementById(elementId);
            navigator.clipboard.writeText(tokenElement.textContent);
            alert('✅ Token copied to clipboard!');
          }
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    res.send(`❌ Error: ${error.response?.data?.error_description || error.message}`);
  }
});

const PORT = 3030;
app.listen(PORT, () => {
  console.log(`
🏒 Yahoo Hockey Token Generator
================================
Server running at: http://localhost:${PORT}

📋 Instructions:
1. Open: http://localhost:${PORT}
2. Follow the on-screen instructions CAREFULLY
3. Make sure to open your Hockey league FIRST
4. Then authorize the app

This will ensure your token works for Hockey, not Baseball!
  `);
});

