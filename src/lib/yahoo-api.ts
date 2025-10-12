import axios from 'axios';

const YAHOO_API_BASE = 'https://fantasysports.yahooapis.com/fantasy/v2';

export class YahooFantasyAPI {
  private accessToken: string;
  private clientId: string;
  private clientSecret: string;

  constructor(accessToken: string, clientId: string, clientSecret: string) {
    this.accessToken = accessToken;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async getLeagueData(leagueId: string): Promise<unknown> {
    try {
      const response = await axios.get(
        `${YAHOO_API_BASE}/league/${leagueId}/standings`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Accept': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching league data:', error);
      throw error;
    }
  }

  async getMatchups(leagueId: string, week: number): Promise<unknown> {
    try {
      const response = await axios.get(
        `${YAHOO_API_BASE}/league/${leagueId}/scoreboard;week=${week}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Accept': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching matchups:', error);
      throw error;
    }
  }

  async getCurrentWeek(leagueId: string): Promise<number> {
    try {
      const response = await axios.get(
        `${YAHOO_API_BASE}/league/${leagueId}/settings`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Accept': 'application/json',
          },
        }
      );
      return response.data.fantasy_content.league.current_week;
    } catch (error) {
      console.error('Error fetching current week:', error);
      throw error;
    }
  }
}

// Mock data for development/testing
export const mockYahooData = {
  leagueId: '123456',
  season: '2024',
  week: 1,
  teams: [
    { teamId: '1', name: 'rice', manager: 'Manager 1' },
    { teamId: '2', name: 'Myles', manager: 'Manager 2' },
    { teamId: '3', name: 'microsoft pp', manager: 'Manager 3' },
    { teamId: '4', name: 'Scheif Happens', manager: 'Manager 4' },
  ],
  matchups: [
    {
      week: 1,
      homeTeam: { teamId: '1', score: 55 },
      awayTeam: { teamId: '2', score: 48 },
    },
    {
      week: 1,
      homeTeam: { teamId: '3', score: 64 },
      awayTeam: { teamId: '4', score: 39 },
    },
  ],
};
