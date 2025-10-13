// Manual token test for Yahoo Fantasy API
// This will help us get a working token

const https = require('https');

console.log('🏒 Yahoo Fantasy API - Manual Token Test');
console.log('========================================\n');

console.log('📋 Instructions:');
console.log('1. Go to: https://developer.yahoo.com/');
console.log('2. Sign in and go to your app');
console.log('3. Go to "OAuth 2.0 Playground"');
console.log('4. Select your app and click "Start OAuth Flow"');
console.log('5. Authorize the app');
console.log('6. Copy the "Access Token" from the result');
console.log('7. Paste it below\n');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter your Access Token: ', (token) => {
  if (!token || token.trim() === '') {
    console.log('❌ No token provided');
    rl.close();
    return;
  }

  console.log('\n🔍 Testing your token with League ID 37256...');
  testTokenWithLeague(token.trim(), '37256');
});

function testTokenWithLeague(accessToken, leagueId) {
  const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/414.l.${leagueId}`;
  
  console.log('Testing URL:', url);
  
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
      console.log('\n📊 Results:');
      console.log('Status Code:', res.statusCode);
      
      if (res.statusCode === 200) {
        console.log('✅ SUCCESS! Your token works!');
        try {
          const json = JSON.parse(data);
          const league = json.fantasy_content?.league?.[0];
          if (league) {
            console.log('\n🏒 League Information:');
            console.log('Name:', league.name);
            console.log('Current Week:', league.current_week);
            console.log('Season:', league.season);
            console.log('Number of Teams:', league.num_teams);
            
            console.log('\n🎉 Perfect! Your Yahoo API is working!');
            console.log('\n🔧 Next Steps:');
            console.log('1. Add this token to Vercel:');
            console.log('   YAHOO_ACCESS_TOKEN =', accessToken);
            console.log('2. Add your league ID to Vercel:');
            console.log('   YAHOO_LEAGUE_ID =', leagueId);
            console.log('3. Redeploy your app');
            console.log('4. Test at: https://l-t-fantasy.vercel.app/test-yahoo');
          }
        } catch (e) {
          console.log('✅ Token works but response format unexpected');
          console.log('Raw response (first 500 chars):', data.substring(0, 500));
        }
      } else {
        console.log('❌ Token failed');
        console.log('Error response:', data);
        
        if (res.statusCode === 401) {
          console.log('\n💡 This usually means:');
          console.log('- Token is expired or invalid');
          console.log('- Token doesn\'t have the right permissions');
          console.log('- Try getting a fresh token from OAuth Playground');
        }
      }
      
      rl.close();
    });
  }).on('error', (error) => {
    console.log('❌ Network error:', error.message);
    rl.close();
  });
}
