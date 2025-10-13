// Yahoo OAuth helper using refresh token approach

export interface YahooTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

/**
 * Refreshes the access token using the stored refresh token
 */
export async function refreshAccessToken(): Promise<string> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: process.env.YAHOO_REFRESH_TOKEN!,
  });

  const res = await fetch('https://api.login.yahoo.com/oauth2/get_token', {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(
          `${process.env.YAHOO_CLIENT_ID}:${process.env.YAHOO_CLIENT_SECRET}`
        ).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Token refresh failed:', errorText);
    throw new Error(`Token refresh failed: ${errorText}`);
  }

  const json = (await res.json()) as YahooTokens;
  return json.access_token;
}

/**
 * Makes an authenticated request to Yahoo Fantasy API
 * Automatically appends format=json to get JSON instead of XML
 */
export async function yahooFetch(path: string): Promise<unknown> {
  const access = await refreshAccessToken();
  const separator = path.includes('?') ? '&' : '?';
  const url = `https://fantasysports.yahooapis.com${path}${separator}format=json`;

  console.log('Yahoo API Request:', url);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${access}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Yahoo API request failed:', errorText);
    throw new Error(`Yahoo API request failed: ${errorText}`);
  }

  return res.json();
}

/**
 * Discovers the NHL game key for the logged-in user
 * This ensures we're looking at Hockey, not Baseball or any other sport
 */
export async function findNhlGameKey(): Promise<string> {
  const games = await yahooFetch('/fantasy/v2/users;use_login=1/games');
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gamesData = games as any;
  const user = gamesData?.fantasy_content?.users?.[0]?.user;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gameArr = user?.[1]?.games?.[0]?.game || [];
  
  console.log('Available games:', JSON.stringify(gameArr, null, 2));
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nhlGame = gameArr.find((g: any) => g?.[0]?.game?.[0]?.code === 'nhl');
  
  if (!nhlGame) {
    throw new Error('Could not find NHL game for this account. Available games: ' + 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      gameArr.map((g: any) => g?.[0]?.game?.[0]?.code).join(', '));
  }
  
  const nhlGameKey = nhlGame?.[0]?.game?.[0]?.game_key;
  console.log('Found NHL game key:', nhlGameKey);
  
  return nhlGameKey;
}

/**
 * Finds the NHL league key for the logged-in user
 * Returns the full league key in format: game_key.l.league_id
 */
export async function findNhlLeagueKey(gameKey?: string): Promise<string> {
  const nhlGameKey = gameKey || await findNhlGameKey();
  
  const leagues = await yahooFetch(
    `/fantasy/v2/users;use_login=1/games;game_keys=${nhlGameKey}/leagues`
  );
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leaguesData = leagues as any;
  const leagueNode = leaguesData?.fantasy_content?.users?.[0]?.user?.[1]?.games?.[0]?.game?.[1]?.leagues?.[0]?.league?.[0];
  const leagueKey = leagueNode?.league_key;
  
  console.log('Found NHL league key:', leagueKey);
  
  if (!leagueKey) {
    throw new Error('No NHL leagues found for this account.');
  }
  
  return leagueKey;
}

/**
 * Gets the full NHL league key, preferring env variable if set
 */
export async function ensureNhlLeagueKey(): Promise<string> {
  // First, check if we have it hard-coded in env (format: 427.l.37256)
  if (process.env.NHL_LEAGUE_KEY) {
    console.log('Using NHL_LEAGUE_KEY from env:', process.env.NHL_LEAGUE_KEY);
    return process.env.NHL_LEAGUE_KEY;
  }
  
  // Otherwise, discover it
  console.log('NHL_LEAGUE_KEY not in env, discovering...');
  return await findNhlLeagueKey();
}

