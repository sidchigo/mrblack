import React from 'react';
import type { Metadata } from 'next';
import { WordsClient } from '@/components/WordsClient';

export const metadata: Metadata = {
  title: 'Undercover & Mr. Black Word Lists — 250+ Curated Desi Word Pairs',
  description:
    'Browse 250+ curated Undercover and Mr. Black word pairs across Bollywood, Desi Food, Cricket, and Pop Culture. Perfect for offline party games and instant browser play.',
  keywords: [
    'undercover words list',
    'undercover game words list',
    'undercover word pairs',
    'mr white words list',
    'mr black words',
    'mr white word pairs',
    'bollywood undercover words',
    'desi party game words',
  ],
  alternates: {
    canonical: 'https://playmrblack.vercel.app/words',
  },
};

export default function WordsPage() {
  return <WordsClient />;
}
