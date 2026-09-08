import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { GameController } from '@/components/GameController';
import { BUILT_IN_PACKS } from '@/lib/game/packs';

export const metadata: Metadata = {
  title: 'Play Mr. Black Game Online Free — Pass & Play Social Deduction',
  description:
    'Start playing Mr. Black (Mr. White / Undercover) online free immediately. Pass and play on 1 phone, no signup required. Choose from Bollywood, Street Food, Cricket, and custom AI word packs.',
  keywords: [
    'play mr white online',
    'play mr black online',
    'play undercover online free',
    'undercover party game pass and play',
    'mr white browser game',
    'mr black free game',
  ],
  alternates: {
    canonical: 'https://playmrblack.vercel.app/play',
  },
};

interface PlayPageProps {
  searchParams: { category?: string; pack?: string };
}

export default function PlayPage({ searchParams }: PlayPageProps) {
  // Determine initial pack IDs if a category or specific pack was passed in URL query
  let initialPackIds: string[] | undefined = undefined;

  if (searchParams.pack) {
    const matched = BUILT_IN_PACKS.find((p) => p.id === searchParams.pack);
    if (matched) {
      initialPackIds = [matched.id];
    }
  } else if (searchParams.category) {
    const matchedPacks = BUILT_IN_PACKS.filter(
      (p) =>
        p.category?.toLowerCase() === searchParams.category?.toLowerCase() ||
        p.name.toLowerCase() === searchParams.category?.toLowerCase() ||
        p.id.toLowerCase() === searchParams.category?.toLowerCase()
    );
    if (matchedPacks.length > 0) {
      initialPackIds = matchedPacks.map((p) => p.id);
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div className="text-white text-xs">Loading game...</div>}>
        <GameController initialPackIds={initialPackIds} />
      </Suspense>
    </div>
  );
}
