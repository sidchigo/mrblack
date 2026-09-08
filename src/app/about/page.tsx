import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  Heart,
  Smartphone,
  WifiOff,
  Code2,
  Play,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export const metadata: Metadata = {
  title: 'About Mr. Black — Free Open Source Desi Social Deduction Game',
  description:
    'Learn about Mr. Black, the free open-source party game inspired by Undercover & Mr. White. Discover our story, tech stack, community pack contributions, and GitHub repository.',
  keywords: [
    'about mr black',
    'mr black github',
    'undercover game open source',
    'desi party game github',
    'free social deduction game online',
    'mr white alternative open source',
  ],
  alternates: {
    canonical: 'https://playmrblack.vercel.app/about',
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10 sm:space-y-14 font-sans">
      {/* 1. Hero Header */}
      <section className="text-center space-y-3 sm:space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-discord-primary/15 text-discord-link border border-discord-primary/30">
          <Heart className="w-3.5 h-3.5 text-discord-magenta fill-discord-magenta" />
          <span>Free, Open Source &amp; Community Driven</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-discord-headline text-white uppercase tracking-tight">
          ABOUT <span className="text-discord-primary">MR. BLACK</span>
        </h1>
        <p className="text-sm sm:text-base text-discord-muted font-medium leading-relaxed">
          The desi party game created to bring friends, families, and teams together for instant laughter, intense bluffing, and unforgettable detective moments.
        </p>
      </section>

      {/* 2. The Story / Mission */}
      <section className="p-6 sm:p-8 rounded-2xl bg-discord-surface-indigo/80 border border-white/10 shadow-card space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold font-discord-headline text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-discord-yellow" />
          <span>Our Story &amp; Mission</span>
        </h2>
        <p className="text-sm sm:text-base text-discord-muted leading-relaxed">
          Popular social deduction games like <strong className="text-white">Undercover</strong> and <strong className="text-white">Mr. White</strong> are global party classics, but existing mobile apps are often cluttered with paywalls, invasive ads, or locked word packs.
        </p>
        <p className="text-sm sm:text-base text-discord-muted leading-relaxed">
          <strong className="text-white">Mr. Black</strong> was built to offer a completely free, fast, and sleek alternative packed with rich <strong className="text-discord-yellow">Desi Indian cultural themes</strong>—from Bollywood villains and chai-samosa debates to cricket rivalries and shaadi traditions.
        </p>
      </section>

      {/* 3. Core Pillars */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-discord-surface-darker/90 border border-white/10 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-discord-green/20 text-discord-green flex items-center justify-center font-bold">
            <Smartphone className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base font-discord-headline">100% Pass &amp; Play</h3>
          <p className="text-xs sm:text-sm text-discord-muted leading-relaxed">
            No accounts, no downloads required, and no room codes to coordinate. Just pass one phone around your circle.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-discord-surface-darker/90 border border-white/10 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-discord-magenta/20 text-discord-magenta flex items-center justify-center font-bold">
            <WifiOff className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base font-discord-headline">Offline Ready (PWA)</h3>
          <p className="text-xs sm:text-sm text-discord-muted leading-relaxed">
            Install as a PWA on iOS or Android. Works completely offline during road trips, flights, and remote getaways.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-discord-surface-darker/90 border border-white/10 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-discord-primary/20 text-discord-link flex items-center justify-center font-bold">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base font-discord-headline">Open Source</h3>
          <p className="text-xs sm:text-sm text-discord-muted leading-relaxed">
            Community-driven word packs and transparent codebase. Anyone can contribute word pairs and new themes.
          </p>
        </div>
      </section>

      {/* 4. GitHub & Community Contributions Box */}
      <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-discord-surface-indigo/90 via-discord-surface-darker to-[#1e1f2f] border border-discord-primary/30 shadow-float space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-discord-green uppercase tracking-wider">
              <GithubIcon className="w-4 h-4" />
              <span>GitHub Repository</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-discord-headline text-white">
              Contribute on GitHub
            </h2>
            <p className="text-xs sm:text-sm text-discord-muted max-w-lg">
              Mr. Black is open source on GitHub. Star the repository, report issues, submit new curated word packs, or suggest game mechanics.
            </p>
          </div>

          <a
            href="https://github.com/sidchigo/mrblack"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-black font-extrabold text-sm uppercase tracking-wider hover:bg-white/90 shadow-float transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <GithubIcon className="w-4 h-4 fill-current stroke-none" />
            <span>View on GitHub</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </a>
        </div>

        {/* Tech Stack Pills */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs text-discord-muted">
          <span className="font-semibold text-white">Built with:</span>
          <span className="px-2.5 py-1 rounded-md bg-white/10 text-white font-mono text-[11px]">Next.js 14</span>
          <span className="px-2.5 py-1 rounded-md bg-white/10 text-white font-mono text-[11px]">React &amp; TypeScript</span>
          <span className="px-2.5 py-1 rounded-md bg-white/10 text-white font-mono text-[11px]">Tailwind CSS</span>
          <span className="px-2.5 py-1 rounded-md bg-white/10 text-white font-mono text-[11px]">Lucide Icons</span>
          <span className="px-2.5 py-1 rounded-md bg-white/10 text-white font-mono text-[11px]">Upstash Redis</span>
        </div>
      </section>

      {/* 5. CTAs */}
      <section className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/play"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 rounded-xl bg-discord-green hover:bg-discord-green-hover text-black font-extrabold text-sm sm:text-base uppercase tracking-wider shadow-float transition-all transform hover:scale-105 active:scale-95"
        >
          <Play className="w-4 h-4 fill-black stroke-none" />
          <span>Play Instant Game</span>
        </Link>
        <Link
          href="/how-to-play"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs sm:text-sm tracking-wide transition-all"
        >
          <BookOpen className="w-4 h-4 text-discord-magenta" />
          <span>How to Play &amp; Rules</span>
        </Link>
      </section>
    </div>
  );
}
