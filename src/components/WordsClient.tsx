'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BUILT_IN_PACKS } from '@/lib/game/packs';
import { Search, Play, ArrowRight } from 'lucide-react';

function WordsContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get('category');

  const categories = [
    'All',
    'Food',
    'Entertainment',
    'Sports',
    'Culture',
    'Tech',
    'Daily Life',
    'Travel',
    'Pop Culture',
    'Business',
  ];

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>(() => {
    if (initialCategoryParam) {
      const found = categories.find(
        (c) => c.toLowerCase() === initialCategoryParam.toLowerCase()
      );
      if (found) return found;
    }
    return 'All';
  });

  // Sync category state if URL query changes
  React.useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      const found = categories.find((c) => c.toLowerCase() === cat.toLowerCase());
      if (found) {
        setSelectedCategory(found);
      }
    }
  }, [searchParams]);

  const allPairsWithPack = React.useMemo(() => {
    return BUILT_IN_PACKS.flatMap((pack) =>
      pack.pairs.map((pair, index) => ({
        ...pair,
        packId: pack.id,
        packName: pack.name,
        category: pack.category || 'General',
        id: `${pack.id}-${index}`,
      }))
    );
  }, []);

  const filteredPairs = allPairsWithPack.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.a.toLowerCase().includes(query) ||
      item.b.toLowerCase().includes(query) ||
      item.packName.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  // Play URL dynamically targeting currently selected category or all
  const playTargetUrl =
    selectedCategory !== 'All'
      ? `/play?category=${encodeURIComponent(selectedCategory)}`
      : '/play';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-6 sm:space-y-10 font-sans">
      {/* Header */}
      <div className="text-center space-y-2 sm:space-y-3 max-w-2xl mx-auto px-2">
        <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-discord-primary/20 text-discord-link border border-discord-primary/30">
          Word Bank &amp; Directories
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-discord-headline text-white uppercase tracking-tight leading-tight">
          UNDERCOVER &amp; MR. BLACK WORD LISTS
        </h1>
        <p className="text-xs sm:text-sm text-discord-muted leading-relaxed">
          Browse 250+ curated word pairs across Bollywood, Desi Food, Cricket, and Indian Pop Culture.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-3 max-w-3xl mx-auto">
        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-discord-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search words (e.g., Samosa, Sholay, Kohli, Swiggy)..."
            className="w-full bg-discord-surface-onyx border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder:text-discord-muted outline-none focus:border-discord-primary transition-all font-medium shadow-card"
          />
        </div>

        {/* Category Pills (Touch-friendly scroll container) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-discord-primary text-white shadow-float'
                  : 'bg-discord-surface-indigo/80 text-discord-muted hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Word Pairs Grid */}
      <div className="space-y-3">
        {/* Controls bar above grid */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-discord-muted px-1">
          <span>
            Showing <strong className="text-white">{filteredPairs.length}</strong> Word Pairs
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </span>
          <Link
            href={playTargetUrl}
            className="inline-flex items-center gap-1.5 text-discord-green font-bold hover:underline"
          >
            <Play className="w-3.5 h-3.5 fill-discord-green stroke-none" />
            <span>Play with {selectedCategory !== 'All' ? selectedCategory : 'these'} words</span>
            <ArrowRight className="w-3 h-3 stroke-[2.5]" />
          </Link>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
          {filteredPairs.map((item) => {
            return (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 rounded-xl bg-discord-surface-indigo/70 border border-white/10 hover:border-discord-primary/40 transition-all flex items-center justify-between group gap-2"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                      {item.a}
                    </span>
                    <span className="text-[10px] text-discord-muted font-bold px-1">vs</span>
                    <span className="text-xs sm:text-sm font-bold text-discord-magenta tracking-wide truncate">
                      {item.b}
                    </span>
                  </div>
                  <div className="text-[10px] text-discord-muted uppercase font-medium truncate">
                    {item.packName} &bull; {item.category}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    href={`/play?pack=${item.packId}`}
                    title="Play with this pack"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-discord-green/10 hover:bg-discord-green hover:text-black text-discord-green border border-discord-green/20 text-xs font-bold transition-all"
                  >
                    <Play className="w-3 h-3 fill-current stroke-none" />
                    <span>Play</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Callout */}
      <div className="p-5 sm:p-6 rounded-xl bg-discord-surface-onyx border border-white/10 text-center space-y-3">
        <h3 className="text-base sm:text-lg font-bold text-white uppercase font-discord-headline">
          Want Custom Word Pairs for Your Party?
        </h3>
        <p className="text-xs text-discord-muted max-w-lg mx-auto">
          Use our AI Custom Pack generator in the game lobby to create pairs on any custom topic like office humor, college memes, or TV shows.
        </p>
        <Link
          href="/play"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-discord-primary hover:bg-discord-primary-hover text-white font-bold text-xs uppercase tracking-wide transition-all shadow-float"
        >
          <span>Create Custom Pack in Game</span>
        </Link>
      </div>
    </div>
  );
}

export function WordsClient() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white text-xs">Loading word pairs...</div>}>
      <WordsContent />
    </Suspense>
  );
}
