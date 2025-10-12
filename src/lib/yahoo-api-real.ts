import axios from 'axios';

const YAHOO_API_BASE = 'https://fantasysports.yahooapis.com/fantasy/v2';

export class YahooFantasyAPIReal {
  private accessToken: string;
  private clientId: string;
  private clientSecret: string;

  constructor(accessToken: string, clientId: string, clientSecret: string) {
    this.accessToken = accessToken;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async getLeagueData(leagueId: string): Promise<any> {
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

  async getMatchups(leagueId: string, week: number): Promise<any> {
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

  async getTeams(leagueId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${YAHOO_API_BASE}/league/${leagueId}/teams`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Accept': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  }
}
