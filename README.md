# Lily and Teagan's Fantasy League

A mobile-first website that tracks the epic battle between Team Lily and Team Teagan in your Yahoo Fantasy Hockey league.

## Features

- **Real-time Standings**: Track wins/losses between Team Lily and Team Teagan
- **Weekly Matchups**: View individual manager matchups with live scores
- **Automated Updates**: 
  - Hourly score updates (every hour on the hour)
  - Weekly standings reset (Mondays at 5 AM Central)
- **Mobile-First Design**: Optimized for mobile viewing

## Setup Instructions

### 1. Yahoo Fantasy Sports API Setup

1. Go to [Yahoo Developer Network](https://developer.yahoo.com/api/)
2. Create a new application
3. Note down your Client ID and Client Secret
4. Get your league ID from your Yahoo Fantasy Hockey league URL
5. Set up OAuth to get an access token

### 2. Environment Variables

Copy `env.example` to `.env.local` and fill in your credentials:

```bash
cp env.example .env.local
```

Update the following variables:
- `YAHOO_CLIENT_ID`: Your Yahoo app client ID
- `YAHOO_CLIENT_SECRET`: Your Yahoo app client secret
- `YAHOO_ACCESS_TOKEN`: Your Yahoo API access token
- `YAHOO_LEAGUE_ID`: Your fantasy league ID
- `YAHOO_SEASON`: Current season (e.g., 2024)

### 3. Team Assignments

Update the team assignments in `src/lib/data-manager.ts`:

```typescript
const TEAM_ASSIGNMENTS: Record<string, 'lily' | 'teagan'> = {
  'rice': 'lily',
  'microsoft pp': 'lily',
  'Myles': 'teagan',
  'Scheif Happens': 'teagan',
};
```

### 4. Local Development

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your fantasy league tracker.

### 5. Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

The cron jobs will automatically start running:
- Score updates: Every hour
- Standings reset: Mondays at 5 AM Central (10 AM UTC)

## How It Works

1. **Team Division**: Managers are divided into Team Lily and Team Teagan
2. **Scoring**: Each head-to-head win gives the team 1 point
3. **Updates**: 
   - Hourly: Fetch latest scores from Yahoo API
   - Weekly: Reset matchups and update standings

## Customization

- Modify team assignments in `src/lib/data-manager.ts`
- Adjust update schedules in `vercel.json`
- Customize styling in the component files
- Add more features like historical data or statistics

## Troubleshooting

- Check Vercel function logs for cron job issues
- Verify Yahoo API credentials are correct
- Ensure league ID and season are accurate
- Check that team names match exactly with Yahoo Fantasy