import Link from 'next/link';
import { Character } from '@/lib/supabase';

export default function LeaderboardTable({ entries }: { entries: Character[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-50 text-xs font-semibold uppercase text-zinc-500 dark:bg-zinc-800/50">
          <tr>
            <th className="px-6 py-3">Rank</th>
            <th className="px-6 py-3">Player</th>
            <th className="px-6 py-3">Character</th>
            <th className="px-6 py-3 text-right">Crit Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {entries.map((entry, i) => (
            <tr key={entry.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
              <td className="px-6 py-4 font-mono text-zinc-400">#{i + 1}</td>
              <td className="px-6 py-4">
                <Link href={`/profile/${entry.uid}`} className="font-bold text-blue-600 hover:underline dark:text-blue-400">
                  {entry.profiles?.nickname || 'Unknown'}
                </Link>
                <p className="text-[10px] text-zinc-500">{entry.uid}</p>
              </td>
              <td className="px-6 py-4">
                <span className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800">
                  ID: {entry.character_id}
                </span>
              </td>
              <td className="px-6 py-4 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                {entry.crit_value?.toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
