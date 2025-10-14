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

export interface ManagerRecord {
  yahooTeamId: string;
  wins: number;
  losses: number;
  ties: number;
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
  
  // Round to 2 decimal places to handle floating point precision issues
  const team1Rounded = Math.round(team1Points * 100) / 100;
  const team2Rounded = Math.round(team2Points * 100) / 100;
  
  const team1Side = getTeamForManager(team1Id);
  const team2Side = getTeamForManager(team2Id);
  
  // Determine winner
  let winner: Team | null = null;
  let isTie = false;
  
  if (team1Rounded > team2Rounded && team1Side) {
    winner = team1Side;
  } else if (team2Rounded > team1Rounded && team2Side) {
    winner = team2Side;
  } else if (team1Rounded === team2Rounded) {
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
 * Each manager contributes: 1 point for win, 0.5 for tie, 0 for loss
 */
export function calculateTotalScores(allMatchups: MatchupResult[]): {
  lily: TeamScore;
  teagan: TeamScore;
} {
  let lilyScore = 0;
  let teaganScore = 0;
  
  for (const matchup of allMatchups) {
    const team1 = matchup.manager1.team;
    const team2 = matchup.manager2.team;
    
    if (matchup.isTie) {
      // Each manager gets 0.5 points for a tie
      if (team1 === 'lily') lilyScore += 0.5;
      else if (team1 === 'teagan') teaganScore += 0.5;
      
      if (team2 === 'lily') lilyScore += 0.5;
      else if (team2 === 'teagan') teaganScore += 0.5;
    } else {
      // Winner gets 1 point, loser gets 0
      if (matchup.manager1.points > matchup.manager2.points) {
        if (team1 === 'lily') lilyScore += 1;
        else if (team1 === 'teagan') teaganScore += 1;
      } else {
        if (team2 === 'lily') lilyScore += 1;
        else if (team2 === 'teagan') teaganScore += 1;
      }
    }
  }
  
  const managers = getAllManagers();
  
  return {
    lily: {
      team: 'lily',
      totalWins: lilyScore,
      managers: managers.lily,
    },
    teagan: {
      team: 'teagan',
      totalWins: teaganScore,
      managers: managers.teagan,
    },
  };
}

/**
 * Calculate weekly scores
 * Each manager contributes: 1 point for win, 0.5 for tie, 0 for loss
 */
export function calculateWeeklyScores(matchupsByWeek: Record<number, MatchupResult[]>): WeeklyScore[] {
  const weeks: WeeklyScore[] = [];
  
  for (const [weekNum, matchups] of Object.entries(matchupsByWeek)) {
    let lilyScore = 0;
    let teaganScore = 0;
    let ties = 0;
    
    for (const matchup of matchups) {
      const team1 = matchup.manager1.team;
      const team2 = matchup.manager2.team;
      
      if (matchup.isTie) {
        ties++;
        // Each manager gets 0.5 points for a tie
        if (team1 === 'lily') lilyScore += 0.5;
        else if (team1 === 'teagan') teaganScore += 0.5;
        
        if (team2 === 'lily') lilyScore += 0.5;
        else if (team2 === 'teagan') teaganScore += 0.5;
      } else {
        // Winner gets 1 point, loser gets 0
        if (matchup.manager1.points > matchup.manager2.points) {
          if (team1 === 'lily') lilyScore += 1;
          else if (team1 === 'teagan') teaganScore += 1;
        } else {
          if (team2 === 'lily') lilyScore += 1;
          else if (team2 === 'teagan') teaganScore += 1;
        }
      }
    }
    
    weeks.push({
      week: parseInt(weekNum),
      lilyWins: lilyScore,
      teaganWins: teaganScore,
      ties,
      matchups,
    });
  }
  
  return weeks.sort((a, b) => b.week - a.week); // Most recent first
}

/**
 * Calculate individual manager records (W-L-T)
 */
export function calculateManagerRecords(allMatchups: MatchupResult[]): Record<string, ManagerRecord> {
  const records: Record<string, ManagerRecord> = {};
  
  // Initialize records for all managers
  const managers = getAllManagers();
  [...managers.lily, ...managers.teagan].forEach(manager => {
    records[manager.yahooTeamId] = {
      yahooTeamId: manager.yahooTeamId,
      wins: 0,
      losses: 0,
      ties: 0,
    };
  });
  
  // Count wins/losses/ties for each manager
  for (const matchup of allMatchups) {
    const team1Id = matchup.manager1.yahooTeamId;
    const team2Id = matchup.manager2.yahooTeamId;
    
    if (matchup.isTie) {
      records[team1Id].ties++;
      records[team2Id].ties++;
    } else if (matchup.manager1.points > matchup.manager2.points) {
      records[team1Id].wins++;
      records[team2Id].losses++;
    } else {
      records[team2Id].wins++;
      records[team1Id].losses++;
    }
  }
  
  return records;
}

