import { Character } from "@/lib/supabase";
import Image from "next/image";
import { CHARACTER_MAP, getGachaArtUrl, CORE_STATS, ELEMENT_DMG_STATS } from "@/lib/metadata";

export default function CharacterCard({ character, rankPercent }: { character: Character, rankPercent?: number }) {
  const sideIcon = CHARACTER_MAP[character.character_id]?.sideIcon || `UI_AvatarIcon_Side_${character.character_id}`;
  const gachaArt = getGachaArtUrl(character.character_id);

  // Find highest elemental bonus
  const elementalBonus = ELEMENT_DMG_STATS
    .map(stat => ({ name: stat.name, value: character.stats?.[stat.id] || 0 }))
    .reduce((prev, current) => (current.value > prev.value) ? current : prev, { name: "Physical DMG", value: 0 });

  return (
    <div className="group relative w-full overflow-hidden rounded-3xl bg-zinc-950 text-white shadow-2xl transition-all duration-500 hover:shadow-blue-500/10">
      {/* Background Gacha Art */}
      <div className="absolute inset-0 z-0">
        <Image
          src={gachaArt}
          alt=""
          fill
          className="object-cover object-[center_20%] opacity-50 transition-transform duration-700 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-8 p-8 lg:grid-cols-2">
        {/* Left Side: Character Info & Stats */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/10 px-3 py-1 backdrop-blur-md">
                <span className="text-xs font-black uppercase tracking-widest text-white/60">Level</span>
                <span className="ml-2 text-xl font-black italic">{character.level}</span>
              </div>
              <div className="rounded-lg bg-blue-500/20 px-3 py-1 backdrop-blur-md border border-blue-500/30">
                <span className="text-xs font-black uppercase tracking-widest text-blue-400">Constellation</span>
                <span className="ml-2 text-xl font-black italic text-blue-400">C{character.constellations}</span>
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Character CV</p>
                  <p className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 leading-none mt-2">
                    {character.crit_value?.toFixed(1)}
                  </p>
               </div>
               {rankPercent !== undefined && (
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Global Rank</p>
                    <div className="inline-block rounded-full bg-blue-500 px-4 py-1 text-sm font-black italic tracking-tighter text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                      Top {Math.ceil(rankPercent) || 1}%
                    </div>
                  </div>
               )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-6 rounded-3xl bg-white/5 p-6 backdrop-blur-xl border border-white/10">
            {CORE_STATS.map((stat) => (
              <div key={stat.id} className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.name}</span>
                <span className="text-lg font-bold text-white/90">
                  {stat.percentage
                    ? `${((character.stats?.[stat.id] || 0) * 100).toFixed(1)}%`
                    : Math.round(character.stats?.[stat.id] || 0).toLocaleString()}
                </span>
              </div>
            ))}
            {elementalBonus.value > 0 && (
               <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{elementalBonus.name}</span>
                 <span className="text-lg font-bold text-white/90">{(elementalBonus.value * 100).toFixed(1)}%</span>
               </div>
            )}
          </div>
        </div>

        {/* Right Side: Weapon & Talents (simplified for now) */}
        <div className="flex flex-col justify-between">
          <div className="ml-auto">
             <div className="h-32 w-32 relative group-hover:scale-110 transition-transform duration-500">
                <Image
                  src={`https://enka.network/ui/${sideIcon}.png`}
                  alt=""
                  fill
                  className="object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  unoptimized
                />
             </div>
          </div>

          <div className="space-y-6 mt-auto">
            {/* Weapon Card */}
            {character.weapon && (
              <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 backdrop-blur-md border border-white/5 group/weapon hover:bg-white/10 transition-colors">
                <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-zinc-800 shadow-inner">
                  {character.weapon.icon && (
                    <Image
                      src={`https://enka.network/ui/${character.weapon.icon}.png`}
                      alt=""
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-black text-zinc-400">R{character.weapon.refinement}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Level {character.weapon.level}</span>
                  </div>
                  <p className="text-sm font-black uppercase tracking-tight text-white/90 mt-1">{character.weapon.name}</p>
                </div>
              </div>
            )}

            {/* Talents (Levels Only) */}
            <div className="flex gap-4">
               {Object.entries(character.talents).map(([id, level], index) => (
                  <div key={id} className="flex flex-col items-center gap-1">
                    <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black italic text-sm hover:bg-blue-500/20 hover:border-blue-500/40 transition-colors">
                      {level}
                    </div>
                    <span className="text-[8px] font-black uppercase text-white/40">{index === 0 ? 'NA' : index === 1 ? 'E' : 'Q'}</span>
                  </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
