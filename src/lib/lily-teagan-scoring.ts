// Calculate Lily vs Teagan scores from Yahoo Fantasy matchups

import { getTeamForManager, getAllManagers, Team } from './manager-assignments';

export interface MatchupResult {
  week: number;
  manager1: {
    yahooTeamId: string;
    name: string;
    team: Team | null;
    points: number;
  };
  manager2: {
    yahooTeamId: string;
    name: string;
    team: Team | null;
    points: number;
  };
  winner: Team | null;
  isTie: boolean;
}

export interface TeamScore {
  team: Team;
  totalWins: number;
  managers: ReadonlyArray<{
    readonly yahooTeamId: string;
    readonly name: string;
    readonly yahooTeamName: string;
  }>;
}

export interface WeeklyScore {
  week: number;
  lilyWins: number;
  teaganWins: number;
  ties: number;
  matchups: MatchupResult[];
}

/**
 * Calculate which team (Lily or Teagan) won a matchup
 */
export function calculateMatchupWinner(
  yahooMatchup: {
    teams: {
      team_id: string;
      name: string;
      team_points: { total: string };
    }[];
  }
): MatchupResult | null {
  const team1 = yahooMatchup.teams[0];
  const team2 = yahooMatchup.teams[1];
  
  const team1Id = team1.team_id;
  const team2Id = team2.team_id;
  
  const team1Points = parseFloat(team1.team_points.total) || 0;
  const team2Points = parseFloat(team2.team_points.total) || 0;
  
  const team1Side = getTeamForManager(team1Id);
  const team2Side = getTeamForManager(team2Id);
  
  // Determine winner
  let winner: Team | null = null;
  let isTie = false;
  
  if (team1Points > team2Points && team1Side) {
    winner = team1Side;
  } else if (team2Points > team1Points && team2Side) {
    winner = team2Side;
  } else if (team1Points === team2Points) {
    isTie = true;
  }
  
  return {
    week: 0, // Will be set by caller
    manager1: {
      yahooTeamId: team1Id,
      name: team1.name,
      team: team1Side,
      points: team1Points,
    },
    manager2: {
      yahooTeamId: team2Id,
      name: team2.name,
      team: team2Side,
      points: team2Points,
    },
    winner,
    isTie,
  };
}

/**
 * Calculate total scores for Lily and Teagan
 */
export function calculateTotalScores(allMatchups: MatchupResult[]): {
  lily: TeamScore;
  teagan: TeamScore;
} {
  let lilyWins = 0;
  let teaganWins = 0;
  
  for (const matchup of allMatchups) {
    if (matchup.winner === 'lily') {
      lilyWins++;
    } else if (matchup.winner === 'teagan') {
      teaganWins++;
    }
  }
  
  const managers = getAllManagers();
  
  return {
    lily: {
      team: 'lily',
      totalWins: lilyWins,
      managers: managers.lily,
    },
    teagan: {
      team: 'teagan',
      totalWins: teaganWins,
      managers: managers.teagan,
    },
  };
}

/**
 * Calculate weekly scores
 */
export function calculateWeeklyScores(matchupsByWeek: Record<number, MatchupResult[]>): WeeklyScore[] {
  const weeks: WeeklyScore[] = [];
  
  for (const [weekNum, matchups] of Object.entries(matchupsByWeek)) {
    let lilyWins = 0;
    let teaganWins = 0;
    let ties = 0;
    
    for (const matchup of matchups) {
      if (matchup.winner === 'lily') {
        lilyWins++;
      } else if (matchup.winner === 'teagan') {
        teaganWins++;
      } else if (matchup.isTie) {
        ties++;
      }
    }
    
    weeks.push({
      week: parseInt(weekNum),
      lilyWins,
      teaganWins,
      ties,
      matchups,
    });
  }
  
  return weeks.sort((a, b) => b.week - a.week); // Most recent first
}

