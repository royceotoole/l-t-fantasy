import { Manager, Matchup, TeamScore, WeeklyStandings, YahooLeagueData } from '@/types';

export class DataManager {
  private managers: Manager[] = [];
  private matchups: Matchup[] = [];
  private currentWeek: number = 1;

  constructor() {
    this.loadFromStorage();
  }

  // Team assignment methods
  assignManagerToTeam(managerId: string, team: 'lily' | 'teagan'): void {
    const manager = this.managers.find(m => m.id === managerId);
    if (manager) {
      manager.team = team;
      this.saveToStorage();
    }
  }

  getManagersByTeam(team: 'lily' | 'teagan'): Manager[] {
    return this.managers.filter(m => m.team === team);
  }

  // Scoring methods
  calculateTeamScores(): { lily: TeamScore; teagan: TeamScore } {
    const lilyWins = this.calculateTeamWins('lily');
    const teaganWins = this.calculateTeamWins('teagan');
    const totalGames = lilyWins + teaganWins;

    return {
      lily: {
        team: 'lily',
        totalWins: lilyWins,
        totalLosses: teaganWins,
        winPercentage: totalGames > 0 ? lilyWins / totalGames : 0,
      },
      teagan: {
        team: 'teagan',
        totalWins: teaganWins,
        totalLosses: lilyWins,
        winPercentage: totalGames > 0 ? teaganWins / totalGames : 0,
      },
    };
  }

  private calculateTeamWins(team: 'lily' | 'teagan'): number {
    return this.matchups.reduce((wins, matchup) => {
      if (!matchup.isComplete) return wins;
      
      const teamManager = matchup.manager1.team === team ? matchup.manager1 : matchup.manager2;
      const opponentManager = matchup.manager1.team === team ? matchup.manager2 : matchup.manager1;
      
      const teamScore = matchup.manager1.team === team ? matchup.manager1Score : matchup.manager2Score;
      const opponentScore = matchup.manager1.team === team ? matchup.manager2Score : matchup.manager1Score;
      
      return teamScore > opponentScore ? wins + 1 : wins;
    }, 0);
  }

  // Weekly standings
  getWeeklyStandings(week: number): WeeklyStandings {
    const weekMatchups = this.matchups.filter(m => m.week === week);
    const lilyWins = weekMatchups.reduce((wins, matchup) => {
      if (!matchup.isComplete) return wins;
      
      const lilyManager = matchup.manager1.team === 'lily' ? matchup.manager1 : matchup.manager2;
      const lilyScore = matchup.manager1.team === 'lily' ? matchup.manager1Score : matchup.manager2Score;
      const opponentScore = matchup.manager1.team === 'lily' ? matchup.manager2Score : matchup.manager1Score;
      
      return lilyScore > opponentScore ? wins + 1 : wins;
    }, 0);

    const teaganWins = weekMatchups.length - lilyWins;

    return {
      week,
      lilyWins,
      teaganWins,
      matchups: weekMatchups,
    };
  }

  // Data synchronization
  updateFromYahooData(yahooData: YahooLeagueData): void {
    this.managers = yahooData.managers;
    this.currentWeek = yahooData.currentWeek;
    
    // Update existing matchups or add new ones
    yahooData.matchups.forEach(newMatchup => {
      const existingIndex = this.matchups.findIndex(m => m.id === newMatchup.id);
      if (existingIndex >= 0) {
        this.matchups[existingIndex] = newMatchup;
      } else {
        this.matchups.push(newMatchup);
      }
    });

    // For mock data, set up some initial team assignments
    if (this.managers.length > 0 && this.managers[0].team === 'lily') {
      // Mock data already has team assignments, keep them
    } else {
      // Assign teams based on mock data
      this.managers.forEach(manager => {
        if (manager.yahooTeamName === 'rice' || manager.yahooTeamName === 'microsoft pp') {
          manager.team = 'lily';
        } else if (manager.yahooTeamName === 'Myles' || manager.yahooTeamName === 'Scheif Happens') {
          manager.team = 'teagan';
        }
      });
    }

    this.saveToStorage();
  }

  // Storage methods
  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fantasy-data', JSON.stringify({
        managers: this.managers,
        matchups: this.matchups,
        currentWeek: this.currentWeek,
      }));
    }
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('fantasy-data');
      if (stored) {
        const data = JSON.parse(stored);
        this.managers = data.managers || [];
        this.matchups = data.matchups || [];
        this.currentWeek = data.currentWeek || 1;
      }
    }
  }

  // Getters
  getAllManagers(): Manager[] {
    return this.managers;
  }

  getAllMatchups(): Matchup[] {
    return this.matchups;
  }

  getCurrentWeek(): number {
    return this.currentWeek;
  }

  getCurrentWeekMatchups(): Matchup[] {
    return this.matchups.filter(m => m.week === this.currentWeek);
  }
}
