// Manager assignments to Team Lily and Team Teagan
// Based on Yahoo team IDs from league 465.l.37256

export const MANAGER_ASSIGNMENTS = {
  // Team Lily
  lily: [
    { yahooTeamId: '1', name: 'Royce', yahooTeamName: 'rice' },
    { yahooTeamId: '9', name: 'Erik', yahooTeamName: 'microsoft powerpoint' },
    { yahooTeamId: '6', name: 'Joel', yahooTeamName: 'Meet the Robertsons' },
    { yahooTeamId: '2', name: 'Chris', yahooTeamName: 'Tkachuk Around and Find Out' },
    { yahooTeamId: '4', name: 'Cole', yahooTeamName: "cole's Super Team" },
    { yahooTeamId: '7', name: 'Marc', yahooTeamName: 'No Regretzkys' },
  ],
  // Team Teagan
  teagan: [
    { yahooTeamId: '3', name: 'Andre', yahooTeamName: 'Coach Reilly' },
    { yahooTeamId: '5', name: 'travis', yahooTeamName: 'The Bratt Pack' },
    { yahooTeamId: '8', name: 'Stefan', yahooTeamName: 'Team2Cream2' },
    { yahooTeamId: '10', name: 'Myles', yahooTeamName: 'tHot Dogs' },
    { yahooTeamId: '11', name: 'jeff', yahooTeamName: 'Resting Mitch Face' },
    { yahooTeamId: '12', name: 'Bud', yahooTeamName: 'Scheife Happens' },
  ],
} as const;

export type Team = 'lily' | 'teagan';

export function getTeamForManager(yahooTeamId: string): Team | null {
  const isLily = MANAGER_ASSIGNMENTS.lily.some(m => m.yahooTeamId === yahooTeamId);
  if (isLily) return 'lily';
  
  const isTeagan = MANAGER_ASSIGNMENTS.teagan.some(m => m.yahooTeamId === yahooTeamId);
  if (isTeagan) return 'teagan';
  
  return null;
}

export function getAllManagers() {
  return {
    lily: MANAGER_ASSIGNMENTS.lily,
    teagan: MANAGER_ASSIGNMENTS.teagan,
  };
}

