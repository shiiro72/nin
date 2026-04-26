import { useState } from 'react';
import { useRouter } from 'next/router';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: query }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/profile/${data.uid}`);
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to find user');
      }
    } catch {
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-md gap-2">
      <input
        type="text"
        placeholder="Enter UID or Username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
      />
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Searching...' : (
          <>
            <Search size={18} />
            Search
          </>
        )}
      </button>
    </form>
  );
}
