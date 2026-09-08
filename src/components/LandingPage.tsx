'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Play,
  ShieldAlert,
  HelpCircle,
  Smartphone,
  WifiOff,
  Flame,
  ArrowRight,
  ChevronDown,
  Download,
} from 'lucide-react';
import { BUILT_IN_PACKS } from '@/lib/game/packs';

interface LandingProps {
  onStartInstantPlay?: () => void;
}

export function LandingPage({ onStartInstantPlay }: LandingProps) {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'What is Mr. Black and how do you play?',
      a: 'Mr. Black is a fast-paced social deduction party game based on Undercover and Mr. White, packed with desi Indian themes. Most players are Civilians who receive the same secret word. One player is the Undercover who gets a closely related word, and one player is Mr. Black who gets NO word at all. Players take turns giving a one-line clue, debate, and vote to eliminate suspected imposters.',
    },
    {
      q: 'Can I install Mr. Black as an app on my phone?',
      a: 'Yes! Mr. Black is a progressive web app (PWA). In Safari or Chrome, tap "Add to Home Screen" or "Install App" to launch Mr. Black with one tap right from your phone home screen with full offline access.',
    },
    {
      q: 'Does it work offline without Wi-Fi or data?',
      a: 'Yes! When installed or loaded, all 15+ built-in curated word packs and core gameplay work 100% offline. Custom AI pack generation and trending community packs activate automatically whenever your phone reconnects to the internet.',
    },
    {
      q: 'How does Mr. Black win the game?',
      a: 'Mr. Black has two winning paths: 1) Survive until the imposters equal or outnumber the Civilians, or 2) If Mr. Black gets voted out, they get ONE final chance to guess the Civilian secret word. If they guess correctly, Mr. Black hijacks the entire round and steals the victory!',
    },
    {
      q: 'How many players can play Mr. Black?',
      a: 'Mr. Black supports 3 to 20+ players seamlessly on a single phone. You can customize the exact count of Undercovers and Mr. Blacks depending on your group size.',
    },
    {
      q: 'What word packs are included?',
      a: 'Mr. Black comes with 15+ rich desi-curated packs including Bollywood Blockbusters & Villains, Desi Street Food & Mithai, Cricket & IPL Legends, Indian Weddings (Shaadi), 90s Nostalgia, Tech & Startups, and an AI Custom Pack generator for any custom theme.',
    },
  ];

  return (
    <div className="w-full space-y-12 sm:space-y-16 pb-16 font-sans">
      {/* 1. Hero Section */}
      <section className="text-center space-y-4 sm:space-y-6 pt-2 sm:pt-4 max-w-3xl mx-auto px-4">
        {/* Value Badges */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-discord-green/15 text-discord-green border border-discord-green/30">
            <span className="w-1.5 h-1.5 rounded-full bg-discord-green animate-pulse"></span>
            No Sign-up Needed
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-discord-primary/15 text-discord-link border border-discord-primary/30">
            <Smartphone className="w-3 h-3" />
            1 Phone Pass &amp; Play
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-discord-magenta/15 text-discord-magenta border border-discord-magenta/30">
            <WifiOff className="w-3 h-3" />
            100% Free &amp; Offline Ready
          </span>
        </div>

        {/* Hero Artwork */}
        <div className="w-full max-w-[280px] sm:max-w-md mx-auto flex items-center justify-center">
          <Image
            src="/hero-banner-mobile.png"
            alt="Mr. Black Desi Social Deduction Characters"
            width={1024}
            height={1024}
            priority
            sizes="(max-width: 640px) 280px, 448px"
            className="w-full h-auto object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.6)]"
          />
        </div>

        {/* Headline & Description */}
        <div className="space-y-2 sm:space-y-3 px-2">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-discord-headline text-white uppercase tracking-tight leading-[1.15]">
            THE DESI SOCIAL DEDUCTION <br />
            <span className="text-discord-primary">PARTY GAME FOR FRIENDS</span>
          </h1>
          <p className="text-xs sm:text-sm text-discord-muted max-w-xl mx-auto font-medium leading-relaxed">
            The free browser-based alternative to Undercover &amp; Mr. White. Pass one phone around the circle, give clever one-word clues, spot the imposter, and unmask Mr. Black.
          </p>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-2">
          <Link
            href="/play"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 rounded-xl bg-discord-green hover:bg-discord-green-hover text-black font-extrabold text-sm sm:text-base uppercase tracking-wider shadow-float transition-all transform hover:scale-105 active:scale-95"
          >
            <Play className="w-4 h-4 fill-black stroke-none" />
            <span>PLAY FREE NOW</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>

          <Link
            href="/how-to-play"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs sm:text-sm tracking-wide transition-all"
          >
            <HelpCircle className="w-4 h-4 text-discord-magenta" />
            <span>How to Play (2 Min)</span>
          </Link>
        </div>
      </section>

      {/* 2. Key Highlights (Including PWA & Offline readiness) */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-xl bg-discord-surface-indigo/80 border border-white/10 space-y-2 shadow-card">
            <div className="w-8 h-8 rounded-lg bg-discord-primary/20 text-discord-primary flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white uppercase font-discord-headline tracking-wide">
              One Shared Screen
            </h2>
            <p className="text-xs text-discord-muted leading-relaxed">
              No need for every friend to install an app. One phone is passed around the room for private secret reveals.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-discord-surface-indigo/80 border border-white/10 space-y-2 shadow-card">
            <div className="w-8 h-8 rounded-lg bg-discord-magenta/20 text-discord-magenta flex items-center justify-center font-bold">
              <Flame className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white uppercase font-discord-headline tracking-wide">
              Desi Pop-Culture Packs
            </h2>
            <p className="text-xs text-discord-muted leading-relaxed">
              Built for Indian game nights: Samosa vs Kachori, Sholay vs Deewaar, Kohli vs Rohit, plus AI custom packs.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-discord-surface-indigo/80 border border-white/10 space-y-2 shadow-card">
            <div className="w-8 h-8 rounded-lg bg-discord-green/20 text-discord-green flex items-center justify-center font-bold">
              <Download className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white uppercase font-discord-headline tracking-wide">
              Install as App &bull; Offline Ready
            </h2>
            <p className="text-xs text-discord-muted leading-relaxed">
              Add to Home Screen for instant 1-tap launch. All 15+ curated word packs work seamlessly even on flights, road trips &amp; zero Wi-Fi.
            </p>
          </div>
        </div>
      </section>

      {/* 3. How It Works (Step-by-Step) */}
      <section className="max-w-4xl mx-auto px-4 space-y-4 sm:space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-bold text-discord-primary uppercase tracking-widest font-discord-headline">
            Simple Gameplay
          </span>
          <h2 className="text-xl sm:text-3xl font-bold font-discord-headline text-white uppercase">
            HOW TO PLAY IN 4 SIMPLE STEPS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-xl bg-discord-surface-onyx/80 border border-white/10 flex gap-3.5 items-start">
            <span className="w-7 h-7 rounded-lg bg-discord-primary text-white font-black text-xs flex items-center justify-center shrink-0">
              1
            </span>
            <div className="space-y-1">
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase font-discord-headline">
                Secret Pass &amp; Reveal
              </h3>
              <p className="text-xs text-discord-muted leading-relaxed">
                Pass the phone around. Each player holds the reveal button to see their role and secret word, then passes it.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-discord-surface-onyx/80 border border-white/10 flex gap-3.5 items-start">
            <span className="w-7 h-7 rounded-lg bg-discord-magenta text-white font-black text-xs flex items-center justify-center shrink-0">
              2
            </span>
            <div className="space-y-1">
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase font-discord-headline">
                Give One-Line Clues
              </h3>
              <p className="text-xs text-discord-muted leading-relaxed">
                Go around the circle. Civilians describe the real word, Undercover describes decoy, and Mr. Black bluffs.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-discord-surface-onyx/80 border border-white/10 flex gap-3.5 items-start">
            <span className="w-7 h-7 rounded-lg bg-discord-yellow text-black font-black text-xs flex items-center justify-center shrink-0">
              3
            </span>
            <div className="space-y-1">
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase font-discord-headline">
                Debate &amp; Vote
              </h3>
              <p className="text-xs text-discord-muted leading-relaxed">
                Discuss who seemed suspicious. Count to 3 and vote together to eliminate who you suspect is the imposter.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-discord-surface-onyx/80 border border-white/10 flex gap-3.5 items-start">
            <span className="w-7 h-7 rounded-lg bg-discord-green text-black font-black text-xs flex items-center justify-center shrink-0">
              4
            </span>
            <div className="space-y-1">
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase font-discord-headline">
                Win or Hijack
              </h3>
              <p className="text-xs text-discord-muted leading-relaxed">
                Civilians win by voting out imposters. If Mr. Black is eliminated, they get a final chance to guess the secret word.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Roles & Strategy Section */}
      <section className="max-w-4xl mx-auto px-4 space-y-4 sm:space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-bold text-discord-magenta uppercase tracking-widest font-discord-headline">
            Master the Bluff
          </span>
          <h2 className="text-xl sm:text-3xl font-bold font-discord-headline text-white uppercase">
            THE 3 ROLES &amp; STRATEGY GUIDE
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
      </section>

      {/* 5. Word Packs Spotlight */}
      <section className="max-w-4xl mx-auto px-4 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5 text-center sm:text-left">
            <span className="text-[11px] font-bold text-discord-link uppercase tracking-widest font-discord-headline">
              Curated Content
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-discord-headline text-white uppercase">
              DESI WORD PACKS READY TO PLAY
            </h2>
          </div>
          <Link
            href="/words"
            className="text-xs font-bold text-discord-link hover:underline flex items-center justify-center gap-1 uppercase tracking-wider"
          >
            <span>View All 250+ Word Pairs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {BUILT_IN_PACKS.slice(0, 4).map((pack) => (
            <div
              key={pack.id}
              className="p-3.5 sm:p-4 rounded-xl bg-discord-surface-onyx/90 border border-white/10 hover:border-discord-primary/40 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] sm:text-[10px] font-bold text-discord-muted uppercase">
                    {pack.category}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-discord-green font-bold">
                    {pack.pairs.length} Pairs
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase font-discord-headline">
                  {pack.name}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-discord-muted line-clamp-2 leading-relaxed font-normal">
                  {pack.description}
                </p>
              </div>

              <Link
                href={`/play?pack=${pack.id}`}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-discord-surface-indigo hover:bg-discord-green hover:text-black text-discord-green border border-discord-green/30 text-xs font-bold transition-all"
              >
                <Play className="w-3 h-3 fill-current stroke-none" />
                <span>Play Pack</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ Accordion */}
      <section className="max-w-3xl mx-auto px-4 space-y-4 sm:space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-bold text-discord-green uppercase tracking-widest font-discord-headline">
            Frequently Asked Questions
          </span>
          <h2 className="text-xl sm:text-3xl font-bold font-discord-headline text-white uppercase">
            EVERYTHING YOU NEED TO KNOW
          </h2>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-discord-surface-indigo/70 border border-white/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-4 sm:px-5 py-3.5 sm:py-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-discord-link transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-discord-muted transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 text-xs text-discord-muted leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Bottom CTA Banner */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="p-6 sm:p-10 rounded-xl bg-gradient-to-br from-discord-surface-indigo via-discord-surface-darker to-discord-surface-onyx border border-white/15 text-center space-y-4 sm:space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-1.5 max-w-xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-black font-discord-headline text-white uppercase tracking-tight">
              READY FOR YOUR NEXT GAME NIGHT?
            </h2>
            <p className="text-xs sm:text-sm text-discord-muted font-medium">
              Start playing in 5 seconds. No downloads, no passwords, no hassle.
            </p>
          </div>

          <div className="flex justify-center">
            <Link
              href="/play"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 rounded-xl bg-discord-green hover:bg-discord-green-hover text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-float transition-all transform hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-black stroke-none" />
              <span>START PLAYING NOW</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
