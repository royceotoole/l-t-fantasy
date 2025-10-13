# Get Yahoo OAuth Token via Postman

## Step 1: Set Up Authorization in Postman

1. Open Postman
2. Create a new request (any type, we just need the Auth tab)
3. Go to the **Authorization** tab
4. Select **OAuth 2.0** from the Type dropdown

## Step 2: Configure OAuth 2.0

Fill in these fields:

- **Grant Type**: Authorization Code
- **Callback URL**: `https://oauth.pstmn.io/v1/callback` (check "Authorize using browser")
- **Auth URL**: `https://api.login.yahoo.com/oauth2/request_auth`
- **Access Token URL**: `https://api.login.yahoo.com/oauth2/get_token`
- **Client ID**: (paste your YAHOO_CLIENT_ID from Vercel)
- **Client Secret**: (paste your YAHOO_CLIENT_SECRET from Vercel)
- **Scope**: `fspt-r`
- **Client Authentication**: Send as Basic Auth header

## Step 3: Get Token

1. **IMPORTANT FIRST**: Open https://hockey.fantasysports.yahoo.com/hockey/37256 in your browser
2. Make sure you're logged in as **royceotoole@gmail.com**
3. Keep that tab open
4. In Postman, click **"Get New Access Token"**
5. A browser window will open - authorize the app
6. Postman will capture the tokens

## Step 4: Copy the Refresh Token

1. After authorization, Postman will show you the tokens
2. Scroll down and find **"refresh_token"**
3. Copy the entire refresh token value
4. Go to Vercel → Environment Variables
5. Update `YAHOO_REFRESH_TOKEN` with this value
6. Redeploy

## Step 5: Test API Call in Postman

Create a new GET request to test:

**URL**: `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games?format=json`

**Headers**:
- Authorization: `Bearer YOUR_ACCESS_TOKEN` (use the access token from step 3)

**Expected Result**: You should see a list of your fantasy games including NHL

If you see your NHL game in the response:
1. Note the `game_key` for NHL (probably 427 or 423)
2. Make another request: `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=427/leagues?format=json`
3. This will show your NHL leagues - copy the full `league_key` (format: `427.l.37256`)
4. Add to Vercel: `NHL_LEAGUE_KEY` = that value
5. Redeploy and test!

## Troubleshooting

**Problem**: Still seeing Baseball or wrong sport
- Make sure you're on https://hockey.fantasysports.yahoo.com/hockey/37256 BEFORE authorizing in Postman
- Sign out of Yahoo completely, sign back in as royceotoole@gmail.com, try again

**Problem**: "Not in this league" error
- The Yahoo account you're using doesn't have access to league 37256
- Double-check you're logged in as the correct account

**Problem**: No games showing
- The token is invalid or from a test account
- Try revoking app access at https://login.yahoo.com/account/security and redo from step 1

