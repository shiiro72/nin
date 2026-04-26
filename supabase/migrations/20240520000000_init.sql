-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  uid TEXT PRIMARY KEY,
  nickname TEXT NOT NULL,
  level INTEGER,
  signature TEXT,
  world_level INTEGER,
  achievements INTEGER,
  abyss_floor INTEGER,
  abyss_chamber INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create characters table
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid TEXT REFERENCES profiles(uid) ON DELETE CASCADE,
  character_id INTEGER NOT NULL,
  level INTEGER NOT NULL,
  constellations INTEGER DEFAULT 0,
  talents JSONB,
  weapon JSONB,
  stats JSONB,
  crit_value DECIMAL(10, 2),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(uid, character_id)
);

-- Create artifacts table
CREATE TABLE IF NOT EXISTS artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_uuid UUID REFERENCES characters(id) ON DELETE CASCADE,
  uid TEXT REFERENCES profiles(uid) ON DELETE CASCADE,
  slot TEXT NOT NULL,
  name TEXT,
  set_name TEXT,
  level INTEGER,
  rarity INTEGER,
  main_stat JSONB,
  sub_stats JSONB,
  crit_value DECIMAL(10, 2),
  UNIQUE(character_uuid, slot)
);

-- Index for leaderboard
CREATE INDEX IF NOT EXISTS idx_characters_crit_value ON characters(crit_value DESC);
