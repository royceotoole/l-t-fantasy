import { Manager, Matchup, Standings, YahooLeagueData } from '@/types';
import { mockYahooData } from './yahoo-api';

// Team assignments - you can modify these based on your league
const TEAM_ASSIGNMENTS: Record<string, 'lily' | 'teagan'> = {
  'rice': 'lily',
  'microsoft pp': 'lily',
  'Myles': 'teagan',
  'Scheif Happens': 'teagan',
};

export class DataManager {
  private managers: Manager[] = [];
  private matchups: Matchup[] = [];
  private standings: Standings = {
    lily: { wins: 0, losses: 0, totalPoints: 0 },
    teagan: { wins: 0, losses: 0, totalPoints: 0 },
  };

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize managers from Yahoo data
    this.managers = mockYahooData.teams.map(team => ({
      id: team.teamId,
      name: team.name,
      team: TEAM_ASSIGNMENTS[team.name] || 'lily', // Default to lily if not assigned
      yahooTeamId: team.teamId,
    }));

    // Initialize matchups
    this.matchups = mockYahooData.matchups.map((matchup, index) => {
      const lilyManager = this.managers.find(m => m.team === 'lily' && m.yahooTeamId === matchup.homeTeam.teamId);
      const teaganManager = this.managers.find(m => m.team === 'teagan' && m.yahooTeamId === matchup.awayTeam.teamId);
      
      if (!lilyManager || !teaganManager) {
        // Fallback to any managers if specific assignment not found
        const lilyManagers = this.managers.filter(m => m.team === 'lily');
        const teaganManagers = this.managers.filter(m => m.team === 'teagan');
        return {
          id: `matchup-${index}`,
          week: matchup.week,
          lilyManager: lilyManagers[index % lilyManagers.length],
          teaganManager: teaganManagers[index % teaganManagers.length],
          lilyScore: matchup.homeTeam.score,
          teaganScore: matchup.awayTeam.score,
          isCompleted: true,
          winner: matchup.homeTeam.score > matchup.awayTeam.score ? 'lily' : 'teagan',
        };
      }

      return {
        id: `matchup-${index}`,
        week: matchup.week,
        lilyManager,
        teaganManager,
        lilyScore: matchup.homeTeam.score,
        teaganScore: matchup.awayTeam.score,
        isCompleted: true,
        winner: matchup.homeTeam.score > matchup.awayTeam.score ? 'lily' : 'teagan',
      };
    });

    this.calculateStandings();
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

  public updateMatchupScores(week: number, newScores: { lilyScore: number; teaganScore: number }[]) {
    const weekMatchups = this.matchups.filter(m => m.week === week);
    
    weekMatchups.forEach((matchup, index) => {
      if (newScores[index]) {
        matchup.lilyScore = newScores[index].lilyScore;
        matchup.teaganScore = newScores[index].teaganScore;
        matchup.winner = matchup.lilyScore > matchup.teaganScore ? 'lily' : 'teagan';
      }
    });

    this.calculateStandings();
  }

  public resetWeeklyMatchups(newWeek: number) {
    // This would typically fetch new matchups from Yahoo API
    // For now, we'll just update the week number
    this.matchups.forEach(matchup => {
      matchup.week = newWeek;
      matchup.isCompleted = false;
      matchup.winner = undefined;
      matchup.lilyScore = 0;
      matchup.teaganScore = 0;
    });

    this.calculateStandings();
  }
}

// Singleton instance
export const dataManager = new DataManager();
