export interface Manager {
  id: string;
  name: string;
  team: 'lily' | 'teagan';
  yahooTeamId: string;
}

export interface Matchup {
  id: string;
  week: number;
  lilyManager: Manager;
  teaganManager: Manager;
  lilyScore: number;
  teaganScore: number;
  isCompleted: boolean;
  winner?: 'lily' | 'teagan';
}

export interface Standings {
  lily: {
    wins: number;
    losses: number;
    totalPoints: number;
  };
  teagan: {
    wins: number;
    losses: number;
    totalPoints: number;
  };
}

export interface YahooLeagueData {
  leagueId: string;
  season: string;
  week: number;
  teams: YahooTeam[];
  matchups: YahooMatchup[];
}

export interface YahooTeam {
  teamId: string;
  name: string;
  manager: string;
}

export interface YahooMatchup {
  week: number;
  homeTeam: {
    teamId: string;
    score: number;
  };
  awayTeam: {
    teamId: string;
    score: number;
  };
}
