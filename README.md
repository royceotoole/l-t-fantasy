# L-T Fantasy Hockey

A mobile-first website for tracking Yahoo Fantasy Hockey league matchups between Team Lily and Team Teagan.

## Features

- **Total Score Tracking**: Real-time tracking of wins and losses for each team
- **Weekly Matchups**: Display of current week's individual manager matchups
- **Team Management**: Easy assignment of managers to Team Lily or Team Teagan
- **Automated Updates**: Hourly score updates and weekly standings resets
- **Mobile-First Design**: Optimized for mobile devices with responsive design

## How It Works

1. **Team Assignment**: Each manager from your Yahoo Fantasy Hockey league is assigned to either Team Lily or Team Teagan
2. **Scoring System**: When a manager wins a head-to-head matchup, their team gets 1 point
3. **Automated Updates**: 
   - Scores update every hour at 1:00 or 2:00 AM
   - Standings reset every Monday at 5:00 AM Central Time
4. **Real-time Display**: The website shows current standings and weekly matchups

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Yahoo Fantasy Sports API Configuration
YAHOO_ACCESS_TOKEN=your_yahoo_access_token_here
YAHOO_LEAGUE_ID=your_yahoo_league_id_here

# Cron Job Security
CRON_SECRET=your_secure_random_string_here
```

### 2. Yahoo Fantasy Sports API Setup

1. Go to [Yahoo Developer Network](https://developer.yahoo.com/)
2. Create a new application
3. Get your access token and league ID
4. Add them to your environment variables

### 3. Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### 4. Deployment on Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

The cron jobs will automatically run on Vercel:
- Hourly score updates at 1:00 and 2:00 AM
- Weekly standings reset every Monday at 5:00 AM Central

## API Endpoints

- `GET /api/update-scores` - Get current scores and matchups
- `POST /api/update-scores` - Manually update scores
- `GET /api/update-standings` - Get current standings
- `POST /api/update-standings` - Manually update standings
- `GET /api/cron/update-scores` - Cron endpoint for hourly updates
- `GET /api/cron/update-standings` - Cron endpoint for weekly updates

## Technology Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Yahoo Fantasy Sports API** - Data source
- **Vercel** - Hosting and cron jobs

## Contributing

Feel free to submit issues and enhancement requests!
