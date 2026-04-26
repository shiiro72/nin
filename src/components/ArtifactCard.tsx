import { Artifact } from "@/lib/supabase";

export default function ArtifactCard({ artifact }: { artifact: Artifact }) {
  const formatStat = (type: string, value: number) => {
    const isPercent = type.endsWith('_PERCENT') || ['FIGHT_PROP_CRITICAL', 'FIGHT_PROP_CRITICAL_HURT', 'FIGHT_PROP_CHARGE_EFFICIENCY', 'FIGHT_PROP_HEAL_ADD'].includes(type);
    return isPercent ? `${value.toFixed(1)}%` : Math.round(value).toString();
  };

  const getStatName = (type: string) => {
    return type.replace('FIGHT_PROP_', '').replace(/_/g, ' ');
  };

  return (
    <div className="flex flex-col rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
        <span className="text-xs font-bold uppercase text-zinc-400">{artifact.slot.replace('EQUIP_', '')}</span>
        <span className="text-xs font-mono font-bold text-blue-500">CV: {artifact.crit_value?.toFixed(1)}</span>
      </div>

      <div className="mt-2">
        <div className="flex justify-between items-baseline">
          <span className="text-xs text-zinc-500">{getStatName(artifact.main_stat.type)}</span>
          <span className="text-sm font-bold">{formatStat(artifact.main_stat.type, artifact.main_stat.value)}</span>
        </div>
      </div>

      <div className="mt-2 space-y-1">
        {artifact.sub_stats?.map((sub: { type: string; value: number }, i: number) => (
          <div key={i} className="flex justify-between text-xs">
            <span className="text-zinc-500">{getStatName(sub.type)}</span>
            <span className="font-medium">{formatStat(sub.type, sub.value)}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-2 text-[10px] text-zinc-400">
        +{artifact.level-1} · {artifact.rarity}★
      </div>
    </div>
  );
}
