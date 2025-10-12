export interface Manager {
  id: string;
  name: string;
  team: 'lily' | 'teagan';
  yahooTeamId: string;
  yahooTeamName: string;
}

export interface Matchup {
  id: string;
  week: number;
  manager1: Manager;
  manager2: Manager;
  manager1Score: number;
  manager2Score: number;
  isComplete: boolean;
  date: string;
}

export interface TeamScore {
  team: 'lily' | 'teagan';
  totalWins: number;
  totalLosses: number;
  winPercentage: number;
}

export interface WeeklyStandings {
  week: number;
  lilyWins: number;
  teaganWins: number;
  matchups: Matchup[];
}

export interface YahooLeagueData {
  leagueId: string;
  leagueName: string;
  managers: Manager[];
  currentWeek: number;
  matchups: Matchup[];
}
