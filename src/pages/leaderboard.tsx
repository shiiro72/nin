import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { supabase, Character, Artifact } from '../lib/supabase';
import LeaderboardTable from '../components/LeaderboardTable';
import { ChevronLeft, Trophy, Crown, Sparkles } from 'lucide-react';
import { ARTIFACT_SLOT_MAP } from '@/lib/metadata';

export default function Leaderboard() {
  const [type, setType] = useState<'character' | 'artifact'>('character');
  const [entries, setEntries] = useState<Character[]>([]);
  const [artifactEntries, setArtifactEntries] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      if (type === 'character') {
        const { data } = await supabase
          .from('characters')
          .select(`
            *,
            profiles (
              nickname
            )
          `)
          .order('crit_value', { ascending: false })
          .limit(50);

        if (data) setEntries(data as unknown as Character[]);
      } else {
        const { data } = await supabase
          .from('artifacts')
          .select(`
            *,
            profiles:uid (
              nickname
            )
          `)
          .order('crit_value', { ascending: false })
          .limit(50);

        if (data) setArtifactEntries(data as unknown as (Artifact & { profiles: { nickname: string } | null })[]);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, [type]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black dark:text-white">
      <Head>
        <title>Leaderboard | Akasha Clone</title>
      </Head>

      <nav className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80 sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4">
          <Link href="/" className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-black italic tracking-tighter flex items-center gap-2">
              <Trophy size={20} className="text-amber-500" />
              GLOBAL LEADERBOARD
            </h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Ranked by Crit Value (CV)</p>
          </div>
          <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded-lg p-1">
             <button
               onClick={() => setType('character')}
               className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${type === 'character' ? 'bg-white dark:bg-zinc-800 shadow-sm text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}
             >
               <Crown size={14} />
               Characters
             </button>
             <button
               onClick={() => setType('artifact')}
               className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${type === 'artifact' ? 'bg-white dark:bg-zinc-800 shadow-sm text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}
             >
               <Sparkles size={14} />
               Artifacts
             </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <p className="text-sm font-bold text-zinc-500 animate-pulse uppercase tracking-widest">Updating Ranks...</p>
            </div>
          </div>
        ) : type === 'character' ? (
          entries.length > 0 ? (
            <LeaderboardTable entries={entries} />
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500 mb-4 font-bold italic">No character entries found.</p>
              <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors cursor-pointer">
                Search your UID
              </Link>
            </div>
          )
        ) : (
          artifactEntries.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:bg-zinc-800/50">
                  <tr>
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">Owner</th>
                    <th className="px-6 py-4">Piece</th>
                    <th className="px-6 py-4 text-right">Crit Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {artifactEntries.map((art, i) => (
                    <tr key={art.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                      <td className="px-6 py-4 font-black italic text-zinc-300 group-hover:text-zinc-400 transition-colors">#{i + 1}</td>
                      <td className="px-6 py-4">
                        <Link href={`/profile/${art.uid}`} className="font-bold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer">
                          {(art as Artifact & { profiles: { nickname: string } | null }).profiles?.nickname || 'Unknown'}
                        </Link>
                        <p className="text-[10px] text-zinc-500 font-bold mt-0.5">UID {art.uid}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded bg-zinc-100 px-2 py-1 text-[10px] font-black uppercase tracking-tighter text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                          {ARTIFACT_SLOT_MAP[art.slot]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-black italic text-xl tracking-tighter text-blue-600 dark:text-blue-400">
                          {art.crit_value?.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500 mb-4 font-bold italic">No artifact entries found.</p>
              <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors cursor-pointer">
                Search your UID
              </Link>
            </div>
          )
        )}
      </main>
    </div>
  );
}
