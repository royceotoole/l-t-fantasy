import axios from 'axios';
import { parseString } from 'xml2js';
import { YahooLeagueData, Manager, Matchup } from '@/types';

// Removed unused YahooTeam interface

interface YahooLeagueResponse {
  fantasy_content: {
    league: Array<{
      name: string[];
      current_week: string[];
      [key: string]: unknown;
    }>;
  };
}

interface YahooTeamsResponse {
  fantasy_content: {
    league: Array<{
      teams: Array<{
        team: Array<{
          team_id: string[];
          name: string[];
          team_points: Array<{
            total: string[];
          }>;
        }>;
      }>;
    }>;
  };
}

interface YahooMatchupResponse {
  fantasy_content: {
    league: Array<{
      scoreboard: Array<{
        matchups: Array<{
          matchup: Array<{
            teams: Array<{
              team: Array<{
                team_id: string[];
                name: string[];
                team_points: Array<{
                  total: string[];
                }>;
              }>;
            }>;
            status: string[];
          }>;
        }>;
      }>;
    }>;
  };
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
          'Accept': 'application/xml',
        },
      });
      
      // Parse XML response to JSON
      return new Promise((resolve, reject) => {
        parseString(response.data, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      console.error('Yahoo API request failed:', error);
      throw error;
    }
  }

  async getLeagueInfo(): Promise<YahooLeagueData> {
    // This is actually a 2023 Baseball league, not 2024-25 Hockey
    // Use game key 412 for 2023 Baseball leagues (league 37256)
    const gameKey = this.leagueId === '37256' ? '412' : '414';
    const data = await this.makeRequest(`/league/${gameKey}.l.${this.leagueId}`) as YahooLeagueResponse;
    const league = data.fantasy_content.league[0];
    
    return {
      leagueId: this.leagueId,
      leagueName: league.name[0],
      managers: await this.getManagers(),
      currentWeek: parseInt(league.current_week[0]),
      matchups: await this.getCurrentWeekMatchups(parseInt(league.current_week[0])),
    };
  }

  async getManagers(): Promise<Manager[]> {
    // This is actually a 2023 Baseball league, not 2024-25 Hockey
    // Use game key 412 for 2023 Baseball leagues (league 37256)
    const gameKey = this.leagueId === '37256' ? '412' : '414';
    const data = await this.makeRequest(`/league/${gameKey}.l.${this.leagueId}/teams`) as YahooTeamsResponse;
    const teams = data.fantasy_content.league[1].teams[0].team;
    
    return teams.map((team) => ({
      id: team.team_id[0],
      name: team.name[0],
      team: 'lily' as const, // This will be assigned later
      yahooTeamId: team.team_id[0],
      yahooTeamName: team.name[0],
    }));
  }

  async getCurrentWeekMatchups(week: number): Promise<Matchup[]> {
    // This is actually a 2023 Baseball league, not 2024-25 Hockey
    // Use game key 412 for 2023 Baseball leagues (league 37256)
    const gameKey = this.leagueId === '37256' ? '412' : '414';
    const data = await this.makeRequest(`/league/${gameKey}.l.${this.leagueId}/scoreboard;week=${week}`) as YahooMatchupResponse;
    const scoreboard = data.fantasy_content.league[1].scoreboard[0];
    
    if (!scoreboard || !scoreboard.matchups) {
      return [];
    }

    const matchups = scoreboard.matchups[0].matchup.map((matchup) => {
      const teams = matchup.teams[0].team;
      const team1 = teams[0];
      const team2 = teams[1];

      return {
        id: `${week}-${team1.team_id[0]}-${team2.team_id[0]}`,
        week,
        manager1: {
          id: team1.team_id[0],
          name: team1.name[0],
          team: 'lily' as const, // This will be assigned later
          yahooTeamId: team1.team_id[0],
          yahooTeamName: team1.name[0],
        },
        manager2: {
          id: team2.team_id[0],
          name: team2.name[0],
          team: 'teagan' as const, // This will be assigned later
          yahooTeamId: team2.team_id[0],
          yahooTeamName: team2.name[0],
        },
        manager1Score: parseFloat(team1.team_points[0].total[0]) || 0,
        manager2Score: parseFloat(team2.team_points[0].total[0]) || 0,
        isComplete: matchup.status[0] === 'postevent',
        date: new Date().toISOString(),
      };
    });

    return matchups;
  }

  async getStandings(): Promise<unknown> {
    const data = await this.makeRequest(`/league/${this.leagueId}/standings`) as any;
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
