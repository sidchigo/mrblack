'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Play, BookOpen, Layers, Menu, X } from 'lucide-react';
import { InstallPwaButton } from '@/components/InstallPwaButton';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { href: '/play', label: 'Play Game', icon: Play, highlight: true },
    { href: '/how-to-play', label: 'How to Play', icon: BookOpen },
    { href: '/words', label: 'Word Lists', icon: Layers },
  ];

  return (
    <header className="border-b border-white/10 bg-discord-surface-indigo/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform active:scale-95"
        >
          <img
            src="/logo.png"
            alt="Mr. Black Game Logo"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
          />
          <span className="font-extrabold font-discord-headline tracking-wider text-xl sm:text-2xl text-white uppercase leading-none">
            MR. BLACK
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <nav className="flex items-center gap-1.5 font-medium text-xs">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              if (link.highlight) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold bg-discord-green hover:bg-discord-green-hover text-black uppercase tracking-wider transition-all shadow-float hover:scale-105 active:scale-95"
                  >
                    <Icon className="w-3.5 h-3.5 fill-current stroke-none" />
                    <span>{link.label}</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                    isActive
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-discord-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
          <InstallPwaButton />
        </div>

        {/* Mobile menu & Quick Action: Clean, uncrowded header */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/play"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs bg-discord-green text-black uppercase tracking-wide shadow-float"
          >
            <Play className="w-3.5 h-3.5 fill-current stroke-none" />
            <span>Play</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-discord-surface-darker/95 backdrop-blur-xl px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  link.highlight
                    ? 'bg-discord-green text-black'
                    : isActive
                    ? 'bg-white/15 text-white'
                    : 'text-discord-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${link.highlight ? 'fill-current stroke-none' : ''}`} />
                  <span>{link.label}</span>
                </div>
              </Link>
            );
          })}

          {/* Clean PWA Install Button inside Mobile Menu */}
          <div className="pt-2 border-t border-white/10">
            <InstallPwaButton isDrawer />
          </div>
        </div>
      )}
    </header>
  );
}
