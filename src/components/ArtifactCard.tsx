import { Artifact } from "@/lib/supabase";
import { ARTIFACT_SLOT_MAP, STAT_NAME_MAP, calculateRV } from "@/lib/metadata";
import Image from "next/image";

export default function ArtifactCard({ artifact }: { artifact: Artifact }) {
  const rv = calculateRV(artifact.sub_stats || []);

  const formatStat = (type: string, value: number) => {
    const isPercent = type.endsWith('_PERCENT') || ['FIGHT_PROP_CRITICAL', 'FIGHT_PROP_CRITICAL_HURT', 'FIGHT_PROP_CHARGE_EFFICIENCY', 'FIGHT_PROP_HEAL_ADD'].includes(type) || type.includes('ADD_HURT');
    return isPercent ? `${value.toFixed(1)}%` : Math.round(value).toString();
  };

  const getStatName = (type: string) => {
    return STAT_NAME_MAP[type] || type.replace('FIGHT_PROP_', '').replace(/_/g, ' ');
  };

  return (
    <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 dark:border-zinc-800 dark:bg-zinc-900 group cursor-default relative overflow-hidden">
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

      <div className="flex items-start justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1 shadow-inner">
            {artifact.icon && (
               <Image
                 src={`https://enka.network/ui/${artifact.icon}.png`}
                 alt="Artifact"
                 fill
                 className="object-contain"
                 unoptimized
               />
            )}
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 leading-none">{ARTIFACT_SLOT_MAP[artifact.slot] || artifact.slot}</span>
            <p className="text-[9px] font-bold text-zinc-500 truncate max-w-[150px] mt-0.5 uppercase tracking-tighter">
              {artifact.set_name || 'SET PIECE'}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-black italic text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full ring-1 ring-blue-500/20">{artifact.crit_value?.toFixed(1)} CV</span>
          <span className="text-[10px] font-black italic text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full ring-1 ring-amber-500/20">{rv.toFixed(0)}% RV</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-baseline px-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-tighter">{getStatName(artifact.main_stat.type)}</span>
          <span className="text-lg font-black italic tracking-tighter text-zinc-800 dark:text-zinc-100">{formatStat(artifact.main_stat.type, artifact.main_stat.value)}</span>
        </div>
      </div>

      <div className="mt-4 space-y-2 px-1">
        {artifact.sub_stats?.map((sub: { type: string; value: number }, i: number) => (
          <div key={i} className="flex justify-between items-center text-xs">
            <span className="text-zinc-500 group-hover:text-zinc-400 transition-colors font-medium">{getStatName(sub.type)}</span>
            <span className="font-black italic tracking-tighter text-zinc-700 dark:text-zinc-300">{formatStat(sub.type, sub.value)}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between pt-4 border-t border-zinc-50 dark:border-zinc-800/50 px-1">
        <span className="text-[10px] font-black text-zinc-400 italic bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">LEVEL {artifact.level-1}</span>
        <div className="flex gap-0.5">
          {Array.from({ length: artifact.rarity }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
          ))}
        </div>
      </div>
    </div>
  );
}
