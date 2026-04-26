import { Artifact } from "@/lib/supabase";
import { ARTIFACT_SLOT_MAP, STAT_NAME_MAP, calculateRV } from "@/lib/metadata";

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
    <div className="flex flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 group cursor-default">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">{ARTIFACT_SLOT_MAP[artifact.slot] || artifact.slot}</span>
        <div className="flex gap-2">
          <span className="text-[10px] font-mono font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">CV {artifact.crit_value?.toFixed(1)}</span>
          <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded">{rv.toFixed(0)}% RV</span>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between items-baseline">
          <span className="text-xs font-medium text-zinc-500">{getStatName(artifact.main_stat.type)}</span>
          <span className="text-base font-black text-zinc-800 dark:text-zinc-100">{formatStat(artifact.main_stat.type, artifact.main_stat.value)}</span>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        {artifact.sub_stats?.map((sub: { type: string; value: number }, i: number) => (
          <div key={i} className="flex justify-between items-center text-xs">
            <span className="text-zinc-500 group-hover:text-zinc-400 transition-colors">{getStatName(sub.type)}</span>
            <span className="font-bold text-zinc-700 dark:text-zinc-300">{formatStat(sub.type, sub.value)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-zinc-50 dark:border-zinc-800/50">
        <span className="text-[10px] font-bold text-zinc-400">+{artifact.level-1}</span>
        <div className="flex gap-0.5">
          {Array.from({ length: artifact.rarity }).map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-amber-400" />
          ))}
        </div>
      </div>
    </div>
  );
}
