import { Manager, Matchup, Standings } from '@/types';
import { YahooFantasyAPIReal } from './yahoo-api-real';

// Team assignments - update these with your actual team names
const TEAM_ASSIGNMENTS: Record<string, 'lily' | 'teagan'> = {
  // Update these with your actual Yahoo team names
  'rice': 'lily',
  'microsoft pp': 'lily',
  'Myles': 'teagan',
  'Scheif Happens': 'teagan',
};

export class DataManagerReal {
  private managers: Manager[] = [];
  private matchups: Matchup[] = [];
  private standings: Standings = {
    lily: { wins: 0, losses: 0, totalPoints: 0 },
    teagan: { wins: 0, losses: 0, totalPoints: 0 },
  };
  private yahooAPI: YahooFantasyAPIReal | null = null;

  constructor(accessToken?: string) {
    if (accessToken && process.env.YAHOO_CLIENT_ID && process.env.YAHOO_CLIENT_SECRET) {
      this.yahooAPI = new YahooFantasyAPIReal(
        accessToken,
        process.env.YAHOO_CLIENT_ID,
        process.env.YAHOO_CLIENT_SECRET
      );
    }
  }

  async initializeData() {
    if (!this.yahooAPI || !process.env.YAHOO_LEAGUE_ID) {
      console.log('Using mock data - Yahoo API not configured');
      this.initializeMockData();
      return;
    }

    try {
      // Fetch real data from Yahoo API
      const [leagueData, teamsData, currentWeek] = await Promise.all([
        this.yahooAPI.getLeagueData(process.env.YAHOO_LEAGUE_ID),
        this.yahooAPI.getTeams(process.env.YAHOO_LEAGUE_ID),
        this.yahooAPI.getCurrentWeek(process.env.YAHOO_LEAGUE_ID),
      ]);

      // Parse teams and create managers
      this.managers = this.parseTeams(teamsData);

      // Fetch current week matchups
      const matchupsData = await this.yahooAPI.getMatchups(process.env.YAHOO_LEAGUE_ID, currentWeek);
      this.matchups = this.parseMatchups(matchupsData, currentWeek);

      this.calculateStandings();
    } catch (error) {
      console.error('Error fetching Yahoo data, falling back to mock data:', error);
      this.initializeMockData();
    }
  }

  private initializeMockData() {
    // Fallback to mock data if Yahoo API fails
    this.managers = [
      { id: '1', name: 'rice', team: 'lily', yahooTeamId: '1' },
      { id: '2', name: 'microsoft pp', team: 'lily', yahooTeamId: '2' },
      { id: '3', name: 'Myles', team: 'teagan', yahooTeamId: '3' },
      { id: '4', name: 'Scheif Happens', team: 'teagan', yahooTeamId: '4' },
    ];

    this.matchups = [
      {
        id: 'matchup-1',
        week: 1,
        lilyManager: this.managers[0],
        teaganManager: this.managers[2],
        lilyScore: 55,
        teaganScore: 48,
        isCompleted: true,
        winner: 'lily',
      },
      {
        id: 'matchup-2',
        week: 1,
        lilyManager: this.managers[1],
        teaganManager: this.managers[3],
        lilyScore: 64,
        teaganScore: 39,
        isCompleted: true,
        winner: 'lily',
      },
    ];

    this.standings = {
      lily: { wins: 6, losses: 8, totalPoints: 0 },
      teagan: { wins: 8, losses: 6, totalPoints: 0 },
    };
  }

  private parseTeams(teamsData: any): Manager[] {
    // Parse Yahoo teams data and create Manager objects
    const teams = teamsData.fantasy_content.league.teams.team;
    return teams.map((team: any) => ({
      id: team.team_id,
      name: team.name,
      team: TEAM_ASSIGNMENTS[team.name] || 'lily', // Default to lily if not assigned
      yahooTeamId: team.team_id,
    }));
  }

  private parseMatchups(matchupsData: any, week: number): Matchup[] {
    // Parse Yahoo matchups data
    const matchups = matchupsData.fantasy_content.league.scoreboard.matchups.matchup;
    
    return matchups.map((matchup: any, index: number) => {
      const homeTeam = matchup.teams.team[0];
      const awayTeam = matchup.teams.team[1];
      
      const lilyManager = this.managers.find(m => m.yahooTeamId === homeTeam.team_id);
      const teaganManager = this.managers.find(m => m.yahooTeamId === awayTeam.team_id);
      
      if (!lilyManager || !teaganManager) {
        // Fallback to any managers if specific assignment not found
        const lilyManagers = this.managers.filter(m => m.team === 'lily');
        const teaganManagers = this.managers.filter(m => m.team === 'teagan');
        return {
          id: `matchup-${index}`,
          week,
          lilyManager: lilyManagers[index % lilyManagers.length],
          teaganManager: teaganManagers[index % teaganManagers.length],
          lilyScore: parseFloat(homeTeam.team_points.total) || 0,
          teaganScore: parseFloat(awayTeam.team_points.total) || 0,
          isCompleted: matchup.status === 'postevent',
          winner: parseFloat(homeTeam.team_points.total) > parseFloat(awayTeam.team_points.total) ? 'lily' : 'teagan',
        };
      }

      return {
        id: `matchup-${index}`,
        week,
        lilyManager,
        teaganManager,
        lilyScore: parseFloat(homeTeam.team_points.total) || 0,
        teaganScore: parseFloat(awayTeam.team_points.total) || 0,
        isCompleted: matchup.status === 'postevent',
        winner: parseFloat(homeTeam.team_points.total) > parseFloat(awayTeam.team_points.total) ? 'lily' : 'teagan',
      };
    });
  }

  private calculateStandings() {
    // Reset standings
    this.standings = {
      lily: { wins: 0, losses: 0, totalPoints: 0 },
      teagan: { wins: 0, losses: 0, totalPoints: 0 },
    };

    // Calculate wins/losses and total points
    this.matchups.forEach(matchup => {
      if (matchup.isCompleted && matchup.winner) {
        if (matchup.winner === 'lily') {
          this.standings.lily.wins++;
          this.standings.teagan.losses++;
        } else {
          this.standings.teagan.wins++;
          this.standings.lily.losses++;
        }
      }

      // Add points to totals
      this.standings.lily.totalPoints += matchup.lilyScore;
      this.standings.teagan.totalPoints += matchup.teaganScore;
    });
  }

  public getStandings(): Standings {
    return this.standings;
  }

  public getMatchups(): Matchup[] {
    return this.matchups;
  }

  public getManagers(): Manager[] {
    return this.managers;
  }

  public async refreshData() {
    await this.initializeData();
  }
}
