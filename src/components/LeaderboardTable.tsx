import Link from 'next/link';
import { Character } from '@/lib/supabase';

export default function LeaderboardTable({ entries, totalCounts }: { entries: (Character & { rank_in_category?: number })[], totalCounts?: Record<number, number> }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:bg-zinc-800/50">
          <tr>
            <th className="px-6 py-4">Rank</th>
            <th className="px-6 py-4">Player</th>
            <th className="px-6 py-4">Character</th>
            <th className="px-6 py-4 text-right">Crit Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {entries.map((entry, i) => (
            <tr key={entry.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
              <td className="px-6 py-4 font-black italic text-zinc-300 group-hover:text-zinc-400 transition-colors">#{i + 1}</td>
              <td className="px-6 py-4">
                <Link href={`/profile/${entry.uid}`} className="font-bold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer">
                  {entry.profiles?.nickname || 'Unknown'}
                </Link>
                <p className="text-[10px] text-zinc-500 font-bold mt-0.5">UID {entry.uid}</p>
              </td>
              <td className="px-6 py-4">
                <span className="rounded bg-zinc-100 px-2 py-1 text-[10px] font-black uppercase tracking-tighter text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  ID {entry.character_id}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="font-black italic text-xl tracking-tighter text-blue-600 dark:text-blue-400">
                   {entry.crit_value?.toFixed(1)}
                </span>
                {totalCounts?.[entry.character_id] && (
                  <p className="text-[10px] font-bold text-zinc-400 mt-0.5">
                    Top {(((entry.rank_in_category || (i + 1)) / totalCounts[entry.character_id]) * 100).toFixed(1)}%
                  </p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
