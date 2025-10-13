# Yahoo Fantasy Hockey API - Fresh Start Guide

## The Problem We Had

Yahoo assigns the same league ID (37256) across different sports/seasons. When we hardcoded game keys or used just the league ID, we got Baseball data instead of Hockey.

## The Solution

1. Use OAuth to get a refresh token from YOUR Yahoo account (royceotoole@gmail.com)
2. Use the API to **discover** your games (don't hardcode)
3. Filter to find your NHL game
4. Get your leagues within that NHL game
5. Use the full league key format: `game_key.l.league_id`

## Step-by-Step Setup

### Part 1: Clean Up Vercel Environment Variables

1. Go to: https://vercel.com/royces-projects-66d90198/l-t-fantasy/settings/environment-variables
2. **Delete ALL these variables** (we'll recreate them fresh):
   - `YAHOO_ACCESS_TOKEN` (if it exists)
   - `YAHOO_REFRESH_TOKEN` (if it exists)
   - `NHL_LEAGUE_KEY` (if it exists)
3. **Keep these variables**:
   - `YAHOO_CLIENT_ID`
   - `YAHOO_CLIENT_SECRET`
   - `YAHOO_REDIRECT_URI`

### Part 2: Update Your Yahoo App Settings

1. Go to: https://developer.yahoo.com/apps/
2. Edit your app
3. Make sure these settings are correct:
   - **Redirect URI**: `https://l-t-fantasy.vercel.app/api/yahoo/callback`
   - **API Permissions**: Fantasy Sports (Read) - should show `fspt-r`
4. Save changes

### Part 3: Get Fresh Refresh Token (Using Postman - EASIEST)

#### Why Postman?
Postman handles OAuth flows perfectly and you can see exactly what's happening.

#### Steps:

1. **Download Postman** (if you don't have it): https://www.postman.com/downloads/

2. **Open Postman** and create a new request (GET request to any URL, doesn't matter)

3. **Go to the Authorization tab**

4. **Select "OAuth 2.0"** from the Type dropdown

5. **Fill in these fields**:
   - **Grant Type**: Authorization Code
   - **Callback URL**: `https://oauth.pstmn.io/v1/callback` 
   - ✅ **Check**: "Authorize using browser"
   - **Auth URL**: `https://api.login.yahoo.com/oauth2/request_auth`
   - **Access Token URL**: `https://api.login.yahoo.com/oauth2/get_token`
   - **Client ID**: (paste from Vercel - your `YAHOO_CLIENT_ID`)
   - **Client Secret**: (paste from Vercel - your `YAHOO_CLIENT_SECRET`)
   - **Scope**: `fspt-r`
   - **Client Authentication**: Send as Basic Auth header

6. **IMPORTANT - Before clicking "Get New Access Token"**:
   - Open https://hockey.fantasysports.yahoo.com/hockey/37256 in your browser
   - Make sure you're logged in as **royceotoole@gmail.com**
   - Keep that tab open

7. **Click "Get New Access Token"**

8. **A browser window opens** - Click "Agree" to authorize

9. **Postman shows your tokens**:
   - Scroll down and find **"refresh_token"**
   - Copy the entire refresh token value

10. **Add to Vercel**:
    - Go to Vercel Environment Variables
    - Add: `YAHOO_REFRESH_TOKEN` = (paste the token)
    - **DO NOT** add `YAHOO_ACCESS_TOKEN` (we'll generate it on-demand)
    - **DO NOT** add `NHL_LEAGUE_KEY` yet (we'll discover it)

11. **Redeploy** your app in Vercel

### Part 4: Discover Your NHL League Key

1. Wait for deployment to finish

2. Visit: https://l-t-fantasy.vercel.app/discover-nhl

3. Click "Discover My Games"

4. You should see:
   - A list of your fantasy games
   - Your NHL game marked with 🏒
   - Your NHL leagues listed below

5. **Copy the League Key** (format: `427.l.37256` or similar)

6. **Add to Vercel**:
   - Add: `NHL_LEAGUE_KEY` = (paste the key)
   - Redeploy

### Part 5: Test It!

Visit: https://l-t-fantasy.vercel.app/api/yahoo/league

You should see JSON with your NHL league standings and scoreboard!

## Troubleshooting

### Problem: Postman shows no NHL game or wrong sport

**Solution**: The refresh token is from the wrong Yahoo account.
- In your browser, go to: https://login.yahoo.com/
- Sign out completely
- Sign back in as **royceotoole@gmail.com**
- Open your Hockey league: https://hockey.fantasysports.yahoo.com/hockey/37256
- Try Postman again (might need to click "Clear cookies" in Postman's authorization window)

### Problem: "Not in this league" error

**Solution**: The Yahoo account doesn't have access to that league.
- Double-check you're the commissioner of league 37256
- Make sure the league is set to "publicly viewable" in league settings
- Try using the `/discover-nhl` page to see what leagues your token has access to

### Problem: Postman authorization window doesn't open

**Solution**: 
- Make sure "Authorize using browser" is checked
- Try using "New Window" mode in Postman settings
- Clear Postman cookies and cache

### Problem: /discover-nhl shows empty games

**Solution**: The refresh token isn't valid.
- Check that `YAHOO_REFRESH_TOKEN` is set in Vercel
- Check that it's the complete token (they're long - 300+ characters)
- Try getting a fresh token from Postman again

## Why This Works

1. **OAuth with your account**: The refresh token is tied to royceotoole@gmail.com
2. **Dynamic discovery**: We don't guess game keys - we ask Yahoo "what games does this user have?"
3. **Filter to NHL**: We specifically look for `code === "nhl"` in the response
4. **Full league key**: We use `game_key.l.league_id` format to avoid ambiguity
5. **JSON format**: We append `?format=json` to all requests (Yahoo defaults to XML)

## Next Steps After Setup

Once this is working, you can:
1. Build the manager assignment interface
2. Implement the scoring logic (Lily vs Teagan)
3. Set up the cron jobs to update daily
4. Display the data on your main page

But first, let's get the API connection working correctly!

