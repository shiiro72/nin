import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { supabase, Character, Artifact } from '../lib/supabase';
import LeaderboardTable from '../components/LeaderboardTable';
import { ChevronLeft, Trophy, Crown, Sparkles } from 'lucide-react';
import { ARTIFACT_SLOT_MAP } from '@/lib/metadata';
import ArtifactCard from '@/components/ArtifactCard';
import { X } from 'lucide-react';

export default function Leaderboard() {
  const [type, setType] = useState<'character' | 'artifact'>('character');
  const [entries, setEntries] = useState<(Character & { rank_in_category?: number })[]>([]);
  const [artifactEntries, setArtifactEntries] = useState<Artifact[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [totalCounts, setTotalCounts] = useState<Record<number, number>>({});
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

        if (data) {
          const typedChars = data as unknown as Character[];
          const enrichedChars: (Character & { rank_in_category?: number })[] = [];

          for (const char of typedChars) {
            const { count: betterCount } = await supabase
              .from('characters')
              .select('*', { count: 'exact', head: true })
              .eq('character_id', char.character_id)
              .gt('crit_value', char.crit_value || 0);

            enrichedChars.push({ ...char, rank_in_category: (betterCount || 0) + 1 });
          }

          setEntries(enrichedChars);

          // Fetch total counts for each character in the leaderboard
          const distinctCharIds = Array.from(new Set(typedChars.map(c => c.character_id)));
          for (const charId of distinctCharIds) {
            const { count } = await supabase
              .from('characters')
              .select('*', { count: 'exact', head: true })
              .eq('character_id', charId);
            setTotalCounts(prev => ({ ...prev, [charId]: count || 1 }));
          }
        }
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
            <LeaderboardTable entries={entries} totalCounts={totalCounts} />
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
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[600px]">
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
                    <tr
                      key={art.id}
                      onClick={() => setSelectedArtifact(art)}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group cursor-pointer"
                    >
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

      {/* Artifact Inspection Modal */}
      {selectedArtifact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedArtifact(null)}
          />
          <div className="relative w-full max-w-sm animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedArtifact(null)}
              className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
            <div className="scale-110 sm:scale-125">
              <ArtifactCard artifact={selectedArtifact} />
            </div>
            <div className="mt-12 text-center">
               <Link
                 href={`/profile/${selectedArtifact.uid}`}
                 className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full text-xs font-black italic tracking-tighter text-black hover:bg-zinc-100 transition-colors cursor-pointer"
               >
                 VIEW OWNER PROFILE
               </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
