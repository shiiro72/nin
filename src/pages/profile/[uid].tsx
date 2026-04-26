import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase, Profile as ProfileType, Character, Artifact } from '../../lib/supabase';
import CharacterCard from '../../components/CharacterCard';
import ArtifactCard from '../../components/ArtifactCard';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CHARACTER_MAP, ARTIFACT_SLOT_MAP } from '@/lib/metadata';

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

  const allArtifacts = characters.flatMap(char => char.artifacts || [])
    .sort((a, b) => (b.crit_value || 0) - (a.crit_value || 0))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black dark:text-white pb-20">
      <Head>
        <title>{profile.nickname}&apos;s Profile | Akasha Clone</title>
      </Head>

      <nav className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80 sticky top-0 z-20">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
          <Link href="/" className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black">
                {profile.nickname[0].toUpperCase()}
             </div>
             <div>
               <h1 className="text-xl font-black italic tracking-tighter leading-none">{profile.nickname}</h1>
               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                 UID {profile.uid} · AR {profile.level}
               </p>
             </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Character List Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 px-2">Showcase Characters</h2>
              <div className="grid grid-cols-1 gap-2">
                {characters.map((char) => {
                  const sideIcon = CHARACTER_MAP[char.character_id]?.sideIcon || `UI_AvatarIcon_Side_${char.character_id}`;
                  return (
                    <button
                      key={char.id}
                      onClick={() => setSelectedChar(char)}
                      className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                        selectedChar?.id === char.id
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-sm'
                          : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden">
                          <Image
                            src={`https://enka.network/ui/${sideIcon}.png`}
                            fill
                            className="object-contain scale-110"
                            alt=""
                            unoptimized
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-black uppercase tracking-tighter text-zinc-400 leading-none">LVL {char.level}</p>
                          <p className="font-bold text-zinc-800 dark:text-zinc-100 mt-1">C{char.constellations} Character</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-zinc-400 uppercase leading-none">CV</p>
                          <p className="text-lg font-black italic tracking-tighter text-blue-600 dark:text-blue-400">
                             {char.crit_value?.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Artifact Leaderboard Section */}
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 px-2">Profile Artifact Leaderboard</h2>
              <div className="space-y-3">
                {allArtifacts.map((art, i) => (
                  <div key={art.id} className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <span className="text-xs font-black text-zinc-300 italic w-4">#{i+1}</span>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase leading-none mb-1">{ARTIFACT_SLOT_MAP[art.slot]}</p>
                      <p className="text-xs font-bold truncate">Artifact ID: {art.id.slice(0, 8)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-blue-500">{art.crit_value?.toFixed(1)} CV</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Character Detail View */}
          <div className="lg:col-span-8">
            {selectedChar ? (
              <div className="space-y-12">
                <CharacterCard character={selectedChar} />

                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Equipped Artifacts</h2>
                    <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                       5 PIECES
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
              <div className="flex h-96 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/30 dark:border-zinc-800 dark:bg-zinc-900/30">
                <div className="mb-4 h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                   <ChevronLeft className="rotate-180 text-zinc-400" />
                </div>
                <p className="font-bold text-zinc-500 italic">Select a character to see full build details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
