import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const supabaseServiceKey = process.env.NEXT_SUPABASE_SECRET_KEY || '';

// For client-side: read-only
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-side: privileged operations (upsert)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export interface Profile {
  uid: string;
  nickname: string;
  level: number;
  signature?: string;
  world_level?: number;
  achievements?: number;
  abyss_floor?: number;
  abyss_chamber?: number;
  updated_at?: string;
}

export interface Character {
  id: string;
  uid: string;
  character_id: number;
  level: number;
  constellations: number;
  talents: Record<string, number>;
  weapon: {
    name: string;
    icon?: string;
    level: number;
    refinement: number;
    rarity: number;
  } | null;
  stats: Record<string, number>;
  crit_value: number;
  updated_at: string;
  profiles?: Profile;
  artifacts?: Artifact[];
}

export interface Artifact {
  id: string;
  character_uuid: string;
  uid: string;
  slot: string;
  name: string;
  set_name: string;
  level: number;
  rarity: number;
  main_stat: {
    type: string;
    value: number;
  };
  sub_stats: {
    type: string;
    value: number;
  }[];
  crit_value: number;
}
