// Simple script to get Yahoo Fantasy API access token
// Run with: node get-token.js

const https = require('https');

// Replace these with your actual values
const CLIENT_ID = 'dj0yJmk9ZTQzSkFNWkpaNmQ1JmQ9WVdrOWNrd3pORlZPZWtzbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWNi';
const CLIENT_SECRET = 'c39d236629e7ac90c8cf4751354ac74b847eb57b';
const REDIRECT_URI = 'https://l-t-fantasy.vercel.app/api/auth/yahoo/callback';

// Step 1: Get authorization URL
const authUrl = `https://api.login.yahoo.com/oauth2/request_auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=fspt-r`;

console.log('🔗 Step 1: Visit this URL in your browser:');
console.log(authUrl);
console.log('\n📝 Step 2: After authorizing, copy the "code" parameter from the callback URL');
console.log('📝 Step 3: Run this script again with: node get-token.js YOUR_CODE_HERE');

// Step 2: Exchange code for token
const code = process.argv[2];

if (code) {
  console.log('\n🔄 Exchanging code for token...');
  
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
      try {
        const tokenData = JSON.parse(data);
        console.log('\n✅ Success! Your access token:');
        console.log('Access Token:', tokenData.access_token);
        console.log('Refresh Token:', tokenData.refresh_token);
        console.log('Expires In:', tokenData.expires_in, 'seconds');
        console.log('\n🔧 Add this to your Vercel environment variables:');
        console.log('YAHOO_ACCESS_TOKEN =', tokenData.access_token);
      } catch (error) {
        console.error('❌ Error parsing response:', error);
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request error:', error);
  });

  req.write(postData);
  req.end();
}
