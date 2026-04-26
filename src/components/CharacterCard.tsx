import { Character } from "@/lib/supabase";
import Image from "next/image";
import { CHARACTER_MAP } from "@/lib/metadata";

export default function CharacterCard({ character }: { character: Character }) {
  const sideIcon = CHARACTER_MAP[character.character_id]?.sideIcon || `UI_AvatarIcon_Side_${character.character_id}`;

  return (
    <div className="flex flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800 relative">
          <Image
            src={`https://enka.network/ui/${sideIcon}.png`}
            alt="Character"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div>
          <h3 className="text-lg font-bold">Lvl {character.level}</h3>
          <p className="text-sm text-zinc-500">C{character.constellations}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-zinc-500 uppercase">Crit Value</p>
          <p className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400">
            {character.crit_value?.toFixed(1)}
          </p>
        </div>
      </div>

      {character.weapon && (
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-zinc-50 p-2 dark:bg-zinc-800/50">
          <div className="h-10 w-10 overflow-hidden rounded bg-zinc-200 dark:bg-zinc-700 relative">
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
            <p className="text-sm font-medium">{character.weapon.name || 'Weapon'}</p>
            <p className="text-xs text-zinc-500">Lvl {character.weapon.level} · R{character.weapon.refinement}</p>
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-zinc-500">ATK</span>
          <span className="font-medium">{Math.round(character.stats?.['2001'] || 0)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Crit Rate</span>
          <span className="font-medium">{( (character.stats?.['20'] || 0) * 100).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Crit DMG</span>
          <span className="font-medium">{( (character.stats?.['22'] || 0) * 100).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">ER</span>
          <span className="font-medium">{( (character.stats?.['23'] || 0) * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}
