# L-T Fantasy Hockey

A mobile-first website for tracking Yahoo Fantasy Hockey league matchups between Team Lily and Team Teagan.

## Features

- **Total Score Tracking**: Real-time tracking of wins and losses for each team
- **Weekly Matchups**: Display of current week's individual manager matchups
- **Team Management**: Easy assignment of managers to Team Lily or Team Teagan
- **Automated Updates**: Hourly score updates and weekly standings resets
- **Mobile-First Design**: Optimized for mobile devices with responsive design

## Technology Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Yahoo Fantasy Sports API** - Data source
- **Vercel** - Hosting and cron jobs

## Deployment

This project is deployed on Vercel and automatically updates from the main branch.

## Setup

### 1. Yahoo Developer App Setup

1. Go to [Yahoo Developer Network](https://developer.yahoo.com/apps/create/)
2. Create a new app with these settings:
   - **Application Name**: Lily and Teagan's Fantasy League
   - **Application Type**: Web Application
   - **Redirect URI**: `https://l-t-fantasy.vercel.app/api/yahoo/callback`
   - **API Permissions**: Fantasy Sports (Read)
3. Save your **Client ID** and **Client Secret**

### 2. Get Your Refresh Token (One-Time Setup)

1. Add these environment variables to Vercel:
   - `YAHOO_CLIENT_ID` = your client ID
   - `YAHOO_CLIENT_SECRET` = your client secret
   - `YAHOO_REDIRECT_URI` = `https://l-t-fantasy.vercel.app/api/yahoo/callback`

2. Visit: `https://l-t-fantasy.vercel.app/api/yahoo/start`
   - **IMPORTANT**: Before clicking authorize, open your Hockey league in another tab: `https://hockey.fantasysports.yahoo.com/hockey/37256`
   - This ensures Yahoo associates your token with Hockey, not another sport

3. Authorize the app
4. Copy the **refresh token** from the callback page
5. Add to Vercel: `YAHOO_REFRESH_TOKEN` = your refresh token

### 3. Discover Your NHL League Key

1. Visit: `https://l-t-fantasy.vercel.app/discover-nhl`
2. Click "Discover My Games"
3. Find your NHL league and copy the **NHL_LEAGUE_KEY** (format: `427.l.37256`)
4. Add to Vercel: `NHL_LEAGUE_KEY` = your league key
5. Redeploy

### 4. Test the Connection

Visit: `https://l-t-fantasy.vercel.app/api/yahoo/league`

You should see your NHL league standings and scoreboard data!

## Environment Variables

Required environment variables in Vercel:

```env
YAHOO_CLIENT_ID=your_yahoo_client_id
YAHOO_CLIENT_SECRET=your_yahoo_client_secret
YAHOO_REDIRECT_URI=https://l-t-fantasy.vercel.app/api/yahoo/callback
YAHOO_REFRESH_TOKEN=your_refresh_token (get this from step 2)
NHL_LEAGUE_KEY=427.l.37256 (or your specific league key)
```

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env.local` with the environment variables above
4. Run development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)