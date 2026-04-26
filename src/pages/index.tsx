import Head from 'next/head';
import Link from 'next/link';
import SearchBar from '../components/SearchBar';
import { Trophy, Users, Search } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black dark:text-white">
      <Head>
        <title>Akasha Clone - Genshin Impact Showcase</title>
      </Head>

      <main className="mx-auto max-w-5xl px-6 py-20">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 rounded-full bg-blue-100 p-4 dark:bg-blue-900/30">
            <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight">Akasha Clone</h1>
          <p className="mb-10 max-w-lg text-lg text-zinc-600 dark:text-zinc-400">
            Showcase your characters, artifacts, and see how you rank on the global leaderboard.
          </p>

          <SearchBar />

          <div className="mt-16 grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            <Link
              href="/leaderboard"
              className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-transform hover:scale-[1.02] dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/30">
                <Trophy className="h-6 w-6 text-amber-600" />
              </div>
              <div className="text-left">
                <h3 className="font-bold">Global Leaderboard</h3>
                <p className="text-sm text-zinc-500">See the top ranked characters worldwide.</p>
              </div>
            </Link>

            <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="font-bold">Showcase Gallery</h3>
                <p className="text-sm text-zinc-500">View detailed artifact and stat breakdowns.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
