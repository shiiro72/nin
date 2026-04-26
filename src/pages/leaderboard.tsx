import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { supabase, Character } from '../lib/supabase';
import LeaderboardTable from '../components/LeaderboardTable';
import { ChevronLeft, Trophy } from 'lucide-react';

export default function Leaderboard() {
  const [entries, setEntries] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
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
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black dark:text-white">
      <Head>
        <title>Leaderboard | Akasha Clone</title>
      </Head>

      <nav className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80 sticky top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4">
          <Link href="/" className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Trophy size={20} className="text-amber-500" />
              Global Leaderboard
            </h1>
            <p className="text-xs text-zinc-500">Ranked by Character Crit Value</p>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {loading ? (
          <div className="flex h-64 items-center justify-center">Loading leaderboard...</div>
        ) : entries.length > 0 ? (
          <LeaderboardTable entries={entries} />
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 mb-4">No entries yet.</p>
            <Link href="/" className="text-blue-600 font-medium hover:underline">
              Be the first to search your UID!
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
