// Direct OAuth method - no playground needed
// This will open your browser to get the token

const https = require('https');
const { exec } = require('child_process');

const CLIENT_ID = 'dj0yJmk9ZTQzSkFNWkpaNmQ1JmQ9WVdrOWNrd3pORlZPZWtzbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWNi';
const CLIENT_SECRET = 'c39d236629e7ac90c8cf4751354ac74b847eb57b'; // You need to add this
const REDIRECT_URI = 'https://l-t-fantasy.vercel.app/api/auth/yahoo/callback';

console.log('🏒 Yahoo Fantasy API - Direct OAuth Method');
console.log('==========================================\n');

if (CLIENT_SECRET === 'your_client_secret_here') {
  console.log('❌ Please add your Client Secret first!');
  console.log('1. Go to your Yahoo Developer Console');
  console.log('2. Find your app "Lily and Teagan\'s Fantasy League"');
  console.log('3. Copy the "Client Secret"');
  console.log('4. Edit this file and replace "your_client_secret_here" with your actual secret');
  console.log('5. Run this script again\n');
  process.exit(1);
}

// Step 1: Generate authorization URL
const authUrl = `https://api.login.yahoo.com/oauth2/request_auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=fspt-r`;

console.log('🔗 Step 1: Opening browser to authorize...');
console.log('If browser doesn\'t open, copy this URL:');
console.log(authUrl);
console.log('\n📝 Step 2: After authorizing, you\'ll be redirected to a page');
console.log('📝 Step 3: Copy the "code" parameter from the URL (after ?code=)');
console.log('📝 Step 4: Paste it below\n');

// Try to open browser
try {
  exec(`open "${authUrl}"`, (error) => {
    if (error) {
      console.log('Could not open browser automatically. Please copy the URL above.');
    }
  });
} catch (e) {
  console.log('Please copy the URL above and open it in your browser.');
}

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the authorization code from the URL: ', (code) => {
  if (!code || code.trim() === '') {
    console.log('❌ No code provided');
    rl.close();
    return;
  }

  console.log('\n🔄 Exchanging code for access token...');
  exchangeCodeForToken(code.trim());
});

function exchangeCodeForToken(code) {
  const postData = new URLSearchParams({
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URI,
    code: code,
  }).toString();

  const options = {
    hostname: 'api.login.yahoo.com',
    port: 443,
    path: '/oauth2/get_token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      'Content-Length': postData.length
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('Status Code:', res.statusCode);
      
      if (res.statusCode === 200) {
        try {
          const tokenData = JSON.parse(data);
          console.log('\n✅ SUCCESS! Got your access token!');
          console.log('Access Token:', tokenData.access_token);
          console.log('Expires In:', tokenData.expires_in, 'seconds');
          
          console.log('\n🔍 Testing token with your league (37256)...');
          testTokenWithLeague(tokenData.access_token, '37256');
        } catch (error) {
          console.log('❌ Error parsing token response:', error.message);
          console.log('Raw response:', data);
        }
      } else {
        console.log('❌ Failed to get token');
        console.log('Response:', data);
      }
      
      rl.close();
    });
  });

  req.on('error', (error) => {
    console.log('❌ Request error:', error.message);
    rl.close();
  });

  req.write(postData);
  req.end();
}

function testTokenWithLeague(accessToken, leagueId) {
  const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/414.l.${leagueId}`;
  
  const options = {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  };

  https.get(url, options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('\n📊 League Test Results:');
      console.log('Status Code:', res.statusCode);
      
      if (res.statusCode === 200) {
        console.log('✅ PERFECT! Your token works with your league!');
        try {
          const json = JSON.parse(data);
          const league = json.fantasy_content?.league?.[0];
          if (league) {
            console.log('\n🏒 Your League Information:');
            console.log('Name:', league.name);
            console.log('Current Week:', league.current_week);
            console.log('Season:', league.season);
            console.log('Number of Teams:', league.num_teams);
            
            console.log('\n🎉 SUCCESS! Everything is working!');
            console.log('\n🔧 Add these to your Vercel environment variables:');
            console.log('YAHOO_ACCESS_TOKEN =', accessToken);
            console.log('YAHOO_LEAGUE_ID =', leagueId);
            console.log('\nThen redeploy your app and test at:');
            console.log('https://l-t-fantasy.vercel.app/test-yahoo');
          }
        } catch (e) {
          console.log('✅ Token works but response format unexpected');
          console.log('Raw response (first 500 chars):', data.substring(0, 500));
        }
      } else {
        console.log('❌ Token test failed');
        console.log('Error response:', data);
      }
    });
  }).on('error', (error) => {
    console.log('❌ Network error:', error.message);
  });
}
