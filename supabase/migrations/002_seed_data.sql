-- ============================================================================
-- Pinstripe Lab Dashboard - Sample Seed Data
-- ============================================================================
-- Run this after 001_create_tables.sql to populate with sample data
-- This allows the dashboard to render nicely before live sync is connected
-- ============================================================================

-- Sample pitchers
INSERT INTO pitchers (pitcher_id, pitcher_name, handedness, role) VALUES
    ('543037', 'Gerrit Cole', 'R', 'starter'),
    ('622663', 'Carlos Rodón', 'L', 'starter'),
    ('656756', 'Marcus Stroman', 'R', 'starter'),
    ('666142', 'Luis Gil', 'R', 'starter'),
    ('592332', 'Nestor Cortes', 'L', 'starter'),
    ('656605', 'Clay Holmes', 'R', 'reliever'),
    ('656849', 'Jonathan Loáisiga', 'R', 'reliever'),
    ('665795', 'Michael King', 'R', 'reliever'),
    ('676710', 'Ron Marinaccio', 'R', 'reliever'),
    ('686613', 'Luke Weaver', 'R', 'reliever')
ON CONFLICT (pitcher_id) DO NOTHING;

-- Sample games
INSERT INTO games (game_id, opponent, game_date, home_away, result) VALUES
    ('745001', 'Boston Red Sox', '2026-03-28', 'home', 'W'),
    ('745002', 'Boston Red Sox', '2026-03-29', 'home', 'L'),
    ('745003', 'Boston Red Sox', '2026-03-30', 'home', 'W'),
    ('745010', 'Toronto Blue Jays', '2026-04-01', 'away', 'W'),
    ('745011', 'Toronto Blue Jays', '2026-04-02', 'away', 'W'),
    ('745012', 'Toronto Blue Jays', '2026-04-03', 'away', 'L')
ON CONFLICT (game_id) DO NOTHING;

-- Sample outings with AI analysis
INSERT INTO outings (
    game_id, pitcher_id, pitcher_name, opponent, game_date, is_starter,
    innings_pitched, earned_runs, hits, walks, strikeouts, pitch_count,
    whiffs, csw, ai_headline, ai_takeaway, ai_strength, ai_concern, graphic_url
) VALUES
    -- Gerrit Cole - dominant start
    ('745001', '543037', 'Gerrit Cole', 'Boston Red Sox', '2026-03-28', true,
     7.0, 1, 4, 1, 11, 98,
     28, 32.5,
     'Cole Dominates in Season Opener',
     'Vintage Cole performance with elite command and swing-and-miss stuff.',
     'Fastball velocity averaged 97.2 mph with 11 whiffs on the four-seam.',
     'Pitch count crept up in the 6th, limiting him to 7 innings.',
     NULL),
    
    -- Carlos Rodón - solid outing
    ('745002', '622663', 'Carlos Rodón', 'Boston Red Sox', '2026-03-29', true,
     6.0, 3, 6, 2, 8, 92,
     22, 29.8,
     'Rodón Battles Through Six',
     'Gutsy performance despite elevated pitch count and traffic on bases.',
     'Slider was devastating with 8 whiffs on 24 thrown.',
     'Fastball command wavered in the 4th, leading to a 2-run double.',
     NULL),
    
    -- Marcus Stroman - quality start
    ('745003', '656756', 'Marcus Stroman', 'Boston Red Sox', '2026-03-30', true,
     6.2, 2, 5, 1, 6, 88,
     18, 28.4,
     'Stroman Grinds Out Quality Start',
     'Sinker-heavy approach kept the ball on the ground all afternoon.',
     'Ground ball rate of 62% led to three double plays.',
     'Strikeout numbers down, relying heavily on defense.',
     NULL),
    
    -- Luis Gil - breakout
    ('745010', '666142', 'Luis Gil', 'Toronto Blue Jays', '2026-04-01', true,
     7.0, 0, 3, 2, 10, 95,
     26, 33.1,
     'Gil Tosses Gem in Toronto',
     'Electric stuff and improved command make Gil look like an ace.',
     'Changeup generated 6 whiffs and held lefties to 0-for-8.',
     'Walk rate still elevated at 2 per 7 innings.',
     NULL),
    
    -- Nestor Cortes - crafty lefty
    ('745011', '592332', 'Nestor Cortes', 'Toronto Blue Jays', '2026-04-02', true,
     5.1, 2, 7, 0, 5, 82,
     14, 26.2,
     'Cortes Keeps Jays Off Balance',
     'Deception and tempo changes frustrated Toronto hitters.',
     'Zero walks with pinpoint command of the cutter.',
     'Velocity dip in the 5th inning led to hard contact.',
     NULL),
    
    -- Clay Holmes - save situation
    ('745011', '656605', 'Clay Holmes', 'Toronto Blue Jays', '2026-04-02', false,
     1.0, 0, 0, 1, 2, 18,
     5, 35.0,
     'Holmes Slams the Door',
     'Dominant sinker induced two ground balls and a strikeout.',
     'Sinker averaged 97.8 mph with 72% ground ball rate.',
     'Leadoff walk raised heart rates before settling down.',
     NULL),
    
    -- Gerrit Cole - another gem
    ('745012', '543037', 'Gerrit Cole', 'Toronto Blue Jays', '2026-04-03', true,
     8.0, 2, 5, 0, 12, 105,
     30, 34.2,
     'Cole Fans 12 in Masterpiece',
     'Complete game bid falls just short but Cole was untouchable.',
     'Knuckle curve was unhittable with 9 whiffs on 22 thrown.',
     'Pulled after 105 pitches despite cruising.',
     NULL),
    
    -- Jonathan Loáisiga - relief appearance
    ('745012', '656849', 'Jonathan Loáisiga', 'Toronto Blue Jays', '2026-04-03', false,
     1.0, 1, 2, 0, 1, 15,
     3, 28.0,
     'Loáisiga Gives Up Late Run',
     'Inherited a clean slate but allowed two hits and a run.',
     'Sinker velocity back up to 98 mph.',
     'Gave up a double on a hanging slider.',
     NULL)
ON CONFLICT (game_id, pitcher_id) DO NOTHING;
