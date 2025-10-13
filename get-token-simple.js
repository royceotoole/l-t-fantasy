// Simplified Yahoo OAuth token generator
// Run with: node get-token-simple.js

const https = require('https');
const readline = require('readline');

// Your Yahoo App credentials (replace with your actual values)
const CLIENT_ID = 'dj0yJmk9ZTQzSkFNWkpaNmQ1JmQ9WVdrOWNrd3pORlZPZWtzbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWNi';
const CLIENT_SECRET = 'your_client_secret_here'; // You need to add this
const REDIRECT_URI = 'https://l-t-fantasy.vercel.app/api/auth/yahoo/callback';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🏒 Yahoo Fantasy API Token Generator');
console.log('=====================================\n');

if (CLIENT_SECRET === 'your_client_secret_here') {
  console.log('❌ Please update the CLIENT_SECRET in this file first!');
  console.log('1. Edit get-token-simple.js');
  console.log('2. Replace "your_client_secret_here" with your actual Client Secret');
  console.log('3. Run this script again\n');
  process.exit(1);
}

// Step 1: Generate authorization URL
const authUrl = `https://api.login.yahoo.com/oauth2/request_auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=fspt-r`;

console.log('🔗 Step 1: Visit this URL in your browser:');
console.log(authUrl);
console.log('\n📝 Step 2: After authorizing, you\'ll be redirected to a page with your token');
console.log('📝 Step 3: Copy the access token from that page\n');

rl.question('Press Enter when you have your access token...', () => {
  rl.question('Enter your access token: ', (token) => {
    if (!token || token.trim() === '') {
      console.log('❌ No token provided');
      rl.close();
      return;
    }

    console.log('\n🔍 Testing your token...');
    testToken(token.trim());
  });
});

function testToken(accessToken) {
  // Test the token with a simple API call
  const leagueId = '12345'; // Replace with your actual league ID
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
      console.log('Status Code:', res.statusCode);
      
      if (res.statusCode === 200) {
        console.log('✅ Token is valid!');
        try {
          const json = JSON.parse(data);
          const league = json.fantasy_content?.league?.[0];
          if (league) {
            console.log('League Name:', league.name);
            console.log('Current Week:', league.current_week);
            console.log('\n🎉 Success! Your token works with Yahoo API');
            console.log('\n🔧 Add this to your Vercel environment variables:');
            console.log('YAHOO_ACCESS_TOKEN =', accessToken);
          }
        } catch (e) {
          console.log('✅ Token works but response format unexpected');
          console.log('Raw response:', data.substring(0, 200) + '...');
        }
      } else {
        console.log('❌ Token is invalid or expired');
        console.log('Response:', data);
      }
      
      rl.close();
    });
  }).on('error', (error) => {
    console.log('❌ Network error:', error.message);
    rl.close();
  });
}
