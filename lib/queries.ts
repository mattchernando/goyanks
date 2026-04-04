/**
 * Pinstripe Lab Dashboard - Data Access Layer
 * 
 * Server-side functions for fetching data from Supabase.
 * These are used in Server Components for SSR.
 */

import { supabase, isSupabaseConfigured } from "./supabase";
import type { Outing, QuickStats, TrendDataPoint, RoleFilter } from "@/types";

// Mock data for development when Supabase isn't configured
const MOCK_OUTINGS: Outing[] = [
  {
    id: "1",
    game_id: "745012",
    pitcher_id: "543037",
    pitcher_name: "Gerrit Cole",
    opponent: "Toronto Blue Jays",
    game_date: "2026-04-03",
    is_starter: true,
    innings_pitched: 8.0,
    earned_runs: 2,
    hits: 5,
    walks: 0,
    strikeouts: 12,
    pitch_count: 105,
    whiffs: 30,
    csw: 34.2,
    ai_headline: "Cole Fans 12 in Masterpiece",
    ai_takeaway: "Complete game bid falls just short but Cole was untouchable.",
    ai_strength: "Knuckle curve was unhittable with 9 whiffs on 22 thrown.",
    ai_concern: "Pulled after 105 pitches despite cruising.",
    graphic_url: null,
    synced_from_pi: true,
    created_at: "2026-04-03T22:30:00Z",
  },
  {
    id: "2",
    game_id: "745011",
    pitcher_id: "592332",
    pitcher_name: "Nestor Cortes",
    opponent: "Toronto Blue Jays",
    game_date: "2026-04-02",
    is_starter: true,
    innings_pitched: 5.1,
    earned_runs: 2,
    hits: 7,
    walks: 0,
    strikeouts: 5,
    pitch_count: 82,
    whiffs: 14,
    csw: 26.2,
    ai_headline: "Cortes Keeps Jays Off Balance",
    ai_takeaway: "Deception and tempo changes frustrated Toronto hitters.",
    ai_strength: "Zero walks with pinpoint command of the cutter.",
    ai_concern: "Velocity dip in the 5th inning led to hard contact.",
    graphic_url: null,
    synced_from_pi: true,
    created_at: "2026-04-02T22:15:00Z",
  },
  {
    id: "3",
    game_id: "745011",
    pitcher_id: "656605",
    pitcher_name: "Clay Holmes",
    opponent: "Toronto Blue Jays",
    game_date: "2026-04-02",
    is_starter: false,
    innings_pitched: 1.0,
    earned_runs: 0,
    hits: 0,
    walks: 1,
    strikeouts: 2,
    pitch_count: 18,
    whiffs: 5,
    csw: 35.0,
    ai_headline: "Holmes Slams the Door",
    ai_takeaway: "Dominant sinker induced two ground balls and a strikeout.",
    ai_strength: "Sinker averaged 97.8 mph with 72% ground ball rate.",
    ai_concern: "Leadoff walk raised heart rates before settling down.",
    graphic_url: null,
    synced_from_pi: true,
    created_at: "2026-04-02T23:00:00Z",
  },
  {
    id: "4",
    game_id: "745010",
    pitcher_id: "666142",
    pitcher_name: "Luis Gil",
    opponent: "Toronto Blue Jays",
    game_date: "2026-04-01",
    is_starter: true,
    innings_pitched: 7.0,
    earned_runs: 0,
    hits: 3,
    walks: 2,
    strikeouts: 10,
    pitch_count: 95,
    whiffs: 26,
    csw: 33.1,
    ai_headline: "Gil Tosses Gem in Toronto",
    ai_takeaway: "Electric stuff and improved command make Gil look like an ace.",
    ai_strength: "Changeup generated 6 whiffs and held lefties to 0-for-8.",
    ai_concern: "Walk rate still elevated at 2 per 7 innings.",
    graphic_url: null,
    synced_from_pi: true,
    created_at: "2026-04-01T22:00:00Z",
  },
  {
    id: "5",
    game_id: "745003",
    pitcher_id: "656756",
    pitcher_name: "Marcus Stroman",
    opponent: "Boston Red Sox",
    game_date: "2026-03-30",
    is_starter: true,
    innings_pitched: 6.2,
    earned_runs: 2,
    hits: 5,
    walks: 1,
    strikeouts: 6,
    pitch_count: 88,
    whiffs: 18,
    csw: 28.4,
    ai_headline: "Stroman Grinds Out Quality Start",
    ai_takeaway: "Sinker-heavy approach kept the ball on the ground all afternoon.",
    ai_strength: "Ground ball rate of 62% led to three double plays.",
    ai_concern: "Strikeout numbers down, relying heavily on defense.",
    graphic_url: null,
    synced_from_pi: true,
    created_at: "2026-03-30T19:30:00Z",
  },
];

