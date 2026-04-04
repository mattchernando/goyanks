-- ============================================================================
-- Pinstripe Lab Dashboard - Supabase Schema Migration
-- ============================================================================
-- Run this in your Supabase SQL Editor or via CLI
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PITCHERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS pitchers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pitcher_id      TEXT UNIQUE NOT NULL,
    pitcher_name    TEXT NOT NULL,
    handedness      TEXT,
    role            TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE pitchers IS 'Yankees pitchers roster for reference';
COMMENT ON COLUMN pitchers.pitcher_id IS 'MLB Stats API pitcher ID';
COMMENT ON COLUMN pitchers.handedness IS 'L or R';
COMMENT ON COLUMN pitchers.role IS 'starter or reliever';

-- ============================================================================
-- GAMES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS games (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id         TEXT UNIQUE NOT NULL,
    opponent        TEXT,
    game_date       DATE,
    home_away       TEXT,
    result          TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE games IS 'Yankees games for reference';
COMMENT ON COLUMN games.game_id IS 'MLB Stats API game PK';
COMMENT ON COLUMN games.home_away IS 'home or away';
COMMENT ON COLUMN games.result IS 'W, L, or null if not final';

-- ============================================================================
-- OUTINGS TABLE (main data table)
-- ============================================================================
CREATE TABLE IF NOT EXISTS outings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id         TEXT NOT NULL,
    pitcher_id      TEXT NOT NULL,
    pitcher_name    TEXT NOT NULL,
    opponent        TEXT,
    game_date       DATE,
    is_starter      BOOLEAN DEFAULT FALSE,
    innings_pitched NUMERIC(4,1),
    earned_runs     INTEGER,
    hits            INTEGER,
    walks           INTEGER,
    strikeouts      INTEGER,
    pitch_count     INTEGER,
    whiffs          INTEGER,
    csw             NUMERIC(5,2),
    ai_headline     TEXT,
    ai_takeaway     TEXT,
    ai_strength     TEXT,
    ai_concern      TEXT,
    graphic_url     TEXT,
    synced_from_pi  BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraint to prevent duplicates
    CONSTRAINT unique_game_pitcher UNIQUE (game_id, pitcher_id)
);

COMMENT ON TABLE outings IS 'Individual pitcher outings with AI analysis';
COMMENT ON COLUMN outings.csw IS 'Called strikes + whiffs percentage';
COMMENT ON COLUMN outings.graphic_url IS 'URL to graphic in Supabase Storage';
COMMENT ON COLUMN outings.synced_from_pi IS 'True if synced from Raspberry Pi';

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_outings_game_date ON outings (game_date DESC);
CREATE INDEX IF NOT EXISTS idx_outings_pitcher_name ON outings (pitcher_name);
CREATE INDEX IF NOT EXISTS idx_outings_pitcher_id ON outings (pitcher_id);
CREATE INDEX IF NOT EXISTS idx_outings_is_starter ON outings (is_starter);
CREATE INDEX IF NOT EXISTS idx_outings_created_at ON outings (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pitchers_pitcher_id ON pitchers (pitcher_id);
CREATE INDEX IF NOT EXISTS idx_games_game_id ON games (game_id);
CREATE INDEX IF NOT EXISTS idx_games_game_date ON games (game_date DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE pitchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE outings ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (dashboard is public)
CREATE POLICY "Public read access for pitchers"
    ON pitchers FOR SELECT
    USING (true);

CREATE POLICY "Public read access for games"
    ON games FOR SELECT
    USING (true);

CREATE POLICY "Public read access for outings"
    ON outings FOR SELECT
    USING (true);

-- Service role only for writes (Pi ingestion uses service role key)
CREATE POLICY "Service role insert for pitchers"
    ON pitchers FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role update for pitchers"
    ON pitchers FOR UPDATE
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role insert for games"
    ON games FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role update for games"
    ON games FOR UPDATE
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role insert for outings"
    ON outings FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role update for outings"
    ON outings FOR UPDATE
    USING (auth.role() = 'service_role');

-- ============================================================================
-- STORAGE BUCKET SETUP (run separately in Supabase dashboard or via API)
-- ============================================================================
-- 1. Create bucket named: outing-graphics
-- 2. Set bucket to public for read access
-- 3. Service role has full access by default

-- Note: Storage bucket creation via SQL is not supported.
-- Create the bucket manually in Supabase Dashboard > Storage > New Bucket
-- Name: outing-graphics
-- Public: Yes (for MVP)
