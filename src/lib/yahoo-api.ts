import axios from 'axios';
import { YahooLeagueData, Manager, Matchup } from '@/types';

interface YahooTeam {
  team_id: string;
  name: string;
}

interface YahooTeamData {
  [key: string]: [YahooTeam, any];
}

interface YahooMatchup {
  [key: string]: [{
    teams: [YahooTeam, YahooTeam];
    status: string;
  }, any];
}

const YAHOO_BASE_URL = 'https://fantasysports.yahooapis.com/fantasy/v2';

export class YahooFantasyAPI {
  private accessToken: string;
  private leagueId: string;

  constructor(accessToken: string, leagueId: string) {
    this.accessToken = accessToken;
    this.leagueId = leagueId;
  }

  private async makeRequest(endpoint: string) {
    try {
      const response = await axios.get(`${YAHOO_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Yahoo API request failed:', error);
      throw error;
    }
  }

  async getLeagueInfo(): Promise<YahooLeagueData> {
    const data = await this.makeRequest(`/league/${this.leagueId}`);
    const league = data.fantasy_content.league[0];
    
    return {
      leagueId: this.leagueId,
      leagueName: league.name,
      managers: await this.getManagers(),
      currentWeek: league.current_week,
      matchups: await this.getCurrentWeekMatchups(league.current_week),
    };
  }

  async getManagers(): Promise<Manager[]> {
    const data = await this.makeRequest(`/league/${this.leagueId}/teams`);
    const teams = data.fantasy_content.league[1].teams;
    
    return Object.values(teams as YahooTeamData).map((team) => ({
      id: team[0].team_id,
      name: team[0].name,
      team: 'lily' as const, // This will be assigned later
      yahooTeamId: team[0].team_id,
      yahooTeamName: team[0].name,
    }));
  }

  async getCurrentWeekMatchups(week: number): Promise<Matchup[]> {
    const data = await this.makeRequest(`/league/${this.leagueId}/scoreboard;week=${week}`);
    const scoreboard = data.fantasy_content.league[1].scoreboard;
    
    if (!scoreboard || !scoreboard.matchups) {
      return [];
    }

    const matchups = Object.values(scoreboard.matchups as YahooMatchup).map((matchup) => {
      const teams = matchup[0].teams;
      const team1 = teams[0];
      const team2 = teams[1];

      return {
        id: `${week}-${team1[0].team_id}-${team2[0].team_id}`,
        week,
        manager1: {
          id: team1[0].team_id,
          name: team1[0].name,
          team: 'lily' as const, // This will be assigned later
          yahooTeamId: team1[0].team_id,
          yahooTeamName: team1[0].name,
        },
        manager2: {
          id: team2[0].team_id,
          name: team2[0].name,
          team: 'teagan' as const, // This will be assigned later
          yahooTeamId: team2[0].team_id,
          yahooTeamName: team2[0].name,
        },
        manager1Score: parseFloat(team1[0].team_points.total) || 0,
        manager2Score: parseFloat(team2[0].team_points.total) || 0,
        isComplete: matchup[0].status === 'postevent',
        date: new Date().toISOString(),
      };
    });

    return matchups;
  }

  async getStandings(): Promise<unknown> {
    const data = await this.makeRequest(`/league/${this.leagueId}/standings`);
    return data.fantasy_content.league[1].standings;
  }
}

// Mock data for development/testing
export const getMockData = (): YahooLeagueData => {
  return {
    leagueId: 'mock-league',
    leagueName: 'L-T Fantasy Hockey League',
    currentWeek: 1,
    managers: [
      { id: '1', name: 'Manager 1', team: 'lily', yahooTeamId: '1', yahooTeamName: 'rice' },
      { id: '2', name: 'Manager 2', team: 'lily', yahooTeamId: '2', yahooTeamName: 'microsoft pp' },
      { id: '4', name: 'Manager 4', team: 'teagan', yahooTeamId: '4', yahooTeamName: 'Myles' },
      { id: '5', name: 'Manager 5', team: 'teagan', yahooTeamId: '5', yahooTeamName: 'Scheif Happens' },
    ],
    matchups: [
      {
        id: '1-1-4',
        week: 1,
        manager1: { id: '1', name: 'Manager 1', team: 'lily', yahooTeamId: '1', yahooTeamName: 'rice' },
        manager2: { id: '4', name: 'Manager 4', team: 'teagan', yahooTeamId: '4', yahooTeamName: 'Myles' },
        manager1Score: 55,
        manager2Score: 48,
        isComplete: true,
        date: new Date().toISOString(),
      },
      {
        id: '1-2-5',
        week: 1,
        manager1: { id: '2', name: 'Manager 2', team: 'lily', yahooTeamId: '2', yahooTeamName: 'microsoft pp' },
        manager2: { id: '5', name: 'Manager 5', team: 'teagan', yahooTeamId: '5', yahooTeamName: 'Scheif Happens' },
        manager1Score: 64,
        manager2Score: 39,
        isComplete: true,
        date: new Date().toISOString(),
      },
    ],
  };
};
