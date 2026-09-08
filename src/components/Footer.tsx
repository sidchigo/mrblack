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

          {/* Column 4: Project & Community */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-bold text-white uppercase tracking-wider font-discord-headline">
              About &amp; Project
            </div>
            <ul className="space-y-2 text-discord-muted">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Mr. Black
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/sidchigo/mrblack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-discord-link transition-colors inline-flex items-center gap-1"
                >
                  <span>GitHub Repository</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">v1.0</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/sidchigo/mrblack/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Contribute Word Packs
                </a>
              </li>
              <li>
                <span className="text-white/80">100% Free &amp; Offline Ready</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-discord-muted">
          <div>
            &copy; {new Date().getFullYear()} Mr. Black. Inspired by Undercover &amp; Mr. White social deduction party games.
          </div>
          <div className="flex items-center gap-4 text-white/80 font-medium">
            <a
              href="https://github.com/sidchigo/mrblack"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white text-discord-muted transition-colors flex items-center gap-1.5"
            >
              <span>GitHub</span>
            </a>
            <span>•</span>
            <span>Made with ❤️ for Game nights &amp; days 😏</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
