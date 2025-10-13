# Yahoo Fantasy Hockey Setup Checklist

Use this checklist to set up the API connection from scratch.

## ✅ Checklist

### Yahoo Developer App
- [ ] Go to https://developer.yahoo.com/apps/
- [ ] Confirm your app exists (or create one)
- [ ] Redirect URI is set to: `https://l-t-fantasy.vercel.app/api/yahoo/callback`
- [ ] API Permissions include: Fantasy Sports (Read) - `fspt-r`
- [ ] You have your Client ID and Client Secret saved

### Vercel Environment Variables (Current State)
- [ ] `YAHOO_CLIENT_ID` = (your client ID)
- [ ] `YAHOO_CLIENT_SECRET` = (your client secret)
- [ ] `YAHOO_REDIRECT_URI` = `https://l-t-fantasy.vercel.app/api/yahoo/callback`
- [ ] ~~`YAHOO_ACCESS_TOKEN`~~ **DELETE THIS** (we don't store access tokens)
- [ ] ~~`YAHOO_REFRESH_TOKEN`~~ **DELETE THIS FOR NOW** (we'll get a fresh one)
- [ ] ~~`NHL_LEAGUE_KEY`~~ **DELETE THIS FOR NOW** (we'll discover it)

### Get Fresh Refresh Token via Postman
- [ ] Download and open Postman
- [ ] Create a new request
- [ ] Go to Authorization tab → OAuth 2.0
- [ ] Fill in OAuth settings:
  - Grant Type: Authorization Code
  - Callback URL: `https://oauth.pstmn.io/v1/callback`
  - ✅ Authorize using browser
  - Auth URL: `https://api.login.yahoo.com/oauth2/request_auth`
  - Access Token URL: `https://api.login.yahoo.com/oauth2/get_token`
  - Client ID: (from Vercel)
  - Client Secret: (from Vercel)
  - Scope: `fspt-r`
  - Client Authentication: Send as Basic Auth header
- [ ] **BEFORE authorizing**: Open https://hockey.fantasysports.yahoo.com/hockey/37256
- [ ] Confirm you're logged in as **royceotoole@gmail.com**
- [ ] Keep that Hockey tab open
- [ ] Click "Get New Access Token" in Postman
- [ ] Authorize the app in the browser window
- [ ] Copy the **refresh_token** from Postman (scroll down to find it)
- [ ] Add to Vercel: `YAHOO_REFRESH_TOKEN` = (the token)
- [ ] Redeploy in Vercel

### Discover Your NHL League Key
- [ ] Wait for Vercel deployment to finish
- [ ] Visit: https://l-t-fantasy.vercel.app/discover-nhl
- [ ] Click "Discover My Games"
- [ ] Confirm you see your NHL game listed (with 🏒)
- [ ] Confirm you see your "leeg" league listed
- [ ] Copy the **League Key** (format: `###.l.37256`)
- [ ] Add to Vercel: `NHL_LEAGUE_KEY` = (the league key)
- [ ] Redeploy in Vercel

### Test the Connection
- [ ] Visit: https://l-t-fantasy.vercel.app/api/yahoo/league
- [ ] Confirm you see JSON data (not an error)
- [ ] Confirm it shows your NHL/Hockey league data
- [ ] Confirm the league name is "leeg" (your Hockey league)

### Final Verification
- [ ] The JSON response includes `"game_code": "nhl"`
- [ ] The JSON response includes `"season": "2024"`
- [ ] You see team names from your actual Hockey league
- [ ] No more "Baseball" or "Sports Page League 4" anywhere

## 🎯 If Everything is Checked

You're ready to move on to building the Lily vs Teagan features!

## 🔧 If Something Fails

Refer to the Troubleshooting section in `FRESH_START_GUIDE.md`

## 📝 Environment Variables (Final State)

After completing all steps, your Vercel env vars should be:

```
YAHOO_CLIENT_ID=dj0yJm...
YAHOO_CLIENT_SECRET=abc123...
YAHOO_REDIRECT_URI=https://l-t-fantasy.vercel.app/api/yahoo/callback
YAHOO_REFRESH_TOKEN=AAkV7GhfG... (300+ characters)
NHL_LEAGUE_KEY=427.l.37256 (or whatever the discovery page showed)
```

That's it! Only 5 environment variables needed.

