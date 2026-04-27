import { Character } from "@/lib/supabase";
import Image from "next/image";
import { CHARACTER_MAP } from "@/lib/metadata";

export default function CharacterCard({ character, rankPercent }: { character: Character, rankPercent?: number }) {
  const sideIcon = CHARACTER_MAP[character.character_id]?.sideIcon || `UI_AvatarIcon_Side_${character.character_id}`;

  return (
    <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="flex items-center gap-6">
        <div className="h-20 w-20 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 relative shadow-inner">
          <Image
            src={`https://enka.network/ui/${sideIcon}.png`}
            alt="Character"
            fill
            className="object-cover scale-110"
            unoptimized
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-black italic tracking-tighter">LVL {character.level}</h3>
            <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] font-bold text-white dark:bg-white dark:text-black">
              C{character.constellations}
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mt-1">ID: {character.character_id}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-[10px] font-black uppercase tracking-tighter text-zinc-400">Character CV</p>
          <p className="text-3xl font-black italic tracking-tighter text-blue-600 dark:text-blue-400">
            {character.crit_value?.toFixed(1)}
          </p>
          {rankPercent !== undefined && (
            <div className="inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-500 dark:bg-zinc-800">
              Top {rankPercent.toFixed(1)}%
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weapon Section */}
        {character.weapon && (
          <div className="flex items-center gap-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-800/30">
            <div className="h-12 w-12 overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-700 relative shadow-sm">
              {character.weapon.icon && (
                <Image
                  src={`https://enka.network/ui/${character.weapon.icon}.png`}
                  alt="Weapon"
                  fill
                  className="object-contain"
                  unoptimized
                />
              )}
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase text-zinc-400 leading-none mb-1">R{character.weapon.refinement}</p>
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate">{character.weapon.name || 'Weapon'}</p>
              <p className="text-[10px] font-bold text-zinc-500">LVL {character.weapon.level}</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-zinc-400">ATK</span>
            <span className="text-sm font-bold">{Math.round(character.stats?.['2001'] || 0)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-zinc-400">ER</span>
            <span className="text-sm font-bold">{( (character.stats?.['23'] || 0) * 100).toFixed(1)}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-zinc-400">Crit Rate</span>
            <span className="text-sm font-bold">{( (character.stats?.['20'] || 0) * 100).toFixed(1)}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-zinc-400">Crit DMG</span>
            <span className="text-sm font-bold">{( (character.stats?.['22'] || 0) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
