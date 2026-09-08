import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Play, Sparkles, Smartphone, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How to Play Mr. Black & Undercover — Complete Rules, Roles & Strategy',
  description:
    'Learn how to play Mr. Black, Undercover, and Mr. White party game. Step-by-step round flow, Civilians vs Undercover strategies, Mr. Black guessing mechanics, and winning tips.',
  keywords: [
    'how to play mr white',
    'how to play mr black',
    'how to play undercover game',
    'undercover game rules',
    'mr white game rules',
    'mr black rules',
    'undercover party game strategy',
  ],
  alternates: {
    canonical: 'https://playmrblack.vercel.app/how-to-play',
  },
};

export default function HowToPlayPage() {
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Play Mr. Black & Undercover Party Game',
    description:
      'Step-by-step instructions on how to play Mr. Black & Undercover party game on a single shared phone.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Pass & Secret Reveal',
        text: 'Pass the phone around. Each player holds the reveal button to see their role and secret word, then passes it to the next player.',
      },
      {
        '@type': 'HowToStep',
        name: 'Give One-Line Clues',
        text: 'Players go in a clockwise circle giving one single clue describing their secret word. Mr. Black bluffs blindly without a word.',
      },
      {
        '@type': 'HowToStep',
        name: 'Debate & Vote',
        text: 'Debate who gave an inconsistent clue. Vote together to eliminate the suspected infiltrator.',
      },
      {
        '@type': 'HowToStep',
        name: 'Win or Mr. Black Last Guess',
        text: 'Civilians win by eliminating all imposters. If Mr. Black is eliminated, they get one final chance to guess the Civilian word and steal victory.',
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10 space-y-8 sm:space-y-12 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-discord-magenta/20 text-discord-magenta border border-discord-magenta/30">
          Complete Game Rulebook
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-discord-headline text-white uppercase tracking-tight">
          HOW TO PLAY MR. BLACK
        </h1>
        <p className="text-xs sm:text-sm text-discord-muted leading-relaxed">
          Mr. Black is a desi adaptation of the worldwide hit social deduction party game <em>Undercover</em> / <em>Mr. White</em>. Learn the secret roles, round sequences, and strategic clues in 2 minutes.
        </p>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-xl bg-discord-surface-indigo/80 border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-discord-green font-bold text-xs">
            <Users className="w-4 h-4" />
            <span>Players</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-white">3 to 20+ Players</p>
          <p className="text-xs text-discord-muted">Best with 4 to 8 players sitting in a circle.</p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-discord-surface-indigo/80 border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-discord-primary font-bold text-xs">
            <Smartphone className="w-4 h-4" />
            <span>Setup</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-white">1 Shared Phone</p>
          <p className="text-xs text-discord-muted">No app install or signup required. Pass &amp; play.</p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-discord-surface-indigo/80 border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-discord-yellow font-bold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>Duration</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-white">5 — 10 Mins</p>
          <p className="text-xs text-discord-muted">Fast, intense rounds packed with bluffing.</p>
        </div>
      </div>

      {/* The 3 Secret Roles (Exact match with Landing Page) */}
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-bold text-discord-magenta uppercase tracking-widest font-discord-headline">
            Master the Bluff
          </span>
          <h2 className="text-xl sm:text-3xl font-bold font-discord-headline text-white uppercase">
            1. THE 3 ROLES &amp; STRATEGY GUIDE
          </h2>
        </div>

        <div className="space-y-3">
          {/* Civilians */}
          <div className="p-4 sm:p-5 rounded-xl bg-discord-surface-indigo/70 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md bg-discord-green/20 text-discord-green font-extrabold text-[11px] uppercase tracking-wider">
                CIVILIAN
              </span>
              <span className="text-[11px] text-discord-muted font-medium">Majority Players</span>
            </div>
            <div className="text-xs text-white/80 font-semibold">
              Goal: Catch all imposters
            </div>
            <p className="text-xs text-discord-muted leading-relaxed">
              <strong className="text-white">Strategy:</strong> Give clues specific enough to prove you belong, but subtle enough so Mr. Black cannot guess your secret word.
            </p>
          </div>

          {/* Undercover */}
          <div className="p-4 sm:p-5 rounded-xl bg-discord-surface-indigo/70 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md bg-discord-magenta/20 text-discord-magenta font-extrabold text-[11px] uppercase tracking-wider">
                UNDERCOVER
              </span>
              <span className="text-[11px] text-discord-muted font-medium">Similar Word</span>
            </div>
            <div className="text-xs text-white/80 font-semibold">
              Goal: Blend in &amp; survive
            </div>
            <p className="text-xs text-discord-muted leading-relaxed">
              <strong className="text-white">Strategy:</strong> You receive a word very close to the Civilian word (e.g. <em>Chai vs Coffee</em>). Listen closely; if you realize you are Undercover, adapt your clues to match the group consensus.
            </p>
          </div>

          {/* Mr. Black */}
          <div className="p-4 sm:p-5 rounded-xl bg-discord-surface-indigo/70 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md bg-discord-yellow/20 text-discord-yellow font-extrabold text-[11px] uppercase tracking-wider">
                MR. BLACK
              </span>
              <span className="text-[11px] text-discord-muted font-medium">No Word (Blind)</span>
            </div>
            <div className="text-xs text-white/80 font-semibold">
              Goal: Bluff &amp; Steal Win
            </div>
            <p className="text-xs text-discord-muted leading-relaxed">
              <strong className="text-white">Strategy:</strong> You play completely blind. Dissect previous clues, drop a plausible clue with poker-faced confidence, and prepare to guess the real word if eliminated.
            </p>
          </div>
        </div>
      </div>

      {/* Step-by-Step Gameplay Flow */}
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold font-discord-headline text-white uppercase">
          2. Step-by-Step Round Flow
        </h2>

        <div className="space-y-3">
          <div className="p-4 sm:p-5 rounded-xl bg-discord-surface-indigo/70 border border-white/10 space-y-1.5">
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase font-discord-headline">
              Phase 1: Pass &amp; Secret Reveal
            </h3>
            <p className="text-xs text-discord-muted leading-relaxed">
              The host taps &quot;Start Game&quot;. The phone is passed to Player 1, who holds the screen to see their secret role and word privately. Player 1 hides the card and passes to Player 2 until everyone knows their identity.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-discord-surface-indigo/70 border border-white/10 space-y-1.5">
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase font-discord-headline">
              Phase 2: Giving Clues (Clockwise)
            </h3>
            <p className="text-xs text-discord-muted leading-relaxed">
              Starting from a random player, each person states <strong>one single clue</strong> describing their word.
              <br />
              <em>Golden Rule:</em> Clues cannot be an exact synonym, antonym, or translation. Keep it smart and subtle!
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-discord-surface-indigo/70 border border-white/10 space-y-1.5">
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase font-discord-headline">
              Phase 3: Debate &amp; Voting
            </h3>
            <p className="text-xs text-discord-muted leading-relaxed">
              After everyone provides their clue, the group discusses. Who was too vague? Who seemed confused? Everyone counts to 3 and points at their suspect. Tap the player voted out on the phone.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-discord-surface-indigo/70 border border-white/10 space-y-1.5">
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase font-discord-headline">
              Phase 4: Mr. Black Last Guess Hijack
            </h3>
            <p className="text-xs text-discord-muted leading-relaxed">
              If the eliminated player is Mr. Black, they get <strong>one final guess</strong> to type in the Civilian secret word. If correct, Mr. Black wins the game on the spot!
            </p>
          </div>
        </div>
      </div>

      {/* Win Conditions */}
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold font-discord-headline text-white uppercase">
          3. How to Win
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-xl bg-discord-surface-onyx border border-white/10 space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-discord-green uppercase font-discord-headline">
              Civilians Win When:
            </h3>
            <ul className="text-xs text-discord-muted space-y-1.5 list-disc list-inside">
              <li>All Undercovers and Mr. Blacks are voted out.</li>
              <li>Mr. Black fails their final word guess attempt.</li>
            </ul>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-discord-surface-onyx border border-white/10 space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-discord-magenta uppercase font-discord-headline">
              Infiltrators Win When:
            </h3>
            <ul className="text-xs text-discord-muted space-y-1.5 list-disc list-inside">
              <li>Imposters equal or outnumber the remaining Civilians.</li>
              <li>Mr. Black correctly guesses the Civilian word.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 sm:p-8 rounded-xl bg-discord-surface-indigo text-center space-y-3.5 border border-white/15">
        <h2 className="text-xl sm:text-2xl font-bold font-discord-headline text-white uppercase">
          Ready to Test Your Bluffing Skills?
        </h2>
        <Link
          href="/play"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-discord-green hover:bg-discord-green-hover text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-float transition-all"
        >
          <Play className="w-4 h-4 fill-black stroke-none" />
          <span>START PLAYING NOW</span>
        </Link>
      </div>
    </div>
  );
}
