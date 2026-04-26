import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase, Profile as ProfileType, Character, Artifact } from '../../lib/supabase';
import CharacterCard from '../../components/CharacterCard';
import ArtifactCard from '../../components/ArtifactCard';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CHARACTER_MAP } from '@/lib/metadata';

export default function Profile() {
  const router = useRouter();
  const { uid } = router.query;
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);

  useEffect(() => {
    if (!uid) return;

    const fetchData = async () => {
      setLoading(true);
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('uid', uid)
        .single();

      const { data: charData } = await supabase
        .from('characters')
        .select('*, artifacts(*)')
        .eq('uid', uid);

      if (profileData) setProfile(profileData as ProfileType);
      if (charData) {
        const typedChars = charData as unknown as Character[];
        setCharacters(typedChars);
        setSelectedChar(typedChars[0]);
      }
      setLoading(false);
    };

    fetchData();
  }, [uid]);

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading profile...</div>;
  if (!profile) return <div className="flex min-h-screen items-center justify-center">Profile not found.</div>;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black dark:text-white">
      <Head>
        <title>{profile.nickname}&apos;s Profile | Akasha Clone</title>
      </Head>

      <nav className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80 sticky top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4">
          <Link href="/" className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold">{profile.nickname}</h1>
            <p className="text-xs text-zinc-500">UID: {profile.uid} · Lvl {profile.level}</p>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Character List Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-sm font-bold uppercase text-zinc-400">Showcase</h2>
            <div className="grid grid-cols-1 gap-3">
              {characters.map((char) => {
                const sideIcon = CHARACTER_MAP[char.character_id]?.sideIcon || `UI_AvatarIcon_Side_${char.character_id}`;
                return (
                  <button
                    key={char.id}
                    onClick={() => setSelectedChar(char)}
                    className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all ${
                      selectedChar?.id === char.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10">
                        <Image
                          src={`https://enka.network/ui/${sideIcon}.png`}
                          fill
                          className="object-contain"
                          alt=""
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className="font-bold">Lvl {char.level}</p>
                        <p className="text-xs text-zinc-500">CV: {char.crit_value?.toFixed(1)}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Character Detail View */}
          <div className="lg:col-span-8">
            {selectedChar ? (
              <div className="space-y-8">
                <CharacterCard character={selectedChar} />

                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase text-zinc-400">Artifacts</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {selectedChar.artifacts?.sort((a: Artifact, b: Artifact) => {
                       const order = ['EQUIP_BRACER', 'EQUIP_NECKLACE', 'EQUIP_SHOES', 'EQUIP_RING', 'EQUIP_DRESS'];
                       return order.indexOf(a.slot) - order.indexOf(b.slot);
                    }).map((art: Artifact) => (
                      <ArtifactCard key={art.id} artifact={art} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                <p className="text-zinc-400">Select a character to see details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
