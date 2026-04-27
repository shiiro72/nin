import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.NEXT_SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const isConfigured = supabaseUrl && supabaseAnonKey;

if (!isConfigured) {
  console.error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in your .env file.');
}

// For client-side: read-only
// We provide a fallback 'placeholder' key if missing to avoid immediate crash on initialization,
// but it will fail on actual requests with a better error from the server/client.
// However, createClient checks for key presence.
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder');

// For server-side: privileged operations (upsert)
const adminKey = supabaseServiceKey || supabaseAnonKey;
export const supabaseAdmin = (supabaseUrl && adminKey)
  ? createClient(supabaseUrl, adminKey)
  : supabase;

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
  icon?: string;
}
