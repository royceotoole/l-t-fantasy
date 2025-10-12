# Yahoo Fantasy Sports API Setup Guide

## Step 1: Create Yahoo Developer App

1. Go to https://developer.yahoo.com/
2. Sign in with your Yahoo account
3. Click "Create an App"
4. Fill out the form:
   - **App Name**: "Lily and Teagan's Fantasy League"
   - **App Type**: "Web Application"
   - **Description**: "Fantasy league tracker"
   - **Home Page URL**: `http://localhost:3000`
   - **Callback URL**: `http://localhost:3000/auth/callback`

5. Save your **Client ID** and **Client Secret**

## Step 2: Get League Information

1. **League ID**: 
   - Go to your Yahoo Fantasy Hockey league
   - URL format: `https://hockey.fantasysports.yahoo.com/hockey/2024/123456`
   - The number after the year is your League ID

2. **Team Names**:
   - Note down the exact team names in your league
   - You'll need these for team assignments

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root with:

```bash
# Yahoo Fantasy Sports API Credentials
YAHOO_CLIENT_ID=your_client_id_here
YAHOO_CLIENT_SECRET=your_client_secret_here

# League Configuration
YAHOO_LEAGUE_ID=your_league_id_here
YAHOO_SEASON=2024

# Team Assignments (comma-separated)
LILY_TEAMS=Team Name 1,Team Name 2
TEAGAN_TEAMS=Team Name 3,Team Name 4

# OAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here
```

## Step 4: Update Team Assignments

Edit `src/lib/data-manager.ts` and update the `TEAM_ASSIGNMENTS` object:

```typescript
const TEAM_ASSIGNMENTS: Record<string, 'lily' | 'teagan'> = {
  'Your Team Name 1': 'lily',
  'Your Team Name 2': 'lily',
  'Your Team Name 3': 'teagan',
  'Your Team Name 4': 'teagan',
};
```

## Step 5: Test the Integration

1. Restart your development server: `npm run dev`
2. Visit `http://localhost:3000`
3. The website should now fetch real data from your Yahoo league

## Troubleshooting

- **403 Forbidden**: Check your API credentials
- **League not found**: Verify your League ID
- **Teams not showing**: Check team name spelling in assignments
- **No data**: Ensure your league is active and has matchups

## Next Steps

Once working locally, deploy to Vercel:
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!
