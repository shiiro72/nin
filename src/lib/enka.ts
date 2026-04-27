export interface EnkaData {
  playerInfo: {
    nickname: string;
    level: number;
    signature?: string;
    worldLevel?: number;
    finishAchievementNum?: number;
    towerFloorIndex?: number;
    towerLevelIndex?: number;
    showAvatarInfoList?: {
      avatarId: number;
      level: number;
    }[];
  };
  avatarInfoList?: EnkaAvatarInfo[];
  uid: string;
}

const ENKA_BASE_URL = 'https://enka.network/api/uid';

export async function fetchEnkaData(uid: string): Promise<EnkaData> {
  // Use a modern Browser-like User-Agent to avoid being blocked by Cloudflare/Enka
  const response = await fetch(`${ENKA_BASE_URL}/${uid}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Player not found');
    }
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    if (response.status === 500) {
      throw new Error('Enka Network is currently experiencing issues.');
    }
    throw new Error(`Failed to fetch data from Enka Network (Status: ${response.status})`);
  }

  const data = await response.json();
  return { ...data, uid };
}

export interface EnkaAvatarInfo {
  avatarId: number;
  propMap: Record<string, { val?: string }>;
  talentIdList?: unknown[];
  skillLevelMap: Record<string, number>;
  equipList?: {
    flat: {
      itemType: string;
      nameTextHashMap: string;
      setNameTextHashMap?: string;
      icon?: string;
      rankLevel: number;
      equipType: string;
      reliquaryMainstat: {
        mainPropId: string;
        statValue?: number;
        propValue?: number;
      };
      reliquarySubstats?: {
        appendPropId?: string;
        mainPropId?: string;
        statValue?: number;
        propValue?: number;
      }[];
    };
    reliquary: {
      level: number;
    };
    weapon: {
      level: number;
      affixMap?: Record<string, number>;
    };
  }[];
  fightPropMap: Record<string, number>;
}

// Helper to parse character stats and artifacts
export function parseCharacterData(avatarInfo: EnkaAvatarInfo) {
  const { avatarId, propMap, talentIdList, skillLevelMap, equipList, fightPropMap } = avatarInfo;

  const level = parseInt(propMap['4001']?.val || '0');

  const artifacts = (equipList || [])
    .filter((equip) => equip.flat.itemType === 'ITEM_RELIQUARY')
    .map((artifact) => ({
      slot: artifact.flat.equipType,
      name: artifact.flat.nameTextHashMap,
      setName: artifact.flat.setNameTextHashMap || '',
      mainStat: {
        type: artifact.flat.reliquaryMainstat.mainPropId,
        value: artifact.flat.reliquaryMainstat.statValue || artifact.flat.reliquaryMainstat.propValue || 0
      },
      subStats: artifact.flat.reliquarySubstats?.map((sub) => ({
        type: sub.appendPropId || sub.mainPropId || '',
        value: sub.statValue || sub.propValue || 0
      })) || [],
      level: artifact.reliquary.level,
      rarity: artifact.flat.rankLevel,
      icon: artifact.flat.icon
    }));

  const weapon = (equipList || []).find((equip) => equip.flat.itemType === 'ITEM_WEAPON');

  return {
    characterId: avatarId,
    level,
    constellations: talentIdList?.length || 0,
    talents: skillLevelMap,
    artifacts,
    weapon: weapon ? {
      name: weapon.flat.nameTextHashMap,
      icon: weapon.flat.icon,
      level: weapon.weapon.level,
      refinement: (weapon.weapon.affixMap ? Object.values(weapon.weapon.affixMap)[0] : 0) as number + 1,
      rarity: weapon.flat.rankLevel
    } : null,
    stats: fightPropMap
  };
}