/**
 * Fetch recent outings with optional role filter
 */
export async function getOutings(
  limit: number = 20,
  roleFilter: RoleFilter = "all"
): Promise<Outing[]> {
  try {
    let query = supabase
      .from("outings")
      .select("*")
      .order("game_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (roleFilter === "starters") {
      query = query.eq("is_starter", true);
    } else if (roleFilter === "bullpen") {
      query = query.eq("is_starter", false);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching outings:", error);
      return MOCK_OUTINGS.slice(0, limit);
    }

    if (data && data.length > 0) {
      return data;
    }
    return MOCK_OUTINGS.slice(0, limit);
  } catch (err) {
    console.error("Supabase error:", err);
    return MOCK_OUTINGS.slice(0, limit);
  }
}

/**
 * Fetch the latest outing
 */
export async function getLatestOuting(): Promise<Outing | null> {
  try {
    const { data, error } = await supabase
      .from("outings")
      .select("*")
      .order("game_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching latest outing:", error);
      return MOCK_OUTINGS[0] || null;
    }

    return data || MOCK_OUTINGS[0] || null;
  } catch (err) {
    console.error("Supabase error:", err);
    return MOCK_OUTINGS[0] || null;
  }
}

/**
 * Calculate quick stats from recent outings
 */
export async function getQuickStats(limit: number = 10): Promise<QuickStats> {
  const outings = await getOutings(limit, "all");

  if (outings.length === 0) {
    return {
      totalOutings: 0,
      avgStrikeouts: 0,
      avgEarnedRuns: 0,
      avgInningsPitched: 0,
    };
  }

  const totalK = outings.reduce((sum, o) => sum + (o.strikeouts || 0), 0);
  const totalER = outings.reduce((sum, o) => sum + (o.earned_runs || 0), 0);
  const totalIP = outings.reduce((sum, o) => sum + (o.innings_pitched || 0), 0);

  return {
    totalOutings: outings.length,
    avgStrikeouts: Number((totalK / outings.length).toFixed(1)),
    avgEarnedRuns: Number((totalER / outings.length).toFixed(2)),
    avgInningsPitched: Number((totalIP / outings.length).toFixed(1)),
  };
}

/**
 * Get trend data for charts
 */
export async function getTrendData(limit: number = 10): Promise<TrendDataPoint[]> {
  const outings = await getOutings(limit, "starters");

  return outings
    .filter((o) => o.game_date)
    .map((o) => ({
      date: o.game_date!,
      strikeouts: o.strikeouts || 0,
      earnedRuns: o.earned_runs || 0,
      inningsPitched: o.innings_pitched || 0,
      pitcher: o.pitcher_name,
    }))
    .reverse(); // Chronological order for chart
}

/**
 * Format innings pitched for display (e.g., 6.2 → "6.2")
 */
export function formatIP(ip: number | null): string {
  if (ip === null) return "-";
  return ip.toFixed(1);
}

/**
 * Format date for display
 */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Format full date for display
 */
export function formatFullDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
