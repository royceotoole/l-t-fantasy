// Simple Yahoo Fantasy API test - no OAuth required
// Run with: node test-yahoo-simple.js YOUR_LEAGUE_ID

const https = require('https');

const LEAGUE_ID = process.argv[2];

if (!LEAGUE_ID) {
  console.log('❌ Please provide your League ID');
  console.log('Usage: node test-yahoo-simple.js YOUR_LEAGUE_ID');
  console.log('Example: node test-yahoo-simple.js 12345');
  process.exit(1);
}

console.log('🏒 Testing Yahoo Fantasy API...');
console.log('League ID:', LEAGUE_ID);

// Test 1: Check if league exists (public endpoint)
function testLeagueExists() {
  return new Promise((resolve, reject) => {
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/414.l.${LEAGUE_ID}`;
    
    console.log('\n🔍 Test 1: Checking if league exists...');
    console.log('URL:', url);
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('Status:', res.statusCode);
        if (res.statusCode === 200) {
          console.log('✅ League exists!');
          try {
            const json = JSON.parse(data);
            console.log('League Name:', json.fantasy_content?.league?.[0]?.name || 'Unknown');
            resolve(true);
          } catch (e) {
            console.log('⚠️  League exists but response format unexpected');
            resolve(true);
          }
        } else {
          console.log('❌ League not found or access denied');
          console.log('Response:', data);
          resolve(false);
        }
      });
    }).on('error', (error) => {
      console.log('❌ Network error:', error.message);
      reject(error);
    });
  });
}

// Test 2: Check league settings (requires authentication)
function testLeagueSettings() {
  return new Promise((resolve, reject) => {
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/414.l.${LEAGUE_ID}/settings`;
    
    console.log('\n🔍 Test 2: Checking league settings (requires auth)...');
    console.log('URL:', url);
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('Status:', res.statusCode);
        if (res.statusCode === 200) {
          console.log('✅ League settings accessible!');
          resolve(true);
        } else {
          console.log('❌ League settings require authentication');
          console.log('Response:', data.substring(0, 200) + '...');
          resolve(false);
        }
      });
    }).on('error', (error) => {
      console.log('❌ Network error:', error.message);
      reject(error);
    });
  });
}

// Test 3: Check scoreboard (requires authentication)
function testScoreboard() {
  return new Promise((resolve, reject) => {
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/414.l.${LEAGUE_ID}/scoreboard`;
    
    console.log('\n🔍 Test 3: Checking scoreboard (requires auth)...');
    console.log('URL:', url);
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('Status:', res.statusCode);
        if (res.statusCode === 200) {
          console.log('✅ Scoreboard accessible!');
          resolve(true);
        } else {
          console.log('❌ Scoreboard requires authentication');
          console.log('Response:', data.substring(0, 200) + '...');
          resolve(false);
        }
      });
    }).on('error', (error) => {
      console.log('❌ Network error:', error.message);
      reject(error);
    });
  });
}

// Run all tests
async function runTests() {
  try {
    console.log('🚀 Starting Yahoo Fantasy API tests...\n');
    
    const leagueExists = await testLeagueExists();
    
    if (!leagueExists) {
      console.log('\n❌ League not found. Please check your League ID.');
      console.log('Your League ID should be 5 digits from the URL:');
      console.log('https://hockey.fantasysports.yahoo.com/hockey/2024/12345');
      return;
    }
    
    await testLeagueSettings();
    await testScoreboard();
    
    console.log('\n📋 Summary:');
    console.log('✅ League exists and is accessible');
    console.log('❌ Authentication required for full data access');
    console.log('\n🔧 Next steps:');
    console.log('1. Get a valid access token from Yahoo');
    console.log('2. Use the token in your app');
    console.log('3. Test the connection again');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();
