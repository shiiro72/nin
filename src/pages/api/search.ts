import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchEnkaData, parseCharacterData } from '../../lib/enka';
import { supabaseAdmin } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { uid: input } = req.body;

  if (!input || typeof input !== 'string') {
    return res.status(400).json({ message: 'UID or Username is required' });
  }

  let uid = input;

  // Check if input is likely a username (not just digits)
  if (!/^\d+$/.test(input)) {
    // Try to find the UID from the profiles table based on nickname
    const { data: profile, error: profileSearchError } = await supabaseAdmin
      .from('profiles')
      .select('uid')
      .ilike('nickname', `%${input}%`)
      .limit(1)
      .single();

    if (profileSearchError || !profile) {
      return res.status(404).json({ message: 'User not found in our database. Please search by UID first.' });
    }
    uid = profile.uid;
  }

  try {
    const data = await fetchEnkaData(uid);

    // Upsert Profile
    const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
      uid: data.uid,
      nickname: data.playerInfo.nickname,
      level: data.playerInfo.level,
      signature: data.playerInfo.signature,
      world_level: data.playerInfo.worldLevel,
      achievements: data.playerInfo.finishAchievementNum,
      abyss_floor: data.playerInfo.towerFloorIndex,
      abyss_chamber: data.playerInfo.towerLevelIndex,
      updated_at: new Date().toISOString(),
    });

    if (profileError) throw profileError;

    if (data.avatarInfoList) {
      for (const avatarInfo of data.avatarInfoList) {
        const parsed = parseCharacterData(avatarInfo);

        // Calculate total crit value for the character (sum of artifacts CV)
        let totalCV = 0;
        const artifactsWithCV = parsed.artifacts.map((art) => {
          let cv = 0;
          art.subStats.forEach((sub: { type: string; value: number }) => {
            if (sub.type === 'FIGHT_PROP_CRITICAL') cv += sub.value * 2;
            if (sub.type === 'FIGHT_PROP_CRITICAL_HURT') cv += sub.value;
          });
          totalCV += cv;
          return { ...art, crit_value: cv };
        });

        // Upsert Character
        const { data: charData, error: charError } = await supabaseAdmin
          .from('characters')
          .upsert({
            uid: data.uid,
            character_id: parsed.characterId,
            level: parsed.level,
            constellations: parsed.constellations,
            talents: parsed.talents,
            weapon: parsed.weapon,
            stats: parsed.stats,
            crit_value: totalCV,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'uid,character_id' })
          .select()
          .single();

        if (charError) throw charError;

        // Upsert Artifacts
        if (charData) {
          for (const art of artifactsWithCV) {
            await supabaseAdmin.from('artifacts').upsert({
              character_uuid: charData.id,
              uid: data.uid,
              slot: art.slot,
              name: art.name,
              set_name: art.setName,
              level: art.level,
              rarity: art.rarity,
              main_stat: art.mainStat,
              sub_stats: art.subStats,
              crit_value: art.crit_value,
            }, { onConflict: 'character_uuid,slot' });
          }
        }
      }
    }

    return res.status(200).json({ message: 'Success', uid: data.uid });
  } catch (error: unknown) {
    console.error('Search error:', error);
    return res.status(500).json({ message: error instanceof Error ? error.message : 'Internal server error' });
  }
}
