'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  // Hide footer on play screens (/play) for focus and zero distractions
  if (pathname.startsWith('/play')) {
    return null;
  }

  return (
    <footer className="border-t border-white/10 bg-discord-surface-darker/95 backdrop-blur-md pt-10 pb-8 px-4 text-white text-xs font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Column 1: Brand & Tagline */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="Mr. Black Logo"
                className="w-7 h-7 object-contain drop-shadow"
              />
              <span className="font-extrabold font-discord-headline tracking-wider text-base text-white uppercase">
                MR. BLACK
              </span>
            </Link>
            <p className="text-discord-muted text-xs leading-relaxed max-w-xs">
              The premier desi social deduction party game. Pass one phone around, give one-line clues, unmask the Undercover, or hijack the win as Mr. Black.
            </p>
          </div>

          {/* Column 2: Game & Play */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-bold text-white uppercase tracking-wider font-discord-headline">
              Game
            </div>
            <ul className="space-y-2 text-discord-muted">
              <li>
                <Link href="/play" className="hover:text-discord-green transition-colors font-semibold text-white">
                  Play Now (Instant)
                </Link>
              </li>
              <li>
                <Link href="/how-to-play" className="hover:text-white transition-colors">
                  How to Play &amp; Rules
                </Link>
              </li>
              <li>
                <Link href="/words" className="hover:text-white transition-colors">
                  Word Bank &amp; Lists
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Word Packs */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-bold text-white uppercase tracking-wider font-discord-headline">
              Word Packs
            </div>
            <ul className="space-y-2 text-discord-muted">
              <li>
                <Link href="/words" className="hover:text-white transition-colors">
                  Browse All Word Pairs
                </Link>
              </li>
              <li>
                <Link href="/words?category=Food" className="hover:text-white transition-colors">
                  Desi Street Food Pack
                </Link>
              </li>
              <li>
                <Link href="/words?category=Entertainment" className="hover:text-white transition-colors">
                  Bollywood &amp; Movies Pack
                </Link>
              </li>
              <li>
                <Link href="/words?category=Sports" className="hover:text-white transition-colors">
                  Cricket &amp; IPL Pack
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Details */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-bold text-white uppercase tracking-wider font-discord-headline">
              Features
            </div>
            <ul className="space-y-2 text-discord-muted">
              <li className="text-white/80">No sign up or account</li>
              <li className="text-white/80">1 Phone Pass &amp; Play</li>
              <li className="text-white/80">100% Free &amp; Offline Ready</li>
              <li className="text-white/80">AI Custom Pack Generator</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-discord-muted">
          <div>
            &copy; {new Date().getFullYear()} Mr. Black. Inspired by Undercover &amp; Mr. White social deduction party games.
          </div>
          <div className="flex items-center gap-1 text-white/80 font-medium">
            <span>Made with ❤️ for Game nights &amp; days 😏</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
