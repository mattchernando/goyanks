/**
 * Pinstripe Lab Dashboard - TypeScript Types
 */

export interface Outing {
  id: string;
  game_id: string;
  pitcher_id: string;
  pitcher_name: string;
  opponent: string | null;
  game_date: string | null;
  is_starter: boolean;
  innings_pitched: number | null;
  earned_runs: number | null;
  hits: number | null;
  walks: number | null;
  strikeouts: number | null;
  pitch_count: number | null;
  whiffs: number | null;
  csw: number | null;
  ai_headline: string | null;
  ai_takeaway: string | null;
  ai_strength: string | null;
  ai_concern: string | null;
  graphic_url: string | null;
  synced_from_pi: boolean;
  created_at: string;
}

export interface Pitcher {
  id: string;
  pitcher_id: string;
  pitcher_name: string;
  handedness: string | null;
  role: string | null;
  created_at: string;
}

export interface Game {
  id: string;
  game_id: string;
  opponent: string | null;
  game_date: string | null;
  home_away: string | null;
  result: string | null;
  created_at: string;
}

export interface QuickStats {
  totalOutings: number;
  avgStrikeouts: number;
  avgEarnedRuns: number;
  avgInningsPitched: number;
}

export type RoleFilter = "all" | "starters" | "bullpen";

export interface TrendDataPoint {
  date: string;
  strikeouts: number;
  earnedRuns: number;
  inningsPitched: number;
  pitcher: string;
}
